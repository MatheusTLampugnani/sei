// src/database.js
const { Pool } = require('pg');
const config = require('./config');

const pool = new Pool({
  user: config.db.user,
  host: config.db.host,
  database: config.db.database,
  password: config.db.password,
  port: config.db.port,
});

pool.on('connect', () => {
  console.log('Conectado ao PostgreSQL!');
});

pool.on('error', (err) => {
  console.error('Erro inesperado no cliente do pool', err);
  process.exit(-1);
});

module.exports = {
  query: (text, params) => pool.query(text, params),
  getClient: () => pool.connect(), // Para transações, se necessário
};