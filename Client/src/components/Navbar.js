import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const CATEGORIES = ['Politics', 'Technology', 'Sports', 'Entertainment', 'Business', 'Health', 'World'];

export default function Navbar({ onSearch, onCategory, activeCategory }) {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchVal, setSearchVal] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const isPublic = location.pathname === '/' || location.pathname.startsWith('/news');

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (onSearch) onSearch(searchVal.trim());
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}>
      <div className="navbar__top">
        <div className="navbar__inner">
          <Link to="/" className="navbar__logo">
            <span className="navbar__logo-text">NewsFlow</span>
            <span className="navbar__logo-dot">●</span>
          </Link>

          <div className="navbar__actions">
            {isPublic && onSearch && (
              <form className="navbar__search" onSubmit={handleSearch}>
                <input
                  type="text"
                  placeholder="Search stories…"
                  value={searchVal}
                  onChange={(e) => setSearchVal(e.target.value)}
                  className="navbar__search-input"
                />
                <button type="submit" className="navbar__search-btn" aria-label="Search">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                  </svg>
                </button>
              </form>
            )}

            {isAuthenticated ? (
              <div className="navbar__admin-actions">
                <Link to="/admin" className="navbar__btn navbar__btn--ghost">Dashboard</Link>
                <button className="navbar__btn navbar__btn--outline" onClick={handleLogout}>Logout</button>
              </div>
            ) : (
              <Link to="/login" className="navbar__btn navbar__btn--solid">Admin</Link>
            )}

            <button className="navbar__hamburger" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
              <span /><span /><span />
            </button>
          </div>
        </div>
      </div>

      {isPublic && (
        <nav className={`navbar__categories ${menuOpen ? 'navbar__categories--open' : ''}`}>
          <div className="navbar__categories-inner">
            <button
              className={`navbar__cat-btn ${!activeCategory ? 'active' : ''}`}
              onClick={() => { onCategory && onCategory(''); setMenuOpen(false); }}
            >
              All
            </button>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                className={`navbar__cat-btn ${activeCategory === cat ? 'active' : ''}`}
                onClick={() => { onCategory && onCategory(cat); setMenuOpen(false); }}
              >
                {cat}
              </button>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}
