const express = require('express');
const os = require('os');

const app = express();
const PORT = Number(process.env.PORT || 3000);

app.get('/', (req, res) => {
  res.json({
    mensaje: 'Aplicacion para comparar imagenes Docker',
    host: os.hostname(),
    secretoEnImagen: Boolean(process.env.DB_PASSWORD)
  });
});

app.get('/salud', (req, res) => res.json({ estado: 'ok' }));

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
