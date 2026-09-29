const User = require('../models/User');
const Post = require('../models/Post');
const mockStore = require('../data/mockStore');
const { getIsConnected } = require('../config/db');

// @desc    Get user profile by username or id
// @route   GET /api/users/profile/:username
// @access  Public
const getUserProfile = async (req, res, next) => {
  try {
    const { username } = req.params;
    const cleanUsername = username.toLowerCase();

    if (getIsConnected()) {
      const user = await User.findOne({
        $or: [{ username: cleanUsername }, { _id: username.match(/^[0-9a-fA-F]{24}$/) ? username : null }]
      }).select('-password');

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User profile not found'
        });
      }

      // Fetch user's posts
      const posts = await Post.find({ author: user._id })
        .populate('author', 'name username avatar')
        .populate('comments.user', 'name username avatar')
        .sort({ createdAt: -1 });

      return res.json({
        success: true,
        user,
        posts,
        stats: {
          postsCount: posts.length,
          followersCount: user.followers ? user.followers.length : 0,
          followingCount: user.following ? user.following.length : 0
        }
      });
    } else {
      const allUsers = mockStore.getUsers();
      const user =
        allUsers.find((u) => u.username.toLowerCase() === cleanUsername) ||
        mockStore.findUserById(username);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User profile not found'
        });
      }

      const { password, ...userSafe } = user;
      const allPosts = mockStore.getPosts();
      const userPosts = allPosts.filter(
        (p) => (p.author._id || p.author) === user._id
      );

      return res.json({
        success: true,
        user: userSafe,
        posts: userPosts,
        stats: {
          postsCount: userPosts.length,
          followersCount: user.followers ? user.followers.length : 0,
          followingCount: user.following ? user.following.length : 0
        }
      });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = async (req, res, next) => {
  try {
    const { name, bio, location, website, avatar, coverImage } = req.body;

    if (getIsConnected()) {
      const user = await User.findById(req.user._id);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      if (name) user.name = name.trim();
      if (bio !== undefined) user.bio = bio.trim();
      if (location !== undefined) user.location = location.trim();
      if (website !== undefined) user.website = website.trim();
      if (avatar) user.avatar = avatar;
      if (coverImage) user.coverImage = coverImage;

      const updatedUser = await user.save();

      return res.json({
        success: true,
        message: 'Profile updated successfully',
        user: {
          _id: updatedUser._id,
          name: updatedUser.name,
          username: updatedUser.username,
          email: updatedUser.email,
          bio: updatedUser.bio,
          avatar: updatedUser.avatar,
          coverImage: updatedUser.coverImage,
          location: updatedUser.location,
          website: updatedUser.website,
          followers: updatedUser.followers,
          following: updatedUser.following,
          createdAt: updatedUser.createdAt
        }
      });
    } else {
      const updates = {};
      if (name) updates.name = name.trim();
      if (bio !== undefined) updates.bio = bio.trim();
      if (location !== undefined) updates.location = location.trim();
      if (website !== undefined) updates.website = website.trim();
      if (avatar) updates.avatar = avatar;
      if (coverImage) updates.coverImage = coverImage;

      const updated = mockStore.updateUser(req.user._id, updates);
      if (!updated) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      const { password, ...userSafe } = updated;
      return res.json({
        success: true,
        message: 'Profile updated successfully',
        user: userSafe
      });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Follow or unfollow a user
// @route   PUT /api/users/:id/follow
// @access  Private
const followUnfollowUser = async (req, res, next) => {
  try {
    const targetUserId = req.params.id;
    const currentUserId = req.user._id.toString();

    if (targetUserId === currentUserId) {
      return res.status(400).json({
        success: false,
        message: 'You cannot follow yourself'
      });
    }

    if (getIsConnected()) {
      const targetUser = await User.findById(targetUserId);
      const currentUser = await User.findById(currentUserId);

      if (!targetUser || !currentUser) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      const isFollowing = currentUser.following.some(
        (id) => id.toString() === targetUserId
      );

      if (isFollowing) {
        // Unfollow
        currentUser.following = currentUser.following.filter(
          (id) => id.toString() !== targetUserId
        );
        targetUser.followers = targetUser.followers.filter(
          (id) => id.toString() !== currentUserId
        );
        await currentUser.save();
        await targetUser.save();

        return res.json({
          success: true,
          isFollowing: false,
          message: `Unfollowed @${targetUser.username}`,
          followersCount: targetUser.followers.length
        });
      } else {
        // Follow
        currentUser.following.push(targetUserId);
        targetUser.followers.push(currentUserId);
        await currentUser.save();
        await targetUser.save();

        return res.json({
          success: true,
          isFollowing: true,
          message: `Following @${targetUser.username}`,
          followersCount: targetUser.followers.length
        });
      }
    } else {
      const targetUser = mockStore.findUserById(targetUserId);
      const currentUser = mockStore.findUserById(currentUserId);

      if (!targetUser || !currentUser) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      const isFollowing = currentUser.following.includes(targetUserId);

      if (isFollowing) {
        currentUser.following = currentUser.following.filter((id) => id !== targetUserId);
        targetUser.followers = targetUser.followers.filter((id) => id !== currentUserId);
        return res.json({
          success: true,
          isFollowing: false,
          message: `Unfollowed @${targetUser.username}`,
          followersCount: targetUser.followers.length
        });
      } else {
        currentUser.following.push(targetUserId);
        targetUser.followers.push(currentUserId);
        return res.json({
          success: true,
          isFollowing: true,
          message: `Following @${targetUser.username}`,
          followersCount: targetUser.followers.length
        });
      }
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get suggested users to follow
// @route   GET /api/users/suggested
// @access  Public / Private
const getSuggestedUsers = async (req, res, next) => {
  try {
    const currentUserId = req.user ? req.user._id.toString() : null;

    if (getIsConnected()) {
      let query = {};
      if (currentUserId) {
        query._id = { $ne: currentUserId };
      }
      const users = await User.find(query)
        .select('name username avatar bio followers')
        .limit(5);

      return res.json({
        success: true,
        users
      });
    } else {
      const all = mockStore.getUsers();
      const filtered = all
        .filter((u) => !currentUserId || u._id !== currentUserId)
        .slice(0, 5)
        .map(({ password, ...u }) => u);

      return res.json({
        success: true,
        users: filtered
      });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUserProfile,
  updateUserProfile,
  followUnfollowUser,
  getSuggestedUsers
};
