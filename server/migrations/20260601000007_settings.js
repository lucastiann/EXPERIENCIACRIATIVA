// Configuracoes globais editaveis pelo administrador.
// Principal: limiar do escore que dispara o encaminhamento (RF16).

exports.up = (knex) =>
  knex.schema.createTable('settings', (t) => {
    t.string('key').primary();
    t.text('value');
    t.integer('updated_by').references('id').inTable('users').onDelete('SET NULL');
    t.timestamp('updated_at').defaultTo(knex.fn.now());
  });

exports.down = (knex) => knex.schema.dropTable('settings');
