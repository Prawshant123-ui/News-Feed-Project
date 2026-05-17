import React, { useState, useEffect, useCallback, useRef } from 'react';
import Navbar from '../components/Navbar';
import NewsCard from '../components/NewsCard';
import SkeletonCard from '../components/SkeletonCard';
import Pagination from '../components/Pagination';
import { getAllNews, searchNews, getNewsByCategory } from '../utils/api';
import './NewsFeedPage.css';

const LIMIT = 9;

export default function NewsFeedPage() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalNews, setTotalNews] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('');
  const [mode, setMode] = useState('pagination'); // 'pagination' | 'infinite'
  const [infiniteNews, setInfiniteNews] = useState([]);
  const [infinitePage, setInfinitePage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const loaderRef = useRef(null);

  // ── Pagination mode ──────────────────────────────────────
  const fetchPage = useCallback(async (page) => {
    setLoading(true);
    try {
      let res;
      if (searchQuery) {
        res = await searchNews(searchQuery);
        setNews(Array.isArray(res.data) ? res.data : []);
        setTotalPages(1);
        setTotalNews(res.data?.length || 0);
      } else if (activeCategory) {
        res = await getNewsByCategory(activeCategory);
        setNews(Array.isArray(res.data) ? res.data : []);
        setTotalPages(1);
        setTotalNews(res.data?.length || 0);
      } else {
        res = await getAllNews(page, LIMIT);
        setNews(res.data.news || []);
        setTotalPages(res.data.totalPages || 1);
        setTotalNews(res.data.totalNews || 0);
      }
    } catch {
      setNews([]);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, activeCategory]);

  useEffect(() => {
    if (mode === 'pagination') {
      fetchPage(currentPage);
    }
  }, [currentPage, mode, fetchPage]);

  // ── Infinite scroll mode ─────────────────────────────────
  const fetchInfinitePage = useCallback(async (page) => {
    if (page === 1) setLoading(true);
    else setLoadingMore(true);
    try {
      const res = await getAllNews(page, LIMIT);
      const items = res.data.news || [];
      setInfiniteNews((prev) => page === 1 ? items : [...prev, ...items]);
      setHasMore(page < (res.data.totalPages || 1));
      setTotalNews(res.data.totalNews || 0);
    } catch {
      setHasMore(false);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, []);

  useEffect(() => {
    if (mode === 'infinite') {
      setInfiniteNews([]);
      setInfinitePage(1);
      setHasMore(true);
      fetchInfinitePage(1);
    }
  }, [mode, fetchInfinitePage]);

  useEffect(() => {
    if (mode === 'infinite' && infinitePage > 1) {
      fetchInfinitePage(infinitePage);
    }
  }, [infinitePage, mode, fetchInfinitePage]);

  // Intersection observer for infinite scroll
  useEffect(() => {
    if (mode !== 'infinite') return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loadingMore) {
          setInfinitePage((p) => p + 1);
        }
      },
      { threshold: 0.1 }
    );
    const el = loaderRef.current;
    if (el) observer.observe(el);
    return () => { if (el) observer.unobserve(el); };
  }, [mode, hasMore, loadingMore]);

  const handleSearch = (q) => {
    setSearchQuery(q);
    setActiveCategory('');
    setCurrentPage(1);
    setMode('pagination');
  };

  const handleCategory = (cat) => {
    setActiveCategory(cat);
    setSearchQuery('');
    setCurrentPage(1);
    setMode('pagination');
  };

  const handleModeSwitch = (m) => {
    setMode(m);
    setSearchQuery('');
    setActiveCategory('');
    setCurrentPage(1);
  };

  const displayNews = mode === 'infinite' ? infiniteNews : news;

  return (
    <div className="feed-page">
      <Navbar onSearch={handleSearch} onCategory={handleCategory} activeCategory={activeCategory} />

      <main className="feed-page__main">
        {/* Hero Banner */}
        <div className="feed-page__hero">
          <div className="feed-page__hero-inner">
            <p className="feed-page__hero-label">Latest News</p>
            <h1 className="feed-page__hero-title">Today's Stories</h1>
            <p className="feed-page__hero-count">
              {totalNews > 0 ? `${totalNews} articles published` : ''}
            </p>
          </div>
        </div>

        <div className="feed-page__container">
          {/* Toolbar */}
          <div className="feed-page__toolbar">
            {(searchQuery || activeCategory) && (
              <div className="feed-page__filter-tag">
                {searchQuery ? `Search: "${searchQuery}"` : `Category: ${activeCategory}`}
                <button onClick={() => { setSearchQuery(''); setActiveCategory(''); }}>×</button>
              </div>
            )}

            {!searchQuery && !activeCategory && (
              <div className="feed-page__mode-toggle">
                <button
                  className={`feed-page__mode-btn ${mode === 'pagination' ? 'active' : ''}`}
                  onClick={() => handleModeSwitch('pagination')}
                >
                  Pages
                </button>
                <button
                  className={`feed-page__mode-btn ${mode === 'infinite' ? 'active' : ''}`}
                  onClick={() => handleModeSwitch('infinite')}
                >
                  Infinite Scroll
                </button>
              </div>
            )}
          </div>

          {/* Grid */}
          {loading ? (
            <div className="feed-page__grid">
              {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : displayNews.length === 0 ? (
            <div className="feed-page__empty">
              <span>📰</span>
              <h3>No stories found</h3>
              <p>Try a different search or category.</p>
            </div>
          ) : (
            <div className="feed-page__grid">
              {displayNews.map((item, i) => (
                <NewsCard key={item._id} news={item} index={i} />
              ))}
            </div>
          )}

          {/* Pagination (page mode) */}
          {mode === 'pagination' && !loading && !searchQuery && !activeCategory && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={(p) => { setCurrentPage(p); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            />
          )}

          {/* Infinite scroll sentinel */}
          {mode === 'infinite' && (
            <div ref={loaderRef} className="feed-page__sentinel">
              {loadingMore && (
                <div className="feed-page__loading-more">
                  <span className="feed-page__spinner" />
                  <span>Loading more stories…</span>
                </div>
              )}
              {!hasMore && !loading && infiniteNews.length > 0 && (
                <p className="feed-page__end">— You've reached the end —</p>
              )}
            </div>
          )}
        </div>
      </main>

      <footer className="feed-page__footer">
        <p>© {new Date().getFullYear()} NewsFlow · All rights reserved</p>
      </footer>
    </div>
  );
}
