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
    <div className="space-y-12">
      {/* Category Pills + Search Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white p-4 md:p-5 rounded-2xl border border-[#e8dfce] shadow-sm">
        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          {categories.map((cat) => {
            const active = activeCat === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCat(cat)}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap shrink-0 ${
                  active
                    ? 'bg-[#16120B] text-[#D4AF37] shadow-sm'
                    : 'bg-[#faf7f2] text-[#6b6255] hover:bg-[#ede5d8] hover:text-[#16120B]'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Live Search Input */}
        <div className="relative w-full md:w-72 shrink-0">
          <i className="fa-solid fa-magnifying-glass text-[#9c8e7c] absolute left-4 top-1/2 -translate-y-1/2 text-xs"></i>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search flooring guides..."
            className="w-full pl-9 pr-8 py-2.5 bg-[#faf7f2] border border-[#e8dfce] rounded-full text-xs font-medium text-[#16120B] placeholder-[#9c8e7c] focus:outline-none focus:border-[#B38728] focus:bg-white transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-[#9c8e7c] hover:text-[#16120B]"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* No Posts Found State */}
      {filteredPosts.length === 0 && (
        <div className="text-center py-16 bg-white rounded-3xl border border-[#e8dfce] p-8">
          <i className="fa-solid fa-book-open text-4xl text-[#B38728] mb-3 opacity-60"></i>
          <h3 className="text-lg font-bold text-[#16120B]">No articles match your search</h3>
          <p className="text-xs text-[#777] mt-1">Try adjusting your keyword or select "All Articles".</p>
          <button
            onClick={() => {
              setActiveCat('All Articles');
              setSearchQuery('');
            }}
            className="mt-4 px-5 py-2 rounded-full bg-[#16120B] text-[#D4AF37] text-xs font-bold hover:bg-[#2b2417] transition-colors"
          >
            Clear Filters
          </button>
        </div>
      )}

      {/* Featured Article Card */}
      {featured && (
        <div className="group relative bg-white rounded-3xl overflow-hidden border border-[#e8dfce] shadow-md hover:shadow-xl transition-all duration-300">
          <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[380px]">
            {/* Image (7 Cols) */}
            <div className="lg:col-span-7 relative overflow-hidden h-64 lg:h-auto min-h-[260px] bg-[#f0ebe1]">
              <img
                src={featured.image}
                alt={featured.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              <div className="absolute top-4 left-4 bg-gradient-to-r from-[#BF953F] to-[#FCF6BA] text-[#16120B] px-3.5 py-1 rounded-full text-[11px] font-bold shadow-md flex items-center gap-1.5 uppercase tracking-wider">
                <i className="fa-solid fa-star text-[10px]"></i>
                Featured Guide
              </div>
            </div>

            {/* Content (5 Cols) */}
            <div className="lg:col-span-5 p-6 md:p-8 lg:p-10 flex flex-col justify-between bg-gradient-to-br from-white to-[#faf8f5]">
              <div className="space-y-3">
                {/* Meta */}
                <div className="flex items-center gap-3 text-xs text-[#8a7e6e] font-medium">
                  <span className="px-2.5 py-0.5 rounded-md bg-[#f3ede2] text-[#8a6820] font-bold text-[11px]">
                    {featured.category}
                  </span>
                  <span className="flex items-center gap-1">
                    <i className="fa-regular fa-calendar text-[11px]"></i>
                    {featured.date}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <i className="fa-regular fa-clock text-[11px]"></i>
                    {featured.readTime}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-xl md:text-2xl font-bold text-[#16120B] leading-snug group-hover:text-[#AA771C] transition-colors">
                  <Link href={`/blog/${featured.slug}`}>{featured.title}</Link>
                </h3>

                {/* Excerpt */}
                <p className="text-xs md:text-sm text-[#666] leading-relaxed line-clamp-3">
                  {featured.excerpt}
                </p>
              </div>

              {/* Author & CTA */}
              <div className="pt-6 mt-6 border-t border-[#f0ebe1] flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#BF953F] to-[#FCF6BA] text-[#16120B] font-extrabold text-xs flex items-center justify-center shadow-sm">
                    ZK
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[#16120B]">{featured.author}</div>
                    <div className="text-[10px] text-[#999]">Master Installer</div>
                  </div>
                </div>

                <Link
                  href={`/blog/${featured.slug}`}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#16120B] text-[#D4AF37] hover:bg-[#AA771C] hover:text-[#16120B] text-xs font-bold transition-all shadow-sm"
                >
                  Read Article
                  <i className="fa-solid fa-arrow-right text-[10px]"></i>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Grid of Remaining Articles */}
      {gridPosts.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-6 pb-2 border-b border-[#e8dfce]">
            <h4 className="text-base font-bold text-[#16120B] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#B38728]" />
              More Flooring Guides & Insights
            </h4>
            <span className="text-xs font-semibold text-[#8a7e6e]">
              Showing {gridPosts.length} article{gridPosts.length > 1 ? 's' : ''}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {gridPosts.map((post) => (
              <article
                key={post.slug}
                className="group bg-white rounded-2xl overflow-hidden border border-[#e8dfce] shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col h-full"
              >
                {/* Image */}
                <div className="relative h-56 w-full overflow-hidden bg-[#f0ebe1]">
                  <Link href={`/blog/${post.slug}`} className="block w-full h-full">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                    />
                  </Link>
                  <span className="absolute top-3.5 left-3.5 px-2.5 py-1 rounded-md bg-[#16120B]/85 backdrop-blur-sm text-[#FCF6BA] font-bold text-[10px] tracking-wider uppercase">
                    {post.category}
                  </span>
                </div>

                {/* Content */}
                <div className="p-5 flex flex-col flex-1 justify-between bg-white">
                  <div className="space-y-2.5">
                    {/* Meta */}
                    <div className="flex items-center gap-2 text-[11px] text-[#8a7e6e] font-medium">
                      <span className="flex items-center gap-1">
                        <i className="fa-regular fa-calendar text-[10px] text-[#B38728]"></i>
                        {post.date}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <i className="fa-regular fa-clock text-[10px] text-[#B38728]"></i>
                        {post.readTime}
                      </span>
                    </div>

                    {/* Title */}
                    <h4 className="text-base font-bold text-[#16120B] line-clamp-2 leading-snug group-hover:text-[#AA771C] transition-colors min-h-[44px]">
                      <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                    </h4>

                    {/* Excerpt */}
                    <p className="text-xs text-[#666] line-clamp-2 leading-relaxed">
                      {post.excerpt}
                    </p>
                  </div>

                  {/* Bottom Bar */}
                  <div className="pt-4 mt-4 border-t border-[#f0ebe1] flex items-center justify-between">
                    <span className="text-[11px] font-bold text-[#8a7e6e]">{post.author}</span>
                    <Link
                      href={`/blog/${post.slug}`}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-[#16120B] group-hover:text-[#AA771C] transition-all"
                    >
                      Read
                      <i className="fa-solid fa-arrow-right text-[10px] text-[#B38728]"></i>
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
