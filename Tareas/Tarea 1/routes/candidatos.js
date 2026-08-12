const express = require('express');
const router = express.Router();
const { repos } = require('../repos');

// Ruta para listar los candidatos
router.get('/', async (req, res) => {
  const candidatos = await repos.candidato.find({ relations: ['cargo', 'lugar'] });
  res.render('index', { candidatos });
});

// Ruta para mostrar el formulario de nuevo candidato
router.get('/nuevo', async (req, res) => {
  const cargos = await repos.cargo.find();
  const lugares = await repos.lugar.find();
  res.render('form', { candidato: null, cargos, lugares });
});

// Ruta para crear un candidato
router.post('/', async (req, res) => {
  const candidato = repos.candidato.create({
    ci: req.body.ci,
    nombres: req.body.nombres,
    apellido1: req.body.apellido1,
    apellido2: req.body.apellido2,
    cargo: await repos.cargo.findOneBy({ id: parseInt(req.body.cargo_id) }),
    lugar: await repos.lugar.findOneBy({ id: parseInt(req.body.lugar_id) }),
  });
  await repos.candidato.save(candidato);
  res.redirect('/');
});

// Ruta para mostrar el formulario de edición de un candidato
router.get('/editar/:ci', async (req, res) => {
  const candidato = await repos.candidato.findOne({
    where: { ci: req.params.ci },
    relations: ['cargo', 'lugar'],
  });
  const cargos = await repos.cargo.find();
  const lugares = await repos.lugar.find();
  res.render('form', { candidato, cargos, lugares });
});

// Ruta para actualizar un candidato
router.post('/editar/:ci', async (req, res) => {
  const candidato = await repos.candidato.findOneBy({ ci: req.params.ci });
  candidato.nombres = req.body.nombres;
  candidato.apellido1 = req.body.apellido1;
  candidato.apellido2 = req.body.apellido2;
  candidato.cargo = await repos.cargo.findOneBy({ id: parseInt(req.body.cargo_id) });
  candidato.lugar = await repos.lugar.findOneBy({ id: parseInt(req.body.lugar_id) });
  await repos.candidato.save(candidato);
  res.redirect('/');
});

// Ruta para eliminar un candidato
router.get('/eliminar/:ci', async (req, res) => {
  await repos.candidato.delete({ ci: req.params.ci });
  res.redirect('/');
});

module.exports = router;