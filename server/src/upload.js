// Upload de arquivos: fotos e videos de pacientes (caracteristicas fisicas).
// Os arquivos vao para /server/uploads/ — em producao isso deveria ser um bucket S3 etc.

const multer = require('multer');
const path = require('node:path');
const crypto = require('node:crypto');

const uploadsDir = path.resolve(__dirname, '..', 'uploads');

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadsDir),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const id = crypto.randomBytes(8).toString('hex');
    cb(null, `${Date.now()}-${id}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50 MB
  fileFilter: (_req, file, cb) => {
    const ok = /^(image|video)\//.test(file.mimetype);
    cb(ok ? null : new Error('Apenas imagens ou videos sao aceitos'), ok);
  },
});

function kindFromMime(mime) {
  if (mime.startsWith('image/')) return 'image';
  if (mime.startsWith('video/')) return 'video';
  return 'document';
}

module.exports = { upload, uploadsDir, kindFromMime };
