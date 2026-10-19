import './experience.js';
import { pathway, validateProgress } from './learn-data.js';
const welcome = document.createElement('div');
welcome.className = 'welcome-path'; welcome.setAttribute('aria-label', 'Cómo vas a aprender');
welcome.innerHTML = '<span>01 Aprende</span><b aria-hidden="true">→</b><span>02 Mira</span><b aria-hidden="true">→</b><span>03 Practica</span>';
document.querySelector('.home-hero')?.prepend(welcome);
const illustration = document.createElement('figure');
illustration.className = 'home-illustration';
illustration.setAttribute('aria-label', 'Una red conecta tu equipo con otros dispositivos');
illustration.innerHTML = '<div class="network-device"><span aria-hidden="true">▣</span><b>Tu equipo</b><small>Envía información</small></div><div class="network-connection" aria-hidden="true">↓</div><div class="network-hub"><span aria-hidden="true">⇄</span><b>La red los conecta</b></div><div class="network-connection" aria-hidden="true">↓</div><div class="network-device"><span aria-hidden="true">▣</span><b>Otro dispositivo</b><small>Recibe y responde</small></div><figcaption>Una idea sencilla. Después, paso a paso.</figcaption>';
document.querySelector('.home-hero')?.append(illustration);

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
