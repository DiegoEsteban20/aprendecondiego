# Contribuir

Gracias por ayudar a construir un laboratorio claro y verificable.

## Flujo de desarrollo

1. Usa Node.js 22 o posterior.
2. Ejecuta `node --test` antes y después del cambio.
3. Ejecuta `node server.js` para comprobar las pantallas afectadas.
4. Agrega un caso sintético mínimo si modificas el parser, búsqueda o hallazgos.
5. Actualiza `public/help.js` y la documentación cuando cambie el comportamiento.
6. Describe en el PR el problema, el cambio, su validación y sus límites.

No se requieren paquetes externos para ejecutar el proyecto. Evita añadir dependencias sin justificar su necesidad. No hay un formatter obligatorio; sigue el estilo del archivo que modificas.

## Datos aceptables

Usa direcciones privadas y nombres ficticios. No incluyas tokens, claves, configuraciones reales, nombres de clientes o capturas de infraestructura de terceros. Para reportar un error de parser, reduce el archivo a un fixture sintético.

## Nuevas heurísticas

Incluye código estable, prioridad, disparador exacto, evidencia, posibles falsos positivos, explicación de siguientes pasos y pruebas de activación y no activación. No presentes una heurística como vulnerabilidad confirmada.

## Compatibilidad

Antes de anunciar soporte de otro fabricante o ámbito, implementa y prueba su parser y documenta los casos no soportados. Una respuesta API simulada no equivale a una integración validada.
