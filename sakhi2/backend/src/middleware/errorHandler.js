// src/middleware/errorHandler.js
import logger from '../config/logger.js';

export const notFound = (req, res) => {
  res.status(404).json({
    success: false,
    error: `Route ${req.method} ${req.path} not found`,
  });
};

export const globalErrorHandler = (err, req, res, next) => {
  // Multer errors
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({ success: false, error: 'File too large.' });
  }
  if (err.message?.includes('Unsupported audio type')) {
    return res.status(400).json({ success: false, error: err.message });
  }

  // Prisma known request errors
  if (err.code === 'P2002') {
    return res.status(409).json({ success: false, error: 'A record with this value already exists.' });
  }
  if (err.code === 'P2025') {
    return res.status(404).json({ success: false, error: 'Record not found.' });
  }

  logger.error('Unhandled error:', { message: err.message, stack: err.stack, path: req.path });

  res.status(err.status || 500).json({
    success: false,
    error: process.env.NODE_ENV === 'production' ? 'Internal server error.' : err.message,
  });
};
