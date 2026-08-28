import React from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { blogPosts, BlogPost } from '@/data/blogPosts';
import { EditModeProvider } from '@/components/editor/EditModeProvider';
import { EditableField } from '@/components/editor/EditableField';
import BlogFeed, { BlogItem } from '@/components/blog/BlogFeed';

export const metadata = {
  title: 'Flooring Insights & Buying Guides Birmingham | ZK Flooring Blog',
  description:
    'Expert flooring advice, technical buying guides, and British Standards installation tips for LVT, Laminate, Carpet Underlays, and Hardwood in Birmingham & West Midlands.',
};

const DEFAULT_BLOG_PAGE_DATA = {
  breadcrumb: {
    title: "Flooring Insights",
    subtitle: "Blog"
  },
  header: {
    badge: "Expert Knowledge & Guides",
    title: "Flooring Insights & Buying Guides",
    description: "Professional advice, technical guides, and buying insights from our certified flooring specialists in Birmingham."
  },
  callout: {
    subtitle: "Need Expert Advice?",
    phone: "07903 723 774",
    cta_text: "Book Free Laser Survey",
    cta_link: "/contact"
  }
};

export default async function BlogIndexPage() {
  const [postsRes, pageRes] = await Promise.all([
    supabase.from('posts').select('*').eq('status', 'published').order('created_at', { ascending: false }),
    supabase.from('pages').select('sections').eq('slug', 'blog').maybeSingle()
  ]);

  const dbPosts = postsRes.data || [];
  const sections = pageRes.data?.sections || DEFAULT_BLOG_PAGE_DATA;
  const breadcrumb = sections.breadcrumb || DEFAULT_BLOG_PAGE_DATA.breadcrumb;
  const header = sections.header || DEFAULT_BLOG_PAGE_DATA.header;
  const callout = sections.callout || DEFAULT_BLOG_PAGE_DATA.callout;

  const fallbackCuratedImages = [
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1534349762230-e0cadf78f5da?auto=format&fit=crop&w=1200&q=80",
  ];

  // 1. Normalized DB posts
  const dbMapped: BlogItem[] = dbPosts.map((p: any, idx: number) => ({
    slug: p.slug,
    title: p.title,
    excerpt: p.seo_data?.excerpt || p.excerpt || p.seo_data?.seoDescription || 'Read our expert flooring guide and professional recommendations for UK properties.',
    category: (p.categories && p.categories.length > 0) ? p.categories[0] : 'Flooring Insights',
    date: new Date(p.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
    readTime: `${Math.max(4, Math.ceil((p.content || '').length / 900))} min read`,
    author: p.author || p.seo_data?.author || 'ZK Flooring Specialist',
    image: p.featured_image || fallbackCuratedImages[idx % fallbackCuratedImages.length],
  }));

  // 2. Pre-curated high-value guides from blogPosts data
  const staticMapped: BlogItem[] = blogPosts.map((bp: BlogPost, idx: number) => ({
    slug: bp.slug,
    title: bp.title,
    excerpt: bp.excerpt,
    category: bp.category,
    date: bp.date,
    readTime: bp.readTime,
    author: bp.author,
    image: bp.coverImage || fallbackCuratedImages[(idx + 2) % fallbackCuratedImages.length],
  }));

  // 3. Combine unique posts (DB posts take priority, static posts fill remaining slots)
  const seenSlugs = new Set<string>();
  const combinedPosts: BlogItem[] = [];

  for (const item of [...dbMapped, ...staticMapped]) {
    if (!seenSlugs.has(item.slug)) {
      seenSlugs.add(item.slug);
      combinedPosts.push(item);
    }
  }

  // Categories list
  const categories = [
    'All Articles',
    'Flooring Comparison',
    'Carpet & Underlay',
    'LVT & Vinyl',
    'Hardwood & Screed',
    'Home Improvement',
  ];

  return (
    <EditModeProvider initialData={sections}>
      <main>
        {/* Metallic Gold Breadcrumb Section */}
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
                      <h2 className="title">
                        <EditableField path="breadcrumb.title" fallback={breadcrumb.title || "Flooring Insights"} />
                      </h2>
                      <ul className="page-breadcrumb">
                        <li>
                          <Link href="/"><i className="fa-solid fa-house-chimney"></i>Home</Link>
                        </li>
                        <li>
                          <span>/</span> <EditableField path="breadcrumb.subtitle" fallback={breadcrumb.subtitle || "Blog"} />
                        </li>
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

        {/* Main Content Area */}
        <section className="zk-blog-page-wrap">
          <div className="container">
            {/* Section Header */}
            <div className="text-center mb-50">
              <div className="sub-title-2 text-theme" style={{ marginBottom: '10px' }}>
                <i className="fa-solid fa-circle-check" style={{ marginRight: '6px' }}></i>
                <EditableField path="header.badge" fallback={header.badge || "Expert Knowledge & Guides"} />
              </div>
              <h2 className="sec-title" style={{ fontSize: '38px', fontWeight: 800, color: '#16120B', marginBottom: '12px' }}>
                <EditableField path="header.title" fallback={header.title || "Flooring Insights & Buying Guides"} isHtml />
              </h2>
              <p style={{ maxWidth: '640px', margin: '0 auto', fontSize: '15px', color: '#6b6255', lineHeight: 1.6 }}>
                <EditableField
                  path="header.description"
                  fallback={header.description || "Professional advice, technical guides, and buying insights from our certified flooring specialists in Birmingham."}
                />
              </p>
            </div>

            {/* Interactive Blog Feed (Bootstrap Grid & Filters) */}
            <BlogFeed posts={combinedPosts} categories={categories} />

            {/* Consultation CTA Banner */}
            <div className="zk-blog-cta-banner">
              <div className="row align-items-center">
                <div className="col-lg-8 mb-lg-0 mb-4 text-lg-start text-center">
                  <div
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      background: 'rgba(212, 175, 55, 0.18)',
                      border: '1px solid rgba(212, 175, 55, 0.4)',
                      color: '#FCF6BA',
                      padding: '4px 14px',
                      borderRadius: '30px',
                      fontSize: '11.5px',
                      fontWeight: 700,
                      marginBottom: '14px',
                    }}
                  >
                    <i className="fa-solid fa-ruler-combined" style={{ color: '#D4AF37' }}></i>
                    Birmingham & West Midlands
                  </div>
                  <h3 style={{ fontSize: '28px', fontWeight: 800, color: '#ffffff', marginBottom: '10px' }}>
                    Need Advice for Your Property?
                  </h3>
                  <p style={{ fontSize: '14px', color: '#d0c6b6', margin: 0, lineHeight: 1.6, maxWidth: '580px' }}>
                    Get in touch with our master fitters for honest advice, material samples brought to your home, and a 100% free laser survey with zero obligation.
                  </p>
                </div>

                <div className="col-lg-4 text-lg-end text-center">
                  <div style={{ display: 'inline-flex', flexDirection: 'column', gap: '10px', width: '100%', maxWidth: '280px' }}>
                    <a
                      href="tel:07903723774"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        padding: '12px 20px',
                        borderRadius: '16px',
                        background: 'rgba(255, 255, 255, 0.12)',
                        border: '1px solid rgba(255, 255, 255, 0.25)',
                        color: '#ffffff',
                        fontWeight: 700,
                        fontSize: '13px',
                        textDecoration: 'none',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      <i className="fa-solid fa-phone" style={{ color: '#D4AF37' }}></i>
                      07903 723 774
                    </a>
                    <Link
                      href="/contact"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        padding: '13px 20px',
                        borderRadius: '16px',
                        background: 'linear-gradient(135deg, #BF953F, #FCF6BA, #B38728)',
                        color: '#16120B',
                        fontWeight: 800,
                        fontSize: '13px',
                        textDecoration: 'none',
                        boxShadow: '0 6px 20px rgba(179, 135, 40, 0.3)',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      Book Free Survey
                      <i className="fa-solid fa-arrow-right" style={{ fontSize: '11px' }}></i>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </EditModeProvider>
  );
}
