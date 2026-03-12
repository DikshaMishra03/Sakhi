// src/routes/analytics.js
import { Router } from 'express';
import { getDashboard, getSkillAnalytics, getMyAnalytics } from '../controllers/analyticsController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.get('/dashboard', getDashboard);
router.get('/my', authenticate, getMyAnalytics);
router.get('/skills/:id', authenticate, getSkillAnalytics);

export default router;
