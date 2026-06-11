// Endpoint publico (autenticado) de leitura das configuracoes.
// Qualquer profissional logado precisa saber o limiar do escore, por exemplo,
// pra mostrar no preview da tela de aplicacao do escore.
// PATCH continua sendo so do admin (em /api/admin/settings).

const express = require('express');
const db = require('../db');
const { authRequired } = require('../auth');

const router = express.Router();
router.use(authRequired);

router.get('/', async (_req, res) => {
  const rows = await db('settings');
  const out = {};
  for (const r of rows) out[r.key] = r.value;
  res.json(out);
});

module.exports = router;
