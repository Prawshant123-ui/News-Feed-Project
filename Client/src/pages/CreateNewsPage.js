import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createNews } from '../utils/api';
import NewsForm from '../components/NewsForm';
import toast from 'react-hot-toast';
import './FormPage.css';

export default function CreateNewsPage() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (formData) => {
    setLoading(true);
    try {
      await createNews(formData);
      toast.success('Article published!');
      navigate('/admin');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create article');
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
          <Link to="/" className="form-page__sidebar-link">🌐 View Site</Link>
        </nav>
      </aside>

      <main className="form-page__main">
        <div className="form-page__header">
          <p className="form-page__breadcrumb">
            <Link to="/admin">Dashboard</Link> / New Article
          </p>
          <h1 className="form-page__title">Create Article</h1>
          <p className="form-page__subtitle">Write and publish a new news story</p>
        </div>
        <div className="form-page__body">
          <NewsForm onSubmit={handleSubmit} loading={loading} submitLabel="Publish Article" />
        </div>
      </main>
    </div>
  );
}
