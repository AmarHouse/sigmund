const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');

const PORT = 3000;
const ROOT = __dirname;

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.md': 'text/markdown; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon'
};

function proxyRequest(clientReq, clientRes) {
  let body = '';
  clientReq.on('data', chunk => body += chunk);
  clientReq.on('end', () => {
    try {
      const { url: targetUrl, method, headers, body: reqBody } = JSON.parse(body);
      const parsed = new URL(targetUrl);
      const mod = parsed.protocol === 'https:' ? https : http;
      const opt = {
        hostname: parsed.hostname,
        port: parsed.port || (parsed.protocol === 'https:' ? 443 : 80),
        path: parsed.pathname + parsed.search,
        method: method || 'POST',
        headers: { ...headers }
      };
      const proxy = mod.request(opt, (res) => {
        let data = '';
        res.on('data', c => data += c);
        res.on('end', () => {
          clientRes.writeHead(res.statusCode, { 'Content-Type': 'application/json' });
          clientRes.end(data);
        });
      });
      proxy.on('error', (e) => {
        clientRes.writeHead(500, { 'Content-Type': 'application/json' });
        clientRes.end(JSON.stringify({ error: e.message }));
      });
      if (reqBody) proxy.write(reqBody);
      proxy.end();
    } catch (e) {
      clientRes.writeHead(400, { 'Content-Type': 'application/json' });
      clientRes.end(JSON.stringify({ error: e.message }));
    }
  });
}

const server = http.createServer((req, res) => {
  const url = req.url.split('?')[0];

  if (url === '/api/proxy' && req.method === 'POST') {
    return proxyRequest(req, res);
  }

  let filePath = url;
  if (url === '/') filePath = '/index.html';
  filePath = path.join(ROOT, filePath);
  const ext = path.extname(filePath);

  fs.readFile(filePath, (err, data) => {
    if (err) {
      if (err.code === 'ENOENT') {
        res.writeHead(404);
        res.end('Arquivo não encontrado');
      } else {
        res.writeHead(500);
        res.end('Erro interno');
      }
      return;
    }
    res.writeHead(200, { 'Content-Type': MIME[ext] || 'text/plain; charset=utf-8' });
    res.end(data);
  });
});

server.listen(PORT, () => {
  console.log(`\n  ✨ Terapia SPA rodando em:`);
  console.log(`  ─────────────────────────────`);
  console.log(`  ➜  http://localhost:${PORT}`);
  console.log(`  ➜  Ctrl+C para parar\n`);
});
