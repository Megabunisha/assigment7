const express = require('express');
const router = express.Router();
const {
  getAllPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  toggleLikePost,
  addComment,
  deleteComment
} = require('../controllers/postController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// Optional auth for getAllPosts so we know who is requesting (for following feed / likes)
const optionalAuth = async (req, res, next) => {
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    return protect(req, res, next);
  }
  next();
};

router
  .route('/')
  .get(optionalAuth, getAllPosts)
  .post(protect, upload.single('imageFile'), createPost);

router
  .route('/:id')
  .get(getPostById)
  .put(protect, updatePost)
  .delete(protect, deletePost);

router.route('/:id/like').put(protect, toggleLikePost);

router.route('/:id/comments').post(protect, addComment);

router.route('/:id/comments/:commentId').delete(protect, deleteComment);

module.exports = router;
