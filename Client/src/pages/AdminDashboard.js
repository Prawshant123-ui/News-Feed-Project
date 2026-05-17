import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getAllNews, deleteNews } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import NewsCard from '../components/NewsCard';
import SkeletonCard from '../components/SkeletonCard';
import Pagination from '../components/Pagination';
import toast from 'react-hot-toast';
import './AdminDashboard.css';

const LIMIT = 9;

export default function AdminDashboard() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalNews, setTotalNews] = useState(0);

  const fetchNews = useCallback(async (page) => {
    setLoading(true);
    try {
      const res = await getAllNews(page, LIMIT);
      setNews(res.data.news || []);
      setTotalPages(res.data.totalPages || 1);
      setTotalNews(res.data.totalNews || 0);
    } catch {
      toast.error('Failed to load news');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchNews(currentPage); }, [currentPage, fetchNews]);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this article?')) return;
    try {
      await deleteNews(id);
      toast.success('Article deleted');
      fetchNews(currentPage);
    } catch {
      toast.error('Failed to delete');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    toast.success('Logged out');
  };

  return (
    <div className="admin-page">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="admin-sidebar__logo">
          <Link to="/" className="admin-sidebar__logo-text">NewsFlow<span>●</span></Link>
        </div>

        <nav className="admin-sidebar__nav">
          <span className="admin-sidebar__nav-label">Management</span>
          <Link to="/admin" className="admin-sidebar__nav-item admin-sidebar__nav-item--active">
            <span>📋</span> All Articles
          </Link>
          <Link to="/admin/create" className="admin-sidebar__nav-item">
            <span>✏️</span> New Article
          </Link>
          <Link to="/" className="admin-sidebar__nav-item">
            <span>🌐</span> View Site
          </Link>
        </nav>

        <div className="admin-sidebar__footer">
          <div className="admin-sidebar__user">
            <div className="admin-sidebar__avatar">A</div>
            <div>
              <p className="admin-sidebar__user-name">Admin</p>
              <p className="admin-sidebar__user-role">Super Admin</p>
            </div>
          </div>
          <button className="admin-sidebar__logout" onClick={handleLogout}>
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="admin-main">
        <div className="admin-main__header">
          <div>
            <h1 className="admin-main__title">Articles</h1>
            <p className="admin-main__subtitle">{totalNews} total articles published</p>
          </div>
          <Link to="/admin/create" className="admin-main__create-btn">
            + New Article
          </Link>
        </div>

        {loading ? (
          <div className="admin-main__grid">
            {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : news.length === 0 ? (
          <div className="admin-main__empty">
            <span>📰</span>
            <h3>No articles yet</h3>
            <Link to="/admin/create" className="admin-main__create-btn">Create your first article</Link>
          </div>
        ) : (
          <div className="admin-main__grid">
            {news.map((item, i) => (
              <NewsCard
                key={item._id}
                news={item}
                index={i}
                isAdmin
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(p) => { setCurrentPage(p); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
        />
      </main>
    </div>
  );
}
