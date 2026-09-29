import express from 'express';
import {
  getAllPosts,
  createPost,
  reactToPost,
  addComment,
  deletePost,
} from '../controllers/postController.js';
import { protect } from '../middleware/authMiddleware.js';

// Optional auth helper to attach req.user if present
import jwt from 'jsonwebtoken';
import getPool from '../config/db.js';

const optionalAuth = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'super_secret_campapp_jwt_key_2026_jwt_token');
      const pool = getPool();
      const [rows] = await pool.query('SELECT id, name, email, avatar_url FROM users WHERE id = ?', [decoded.id]);
      if (rows.length > 0) {
        req.user = rows[0];
      }
    } catch {
      // Continue without user
    }
  }
  next();
};

const router = express.Router();

router.get('/', optionalAuth, getAllPosts);
router.post('/', protect, createPost);
router.post('/:id/react', protect, reactToPost);
router.post('/:id/comment', protect, addComment);
router.delete('/:id', protect, deletePost);

export default router;
