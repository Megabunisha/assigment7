import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { userService } from '../../services/userService';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export const SidebarRight = ({ onSelectTag }) => {
  const { user, isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const [suggestedUsers, setSuggestedUsers] = useState([]);
  const [followingMap, setFollowingMap] = useState({});

  useEffect(() => {
    const fetchSuggested = async () => {
      try {
        const data = await userService.getSuggestedUsers();
        if (data && data.users) {
          setSuggestedUsers(data.users);
          // Set initial following status if user is logged in
          if (user && user.following) {
            const map = {};
            user.following.forEach((id) => {
              map[id.toString()] = true;
            });
            setFollowingMap(map);
          }
        }
      } catch (err) {
        console.error('Failed to fetch suggested users:', err.message);
      }
    };

    fetchSuggested();
  }, [user]);

  const handleFollowToggle = async (targetId, username) => {
    if (!isAuthenticated) {
      showToast('Please login to follow creators!', 'info');
      return;
    }

    try {
      const res = await userService.followUnfollowUser(targetId);
      setFollowingMap((prev) => ({
        ...prev,
        [targetId]: res.isFollowing
      }));
      showToast(res.message, 'success');
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const trendingTopics = [
    { tag: 'fullstack', category: 'Web Development', count: '1.2k posts' },
    { tag: 'reactjs', category: 'Frontend', count: '890 posts' },
    { tag: 'mongodb', category: 'Database', count: '640 posts' },
    { tag: 'nodejs', category: 'Backend', count: '520 posts' },
    { tag: 'uiux', category: 'Design', count: '410 posts' }
  ];

  return (
    <aside className="sidebar-right">
      {/* Suggested Users */}
      <div className="sidebar-card">
        <div className="sidebar-card-title">
          <span>Who to Follow</span>
          <span style={{ fontSize: '0.8rem', color: 'var(--primary-400)', fontWeight: '600' }}>
            Creators
          </span>
        </div>

        <div className="user-suggest-list">
          {suggestedUsers.length === 0 ? (
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              No other creators found.
            </div>
          ) : (
            suggestedUsers.map((creator) => {
              const isFollowing = !!followingMap[creator._id];
              return (
                <div key={creator._id} className="user-suggest-item">
                  <Link to={`/profile/${creator.username}`}>
                    <img
                      src={creator.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=user'}
                      alt={creator.name}
                      className="user-suggest-avatar"
                    />
                  </Link>
                  <div className="user-suggest-info">
                    <Link to={`/profile/${creator.username}`} className="user-suggest-name">
                      {creator.name}
                    </Link>
                    <div className="user-suggest-handle">@{creator.username}</div>
                  </div>
                  {user && user._id === creator._id ? null : (
                    <button
                      className={`btn-follow ${isFollowing ? 'btn-following' : ''}`}
                      onClick={() => handleFollowToggle(creator._id, creator.username)}
                    >
                      {isFollowing ? 'Following' : 'Follow'}
                    </button>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Trending Topics */}
      <div className="sidebar-card">
        <div className="sidebar-card-title">
          <span>Trending Hashtags</span>
          <span style={{ fontSize: '1rem' }}>🔥</span>
        </div>

        <div className="trending-list">
          {trendingTopics.map((topic) => (
            <div
              key={topic.tag}
              className="trending-item"
              onClick={() => onSelectTag && onSelectTag(topic.tag)}
            >
              <span className="trending-category">{topic.category}</span>
              <span className="trending-tag">#{topic.tag}</span>
              <span className="trending-count">{topic.count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Academic Minor Project Summary Badge */}
      <div
        className="sidebar-card"
        style={{
          background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.08) 0%, rgba(236, 72, 153, 0.08) 100%)',
          border: '1px solid var(--border-active)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span style={{ fontSize: '1.2rem' }}>🎓</span>
          <strong style={{ fontSize: '0.9rem' }}>Week 07 Minor Project</strong>
        </div>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
          Full Stack Social Media App built with React, Node.js, Express, MongoDB & JWT Authentication.
        </p>
      </div>
    </aside>
  );
};
