// Rotas para CRUD de pacientes + busca por CPF.

const express = require('express');
const db = require('../db');
const { authRequired } = require('../auth');
const { audit } = require('../audit');

const router = express.Router();
router.use(authRequired);

// GET /api/patients?search=...
router.get('/', async (req, res) => {
  const search = (req.query.search || '').toString().trim();
  let q = db('patients').orderBy('updated_at', 'desc');

  if (search) {
    const onlyDigits = search.replace(/\D/g, '');
    q = q.where(function () {
      this.where('full_name', 'like', `%${search}%`);
      if (onlyDigits.length >= 3) this.orWhere('cpf', 'like', `%${onlyDigits}%`);
    });
  }

  const rows = await q.limit(200);
  // anexa o ultimo escore
  const ids = rows.map((r) => r.id);
  const lastScores = ids.length
    ? await db('scores').whereIn('patient_id', ids).orderBy('created_at', 'desc')
    : [];
  const byPatient = {};
  for (const s of lastScores) if (!byPatient[s.patient_id]) byPatient[s.patient_id] = s;

  res.json(rows.map((p) => ({ ...p, last_score: byPatient[p.id] || null })));
});

// GET /api/patients/by-cpf/:cpf — busca direta (RF11)
router.get('/by-cpf/:cpf', async (req, res) => {
  const cpf = req.params.cpf.replace(/\D/g, '');
  const patient = await db('patients').where({ cpf }).first();
  if (!patient) return res.status(404).json({ error: 'Paciente nao encontrado' });
  res.json(patient);
});

// POST /api/patients
router.post('/', async (req, res) => {
  const {
    full_name,
    cpf,
    birth_date,
    sex,
    primary_caregiver_name,
    primary_caregiver_relation,
    primary_caregiver_phone,
    city,
    state,
    notes,
  } = req.body || {};

  if (!full_name || !sex) {
    return res.status(400).json({ error: 'Nome completo e sexo sao obrigatorios' });
  }

  const cleanCpf = cpf ? String(cpf).replace(/\D/g, '') : null;
  if (cleanCpf) {
    const exists = await db('patients').where({ cpf: cleanCpf }).first();
    if (exists) return res.status(409).json({ error: 'Ja existe paciente com esse CPF', existing_id: exists.id });
  }

  const [id] = await db('patients').insert({
    full_name,
    cpf: cleanCpf,
    birth_date: birth_date || null,
    sex,
    primary_caregiver_name,
    primary_caregiver_relation,
    primary_caregiver_phone,
    city,
    state,
    notes,
    created_by: req.user.id,
  });

  await audit(req.user.id, 'create', 'patient', id, { full_name });
  const patient = await db('patients').where({ id }).first();
  res.status(201).json(patient);
});

// GET /api/patients/:id — detalhes completos
router.get('/:id', async (req, res) => {
  const patient = await db('patients').where({ id: req.params.id }).first();
  if (!patient) return res.status(404).json({ error: 'Paciente nao encontrado' });

  const family = await db('family_members').where({ patient_id: patient.id }).orderBy('created_at', 'desc');
  const scores = await db('scores').where({ patient_id: patient.id }).orderBy('created_at', 'desc');
  const attachments = await db('attachments').where({ patient_id: patient.id }).orderBy('created_at', 'desc');

  // enriquece scores com o nome do profissional
  const profIds = [...new Set(scores.map((s) => s.professional_id))];
  const profs = profIds.length ? await db('users').whereIn('id', profIds) : [];
  const profMap = Object.fromEntries(profs.map((p) => [p.id, p.name]));
  const scoresEnriched = scores.map((s) => ({ ...s, professional_name: profMap[s.professional_id] }));

  res.json({ ...patient, family, scores: scoresEnriched, attachments });
});

// PATCH /api/patients/:id
router.patch('/:id', async (req, res) => {
  const id = req.params.id;
  const patient = await db('patients').where({ id }).first();
  if (!patient) return res.status(404).json({ error: 'Paciente nao encontrado' });

  const updates = {};
  const fields = [
    'full_name', 'birth_date', 'sex', 'primary_caregiver_name', 'primary_caregiver_relation',
    'primary_caregiver_phone', 'city', 'state', 'notes', 'status',
  ];
  for (const f of fields) if (f in req.body) updates[f] = req.body[f];
  updates.updated_at = db.fn.now();

  await db('patients').where({ id }).update(updates);
  await audit(req.user.id, 'update', 'patient', id, updates);
  res.json(await db('patients').where({ id }).first());
});

// DELETE /api/patients/:id
router.delete('/:id', async (req, res) => {
  const id = req.params.id;
  const patient = await db('patients').where({ id }).first();
  if (!patient) return res.status(404).json({ error: 'Paciente nao encontrado' });

  await db('patients').where({ id }).del();
  await audit(req.user.id, 'delete', 'patient', id, { full_name: patient.full_name });
  res.json({ ok: true });
});

module.exports = router;
