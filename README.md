# 🏕️ CampApp — Full-Stack Social Community Platform

CampApp is a modern, responsive social platform built with **React 19, Vite, Chakra UI, Node.js, Express.js, JWT Authentication, and MySQL**.

---

## 🌟 Key Features

- **Authentication & Security**: Secure user registration, login, and profile management with **bcrypt** password hashing and **JWT** bearer tokens.
- **Camp Feed & Posts**: Real-time post creation with feeling selectors, location tags, attached image previews, like/dislike reactions, and threaded comments.
- **Direct Messaging (Chat)**: Interactive messaging interface with camper search, chat threads, and live timestamps.
- **User Profile Management**: Custom banner, editable bio, personal details, follower counters, and authored post feeds.
- **Modern Glassmorphism UI**: Unified design system with fluid light/dark mode toggling, smooth micro-interactions, and mobile responsiveness.

---

## 🛠️ Tech Stack

### Frontend
- **React 19** + **Vite**
- **React Router v7**
- **Chakra UI v3** + **React Icons**
- **Axios** (with JWT request/response interceptors)
- **Lottie Animations**

### Backend
- **Node.js** + **Express.js** (REST API)
- **MySQL2** (with automated database & table migration)
- **JSON Web Tokens (JWT)** for session authorization
- **bcryptjs** for secure password hashing
- **CORS** & **Dotenv**

---

## 🚀 Quick Start Guide

### 1. Configure MySQL Database
Make sure your local MySQL server is running (e.g. via XAMPP, MySQL Workbench, or local service).

Check or modify database credentials in `server/.env`:
```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=campapp_db
DB_PORT=3306
JWT_SECRET=super_secret_campapp_jwt_key_2026_jwt_token
CLIENT_URL=http://localhost:5173
```
> **Note:** The backend automatically creates the `campapp_db` database and all required tables (`users`, `posts`, `post_likes`, `comments`, `messages`) on startup!

---

### 2. Start Backend Server
In the root directory or `server/`:
```bash
# In the root:
npm run server

# Or with live reload in development:
npm run server:dev
```
Backend API will be accessible at: `http://localhost:5000`

---

### 3. Start Frontend Client
In a new terminal window:
```bash
npm run dev
```
Frontend App will run at: `http://localhost:5173`

---

## 📡 REST API Endpoints

### 🔐 Authentication (`/api/auth`)
- `POST /api/auth/register` — Register a new account
- `POST /api/auth/login` — Login & receive JWT token
- `GET /api/auth/me` — Get currently authenticated user *(Protected)*

### 📝 Posts & Feed (`/api/posts`)
- `GET /api/posts` — Get all community posts & comments
- `POST /api/posts` — Create a new post *(Protected)*
- `POST /api/posts/:id/react` — Like or Dislike a post *(Protected)*
- `POST /api/posts/:id/comment` — Add a comment to a post *(Protected)*
- `DELETE /api/posts/:id` — Delete authored post *(Protected)*

### 👤 Profile & Users (`/api/users`)
- `GET /api/users/profile` — Get authenticated user's profile *(Protected)*
- `PUT /api/users/profile` — Update bio, name, country, avatar *(Protected)*
- `GET /api/users?q=query` — Search campers *(Protected)*

### 💬 Messaging (`/api/messages`)
- `GET /api/messages/conversations` — Get active conversations *(Protected)*
- `GET /api/messages/:userId` — Get chat history with a user *(Protected)*
- `POST /api/messages` — Send direct message *(Protected)*
