import getPool, { memoryStore, isFallback } from '../config/db.js';

// @desc    Get user profile by ID with follower/following stats and is_following flag
// @route   GET /api/users/:id
// @access  Private / Public
export const getUserProfile = async (req, res, next) => {
  try {
    const currentUserId = req.user ? Number(req.user.id) : 0;
    const targetUserId = req.params.id === 'me' ? currentUserId : Number(req.params.id);

    if (isFallback()) {
      const user = memoryStore.users.find((u) => u.id === targetUserId);
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }

      const postCount = memoryStore.posts.filter((p) => p.user_id === targetUserId).length;
      const followersCount = memoryStore.follows.filter((f) => f.following_id === targetUserId).length;
      const followingCount = memoryStore.follows.filter((f) => f.follower_id === targetUserId).length;
      const isFollowing = memoryStore.follows.some(
        (f) => f.follower_id === currentUserId && f.following_id === targetUserId
      );

      return res.json({
        success: true,
        user: {
          ...user,
          postCount,
          followersCount,
          followingCount,
          is_following: isFollowing,
        },
      });
    }

    const pool = getPool();
    const [users] = await pool.query(
      `SELECT 
        u.id, u.name, u.email, u.phone, u.gender, u.dob, u.country, u.bio, u.avatar_url, u.cover_url, u.created_at,
        (SELECT COUNT(*) FROM posts p WHERE p.user_id = u.id) AS postCount,
        (SELECT COUNT(*) FROM follows f WHERE f.following_id = u.id) AS followersCount,
        (SELECT COUNT(*) FROM follows f WHERE f.follower_id = u.id) AS followingCount,
        EXISTS(SELECT 1 FROM follows f WHERE f.follower_id = ? AND f.following_id = u.id) AS is_following
       FROM users u WHERE u.id = ?`,
      [currentUserId, targetUserId]
    );

    if (users.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({ success: true, user: users[0] });
  } catch (error) {
    next(error);
  }
};

// @desc    Follow a user
// @route   POST /api/users/:id/follow
// @access  Private
export const followUser = async (req, res, next) => {
  try {
    const currentUserId = Number(req.user.id);
    const targetUserId = Number(req.params.id);

    if (currentUserId === targetUserId) {
      return res.status(400).json({ success: false, message: 'Cannot follow yourself' });
    }

    if (isFallback()) {
      const exists = memoryStore.follows.some(
        (f) => f.follower_id === currentUserId && f.following_id === targetUserId
      );

      if (!exists) {
        memoryStore.follows.push({
          id: memoryStore.nextFollowId++,
          follower_id: currentUserId,
          following_id: targetUserId,
          created_at: new Date().toISOString(),
        });
      }

      const count = memoryStore.follows.filter((f) => f.following_id === targetUserId).length;
      return res.json({ success: true, is_following: true, followers_count: count });
    }

    const pool = getPool();
    await pool.query(
      'INSERT IGNORE INTO follows (follower_id, following_id) VALUES (?, ?)',
      [currentUserId, targetUserId]
    );

    const [countResult] = await pool.query(
      'SELECT COUNT(*) as count FROM follows WHERE following_id = ?',
      [targetUserId]
    );

    res.json({ success: true, is_following: true, followers_count: countResult[0].count });
  } catch (error) {
    next(error);
  }
};

// @desc    Unfollow a user
// @route   POST /api/users/:id/unfollow
// @access  Private
export const unfollowUser = async (req, res, next) => {
  try {
    const currentUserId = Number(req.user.id);
    const targetUserId = Number(req.params.id);

    if (isFallback()) {
      const idx = memoryStore.follows.findIndex(
        (f) => f.follower_id === currentUserId && f.following_id === targetUserId
      );

      if (idx >= 0) {
        memoryStore.follows.splice(idx, 1);
      }

      const count = memoryStore.follows.filter((f) => f.following_id === targetUserId).length;
      return res.json({ success: true, is_following: false, followers_count: count });
    }

    const pool = getPool();
    await pool.query(
      'DELETE FROM follows WHERE follower_id = ? AND following_id = ?',
      [currentUserId, targetUserId]
    );

    const [countResult] = await pool.query(
      'SELECT COUNT(*) as count FROM follows WHERE following_id = ?',
      [targetUserId]
    );

    res.json({ success: true, is_following: false, followers_count: countResult[0].count });
  } catch (error) {
    next(error);
  }
};

// @desc    Get suggested users to follow ("Who to Follow")
// @route   GET /api/users/suggestions
// @access  Private
export const getSuggestions = async (req, res, next) => {
  try {
    const currentUserId = Number(req.user.id);

    if (isFallback()) {
      const followedIds = memoryStore.follows
        .filter((f) => f.follower_id === currentUserId)
        .map((f) => f.following_id);

      const suggestions = memoryStore.users
        .filter((u) => u.id !== currentUserId && !followedIds.includes(u.id))
        .slice(0, 4)
        .map((u) => ({
          id: u.id,
          name: u.name,
          email: u.email,
          bio: u.bio,
          avatar_url: u.avatar_url,
          is_following: false,
        }));

      return res.json({ success: true, suggestions });
    }

    const pool = getPool();
    const [suggestions] = await pool.query(
      `SELECT u.id, u.name, u.email, u.bio, u.avatar_url, FALSE as is_following
       FROM users u
       WHERE u.id != ? AND u.id NOT IN (
         SELECT following_id FROM follows WHERE follower_id = ?
       )
       LIMIT 4`,
      [currentUserId, currentUserId]
    );

    res.json({ success: true, suggestions });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
export const updateProfile = async (req, res, next) => {
  try {
    const userId = Number(req.user.id);
    const { name, bio, phone, gender, dob, country, avatar_url } = req.body;

    if (isFallback()) {
      const user = memoryStore.users.find((u) => u.id === userId);
      if (user) {
        if (name) user.name = name;
        if (bio !== undefined) user.bio = bio;
        if (phone !== undefined) user.phone = phone;
        if (gender) user.gender = gender;
        if (dob !== undefined) user.dob = dob;
        if (country !== undefined) user.country = country;
        if (avatar_url) user.avatar_url = avatar_url;
      }

      return res.json({
        success: true,
        message: 'Profile updated successfully',
        user,
      });
    }

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

// @desc    Search all users
// @route   GET /api/users
// @access  Private
export const searchUsers = async (req, res, next) => {
  try {
    const currentUserId = Number(req.user.id);
    const query = (req.query.q || '').toLowerCase();

    if (isFallback()) {
      const results = memoryStore.users
        .filter((u) => u.id !== currentUserId && (u.name.toLowerCase().includes(query) || u.email.toLowerCase().includes(query)))
        .map((u) => ({
          id: u.id,
          name: u.name,
          email: u.email,
          bio: u.bio,
          avatar_url: u.avatar_url,
          is_following: memoryStore.follows.some((f) => f.follower_id === currentUserId && f.following_id === u.id),
        }));

      return res.json({ success: true, users: results });
    }

    const pool = getPool();
    const [users] = await pool.query(
      `SELECT u.id, u.name, u.email, u.bio, u.avatar_url,
        EXISTS(SELECT 1 FROM follows f WHERE f.follower_id = ? AND f.following_id = u.id) AS is_following
       FROM users u 
       WHERE u.id != ? AND (u.name LIKE ? OR u.email LIKE ?)
       LIMIT 20`,
      [currentUserId, currentUserId, `%${query}%`, `%${query}%`]
    );

    res.json({ success: true, users });
  } catch (error) {
    next(error);
  }
};
