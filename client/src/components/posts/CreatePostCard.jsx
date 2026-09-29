import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { postService } from '../../services/postService';

export const CreatePostCard = ({ onPostCreated }) => {
  const { user, isAuthenticated } = useAuth();
  const { showToast } = useToast();

  const [content, setContent] = useState('');
  const [category, setCategory] = useState('General');
  const [image, setImage] = useState('');
  const [showImageInput, setShowImageInput] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const sampleImages = [
    'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=80'
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      showToast('Please login to share a post!', 'info');
      return;
    }

    if (!content.trim()) {
      showToast('Please write something in your post!', 'warning');
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await postService.createPost({
        content: content.trim(),
        category,
        image: image.trim()
      });

      if (res && res.post) {
        showToast('Post published to feed!', 'success');
        setContent('');
        setImage('');
        setShowImageInput(false);
        if (onPostCreated) {
          onPostCreated(res.post);
        }
      }
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="create-post-card" style={{ textAlign: 'center', padding: '1.75rem' }}>
        <h3 style={{ fontSize: '1.1rem', marginBottom: '0.35rem' }}>Join the Conversation</h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1rem' }}>
          Log in or create an account to share your thoughts, projects, and connect with other developers.
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem' }}>
          <a href="/login" className="nav-btn nav-btn-primary">
            Login Now
          </a>
          <a href="/register" className="nav-btn">
            Create Free Account
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="create-post-card" id="create-post-box">
      <div className="create-post-header">
        <img
          src={user?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=user'}
          alt={user?.name}
          className="create-post-avatar"
        />
        <textarea
          id="post-content-textarea"
          className="create-post-textarea"
          placeholder={`What's on your mind, ${user?.name?.split(' ')[0] || 'friend'}? Use #hashtags to tag topics...`}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          maxLength={1000}
        />
      </div>

      {/* Image Preview */}
      {image && (
        <div className="create-post-image-preview">
          <img src={image} alt="Post preview" />
          <button
            type="button"
            className="remove-image-btn"
            onClick={() => setImage('')}
            title="Remove image"
          >
            &times;
          </button>
        </div>
      )}

      {/* Image URL input & quick presets */}
      {showImageInput && !image && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', background: 'var(--bg-surface-solid)', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
          <input
            type="url"
            placeholder="Paste image URL (https://...)"
            value={image}
            onChange={(e) => setImage(e.target.value)}
            style={{ padding: '0.5rem 0.75rem', fontSize: '0.85rem' }}
          />
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Or choose preset photo:</span>
            {sampleImages.map((src, i) => (
              <img
                key={i}
                src={src}
                alt="sample"
                style={{ width: '32px', height: '32px', borderRadius: 'var(--radius-sm)', objectFit: 'cover', cursor: 'pointer', border: '1px solid var(--border-card)' }}
                onClick={() => setImage(src)}
              />
            ))}
          </div>
        </div>
      )}

      <div className="create-post-footer">
        <div className="create-post-options">
          {/* Add Image Toggle */}
          <button
            type="button"
            className="option-btn"
            onClick={() => setShowImageInput((prev) => !prev)}
            title="Attach Image"
          >
            <span>🖼️</span>
            <span>Image</span>
          </button>

          {/* Category Dropdown */}
          <select
            id="post-category-select"
            className="category-select"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="General">🏷️ General</option>
            <option value="Tech">💻 Tech</option>
            <option value="Design">🎨 Design</option>
            <option value="Coding">⚡ Coding</option>
            <option value="Life">🌱 Life</option>
            <option value="Announcements">📢 Announcements</option>
          </select>

          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginLeft: '0.25rem' }}>
            {1000 - content.length}
          </span>
        </div>

        <button
          id="post-submit-btn"
          type="button"
          className="submit-post-btn"
          onClick={handleSubmit}
          disabled={!content.trim() || isSubmitting}
        >
          {isSubmitting ? 'Posting...' : 'Post 🚀'}
        </button>
      </div>
    </div>
  );
};
