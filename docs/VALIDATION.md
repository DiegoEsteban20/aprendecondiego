# Validación de la versión 0.2.0

La ampliación de presentación del 17 de octubre tiene **24 pruebas automatizadas** y una revisión de seis páginas en cuatro anchos CSS. Consulta [resultados, evidencias y límites de la revisión](REVIEW_NOTES.md). Las sesiones con personas y las pruebas en teléfonos físicos siguen pendientes; no deben confundirse con la inspección del agente.

## Pruebas automatizadas

Ejecuta `node --test`. La suite en `test/analyzer.test.js` no necesita Internet ni firewalls; utiliza un servidor HTTP efímero.

Cubre heurísticas, políticas deshabilitadas, duplicados, referencias, IPv4, máscaras, etiquetas, grupos y ciclos. También verifica estructura incompleta, campos desconocidos, comparación semántica, orden y fallback textual; además valida rutas, JSON, tipos, Origin, Content-Type y tamaño de solicitudes.

## Revisión de interfaz

1. Selecciona cada caso y confirma el hallazgo esperado.
2. Busca 10.20.0.10 y verifica WEB_SERVER → SERVERS → política 10.
3. Abre una explicación y usa Ver evidencia.
4. Cambia la prioridad y comprueba el filtro.
5. Modifica el editor: los resultados deben invalidarse y exportar debe deshabilitarse.
6. Analiza y compara contra la versión anterior.
7. Descarga el JSON y revisa que corresponda al estado actual.
8. Abre `/guide`, busca NAT y consulta las secciones.
9. Repite con ancho de 390 px y comprueba el desplazamiento interno de tablas.

## Evidencia de esta entrega

La academia se revisó en cinco vistas (lecciones, puertos, comandos, glosario y autoevaluación), con filtros por fabricante, búsqueda, navegación directa a lecciones, feedback de respuesta incorrecta/correcta y acumulación de puntuación. Se comprobó que ninguna vista desborde el ancho de 390 px. Se volvió a ejecutar la revisión del laboratorio y el manual después de integrar la academia.

Pruebas ejecutadas en Node.js 24 sobre Windows. Interfaz revisada mediante Microsoft Edge automatizado, en escritorio y ancho móvil. `preview.png` procede de la aplicación local.

Docker y la matriz remota de CI no se ejecutaron en este entorno. No se validó contra FortiGate, PAN-OS o APIs de fabricantes. Los datos son sintéticos. No constituye una auditoría independiente ni garantiza compatibilidad con exports de producción.
