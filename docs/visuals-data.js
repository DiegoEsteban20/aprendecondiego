export const tcpSteps = [
  { title: 'Antes de conectar', text: 'El cliente quiere abrir una conexión TCP con el servidor. Todavía no hay una conexión establecida.', direction: null },
  { title: '1 · SYN', text: 'El cliente propone iniciar la conexión y anuncia un número de secuencia inicial. El segmento usa un puerto de origen y el puerto de destino del servicio.', direction: 'right' },
  { title: '2 · SYN-ACK', text: 'El servidor confirma la propuesta y anuncia su propio número de secuencia. Aún falta la confirmación del cliente.', direction: 'left' },
  { title: '3 · ACK', text: 'El cliente confirma. En este ejemplo convencional queda establecido el transporte TCP.', direction: 'right' },
  { title: 'Después · aplicación', text: 'La aplicación puede continuar: por ejemplo, negociar TLS y luego intercambiar HTTP. Completar TCP no demuestra que TLS, autenticación o el servicio funcionen.', direction: 'both' }
];

export const natSessions = [
  { client: '10.10.10.10:51000', translated: '203.0.113.5:40001', destination: '198.51.100.20:443' },
  { client: '10.10.10.11:51000', translated: '203.0.113.5:40002', destination: '198.51.100.20:443' },
  { client: '10.10.10.12:51000', translated: '203.0.113.5:40003', destination: '198.51.100.20:443' }
];

export const flows = [
  { id: 'web', label: 'Internet → web · TCP/443', source: 'Internet', target: 'Servidor web / DMZ', port: 443, allowed: true, route: ['internet', 'firewall', 'dmz'], explanation: 'La regla ficticia R1 permite desde WAN hacia el servidor web de la DMZ por TCP/443. Aquí se asumen rutas y traducción ya resueltas.' },
  { id: 'ssh', label: 'Internet → web · TCP/22', source: 'Internet', target: 'Servidor web / DMZ', port: 22, allowed: false, route: ['internet', 'firewall'], explanation: 'R1 sólo permite TCP/443. El intento por TCP/22 no tiene una autorización en esta matriz y termina en la denegación predeterminada ficticia.' },
  { id: 'lateral', label: 'DMZ → LAN · TCP/445', source: 'Servidor web / DMZ', target: 'Equipos / LAN', port: 445, allowed: false, route: ['dmz', 'firewall'], explanation: 'La separación de redes necesita políticas. En este escenario no se permite que el servidor de la DMZ alcance recursos SMB de la LAN.' },
  { id: 'internal', label: 'LAN → web · TCP/443', source: 'Equipos / LAN', target: 'Servidor web / DMZ', port: 443, allowed: true, route: ['lan', 'firewall', 'dmz'], explanation: 'La regla ficticia R2 permite HTTPS desde LAN a DMZ. Una autorización aquí sólo describe este escenario educativo.' }
];

export const devices = {
  internet: { title: 'WAN / Internet', text: 'Representa una red externa. Que un paquete llegue desde aquí no identifica a su usuario ni acredita confianza.' },
  firewall: { title: 'Firewall', text: 'Es el punto de control del escenario. Aplica una matriz ficticia de permisos; no ejecuta el motor de FortiOS ni PAN-OS.' },
  dmz: { title: 'DMZ / servidor web', text: 'Segmento de servicios publicados. Separarlo de la LAN ayuda a limitar flujos sólo cuando las reglas y rutas efectivas mantienen esa separación.' },
  lan: { title: 'LAN / usuarios', text: 'Red interna de ejemplo. Estar dentro de la LAN no implica confianza ilimitada ni permiso para todos los servicios.' },
  management: { title: 'Red de gestión', text: 'Espacio separado para administración. Este diagrama ilustra su propósito; no simula autenticación, sesiones administrativas ni acceso remoto real.' }
};

export const osiLayers = [
  ['7 · Aplicación', 'La aplicación genera los datos; por ejemplo, una petición HTTP.'],
  ['6 · Presentación', 'El modelo de referencia describe representación de datos y funciones relacionadas. Los protocolos reales no siempre encajan en una única capa.'],
  ['5 · Sesión', 'Organiza el diálogo en el modelo de referencia. No equivale automáticamente a una sesión de firewall.'],
  ['4 · Transporte', 'TCP o UDP añaden contexto de transporte, como los puertos.'],
  ['3 · Red', 'IP identifica origen y destino y permite el enrutamiento entre redes.'],
  ['2 · Enlace', 'Una trama entrega datos al siguiente salto del enlace. Sus direcciones pueden cambiar entre saltos.'],
  ['1 · Física', 'Los bits se transmiten como señales eléctricas, ópticas o de radio.']
];
