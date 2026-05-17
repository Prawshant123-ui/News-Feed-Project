import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import './LoginPage.css';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      toast.error('Please fill in all fields');
      return;
    }
    const result = await login(username, password);
    if (result.success) {
      toast.success('Welcome back!');
      navigate('/admin');
    } else {
      toast.error(result.message);
    }
  };

  return (
    <div className="login-page">
      <div className="login-page__bg" />

      <div className="login-card fade-up">
        <div className="login-card__header">
          <h1 className="login-card__logo">NewsFlow<span>●</span></h1>
          <p className="login-card__subtitle">Admin Portal</p>
        </div>

        <form className="login-card__form" onSubmit={handleSubmit}>
          <div className="login-card__field">
            <label className="login-card__label">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="login-card__input"
              placeholder="Enter username"
              autoFocus
              autoComplete="username"
            />
          </div>

          <div className="login-card__field">
            <label className="login-card__label">Password</label>
            <div className="login-card__pass-wrap">
              <input
                type={showPass ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="login-card__input"
                placeholder="Enter password"
                autoComplete="current-password"
              />
              <button
                type="button"
                className="login-card__toggle-pass"
                onClick={() => setShowPass(!showPass)}
                aria-label="Toggle password"
              >
                {showPass ? '🙈' : '👁'}
              </button>
            </div>
          </div>

          <button type="submit" className="login-card__submit" disabled={loading}>
            {loading ? <span className="login-card__spinner" /> : 'Sign In'}
          </button>
        </form>

        <p className="login-card__back">
          <a href="/" className="login-card__back-link">← Back to News Feed</a>
        </p>
      </div>
    </div>
  );
}
