// Conexao unica com o banco. Usa o knexfile (mesmo do CLI de migrations).
const knex = require('knex');
const config = require('../knexfile');

const db = knex(config);

module.exports = db;
