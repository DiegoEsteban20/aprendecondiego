import test from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readFile } from 'node:fs/promises';
import { isIP } from 'node:net';
import { analyze } from '../lib/analyzer.js';
import { cases } from '../lib/cases.js';

test('portable IPv4 matching keeps strict dotted-decimal behavior', () => {
  for (const query of ['10.20.0.10', '010.20.0.10', '10.20.0.256', '999.20.0.10', '10.20.0.10 ']) {
    const expected = isIP(query.trim()) === 4 && query.trim() === '10.20.0.10';
    assert.equal(analyze(cases[0].config, query).search.objects.some(object => object.name === 'WEB_SERVER'), expected);
  }
});

test('static build works in a repository subpath without a backend', async () => {
  execFileSync(process.execPath, ['scripts/build-static.js'], { cwd: new URL('../', import.meta.url) });
  const root = new URL('../docs/', import.meta.url);
  for (const filename of ['index.html', 'guide.html', 'academy.html', 'visuals.html', 'learn.html']) {
    const html = await readFile(new URL(filename, root), 'utf8');
    assert.ok(!/\b(?:href|src)="\/(?!\/)/.test(html));
    assert.ok(html.includes('./offline.js'));
    assert.ok(html.includes('Content-Security-Policy'));
  }
  const client = await readFile(new URL('app.js', root), 'utf8');
  assert.ok(!client.includes('fetch('));
  assert.ok(client.includes('./academy.html#lesson-'));
  assert.ok(!(await readFile(new URL('analyzer.js', root), 'utf8')).includes('node:'));
  const worker = await readFile(new URL('sw.js', root), 'utf8');
  assert.ok(worker.includes("event.request.method !== 'GET'"));
  assert.ok(worker.includes('resourceURLs.has'));
});
