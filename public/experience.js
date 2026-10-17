const stylesheet = document.createElement('link');
stylesheet.rel = 'stylesheet';
stylesheet.href = new URL('./experience.css', import.meta.url).href;
document.head.append(stylesheet);
const defaults = { theme: 'dark', size: 'normal', contrast: false, motion: !matchMedia('(prefers-reduced-motion: reduce)').matches };
let preferences = { ...defaults };
try {
  const saved = JSON.parse(localStorage.getItem('aprendecondiego-reading-v1') || 'null');
  if (saved) preferences = { theme: ['dark', 'light'].includes(saved.theme) ? saved.theme : defaults.theme, size: ['normal', 'large'].includes(saved.size) ? saved.size : defaults.size, contrast: saved.contrast === true, motion: saved.motion !== false };
} catch {}
function apply() {
  document.documentElement.dataset.theme = preferences.theme;
  document.documentElement.dataset.reading = preferences.size;
  document.documentElement.dataset.contrast = String(preferences.contrast);
  document.documentElement.dataset.motion = preferences.motion ? 'on' : 'off';
  window.dispatchEvent(new CustomEvent('reading-settings', { detail: { ...preferences } }));
}
apply();
const toolbar = document.createElement('section');
toolbar.className = 'reading-toolbar';
toolbar.setAttribute('aria-label', 'Aprende con Diego y preferencias');
toolbar.innerHTML = `<a href="${new URL('./learn.html', import.meta.url).href}">◇ Aprende con Diego · Taller</a><details><summary>Lectura y accesibilidad</summary><div class="reading-options"><label>Tema<select id="reading-theme"><option value="dark">Oscuro</option><option value="light">Claro</option></select></label><label>Texto<select id="reading-size"><option value="normal">Normal</option><option value="large">Grande</option></select></label><label><input type="checkbox" id="reading-contrast"> Contraste reforzado</label><label><input type="checkbox" id="reading-motion"> Animaciones automáticas permitidas</label><p>Preferencias guardadas sólo en este navegador.</p><p id="reading-status" role="status"></p></div></details>`;
document.querySelector('main')?.prepend(toolbar);
for (const field of ['theme', 'size', 'contrast', 'motion']) {
  const control = toolbar.querySelector(`#reading-${field}`);
  if (control.type === 'checkbox') control.checked = preferences[field]; else control.value = preferences[field];
  control.addEventListener('change', () => {
    preferences[field] = control.type === 'checkbox' ? control.checked : control.value;
    apply();
    try { localStorage.setItem('aprendecondiego-reading-v1', JSON.stringify(preferences)); toolbar.querySelector('#reading-status').textContent = 'Preferencias guardadas.'; }
    catch { toolbar.querySelector('#reading-status').textContent = 'No se pudo guardar: se aplican sólo a esta página.'; }
  });
}
