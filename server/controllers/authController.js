import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import getPool, { memoryStore, isFallback } from '../config/db.js';

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'super_secret_campapp_jwt_key_2026_jwt_token', {
    expiresIn: '30d',
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res, next) => {
  try {
    const { name, email, password, phone, gender, dob, country, bio, avatar_url } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and password are required fields',
      });
    }

    const cleanEmail = email.trim().toLowerCase();

    if (isFallback()) {
      const existing = memoryStore.users.find((u) => u.email.toLowerCase() === cleanEmail);
      if (existing) {
        return res.status(400).json({
          success: false,
          message: 'An account with this email already exists',
        });
      }

      const salt = await bcrypt.genSalt(10);
      const password_hash = await bcrypt.hash(password, salt);

      const newUser = {
        id: memoryStore.nextUserId++,
        name: name.trim(),
        email: cleanEmail,
        password_hash,
        phone: phone || null,
        gender: gender || 'other',
        dob: dob || null,
        country: country || 'United States',
        bio: bio || 'Connecting, sharing, and exploring on Camp.',
        avatar_url: avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
        cover_url: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=1200&auto=format&fit=crop&q=80',
        created_at: new Date().toISOString(),
      };

      memoryStore.users.push(newUser);
      const token = generateToken(newUser.id);
      const userResponse = { ...newUser };
      delete userResponse.password_hash;

      return res.status(201).json({
        success: true,
        message: 'Account registered successfully',
        token,
        user: userResponse,
      });
    }

    const pool = getPool();
    const [existing] = await pool.query('SELECT id FROM users WHERE email = ?', [cleanEmail]);
    if (existing.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email already exists',
      });
    }

    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    const [result] = await pool.query(
      `INSERT INTO users (name, email, password_hash, phone, gender, dob, country, bio, avatar_url)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        name.trim(),
        cleanEmail,
        password_hash,
        phone || null,
        gender || 'other',
        dob || null,
        country || null,
        bio || 'Connecting, sharing, and exploring on Camp.',
        avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
      ]
    );

    const userId = result.insertId;
    const token = generateToken(userId);

    const [createdUser] = await pool.query(
      'SELECT id, name, email, phone, gender, dob, country, bio, avatar_url, cover_url, created_at FROM users WHERE id = ?',
      [userId]
    );

    res.status(201).json({
      success: true,
      message: 'Account registered successfully',
      token,
      user: createdUser[0],
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password',
      });
    }

    const cleanEmail = email.trim().toLowerCase();

    if (isFallback()) {
      const user = memoryStore.users.find((u) => u.email.toLowerCase() === cleanEmail);
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password',
        });
      }

      const isMatch = await bcrypt.compare(password, user.password_hash);
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password',
        });
      }

      const token = generateToken(user.id);
      const userResponse = { ...user };
      delete userResponse.password_hash;

      return res.json({
        success: true,
        message: 'Login successful',
        token,
        user: userResponse,
      });
    }

    const pool = getPool();
    const [rows] = await pool.query(
      'SELECT id, name, email, password_hash, phone, gender, dob, country, bio, avatar_url, cover_url, created_at FROM users WHERE email = ?',
      [cleanEmail]
    );

    if (rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    const user = rows[0];
    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    const token = generateToken(user.id);
    delete user.password_hash;

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get currently logged-in user
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res) => {
  res.json({
    success: true,
    user: req.user,
  });
};
