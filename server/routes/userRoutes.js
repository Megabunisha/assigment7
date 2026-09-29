const express = require('express');
const router = express.Router();
const {
  getUserProfile,
  updateUserProfile,
  followUnfollowUser,
  getSuggestedUsers
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

router.get('/suggested', getSuggestedUsers);
router.get('/profile/:username', getUserProfile);
router.put('/profile', protect, updateUserProfile);
router.put('/:id/follow', protect, followUnfollowUser);

module.exports = router;
