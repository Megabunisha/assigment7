import React from 'react';

export const ProjectModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: '640px' }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <span style={{ fontSize: '1.4rem' }}>🎓</span>
            <h3 className="modal-title">Week 07 Minor Project: Full Stack Social Media App</h3>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            &times;
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
          <div style={{ background: 'var(--bg-surface)', padding: '0.85rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
            <strong style={{ color: 'var(--text-primary)' }}>Overview:</strong>
            <p style={{ marginTop: '0.25rem' }}>
              Full Stack Social Media Web Application integrating frontend (React.js) with backend (Node.js, Express.js, MongoDB) featuring JWT authentication, database relationships, CRUD operations, and responsive UI.
            </p>
          </div>

          <div>
            <h4 style={{ color: 'var(--text-primary)', marginBottom: '0.5rem' }}>✅ Features Implemented</h4>
            <ul style={{ paddingLeft: '1.25rem', lineHeight: '1.6' }}>
              <li><strong>User Authentication:</strong> Registration, Login, Logout, Password validation & hashing with bcrypt, JWT authorization.</li>
              <li><strong>User Profile:</strong> Information display, bio/location/website edits, avatar presets, follower/following count.</li>
              <li><strong>Create Posts:</strong> Text posts, categories, hashtags, image uploads/presets, formatted timestamps.</li>
              <li><strong>View Posts Feed:</strong> Chronological feed, filter by "All", "Following", "Trending", category pills, search bar.</li>
              <li><strong>Post Interactions:</strong> Like/Unlike toggle, delete own posts, edit own posts, comment threads.</li>
              <li><strong>Responsive UI:</strong> Mobile, tablet, and desktop adaptive glassmorphic design.</li>
              <li><strong>Bonus Features:</strong> Dark/Light mode toggle, Suggested creators follow system, Quick 1-click Demo logins.</li>
            </ul>
          </div>

          <div>
            <h4 style={{ color: 'var(--text-primary)', marginBottom: '0.5rem' }}>🛠️ Technology Stack</h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
              {['React.js (v19)', 'Node.js', 'Express.js', 'MongoDB / Mongoose', 'JWT (jsonwebtoken)', 'Bcrypt.js', 'Axios', 'React Router DOM', 'Vite', 'Vanilla CSS Design System'].map((tech) => (
                <span
                  key={tech}
                  style={{
                    background: 'var(--bg-surface-hover)',
                    border: '1px solid var(--border-card)',
                    padding: '0.2rem 0.6rem',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '0.78rem',
                    color: 'var(--text-primary)',
                    fontWeight: '600'
                  }}
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="nav-btn nav-btn-primary" onClick={onClose}>
            Got it, explore app!
          </button>
        </div>
      </div>
    </div>
  );
};
