import './experience.js';
import { pathway, traces, incidents, vendorRows, academyReasons, extraQuestions, describePolicy, validateProgress } from './learn-data.js';
import { questions } from './academy-data.js';
const element = id => document.getElementById(id);
const escape = value => String(value ?? '').replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]);
const key = 'aprendecondiego-progress-v1';
let progress = { version: 1, completed: [] };
let storageAvailable = true;
try { const saved = localStorage.getItem(key); if (saved) progress = validateProgress(JSON.parse(saved)); } catch { storageAvailable = false; }
let view = 'path';
let traceIndex = 0;
let packetIndex = 0;
let incidentIndex = 0;
const revealed = new Set();
const responses = new Map();
const practiceAnswers = new Map();
let practiceTopic = 'Todos';
const bank = [...questions.map((question, index) => ({ ...question, topic: 'Repaso de academia', reasons: academyReasons[index] })), ...extraQuestions];
function save() {
  try { localStorage.setItem(key, JSON.stringify(progress)); element('workshop-status').textContent = 'Progreso guardado sólo en este navegador. Exporta una copia: borrar datos del navegador puede eliminarlo.'; } catch { storageAvailable = false; element('workshop-status').textContent = 'No se pudo guardar en este navegador. El progreso actual sigue en memoria; expórtalo para conservarlo.'; }
}
function download(name, data) { const url = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })); const anchor = document.createElement('a'); anchor.href = url; anchor.download = name; anchor.click(); setTimeout(() => URL.revokeObjectURL(url), 1000); }
function render() {
  element('workshop-tabs').querySelectorAll('button').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.view === view)));
  element('workshop-status').textContent = storageAvailable ? 'Sin cuenta. Sólo se guarda el progreso marcado; respuestas y evidencias abiertas permanecen en memoria.' : 'Almacenamiento local no disponible o archivo previo incompatible. Usa exportar para conservar el progreso de esta sesión.';
  if (view === 'path') renderPath();
  if (view === 'packets') renderPackets();
  if (view === 'builder') renderBuilder();
  if (view === 'incidents') renderIncidents();
  if (view === 'vendors') renderVendors();
  if (view === 'practice') renderPractice();
}
function renderPath() {
  element('workshop-content').innerHTML = `<section class="panel"><div class="panel-head"><h2>Tu recorrido · ${progress.completed.length} de ${pathway.length} módulos</h2><button id="export-progress">Exportar progreso</button></div><progress max="${pathway.length}" value="${progress.completed.length}" aria-label="Módulos marcados como completados"></progress><p class="footnote">Marca lo que hayas estudiado. Es una autoevaluación, no una certificación. Importar sustituye las marcas actuales por las del archivo.</p><label class="file-button">Importar progreso<input type="file" id="import-progress" accept=".json" hidden></label><button id="clear-progress">Borrar mis marcas</button><div id="clear-confirm" hidden><p>¿Borrar las marcas de este navegador? Puedes exportar una copia antes.</p><button id="confirm-clear">Sí, borrar marcas</button><button id="cancel-clear">Conservarlas</button></div></section><div class="path-grid">${pathway.map(module => `<section class="panel"><h2>${escape(module.title)}</h2><p>${escape(module.text)}</p><a href="./academy.html#lesson-${module.lesson}">Estudiar ↗</a><label class="completion"><input type="checkbox" data-module="${module.id}" ${progress.completed.includes(module.id) ? 'checked' : ''}> Lo estudié y puedo explicarlo</label></section>`).join('')}</div>`;
  element('export-progress').addEventListener('click', () => download('aprendecondiego-progreso.json', progress));
  element('import-progress').addEventListener('change', async event => { try { const file = event.target.files[0]; if (!file) return; if (file.size > 64000) throw new Error('Máximo 64 KB.'); const imported = validateProgress(JSON.parse(await file.text())); progress = imported; renderPath(); save(); } catch (error) { element('workshop-status').textContent = `No se importó: ${error.message}`; } });
  element('clear-progress').addEventListener('click', () => { element('clear-confirm').hidden = false; });
  element('cancel-clear').addEventListener('click', () => { element('clear-confirm').hidden = true; });
  element('confirm-clear').addEventListener('click', () => { progress.completed = []; renderPath(); save(); });
  element('workshop-content').querySelectorAll('[data-module]').forEach(input => input.addEventListener('change', () => { progress.completed = input.checked ? [...new Set([...progress.completed, input.dataset.module])] : progress.completed.filter(id => id !== input.dataset.module); renderPath(); save(); }));
}
function renderPackets() {
  const trace = traces[traceIndex]; const packet = trace.packets[packetIndex];
  element('workshop-content').innerHTML = `<section class="panel"><h2>Una traza, paquete a paquete</h2><label for="trace-choice">Escenario</label><select id="trace-choice">${traces.map((item, index) => `<option value="${index}" ${index === traceIndex ? 'selected' : ''}>${escape(item.title)}</option>`).join('')}</select><p class="footnote">${escape(trace.context)} No es un lector de PCAP ni una captura en vivo.</p><div class="table-wrap"><table><thead><tr><th>Paquete / tiempo</th><th>Origen → destino</th><th>Protocolo</th><th>Resumen</th></tr></thead><tbody>${trace.packets.map((item, index) => `<tr class="${index === packetIndex ? 'selected-packet' : ''}"><td><button data-packet="${index}" aria-pressed="${index === packetIndex}">#${index + 1} · ${item.time}s</button></td><td>${escape(item.source)} → ${escape(item.destination)}</td><td>${escape(item.protocol)}</td><td>${escape(item.info)}</td></tr>`).join('')}</tbody></table></div><div class="lesson-explanation" aria-live="polite"><h3>Paquete #${packetIndex + 1} · ${escape(packet.info)}</h3><p>${escape(packet.explanation)}</p><dl>${packet.fields.map(([field, value]) => `<dt>${escape(field)}</dt><dd>${escape(value)}</dd>`).join('')}</dl></div><a href="./visuals.html#tcp">Ver animaciones relacionadas ↗</a></section>`;
  element('trace-choice').addEventListener('change', event => { traceIndex = Number(event.target.value); packetIndex = 0; renderPackets(); });
  element('workshop-content').querySelectorAll('[data-packet]').forEach(button => button.addEventListener('click', () => { packetIndex = Number(button.dataset.packet); renderPackets(); }));
}
function renderBuilder() {
  element('workshop-content').innerHTML = `<section class="panel"><h2>Diseña la intención de un permiso</h2><p class="footnote">Este constructor no genera configuración lista para producción ni decide la coincidencia de un paquete real.</p><div class="builder-grid">${[['source','Origen',[['lan','LAN'],['wan','WAN'],['any','Cualquiera']]],['destination','Destino',[['web','Servidor web DMZ'],['lan','LAN'],['any','Cualquiera']]],['service','Servicio',[['https','TCP/443 · HTTPS convencional'],['ssh','TCP/22 · SSH'],['any','Todos los servicios del ejemplo']]],['action','Acción',[['allow','Permitir'],['deny','Denegar']]]].map(([id, label, options]) => `<div><label for="policy-${id}">${label}</label><select id="policy-${id}">${options.map(([value,text]) => `<option value="${value}">${text}</option>`).join('')}</select></div>`).join('')}</div><div id="policy-preview" class="lesson-explanation" aria-live="polite"></div><button id="export-intent">Exportar intención JSON</button><p class="footnote">El archivo sólo describe selecciones educativas. No se envía a un firewall. Un permiso acotado también puede ser incorrecto para una necesidad concreta.</p></section>`;
  const current = () => describePolicy(Object.fromEntries(['source','destination','service','action'].map(field => [field, element(`policy-${field}`).value])));
  const update = () => { const policy = current(); element('policy-preview').innerHTML = `<div class="policy-flow"><b>${escape(element('policy-source').selectedOptions[0].text)}</b><span>→ ${policy.action === 'allow' ? 'PERMITIR' : 'DENEGAR'} →</span><b>${escape(element('policy-destination').selectedOptions[0].text)}</b></div><p>${escape(element('policy-service').selectedOptions[0].text)} · ${policy.broad} dimensiones amplias</p><p>${escape(policy.message)}</p>`; };
  element('workshop-content').querySelectorAll('select').forEach(select => select.addEventListener('change', update));
  element('export-intent').addEventListener('click', () => download('intencion-politica-educativa.json', { educational: true, ...current() })); update();
}
function renderIncidents() {
  const incident = incidents[incidentIndex]; const answer = responses.get(incident.id);
  element('workshop-content').innerHTML = `<section class="panel"><h2>Investiga sin cambiar todo a la vez</h2><label for="incident-choice">Caso</label><select id="incident-choice">${incidents.map((item,index) => `<option value="${index}" ${index === incidentIndex ? 'selected' : ''}>${escape(item.title)}</option>`).join('')}</select><p>${escape(incident.symptom)}</p><p class="footnote">Caso sintético. Abre las evidencias y elige la hipótesis que tiene mejor respaldo.</p><div class="evidence-grid">${incident.evidence.map(([title,text],index) => `<button data-evidence="${index}" aria-expanded="${revealed.has(`${incident.id}-${index}`)}"><b>${escape(title)}</b><span>${revealed.has(`${incident.id}-${index}`) ? escape(text) : 'Abrir evidencia'}</span></button>`).join('')}</div><h3>¿Qué investigarías primero?</h3><div class="answer-list">${incident.options.map((option,index) => `<button data-incident-answer="${index}" aria-pressed="${answer === index}">${escape(option)}</button>`).join('')}</div>${answer !== undefined ? `<div class="lesson-explanation" role="status"><h3>${answer === incident.correct ? 'Hipótesis mejor respaldada' : 'Revisa la evidencia'}</h3><p>${escape(incident.explanation)}</p><p><b>Siguiente paso:</b> ${escape(incident.next)}</p></div>` : ''}</section>`;
  element('incident-choice').addEventListener('change', event => { incidentIndex = Number(event.target.value); renderIncidents(); });
  element('workshop-content').querySelectorAll('[data-evidence]').forEach(button => button.addEventListener('click', () => { revealed.add(`${incident.id}-${button.dataset.evidence}`); renderIncidents(); }));
  element('workshop-content').querySelectorAll('[data-incident-answer]').forEach(button => button.addEventListener('click', () => { responses.set(incident.id, Number(button.dataset.incidentAnswer)); renderIncidents(); }));
}
function renderVendors() {
  element('workshop-content').innerHTML = `<section class="panel"><h2>La misma necesidad, implementaciones diferentes</h2><p class="footnote">Mapa conceptual de estudio, no conversor ni lista de prestaciones garantizadas para cualquier versión o licencia.</p><div class="table-wrap"><table><thead><tr><th>Concepto</th><th>Fortinet</th><th>Palo Alto</th><th>Qué validar</th></tr></thead><tbody>${vendorRows.map(row => `<tr>${row.map(value => `<td>${escape(value)}</td>`).join('')}</tr>`).join('')}</tbody></table></div><div class="lesson-explanation"><h3>Ejemplo de intención: publicar una web</h3><p>Describe origen externo, destino público original, servidor traducido, zonas, TCP/443, inspecciones, logging y prueba de retorno. Después representa esa intención con la semántica del equipo concreto.</p><p>PAN-OS se explica como teoría; el analizador existente mantiene su soporte parcial de FortiOS.</p></div><a href="./academy.html#lesson-equivalencias">Ampliar conceptos ↗</a></section>`;
}
function renderPractice() {
  const filtered = bank.map((question,index) => ({ ...question,index })).filter(question => practiceTopic === 'Todos' || question.topic === practiceTopic);
  element('workshop-content').innerHTML = `<section class="panel"><div class="panel-head"><h2>${bank.length} preguntas · incluye las 10 originales</h2><button id="reset-practice">Reiniciar este repaso</button></div><p class="footnote">Se añaden ocho preguntas. Cada alternativa incluye una explicación; no se guardan las respuestas entre recargas.</p><label for="practice-topic">Tema</label><select id="practice-topic">${['Todos',...new Set(bank.map(question => question.topic))].map(topic => `<option ${topic === practiceTopic ? 'selected' : ''}>${escape(topic)}</option>`).join('')}</select><p role="status">${practiceAnswers.size} respondidas en esta sesión · ${[...practiceAnswers].filter(([index, answer]) => bank[index].correct === answer).length} correctas</p></section>${filtered.map(question => `<section class="panel"><small>${escape(question.topic)}</small><h2>${question.index + 1}. ${escape(question.question)}</h2><div class="answer-list">${question.options.map((option,index) => `<button data-question="${question.index}" data-answer="${index}" aria-pressed="${practiceAnswers.get(question.index) === index}">${escape(option)}</button>`).join('')}</div>${practiceAnswers.has(question.index) ? `<div class="lesson-explanation" role="status"><h3>${practiceAnswers.get(question.index) === question.correct ? 'Correcto' : 'Respuesta para revisar'}</h3>${question.options.map((option,index) => `<p><b>${index === question.correct ? '✓ Correcta: ' : ''}${escape(option)}</b><br>${escape(question.reasons[index])}</p>`).join('')}</div>` : ''}</section>`).join('')}`;
  element('practice-topic').addEventListener('change', event => { practiceTopic = event.target.value; renderPractice(); });
  element('reset-practice').addEventListener('click', () => { practiceAnswers.clear(); renderPractice(); });
  element('workshop-content').querySelectorAll('[data-question]').forEach(button => button.addEventListener('click', () => { practiceAnswers.set(Number(button.dataset.question), Number(button.dataset.answer)); renderPractice(); }));
}
element('workshop-tabs').querySelectorAll('button').forEach(button => button.addEventListener('click', () => { view = button.dataset.view; render(); })); render();
