import React from 'react';
import { getSetting, SocialLink, HeaderContact } from '@/lib/settings';
import { supabase } from '@/lib/supabase';

export interface FooterSettings {
  company_description?: string;
  quick_links?: { label: string; url: string }[];
  copyright?: string;
}

export default async function Footer() {
  const socialLinks = await getSetting<SocialLink[]>('social_links');
  const contactInfo = await getSetting<HeaderContact>('header_contact');
  const footerSettings = await getSetting<FooterSettings>('footer');

  // Fetch latest 2 published blog posts
  const { data: latestPosts } = await supabase
    .from('posts')
    .select('id, title, slug, featured_image, created_at')
    .eq('status', 'published')
    .order('created_at', { ascending: false })
    .limit(2);

  const email = contactInfo?.email || "example@gmail.com";
  const phone = contactInfo?.phone || "07903723774";
  const phoneLink = contactInfo?.phone_link || "tel:07903723774";

  return (
    <footer className="footer-section z-1 br-30 xxl-br-0 pt-75 position-relative mx-30 mb-30 xxl-m-0 overflow-hidden" style={{ background: 'linear-gradient(135deg, #BF953F 0%, #FCF6BA 25%, #B38728 50%, #FBF5B7 75%, #AA771C 100%)' }}>
      <div className="bg image mbm-screen"><img src="/assets/images/footer/hm1-bg01.webp" alt="" loading="lazy" decoding="async" style={{ opacity: 0.3, mixBlendMode: 'overlay' }} /></div>
      <div className="footer-top space">
        <div className="container">
          <div className="row">
            <div className="col-lg-4 col-md-4 col-sm-6 footer-brand">
              <div className="brand-info wow fadeInUp" data-wow-delay=".2s">
                <div className="logo">
                  <img src="/zk-logo.png" alt="ZK Flooring Logo" loading="lazy" decoding="async" style={{ maxHeight: '75px', width: 'auto', objectFit: 'contain' }} />
                </div>
                <div className="contact-info" style={{ borderBottomColor: 'rgba(22, 18, 11, 0.2)' }}>
                  <div className="contact-item">
                    <h3 className="title" style={{ color: '#16120B', opacity: 0.85, fontWeight: 700 }}>FREE CONVERSATION</h3>
                    <a href={`mailto:${email}`} style={{ color: '#16120B', fontWeight: 600 }}>
                      <i className="fa-sharp fa-light fa-envelope" style={{ color: '#16120B' }}></i> {email}
                    </a>
                  </div>
                  <div className="contact-item">
                    <h3 className="title" style={{ color: '#16120B', opacity: 0.85, fontWeight: 700 }}>CALL US :</h3>
                    <a href={phoneLink} style={{ color: '#16120B', fontWeight: 600 }}>
                      <i className="flaticon-phone" style={{ color: '#16120B' }}></i> {phone}
                    </a>
                  </div>
                </div>
                <div className="social-links">
                  {socialLinks ? (
                    socialLinks
                      .filter((link) => link.enabled)
                      .map((link) => (
                        <a key={link.platform} href={link.url} target="_blank" rel="noopener noreferrer" className="social-icon" style={{ backgroundColor: '#16120B', color: '#FCF6BA' }}>
                          <i className={link.icon}></i>
                        </a>
                      ))
                  ) : (
                    <>
                      <a href="#" className="social-icon" style={{ backgroundColor: '#16120B', color: '#FCF6BA' }}><i className="fab fa-facebook-f"></i></a>
                      <a href="#" className="social-icon" style={{ backgroundColor: '#16120B', color: '#FCF6BA' }}><i className="fab fa-x-twitter"></i></a>
                      <a href="#" className="social-icon" style={{ backgroundColor: '#16120B', color: '#FCF6BA' }}><i className="fab fa-linkedin-in"></i></a>
                      <a href="#" className="social-icon" style={{ backgroundColor: '#16120B', color: '#FCF6BA' }}><i className="fab fa-pinterest-p"></i></a>
                    </>
                  )}
                </div>
              </div>
            </div>
            <div className="col-lg-4 col-md-4">
              <div className="row">
                <div className="col-lg-6 col-md-6 p-0 sm-pl-15">
                  <div className="footer-widget wow fadeInUp" data-wow-delay="0.4s">
                    <h4 className="title" style={{ color: '#16120B', fontWeight: 800 }}>Information</h4>
                    <ul className="list-unstyled">
                      <li><a href="/about" style={{ color: '#16120B', fontWeight: 500 }}>About Us</a></li>
                      <li><a href="/services" style={{ color: '#16120B', fontWeight: 500 }}>Our Services</a></li>
                      <li><a href="/projects" style={{ color: '#16120B', fontWeight: 500 }}>Our Projects</a></li>
                      <li><a href="/pricing" style={{ color: '#16120B', fontWeight: 500 }}>Pricing</a></li>
                      <li><a href="/faq" style={{ color: '#16120B', fontWeight: 500 }}>FAQ</a></li>
                    </ul>
                  </div>
                </div>
                <div className="col-lg-6 col-md-6 p-0 sm-pl-15">
                  <div className="footer-widget wow fadeInUp" data-wow-delay="0.6s">
                    <h4 className="title" style={{ color: '#16120B', fontWeight: 800 }}>Flooring Products</h4>
                    <ul className="list-unstyled">
                      <li><a href="/services" style={{ color: '#16120B', fontWeight: 500 }}>Carpet Installation</a></li>
                      <li><a href="/services" style={{ color: '#16120B', fontWeight: 500 }}>Wood Flooring</a></li>
                      <li><a href="/services" style={{ color: '#16120B', fontWeight: 500 }}>Vinyl Flooring</a></li>
                      <li><a href="/services" style={{ color: '#16120B', fontWeight: 500 }}>LVT Flooring</a></li>
                      <li><a href="/services" style={{ color: '#16120B', fontWeight: 500 }}>SPC Flooring</a></li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-1 md-d-none"></div>
            <div className="col-lg-3 col-md-4">
              <div className="footer-widget ml-0 mb-0 wow fadeInUp" data-wow-delay="0.8s">
                <h4 className="title" style={{ color: '#16120B', fontWeight: 800 }}>Latest Blog</h4>
                {latestPosts && latestPosts.length > 0 ? (
                  latestPosts.map((p, pIdx) => (
                    <div key={p.id || pIdx} className={`recent-post-item ${pIdx === latestPosts.length - 1 ? 'mb--20' : ''}`}>
                      <figure className="image" style={{ width: '70px', height: '60px', borderRadius: '8px', overflow: 'hidden', flexShrink: 0 }}>
                        <a href={`/blog/${p.slug}`}>
                          <img
                            src={p.featured_image || "/slider/Carpet.webp"}
                            alt={p.title}
                            loading="lazy"
                            decoding="async"
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                        </a>
                      </figure>
                      <div className="recent-post-info">
                        <h4 className="title">
                          <a href={`/blog/${p.slug}`} style={{ color: '#16120B', fontWeight: 600, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                            {p.title}
                          </a>
                        </h4>
                        <span className="post-date" style={{ color: 'rgba(22, 18, 11, 0.75)', fontWeight: 600 }}>
                          {new Date(p.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase()}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <>
                    <div className="recent-post-item">
                      <figure className="image">
                        <a href="/blog"><img src="/slider/Carpet.webp" alt="" loading="lazy" decoding="async" /></a>
                      </figure>
                      <div className="recent-post-info">
                        <h4 className="title"><a href="/blog" style={{ color: '#16120B', fontWeight: 600 }}>Top 10 Most Popular Flooring Trends</a></h4>
                        <span className="post-date" style={{ color: 'rgba(22, 18, 11, 0.75)', fontWeight: 600 }}>10 AUG, 2026</span>
                      </div>
                    </div>
                    <div className="recent-post-item mb--20">
                      <figure className="image">
                        <a href="/blog"><img src="/slider/Laminate Flooring.webp" alt="" loading="lazy" decoding="async" /></a>
                      </figure>
                      <div className="recent-post-info">
                        <h4 className="title"><a href="/blog" style={{ color: '#16120B', fontWeight: 600 }}>How to Choose Between LVT & Hardwood</a></h4>
                        <span className="post-date" style={{ color: 'rgba(22, 18, 11, 0.75)', fontWeight: 600 }}>10 AUG, 2026</span>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="footer-bottom" style={{ borderTopColor: 'rgba(22, 18, 11, 0.2)' }}>
        <div className="container">
          <div className="row gy-15">
            <div className="col-md-6">
              <div className="copyright wow fadeInUp" data-wow-delay=".3s">
                <p className="mb-0" style={{ color: '#16120B', fontWeight: 500 }}>{footerSettings?.copyright || "Copyright © 2026 ZK Flooring. All Rights Reserved."}</p>
              </div>
            </div>
            <div className="col-md-6 text-md-end">
              <div className="footer-policy wow fadeInUp" data-wow-delay=".6s">
                <a href="#" style={{ color: '#16120B', fontWeight: 500 }}>Privacy Policy</a>
                <a href="#" style={{ color: '#16120B', fontWeight: 500 }}>Terms of Service</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
