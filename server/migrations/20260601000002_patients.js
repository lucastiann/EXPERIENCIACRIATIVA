// Tabela de pacientes. Inclui o responsavel principal — mas note que cada *escore*
// pode ter um responsavel diferente (porque o comportamento muda conforme quem acompanha,
// conforme Ina explicou). Por isso o responsavel principal aqui eh so o de referencia.

exports.up = async (knex) => {
  await knex.schema.createTable('patients', (t) => {
    t.increments('id').primary();
    t.string('full_name').notNullable();
    t.string('cpf').unique(); // pode ser nulo (criancas pequenas as vezes nao tem)
    t.date('birth_date');
    t.string('sex').notNullable(); // 'M' | 'F'
    t.string('primary_caregiver_name');
    t.string('primary_caregiver_relation'); // mae, pai, avo, tutor, etc.
    t.string('primary_caregiver_phone');
    t.string('city');
    t.string('state');
    t.text('notes');
    t.string('status').notNullable().defaultTo('em_triagem'); // em_triagem | encaminhado | diagnosticado | descartado
    t.integer('created_by').references('id').inTable('users').onDelete('SET NULL');
    t.timestamp('created_at').defaultTo(knex.fn.now());
    t.timestamp('updated_at').defaultTo(knex.fn.now());
  });

  await knex.schema.raw('CREATE INDEX idx_patients_cpf ON patients(cpf)');
  await knex.schema.raw('CREATE INDEX idx_patients_name ON patients(full_name)');
};

exports.down = (knex) => knex.schema.dropTable('patients');
