const jwt = require('jsonwebtoken');
const User = require('../models/User');
const mockStore = require('../data/mockStore');
const { getIsConnected } = require('../config/db');

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];

      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'pulse_social_jwt_secret_key_week07_2026'
      );

      if (getIsConnected()) {
        req.user = await User.findById(decoded.id).select('-password');
      } else {
        const u = mockStore.findUserById(decoded.id);
        if (u) {
          const { password, ...userWithoutPass } = u;
          req.user = userWithoutPass;
        }
      }

      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Not authorized, user not found'
        });
      }

      return next();
    } catch (error) {
      console.error('JWT auth error:', error.message);
      return res.status(401).json({
        success: false,
        message: 'Not authorized, token invalid or expired'
      });
    }
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized, no token provided'
    });
  }
};

module.exports = { protect };
