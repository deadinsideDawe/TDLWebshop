const fs = require('fs');
const http = require('http');
const path = require('path');
const { spawn } = require('child_process');

const host = process.env.HOST || '127.0.0.1';
const port = Number(process.env.PORT || 4200);
const distDir = path.resolve(__dirname, '..', 'dist', 'webshop', 'browser');
const ngCmd = path.resolve(__dirname, '..', 'node_modules', '.bin', 'ng.cmd');

function contentType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const map = {
    '.html': 'text/html; charset=utf-8',
    '.js': 'text/javascript; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.svg': 'image/svg+xml',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.webp': 'image/webp',
    '.ico': 'image/x-icon',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2'
  };
  return map[ext] || 'application/octet-stream';
}

function send503(res) {
  res.writeHead(503, { 'Content-Type': 'text/plain; charset=utf-8' });
  res.end('Az elso build folyamatban van, frissits par masodperc mulva.');
}

function serveFile(filePath, res) {
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('Nem talalhato');
      return;
    }
    res.writeHead(200, { 'Content-Type': contentType(filePath) });
    res.end(data);
  });
}

const ngBuild = spawn(
  'cmd.exe',
  ['/c', `"${ngCmd}" build --watch --configuration development`],
  {
    stdio: 'inherit',
    windowsHide: false,
    env: {
      ...process.env,
      NG_CLI_ANALYTICS: 'false'
    }
  }
);

ngBuild.on('error', err => {
  console.error('Az ng build --watch inditasa nem sikerult:', err.message);
});

ngBuild.on('exit', code => {
  if (code !== 0) {
    console.error(`Az ng build --watch leallt (exit code: ${code ?? 'ismeretlen'}).`);
  }
});

const server = http.createServer((req, res) => {
  if (!fs.existsSync(path.join(distDir, 'index.html'))) {
    send503(res);
    return;
  }

  const requestPath = decodeURIComponent((req.url || '/').split('?')[0]);
  const normalized = requestPath === '/' ? '/index.html' : requestPath;
  const safePath = path.normalize(normalized).replace(/^(\.\.[\/\\])+/, '');
  const absolutePath = path.join(distDir, safePath);

  if (fs.existsSync(absolutePath) && fs.statSync(absolutePath).isFile()) {
    serveFile(absolutePath, res);
    return;
  }

  serveFile(path.join(distDir, 'index.html'), res);
});

server.listen(port, host, () => {
  console.log(`Stabil localhost szerver fut: http://${host}:${port}`);
  console.log('A kodvaltozasokat az ng build --watch automatikusan ujraforditja.');
});

function shutdown() {
  server.close(() => process.exit(0));
  if (!ngBuild.killed) {
    ngBuild.kill();
  }
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
