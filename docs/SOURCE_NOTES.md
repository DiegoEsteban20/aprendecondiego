# Procedencia de la academia y criterio editorial

## Fuente aportada

**Guía de Redes y Ciberseguridad**, atribución de portada **@DiegoMolina**, fecha de portada **8 de octubre de 2026**, **57 páginas**. El usuario proporcionó el archivo para adaptar contenido al sitio. Se leyó su extracción completa y se revisó visualmente la portada.

El documento fuente se mantiene fuera del repositorio. No se publica una copia ni se incluyen su ruta local o sus metadatos privados. La academia es una síntesis editorial con ejemplos y ejercicios, no una reproducción facsimilar. La licencia MIT del software no cambia los derechos sobre el documento original.

## Cobertura

| Lección | Páginas fuente |
| --- | --- |
| Fundamentos y rendimiento | 2–4 |
| OSI y TCP/IP | 4–6 |
| IPv4, CIDR y subnetting | 6–8 |
| MAC, ARP e IPv6 | 6, 8–9 |
| TCP, UDP y puertos | 9–12 |
| Servicios esenciales | 12–15 |
| NAT y PAT | 15–17, 36, 41 |
| Switching y segmentación | 17–19 |
| Routing | 19–20 |
| Wi-Fi | 20–22 |
| CIA, AAA y principios | 22–25 |
| Amenazas | 25–28 |
| Defensas | 28–31, 33 |
| Criptografía | 31–33 |
| Fortinet | 33–38 |
| Palo Alto | 38–43 |
| Equivalencias | 43–45 |
| SOC y respuesta | 46–48 |
| Marcos y hardening | 49–51 |
| Diagnóstico y práctica | 37–38, 42, 45, 52–54 |

Puertos y comandos se adaptaron principalmente de las páginas 9–15, 37, 42 y 52–54. El glosario sintetiza las páginas 54–57 y los conceptos de las lecciones. La autoevaluación es contenido añadido para practicar los conceptos de la adaptación, no preguntas copiadas del PDF.

## Ajustes técnicos

- MAC: no se presenta como identidad inmutable; se contempla administración local y aleatorización.
- Ping: se describe el tiempo habitual de ida y vuelta y la posibilidad de filtrar ICMP.
- TCP/UDP: se evita prometer entrega incondicional o superioridad universal de velocidad.
- Subnetting: se distinguen subredes convencionales de /31 y /32.
- HTTPS: se distingue protección del canal y legitimidad del sitio; se contempla HTTP/3 sobre UDP.
- Segmentación, NAT y VPN: no se presentan como prueba suficiente de seguridad.
- Firmas: se explican como un mecanismo criptográfico, sin la generalización de cifrar un hash con cualquier clave privada.
- Routing: las distancias administrativas dependen de fabricante y plataforma.
- Wi-Fi: no se universalizan canales, velocidades máximas, RSSI objetivo o supuestas garantías.
- PAN-OS: el ejemplo de DNAT conserva dirección original y zona del destino traducido; se identifica como teoría fuera del parser.
- Respuesta a incidentes: el ciclo clásico del PDF se contextualiza frente a NIST SP 800-61 Rev. 3.

## Qué no se trasladó

No se convierten en recomendaciones vigentes afirmaciones comerciales de precio o superioridad, listas de modelos, condiciones de licenciamiento, nombres de certificaciones ni plazos y obligaciones legales. Estos temas necesitan comprobación independiente para un objetivo concreto. Tampoco se copian bloques de modificación de configuración, commits, depuración o renovación de interfaces.

## Referencias primarias consultadas

- [NIST SP 800-61 Rev. 3](https://csrc.nist.gov/pubs/sp/800/61/r3/final): respuesta a incidentes integrada con CSF 2.0, publicación de abril de 2025.
- [Palo Alto: ejemplo DNAT uno a uno](https://docs.paloaltonetworks.com/ngfw/networking/nat/destination-nat-exampleone-to-one-mapping): dirección original y zona del destino traducido en política de seguridad.
- [Fortinet: orden de políticas](https://community.fortinet.com/fortigate-3/technical-tip-how-policy-order-works-on-fortigate-105307): prioridad por posición y coincidencia.
- [Fortinet: firewall policy](https://docs.fortinet.com/document/fortigate/7.6.1/administration-guide/656084): visibilidad de herramientas y tráfico con aceleración hardware.

## Mantenimiento

Las lecciones, tablas, glosario y preguntas están en `public/academy-data.js`. Cambia también las notas y la documentación si varía el alcance. Mantén referencias a páginas para no confundir síntesis de la fuente con material añadido.
