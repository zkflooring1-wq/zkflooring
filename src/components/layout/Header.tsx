import React from 'react';
import { getSetting, SocialLink, HeaderContact } from '@/lib/settings';

export default async function Header() {
  const socialLinks = await getSetting<SocialLink[]>('social_links');
  const contactInfo = await getSetting<HeaderContact>('header_contact');

  const address = contactInfo?.address || "B10 9HH, Hobmoor Road, Small Heath, Birmingham";
  const email = contactInfo?.email || "example@gmail.com";

  return (
    <header className="tv-header header-style1">
      {/* Header top */}
      <div className="header-top">
        <div className="inner-container">
          <div className="top-left">
            <ul className="list-style-1">
              <li><i className="fa-regular fa-house"></i>{address}</li>
              <li><a href={`mailto:${email}`}><i className="icon fa-regular fa-envelope"></i>{email}</a></li>
            </ul>
          </div>
          <div className="outer-box">
            <ul className="social-icon-one">
              <li><span className="menu-follow_title">Follow Us On :</span></li>
              {socialLinks ? (
                socialLinks
                  .filter((link) => link.enabled)
                  .map((link) => (
                    <li key={link.platform}>
                      <a href={link.url} target="_blank" rel="noopener noreferrer">
                        <i className={link.icon}></i>
                      </a>
                    </li>
                  ))
              ) : (
                <>
                  <li><a href="#"><i className="fa-brands fa-facebook-f"></i></a></li>
                  <li><a href="#"><i className="fa-brands fa-x-twitter"></i></a></li>
                  <li><a href="#"><i className="fa-brands fa-linkedin-in"></i></a></li>
                  <li><a href="#"><i className="fa-brands fa-pinterest-p"></i></a></li>
                </>
              )}
            </ul>
          </div>
        </div>
      </div>
      <div className="main-wrapper">
        {/* Main Menu Area */}
        <div className="menu-area">
          <div className="row align-items-center justify-content-between">
            <div className="col-auto logo">
              <div className="header-logo">
                <a href="/">
                  <img alt="ZK Flooring Logo" src="/zk-logo.png" style={{ maxHeight: '65px', width: 'auto', objectFit: 'contain' }} />
                  <img alt="ZK Flooring Logo" src="/zk-logo.png" style={{ maxHeight: '65px', width: 'auto', objectFit: 'contain' }} />
                </a>
              </div>
            </div>
            <div className="col-auto nav-outer">
              <div className="nav-menu">
                <nav className="main-menu d-none d-lg-inline-block">
                  <ul className="navigation">
                    <li className="active">
                      <a href="/">Home</a>
                    </li>
                    <li>
                      <a href="/about">About</a>
                    </li>
                    <li>
                      <a href="/services">Services</a>
                    </li>
                    <li>
                      <a href="/projects">Portfolio</a>
                    </li>
                    <li>
                      <a href="/pricing">Pricing</a>
                    </li>
                    <li>
                      <a href="/faq">FAQ</a>
                    </li>
                    <li>
                      <a href="/blog">Blog</a>
                    </li>
                    <li><a href="/contact">Contact</a></li>
                  </ul>
                </nav>
                <div className="navbar-right d-inline-flex d-lg-none">
                  <button className="menu-toggle sidebar-btn" type="button">
                    <span className="line"></span>
                    <span className="line"></span>
                    <span className="line"></span>
                  </button>
                </div>
              </div>
            </div>
            <div className="col-auto header-right-wrapper">
              <div className="outer-box">
                <a href="/contact" className="theme-btn">
                  <span className="link-effect">
                    <span className="effect-1">Get Free Quote</span>
                    <span className="effect-1">Get Free Quote</span>
                  </span>
                  <span className="arrow-all">
                    <i>
                      <svg width="16" height="19" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M2 6H10M10 6L6 2M10 6L6 10" stroke="#16120B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      <svg width="16" height="19" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M2 6H10M10 6L6 2M10 6L6 10" stroke="#16120B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </i>
                  </span>
                </a>
                <div className="sidebar-icon">
                  <button className="sidebar-trigger open">
                    <img src="/assets/images/icons/sidebar-toggle.webp" alt="Toggle Sidebar" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
