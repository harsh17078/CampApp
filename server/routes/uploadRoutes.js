import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { protect } from '../middleware/authMiddleware.js';
import getPool, { memoryStore, isFallback } from '../config/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadDir = path.join(__dirname, '../public/uploads');

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase() || '.jpg';
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, `media-${uniqueSuffix}${ext}`);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedMimes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'];
  if (allowedMimes.includes(file.mimetype) || file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files (jpeg, jpg, png, gif, webp) are allowed'), false);
  }
};

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter,
});

const router = express.Router();

// Helper to build URL
const getFileUrl = (req, filename) => {
  const host = req.get('host') || 'localhost:5000';
  const protocol = req.protocol || 'http';
  return `${protocol}://${host}/uploads/${filename}`;
};

// @desc    Upload media file (post image or any media)
// @route   POST /api/upload
// @access  Public or Protected
router.post('/', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No file uploaded' });
  }

  const url = getFileUrl(req, req.file.filename);
  res.json({
    success: true,
    message: 'File uploaded successfully',
    url,
    filename: req.file.filename,
    size: req.file.size,
  });
});

// @desc    Upload user profile avatar
// @route   POST /api/upload/avatar
// @access  Private
router.post('/avatar', protect, upload.single('avatar'), async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No avatar file uploaded' });
    }

    const userId = Number(req.user.id);
    const avatarUrl = getFileUrl(req, req.file.filename);

    if (isFallback()) {
      const user = memoryStore.users.find((u) => u.id === userId);
      if (user) {
        user.avatar_url = avatarUrl;
      }
      return res.json({
        success: true,
        message: 'Avatar updated successfully',
        avatar_url: avatarUrl,
        user,
      });
    }

    const pool = getPool();
    await pool.query('UPDATE users SET avatar_url = ? WHERE id = ?', [avatarUrl, userId]);

    const [rows] = await pool.query(
      'SELECT id, name, email, phone, gender, dob, country, bio, avatar_url, cover_url FROM users WHERE id = ?',
      [userId]
    );

    res.json({
      success: true,
      message: 'Avatar updated successfully',
      avatar_url: avatarUrl,
      user: rows[0],
    });
  } catch (err) {
    next(err);
  }
});

export default router;
