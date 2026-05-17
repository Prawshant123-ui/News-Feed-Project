import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { getSingleNews, updateNews } from '../utils/api';
import NewsForm from '../components/NewsForm';
import toast from 'react-hot-toast';
import './FormPage.css';

export default function EditNewsPage() {
  const { id } = useParams();
  const [initialData, setInitialData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    getSingleNews(id)
      .then((res) => setInitialData(res.data))
      .catch(() => toast.error('Failed to load article'))
      .finally(() => setFetching(false));
  }, [id]);

  const handleSubmit = async (formData) => {
    setLoading(true);
    try {
      // For update, send as JSON (no new files)
      const data = {
        title: formData.get('title'),
        content: formData.get('content'),
        category: formData.get('category'),
        author: formData.get('author'),
      };
      await updateNews(id, data);
      toast.success('Article updated!');
      navigate('/admin');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-page">
      <aside className="form-page__sidebar">
        <Link to="/admin" className="form-page__sidebar-logo">
          NewsFlow<span>●</span>
        </Link>
        <nav className="form-page__sidebar-nav">
          <Link to="/admin" className="form-page__sidebar-link">← Back to Dashboard</Link>
          <Link to={`/news/${id}`} className="form-page__sidebar-link">👁 View Article</Link>
          <Link to="/" className="form-page__sidebar-link">🌐 View Site</Link>
        </nav>
      </aside>

      <main className="form-page__main">
        <div className="form-page__header">
          <p className="form-page__breadcrumb">
            <Link to="/admin">Dashboard</Link> / Edit Article
          </p>
          <h1 className="form-page__title">Edit Article</h1>
          <p className="form-page__subtitle">Update the content of this story</p>
        </div>

        <div className="form-page__body">
          {fetching ? (
            <div className="form-page__loading">
              <span className="form-page__spinner" />
            </div>
          ) : initialData ? (
            <NewsForm
              initialData={initialData}
              onSubmit={handleSubmit}
              loading={loading}
              submitLabel="Save Changes"
            />
          ) : (
            <p style={{ color: 'var(--ink-muted)' }}>Article not found.</p>
          )}
        </div>
      </main>
    </div>
  );
}
