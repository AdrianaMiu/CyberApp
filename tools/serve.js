import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=utf-8',
};

export function contentType(file) {
  if (path.basename(file) === 'manifest.json') return 'application/manifest+json';
  return TYPES[path.extname(file).toLowerCase()] || 'application/octet-stream';
}

export function resolveRequest(urlPath, root) {
  let pathname;
  try {
    pathname = decodeURIComponent(urlPath.split('?')[0].split('#')[0]);
  } catch (e) {
    return null;
  }
  if (pathname.includes('\0')) return null;
  if (pathname === '/' || pathname === '') pathname = '/index.html';
  const resolved = path.resolve(root, '.' + pathname);
  const base = path.resolve(root);
  if (resolved !== base && !resolved.startsWith(base + path.sep)) return null;
  return resolved;
}

function parseArgs(argv) {
  const opts = { root: '.', port: 4173 };
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === '--root') opts.root = argv[++i];
    else if (argv[i] === '--port') opts.port = Number(argv[++i]);
  }
  return opts;
}

export function createServer(root) {
  return http.createServer((req, res) => {
    const file = resolveRequest(req.url, root);
    if (!file) {
      res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('Forbidden');
      return;
    }
    fs.readFile(file, (err, data) => {
      if (err) {
        res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('Not found');
        return;
      }
      res.writeHead(200, { 'Content-Type': contentType(file), 'Cache-Control': 'no-cache' });
      res.end(data);
    });
  });
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const { root, port } = parseArgs(process.argv.slice(2));
  createServer(root).listen(port, () => console.log(`Serving ${path.resolve(root)} on http://localhost:${port}`));
}
