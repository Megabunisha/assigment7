import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { postService } from '../../services/postService';

export const CommentList = ({ postId, postAuthorId, initialComments = [], onCommentsUpdated }) => {
  const { user, isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const [comments, setComments] = useState(initialComments);
  const [commentText, setCommentText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formatCommentDate = (dateString) => {
    if (!dateString) return 'Just now';
    const date = new Date(dateString);
    const diff = (Date.now() - date.getTime()) / 1000;
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      showToast('Please login to comment!', 'info');
      return;
    }

    if (!commentText.trim()) return;

    try {
      setIsSubmitting(true);
      const res = await postService.addComment(postId, commentText.trim());
      if (res && res.comments) {
        setComments(res.comments);
        setCommentText('');
        if (onCommentsUpdated) {
          onCommentsUpdated(res.comments);
        }
      }
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await postService.deleteComment(postId, commentId);
      const updated = comments.filter((c) => c._id !== commentId);
      setComments(updated);
      showToast('Comment deleted', 'info');
      if (onCommentsUpdated) {
        onCommentsUpdated(updated);
      }
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  return (
    <div className="comments-container">
      {/* Add Comment Input Form */}
      {isAuthenticated && (
        <form onSubmit={handleAddComment} className="comment-input-form">
          <img
            src={user?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=user'}
            alt={user?.name}
            className="comment-input-avatar"
          />
          <div className="comment-input-wrapper">
            <input
              type="text"
              placeholder="Write a constructive comment..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              disabled={isSubmitting}
            />
            <button
              type="submit"
              className="btn-send-comment"
              disabled={!commentText.trim() || isSubmitting}
              title="Post comment"
            >
              ➤
            </button>
          </div>
        </form>
      )}

      {/* Comments List */}
      <div className="comments-list">
        {comments.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '0.75rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            No comments yet. Start the conversation!
          </div>
        ) : (
          comments.map((comm) => {
            const author = comm.user || {};
            const isOwner =
              user &&
              (user._id === (author._id || author) ||
                user._id === postAuthorId);

            return (
              <div key={comm._id} className="comment-card">
                <img
                  src={author.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=commenter'}
                  alt={author.name || 'User'}
                  className="comment-avatar"
                />
                <div className="comment-bubble">
                  <div className="comment-header">
                    <span className="comment-author">{author.name || author.username || 'User'}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                      <span className="comment-time">{formatCommentDate(comm.createdAt)}</span>
                      {isOwner && (
                        <button
                          type="button"
                          className="comment-delete-btn"
                          onClick={() => handleDeleteComment(comm._id)}
                          title="Delete comment"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  </div>
                  <p className="comment-text">{comm.text}</p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
