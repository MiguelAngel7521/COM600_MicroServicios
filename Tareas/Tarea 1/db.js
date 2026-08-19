const dotenv = require('dotenv');
dotenv.config();
const { DataSource } = require('typeorm');
const Cargo = require('./entities/Cargo');
const Lugar = require('./entities/Lugar');
const Candidato = require('./entities/Candidato');

const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: true,
  entities: [Cargo, Lugar, Candidato],
});

module.exports = AppDataSource;