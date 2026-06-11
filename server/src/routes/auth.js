// Rotas de autenticacao: login, cadastro de profissional, "quem sou eu".

const express = require('express');
const bcrypt = require('bcryptjs');
const db = require('../db');
const { signToken, authRequired } = require('../auth');
const { audit } = require('../audit');

const router = express.Router();

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) {
    return res.status(400).json({ error: 'Informe email e senha' });
  }

  const user = await db('users').where({ email: String(email).toLowerCase() }).first();
  if (!user || !user.active) {
    return res.status(401).json({ error: 'Credenciais invalidas' });
  }

  const ok = await bcrypt.compare(password, user.password_hash);
  if (!ok) return res.status(401).json({ error: 'Credenciais invalidas' });

  await audit(user.id, 'login', 'user', user.id);
  const token = signToken(user);
  return res.json({
    token,
    user: { id: user.id, name: user.name, email: user.email, role: user.role, profession: user.profession },
  });
});

// POST /api/auth/signup — cadastro publico de profissional (medico, pedagogo, etc.)
router.post('/signup', async (req, res) => {
  const { name, email, password, profession, license_type, license_number, phone, organization } = req.body || {};

  if (!name || !email || !password || !profession) {
    return res.status(400).json({ error: 'Campos obrigatorios: nome, email, senha, profissao' });
  }
  if (String(password).length < 6) {
    return res.status(400).json({ error: 'A senha deve ter pelo menos 6 caracteres' });
  }

  const normalizedEmail = String(email).toLowerCase().trim();
  const exists = await db('users').where({ email: normalizedEmail }).first();
  if (exists) return res.status(409).json({ error: 'Esse email ja esta cadastrado' });

  const password_hash = await bcrypt.hash(password, 10);
  const [id] = await db('users').insert({
    name,
    email: normalizedEmail,
    password_hash,
    role: 'professional',
    profession,
    license_type: license_type || null,
    license_number: license_number || null,
    phone: phone || null,
    organization: organization || null,
  });

  const user = await db('users').where({ id }).first();
  await audit(id, 'create', 'user', id, { email: normalizedEmail, profession });

  const token = signToken(user);
  res.status(201).json({
    token,
    user: { id: user.id, name: user.name, email: user.email, role: user.role, profession: user.profession },
  });
});

// GET /api/auth/me
router.get('/me', authRequired, async (req, res) => {
  const user = await db('users').where({ id: req.user.id }).first();
  if (!user) return res.status(404).json({ error: 'Usuario nao encontrado' });
  res.json({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    profession: user.profession,
    organization: user.organization,
  });
});

module.exports = router;
