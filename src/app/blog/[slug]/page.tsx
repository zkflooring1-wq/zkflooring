import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { blogPosts, BlogPost } from '@/data/blogPosts';

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: PageProps) {
  const resolvedParams = await params;
  const { data: dbPost } = await supabase.from('posts').select('*').eq('slug', resolvedParams.slug).single();

  // Try Supabase first, then local fallback
  if (dbPost) {
    const seoTitle = dbPost.seo_data?.seoTitle || dbPost.title;
    const seoDescription = dbPost.seo_data?.seoDescription || dbPost.seo_data?.excerpt || '';
    const author = dbPost.seo_data?.author || 'ZK Flooring';
    return {
      title: seoTitle,
      description: seoDescription,
      keywords: dbPost.tags?.join(', ') || '',
      openGraph: {
        title: seoTitle,
        description: seoDescription,
        images: [{ url: dbPost.featured_image || '' }],
        type: 'article' as const,
        publishedTime: dbPost.created_at,
        authors: [author],
      },
      twitter: {
        card: 'summary_large_image' as const,
        title: seoTitle,
        description: seoDescription,
        images: [dbPost.featured_image || ''],
      },
    };
  }

  const localPost = blogPosts.find(p => p.slug === resolvedParams.slug);
  if (localPost) {
    return {
      title: localPost.seoTitle,
      description: localPost.seoDescription,
      keywords: localPost.keywords.join(', '),
      openGraph: {
        title: localPost.seoTitle,
        description: localPost.seoDescription,
        images: [{ url: localPost.coverImage || '' }],
        type: 'article' as const,
        authors: [localPost.author],
      },
    };
  }

  return { title: 'Post Not Found | ZK Flooring' };
}

export default async function BlogPostPage({ params }: PageProps) {
  const resolvedParams = await params;
  const { data: dbPost } = await supabase.from('posts').select('*').eq('slug', resolvedParams.slug).single();

  // Normalize from either source
  let post: {
    slug: string;
    title: string;
    subtitle: string;
    excerpt: string;
    date: string;
    author: string;
    authorRole: string;
    readTime: string;
    category: string;
    image: string;
    content: string;
    aeoQuickAnswer: string;
    faqs: { question: string; answer: string }[];
  } | null = null;

  if (dbPost) {
    const category = (dbPost.categories && dbPost.categories.length > 0) ? dbPost.categories[0] : 'Flooring Insights';
    post = {
      slug: dbPost.slug,
      title: dbPost.title,
      subtitle: dbPost.seo_data?.seoDescription || '',
      excerpt: dbPost.seo_data?.excerpt || '',
      date: new Date(dbPost.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' }),
      author: dbPost.seo_data?.author || 'ZK Flooring',
      authorRole: 'Flooring Expert',
      readTime: `${Math.ceil((dbPost.content || '').length / 1000)} min read`,
      category,
      image: dbPost.featured_image || '/slider/Carpet.webp',
      content: dbPost.content || '',
      aeoQuickAnswer: dbPost.seo_data?.excerpt || '',
      faqs: [],
    };
  } else {
    const localPost = blogPosts.find(p => p.slug === resolvedParams.slug);
    if (localPost) {
      post = {
        slug: localPost.slug,
        title: localPost.title,
        subtitle: localPost.subtitle,
        excerpt: localPost.excerpt,
        date: localPost.date,
        author: localPost.author,
        authorRole: localPost.authorRole,
        readTime: localPost.readTime,
        category: localPost.category,
        image: localPost.coverImage || '/slider/Carpet.webp',
        content: localPost.content,
        aeoQuickAnswer: localPost.aeoQuickAnswer,
        faqs: localPost.faqs || [],
      };
    }
  }

  if (!post) {
    notFound();
  }

  // Gather related posts
  const { data: dbRelated } = await supabase.from('posts').select('*').neq('slug', resolvedParams.slug).eq('status', 'published').limit(3);
  const relatedPosts: { slug: string; title: string; category: string; image: string; date: string; readTime: string }[] =
    (dbRelated && dbRelated.length > 0)
      ? dbRelated.map((r: any) => ({
          slug: r.slug,
          title: r.title,
          category: (r.categories && r.categories.length > 0) ? r.categories[0] : 'Blog',
          image: r.featured_image || '/slider/Carpet.webp',
          date: new Date(r.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
          readTime: `${Math.ceil((r.content || '').length / 1000)} min read`,
        }))
      : blogPosts
          .filter(bp => bp.slug !== resolvedParams.slug)
          .slice(0, 3)
          .map(bp => ({
            slug: bp.slug,
            title: bp.title,
            category: bp.category,
            image: bp.coverImage || '/slider/Carpet.webp',
            date: bp.date,
            readTime: bp.readTime,
          }));

  // Article JSON-LD Structured Data
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt,
    image: post.image,
    datePublished: post.date,
    author: {
      '@type': 'Person',
      name: post.author,
    },
    publisher: {
      '@type': 'Organization',
      name: 'ZK Flooring',
      logo: {
        '@type': 'ImageObject',
        url: 'https://zkflooring.co.uk/zk-logo.png',
      },
    },
  };

  // Render markdown-like content blocks
  const renderContent = (rawContent: string) => {
    if (!rawContent) return null;
    
    // Support HTML content if it's authored via a rich text editor
    if (rawContent.includes('<p>') || rawContent.includes('<h2>') || rawContent.includes('<h1>')) {
      return (
        <div className="html-blog-content" dangerouslySetInnerHTML={{ __html: rawContent }} />
      );
    }

    // Normalize Windows line endings to Unix line endings
    const normalizedContent = rawContent.replace(/\r\n/g, '\n');
    const blocks = normalizedContent.trim().split('\n\n');
    return blocks.map((block, index) => {
      const trimmed = block.trim();
      if (!trimmed) return null;

      // H1
      if (trimmed.startsWith('# ') && !trimmed.startsWith('## ') && !trimmed.startsWith('### ')) {
        return (
          <h2 key={index} style={{ fontSize: '28px', fontWeight: 800, color: '#16120B', marginTop: '40px', marginBottom: '18px', lineHeight: 1.3 }}>
            {trimmed.replace(/^# /, '')}
          </h2>
        );
      }
      // H2
      if (trimmed.startsWith('## ') && !trimmed.startsWith('### ')) {
        return (
          <h3 key={index} style={{ fontSize: '22px', fontWeight: 700, color: '#16120B', marginTop: '36px', marginBottom: '14px', lineHeight: 1.35, borderLeft: '3px solid #D4AF37', paddingLeft: '14px' }}>
            {trimmed.replace(/^## /, '')}
          </h3>
        );
      }
      // H3
      if (trimmed.startsWith('### ')) {
        return (
          <h4 key={index} style={{ fontSize: '18px', fontWeight: 700, color: '#333', marginTop: '28px', marginBottom: '12px', lineHeight: 1.4 }}>
            {trimmed.replace(/^### /, '')}
          </h4>
        );
      }
      // HR
      if (trimmed === '---') {
        return <hr key={index} style={{ margin: '32px 0', border: 'none', borderTop: '1px solid rgba(212, 175, 55, 0.2)' }} />;
      }
      // Table
      if (trimmed.includes('|') && trimmed.split('\n').length > 2) {
        const rows = trimmed.split('\n').filter(r => !r.includes(':---'));
        return (
          <div key={index} className="table-responsive" style={{ margin: '24px 0', borderRadius: '12px', overflow: 'hidden', border: '1px solid rgba(0,0,0,0.08)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
              <tbody>
                {rows.map((row, rIdx) => {
                  const cols = row.split('|').filter(c => c.trim() !== '');
                  if (rIdx === 0) {
                    return (
                      <tr key={rIdx} style={{ background: '#16120B' }}>
                        {cols.map((col, cIdx) => (
                          <th key={cIdx} style={{ padding: '14px 16px', color: '#D4AF37', fontWeight: 700, fontSize: '13px', textAlign: 'left', whiteSpace: 'nowrap' }}>
                            {col.trim().replace(/\*\*/g, '')}
                          </th>
                        ))}
                      </tr>
                    );
                  }
                  return (
                    <tr key={rIdx} style={{ background: rIdx % 2 === 0 ? '#FFFFFF' : '#f9f8f5' }}>
                      {cols.map((col, cIdx) => (
                        <td key={cIdx} style={{ padding: '12px 16px', color: '#444', borderTop: '1px solid rgba(0,0,0,0.05)', fontSize: '13px' }}>
                          {col.trim().replace(/\*\*/g, '')}
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        );
      }
      // Unordered list
      if (trimmed.split('\n').every(l => l.trim().startsWith('* ') || l.trim().startsWith('- '))) {
        const items = trimmed.split('\n').map(l => l.trim().replace(/^\*\s|^-\s/, ''));
        return (
          <ul key={index} style={{ margin: '16px 0', paddingLeft: '0', listStyle: 'none' }}>
            {items.map((item, iIdx) => (
              <li key={iIdx} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginBottom: '10px', fontSize: '15px', lineHeight: 1.65, color: '#555' }}>
                <i className="fa-solid fa-circle-check" style={{ color: '#D4AF37', fontSize: '14px', marginTop: '4px', flexShrink: 0 }}></i>
                <span>
                  {item.split('**').map((part, pIdx) =>
                    pIdx % 2 === 1 ? <strong key={pIdx} style={{ color: '#16120B' }}>{part}</strong> : part
                  )}
                </span>
              </li>
            ))}
          </ul>
        );
      }
      // Ordered list
      if (trimmed.split('\n').every(l => /^\d+\.\s/.test(l.trim()))) {
        const items = trimmed.split('\n').map(l => l.trim().replace(/^\d+\.\s/, ''));
        return (
          <ol key={index} style={{ margin: '16px 0', paddingLeft: '0', listStyle: 'none', counterReset: 'item' }}>
            {items.map((item, iIdx) => (
              <li key={iIdx} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '12px', fontSize: '15px', lineHeight: 1.65, color: '#555' }}>
                <span style={{
                  width: '28px', height: '28px', borderRadius: '8px',
                  background: 'rgba(212, 175, 55, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '13px', fontWeight: 700, color: '#D4AF37', flexShrink: 0, marginTop: '1px',
                }}>{iIdx + 1}</span>
                <span>
                  {item.split('**').map((part, pIdx) =>
                    pIdx % 2 === 1 ? <strong key={pIdx} style={{ color: '#16120B' }}>{part}</strong> : part
                  )}
                </span>
              </li>
            ))}
          </ol>
        );
      }
      // Paragraph with **bold** support
      return (
        <p key={index} style={{ fontSize: '16px', lineHeight: 1.85, color: '#555', marginBottom: '18px' }}>
          {trimmed.split('**').map((part, pIdx) =>
            pIdx % 2 === 1 ? <strong key={pIdx} style={{ color: '#16120B', fontWeight: 600 }}>{part}</strong> : part
          )}
        </p>
      );
    });
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />

      <main>
        <style>{`
          .zk-post-hero-wrap:hover .zk-post-hero-img {
            transform: scale(1.02);
          }
          .zk-post-related-card {
            transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.35s ease;
          }
          .zk-post-related-card:hover {
            transform: translateY(-6px);
            box-shadow: 0 22px 44px rgba(0, 0, 0, 0.12) !important;
          }
          .zk-post-cta-btn {
            transition: all 0.25s ease;
          }
          .zk-post-cta-btn:hover {
            filter: brightness(1.12);
            transform: translateY(-2px);
            box-shadow: 0 8px 24px rgba(212, 175, 55, 0.45) !important;
          }
          .zk-post-faq-item {
            transition: background 0.2s ease;
          }
          .zk-post-faq-item:hover {
            background: rgba(212, 175, 55, 0.04) !important;
          }
          .html-blog-content h1, .html-blog-content h2, .html-blog-content h3, .html-blog-content h4 {
            color: #16120B;
            font-weight: 700;
            margin-top: 1.5em;
            margin-bottom: 0.75em;
          }
          .html-blog-content p, .html-blog-content li {
            font-size: 16px;
            line-height: 1.85;
            color: #555;
            margin-bottom: 1.2em;
          }
          .html-blog-content a {
            color: #D4AF37;
            text-decoration: underline;
          }
          .html-blog-content img {
            max-width: 100%;
            height: auto;
            border-radius: 12px;
            margin: 1.5em 0;
          }
          @media (max-width: 991px) {
            .zk-post-sidebar { margin-top: 40px !important; }
          }
          @media (max-width: 575px) {
            .zk-post-hero-wrap { height: 260px !important; }
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
                      <h2 className="title">Blog Article</h2>
                      <ul className="page-breadcrumb">
                        <li><a href="/"><i className="fa-solid fa-house-chimney"></i>Home</a></li>
                        <li><span>/</span><a href="/blog"> Blog</a></li>
                        <li><span>/</span> Article</li>
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

        {/* Article Content */}
        <section className="space bg-light">
          <div className="container">
            {/* Article Header */}
            <div style={{ maxWidth: '860px', margin: '0 auto 36px' }}>
              {/* Category, Date, Reading Time */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '18px', flexWrap: 'wrap' }}>
                <span
                  style={{
                    padding: '5px 16px',
                    borderRadius: '30px',
                    background: 'linear-gradient(135deg, #BF953F 0%, #FCF6BA 50%, #B38728 100%)',
                    color: '#16120B',
                    fontSize: '12px',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.4px',
                  }}
                >
                  {post.category}
                </span>
                <span style={{ fontSize: '13px', color: '#999', fontWeight: 500 }}>
                  <i className="fa-regular fa-calendar" style={{ marginRight: '5px', color: '#D4AF37' }}></i>
                  {post.date}
                </span>
                <span style={{ fontSize: '13px', color: '#999', fontWeight: 500 }}>
                  <i className="fa-regular fa-clock" style={{ marginRight: '5px', color: '#D4AF37' }}></i>
                  {post.readTime}
                </span>
              </div>

              {/* Title */}
              <h1
                style={{
                  fontSize: '38px',
                  fontWeight: 800,
                  color: '#16120B',
                  lineHeight: 1.2,
                  marginBottom: '16px',
                }}
              >
                {post.title}
              </h1>

              {/* Subtitle / Excerpt */}
              {post.subtitle && (
                <p style={{ fontSize: '17px', lineHeight: 1.6, color: '#777', marginBottom: '0' }}>
                  {post.subtitle}
                </p>
              )}
            </div>

            {/* Hero Image */}
            <div
              className="zk-post-hero-wrap"
              style={{
                position: 'relative',
                borderRadius: '24px',
                overflow: 'hidden',
                height: '440px',
                marginBottom: '16px',
                boxShadow: '0 16px 40px rgba(0, 0, 0, 0.1)',
                maxWidth: '860px',
                margin: '0 auto 16px',
              }}
            >
              <img
                src={post.image}
                alt={post.title}
                className="zk-post-hero-img"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  display: 'block',
                  transition: 'transform 0.6s ease',
                }}
              />
            </div>

            {/* Author Bar */}
            <div
              style={{
                maxWidth: '860px',
                margin: '0 auto 44px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '18px 24px',
                borderRadius: '14px',
                background: '#FFFFFF',
                boxShadow: '0 4px 14px rgba(0, 0, 0, 0.04)',
                border: '1px solid rgba(0,0,0,0.05)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, #BF953F 0%, #FCF6BA 50%, #B38728 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 800,
                    fontSize: '18px',
                    color: '#16120B',
                  }}
                >
                  {post.author.charAt(0)}
                </div>
                <div>
                  <div style={{ fontSize: '15px', fontWeight: 700, color: '#16120B' }}>{post.author}</div>
                  <div style={{ fontSize: '12px', color: '#999' }}>{post.authorRole}</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', color: '#999' }}>
                <i className="fa-solid fa-book-open" style={{ color: '#D4AF37' }}></i>
                {post.readTime}
              </div>
            </div>

            {/* Main Content + Sidebar */}
            <div className="row" style={{ maxWidth: '1100px', margin: '0 auto' }}>
              {/* Left: Article Body */}
              <div className="col-lg-8">
                {/* AEO Quick Answer Box */}
                {post.aeoQuickAnswer && (
                  <div
                    style={{
                      padding: '24px 28px',
                      marginBottom: '36px',
                      borderRadius: '16px',
                      background: '#FFFFFF',
                      border: '1px solid rgba(212, 175, 55, 0.2)',
                      borderLeft: '4px solid #D4AF37',
                      boxShadow: '0 4px 14px rgba(0, 0, 0, 0.04)',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px', fontSize: '14px', fontWeight: 700, color: '#D4AF37' }}>
                      <i className="fa-solid fa-bolt"></i> Key Takeaway
                    </div>
                    <p style={{ fontSize: '15px', lineHeight: 1.7, color: '#444', margin: 0 }}>
                      {post.aeoQuickAnswer}
                    </p>
                  </div>
                )}

                {/* Article Body */}
                <div
                  style={{
                    background: '#FFFFFF',
                    padding: '40px 36px',
                    borderRadius: '20px',
                    boxShadow: '0 6px 20px rgba(0, 0, 0, 0.04)',
                    border: '1px solid rgba(0,0,0,0.05)',
                    marginBottom: '40px',
                  }}
                >
                  {renderContent(post.content)}
                </div>

                {/* FAQ Section */}
                {post.faqs && post.faqs.length > 0 && (
                  <div
                    style={{
                      background: '#FFFFFF',
                      padding: '36px',
                      borderRadius: '20px',
                      boxShadow: '0 6px 20px rgba(0, 0, 0, 0.04)',
                      border: '1px solid rgba(0,0,0,0.05)',
                      marginBottom: '40px',
                    }}
                  >
                    <h3 style={{ fontSize: '22px', fontWeight: 700, color: '#16120B', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: '36px',
                          height: '36px',
                          borderRadius: '10px',
                          background: 'linear-gradient(135deg, #BF953F 0%, #FCF6BA 50%, #B38728 100%)',
                        }}
                      >
                        <i className="fa-solid fa-circle-question" style={{ color: '#16120B', fontSize: '15px' }}></i>
                      </span>
                      Frequently Asked Questions
                    </h3>
                    {post.faqs.map((faq, fIdx) => (
                      <div
                        key={fIdx}
                        className="zk-post-faq-item"
                        style={{
                          padding: '20px',
                          borderRadius: '12px',
                          border: '1px solid rgba(0,0,0,0.06)',
                          marginBottom: fIdx < post.faqs.length - 1 ? '12px' : '0',
                        }}
                      >
                        <h4 style={{ fontSize: '15px', fontWeight: 700, color: '#16120B', marginBottom: '8px', display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                          <i className="fa-solid fa-chevron-right" style={{ color: '#D4AF37', fontSize: '12px', marginTop: '3px', flexShrink: 0 }}></i>
                          {faq.question}
                        </h4>
                        <p style={{ fontSize: '14px', lineHeight: 1.7, color: '#666', margin: 0, paddingLeft: '20px' }}>
                          {faq.answer}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Right: Sidebar */}
              <div className="col-lg-4">
                <div className="zk-post-sidebar" style={{ position: 'sticky', top: '120px' }}>
                  {/* CTA Card */}
                  <div
                    style={{
                      borderRadius: '20px',
                      overflow: 'hidden',
                      background: '#16120B',
                      padding: '36px 28px',
                      marginBottom: '28px',
                      boxShadow: '0 12px 35px rgba(0, 0, 0, 0.1)',
                    }}
                  >
                    <div
                      style={{
                        width: '52px',
                        height: '52px',
                        borderRadius: '14px',
                        background: 'linear-gradient(135deg, #BF953F 0%, #FCF6BA 50%, #B38728 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: '18px',
                      }}
                    >
                      <i className="fa-solid fa-phone" style={{ color: '#16120B', fontSize: '20px' }}></i>
                    </div>
                    <h4 style={{ fontSize: '19px', fontWeight: 700, color: '#FFFFFF', marginBottom: '8px' }}>
                      Need Flooring Advice?
                    </h4>
                    <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.6)', lineHeight: 1.6, marginBottom: '22px' }}>
                      Our certified installers are here to help. Get a free survey and quote for your flooring project.
                    </p>
                    <a
                      href="tel:07903723774"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        color: '#D4AF37',
                        fontSize: '20px',
                        fontWeight: 800,
                        textDecoration: 'none',
                        marginBottom: '18px',
                      }}
                    >
                      <i className="fa-solid fa-phone-volume" style={{ fontSize: '16px' }}></i>
                      07903 723 774
                    </a>
                    <Link
                      href="/contact"
                      className="zk-post-cta-btn"
                      style={{
                        display: 'block',
                        width: '100%',
                        textAlign: 'center',
                        padding: '13px 24px',
                        borderRadius: '12px',
                        background: 'linear-gradient(135deg, #BF953F 0%, #FCF6BA 50%, #B38728 100%)',
                        color: '#16120B',
                        fontWeight: 700,
                        fontSize: '14px',
                        textDecoration: 'none',
                        boxShadow: '0 4px 15px rgba(179, 135, 40, 0.35)',
                      }}
                    >
                      Get Free Quote <i className="fa-solid fa-arrow-right" style={{ fontSize: '12px', marginLeft: '4px' }}></i>
                    </Link>
                  </div>

                  {/* Services Quick Links */}
                  <div
                    style={{
                      borderRadius: '20px',
                      padding: '28px',
                      background: '#FFFFFF',
                      border: '1px solid rgba(212, 175, 55, 0.15)',
                      boxShadow: '0 6px 20px rgba(0, 0, 0, 0.04)',
                      marginBottom: '28px',
                    }}
                  >
                    <h4 style={{ fontSize: '16px', fontWeight: 700, color: '#16120B', marginBottom: '18px' }}>
                      Our Services
                    </h4>
                    {[
                      { name: 'Carpet & Carpet Tile Fitting', slug: 'carpet-fitting' },
                      { name: 'Luxury Vinyl Tile (LVT)', slug: 'luxury-vinyl-tile' },
                      { name: 'Self Levelling & Subfloor Prep', slug: 'subfloor-preparation' },
                      { name: 'Solid & Engineered Hardwood', slug: 'hardwood-flooring' },
                      { name: 'Laminate Flooring', slug: 'laminate-flooring' },
                      { name: 'Commercial Safety Flooring', slug: 'commercial-flooring' },
                    ].map((svc, i) => (
                      <Link
                        key={i}
                        href={`/services/${svc.slug}`}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          padding: '10px 0',
                          borderBottom: i < 5 ? '1px solid rgba(0,0,0,0.05)' : 'none',
                          textDecoration: 'none',
                          color: '#555',
                          fontSize: '14px',
                          fontWeight: 500,
                          transition: 'color 0.2s ease',
                        }}
                      >
                        <i className="fa-solid fa-chevron-right" style={{ color: '#D4AF37', fontSize: '10px' }}></i>
                        {svc.name}
                      </Link>
                    ))}
                  </div>

                  {/* Browse All Articles */}
                  <Link
                    href="/blog"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      padding: '14px 24px',
                      borderRadius: '14px',
                      border: '2px solid rgba(212, 175, 55, 0.4)',
                      background: 'transparent',
                      color: '#16120B',
                      fontWeight: 700,
                      fontSize: '14px',
                      textDecoration: 'none',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <i className="fa-solid fa-arrow-left" style={{ fontSize: '12px' }}></i>
                    Browse All Articles
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Related Articles */}
        {relatedPosts.length > 0 && (
          <section className="bg-light" style={{ paddingBottom: '100px' }}>
            <div className="container">
              <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                <h2 style={{ fontSize: '28px', fontWeight: 800, color: '#16120B' }}>Related Articles</h2>
                <p style={{ color: '#777', fontSize: '14px', marginTop: '6px' }}>
                  Continue exploring our flooring guides and expert advice
                </p>
              </div>
              <div className="row gy-4" style={{ maxWidth: '1000px', margin: '0 auto' }}>
                {relatedPosts.map((rp) => (
                  <div key={rp.slug} className="col-lg-4 col-md-6">
                    <Link
                      href={`/blog/${rp.slug}`}
                      className="zk-post-related-card"
                      style={{
                        display: 'block',
                        borderRadius: '18px',
                        overflow: 'hidden',
                        background: '#FFFFFF',
                        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.06)',
                        textDecoration: 'none',
                        height: '100%',
                      }}
                    >
                      <div style={{ position: 'relative', height: '200px', overflow: 'hidden' }}>
                        <img
                          src={rp.image}
                          alt={rp.title}
                          className="zk-post-related-img"
                          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.5s ease' }}
                        />
                        <div
                          style={{
                            position: 'absolute',
                            top: '12px',
                            left: '12px',
                            padding: '4px 12px',
                            borderRadius: '20px',
                            background: 'rgba(22, 18, 11, 0.8)',
                            backdropFilter: 'blur(8px)',
                            WebkitBackdropFilter: 'blur(8px)',
                            color: '#D4AF37',
                            fontSize: '11px',
                            fontWeight: 600,
                          }}
                        >
                          {rp.category}
                        </div>
                      </div>
                      <div style={{ padding: '20px 20px 22px' }}>
                        <div style={{ fontSize: '12px', color: '#999', marginBottom: '8px' }}>
                          <i className="fa-regular fa-calendar" style={{ marginRight: '4px', color: '#D4AF37' }}></i>
                          {rp.date}
                          <span style={{ margin: '0 8px' }}>·</span>
                          {rp.readTime}
                        </div>
                        <h4 style={{ fontSize: '16px', fontWeight: 700, color: '#16120B', lineHeight: 1.35, margin: 0, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                          {rp.title}
                        </h4>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
    </>
  );
}
