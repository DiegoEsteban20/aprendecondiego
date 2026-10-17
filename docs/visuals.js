import './experience.js';
import { tcpSteps, natSessions, flows, devices, osiLayers } from './visuals-data.js';

const element = id => document.getElementById(id);
const escape = value => String(value).replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]);
let tcpStep = 0;
let timer = null;
let returning = false;
let osiStep = 0;

function stop() {
  clearInterval(timer); timer = null;
  element('tcp-play').textContent = '▶ Reproducir';
  element('tcp-play').setAttribute('aria-pressed', 'false');
}
function renderTCP() {
  element('tcp-step-title').textContent = tcpSteps[tcpStep].title;
  element('tcp-step-text').textContent = tcpSteps[tcpStep].text;
  element('tcp-progress').textContent = `Escena ${tcpStep + 1} de ${tcpSteps.length}`;
  element('tcp-prev').disabled = tcpStep === 0;
  element('tcp-next').disabled = tcpStep === tcpSteps.length - 1;
  ['tcp-syn', 'tcp-synack', 'tcp-ack'].forEach((id, index) => {
    element(id).classList.toggle('active', tcpStep === index + 1 || tcpStep === 4);
    element(id).classList.toggle('complete', tcpStep > index + 1);
  });
}
element('tcp-next').addEventListener('click', () => { stop(); tcpStep = Math.min(tcpStep + 1, tcpSteps.length - 1); renderTCP(); });
element('tcp-prev').addEventListener('click', () => { stop(); tcpStep = Math.max(tcpStep - 1, 0); renderTCP(); });
element('tcp-reset').addEventListener('click', () => { stop(); tcpStep = 0; renderTCP(); });
element('tcp-play').addEventListener('click', () => {
  if (document.documentElement.dataset.motion === 'off') { stop(); element('tcp-progress').textContent = 'Animación automática desactivada. Usa los botones de paso o habilítala en Lectura y accesibilidad.'; return; }
  if (timer) { stop(); return; }
  if (tcpStep === tcpSteps.length - 1) tcpStep = 0;
  element('tcp-play').textContent = 'Ⅱ Pausar'; element('tcp-play').setAttribute('aria-pressed', 'true'); renderTCP();
  timer = setInterval(() => { tcpStep++; renderTCP(); if (tcpStep === tcpSteps.length - 1) stop(); }, 3500);
});
document.addEventListener('visibilitychange', () => { if (document.hidden) stop(); });
window.addEventListener('reading-settings', event => { if (!event.detail.motion) stop(); });

function renderNAT() {
  const selected = Number(element('nat-client').value);
  const session = natSessions[selected];
  element('nat-private').textContent = session.client;
  element('nat-public').textContent = session.translated;
  element('nat-target').textContent = session.destination;
  document.querySelectorAll('.flow-arrow').forEach(arrow => { arrow.textContent = returning ? '←' : '→'; });
  element('nat-direction').setAttribute('aria-pressed', String(returning));
  element('nat-direction').textContent = returning ? 'Mostrar salida del cliente' : 'Mostrar respuesta de retorno';
  element('nat-title').textContent = returning ? 'Retorno · la tabla identifica al cliente' : 'Salida · se traduce el origen';
  element('nat-text').textContent = returning ? `La respuesta hacia ${session.translated} se asocia en esta tabla a ${session.client}. Se conserva el contexto de la conversación; no se entrega a todos los clientes que comparten la IP pública.` : `${session.client} sale como ${session.translated} hacia ${session.destination}. Los tres clientes comparten una IP de salida ficticia, pero aquí reciben puertos traducidos distintos.`;
  element('nat-table').innerHTML = natSessions.map((item, index) => `<tr ${index === selected ? 'class="selected-row"' : ''}><td>${escape(item.client)}${index === selected ? ' · seleccionado' : ''}</td><td>${escape(item.translated)}</td><td>${escape(item.destination)}</td></tr>`).join('');
}
element('nat-client').addEventListener('change', renderNAT);
element('nat-direction').addEventListener('click', () => { returning = !returning; renderNAT(); });

element('flow-choice').innerHTML = flows.map(flow => `<option value="${flow.id}">${escape(flow.label)}</option>`).join('');
function renderFlow() {
  const flow = flows.find(item => item.id === element('flow-choice').value);
  Object.keys(devices).forEach(id => {
    element(`device-${id}`).classList.toggle('on-route', flow.route.includes(id));
    element(`device-${id}`).classList.toggle('blocked-node', !flow.allowed && id === 'firewall');
    const edge = element(`edge-${id}`);
    if (edge) { edge.classList.toggle('allowed-edge', flow.allowed && flow.route.includes(id)); edge.classList.toggle('blocked-edge', !flow.allowed && flow.route.includes(id)); }
  });
  element('flow-result').textContent = flow.allowed ? 'PERMITIDO · por la matriz ficticia' : 'DENEGADO · por la matriz ficticia';
  element('flow-text').textContent = flow.explanation;
}
element('flow-choice').addEventListener('change', renderFlow);
element('device-buttons').innerHTML = Object.entries(devices).map(([id, device]) => `<button data-device="${id}" aria-pressed="false">${escape(device.title)}</button>`).join('');
element('device-buttons').querySelectorAll('button').forEach(button => button.addEventListener('click', () => {
  element('device-buttons').querySelectorAll('button').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
  const device = devices[button.dataset.device]; element('device-info').innerHTML = `<h3>${escape(device.title)}</h3><p>${escape(device.text)}</p>`;
}));
element('device-info').textContent = 'Selecciona un elemento de la red para conocer su función.';

function renderOSI() {
  element('osi-stack').innerHTML = osiLayers.map(([title], index) => `<button data-layer="${index}" aria-pressed="${index === osiStep}">${escape(title)}<span>${index === osiStep ? '← capa seleccionada' : 'Explorar'}</span></button>`).join('');
  element('osi-title').textContent = osiLayers[osiStep][0]; element('osi-text').textContent = osiLayers[osiStep][1];
  element('osi-stack').querySelectorAll('button').forEach(button => button.addEventListener('click', () => { osiStep = Number(button.dataset.layer); renderOSI(); element('osi-stack').querySelector(`[data-layer="${osiStep}"]`).focus(); }));
}
element('osi-next').addEventListener('click', () => { osiStep = (osiStep + 1) % osiLayers.length; renderOSI(); });
element('osi-reset').addEventListener('click', () => { osiStep = 0; renderOSI(); });
renderTCP(); renderNAT(); renderFlow(); renderOSI();
