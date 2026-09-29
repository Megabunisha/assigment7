import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { userService } from '../../services/userService';

export const ProfileHeader = ({ profileUser, stats, isFollowing, onFollowToggle, onOpenEditModal }) => {
  const { user: currentUser, isAuthenticated } = useAuth();
  const { showToast } = useToast();

  const isOwnProfile =
    currentUser &&
    (currentUser._id === profileUser._id ||
      currentUser.username === profileUser.username);

  const handleFollowClick = async () => {
    if (!isAuthenticated) {
      showToast('Please login to follow this creator!', 'info');
      return;
    }
    if (onFollowToggle) {
      onFollowToggle();
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Member';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  return (
    <div className="profile-card">
      {/* Cover Banner */}
      <div
        className="profile-cover"
        style={{
          backgroundImage: `url(${profileUser.coverImage || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80'})`
        }}
      />

      <div className="profile-header-content">
        <div className="profile-avatar-row">
          <img
            src={profileUser.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=user'}
            alt={profileUser.name}
            className="profile-avatar-large"
          />

          <div className="profile-actions">
            {isOwnProfile ? (
              <button
                id="edit-profile-btn"
                className="nav-btn"
                onClick={onOpenEditModal}
              >
                ✏️ Edit Profile
              </button>
            ) : (
              <button
                className={`btn-follow ${isFollowing ? 'btn-following' : ''}`}
                style={{ padding: '0.6rem 1.4rem', fontSize: '0.9rem' }}
                onClick={handleFollowClick}
              >
                {isFollowing ? '✓ Following' : '+ Follow'}
              </button>
            )}
          </div>
        </div>

        {/* Profile Info */}
        <div className="profile-info">
          <div>
            <h1 className="profile-name">{profileUser.name}</h1>
            <div className="profile-username">@{profileUser.username}</div>
          </div>

          <p className="profile-bio">
            {profileUser.bio || 'Full stack enthusiast and developer.'}
          </p>

          <div className="profile-metadata">
            {profileUser.location && (
              <div className="profile-meta-item">
                <span>📍</span>
                <span>{profileUser.location}</span>
              </div>
            )}

            {profileUser.website && (
              <div className="profile-meta-item">
                <span>🔗</span>
                <a
                  href={profileUser.website.startsWith('http') ? profileUser.website : `https://${profileUser.website}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: 'var(--primary-400)' }}
                >
                  {profileUser.website.replace(/^https?:\/\//, '')}
                </a>
              </div>
            )}

            <div className="profile-meta-item">
              <span>📅</span>
              <span>Joined {formatDate(profileUser.createdAt)}</span>
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="profile-stats-row">
          <div className="profile-stat-box">
            <span className="stat-value">{stats?.postsCount || 0}</span>
            <span className="stat-label">Posts</span>
          </div>

          <div className="profile-stat-box">
            <span className="stat-value">{stats?.followersCount || 0}</span>
            <span className="stat-label">Followers</span>
          </div>

          <div className="profile-stat-box">
            <span className="stat-value">{stats?.followingCount || 0}</span>
            <span className="stat-label">Following</span>
          </div>
        </div>
      </div>
    </div>
  );
};
