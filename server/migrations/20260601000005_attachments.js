// Anexos: fotos e videos vinculados ao paciente (ou a um escore especifico).
// Conforme Ina: a ONG precisa de fotos/videos pra avaliar caracteristicas fisicas
// (ex: hiperelasticidade nos dedos) antes de encaminhar para o teste genetico caro.

exports.up = (knex) =>
  knex.schema.createTable('attachments', (t) => {
    t.increments('id').primary();
    t.integer('patient_id').notNullable().references('id').inTable('patients').onDelete('CASCADE');
    t.integer('score_id').references('id').inTable('scores').onDelete('SET NULL');
    t.integer('uploaded_by').references('id').inTable('users').onDelete('SET NULL');
    t.string('file_name').notNullable(); // nome no disco
    t.string('original_name').notNullable(); // nome original do upload
    t.string('mime_type').notNullable();
    t.integer('size_bytes').notNullable();
    t.string('kind').notNullable().defaultTo('image'); // image | video | document
    t.text('caption'); // descricao opcional
    t.timestamp('created_at').defaultTo(knex.fn.now());
  });

exports.down = (knex) => knex.schema.dropTable('attachments');
