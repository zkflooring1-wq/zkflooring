import React from 'react';
import { getSetting, SocialLink, HeaderContact } from '@/lib/settings';

export interface FooterSettings {
  company_description?: string;
  quick_links?: { label: string; url: string }[];
  copyright?: string;
}

export default async function Footer() {
  const socialLinks = await getSetting<SocialLink[]>('social_links');
  const contactInfo = await getSetting<HeaderContact>('header_contact');
  const footerSettings = await getSetting<FooterSettings>('footer');

  const email = contactInfo?.email || "example@gmail.com";
  const phone = contactInfo?.phone || "07903723774";
  const phoneLink = contactInfo?.phone_link || "tel:07903723774";

  return (
    <footer className="footer-section z-1 br-30 xxl-br-0 pt-75 bg-dark position-relative mx-30 mb-30 xxl-m-0 overflow-hidden">
      <div className="bg image mbm-screen"><img src="/assets/images/footer/hm1-bg01.webp" alt="" /></div>
      <div className="footer-top space">
        <div className="container">
          <div className="row">
            <div className="col-lg-4 col-md-4 col-sm-6 footer-brand">
              <div className="brand-info wow fadeInUp" data-wow-delay=".2s">
                <div className="logo">
                  <img src="/assets/images/logo/logo-2.png" alt="ZK Flooring Logo" />
                </div>
                <div className="contact-info">
                  <div className="contact-item">
                    <h3 className="title">FREE CONVERSATION</h3>
                    <a href={`mailto:${email}`}>
                      <i className="fa-sharp fa-light fa-envelope"></i> {email}
                    </a>
                  </div>
                  <div className="contact-item">
                    <h3 className="title">CALL US :</h3>
                    <a href={phoneLink}>
                      <i className="flaticon-phone"></i> {phone}
                    </a>
                  </div>
                </div>
                <div className="social-links">
                  {socialLinks ? (
                    socialLinks
                      .filter((link) => link.enabled)
                      .map((link) => (
                        <a key={link.platform} href={link.url} target="_blank" rel="noopener noreferrer" className="social-icon">
                          <i className={link.icon}></i>
                        </a>
                      ))
                  ) : (
                    <>
                      <a href="#" className="social-icon"><i className="fab fa-facebook-f"></i></a>
                      <a href="#" className="social-icon"><i className="fab fa-x-twitter"></i></a>
                      <a href="#" className="social-icon"><i className="fab fa-linkedin-in"></i></a>
                      <a href="#" className="social-icon"><i className="fab fa-pinterest-p"></i></a>
                    </>
                  )}
                </div>
              </div>
            </div>
            <div className="col-lg-4 col-md-4">
              <div className="row">
                <div className="col-lg-6 col-md-6 p-0 sm-pl-15">
                  <div className="footer-widget wow fadeInUp" data-wow-delay="0.4s">
                    <h4 className="title">Information</h4>
                    <ul className="list-unstyled">
                      <li><a href="/about">About Us</a></li>
                      <li><a href="/services">Our Services</a></li>
                      <li><a href="/projects">Our Projects</a></li>
                      <li><a href="/pricing">Pricing</a></li>
                      <li><a href="/faq">FAQ</a></li>
                    </ul>
                  </div>
                </div>
                <div className="col-lg-6 col-md-6 p-0 sm-pl-15">
                  <div className="footer-widget wow fadeInUp" data-wow-delay="0.6s">
                    <h4 className="title">Flooring Products</h4>
                    <ul className="list-unstyled">
                      <li><a href="/services">Carpet Installation</a></li>
                      <li><a href="/services">Wood Flooring</a></li>
                      <li><a href="/services">Vinyl Flooring</a></li>
                      <li><a href="/services">LVT Flooring</a></li>
                      <li><a href="/services">SPC Flooring</a></li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-1 md-d-none"></div>
            <div className="col-lg-3 col-md-4">
              <div className="footer-widget ml-0 mb-0 wow fadeInUp" data-wow-delay="0.8s">
                <h4 className="title">Latest Blog</h4>
                <div className="recent-post-item">
                  <figure className="image">
                    <a href="/blog"><img src="/assets/images/footer/gallery-1.webp" alt="" /></a>
                  </figure>
                  <div className="recent-post-info">
                    <h4 className="title"><a href="/blog">Top 10 Most Popular Flooring Trends</a></h4>
                    <span className="post-date">10 AUG, 2026</span>
                  </div>
                </div>
                <div className="recent-post-item mb--20">
                  <figure className="image">
                    <a href="/blog"><img src="/assets/images/footer/gallery-2.webp" alt="" /></a>
                  </figure>
                  <div className="recent-post-info">
                    <h4 className="title"><a href="/blog">How to Choose the Best Carpet for Your Home</a></h4>
                    <span className="post-date">10 AUG, 2026</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <div className="container">
          <div className="row gy-15">
            <div className="col-md-6">
              <div className="copyright wow fadeInUp" data-wow-delay=".3s">
                <p className="mb-0">{footerSettings?.copyright || "Copyright © 2026 ZK Flooring. All Rights Reserved."}</p>
              </div>
            </div>
            <div className="col-md-6 text-md-end">
              <div className="footer-policy wow fadeInUp" data-wow-delay=".6s">
                <a href="#">Privacy Policy</a>
                <a href="#">Terms of Service</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
