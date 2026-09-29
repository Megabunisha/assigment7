import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { userService } from '../../services/userService';

export const EditProfileModal = ({ isOpen, onClose, onProfileUpdated }) => {
  if (!isOpen) return null;

  const { user, updateUserData } = useAuth();
  const { showToast } = useToast();

  const [name, setName] = useState(user?.name || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [location, setLocation] = useState(user?.location || '');
  const [website, setWebsite] = useState(user?.website || '');
  const [avatar, setAvatar] = useState(user?.avatar || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const avatarPresets = [
    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80'
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      showToast('Name cannot be empty', 'warning');
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await userService.updateProfile({
        name: name.trim(),
        bio: bio.trim(),
        location: location.trim(),
        website: website.trim(),
        avatar
      });

      if (res && res.user) {
        updateUserData(res.user);
        showToast('Profile updated successfully!', 'success');
        if (onProfileUpdated) {
          onProfileUpdated(res.user);
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
          <h3 className="modal-title">Edit Profile</h3>
          <button className="modal-close-btn" onClick={onClose}>
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Avatar Selector */}
          <div className="form-group">
            <label className="form-label">Profile Avatar</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
              <img
                src={avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=user'}
                alt="Selected avatar"
                style={{ width: '56px', height: '56px', borderRadius: 'var(--radius-full)', objectFit: 'cover', border: '2px solid var(--primary-500)' }}
              />
              <input
                type="url"
                className="form-input"
                placeholder="Or paste custom image URL..."
                value={avatar}
                onChange={(e) => setAvatar(e.target.value)}
                style={{ flex: 1 }}
              />
            </div>

            <div className="avatar-presets-grid">
              {avatarPresets.map((preset, index) => (
                <img
                  key={index}
                  src={preset}
                  alt={`preset-${index}`}
                  className={`avatar-preset-item ${avatar === preset ? 'selected' : ''}`}
                  onClick={() => setAvatar(preset)}
                />
              ))}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input
              type="text"
              className="form-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <label className="form-label">Bio</label>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                {200 - bio.length} chars left
              </span>
            </div>
            <textarea
              className="form-input"
              rows={3}
              maxLength={200}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Location</label>
              <input
                type="text"
                className="form-input"
                placeholder="City, Country"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Website</label>
              <input
                type="text"
                className="form-input"
                placeholder="github.com/yourhandle"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="nav-btn" onClick={onClose}>
              Cancel
            </button>
            <button
              id="save-profile-btn"
              type="submit"
              className="nav-btn nav-btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving...' : 'Save Profile'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
