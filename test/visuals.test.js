import test from 'node:test';
import assert from 'node:assert/strict';
import { natSessions, flows, devices, tcpSteps } from '../public/visuals-data.js';

test('PAT illustration distinguishes clients sharing one public IP', () => {
  assert.equal(new Set(natSessions.map(session => session.translated.split(':')[0])).size, 1);
  assert.equal(new Set(natSessions.map(session => session.translated)).size, natSessions.length);
  assert.equal(new Set(natSessions.map(session => session.client)).size, natSessions.length);
});
test('illustration blocks undeclared flows at the firewall', () => {
  for (const flow of flows) {
    assert.equal(flow.allowed, flow.port === 443 && flow.target === 'Servidor web / DMZ');
    assert.ok(flow.route.every(id => devices[id]));
    if (!flow.allowed) assert.equal(flow.route.at(-1), 'firewall');
  }
  assert.deepEqual(tcpSteps.slice(1, 4).map(step => step.direction), ['right', 'left', 'right']);
});
