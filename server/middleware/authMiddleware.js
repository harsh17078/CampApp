import jwt from 'jsonwebtoken';
import getPool, { memoryStore, isFallback } from '../config/db.js';

export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer ')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route, no token provided',
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'super_secret_campapp_jwt_key_2026_jwt_token');

    // --- In-memory fallback mode ---
    if (isFallback()) {
      const user = memoryStore.users.find((u) => u.id === Number(decoded.id));
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'The user belonging to this token no longer exists',
        });
      }
      // Attach user without the password hash
      const { password_hash, ...safeUser } = user;
      req.user = safeUser;
      return next();
    }

    // --- MySQL mode ---
    const pool = getPool();
    const [rows] = await pool.query(
      'SELECT id, name, email, phone, gender, dob, country, bio, avatar_url, cover_url, created_at FROM users WHERE id = ?',
      [decoded.id]
    );

    if (rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'The user belonging to this token no longer exists',
      });
    }

    req.user = rows[0];
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized, invalid or expired token',
      error: error.message,
    });
  }
};
