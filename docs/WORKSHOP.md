# Taller Aprende con Diego

Acceso: `learn.html` en el sitio estático o http://127.0.0.1:3000/learn.html en el servidor local. Todas las páginas incorporan un enlace al taller. No reemplaza el analizador, la guía, la academia ni el laboratorio visual.

## Qué hace cada herramienta

| Herramienta | Para qué sirve | Cómo se usa y qué hacer después |
| --- | --- | --- |
| Ruta y progreso | Organizar el estudio en ocho etapas | Abre Estudiar, revisa la lección y marca si puedes explicarla. Las marcas son autoevaluación, no acreditación. Exporta una copia JSON antes de borrar datos del navegador. |
| Paquetes comentados | Relacionar campos de protocolo con evidencia | Elige DNS, TCP o DHCPv4 y pulsa un paquete para leer campos e interpretación. Las trazas son ficticias: no captura tráfico ni carga PCAP. Después contrasta con una captura autorizada de laboratorio. |
| Constructor de políticas | Expresar origen, destino, servicio y acción | Cambia las selecciones, observa las dimensiones amplias y exporta la intención en JSON. No produce comandos ni verifica coincidencias reales. Después define contexto, rutas, NAT, identidad, horarios y pruebas de aceptación. |
| Troubleshooting | Formular hipótesis con evidencia | Elige uno de cuatro casos, abre tres evidencias y responde. Lee explicación y siguiente paso antes de plantear cambios. Las soluciones corresponden al escenario sintético, no a cualquier incidente parecido. |
| Fortinet / Palo Alto | Comparar intención sin asumir equivalencia | Revisa nueve áreas y su columna Qué validar. No es conversor de configuraciones ni garantía de capacidades para toda versión/licencia. El parser conserva sólo el subconjunto FortiOS anterior. |
| Más ejercicios | Repasar conceptos y entender distractores | Hay 18 preguntas: diez de la academia y ocho nuevas. Responde para ver la explicación de cada alternativa; filtra por tema. Las respuestas y puntuación son de sesión y desaparecen al recargar. |
| Informe imprimible | Documentar una revisión | En el analizador, analiza primero, añade notas y pulsa Imprimir informe / guardar PDF. Elige impresora o PDF en el diálogo del navegador. Incluye resumen, hallazgos, políticas y advertencias, no la configuración completa. Revisa datos sensibles antes de compartirlo. |
| Lectura y accesibilidad | Adaptar presentación y movimiento | En cualquier página abre Lectura y accesibilidad. Elige tema, texto grande, contraste o desactiva animaciones automáticas. El paso a paso manual de TCP permanece disponible. |

## Privacidad y persistencia

- `aprendecondiego-progress-v1`: sólo versión y lista de módulos marcados. Importar JSON sustituye las marcas actuales; exporta una copia antes. Se validan versión, tamaño, lista e identificadores.
- `aprendecondiego-reading-v1`: sólo tema, tamaño, contraste y permiso de movimiento automático. Respeta inicialmente la preferencia de movimiento reducido del sistema.
- No se guardan configuraciones, notas, respuestas o reportes en localStorage ni en la caché. No hay cuenta, sincronización ni telemetría.
- La caché contiene únicamente recursos estáticos públicos. Los enlaces externos requieren conexión. Borrar datos del sitio elimina progreso, preferencias y caché; conserva tus exportaciones y una copia del proyecto.
- GitHub Pages usa el dominio gratuito github.io. La disponibilidad depende del proveedor; no se promete alojamiento perpetuo.

## Fuentes y criterio editorial

Los escenarios, preguntas adicionales y trazas son ejemplos originales sintéticos basados en conceptos de protocolos. Las diez preguntas previas conservan su relación con la academia y su guía de origen. Para ampliar el funcionamiento normativo: [TCP, RFC 9293](https://www.rfc-editor.org/rfc/rfc9293), [DNS, RFC 1035](https://www.rfc-editor.org/rfc/rfc1035) y [DHCPv4, RFC 2131](https://www.rfc-editor.org/rfc/rfc2131).

La tabla de fabricantes es conceptual y requiere contrastar versión y despliegue. Consulta [documentación FortiOS](https://docs.fortinet.com/product/fortigate) y [reglas NAT de Palo Alto Networks](https://docs.paloaltonetworks.com/ngfw/networking/nat/nat-policy-rules). NAT y autorización son procesos distintos; el taller no replica sus motores. No existe afiliación ni certificación de fabricantes.

## Comprobación reproducible

Ejecuta `node --test` y `node scripts/build-static.js`. Hay 22 pruebas automatizadas al incorporar esta ampliación. Incluyen enlaces de ruta a lecciones reales, validación del progreso, amplitud de la intención, integridad de trazas/casos/preguntas, subruta estática y pruebas anteriores del analizador y API. No equivalen a validación contra hardware ni a una auditoría de accesibilidad completa.
