// src/controllers/analyticsController.js
import prisma from '../db/client.js';

// GET /api/analytics/dashboard  — platform-wide stats (public)
export const getDashboard = async (req, res, next) => {
  try {
    const [
      totalSkills, totalUsers, totalViews, totalSaves, totalComments,
      topSkills, categoryBreakdown, dailyStats, recentUsers
    ] = await Promise.all([
      prisma.skill.count({ where: { is_published: true } }),
      prisma.user.count(),
      prisma.skillView.count(),
      prisma.save.count(),
      prisma.comment.count(),

      // Top 5 most saved skills
      prisma.skill.findMany({
        where: { is_published: true },
        orderBy: { saves_count: 'desc' },
        take: 5,
        select: { id: true, title: true, saves_count: true, views_count: true, category: true, author: { select: { name: true, city: true } } },
      }),

      // Skills per category
      prisma.category.findMany({
        include: { _count: { select: { skills: { where: { is_published: true } } } } },
        orderBy: { sort_order: 'asc' },
      }),

      // Last 30 days daily stats
      prisma.dailyStats.findMany({
        orderBy: { date: 'asc' },
        take: 30,
        select: { date: true, total_views: true, new_users: true, new_skills: true, total_saves: true, active_users: true },
      }),

      // Newest 5 users
      prisma.user.findMany({
        orderBy: { created_at: 'desc' },
        take: 5,
        select: { id: true, name: true, city: true, avatar_color: true, created_at: true },
      }),
    ]);

    res.json({
      success: true,
      data: {
        overview: { totalSkills, totalUsers, totalViews, totalSaves, totalComments },
        topSkills,
        categoryBreakdown: categoryBreakdown.map(c => ({ ...c, count: c._count.skills })),
        dailyStats,
        recentUsers,
      },
    });
  } catch (err) { next(err); }
};

// GET /api/analytics/skills/:id  — per-skill analytics (author only)
export const getSkillAnalytics = async (req, res, next) => {
  try {
    const skill = await prisma.skill.findUnique({ where: { id: req.params.id } });
    if (!skill) return res.status(404).json({ success: false, error: 'Skill not found.' });
    if (skill.author_id !== req.user.id) return res.status(403).json({ success: false, error: 'Unauthorized.' });

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // Daily views for this skill over last 30 days
    const rawViews = await prisma.skillView.findMany({
      where: { skill_id: req.params.id, viewed_at: { gte: thirtyDaysAgo } },
      select: { viewed_at: true },
      orderBy: { viewed_at: 'asc' },
    });

    // Group by date
    const viewsByDate = rawViews.reduce((acc, v) => {
      const d = v.viewed_at.toISOString().slice(0, 10);
      acc[d] = (acc[d] || 0) + 1;
      return acc;
    }, {});

    // Fill in missing dates with 0
    const dailyViews = [];
    for (let i = 29; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      dailyViews.push({ date: key, views: viewsByDate[key] || 0 });
    }

    const [totalSaves, totalComments, voiceNotePlays] = await Promise.all([
      prisma.save.count({ where: { skill_id: req.params.id } }),
      prisma.comment.count({ where: { skill_id: req.params.id } }),
      prisma.voiceNote.aggregate({ where: { skill_id: req.params.id }, _sum: { plays_count: true } }),
    ]);

    res.json({
      success: true,
      data: {
        skill: { id: skill.id, title: skill.title, views_count: skill.views_count, saves_count: skill.saves_count },
        dailyViews,
        totals: {
          views: skill.views_count,
          saves: totalSaves,
          comments: totalComments,
          voicePlays: voiceNotePlays._sum.plays_count || 0,
        },
      },
    });
  } catch (err) { next(err); }
};

// GET /api/analytics/my  — personal analytics for logged-in user
export const getMyAnalytics = async (req, res, next) => {
  try {
    const mySkills = await prisma.skill.findMany({
      where: { author_id: req.user.id, is_published: true },
      select: {
        id: true, title: true, saves_count: true, views_count: true,
        created_at: true, category: { select: { name_en: true, emoji: true } },
      },
      orderBy: { views_count: 'desc' },
    });

    const totals = mySkills.reduce((acc, s) => ({
      views: acc.views + s.views_count,
      saves: acc.saves + s.saves_count,
    }), { views: 0, saves: 0 });

    const totalComments = await prisma.comment.count({
      where: { skill: { author_id: req.user.id } },
    });

    res.json({
      success: true,
      data: { skills: mySkills, totals: { ...totals, comments: totalComments, skills: mySkills.length } },
    });
  } catch (err) { next(err); }
};
