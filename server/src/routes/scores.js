// Rotas relacionadas ao escore: catalogo de sintomas, criacao de novo escore, listagem.

const express = require('express');
const db = require('../db');
const { authRequired } = require('../auth');
const { audit } = require('../audit');
const { calculateScore } = require('../score-engine');

const router = express.Router();
router.use(authRequired);

// GET /api/symptoms — catalogo (filtrado por sexo se passar ?sex=)
router.get('/symptoms', async (req, res) => {
  const sex = req.query.sex; // 'M' | 'F' opcional
  let q = db('symptoms').where({ active: true }).orderBy('display_order');
  const rows = await q;
  let filtered = rows;
  if (sex === 'M') filtered = rows.filter((s) => s.applies_to !== 'female');
  if (sex === 'F') filtered = rows.filter((s) => s.applies_to !== 'male');
  res.json(filtered);
});

async function getThreshold() {
  const row = await db('settings').where({ key: 'score_threshold' }).first();
  return row ? parseFloat(row.value) : 10;
}

// POST /api/patients/:patientId/scores — cria um novo escore (sessao de avaliacao)
router.post('/patients/:patientId/scores', async (req, res) => {
  const patientId = req.params.patientId;
  const patient = await db('patients').where({ id: patientId }).first();
  if (!patient) return res.status(404).json({ error: 'Paciente nao encontrado' });

  const {
    symptom_keys, // array de keys marcadas
    respondent_type, // 'profissional' | 'familiar_cadastrado' | 'familiar_telefone' | 'outro'
    family_member_id,
    respondent_name,
    respondent_relation,
    session_notes,
  } = req.body || {};

  if (!Array.isArray(symptom_keys)) {
    return res.status(400).json({ error: 'symptom_keys deve ser um array' });
  }

  const symptoms = await db('symptoms').where({ active: true });
  const threshold = await getThreshold();
  const calc = calculateScore({
    symptoms,
    selectedKeys: symptom_keys,
    patientSex: patient.sex,
    threshold,
  });

  const [scoreId] = await db('scores').insert({
    patient_id: patient.id,
    professional_id: req.user.id,
    respondent_type: respondent_type || 'profissional',
    family_member_id: family_member_id || null,
    respondent_name: respondent_name || null,
    respondent_relation: respondent_relation || null,
    total_score: calc.total,
    max_possible_score: calc.max,
    threshold_used: threshold,
    refer_to_genetic_test: calc.refer,
    session_notes: session_notes || null,
  });

  // grava cada sintoma marcado
  for (const item of calc.breakdown) {
    await db('score_symptoms').insert({
      score_id: scoreId,
      symptom_id: item.symptom_id,
      present: item.present,
      weight_applied: item.weight_applied,
    });
  }

  // se foi encaminhado, atualiza status do paciente
  if (calc.refer && patient.status === 'em_triagem') {
    await db('patients').where({ id: patient.id }).update({ status: 'encaminhado', updated_at: db.fn.now() });
  }

  await audit(req.user.id, 'create', 'score', scoreId, { patient_id: patient.id, total: calc.total, refer: calc.refer });

  res.status(201).json({
    id: scoreId,
    ...calc,
  });
});

// GET /api/scores/:id — detalhe completo do escore
router.get('/scores/:id', async (req, res) => {
  const score = await db('scores').where({ id: req.params.id }).first();
  if (!score) return res.status(404).json({ error: 'Escore nao encontrado' });

  const items = await db('score_symptoms as ss')
    .leftJoin('symptoms as s', 's.id', 'ss.symptom_id')
    .where('ss.score_id', score.id)
    .select(
      'ss.id',
      'ss.present',
      'ss.weight_applied',
      's.key as symptom_key',
      's.label as symptom_label',
      's.category as symptom_category'
    );

  const professional = await db('users').where({ id: score.professional_id }).first();

  res.json({
    ...score,
    professional_name: professional?.name,
    items,
  });
});

module.exports = router;
