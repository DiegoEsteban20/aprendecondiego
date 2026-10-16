# Manual de uso

La guía interactiva está en **http://127.0.0.1:3000/guide** cuando el servidor está ejecutándose. Incluye ocho capítulos, búsqueda y catálogo de cinco heurísticas. Su contenido está versionado en `public/help.js` para mantener la explicación de hallazgos y la guía en un mismo lugar.

## 1. Propósito

La web pública y el modo local no requieren ChatGPT, ChatGPT Plus, claves ni pagos. La interfaz procesa los textos en la memoria del navegador; la API HTTP se conserva como opción para scripts locales. Consulta [uso gratuito y sin conexión](FREE_AND_OFFLINE.md).

Firewall Detective transforma configuraciones planas de un subconjunto de FortiOS en un modelo navegable. Está diseñado para aprendizaje, revisión documental y preparación de investigaciones. No prueba conectividad ni aplica cambios en dispositivos.

## 2. Instalación

1. Instala Node.js 22 o posterior.
2. Descarga o clona el proyecto.
3. Abre una terminal en la carpeta que contiene `package.json`.
4. Ejecuta `node server.js` o `npm start`.
5. Abre http://127.0.0.1:3000.
6. Para detenerlo, presiona Ctrl+C en la terminal.

No necesitas `npm install`: no existen dependencias de ejecución. El programa no solicita tokens ni acceso a tu red.

En Windows, también puedes abrir `start-windows.cmd`. Si no encuentra Node.js, instala el runtime y vuelve a abrir la terminal.

Si el puerto está ocupado, en PowerShell:

```powershell
$env:PORT = 3001
node server.js
```

Abre entonces http://127.0.0.1:3001.

## 3. Recorrido recomendado

### Investigar

Selecciona **La puerta abierta**. La configuración ficticia incluye una política 20 con origen y destino `all`, servicio `ALL` y acción `accept`. Abre la explicación del hallazgo `ANY_ANY` y pulsa **Ver evidencia**. El editor seleccionará la línea inicial de esa política.

Busca `10.20.0.10`: aparecerán el objeto `WEB_SERVER`, el grupo `SERVERS` y la política 10. El listado de contexto universal avisa qué políticas declaran `all`; no determina si aceptan tu flujo.

### Comparar

Al elegir un caso, la aplicación coloca su configuración también en el campo anterior del comparador. Modifica en el editor el servicio de la política 20 de `ALL` a `HTTPS`. Analiza y compara: verás `rules / 20`, campo `service`, con su valor anterior y nuevo.

La ausencia del hallazgo ANY_ANY después del cambio sólo indica que dejó de cumplirse ese criterio. Puede seguir existiendo un permiso excesivo en otras dimensiones.

### Documentar

Pulsa **Exportar JSON** después de analizar. El archivo contiene el modelo interpretado, hallazgos, búsqueda, advertencias y fecha. No es un respaldo íntegro de la configuración. El botón queda deshabilitado si modificas el editor para evitar exportar un estado anterior.

## 4. Módulos y resultados

| Módulo | Para qué sirve | Qué hace | Qué revisar después |
| --- | --- | --- | --- |
| Casos | Practicar sin hardware | Carga datos, pistas y soluciones sintéticas | Explicar la evidencia con tus palabras |
| Contadores | Dimensionar el archivo interpretado | Cuenta objetos, grupos, reglas y hallazgos | Comparar con lo esperado del archivo |
| Explorador | Rastrear referencias | Filtra objetos y expande grupos dependientes | Revisar la tabla de relaciones exactas |
| Relaciones | Entender dependencias | Enumera miembro/origen/destino y su propietario | Validar todos los usos antes de cambiar un objeto |
| Políticas | Leer el contexto | Resume campos declarados de cada regla | Revisar interfaces, acción, estado y servicio |
| Hallazgos | Priorizar revisión | Ejecuta cinco comprobaciones estáticas | Confirmar contexto y documentar una decisión |
| Editor | Probar una hipótesis | Modifica el texto local y permite reanalizar | Verificar cambios antes de compartir |
| Comparador | Revisar versiones | Compara campos, orden relativo y líneas | Validar en un entorno real antes de aplicar |
| Exportación | Conservar evidencia | Descarga JSON del análisis vigente | Anonimizar datos antes de publicarlos |
| Guía | Entender la herramienta | Explica acciones, criterios, conceptos y límites | Consultar documentación oficial del firmware |

## 5. Prioridades y criterios

| Código | Prioridad | Disparador | Precaución |
| --- | --- | --- | --- |
| ANY_ANY | Alta | accept habilitada, srcaddr all, dstaddr all, service ALL | No demuestra exposición efectiva |
| LOG_REVIEW | Media | accept habilitada sin logtraffic all explícito | No equivale a ausencia total de logs |
| WAN_REVIEW | Media | accept habilitada, nombre de interfaz con wan/internet, destino distinto de all | El nombre no demuestra el rol real |
| DUPLICATE | Baja | Dos objetos con el mismo texto de subnet | No compara todas las equivalencias ni otros tipos |
| UNRESOLVED | Media | Referencia no definida como dirección/grupo en el archivo | Puede ser un VIP válido o una exportación parcial |

Cada hallazgo incluye una línea, criterio, interpretación y siguientes pasos. La severidad es prioridad de revisión de esta aplicación, no CVSS.

## 6. Formato compatible

Se aceptan bloques planos completos `config firewall address`, `config firewall addrgrp` y `config firewall policy`, en un único ámbito. El parser conserva campos soportados y avisa cuando omite otras opciones. Rechaza bloques no compatibles y estructura incompleta para evitar interpretar silenciosamente otro ámbito.

Campos: `name`, `subnet`, `type`, `member`, `srcaddr`, `dstaddr`, `srcintf`, `dstintf`, `service`, `action`, `status`, `schedule`, `logtraffic`, `comments`. `name` se guarda como `label` cuando proviene de `set name`; el identificador de `edit` permanece como `name`.

La búsqueda de pertenencia requiere IPv4 y máscara decimal contigua. No interpreta rangos, IPv6, FQDN, grupos dinámicos, exclusiones, sintaxis avanzada de escapes, VDOM o XML PAN-OS. Las opciones omitidas pueden cambiar la interpretación operativa de una regla.

## 7. Privacidad

La interfaz procesa configuraciones en memoria del navegador, sin enviarlas a un backend. La API Node.js opcional escucha en loopback para scripts locales. No se usa base de datos ni telemetría. Un reporte exportado sí permanece en tu disco. El service worker de la web estática conserva únicamente archivos públicos de la aplicación, nunca configuraciones o resultados. Recargar elimina el estado de trabajo no guardado.

No expongas esta aplicación directamente a Internet: no incluye autenticación, TLS ni aislamiento multiusuario. Usa datos sintéticos en demos, capturas y tickets públicos.

## 8. Fuentes y alcance

La documentación de referencia no implica que este proyecto implemente toda su sintaxis:

- [Fortinet: ejemplos de políticas y logging](https://docs.fortinet.com/document/fortigate/7.6.4/administration-guide/394392).
- [Palo Alto Networks: introducción a XML API](https://docs.paloaltonetworks.com/ngfw/api/getting-started), para una futura integración.

Palo Alto aún no se implementa. No se ha validado contra hardware de ninguno de los fabricantes.
