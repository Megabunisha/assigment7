import React from 'react';
import { Link } from 'react-router-dom';

export const NotFoundPage = () => {
  return (
    <div className="auth-page">
      <div className="auth-card" style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '4rem', fontWeight: '800', background: 'var(--brand-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          404
        </div>
        <h2 style={{ fontSize: '1.4rem', marginTop: '0.5rem' }}>Page Not Found</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
          The page or user profile you are looking for doesn't exist or has moved.
        </p>
        <Link to="/" className="nav-btn nav-btn-primary" style={{ marginTop: '1rem', display: 'inline-flex' }}>
          Return to Social Feed
        </Link>
      </div>
    </div>
  );
};
