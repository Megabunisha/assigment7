const Post = require('../models/Post');
const User = require('../models/User');
const mockStore = require('../data/mockStore');
const { getIsConnected } = require('../config/db');

// @desc    Get all posts (Feed with search & category filtering)
// @route   GET /api/posts
// @access  Public
const getAllPosts = async (req, res, next) => {
  try {
    const { search, category, tag, feed } = req.query;
    const currentUserId = req.user ? req.user._id.toString() : null;

    if (getIsConnected()) {
      let filter = {};

      if (category && category !== 'All') {
        filter.category = category;
      }

      if (tag) {
        filter.tags = { $in: [tag.toLowerCase()] };
      }

      if (search) {
        filter.$or = [
          { content: { $regex: search, $options: 'i' } },
          { tags: { $regex: search, $options: 'i' } }
        ];
      }

      if (feed === 'following' && currentUserId) {
        const currentUser = await User.findById(currentUserId);
        if (currentUser && currentUser.following.length > 0) {
          filter.author = { $in: [...currentUser.following, currentUserId] };
        }
      }

      const posts = await Post.find(filter)
        .populate('author', 'name username avatar bio location')
        .populate('comments.user', 'name username avatar')
        .sort({ createdAt: -1 });

      return res.json({
        success: true,
        count: posts.length,
        posts
      });
    } else {
      let posts = [...mockStore.getPosts()];

      if (category && category !== 'All') {
        posts = posts.filter(
          (p) => (p.category || 'General').toLowerCase() === category.toLowerCase()
        );
      }

      if (tag) {
        posts = posts.filter(
          (p) => p.tags && p.tags.some((t) => t.toLowerCase() === tag.toLowerCase())
        );
      }

      if (search) {
        const q = search.toLowerCase();
        posts = posts.filter(
          (p) =>
            p.content.toLowerCase().includes(q) ||
            (p.tags && p.tags.some((t) => t.toLowerCase().includes(q))) ||
            (p.author && (p.author.name.toLowerCase().includes(q) || p.author.username.toLowerCase().includes(q)))
        );
      }

      if (feed === 'following' && currentUserId) {
        const currentUser = mockStore.findUserById(currentUserId);
        if (currentUser && currentUser.following) {
          const allowedIds = [...currentUser.following, currentUserId];
          posts = posts.filter((p) => {
            const authorId = p.author._id || p.author;
            return allowedIds.includes(authorId);
          });
        }
      }

      // Sort newest first
      posts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      return res.json({
        success: true,
        count: posts.length,
        posts
      });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get single post by ID
// @route   GET /api/posts/:id
// @access  Public
const getPostById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (getIsConnected()) {
      const post = await Post.findById(id)
        .populate('author', 'name username avatar bio')
        .populate('comments.user', 'name username avatar');

      if (!post) {
        return res.status(404).json({
          success: false,
          message: 'Post not found'
        });
      }

      return res.json({
        success: true,
        post
      });
    } else {
      const post = mockStore.findPostById(id);
      if (!post) {
        return res.status(404).json({
          success: false,
          message: 'Post not found'
        });
      }

      return res.json({
        success: true,
        post
      });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new post
// @route   POST /api/posts
// @access  Private
const createPost = async (req, res, next) => {
  try {
    const { content, category, tags, image } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Post content cannot be empty'
      });
    }

    // Extract hashtags automatically if not provided
    let finalTags = Array.isArray(tags) ? tags : [];
    if (finalTags.length === 0) {
      const hashtagMatches = content.match(/#[a-z0-9_]+/gi);
      if (hashtagMatches) {
        finalTags = hashtagMatches.map((t) => t.substring(1).toLowerCase());
      }
    }

    // Check for uploaded image file via multer
    let finalImage = image || '';
    if (req.file) {
      finalImage = `/uploads/${req.file.filename}`;
    }

    if (getIsConnected()) {
      const newPost = await Post.create({
        author: req.user._id,
        content: content.trim(),
        category: category || 'General',
        tags: finalTags,
        image: finalImage,
        likes: [],
        comments: []
      });

      const populated = await Post.findById(newPost._id).populate(
        'author',
        'name username avatar'
      );

      return res.status(201).json({
        success: true,
        message: 'Post published successfully!',
        post: populated
      });
    } else {
      const authorObj = {
        _id: req.user._id,
        name: req.user.name,
        username: req.user.username,
        avatar: req.user.avatar,
        bio: req.user.bio
      };

      const newPost = {
        _id: 'post_' + Date.now(),
        author: authorObj,
        content: content.trim(),
        category: category || 'General',
        tags: finalTags,
        image: finalImage,
        likes: [],
        comments: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      mockStore.addPost(newPost);

      return res.status(201).json({
        success: true,
        message: 'Post published successfully!',
        post: newPost
      });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Update / Edit own post
// @route   PUT /api/posts/:id
// @access  Private
const updatePost = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { content, category, tags, image } = req.body;
    const currentUserId = req.user._id.toString();

    if (getIsConnected()) {
      const post = await Post.findById(id);

      if (!post) {
        return res.status(404).json({
          success: false,
          message: 'Post not found'
        });
      }

      if (post.author.toString() !== currentUserId) {
        return res.status(403).json({
          success: false,
          message: 'Unauthorized: You can only edit your own posts'
        });
      }

      if (content !== undefined) post.content = content.trim();
      if (category !== undefined) post.category = category;
      if (tags !== undefined) post.tags = Array.isArray(tags) ? tags : [];
      if (image !== undefined) post.image = image;

      const updated = await post.save();
      const populated = await Post.findById(updated._id).populate(
        'author',
        'name username avatar'
      );

      return res.json({
        success: true,
        message: 'Post updated successfully',
        post: populated
      });
    } else {
      const post = mockStore.findPostById(id);

      if (!post) {
        return res.status(404).json({
          success: false,
          message: 'Post not found'
        });
      }

      const authorId = (post.author._id || post.author).toString();
      if (authorId !== currentUserId) {
        return res.status(403).json({
          success: false,
          message: 'Unauthorized: You can only edit your own posts'
        });
      }

      const updates = {};
      if (content !== undefined) updates.content = content.trim();
      if (category !== undefined) updates.category = category;
      if (tags !== undefined) updates.tags = Array.isArray(tags) ? tags : [];
      if (image !== undefined) updates.image = image;

      const updated = mockStore.updatePost(id, updates);

      return res.json({
        success: true,
        message: 'Post updated successfully',
        post: updated
      });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Delete own post
// @route   DELETE /api/posts/:id
// @access  Private
const deletePost = async (req, res, next) => {
  try {
    const { id } = req.params;
    const currentUserId = req.user._id.toString();

    if (getIsConnected()) {
      const post = await Post.findById(id);

      if (!post) {
        return res.status(404).json({
          success: false,
          message: 'Post not found'
        });
      }

      if (post.author.toString() !== currentUserId) {
        return res.status(403).json({
          success: false,
          message: 'Unauthorized: You can only delete your own posts'
        });
      }

      await post.deleteOne();

      return res.json({
        success: true,
        message: 'Post deleted successfully',
        id
      });
    } else {
      const post = mockStore.findPostById(id);

      if (!post) {
        return res.status(404).json({
          success: false,
          message: 'Post not found'
        });
      }

      const authorId = (post.author._id || post.author).toString();
      if (authorId !== currentUserId) {
        return res.status(403).json({
          success: false,
          message: 'Unauthorized: You can only delete your own posts'
        });
      }

      mockStore.deletePost(id);

      return res.json({
        success: true,
        message: 'Post deleted successfully',
        id
      });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Like or Unlike a post
// @route   PUT /api/posts/:id/like
// @access  Private
const toggleLikePost = async (req, res, next) => {
  try {
    const { id } = req.params;
    const currentUserId = req.user._id.toString();

    if (getIsConnected()) {
      const post = await Post.findById(id);

      if (!post) {
        return res.status(404).json({
          success: false,
          message: 'Post not found'
        });
      }

      const isLiked = post.likes.some((uId) => uId.toString() === currentUserId);

      if (isLiked) {
        post.likes = post.likes.filter((uId) => uId.toString() !== currentUserId);
      } else {
        post.likes.push(currentUserId);
      }

      await post.save();

      return res.json({
        success: true,
        liked: !isLiked,
        likesCount: post.likes.length,
        likes: post.likes
      });
    } else {
      const post = mockStore.findPostById(id);

      if (!post) {
        return res.status(404).json({
          success: false,
          message: 'Post not found'
        });
      }

      const isLiked = post.likes.some((uId) => uId.toString() === currentUserId);

      if (isLiked) {
        post.likes = post.likes.filter((uId) => uId.toString() !== currentUserId);
      } else {
        post.likes.push(currentUserId);
      }

      return res.json({
        success: true,
        liked: !isLiked,
        likesCount: post.likes.length,
        likes: post.likes
      });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Add comment to post
// @route   POST /api/posts/:id/comments
// @access  Private
const addComment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { text } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Comment text cannot be empty'
      });
    }

    if (getIsConnected()) {
      const post = await Post.findById(id);

      if (!post) {
        return res.status(404).json({
          success: false,
          message: 'Post not found'
        });
      }

      const newComment = {
        user: req.user._id,
        text: text.trim(),
        createdAt: new Date()
      };

      post.comments.push(newComment);
      await post.save();

      const updated = await Post.findById(id)
        .populate('author', 'name username avatar')
        .populate('comments.user', 'name username avatar');

      return res.status(201).json({
        success: true,
        message: 'Comment added',
        comments: updated.comments
      });
    } else {
      const post = mockStore.findPostById(id);

      if (!post) {
        return res.status(404).json({
          success: false,
          message: 'Post not found'
        });
      }

      const newComment = {
        _id: 'comm_' + Date.now(),
        user: {
          _id: req.user._id,
          name: req.user.name,
          username: req.user.username,
          avatar: req.user.avatar
        },
        text: text.trim(),
        createdAt: new Date().toISOString()
      };

      if (!post.comments) post.comments = [];
      post.comments.push(newComment);

      return res.status(201).json({
        success: true,
        message: 'Comment added',
        comments: post.comments
      });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Delete comment from post
// @route   DELETE /api/posts/:id/comments/:commentId
// @access  Private
const deleteComment = async (req, res, next) => {
  try {
    const { id, commentId } = req.params;
    const currentUserId = req.user._id.toString();

    if (getIsConnected()) {
      const post = await Post.findById(id);

      if (!post) {
        return res.status(404).json({
          success: false,
          message: 'Post not found'
        });
      }

      const comment = post.comments.id(commentId);
      if (!comment) {
        return res.status(404).json({
          success: false,
          message: 'Comment not found'
        });
      }

      // Check authorization (comment author OR post author)
      if (
        comment.user.toString() !== currentUserId &&
        post.author.toString() !== currentUserId
      ) {
        return res.status(403).json({
          success: false,
          message: 'Unauthorized: Cannot delete this comment'
        });
      }

      post.comments.pull(commentId);
      await post.save();

      return res.json({
        success: true,
        message: 'Comment removed successfully',
        commentId
      });
    } else {
      const post = mockStore.findPostById(id);

      if (!post) {
        return res.status(404).json({
          success: false,
          message: 'Post not found'
        });
      }

      const comment = (post.comments || []).find(
        (c) => c._id.toString() === commentId
      );

      if (!comment) {
        return res.status(404).json({
          success: false,
          message: 'Comment not found'
        });
      }

      const commentUserId = (comment.user._id || comment.user).toString();
      const postAuthorId = (post.author._id || post.author).toString();

      if (commentUserId !== currentUserId && postAuthorId !== currentUserId) {
        return res.status(403).json({
          success: false,
          message: 'Unauthorized: Cannot delete this comment'
        });
      }

      post.comments = post.comments.filter((c) => c._id.toString() !== commentId);

      return res.json({
        success: true,
        message: 'Comment removed successfully',
        commentId
      });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  toggleLikePost,
  addComment,
  deleteComment
};
