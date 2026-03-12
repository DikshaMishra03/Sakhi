// src/middleware/auth.js
import jwt from 'jsonwebtoken';
import prisma from '../db/client.js';

const JWT_SECRET = process.env.JWT_SECRET || 'sakhi_dev_secret_change_in_production';

export const authenticate = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;

  if (!token) {
    return res.status(401).json({ success: false, error: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true, name: true, email: true,
        city: true, state: true, bio: true,
        avatar_color: true, preferred_lang: true,
        is_active: true, is_verified: true, created_at: true,
      },
    });

    if (!user || !user.is_active) {
      return res.status(401).json({ success: false, error: 'User not found or deactivated.' });
    }

    req.user = user;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ success: false, error: 'Token expired. Please login again.' });
    }
    return res.status(403).json({ success: false, error: 'Invalid token.' });
  }
};

// Attach user if token present, but don't fail if not
export const optionalAuth = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;
  if (!token) return next();
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { id: true, name: true, email: true, avatar_color: true, preferred_lang: true },
    });
  } catch {}
  next();
};
