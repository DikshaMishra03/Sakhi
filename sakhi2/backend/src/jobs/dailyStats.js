// src/jobs/dailyStats.js
// Runs every night at midnight — snapshots platform stats into daily_stats table
import cron from 'node-cron';
import prisma from '../db/client.js';
import logger from '../config/logger.js';

export function startDailyStatsCron() {
  // Run every day at 00:05 AM
  cron.schedule('5 0 * * *', async () => {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);

      const [total_users, total_skills, total_views, total_saves, total_comments,
        new_users, new_skills] = await Promise.all([
        prisma.user.count(),
        prisma.skill.count({ where: { is_published: true } }),
        prisma.skillView.count(),
        prisma.save.count(),
        prisma.comment.count(),
        prisma.user.count({ where: { created_at: { gte: yesterday, lt: today } } }),
        prisma.skill.count({ where: { created_at: { gte: yesterday, lt: today }, is_published: true } }),
      ]);

      await prisma.dailyStats.upsert({
        where: { date: yesterday },
        update: { total_users, total_skills, total_views, total_saves, total_comments, new_users, new_skills },
        create: { date: yesterday, total_users, total_skills, total_views, total_saves, total_comments, new_users, new_skills },
      });

      logger.info(`Daily stats saved for ${yesterday.toISOString().slice(0, 10)}`);

      // Clean up old skill views (keep only ANALYTICS_RETENTION_DAYS)
      const retentionDays = parseInt(process.env.ANALYTICS_RETENTION_DAYS) || 90;
      const cutoff = new Date();
      cutoff.setDate(cutoff.getDate() - retentionDays);
      const deleted = await prisma.skillView.deleteMany({ where: { viewed_at: { lt: cutoff } } });
      if (deleted.count > 0) logger.info(`Cleaned up ${deleted.count} old skill views`);

    } catch (err) {
      logger.error('Daily stats cron error:', err);
    }
  });

  logger.info('📅 Daily stats cron job scheduled (00:05 AM)');
}
