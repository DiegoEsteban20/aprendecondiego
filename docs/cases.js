const base = `config firewall address
    edit "LAN_USERS"
        set subnet 10.10.10.0 255.255.255.0
    next
    edit "WEB_SERVER"
        set subnet 10.20.0.10 255.255.255.255
    next
    edit "ADMIN_HOST"
        set subnet 10.10.10.50 255.255.255.255
    next
end
config firewall addrgrp
    edit "SERVERS"
        set member "WEB_SERVER"
    next
end
config firewall policy
    edit 10
        set name "Users to web"
        set srcintf "lan"
        set dstintf "dmz"
        set srcaddr "LAN_USERS"
        set dstaddr "SERVERS"
        set action accept
        set schedule "always"
        set service "HTTPS"
        set logtraffic all
    next
`;

export const cases = [
  { id: 'exposure', title: 'La puerta abierta', category: 'EXPOSICIÓN', description: 'Se agregó una política de emergencia. Encuentra el permiso excesivo y verifica qué evidencia falta para confirmar exposición.', hint: 'Compara origen, destino y servicio de la política 20.', solution: 'La política 20 acepta all → all con servicio ALL. Es un permiso amplio; para confirmar exposición real debes revisar rutas, NAT, orden y contexto del equipo.', config: base + `    edit 20
        set name "Temporary troubleshooting"
        set srcintf "wan1"
        set dstintf "dmz"
        set srcaddr "all"
        set dstaddr "all"
        set action accept
        set service "ALL"
    next
end` },
  { id: 'duplicate', title: 'Identidad duplicada', category: 'OBJETOS', description: 'Dos nombres esconden el mismo servidor. Busca 10.20.0.10 y encuentra el objeto redundante.', hint: 'Revisa las subredes /32, además de sus nombres.', solution: 'WEB_SERVER y WEB_LEGACY representan 10.20.0.10/32. Consolidarlos requiere revisar todas sus referencias.', config: base.replace('config firewall addrgrp', `config firewall address
    edit "WEB_LEGACY"
        set subnet 10.20.0.10 255.255.255.255
    next
end
config firewall addrgrp`) + 'end' },
  { id: 'missing', title: 'La referencia perdida', category: 'INTEGRIDAD', description: 'Una exportación parcial referencia un objeto que no aparece definido. Encuéntralo antes de preparar una migración.', hint: 'Busca el destino de la política 30.', solution: 'La política 30 referencia DB_PROD, ausente del archivo. Puede faltar parte de la exportación; esto no demuestra una configuración inválida en el equipo real.', config: base + `    edit 30
        set name "App to database"
        set srcintf "dmz"
        set dstintf "servers"
        set srcaddr "WEB_SERVER"
        set dstaddr "DB_PROD"
        set action accept
        set service "MYSQL"
        set logtraffic all
    next
end` }
];
