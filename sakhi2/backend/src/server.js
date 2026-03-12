// src/server.js
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import logger from './config/logger.js';
import { apiLimiter } from './middleware/rateLimit.js';
import { notFound, globalErrorHandler } from './middleware/errorHandler.js';
import { startDailyStatsCron } from './jobs/dailyStats.js';
import { UPLOAD_DIR } from './config/upload.js';

import authRoutes      from './routes/auth.js';
import skillsRoutes    from './routes/skills.js';
import analyticsRoutes from './routes/analytics.js';
import voiceRoutes     from './routes/voice.js';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 5000;

// ── Security & infrastructure middleware ───────────────────────
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' }, // allow audio streaming
}));
app.use(compression());
app.use(morgan('dev', { stream: { write: (msg) => logger.http(msg.trim()) } }));
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
}));
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));

// ── Rate limiting ──────────────────────────────────────────────
app.use('/api/', apiLimiter);

// ── Static files (uploaded audio) ─────────────────────────────
app.use('/uploads', express.static(UPLOAD_DIR));

// ── Health check ───────────────────────────────────────────────
app.get('/health', (_req, res) => {
  res.json({
    status: 'healthy',
    service: 'Sakhi API',
    version: '2.0.0',
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
  });
});

// ── API Routes ─────────────────────────────────────────────────
app.use('/api/auth',      authRoutes);
app.use('/api/skills',    skillsRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/voice',     voiceRoutes);

// ── Error handling ─────────────────────────────────────────────
app.use(notFound);
app.use(globalErrorHandler);

// ── Start ──────────────────────────────────────────────────────
app.listen(PORT, () => {
  logger.info(`\n🌸 Sakhi API v2.0 — http://localhost:${PORT}`);
  logger.info(`   Health:    http://localhost:${PORT}/health`);
  logger.info(`   Skills:    http://localhost:${PORT}/api/skills`);
  logger.info(`   Auth:      http://localhost:${PORT}/api/auth`);
  logger.info(`   Analytics: http://localhost:${PORT}/api/analytics`);
  logger.info(`   Voice:     http://localhost:${PORT}/api/voice\n`);

  if (process.env.NODE_ENV !== 'test') startDailyStatsCron();
});

export default app;
