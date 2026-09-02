const express = require('express');
const mongoose = require('mongoose');

const app = express();
app.use(express.json());

const PORT = Number(process.env.PORT || 3000);
const MONGO_URL = process.env.MONGO_URL || 'mongodb://localhost:27017/tareasdb';

const Tarea = mongoose.model('Tarea', new mongoose.Schema({
  titulo: { type: String, required: true },
  completada: { type: Boolean, default: false }
}, { timestamps: true }));

app.get('/', (req, res) => res.json({ mensaje: 'API para respaldo y restauracion' }));
app.get('/salud', (req, res) => res.json({
  estado: 'ok',
  db: mongoose.connection.readyState === 1 ? 'conectada' : 'desconectada'
}));
app.get('/tareas', async (req, res) => res.json(await Tarea.find().sort({ createdAt: 1 })));
app.post('/tareas', async (req, res) => {
  try {
    res.status(201).json(await Tarea.create(req.body));
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

mongoose.connect(MONGO_URL)
  .then(() => app.listen(PORT, '0.0.0.0', () => console.log(`API en puerto ${PORT}`)))
  .catch((error) => {
    console.error('Error de conexion:', error.message);
    process.exit(1);
  });
