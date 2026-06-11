// Upload e listagem de anexos (fotos/videos do paciente).

const express = require('express');
const path = require('node:path');
const fs = require('node:fs');
const db = require('../db');
const { authRequired } = require('../auth');
const { audit } = require('../audit');
const { upload, uploadsDir, kindFromMime } = require('../upload');

const router = express.Router();
router.use(authRequired);

// POST /api/patients/:patientId/attachments
router.post('/patients/:patientId/attachments', upload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'Arquivo nao enviado' });

  const [id] = await db('attachments').insert({
    patient_id: req.params.patientId,
    score_id: req.body.score_id || null,
    uploaded_by: req.user.id,
    file_name: req.file.filename,
    original_name: req.file.originalname,
    mime_type: req.file.mimetype,
    size_bytes: req.file.size,
    kind: kindFromMime(req.file.mimetype),
    caption: req.body.caption || null,
  });

  await audit(req.user.id, 'create', 'attachment', id, { patient_id: req.params.patientId });
  res.status(201).json(await db('attachments').where({ id }).first());
});

// GET /api/patients/:patientId/attachments
router.get('/patients/:patientId/attachments', async (req, res) => {
  const rows = await db('attachments').where({ patient_id: req.params.patientId }).orderBy('created_at', 'desc');
  res.json(rows);
});

// DELETE /api/attachments/:id
router.delete('/attachments/:id', async (req, res) => {
  const att = await db('attachments').where({ id: req.params.id }).first();
  if (!att) return res.status(404).json({ error: 'Anexo nao encontrado' });

  // remove o arquivo fisico
  try {
    fs.unlinkSync(path.join(uploadsDir, att.file_name));
  } catch (err) {
    console.warn('[attachments] arquivo nao encontrado no disco:', att.file_name);
  }

  await db('attachments').where({ id: att.id }).del();
  await audit(req.user.id, 'delete', 'attachment', att.id);
  res.json({ ok: true });
});

module.exports = router;
