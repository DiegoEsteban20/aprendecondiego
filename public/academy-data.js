export const academySource = {
  title: 'Guía de Redes y Ciberseguridad',
  author: '@DiegoMolina',
  date: '8 de octubre de 2026',
  pages: 57,
  note: 'Síntesis y adaptación del PDF aportado por el usuario. Cada lección indica las páginas de origen. Los matices editoriales y actualizaciones se identifican en la nota de fuentes. El PDF original no se publica ni se incluye en el repositorio.'
};

export const lessons = [
  {
    id: 'fundamentos', category: 'Redes', title: 'Fundamentos y rendimiento', pages: '2–4', level: 'Inicial',
    intro: 'Una red conecta dispositivos para intercambiar información siguiendo protocolos. El diseño debe equilibrar cobertura, capacidad, disponibilidad y control de acceso.',
    concepts: [
      ['Tipos de red', 'PAN conecta dispositivos personales; LAN conecta un entorno local; WLAN es su acceso inalámbrico; CAN agrupa edificios de un campus; MAN cubre un entorno metropolitano y WAN enlaza ubicaciones distantes.'],
      ['Topologías', 'Estrella centraliza conexiones; malla ofrece caminos alternativos; árbol organiza niveles de acceso, distribución y núcleo. La redundancia requiere mecanismos que eviten bucles.'],
      ['Dispositivos', 'Un switch reenvía tramas según su tabla MAC; un router decide entre redes; un AP proporciona acceso inalámbrico; un firewall aplica controles de tráfico. Un switch puede hacer flooding cuando desconoce el destino, no entrega siempre por un único puerto.'],
      ['Medios físicos', 'El cobre tiene límites de distancia y capacidad según la categoría y la instalación. La fibra permite otros alcances y evita interferencia electromagnética. Los enlaces inalámbricos dependen del espectro, obstáculos y entorno.'],
      ['Capacidad frente a experiencia', 'Ancho de banda es capacidad nominal; throughput es transferencia conseguida. Latencia es demora, jitter es su variación y pérdida es tráfico que no llega. Un ping mide normalmente tiempo de ida y vuelta, no retardo unidireccional.']
    ],
    example: 'Una videollamada puede fallar con un enlace de muchos Mbps si hay pérdida o jitter. Aumentar capacidad no corrige por sí solo interferencia o congestión en otra parte del camino.',
    practice: 'Describe una red doméstica: equipos, medio, enlace de salida y punto único de falla. Distingue qué medirías para una descarga y qué para una llamada.',
    connection: 'Las referencias del laboratorio son dependencias de configuración. No permiten medir rendimiento ni dibujar la topología física.'
  },
  {
    id: 'osi', category: 'Redes', title: 'OSI, TCP/IP y diagnóstico por capas', pages: '4–6', level: 'Inicial',
    intro: 'Los modelos por capas ayudan a separar responsabilidades y a formular hipótesis de diagnóstico. No todos los protocolos encajan de forma exclusiva en una capa.',
    concepts: [
      ['OSI', 'Física: señales. Enlace: tramas y entrega local. Red: direccionamiento y rutas. Transporte: comunicación entre procesos. Sesión: diálogo. Presentación: representación. Aplicación: protocolos que usan las aplicaciones.'],
      ['TCP/IP', 'Acceso a red reúne enlace y física; Internet proporciona IP; transporte incluye TCP y UDP; aplicación agrupa funciones de las capas superiores del modelo OSI. Es una familia de protocolos y una forma de organizarla.'],
      ['Encapsulación', 'Los datos de aplicación se transportan en segmentos o datagramas, dentro de paquetes IP y luego tramas del enlace. En cada salto puede cambiar la cabecera de enlace.'],
      ['Método práctico', 'Comprueba primero enlace y estado de interfaz; después VLAN y vecino; luego IP, máscara, gateway y rutas; a continuación transporte y finalmente DNS, TLS y servicio.']
    ],
    example: 'Si un nombre no resuelve pero el servicio responde por IP, investiga DNS antes de concluir que el firewall bloquea el puerto. Un ping fallido tampoco demuestra que HTTPS falle.',
    practice: 'Clasifica estas pistas: cable desconectado, VLAN incorrecta, gateway ausente, rechazo TCP y certificado vencido.',
    connection: 'La app ayuda a revisar direcciones y políticas declaradas. Las comprobaciones de enlace, rutas, TLS y servicio se realizan fuera de este laboratorio.'
  },
  {
    id: 'ipv4', category: 'Redes', title: 'IPv4, CIDR y subnetting', pages: '6–8', level: 'Inicial',
    intro: 'Una IPv4 tiene 32 bits. El prefijo CIDR indica cuántos identifican la red; los restantes identifican posiciones dentro de ella.',
    concepts: [
      ['Direcciones privadas', '10.0.0.0/8, 172.16.0.0/12 y 192.168.0.0/16 son espacios privados. No implican clases obligatorias: el diseño actual utiliza CIDR.'],
      ['Rangos especiales', '127.0.0.0/8 es loopback; 169.254.0.0/16 es enlace local IPv4; 100.64.0.0/10 es espacio compartido usado, por ejemplo, por operadores con CGNAT. No equivale a los rangos privados RFC 1918.'],
      ['Dividir una red', 'Dividir un /24 en cuatro partes iguales requiere dos bits adicionales: cuatro /26. Cada bloque contiene 64 direcciones. En una subred convencional quedan 62 posiciones para hosts al excluir red y broadcast.'],
      ['Excepciones importantes', 'La fórmula 2^(32 − prefijo) − 2 no se aplica igual a todos los prefijos: /31 puede usar ambos extremos en enlaces punto a punto y /32 representa una única dirección.'],
      ['VLSM y gateway', 'VLSM asigna prefijos de distintos tamaños según la demanda. El gateway debe ser alcanzable en el enlace correspondiente para enviar tráfico fuera de la red local.']
    ],
    example: '192.168.10.0/24 se divide en 192.168.10.0/26, .64/26, .128/26 y .192/26. En el primer bloque: red .0, hosts convencionales .1–.62 y broadcast .63.',
    practice: 'Busca 10.10.10.99 en el laboratorio. Debe coincidir con LAN_USERS, cuya subnet es 10.10.10.0 con máscara 255.255.255.0.',
    connection: 'La búsqueda calcula pertenencia sólo para objetos subnet IPv4 y máscara decimal contigua. No calcula planes de VLSM.'
  },
  {
    id: 'vecinos', category: 'Redes', title: 'MAC, ARP e IPv6', pages: '6, 8–9', level: 'Inicial',
    intro: 'La IP sirve para direccionamiento entre redes; la dirección MAC participa en la entrega sobre el enlace local. El siguiente salto puede ser el gateway y no el destino final.',
    concepts: [
      ['MAC', 'En Ethernet se utilizan direcciones de 48 bits. Pueden ser administradas localmente o aleatorizadas; no son una identidad inmutable ni una prueba fiable de quién usa un equipo.'],
      ['ARP', 'Resuelve direcciones IPv4 a direcciones de enlace en la red local. La caché permite reutilizar asociaciones, pero ARP no autentica por sí mismo las respuestas.'],
      ['IPv6', 'Usa direcciones de 128 bits. :: comprime una secuencia de grupos cero una sola vez. ::1 es loopback; fe80::/10 es enlace local; fc00::/7 corresponde al espacio unique local.'],
      ['Descubrimiento y configuración', 'IPv6 utiliza Neighbor Discovery mediante ICMPv6, no ARP. SLAAC y DHCPv6 tienen papeles distintos y pueden coexistir. No existe broadcast IPv6.'],
      ['Diseño y protección', 'IPv6 reduce la necesidad de conservar direcciones mediante NAT, pero sigue necesitando políticas y controles. Tener una dirección global no equivale a quedar permitido por el firewall.']
    ],
    example: 'Para un destino en otra subred, tu equipo resuelve la MAC del gateway local. El paquete mantiene la IP del destino mientras la trama se entrega al siguiente salto.',
    practice: 'Consulta tu tabla de vecinos y compara qué corresponde al gateway. No uses la MAC como único control de autenticación.',
    connection: 'IPv6 y ARP se explican como contexto. El parser y la búsqueda de pertenencia de esta versión sólo cubren el subconjunto IPv4 documentado.'
  },
  {
    id: 'transporte', category: 'Redes', title: 'TCP, UDP y puertos', pages: '9–12', level: 'Inicial',
    intro: 'El transporte conecta procesos de aplicaciones. Un puerto ayuda a distinguir servicios y conversaciones, pero el número por sí solo no demuestra qué aplicación circula.',
    concepts: [
      ['TCP', 'Proporciona un flujo de bytes ordenado con mecanismos de confirmación, retransmisión, control de flujo y congestión. Si una falla impide continuar, la conexión puede terminar: no existe garantía de que cualquier comunicación siempre se complete.'],
      ['Handshake y cierre', 'El establecimiento convencional usa SYN, SYN-ACK y ACK. FIN participa en el cierre ordenado y RST indica un reinicio. Existen extensiones y variantes; no uses el esquema básico como regla universal de toda captura.'],
      ['UDP', 'Envía datagramas sin un handshake de transporte ni retransmisión propia. La aplicación puede añadir fiabilidad y control de congestión, como ocurre con QUIC. UDP no es automáticamente más rápido en cualquier escenario.'],
      ['Puertos y sockets', 'El contexto incluye protocolo, IP y puerto. Los rangos IANA son 0–1023, 1024–49151 y 49152–65535; los rangos efímeros configurados pueden variar según el sistema.'],
      ['Aplicaciones', 'DNS usa UDP y TCP; HTTPS puede usar TCP con HTTP/1.1 o HTTP/2 y QUIC sobre UDP con HTTP/3. No reduzcas una aplicación únicamente a su transporte habitual.']
    ],
    example: 'Permitir TCP/443 no habilita automáticamente UDP/443 para HTTP/3. Tampoco garantiza que un servidor esté escuchando o que el certificado TLS sea válido.',
    practice: 'En tu propio tráfico, identifica una consulta DNS y un handshake TCP. Explica qué dato respalda cada conclusión.',
    connection: 'El inventario muestra el nombre de service declarado. No expande objetos de servicios personalizados ni inspecciona paquetes.'
  },
  {
    id: 'servicios', category: 'Redes', title: 'DNS, DHCP, HTTP y servicios esenciales', pages: '12–15', level: 'Inicial',
    intro: 'Los servicios de infraestructura permiten descubrir nombres, obtener configuración, sincronizar eventos y acceder a aplicaciones. Una falla en ellos puede parecer un problema de firewall.',
    concepts: [
      ['DNS', 'Un resolver usa caché y, cuando hace falta, consulta la jerarquía DNS. A y AAAA publican direcciones; CNAME, alias; MX, correo; NS y SOA, autoridad; PTR, resolución inversa; TXT, datos utilizados por distintos mecanismos.'],
      ['DHCPv4', 'DORA resume Discover, Offer, Request y Acknowledge. El servidor entrega una concesión y opciones como gateway y DNS. Un relay permite alcanzar servidores en otra subred.'],
      ['HTTP y TLS', 'GET consulta, POST envía para procesamiento, PUT reemplaza una representación y DELETE solicita eliminación. Los códigos 2xx, 3xx, 4xx y 5xx agrupan resultados. HTTPS protege el canal; no demuestra que el sitio sea honesto.'],
      ['Gestión y observabilidad', 'SSH proporciona administración cifrada; SNMP consulta métricas; syslog transporta eventos; NTP sincroniza relojes. Registros con tiempos incoherentes dificultan una investigación.'],
      ['Transferencia y correo', 'SFTP funciona sobre SSH y no es FTPS; FTPS agrega TLS a FTP. El envío de correo entre servidores y la presentación autenticada tienen contextos y puertos distintos.']
    ],
    example: 'Una IPv4 link-local puede indicar que el host no obtuvo una concesión DHCP, pero es una pista, no una prueba concluyente. Revisa la configuración y los logs antes de renovar una interfaz.',
    practice: 'Consulta A y MX de un dominio de prueba. Identifica el servidor que respondió y el TTL, sin confundir resolver con servidor autoritativo.',
    connection: 'Usa la pestaña Puertos como referencia. Un puerto conocido no sustituye comprobar el servicio, su cifrado y la política efectiva.'
  },
  {
    id: 'nat', category: 'Redes', title: 'NAT, PAT y publicación de servicios', pages: '15–17, 36, 41', level: 'Intermedio',
    intro: 'NAT transforma direcciones; PAT puede transformar también puertos para compartir una dirección entre conversaciones. La traducción y la autorización de tráfico resuelven problemas diferentes.',
    concepts: [
      ['SNAT y DNAT', 'SNAT modifica el origen; DNAT modifica el destino. Una redirección de puertos puede traducir dirección y puerto para llegar a un servicio interno.'],
      ['PAT', 'Una tabla de traducciones permite distinguir sesiones de varios clientes que comparten una dirección de salida. La trazabilidad requiere hora, protocolo y puertos, además de IPs.'],
      ['CGNAT', 'Puede introducir otra traducción en el operador. Publicar un servicio requiere considerar esa capa; configurar el router doméstico puede no bastar.'],
      ['Seguridad', 'NAT no reemplaza el firewall ni los controles de aplicación. Una traducción definida no prueba que el servicio sea accesible; una regla accept tampoco prueba que exista una ruta válida.']
    ],
    example: 'Para un ejemplo documental usa 203.0.113.20:443 como dirección pública ficticia y 10.20.0.10:443 como destino interno. Revisa traducción, política, rutas, retorno y servidor por separado.',
    practice: 'Dibuja origen y destino antes y después de una traducción. Añade puertos y señala qué evidencia pedirías al administrador.',
    connection: 'El analizador no procesa VIP, SNAT ni DNAT. Un nombre de VIP puede aparecer como UNRESOLVED porque falta ese tipo en el modelo.'
  },
  {
    id: 'switching', category: 'Redes', title: 'Switching, VLAN, STP y redundancia', pages: '17–19', level: 'Intermedio',
    intro: 'La segmentación de capa 2 reduce dominios de broadcast. Para controlar comunicaciones entre segmentos también se necesitan políticas de capa 3 y controles de acceso.',
    concepts: [
      ['Aprendizaje MAC', 'Un switch aprende la MAC de origen en el puerto de entrada. Si no conoce un destino unicast puede inundar la trama dentro de la VLAN.'],
      ['Access y trunk', 'Un puerto access se asocia normalmente a una VLAN de datos; un trunk transporta varias mediante 802.1Q. La VLAN nativa requiere coherencia entre extremos y puede tener tratamiento configurable de etiquetado.'],
      ['Inter-VLAN', 'La comunicación entre VLAN requiere enrutamiento. No es seguro asumir que separar VLAN impide todo movimiento lateral si después se permite libremente el tráfico entre ellas.'],
      ['STP y protecciones', 'STP evita bucles manteniendo una topología lógica sin ciclos. RSTP mejora la convergencia. Las funciones de borde y BPDU Guard se aplican conforme al rol y diseño del puerto.'],
      ['Agregación', 'LACP puede agrupar enlaces y aportar redundancia. El reparto suele usar un hash: un solo flujo no necesariamente obtiene la suma del ancho de banda de todos los miembros.']
    ],
    example: 'Una VLAN de cámaras y una VLAN de usuarios quedan separadas en capa 2; una regla amplia en el enrutamiento entre ambas puede volver a permitir tráfico innecesario.',
    practice: 'Relaciona cada VLAN con su subred, gateway y control inter-VLAN. Documenta dónde se filtra el tráfico.',
    connection: 'Los objetos de direcciones pueden representar estas subredes, pero la aplicación no comprueba que una VLAN o trunk exista en un switch.'
  },
  {
    id: 'routing', category: 'Redes', title: 'Routing, OSPF, BGP y gateway redundante', pages: '19–20', level: 'Intermedio',
    intro: 'La selección de ruta depende del prefijo de destino y de las rutas instaladas. La política de seguridad no puede sustituir la validación del camino de ida y vuelta.',
    concepts: [
      ['Prefijo más largo', 'Entre rutas instaladas que coinciden, una ruta más específica prevalece sobre una menos específica. 0.0.0.0/0 es la ruta por defecto.'],
      ['Estáticas y dinámicas', 'Las estáticas se configuran explícitamente; los protocolos dinámicos intercambian información y reaccionan a cambios según sus mecanismos.'],
      ['Preferencia de origen', 'La distancia administrativa o preferencia ayuda a elegir fuentes de rutas comparables; sus valores dependen del fabricante. Una tabla de valores Cisco no se aplica universalmente.'],
      ['OSPF y BGP', 'OSPF mantiene información de estado de enlace dentro de áreas. BGP intercambia prefijos y aplica atributos y políticas; no elige simplemente el camino con menos saltos físicos.'],
      ['Gateway redundante', 'Protocolos como VRRP o HSRP permiten un gateway virtual. Esa disponibilidad no garantiza por sí sola la sincronización de sesiones de un firewall.']
    ],
    example: 'Una ruta específica al servidor puede enviar el tráfico por otro enlace aunque exista una ruta por defecto correcta. Un retorno asimétrico puede afectar el estado de la sesión.',
    practice: 'Dadas 10.0.0.0/8 y 10.20.0.0/24, decide qué ruta coincide mejor con 10.20.0.10. Explica por qué no basta leer una regla accept.',
    connection: 'La aplicación compara reglas declaradas; no importa tablas de rutas ni calcula siguiente salto.'
  },
  {
    id: 'wifi', category: 'Redes', title: 'Wi-Fi y acceso inalámbrico seguro', pages: '20–22', level: 'Inicial',
    intro: 'La calidad inalámbrica depende del diseño de radio y de la capacidad compartida, además de la intensidad de señal. La seguridad incluye autenticación, segmentación y administración.',
    concepts: [
      ['Bandas y canales', '2,4, 5 y 6 GHz tienen características de propagación y disponibilidad diferentes. Los canales y potencias permitidos dependen del país y del equipo; no existe un único plan válido en todos los entornos.'],
      ['RSSI y experiencia', 'RSSI expresa señal recibida; debe interpretarse junto a ruido, SNR, retransmisiones, utilización y requisitos de la aplicación. Un umbral aislado no certifica calidad de voz.'],
      ['SSID, BSSID y roaming', 'SSID nombra el servicio; BSSID identifica una instancia de red inalámbrica. El roaming depende de cliente, AP y configuración; no garantiza cero interrupción.'],
      ['Protección', 'Distingue mecanismos personales y empresariales con 802.1X. No bases la protección en ocultar SSID o filtrar MAC. Separa invitados de gestión y recursos internos.'],
      ['Amenazas', 'Un AP no autorizado o una red que imita el nombre legítimo puede engañar a usuarios. Verifica autenticación, certificados en entornos empresariales y contexto de conexión.']
    ],
    example: 'Un cliente con señal fuerte puede sufrir congestión porque muchos equipos comparten el canal. Cambiar una regla de firewall no resuelve la contención de radio.',
    practice: 'Prepara un inventario de SSID, VLAN asociada y acceso permitido, sin publicar contraseñas ni ubicaciones sensibles.',
    connection: 'El laboratorio explica segmentación; no obtiene métricas de AP ni valida WPA o controladores WLAN.'
  },
  {
    id: 'principios', category: 'Seguridad', title: 'CIA, AAA, riesgo y mínimo privilegio', pages: '22–25', level: 'Inicial',
    intro: 'La seguridad protege confidencialidad, integridad y disponibilidad. Un control debe responder a un riesgo y a una necesidad del negocio, no sólo a una lista de productos.',
    concepts: [
      ['CIA', 'Confidencialidad limita quién ve la información; integridad limita cambios no autorizados; disponibilidad busca que el servicio esté accesible cuando se necesita.'],
      ['AAA', 'Autenticación verifica identidad, autorización define permisos y accounting registra actividades. MFA combina factores de categorías diferentes; dos contraseñas no son dos factores independientes.'],
      ['Riesgo', 'Relaciona amenaza, vulnerabilidad, probabilidad y consecuencias. Probabilidad × impacto puede servir como modelo simplificado, no como cálculo universal preciso.'],
      ['Diseño', 'Mínimo privilegio, separación de funciones, defensa en profundidad y configuración segura por defecto reducen la dependencia de una única barrera.'],
      ['Controles', 'Pueden ser técnicos, organizacionales o físicos; pueden prevenir, detectar o corregir. Un control compensatorio exige justificar qué riesgo cubre y qué permanece.']
    ],
    example: 'Una regla temporal all → all puede resolver un síntoma y aumentar el alcance de acceso. Documentar responsable, objetivo y fecha de revisión permite gestionar esa excepción.',
    practice: 'Para una regla, escribe quién la necesita, para qué servicio, desde dónde, hasta cuándo y qué evidencia permitirá retirarla.',
    connection: 'ANY_ANY prioriza revisión por amplitud explícita. Su prioridad high no es una puntuación CVSS ni una medida completa del riesgo empresarial.'
  },
  {
    id: 'amenazas', category: 'Seguridad', title: 'Amenazas y señales de investigación', pages: '25–28', level: 'Inicial',
    intro: 'Comprender una amenaza ayuda a identificar evidencias y controles. Esta lección describe objetivos y defensa, sin ejecutar ataques.',
    concepts: [
      ['Malware', 'Ransomware, troyanos, gusanos, spyware y botnets tienen comportamientos y vías de propagación diferentes. Respaldos probados, parches, segmentación y detección se complementan.'],
      ['Ingeniería social', 'Phishing, suplantación de proveedores y mensajes urgentes intentan inducir acciones. Confirma solicitudes sensibles por un canal independiente. La ausencia de faltas ortográficas no vuelve legítimo un mensaje.'],
      ['Red', 'DDoS afecta disponibilidad; manipulación ARP o DNS puede redirigir comunicaciones; servicios expuestos amplían superficie. Los controles deben corresponder al mecanismo y al alcance.'],
      ['Credenciales', 'Reutilización de contraseñas, spraying y robo de sesiones requieren controles distintos. MFA, credenciales únicas, detección y gestión de sesiones reducen riesgos sin eliminarlos por completo.'],
      ['Aplicaciones', 'Inyección SQL, XSS, CSRF y autorización rota ilustran fallos diferentes: consultas parametrizadas, codificación de salida contextual, protección de solicitudes y verificación de permisos son controles específicos.']
    ],
    example: 'Una conexión a una IP sospechosa es una pista que debe correlacionarse con proceso, hora, DNS y contexto. La reputación de una dirección compartida no demuestra por sí sola compromiso.',
    practice: 'Separa en una nota de investigación lo observado, la hipótesis y la evidencia aún necesaria. No llames incidente confirmado a cualquier hallazgo estático.',
    connection: 'La app no detecta malware, no consulta inteligencia de amenazas ni realiza escaneo de vulnerabilidades.'
  },
  {
    id: 'defensas', category: 'Seguridad', title: 'Firewall, IDS/IPS, DMZ y VPN', pages: '28–31, 33', level: 'Intermedio',
    intro: 'Cada defensa tiene un objetivo y una ubicación. Permitir una sesión, inspeccionar contenido y autenticar un usuario son decisiones complementarias.',
    concepts: [
      ['Tipos de firewall', 'El filtrado de paquetes usa cabeceras; un firewall stateful mantiene estado; un proxy intermedia comunicaciones; un NGFW añade identificación e inspecciones. Un WAF se orienta a aplicaciones web.'],
      ['IDS e IPS', 'IDS alerta sobre actividad observada; IPS puede bloquear en su camino de inspección. Firmas y comportamiento pueden producir falsos positivos y negativos. Zeek aporta análisis y telemetría; no es equivalente a todo motor IPS.'],
      ['DMZ', 'Separa servicios publicados de recursos internos. El aislamiento depende de reglas y rutas efectivas: una etiqueta dmz no establece una barrera por sí sola.'],
      ['VPN', 'Un túnel protege comunicaciones entre sus extremos. Site-to-site conecta redes; acceso remoto conecta usuarios o equipos. Una VPN no impide phishing ni convierte automáticamente el endpoint en confiable.'],
      ['Complementos', 'EDR aporta visibilidad del endpoint; NAC controla acceso; DLP trata flujos de datos; respaldos y restauraciones probadas sostienen recuperación.']
    ],
    example: 'Un servicio HTTPS en la DMZ necesita políticas limitadas y controles del servidor. Permitir administración libre desde toda la LAN también puede ser excesivo.',
    practice: 'Propón una matriz mínima LAN, DMZ, WAN y gestión: origen, destino, aplicación, motivo, logging y responsable.',
    connection: 'El inventario permite leer campos de reglas simples. No evalúa inspección, estado de sesiones, autenticación o políticas VPN.'
  },
  {
    id: 'criptografia', category: 'Seguridad', title: 'TLS, certificados, hashes y firmas', pages: '31–33', level: 'Intermedio',
    intro: 'Cifrado, integridad y autenticación cumplen objetivos diferentes. Evita interpretar un icono de conexión segura como garantía de confianza en el contenido del sitio.',
    concepts: [
      ['Cifrado simétrico', 'Utiliza claves compartidas para proteger datos de forma eficiente. Su seguridad depende también del modo, manejo de claves y nonces, no sólo del nombre del algoritmo.'],
      ['Criptografía asimétrica', 'Incluye mecanismos de firma y de establecimiento de secretos. No todas las primitivas asimétricas sirven para cifrar y no todas funcionan como cifrar con una clave y descifrar con la otra.'],
      ['TLS', 'Negocia parámetros, autentica según el contexto y establece claves de tráfico. En TLS moderno se combinan mecanismos de intercambio de claves y autenticación con cifrado autenticado de los datos.'],
      ['Hash y firma', 'Un hash ayuda a comparar integridad, pero por sí solo no autentica el origen. Una firma usa un algoritmo específico y clave privada para que otros verifiquen con la pública; no se define universalmente como cifrar un hash.'],
      ['PKI', 'Un certificado vincula una identidad con una clave pública bajo una cadena de confianza. Revisa nombre, vigencia y validación. No ignores una advertencia sin investigar su causa.']
    ],
    example: 'Guardar el hash de un reporte ayuda a identificar si cambió. Para demostrar su procedencia necesitas además un mecanismo de confianza, por ejemplo una firma verificable.',
    practice: 'Distingue qué protege un certificado TLS y qué no protege si el servidor o el usuario ya están comprometidos.',
    connection: 'El servidor del laboratorio usa HTTP en loopback y no debe publicarse como plataforma remota. No inspecciona TLS ni gestiona certificados.'
  },
  {
    id: 'fortinet', category: 'Fabricantes', title: 'Fortinet: políticas y ecosistema', pages: '33–38', level: 'Intermedio',
    intro: 'El PDF presenta FortiGate y FortiOS como base de funciones de red y seguridad, junto a herramientas de gestión, logs, acceso y protección. Capacidades y disponibilidad varían por producto y versión.',
    concepts: [
      ['Componentes', 'FortiGate aplica controles; FortiManager centraliza gestión; FortiAnalyzer se orienta a logs y análisis; FortiClient y EMS se relacionan con endpoints; FortiAP y FortiSwitch cubren acceso. Son papeles generales, no una lista de licencias garantizadas.'],
      ['Política', 'Revisa interfaces o zonas, direcciones, horario, servicios, acción, registro y perfiles. La posición en el conjunto de políticas importa; el ID no expresa necesariamente el orden.'],
      ['Perfiles', 'Antivirus, filtrado web/DNS, control de aplicaciones, IPS e inspección TLS agregan controles distintos. Una política accept no implica que cualquiera de esos perfiles esté activo.'],
      ['NAT', 'La traducción puede involucrar NAT de política, pools, VIP o Central NAT según diseño. Una referencia a VIP no equivale a un objeto subnet simple.'],
      ['Ámbitos y operación', 'VDOM separa contextos lógicos. HA, SD-WAN, VPN y aceleración de hardware requieren interpretar el modelo y las opciones del equipo. No asumas que toda captura ve todo el tráfico procesado.']
    ],
    example: 'Una revisión documental puede comenzar por show firewall policy y las secciones address/addrgrp del mismo ámbito. El laboratorio no acepta el backup completo con VDOM u otros bloques.',
    practice: 'En los tres fixtures, identifica por qué cada regla existe y cuál es el dato que respalda el hallazgo. Revisa después qué campos no evalúa el parser.',
    connection: 'FortiOS tiene soporte parcial de análisis en este proyecto. VPN, VDOM, rutas, perfiles, NAT y conexión directa a FortiGate siguen fuera del modelo.'
  },
  {
    id: 'paloalto', category: 'Fabricantes', title: 'Palo Alto: zonas, App-ID y commit', pages: '38–43', level: 'Intermedio',
    intro: 'Esta sección es material de estudio de PAN-OS. No habilita análisis de archivos Palo Alto ni conexión a sus APIs en Firewall Detective.',
    concepts: [
      ['Identificación', 'App-ID busca clasificar aplicaciones; User-ID aporta contexto de usuarios; los perfiles de seguridad inspeccionan amenazas y contenido. La precisión depende de visibilidad, configuración y firmas.'],
      ['Zonas y políticas', 'Las reglas expresan zonas, direcciones, aplicaciones, servicios y acciones. Los tipos de interfaz y el contexto de enrutamiento condicionan el camino. No conviertas automáticamente una interfaz FortiOS en una zona PAN-OS.'],
      ['Service y aplicación', 'application-default vincula el servicio con puertos definidos para la aplicación. No significa permitir cualquier aplicación ni elimina la necesidad de perfiles y revisión.'],
      ['NAT separado', 'La política NAT y la de seguridad tienen propósitos diferentes. En el ejemplo de DNAT documentado, la regla de seguridad usa la dirección de destino original y la zona del destino traducido. Confirma el caso en la documentación de tu versión.'],
      ['Candidate y running', 'Los cambios se preparan en candidate y se activan mediante commit. En una gestión centralizada intervienen también ámbitos y operaciones de distribución. Planificar y revisar el cambio sigue siendo necesario.'],
      ['Acceso y sesiones', 'GlobalProtect distingue portal y gateway. Para investigar se relacionan políticas, sesiones, rutas, traducciones y logs; una prueba de policy-match no sustituye toda la evidencia operativa.']
    ],
    example: 'Ejemplo ficticio DNAT: cliente hacia 203.0.113.20, traducido a 10.20.0.10 en dmz. No intercambies sin revisar los campos pre-NAT y post-NAT de la regla de seguridad.',
    practice: 'Compara el rol de un grupo de direcciones, una zona, una regla de seguridad y una regla NAT. Explica qué dato necesitarías para migrarlos entre fabricantes.',
    connection: 'PAN-OS está documentado como teoría. El parser XML, el modelo de vsys y los conectores reales siguen pendientes.'
  },
  {
    id: 'equivalencias', category: 'Fabricantes', title: 'Fortinet y Palo Alto: equivalencias de trabajo', pages: '43–45', level: 'Intermedio',
    intro: 'Las equivalencias orientan una conversación técnica, pero no garantizan migración uno a uno. Evita decidir por afirmaciones generales de precio, rendimiento o superioridad comercial.',
    concepts: [
      ['Gestión', 'FortiManager y FortiAnalyzer separan papeles de gestión y logs en el ecosistema Fortinet; Panorama es una referencia de gestión en Palo Alto. Revisa el alcance de cada producto y despliegue.'],
      ['Identidad y aplicaciones', 'Application Control y App-ID, o fuentes de identidad Fortinet y User-ID, responden a necesidades relacionadas con implementaciones y semánticas diferentes.'],
      ['Ámbitos', 'VDOM y vsys son conceptos de separación lógica, pero sus capacidades, recursos y límites no son idénticos.'],
      ['Traducción', 'VIP y regla NAT de destino pueden perseguir publicar un servicio. En la migración hay que reconstruir correspondencias con políticas, zonas, rutas y puertos.'],
      ['Cambios', 'Los mecanismos de aplicación de cambios no son intercambiables. Documenta cómo se revisa, activa y revierte una modificación en el producto real.']
    ],
    example: 'Migrar una regla exige preservar intención: quién accede a qué aplicación, por qué, con qué traducción y qué controles. Copiar nombres no conserva automáticamente ese comportamiento.',
    practice: 'Crea una ficha de migración con intención, origen, destino, aplicación, servicio, NAT, logging, responsable y prueba de aceptación.',
    connection: 'El proyecto aún no es un conversor de fabricantes. La comparación actual es entre dos textos del subconjunto FortiOS.'
  },
  {
    id: 'soc', category: 'Operación', title: 'SOC, SIEM, SOAR y respuesta a incidentes', pages: '46–48', level: 'Intermedio',
    intro: 'Un SOC combina personas, procesos y tecnología para detectar, investigar y responder. Una alerta necesita contexto antes de convertirse en una conclusión.',
    concepts: [
      ['Herramientas y roles', 'Un SIEM centraliza y correlaciona eventos; un SOAR organiza automatizaciones; un EDR aporta evidencia de endpoints. Los equipos definen sus propios niveles de triage, investigación y escalamiento.'],
      ['Evento, alerta e incidente', 'Un evento es un hecho registrado. Una alerta es una señal que merece evaluación. Un incidente requiere valorar afectación y criterios de respuesta; no toda alerta es incidente.'],
      ['Evidencia', 'IOC puede ser una señal útil, no una prueba concluyente aislada. Correlaciona IP, proceso, usuario, hora, DNS, sesión y activo. NTP y zonas horarias importan.'],
      ['Respuesta', 'Prepara capacidades, detecta y analiza, contiene según autorización, elimina causas y recupera. Conserva una cronología y mejora el proceso con lo aprendido.'],
      ['Actualización de referencia', 'El ciclo de cuatro fases descrito en el PDF es un esquema histórico útil. NIST SP 800-61 Rev. 3, publicado en abril de 2025, integra la respuesta a incidentes con CSF 2.0; no debe presentarse el ciclo anterior como toda la versión vigente.'],
      ['Custodia', 'Registra procedencia, hora, método, transformaciones y responsables al recolectar evidencia. Un hash ayuda a comprobar igualdad, pero no sustituye un procedimiento de custodia.']
    ],
    example: 'Si se observa un destino sospechoso, crea una cronología y confirma su contexto. Antes de aislar o bloquear, considera impacto, permisos, evidencias y el plan de respuesta.',
    practice: 'Redacta un ticket ficticio con hecho observado, alcance, hipótesis, evidencias faltantes, decisión y siguiente responsable.',
    connection: 'El JSON exportado es un artefacto de revisión estática, no un reporte forense completo ni una confirmación automática de incidente.'
  },
  {
    id: 'marcos', category: 'Operación', title: 'Marcos, Zero Trust y hardening', pages: '49–51', level: 'Intermedio',
    intro: 'Los marcos organizan decisiones y responsabilidades; las guías de hardening ayudan a reducir exposición. Ninguna lista de controles certifica por sí sola la seguridad de una organización.',
    concepts: [
      ['CSF 2.0', 'Gobernar, Identificar, Proteger, Detectar, Responder y Recuperar permiten ordenar actividades. Una revisión de reglas aporta evidencia limitada dentro de un programa más amplio.'],
      ['ISO, CIS, MITRE y OWASP', 'Un sistema de gestión, controles priorizados, conocimiento de comportamientos y riesgos de aplicaciones tienen objetivos distintos. Comprueba edición y alcance cuando los uses formalmente.'],
      ['Zero Trust', 'No se concede confianza sólo por ubicación en red. Se evalúan identidad, dispositivo, recurso y política, con permisos limitados y revisión del contexto. No es un producto único ni significa repetir contraseñas para cada paquete.'],
      ['Hardening', 'Reduce servicios y permisos innecesarios, separa gestión, actualiza, verifica registros y limita acceso administrativo. Conserva una vía de recuperación antes de cambiar controles de acceso.'],
      ['Vulnerabilidades y respaldo', 'Inventaría, identifica problemas, prioriza por contexto y exposición, corrige y verifica. Prueba restauraciones: tener copias no demuestra que sean recuperables.']
    ],
    example: 'Una política de gestión puede exigir acceso sólo desde una red administrativa, identidad individual, registro y revisión periódica. Es más concreta que marcar un equipo como seguro.',
    practice: 'Escribe un checklist con responsable y evidencia para cinco controles. Evita reducir la aceptación a una casilla sin verificación.',
    connection: 'Los hallazgos ayudan a orientar revisiones, pero no certifican cumplimiento de NIST, ISO, CIS ni obligaciones legales.'
  },
  {
    id: 'diagnostico', category: 'Operación', title: 'Diagnóstico y práctica sin hardware', pages: '37–38, 42, 45, 52–54', level: 'Aplicado',
    intro: 'Una secuencia de diagnóstico reproducible evita cambiar varias cosas a la vez. Documenta qué esperas observar y qué hipótesis confirma o descarta cada comprobación.',
    concepts: [
      ['Secuencia', 'Revisa IP, máscara, gateway y DNS; comprueba alcance local; verifica rutas y transporte; consulta nombres y finalmente el servicio. ICMP puede filtrarse, por lo que ping es una prueba parcial.'],
      ['Captura y sesiones', 'Una captura de tu laboratorio puede mostrar DNS, DHCP o TCP. La ausencia de un paquete en una herramienta concreta puede depender del punto de captura, filtros o aceleración del equipo.'],
      ['Comandos', 'La biblioteca separa entorno, propósito y observaciones. Son referencias para ejecutar conscientemente donde corresponda; la web no los ejecuta.'],
      ['Práctica', 'Empieza con los casos sintéticos de esta app. Para virtualización, obtén imágenes y permisos de uso por los canales oficiales; no se incluyen imágenes ni se garantiza acceso gratuito a licencias.'],
      ['Cambios controlados', 'Separa observación y modificación. Establece estado previo, cambio propuesto, prueba, criterio de aceptación y reversión. No pegues bloques de configuración sin revisar su contexto.']
    ],
    example: 'Un TCP/443 rechazado puede tener una causa distinta a un timeout. Registra respuesta, momento y destino exacto antes de modificar una política.',
    practice: 'Resuelve los tres casos y explica la evidencia sin revelar primero la solución. Después cambia un único campo y compara el resultado.',
    connection: 'El botón Abrir laboratorio lleva a los fixtures locales. Ninguna lección ejecuta escaneos o conecta con equipos.'
  }
];

export const ports = [
  ['FTP', '20/21', 'TCP', 'Control y transferencia de archivos; los canales de datos dependen del modo.', 'No confundir con SFTP o FTPS.'],
  ['SSH / SFTP', '22', 'TCP', 'Administración remota y transferencia sobre SSH.', 'Limitar orígenes de administración.'],
  ['Telnet', '23', 'TCP', 'Terminal sin cifrado de transporte.', 'No usar para exponer credenciales.'],
  ['SMTP', '25', 'TCP', 'Intercambio de correo entre servidores.', 'No implica autenticación de presentación.'],
  ['DNS', '53', 'UDP / TCP', 'Consultas y otras operaciones DNS.', 'Ambos transportes importan; existen variantes cifradas en otros puertos.'],
  ['DHCPv4', '67/68', 'UDP', 'Asignación de configuración IPv4.', 'Servidor 67, cliente 68; considerar relay.'],
  ['TFTP', '69', 'UDP', 'Transferencia simple de archivos.', 'No incorpora protección equivalente a SSH.'],
  ['HTTP', '80', 'TCP', 'Web sin TLS en su uso convencional.', 'No enviar secretos por un canal sin protección.'],
  ['Kerberos', '88', 'UDP / TCP', 'Autenticación en entornos de dominio.', 'La sincronización de tiempo importa.'],
  ['POP3', '110 / 995', 'TCP', 'Acceso a correo; 995 para TLS implícito.', 'Verificar el modo de protección configurado.'],
  ['NTP', '123', 'UDP', 'Sincronización de reloj.', 'Base para correlacionar logs.'],
  ['IMAP', '143 / 993', 'TCP', 'Acceso a buzones; 993 para TLS implícito.', 'No confundir cifrado implícito con STARTTLS.'],
  ['SNMP', '161/162', 'UDP habitual', 'Consultas y notificaciones de monitoreo.', '161 consulta, 162 notificación; revisar versión y protección.'],
  ['LDAP / LDAPS', '389 / 636', 'TCP habitual', 'Acceso a directorio; 636 para TLS implícito.', 'LDAP también puede negociar TLS según implementación.'],
  ['HTTPS', '443', 'TCP / UDP', 'Web protegida con TLS; HTTP/3 usa QUIC sobre UDP.', 'Un puerto no demuestra aplicación ni legitimidad del destino.'],
  ['SMB', '445', 'TCP', 'Compartición de recursos.', 'Revisar segmentación y acceso necesario.'],
  ['Syslog', '514 / 6514', 'UDP habitual / TCP con TLS', 'Transporte de eventos; 6514 es referencia para syslog sobre TLS.', 'Verificar transporte y configuración del receptor.'],
  ['SMTP submission', '587', 'TCP', 'Presentación de correo al servicio de envío.', 'Verificar autenticación y negociación TLS.'],
  ['RADIUS', '1812/1813', 'UDP habitual', 'Autenticación/autorización y accounting.', '1812 acceso y 1813 accounting en el uso habitual.'],
  ['MySQL', '3306', 'TCP', 'Acceso a base de datos.', 'Evitar alcance más amplio que el requerido.'],
  ['RDP', '3389', 'TCP / UDP', 'Escritorio remoto.', 'El despliegue puede usar ambos transportes; restringir acceso.'],
  ['ICMP', 'Sin puertos', 'IP', 'Mensajes de control y error.', 'Filtrar por tipo/código, no tratarlo como un puerto TCP/UDP.']
];

export const commands = [
  ['Windows', 'ipconfig /all', 'Revisar IP, máscara, gateway, DNS y DHCP.', 'Puede revelar detalles internos del equipo.'],
  ['Windows', 'ping 192.168.1.1', 'Comprobar respuesta ICMP del gateway ficticio.', 'Sustituye la dirección; ausencia de respuesta no prueba caída.'],
  ['Windows', 'tracert 192.0.2.10', 'Observar respuestas de saltos hacia una dirección de documentación.', 'Ejemplo para adaptar a tu laboratorio; filtros pueden ocultar saltos.'],
  ['Windows', 'nslookup example.com', 'Consultar resolución DNS.', 'Identifica qué servidor respondió.'],
  ['Windows', 'Test-NetConnection 192.0.2.10 -Port 443', 'Probar conexión TCP a un destino de laboratorio.', 'PowerShell; no valida TLS ni prueba UDP/443.'],
  ['Windows', 'route print', 'Consultar tabla de rutas del host.', 'No muestra las rutas de todos los routers del camino.'],
  ['Windows', 'arp -a', 'Consultar caché ARP IPv4.', 'Entradas de vecinos no prueban su identidad.'],
  ['Windows', 'netstat -ano', 'Ver conexiones y puertos con PID.', 'Correlaciona PID con proceso para interpretar.'],
  ['Linux', 'ip address show', 'Consultar direcciones y estado de interfaces.', 'Linux; macOS usa herramientas diferentes.'],
  ['Linux', 'ip route show', 'Consultar rutas IPv4.', 'El contexto puede cambiar con namespaces y reglas de routing.'],
  ['Linux', 'ip neigh show', 'Consultar vecinos de enlace.', 'No equivale a un inventario completo de red.'],
  ['Linux', 'ss -tuln', 'Consultar sockets TCP/UDP en escucha.', 'Una escucha local no demuestra acceso desde otra red.'],
  ['Linux', 'dig example.com A', 'Consultar un registro DNS A.', 'Requiere la herramienta instalada.'],
  ['Cisco IOS', 'show ip interface brief', 'Ver resumen de IP y estado de interfaces.', 'La sintaxis y disponibilidad dependen de plataforma.'],
  ['Cisco IOS', 'show vlan brief', 'Revisar VLAN y puertos de acceso.', 'No muestra por sí solo todo el alcance de un trunk.'],
  ['Cisco IOS', 'show interfaces trunk', 'Revisar troncales y VLAN transportadas.', 'Relacionar ambos extremos del enlace.'],
  ['Cisco IOS', 'show ip route', 'Consultar tabla de enrutamiento.', 'Distinguir ruta instalada de aprendizaje del protocolo.'],
  ['Cisco IOS', 'show mac address-table', 'Consultar asociaciones MAC/puerto.', 'Puede contener entradas dinámicas y estáticas.'],
  ['Cisco IOS', 'show spanning-tree', 'Consultar estado de STP.', 'Interpretar por VLAN o instancia según diseño.'],
  ['Cisco IOS', 'show access-lists', 'Revisar ACL declaradas y contadores disponibles.', 'Comprobar también dónde están aplicadas.'],
  ['FortiGate', 'get system status', 'Consultar versión y datos del equipo.', 'La salida puede incluir número de serie; anonimiza al compartir.'],
  ['FortiGate', 'show firewall policy', 'Consultar políticas configuradas del contexto actual.', 'Puede incluir opciones que el parser de esta app no interpreta.'],
  ['FortiGate', 'get router info routing-table all', 'Consultar tabla de rutas.', 'Verificar VDOM y motor de routing del entorno.'],
  ['FortiGate', 'diagnose sys session list', 'Consultar sesiones activas.', 'La salida puede ser extensa; no ejecutar desde esta web.'],
  ['FortiGate', 'get vpn ipsec tunnel summary', 'Consultar resumen de túneles IPsec.', 'Un túnel establecido no confirma conectividad de aplicación.'],
  ['PAN-OS', 'show system info', 'Consultar información del sistema.', 'Datos sensibles como serial y versión deben anonimizarse.'],
  ['PAN-OS', 'show interface all', 'Consultar interfaces.', 'Interpretar tipo de interfaz y su contexto.'],
  ['PAN-OS', 'show routing route', 'Consultar rutas en plataformas compatibles.', 'La sintaxis puede variar con el motor y la versión.'],
  ['PAN-OS', 'show session all', 'Consultar sesiones.', 'No demuestra por sí solo que el servicio funcione correctamente.'],
  ['PAN-OS', 'show running security-policy', 'Consultar política activa en entornos compatibles.', 'Distinguir configuración candidate y running.'],
  ['PAN-OS', 'show vpn ipsec-sa', 'Consultar asociaciones IPsec.', 'Revisar además rutas, políticas y extremo remoto.']
];

export const glossary = [
  ['ACL', 'Lista de condiciones y acciones para controlar tráfico.'], ['AES', 'Familia de algoritmos de cifrado simétrico.'],
  ['ARP', 'Resolución IPv4 a dirección de enlace en la red local.'], ['App-ID', 'Identificación de aplicaciones en el ecosistema Palo Alto.'],
  ['BGP', 'Protocolo de intercambio de rutas con atributos y políticas.'], ['Broadcast', 'Entrega a todos los participantes de un dominio de difusión.'],
  ['CIDR', 'Representación de redes por prefijo /n sin clases obligatorias.'], ['CIA', 'Confidencialidad, integridad y disponibilidad.'],
  ['CVE', 'Identificador de un registro de vulnerabilidad divulgado.'], ['CVSS', 'Sistema de puntuación de severidad de vulnerabilidades; no reemplaza el análisis de riesgo.'],
  ['DDoS', 'Denegación de servicio distribuida.'], ['DHCP', 'Protocolo para entregar configuración de red.'],
  ['DMZ', 'Segmento destinado a separar servicios publicados de otros recursos.'], ['DNAT', 'Traducción de dirección de destino.'],
  ['DNS', 'Sistema distribuido de nombres y registros de dominio.'], ['EDR', 'Detección y respuesta con visibilidad en endpoints.'],
  ['FQDN', 'Nombre de dominio completamente calificado.'], ['Gateway', 'Siguiente salto utilizado para llegar fuera del segmento correspondiente.'],
  ['HA', 'Alta disponibilidad: mecanismos para reducir interrupciones ante fallas.'], ['Hash', 'Resumen de datos que permite comparar integridad; no autentica por sí solo al autor.'],
  ['IDS', 'Detección de intrusiones con generación de señales o alertas.'], ['IOC', 'Indicador que aporta una pista de posible compromiso y necesita contexto.'],
  ['IPS', 'Prevención de intrusiones con capacidad de bloquear según inspección.'], ['IPsec', 'Conjunto de protocolos para proteger comunicaciones IP.'],
  ['Jitter', 'Variación del retardo de entrega.'], ['LACP', 'Protocolo para negociar agregación de enlaces.'],
  ['Latencia', 'Demora de comunicación; debe especificarse qué trayecto se mide.'], ['MAC', 'Dirección usada en el enlace; puede ser administrada localmente o aleatorizada.'],
  ['MFA', 'Autenticación con factores de categorías diferentes.'], ['MTU', 'Tamaño máximo de unidad de transmisión para una interfaz o contexto.'],
  ['NAT', 'Traducción de direcciones; no es equivalente a autorización.'], ['NDP', 'Descubrimiento de vecinos y funciones relacionadas en IPv6.'],
  ['NGFW', 'Firewall con funciones adicionales de identificación e inspección.'], ['NTP', 'Protocolo de sincronización de tiempo.'],
  ['OSPF', 'Protocolo de enrutamiento de estado de enlace organizado en áreas.'], ['PAT', 'Traducción que utiliza puertos para distinguir conversaciones.'],
  ['PKI', 'Infraestructura de certificados, claves y confianza.'], ['RSSI', 'Medida de intensidad de señal recibida, insuficiente por sí sola para evaluar calidad.'],
  ['SIEM', 'Plataforma para centralizar, normalizar y correlacionar eventos.'], ['SNAT', 'Traducción de dirección de origen.'],
  ['SOC', 'Personas, procesos y herramientas para operaciones de seguridad.'], ['SOAR', 'Orquestación y automatización de tareas de respuesta.'],
  ['STP', 'Mecanismo de topología lógica para evitar bucles de capa 2.'], ['Subnetting', 'División de un bloque de direcciones en prefijos más específicos.'],
  ['TCP', 'Transporte de flujo de bytes ordenado con mecanismos de fiabilidad.'], ['TLS', 'Protocolo para proteger comunicaciones y autenticar según el contexto.'],
  ['UDP', 'Transporte de datagramas sin retransmisión propia ni handshake de conexión.'], ['User-ID', 'Contexto de identidad de usuarios para políticas en Palo Alto.'],
  ['VDOM', 'Ámbito lógico de FortiOS; su sintaxis no está soportada por el parser actual.'], ['VIP', 'Objeto Fortinet usado en escenarios de traducción de destino; fuera del modelo actual.'],
  ['VLAN', 'Segmentación lógica de capa 2.'], ['VPN', 'Conexión virtual protegida entre extremos según su implementación.'],
  ['Vsys', 'Sistema virtual en PAN-OS; no es conversión directa de cualquier VDOM.'], ['WAF', 'Control orientado a tráfico de aplicaciones web.'],
  ['Zero Trust', 'Enfoque que no otorga confianza sólo por ubicación y evalúa accesos por contexto.']
];

export const questions = [
  { question: '¿Qué demuestra una política accept en un archivo?', options: ['Que el servicio responde desde Internet', 'Que existe una intención de permitir según condiciones declaradas', 'Que no hacen falta rutas'], correct: 1, explanation: 'La política declarada no prueba alcance efectivo, rutas, NAT, estado ni disponibilidad de aplicación.', lesson: 'defensas' },
  { question: '¿Cuántos hosts convencionales caben en cada /26 de un /24?', options: ['64', '126', '62'], correct: 2, explanation: 'Un /26 tiene 64 direcciones; en una subred convencional se excluyen red y broadcast. /31 y /32 tienen tratamiento diferente.', lesson: 'ipv4' },
  { question: '¿Permitir TCP/443 habilita automáticamente HTTP/3?', options: ['Sí, cualquier puerto 443 es igual', 'No, HTTP/3 utiliza QUIC sobre UDP', 'Sí, si la regla tiene logging'], correct: 1, explanation: 'El protocolo de transporte forma parte del contexto. Un puerto TCP no habilita el mismo número en UDP.', lesson: 'transporte' },
  { question: '¿Qué diferencia hay entre NAT y una política de seguridad?', options: ['Ninguna', 'NAT autentica al usuario', 'NAT traduce; la política decide autorización según sus condiciones'], correct: 2, explanation: 'También hay que revisar rutas, retorno y servicio. Una traducción no certifica acceso.', lesson: 'nat' },
  { question: '¿Qué indica UNRESOLVED en esta aplicación?', options: ['Que ese nombre no está entre las direcciones y grupos interpretados', 'Que el firewall está comprometido', 'Que el dispositivo rechazó un commit'], correct: 0, explanation: 'Puede faltar una sección o un tipo fuera del modelo, por ejemplo un VIP. La aplicación no consulta el equipo.', lesson: 'fortinet' },
  { question: '¿Puede esta versión analizar un XML PAN-OS?', options: ['Sí, porque hay una lección de Palo Alto', 'No, el contenido de estudio no implementa un parser XML', 'Sí, renombrándolo a .conf'], correct: 1, explanation: 'Documentar un fabricante no equivale a implementar compatibilidad. PAN-OS sigue pendiente.', lesson: 'paloalto' },
  { question: '¿Un hash demuestra por sí solo quién creó un reporte?', options: ['Sí', 'Sólo si tiene muchos caracteres', 'No, para procedencia hace falta un mecanismo de confianza'], correct: 2, explanation: 'La comparación de hashes ayuda con integridad. No sustituye firma, atribución ni custodia.', lesson: 'criptografia' },
  { question: '¿Qué debe hacer el analista con una alerta?', options: ['Correlacionar evidencia y contexto para evaluar alcance y respuesta', 'Declararla incidente confirmado automáticamente', 'Cambiar varias reglas sin registrar el estado previo'], correct: 0, explanation: 'Evento, alerta e incidente no son equivalentes. La investigación separa observaciones de hipótesis.', lesson: 'soc' },
  { question: '¿Separar dos VLAN impide cualquier comunicación entre ellas?', options: ['Sí, siempre', 'No, el routing y las políticas pueden permitirla', 'Sólo si ambas usan direcciones privadas'], correct: 1, explanation: 'La separación de capa 2 necesita controles de capa 3 para limitar los flujos entre segmentos.', lesson: 'switching' },
  { question: '¿Qué sugiere un ping sin respuesta?', options: ['Que todos los servicios están caídos', 'Que el DNS está roto necesariamente', 'Una prueba parcial: ICMP puede estar filtrado o el destino no responder'], correct: 2, explanation: 'Combina pruebas de IP, rutas, transporte y aplicación antes de atribuir la falla a una causa.', lesson: 'diagnostico' }
];
