import express from 'express';
import {
  getAllPosts,
  createPost,
  reactToPost,
  repostPost,
  bookmarkPost,
  recordView,
  pinPost,
  getTrendingHashtags,
  addComment,
  deletePost,
} from '../controllers/postController.js';
import { protect } from '../middleware/authMiddleware.js';
import jwt from 'jsonwebtoken';
import getPool, { memoryStore, isFallback } from '../config/db.js';

// Optional auth helper to attach req.user if present
const optionalAuth = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'super_secret_campapp_jwt_key_2026_jwt_token');
      if (isFallback()) {
        const u = memoryStore.users.find((user) => user.id === Number(decoded.id));
        if (u) req.user = u;
      } else {
        const pool = getPool();
        const [rows] = await pool.query('SELECT id, name, email, avatar_url FROM users WHERE id = ?', [decoded.id]);
        if (rows.length > 0) req.user = rows[0];
      }
    } catch {
      // Continue without authenticated user
    }
  }
  next();
};

const router = express.Router();

router.get('/', optionalAuth, getAllPosts);
router.get('/trending', getTrendingHashtags);
router.post('/', protect, createPost);
router.post('/:id/react', protect, reactToPost);
router.post('/:id/repost', protect, repostPost);
router.post('/:id/bookmark', protect, bookmarkPost);
router.post('/:id/pin', protect, pinPost);
router.post('/:id/view', recordView);
router.post('/:id/comment', protect, addComment);
router.delete('/:id', protect, deletePost);

export default router;
