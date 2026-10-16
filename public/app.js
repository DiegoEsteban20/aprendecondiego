import { findingHelp } from './help.js';
import { analyze, compare } from './analyzer.js';
import { cases } from './cases.js';
const element = id => document.getElementById(id);
let activeCase;
let latest;
let requestVersion = 0;
let analyzedText = '';
let severity = 'all';
const escape = value => String(value ?? '').replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]);
async function api(path, body) {
  if (body && new TextEncoder().encode(JSON.stringify(body)).length > 1024 * 1024) throw new Error('Máximo 1 MB por análisis o comparación.');
  if (path === '/api/cases') return cases;
  if (path === '/api/analyze') return analyze(body.config, body.query);
  if (path === '/api/compare') return compare(body.before, body.after);
  throw new Error('Operación local desconocida.');
}
function showError(error) { element('error').textContent = error.message; element('error').hidden = false; }
async function investigate() {
  const version = ++requestVersion;
  const config = element('config').value;
  element('analysis-status').textContent = 'Analizando configuración…';
  element('export').disabled = true;
  try {
    const result = await api('/api/analyze', { config, query: element('query').value });
    if (version !== requestVersion) return;
    latest = result;
    analyzedText = config;
    element('export').disabled = false;
    element('analysis-status').textContent = `Análisis actualizado · ${new Date().toLocaleTimeString('es-CL')} · Sólo campos interpretados`;
    element('error').hidden = true;
    render();
  } catch (error) { if (version === requestVersion) { latest = null; ['stats', 'graph', 'findings', 'relations', 'policy-table', 'search-status', 'universal', 'finding-count'].forEach(id => element(id).replaceChildren()); element('warnings-panel').hidden = true; element('analysis-status').textContent = 'No se pudo analizar. Revisa el archivo y los límites del formato.'; showError(error); } }
}
function render() {
  element('warnings-panel').hidden = !latest.warnings.length;
  element('warning-count').textContent = `(${latest.warnings.length})`;
  element('warnings').innerHTML = latest.warnings.map(warning => `<li>Línea ${warning.line}: ${escape(warning.message)}</li>`).join('');
  element('stats').innerHTML = [['OBJETOS', latest.summary.objects], ['GRUPOS', latest.summary.groups], ['POLÍTICAS', latest.summary.rules], ['HALLAZGOS', latest.summary.findings]].map(([label, value]) => `<div class="stat"><span>${label}</span><strong>${value.toString().padStart(2, '0')}</strong></div>`).join('');
  element('finding-count').textContent = `${latest.findings.length} PARA REVISAR`;
  const visibleFindings = latest.findings.filter(finding => severity === 'all' || finding.severity === severity);
  element('findings').innerHTML = `<label class="footnote" for="severity-filter">Prioridad de revisión</label><select id="severity-filter">${[['all', 'Todas'], ['high', 'Alta'], ['medium', 'Media'], ['low', 'Baja']].map(([value, label]) => `<option value="${value}" ${severity === value ? 'selected' : ''}>${label}</option>`).join('')}</select>` + (visibleFindings.map(finding => {
    const help = findingHelp[finding.code];
    return `<div class="finding"><div class="finding-title"><span class="severity ${escape(finding.severity)}">${escape(finding.severity.toUpperCase())}</span>${escape(finding.title)}</div><p>${escape(finding.detail)}</p><span class="evidence">${finding.rule ? `Referencia ${escape(finding.rule)} · ` : ''}Línea ${finding.line} · ${escape(finding.code)}</span><details><summary>Para qué sirve y qué hacer después</summary><p><b>Qué detecta:</b> ${escape(help.purpose)}</p><p><b>Interpretación:</b> ${escape(help.meaning)}</p><p><b>Siguiente paso:</b> ${escape(help.next)}</p><p><b>Límite:</b> ${escape(help.limitation)}</p><a href="/academy#lesson-${finding.code === 'ANY_ANY' ? 'principios' : finding.code === 'LOG_REVIEW' ? 'soc' : finding.code === 'WAN_REVIEW' ? 'nat' : 'fortinet'}">Estudiar el concepto en la academia ↗</a></details><button class="evidence-button" data-line="${finding.line}">Ver evidencia · línea ${finding.line}</button></div>`;
  }).join('') || '<p class="footnote">Sin hallazgos para este filtro. Esto no certifica que la configuración sea segura.</p>');
  element('severity-filter').addEventListener('change', event => { severity = event.target.value; render(); element('severity-filter').focus(); });
  element('findings').querySelectorAll('[data-line]').forEach(button => button.addEventListener('click', () => {
    if (element('config').value !== analyzedText) return;
    const lines = analyzedText.split('\n');
    const start = lines.slice(0, Number(button.dataset.line) - 1).reduce((total, line) => total + line.length + 1, 0);
    element('config').focus(); element('config').setSelectionRange(start, start + lines[Number(button.dataset.line) - 1].length); element('config').scrollTop = (Number(button.dataset.line) - 3) * 20; element('config').scrollIntoView({ block: 'center', behavior: 'smooth' });
  }));
  const filtered = Boolean(latest.search.query.trim());
  const data = filtered ? latest.search : latest;
  element('search-status').textContent = filtered ? `${data.objects.length} objetos · ${data.groups.length} grupos · ${data.rules.length} políticas relacionadas. No incluye políticas universales por coincidencia implícita.` : 'Vista general · selecciona un objeto para seguir sus referencias.';
  element('graph').innerHTML = [['OBJETOS', data.objects, 'object'], ['GRUPOS', data.groups, 'group'], ['POLÍTICAS', data.rules, 'policy']].map(([title, items, type]) => `<div class="graph-column"><small>${title}</small>${items.map(item => `<button class="node ${type}" data-query="${escape(item.name)}">${escape(item.name)}<small>${escape(type === 'object' ? item.subnet?.join(' / ') || item.type?.[0] || 'Sin subred compatible' : type === 'group' ? item.member?.join(', ') : `${item.srcaddr?.join(', ')} → ${item.dstaddr?.join(', ')}`)}</small></button>`).join('') || '<small>Sin coincidencias</small>'}</div>`).join('<span class="arrow">→</span>');
  element('graph').querySelectorAll('[data-query]').forEach(button => button.addEventListener('click', () => { element('query').value = button.dataset.query; investigate(); }));
  const relations = [...data.groups.flatMap(group => (group.member || []).map(name => [name, 'member', `Grupo ${group.name}`])), ...data.rules.flatMap(rule => ['srcaddr', 'dstaddr'].flatMap(field => (rule[field] || []).map(name => [name, field, `Política ${rule.name}`])))];
  element('relations').innerHTML = relations.map(row => `<tr>${row.map(value => `<td>${escape(value)}</td>`).join('')}</tr>`).join('') || '<tr><td colspan="3">Sin referencias en esta vista.</td></tr>';
  element('universal').textContent = `Contexto universal: políticas que declaran all en origen o destino: ${latest.rules.filter(rule => [...(rule.srcaddr || []), ...(rule.dstaddr || [])].includes('all')).map(rule => rule.name).join(', ') || 'ninguna'}. No se calcula su aplicabilidad al flujo.`;
  element('policy-table').innerHTML = latest.rules.map(rule => `<tr><td>${escape(rule.name)}<small>${escape(rule.label?.join(' ') || 'Sin etiqueta')}</small></td><td>${escape(rule.srcintf?.join(', ') || 'No declarado')} → ${escape(rule.dstintf?.join(', ') || 'No declarado')}</td><td>${escape(rule.srcaddr?.join(', ') || 'No declarado')} → ${escape(rule.dstaddr?.join(', ') || 'No declarado')}</td><td>${escape(rule.service?.join(', ') || 'No declarado')}</td><td>${escape(rule.action?.[0] || 'No declarada')}<small>${rule.status?.[0] === 'disable' ? 'Deshabilitada' : 'Sin disable explícito'}</small></td></tr>`).join('') || '<tr><td colspan="5">Sin políticas.</td></tr>';
}

element('config').addEventListener('input', () => {
  requestVersion++;
  latest = null;
  element('export').disabled = true;
  element('analysis-status').textContent = 'Cambios pendientes. Presiona Analizar para actualizar los resultados.';
  ['stats', 'graph', 'findings', 'relations', 'policy-table', 'search-status', 'universal', 'finding-count', 'semantic-diff', 'diff'].forEach(id => element(id).replaceChildren());
  element('warnings-panel').hidden = true;
});
element('search').addEventListener('submit', event => { event.preventDefault(); investigate(); });
element('analyze').addEventListener('click', investigate);
element('hint').addEventListener('click', () => { element('answer').textContent = activeCase.hint; });
element('solution').addEventListener('click', () => { element('answer').textContent = activeCase.solution; });
element('upload').addEventListener('change', async event => {
  try { const file = event.target.files[0]; if (!file) return; if (file.size > 900000) throw new Error('El archivo debe pesar menos de 900 KB.'); element('config').value = await file.text(); element('case-title').textContent = file.name; element('answer').textContent = ''; element('challenge-description').textContent = 'Archivo propio: las pistas del laboratorio sólo corresponden a los casos originales. Selecciona un caso para volver al modo desafío.'; element('hint').disabled = true; element('solution').disabled = true; await investigate(); } catch (error) { showError(error); }
});
element('export').addEventListener('click', () => {
  if (!latest || analyzedText !== element('config').value) return;
  const url = URL.createObjectURL(new Blob([JSON.stringify({ generatedAt: new Date().toISOString(), limitations: 'Análisis estático parcial; no demuestra alcanzabilidad ni evalúa NAT o enrutamiento.', ...latest }, null, 2)], { type: 'application/json' }));
  const anchor = document.createElement('a'); anchor.href = url; anchor.download = 'firewall-detective-report.json'; anchor.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
});
element('compare-button').addEventListener('click', async () => {
  try {
    const result = await api('/api/compare', { before: element('before').value, after: element('config').value });
    element('diff').textContent = [...result.removed.map(line => `− ${line}`), ...result.added.map(line => `+ ${line}`), '', result.note].join('\n');
    element('semantic-diff').innerHTML = result.semantic ? `<p class="footnote">${result.semantic.changes.length} elementos modificados · ${result.semantic.orderChanged ? 'ATENCIÓN: cambió el orden relativo de políticas comunes' : 'Sin cambios de orden relativo entre políticas comunes'}</p>${result.semantic.changes.map(change => `<div class="finding"><b>${escape(change.type)} · ${escape(change.category)} / ${escape(change.name)}</b>${change.fields.map(field => `<p>${escape(field.field)}: ${escape(field.before.join(', ')) || '∅'} → ${escape(field.after.join(', ')) || '∅'}</p>`).join('')}</div>`).join('')}<p class="footnote">${result.semantic.warnings.length} advertencias de interpretación. ${escape(result.note)}</p>` : `<p class="footnote">Comparación semántica no disponible: ${escape(result.semanticError)}. Consulta las diferencias textuales.</p>`;
    element('error').hidden = true;
  } catch (error) { showError(error); }
});
try {
  const cases = await api('/api/cases');
  element('cases').innerHTML = cases.map((item, index) => `<button class="case" data-id="${escape(item.id)}"><small>${escape(item.category)}</small><span class="number">0${index + 1} ↗</span><h3>${escape(item.title)}</h3><p>${escape(item.description)}</p></button>`).join('');
  const select = item => {
    element('hint').disabled = false; element('solution').disabled = false;
    activeCase = item; element('config').value = item.config; element('before').value = item.config; element('query').value = ''; element('answer').textContent = ''; element('diff').textContent = ''; element('semantic-diff').textContent = ''; element('case-title').textContent = item.title; element('challenge-description').textContent = item.description;
    element('cases').querySelectorAll('button').forEach(button => { button.classList.toggle('selected', button.dataset.id === item.id); button.setAttribute('aria-pressed', String(button.dataset.id === item.id)); }); investigate();
  };
  element('cases').querySelectorAll('button').forEach(button => button.addEventListener('click', () => select(cases.find(item => item.id === button.dataset.id))));
  select(cases[0]);
} catch (error) { showError(error); }
