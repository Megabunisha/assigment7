import React, { useState } from 'react';
import { useToast } from '../../context/ToastContext';
import { postService } from '../../services/postService';

export const EditPostModal = ({ isOpen, post, onClose, onPostUpdated }) => {
  if (!isOpen || !post) return null;

  const { showToast } = useToast();
  const [content, setContent] = useState(post.content || '');
  const [category, setCategory] = useState(post.category || 'General');
  const [tags, setTags] = useState(post.tags ? post.tags.join(', ') : '');
  const [image, setImage] = useState(post.image || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) {
      showToast('Post content cannot be empty', 'warning');
      return;
    }

    try {
      setIsSubmitting(true);
      const parsedTags = tags
        .split(',')
        .map((t) => t.trim().replace(/^#/, ''))
        .filter(Boolean);

      const res = await postService.updatePost(post._id, {
        content: content.trim(),
        category,
        tags: parsedTags,
        image: image.trim()
      });

      if (res && res.post) {
        showToast('Post updated successfully!', 'success');
        if (onPostUpdated) {
          onPostUpdated(res.post);
        }
        onClose();
      }
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">Edit Post</h3>
          <button className="modal-close-btn" onClick={onClose}>
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="form-group">
            <label className="form-label">Post Content</label>
            <textarea
              className="form-input"
              rows={4}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Category</label>
              <select
                className="form-input"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="General">General</option>
                <option value="Tech">Tech</option>
                <option value="Design">Design</option>
                <option value="Coding">Coding</option>
                <option value="Life">Life</option>
                <option value="Announcements">Announcements</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Tags (comma separated)</label>
              <input
                type="text"
                className="form-input"
                placeholder="react, fullstack, webdev"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Image URL (Optional)</label>
            <input
              type="url"
              className="form-input"
              placeholder="https://images.unsplash.com/..."
              value={image}
              onChange={(e) => setImage(e.target.value)}
            />
          </div>

          <div className="modal-footer">
            <button type="button" className="nav-btn" onClick={onClose}>
              Cancel
            </button>
            <button
              type="submit"
              className="nav-btn nav-btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
