import React from 'react';
import type { Metadata } from 'next';
import NewsletterLottie from '@/components/NewsletterLottie';

export const metadata: Metadata = {
  title: "About Us | ZK Flooring Birmingham",
  description: "Learn about ZK Flooring, Birmingham's trusted specialists in premium carpet, hardwood, LVT, laminate, and commercial flooring installations with 15+ years of experience.",
};

export default function AboutPage() {
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
                    <h2 className="title">About Us</h2>
                    <ul className="page-breadcrumb">
                      <li><a href="/"><i className="fa-solid fa-house-chimney"></i>Home</a></li>
                      <li><span>/</span> About Us</li>
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

      {/* Feature Section One */}
      <section className="tv-feature-section bg-light space-top">
        <div className="container">
          <div className="row gy-30 align-items-stretch">
            <div className="col-lg-4 col-md-6 col-sm-6">
              <div className="tv-feature-item h-100 d-flex flex-column">
                <div className="client-social-proof flex-grow-1">
                  <div className="social">
                    <img src="/assets/images/social/social-img01.webp" alt="Client 01" />
                    <img src="/assets/images/social/social-img02.webp" alt="Client 02" />
                    <img src="/assets/images/social/social-img03.webp" alt="Client 03" />
                    <h4>+3K</h4>
                  </div>
                  <div className="count-box mt-30"><span className="count-number odometer" data-count="3600">3,600</span></div>
                  <div className="rating-viewers">Satisfied Property Owners</div>
                  <a href="/contact" className="theme-btn style2 mt-20 br-30 mt-auto">
                    <span className="link-effect">
                      <span className="effect-1">Get a Quote</span>
                      <span className="effect-1">Get a Quote</span>
                    </span>
                    <span className="arrow-all-2">
                      <i>
                        <svg width="11" height="12" viewBox="0 0 12 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M10.0035 3.90804L1.41153 12.5L0 11.0885L8.59097 2.49651H1.01922V0.5H12V11.4808H10.0035V3.90804Z" fill="white"></path>
                        </svg>
                        <svg width="11" height="12" viewBox="0 0 12 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M10.0035 3.90804L1.41153 12.5L0 11.0885L8.59097 2.49651H1.01922V0.5H12V11.4808H10.0035V3.90804Z" fill="white"></path>
                        </svg>
                      </i>
                    </span>
                  </a>
                  <div className="scribble-shape1 moving">
                    <img src="/assets/images/feature/scribble.webp" alt="" />
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-4 col-md-6 col-sm-6">
              <div className="tv-feature-box h-100 d-flex flex-column">
                <div className="icon-top">
                  <div className="icon">
                    <i>
                      <svg width="12" height="13" viewBox="0 0 12 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M10.0035 3.90804L1.41153 12.5L0 11.0885L8.59097 2.49651H1.01922V0.5H12V11.4808H10.0035V3.90804Z" fill="white"></path>
                      </svg>
                      <svg width="12" height="13" viewBox="0 0 12 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M10.0035 3.90804L1.41153 12.5L0 11.0885L8.59097 2.49651H1.01922V0.5H12V11.4808H10.0035V3.90804Z" fill="white"></path>
                      </svg>
                    </i>
                  </div>
                </div>
                <div className="logo mb-40"><img src="/assets/images/feature/hm1-icon01.webp" alt="Flooring Icon" /></div>
                <h2>Residential & Commercial <br />Flooring</h2>
                <p className="flex-grow-1">Expert supply and precision installation of luxury carpet, hardwood, LVT, and vinyl for homes and offices across Birmingham.</p>
              </div>
            </div>
            <div className="col-lg-4 col-md-6 col-sm-6">
              <div className="tv-feature-box bg-theme3 h-100 d-flex flex-column">
                <div className="icon-top">
                  <div className="icon style2 bg-dark">
                    <i>
                      <svg width="12" height="13" viewBox="0 0 12 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M10.0035 3.90804L1.41153 12.5L0 11.0885L8.59097 2.49651H1.01922V0.5H12V11.4808H10.0035V3.90804Z" fill="white"></path>
                      </svg>
                      <svg width="12" height="13" viewBox="0 0 12 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M10.0035 3.90804L1.41153 12.5L0 11.0885L8.59097 2.49651H1.01922V0.5H12V11.4808H10.0035V3.90804Z" fill="white"></path>
                      </svg>
                    </i>
                  </div>
                </div>
                <div className="logo mb-40"><img src="/assets/images/feature/hm1-icon02.webp" alt="Subfloor Icon" /></div>
                <h2>Subfloor Preparation <br />& Self-Levelling</h2>
                <p className="flex-grow-1">Flawless subfloor levelling, latex screeding, and ply boarding ensuring perfectly smooth, durable surfaces.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Redesigned About Section (Luxury, Responsive & Professional) */}
      <section className="about-redesign-section space bg-light">
        <div className="container">
          <div className="row gy-50 align-items-center">
            {/* Visual Showcase (Left) */}
            <div className="col-lg-6">
              <div className="about-showcase-wrapper">
                {/* Main Large Showcase Image */}
                <div className="main-thumb-card">
                  <img
                    className="main-img"
                    src="/about page/1.webp"
                    alt="ZK Flooring Master Craftsmanship"
                  />
                </div>

                {/* Overlapping Master Craftsman Inset Card */}
                <div className="fitter-floating-card">
                  <img
                    className="fitter-img"
                    src="/about page/2.webp"
                    alt="ZK Flooring Lead Fitter"
                  />
                  <div className="fitter-badge-glass">
                    <div className="d-flex align-items-center gap-2">
                      <span className="gold-dot"></span>
                      <div>
                        <h5 className="fitter-name">ZK FLOORING</h5>
                        <p className="fitter-title">Master Flooring Installer</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Experience Trust Badge */}
                <div className="experience-badge-floating">
                  <div className="exp-icon-wrap">
                    <i className="fa-solid fa-award"></i>
                  </div>
                  <div className="exp-text-wrap">
                    <div className="d-flex align-items-baseline">
                      <span className="exp-number">15</span>
                      <span className="exp-plus">+</span>
                    </div>
                    <span className="exp-label">Years of Trade Excellence</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Editorial Content (Right) */}
            <div className="col-lg-6">
              <div className="about-editorial-wrap ps-xl-4">
                {/* Subtitle Pill */}
                <div className="about-badge-pill mb-3">
                  <i className="fa-solid fa-circle-check"></i>
                  <span>Get to Know Us</span>
                </div>

                {/* Section Title */}
                <h2 className="sec-title mb-3" style={{ fontSize: 'clamp(28px, 3.2vw, 42px)', lineHeight: 1.25 }}>
                  Transforming Birmingham Properties with Precision Flooring Solutions
                </h2>

                {/* Description */}
                <p className="about-lead-text mb-4">
                  ZK Flooring is Birmingham&apos;s trusted specialist for premium carpet, hardwood, LVT, laminate, and commercial vinyl installations. We deliver unmatched craftsmanship, reliability, and top-tier materials to every project across the West Midlands.
                </p>

                {/* Capabilities Cards */}
                <div className="about-metrics-list mb-4">
                  <div className="about-metric-card">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <div className="d-flex align-items-center gap-3">
                        <div className="metric-icon-box">
                          <i className="fa-solid fa-layer-group"></i>
                        </div>
                        <h4 className="metric-title">Carpet &amp; Underlay Fitting</h4>
                      </div>
                      <span className="metric-badge-tag">98% Satisfaction</span>
                    </div>
                    <div className="metric-progress-track mb-2">
                      <div className="metric-progress-fill" style={{ width: '98%' }}></div>
                    </div>
                    <p className="metric-desc">
                      Luxury high-tog underlays, invisible seam joins, and tailored staircase runners.
                    </p>
                  </div>

                  <div className="about-metric-card">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <div className="d-flex align-items-center gap-3">
                        <div className="metric-icon-box">
                          <i className="fa-solid fa-ruler-combined"></i>
                        </div>
                        <h4 className="metric-title">Hardwood &amp; LVT Installation</h4>
                      </div>
                      <span className="metric-badge-tag">95% Accuracy Score</span>
                    </div>
                    <div className="metric-progress-track mb-2">
                      <div className="metric-progress-fill" style={{ width: '95%' }}></div>
                    </div>
                    <p className="metric-desc">
                      Subfloor latex screeding, herringbone patterns, and premium Amtico &amp; Karndean LVT.
                    </p>
                  </div>
                </div>

                {/* Bottom Actions Row */}
                <div className="about-actions-row d-flex flex-wrap align-items-center gap-4 pt-2">
                  <a href="/contact" className="theme-btn br-30">
                    <span className="link-effect">
                      <span className="effect-1">Request Free Survey</span>
                      <span className="effect-1">Request Free Survey</span>
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

                  <div className="about-direct-contact">
                    <div className="direct-icon">
                      <i className="fa-solid fa-phone-volume"></i>
                    </div>
                    <div className="ms-3">
                      <span className="direct-subtitle">Direct Consultation</span>
                      <a href="tel:07903723774" className="direct-number">07903 723 774</a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Craftsmanship Standards & Guarantees Section */}
      <section className="about-standards-section space bg-white">
        <div className="container">
          {/* Section Header */}
          <div className="row justify-content-center text-center mb-50">
            <div className="col-lg-8">
              <div className="about-badge-pill mb-3">
                <i className="fa-solid fa-gem"></i>
                <span>Why Choose ZK Flooring</span>
              </div>
              <h2 className="sec-title mb-3" style={{ fontSize: 'clamp(28px, 3.2vw, 42px)', lineHeight: 1.25 }}>
                The Craftsmanship Standards That Set Us Apart
              </h2>
              <p className="about-lead-text mx-auto" style={{ maxWidth: '680px' }}>
                From precision subfloor preparation to the final bespoke trim, we deliver flawless results backed by transparent pricing, expert master fitters, and total peace of mind.
              </p>
            </div>
          </div>

          {/* 4 Standards Cards Grid */}
          <div className="row gy-30">
            {/* Card 1: Subfloor */}
            <div className="col-lg-3 col-md-6">
              <div className="standards-card">
                <div className="card-icon-wrap">
                  <i className="fa-solid fa-ruler-combined"></i>
                </div>
                <span className="card-tag">Precision Prep</span>
                <h3 className="card-title">Laser-Leveled Subfloor Prep</h3>
                <p className="card-desc">
                  Moisture testing, ply boarding, and latex self-levelling screeding to ensure your floors stay perfectly flat, silent, and stable.
                </p>
                <ul className="card-features">
                  <li><i className="fa-solid fa-circle-check"></i> DPM Moisture Testing</li>
                  <li><i className="fa-solid fa-circle-check"></i> Self-Levelling Screeds</li>
                </ul>
              </div>
            </div>

            {/* Card 2: Mobile Showroom */}
            <div className="col-lg-3 col-md-6">
              <div className="standards-card">
                <div className="card-icon-wrap">
                  <i className="fa-solid fa-truck-fast"></i>
                </div>
                <span className="card-tag">Convenience</span>
                <h3 className="card-title">Free Home Survey &amp; Samples</h3>
                <p className="card-desc">
                  We bring hundreds of luxury carpet, LVT, and hardwood samples right to your door for accurate in-room color matching and measuring.
                </p>
                <ul className="card-features">
                  <li><i className="fa-solid fa-circle-check"></i> Free Laser Measuring</li>
                  <li><i className="fa-solid fa-circle-check"></i> Fixed Transparent Quotes</li>
                </ul>
              </div>
            </div>

            {/* Card 3: White Glove Fitting */}
            <div className="col-lg-3 col-md-6">
              <div className="standards-card">
                <div className="card-icon-wrap">
                  <i className="fa-solid fa-wand-magic-sparkles"></i>
                </div>
                <span className="card-tag">Zero Mess</span>
                <h3 className="card-title">White-Glove Property Care</h3>
                <p className="card-desc">
                  We treat your home with total respect. Furniture moving, precise door trimming, dust-contained cutting, and spotless cleanup.
                </p>
                <ul className="card-features">
                  <li><i className="fa-solid fa-circle-check"></i> Dust-Controlled Cuts</li>
                  <li><i className="fa-solid fa-circle-check"></i> Full Waste Removal</li>
                </ul>
              </div>
            </div>

            {/* Card 4: 10-Year Guarantee */}
            <div className="col-lg-3 col-md-6">
              <div className="standards-card">
                <div className="card-icon-wrap">
                  <i className="fa-solid fa-shield-halved"></i>
                </div>
                <span className="card-tag">Guaranteed</span>
                <h3 className="card-title">10-Year Trade Guarantee</h3>
                <p className="card-desc">
                  Every installation is backed by our comprehensive 10-year workmanship guarantee and £5M full public liability insurance cover.
                </p>
                <ul className="card-features">
                  <li><i className="fa-solid fa-circle-check"></i> £5M Liability Insurance</li>
                  <li><i className="fa-solid fa-circle-check"></i> 10-Year Warranty</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Trust Highlights Bar (2x2 on Mobile, 4-col on Desktop) */}
          <div className="about-trust-bar">
            <div className="row g-3 g-md-4 align-items-center">
              <div className="col-6 col-md-6 col-xl-3">
                <div className="trust-item">
                  <div className="trust-icon">
                    <i className="fa-solid fa-award"></i>
                  </div>
                  <div>
                    <h5 className="trust-title">3,600+ Completed</h5>
                    <p className="trust-sub">Across Birmingham</p>
                  </div>
                </div>
              </div>

              <div className="col-6 col-md-6 col-xl-3">
                <div className="trust-item">
                  <div className="trust-icon">
                    <i className="fa-solid fa-clock-rotate-left"></i>
                  </div>
                  <div>
                    <h5 className="trust-title">15+ Years Experience</h5>
                    <p className="trust-sub">Trade-Certified Fitters</p>
                  </div>
                </div>
              </div>

              <div className="col-6 col-md-6 col-xl-3">
                <div className="trust-item">
                  <div className="trust-icon">
                    <i className="fa-solid fa-shield-halved"></i>
                  </div>
                  <div>
                    <h5 className="trust-title">£5,000,000 Insured</h5>
                    <p className="trust-sub">Public Liability Cover</p>
                  </div>
                </div>
              </div>

              <div className="col-6 col-md-6 col-xl-3">
                <div className="trust-item">
                  <div className="trust-icon">
                    <i className="fa-solid fa-circle-check"></i>
                  </div>
                  <div>
                    <h5 className="trust-title">100% Free Quotes</h5>
                    <p className="trust-sub">Zero Obligation Survey</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Achievement Section */}
      <section className="space bg-light">
        <div className="container">
          <div className="row gy-40 align-items-center">
            {/* Left Content Column */}
            <div className="col-lg-5">
              <div className="achivement-content-wrapper pe-lg-3">
                <div className="sub-title-2 text-theme mb-2">
                  <i className="fa-solid fa-circle-check"></i>Our Track Record
                </div>
                <h2 className="sec-title mb-3" style={{ fontSize: 'clamp(28px, 3.2vw, 40px)', lineHeight: 1.25 }}>
                  Trusted by Homeowners &amp; Businesses Across Birmingham &amp; Beyond
                </h2>
                <p className="mb-4 text-secondary" style={{ fontSize: '15px', lineHeight: 1.7 }}>
                  ZK Flooring has delivered premium carpet, LVT, hardwood, and commercial vinyl installations to over 3,600 satisfied property owners across the West Midlands.
                </p>

                <div className="inner-contact d-flex align-items-center mt-4">
                  <div
                    className="icon me-3 bg-theme rounded-circle d-flex align-items-center justify-content-center"
                    style={{ width: '56px', height: '56px', flexShrink: 0 }}
                  >
                    <i className="fa-solid fa-phone text-dark fs-4"></i>
                  </div>
                  <div className="content">
                    <h6 className="call-text text-theme mb-1" style={{ fontSize: '13px', fontWeight: 600 }}>Need Help?</h6>
                    <a className="call-phone text-dark fs-5 fw-bold text-decoration-none" href="tel:07903723774">
                      07903 723 774
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Right 4 Clean Luxury Stat Cards */}
            <div className="col-lg-7">
              <div className="row gy-3">
                <div className="col-sm-6">
                  <div
                    className="p-4 rounded-4 h-100"
                    style={{
                      backgroundColor: '#FFFFFF',
                      border: '1px solid rgba(212, 175, 55, 0.25)',
                      boxShadow: '0 8px 24px rgba(0, 0, 0, 0.04)',
                    }}
                  >
                    <h3 className="fw-bold mb-1" style={{ color: '#AA771C', fontSize: '36px' }}>
                      3,600+
                    </h3>
                    <p className="text-dark mb-1 fw-bold" style={{ fontSize: '16px' }}>
                      Projects Completed
                    </p>
                    <p className="text-muted mb-0" style={{ fontSize: '13px' }}>
                      Homes &amp; commercial properties fitted
                    </p>
                  </div>
                </div>

                <div className="col-sm-6">
                  <div
                    className="p-4 rounded-4 h-100"
                    style={{
                      backgroundColor: '#FFFFFF',
                      border: '1px solid rgba(212, 175, 55, 0.25)',
                      boxShadow: '0 8px 24px rgba(0, 0, 0, 0.04)',
                    }}
                  >
                    <h3 className="fw-bold mb-1" style={{ color: '#AA771C', fontSize: '36px' }}>
                      15+
                    </h3>
                    <p className="text-dark mb-1 fw-bold" style={{ fontSize: '16px' }}>
                      Years of Experience
                    </p>
                    <p className="text-muted mb-0" style={{ fontSize: '13px' }}>
                      Master floor fitting craftsmanship
                    </p>
                  </div>
                </div>

                <div className="col-sm-6">
                  <div
                    className="p-4 rounded-4 h-100"
                    style={{
                      backgroundColor: '#FFFFFF',
                      border: '1px solid rgba(212, 175, 55, 0.25)',
                      boxShadow: '0 8px 24px rgba(0, 0, 0, 0.04)',
                    }}
                  >
                    <h3 className="fw-bold mb-1" style={{ color: '#AA771C', fontSize: '36px' }}>
                      98%
                    </h3>
                    <p className="text-dark mb-1 fw-bold" style={{ fontSize: '16px' }}>
                      Customer Satisfaction
                    </p>
                    <p className="text-muted mb-0" style={{ fontSize: '13px' }}>
                      5-star verified reviews &amp; ratings
                    </p>
                  </div>
                </div>

                <div className="col-sm-6">
                  <div
                    className="p-4 rounded-4 h-100"
                    style={{
                      backgroundColor: '#FFFFFF',
                      border: '1px solid rgba(212, 175, 55, 0.25)',
                      boxShadow: '0 8px 24px rgba(0, 0, 0, 0.04)',
                    }}
                  >
                    <h3 className="fw-bold mb-1" style={{ color: '#AA771C', fontSize: '36px' }}>
                      6+
                    </h3>
                    <p className="text-dark mb-1 fw-bold" style={{ fontSize: '16px' }}>
                      Flooring Categories
                    </p>
                    <p className="text-muted mb-0" style={{ fontSize: '13px' }}>
                      Carpet, LVT, Wood, Vinyl &amp; Screed
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
