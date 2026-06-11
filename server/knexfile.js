// Configuracao do Knex (sistema de migrations).
// Banco eh SQLite -- nao precisa instalar nada, o arquivo vive em /data/.

const path = require('node:path');

module.exports = {
  client: 'better-sqlite3',
  connection: {
    filename: path.resolve(__dirname, '..', 'data', 'x-fragil.sqlite3'),
  },
  useNullAsDefault: true,
  migrations: {
    directory: path.resolve(__dirname, 'migrations'),
    tableName: 'knex_migrations',
  },
  seeds: {
    directory: path.resolve(__dirname, 'seeds'),
  },
  pool: {
    afterCreate: (conn, cb) => {
      conn.pragma('foreign_keys = ON');
      cb();
    },
  },
};
