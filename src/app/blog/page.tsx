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
      <main className="bg-[#FAF8F5] min-h-screen">
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
        <section className="py-16 md:py-20">
          <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="text-center max-w-3xl mx-auto mb-12">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#16120B]/5 border border-[#16120B]/10 text-[#8a6820] text-xs font-bold uppercase tracking-wider mb-3">
                <i className="fa-solid fa-sparkles text-[#B38728]"></i>
                <EditableField path="header.badge" fallback={header.badge || "Expert Knowledge & Guides"} />
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#16120B] tracking-tight font-[var(--font-heading)] mb-4">
                <EditableField path="header.title" fallback={header.title || "Flooring Insights & Buying Guides"} isHtml />
              </h1>
              <p className="text-sm sm:text-base text-[#6b6255] leading-relaxed">
                <EditableField
                  path="header.description"
                  fallback={header.description || "Professional advice, technical guides, and buying insights from our certified flooring specialists in Birmingham."}
                />
              </p>
            </div>

            {/* Interactive Blog Feed (Category Filtering + Live Search + Featured Hero + 3-Col Grid) */}
            <BlogFeed posts={combinedPosts} categories={categories} />

            {/* Premium Consultation Callout Card */}
            <div className="mt-16 bg-gradient-to-r from-[#16120B] via-[#241e15] to-[#16120B] border border-[#D4AF37]/30 rounded-3xl p-8 md:p-12 text-white shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-96 h-96 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />
              
              <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
                <div className="space-y-3 text-center lg:text-left">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[#FCF6BA] text-xs font-bold">
                    <i className="fa-solid fa-ruler-combined text-[#D4AF37]"></i>
                    Birmingham & West Midlands
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-extrabold font-[var(--font-heading)] text-white">
                    Need Advice for Your Property?
                  </h3>
                  <p className="text-xs sm:text-sm text-[#c8bfae] max-w-xl">
                    Get in touch with our master fitters for honest advice, material samples brought to your home, and a 100% free laser survey with zero obligation.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4 shrink-0">
                  <a
                    href="tel:07903723774"
                    className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs flex items-center justify-center gap-2.5 transition-all"
                  >
                    <i className="fa-solid fa-phone text-[#D4AF37]"></i>
                    07903 723 774
                  </a>
                  <Link
                    href="/contact"
                    className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-gradient-to-r from-[#BF953F] via-[#FCF6BA] to-[#B38728] text-[#16120B] font-extrabold text-xs flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-gold-500/20 hover:scale-[1.02]"
                  >
                    Book Free Survey
                    <i className="fa-solid fa-arrow-right text-xs"></i>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </EditModeProvider>
  );
}
