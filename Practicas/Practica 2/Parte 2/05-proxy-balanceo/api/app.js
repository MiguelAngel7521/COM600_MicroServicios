const express = require('express');
const mongoose = require('mongoose');
const os = require('os');

const app = express();
app.use(express.json());

const PORT = Number(process.env.PORT || 3000);
const MONGO_URL = process.env.MONGO_URL;

const Tarea = mongoose.model('Tarea', new mongoose.Schema({
  titulo: { type: String, required: true },
  completada: { type: Boolean, default: false }
}, { timestamps: true }));

app.get('/', (req, res) => res.json({
  mensaje: 'Respuesta entregada por una replica de la API',
  host: os.hostname()
}));
app.get('/salud', (req, res) => {
  const conectada = mongoose.connection.readyState === 1;
  res.status(conectada ? 200 : 503).json({
    estado: conectada ? 'ok' : 'error',
    db: conectada ? 'conectada' : 'desconectada',
    host: os.hostname()
  });
});
app.get('/tareas', async (req, res) => res.json(await Tarea.find()));
app.post('/tareas', async (req, res) => {
  try {
    res.status(201).json(await Tarea.create(req.body));
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

mongoose.connect(MONGO_URL)
  .then(() => app.listen(PORT, '0.0.0.0', () => console.log(`Replica ${os.hostname()} lista`)))
  .catch((error) => {
    console.error(error.message);
    process.exit(1);
  });
