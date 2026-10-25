import http from 'node:http';
import {readFile} from 'node:fs/promises';
import path from 'node:path';
const root = import.meta.dirname;
const types = {'.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json'};
http.createServer(async (req,res) => {
  try {
    const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    const file = path.resolve(root, '.' + (pathname === '/' ? '/index.html' : pathname));
    if (!file.startsWith(root + '/')) { res.writeHead(403).end(); return; }
    res.setHeader('Content-Type', types[path.extname(file)] || 'application/octet-stream');
    res.end(await readFile(file));
  } catch { res.writeHead(404).end('Not found'); }
}).listen(Number(process.env.PORT || 3000), '0.0.0.0', () => console.log('Desktop Adventure running on port ' + (process.env.PORT || 3000)));
