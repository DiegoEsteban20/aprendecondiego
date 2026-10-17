import test from 'node:test';
import assert from 'node:assert/strict';
import { pathway, traces, incidents, vendorRows, academyReasons, extraQuestions, describePolicy, validateProgress } from '../public/learn-data.js';
import { lessons, questions } from '../public/academy-data.js';

test('learning pathway links to existing lessons and validates portable progress', () => {
  assert.equal(pathway.length, 8);
  for (const module of pathway) assert.ok(lessons.some(lesson => lesson.id === module.lesson), module.lesson);
  assert.deepEqual(validateProgress({ version: 1, completed: ['basics', 'basics'] }), { version: 1, completed: ['basics'] });
  for (const invalid of [null, {}, { version: 2, completed: [] }, { version: 1, completed: ['unknown'] }, { version: 1, completed: 'basics' }]) assert.throws(() => validateProgress(invalid));
});
test('educational policy builder distinguishes broad permissions from denial', () => {
  assert.equal(describePolicy({ source: 'any', destination: 'any', service: 'any', action: 'allow' }).broad, 3);
  assert.match(describePolicy({ source: 'any', destination: 'any', service: 'any', action: 'deny' }).message, /denegar/);
  assert.equal(describePolicy({ source: 'lan', destination: 'web', service: 'https', action: 'allow' }).broad, 0);
});
test('traces, evidence cases and practice questions carry complete explanations', () => {
  assert.equal(traces.length, 3);
  for (const trace of traces) for (const packet of trace.packets) assert.ok(packet.explanation && packet.fields.length && packet.source && packet.destination);
  assert.equal(incidents.length, 4);
  for (const incident of incidents) assert.ok(incident.options[incident.correct] && incident.evidence.length === 3 && incident.next);
  assert.equal(vendorRows.length, 9);
  assert.equal(questions.length + extraQuestions.length, 18);
  assert.equal(questions.length, academyReasons.length);
  questions.forEach((question, index) => assert.equal(question.options.length, academyReasons[index].length));
  for (const question of extraQuestions) { assert.equal(question.options.length, question.reasons.length); assert.ok(question.options[question.correct]); }
});
