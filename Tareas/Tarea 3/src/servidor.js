const express = require('express');
const mongoose = require('mongoose');
const configurarGraphQL = require('./graphql');

const app = express();
app.use(express.json());

const trabajadorSchema = new mongoose.Schema({
  nombre: { type: String, required: true, trim: true },
  apellido: { type: String, required: true, trim: true },
  cedulaIdentidad: { type: String, required: true, unique: true, trim: true },
  cargo: { type: String, required: true, trim: true },
  departamento: { type: String, required: true, trim: true },
  fechaIngreso: { type: Date, required: true }
}, { timestamps: true });

trabajadorSchema.set('toJSON', {
  transform: (_document, returned) => {
    returned.id = returned._id.toString();
    delete returned._id;
    delete returned.__v;
    return returned;
  }
});

const Trabajador = mongoose.model('Trabajador', trabajadorSchema, 'trabajadores');
configurarGraphQL(app, Trabajador);

const manejarErrorMongo = (error, res) => {
  if (error?.code === 11000) {
    return res.status(409).json({ error: 'La cédula de identidad ya está registrada' });
  }
  return res.status(400).json({ error: error.message });
};

app.post('/api/trabajadores', async (req, res) => {
  try {
    res.status(201).json(await Trabajador.create(req.body));
  } catch (error) {
    manejarErrorMongo(error, res);
  }
});

app.get('/api/trabajadores', async (_req, res) => {
  res.json(await Trabajador.find());
});

app.put('/api/trabajadores/:id', async (req, res) => {
  try {
    const actualizado = await Trabajador.findByIdAndUpdate(
      req.params.id, req.body, { new: true, runValidators: true }
    );
    if (!actualizado) return res.status(404).json({ error: 'Trabajador no encontrado' });
    return res.json(actualizado);
  } catch (error) {
    return manejarErrorMongo(error, res);
  }
});

app.delete('/api/trabajadores/:id', async (req, res) => {
  const eliminado = await Trabajador.findByIdAndDelete(req.params.id);
  if (!eliminado) return res.status(404).json({ error: 'Trabajador no encontrado' });
  return res.json({ message: 'Trabajador eliminado correctamente' });
});

const PORT = process.env.PORT || 3000;
const MONGO_URL = process.env.MONGO_URL || 'mongodb://localhost:27017/tarea3';

mongoose.connect(MONGO_URL)
  .then(() => {
    app.listen(PORT, () => console.log(`Servidor escuchando en el puerto ${PORT}`));
  })
  .catch((error) => {
    console.error('Error al conectar a la base de datos:', error.message);
    process.exit(1);
  });
