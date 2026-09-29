import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { postService } from '../../services/postService';
import { CommentList } from '../comments/CommentList';
import { EditPostModal } from './EditPostModal';
import { ConfirmModal } from '../common/ConfirmModal';

export const PostCard = ({ post, onPostDeleted, onPostUpdated, onTagClick }) => {
  const { user, isAuthenticated } = useAuth();
  const { showToast } = useToast();

  const [currentPost, setCurrentPost] = useState(post);
  const [isLiked, setIsLiked] = useState(() => {
    if (!user || !post.likes) return false;
    return post.likes.some((id) => (id._id || id).toString() === user._id.toString());
  });
  const [likesCount, setLikesCount] = useState(post.likes ? post.likes.length : 0);
  const [showComments, setShowComments] = useState(false);
  const [commentsCount, setCommentsCount] = useState(
    post.comments ? post.comments.length : 0
  );

  const [showMenu, setShowMenu] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isLiking, setIsLiking] = useState(false);

  const author = currentPost.author || {};
  const isAuthor =
    user && (user._id === (author._id || author) || user.username === author.username);

  // Format relative timestamp
  const formatTime = (dateString) => {
    if (!dateString) return 'Recent';
    const date = new Date(dateString);
    const diff = (Date.now() - date.getTime()) / 1000;
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  // Toggle Like / Unlike
  const handleLikeToggle = async () => {
    if (!isAuthenticated) {
      showToast('Please login to like posts!', 'info');
      return;
    }

    if (isLiking) return;

    // Optimistic UI update
    const previousLiked = isLiked;
    const previousCount = likesCount;

    setIsLiked(!previousLiked);
    setLikesCount(previousLiked ? previousCount - 1 : previousCount + 1);
    setIsLiking(true);

    try {
      const res = await postService.toggleLike(currentPost._id);
      setIsLiked(res.liked);
      setLikesCount(res.likesCount);
    } catch (err) {
      // Revert if error
      setIsLiked(previousLiked);
      setLikesCount(previousCount);
      showToast(err.message, 'error');
    } finally {
      setIsLiking(false);
    }
  };

  // Handle Delete Post
  const handleConfirmDelete = async () => {
    try {
      await postService.deletePost(currentPost._id);
      showToast('Post deleted successfully', 'info');
      setShowDeleteModal(false);
      if (onPostDeleted) {
        onPostDeleted(currentPost._id);
      }
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  // Copy share link
  const handleShare = () => {
    const url = window.location.origin + `/posts/${currentPost._id}`;
    navigator.clipboard.writeText(url);
    showToast('Post link copied to clipboard! 📋', 'success');
  };

  return (
    <article className="post-card" id={`post-${currentPost._id}`}>
      {/* Header: Author & Options */}
      <div className="post-header">
        <div className="post-author-info">
          <Link to={`/profile/${author.username || 'user'}`}>
            <img
              src={author.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=user'}
              alt={author.name || 'User'}
              className="post-avatar"
            />
          </Link>
          <div>
            <div className="post-author-name">
              <Link to={`/profile/${author.username || 'user'}`} style={{ color: 'inherit' }}>
                {author.name || 'User'}
              </Link>
              <span className="verified-badge" title="Verified Creator">✓</span>
            </div>
            <div className="post-meta">
              <span>@{author.username || 'user'}</span>
              <span>•</span>
              <time dateTime={currentPost.createdAt}>{formatTime(currentPost.createdAt)}</time>
              <span>•</span>
              <span className="category-tag">{currentPost.category || 'General'}</span>
            </div>
          </div>
        </div>

        {/* Post Options Menu (for post author) */}
        {isAuthor && (
          <div className="post-actions-menu">
            <button
              type="button"
              className="btn-post-menu"
              onClick={() => setShowMenu((prev) => !prev)}
              aria-label="Post options"
            >
              •••
            </button>
            {showMenu && (
              <div className="post-menu-dropdown">
                <button
                  type="button"
                  onClick={() => {
                    setShowMenu(false);
                    setShowEditModal(true);
                  }}
                >
                  ✏️ Edit Post
                </button>
                <button
                  type="button"
                  className="delete-btn"
                  onClick={() => {
                    setShowMenu(false);
                    setShowDeleteModal(true);
                  }}
                >
                  🗑️ Delete Post
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Post Text Content */}
      <div className="post-content">
        {currentPost.content}

        {/* Hashtags */}
        {currentPost.tags && currentPost.tags.length > 0 && (
          <div className="post-tags">
            {currentPost.tags.map((tag, i) => (
              <span
                key={i}
                className="tag-item"
                onClick={() => onTagClick && onTagClick(tag)}
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Post Attached Image */}
      {currentPost.image && (
        <div className="post-image-container">
          <img
            src={currentPost.image}
            alt="Post media"
            loading="lazy"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
        </div>
      )}

      {/* Footer: Interactions */}
      <div className="post-footer">
        <div className="post-interaction-group">
          {/* Like Button */}
          <button
            type="button"
            className={`interaction-btn ${isLiked ? 'liked' : ''}`}
            onClick={handleLikeToggle}
            title={isLiked ? 'Unlike' : 'Like'}
          >
            <span className="heart-pop">{isLiked ? '❤️' : '🤍'}</span>
            <span>{likesCount}</span>
          </button>

          {/* Comment Button */}
          <button
            type="button"
            className="interaction-btn"
            onClick={() => setShowComments((prev) => !prev)}
            title="Comments"
          >
            <span>💬</span>
            <span>{commentsCount}</span>
          </button>

          {/* Share Button */}
          <button
            type="button"
            className="interaction-btn"
            onClick={handleShare}
            title="Share Post"
          >
            <span>🔗</span>
            <span>Share</span>
          </button>
        </div>
      </div>

      {/* Expandable Comments Drawer */}
      {showComments && (
        <CommentList
          postId={currentPost._id}
          postAuthorId={author._id || author}
          initialComments={currentPost.comments || []}
          onCommentsUpdated={(updatedComments) => {
            setCommentsCount(updatedComments.length);
            setCurrentPost((prev) => ({ ...prev, comments: updatedComments }));
          }}
        />
      )}

      {/* Edit Modal */}
      <EditPostModal
        isOpen={showEditModal}
        post={currentPost}
        onClose={() => setShowEditModal(false)}
        onPostUpdated={(updated) => {
          setCurrentPost(updated);
          if (onPostUpdated) onPostUpdated(updated);
        }}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={showDeleteModal}
        title="Delete Post"
        message="Are you sure you want to permanently remove this post? This action cannot be undone."
        onConfirm={handleConfirmDelete}
        onCancel={() => setShowDeleteModal(false)}
        confirmText="Yes, Delete Post"
      />
    </article>
  );
};
