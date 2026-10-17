# Seguridad y tratamiento de datos

## Alcance

La versión estática de `docs/` se puede publicar con GitHub Pages: no contiene servidor de análisis ni endpoints de escritura. La interfaz procesa configuraciones en la memoria del navegador. El alojamiento sigue recibiendo las solicitudes normales de archivos públicos y puede registrar sus propios logs de acceso.

El service worker sólo guarda e intercepta archivos estáticos GET incluidos en su lista fija. No persiste configuraciones ni resultados. Consulta [uso gratuito y sin conexión](docs/FREE_AND_OFFLINE.md).

La versión 0.2.0 está destinada a un único usuario en su equipo local. No incluye autenticación, TLS, autorización por usuario, persistencia o aislamiento entre sesiones. No la expongas directamente a Internet ni a una red compartida.

El proceso escucha en `127.0.0.1` por defecto. Docker escucha internamente en todas las interfaces: limita la publicación del puerto al loopback del host como indica el README.

## Controles implementados

- Archivos estáticos por lista permitida, sin rutas de disco suministradas por el usuario.
- JSON obligatorio y validación de tipos en las rutas POST.
- Límite de 1 MB por cuerpo, timeout de solicitud y sin CORS abierto.
- Validación de Origin cuando se envía. No sustituye autenticación ni protege frente a todos los procesos locales.
- Política CSP, `nosniff` y escape de texto al generar HTML.
- Sin comandos remotos, sin acceso a firewalls, sin escritura de configuraciones y sin telemetría.

No se ha realizado auditoría de seguridad independiente ni prueba de penetración. Estos controles no convierten el laboratorio en un servicio de producción.

## Reportes de problemas

El repositorio es público para permitir estudiar el código; eso no concede permiso para modificar la rama publicada. No añadas colaboradores, aplicaciones o claves de despliegue que no necesites. Usa una contraseña única y activa autenticación de dos factores en tu cuenta. Ninguna protección del repositorio sustituye la seguridad de la cuenta del propietario.

Los cambios deben conservar el alcance educativo, pasar las pruebas y revisarse antes de publicarse. El archivo CODEOWNERS identifica al mantenedor; no es un control de acceso por sí solo. Las reglas efectivas de rama se consultan en Settings → Rulesets y no se activan sólo por añadir documentación.

El workflow de pruebas solicita permisos de lectura del contenido y no conserva credenciales del checkout. No utiliza pull_request_target ni despliega aportes externos automáticamente. Los patrones de .gitignore reducen cargas accidentales de configuraciones, capturas y claves, pero no bloquean archivos ya rastreados ni reemplazan la revisión de secretos.

Para fallos de seguridad, prepara una reproducción con datos sintéticos. Cuando el repositorio esté publicado, el mantenedor deberá habilitar un canal privado de reporte antes de invitar divulgaciones sensibles. No publiques secretos ni configuraciones de clientes en issues.

## Datos

La aplicación no guarda configuraciones en el servidor. El navegador conserva texto y resultados en memoria mientras la página permanece abierta. Los reportes descargados pueden incluir información interna. Revisa y anonimiza todos los archivos antes de compartir.
