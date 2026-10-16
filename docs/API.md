# API HTTP v0.2.0

Base local: `http://127.0.0.1:3000`. No requiere autenticación porque su operación prevista es loopback. No es un servicio público.

## GET /api/health

```json
{"status":"ok","version":"0.2.0","mode":"local-lab"}
```

## GET /api/cases

Lista de tres objetos con `id`, `title`, `category`, `description`, `hint`, `solution` y `config`. Incluye soluciones deliberadamente.

## POST /api/analyze

Cabecera `Content-Type: application/json`.

```json
{"config":"config firewall address\nedit \"HOST\"\nset subnet 10.0.0.1 255.255.255.255\nnext\nend","query":"10.0.0.1"}
```

`config` es texto obligatorio; `query` es texto opcional, vacío por defecto.

Respuesta:

| Campo | Tipo | Significado |
| --- | --- | --- |
| vendor | string | Identifica el subconjunto interpretado |
| objects, groups, rules | array | Elementos con identificador y línea |
| warnings | array | `{line, message}` para opciones o instrucciones omitidas |
| findings | array | `{rule, line, code, severity, title, detail}` |
| search | object | `{query, objects, groups, rules}` relacionados |
| summary | object | Recuentos objects, groups, rules y findings |

`rule` es la referencia del propietario y puede corresponder a un grupo en UNRESOLVED; es null para DUPLICATE. `line` apunta al inicio del elemento, no necesariamente a la instrucción exacta que motivó el hallazgo.

Con query vacío, search tiene listas vacías; la interfaz utiliza el modelo general. Las políticas con all no se añaden automáticamente a los resultados por referencia específica.

## POST /api/compare

```json
{"before":"texto anterior","after":"texto actual"}
```

Respuesta: `added` y `removed` son listas de líneas. `semantic` contiene `changes`, `orderChanged`, `previousOrder`, `currentOrder` y `warnings`. Cada cambio tiene `category`, `name`, `type` (added, removed, modified) y `fields`. Los campos modificados contienen `field`, `before` y `after`.

Si uno de los textos no es compatible, `semantic` es null y `semanticError` explica el fallo; la comparación textual sigue disponible. Un HTTP 200 en esta ruta no demuestra que ambos textos sean configuraciones compatibles.

## Errores y límites

Formato: `{"error":"Descripción"}`.

| Estado | Motivo |
| --- | --- |
| 400 | JSON no válido, cuerpo no objeto, tipos incorrectos o análisis rechazado |
| 403 | Origin presente distinto de http://Host |
| 404 | Ruta o método no implementado |
| 413 | Más de 1,048,576 bytes en el cuerpo |
| 415 | POST sin application/json |

Timeout de solicitud configurado: 15 segundos. No existen paginación, persistencia, caché, tokens ni conectores a proveedores.

## Ejemplo reproducible en PowerShell

```powershell
$cases = Invoke-RestMethod http://127.0.0.1:3000/api/cases
$payload = @{ config = $cases[0].config; query = '10.20.0.10' } | ConvertTo-Json
$result = Invoke-RestMethod http://127.0.0.1:3000/api/analyze -Method Post -ContentType 'application/json; charset=utf-8' -Body ([System.Text.Encoding]::UTF8.GetBytes($payload))
$result.search | ConvertTo-Json -Depth 8
```
