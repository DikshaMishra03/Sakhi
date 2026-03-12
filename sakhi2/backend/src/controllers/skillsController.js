// src/controllers/skillsController.js
import { validationResult } from 'express-validator';
import prisma from '../db/client.js';
import logger from '../config/logger.js';
import crypto from 'crypto';

const SKILL_INCLUDE = {
  author: { select: { id: true, name: true, avatar_color: true, city: true, state: true } },
  category: true,
  _count: { select: { comments: true, saves: true } },
};

// GET /api/skills
export const getSkills = async (req, res, next) => {
  try {
    const { category, search, sort = 'recent', page = 1, limit = 12 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const take = parseInt(limit);

    const where = {
      is_published: true,
      ...(category && category !== 'all' && { category_id: category }),
      ...(search && {
        OR: [
          { title: { contains: search, mode: 'insensitive' } },
          { subtitle: { contains: search, mode: 'insensitive' } },
          { body: { contains: search, mode: 'insensitive' } },
          { region: { contains: search, mode: 'insensitive' } },
          { language: { contains: search, mode: 'insensitive' } },
          { tags: { contains: search.toLowerCase() } },
        ],
      }),
    };

    const orderBy = sort === 'popular' ? { saves_count: 'desc' }
      : sort === 'views' ? { views_count: 'desc' }
      : { created_at: 'desc' };

    const [data, total] = await Promise.all([
      prisma.skill.findMany({ where, orderBy, skip, take, include: SKILL_INCLUDE }),
      prisma.skill.count({ where }),
    ]);

    res.json({
      success: true,
      data,
      pagination: { total, page: parseInt(page), limit: take, pages: Math.ceil(total / take) },
    });
  } catch (err) { next(err); }
};

// GET /api/skills/featured
export const getFeaturedSkills = async (req, res, next) => {
  try {
    const data = await prisma.skill.findMany({
      where: { is_featured: true, is_published: true },
      orderBy: { saves_count: 'desc' },
      take: 4,
      include: SKILL_INCLUDE,
    });
    res.json({ success: true, data });
  } catch (err) { next(err); }
};

// GET /api/skills/search
export const searchSkills = async (req, res, next) => {
  try {
    const { q } = req.query;
    if (!q || q.trim().length < 2) return res.json({ success: true, data: [] });
    const data = await prisma.skill.findMany({
      where: {
        is_published: true,
        OR: [
          { title: { contains: q, mode: 'insensitive' } },
          { subtitle: { contains: q, mode: 'insensitive' } },
          { region: { contains: q, mode: 'insensitive' } },
          { language: { contains: q, mode: 'insensitive' } },
        ],
      },
      take: 8,
      include: { author: { select: { id: true, name: true, avatar_color: true } }, category: true },
    });
    res.json({ success: true, data });
  } catch (err) { next(err); }
};

// GET /api/skills/categories
export const getCategories = async (req, res, next) => {
  try {
    const cats = await prisma.category.findMany({
      orderBy: { sort_order: 'asc' },
      include: { _count: { select: { skills: { where: { is_published: true } } } } },
    });
    const data = cats.map(c => ({ ...c, count: c._count.skills }));
    res.json({ success: true, data });
  } catch (err) { next(err); }
};

// GET /api/skills/stats
export const getStats = async (req, res, next) => {
  try {
    const [total_skills, total_users, total_saves, total_comments] = await Promise.all([
      prisma.skill.count({ where: { is_published: true } }),
      prisma.user.count(),
      prisma.save.count(),
      prisma.comment.count(),
    ]);
    const langData = await prisma.skill.findMany({ where: { is_published: true }, select: { language: true }, distinct: ['language'] });
    const cityData = await prisma.user.findMany({ where: { city: { not: null } }, select: { city: true }, distinct: ['city'] });
    res.json({
      success: true,
      data: { total_skills, total_users, total_saves, total_comments, languages: langData.length, cities: cityData.length },
    });
  } catch (err) { next(err); }
};

// GET /api/skills/saved
export const getSavedSkills = async (req, res, next) => {
  try {
    const saves = await prisma.save.findMany({
      where: { user_id: req.user.id },
      orderBy: { created_at: 'desc' },
      include: { skill: { include: SKILL_INCLUDE } },
    });
    res.json({ success: true, data: saves.map(s => s.skill) });
  } catch (err) { next(err); }
};

// GET /api/skills/:id
export const getSkillById = async (req, res, next) => {
  try {
    const skill = await prisma.skill.findUnique({
      where: { id: req.params.id },
      include: {
        ...SKILL_INCLUDE,
        comments: {
          orderBy: { created_at: 'desc' },
          include: { author: { select: { id: true, name: true, avatar_color: true, city: true } } },
        },
        voice_notes: {
          orderBy: { created_at: 'desc' },
          include: { author: { select: { id: true, name: true, avatar_color: true } } },
        },
      },
    });
    if (!skill) return res.status(404).json({ success: false, error: 'Skill not found.' });

    // Track view asynchronously
    const ipHash = req.ip ? crypto.createHash('sha256').update(req.ip).digest('hex').slice(0, 16) : null;
    prisma.skillView.create({
      data: {
        skill_id: skill.id,
        user_id: req.user?.id || null,
        ip_hash: ipHash,
        referrer: req.headers.referer?.slice(0, 255) || null,
      },
    }).then(() => prisma.skill.update({ where: { id: skill.id }, data: { views_count: { increment: 1 } } }))
      .catch(() => {});

    const saved = req.user ? !!(await prisma.save.findUnique({
      where: { user_id_skill_id: { user_id: req.user.id, skill_id: skill.id } },
    })) : false;

    res.json({ success: true, data: { skill, saved } });
  } catch (err) { next(err); }
};

// POST /api/skills
export const createSkill = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });

    const { title, subtitle, body, category_id, tags, language, region, read_time } = req.body;
    const wordCount = body.trim().split(/\s+/).length;
    const computedReadTime = read_time ? parseInt(read_time) : Math.max(1, Math.ceil(wordCount / 200));

    const skill = await prisma.skill.create({
      data: {
        title: title.trim(),
        subtitle: subtitle.trim(),
        body: body.trim(),
        category_id,
        tags: Array.isArray(tags) ? tags : (tags || '').split(',').map(t => t.trim()).filter(Boolean),
        language: language || 'Hindi',
        region: region?.trim() || null,
        read_time: computedReadTime,
        author_id: req.user.id,
      },
      include: SKILL_INCLUDE,
    });

    logger.info(`Skill created: "${skill.title}" by ${req.user.email}`);
    res.status(201).json({ success: true, data: skill });
  } catch (err) { next(err); }
};

// PUT /api/skills/:id
export const updateSkill = async (req, res, next) => {
  try {
    const existing = await prisma.skill.findUnique({ where: { id: req.params.id } });
    if (!existing) return res.status(404).json({ success: false, error: 'Skill not found.' });
    if (existing.author_id !== req.user.id) return res.status(403).json({ success: false, error: 'Unauthorized.' });

    const { title, subtitle, body, category_id, tags, language, region, read_time } = req.body;
    const updated = await prisma.skill.update({
      where: { id: req.params.id },
      data: {
        ...(title && { title: title.trim() }),
        ...(subtitle && { subtitle: subtitle.trim() }),
        ...(body && { body: body.trim() }),
        ...(category_id && { category_id }),
        ...(tags && { tags: Array.isArray(tags) ? tags : tags.split(',').map(t => t.trim()).filter(Boolean) }),
        ...(language && { language }),
        ...(region !== undefined && { region: region?.trim() || null }),
        ...(read_time && { read_time: parseInt(read_time) }),
      },
      include: SKILL_INCLUDE,
    });
    res.json({ success: true, data: updated });
  } catch (err) { next(err); }
};

// DELETE /api/skills/:id
export const deleteSkill = async (req, res, next) => {
  try {
    const existing = await prisma.skill.findUnique({ where: { id: req.params.id } });
    if (!existing) return res.status(404).json({ success: false, error: 'Skill not found.' });
    if (existing.author_id !== req.user.id) return res.status(403).json({ success: false, error: 'Unauthorized.' });
    await prisma.skill.delete({ where: { id: req.params.id } });
    res.json({ success: true, message: 'Skill deleted.' });
  } catch (err) { next(err); }
};

// POST /api/skills/:id/save
export const toggleSave = async (req, res, next) => {
  try {
    const existing = await prisma.save.findUnique({
      where: { user_id_skill_id: { user_id: req.user.id, skill_id: req.params.id } },
    });
    if (existing) {
      await prisma.save.delete({ where: { id: existing.id } });
      await prisma.skill.update({ where: { id: req.params.id }, data: { saves_count: { decrement: 1 } } });
      return res.json({ success: true, data: { saved: false } });
    } else {
      await prisma.save.create({ data: { user_id: req.user.id, skill_id: req.params.id } });
      const skill = await prisma.skill.update({ where: { id: req.params.id }, data: { saves_count: { increment: 1 } } });
      return res.json({ success: true, data: { saved: true, saves_count: skill.saves_count } });
    }
  } catch (err) { next(err); }
};

// POST /api/skills/:id/comments
export const addComment = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });
    const comment = await prisma.comment.create({
      data: { body: req.body.body.trim(), skill_id: req.params.id, author_id: req.user.id },
      include: { author: { select: { id: true, name: true, avatar_color: true, city: true } } },
    });
    res.status(201).json({ success: true, data: comment });
  } catch (err) { next(err); }
};

// DELETE /api/skills/:id/comments/:commentId
export const deleteComment = async (req, res, next) => {
  try {
    const comment = await prisma.comment.findUnique({ where: { id: req.params.commentId } });
    if (!comment) return res.status(404).json({ success: false, error: 'Comment not found.' });
    if (comment.author_id !== req.user.id) return res.status(403).json({ success: false, error: 'Unauthorized.' });
    await prisma.comment.delete({ where: { id: req.params.commentId } });
    res.json({ success: true, message: 'Comment deleted.' });
  } catch (err) { next(err); }
};
