import getPool from '../config/db.js';

// @desc    Get all conversations for the current user
// @route   GET /api/messages/conversations
// @access  Private
export const getConversations = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const pool = getPool();

    // Query distinct chat contacts with their last message
    const [conversations] = await pool.query(
      `SELECT 
        u.id as user_id,
        u.name,
        u.email,
        u.avatar_url,
        m.id as message_id,
        m.message as last_message,
        m.created_at as last_message_time,
        m.sender_id,
        m.is_read
      FROM users u
      JOIN (
        SELECT 
          id,
          message,
          created_at,
          sender_id,
          receiver_id,
          is_read,
          IF(sender_id = ?, receiver_id, sender_id) as contact_id
        FROM messages
        WHERE id IN (
          SELECT MAX(id)
          FROM messages
          WHERE sender_id = ? OR receiver_id = ?
          GROUP BY IF(sender_id = ?, receiver_id, sender_id)
        )
      ) m ON u.id = m.contact_id
      ORDER BY m.created_at DESC`,
      [userId, userId, userId, userId]
    );

    res.json({ success: true, conversations });
  } catch (error) {
    next(error);
  }
};

// @desc    Get message history between current user and target user
// @route   GET /api/messages/:userId
// @access  Private
export const getMessagesWithUser = async (req, res, next) => {
  try {
    const currentUserId = req.user.id;
    const otherUserId = req.params.userId;
    const pool = getPool();

    const [messages] = await pool.query(
      `SELECT 
        m.id,
        m.sender_id,
        m.receiver_id,
        m.message,
        m.is_read,
        m.created_at,
        sender.name as sender_name,
        sender.avatar_url as sender_avatar
      FROM messages m
      JOIN users sender ON m.sender_id = sender.id
      WHERE (m.sender_id = ? AND m.receiver_id = ?) 
         OR (m.sender_id = ? AND m.receiver_id = ?)
      ORDER BY m.created_at ASC`,
      [currentUserId, otherUserId, otherUserId, currentUserId]
    );

    // Mark messages as read
    await pool.query(
      'UPDATE messages SET is_read = TRUE WHERE sender_id = ? AND receiver_id = ?',
      [otherUserId, currentUserId]
    );

    res.json({ success: true, messages });
  } catch (error) {
    next(error);
  }
};

// @desc    Send a direct message
// @route   POST /api/messages
// @access  Private
export const sendMessage = async (req, res, next) => {
  try {
    const senderId = req.user.id;
    const { receiver_id, message } = req.body;

    if (!receiver_id || !message || !message.trim()) {
      return res.status(400).json({ success: false, message: 'Receiver and message content are required' });
    }

    const pool = getPool();
    const [result] = await pool.query(
      'INSERT INTO messages (sender_id, receiver_id, message) VALUES (?, ?, ?)',
      [senderId, receiver_id, message.trim()]
    );

    const [sentRows] = await pool.query(
      `SELECT 
        m.id,
        m.sender_id,
        m.receiver_id,
        m.message,
        m.is_read,
        m.created_at,
        u.name as sender_name,
        u.avatar_url as sender_avatar
      FROM messages m
      JOIN users u ON m.sender_id = u.id
      WHERE m.id = ?`,
      [result.insertId]
    );

    res.status(201).json({ success: true, message: sentRows[0] });
  } catch (error) {
    next(error);
  }
};
