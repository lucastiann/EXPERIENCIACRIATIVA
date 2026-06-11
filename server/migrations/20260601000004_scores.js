// Escores (questionario respondido). Um paciente pode ter VARIOS escores ao longo do tempo:
// - Primeira resposta: pelo profissional que suspeita
// - Segunda resposta: pela ONG, por ligacao com a familia
// - Mais respostas: outros acompanhantes da crianca (pai, mae, avo) podem responder
//   e o resultado muda — isso eh importante para o diagnostico diferencial.

exports.up = async (knex) => {
  // catalogo de sintomas (pode ser editado pelo admin)
  await knex.schema.createTable('symptoms', (t) => {
    t.increments('id').primary();
    t.string('key').notNullable().unique(); // ex: 'deficiencia_intelectual'
    t.string('label').notNullable(); // ex: 'Deficiencia intelectual'
    t.text('description');
    t.string('category').notNullable().defaultTo('comportamental'); // fisica | cognitiva | comportamental
    t.float('base_weight').notNullable().defaultTo(1);
    t.string('applies_to').notNullable().defaultTo('both'); // 'male' | 'female' | 'both'
    t.integer('display_order').notNullable().defaultTo(0);
    t.boolean('active').notNullable().defaultTo(true);
  });

  // cada escore = uma sessao de avaliacao
  await knex.schema.createTable('scores', (t) => {
    t.increments('id').primary();
    t.integer('patient_id').notNullable().references('id').inTable('patients').onDelete('CASCADE');
    t.integer('professional_id').notNullable().references('id').inTable('users').onDelete('RESTRICT');

    // quem reportou os sintomas nessa sessao (acompanhante, profissional, etc.)
    t.string('respondent_type').notNullable().defaultTo('profissional');
    // 'profissional' | 'familiar_cadastrado' | 'familiar_telefone' | 'outro'
    t.integer('family_member_id').references('id').inTable('family_members').onDelete('SET NULL');
    t.string('respondent_name'); // nome livre se nao for familiar cadastrado
    t.string('respondent_relation'); // ex: 'mae', 'professora'

    t.float('total_score').notNullable().defaultTo(0);
    t.float('max_possible_score').notNullable().defaultTo(0);
    t.float('threshold_used').notNullable();
    t.boolean('refer_to_genetic_test').notNullable().defaultTo(false);
    t.text('session_notes');
    t.timestamp('created_at').defaultTo(knex.fn.now());
  });

  // ligacao escore <-> sintoma
  await knex.schema.createTable('score_symptoms', (t) => {
    t.increments('id').primary();
    t.integer('score_id').notNullable().references('id').inTable('scores').onDelete('CASCADE');
    t.integer('symptom_id').notNullable().references('id').inTable('symptoms').onDelete('RESTRICT');
    t.boolean('present').notNullable().defaultTo(false);
    t.float('weight_applied').notNullable().defaultTo(0); // peso real aplicado (ajustado por sexo)
  });

  await knex.schema.raw('CREATE INDEX idx_scores_patient ON scores(patient_id)');
  await knex.schema.raw('CREATE INDEX idx_scores_created ON scores(created_at)');
};

exports.down = async (knex) => {
  await knex.schema.dropTable('score_symptoms');
  await knex.schema.dropTable('scores');
  await knex.schema.dropTable('symptoms');
};
