const http = require('http');
const fs = require('fs');
const path = require('path');

const root = __dirname;
const port = 3000;
const sugerenciasPath = path.join(root, 'src', 'sugerencias', 'sugerencias.txt');
const bajasPath = path.join(root, 'src', 'sugerencias', 'baja_servicio');

const server = http.createServer((req, res) => {
  if (req.method === 'OPTIONS' && (req.url === '/guardar-sugerencia' || req.url === '/guardar-baja')) {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    });
    res.end();
    return;
  }

  if (req.method === 'POST' && req.url === '/guardar-sugerencia') {
    let body = '';

    req.on('data', chunk => {
      body += chunk.toString();
    });

    req.on('end', () => {
      try {
        const data = JSON.parse(body);
        const nuevaEntrada = `Nombre: ${data.nombre}\nCorreo electrónico: ${data.correo}\nSugerencia: ${data.sugerencia}\n\n`;
        const contenidoAnterior = fs.existsSync(sugerenciasPath) ? fs.readFileSync(sugerenciasPath, 'utf8') : '';
        const contenido = `${nuevaEntrada}${contenidoAnterior}`;
        fs.writeFileSync(sugerenciasPath, contenido, 'utf8');

        res.writeHead(200, {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        });
        res.end(JSON.stringify({ ok: true, mensaje: 'Sus datos se han guardado correctamente. Gracias por su sugerencia.' }));
      } catch (error) {
        res.writeHead(400, {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        });
        res.end(JSON.stringify({ ok: false, mensaje: 'No se pudo guardar la sugerencia.' }));
      }
    });

    return;
  }

  if (req.method === 'POST' && req.url === '/guardar-baja') {
    let body = '';

    req.on('data', chunk => {
      body += chunk.toString();
    });

    req.on('end', () => {
      try {
        const data = JSON.parse(body);
        const nuevaEntrada = `Nombre: ${data.nombre}\nCorreo electrónico: ${data.correo}\n\n`;
        const contenidoAnterior = fs.existsSync(bajasPath) ? fs.readFileSync(bajasPath, 'utf8') : '';
        const contenido = `${nuevaEntrada}${contenidoAnterior}`;
        fs.writeFileSync(bajasPath, contenido, 'utf8');

        res.writeHead(200, {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        });
        res.end(JSON.stringify({ ok: true, mensaje: 'Su solicitud de baja se ha guardado correctamente. Gracias.' }));
      } catch (error) {
        res.writeHead(400, {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        });
        res.end(JSON.stringify({ ok: false, mensaje: 'No se pudo guardar la solicitud de baja.' }));
      }
    });

    return;
  }

  if (req.url === '/' || req.url === '/index.html') {
    const file = path.join(root, 'index.html');
    fs.readFile(file, (err, content) => {
      if (err) {
        res.writeHead(500);
        res.end('Error');
        return;
      }
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(content);
    });
    return;
  }

  if (req.url === '/sugerencias.html') {
    const file = path.join(root, 'sugerencias.html');
    fs.readFile(file, (err, content) => {
      if (err) {
        res.writeHead(500);
        res.end('Error');
        return;
      }
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(content);
    });
    return;
  }

  if (req.url === '/eliminar-datos.html') {
    const file = path.join(root, 'eliminar-datos.html');
    fs.readFile(file, (err, content) => {
      if (err) {
        res.writeHead(500);
        res.end('Error');
        return;
      }
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(content);
    });
    return;
  }

  if (req.url.startsWith('/src/')) {
    const file = path.join(root, req.url.replace(/^\//, ''));
    fs.readFile(file, (err, content) => {
      if (err) {
        res.writeHead(404);
        res.end('No encontrado');
        return;
      }
      const ext = path.extname(file);
      const type = ext === '.css' ? 'text/css; charset=utf-8' : ext === '.png' ? 'image/png' : 'application/octet-stream';
      res.writeHead(200, { 'Content-Type': type });
      res.end(content);
    });
    return;
  }

  res.writeHead(404);
  res.end('No encontrado');
});

server.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
