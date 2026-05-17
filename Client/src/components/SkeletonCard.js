import React from 'react';
import './SkeletonCard.css';

export default function SkeletonCard() {
  return (
    <div className="skeleton-card">
      <div className="skeleton skeleton-card__media" />
      <div className="skeleton-card__body">
        <div className="skeleton skeleton-card__tag" />
        <div className="skeleton skeleton-card__title" />
        <div className="skeleton skeleton-card__title skeleton-card__title--short" />
        <div className="skeleton skeleton-card__line" />
        <div className="skeleton skeleton-card__line" />
        <div className="skeleton skeleton-card__line skeleton-card__line--short" />
        <div className="skeleton-card__footer">
          <div className="skeleton skeleton-card__author" />
        </div>
      </div>
    </div>
  );
}
