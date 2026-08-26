'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

export default function AboutEditorialClient() {
  // 1. Interactive Before / After Slider State
  const [sliderPosition, setSliderPosition] = useState(50);
  const isDragging = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleSliderMove = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percentage);
  };

  const handleMouseDown = () => {
    isDragging.current = true;
  };

  const handleTouchStart = () => {
    isDragging.current = true;
  };

  useEffect(() => {
    const handleMouseUp = () => {
      isDragging.current = false;
    };
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging.current) return;
      handleSliderMove(e.clientX);
    };
    const handleTouchMove = (e: TouchEvent) => {
      if (!isDragging.current || !e.touches[0]) return;
      handleSliderMove(e.touches[0].clientX);
    };

    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchend', handleMouseUp);
    window.addEventListener('touchmove', handleTouchMove);

    return () => {
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchend', handleMouseUp);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, []);

  // 2. Interactive Material Tabs State
  const [activeTab, setActiveTab] = useState<'subfloor' | 'carpet' | 'lvt' | 'hardwood'>('lvt');

  const tabContents = {
    lvt: {
      title: 'Luxury Vinyl Tiles (LVT) & Herringbone Parquet',
      subtitle: 'Waterproof Luxury with Natural Woodgrain & Stone Textures',
      description: 'Our certified fitters hand-cut and align luxury herringbone, chevron, and wide-plank LVT. Every plank is laid over a laser-levelled subfloor, ensuring 100% waterproof protection, acoustic silence, and timeless British elegance.',
      image: '/services/Vinyl, Vinyl Tile.webp',
      specs: ['100% Waterproof & Stain-Proof', 'Precision Bevelled Edges', 'Acoustic Sound-Dampening Core', 'Bespoke Border Detailing'],
      badge: 'POPULAR CHOICE',
    },
    subfloor: {
      title: 'Laser-Flat Subfloor Levelling & Moisture Prep',
      subtitle: 'The Engineering Foundation of Every Enduring Floor',
      description: 'We never lay new flooring over uneven surfaces. Our diagnostic team tests subfloor moisture levels, installs damp-proof membranes (DPM), and applies industrial latex screeds and timber ply boarding for a completely silent, crack-free base.',
      image: '/services/Self Levelling.webp',
      specs: ['Industrial Latex Compound', 'DPM Moisture Barrier', 'Structural Timber Ply Prep', '0mm Level Tolerance'],
      badge: 'FOUNDATIONAL CRAFT',
    },
    carpet: {
      title: 'Plush British Wool & Stain-Free Carpets',
      subtitle: 'Unrivalled Underfoot Warmth, Thermal Comfort & Silence',
      description: 'From luxury deep-pile twists to bespoke stair runners with brass rods, our carpet installations include high-density acoustic underlays that maximize insulation, comfort, and carpet lifespan.',
      image: '/services/Carpet, Carpet Tile.webp',
      specs: ['High-Density 11mm Underlay', 'Stain-Resistant Technology', 'Custom Stair Runners & Whips', 'Commercial Acoustic Tiles'],
      badge: 'SUPREME COMFORT',
    },
    hardwood: {
      title: 'Engineered Hardwood & High-Traffic Laminates',
      subtitle: 'Authentic European Oak with AC5 Commercial Durability',
      description: 'Experience the natural beauty of real engineered oak and premium scratch-resistant laminates. Installed with seamless expansion gaps, matched scotia beading, and flawless door threshold profiles.',
      image: '/slider/Laminate Flooring.webp',
      specs: ['Real European Oak Veneer', 'AC5 Commercial Scratch Rating', 'Underfloor Heating Compatible', 'Seamless Perimeter Profiles'],
      badge: 'TIMELESS CLASSIC',
    },
  };

  const currentTab = tabContents[activeTab];

  return (
    <main className="bg-light" style={{ overflow: 'hidden' }}>
      {/* =========================================================================
          1. EDITORIAL HERO & TRUST METRICS STRIP
          ========================================================================= */}
      <section className="position-relative pt-5 pb-5 overflow-hidden">
        {/* Subtle Ambient Radial Warm Glow */}
        <div
          style={{
            position: 'absolute',
            top: '-25%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '900px',
            height: '500px',
            background: 'radial-gradient(circle, rgba(179, 135, 40, 0.12) 0%, rgba(248, 246, 240, 0) 70%)',
            pointerEvents: 'none',
            zIndex: 0,
          }}
        />

        <div className="container position-relative" style={{ zIndex: 1 }}>
          {/* Breadcrumb Capsule */}
          <div className="d-flex justify-content-center mb-4">
            <div
              className="d-inline-flex align-items-center gap-2 px-4 py-2 rounded-pill shadow-sm"
              style={{
                background: '#FFFFFF',
                border: '1px solid rgba(179, 135, 40, 0.25)',
                fontSize: '13px',
                fontWeight: 600,
                color: '#16120B',
              }}
            >
              <i className="fa-solid fa-house" style={{ color: '#B38728', fontSize: '11px' }}></i>
              <Link href="/" style={{ color: '#16120B', textDecoration: 'none' }}>Home</Link>
              <span style={{ color: '#B38728' }}>/</span>
              <span style={{ color: '#B38728' }}>About Us</span>
            </div>
          </div>

          {/* Main Title & Editorial Subtitle */}
          <div className="text-center max-w-900 mx-auto mb-5" style={{ maxWidth: '880px' }}>
            <h1
              className="fw-bold mb-3"
              style={{
                fontSize: 'clamp(32px, 4.5vw, 54px)',
                lineHeight: 1.18,
                letterSpacing: '-0.02em',
                color: '#16120B',
              }}
            >
              Transforming British Spaces With <br />
              <span
                style={{
                  background: 'linear-gradient(135deg, #966F1E 0%, #C99738 35%, #8A5F11 70%, #B38728 100%)',
                  WebkitBackgroundClip: 'text',
                  backgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  fontWeight: 800,
                }}
              >
                Master Precision &amp; Enduring Quality
              </span>
            </h1>
            <p
              className="mx-auto fw-normal"
              style={{
                fontSize: '17px',
                lineHeight: 1.7,
                maxWidth: '680px',
                color: '#555048',
              }}
            >
              Birmingham&apos;s premier specialists in luxury carpets, LVT, laminate, engineered hardwood, and laser-flat subfloor screeding for domestic and commercial properties.
            </p>
          </div>

          {/* 4 Core Quick Metrics Header Strip */}
          <div
            className="p-4 p-lg-5 rounded-4 shadow-sm"
            style={{
              background: '#FFFFFF',
              border: '1px solid rgba(179, 135, 40, 0.2)',
              borderRadius: '28px',
            }}
          >
            <div className="row g-4 text-center divide-lg-x align-items-center">
              <div className="col-6 col-lg-3">
                <div className="p-2">
                  <div
                    className="display-6 fw-bold mb-1"
                    style={{
                      background: 'linear-gradient(to right, #BF953F, #B38728, #AA771C)',
                      WebkitBackgroundClip: 'text',
                      backgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}
                  >
                    15+ Years
                  </div>
                  <p className="text-dark fw-bold mb-0" style={{ fontSize: '15px' }}>Master Trade Experience</p>
                  <span className="text-muted" style={{ fontSize: '13px' }}>Serving West Midlands</span>
                </div>
              </div>

              <div className="col-6 col-lg-3">
                <div className="p-2">
                  <div
                    className="display-6 fw-bold mb-1"
                    style={{
                      background: 'linear-gradient(to right, #BF953F, #B38728, #AA771C)',
                      WebkitBackgroundClip: 'text',
                      backgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}
                  >
                    3,600+
                  </div>
                  <p className="text-dark fw-bold mb-0" style={{ fontSize: '15px' }}>Floors Installed</p>
                  <span className="text-muted" style={{ fontSize: '13px' }}>Homes &amp; Commercial Units</span>
                </div>
              </div>

              <div className="col-6 col-lg-3">
                <div className="p-2">
                  <div
                    className="display-6 fw-bold mb-1"
                    style={{
                      background: 'linear-gradient(to right, #BF953F, #B38728, #AA771C)',
                      WebkitBackgroundClip: 'text',
                      backgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}
                  >
                    100%
                  </div>
                  <p className="text-dark fw-bold mb-0" style={{ fontSize: '15px' }}>Subfloor Guarantee</p>
                  <span className="text-muted" style={{ fontSize: '13px' }}>Laser-Flat Levelling</span>
                </div>
              </div>

              <div className="col-6 col-lg-3">
                <div className="p-2">
                  <div
                    className="display-6 fw-bold mb-1"
                    style={{
                      background: 'linear-gradient(to right, #BF953F, #B38728, #AA771C)',
                      WebkitBackgroundClip: 'text',
                      backgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}
                  >
                    200+
                  </div>
                  <p className="text-dark fw-bold mb-0" style={{ fontSize: '15px' }}>Doorstep Swatches</p>
                  <span className="text-muted" style={{ fontSize: '13px' }}>Free In-Home Survey</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          2. THE ZK STORY & PHILOSOPHY (EDITORIAL COLLAGE)
          ========================================================================= */}
      <section className="space position-relative pt-4">
        <div className="container">
          <div className="row gy-5 align-items-center">
            {/* Left Column: Visual Collage */}
            <div className="col-lg-6">
              <div className="position-relative pe-lg-4">
                {/* Main Architectural Showcase */}
                <div
                  className="overflow-hidden shadow-lg"
                  style={{
                    borderRadius: '28px',
                    border: '2px solid rgba(179, 135, 40, 0.25)',
                    position: 'relative',
                  }}
                >
                  <img
                    src="/about page/1.webp"
                    alt="ZK Flooring Luxury Interior"
                    style={{ width: '100%', height: '480px', objectFit: 'cover', display: 'block' }}
                  />
                </div>

                {/* Floating Craft Inset Card */}
                <div
                  className="position-absolute d-none d-md-block shadow-lg overflow-hidden"
                  style={{
                    bottom: '-35px',
                    right: '-10px',
                    width: '230px',
                    height: '170px',
                    borderRadius: '20px',
                    border: '4px solid #FFFFFF',
                    zIndex: 2,
                  }}
                >
                  <img
                    src="/about page/2.webp"
                    alt="Master Flooring Fitter"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>

                {/* Floating Gold Experience Badge */}
                <div
                  className="position-absolute top-0 start-0 m-4 px-4 py-3 shadow-lg d-flex align-items-center gap-3"
                  style={{
                    background: 'linear-gradient(135deg, #BF953F 0%, #FCF6BA 25%, #B38728 50%, #FBF5B7 75%, #AA771C 100%)',
                    borderRadius: '18px',
                    zIndex: 3,
                  }}
                >
                  <div className="fs-2 fw-bold text-dark lh-1">15+</div>
                  <div className="text-dark fw-bold lh-sm" style={{ fontSize: '13px' }}>
                    Years of Master <br />Trade Craftsmanship
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Editorial Copy & Pillars */}
            <div className="col-lg-6">
              <div className="ps-lg-3">
                <div
                  className="d-inline-flex align-items-center gap-2 px-3 py-1 rounded-pill mb-3"
                  style={{ background: 'rgba(212, 175, 55, 0.15)', border: '1px solid rgba(179, 135, 40, 0.3)' }}
                >
                  <i className="fa-solid fa-crown" style={{ color: '#B38728', fontSize: '12px' }}></i>
                  <span className="fw-bold" style={{ color: '#16120B', fontSize: '13px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                    Our Heritage &amp; Standards
                  </span>
                </div>

                <h2 className="fw-bold text-dark mb-4" style={{ fontSize: 'clamp(28px, 3.5vw, 40px)', lineHeight: 1.25, letterSpacing: '-0.01em' }}>
                  Where Master Craftsmanship Meets Uncompromising Precision
                </h2>

                <p className="text-muted mb-3" style={{ fontSize: '16px', lineHeight: 1.8 }}>
                  At <strong className="text-dark">ZK Flooring</strong>, we believe a floor is only as resilient as the precision with which it is prepared and laid. Founded in Birmingham with an obsession for trade excellence, our certified fitters deliver flawless installations tailored to modern living.
                </p>

                <p className="text-muted mb-4" style={{ fontSize: '16px', lineHeight: 1.8 }}>
                  Unlike generic contractors, we never cut corners on subfloor preparation. We laser-diagnose moisture levels, apply industrial-grade latex self-levelling, and hand-fit luxury carpets, herringbone LVT, and engineered timbers directly in your space.
                </p>

                {/* 2 Value Badges */}
                <div className="d-flex flex-column gap-3 mb-4">
                  <div className="d-flex align-items-start gap-3 p-3 rounded-4" style={{ background: '#FFFFFF', border: '1px solid rgba(0, 0, 0, 0.06)', boxShadow: '0 4px 15px rgba(0, 0, 0, 0.03)' }}>
                    <div className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: '44px', height: '44px', background: '#16120B' }}>
                      <i className="fa-solid fa-layer-group" style={{ color: '#FCF6BA', fontSize: '18px' }}></i>
                    </div>
                    <div>
                      <h4 className="fw-bold text-dark mb-1" style={{ fontSize: '16px' }}>Laser-Flat Subfloor Levelling</h4>
                      <p className="text-muted mb-0" style={{ fontSize: '14px' }}>Industrial latex screeding and plywood prep eliminating bumps, dips, and squeaks permanently.</p>
                    </div>
                  </div>

                  <div className="d-flex align-items-start gap-3 p-3 rounded-4" style={{ background: '#FFFFFF', border: '1px solid rgba(0, 0, 0, 0.06)', boxShadow: '0 4px 15px rgba(0, 0, 0, 0.03)' }}>
                    <div className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: '44px', height: '44px', background: '#16120B' }}>
                      <i className="fa-solid fa-truck-fast" style={{ color: '#FCF6BA', fontSize: '18px' }}></i>
                    </div>
                    <div>
                      <h4 className="fw-bold text-dark mb-1" style={{ fontSize: '16px' }}>Doorstep Sample Consultation</h4>
                      <p className="text-muted mb-0" style={{ fontSize: '14px' }}>150+ carpet, vinyl &amp; LVT swatch books brought directly to your home with free precision measurement.</p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="d-flex flex-wrap gap-3 align-items-center pt-2">
                  <Link href="/contact" className="theme-btn br-30">
                    <span className="link-effect">
                      <span className="effect-1">Book Free Survey</span>
                      <span className="effect-1">Book Free Survey</span>
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
                  </Link>
                  <a
                    href="tel:07903723774"
                    className="btn btn-outline-dark rounded-pill px-4 py-3 fw-bold d-inline-flex align-items-center gap-2"
                    style={{ borderColor: '#16120B' }}
                  >
                    <i className="fa-solid fa-phone" style={{ color: '#B38728' }}></i>
                    07903 723 774
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          3. INTERACTIVE BEFORE / AFTER TRANSFORMATION SLIDER (WOW FEATURE)
          ========================================================================= */}
      <section className="space position-relative">
        <div className="container">
          <div className="text-center max-w-800 mx-auto mb-5" style={{ maxWidth: '750px' }}>
            <div
              className="d-inline-flex align-items-center gap-2 px-3 py-1 rounded-pill mb-3"
              style={{ background: 'rgba(212, 175, 55, 0.15)', border: '1px solid rgba(179, 135, 40, 0.3)' }}
            >
              <i className="fa-solid fa-sliders" style={{ color: '#B38728', fontSize: '12px' }}></i>
              <span className="fw-bold" style={{ color: '#16120B', fontSize: '13px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                Transformation Showcase
              </span>
            </div>
            <h2 className="fw-bold text-dark mb-3" style={{ fontSize: 'clamp(28px, 3.5vw, 42px)', letterSpacing: '-0.01em' }}>
              The Power of Precision Subfloor &amp; Finish
            </h2>
            <p className="text-muted" style={{ fontSize: '16px' }}>
              Drag the interactive golden slider below to see how our industrial latex screeding and subfloor prep transforms rough surfaces into luxury British floors.
            </p>
          </div>

          {/* Interactive Slider Box */}
          <div className="row justify-content-center">
            <div className="col-lg-10">
              <div
                ref={containerRef}
                className="position-relative overflow-hidden shadow-2xl user-select-none"
                style={{
                  height: '460px',
                  borderRadius: '30px',
                  border: '2px solid rgba(212, 175, 55, 0.35)',
                  cursor: 'ew-resize',
                  touchAction: 'none',
                }}
                onMouseDown={handleMouseDown}
                onTouchStart={handleTouchStart}
              >
                {/* AFTER IMAGE (Finished Luxury Interior) */}
                <img
                  src="/about page/1.webp"
                  alt="After: Luxury Finished Flooring"
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    pointerEvents: 'none',
                  }}
                />
                <div
                  className="position-absolute top-0 end-0 m-4 px-3 py-1 rounded-pill shadow-lg"
                  style={{
                    background: 'rgba(22, 18, 11, 0.92)',
                    backdropFilter: 'blur(8px)',
                    border: '1px solid rgba(212, 175, 55, 0.4)',
                    color: '#FCF6BA',
                    fontSize: '12px',
                    fontWeight: 700,
                    zIndex: 4,
                  }}
                >
                  AFTER: LUXURY FINISH
                </div>

                {/* BEFORE IMAGE (Subfloor Prep with Clip-Path) */}
                <div
                  className="position-absolute inset-0"
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    clipPath: `polygon(0 0, ${sliderPosition}% 0, ${sliderPosition}% 100%, 0 100%)`,
                    pointerEvents: 'none',
                    zIndex: 5,
                  }}
                >
                  <img
                    src="/services/Self Levelling.webp"
                    alt="Before: Subfloor Preparation"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                  />
                  <div
                    className="position-absolute top-0 start-0 m-4 px-3 py-1 rounded-pill shadow-lg"
                    style={{
                      background: 'rgba(22, 18, 11, 0.92)',
                      backdropFilter: 'blur(8px)',
                      border: '1px solid rgba(212, 175, 55, 0.4)',
                      color: '#FCF6BA',
                      fontSize: '12px',
                      fontWeight: 700,
                      whiteSpace: 'nowrap',
                    }}
                  >
                    BEFORE: SUBFLOOR PREP
                  </div>
                </div>

                {/* DRAGGABLE DIVIDER LINE & HANDLE */}
                <div
                  className="position-absolute top-0 bottom-0"
                  style={{
                    left: `${sliderPosition}%`,
                    width: '3px',
                    background: 'linear-gradient(to bottom, #BF953F, #FCF6BA, #B38728)',
                    zIndex: 10,
                    pointerEvents: 'none',
                  }}
                >
                  <div
                    className="position-absolute top-50 start-50 translate-middle rounded-circle shadow-lg d-flex align-items-center justify-content-center"
                    style={{
                      width: '44px',
                      height: '44px',
                      background: 'linear-gradient(135deg, #BF953F 0%, #FCF6BA 35%, #B38728 70%, #AA771C 100%)',
                      border: '2px solid #FFFFFF',
                    }}
                  >
                    <i className="fa-solid fa-arrows-left-right text-dark fs-6"></i>
                  </div>
                </div>
              </div>

              <div className="text-center mt-3 text-muted" style={{ fontSize: '13px' }}>
                <i className="fa-solid fa-hand-pointer me-1" style={{ color: '#B38728' }}></i>
                Click or drag the golden slider left &amp; right to compare before &amp; after
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          4. INTERACTIVE MATERIAL MASTERY TABS
          ========================================================================= */}
      <section className="space position-relative pt-0">
        <div className="container">
          <div className="text-center max-w-800 mx-auto mb-5" style={{ maxWidth: '750px' }}>
            <div
              className="d-inline-flex align-items-center gap-2 px-3 py-1 rounded-pill mb-3"
              style={{ background: 'rgba(212, 175, 55, 0.15)', border: '1px solid rgba(179, 135, 40, 0.3)' }}
            >
              <i className="fa-solid fa-swatchbook" style={{ color: '#B38728', fontSize: '12px' }}></i>
              <span className="fw-bold" style={{ color: '#16120B', fontSize: '13px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                Material Collections
              </span>
            </div>
            <h2 className="fw-bold text-dark mb-3" style={{ fontSize: 'clamp(28px, 3.5vw, 42px)', letterSpacing: '-0.01em' }}>
              Specialist Flooring Engineered For Every Space
            </h2>
            <p className="text-muted" style={{ fontSize: '16px' }}>
              Explore our full spectrum of British and European flooring solutions tailored for residential and commercial spaces.
            </p>

            {/* TAB SELECTOR BUTTONS */}
            <div className="d-flex flex-wrap justify-content-center gap-2 mt-4">
              <button
                onClick={() => setActiveTab('lvt')}
                className={`px-4 py-2 rounded-pill fw-bold border-0 transition-all ${
                  activeTab === 'lvt' ? 'shadow-md text-dark' : 'bg-white text-muted shadow-sm'
                }`}
                style={{
                  background: activeTab === 'lvt' ? 'linear-gradient(135deg, #BF953F, #FCF6BA)' : '#FFFFFF',
                  fontSize: '14px',
                }}
              >
                Luxury Vinyl Tile (LVT)
              </button>

              <button
                onClick={() => setActiveTab('subfloor')}
                className={`px-4 py-2 rounded-pill fw-bold border-0 transition-all ${
                  activeTab === 'subfloor' ? 'shadow-md text-dark' : 'bg-white text-muted shadow-sm'
                }`}
                style={{
                  background: activeTab === 'subfloor' ? 'linear-gradient(135deg, #BF953F, #FCF6BA)' : '#FFFFFF',
                  fontSize: '14px',
                }}
              >
                Subfloor &amp; Screeding
              </button>

              <button
                onClick={() => setActiveTab('carpet')}
                className={`px-4 py-2 rounded-pill fw-bold border-0 transition-all ${
                  activeTab === 'carpet' ? 'shadow-md text-dark' : 'bg-white text-muted shadow-sm'
                }`}
                style={{
                  background: activeTab === 'carpet' ? 'linear-gradient(135deg, #BF953F, #FCF6BA)' : '#FFFFFF',
                  fontSize: '14px',
                }}
              >
                Plush Carpets &amp; Runners
              </button>

              <button
                onClick={() => setActiveTab('hardwood')}
                className={`px-4 py-2 rounded-pill fw-bold border-0 transition-all ${
                  activeTab === 'hardwood' ? 'shadow-md text-dark' : 'bg-white text-muted shadow-sm'
                }`}
                style={{
                  background: activeTab === 'hardwood' ? 'linear-gradient(135deg, #BF953F, #FCF6BA)' : '#FFFFFF',
                  fontSize: '14px',
                }}
              >
                Hardwood &amp; Laminate
              </button>
            </div>
          </div>

          {/* ACTIVE TAB DISPLAY CARD */}
          <div
            className="p-4 p-lg-5 rounded-5 shadow-lg position-relative overflow-hidden"
            style={{
              background: '#FFFFFF',
              border: '1px solid rgba(179, 135, 40, 0.25)',
              borderRadius: '32px',
            }}
          >
            <div className="row gy-4 align-items-center">
              <div className="col-lg-6">
                <div className="position-relative overflow-hidden" style={{ borderRadius: '24px', height: '380px' }}>
                  <img
                    src={currentTab.image}
                    alt={currentTab.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <div
                    className="position-absolute top-0 start-0 m-3 px-3 py-1 rounded-pill"
                    style={{
                      background: 'rgba(22, 18, 11, 0.9)',
                      color: '#FCF6BA',
                      fontSize: '12px',
                      fontWeight: 700,
                    }}
                  >
                    {currentTab.badge}
                  </div>
                </div>
              </div>

              <div className="col-lg-6 ps-lg-4">
                <h3 className="fw-bold text-dark mb-2" style={{ fontSize: 'clamp(24px, 3vw, 32px)' }}>
                  {currentTab.title}
                </h3>
                <h5 className="fw-semibold mb-3" style={{ color: '#B38728', fontSize: '16px' }}>
                  {currentTab.subtitle}
                </h5>
                <p className="text-muted mb-4" style={{ fontSize: '15px', lineHeight: 1.7 }}>
                  {currentTab.description}
                </p>

                <div className="row g-2 mb-4">
                  {currentTab.specs.map((spec, i) => (
                    <div key={i} className="col-sm-6">
                      <div className="d-flex align-items-center gap-2 p-2 rounded-3" style={{ background: '#F8F6F0' }}>
                        <i className="fa-solid fa-circle-check" style={{ color: '#B38728', fontSize: '14px' }}></i>
                        <span className="text-dark fw-semibold" style={{ fontSize: '13px' }}>{spec}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <Link href="/contact" className="theme-btn br-30">
                  <span className="link-effect">
                    <span className="effect-1">Explore Samples &amp; Quote</span>
                    <span className="effect-1">Explore Samples &amp; Quote</span>
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          5. THE 4-STEP PRECISION INSTALLATION PROTOCOL
          ========================================================================= */}
      <section className="space position-relative pt-0">
        <div className="container">
          <div
            className="p-5 overflow-hidden position-relative shadow-lg"
            style={{
              background: '#16120B',
              border: '1px solid rgba(212, 175, 55, 0.3)',
              borderRadius: '32px',
            }}
          >
            <div className="row mb-5 text-center text-lg-start align-items-end">
              <div className="col-lg-8">
                <div
                  className="d-inline-flex align-items-center gap-2 px-3 py-1 rounded-pill mb-3"
                  style={{ background: 'rgba(212, 175, 55, 0.2)', border: '1px solid rgba(255, 255, 255, 0.15)' }}
                >
                  <i className="fa-solid fa-list-check" style={{ color: '#FCF6BA', fontSize: '12px' }}></i>
                  <span className="fw-bold" style={{ color: '#FCF6BA', fontSize: '12px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                    Workflow Protocol
                  </span>
                </div>
                <h2 className="display-6 fw-bold text-white mb-0">Our 4-Stage Precision Installation Journey</h2>
              </div>
              <div className="col-lg-4 text-lg-end mt-3 mt-lg-0">
                <span className="text-white-50" style={{ fontSize: '15px' }}>From Doorstep Survey to Final Guarantee</span>
              </div>
            </div>

            <div className="row g-4">
              {/* Step 1 */}
              <div className="col-lg-3 col-md-6">
                <div
                  className="p-4 h-100 d-flex flex-column position-relative"
                  style={{
                    background: 'rgba(255, 255, 255, 0.04)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '22px',
                  }}
                >
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <span className="fw-bold" style={{ color: '#FCF6BA', fontSize: '13px', letterSpacing: '0.05em' }}>PHASE 01</span>
                    <div className="rounded-circle d-flex align-items-center justify-content-center" style={{ width: '42px', height: '42px', background: 'linear-gradient(135deg, #BF953F, #FCF6BA)' }}>
                      <i className="fa-solid fa-ruler-combined text-dark fs-6"></i>
                    </div>
                  </div>
                  <h3 className="text-white fw-bold mb-2" style={{ fontSize: '18px' }}>Free In-Home Survey</h3>
                  <p className="text-white-50 mb-0 flex-grow-1" style={{ fontSize: '14px', lineHeight: 1.6 }}>
                    We visit your premises with 150+ swatch samples, measure square footage accurately, and provide a transparent quote.
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="col-lg-3 col-md-6">
                <div
                  className="p-4 h-100 d-flex flex-column position-relative"
                  style={{
                    background: 'rgba(255, 255, 255, 0.04)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '22px',
                  }}
                >
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <span className="fw-bold" style={{ color: '#FCF6BA', fontSize: '13px', letterSpacing: '0.05em' }}>PHASE 02</span>
                    <div className="rounded-circle d-flex align-items-center justify-content-center" style={{ width: '42px', height: '42px', background: 'linear-gradient(135deg, #BF953F, #FCF6BA)' }}>
                      <i className="fa-solid fa-layer-group text-dark fs-6"></i>
                    </div>
                  </div>
                  <h3 className="text-white fw-bold mb-2" style={{ fontSize: '18px' }}>Subfloor Diagnostics</h3>
                  <p className="text-white-50 mb-0 flex-grow-1" style={{ fontSize: '14px', lineHeight: 1.6 }}>
                    Moisture barrier testing, plywood installation, and industrial latex screeding ensuring a laser-level base.
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="col-lg-3 col-md-6">
                <div
                  className="p-4 h-100 d-flex flex-column position-relative"
                  style={{
                    background: 'rgba(255, 255, 255, 0.04)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '22px',
                  }}
                >
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <span className="fw-bold" style={{ color: '#FCF6BA', fontSize: '13px', letterSpacing: '0.05em' }}>PHASE 03</span>
                    <div className="rounded-circle d-flex align-items-center justify-content-center" style={{ width: '42px', height: '42px', background: 'linear-gradient(135deg, #BF953F, #FCF6BA)' }}>
                      <i className="fa-solid fa-hammer text-dark fs-6"></i>
                    </div>
                  </div>
                  <h3 className="text-white fw-bold mb-2" style={{ fontSize: '18px' }}>Master Installation</h3>
                  <p className="text-white-50 mb-0 flex-grow-1" style={{ fontSize: '14px', lineHeight: 1.6 }}>
                    Expert fitting by trade-certified fitters with clean invisible seams, micro-bevel cuts, and premium underlays.
                  </p>
                </div>
              </div>

              {/* Step 4 */}
              <div className="col-lg-3 col-md-6">
                <div
                  className="p-4 h-100 d-flex flex-column position-relative"
                  style={{
                    background: 'rgba(255, 255, 255, 0.04)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '22px',
                  }}
                >
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <span className="fw-bold" style={{ color: '#FCF6BA', fontSize: '13px', letterSpacing: '0.05em' }}>PHASE 04</span>
                    <div className="rounded-circle d-flex align-items-center justify-content-center" style={{ width: '42px', height: '42px', background: 'linear-gradient(135deg, #BF953F, #FCF6BA)' }}>
                      <i className="fa-solid fa-award text-dark fs-6"></i>
                    </div>
                  </div>
                  <h3 className="text-white fw-bold mb-2" style={{ fontSize: '18px' }}>White-Glove Handover</h3>
                  <p className="text-white-50 mb-0 flex-grow-1" style={{ fontSize: '14px', lineHeight: 1.6 }}>
                    Thorough clean-up, zero mess, client inspection walkthrough, and complete fitting warranty certificate.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          6. MEET OUR MASTER INSTALLERS (CLEAN LUXURY PORTRAITS)
          ========================================================================= */}
      <section className="space position-relative pt-0">
        <div className="container">
          <div className="row gy-4 align-items-center mb-5">
            <div className="col-lg-6">
              <div
                className="d-inline-flex align-items-center gap-2 px-3 py-1 rounded-pill mb-3"
                style={{ background: 'rgba(212, 175, 55, 0.15)', border: '1px solid rgba(179, 135, 40, 0.3)' }}
              >
                <i className="fa-solid fa-user-check" style={{ color: '#B38728', fontSize: '12px' }}></i>
                <span className="fw-bold" style={{ color: '#16120B', fontSize: '13px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                  Trade Specialists
                </span>
              </div>
              <h2 className="fw-bold text-dark mb-0" style={{ fontSize: 'clamp(28px, 3.5vw, 40px)', letterSpacing: '-0.01em' }}>
                Meet Our Expert In-House Installation Fitters
              </h2>
            </div>
            <div className="col-lg-6">
              <p className="text-muted mb-0 ps-lg-4" style={{ fontSize: '16px', lineHeight: 1.7 }}>
                We never subcontract to untrained third parties. Every ZK Flooring project is executed by dedicated, trade-certified master fitters with extensive experience.
              </p>
            </div>
          </div>

          <div className="row gy-4">
            {/* Fitter 1: Zeeshan */}
            <div className="col-lg-4 col-md-6">
              <div
                className="overflow-hidden shadow-sm position-relative"
                style={{
                  borderRadius: '26px',
                  background: '#16120B',
                  border: '1px solid rgba(212, 175, 55, 0.25)',
                }}
              >
                <img
                  src="/Our Team/1.jpg"
                  alt="Zeeshan - Master Flooring Fitter"
                  style={{ width: '100%', height: '380px', objectFit: 'cover', display: 'block' }}
                />
                <div
                  className="p-3 mx-3 mb-3 position-absolute bottom-0 start-0 end-0 text-center shadow-lg"
                  style={{
                    background: 'rgba(22, 18, 11, 0.92)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(212, 175, 55, 0.35)',
                    borderRadius: '18px',
                  }}
                >
                  <h3 className="fw-bold text-white mb-0" style={{ fontSize: '20px' }}>Zeeshan</h3>
                  <span className="fw-semibold" style={{ color: '#FCF6BA', fontSize: '13px' }}>Master Flooring Installer &amp; Estimator</span>
                </div>
              </div>
            </div>

            {/* Fitter 2: Ali */}
            <div className="col-lg-4 col-md-6">
              <div
                className="overflow-hidden shadow-sm position-relative"
                style={{
                  borderRadius: '26px',
                  background: '#16120B',
                  border: '1px solid rgba(212, 175, 55, 0.25)',
                }}
              >
                <img
                  src="/Our Team/2.jpg"
                  alt="Ali - Carpet & LVT Specialist"
                  style={{ width: '100%', height: '380px', objectFit: 'cover', display: 'block' }}
                />
                <div
                  className="p-3 mx-3 mb-3 position-absolute bottom-0 start-0 end-0 text-center shadow-lg"
                  style={{
                    background: 'rgba(22, 18, 11, 0.92)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(212, 175, 55, 0.35)',
                    borderRadius: '18px',
                  }}
                >
                  <h3 className="fw-bold text-white mb-0" style={{ fontSize: '20px' }}>Ali</h3>
                  <span className="fw-semibold" style={{ color: '#FCF6BA', fontSize: '13px' }}>Carpet &amp; LVT Installation Specialist</span>
                </div>
              </div>
            </div>

            {/* Fitter 3: Hassan */}
            <div className="col-lg-4 col-md-6">
              <div
                className="overflow-hidden shadow-sm position-relative"
                style={{
                  borderRadius: '26px',
                  background: '#16120B',
                  border: '1px solid rgba(212, 175, 55, 0.25)',
                }}
              >
                <img
                  src="/Our Team/3.jpg"
                  alt="Hassan - Subfloor Preparation Expert"
                  style={{ width: '100%', height: '380px', objectFit: 'cover', display: 'block' }}
                />
                <div
                  className="p-3 mx-3 mb-3 position-absolute bottom-0 start-0 end-0 text-center shadow-lg"
                  style={{
                    background: 'rgba(22, 18, 11, 0.92)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(212, 175, 55, 0.35)',
                    borderRadius: '18px',
                  }}
                >
                  <h3 className="fw-bold text-white mb-0" style={{ fontSize: '20px' }}>Hassan</h3>
                  <span className="fw-semibold" style={{ color: '#FCF6BA', fontSize: '13px' }}>Subfloor Levelling &amp; Screed Technician</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          7. WHY CHOOSE ZK (THE 4 CLIENT COMMITMENTS)
          ========================================================================= */}
      <section className="space position-relative pt-0">
        <div className="container">
          <div className="row gy-4">
            <div className="col-lg-3 col-md-6">
              <div className="p-4 h-100 rounded-4 bg-white shadow-sm" style={{ border: '1px solid rgba(0,0,0,0.06)' }}>
                <div className="mb-3 d-flex align-items-center justify-content-center rounded-circle" style={{ width: '50px', height: '50px', background: 'rgba(212, 175, 55, 0.15)' }}>
                  <i className="fa-solid fa-shield-halved" style={{ color: '#B38728', fontSize: '20px' }}></i>
                </div>
                <h4 className="fw-bold text-dark mb-2" style={{ fontSize: '17px' }}>100% Fit Guarantee</h4>
                <p className="text-muted mb-0" style={{ fontSize: '14px', lineHeight: 1.6 }}>
                  Full post-installation assurance and manufacturer-backed warranty on every floor.
                </p>
              </div>
            </div>

            <div className="col-lg-3 col-md-6">
              <div className="p-4 h-100 rounded-4 bg-white shadow-sm" style={{ border: '1px solid rgba(0,0,0,0.06)' }}>
                <div className="mb-3 d-flex align-items-center justify-content-center rounded-circle" style={{ width: '50px', height: '50px', background: 'rgba(212, 175, 55, 0.15)' }}>
                  <i className="fa-solid fa-receipt" style={{ color: '#B38728', fontSize: '20px' }}></i>
                </div>
                <h4 className="fw-bold text-dark mb-2" style={{ fontSize: '17px' }}>Transparent Pricing</h4>
                <p className="text-muted mb-0" style={{ fontSize: '14px', lineHeight: 1.6 }}>
                  Clear, itemized quotes with zero hidden extras or surprise installation fees.
                </p>
              </div>
            </div>

            <div className="col-lg-3 col-md-6">
              <div className="p-4 h-100 rounded-4 bg-white shadow-sm" style={{ border: '1px solid rgba(0,0,0,0.06)' }}>
                <div className="mb-3 d-flex align-items-center justify-content-center rounded-circle" style={{ width: '50px', height: '50px', background: 'rgba(212, 175, 55, 0.15)' }}>
                  <i className="fa-solid fa-broom" style={{ color: '#B38728', fontSize: '20px' }}></i>
                </div>
                <h4 className="fw-bold text-dark mb-2" style={{ fontSize: '17px' }}>Tidy &amp; Punctual</h4>
                <p className="text-muted mb-0" style={{ fontSize: '14px', lineHeight: 1.6 }}>
                  On-time arrivals, respectful property care, and spotlessly clean handovers.
                </p>
              </div>
            </div>

            <div className="col-lg-3 col-md-6">
              <div className="p-4 h-100 rounded-4 bg-white shadow-sm" style={{ border: '1px solid rgba(0,0,0,0.06)' }}>
                <div className="mb-3 d-flex align-items-center justify-content-center rounded-circle" style={{ width: '50px', height: '50px', background: 'rgba(212, 175, 55, 0.15)' }}>
                  <i className="fa-solid fa-location-dot" style={{ color: '#B38728', fontSize: '20px' }}></i>
                </div>
                <h4 className="fw-bold text-dark mb-2" style={{ fontSize: '17px' }}>West Midlands Wide</h4>
                <p className="text-muted mb-0" style={{ fontSize: '14px', lineHeight: 1.6 }}>
                  Serving Birmingham, Solihull, Sutton Coldfield, Wolverhampton &amp; surrounding areas.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          8. HIGH-CONVERSION VIP CONSULTATION BANNER
          ========================================================================= */}
      <section className="position-relative pb-60">
        <div className="container">
          <div
            className="p-5 position-relative overflow-hidden shadow-lg"
            style={{
              background: '#16120B',
              borderRadius: '30px',
              border: '1px solid rgba(212, 175, 55, 0.3)',
            }}
          >
            <div className="row align-items-center">
              <div className="col-lg-7">
                <h2 className="display-6 fw-bold text-white mb-3" style={{ fontSize: 'clamp(26px, 3.5vw, 36px)' }}>
                  Ready to Experience the ZK Flooring Standard?
                </h2>
                <p className="text-white-50 mb-0" style={{ fontSize: '16px', lineHeight: 1.7, maxWidth: '580px' }}>
                  Book your complimentary in-home survey today. Our expert team will measure your property and bring our full carpet, LVT, and flooring sample collection directly to your door.
                </p>
              </div>
              <div className="col-lg-5">
                <div className="d-flex flex-wrap align-items-center justify-content-lg-end gap-3 mt-4 mt-lg-0">
                  <Link href="/contact" className="theme-btn br-30">
                    <span className="link-effect">
                      <span className="effect-1">Book Free Survey</span>
                      <span className="effect-1">Book Free Survey</span>
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
                  </Link>
                  <a
                    href="tel:07903723774"
                    className="btn btn-outline-light rounded-pill px-4 py-3 fw-bold d-inline-flex align-items-center gap-2"
                    style={{ borderColor: 'rgba(255, 255, 255, 0.3)' }}
                  >
                    <i className="fa-solid fa-phone" style={{ color: '#D4AF37' }}></i>
                    07903 723 774
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
