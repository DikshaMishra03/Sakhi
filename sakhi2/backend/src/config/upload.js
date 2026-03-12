// src/config/upload.js
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { v4 as uuidv4 } from 'uuid';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const UPLOAD_DIR = process.env.UPLOAD_DIR
  ? path.resolve(process.env.UPLOAD_DIR)
  : path.join(__dirname, '../../uploads');

const VOICE_DIR = path.join(UPLOAD_DIR, 'voice-notes');

// Ensure directories exist
[UPLOAD_DIR, VOICE_DIR].forEach(dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

const ALLOWED_AUDIO = (process.env.ALLOWED_AUDIO_TYPES || 'audio/webm,audio/mp4,audio/mpeg,audio/ogg,audio/wav').split(',');
const MAX_SIZE = (parseInt(process.env.MAX_FILE_SIZE_MB) || 10) * 1024 * 1024;

// ── Voice Note Storage ─────────────────────────────────────────
const voiceStorage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, VOICE_DIR),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname) || '.webm';
    cb(null, `voice_${uuidv4()}${ext}`);
  },
});

const audioFilter = (_req, file, cb) => {
  if (ALLOWED_AUDIO.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`Unsupported audio type: ${file.mimetype}`), false);
  }
};

export const voiceUpload = multer({
  storage: voiceStorage,
  fileFilter: audioFilter,
  limits: { fileSize: MAX_SIZE },
});

export const VOICE_SERVE_PATH = '/uploads/voice-notes';
export { UPLOAD_DIR, VOICE_DIR };
