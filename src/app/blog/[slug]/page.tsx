import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { supabase } from '@/lib/supabase';

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: PageProps) {
  const resolvedParams = await params;
  const { data: post } = await supabase.from('posts').select('*').eq('slug', resolvedParams.slug).single();

  if (!post) {
    return {
      title: 'Post Not Found | ZK Flooring',
    };
  }

  const seoTitle = post.seo_data?.seoTitle || post.title;
  const seoDescription = post.seo_data?.seoDescription || post.seo_data?.excerpt || '';
  const author = post.seo_data?.author || 'ZK Flooring';

  return {
    title: seoTitle,
    description: seoDescription,
    keywords: post.tags?.join(', ') || '',
    openGraph: {
      title: seoTitle,
      description: seoDescription,
      images: [{ url: post.featured_image || '' }],
      type: 'article',
      publishedTime: post.created_at,
      authors: [author],
    },
    twitter: {
      card: 'summary_large_image',
      title: seoTitle,
      description: seoDescription,
      images: [post.featured_image || ''],
    },
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const resolvedParams = await params;
  const { data: post } = await supabase.from('posts').select('*').eq('slug', resolvedParams.slug).single();

  if (!post) {
    notFound();
  }

  const { data: relatedData } = await supabase.from('posts').select('*').neq('slug', resolvedParams.slug).limit(3);
  const relatedPosts = relatedData || [];

  const seoTitle = post.seo_data?.seoTitle || post.title;
  const seoDescription = post.seo_data?.seoDescription || post.seo_data?.excerpt || '';
  const author = post.seo_data?.author || 'ZK Flooring';
  const aeoQuickAnswer = post.seo_data?.excerpt || '';
  const category = (post.categories && post.categories.length > 0) ? post.categories[0] : 'Flooring Insights';

  // Article JSON-LD Structured Data
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: seoDescription,
    image: `https://zkflooring.co.uk${post.featured_image || ''}`,
    datePublished: post.created_at,
    author: {
      '@type': 'Person',
      name: author,
    },
    publisher: {
      '@type': 'Organization',
      name: 'ZK Flooring',
      logo: {
        '@type': 'ImageObject',
        url: 'https://zkflooring.co.uk/assets/images/logo/logo.webp',
      },
    }
  };

  const faqSchema = {};

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <main className="bg-light pb-80 pt-40">
        {/* Breadcrumb / Top Bar */}
        <div className="container py-3 mb-4 border-bottom">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb mb-0">
              <li className="breadcrumb-item">
                <Link href="/" className="text-theme font-weight-bold">Home</Link>
              </li>
              <li className="breadcrumb-item">
                <Link href="/blog" className="text-theme font-weight-bold">Blog</Link>
              </li>
              <li className="breadcrumb-item active text-truncate max-w-400" aria-current="page">
                {post.title}
              </li>
            </ol>
          </nav>
        </div>

        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-9 col-xl-8">
              
              {/* Category & Date */}
              <div className="d-flex align-items-center gap-3 mb-3">
                <span className="badge bg-theme text-white px-3 py-2 fs-6 rounded-pill">
                  {category}
                </span>
                <span className="text-muted fs-6">
                  <i className="fa-regular fa-calendar-days me-2"></i>{new Date(post.created_at).toLocaleDateString()}
                </span>
                <span className="text-muted fs-6">
                  <i className="fa-regular fa-clock me-2"></i>{Math.ceil(post.content.length / 1000)} Min Read
                </span>
              </div>

              {/* Title & Subtitle */}
              <h1 className="fw-bold mb-3 display-5 text-dark">
                {post.title}
              </h1>
              <p className="lead text-muted mb-4 fs-5">
                {aeoQuickAnswer}
              </p>

              {/* Author Bio Bar */}
              <div className="d-flex align-items-center p-3 mb-4 bg-white rounded-4 shadow-sm border">
                <div className="avatar me-3 bg-theme text-white rounded-circle d-flex align-items-center justify-content-center fw-bold fs-4" style={{ width: 50, height: 50 }}>
                  {author.charAt(0)}
                </div>
                <div>
                  <h6 className="mb-0 fw-bold">{author}</h6>
                  <small className="text-muted">Flooring Expert</small>
                </div>
              </div>

              {/* Featured Cover Image */}
              <div className="mb-5 rounded-4 overflow-hidden shadow">
                <img
                  src={post.featured_image || '/assets/images/blog/blog_3.webp'}
                  alt={post.title}
                  className="img-fluid w-100"
                  style={{ maxHeight: '480px', objectFit: 'cover' }}
                />
              </div>

              {/* AEO Quick Answer Box */}
              {aeoQuickAnswer && (
                <div className="p-4 mb-5 rounded-4 border-start border-4 border-primary bg-white shadow-sm">
                  <div className="d-flex align-items-center mb-2 text-primary fw-bold fs-5">
                    <i className="fa-solid fa-bolt me-2"></i> AEO Quick Answer / Key Takeaway
                  </div>
                  <p className="mb-0 text-dark fs-6 lh-base">
                    {aeoQuickAnswer}
                  </p>
                </div>
              )}

              {/* Article Main Body Content */}
              <div className="blog-article-content bg-white p-4 p-md-5 rounded-4 shadow-sm border mb-5">
                {(post.content || '').split('\n\n').map((paragraph: string, index: number) => {
                  if (paragraph.startsWith('# ')) {
                    return <h2 key={index} className="fw-bold mt-4 mb-3 text-dark">{paragraph.replace('# ', '')}</h2>;
                  }
                  if (paragraph.startsWith('## ')) {
                    return <h3 key={index} className="fw-bold mt-4 mb-3 text-dark fs-4">{paragraph.replace('## ', '')}</h3>;
                  }
                  if (paragraph.startsWith('### ')) {
                    return <h4 key={index} className="fw-bold mt-3 mb-2 text-dark fs-5">{paragraph.replace('### ', '')}</h4>;
                  }
                  if (paragraph.startsWith('---')) {
                    return <hr key={index} className="my-4" />;
                  }
                  if (paragraph.includes('|')) {
                    // Render simple tables
                    const rows = paragraph.trim().split('\n').filter(r => !r.includes(':---'));
                    return (
                      <div key={index} className="table-responsive my-4">
                        <table className="table table-bordered table-striped align-middle">
                          <tbody>
                            {rows.map((row, rIdx) => {
                              const cols = row.split('|').filter(c => c.trim() !== '');
                              if (rIdx === 0) {
                                return (
                                  <tr key={rIdx} className="table-dark">
                                    {cols.map((col, cIdx) => (
                                      <th key={cIdx}>{col.trim().replace(/\*\*/g, '')}</th>
                                    ))}
                                  </tr>
                                );
                              }
                              return (
                                <tr key={rIdx}>
                                  {cols.map((col, cIdx) => (
                                    <td key={cIdx}>{col.trim().replace(/\*\*/g, '')}</td>
                                  ))}
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    );
                  }
                  return (
                    <p key={index} className="fs-6 text-secondary lh-lg mb-3">
                      {paragraph.split('**').map((part, pIdx) => 
                        pIdx % 2 === 1 ? <strong key={pIdx} className="text-dark">{part}</strong> : part
                      )}
                    </p>
                  );
                })}
              </div>

              {/* Related Posts */}
              <div className="mt-5">
                <h4 className="fw-bold mb-4">Related Articles & Guides</h4>
                <div className="row gy-4">
                  {relatedPosts.map((rel) => (
                    <div key={rel.slug} className="col-md-6">
                      <div className="card h-100 border-0 shadow-sm rounded-4 overflow-hidden">
                        <img
                          src={rel.featured_image || '/assets/images/blog/blog_3.webp'}
                          alt={rel.title}
                          className="card-img-top"
                          style={{ height: 180, objectFit: 'cover' }}
                        />
                        <div className="card-body p-4 d-flex flex-column justify-content-between">
                          <div>
                            <span className="badge bg-light text-theme border mb-2">{(rel.categories && rel.categories.length > 0) ? rel.categories[0] : 'Blog'}</span>
                            <h6 className="fw-bold card-title mb-2">
                              <Link href={`/blog/${rel.slug}`} className="text-dark text-decoration-none">
                                {rel.title}
                              </Link>
                            </h6>
                          </div>
                          <Link href={`/blog/${rel.slug}`} className="btn btn-outline-primary btn-sm rounded-pill mt-3 align-self-start">
                            Read Article &rarr;
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>
      </main>
    </>
  );
}
