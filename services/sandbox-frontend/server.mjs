import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join } from 'node:path';

const port = Number(process.env.PORT ?? 4001);
const authBaseUrl = process.env.AUTH_BASE_URL ?? 'http://localhost:3001';
const apiBaseUrl = process.env.API_BASE_URL ?? 'http://localhost:3000';
const publicDir = new URL('./public/', import.meta.url);

const contentTypeByExt = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
};

function sendJson(res, statusCode, data) {
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.end(JSON.stringify(data));
}

async function serveStatic(pathname, res) {
  const requestedPath = pathname === '/' ? 'index.html' : pathname.slice(1);
  const isRoutePath = extname(requestedPath) === '';
  const filePath = isRoutePath ? 'index.html' : requestedPath;
  const absolutePath = new URL(join('.', filePath), publicDir);

  try {
    const body = await readFile(absolutePath);
    const type = contentTypeByExt[extname(filePath)] ?? 'application/octet-stream';
    res.statusCode = 200;
    res.setHeader('Content-Type', type);
    res.end(body);
  } catch {
    res.statusCode = 404;
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.end('Not found');
  }
}

const server = createServer(async (req, res) => {
  const url = new URL(req.url ?? '/', `http://localhost:${port}`);

  if (url.pathname === '/config.json') {
    sendJson(res, 200, {
      authBaseUrl,
      apiBaseUrl,
    });
    return;
  }

  await serveStatic(url.pathname, res);
});

server.listen(port, () => {
  console.log(`[sandbox-frontend] running on ${port}`);
});
