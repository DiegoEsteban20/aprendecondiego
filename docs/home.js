import './experience.js';
import { pathway, validateProgress } from './learn-data.js';

function showProgress() {
  const status = document.getElementById('home-progress');
  const start = document.getElementById('start-learning');
  start.href = './academy.html#lesson-fundamentos';
  start.textContent = 'Empieza aquí: ¿qué es una red? →';
  status.textContent = 'Puedes empezar sin crear una cuenta.';
  try {
    const saved = localStorage.getItem('aprendecondiego-progress-v1');
    if (!saved) return;
    const progress = validateProgress(JSON.parse(saved));
    const next = pathway.find(module => !progress.completed.includes(module.id));
    status.textContent = `Has marcado ${progress.completed.length} de ${pathway.length} etapas como estudiadas en este navegador.`;
    if (next && progress.completed.length) {
      start.href = `./academy.html#lesson-${next.lesson}`;
      start.textContent = `Continuar: ${next.title.replace(/^\d+ · /, '')} →`;
    } else if (!next) {
      start.href = './learn.html';
      start.textContent = 'Repasar y practicar →';
    }
  } catch {
    status.textContent = 'Puedes estudiar igualmente. No pudimos leer las marcas de este navegador.';
  }
}
showProgress();
window.addEventListener('pageshow', showProgress);
window.addEventListener('storage', showProgress);
if (['#lab', '#policies', '#editor', '#compare'].includes(location.hash)) location.replace(new URL(`./lab.html${location.hash}`, import.meta.url).href);
