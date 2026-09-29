const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const mockStore = require('../data/mockStore');
const { getIsConnected } = require('../config/db');

// Helper to generate JWT token
const generateToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET || 'pulse_social_jwt_secret_key_week07_2026',
    { expiresIn: '30d' }
  );
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res, next) => {
  try {
    const { name, username, email, password, bio, avatar } = req.body;

    // Validation
    if (!name || !username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields (name, username, email, password)'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long'
      });
    }

    const cleanUsername = username.trim().toLowerCase().replace(/\s+/g, '_');
    const cleanEmail = email.trim().toLowerCase();

    if (getIsConnected()) {
      // Mongoose Mode
      const userExists = await User.findOne({
        $or: [{ email: cleanEmail }, { username: cleanUsername }]
      });

      if (userExists) {
        return res.status(400).json({
          success: false,
          message: userExists.email === cleanEmail
            ? 'An account with this email already exists'
            : 'This username is already taken'
        });
      }

      const user = await User.create({
        name: name.trim(),
        username: cleanUsername,
        email: cleanEmail,
        password,
        bio: bio || 'Excited to join the community!',
        avatar: avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${cleanUsername}`
      });

      const token = generateToken(user._id);

      return res.status(201).json({
        success: true,
        message: 'Registration successful! Welcome to PulseSocial.',
        token,
        user: {
          _id: user._id,
          name: user.name,
          username: user.username,
          email: user.email,
          bio: user.bio,
          avatar: user.avatar,
          coverImage: user.coverImage,
          location: user.location,
          website: user.website,
          followers: user.followers,
          following: user.following,
          createdAt: user.createdAt
        }
      });
    } else {
      // Mock Store Mode
      const existingEmail = mockStore.findUserByEmail(cleanEmail);
      if (existingEmail) {
        return res.status(400).json({
          success: false,
          message: 'An account with this email already exists'
        });
      }

      const existingUsername = mockStore.findUserByUsername(cleanUsername);
      if (existingUsername) {
        return res.status(400).json({
          success: false,
          message: 'This username is already taken'
        });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      const newUserId = 'user_' + Date.now();

      const newUser = {
        _id: newUserId,
        name: name.trim(),
        username: cleanUsername,
        email: cleanEmail,
        password: hashedPassword,
        bio: bio || 'Excited to join the community!',
        avatar: avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${cleanUsername}`,
        coverImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
        location: 'Earth',
        website: '',
        followers: [],
        following: [],
        createdAt: new Date().toISOString()
      };

      mockStore.addUser(newUser);
      const token = generateToken(newUser._id);

      const { password: _, ...userSafe } = newUser;

      return res.status(201).json({
        success: true,
        message: 'Registration successful! Welcome to PulseSocial.',
        token,
        user: userSafe
      });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res, next) => {
  try {
    const { emailOrUsername, email, password } = req.body;
    const identifier = (emailOrUsername || email || '').trim().toLowerCase();

    if (!identifier || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email or username and password'
      });
    }

    if (getIsConnected()) {
      // Find user with password selected
      const user = await User.findOne({
        $or: [{ email: identifier }, { username: identifier }]
      }).select('+password');

      if (!user || !(await user.matchPassword(password))) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email/username or password'
        });
      }

      const token = generateToken(user._id);

      return res.json({
        success: true,
        message: `Welcome back, ${user.name}!`,
        token,
        user: {
          _id: user._id,
          name: user.name,
          username: user.username,
          email: user.email,
          bio: user.bio,
          avatar: user.avatar,
          coverImage: user.coverImage,
          location: user.location,
          website: user.website,
          followers: user.followers,
          following: user.following,
          createdAt: user.createdAt
        }
      });
    } else {
      // Mock Store Mode
      const user =
        mockStore.findUserByEmail(identifier) ||
        mockStore.findUserByUsername(identifier);

      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email/username or password'
        });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email/username or password'
        });
      }

      const token = generateToken(user._id);
      const { password: _, ...userSafe } = user;

      return res.json({
        success: true,
        message: `Welcome back, ${user.name}!`,
        token,
        user: userSafe
      });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res, next) => {
  try {
    return res.json({
      success: true,
      user: req.user
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Logout user / clear session
// @route   POST /api/auth/logout
// @access  Public
const logoutUser = async (req, res) => {
  return res.json({
    success: true,
    message: 'User logged out successfully'
  });
};

module.exports = {
  registerUser,
  loginUser,
  getMe,
  logoutUser
};
