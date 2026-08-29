import http from 'node:http';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { WebSocketServer } from 'ws';

const root = path.dirname(fileURLToPath(import.meta.url));
const port = Number(process.env.PORT || 4173);
const accessCode = 'portfolio-demo';
const token = 'synthetic-session-token';
const notes = new Map();
const peers = new Set();
let sequence = 0;
const fault = process.env.QA_FAULT_MODE || '';

const json = (res, status, body) => { res.writeHead(status, { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' }); res.end(JSON.stringify(body)); };
const allowed = (req) => req.headers.authorization === `Bearer ${token}`;
const plainPreview = (html) => String(html).replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 160);
const serialize = (note) => ({ id: note.id, title: note.title, body: note.body, updatedAt: note.updatedAt });
const summary = (note) => ({ id: note.id, title: note.title, preview: plainPreview(note.body), updatedAt: note.updatedAt });
const broadcast = (message) => { const raw = JSON.stringify(message); for (const peer of peers) if (peer.readyState === peer.OPEN) peer.send(raw); };

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`);
  if (url.pathname === '/api/health') return json(res, 200, { ok: true, demo: true });
  if (url.pathname === '/api/qa/reset' && req.method === 'POST') { notes.clear(); sequence = 0; return json(res, 200, { reset: true }); }
  if (url.pathname === '/api/qa/disconnect' && req.method === 'POST') { if (fault !== 'ignore_disconnect') for (const peer of peers) peer.close(1012, 'synthetic interruption'); return json(res, 200, { closed: fault !== 'ignore_disconnect' }); }
  if (url.pathname.startsWith('/api/notes')) {
    if (!allowed(req)) return json(res, 401, { error: 'unauthorized' });
    if (url.pathname === '/api/notes' && req.method === 'GET') return json(res, 200, { notes: [...notes.values()].sort((a, b) => b.updatedAt - a.updatedAt).map(summary) });
    if (url.pathname === '/api/notes' && req.method === 'POST') {
      const chunks = []; for await (const part of req) chunks.push(part);
      let body; try { body = JSON.parse(Buffer.concat(chunks).toString('utf8')); } catch { return json(res, 400, { error: 'invalid_json' }); }
      if (!body || typeof body !== 'object') return json(res, 400, { error: 'invalid_json' });
      const id = body.id || `note-${++sequence}`;
      const note = { id, title: String(body.title || 'Untitled'), body: String(body.body || ''), updatedAt: Date.now() };
      notes.set(id, note); if (fault !== 'drop_notes_broadcast') broadcast({ type: 'notes_changed' }); return json(res, 200, { note: serialize(note) });
    }
    if (url.pathname.startsWith('/api/notes/') && req.method === 'GET') { const note = notes.get(url.pathname.split('/').pop()); return note ? json(res, 200, { note: serialize(note) }) : json(res, 404, { error: 'not_found' }); }
    if (url.pathname.startsWith('/api/notes/') && req.method === 'DELETE') { const ok = notes.delete(url.pathname.split('/').pop()); if (ok) broadcast({ type: 'notes_changed' }); return json(res, ok ? 200 : 404, { ok }); }
    return json(res, 405, { error: 'method_not_allowed' });
  }
  const file = url.pathname === '/' ? 'index.html' : url.pathname.slice(1);
  const filePath = path.resolve(root, file);
  const relativePath = path.relative(root, filePath);
  const escapesRoot = relativePath.startsWith('..') || path.isAbsolute(relativePath);
  if (escapesRoot || !fs.existsSync(filePath)) { res.writeHead(404); return res.end('not found'); }
  res.writeHead(200, { 'content-type': file.endsWith('.js') ? 'application/javascript' : 'text/html; charset=utf-8', 'cache-control': 'no-store' });
  fs.createReadStream(filePath).pipe(res);
});
const wss = new WebSocketServer({ server, path: '/ws' });
wss.on('connection', (ws) => {
  peers.add(ws); ws.send(JSON.stringify({ type: 'hello', authRequired: true }));
  ws.on('message', (raw) => { let message; try { message = JSON.parse(String(raw)); } catch { return; } if (message.type === 'auth') { const ok = fault === 'accept_invalid_auth' || message.code === accessCode; ws.send(JSON.stringify({ type: 'auth', ok, token: ok ? token : undefined })); } });
  ws.on('close', () => peers.delete(ws));
});
server.listen(port, '127.0.0.1', () => console.log(`Synthetic QA demo: http://127.0.0.1:${port}`));
