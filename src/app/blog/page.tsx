import React from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export const metadata = {
  title: 'Flooring Insights & Buying Guides Birmingham | ZK Flooring Blog',
  description: 'Expert flooring advice, technical buying guides, and British Standards installation tips for LVT, Laminate, Carpet Underlays, and Hardwood in Birmingham & West Midlands.',
};

export default async function BlogIndexPage() {
  const { data: dbPosts } = await supabase.from('posts').select('*').eq('status', 'published').order('created_at', { ascending: false });
  const posts = dbPosts || [];

  return (
    <main>
      {/* Start Breadcrumb Section */}
      <section className="tv-breadcrumb-section">
        <div className="tv-breadcrumb-inner mx-30 ml-mx-0 position-relative overflow-hidden br-30 ml-br-0" style={{ background: 'linear-gradient(to right, #BF953F, #FCF6BA, #B38728, #FBF5B7, #AA771C)' }}><div className="bg"></div>
          <div className="container">
            <div className="row">
              <div className="col-12">
                <div className="title-outer">
                  <div className="page-title">
                    <h2 className="title">Latest Blog</h2>
                    <ul className="page-breadcrumb">
                      <li><a href="/"><i className="fa-solid fa-house-chimney"></i>Home</a></li>
                      <li><span>/</span> Blog</li>
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

      {/* Blog Section */}
      <div className="tv-blog-section space bg-color2">
        <div className="container">
          <div className="row gy-25">
            {posts.map((post) => (
              <div key={post.slug} className="col-lg-4 col-md-6 col-sm-6">
                <article className="blog-single-box">
                  <div className="inner-box">
                    <div className="blog-image">
                      <img src={post.featured_image || '/assets/images/blog/blog_3.webp'} alt={post.title} />
                      <div className="category-tag"><span></span>{new Date(post.created_at).toLocaleDateString()}</div>
                    </div>
                    <div className="blog-content">
                      <h4 className="title">
                        <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                      </h4>
                      <div className="pt-25 pb-30"><div className="border dark"></div></div>
                      <div className="blog-meta">
                        <Link href={`/blog/${post.slug}`} className="continue-reading">Read More</Link>
                        <span>{Math.ceil(post.content.length / 1000)} Min Read</span>
                      </div>
                    </div>
                  </div>
                </article>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
