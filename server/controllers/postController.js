import getPool from '../config/db.js';

// @desc    Get all posts with author data, reaction counts, and user reaction state
// @route   GET /api/posts
// @access  Public or Private (auth optional/preferred)
export const getAllPosts = async (req, res, next) => {
  try {
    const currentUserId = req.user ? req.user.id : 0;
    const pool = getPool();

    const [posts] = await pool.query(
      `SELECT 
        p.id,
        p.user_id,
        p.content,
        p.image_url,
        p.feeling,
        p.location,
        p.created_at,
        u.name AS author_name,
        u.email AS author_email,
        u.avatar_url AS author_avatar,
        (SELECT COUNT(*) FROM post_likes pl WHERE pl.post_id = p.id AND pl.type = 'like') AS likes_count,
        (SELECT COUNT(*) FROM post_likes pl WHERE pl.post_id = p.id AND pl.type = 'dislike') AS dislikes_count,
        (SELECT COUNT(*) FROM comments c WHERE c.post_id = p.id) AS comments_count,
        (SELECT pl.type FROM post_likes pl WHERE pl.post_id = p.id AND pl.user_id = ?) AS user_reaction
      FROM posts p
      JOIN users u ON p.user_id = u.id
      ORDER BY p.created_at DESC`,
      [currentUserId]
    );

    // Fetch comments for each post
    const postIds = posts.map((p) => p.id);
    let commentsByPostId = {};

    if (postIds.length > 0) {
      const [comments] = await pool.query(
        `SELECT c.id, c.post_id, c.user_id, c.content, c.created_at, u.name as author_name, u.avatar_url as author_avatar
         FROM comments c
         JOIN users u ON c.user_id = u.id
         WHERE c.post_id IN (?)
         ORDER BY c.created_at ASC`,
        [postIds]
      );

      comments.forEach((c) => {
        if (!commentsByPostId[c.post_id]) {
          commentsByPostId[c.post_id] = [];
        }
        commentsByPostId[c.post_id].push(c);
      });
    }

    const formattedPosts = posts.map((p) => ({
      ...p,
      comments: commentsByPostId[p.id] || [],
    }));

    res.json({ success: true, posts: formattedPosts });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new post
// @route   POST /api/posts
// @access  Private
export const createPost = async (req, res, next) => {
  try {
    const { content, image_url, feeling, location } = req.body;
    const userId = req.user.id;

    if (!content || !content.trim()) {
      return res.status(400).json({ success: false, message: 'Post content cannot be empty' });
    }

    const pool = getPool();
    const [result] = await pool.query(
      `INSERT INTO posts (user_id, content, image_url, feeling, location)
       VALUES (?, ?, ?, ?, ?)`,
      [userId, content.trim(), image_url || null, feeling || null, location || null]
    );

    const newPostId = result.insertId;

    const [newPostRows] = await pool.query(
      `SELECT 
        p.id,
        p.user_id,
        p.content,
        p.image_url,
        p.feeling,
        p.location,
        p.created_at,
        u.name AS author_name,
        u.email AS author_email,
        u.avatar_url AS author_avatar,
        0 AS likes_count,
        0 AS dislikes_count,
        0 AS comments_count,
        NULL AS user_reaction
      FROM posts p
      JOIN users u ON p.user_id = u.id
      WHERE p.id = ?`,
      [newPostId]
    );

    res.status(201).json({
      success: true,
      message: 'Post shared successfully',
      post: { ...newPostRows[0], comments: [] },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    React to a post (like / dislike / toggle off)
// @route   POST /api/posts/:id/react
// @access  Private
export const reactToPost = async (req, res, next) => {
  try {
    const postId = req.params.id;
    const userId = req.user.id;
    const { type } = req.body; // 'like' or 'dislike'

    if (!['like', 'dislike'].includes(type)) {
      return res.status(400).json({ success: false, message: 'Reaction type must be like or dislike' });
    }

    const pool = getPool();

    // Check existing reaction
    const [existing] = await pool.query(
      'SELECT id, type FROM post_likes WHERE post_id = ? AND user_id = ?',
      [postId, userId]
    );

    let currentReaction = null;

    if (existing.length > 0) {
      if (existing[0].type === type) {
        // Toggle off
        await pool.query('DELETE FROM post_likes WHERE id = ?', [existing[0].id]);
        currentReaction = null;
      } else {
        // Switch reaction
        await pool.query('UPDATE post_likes SET type = ? WHERE id = ?', [type, existing[0].id]);
        currentReaction = type;
      }
    } else {
      // Add reaction
      await pool.query('INSERT INTO post_likes (post_id, user_id, type) VALUES (?, ?, ?)', [
        postId,
        userId,
        type,
      ]);
      currentReaction = type;
    }

    // Get updated counts
    const [likesResult] = await pool.query(
      "SELECT COUNT(*) as count FROM post_likes WHERE post_id = ? AND type = 'like'",
      [postId]
    );
    const [dislikesResult] = await pool.query(
      "SELECT COUNT(*) as count FROM post_likes WHERE post_id = ? AND type = 'dislike'",
      [postId]
    );

    res.json({
      success: true,
      user_reaction: currentReaction,
      likes_count: likesResult[0].count,
      dislikes_count: dislikesResult[0].count,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add comment to a post
// @route   POST /api/posts/:id/comment
// @access  Private
export const addComment = async (req, res, next) => {
  try {
    const postId = req.params.id;
    const userId = req.user.id;
    const { content } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({ success: false, message: 'Comment cannot be empty' });
    }

    const pool = getPool();
    const [result] = await pool.query(
      'INSERT INTO comments (post_id, user_id, content) VALUES (?, ?, ?)',
      [postId, userId, content.trim()]
    );

    const [commentRows] = await pool.query(
      `SELECT c.id, c.post_id, c.user_id, c.content, c.created_at, u.name as author_name, u.avatar_url as author_avatar
       FROM comments c
       JOIN users u ON c.user_id = u.id
       WHERE c.id = ?`,
      [result.insertId]
    );

    res.status(201).json({
      success: true,
      comment: commentRows[0],
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a post
// @route   DELETE /api/posts/:id
// @access  Private
export const deletePost = async (req, res, next) => {
  try {
    const postId = req.params.id;
    const userId = req.user.id;
    const pool = getPool();

    const [post] = await pool.query('SELECT user_id FROM posts WHERE id = ?', [postId]);
    if (post.length === 0) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    if (post[0].user_id !== userId) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this post' });
    }

    await pool.query('DELETE FROM posts WHERE id = ?', [postId]);
    res.json({ success: true, message: 'Post removed successfully' });
  } catch (error) {
    next(error);
  }
};
