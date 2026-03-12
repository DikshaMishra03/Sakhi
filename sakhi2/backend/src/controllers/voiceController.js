// src/controllers/voiceController.js
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import prisma from '../db/client.js';
import { VOICE_DIR } from '../config/upload.js';
import logger from '../config/logger.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// POST /api/skills/:id/voice
export const uploadVoiceNote = async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, error: 'No audio file received.' });

    const skill = await prisma.skill.findUnique({ where: { id: req.params.id } });
    if (!skill) {
      fs.unlinkSync(req.file.path);
      return res.status(404).json({ success: false, error: 'Skill not found.' });
    }

    // Max 3 voice notes per skill per author
    const existing = await prisma.voiceNote.count({
      where: { skill_id: req.params.id, author_id: req.user.id },
    });
    if (existing >= 3) {
      fs.unlinkSync(req.file.path);
      return res.status(400).json({ success: false, error: 'Maximum 3 voice notes per skill.' });
    }

    const voiceNote = await prisma.voiceNote.create({
      data: {
        skill_id: req.params.id,
        author_id: req.user.id,
        file_path: req.file.filename,
        file_size: req.file.size,
        mime_type: req.file.mimetype,
        language: req.body.language || 'Hindi',
        duration_s: parseInt(req.body.duration_s) || 0,
      },
      include: { author: { select: { id: true, name: true, avatar_color: true } } },
    });

    logger.info(`Voice note uploaded: ${voiceNote.id} for skill ${req.params.id}`);
    res.status(201).json({ success: true, data: voiceNote });
  } catch (err) { next(err); }
};

// GET /api/skills/:id/voice
export const getVoiceNotes = async (req, res, next) => {
  try {
    const voiceNotes = await prisma.voiceNote.findMany({
      where: { skill_id: req.params.id },
      orderBy: { created_at: 'desc' },
      include: { author: { select: { id: true, name: true, avatar_color: true, city: true } } },
    });
    res.json({ success: true, data: voiceNotes });
  } catch (err) { next(err); }
};

// GET /api/voice/:id/stream  — serves audio file with range support
export const streamVoiceNote = async (req, res, next) => {
  try {
    const voiceNote = await prisma.voiceNote.findUnique({ where: { id: req.params.id } });
    if (!voiceNote) return res.status(404).json({ success: false, error: 'Voice note not found.' });

    const filePath = path.join(VOICE_DIR, voiceNote.file_path);
    if (!fs.existsSync(filePath)) return res.status(404).json({ success: false, error: 'Audio file not found.' });

    const stat = fs.statSync(filePath);
    const fileSize = stat.size;
    const range = req.headers.range;

    // Increment play count asynchronously
    prisma.voiceNote.update({ where: { id: req.params.id }, data: { plays_count: { increment: 1 } } }).catch(() => {});

    if (range) {
      const [start, end] = range.replace(/bytes=/, '').split('-').map((v, i) => v ? parseInt(v) : (i === 0 ? 0 : fileSize - 1));
      const chunkSize = end - start + 1;
      res.writeHead(206, {
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunkSize,
        'Content-Type': voiceNote.mime_type,
      });
      fs.createReadStream(filePath, { start, end }).pipe(res);
    } else {
      res.writeHead(200, {
        'Content-Length': fileSize,
        'Content-Type': voiceNote.mime_type,
        'Accept-Ranges': 'bytes',
      });
      fs.createReadStream(filePath).pipe(res);
    }
  } catch (err) { next(err); }
};

// DELETE /api/voice/:id
export const deleteVoiceNote = async (req, res, next) => {
  try {
    const voiceNote = await prisma.voiceNote.findUnique({ where: { id: req.params.id } });
    if (!voiceNote) return res.status(404).json({ success: false, error: 'Not found.' });
    if (voiceNote.author_id !== req.user.id) return res.status(403).json({ success: false, error: 'Unauthorized.' });

    const filePath = path.join(VOICE_DIR, voiceNote.file_path);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

    await prisma.voiceNote.delete({ where: { id: req.params.id } });
    res.json({ success: true, message: 'Voice note deleted.' });
  } catch (err) { next(err); }
};
