// src/routes/voice.js
import { Router } from 'express';
import { streamVoiceNote, deleteVoiceNote } from '../controllers/voiceController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.get('/:id/stream', streamVoiceNote);
router.delete('/:id', authenticate, deleteVoiceNote);

export default router;
