import React from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { blogPosts, BlogPost } from '@/data/blogPosts';
import { EditModeProvider } from '@/components/editor/EditModeProvider';
import { EditableField } from '@/components/editor/EditableField';

export const metadata = {
  title: 'Flooring Insights & Buying Guides Birmingham | ZK Flooring Blog',
  description: 'Expert flooring advice, technical buying guides, and British Standards installation tips for LVT, Laminate, Carpet Underlays, and Hardwood in Birmingham & West Midlands.',
};

const DEFAULT_BLOG_PAGE_DATA = {
  breadcrumb: {
    title: "Flooring Insights",
    subtitle: "Blog"
  },
  header: {
    badge: "Expert Knowledge",
    title: "Flooring Guides & Articles",
    description: "Professional advice, technical guides, and buying insights from our certified flooring specialists in Birmingham."
  },
  callout: {
    subtitle: "Need Expert Advice?",
    phone: "07903 723 774",
    cta_text: "Contact Our Flooring Specialists",
    cta_link: "/contact"
  }
};

export default async function BlogIndexPage() {
  const [postsRes, pageRes] = await Promise.all([
    supabase.from('posts').select('*').eq('status', 'published').order('created_at', { ascending: false }),
    supabase.from('pages').select('sections').eq('slug', 'blog').maybeSingle()
  ]);

  const dbPosts = postsRes.data;
  const sections = pageRes.data?.sections || DEFAULT_BLOG_PAGE_DATA;
  const breadcrumb = sections.breadcrumb || DEFAULT_BLOG_PAGE_DATA.breadcrumb;
  const header = sections.header || DEFAULT_BLOG_PAGE_DATA.header;
  const callout = sections.callout || DEFAULT_BLOG_PAGE_DATA.callout;

  // Normalize posts into a unified shape
  const posts: {
    slug: string;
    title: string;
    excerpt: string;
    category: string;
    date: string;
    readTime: string;
    author: string;
    image: string;
  }[] = (dbPosts && dbPosts.length > 0)
    ? dbPosts.map((p: any) => ({
        slug: p.slug,
        title: p.title,
        excerpt: p.seo_data?.excerpt || p.seo_data?.seoDescription || '',
        category: (p.categories && p.categories.length > 0) ? p.categories[0] : 'Flooring Insights',
        date: new Date(p.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        readTime: `${Math.ceil((p.content || '').length / 1000)} min read`,
        author: p.seo_data?.author || 'ZK Flooring',
        image: p.featured_image || '/slider/Carpet.webp',
      }))
    : blogPosts.map((bp: BlogPost) => ({
        slug: bp.slug,
        title: bp.title,
        excerpt: bp.excerpt,
        category: bp.category,
        date: bp.date,
        readTime: bp.readTime,
        author: bp.author,
        image: bp.coverImage || '/slider/Carpet.webp',
      }));

  const featured = posts[0];
  const remaining = posts.slice(1);

  // Flooring blog categories
  const categories = [
    'All Articles',
    'Carpet & Fitting',
    'LVT & Vinyl',
    'Hardwood Flooring',
    'Subfloor Preparation',
    'Commercial Flooring',
  ];

  return (
    <EditModeProvider initialData={sections}>
    <main>
      <style>{`
        .zk-blog-feat {
          transition: box-shadow 0.4s ease, border-color 0.35s ease;
        }
        .zk-blog-feat:hover {
          box-shadow: 0 24px 55px rgba(0, 0, 0, 0.18) !important;
          border-color: rgba(212, 175, 55, 0.6) !important;
        }
        .zk-blog-feat:hover .zk-blog-feat-img {
          transform: scale(1.04);
        }
        .zk-blog-card {
          transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.35s ease, border-color 0.35s ease;
        }
        .zk-blog-card:hover {
          transform: translateY(-6px);
          border-color: rgba(212, 175, 55, 0.6) !important;
          box-shadow: 0 18px 40px rgba(179, 135, 40, 0.15) !important;
        }
        .zk-blog-card:hover .zk-blog-card-img {
          transform: scale(1.05);
        }
        .zk-blog-card:hover .zk-blog-card-title {
          color: #AA771C !important;
        }
        .zk-blog-read-link {
          transition: all 0.2s ease;
        }
        .zk-blog-read-link:hover {
          color: #AA771C !important;
          transform: translateX(3px);
        }
        .zk-blog-cat-pill {
          transition: all 0.2s ease;
          cursor: pointer;
        }
        .zk-blog-cat-pill:hover, .zk-blog-cat-pill.active {
          background: #16120B !important;
          color: #FCF6BA !important;
          border-color: #16120B !important;
        }
        @media (max-width: 991px) {
          .zk-blog-feat-inner { flex-direction: column !important; }
          .zk-blog-feat-img-wrap { height: 300px !important; min-height: 300px !important; }
          .zk-blog-feat-content { padding: 30px 24px !important; }
        }
        @media (max-width: 575px) {
          .zk-blog-feat-img-wrap { height: 210px !important; min-height: 210px !important; }
          .zk-blog-feat-content { padding: 22px 18px !important; }
          .zk-blog-card-img-wrap { height: 190px !important; }
          .zk-blog-card-body { padding: 18px 16px 16px 16px !important; }
          .zk-blog-cat-row { gap: 8px !important; margin-bottom: 30px !important; }
          .zk-blog-cat-pill { padding: 6px 14px !important; font-size: 12px !important; }
        }
      `}</style>

      {/* Breadcrumb Section */}
      <section className="tv-breadcrumb-section">
        <div
          className="tv-breadcrumb-inner mx-30 ml-mx-0 position-relative overflow-hidden br-30 ml-br-0"
          style={{ background: 'linear-gradient(to right, #BF953F, #FCF6BA, #B38728, #FBF5B7, #AA771C)' }}
        >
          <div className="bg"></div>
          <div className="container">
            <div className="row">
              <div className="col-12">
                <div className="title-outer">
                  <div className="page-title">
                    <h2 className="title"><EditableField path="breadcrumb.title" fallback={breadcrumb.title || "Flooring Insights"} /></h2>
                    <ul className="page-breadcrumb">
                      <li><a href="/"><i className="fa-solid fa-house-chimney"></i>Home</a></li>
                      <li><span>/</span> <EditableField path="breadcrumb.subtitle" fallback={breadcrumb.subtitle || "Blog"} /></li>
                    </ul>
                  </div>
                  <div className="image-box md-d-none">
                    <div className="shapes">
                      <div className="shape shape-1"><img src="/assets/images/shapes/circle.webp" alt="" /></div>
                      <div className="shape shape-2 spin2"><img src="/assets/images/shapes/star.webp" alt="" /></div>
                      <div className="shape shape-3"><img src="/assets/images/shapes/snake.webp" alt="" /></div>
                      <div className="shape shape-4 jump3"><img src="/assets/images/shapes/doot.webp" alt="" /></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Blog Content */}
      <section className="space bg-light">
        <div className="container">
          {/* Section Header */}
          <div className="text-center mb-50">
            <div className="sub-title-2 text-theme">
              <i className="fa-solid fa-circle-check"></i><EditableField path="header.badge" fallback={header.badge || "Expert Knowledge"} />
            </div>
            <h2 className="sec-title"><EditableField path="header.title" fallback={header.title || "Flooring Guides & Articles"} isHtml /></h2>
            <p style={{ maxWidth: '640px', margin: '8px auto 0', fontSize: '15px', color: '#777' }}>
              <EditableField path="header.description" fallback={header.description || "Professional advice, technical guides, and buying insights from our certified flooring specialists in Birmingham."} />
            </p>
          </div>

          {/* Category Filter Pills */}
          <div
            className="zk-blog-cat-row"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              justifyContent: 'center',
              flexWrap: 'wrap',
              marginBottom: '48px',
            }}
          >
            {categories.map((cat, i) => (
              <span
                key={cat}
                className="zk-blog-cat-pill"
                style={{
                  padding: '8px 20px',
                  borderRadius: '30px',
                  fontSize: '13px',
                  fontWeight: 600,
                  border: '1px solid',
                  borderColor: i === 0 ? '#16120B' : 'rgba(0,0,0,0.12)',
                  background: i === 0 ? '#16120B' : '#FFFFFF',
                  color: i === 0 ? '#D4AF37' : '#555555',
                  letterSpacing: '0.2px',
                }}
              >
                {cat}
              </span>
            ))}
          </div>

          {/* Featured Article — Full Width */}
          {featured && (
            <Link
              href={`/blog/${featured.slug}`}
              className="zk-blog-feat"
              style={{
                display: 'block',
                borderRadius: '24px',
                overflow: 'hidden',
                background: '#16120B',
                boxShadow: '0 16px 40px rgba(0, 0, 0, 0.1)',
                textDecoration: 'none',
                marginBottom: '48px',
              }}
            >
              <div
                className="zk-blog-feat-inner"
                style={{ display: 'flex', minHeight: '380px' }}
              >
                {/* Image */}
                <div
                  className="zk-blog-feat-img-wrap"
                  style={{
                    flex: '1 1 55%',
                    position: 'relative',
                    overflow: 'hidden',
                    minHeight: '380px',
                  }}
                >
                  <img
                    src={featured.image}
                    alt={featured.title}
                    className="zk-blog-feat-img"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      display: 'block',
                      transition: 'transform 0.5s ease',
                    }}
                  />
                  {/* Featured badge */}
                  <div
                    style={{
                      position: 'absolute',
                      top: '18px',
                      left: '18px',
                      padding: '5px 14px',
                      borderRadius: '30px',
                      background: '#D4AF37',
                      color: '#16120B',
                      fontSize: '11px',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                    }}
                  >
                    <i className="fa-solid fa-bookmark" style={{ fontSize: '10px', marginRight: '5px' }}></i>
                    Featured Article
                  </div>
                </div>

                {/* Content */}
                <div
                  className="zk-blog-feat-content"
                  style={{
                    flex: '1 1 45%',
                    padding: '44px 40px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    color: '#FFFFFF',
                  }}
                >
                  {/* Category & Date */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '14px', flexWrap: 'wrap' }}>
                    <span
                      style={{
                        padding: '4px 12px',
                        borderRadius: '20px',
                        background: 'rgba(212, 175, 55, 0.15)',
                        border: '1px solid rgba(212, 175, 55, 0.3)',
                        color: '#D4AF37',
                        fontSize: '12px',
                        fontWeight: 600,
                      }}
                    >
                      {featured.category}
                    </span>
                    <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px' }}>
                      <i className="fa-regular fa-calendar" style={{ marginRight: '5px' }}></i>
                      {featured.date}
                    </span>
                    <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px' }}>
                      <i className="fa-regular fa-clock" style={{ marginRight: '5px' }}></i>
                      {featured.readTime}
                    </span>
                  </div>

                  <h3
                    style={{
                      fontSize: '26px',
                      fontWeight: 800,
                      lineHeight: 1.3,
                      marginBottom: '16px',
                      color: '#FFFFFF',
                    }}
                  >
                    {featured.title}
                  </h3>
                  <p
                    style={{
                      fontSize: '15px',
                      lineHeight: 1.7,
                      color: 'rgba(255, 255, 255, 0.6)',
                      marginBottom: '28px',
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}
                  >
                    {featured.excerpt}
                  </p>

                  {/* Author & Read Link */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div
                        style={{
                          width: '36px',
                          height: '36px',
                          borderRadius: '50%',
                          background: '#D4AF37',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 700,
                          fontSize: '14px',
                          color: '#16120B',
                        }}
                      >
                        {featured.author.charAt(0)}
                      </div>
                      <span style={{ fontSize: '13px', fontWeight: 600, color: 'rgba(255,255,255,0.7)' }}>
                        {featured.author}
                      </span>
                    </div>
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        color: '#D4AF37',
                        fontSize: '14px',
                        fontWeight: 700,
                      }}
                    >
                      Read Article <i className="fa-solid fa-arrow-right" style={{ fontSize: '12px' }}></i>
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          )}

          {/* Article Grid */}
          <div className="row gy-4">
            {remaining.map((post) => (
              <div key={post.slug} className="col-lg-4 col-md-6 col-sm-12">
                <article
                  className="zk-blog-card"
                  style={{
                    borderRadius: '20px',
                    overflow: 'hidden',
                    background: '#FFFFFF',
                    boxShadow: '0 8px 25px rgba(0, 0, 0, 0.06)',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  {/* Image Container */}
                  <Link
                    href={`/blog/${post.slug}`}
                    className="zk-blog-card-img-wrap"
                    style={{
                      display: 'block',
                      position: 'relative',
                      height: '230px',
                      overflow: 'hidden',
                      backgroundColor: '#EAE5DC',
                    }}
                  >
                    <img
                      src={post.image}
                      alt={post.title}
                      className="zk-blog-card-img"
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        display: 'block',
                        transition: 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
                      }}
                    />
                    {/* Category badge */}
                    <div
                      style={{
                        position: 'absolute',
                        top: '16px',
                        left: '16px',
                        padding: '5px 14px',
                        borderRadius: '20px',
                        background: 'rgba(22, 18, 11, 0.82)',
                        backdropFilter: 'blur(8px)',
                        WebkitBackdropFilter: 'blur(8px)',
                        color: '#FCF6BA',
                        border: '1px solid rgba(212, 175, 55, 0.3)',
                        fontSize: '11px',
                        fontWeight: 600,
                        letterSpacing: '0.3px',
                      }}
                    >
                      {post.category}
                    </div>
                  </Link>

                  {/* Content */}
                  <div
                    className="zk-blog-card-body"
                    style={{
                      padding: '24px 22px 20px',
                      display: 'flex',
                      flexDirection: 'column',
                      flexGrow: 1,
                    }}
                  >
                    {/* Date & Read Time */}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '14px',
                        marginBottom: '12px',
                        fontSize: '12px',
                        color: '#999999',
                        fontWeight: 500,
                      }}
                    >
                      <span>
                        <i className="fa-regular fa-calendar" style={{ marginRight: '4px', color: '#D4AF37' }}></i>
                        {post.date}
                      </span>
                      <span>
                        <i className="fa-regular fa-clock" style={{ marginRight: '4px', color: '#D4AF37' }}></i>
                        {post.readTime}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 style={{ marginBottom: '12px' }}>
                      <Link
                        href={`/blog/${post.slug}`}
                        className="zk-blog-card-title"
                        style={{
                          fontSize: '19px',
                          fontWeight: 700,
                          color: '#16120B',
                          lineHeight: 1.35,
                          textDecoration: 'none',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          transition: 'color 0.2s ease',
                        }}
                      >
                        {post.title}
                      </Link>
                    </h3>

                    {/* Excerpt */}
                    <p
                      style={{
                        fontSize: '14px',
                        lineHeight: 1.65,
                        color: '#777777',
                        marginBottom: '20px',
                        flexGrow: 1,
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}
                    >
                      {post.excerpt}
                    </p>

                    {/* Footer: Author + Read */}
                    <div
                      style={{
                        borderTop: '1px solid rgba(0,0,0,0.06)',
                        paddingTop: '16px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginTop: 'auto',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div
                          style={{
                            width: '30px',
                            height: '30px',
                            borderRadius: '50%',
                            background: '#D4AF37',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 700,
                            fontSize: '12px',
                            color: '#16120B',
                          }}
                        >
                          {post.author.charAt(0)}
                        </div>
                        <span style={{ fontSize: '12px', fontWeight: 600, color: '#555' }}>
                          {post.author}
                        </span>
                      </div>
                      <Link
                        href={`/blog/${post.slug}`}
                        className="zk-blog-read-link"
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          color: '#16120B',
                          fontSize: '13px',
                          fontWeight: 700,
                          textDecoration: 'none',
                        }}
                      >
                        Read <i className="fa-solid fa-arrow-right" style={{ fontSize: '11px' }}></i>
                      </Link>
                    </div>
                  </div>
                </article>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {posts.length === 0 && (
            <div style={{ textAlign: 'center', padding: '80px 20px' }}>
              <i className="fa-regular fa-newspaper" style={{ fontSize: '48px', color: '#D4AF37', marginBottom: '16px', display: 'block' }}></i>
              <h3 style={{ fontSize: '22px', fontWeight: 700, color: '#16120B', marginBottom: '8px' }}>No Articles Yet</h3>
              <p style={{ color: '#999', fontSize: '15px' }}>Check back soon for expert flooring guides and insights.</p>
            </div>
          )}

          {/* Direct Consultation / Advice Banner */}
          <div
            className="mt-5 p-4 d-flex flex-wrap align-items-center justify-content-between gap-3"
            style={{
              backgroundColor: '#16120B',
              borderRadius: '24px',
              border: '1px solid rgba(212, 175, 55, 0.35)',
              boxShadow: '0 12px 30px rgba(0,0,0,0.15)',
              overflow: 'hidden',
            }}
          >
            <div className="d-flex align-items-center gap-3">
              <div
                style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #BF953F, #FCF6BA, #B38728)',
                  color: '#16120B',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '20px',
                  fontWeight: 700,
                  flexShrink: 0,
                }}
              >
                <i className="fa-solid fa-phone"></i>
              </div>
              <div>
                <span style={{ fontSize: '11px', color: '#FCF6BA', textTransform: 'uppercase', letterSpacing: '0.6px', display: 'block' }}>
                  <EditableField path="callout.subtitle" fallback={callout.subtitle || "Need Expert Advice?"} />
                </span>
                <a
                  href={`tel:${(callout.phone || "07903 723 774").replace(/\s+/g, '')}`}
                  style={{ fontSize: '18px', fontWeight: 800, color: '#FFFFFF', textDecoration: 'none' }}
                >
                  <EditableField path="callout.phone" fallback={callout.phone || "07903 723 774"} />
                </a>
              </div>
            </div>

            <a
              href={callout.cta_link || "/contact"}
              className="theme-btn br-30"
              style={{
                background: 'linear-gradient(to right, #BF953F, #FCF6BA, #B38728, #FBF5B7, #AA771C)',
                color: '#16120B',
                fontWeight: 700,
                fontSize: '14px',
                padding: '12px 26px',
                border: 'none',
                borderRadius: '30px',
                textDecoration: 'none',
              }}
            >
              <span className="link-effect">
                <span className="effect-1"><EditableField path="callout.cta_text" fallback={callout.cta_text || "Contact Our Flooring Specialists"} /></span>
                <span className="effect-1"><EditableField path="callout.cta_text" fallback={callout.cta_text || "Contact Our Flooring Specialists"} /></span>
              </span>
            </a>
          </div>
        </div>
      </section>
    </main>
    </EditModeProvider>
  );
}
