const express = require('express');
const mongoose = require('mongoose');
const os = require('os');

const app = express();
app.use(express.json());

const PORT = Number(process.env.PORT || 3000);
const MONGO_URL = process.env.MONGO_URL || 'mongodb://mongo:27017/bibliotecadb';

const Libro = mongoose.model('Libro', new mongoose.Schema({
  titulo: { type: String, required: true },
  autor: { type: String, required: true },
  disponible: { type: Boolean, default: true }
}, { timestamps: true }));

app.get('/', (req, res) => res.json({
  proyecto: 'Biblioteca COM-600',
  host: os.hostname(),
  endpoints: ['/salud', '/libros']
}));

app.get('/salud', (req, res) => {
  const conectada = mongoose.connection.readyState === 1;
  res.status(conectada ? 200 : 503).json({
    estado: conectada ? 'ok' : 'error',
    baseDeDatos: conectada ? 'conectada' : 'desconectada'
  });
});

app.get('/libros', async (req, res) => res.json(await Libro.find().sort({ titulo: 1 })));

app.post('/libros', async (req, res) => {
  try {
    res.status(201).json(await Libro.create(req.body));
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.put('/libros/:id', async (req, res) => {
  try {
    const libro = await Libro.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!libro) return res.status(404).json({ error: 'Libro no encontrado' });
    return res.json(libro);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

app.delete('/libros/:id', async (req, res) => {
  const libro = await Libro.findByIdAndDelete(req.params.id);
  if (!libro) return res.status(404).json({ error: 'Libro no encontrado' });
  return res.status(204).send();
});

mongoose.connect(MONGO_URL)
  .then(() => app.listen(PORT, '0.0.0.0', () => console.log(`Biblioteca API en ${PORT}`)))
  .catch((error) => {
    console.error('No se pudo conectar a MongoDB:', error.message);
    process.exit(1);
  });
