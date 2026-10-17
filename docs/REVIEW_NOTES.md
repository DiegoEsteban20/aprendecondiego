# Revisión de presentación · 17 de octubre de 2026

## Resultado y cambios

Se conserva el analizador, la academia, las animaciones y el taller. Se corrige la dependencia del menú lateral oculto en móvil mediante seis enlaces comunes; se añade salto al contenido, reflujo de cabeceras, formularios y paneles, áreas de acción de al menos 44 px para controles principales en pantallas pequeñas y un apilado vertical del grafo.

La página Demo y alcance presenta propósito, destinatarios y limitaciones. Incluye un MP4 H.264 de 24 segundos, 1280×720 y sin audio, compuesto de cuatro capturas reales con rótulos. Tiene reproducción manual, subtítulos WebVTT y transcripción. Se verificó reproducción en Chrome con duración de 24 segundos, readyState 4 y sin error de medio. El MP4 no se precarga en la caché offline; el contenido interactivo se conserva sin dependencia de servicios de pago.

## Comprobaciones realizadas

- `node --test`: **24 pruebas correctas**, incluyendo las pruebas anteriores del motor y la API, progreso, recursos del sitio estático e integridad binaria del video.
- Todos los enlaces y recursos relativos declarados en las páginas HTML generadas apuntan a archivos incluidos en el paquete. Esto no verifica automáticamente cada enlace externo ni los fragmentos generados dinámicamente.
- Sitio y pruebas de GitHub Actions correctos para el commit de código `e4bc272`; el resultado por versión queda disponible en Actions.
- Revisión de las vistas iniciales de analizador, academia, laboratorio visual, taller, guía y demo, mediante `layout-check.html` en Chrome. Para cada una se comprobaron cuatro contenedores: **24 combinaciones sin desbordamiento horizontal global**, con seis enlaces comunes presentes.

| Ancho del contenedor | Viewport útil observado | Ancho de contenido observado |
| --- | --- | --- |
| 320 px | 303 px | 303 px |
| 390 px | 373 px | 373 px |
| 768 px | 751 px | 751 px |
| 1280 px | 1263 px | 1263 px |

La diferencia corresponde al borde y la barra de desplazamiento del iframe en este entorno. Las tablas pueden conservar desplazamiento dentro de sus contenedores. No se afirma haber cubierto cada combinación de filtros, estados, preferencias o navegadores.

## Revisión editorial y fuentes

Se revisó la distinción entre configuraciones declaradas y comportamiento real, material PAN-OS y soporte del parser, traducción NAT y autorización, y el tratamiento de señales como evidencia parcial. No se amplía el alcance del analizador ni se certifica su uso en producción.

Se consultaron las referencias de [NIST SP 800-61 Rev. 3](https://csrc.nist.gov/pubs/sp/800/61/r3/final), [registro de servicios IANA](https://www.iana.org/assignments/service-names-port-numbers), [orden de políticas FortiGate](https://community.fortinet.com/fortigate-3/technical-tip-how-policy-order-works-on-fortigate-105307), [reglas NAT PAN-OS](https://docs.paloaltonetworks.com/ngfw/networking/nat/nat-policy-rules) y [ejemplo DNAT](https://docs.paloaltonetworks.com/ngfw/networking/nat/destination-nat-exampleone-to-one-mapping). La referencia Fortinet `docs.fortinet.com/.../656084` devolvió 403 al lector automatizado: se conserva como referencia existente, sin afirmar haber verificado su contenido en esta revisión.

## Lo que sigue pendiente

- Sesiones con dos o tres personas: [guion y registro vacío](USER_TESTING.md). No se ha contactado a terceros ni fabricado resultados.
- Comprobación en teléfonos físicos, otros navegadores y lectores de pantalla. El iframe prueba reflujo CSS, no comportamiento táctil real.
- Auditoría completa de accesibilidad, evaluación de seguridad independiente y validación contra hardware de fabricantes.

El estado correcto es **proyecto educativo publicable y reproducible**, no herramienta de auditoría de producción certificada.
