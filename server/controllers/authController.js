import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import getPool from '../config/db.js';

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

    const pool = getPool();

    // Check if user already exists
    const [existing] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email already exists',
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    // Insert user
    const [result] = await pool.query(
      `INSERT INTO users (name, email, password_hash, phone, gender, dob, country, bio, avatar_url)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        name,
        email,
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

    const pool = getPool();
    const [rows] = await pool.query(
      'SELECT id, name, email, password_hash, phone, gender, dob, country, bio, avatar_url, cover_url, created_at FROM users WHERE email = ?',
      [email]
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
