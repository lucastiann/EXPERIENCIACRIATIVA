// Rotas administrativas: configuracoes, profissionais, log de auditoria, catalogo de sintomas.

const express = require('express');
const bcrypt = require('bcryptjs');
const db = require('../db');
const { adminRequired } = require('../auth');
const { audit } = require('../audit');

const router = express.Router();
router.use(adminRequired);

// --- Configuracoes globais ---
router.get('/settings', async (_req, res) => {
  const rows = await db('settings');
  const out = {};
  for (const r of rows) out[r.key] = r.value;
  res.json(out);
});

router.patch('/settings', async (req, res) => {
  const updates = req.body || {};
  for (const [key, value] of Object.entries(updates)) {
    const existing = await db('settings').where({ key }).first();
    if (existing) {
      await db('settings').where({ key }).update({ value: String(value), updated_by: req.user.id, updated_at: db.fn.now() });
    } else {
      await db('settings').insert({ key, value: String(value), updated_by: req.user.id });
    }
  }
  await audit(req.user.id, 'update', 'settings', null, updates);
  res.json({ ok: true });
});

// --- Profissionais ---
router.get('/professionals', async (_req, res) => {
  const rows = await db('users')
    .where({ role: 'professional' })
    .select('id', 'name', 'email', 'profession', 'license_type', 'license_number', 'phone', 'organization', 'active', 'created_at')
    .orderBy('created_at', 'desc');
  res.json(rows);
});

router.post('/professionals', async (req, res) => {
  const { name, email, password, profession, license_type, license_number, phone, organization } = req.body || {};
  if (!name || !email || !password || !profession) {
    return res.status(400).json({ error: 'Campos obrigatorios faltando' });
  }
  const normalizedEmail = String(email).toLowerCase().trim();
  const exists = await db('users').where({ email: normalizedEmail }).first();
  if (exists) return res.status(409).json({ error: 'Email ja cadastrado' });

  const password_hash = await bcrypt.hash(password, 10);
  const [id] = await db('users').insert({
    name, email: normalizedEmail, password_hash,
    role: 'professional', profession,
    license_type, license_number, phone, organization,
  });
  await audit(req.user.id, 'create', 'user', id, { email: normalizedEmail });
  res.status(201).json(await db('users').where({ id }).first());
});

router.patch('/professionals/:id', async (req, res) => {
  const id = req.params.id;
  const updates = {};
  const fields = ['name', 'profession', 'license_type', 'license_number', 'phone', 'organization', 'active'];
  for (const f of fields) if (f in req.body) updates[f] = req.body[f];
  updates.updated_at = db.fn.now();
  await db('users').where({ id }).update(updates);
  await audit(req.user.id, 'update', 'user', id, updates);
  res.json(await db('users').where({ id }).first());
});

// --- Catalogo de sintomas (admin pode editar) ---
router.get('/symptoms', async (_req, res) => {
  const rows = await db('symptoms').orderBy('display_order');
  res.json(rows);
});

router.patch('/symptoms/:id', async (req, res) => {
  const id = req.params.id;
  const updates = {};
  const fields = ['label', 'description', 'category', 'base_weight', 'applies_to', 'display_order', 'active'];
  for (const f of fields) if (f in req.body) updates[f] = req.body[f];
  await db('symptoms').where({ id }).update(updates);
  await audit(req.user.id, 'update', 'symptom', id, updates);
  res.json(await db('symptoms').where({ id }).first());
});

// --- Log de auditoria ---
router.get('/audit', async (req, res) => {
  const limit = Math.min(parseInt(req.query.limit || '100', 10), 500);
  const rows = await db('audit_log as a')
    .leftJoin('users as u', 'u.id', 'a.user_id')
    .orderBy('a.created_at', 'desc')
    .limit(limit)
    .select('a.*', 'u.name as user_name', 'u.email as user_email');
  res.json(rows);
});

module.exports = router;
