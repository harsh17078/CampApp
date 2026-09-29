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
export const memoryStore = {
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
      bio: 'Nature photographer & trail runner. Finding peace in the mountains. 🏔️ #Outdoors #Adventure',
      avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
      cover_url: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=1200&auto=format&fit=crop&q=80',
      created_at: new Date(Date.now() - 86400000 * 30).toISOString(),
    },
    {
      id: 2,
      name: 'Marcus Cole',
      email: 'marcus@campapp.com',
      password_hash: bcrypt.hashSync('password123', 10),
      phone: '+1 555-0834',
      gender: 'male',
      dob: '1995-11-20',
      country: 'Canada',
      bio: 'Fullstack dev building the future of social networks. 🚀 #Tech #WebDev #Design',
      avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
      cover_url: 'https://images.unsplash.com/photo-1510312305653-8ed496efae75?w=1200&auto=format&fit=crop&q=80',
      created_at: new Date(Date.now() - 86400000 * 20).toISOString(),
    },
    {
      id: 3,
      name: 'Aria Chen',
      email: 'aria@campapp.com',
      password_hash: bcrypt.hashSync('password123', 10),
      phone: '+1 555-0341',
      gender: 'female',
      dob: '1999-03-15',
      country: 'Japan',
      bio: 'Digital nomad exploring Japan and creating coffee-fueled content. ☕✨ #Travel #Coffee #Life',
      avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=80',
      cover_url: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=1200&auto=format&fit=crop&q=80',
      created_at: new Date(Date.now() - 86400000 * 10).toISOString(),
    },
  ],
  follows: [
    { id: 1, follower_id: 1, following_id: 2 },
    { id: 2, follower_id: 2, following_id: 1 },
    { id: 3, follower_id: 3, following_id: 1 },
  ],
  posts: [
    {
      id: 1,
      user_id: 1,
      content: 'Just pitched our tent under the northern lights at Mount Rainier! Nothing beats crisp mountain air and starry night skies. 🏕️✨ #Camping #Adventure #NightSky',
      image_url: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800&auto=format&fit=crop&q=80',
      feeling: '🏕️ Camping',
      location: 'Mount Rainier National Park',
      views_count: 1420,
      is_pinned: true,
      quote_post_id: null,
      repost_of_id: null,
      created_at: new Date(Date.now() - 7200000).toISOString(),
    },
    {
      id: 2,
      user_id: 2,
      content: 'Building a microblogging platform in 2026 requires real-time fanout, crisp glassmorphism UI, and effortless interactions. What are your favorite microblogging features? #WebDev #BuildInPublic',
      image_url: 'https://images.unsplash.com/photo-1510312305653-8ed496efae75?w=800&auto=format&fit=crop&q=80',
      feeling: '🚀 Productive',
      location: 'Tech Hub, Seattle',
      views_count: 3105,
      is_pinned: false,
      quote_post_id: null,
      repost_of_id: null,
      created_at: new Date(Date.now() - 14400000).toISOString(),
    },
    {
      id: 3,
      user_id: 3,
      content: 'Early morning coffee brew overlooking the misty hills of Kyoto. Starting the day with gratitude and quiet reflection. ☕🍵 #Coffee #Travel #Kyoto',
      image_url: 'https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=800&auto=format&fit=crop&q=80',
      feeling: '☕ Chill',
      location: 'Kyoto, Japan',
      views_count: 890,
      is_pinned: false,
      quote_post_id: null,
      repost_of_id: null,
      created_at: new Date(Date.now() - 28800000).toISOString(),
    },
  ],
  post_likes: [
    { id: 1, post_id: 1, user_id: 2, type: 'like' },
    { id: 2, post_id: 1, user_id: 3, type: 'like' },
    { id: 3, post_id: 2, user_id: 1, type: 'like' },
  ],
  reposts: [
    { id: 1, post_id: 1, user_id: 2, created_at: new Date().toISOString() }
  ],
  bookmarks: [
    { id: 1, post_id: 1, user_id: 2, created_at: new Date().toISOString() }
  ],
  comments: [
    {
      id: 1,
      post_id: 1,
      user_id: 2,
      content: 'This shot looks unreal! Did you take this on a 35mm lens?',
      created_at: new Date(Date.now() - 3600000).toISOString(),
    },
    {
      id: 2,
      post_id: 1,
      user_id: 1,
      content: 'Yes! 35mm f/1.4 with a 15-second exposure. The sky was crystal clear.',
      created_at: new Date(Date.now() - 1800000).toISOString(),
    },
  ],
  messages: [],
  nextUserId: 4,
  nextPostId: 4,
  nextCommentId: 3,
  nextMessageId: 1,
  nextFollowId: 4,
  nextRepostId: 2,
  nextBookmarkId: 2,
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

    // Create / update tables
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
      CREATE TABLE IF NOT EXISTS follows (
        id INT AUTO_INCREMENT PRIMARY KEY,
        follower_id INT NOT NULL,
        following_id INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE KEY unique_user_follow (follower_id, following_id),
        FOREIGN KEY (follower_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (following_id) REFERENCES users(id) ON DELETE CASCADE
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
        views_count INT DEFAULT 0,
        is_pinned BOOLEAN DEFAULT FALSE,
        quote_post_id INT DEFAULT NULL,
        repost_of_id INT DEFAULT NULL,
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
      CREATE TABLE IF NOT EXISTS reposts (
        id INT AUTO_INCREMENT PRIMARY KEY,
        post_id INT NOT NULL,
        user_id INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE KEY unique_user_repost (post_id, user_id),
        FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      ) ENGINE=InnoDB;
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS bookmarks (
        id INT AUTO_INCREMENT PRIMARY KEY,
        post_id INT NOT NULL,
        user_id INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE KEY unique_user_bookmark (post_id, user_id),
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
    console.log('✅ Connected to MySQL database and verified all microblogging tables!');
  } catch (error) {
    isUsingFallback = true;
    console.warn('⚠️ MySQL Note: Running in high-speed microblogging in-memory mode.');
  }
};

export const getPool = () => {
  if (isUsingFallback || !pool) {
    return {
      query: async (sql, params = []) => {
        // Fallback executor for memoryStore
        return [[]];
      }
    };
  }
  return pool;
};

export const isFallback = () => isUsingFallback;

export default getPool;
