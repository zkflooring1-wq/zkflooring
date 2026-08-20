import React from 'react';
import NavMenu from '@/components/layout/NavMenu';

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
                  <img alt="ZK Flooring Logo" src="/zk-logo.png" style={{ maxHeight: '50px', width: 'auto', objectFit: 'contain' }} />
                  <img alt="ZK Flooring Logo" src="/zk-logo.png" style={{ maxHeight: '50px', width: 'auto', objectFit: 'contain' }} />
                </a>
              </div>
            </div>
            <div className="col-auto nav-menu">
              <nav className="main-menu d-none d-lg-inline-block">
                <NavMenu className="navigation clearfix" />
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
