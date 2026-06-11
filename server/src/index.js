// Ponto de entrada do servidor Express.
// Ina: voce nao chama esse arquivo diretamente — `npm run start` ja cuida disso.

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('node:path');

const authRoutes = require('./routes/auth');
const patientsRoutes = require('./routes/patients');
const familyRoutes = require('./routes/family');
const scoresRoutes = require('./routes/scores');
const attachmentsRoutes = require('./routes/attachments');
const reportsRoutes = require('./routes/reports');
const settingsRoutes = require('./routes/settings');
const adminRoutes = require('./routes/admin');

const app = express();

app.use(cors());
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true }));

// arquivos enviados ficam servidos em /uploads/<filename>
app.use('/uploads', express.static(path.resolve(__dirname, '..', 'uploads')));

app.get('/api/health', (_req, res) => res.json({ ok: true, name: 'x-fragil', time: new Date().toISOString() }));

app.use('/api/auth', authRoutes);
app.use('/api/patients', patientsRoutes);
app.use('/api/patients', familyRoutes); // GET/POST /patients/:id/family
app.use('/api', scoresRoutes); // /api/symptoms, /api/patients/:id/scores, /api/scores/:id
app.use('/api', attachmentsRoutes); // /api/patients/:id/attachments, /api/attachments/:id
app.use('/api/reports', reportsRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/admin', adminRoutes);

// erro generico
app.use((err, _req, res, _next) => {
  console.error('[server-error]', err);
  res.status(err.status || 500).json({ error: err.message || 'Erro interno do servidor' });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`\n  [server] X Fragil API rodando em http://localhost:${PORT}`);
  console.log(`  [server] healthcheck: http://localhost:${PORT}/api/health\n`);
});
