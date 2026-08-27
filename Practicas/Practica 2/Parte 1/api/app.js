const express = require('express');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URL =
  process.env.MONGO_URL || 'mongodb://localhost:27017/tareasdb';

app.use(express.json());

const tareaSchema = new mongoose.Schema(
  {
    titulo: {
      type: String,
      required: true,
      trim: true,
    },
    completada: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Tarea = mongoose.model('Tarea', tareaSchema);

// Health check
app.get('/salud', (req, res) => {
  res.json({
    estado: 'ok',
    db: mongoose.connection.readyState === 1
      ? 'conectada'
      : 'desconectada',
  });
});

// Obtener todas las tareas
app.get('/tareas', async (req, res) => {
  try {
    const tareas = await Tarea.find().sort({ createdAt: -1 });
    res.json(tareas);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener las tareas' });
  }
});

// Obtener una tarea
app.get('/tareas/:id', async (req, res) => {
  try {
    const tarea = await Tarea.findById(req.params.id);

    if (!tarea) {
      return res.status(404).json({ error: 'Tarea no encontrada' });
    }

    res.json(tarea);
  } catch (error) {
    res.status(400).json({ error: 'ID de tarea inválido' });
  }
});

// Crear una tarea
app.post('/tareas', async (req, res) => {
  try {
    const tarea = await Tarea.create({
      titulo: req.body.titulo,
      completada: req.body.completada,
    });

    res.status(201).json(tarea);
  } catch (error) {
    res.status(400).json({
      error: 'No se pudo crear la tarea',
      detalles: error.message,
    });
  }
});

// Actualizar una tarea
app.put('/tareas/:id', async (req, res) => {
  try {
    const tarea = await Tarea.findByIdAndUpdate(
      req.params.id,
      {
        titulo: req.body.titulo,
        completada: req.body.completada,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!tarea) {
      return res.status(404).json({ error: 'Tarea no encontrada' });
    }

    res.json(tarea);
  } catch (error) {
    res.status(400).json({
      error: 'No se pudo actualizar la tarea',
      detalles: error.message,
    });
  }
});

// Eliminar una tarea
app.delete('/tareas/:id', async (req, res) => {
  try {
    const tarea = await Tarea.findByIdAndDelete(req.params.id);

    if (!tarea) {
      return res.status(404).json({ error: 'Tarea no encontrada' });
    }

    res.json({ mensaje: 'Tarea eliminada correctamente' });
  } catch (error) {
    res.status(400).json({ error: 'ID de tarea inválido' });
  }
});

// Conectar a MongoDB e iniciar el servidor
async function iniciarServidor() {
  try {
    await mongoose.connect(MONGO_URL);
    console.log('Conectado a MongoDB');

    app.listen(PORT, () => {
      console.log(`API ejecutándose en el puerto ${PORT}`);
    });
  } catch (error) {
    console.error('Error al conectar a MongoDB:', error.message);
    process.exit(1);
  }
}

iniciarServidor();