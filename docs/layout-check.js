import './experience.js';
const frame = document.getElementById('layout-frame');
const page = document.getElementById('layout-page');
const width = document.getElementById('layout-width');
const result = document.getElementById('layout-result');
function measure() {
  try {
    const root = frame.contentDocument.documentElement;
    const navigation = frame.contentDocument.querySelector('.site-navigation');
    result.textContent = `${page.selectedOptions[0].text} · viewport ${root.clientWidth}px · contenido ${root.scrollWidth}px\n${root.scrollWidth <= root.clientWidth + 1 ? 'Sin desbordamiento horizontal de la página.' : 'Revisar desbordamiento horizontal de la página.'}\n${navigation ? `${navigation.querySelectorAll('a').length} enlaces en la navegación común.` : 'Esperando navegación común.'}\nLas tablas pueden desplazarse dentro de su propio contenedor.`;
  } catch { result.textContent = 'No se pudo leer el viewport. Abre esta herramienta en el mismo origen del sitio.'; }
}
page.addEventListener('change', () => { frame.src = new URL(`./${page.value}`, import.meta.url).href; result.textContent = 'Cargando página…'; });
width.addEventListener('change', () => { document.getElementById('viewport-container').className = `viewport-width-${width.value}`; requestAnimationFrame(measure); });
frame.addEventListener('load', measure);
document.getElementById('layout-measure').addEventListener('click', measure);
