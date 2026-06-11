// Helper para registrar acoes no log de auditoria.
const db = require('./db');

async function audit(userId, action, entity, entityId, details) {
  try {
    await db('audit_log').insert({
      user_id: userId || null,
      action,
      entity,
      entity_id: entityId || null,
      details: details ? JSON.stringify(details) : null,
    });
  } catch (err) {
    console.error('[audit] falhou:', err.message);
  }
}

module.exports = { audit };
