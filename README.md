# ⚡ PulseSocial - Full Stack Social Media Web Application
> **Web Development – Week 07 Minor Project: Minor Project 07**  
> **Topic:** Full Stack Social Media App  
> **Tech Stack:** MERN Stack (React.js, Node.js, Express.js, MongoDB, JWT Authentication)

---

## 📖 1. Project Overview

**PulseSocial** is a full-stack, responsive social media platform built using the MERN stack. It empowers creators and developers to share technical thoughts, discover trending ideas, connect through creator profiles, like posts with real-time feedback, and engage through comment discussions.

The system integrates modern frontend engineering with React 19 and custom Glassmorphism Vanilla CSS design, paired with a modular Express.js and Node.js REST API layer that supports both real MongoDB/Mongoose connections and an automatic high-performance in-memory fallback store for seamless zero-config evaluation.

---

## ✨ 2. Features Implemented

### 1. User Authentication & Authorization
- **User Registration:** Validates full name, unique lowercase username, unique email address, password strength (minimum 6 characters), bio, and personalized avatar preset selection.
- **Password Security:** One-way password hashing using `bcryptjs` with 10 salt rounds.
- **Session Tokens:** Stateless JWT (`jsonwebtoken`) token generation, signed and verified for protected endpoints.
- **User Login:** Supports authentication via either email or username with password validation.
- **1-Click Evaluator Demo Accounts:** Instant one-click login for test accounts (`alex_dev`, `sophia_codes`, `marcus_tech`) to simplify grading and evaluation.
- **User Logout:** Securely invalidates client state and clears local storage tokens.
- **Protected Routes:** Unauthorized users attempting to access authenticated features are redirected to the login flow.

### 2. User Profile Management
- **Profile Display:** Showcases user avatar, cover image, full name, username badge, bio, location, personal website link, joined date, total posts, follower count, and following count.
- **Edit Profile:** Modal allowing users to modify name, bio (with character limit counter), location, website URL, and avatar presets.
- **Follow / Unfollow System (Bonus):** Follow other creators to curate your personalized following feed with real-time follower count updates.

### 3. Create Posts
- **Rich Post Creation:** Create text-based posts up to 1000 characters with live character counter.
- **Category Tags:** Categorize posts into *Tech*, *Design*, *Coding*, *Life*, *Announcements*, or *General*.
- **Hashtag System:** Automatic detection and extraction of `#hashtags` from post content, plus manual tag inputs.
- **Image Attachments:** Support for custom image URLs and preset high-resolution photography.
- **Timestamps:** Automatic timestamping displaying relative time (e.g. *"Just now"*, *"2h ago"*).

### 4. View Posts Feed
- **Feed Views:**
  - **For You (All Posts):** Real-time feed of all community posts.
  - **Following Feed:** Curated stream showing posts only from creators the current user follows.
- **Live Search & Exploration:** Instant search bar filtering posts across content, hashtags, and author names.
- **Category Filter Pills:** One-click filtering by category (*Tech*, *Design*, *Coding*, etc.).
- **Author Identity:** Displays author avatar, full name, username handle, and verified badge.

### 5. Post Interactions & Comments
- **Likes & Unlikes:** Instant optimistic heart pop animation and live like count updates.
- **Comments Thread (Bonus):** Expandable comments drawer allowing users to comment on any post with relative timestamps.
- **Delete Comment:** Comment authors and post owners can delete comments.
- **Edit Own Posts:** Post authors can open an edit modal to modify post content, category, and tags.
- **Delete Own Posts:** Post authors can permanently remove their posts with a confirmation modal dialog.
- **Share Post:** One-click copy of post permalink to the user's clipboard.

### 6. UI/UX & Aesthetics
- **Modern Glassmorphism:** Translucent glass surface cards with backdrop-blur filters, glowing border accents, and smooth shadows.
- **Dark Mode & Light Mode:** Toggleable theme switch with smooth transitions, persisting user preference in `localStorage`.
- **Responsive Layout:**
  - **Desktop (1024px+):** 3-column layout (Navigation Sidebar, Main Feed, Discovery & Trending Sidebar).
  - **Tablet (768px - 1024px):** 2-column layout (Navigation & Main Feed).
  - **Mobile (< 768px):** Streamlined single-column feed with collapsible menus.

---

## 🛠️ 3. Technologies Used

### Frontend
- **React.js 19**: Modern functional components, JSX, hooks (`useState`, `useEffect`, `useCallback`, `useContext`).
- **React Router DOM 7**: Client-side single page routing (`/`, `/explore`, `/profile/:username`, `/login`, `/register`).
- **Axios**: HTTP client configured with JWT request interceptors and centralized error handling.
- **Vanilla CSS3**: Design system with CSS variables, light/dark themes, responsive flexbox and CSS grid.
- **Google Fonts**: `Outfit` (brand & typography hierarchy) and `Inter` (body & UI text).
- **Vite 8**: Next-generation lightning-fast frontend tooling and development server.

### Backend
- **Node.js (v24)**: Server-side JavaScript runtime.
- **Express.js (v4.19)**: Robust web framework for REST API development.
- **MongoDB & Mongoose (v8.4)**: Document-oriented database with structured schemas, pre-save hooks, and population.
- **In-Memory Social Data Store (Fallback Engine)**: Pre-seeded data store guaranteeing seamless local evaluation even if local MongoDB daemon is inactive.
- **JSON Web Tokens (`jsonwebtoken`)**: Stateless authentication and protected route middleware.
- **Bcrypt.js**: Cryptographic password hashing.
- **CORS & Dotenv**: Cross-Origin Resource Sharing and environment configuration.
- **Multer**: Multipart/form-data middleware for image attachments.

---

## 📂 4. Project Directory Structure

```text
famithaproject4/
├── client/                      # React Frontend Application
│   ├── public/                  # Static assets & SVG favicon
│   ├── src/
│   │   ├── components/
│   │   │   ├── auth/            # ProtectedRoute.jsx
│   │   │   ├── comments/        # CommentList.jsx
│   │   │   ├── common/          # Navbar.jsx, SidebarLeft.jsx, SidebarRight.jsx, ConfirmModal.jsx, ProjectModal.jsx
│   │   │   ├── posts/           # PostCard.jsx, CreatePostCard.jsx, EditPostModal.jsx
│   │   │   └── profile/         # ProfileHeader.jsx, EditProfileModal.jsx
│   │   ├── context/             # AuthContext.jsx, ThemeContext.jsx, ToastContext.jsx
│   │   ├── pages/               # FeedPage.jsx, ExplorePage.jsx, ProfilePage.jsx, LoginPage.jsx, RegisterPage.jsx, NotFoundPage.jsx
│   │   ├── services/            # api.js, authService.js, postService.js, userService.js
│   │   ├── App.css              # Glassmorphic component styles & animations
│   │   ├── App.jsx              # Main App root with routing and providers
│   │   ├── index.css            # Global CSS variables & tokens
│   │   └── main.jsx             # React DOM entry point
│   ├── index.html               # HTML document with Google Fonts
│   ├── package.json             # Frontend dependencies
│   └── vite.config.js           # Vite server configuration & API proxy
├── server/                      # Node.js & Express REST API Backend
│   ├── config/                  # db.js (MongoDB connector with fallback)
│   ├── controllers/             # authController.js, postController.js, userController.js
│   ├── data/                    # mockStore.js (Pre-seeded demo data)
│   ├── middleware/              # authMiddleware.js, errorMiddleware.js, uploadMiddleware.js
│   ├── models/                  # User.js, Post.js, Notification.js
│   ├── routes/                  # authRoutes.js, postRoutes.js, userRoutes.js
│   ├── .env                     # Server environment variables
│   ├── .env.example             # Example environment file
│   ├── package.json             # Backend dependencies
│   └── server.js                # Express app entry point
├── package.json                 # Unified root package.json with concurrently
└── README.md                    # Academic project documentation
```

---

## 🚀 5. Installation & Setup Guide

### Prerequisites
- **Node.js** (v18.0 or newer)
- **npm** (v9.0 or newer)
- *(Optional)* **MongoDB** installed locally or a free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster connection string.

### Step 1: Install Dependencies
From the project root folder:
```bash
npm run install:all
```
*(Alternatively: run `npm install` in the root, `npm install` inside `/server`, and `npm install` inside `/client`)*.

### Step 2: Environment Variables
The backend `.env` file is located at `server/.env`:
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/social_media_app
JWT_SECRET=pulse_social_jwt_secret_key_week07_2026
CLIENT_URL=http://localhost:5173
```
> *Note: If a local MongoDB instance is not detected, the app automatically switches to the In-Memory Store so the evaluator can test immediately without any database configuration.*

### Step 3: Run the Application
Run both backend and frontend concurrently with a single command from the root directory:
```bash
npm run dev
```

The application will be accessible at:
- **Frontend App:** [http://localhost:5173/](http://localhost:5173/)
- **Backend API:** [http://localhost:5000/api](http://localhost:5000/api)
- **API Health Check:** [http://localhost:5000/api/health](http://localhost:5000/api/health)

---

## 🔑 6. Preloaded Evaluator Accounts

To test the application immediately without signing up, use the **1-Click Evaluator Buttons** on the Login Page:

| User | Username | Email | Password | Role |
| :--- | :--- | :--- | :--- | :--- |
| **Alex Rivera** | `alex_dev` | `alex@example.com` | `password123` | Full Stack Developer |
| **Sophia Chen** | `sophia_codes` | `sophia@example.com` | `password123` | Product Designer |
| **Marcus Vance** | `marcus_tech` | `marcus@example.com` | `password123` | Cloud Architect |

---

## 📡 7. REST API Documentation

### Authentication (`/api/auth`)
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register a new user | Public |
| `POST` | `/api/auth/login` | Authenticate user & get JWT | Public |
| `POST` | `/api/auth/logout` | End session | Public |
| `GET` | `/api/auth/me` | Fetch authenticated user data | Private (JWT) |

### Posts (`/api/posts`)
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/posts` | Get all posts (supports `search`, `category`, `tag`, `feed`) | Public |
| `GET` | `/api/posts/:id` | Get single post details with comments | Public |
| `POST` | `/api/posts` | Create new post | Private (JWT) |
| `PUT` | `/api/posts/:id` | Update / edit post | Private (Author) |
| `DELETE` | `/api/posts/:id` | Delete post | Private (Author) |
| `PUT` | `/api/posts/:id/like` | Toggle Like / Unlike post | Private (JWT) |
| `POST` | `/api/posts/:id/comments` | Add comment to post | Private (JWT) |
| `DELETE` | `/api/posts/:id/comments/:commentId` | Delete comment | Private (Author) |

### User Profiles (`/api/users`)
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/users/profile/:username` | Fetch creator profile, stats & posts | Public |
| `PUT` | `/api/users/profile` | Update profile information | Private (JWT) |
| `PUT` | `/api/users/:id/follow` | Toggle Follow / Unfollow user | Private (JWT) |
| `GET` | `/api/users/suggested` | Get recommended creators to follow | Public |

---

## 🎓 8. Academic Submission Details
- **Module:** Minor Project
- **Topic:** Minor Project 07 - Full Stack Social Media App
- **Submission Type:** GitHub Repository Link / Google Colab Link
- **LMS Form:** Submit via the Minor Project Submission Link in your student dashboard.
