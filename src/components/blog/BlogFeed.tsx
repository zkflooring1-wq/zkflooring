"use client";

import React, { useState, useMemo } from 'react';
import Link from 'next/link';

export interface BlogItem {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  readTime: string;
  author: string;
  image: string;
}

interface BlogFeedProps {
  posts: BlogItem[];
  categories: string[];
}

export default function BlogFeed({ posts, categories }: BlogFeedProps) {
  const [activeCat, setActiveCat] = useState('All Articles');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPosts = useMemo(() => {
    return posts.filter((p) => {
      const matchCat =
        activeCat === 'All Articles' ||
        p.category.toLowerCase().includes(activeCat.toLowerCase()) ||
        activeCat.toLowerCase().includes(p.category.toLowerCase());

      const matchSearch =
        searchQuery.trim() === '' ||
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase());

      return matchCat && matchSearch;
    });
  }, [posts, activeCat, searchQuery]);

  const featured = filteredPosts[0];
  const gridPosts = filteredPosts.slice(1);

  return (
    <div>
      {/* Category Pills + Search Bar */}
      <div className="zk-blog-filter-bar">
        <div className="zk-blog-filter-pills">
          {categories.map((cat) => {
            const active = activeCat === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCat(cat)}
                className={`zk-blog-pill-btn ${active ? 'active' : ''}`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        <div className="zk-blog-search-box">
          <i
            className="fa-solid fa-magnifying-glass"
            style={{
              position: 'absolute',
              left: '16px',
              top: '50%',
              transform: 'translateY(-50%)',
              fontSize: '12px',
              color: '#9c8e7c',
            }}
          ></i>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search flooring guides..."
            className="zk-blog-search-input"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              style={{
                position: 'absolute',
                right: '14px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                fontSize: '12px',
                color: '#9c8e7c',
                cursor: 'pointer',
              }}
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* No Posts Found */}
      {filteredPosts.length === 0 && (
        <div
          style={{
            textAlign: 'center',
            padding: '60px 20px',
            background: '#ffffff',
            borderRadius: '24px',
            border: '1px solid #e8dfce',
            marginBottom: '40px',
          }}
        >
          <i className="fa-solid fa-book-open" style={{ fontSize: '36px', color: '#B38728', marginBottom: '14px', opacity: 0.7 }}></i>
          <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#16120B', marginBottom: '6px' }}>No articles match your search</h3>
          <p style={{ fontSize: '13px', color: '#777', marginBottom: '18px' }}>Try adjusting your keyword or click below to reset.</p>
          <button
            onClick={() => {
              setActiveCat('All Articles');
              setSearchQuery('');
            }}
            className="zk-read-btn"
          >
            Clear Filters
          </button>
        </div>
      )}

      {/* Featured Article Card */}
      {featured && (
        <div className="zk-featured-card">
          <div className="row g-0 align-items-center">
            <div className="col-lg-7">
              <div className="zk-featured-img-wrap">
                <Link href={`/blog/${featured.slug}`}>
                  <img src={featured.image} alt={featured.title} />
                </Link>
                <div className="zk-featured-badge">
                  <i className="fa-solid fa-star" style={{ fontSize: '10px', marginRight: '6px' }}></i>
                  Featured Guide
                </div>
              </div>
            </div>
            <div className="col-lg-5">
              <div className="zk-featured-content">
                <div className="zk-featured-meta">
                  <span className="zk-cat-tag-sm">{featured.category}</span>
                  <span>
                    <i className="fa-regular fa-calendar" style={{ marginRight: '5px' }}></i>
                    {featured.date}
                  </span>
                  <span>•</span>
                  <span>
                    <i className="fa-regular fa-clock" style={{ marginRight: '5px' }}></i>
                    {featured.readTime}
                  </span>
                </div>

                <h3 className="zk-featured-title">
                  <Link href={`/blog/${featured.slug}`}>{featured.title}</Link>
                </h3>

                <p className="zk-featured-excerpt">{featured.excerpt}</p>

                <div className="zk-featured-footer">
                  <div className="zk-author-block">
                    <div className="zk-author-avatar">ZK</div>
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: 800, color: '#16120B' }}>{featured.author}</div>
                      <div style={{ fontSize: '11px', color: '#999' }}>Certified Specialist</div>
                    </div>
                  </div>

                  <Link href={`/blog/${featured.slug}`} className="zk-read-btn">
                    Read Article
                    <i className="fa-solid fa-arrow-right" style={{ fontSize: '11px' }}></i>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Grid of Remaining Articles (Bootstrap 3-Col Responsive Grid) */}
      {gridPosts.length > 0 && (
        <div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '28px',
              paddingBottom: '12px',
              borderBottom: '1px solid #e8dfce',
            }}
          >
            <h4
              style={{
                fontSize: '18px',
                fontWeight: 800,
                color: '#16120B',
                margin: 0,
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#B38728', display: 'inline-block' }}></span>
              More Flooring Guides & Insights
            </h4>
            <span style={{ fontSize: '13px', fontWeight: 600, color: '#8a7e6e' }}>
              Showing {gridPosts.length} article{gridPosts.length > 1 ? 's' : ''}
            </span>
          </div>

          <div className="row gy-30">
            {gridPosts.map((post) => (
              <div key={post.slug} className="col-lg-4 col-md-6 col-sm-12">
                <article className="zk-blog-grid-card">
                  <div className="zk-card-img-wrap">
                    <Link href={`/blog/${post.slug}`} style={{ display: 'block', width: '100%', height: '100%' }}>
                      <img src={post.image} alt={post.title} />
                    </Link>
                    <span className="zk-card-floating-cat">{post.category}</span>
                  </div>

                  <div className="zk-card-body">
                    <div className="zk-card-meta">
                      <span>
                        <i className="fa-regular fa-calendar" style={{ marginRight: '5px', color: '#B38728' }}></i>
                        {post.date}
                      </span>
                      <span>•</span>
                      <span>
                        <i className="fa-regular fa-clock" style={{ marginRight: '5px', color: '#B38728' }}></i>
                        {post.readTime}
                      </span>
                    </div>

                    <h4 className="zk-card-title">
                      <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                    </h4>

                    <p className="zk-card-excerpt">{post.excerpt}</p>

                    <div className="zk-card-footer">
                      <span className="zk-card-author">{post.author}</span>
                      <Link href={`/blog/${post.slug}`} className="zk-card-link">
                        Read
                        <i className="fa-solid fa-arrow-right" style={{ fontSize: '11px', color: '#B38728' }}></i>
                      </Link>
                    </div>
                  </div>
                </article>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
