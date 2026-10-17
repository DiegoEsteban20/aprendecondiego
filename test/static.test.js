import test from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readFile, readdir } from 'node:fs/promises';
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
  for (const filename of ['index.html', 'lab.html', 'guide.html', 'academy.html', 'visuals.html', 'learn.html', 'demo.html', 'layout-check.html']) {
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
  assert.ok(!worker.includes('./demo.mp4'));
});

test('all built HTML resources and relative links resolve to packaged files', async () => {
  const root = new URL('../docs/', import.meta.url);
  const filenames = await readdir(root);
  for (const filename of filenames.filter(name => name.endsWith('.html'))) {
    const page = new URL(filename, root);
    const html = await readFile(page, 'utf8');
    for (const [, target] of html.matchAll(/\b(?:href|src)="([^"]+)"/g)) {
      if (/^(?:https?:|mailto:|#)/.test(target)) continue;
      const resource = new URL(target, page); resource.hash = ''; resource.search = '';
      await assert.doesNotReject(readFile(resource), `${filename} → ${target}`);
    }
  }
});

test('demo is self-hosted, captioned, manual and copied without binary corruption', async () => {
  const root = new URL('../docs/', import.meta.url);
  const html = await readFile(new URL('demo.html', root), 'utf8');
  assert.ok(html.includes('controls preload="none"'));
  assert.ok(html.includes('kind="captions"'));
  assert.ok(!html.includes('autoplay'));
  assert.ok(html.includes('Transcripción'));
  const video = await readFile(new URL('demo.mp4', root));
  assert.equal(video.subarray(4, 8).toString(), 'ftyp');
  assert.deepEqual(video, await readFile(new URL('../public/demo.mp4', import.meta.url)));
  const navigation = await readFile(new URL('experience.js', root), 'utf8');
  for (const filename of ['index.html', 'academy.html', 'visuals.html', 'learn.html', 'guide.html', 'demo.html']) assert.ok(navigation.includes(filename));
  assert.ok(navigation.includes('Saltar al contenido'));
});
