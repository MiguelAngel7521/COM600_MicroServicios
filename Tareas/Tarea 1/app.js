const express = require('express');
const app = express();
const dotenv = require('dotenv');
dotenv.config();
const port = process.env.PORT || 3000;

// Configuramos EJS como motor de plantillas
app.set('views', './views');
app.set('view engine', 'ejs');
// Middleware para parsear datos de formularios
app.use(express.urlencoded({ extended: false }));

const AppDataSource = require('./db');
const { iniciarRepos } = require('./repos');
const candidatosRouter = require('./routes/candidatos');
const cargosRouter = require('./routes/cargos');
const lugaresRouter = require('./routes/lugares');

// Conectamos los routers al servidor
app.use('/', candidatosRouter);
app.use('/cargos', cargosRouter);
app.use('/lugares', lugaresRouter);

async function inicio() {
  try {
    await AppDataSource.initialize();
    console.log('Base de datos conectada correctamente');
    iniciarRepos();
    app.listen(port, () => {
      console.log(`Servidor escuchando en el puerto ${port}`);
    });
  } catch (error) {
    console.error('Error al conectar a la base de datos', error);
  }
}

inicio();