import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { pathway } from '../public/learn-data.js';
import { lessons } from '../public/academy-data.js';

test('beginner homepage links to real lessons and preserves the full lab', async () => {
  const home = await readFile(new URL('../public/index.html', import.meta.url), 'utf8');
  for (const [, id] of home.matchAll(/#lesson-([a-z0-9-]+)/g)) assert.ok(lessons.some(lesson => lesson.id === id));
  for (const module of pathway) assert.ok(lessons.some(lesson => lesson.id === module.lesson));
  assert.ok(home.includes('Empieza aquí'));
  assert.ok(home.includes('./lab.html'));
  const lab = await readFile(new URL('../public/lab.html', import.meta.url), 'utf8');
  for (const id of ['config', 'policy-table', 'compare', 'print-report', 'cases', 'graph']) assert.ok(lab.includes('id="' + id + '"'));
});
