// Familiares do paciente. Importante para o X Fragil: quando o paciente eh confirmado,
// outros familiares provavelmente tambem carregam a mutacao (heranca ligada ao X).
// Isso permite rastreamento genetico — conforme Ina pediu.

exports.up = async (knex) => {
  await knex.schema.createTable('family_members', (t) => {
    t.increments('id').primary();
    t.integer('patient_id').notNullable().references('id').inTable('patients').onDelete('CASCADE');
    t.string('name').notNullable();
    t.string('relation').notNullable(); // mae, pai, irmao, tio, avo, primo, etc.
    t.string('side'); // 'materna' | 'paterna' (linha familiar — importante para genetica)
    t.string('sex'); // 'M' | 'F'
    t.date('birth_date');
    t.string('has_diagnosis').defaultTo('desconhecido'); // 'sim' | 'nao' | 'desconhecido'
    t.text('symptoms_observed'); // texto livre — sintomas conhecidos
    t.text('notes');
    t.timestamp('created_at').defaultTo(knex.fn.now());
  });
};

exports.down = (knex) => knex.schema.dropTable('family_members');
