import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { ProfileHeader } from '../components/profile/ProfileHeader';
import { EditProfileModal } from '../components/profile/EditProfileModal';
import { PostCard } from '../components/posts/PostCard';
import { userService } from '../services/userService';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export const ProfilePage = () => {
  const { username } = useParams();
  const { user: currentUser } = useAuth();
  const { showToast } = useToast();

  const [profileData, setProfileData] = useState(null);
  const [posts, setPosts] = useState([]);
  const [stats, setStats] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('posts'); // 'posts' or 'likes'
  const [isLoading, setIsLoading] = useState(true);

  const fetchProfile = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await userService.getUserProfile(username);
      if (data && data.user) {
        setProfileData(data.user);
        setPosts(data.posts || []);
        setStats(data.stats || {});

        if (currentUser && data.user.followers) {
          const isFoll = data.user.followers.some(
            (id) => (id._id || id).toString() === currentUser._id.toString()
          );
          setIsFollowing(isFoll);
        }
      }
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setIsLoading(false);
    }
  }, [username, currentUser, showToast]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const handleFollowToggle = async () => {
    if (!profileData) return;
    try {
      const res = await userService.followUnfollowUser(profileData._id);
      setIsFollowing(res.isFollowing);
      setStats((prev) => ({
        ...prev,
        followersCount: res.followersCount
      }));
      showToast(res.message, 'success');
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  if (isLoading) {
    return (
      <div style={{ textAlign: 'center', padding: '5rem 1rem', color: 'var(--text-muted)' }}>
        <div style={{ fontSize: '2.5rem', animation: 'spin 1.5s infinite linear' }}>⚡</div>
        <p style={{ marginTop: '1rem', fontSize: '1rem' }}>Loading creator profile...</p>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="profile-container" style={{ textAlign: 'center', padding: '4rem 1rem' }}>
        <h2>User Not Found</h2>
        <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>
          The user @{username} doesn't exist or has changed their handle.
        </p>
      </div>
    );
  }

  return (
    <div className="profile-container">
      {/* Profile Header */}
      <ProfileHeader
        profileUser={profileData}
        stats={stats}
        isFollowing={isFollowing}
        onFollowToggle={handleFollowToggle}
        onOpenEditModal={() => setIsEditModalOpen(true)}
      />

      {/* Profile Feed Tabs */}
      <div className="feed-tabs">
        <button
          className={`feed-tab ${activeTab === 'posts' ? 'active' : ''}`}
          onClick={() => setActiveTab('posts')}
        >
          📝 Posts ({posts.length})
        </button>
      </div>

      {/* User Posts Stream */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {posts.length === 0 ? (
          <div
            className="create-post-card"
            style={{ textAlign: 'center', padding: '3rem 1.5rem', color: 'var(--text-muted)' }}
          >
            <span style={{ fontSize: '2.5rem' }}>✍️</span>
            <h3 style={{ marginTop: '0.75rem', color: 'var(--text-primary)' }}>No posts published yet</h3>
            <p style={{ fontSize: '0.9rem', marginTop: '0.25rem' }}>
              @{profileData.username} hasn't posted anything to their feed.
            </p>
          </div>
        ) : (
          posts.map((post) => (
            <PostCard
              key={post._id}
              post={post}
              onPostDeleted={(id) => setPosts((prev) => prev.filter((p) => p._id !== id))}
              onPostUpdated={(updated) =>
                setPosts((prev) => prev.map((p) => (p._id === updated._id ? updated : p)))
              }
            />
          ))
        )}
      </div>

      {/* Edit Profile Modal */}
      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onProfileUpdated={(updated) => {
          setProfileData(updated);
        }}
      />
    </div>
  );
};
