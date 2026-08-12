const express = require('express');
const router = express.Router();
const { repos } = require('../repos');

// Ruta para listar los cargos
router.get('/', async (req, res) => {
  const cargos = await repos.cargo.find();
  res.render('cargos', { cargos });
});

// Ruta para crear un cargo
router.post('/', async (req, res) => {
  const cargo = repos.cargo.create({ nombre: req.body.nombre });
  await repos.cargo.save(cargo);
  res.redirect('/cargos');
});

// Ruta para mostrar el formulario de edición de un cargo
router.get('/editar/:id', async (req, res) => {
  const cargo = await repos.cargo.findOneBy({ id: parseInt(req.params.id) });
  res.render('cargos-form', { cargo });
});

// Ruta para actualizar un cargo
router.post('/editar/:id', async (req, res) => {
  const cargo = await repos.cargo.findOneBy({ id: parseInt(req.params.id) });
  cargo.nombre = req.body.nombre;
  await repos.cargo.save(cargo);
  res.redirect('/cargos');
});

// Ruta para eliminar un cargo
router.get('/eliminar/:id', async (req, res) => {
  await repos.cargo.delete({ id: parseInt(req.params.id) });
  res.redirect('/cargos');
});

module.exports = router;