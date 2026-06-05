import React from 'react';

export default function StickyHeader() {
  return (
    <div className="sticky-header" suppressHydrationWarning>
      <div className="container">
        {/* Main Menu Area */}
        <div className="menu-area">
          <div className="row align-items-center justify-content-between">
            <div className="col-auto logo">
              <div className="header-logo">
                <a href="/">
                  <img alt="logo" src="/assets/images/logo/logo.png" />
                  <img alt="logo" src="/assets/images/logo/logo.png" />
                </a>
              </div>
            </div>
            <div className="col-auto nav-menu">
              <nav className="main-menu d-none d-lg-inline-block">
                <ul className="navigation clearfix">
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
        </div>
      </div>
    </div>
  );
}
