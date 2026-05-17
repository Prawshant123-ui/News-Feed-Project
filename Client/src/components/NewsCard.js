import React from 'react';
import { Link } from 'react-router-dom';
import './NewsCard.css';

function timeAgo(dateStr) {
  const diff = (Date.now() - new Date(dateStr)) / 1000;
  if (diff < 60) return 'Just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function NewsCard({ news, onDelete, isAdmin, index = 0 }) {
  const { _id, title, content, category, author, image, video, createdAt } = news;

  return (
    <article
      className="news-card fade-up"
      style={{ animationDelay: `${index * 0.07}s` }}
    >
      {(image || video) && (
        <Link to={`/news/${_id}`} className="news-card__media">
          {video ? (
            <video src={video} muted playsInline className="news-card__video" />
          ) : (
            <img src={image} alt={title} className="news-card__image" loading="lazy" />
          )}
          {video && <span className="news-card__play">▶</span>}
        </Link>
      )}

      <div className="news-card__body">
        {category && (
          <span className="news-card__category">{category}</span>
        )}

        <Link to={`/news/${_id}`} className="news-card__title-link">
          <h2 className="news-card__title">{title}</h2>
        </Link>

        <p className="news-card__excerpt">
          {content?.length > 130 ? content.slice(0, 130) + '…' : content}
        </p>

        <div className="news-card__footer">
          <div className="news-card__meta">
            <span className="news-card__author">By {author || 'Unknown'}</span>
            <span className="news-card__sep">·</span>
            <span className="news-card__time">{timeAgo(createdAt)}</span>
          </div>

          {isAdmin && (
            <div className="news-card__admin-actions">
              <Link to={`/admin/edit/${_id}`} className="news-card__edit-btn">
                Edit
              </Link>
              <button
                className="news-card__delete-btn"
                onClick={() => onDelete && onDelete(_id)}
              >
                Delete
              </button>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
