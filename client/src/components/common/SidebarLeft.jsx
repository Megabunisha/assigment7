import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export const SidebarLeft = ({ onOpenCreatePost }) => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <aside className="sidebar-left">
      <nav className="sidebar-nav-card">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `sidebar-nav-item ${isActive ? 'active' : ''}`
          }
          end
        >
          <span style={{ fontSize: '1.2rem' }}>🏠</span>
          <span>Feed</span>
        </NavLink>

        <NavLink
          to="/explore"
          className={({ isActive }) =>
            `sidebar-nav-item ${isActive ? 'active' : ''}`
          }
        >
          <span style={{ fontSize: '1.2rem' }}>🧭</span>
          <span>Explore</span>
        </NavLink>

        {isAuthenticated && (
          <NavLink
            to={`/profile/${user.username}`}
            className={({ isActive }) =>
              `sidebar-nav-item ${isActive ? 'active' : ''}`
            }
          >
            <span style={{ fontSize: '1.2rem' }}>👤</span>
            <span>Profile</span>
          </NavLink>
        )}

        {isAuthenticated && (
          <button
            id="sidebar-create-post-btn"
            className="nav-btn nav-btn-primary"
            style={{ width: '100%', marginTop: '0.75rem', justifyContent: 'center' }}
            onClick={onOpenCreatePost}
          >
            <span>✨</span>
            <span>Create Post</span>
          </button>
        )}
      </nav>

      {/* User Mini Profile Box */}
      {isAuthenticated && (
        <div className="sidebar-user-mini">
          <img
            src={user.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=user'}
            alt={user.name}
            className="sidebar-user-avatar"
          />
          <div className="sidebar-user-details">
            <div className="sidebar-user-name">{user.name}</div>
            <div className="sidebar-user-handle">@{user.username}</div>
          </div>
          <button
            id="sidebar-logout-btn"
            className="sidebar-logout-btn"
            onClick={() => {
              logout();
              navigate('/login');
            }}
            title="Logout"
            aria-label="Logout"
          >
            🚪
          </button>
        </div>
      )}
    </aside>
  );
};
