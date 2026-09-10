const express = require('express');
const app = express();
app.use(express.json());
const users = [
  { id: 1, nombre: 'Ana García', email: 'ana@example.com' },
  { id: 2, nombre: 'Luis Pérez', email: 'luis@example.com' },
];
app.get('/usuarios', (req, res) => res.json({ datos: users, total: users.length }));
app.get('/usuarios/:id', (req, res) => {
  const u = users.find(x => x.id === parseInt(req.params.id));
  if (!u) return res.status(404).json({ error: { codigo: 'NO_ENCONTRADO', mensaje: 'Usuario no encontrado' } });
  res.json(u);
});
app.listen(3333, () => {});
