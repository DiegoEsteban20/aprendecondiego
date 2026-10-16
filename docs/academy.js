import { academySource, lessons, ports, commands, glossary, questions } from './academy-data.js';

const element = id => document.getElementById(id);
const escape = value => String(value).replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]);
const normalize = value => String(value).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
const includes = value => normalize(JSON.stringify(value)).includes(normalize(element('academy-search').value.trim()));
let view = 'lessons';
const answers = new Map();
element('source-note').textContent = academySource.note;

function setFilters() {
  const values = view === 'lessons' ? [...new Set(lessons.map(lesson => lesson.category))] : view === 'commands' ? [...new Set(commands.map(command => command[0]))] : [];
  element('academy-category').innerHTML = '<option value="all">Todas las categorías</option>' + values.map(value => `<option value="${escape(value)}">${escape(value)}</option>`).join('');
  element('academy-category').disabled = !values.length;
  element('academy-search').disabled = view === 'quiz';
}

function table(headers, rows) {
  return `<section class="panel"><div class="table-wrap academy-table"><table><thead><tr>${headers.map(header => `<th scope="col">${header}</th>`).join('')}</tr></thead><tbody>${rows.length ? rows.map(row => `<tr>${row.map(value => `<td>${escape(value)}</td>`).join('')}</tr>`).join('') : `<tr><td colspan="${headers.length}">Sin coincidencias. Prueba otro término.</td></tr>`}</tbody></table></div></section>`;
}

function render() {
  element('academy-tabs').querySelectorAll('button').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.view === view)));
  const category = element('academy-category').value;
  let count = 0;
  let html = '';
  if (view === 'lessons') {
    const filtered = lessons.filter(lesson => includes(lesson) && (category === 'all' || lesson.category === category));
    count = filtered.length;
    html = `<div class="lesson-grid">${filtered.map(lesson => `<a class="lesson-card" href="#lesson-${lesson.id}"><span class="eyebrow">${escape(lesson.category)} · ${escape(lesson.level)}</span><h2>${escape(lesson.title)}</h2><p>${escape(lesson.intro)}</p><small>PDF · pp. ${escape(lesson.pages)} <span>Leer lección ↗</span></small></a>`).join('')}</div>` + filtered.map(lesson => `<article class="panel guide-section lesson-detail" id="lesson-${lesson.id}"><div class="eyebrow">${escape(lesson.category)} / ${escape(lesson.level)} · PDF pp. ${escape(lesson.pages)}</div><h2>${escape(lesson.title)}</h2><p>${escape(lesson.intro)}</p>${lesson.concepts.map(([title, text]) => `<details open><summary>${escape(title)}</summary><p>${escape(text)}</p></details>`).join('')}<div class="learning-block"><h3>Ejemplo para entenderlo</h3><p>${escape(lesson.example)}</p></div><div class="learning-block"><h3>Práctica propuesta</h3><p>${escape(lesson.practice)}</p></div><div class="learning-block connection"><h3>Relación con Firewall Detective</h3><p>${escape(lesson.connection)}</p><a href="./index.html">Abrir el laboratorio ↗</a></div><a class="back-link" href="#academy-tabs">↑ Volver al índice</a></article>`).join('');
    if (!count) html = '<section class="panel"><h2>No se encontraron lecciones</h2><p class="footnote">Prueba otro término o elimina el filtro de categoría.</p></section>';
  }
  if (view === 'ports') {
    const filtered = ports.filter(includes); count = filtered.length;
    html = '<p class="footnote">Puertos habituales de referencia, no una lista de permisos recomendados. Las implementaciones pueden usar otros puertos o transportes.</p>' + table(['Servicio', 'Puerto', 'Transporte', 'Para qué sirve', 'Qué revisar'], filtered);
  }
  if (view === 'commands') {
    const filtered = commands.filter(command => includes(command) && (category === 'all' || command[0] === category)); count = filtered.length;
    html = '<p class="footnote">Referencia de consulta basada en el PDF. La web no ejecuta comandos. Sustituye direcciones de ejemplo sólo en tu propio laboratorio y confirma la sintaxis para tu versión.</p>' + table(['Entorno', 'Comando', 'Para qué sirve', 'Observación'], filtered);
  }
  if (view === 'glossary') {
    const filtered = glossary.filter(includes).toSorted((previous, current) => previous[0].localeCompare(current[0], 'es')); count = filtered.length;
    html = `<section class="glossary-grid">${filtered.map(([term, definition]) => `<article class="panel"><h2>${escape(term)}</h2><p>${escape(definition)}</p></article>`).join('')}</section>`;
  }
  if (view === 'quiz') {
    count = questions.length;
    html = `<section class="panel"><div class="panel-head"><h2>Comprueba tu criterio</h2><button id="reset-quiz">Reiniciar respuestas</button></div><p class="footnote">Ejercicio formativo. Las respuestas permanecen en memoria mientras la página está abierta; no se guardan ni se envían a un servidor.</p><p id="quiz-progress" role="status"></p></section>` + questions.map((question, index) => `<section class="panel quiz-question"><h2>${index + 1}. ${escape(question.question)}</h2><div class="quiz-options">${question.options.map((option, optionIndex) => `<button data-question="${index}" data-option="${optionIndex}" ${answers.has(index) ? 'disabled' : ''} aria-pressed="${answers.get(index) === optionIndex}">${escape(option)}</button>`).join('')}</div><p id="feedback-${index}" class="quiz-feedback" role="status">${answers.has(index) ? feedback(question, answers.get(index)) : ''}</p><a href="#lesson-${question.lesson}" data-lesson="${question.lesson}">Repasar la lección ↗</a></section>`).join('');
  }
  element('academy-content').innerHTML = html;
  element('academy-status').textContent = `${count} ${view === 'lessons' ? 'lecciones' : view === 'ports' ? 'servicios' : view === 'commands' ? 'comandos de referencia' : view === 'glossary' ? 'términos' : 'preguntas'} · ${view === 'quiz' ? 'Autoevaluación local' : 'Contenido adaptado del PDF y notas editoriales'}`;
  if (view === 'quiz') bindQuiz();
}

function feedback(question, answer) {
  return `${answer === question.correct ? 'Correcto.' : `Revisa tu respuesta. Opción correcta: ${question.options[question.correct]}.`} ${question.explanation}`;
}

function bindQuiz() {
  const correct = [...answers].filter(([index, answer]) => questions[index].correct === answer).length;
  element('quiz-progress').textContent = `${answers.size} de ${questions.length} respondidas · ${correct} correctas`;
  element('reset-quiz').addEventListener('click', () => { answers.clear(); render(); element('reset-quiz').focus(); });
  element('academy-content').querySelectorAll('[data-question]').forEach(button => button.addEventListener('click', () => {
    const index = Number(button.dataset.question);
    answers.set(index, Number(button.dataset.option));
    render();
    const message = element(`feedback-${index}`); message.tabIndex = -1; message.focus({ preventScroll: true });
  }));
}

function openLesson(id) {
  view = 'lessons'; element('academy-search').value = ''; setFilters(); render();
  const target = element(`lesson-${id}`);
  if (target) requestAnimationFrame(() => target.scrollIntoView({ block: 'start' }));
}
element('academy-tabs').querySelectorAll('button').forEach(button => button.addEventListener('click', () => { view = button.dataset.view; element('academy-search').value = ''; setFilters(); render(); }));
element('academy-content').addEventListener('click', event => { const link = event.target.closest('[data-lesson]'); if (link) { event.preventDefault(); location.hash = `lesson-${link.dataset.lesson}`; openLesson(link.dataset.lesson); } });
element('academy-search').addEventListener('input', render);
element('academy-category').addEventListener('change', render);
window.addEventListener('hashchange', () => { if (location.hash.startsWith('#lesson-')) openLesson(location.hash.slice(8)); });
setFilters(); render();
if (location.hash.startsWith('#lesson-')) openLesson(location.hash.slice(8));
