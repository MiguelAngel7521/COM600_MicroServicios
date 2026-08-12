const AppDataSource = require('./db');

// Objeto que almacena los repositorios una vez conectada la base de datos
const repos = {
  candidato: null,
  cargo: null,
  lugar: null,
};

function iniciarRepos() {
  repos.candidato = AppDataSource.getRepository('Candidato');
  repos.cargo = AppDataSource.getRepository('Cargo');
  repos.lugar = AppDataSource.getRepository('Lugar');
}

module.exports = { repos, iniciarRepos };