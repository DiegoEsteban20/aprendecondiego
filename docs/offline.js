if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./sw.js', { scope: './', updateViaCache: 'none' }).then(async registration => {
    await navigator.serviceWorker.ready;
    const status = document.createElement('p');
    status.className = 'footnote';
    status.textContent = 'Sin cuentas ni pagos. Aplicación preparada para uso sin conexión en este navegador; la caché puede eliminarse. Conserva también una copia descargada.';
    document.querySelector('footer')?.before(status);
    registration.update().catch(() => {});
  }).catch(() => {});
}
