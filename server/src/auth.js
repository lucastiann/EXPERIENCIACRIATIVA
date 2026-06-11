// Middleware de autenticacao por JWT.
// O token eh enviado pelo cliente no header `Authorization: Bearer <token>`.

const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-troque-em-producao';
const TOKEN_TTL = '12h';

function signToken(user) {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    },
    JWT_SECRET,
    { expiresIn: TOKEN_TTL }
  );
}

function authRequired(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ error: 'Token nao informado' });
  }

  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Token invalido ou expirado' });
  }
}

function adminRequired(req, res, next) {
  authRequired(req, res, (err) => {
    if (err) return;
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Apenas administradores podem fazer isso' });
    }
    next();
  });
}

module.exports = { signToken, authRequired, adminRequired, JWT_SECRET };
