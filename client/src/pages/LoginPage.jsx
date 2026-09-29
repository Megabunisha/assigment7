import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export const LoginPage = () => {
  const { login, demoLogin, isLoading } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!identifier.trim() || !password) {
      showToast('Please fill in both fields', 'warning');
      return;
    }

    setIsSubmitting(true);
    const result = await login(identifier.trim(), password);
    setIsSubmitting(false);

    if (result.success) {
      navigate(from, { replace: true });
    }
  };

  const handleQuickDemo = async (demoUser) => {
    setIsSubmitting(true);
    const result = await demoLogin(demoUser);
    setIsSubmitting(false);

    if (result.success) {
      navigate(from, { replace: true });
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '48px', height: '48px', borderRadius: 'var(--radius-lg)', background: 'var(--brand-gradient)', color: 'white', marginBottom: '0.75rem', boxShadow: 'var(--brand-glow)' }}>
            <span style={{ fontSize: '1.4rem' }}>⚡</span>
          </div>
          <h1 className="auth-title">Welcome Back</h1>
          <p className="auth-subtitle">Sign in to your PulseSocial account</p>
        </div>

        {/* 1-Click Demo Login Box for Academic Evaluator */}
        <div className="demo-accounts-box">
          <div className="demo-title">⚡ 1-Click Evaluator Demo Accounts:</div>
          <div className="demo-buttons-grid">
            <button
              type="button"
              className="demo-btn"
              onClick={() => handleQuickDemo('alex_dev')}
              disabled={isSubmitting}
            >
              Alex (FullStack)
            </button>
            <button
              type="button"
              className="demo-btn"
              onClick={() => handleQuickDemo('sophia_codes')}
              disabled={isSubmitting}
            >
              Sophia (Design)
            </button>
            <button
              type="button"
              className="demo-btn"
              onClick={() => handleQuickDemo('marcus_tech')}
              disabled={isSubmitting}
            >
              Marcus (Cloud)
            </button>
          </div>
        </div>

        {/* Regular Login Form */}
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label className="form-label">Email or Username</label>
            <input
              id="login-identifier-input"
              type="text"
              className="form-input"
              placeholder="alex@example.com or alex_dev"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              id="login-password-input"
              type="password"
              className="form-input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            id="login-submit-btn"
            type="submit"
            className="auth-submit-btn"
            disabled={isSubmitting || isLoading}
          >
            {isSubmitting ? 'Signing In...' : 'Sign In 🚀'}
          </button>
        </form>

        <div className="auth-footer">
          Don't have an account?{' '}
          <Link to="/register" className="auth-link" id="go-to-register-link">
            Create an account
          </Link>
        </div>
      </div>
    </div>
  );
};
