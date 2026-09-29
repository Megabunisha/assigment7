// Mock In-Memory Store with Realistic Social Media Seed Data
// Ensures seamless zero-config out-of-the-box evaluation if MongoDB is not running locally.

const bcrypt = require('bcryptjs');

let users = [];
let posts = [];
let notifications = [];

// Seed default users and posts
const seedInitialData = async () => {
  const hashedPassword = await bcrypt.hash('password123', 10);

  const user1 = {
    _id: 'user_alex_001',
    name: 'Alex Rivera',
    username: 'alex_dev',
    email: 'alex@example.com',
    password: hashedPassword,
    bio: 'Full Stack Developer | Building fast modern React & Node.js web applications 🚀',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=80',
    location: 'San Francisco, CA',
    website: 'https://github.com/alexrivera',
    followers: ['user_sophia_002', 'user_marcus_003'],
    following: ['user_sophia_002'],
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
  };

  const user2 = {
    _id: 'user_sophia_002',
    name: 'Sophia Chen',
    username: 'sophia_codes',
    email: 'sophia@example.com',
    password: hashedPassword,
    bio: 'Product Designer & Frontend Architect. Passionate about glassmorphism & typography ✨',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&auto=format&fit=crop&q=80',
    location: 'Seattle, WA',
    website: 'https://sophiachen.design',
    followers: ['user_alex_001'],
    following: ['user_alex_001', 'user_marcus_003'],
    createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString()
  };

  const user3 = {
    _id: 'user_marcus_003',
    name: 'Marcus Vance',
    username: 'marcus_tech',
    email: 'marcus@example.com',
    password: hashedPassword,
    bio: 'Cloud Engineer, Open Source Contributor & Coffee Addict ☕',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=80',
    location: 'Austin, TX',
    website: 'https://marcusvance.io',
    followers: ['user_sophia_002'],
    following: ['user_alex_001'],
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString()
  };

  users = [user1, user2, user3];

  posts = [
    {
      _id: 'post_001',
      author: user1,
      content: 'Just deployed our new full-stack social platform using React, Node.js, Express, and MongoDB! The developer experience with modern ES6+ and clean REST APIs is unmatched. What tech stack are you working on this week?',
      image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=80',
      category: 'Tech',
      tags: ['react', 'nodejs', 'fullstack', 'mongodb'],
      likes: ['user_sophia_002', 'user_marcus_003'],
      comments: [
        {
          _id: 'comm_001',
          user: user2,
          text: 'The architecture looks super clean! Love the glassmorphic dark mode styling too 👏',
          createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
        },
        {
          _id: 'comm_002',
          user: user3,
          text: 'Great work Alex! Looking forward to testing out the live API endpoints.',
          createdAt: new Date(Date.now() - 45 * 60 * 1000).toISOString()
        }
      ],
      createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString()
    },
    {
      _id: 'post_002',
      author: user2,
      content: 'Tip for frontend engineers: Micro-interactions and subtle CSS transitions can turn a regular dashboard into an unforgettable experience. Focus on feedback states, hover ripples, and smooth layout changes.',
      image: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800&auto=format&fit=crop&q=80',
      category: 'Design',
      tags: ['uiux', 'css', 'designsystems', 'webdev'],
      likes: ['user_alex_001'],
      comments: [
        {
          _id: 'comm_003',
          user: user1,
          text: '100% agreed! Visual hierarchy and typography make or break an interface.',
          createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString()
        }
      ],
      createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString()
    },
    {
      _id: 'post_003',
      author: user3,
      content: 'Morning coffee brewed and ready to dive into database indexing and query optimization. Remember to always benchmark before and after creating indexes on high-traffic collections!',
      image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=80',
      category: 'Coding',
      tags: ['backend', 'databases', 'performance', 'coding'],
      likes: ['user_alex_001', 'user_sophia_002'],
      comments: [],
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
    }
  ];

  notifications = [
    {
      _id: 'notif_001',
      recipient: user1._id,
      sender: user2,
      type: 'like',
      post: 'post_001',
      read: false,
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
    },
    {
      _id: 'notif_002',
      recipient: user1._id,
      sender: user3,
      type: 'comment',
      post: 'post_001',
      read: true,
      createdAt: new Date(Date.now() - 45 * 60 * 1000).toISOString()
    }
  ];
};

seedInitialData();

module.exports = {
  getUsers: () => users,
  getPosts: () => posts,
  getNotifications: () => notifications,
  addUser: (user) => {
    users.unshift(user);
    return user;
  },
  findUserById: (id) => users.find((u) => u._id === id || u._id.toString() === id.toString()),
  findUserByEmail: (email) => users.find((u) => u.email.toLowerCase() === email.toLowerCase()),
  findUserByUsername: (username) => users.find((u) => u.username.toLowerCase() === username.toLowerCase()),
  updateUser: (id, updates) => {
    const idx = users.findIndex((u) => u._id === id || u._id.toString() === id.toString());
    if (idx !== -1) {
      users[idx] = { ...users[idx], ...updates, updatedAt: new Date().toISOString() };
      return users[idx];
    }
    return null;
  },
  addPost: (post) => {
    posts.unshift(post);
    return post;
  },
  findPostById: (id) => posts.find((p) => p._id === id || p._id.toString() === id.toString()),
  updatePost: (id, updates) => {
    const idx = posts.findIndex((p) => p._id === id || p._id.toString() === id.toString());
    if (idx !== -1) {
      posts[idx] = { ...posts[idx], ...updates, updatedAt: new Date().toISOString() };
      return posts[idx];
    }
    return null;
  },
  deletePost: (id) => {
    const idx = posts.findIndex((p) => p._id === id || p._id.toString() === id.toString());
    if (idx !== -1) {
      const deleted = posts.splice(idx, 1)[0];
      return deleted;
    }
    return null;
  },
  addNotification: (notif) => {
    notifications.unshift(notif);
    return notif;
  }
};
