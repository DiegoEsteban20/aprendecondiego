import './experience.js';
import { guideSections, findingHelp } from './help.js';
const content = document.getElementById('guide-content');
const status = document.getElementById('guide-status');
const search = document.getElementById('guide-search');
const escape = value => value.replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]);
document.getElementById('guide-nav').innerHTML = guideSections.map(section => `<a class="nav" href="#${section.id}">${escape(section.title)}</a>`).join('');
function render() {
  const query = search.value.trim().toLocaleLowerCase('es');
  const sections = guideSections.filter(section => JSON.stringify(section).toLocaleLowerCase('es').includes(query));
  content.innerHTML = sections.map(section => `<section class="panel guide-section" id="${section.id}"><div class="eyebrow">MANUAL DEL LABORATORIO</div><h2>${escape(section.title)}</h2><p>${escape(section.text)}</p>${section.items.map(([title, text]) => `<details open><summary>${escape(title)}</summary><p>${escape(text)}</p></details>`).join('')}</section>`).join('');
  if (!query || 'hallazgos criterios any_any log_review wan_review duplicate unresolved'.includes(query)) content.innerHTML += `<section class="panel guide-section" id="criteria"><h2>Catálogo de hallazgos</h2>${Object.entries(findingHelp).map(([code, help]) => `<details open><summary>${code}</summary><p><b>Qué detecta:</b> ${escape(help.purpose)}</p><p><b>Interpretación:</b> ${escape(help.meaning)}</p><p><b>Qué hacer después:</b> ${escape(help.next)}</p><p><b>Límite:</b> ${escape(help.limitation)}</p></details>`).join('')}</section>`;
  status.textContent = query ? `${sections.length} secciones del manual coinciden con tu búsqueda.` : 'Ocho secciones y un catálogo de criterios. Lee el recorrido inicial y consulta cada herramienta cuando la necesites.';
}
search.addEventListener('input', render);
render();
