const express = require('express');
const router = express.Router();
const { repos } = require('../repos');

// Ruta para listar los lugares
router.get('/', async (req, res) => {
  const lugares = await repos.lugar.find();
  res.render('lugares', { lugares });
});

// Ruta para crear un lugar
router.post('/', async (req, res) => {
  const lugar = repos.lugar.create({ nombre: req.body.nombre });
  await repos.lugar.save(lugar);
  res.redirect('/lugares');
});

// Ruta para mostrar el formulario de edición de un lugar
router.get('/editar/:id', async (req, res) => {
  const lugar = await repos.lugar.findOneBy({ id: parseInt(req.params.id) });
  res.render('lugares-form', { lugar });
});

// Ruta para actualizar un lugar
router.post('/editar/:id', async (req, res) => {
  const lugar = await repos.lugar.findOneBy({ id: parseInt(req.params.id) });
  lugar.nombre = req.body.nombre;
  await repos.lugar.save(lugar);
  res.redirect('/lugares');
});

// Ruta para eliminar un lugar
router.get('/eliminar/:id', async (req, res) => {
  await repos.lugar.delete({ id: parseInt(req.params.id) });
  res.redirect('/lugares');
});

module.exports = router;