// Dados iniciais: admin padrao + catalogo de sintomas para a triagem.
// Os pesos foram inspirados na literatura sobre X Fragil — peso maior para sinais
// mais especificos (face prolongada, macroorquidismo em homens) e peso menor para
// sinais que se sobrepoem com TEA (autismo), que sao menos discriminativos.

const bcrypt = require('bcryptjs');

const SYMPTOMS = [
  // FISICAS — alto peso, mais especificas
  { key: 'face_prolongada_orelha', label: 'Face prolongada / orelhas grandes', category: 'fisica', base_weight: 3, applies_to: 'both', display_order: 1 },
  { key: 'macroorquidismo', label: 'Macroorquidismo (testiculos aumentados)', category: 'fisica', base_weight: 4, applies_to: 'male', display_order: 2 },
  { key: 'hipermobilidade_articular', label: 'Hipermobilidade articular (dedos)', category: 'fisica', base_weight: 2, applies_to: 'both', display_order: 3 },

  // COGNITIVAS — peso medio
  { key: 'deficiencia_intelectual', label: 'Deficiencia intelectual', category: 'cognitiva', base_weight: 3, applies_to: 'both', display_order: 4 },
  { key: 'dificuldade_aprendizagem', label: 'Dificuldade de aprendizagem', category: 'cognitiva', base_weight: 2, applies_to: 'both', display_order: 5 },
  { key: 'atraso_fala', label: 'Atraso na fala', category: 'cognitiva', base_weight: 2, applies_to: 'both', display_order: 6 },
  { key: 'deficit_atencao', label: 'Deficit de atencao', category: 'cognitiva', base_weight: 2, applies_to: 'both', display_order: 7 },

  // COMPORTAMENTAIS — peso menor (alta sobreposicao com TEA)
  { key: 'hiperatividade', label: 'Hiperatividade', category: 'comportamental', base_weight: 2, applies_to: 'both', display_order: 8 },
  { key: 'movimentos_repetitivos', label: 'Movimentos repetitivos / estereotipias', category: 'comportamental', base_weight: 2, applies_to: 'both', display_order: 9 },
  { key: 'evita_contato_visual', label: 'Evita contato visual', category: 'comportamental', base_weight: 1.5, applies_to: 'both', display_order: 10 },
  { key: 'evita_contato_fisico', label: 'Evita contato fisico', category: 'comportamental', base_weight: 1, applies_to: 'both', display_order: 11 },
  { key: 'agressividade', label: 'Agressividade / ansiedade social', category: 'comportamental', base_weight: 1, applies_to: 'both', display_order: 12 },
];

exports.seed = async (knex) => {
  // limpa apenas o que vamos resemear (evita duplicar em re-runs)
  await knex('symptoms').del();
  await knex('users').where({ email: 'admin@xfragil.local' }).del();
  await knex('settings').del();

  // admin padrao
  const adminHash = await bcrypt.hash('admin123', 10);
  await knex('users').insert({
    name: 'Administrador',
    email: 'admin@xfragil.local',
    password_hash: adminHash,
    role: 'admin',
    profession: 'administrador',
    organization: 'ONG X Fragil',
    active: true,
  });

  // profissional de exemplo (para a Ina conseguir testar logo)
  const inaHash = await bcrypt.hash('ina123', 10);
  await knex('users').insert({
    name: 'Ina Bailarina',
    email: 'ina@xfragil.local',
    password_hash: inaHash,
    role: 'professional',
    profession: 'pedagogo',
    license_type: 'Registro Pedagogico',
    license_number: '000001',
    organization: 'ONG X Fragil',
    active: true,
  });

  // catalogo de sintomas
  await knex('symptoms').insert(SYMPTOMS);

  // configuracoes padrao
  await knex('settings').insert([
    { key: 'score_threshold', value: '10' }, // a partir desse escore, encaminhar para teste genetico
    { key: 'platform_name', value: 'X Fragil' },
    { key: 'ong_contact_email', value: 'contato@xfragil.local' },
    { key: 'ong_contact_phone', value: '(11) 0000-0000' },
  ]);
};
