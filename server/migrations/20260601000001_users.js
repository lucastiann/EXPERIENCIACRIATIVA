// Tabela de usuarios — profissionais (medicos, pedagogos, terapeutas, etc.) e administradores.
// Conforme Ina: a triagem nao eh feita apenas por medicos.

exports.up = async (knex) => {
  await knex.schema.createTable('users', (t) => {
    t.increments('id').primary();
    t.string('name').notNullable();
    t.string('email').notNullable().unique();
    t.string('password_hash').notNullable();
    t.string('role').notNullable().defaultTo('professional'); // 'admin' | 'professional'
    t.string('profession'); // ex: 'medico', 'pedagogo', 'fonoaudiologo', 'psicologo', 'enfermeiro', 'outro'
    t.string('license_type'); // ex: 'CRM', 'CRP', 'CREFITO', etc.
    t.string('license_number');
    t.string('phone');
    t.string('organization'); // clinica, escola, ONG associada
    t.boolean('active').notNullable().defaultTo(true);
    t.timestamp('created_at').defaultTo(knex.fn.now());
    t.timestamp('updated_at').defaultTo(knex.fn.now());
  });
};

exports.down = (knex) => knex.schema.dropTable('users');
