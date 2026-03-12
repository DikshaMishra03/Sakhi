// src/routes/auth.js
import { Router } from 'express';
import { body } from 'express-validator';
import { register, login, getMe, updateProfile, getUserProfile, toggleFollow } from '../controllers/authController.js';
import { authenticate } from '../middleware/auth.js';
import { authLimiter } from '../middleware/rateLimit.js';

const router = Router();

router.post('/register', authLimiter, [
  body('name').trim().notEmpty().isLength({ min: 2, max: 60 }).withMessage('Name must be 2–60 characters'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('preferred_lang').optional().isLength({ max: 10 }),
], register);

router.post('/login', authLimiter, [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty(),
], login);

router.get('/me', authenticate, getMe);
router.put('/me', authenticate, updateProfile);
router.get('/users/:id', getUserProfile);
router.post('/follow/:id', authenticate, toggleFollow);

export default router;
