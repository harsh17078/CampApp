import getPool from '../config/db.js';

// @desc    Get user profile by ID with counts
// @route   GET /api/users/:id
// @access  Private
export const getUserProfile = async (req, res, next) => {
  try {
    const userId = req.params.id === 'me' ? req.user.id : req.params.id;
    const pool = getPool();

    const [users] = await pool.query(
      `SELECT id, name, email, phone, gender, dob, country, bio, avatar_url, cover_url, created_at 
       FROM users WHERE id = ?`,
      [userId]
    );

    if (users.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const user = users[0];

    // Get post count
    const [postCountResult] = await pool.query(
      'SELECT COUNT(*) as postCount FROM posts WHERE user_id = ?',
      [userId]
    );

    user.postCount = postCountResult[0].postCount || 0;
    user.followersCount = 42; // Dynamic demo stats
    user.followingCount = 18;

    res.json({ success: true, user });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
export const updateProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { name, bio, phone, gender, dob, country, avatar_url } = req.body;
    const pool = getPool();

    await pool.query(
      `UPDATE users 
       SET name = COALESCE(?, name),
           bio = COALESCE(?, bio),
           phone = COALESCE(?, phone),
           gender = COALESCE(?, gender),
           dob = COALESCE(?, dob),
           country = COALESCE(?, country),
           avatar_url = COALESCE(?, avatar_url)
       WHERE id = ?`,
      [name, bio, phone, gender, dob, country, avatar_url, userId]
    );

    const [updatedRows] = await pool.query(
      `SELECT id, name, email, phone, gender, dob, country, bio, avatar_url, cover_url, created_at 
       FROM users WHERE id = ?`,
      [userId]
    );

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: updatedRows[0],
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Search / list all users for messaging or connections
// @route   GET /api/users
// @access  Private
export const searchUsers = async (req, res, next) => {
  try {
    const query = req.query.q || '';
    const pool = getPool();

    const [users] = await pool.query(
      `SELECT id, name, email, bio, avatar_url 
       FROM users 
       WHERE id != ? AND (name LIKE ? OR email LIKE ?)
       LIMIT 20`,
      [req.user.id, `%${query}%`, `%${query}%`]
    );

    res.json({ success: true, users });
  } catch (error) {
    next(error);
  }
};
