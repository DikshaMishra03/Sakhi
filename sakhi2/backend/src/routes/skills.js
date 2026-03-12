// src/routes/skills.js
import { Router } from 'express';
import { body } from 'express-validator';
import {
  getSkills, getFeaturedSkills, getSkillById, createSkill,
  updateSkill, deleteSkill, toggleSave, getSavedSkills,
  addComment, deleteComment, searchSkills, getCategories, getStats
} from '../controllers/skillsController.js';
import { uploadVoiceNote, getVoiceNotes } from '../controllers/voiceController.js';
import { authenticate, optionalAuth } from '../middleware/auth.js';
import { voiceUpload } from '../config/upload.js';
import { uploadLimiter } from '../middleware/rateLimit.js';

const router = Router();

const skillValidation = [
  body('title').trim().notEmpty().isLength({ min: 10, max: 255 }).withMessage('Title must be 10–255 characters'),
  body('subtitle').trim().notEmpty().isLength({ min: 10, max: 400 }),
  body('body').trim().notEmpty().isLength({ min: 100 }).withMessage('Content must be at least 100 characters'),
  body('category_id').notEmpty().withMessage('Category is required'),
];

// Public
router.get('/', optionalAuth, getSkills);
router.get('/featured', getFeaturedSkills);
router.get('/search', searchSkills);
router.get('/categories', getCategories);
router.get('/stats', getStats);

// Auth required
router.get('/saved', authenticate, getSavedSkills);
router.get('/:id', optionalAuth, getSkillById);

router.post('/', authenticate, skillValidation, createSkill);
router.put('/:id', authenticate, updateSkill);
router.delete('/:id', authenticate, deleteSkill);

router.post('/:id/save', authenticate, toggleSave);

router.post('/:id/comments', authenticate, [
  body('body').trim().notEmpty().isLength({ min: 2, max: 1000 }).withMessage('Comment must be 2–1000 characters'),
], addComment);
router.delete('/:id/comments/:commentId', authenticate, deleteComment);

// Voice notes
router.get('/:id/voice', getVoiceNotes);
router.post('/:id/voice', authenticate, uploadLimiter, voiceUpload.single('audio'), uploadVoiceNote);

export default router;
