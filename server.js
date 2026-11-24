const http = require('http');
const fs = require('fs');
const path = require('path');

const MIME = {
  '.html': 'text/html; charset=UTF-8',
  '.css': 'text/css; charset=UTF-8',
  '.js': 'application/javascript; charset=UTF-8',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml'
};

const server = http.createServer((req, res) => {
  const safePath = path.normalize(decodeURI(req.url.split('?')[0]));
  let file = safePath === '/' ? 'index.html' : safePath.slice(1);
  let filePath = path.join(__dirname, file);

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('Not found');
    } else {
      let ext = path.extname(filePath).toLowerCase();
      res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
      res.end(data);
    }
  });
});

const PORT = 4567;
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
