// Relatorios — principalmente: lista de pacientes encaminhados para teste genetico
// em um intervalo de tempo (RF14).

const express = require('express');
const db = require('../db');
const { authRequired } = require('../auth');

const router = express.Router();
router.use(authRequired);

// GET /api/reports/referrals?from=YYYY-MM-DD&to=YYYY-MM-DD
router.get('/referrals', async (req, res) => {
  const { from, to } = req.query;

  let q = db('scores as s')
    .innerJoin('patients as p', 'p.id', 's.patient_id')
    .leftJoin('users as u', 'u.id', 's.professional_id')
    .where('s.refer_to_genetic_test', true)
    .orderBy('s.created_at', 'desc')
    .select(
      's.id as score_id',
      's.total_score',
      's.threshold_used',
      's.created_at',
      's.respondent_type',
      'p.id as patient_id',
      'p.full_name as patient_name',
      'p.cpf as patient_cpf',
      'p.sex as patient_sex',
      'p.status as patient_status',
      'u.name as professional_name',
      'u.profession as professional_profession'
    );

  if (from) q = q.andWhere('s.created_at', '>=', from);
  if (to) q = q.andWhere('s.created_at', '<=', to + ' 23:59:59');

  const rows = await q;
  res.json(rows);
});

// GET /api/reports/summary — KPIs do dashboard
router.get('/summary', async (req, res) => {
  const [
    patientsTotal,
    referredTotal,
    scoresTotal,
    professionalsTotal,
    attachmentsTotal,
  ] = await Promise.all([
    db('patients').count('* as n').first(),
    db('patients').where({ status: 'encaminhado' }).count('* as n').first(),
    db('scores').count('* as n').first(),
    db('users').where({ role: 'professional', active: true }).count('* as n').first(),
    db('attachments').count('* as n').first(),
  ]);

  const recentReferrals = await db('scores as s')
    .innerJoin('patients as p', 'p.id', 's.patient_id')
    .where('s.refer_to_genetic_test', true)
    .orderBy('s.created_at', 'desc')
    .limit(5)
    .select('p.full_name', 'p.id as patient_id', 's.total_score', 's.threshold_used', 's.created_at');

  res.json({
    patients: Number(patientsTotal.n),
    referred: Number(referredTotal.n),
    scores: Number(scoresTotal.n),
    professionals: Number(professionalsTotal.n),
    attachments: Number(attachmentsTotal.n),
    recentReferrals,
  });
});

module.exports = router;
