import { isIP } from 'node:net';

export function parseConfig(text) {
  const objects = [];
  const groups = [];
  const rules = [];
  let section = '';
  let entry = null;
  const warnings = [];
  const supportedFields = new Set(['name', 'subnet', 'type', 'member', 'srcaddr', 'dstaddr', 'srcintf', 'dstintf', 'service', 'action', 'status', 'schedule', 'logtraffic', 'comments']);
  for (const [index, raw] of text.split(/\r?\n/).entries()) {
    const line = raw.trim();
    if (!line || line.startsWith('#')) continue;
    const config = line.match(/^config (firewall address|firewall addrgrp|firewall policy)$/);
    if (config) {
      if (section || entry) throw new Error(`Línea ${index + 1}: bloque anidado o sin cerrar. Usa una exportación plana de un único ámbito.`);
      section = config[1]; continue;
    }
    if (line.startsWith('config ')) throw new Error(`Línea ${index + 1}: bloque no compatible (${line}). Extrae únicamente address, addrgrp y policy de un solo ámbito.`);
    if (line === 'end') {
      if (entry) throw new Error(`Línea ${index + 1}: falta next antes de end.`);
      section = ''; continue;
    }
    const edit = line.match(/^edit (?:"([^"]+)"|(\S+))$/);
    if (edit && section) {
      if (entry) throw new Error(`Línea ${index + 1}: entrada anterior sin next.`);
      entry = { name: edit[1] || edit[2], line: index + 1 }; continue;
    }
    if (line === 'next' && entry) {
      if (section === 'firewall address') objects.push(entry);
      if (section === 'firewall addrgrp') groups.push(entry);
      if (section === 'firewall policy') rules.push(entry);
      entry = null;
      continue;
    }
    const setting = line.match(/^set ([\w-]+) (.+)$/);
    if (setting && entry) {
      const field = setting[1];
      if (!supportedFields.has(field)) warnings.push({ line: index + 1, message: `La opción ${field} no se evalúa y se omite del modelo.` });
      else entry[field === 'name' ? 'label' : field] = [...setting[2].matchAll(/"([^"]*)"|(\S+)/g)].map(match => match[1] ?? match[2]);
      continue;
    }
    warnings.push({ line: index + 1, message: 'Instrucción no interpretada.' });
  }
  if (entry || section) throw new Error('Configuración incompleta: falta next o end al final del archivo.');
  if (!objects.length && !groups.length && !rules.length) throw new Error('No se encontraron objetos o políticas compatibles. Usa una configuración FortiOS del subconjunto documentado.');
  for (const collection of [objects, groups, rules]) {
    const identifiers = new Set();
    for (const item of collection) {
      if (identifiers.has(item.name)) throw new Error(`Identificador duplicado: ${item.name}. Usa un único ámbito de configuración.`);
      identifiers.add(item.name);
    }
  }
  return { vendor: 'Fortinet · subconjunto FortiOS', objects, groups, rules, warnings };
}

function ipv4Number(value) {
  if (isIP(value) !== 4) return null;
  return value.split('.').reduce((result, octet) => result * 256 + Number(octet), 0) >>> 0;
}

export function analyze(text, query = '') {
  const parsed = parseConfig(text);
  const findings = [];
  const enabled = parsed.rules.filter(rule => rule.status?.[0] !== 'disable');
  const add = (rule, code, severity, title, detail) => findings.push({ rule: rule.name, line: rule.line, code, severity, title, detail });
  for (const rule of enabled) {
    if (rule.action?.[0] !== 'accept') continue;
    if (rule.srcaddr?.includes('all') && rule.dstaddr?.includes('all') && rule.service?.includes('ALL'))
      add(rule, 'ANY_ANY', 'high', 'Permiso demasiado amplio', 'Origen all, destino all y servicio ALL. Revisa interfaces, orden y restricciones antes de concluir exposición.');
    if (rule.logtraffic?.[0] !== 'all')
      add(rule, 'LOG_REVIEW', 'medium', 'Revisar registro de tráfico', 'La política no declara logtraffic all; puede registrar menos sesiones de las necesarias para investigar.');
    if (rule.srcintf?.some(value => /wan|internet/i.test(value)) && rule.dstaddr?.some(value => value !== 'all'))
      add(rule, 'WAN_REVIEW', 'medium', 'Acceso desde interfaz externa', 'Una política accept usa una interfaz cuyo nombre parece externo. Comprueba servicio, rutas y NAT; el nombre no prueba exposición.');
  }
  const signatures = new Map();
  for (const object of parsed.objects) {
    if (!object.subnet) continue;
    const signature = object.subnet.join(' ');
    if (signatures.has(signature)) findings.push({ rule: null, line: object.line, code: 'DUPLICATE', severity: 'low', title: 'Objetos con la misma subred', detail: `${object.name} y ${signatures.get(signature)}: ${signature}` });
    else signatures.set(signature, object.name);
  }
  const names = new Set([...parsed.objects, ...parsed.groups].map(item => item.name));
  const references = [...parsed.rules.flatMap(rule => [...(rule.srcaddr || []), ...(rule.dstaddr || [])].map(name => ({ name, line: rule.line, owner: rule.name }))), ...parsed.groups.flatMap(group => (group.member || []).map(name => ({ name, line: group.line, owner: group.name })))];
  for (const reference of references) if (reference.name !== 'all' && !names.has(reference.name)) findings.push({ rule: reference.owner, line: reference.line, code: 'UNRESOLVED', severity: 'medium', title: 'Referencia sin resolver', detail: `${reference.name} no está definido en este archivo. Puede faltar una sección de la exportación.` });
  const normalized = query.trim().toLowerCase();
  const address = ipv4Number(query.trim());
  const matches = normalized ? parsed.objects.filter(object => {
    if (object.name.toLowerCase().includes(normalized) || (address === null && object.subnet?.join(' ').includes(normalized))) return true;
    if (address === null || !object.subnet || object.subnet.length !== 2) return false;
    const base = ipv4Number(object.subnet[0]);
    const mask = ipv4Number(object.subnet[1]);
    const inverse = mask === null ? null : (~mask >>> 0);
    return base !== null && mask !== null && (inverse & (inverse + 1)) === 0 && ((address & mask) >>> 0) === ((base & mask) >>> 0);
  }) : [];
  const matchedNames = new Set(matches.map(item => item.name));
  for (const group of parsed.groups) if (normalized && group.name.toLowerCase().includes(normalized)) matchedNames.add(group.name);
  let changed = true;
  while (changed) {
    changed = false;
    for (const group of parsed.groups) if (!matchedNames.has(group.name) && group.member?.some(name => matchedNames.has(name))) { matchedNames.add(group.name); changed = true; }
  }
  const matchedRules = normalized ? parsed.rules.filter(rule => [...(rule.srcaddr || []), ...(rule.dstaddr || [])].some(name => matchedNames.has(name)) || rule.name.toLowerCase().includes(normalized) || rule.label?.join(' ').toLowerCase().includes(normalized)) : [];
  return { ...parsed, findings, search: { query, objects: matches, groups: parsed.groups.filter(group => matchedNames.has(group.name)), rules: matchedRules }, summary: { objects: parsed.objects.length, groups: parsed.groups.length, rules: parsed.rules.length, findings: findings.length } };
}

export function compare(before, after) {
  const previous = before.split(/\r?\n/);
  const current = after.split(/\r?\n/);
  const previousCounts = new Map();
  const currentCounts = new Map();
  for (const line of previous) previousCounts.set(line, (previousCounts.get(line) || 0) + 1);
  for (const line of current) currentCounts.set(line, (currentCounts.get(line) || 0) + 1);
  const removed = previous.filter(line => { const count = currentCounts.get(line) || 0; if (count) { currentCounts.set(line, count - 1); return false; } return true; });
  const added = current.filter(line => { const count = previousCounts.get(line) || 0; if (count) { previousCounts.set(line, count - 1); return false; } return true; });
  let semantic = null;
  let semanticError = null;
  try {
    const previousModel = parseConfig(before);
    const currentModel = parseConfig(after);
    const changes = [];
    for (const category of ['objects', 'groups', 'rules']) {
      const previousItems = new Map(previousModel[category].map(item => [item.name, item]));
      const currentItems = new Map(currentModel[category].map(item => [item.name, item]));
      for (const [name, item] of previousItems) {
        if (!currentItems.has(name)) { changes.push({ category, name, type: 'removed', fields: [] }); continue; }
        const current = currentItems.get(name);
        const fields = [...new Set([...Object.keys(item), ...Object.keys(current)])].filter(field => field !== 'line' && JSON.stringify(item[field]) !== JSON.stringify(current[field])).map(field => ({ field, before: item[field] ?? [], after: current[field] ?? [] }));
        if (fields.length) changes.push({ category, name, type: 'modified', fields });
      }
      for (const name of currentItems.keys()) if (!previousItems.has(name)) changes.push({ category, name, type: 'added', fields: [] });
    }
    const previousOrder = previousModel.rules.map(rule => rule.name);
    const currentOrder = currentModel.rules.map(rule => rule.name);
    const commonPrevious = previousOrder.filter(name => currentOrder.includes(name));
    const commonCurrent = currentOrder.filter(name => previousOrder.includes(name));
    semantic = { changes, orderChanged: JSON.stringify(commonPrevious) !== JSON.stringify(commonCurrent), previousOrder, currentOrder, warnings: [...previousModel.warnings, ...currentModel.warnings] };
  } catch (error) { semanticError = error.message; }
  return { added, removed, semantic, semanticError, note: 'Diferencias de líneas y de campos interpretados. Se compara el orden relativo de políticas comunes; opciones omitidas, NAT y contexto operativo no se validan.' };
}
