const http = require('http');
const fs = require('fs');
const path = require('path');
const os = require('os');

const PORT = 8080;
const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css' };

const server = http.createServer((req, res) => {
  const filePath = path.join(__dirname, req.url === '/' ? 'index.html' : req.url);
  const ext = path.extname(filePath);
  fs.readFile(filePath, (err, data) => {
    if (err) { res.writeHead(404); res.end('Not Found'); return; }
    res.writeHead(200, {
      'Content-Type': MIME[ext] || 'application/octet-stream',
      'Cross-Origin-Opener-Policy': 'same-origin'
    });
    res.end(data);
  });
});

server.listen(PORT, () => {
  console.log(`\n  === P2P 阅后即焚聊天 已启动 ===\n`);
  console.log(`  本机访问: http://localhost:${PORT}`);
  const nets = os.networkInterfaces();
  for (const [name, addrs] of Object.entries(nets)) {
    for (const addr of addrs) {
      if (addr.family === 'IPv4' && !addr.internal) {
        console.log(`  局域网访问: http://${addr.address}:${PORT}`);
      }
    }
  }
  console.log(`\n  手机必须通过局域网地址访问（与电脑同一网络）`);
  console.log(`  按 Ctrl+C 停止服务器\n`);
});
