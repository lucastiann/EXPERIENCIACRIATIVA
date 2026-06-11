#!/usr/bin/env node
// Configuracao inicial: roda migrations e seeds se o banco ainda nao existir.
// Ina: voce nao precisa rodar nada manualmente. Isso eh chamado por `npm run start`.

const { execSync } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const dataDir = path.join(root, 'data');
const uploadsDir = path.join(root, 'server', 'uploads');
const dbFile = path.join(dataDir, 'x-fragil.sqlite3');

function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`  + criado ${path.relative(root, dir)}/`);
  }
}

function run(cmd, cwd) {
  console.log(`> ${cmd}`);
  execSync(cmd, { cwd, stdio: 'inherit' });
}

console.log('\n[setup] Preparando o ambiente da plataforma X Frágil...');

ensureDir(dataDir);
ensureDir(uploadsDir);

const isFirstBoot = !fs.existsSync(dbFile);

console.log('\n[setup] Aplicando migrations (estrutura do banco)...');
run('npm --workspace server run migrate', root);

if (isFirstBoot) {
  console.log('\n[setup] Primeira execucao detectada. Populando dados iniciais...');
  run('npm --workspace server run seed', root);
  console.log('\n[setup] Pronto!');
  console.log('   Admin padrao: admin@xfragil.local / admin123');
  console.log('   (troque essas credenciais em producao!)');
} else {
  console.log('\n[setup] Banco ja existe — pulando seeds.');
}

console.log('\n[setup] Tudo certo. Iniciando o servidor + cliente...\n');
