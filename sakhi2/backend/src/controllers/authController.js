// src/controllers/authController.js
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { validationResult } from 'express-validator';
import prisma from '../db/client.js';
import logger from '../config/logger.js';

const JWT_SECRET = process.env.JWT_SECRET || 'sakhi_dev_secret_change_in_production';
const JWT_EXPIRES = process.env.JWT_EXPIRES_IN || '7d';

const signToken = (id) => jwt.sign({ id }, JWT_SECRET, { expiresIn: JWT_EXPIRES });

const AVATAR_COLORS = ['#E8621A','#4A7C59','#C9506A','#5B4FCF','#D4A017','#8B4A6B','#2D5FA6','#B84A30'];

// POST /api/auth/register
export const register = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });

    const { name, email, password, city, state, bio, preferred_lang } = req.body;

    const existing = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
    if (existing) return res.status(409).json({ success: false, error: 'An account with this email already exists.' });

    const hashed = await bcrypt.hash(password, 12);
    const avatar_color = AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)];

    const user = await prisma.user.create({
      data: {
        name: name.trim(),
        email: email.toLowerCase().trim(),
        password: hashed,
        city: city?.trim() || null,
        state: state?.trim() || null,
        bio: bio?.trim() || null,
        preferred_lang: preferred_lang || 'en',
        avatar_color,
      },
      select: {
        id: true, name: true, email: true, city: true,
        state: true, bio: true, avatar_color: true,
        preferred_lang: true, is_verified: true, created_at: true,
      },
    });

    const token = signToken(user.id);
    logger.info(`New user registered: ${user.email}`);
    res.status(201).json({ success: true, data: { user, token } });
  } catch (err) { next(err); }
};

// POST /api/auth/login
export const login = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });

    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
    if (!user || !user.is_active) return res.status(401).json({ success: false, error: 'Invalid email or password.' });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ success: false, error: 'Invalid email or password.' });

    const { password: _, ...safeUser } = user;
    const token = signToken(user.id);
    res.json({ success: true, data: { user: safeUser, token } });
  } catch (err) { next(err); }
};

// GET /api/auth/me
export const getMe = async (req, res, next) => {
  try {
    const stats = await getUserStats(req.user.id);
    res.json({ success: true, data: { user: req.user, stats } });
  } catch (err) { next(err); }
};

// PUT /api/auth/me
export const updateProfile = async (req, res, next) => {
  try {
    const { name, city, state, bio, preferred_lang } = req.body;
    const updated = await prisma.user.update({
      where: { id: req.user.id },
      data: {
        ...(name && { name: name.trim() }),
        ...(city !== undefined && { city: city?.trim() || null }),
        ...(state !== undefined && { state: state?.trim() || null }),
        ...(bio !== undefined && { bio: bio?.trim() || null }),
        ...(preferred_lang && { preferred_lang }),
      },
      select: {
        id: true, name: true, email: true, city: true, state: true,
        bio: true, avatar_color: true, preferred_lang: true, updated_at: true,
      },
    });
    res.json({ success: true, data: { user: updated } });
  } catch (err) { next(err); }
};

// GET /api/auth/users/:id
export const getUserProfile = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.params.id },
      select: {
        id: true, name: true, city: true, state: true, bio: true,
        avatar_color: true, preferred_lang: true, created_at: true,
        _count: { select: { skills: true, followers: true, following: true } },
      },
    });
    if (!user) return res.status(404).json({ success: false, error: 'User not found.' });

    const skills = await prisma.skill.findMany({
      where: { author_id: req.params.id, is_published: true },
      orderBy: { created_at: 'desc' },
      include: { author: { select: { id: true, name: true, avatar_color: true, city: true } }, category: true },
    });

    res.json({
      success: true,
      data: {
        user: { ...user, skills_count: user._count.skills, followers: user._count.followers, following: user._count.following },
        skills,
      },
    });
  } catch (err) { next(err); }
};

// POST /api/auth/follow/:id
export const toggleFollow = async (req, res, next) => {
  try {
    const targetId = req.params.id;
    if (targetId === req.user.id) return res.status(400).json({ success: false, error: 'Cannot follow yourself.' });

    const existing = await prisma.follow.findUnique({
      where: { follower_id_following_id: { follower_id: req.user.id, following_id: targetId } },
    });

    if (existing) {
      await prisma.follow.delete({ where: { id: existing.id } });
      return res.json({ success: true, data: { following: false } });
    } else {
      await prisma.follow.create({ data: { follower_id: req.user.id, following_id: targetId } });
      return res.json({ success: true, data: { following: true } });
    }
  } catch (err) { next(err); }
};

async function getUserStats(userId) {
  const [skills, saves, followers, following] = await Promise.all([
    prisma.skill.count({ where: { author_id: userId, is_published: true } }),
    prisma.save.count({ where: { user_id: userId } }),
    prisma.follow.count({ where: { following_id: userId } }),
    prisma.follow.count({ where: { follower_id: userId } }),
  ]);
  return { skills, saves, followers, following };
}
