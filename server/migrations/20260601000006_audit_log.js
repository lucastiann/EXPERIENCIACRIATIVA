// Historico de alteracoes. Conforme RNF14 do PDF.

exports.up = (knex) =>
  knex.schema.createTable('audit_log', (t) => {
    t.increments('id').primary();
    t.integer('user_id').references('id').inTable('users').onDelete('SET NULL');
    t.string('action').notNullable(); // 'create' | 'update' | 'delete' | 'login' | 'refer'
    t.string('entity').notNullable(); // 'patient' | 'score' | 'user' | 'attachment'
    t.integer('entity_id');
    t.text('details'); // JSON com o que mudou
    t.timestamp('created_at').defaultTo(knex.fn.now());
  });

exports.down = (knex) => knex.schema.dropTable('audit_log');
