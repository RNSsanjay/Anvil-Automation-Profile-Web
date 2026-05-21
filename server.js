const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;

const MIME_TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.mp4': 'video/mp4',
  '.ico': 'image/x-icon'
};

const server = http.createServer((req, res) => {
  // Strip query parameters and normalize trailing slash
  const rawPath = req.url.split('?')[0];
  const normalizedPath = rawPath.replace(/\/+$/, '') || '/';

  // Redirect profile aliases to the homepage leadership section
  if (normalizedPath === '/profile' || normalizedPath === '/profile.html') {
    res.writeHead(302, { Location: '/index.html#leadership' });
    res.end();
    return;
  }

  const urlPath = normalizedPath;
  let filePath = path.join(__dirname, urlPath === '/' ? 'index.html' : urlPath);
  
  // URL decode for spaces and special characters
  filePath = decodeURIComponent(filePath);

  const ext = path.extname(filePath);
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code === 'ENOENT') {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404 Not Found');
      } else {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end(`Server Error: ${err.code}`);
      }
    } else {
      res.writeHead(200, { 
        'Content-Type': contentType,
        'Cache-Control': 'no-cache',
        'Access-Control-Allow-Origin': '*'
      });
      res.end(content, 'utf-8');
    }
  });
});

server.listen(PORT, () => {
  console.log(`\n============================================================`);
  console.log(`🚀 ANVIL LOCAL WEB SERVER RUNNING!`);
  console.log(`👉 Open your browser to: http://localhost:${PORT}/axis-ai.html`);
  console.log(`============================================================\n`);
});
