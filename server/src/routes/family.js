// Familiares vinculados a um paciente — para rastreamento genetico.

const express = require('express');
const db = require('../db');
const { authRequired } = require('../auth');
const { audit } = require('../audit');

const router = express.Router();
router.use(authRequired);

// GET /api/patients/:patientId/family
router.get('/:patientId/family', async (req, res) => {
  const rows = await db('family_members')
    .where({ patient_id: req.params.patientId })
    .orderBy('created_at', 'desc');
  res.json(rows);
});

// POST /api/patients/:patientId/family
router.post('/:patientId/family', async (req, res) => {
  const { name, relation, side, sex, birth_date, has_diagnosis, symptoms_observed, notes } = req.body || {};
  if (!name || !relation) return res.status(400).json({ error: 'Nome e relacao sao obrigatorios' });

  const [id] = await db('family_members').insert({
    patient_id: req.params.patientId,
    name,
    relation,
    side: side || null,
    sex: sex || null,
    birth_date: birth_date || null,
    has_diagnosis: has_diagnosis || 'desconhecido',
    symptoms_observed: symptoms_observed || null,
    notes: notes || null,
  });

  await audit(req.user.id, 'create', 'family_member', id, { name, relation });
  res.status(201).json(await db('family_members').where({ id }).first());
});

// DELETE /api/family/:id
router.delete('/family/:id', async (req, res) => {
  await db('family_members').where({ id: req.params.id }).del();
  await audit(req.user.id, 'delete', 'family_member', req.params.id);
  res.json({ ok: true });
});

module.exports = router;
