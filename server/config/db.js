import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';

dotenv.config();

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  port: Number(process.env.DB_PORT) || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};

let pool = null;
let isUsingFallback = false;

// In-memory fallback storage when MySQL credentials are misconfigured or server is offline
const memoryStore = {
  users: [
    {
      id: 1,
      name: 'Elena Vance',
      email: 'elena@campapp.com',
      password_hash: bcrypt.hashSync('password123', 10),
      phone: '+1 555-0192',
      gender: 'female',
      dob: '1998-05-12',
      country: 'United States',
      bio: 'Lover of nature, photography, and late night campfire chats. 🏕️',
      avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
      cover_url: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=1200&auto=format&fit=crop&q=80',
      created_at: new Date().toISOString(),
    },
  ],
  posts: [
    {
      id: 1,
      user_id: 1,
      content: 'Just pitched our camp under the stars at Mount Rainier! Nothing beats crisp mountain air and a warm campfire with great friends. 🏕️🔥',
      image_url: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800&auto=format&fit=crop&q=80',
      feeling: '🏕️ Camping',
      location: 'Mount Rainier National Park',
      created_at: new Date().toISOString(),
    },
  ],
  post_likes: [],
  comments: [],
  messages: [],
  nextUserId: 2,
  nextPostId: 2,
  nextCommentId: 1,
  nextMessageId: 1,
};

export const initDatabase = async () => {
  try {
    const tempConnection = await mysql.createConnection(dbConfig);
    const dbName = process.env.DB_NAME || 'campapp_db';

    await tempConnection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`);
    await tempConnection.end();

    pool = mysql.createPool({
      ...dbConfig,
      database: dbName,
    });

    // Create tables
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(191) NOT NULL UNIQUE,
        password_hash VARCHAR(255) NOT NULL,
        phone VARCHAR(20),
        gender VARCHAR(20),
        dob VARCHAR(30),
        country VARCHAR(100),
        bio TEXT,
        avatar_url VARCHAR(500) DEFAULT 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
        cover_url VARCHAR(500) DEFAULT 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=1200&auto=format&fit=crop&q=80',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB;
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS posts (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        content TEXT NOT NULL,
        image_url VARCHAR(500) DEFAULT NULL,
        feeling VARCHAR(50) DEFAULT NULL,
        location VARCHAR(100) DEFAULT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      ) ENGINE=InnoDB;
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS post_likes (
        id INT AUTO_INCREMENT PRIMARY KEY,
        post_id INT NOT NULL,
        user_id INT NOT NULL,
        type ENUM('like', 'dislike') NOT NULL DEFAULT 'like',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE KEY unique_user_post_reaction (post_id, user_id),
        FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      ) ENGINE=InnoDB;
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS comments (
        id INT AUTO_INCREMENT PRIMARY KEY,
        post_id INT NOT NULL,
        user_id INT NOT NULL,
        content TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      ) ENGINE=InnoDB;
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS messages (
        id INT AUTO_INCREMENT PRIMARY KEY,
        sender_id INT NOT NULL,
        receiver_id INT NOT NULL,
        message TEXT NOT NULL,
        is_read BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (receiver_id) REFERENCES users(id) ON DELETE CASCADE
      ) ENGINE=InnoDB;
    `);

    isUsingFallback = false;
    console.log('✅ Connected to MySQL database and verified all tables successfully!');
  } catch (error) {
    isUsingFallback = true;
    console.warn('\n⚠️  -------------------------------------------------------------');
    console.warn(`⚠️  MySQL Connection Note: ${error.message}`);
    console.warn('⚠️  If your MySQL root user has a password, update server/.env:');
    console.warn('⚠️  Example: DB_PASSWORD=your_mysql_password');
    console.warn('⚠️  Seamless In-Memory store activated so you can test all features without interruption!');
    console.warn('⚠️  -------------------------------------------------------------\n');
  }
};

// Fallback executor interface
const fallbackPool = {
  query: async (sql, params = []) => {
    const cleanSql = sql.trim().replace(/\s+/g, ' ');

    // 1. SELECT users by email
    if (cleanSql.includes('SELECT') && cleanSql.includes('FROM users WHERE email = ?')) {
      const email = params[0];
      const match = memoryStore.users.filter((u) => u.email.toLowerCase() === email.toLowerCase());
      return [match];
    }

    // 2. SELECT users by id
    if (cleanSql.includes('SELECT') && cleanSql.includes('FROM users WHERE id = ?')) {
      const id = Number(params[0]);
      const match = memoryStore.users.filter((u) => u.id === id);
      return [match];
    }

    // 3. INSERT user
    if (cleanSql.includes('INSERT INTO users')) {
      const newUser = {
        id: memoryStore.nextUserId++,
        name: params[0],
        email: params[1],
        password_hash: params[2],
        phone: params[3] || null,
        gender: params[4] || 'other',
        dob: params[5] || null,
        country: params[6] || null,
        bio: params[7] || 'Connecting, sharing, and exploring on Camp.',
        avatar_url: params[8] || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
        cover_url: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=1200&auto=format&fit=crop&q=80',
        created_at: new Date().toISOString(),
      };
      memoryStore.users.push(newUser);
      return [{ insertId: newUser.id }];
    }

    // 4. UPDATE users
    if (cleanSql.includes('UPDATE users')) {
      const userId = Number(params[params.length - 1]);
      const user = memoryStore.users.find((u) => u.id === userId);
      if (user) {
        if (params[0] !== undefined && params[0] !== null) user.name = params[0];
        if (params[1] !== undefined && params[1] !== null) user.bio = params[1];
        if (params[2] !== undefined && params[2] !== null) user.phone = params[2];
        if (params[3] !== undefined && params[3] !== null) user.gender = params[3];
        if (params[4] !== undefined && params[4] !== null) user.dob = params[4];
        if (params[5] !== undefined && params[5] !== null) user.country = params[5];
        if (params[6] !== undefined && params[6] !== null) user.avatar_url = params[6];
      }
      return [{ affectedRows: 1 }];
    }

    // 5. Search users
    if (cleanSql.includes('SELECT') && cleanSql.includes('FROM users WHERE id !=')) {
      const excludeId = Number(params[0]);
      const q = (params[1] || '').replace(/%/g, '').toLowerCase();
      const results = memoryStore.users
        .filter((u) => u.id !== excludeId && (u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)))
        .map((u) => ({ id: u.id, name: u.name, email: u.email, bio: u.bio, avatar_url: u.avatar_url }));
      return [results];
    }

    // 6. SELECT all posts
    if (cleanSql.includes('FROM posts p JOIN users u ON p.user_id = u.id')) {
      const currentUserId = Number(params[0]);
      const formatted = memoryStore.posts.map((p) => {
        const author = memoryStore.users.find((u) => u.id === p.user_id) || {
          name: 'Camp Explorer',
          email: 'camper@example.com',
          avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100',
        };

        const likes = memoryStore.post_likes.filter((pl) => pl.post_id === p.id && pl.type === 'like').length;
        const dislikes = memoryStore.post_likes.filter((pl) => pl.post_id === p.id && pl.type === 'dislike').length;
        const myReaction = memoryStore.post_likes.find((pl) => pl.post_id === p.id && pl.user_id === currentUserId);
        const postComments = memoryStore.comments.filter((c) => c.post_id === p.id);

        return {
          id: p.id,
          user_id: p.user_id,
          content: p.content,
          image_url: p.image_url,
          feeling: p.feeling,
          location: p.location,
          created_at: p.created_at,
          author_name: author.name,
          author_email: author.email,
          author_avatar: author.avatar_url,
          likes_count: likes,
          dislikes_count: dislikes,
          comments_count: postComments.length,
          user_reaction: myReaction ? myReaction.type : null,
        };
      });
      return [formatted.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))];
    }

    // 7. INSERT post
    if (cleanSql.includes('INSERT INTO posts')) {
      const newPost = {
        id: memoryStore.nextPostId++,
        user_id: Number(params[0]),
        content: params[1],
        image_url: params[2] || null,
        feeling: params[3] || null,
        location: params[4] || null,
        created_at: new Date().toISOString(),
      };
      memoryStore.posts.unshift(newPost);
      return [{ insertId: newPost.id }];
    }

    // 8. SELECT single post by id
    if (cleanSql.includes('FROM posts p JOIN users u ON p.user_id = u.id WHERE p.id = ?')) {
      const postId = Number(params[0]);
      const p = memoryStore.posts.find((item) => item.id === postId);
      if (!p) return [[]];
      const author = memoryStore.users.find((u) => u.id === p.user_id) || {
        name: 'Camp Explorer',
        email: 'camper@example.com',
        avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100',
      };
      return [
        [
          {
            id: p.id,
            user_id: p.user_id,
            content: p.content,
            image_url: p.image_url,
            feeling: p.feeling,
            location: p.location,
            created_at: p.created_at,
            author_name: author.name,
            author_email: author.email,
            author_avatar: author.avatar_url,
            likes_count: 0,
            dislikes_count: 0,
            comments_count: 0,
            user_reaction: null,
          },
        ],
      ];
    }

    // 9. Comments query
    if (cleanSql.includes('FROM comments c JOIN users u ON c.user_id = u.id')) {
      const comments = memoryStore.comments.map((c) => {
        const u = memoryStore.users.find((user) => user.id === c.user_id) || { name: 'User', avatar_url: '' };
        return {
          id: c.id,
          post_id: c.post_id,
          user_id: c.user_id,
          content: c.content,
          created_at: c.created_at,
          author_name: u.name,
          author_avatar: u.avatar_url,
        };
      });
      return [comments];
    }

    // 10. INSERT comment
    if (cleanSql.includes('INSERT INTO comments')) {
      const newComment = {
        id: memoryStore.nextCommentId++,
        post_id: Number(params[0]),
        user_id: Number(params[1]),
        content: params[2],
        created_at: new Date().toISOString(),
      };
      memoryStore.comments.push(newComment);
      return [{ insertId: newComment.id }];
    }

    // 11. Reaction query & update
    if (cleanSql.includes('SELECT id, type FROM post_likes WHERE post_id = ? AND user_id = ?')) {
      const postId = Number(params[0]);
      const userId = Number(params[1]);
      const match = memoryStore.post_likes.filter((pl) => pl.post_id === postId && pl.user_id === userId);
      return [match];
    }
    if (cleanSql.includes('DELETE FROM post_likes WHERE id = ?')) {
      const id = Number(params[0]);
      memoryStore.post_likes = memoryStore.post_likes.filter((pl) => pl.id !== id);
      return [{ affectedRows: 1 }];
    }
    if (cleanSql.includes('UPDATE post_likes SET type = ? WHERE id = ?')) {
      const type = params[0];
      const id = Number(params[1]);
      const match = memoryStore.post_likes.find((pl) => pl.id === id);
      if (match) match.type = type;
      return [{ affectedRows: 1 }];
    }
    if (cleanSql.includes('INSERT INTO post_likes')) {
      const newLike = {
        id: memoryStore.post_likes.length + 1,
        post_id: Number(params[0]),
        user_id: Number(params[1]),
        type: params[2],
      };
      memoryStore.post_likes.push(newLike);
      return [{ insertId: newLike.id }];
    }
    if (cleanSql.includes('COUNT(*) as count FROM post_likes')) {
      const postId = Number(params[0]);
      const type = cleanSql.includes("'like'") ? 'like' : 'dislike';
      const count = memoryStore.post_likes.filter((pl) => pl.post_id === postId && pl.type === type).length;
      return [[{ count }]];
    }

    // 12. Messages query
    if (cleanSql.includes('FROM messages m JOIN users sender ON m.sender_id = sender.id')) {
      const u1 = Number(params[0]);
      const u2 = Number(params[1]);
      const msgs = memoryStore.messages
        .filter((m) => (m.sender_id === u1 && m.receiver_id === u2) || (m.sender_id === u2 && m.receiver_id === u1))
        .map((m) => {
          const sender = memoryStore.users.find((u) => u.id === m.sender_id) || { name: 'Camper', avatar_url: '' };
          return {
            ...m,
            sender_name: sender.name,
            sender_avatar: sender.avatar_url,
          };
        });
      return [msgs];
    }

    // 13. INSERT message
    if (cleanSql.includes('INSERT INTO messages')) {
      const newMsg = {
        id: memoryStore.nextMessageId++,
        sender_id: Number(params[0]),
        receiver_id: Number(params[1]),
        message: params[2],
        is_read: false,
        created_at: new Date().toISOString(),
      };
      memoryStore.messages.push(newMsg);
      return [{ insertId: newMsg.id }];
    }

    // 14. Count queries
    if (cleanSql.includes('COUNT(*) as postCount FROM posts WHERE user_id = ?')) {
      const userId = Number(params[0]);
      const count = memoryStore.posts.filter((p) => p.user_id === userId).length;
      return [[{ postCount: count }]];
    }

    return [[]];
  },
};

export const getPool = () => {
  if (isUsingFallback || !pool) {
    return fallbackPool;
  }
  return pool;
};

export default getPool;
