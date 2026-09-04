const http = require('http');
const os = require('os');

const PORT = Number(process.env.PORT || 3000);
const materias = [
  { id: 1, nombre: 'Microservicios', codigo: 'COM-600' },
  { id: 2, nombre: 'Ingenieria de Software', codigo: 'SIS-410' },
  { id: 3, nombre: 'Bases de Datos', codigo: 'SIS-310' }
];

const server = http.createServer((req, res) => {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');

  if (req.url === '/salud') {
    res.writeHead(200);
    return res.end(JSON.stringify({ estado: 'ok' }));
  }

  if (req.url === '/materias') {
    res.writeHead(200);
    return res.end(JSON.stringify(materias));
  }

  if (req.url === '/') {
    res.writeHead(200);
    return res.end(JSON.stringify({
      mensaje: 'Aplicacion',
      host: os.hostname(),
      endpoints: ['/', '/salud', '/materias']
    }));
  }

  res.writeHead(404);
  return res.end(JSON.stringify({ error: 'Ruta no encontrada' }));
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Aplicacion escuchando en el puerto ${PORT}`);
});
