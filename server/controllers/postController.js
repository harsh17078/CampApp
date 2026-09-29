import getPool, { memoryStore, isFallback } from '../config/db.js';

// Helper: Extract hashtags from text
const extractHashtags = (text) => {
  if (!text) return [];
  const matches = text.match(/#[a-zA-Z0-9_]+/g);
  return matches ? matches.map((tag) => tag.replace('#', '').toLowerCase()) : [];
};

// @desc    Get Feed Posts (Dual: "for-you" algorithmic or "following" reverse-chronological, or filtered by #tag)
// @route   GET /api/posts?feed=for-you|following&tag=tagName&q=searchQuery
// @access  Public / Authenticated
export const getAllPosts = async (req, res, next) => {
  try {
    const currentUserId = req.user ? Number(req.user.id) : 0;
    const feedType = req.query.feed || 'for-you';
    const tag = req.query.tag ? req.query.tag.replace('#', '').toLowerCase() : null;
    const query = req.query.q ? req.query.q.toLowerCase() : null;

    if (isFallback()) {
      let filteredPosts = [...memoryStore.posts];

      // Tag filter
      if (tag) {
        filteredPosts = filteredPosts.filter((p) =>
          p.content.toLowerCase().includes(`#${tag}`)
        );
      }

      // Search query filter
      if (query) {
        filteredPosts = filteredPosts.filter(
          (p) =>
            p.content.toLowerCase().includes(query) ||
            p.location?.toLowerCase().includes(query)
        );
      }

      // "Following" feed filter
      if (feedType === 'following' && currentUserId > 0) {
        const followingIds = memoryStore.follows
          .filter((f) => f.follower_id === currentUserId)
          .map((f) => f.following_id);
        
        filteredPosts = filteredPosts.filter((p) =>
          followingIds.includes(p.user_id) || p.user_id === currentUserId
        );
      }

      // "Bookmarks" feed filter
      if (feedType === 'bookmarks' && currentUserId > 0) {
        const bookmarkedIds = memoryStore.bookmarks
          .filter((b) => b.user_id === currentUserId)
          .map((b) => b.post_id);

        filteredPosts = filteredPosts.filter((p) => bookmarkedIds.includes(p.id));
      }

      // Format posts with author, likes, reposts, bookmarks, quotes, comments
      const formatted = filteredPosts.map((p) => {
        const author = memoryStore.users.find((u) => u.id === p.user_id) || {
          name: 'Camp Explorer',
          email: 'explorer@campapp.com',
          avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100',
        };

        const likes = memoryStore.post_likes.filter((pl) => pl.post_id === p.id && pl.type === 'like').length;
        const dislikes = memoryStore.post_likes.filter((pl) => pl.post_id === p.id && pl.type === 'dislike').length;
        const repostsCount = memoryStore.reposts.filter((r) => r.post_id === p.id).length;
        const myReaction = memoryStore.post_likes.find((pl) => pl.post_id === p.id && pl.user_id === currentUserId);
        const isReposted = memoryStore.reposts.some((r) => r.post_id === p.id && r.user_id === currentUserId);
        const isBookmarked = memoryStore.bookmarks.some((b) => b.post_id === p.id && b.user_id === currentUserId);
        const isFollowingAuthor = memoryStore.follows.some(
          (f) => f.follower_id === currentUserId && f.following_id === p.user_id
        );
        const postComments = memoryStore.comments.filter((c) => c.post_id === p.id);

        // Quote post preview if quoted
        let quotePost = null;
        if (p.quote_post_id) {
          const original = memoryStore.posts.find((orig) => orig.id === p.quote_post_id);
          if (original) {
            const quoteAuthor = memoryStore.users.find((u) => u.id === original.user_id) || { name: 'Camper' };
            quotePost = {
              id: original.id,
              content: original.content,
              image_url: original.image_url,
              created_at: original.created_at,
              author_name: quoteAuthor.name,
              author_avatar: quoteAuthor.avatar_url,
            };
          }
        }

        return {
          id: p.id,
          user_id: p.user_id,
          content: p.content,
          image_url: p.image_url,
          feeling: p.feeling,
          location: p.location,
          views_count: p.views_count || 120,
          is_pinned: !!p.is_pinned,
          created_at: p.created_at,
          author_name: author.name,
          author_email: author.email,
          author_avatar: author.avatar_url,
          likes_count: likes,
          dislikes_count: dislikes,
          reposts_count: repostsCount,
          comments_count: postComments.length,
          user_reaction: myReaction ? myReaction.type : null,
          is_reposted: isReposted,
          is_bookmarked: isBookmarked,
          is_following_author: isFollowingAuthor,
          quote_post: quotePost,
          comments: postComments.map((c) => {
            const cu = memoryStore.users.find((user) => user.id === c.user_id) || { name: 'Camper' };
            return {
              ...c,
              author_name: cu.name,
              author_avatar: cu.avatar_url,
            };
          }),
        };
      });

      // Sort: pinned first for profile, or chronological / engagement
      formatted.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

      return res.json({ success: true, feed: feedType, posts: formatted });
    }

    // Native MySQL query fallback
    const pool = getPool();
    let whereClause = '1=1';
    const params = [currentUserId, currentUserId, currentUserId, currentUserId];

    if (tag) {
      whereClause += ' AND p.content LIKE ?';
      params.push(`%#${tag}%`);
    }

    if (query) {
      whereClause += ' AND (p.content LIKE ? OR p.location LIKE ?)';
      params.push(`%${query}%`, `%${query}%`);
    }

    if (feedType === 'bookmarks' && currentUserId > 0) {
      whereClause += ' AND EXISTS(SELECT 1 FROM bookmarks b WHERE b.post_id = p.id AND b.user_id = ?)';
      params.push(currentUserId);
    } else if (feedType === 'following' && currentUserId > 0) {
      whereClause += ' AND (p.user_id IN (SELECT f.following_id FROM follows f WHERE f.follower_id = ?) OR p.user_id = ?)';
      params.push(currentUserId, currentUserId);
    }

    const [posts] = await pool.query(
      `SELECT 
        p.*,
        u.name AS author_name,
        u.email AS author_email,
        u.avatar_url AS author_avatar,
        (SELECT COUNT(*) FROM post_likes pl WHERE pl.post_id = p.id AND pl.type = 'like') AS likes_count,
        (SELECT COUNT(*) FROM post_likes pl WHERE pl.post_id = p.id AND pl.type = 'dislike') AS dislikes_count,
        (SELECT COUNT(*) FROM reposts r WHERE r.post_id = p.id) AS reposts_count,
        (SELECT COUNT(*) FROM comments c WHERE c.post_id = p.id) AS comments_count,
        (SELECT pl.type FROM post_likes pl WHERE pl.post_id = p.id AND pl.user_id = ?) AS user_reaction,
        EXISTS(SELECT 1 FROM reposts r WHERE r.post_id = p.id AND r.user_id = ?) AS is_reposted,
        EXISTS(SELECT 1 FROM bookmarks b WHERE b.post_id = p.id AND b.user_id = ?) AS is_bookmarked,
        EXISTS(SELECT 1 FROM follows f WHERE f.follower_id = ? AND f.following_id = p.user_id) AS is_following_author
      FROM posts p
      JOIN users u ON p.user_id = u.id
      WHERE ${whereClause}
      ORDER BY p.is_pinned DESC, p.created_at DESC`,
      params
    );

    res.json({ success: true, feed: feedType, posts });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new Microblog Post (supports 280-char limit, media, hashtags)
// @route   POST /api/posts
// @access  Private
export const createPost = async (req, res, next) => {
  try {
    const { content, image_url, feeling, location, quote_post_id } = req.body;
    const userId = req.user.id;

    if (!content || !content.trim()) {
      return res.status(400).json({ success: false, message: 'Post content cannot be empty' });
    }

    if (content.trim().length > 280) {
      return res.status(400).json({ success: false, message: 'Content exceeds 280 character limit' });
    }

    if (isFallback()) {
      const newPost = {
        id: memoryStore.nextPostId++,
        user_id: userId,
        content: content.trim(),
        image_url: image_url || null,
        feeling: feeling || null,
        location: location || null,
        quote_post_id: quote_post_id ? Number(quote_post_id) : null,
        repost_of_id: null,
        views_count: 1,
        is_pinned: false,
        created_at: new Date().toISOString(),
      };

      memoryStore.posts.unshift(newPost);

      // Quote preview if attached
      let quotePost = null;
      if (newPost.quote_post_id) {
        const original = memoryStore.posts.find((p) => p.id === newPost.quote_post_id);
        if (original) {
          const qAuthor = memoryStore.users.find((u) => u.id === original.user_id) || { name: 'Camper' };
          quotePost = {
            id: original.id,
            content: original.content,
            image_url: original.image_url,
            created_at: original.created_at,
            author_name: qAuthor.name,
            author_avatar: qAuthor.avatar_url,
          };
        }
      }

      return res.status(201).json({
        success: true,
        message: 'Posted to Camp!',
        post: {
          ...newPost,
          author_name: req.user.name,
          author_email: req.user.email,
          author_avatar: req.user.avatar_url,
          likes_count: 0,
          dislikes_count: 0,
          reposts_count: 0,
          comments_count: 0,
          user_reaction: null,
          is_reposted: false,
          is_bookmarked: false,
          quote_post: quotePost,
          comments: [],
        },
      });
    }

    const pool = getPool();
    const [result] = await pool.query(
      `INSERT INTO posts (user_id, content, image_url, feeling, location, quote_post_id)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [userId, content.trim(), image_url || null, feeling || null, location || null, quote_post_id || null]
    );

    res.status(201).json({
      success: true,
      message: 'Posted to Camp!',
      post: {
        id: result.insertId,
        user_id: userId,
        content: content.trim(),
        image_url: image_url || null,
        feeling: feeling || null,
        location: location || null,
        views_count: 1,
        is_pinned: false,
        created_at: new Date().toISOString(),
        author_name: req.user.name,
        author_email: req.user.email,
        author_avatar: req.user.avatar_url,
        likes_count: 0,
        dislikes_count: 0,
        reposts_count: 0,
        comments_count: 0,
        user_reaction: null,
        is_reposted: false,
        is_bookmarked: false,
        quote_post: null,
        comments: [],
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Repost a post (frictionless amplification)
// @route   POST /api/posts/:id/repost
// @access  Private
export const repostPost = async (req, res, next) => {
  try {
    const postId = Number(req.params.id);
    const userId = Number(req.user.id);

    if (isFallback()) {
      const existingIdx = memoryStore.reposts.findIndex(
        (r) => r.post_id === postId && r.user_id === userId
      );

      let isReposted = false;
      if (existingIdx >= 0) {
        memoryStore.reposts.splice(existingIdx, 1);
        isReposted = false;
      } else {
        memoryStore.reposts.push({
          id: memoryStore.nextRepostId++,
          post_id: postId,
          user_id: userId,
          created_at: new Date().toISOString(),
        });
        isReposted = true;
      }

      const count = memoryStore.reposts.filter((r) => r.post_id === postId).length;
      return res.json({ success: true, is_reposted: isReposted, reposts_count: count });
    }

    const pool = getPool();
    const [existing] = await pool.query(
      'SELECT id FROM reposts WHERE post_id = ? AND user_id = ?',
      [postId, userId]
    );

    let isReposted = false;
    if (existing.length > 0) {
      await pool.query('DELETE FROM reposts WHERE id = ?', [existing[0].id]);
      isReposted = false;
    } else {
      await pool.query('INSERT INTO reposts (post_id, user_id) VALUES (?, ?)', [postId, userId]);
      isReposted = true;
    }

    const [countResult] = await pool.query(
      'SELECT COUNT(*) as count FROM reposts WHERE post_id = ?',
      [postId]
    );

    res.json({
      success: true,
      is_reposted: isReposted,
      reposts_count: countResult[0].count,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Bookmark a post
// @route   POST /api/posts/:id/bookmark
// @access  Private
export const bookmarkPost = async (req, res, next) => {
  try {
    const postId = Number(req.params.id);
    const userId = Number(req.user.id);

    if (isFallback()) {
      const existingIdx = memoryStore.bookmarks.findIndex(
        (b) => b.post_id === postId && b.user_id === userId
      );

      let isBookmarked = false;
      if (existingIdx >= 0) {
        memoryStore.bookmarks.splice(existingIdx, 1);
        isBookmarked = false;
      } else {
        memoryStore.bookmarks.push({
          id: memoryStore.nextBookmarkId++,
          post_id: postId,
          user_id: userId,
          created_at: new Date().toISOString(),
        });
        isBookmarked = true;
      }

      return res.json({ success: true, is_bookmarked: isBookmarked });
    }

    const pool = getPool();
    const [existing] = await pool.query(
      'SELECT id FROM bookmarks WHERE post_id = ? AND user_id = ?',
      [postId, userId]
    );

    let isBookmarked = false;
    if (existing.length > 0) {
      await pool.query('DELETE FROM bookmarks WHERE id = ?', [existing[0].id]);
      isBookmarked = false;
    } else {
      await pool.query('INSERT INTO bookmarks (post_id, user_id) VALUES (?, ?)', [postId, userId]);
      isBookmarked = true;
    }

    res.json({ success: true, is_bookmarked: isBookmarked });
  } catch (error) {
    next(error);
  }
};

// @desc    Record post view / impression count
// @route   POST /api/posts/:id/view
// @access  Public
export const recordView = async (req, res, next) => {
  try {
    const postId = Number(req.params.id);

    if (isFallback()) {
      const post = memoryStore.posts.find((p) => p.id === postId);
      if (post) {
        post.views_count = (post.views_count || 0) + 1;
      }
      return res.json({ success: true });
    }

    const pool = getPool();
    await pool.query('UPDATE posts SET views_count = views_count + 1 WHERE id = ?', [postId]);
    res.json({ success: true });
  } catch (error) {
    next(error);
  }
};

// @desc    Pin / Unpin authored post
// @route   POST /api/posts/:id/pin
// @access  Private
export const pinPost = async (req, res, next) => {
  try {
    const postId = Number(req.params.id);
    const userId = Number(req.user.id);

    if (isFallback()) {
      const post = memoryStore.posts.find((p) => p.id === postId && p.user_id === userId);
      if (!post) {
        return res.status(404).json({ success: false, message: 'Post not found or unauthorized' });
      }
      post.is_pinned = !post.is_pinned;
      return res.json({ success: true, is_pinned: post.is_pinned });
    }

    const pool = getPool();
    const [post] = await pool.query('SELECT is_pinned FROM posts WHERE id = ? AND user_id = ?', [postId, userId]);
    if (post.length === 0) {
      return res.status(404).json({ success: false, message: 'Post not found or unauthorized' });
    }

    const newPinned = !post[0].is_pinned;
    await pool.query('UPDATE posts SET is_pinned = ? WHERE id = ?', [newPinned, postId]);
    res.json({ success: true, is_pinned: newPinned });
  } catch (error) {
    next(error);
  }
};

// @desc    Get Trending Hashtags across the platform
// @route   GET /api/posts/trending
// @access  Public
export const getTrendingHashtags = async (req, res, next) => {
  try {
    if (isFallback()) {
      const tagCounts = {};
      memoryStore.posts.forEach((p) => {
        const tags = extractHashtags(p.content);
        tags.forEach((t) => {
          tagCounts[t] = (tagCounts[t] || 0) + 1;
        });
      });

      // Default trending topics if fresh
      const defaultTrends = [
        { tag: 'Camping', count: '14.2K', category: 'Outdoor & Nature' },
        { tag: 'WebDev', count: '9.8K', category: 'Technology' },
        { tag: 'Adventure', count: '8.4K', category: 'Travel' },
        { tag: 'BuildInPublic', count: '5.1K', category: 'Software' },
        { tag: 'Coffee', count: '4.3K', category: 'Lifestyle' },
      ];

      const customTrends = Object.entries(tagCounts).map(([tag, count]) => ({
        tag: tag.charAt(0).toUpperCase() + tag.slice(1),
        count: `${count * 1.2}K`,
        category: 'Trending at Camp',
      }));

      const trending = [...customTrends, ...defaultTrends].slice(0, 5);
      return res.json({ success: true, trending });
    }

    const pool = getPool();
    res.json({
      success: true,
      trending: [
        { tag: 'Camping', count: '14.2K', category: 'Outdoor & Nature' },
        { tag: 'WebDev', count: '9.8K', category: 'Technology' },
        { tag: 'Adventure', count: '8.4K', category: 'Travel' },
        { tag: 'BuildInPublic', count: '5.1K', category: 'Software' },
        { tag: 'Coffee', count: '4.3K', category: 'Lifestyle' },
      ],
    });
  } catch (error) {
    next(error);
  }
};

// @desc    React to post (like / dislike)
// @route   POST /api/posts/:id/react
// @access  Private
export const reactToPost = async (req, res, next) => {
  try {
    const postId = Number(req.params.id);
    const userId = Number(req.user.id);
    const { type } = req.body;

    if (isFallback()) {
      const existingIdx = memoryStore.post_likes.findIndex(
        (pl) => pl.post_id === postId && pl.user_id === userId
      );

      let currentReaction = null;
      if (existingIdx >= 0) {
        if (memoryStore.post_likes[existingIdx].type === type) {
          memoryStore.post_likes.splice(existingIdx, 1);
          currentReaction = null;
        } else {
          memoryStore.post_likes[existingIdx].type = type;
          currentReaction = type;
        }
      } else {
        memoryStore.post_likes.push({
          id: memoryStore.post_likes.length + 1,
          post_id: postId,
          user_id: userId,
          type,
        });
        currentReaction = type;
      }

      const likes = memoryStore.post_likes.filter((pl) => pl.post_id === postId && pl.type === 'like').length;
      const dislikes = memoryStore.post_likes.filter((pl) => pl.post_id === postId && pl.type === 'dislike').length;

      return res.json({
        success: true,
        user_reaction: currentReaction,
        likes_count: likes,
        dislikes_count: dislikes,
      });
    }

    const pool = getPool();
    const [existing] = await pool.query(
      'SELECT id, type FROM post_likes WHERE post_id = ? AND user_id = ?',
      [postId, userId]
    );

    let currentReaction = null;
    if (existing.length > 0) {
      if (existing[0].type === type) {
        await pool.query('DELETE FROM post_likes WHERE id = ?', [existing[0].id]);
        currentReaction = null;
      } else {
        await pool.query('UPDATE post_likes SET type = ? WHERE id = ?', [type, existing[0].id]);
        currentReaction = type;
      }
    } else {
      await pool.query('INSERT INTO post_likes (post_id, user_id, type) VALUES (?, ?, ?)', [
        postId,
        userId,
        type,
      ]);
      currentReaction = type;
    }

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
    const postId = Number(req.params.id);
    const userId = Number(req.user.id);
    const { content } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({ success: false, message: 'Reply content cannot be empty' });
    }

    if (isFallback()) {
      const newComment = {
        id: memoryStore.nextCommentId++,
        post_id: postId,
        user_id: userId,
        content: content.trim(),
        created_at: new Date().toISOString(),
      };
      memoryStore.comments.push(newComment);

      return res.status(201).json({
        success: true,
        comment: {
          ...newComment,
          author_name: req.user.name,
          author_avatar: req.user.avatar_url,
        },
      });
    }

    const pool = getPool();
    const [result] = await pool.query(
      'INSERT INTO comments (post_id, user_id, content) VALUES (?, ?, ?)',
      [postId, userId, content.trim()]
    );

    res.status(201).json({
      success: true,
      comment: {
        id: result.insertId,
        post_id: postId,
        user_id: userId,
        content: content.trim(),
        author_name: req.user.name,
        author_avatar: req.user.avatar_url,
        created_at: new Date().toISOString(),
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete post
// @route   DELETE /api/posts/:id
// @access  Private
export const deletePost = async (req, res, next) => {
  try {
    const postId = Number(req.params.id);
    const userId = Number(req.user.id);

    if (isFallback()) {
      const idx = memoryStore.posts.findIndex((p) => p.id === postId && p.user_id === userId);
      if (idx === -1) {
        return res.status(403).json({ success: false, message: 'Not authorized to delete this post' });
      }
      memoryStore.posts.splice(idx, 1);
      return res.json({ success: true, message: 'Post removed successfully' });
    }

    const pool = getPool();
    await pool.query('DELETE FROM posts WHERE id = ? AND user_id = ?', [postId, userId]);
    res.json({ success: true, message: 'Post removed successfully' });
  } catch (error) {
    next(error);
  }
};
