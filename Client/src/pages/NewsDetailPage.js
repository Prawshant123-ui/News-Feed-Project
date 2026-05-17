import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getSingleNews, deleteNews } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import toast from 'react-hot-toast';
import './NewsDetailPage.css';

function timeAgo(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
}

export default function NewsDetailPage() {
  const { id } = useParams();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [news, setNews] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSingleNews(id)
      .then((res) => setNews(res.data))
      .catch(() => toast.error('Failed to load article'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm('Delete this article permanently?')) return;
    try {
      await deleteNews(id);
      toast.success('Article deleted');
      navigate('/admin');
    } catch {
      toast.error('Failed to delete');
    }
  };

  if (loading) return (
    <div className="detail-page">
      <Navbar />
      <div className="detail-page__loading">
        <span className="detail-page__spinner" />
      </div>
    </div>
  );

  if (!news) return (
    <div className="detail-page">
      <Navbar />
      <div className="detail-page__not-found">
        <h2>Article not found</h2>
        <Link to="/" className="detail-page__back">← Back to feed</Link>
      </div>
    </div>
  );

  return (
    <div className="detail-page">
      <Navbar />

      <main className="detail-page__main">
        <div className="detail-page__container">
          {/* Back link */}
          <Link to="/" className="detail-page__breadcrumb">← All Stories</Link>

          {/* Article header */}
          <header className="detail-page__header">
            {news.category && (
              <span className="detail-page__category">{news.category}</span>
            )}
            <h1 className="detail-page__title">{news.title}</h1>
            <div className="detail-page__meta">
              <span className="detail-page__author">By {news.author || 'Unknown'}</span>
              <span className="detail-page__sep">·</span>
              <time className="detail-page__date">{timeAgo(news.createdAt)}</time>
            </div>
          </header>

          {/* Media */}
          {news.image && (
            <figure className="detail-page__figure">
              <img src={news.image} alt={news.title} className="detail-page__image" />
            </figure>
          )}

          {news.video && (
            <figure className="detail-page__figure">
              <video src={news.video} controls className="detail-page__video" />
            </figure>
          )}

          {/* Content */}
          <div className="detail-page__content">
            {news.content?.split('\n').map((para, i) =>
              para.trim() ? <p key={i}>{para}</p> : <br key={i} />
            )}
          </div>

          {/* Admin actions */}
          {isAuthenticated && (
            <div className="detail-page__admin-bar">
              <Link to={`/admin/edit/${news._id}`} className="detail-page__edit-btn">
                Edit Article
              </Link>
              <button className="detail-page__delete-btn" onClick={handleDelete}>
                Delete Article
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
