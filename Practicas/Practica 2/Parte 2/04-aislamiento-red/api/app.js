const express = require('express');
const mongoose = require('mongoose');

const app = express();
const PORT = Number(process.env.PORT || 3000);
const MONGO_URL = process.env.MONGO_URL || 'mongodb://mongo:27017/redesdb';

app.get('/', (req, res) => res.json({ mensaje: 'API conectada a las redes frontal y de datos' }));
app.get('/salud', (req, res) => res.json({
  estado: 'ok',
  mongo: mongoose.connection.readyState === 1 ? 'alcanzable' : 'no alcanzable'
}));

mongoose.connect(MONGO_URL)
  .then(() => app.listen(PORT, '0.0.0.0', () => console.log(`API en puerto ${PORT}`)))
  .catch((error) => {
    console.error(error.message);
    process.exit(1);
  });
