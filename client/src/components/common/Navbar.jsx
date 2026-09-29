import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

export const Navbar = ({ onOpenProjectModal }) => {
  const { user, isAuthenticated, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/explore?q=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  return (
    <header className="navbar">
      <div className="navbar-inner">
        {/* Brand Logo */}
        <Link to="/" className="nav-brand" id="nav-brand-logo">
          <div className="nav-logo-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
            </svg>
          </div>
          <span>PulseSocial</span>
        </Link>

        {/* Search Bar */}
        <form onSubmit={handleSearchSubmit} className="nav-search">
          <span className="nav-search-icon">🔍</span>
          <input
            id="nav-search-input"
            type="text"
            placeholder="Search posts, #tags, creators..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </form>

        {/* Actions */}
        <div className="nav-actions">
          {/* Theme Toggle */}
          <button
            id="theme-toggle-btn"
            className="nav-icon-btn"
            onClick={toggleTheme}
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>

          {/* Project Details Modal Trigger */}
          <button
            id="project-info-btn"
            className="nav-btn"
            onClick={onOpenProjectModal}
            title="View Minor Project 07 specifications & evaluation criteria"
          >
            <span>🎓</span>
            <span>Week 07 Specs</span>
          </button>

          {isAuthenticated ? (
            <div className="nav-user-menu" style={{ position: 'relative' }}>
              <button
                id="nav-user-dropdown-btn"
                className="nav-avatar-btn"
                onClick={() => setShowDropdown((prev) => !prev)}
                aria-expanded={showDropdown}
              >
                <img
                  src={user.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=user'}
                  alt={user.name}
                  className="nav-avatar-img"
                />
              </button>

              {showDropdown && (
                <div
                  className="post-menu-dropdown"
                  style={{ top: '48px', right: '0', minWidth: '180px' }}
                >
                  <div style={{ padding: '0.5rem 0.75rem', borderBottom: '1px solid var(--border-subtle)' }}>
                    <div style={{ fontWeight: '700', fontSize: '0.9rem' }}>{user.name}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>@{user.username}</div>
                  </div>
                  <Link
                    to={`/profile/${user.username}`}
                    className="sidebar-nav-item"
                    style={{ padding: '0.6rem 0.75rem', fontSize: '0.88rem' }}
                    onClick={() => setShowDropdown(false)}
                  >
                    👤 My Profile
                  </Link>
                  <Link
                    to="/explore"
                    className="sidebar-nav-item"
                    style={{ padding: '0.6rem 0.75rem', fontSize: '0.88rem' }}
                    onClick={() => setShowDropdown(false)}
                  >
                    🧭 Explore Posts
                  </Link>
                  <button
                    id="nav-logout-btn"
                    className="delete-btn"
                    style={{ width: '100%', marginTop: '0.25rem' }}
                    onClick={() => {
                      setShowDropdown(false);
                      logout();
                      navigate('/login');
                    }}
                  >
                    🚪 Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <Link to="/login" className="nav-btn" id="nav-login-link">
                Login
              </Link>
              <Link to="/register" className="nav-btn nav-btn-primary" id="nav-register-link">
                Get Started
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
