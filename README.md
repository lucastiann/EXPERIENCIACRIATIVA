<div align="center">
   Instituto Buko Kaesemodel 🦋
  
  ### Plataforma colaborativa de triagem clínica para a Síndrome do X Frágil
</div>

## Como rodar?

```bash
git clone https://github.com/lucastiann/EXPERIENCIACRIATIVA.git
cd EXPERIENCIACRIATIVA
npm install && npm run start
```

Abre em **http://localhost:5173**.

> **Sem MySQL, sem Workbench, sem PHP, sem `mysqli`.**
> O banco é um arquivo `data/x-fragil.sqlite3` criado automaticamente pelas migrations na primeira execução.

**Credenciais prontas pra demonstrar:**

| Perfil | Email | Senha |
|---|---|---|
| Administrador | `admin@xfragil.local` | `admin123` |
| Profissional (pedagoga) | `ina@xfragil.local` | `ina123` |


## ⌬ Comandos úteis

```bash
npm run start         # roda tudo: migrations + servidor + cliente
npm run migrate       # aplica migrations pendentes
npm run seed          # popula dados iniciais (admin, sintomas, settings)
npm run reset-db      # apaga o banco e refaz do zero — útil em dev
```

---

## ⌬ A arquitetura

#### Monorepo com npm workspaces

```
novo_projeto/
├── client/                        React + Vite + Tailwind + Remotion
│   ├── src/
│   │   ├── pages/                 ⟵ uma página por rota
│   │   ├── components/            ⟵ design system
│   │   ├── remotion/              ⟵ composição do vídeo
│   │   ├── auth/                  ⟵ contexto JWT
│   │   └── api/                   ⟵ wrapper axios
│   └── vite.config.js             ⟵ proxy /api → :3001
│
├── server/                        Express + SQLite + Knex
│   ├── src/
│   │   ├── routes/                ⟵ auth, patients, scores, family,
│   │   │                           attachments, reports, admin
│   │   ├── score-engine.js        ⟵ cálculo ponderado por sexo
│   │   ├── auth.js                ⟵ middleware JWT
│   │   └── audit.js               ⟵ log de auditoria
│   ├── migrations/                ⟵ versionadas, reversíveis
│   ├── seeds/                     ⟵ admin + catálogo de sintomas
│   └── uploads/                   ⟵ fotos/vídeos (gitignored)
│
├── data/                          banco SQLite (gitignored)
├── scripts/setup.js               roda migrations + seeds antes do start
└── package.json                   orquestra tudo com workspaces
```

#### Stack

| Camada | Ferramenta | Por quê |
|---|---|---|
| Frontend | **React 18** + **Vite** | velocidade de dev, HMR, sem bundler complicado |
| Estilo | **TailwindCSS** + design tokens customizados | sistema de design coerente sem CSS-in-JS |
| Animação | **framer-motion*** | UI sutilezas |
| Roteamento | **react-router-dom** | padrão da indústria |
| HTTP | **axios** + interceptor de token | injeta JWT automaticamente |
| Backend | **Express 4** | minimalista, fácil de extender |
| Banco | **SQLite** via **Knex** | zero instalação, migrations limpas |
| Auth | **JWT** + **bcrypt** | hash de senha + sessão sem state |
| Uploads | **multer** | fotos/vídeos pro `server/uploads/` |

---

## ⌬ A API

Tudo vive sob `/api`. Rotas autenticadas exigem `Authorization: Bearer <jwt>`.

| Método | Rota | Quem usa | O que faz |
|---|---|---|---|
| `POST` | `/auth/login` | qualquer um | retorna `{ token, user }` |
| `POST` | `/auth/signup` | profissionais | autocadastro |
| `GET`  | `/auth/me` | autenticado | sessão atual |
| `GET`  | `/patients` | autenticado | lista, com `?search=` |
| `GET`  | `/patients/by-cpf/:cpf` | autenticado | busca direta por CPF |
| `POST` | `/patients` | autenticado | cria paciente |
| `GET`  | `/patients/:id` | autenticado | prontuário completo |
| `PATCH`| `/patients/:id` | autenticado | edita |
| `DELETE`| `/patients/:id` | autenticado | exclui |
| `GET`  | `/patients/:id/family` | autenticado | familiares |
| `POST` | `/patients/:id/family` | autenticado | adiciona familiar |
| `GET`  | `/symptoms?sex=M\|F` | autenticado | catálogo filtrado |
| `POST` | `/patients/:id/scores` | autenticado | aplica novo escore |
| `GET`  | `/scores/:id` | autenticado | detalhe do escore |
| `POST` | `/patients/:id/attachments` | autenticado | upload de foto/vídeo |
| `GET`  | `/reports/summary` | autenticado | KPIs do dashboard |
| `GET`  | `/reports/referrals?from=&to=` | autenticado | encaminhamentos por período |
| `GET`  | `/settings` | autenticado | configurações públicas |
| `GET`  | `/admin/settings` | admin | todas as configurações |
| `PATCH`| `/admin/settings` | admin | edita configurações |
| `GET`  | `/admin/professionals` | admin | lista profissionais |
| `PATCH`| `/admin/professionals/:id` | admin | ativa/desativa |
| `GET`  | `/admin/audit` | admin | log de auditoria |

---

<div align="center">

```
─────────────────────────────────────────────────────────────────────
        feito com cuidado por Marina Cella Scarpari, Lucas Tian Le Wu, Christian Hideyuki Sasaoka, 
Eduardo dos Santos Granha, Thiago Marcos Burtet para que cada teste genético do
        Instituto Buko Kaesemodel ajude quem mais precisa 🦋
─────────────────────────────────────────────────────────────────────
```

</div>

