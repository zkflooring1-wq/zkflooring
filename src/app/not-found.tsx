import React from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "404 Page Not Found | ZK Flooring Birmingham",
  description: "The page you are looking for does not exist on ZK Flooring.",
};

export default function NotFoundPage() {
  return (
    <main>
      {/* Start Breadcrumb Section */}
      <section className="tv-breadcrumb-section">
        <div className="tv-breadcrumb-inner mx-30 ml-mx-0 position-relative overflow-hidden br-30 ml-br-0" style={{ background: 'linear-gradient(to right, #BF953F, #FCF6BA, #B38728, #FBF5B7, #AA771C)' }}>
          <div className="bg"></div>
          <div className="container">
            <div className="row">
              <div className="col-12">
                <div className="title-outer">
                  <div className="page-title">
                    <h2 className="title">404 - Not Found</h2>
                    <ul className="page-breadcrumb">
                      <li><a href="/"><i className="fa-solid fa-house-chimney"></i>Home</a></li>
                      <li><span>/</span> 404</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Error Section */}
      <section className="tv-error-section space bg-light">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-6 text-center">
              <div className="error-thumb mb-30">
                <img src="/assets/images/error/404.webp" alt="404 Error" loading="lazy" decoding="async" />
              </div>
              <div className="title-wrap text-center mt-30">
                <h2 className="sec-title">Oops! Page Not Found</h2>
                <p className="mb-30">The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.</p>
                <a href="/" className="theme-btn br-30">
                  <span className="link-effect">
                    <span className="effect-1">Back to Home</span>
                    <span className="effect-1">Back to Home</span>
                  </span>
                  <span className="arrow-all">
                    <i>
                      <svg width="16" height="19" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M2 6H10M10 6L6 2M10 6L6 10" stroke="#16120B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </i>
                  </span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
