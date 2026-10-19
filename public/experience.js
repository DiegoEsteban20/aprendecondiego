for (const filename of ['experience.css', 'review.css', 'beginner.css', 'interface.css', 'interface-polish.css']) {
  const stylesheet = document.createElement('link');
  stylesheet.rel = 'stylesheet';
  stylesheet.href = new URL('./' + filename, import.meta.url).href;
  document.head.append(stylesheet);
}
const defaults = { theme: 'light', size: 'normal', contrast: false, motion: !matchMedia('(prefers-reduced-motion: reduce)').matches };
let preferences = { ...defaults };
try {
  const saved = JSON.parse(localStorage.getItem('aprendecondiego-reading-v1') || 'null');
  if (saved) preferences = { theme: ['dark', 'light'].includes(saved.theme) ? saved.theme : defaults.theme, size: ['normal', 'large'].includes(saved.size) ? saved.size : defaults.size, contrast: saved.contrast === true, motion: typeof saved.motion === 'boolean' ? saved.motion : defaults.motion };
} catch {}
function apply() {
  document.documentElement.dataset.theme = preferences.theme;
  document.documentElement.dataset.reading = preferences.size;
  document.documentElement.dataset.contrast = String(preferences.contrast);
  document.documentElement.dataset.motion = preferences.motion ? 'on' : 'off';
  window.dispatchEvent(new CustomEvent('reading-settings', { detail: { ...preferences } }));
}
apply();
document.body.classList.add('friendly-interface');
const main = document.querySelector('main');
const sidebar = document.querySelector('aside');
const toolbar = document.createElement('section');
toolbar.className = 'reading-toolbar';
toolbar.setAttribute('aria-label', 'Navegación y ajustes de lectura');
toolbar.innerHTML = '<button class="menu-toggle" type="button" aria-expanded="false" aria-controls="learning-menu">☰ Menú</button><span class="page-location"></span><details class="reading-settings"><summary>Ajustar lectura</summary><div class="reading-options"><label>Tema<select id="reading-theme"><option value="light">Claro</option><option value="dark">Oscuro</option></select></label><label>Texto<select id="reading-size"><option value="normal">Normal</option><option value="large">Grande</option></select></label><label><input type="checkbox" id="reading-contrast"> Contraste reforzado</label><label><input type="checkbox" id="reading-motion"> Permitir animaciones</label><p>Estos ajustes se guardan sólo en este navegador.</p><p id="reading-status" role="status"></p></div></details>';
const destinations = [
  ['index.html', 'Inicio', 'Tu punto de partida', '⌂'],
  ['academy.html', 'Aprender', 'Conceptos paso a paso', '01'],
  ['visuals.html', 'Ver ejemplos', 'Diagramas y animaciones', '02'],
  ['learn.html', 'Practicar', 'Ejercicios y tu progreso', '03'],
  ['lab.html', 'Analizador', 'Herramienta avanzada', '⌘'],
  ['guide.html', 'Ayuda', 'Cómo funciona cada opción', '?'],
  ['demo.html', 'Video', 'Conoce el proyecto', '▷']
];
const page = destinations.find(([filename]) => location.pathname.endsWith('/' + filename) || (filename === 'index.html' && location.pathname.endsWith('/'))) || destinations.find(([filename]) => location.pathname.endsWith('/' + filename.replace('.html', ''))) || destinations[0];
toolbar.querySelector('.page-location').textContent = 'Estás en: ' + page[1];
if (main) {
  if (!main.id) main.id = 'main-content';
  const skip = document.createElement('a');
  skip.className = 'skip-link'; skip.href = '#' + main.id; skip.textContent = 'Saltar al contenido';
  document.body.prepend(skip);
  main.prepend(toolbar);
}
if (sidebar) {
  const guideNavigation = sidebar.querySelector('#guide-nav');
  const localLinks = [...sidebar.querySelectorAll('a[href^="#"]')].map(link => ({ text: link.textContent, href: link.getAttribute('href') }));
  sidebar.id = 'learning-menu';
  sidebar.setAttribute('aria-label', 'Menú de aprendizaje');
  sidebar.replaceChildren();
  const brand = document.createElement('a');
  brand.className = 'brand'; brand.href = new URL('./index.html', import.meta.url).href;
  brand.innerHTML = '<span class="brand-mark" aria-hidden="true">d.</span><span>Aprende con Diego<small>Redes, sin complicaciones</small></span>';
  sidebar.append(brand);
  const navigation = document.createElement('nav');
  navigation.className = 'site-navigation'; navigation.setAttribute('aria-label', 'Secciones principales');
  for (const [filename, label, description, icon] of destinations) {
    if (filename === 'lab.html') {
      const heading = document.createElement('p'); heading.className = 'menu-caption'; heading.textContent = 'CONSULTAS Y HERRAMIENTAS'; navigation.append(heading);
    }
    const link = document.createElement('a');
    link.href = new URL('./' + filename, import.meta.url).href;
    link.innerHTML = '<span class="nav-icon" aria-hidden="true">' + icon + '</span><span>' + label + '<small>' + description + '</small></span>';
    if (filename === page[0]) link.setAttribute('aria-current', 'page');
    navigation.append(link);
  }
  sidebar.append(navigation);
  if (guideNavigation) {
    const guideSections = document.createElement('details'); guideSections.className = 'local-navigation';
    const summary = document.createElement('summary'); summary.textContent = 'Secciones de ayuda'; guideSections.append(summary, guideNavigation); sidebar.append(guideSections);
  }
  if (localLinks.length) {
    const sections = document.createElement('details'); sections.className = 'local-navigation';
    const summary = document.createElement('summary'); summary.textContent = 'En esta página'; sections.append(summary);
    for (const { text, href } of localLinks) { const link = document.createElement('a'); link.href = href; link.textContent = text; sections.append(link); }
    sidebar.append(sections);
  }
  const note = document.createElement('p'); note.className = 'sidebar-note'; note.textContent = 'A tu ritmo · Sin cuenta · Gratis'; sidebar.append(note);
}
const menu = toolbar.querySelector('.menu-toggle');
function closeMenu() { document.body.classList.remove('menu-open'); menu.setAttribute('aria-expanded', 'false'); }
menu.addEventListener('click', () => {
  const open = !document.body.classList.contains('menu-open');
  document.body.classList.toggle('menu-open', open); menu.setAttribute('aria-expanded', String(open));
  if (open) sidebar?.querySelector('.site-navigation a')?.focus();
});
sidebar?.addEventListener('click', event => { if (event.target.closest('a')) closeMenu(); });
document.addEventListener('keydown', event => { if (event.key === 'Escape' && document.body.classList.contains('menu-open')) { closeMenu(); menu.focus(); } });
for (const field of ['theme', 'size', 'contrast', 'motion']) {
  const control = toolbar.querySelector('#reading-' + field);
  if (control.type === 'checkbox') control.checked = preferences[field]; else control.value = preferences[field];
  control.addEventListener('change', () => {
    preferences[field] = control.type === 'checkbox' ? control.checked : control.value;
    apply();
    try { localStorage.setItem('aprendecondiego-reading-v1', JSON.stringify(preferences)); toolbar.querySelector('#reading-status').textContent = 'Preferencias guardadas.'; }
    catch { toolbar.querySelector('#reading-status').textContent = 'Se aplican a esta página, pero no se pudieron guardar.'; }
  });
}
for (const link of document.querySelectorAll('.hero a')) {
  if (/laboratorio|analizador/i.test(link.textContent) && ['/', '/#lab', './index.html', './index.html#lab'].includes(link.getAttribute('href'))) link.href = new URL('./lab.html', import.meta.url).href;
}
