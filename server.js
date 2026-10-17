import http from 'node:http';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { analyze, compare } from './lib/analyzer.js';
import { cases } from './lib/cases.js';

const assets = { '/': ['index.html', 'text/html'], '/guide': ['guide.html', 'text/html'], '/guide.js': ['guide.js', 'text/javascript'], '/help.js': ['help.js', 'text/javascript'], '/app.js': ['app.js', 'text/javascript'], '/style.css': ['style.css', 'text/css'] };
assets['/manual.css'] = ['manual.css', 'text/css'];
assets['/beginner.css'] = ['beginner.css', 'text/css'];
for (const filename of ['index.html', 'lab.html', 'home.js', 'home.css']) assets[`/${filename}`] = [filename, filename.endsWith('.html') ? 'text/html' : filename.endsWith('.css') ? 'text/css' : 'text/javascript'];
assets['/academy'] = ['academy.html', 'text/html'];
assets['/academy.js'] = ['academy.js', 'text/javascript'];
assets['/academy-data.js'] = ['academy-data.js', 'text/javascript'];
assets['/academy.css'] = ['academy.css', 'text/css'];
assets['/analyzer.js'] = ['../lib/analyzer.js', 'text/javascript'];
assets['/cases.js'] = ['../lib/cases.js', 'text/javascript'];
for (const filename of ['visuals.html', 'visuals.js', 'visuals-data.js', 'visuals.css']) assets[`/${filename}`] = [filename, filename.endsWith('.html') ? 'text/html' : filename.endsWith('.css') ? 'text/css' : 'text/javascript'];
for (const filename of ['learn.html', 'learn.js', 'learn-data.js', 'learn.css', 'experience.js', 'experience.css', 'academy.html', 'guide.html']) assets[`/${filename}`] = [filename, filename.endsWith('.html') ? 'text/html' : filename.endsWith('.css') ? 'text/css' : 'text/javascript'];
const send = (response, status, data) => { response.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' }); response.end(JSON.stringify(data)); };
for (const filename of ['experience.js', 'review.css', 'demo.html', 'layout-check.html', 'layout-check.js', 'demo.vtt', 'demo.mp4', 'demo-poster.jpg', 'demo-lab.jpg', 'demo-academy.jpg', 'demo-visuals.jpg', 'demo-workshop.jpg']) assets[`/${filename}`] = [filename, filename.endsWith('.html') ? 'text/html' : filename.endsWith('.css') ? 'text/css' : filename.endsWith('.jpg') ? 'image/jpeg' : filename.endsWith('.mp4') ? 'video/mp4' : filename.endsWith('.vtt') ? 'text/vtt' : 'text/javascript'];
export const server = http.createServer(async (request, response) => {
  response.setHeader('X-Content-Type-Options', 'nosniff');
  response.setHeader('Content-Security-Policy', "default-src 'self'; style-src 'self'; script-src 'self'; connect-src 'self'; object-src 'none'; frame-ancestors 'none'; base-uri 'none'");
  response.setHeader('Cache-Control', 'no-store');
  const path = new URL(request.url, 'http://localhost').pathname;
  try {
    if (request.method === 'GET' && path === '/api/cases') return send(response, 200, cases);
    if (request.method === 'GET' && path === '/api/health') return send(response, 200, { status: 'ok', version: '0.2.0', mode: 'local-lab' });
    if (request.method === 'POST' && ['/api/analyze', '/api/compare'].includes(path)) {
      const origin = request.headers.origin;
      if (origin && origin !== `http://${request.headers.host}`) return send(response, 403, { error: 'Origen no permitido.' });
      if (!request.headers['content-type']?.startsWith('application/json')) return send(response, 415, { error: 'Usa application/json.' });
      const chunks = [];
      let size = 0;
      for await (const chunk of request) {
        size += chunk.length;
        if (size > 1024 * 1024) return send(response, 413, { error: 'Máximo 1 MB por solicitud.' });
        chunks.push(chunk);
      }
      const payload = JSON.parse(Buffer.concat(chunks).toString('utf8'));
      if (!payload || typeof payload !== 'object' || Array.isArray(payload)) return send(response, 400, { error: 'El cuerpo debe ser un objeto JSON.' });
      if (path === '/api/analyze') {
        if (typeof payload.config !== 'string' || (payload.query !== undefined && typeof payload.query !== 'string')) return send(response, 400, { error: 'config y query deben ser texto.' });
        return send(response, 200, analyze(payload.config, payload.query || ''));
      }
      if (typeof payload.before !== 'string' || typeof payload.after !== 'string') return send(response, 400, { error: 'before y after deben ser texto.' });
      return send(response, 200, compare(payload.before, payload.after));
    }
    if (request.method === 'GET' && assets[path]) {
      const [filename, type] = assets[path];
      const content = await readFile(new URL(`./public/${filename}`, import.meta.url));
      response.writeHead(200, { 'Content-Type': `${type}; charset=utf-8` });
      return response.end(content);
    }
    send(response, 404, { error: 'Ruta no encontrada.' });
  } catch (error) { send(response, 400, { error: error instanceof SyntaxError ? 'JSON inválido.' : error.message }); }
});
server.requestTimeout = 15000;
server.headersTimeout = 10000;
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const port = Number(process.env.PORT || 3000);
  server.listen(port, '127.0.0.1', () => console.log(`Firewall Detective: http://127.0.0.1:${port}`));
}
