# Uso gratuito, independiente y sin conexión

## Compromiso del proyecto

El analizador, comparador, academia y ejercicios no requieren ChatGPT, ChatGPT Plus, claves de API, cuentas de fabricantes ni suscripciones. No se han integrado modelos de pago, publicidad ni servicios de análisis externos.

## Web pública

Dirección de GitHub Pages: https://diegoesteban20.github.io/aprendecondiego/.

El sitio se genera con `npm run build`, que escribe los archivos estáticos en `docs/` sin eliminar los manuales existentes. Se publica desde la rama `main`, carpeta `/docs`, en la configuración de GitHub Pages. No se necesita un servidor Node.js en Internet. El código del navegador procesa la configuración en memoria; no hace POST a `/api/analyze` o `/api/compare`.

La API HTTP sigue disponible para quien ejecute `node server.js` localmente y quiera automatizar por scripts. No está desplegada en Pages. Los dos modos usan el mismo analizador y los mismos casos.

## Sin conexión en el navegador

Abre la web con Internet y espera el mensaje de aplicación preparada para uso sin conexión, al final de la página. El service worker descarga una lista fija de archivos públicos del sitio: interfaz, motor, casos y academia. Después permite abrir laboratorio, manual y academia desde la caché sin conexión.

No guarda configuraciones, respuestas del cuestionario, resultados ni reportes en la caché. Sólo intercepta GET de archivos estáticos de su lista. Una configuración propia permanece en memoria de la página; exporta lo que necesites conservar.

El taller guarda las marcas de ocho módulos y las preferencias de lectura en localStorage del mismo origen. No guarda respuestas, evidencias abiertas, configuraciones o notas. Puedes exportar/importar el progreso como JSON y borrar las marcas desde el taller. Si bloqueas el almacenamiento, el sitio funciona en memoria y muestra un aviso. La caché incluye también el taller y los controles de lectura. Imprimir/guardar PDF es una acción local del navegador; revisa el contenido sensible antes de compartir el archivo.

La disponibilidad offline depende de que el navegador complete y conserve la caché. Puede desaparecer al borrar datos, usar navegación privada o por decisiones de almacenamiento del navegador. Cierra las pestañas y vuelve a abrir con Internet para permitir que una actualización del service worker se active. Los enlaces a documentación externa requieren Internet.

## Copia independiente del alojamiento

Descarga el código fuente desde GitHub o el ZIP del proyecto y conserva una copia. Con Node.js 22 o posterior, ejecuta `node server.js` y abre http://127.0.0.1:3000. Tras disponer del runtime y los archivos no hace falta Internet para usar el laboratorio o la academia. No se ejecuta `npm install` porque no hay dependencias de ejecución.

El sitio estático también se puede servir desde cualquier servidor HTTP local o alojamiento estático equivalente; no debe abrirse directamente como file:// porque los módulos JavaScript y el service worker tienen restricciones de origen.

## Coste y permanencia

La página de presentación añade un video MP4 alojado en el mismo repositorio, sin terceros ni cuentas. El MP4 se excluye de la precarga offline para no retrasar la instalación ni interferir con las solicitudes por rango del reproductor. Descárgalo si quieres conservarlo sin conexión; la transcripción, las capturas y todas las herramientas interactivas sí forman parte de los recursos estáticos cacheados.

GitHub Pages está disponible para repositorios públicos bajo GitHub Free según la documentación consultada. El dominio github.io evita comprar un dominio propio. No se ha contratado un plan ni configurado un recurso de pago.

La continuidad del alojamiento depende de GitHub, sus términos y límites. No se promete disponibilidad perpetua de un servicio ajeno. La copia descargable y el procesamiento local mantienen la utilidad del proyecto aunque el alojamiento cambie.

Referencia: [fuentes de publicación y disponibilidad de GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site).
