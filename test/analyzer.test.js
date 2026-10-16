import test from 'node:test';
import assert from 'node:assert/strict';
import { analyze, compare } from '../lib/analyzer.js';
import { cases } from '../lib/cases.js';
import { server } from '../server.js';

test('detects broad permission and missing logging in exposure case', () => {
  const result = analyze(cases[0].config);
  assert.ok(result.findings.some(item => item.code === 'ANY_ANY' && item.rule === '20'));
  assert.ok(result.findings.some(item => item.code === 'LOG_REVIEW' && item.rule === '20'));
  assert.equal(result.summary.rules, 2);
});
test('IP membership traverses groups to referenced policies', () => {
  const result = analyze(cases[0].config, '10.20.0.10');
  assert.deepEqual(result.search.objects.map(item => item.name), ['WEB_SERVER']);
  assert.deepEqual(result.search.groups.map(item => item.name), ['SERVERS']);
  assert.deepEqual(result.search.rules.map(item => item.name), ['10']);
  assert.equal(analyze(cases[0].config, '10.10.10.99').search.objects[0].name, 'LAN_USERS');
  assert.equal(analyze(cases[0].config, '999.10.10.10').search.objects.length, 0);
  assert.equal(analyze(cases[0].config, '10.20.0.1').search.objects.length, 0);
});
test('external-interface heuristic requires a named destination and accept action', () => {
  const config = cases[0].config.replace('set dstaddr "all"', 'set dstaddr "WEB_SERVER"');
  assert.ok(analyze(config).findings.some(item => item.code === 'WAN_REVIEW'));
  assert.ok(!analyze(config.replace('set action accept', 'set action deny').replace('set action accept', 'set action deny')).findings.some(item => item.code === 'WAN_REVIEW'));
});
test('duplicate and missing-reference cases retain source evidence', () => {
  assert.ok(analyze(cases[1].config).findings.some(item => item.code === 'DUPLICATE' && item.line > 0));
  assert.ok(analyze(cases[2].config).findings.some(item => item.code === 'UNRESOLVED' && item.detail.includes('DB_PROD')));
});
test('disabled accept rules do not create active policy findings', () => {
  assert.equal(analyze(cases[0].config.replace('set name "Temporary troubleshooting"', 'set status disable')).findings.length, 0);
});
test('cyclic groups terminate and resolve transitively', () => {
  const config = cases[0].config.replace('set member "WEB_SERVER"', 'set member "WEB_SERVER" "LOOP"').replace('config firewall policy', 'config firewall addrgrp\nedit "LOOP"\nset member "SERVERS"\nnext\nend\nconfig firewall policy');
  assert.equal(analyze(config, '10.20.0.10').search.groups.length, 2);
});
test('comparison retains duplicate-line changes', () => {
  assert.deepEqual(compare('next\nnext', 'next').removed, ['next']);
  assert.deepEqual(compare('a', 'a\nb').added, ['b']);
});
test('rejects unsupported input', () => assert.throws(() => analyze('<config/>'), /compatibles/));
test('rejects nested, incomplete, unsupported and duplicate scopes explicitly', () => {
  assert.throws(() => analyze('config vdom\nedit root'), /no compatible/);
  assert.throws(() => analyze('config firewall address\nedit A\nconfig nested'), /no compatible/);
  assert.throws(() => analyze('config firewall address\nedit A\nend'), /falta next/);
  assert.throws(() => analyze('config firewall address\nedit A\nnext'), /incompleta/);
  assert.throws(() => analyze('config firewall address\nedit A\nnext\nedit A\nnext\nend'), /duplicado/);
});
test('unknown options are warned and excluded from the report model', () => {
  const result = analyze(cases[0].config.replace('set name "Users to web"', 'set name "Users to web"\nset unknown-secret "sensitive-value"'));
  assert.equal(result.warnings.length, 1);
  assert.ok(!JSON.stringify(result).includes('sensitive-value'));
  assert.deepEqual(result.rules[0].label, ['Users to web']);
  assert.equal(result.rules[0].name, '10');
});
test('policy labels are searchable and non-contiguous masks do not match IPv4', () => {
  assert.equal(analyze(cases[0].config, 'Users to web').search.rules[0].name, '10');
  const config = cases[0].config.replace('10.10.10.0 255.255.255.0', '10.10.10.0 255.0.255.0');
  assert.equal(analyze(config, '10.10.10.99').search.objects.length, 0);
});
test('semantic diff identifies field changes and ignores source-line offsets', () => {
  const result = compare(cases[0].config, '\n' + cases[0].config.replace('set service "ALL"', 'set service "HTTPS"'));
  assert.equal(result.semantic.changes.length, 1);
  assert.equal(result.semantic.changes[0].name, '20');
  assert.deepEqual(result.semantic.changes[0].fields, [{ field: 'service', before: ['ALL'], after: ['HTTPS'] }]);
});
test('semantic diff detects reordered common policies, additions and removals', () => {
  const before = 'config firewall policy\nedit 1\nnext\nedit 2\nnext\nend';
  const after = 'config firewall policy\nedit 2\nnext\nedit 1\nnext\nedit 3\nnext\nend';
  const result = compare(before, after);
  assert.equal(result.semantic.orderChanged, true);
  assert.ok(result.semantic.changes.some(change => change.type === 'added' && change.name === '3'));
  assert.ok(compare(after, before).semantic.changes.some(change => change.type === 'removed' && change.name === '3'));
});
test('textual diff remains available for unsupported formats', () => {
  const result = compare('plain', 'different');
  assert.equal(result.semantic, null);
  assert.ok(result.semanticError);
  assert.deepEqual(result.added, ['different']);
});
test('HTTP API serves assets, validates payloads and rejects cross-origin writes', async () => {
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const base = `http://127.0.0.1:${server.address().port}`;
  try {
    assert.equal((await fetch(base)).status, 200);
    assert.equal((await fetch(`${base}/guide`)).status, 200);
    for (const route of ['/academy', '/academy.js', '/academy-data.js', '/academy.css']) {
      const asset = await fetch(`${base}${route}`);
      assert.equal(asset.status, 200);
      assert.match(asset.headers.get('content-security-policy'), /default-src 'self'/);
    }
    assert.equal((await fetch(`${base}/api/health`).then(response => response.json())).version, '0.2.0');
    const response = await fetch(`${base}/api/analyze`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ config: cases[0].config }) });
    assert.equal(response.status, 200);
    assert.equal((await response.json()).summary.rules, 2);
    assert.equal((await fetch(`${base}/api/analyze`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{}' })).status, 400);
    assert.equal((await fetch(`${base}/api/compare`, { method: 'POST', headers: { 'Content-Type': 'application/json', Origin: 'https://example.com' }, body: '{}' })).status, 403);
    assert.equal((await fetch(`${base}/not-found`)).status, 404);
    for (const body of ['null', '[]', '{', '{"config":123}']) assert.equal((await fetch(`${base}/api/analyze`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body })).status, 400);
    assert.equal((await fetch(`${base}/api/analyze`, { method: 'POST', body: '{}' })).status, 415);
    assert.equal((await fetch(`${base}/api/analyze`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ config: 'x'.repeat(1048576) }) })).status, 413);
  } finally { await new Promise(resolve => server.close(resolve)); }
});
