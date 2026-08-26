'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

interface FrameData {
  id: number;
  type: 'title' | 'media-left' | 'media-right' | 'text-center' | 'team' | 'cta';
  title?: string;
  subtitle?: string;
  description?: string;
  image?: string;
  badge?: string;
  tags?: string[];
  ctaText?: string;
  ctaLink?: string;
}

const FRAMES: FrameData[] = [
  {
    id: 0,
    type: 'title',
    title: 'ZK FLOORING',
    subtitle: 'ESTABLISHED IN BIRMINGHAM • 15+ YEARS MASTERY',
    description: 'Transforming British Living Spaces & Commercial Interiors From The Ground Up with Precision Craftsmanship.',
  },
  {
    id: 1,
    type: 'media-left',
    image: '/about page/1.webp',
    badge: '15+ YEARS OF MASTERY',
    title: 'Architectural Interiors',
    description: 'Bespoke domestic and commercial flooring installations engineered with laser precision and master care.',
    tags: ['Luxury Domestic', 'Commercial Fitouts', 'West Midlands'],
  },
  {
    id: 2,
    type: 'media-right',
    image: '/about page/2.webp',
    badge: 'MASTER CRAFTSMEN',
    title: 'Hands-On Perfection',
    description: 'Every seam, perimeter border, and threshold transition is hand-fitted by certified in-house tradesmen.',
    tags: ['Certified Fitters', 'Zero Subcontracting', 'Full Warranty'],
  },
  {
    id: 3,
    type: 'text-center',
    title: 'THE ZK PHILOSOPHY',
    subtitle: 'Relentless Precision Beneath Every Floor',
    description: 'A floor is only as resilient as the subfloor beneath it. We laser-diagnose moisture levels, level imperfections with industrial latex screeds, and ensure a permanent foundation before laying a single plank.',
  },
  {
    id: 4,
    type: 'media-left',
    image: '/services/Self Levelling.webp',
    badge: 'SUBFLOOR ENGINEERING',
    title: 'Laser-Flat Latex Screeding',
    description: 'Industrial self-levelling compounds, damp-proof membranes (DPM), and timber ply boarding for 20+ year stability.',
    tags: ['Latex Screed', 'DPM Moisture Barrier', 'Ply Boarding'],
  },
  {
    id: 5,
    type: 'media-right',
    image: '/services/Vinyl, Vinyl Tile.webp',
    badge: 'LUXURY VINYL TILES',
    title: 'Herringbone & Custom LVT',
    description: '100% waterproof luxury vinyl planks with authentic woodgrain textures, acoustic backing, and bespoke parquet designs.',
    tags: ['Herringbone Parquet', '100% Waterproof', 'Acoustic Core'],
  },
  {
    id: 6,
    type: 'media-left',
    image: '/services/Carpet, Carpet Tile.webp',
    badge: 'PLUSH CARPETS',
    title: 'Deep Pile Wool & Stain-Free',
    description: 'Luxurious British carpets fitted with high-density foam underlays for ultimate underfoot softness, warmth, and acoustic silence.',
    tags: ['Deep Pile Twist', 'High-Density Underlay', 'Stair Runners'],
  },
  {
    id: 7,
    type: 'media-right',
    image: '/slider/Laminate Flooring.webp',
    badge: 'HARDWOOD & LAMINATE',
    title: 'Engineered Oak & AC5 Planks',
    description: 'Heavy-traffic commercial and residential timbers engineered for scratch resistance and timeless architectural beauty.',
    tags: ['Engineered Oak', 'AC5 Commercial', 'Seamless Profiles'],
  },
  {
    id: 8,
    type: 'team',
    title: 'OUR MASTER FITTERS',
    subtitle: 'Dedicated In-House Installation Specialists',
  },
  {
    id: 9,
    type: 'cta',
    title: 'EXPERIENCE THE ZK STANDARD',
    subtitle: 'Book Your Complimentary In-Home Doorstep Survey',
    description: 'We bring 150+ physical carpet, LVT, and wood swatches directly to your door with laser-accurate measurement and clear itemized pricing.',
    ctaText: 'Book Free Survey',
    ctaLink: '/contact',
  },
];

export default function ThreeDScrollAbout() {
  const containerRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Spacing between frames along Z-axis in pixels
  const zSpacing = 2200;
  const speed = 1.35;
  const totalFrames = FRAMES.length;
  const totalScrollHeight = (totalFrames * zSpacing) / speed + 1200;

  useEffect(() => {
    let currentScroll = window.scrollY;
    let targetScroll = window.scrollY;
    let animationFrameId: number;

    const handleScroll = () => {
      targetScroll = window.scrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    // Smooth Lerp Animation Loop (60/120fps)
    const update3DPositions = () => {
      currentScroll += (targetScroll - currentScroll) * 0.12;
      const progress = Math.min(1, Math.max(0, currentScroll / (totalScrollHeight - window.innerHeight)));
      setScrollProgress(progress);

      const frameElements = document.querySelectorAll<HTMLElement>('.three-d-frame');
      frameElements.forEach((el, index) => {
        const baseZ = -index * zSpacing;
        const currentZ = baseZ + currentScroll * speed;

        let opacity = 0;
        let blur = 0;

        if (currentZ < -2800) {
          // Out of range (deep in distance)
          opacity = 0;
        } else if (currentZ < -1000) {
          // Approaching from depth
          const ratio = (currentZ + 2800) / 1800;
          opacity = Math.max(0, ratio * 0.85);
          blur = (1 - ratio) * 6;
        } else if (currentZ <= 200) {
          // Sharp focal point
          opacity = 1;
          blur = 0;
        } else if (currentZ <= 900) {
          // Flying past camera
          const ratio = 1 - (currentZ - 200) / 700;
          opacity = Math.max(0, ratio);
          blur = (1 - ratio) * 4;
        } else {
          // Passed behind camera
          opacity = 0;
        }

        if (currentZ > 1100 || currentZ < -3000) {
          el.style.display = 'none';
        } else {
          el.style.display = 'flex';
          el.style.transform = `translate3d(0, 0, ${currentZ.toFixed(1)}px)`;
          el.style.opacity = Math.max(0, Math.min(1, opacity)).toFixed(3);
          el.style.filter = blur > 0.5 ? `blur(${blur.toFixed(1)}px)` : 'none';
          el.style.pointerEvents = currentZ >= -600 && currentZ <= 250 ? 'auto' : 'none';
        }
      });

      animationFrameId = requestAnimationFrame(update3DPositions);
    };

    animationFrameId = requestAnimationFrame(update3DPositions);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(animationFrameId);
    };
  }, [totalScrollHeight]);

  const toggleAudio = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  };

  return (
    <div style={{ background: '#0D0B08', color: '#FFFFFF', minHeight: `${totalScrollHeight}px`, position: 'relative' }}>
      {/* Hide conflicting template elements on 3D canvas */}
      <style jsx global>{`
        .scrollToTop {
          display: none !important;
        }
      `}</style>

      {/* Background Ambience Audio */}
      <audio ref={audioRef} src="/3d-scrolling-site-main/media/ambient.mp3" loop />

      {/* FIXED 3D PERSPECTIVE VIEWPORT */}
      <div
        ref={containerRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          perspective: '1500px',
          perspectiveOrigin: '50% 50%',
          overflow: 'hidden',
          zIndex: 10,
          pointerEvents: 'none',
        }}
      >
        {/* Deep Luxury Ambient Glow */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(circle at center, rgba(179, 135, 40, 0.09) 0%, rgba(13, 11, 8, 0.98) 85%)',
            pointerEvents: 'none',
            zIndex: 1,
          }}
        />

        {/* 3D SCENE CONTAINER */}
        <div
          style={{
            width: '100%',
            height: '100%',
            transformStyle: 'preserve-3d',
            position: 'relative',
            zIndex: 2,
          }}
        >
          {FRAMES.map((frame) => (
            <div
              key={frame.id}
              className="three-d-frame"
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transformStyle: 'preserve-3d',
                willChange: 'transform, opacity, filter',
                padding: '0 24px',
              }}
            >
              {/* ================= TYPE: TITLE (FRAME 0) ================= */}
              {frame.type === 'title' && (
                <div
                  className="text-center p-5 rounded-5 shadow-2xl"
                  style={{
                    maxWidth: '920px',
                    background: 'rgba(18, 14, 10, 0.82)',
                    backdropFilter: 'blur(16px)',
                    border: '1px solid rgba(212, 175, 55, 0.35)',
                  }}
                >
                  <div
                    className="d-inline-flex align-items-center gap-2 px-4 py-2 rounded-pill mb-4"
                    style={{
                      background: 'rgba(212, 175, 55, 0.15)',
                      border: '1px solid rgba(212, 175, 55, 0.4)',
                      color: '#FCF6BA',
                      fontSize: '13px',
                      fontWeight: 700,
                      letterSpacing: '0.15em',
                    }}
                  >
                    <i className="fa-solid fa-crown" style={{ color: '#D4AF37' }}></i>
                    {frame.subtitle}
                  </div>
                  <h1
                    className="fw-bold mb-3"
                    style={{
                      fontSize: 'clamp(46px, 7.5vw, 88px)',
                      letterSpacing: '0.04em',
                      lineHeight: 1.05,
                      background: 'linear-gradient(135deg, #BF953F 0%, #FCF6BA 30%, #B38728 65%, #FBF5B7 85%, #AA771C 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}
                  >
                    {frame.title}
                  </h1>
                  <p
                    className="text-white-50 mx-auto mb-4"
                    style={{ fontSize: 'clamp(16px, 2vw, 20px)', maxWidth: '680px', lineHeight: 1.6 }}
                  >
                    {frame.description}
                  </p>
                  <div className="d-flex align-items-center justify-content-center gap-2 text-white-50" style={{ fontSize: '13px' }}>
                    <i className="fa-solid fa-arrow-down" style={{ color: '#D4AF37' }}></i>
                    <span style={{ letterSpacing: '0.1em' }}>SCROLL TO FLY THROUGH 3D JOURNEY</span>
                  </div>
                </div>
              )}

              {/* ================= TYPE: MEDIA LEFT ================= */}
              {frame.type === 'media-left' && (
                <div className="container" style={{ maxWidth: '1140px' }}>
                  <div className="row align-items-center justify-content-between g-4">
                    <div className="col-lg-6 col-md-7">
                      <div
                        className="position-relative overflow-hidden shadow-2xl"
                        style={{
                          borderRadius: '26px',
                          border: '2px solid rgba(212, 175, 55, 0.45)',
                          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.85)',
                          height: '420px',
                        }}
                      >
                        <img
                          src={frame.image}
                          alt={frame.title || 'Flooring Craft'}
                          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                        />
                        {frame.badge && (
                          <div
                            className="position-absolute top-0 start-0 m-3 px-3 py-1 rounded-pill"
                            style={{
                              background: 'rgba(13, 11, 8, 0.9)',
                              backdropFilter: 'blur(8px)',
                              border: '1px solid rgba(212, 175, 55, 0.4)',
                              color: '#FCF6BA',
                              fontSize: '12px',
                              fontWeight: 700,
                              letterSpacing: '0.08em',
                            }}
                          >
                            {frame.badge}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="col-lg-6 col-md-5 ps-lg-4">
                      <div
                        className="p-4 p-lg-5 rounded-4 shadow-xl"
                        style={{
                          background: 'rgba(18, 14, 10, 0.88)',
                          backdropFilter: 'blur(16px)',
                          border: '1px solid rgba(212, 175, 55, 0.35)',
                          borderRadius: '28px',
                        }}
                      >
                        <h2
                          className="fw-bold mb-3"
                          style={{
                            fontSize: 'clamp(26px, 3.2vw, 38px)',
                            background: 'linear-gradient(135deg, #FFFFFF 60%, #FCF6BA 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                          }}
                        >
                          {frame.title}
                        </h2>
                        <p className="text-white-50 mb-3" style={{ fontSize: '15px', lineHeight: 1.7 }}>
                          {frame.description}
                        </p>
                        {frame.tags && (
                          <div className="d-flex flex-wrap gap-2 pt-2">
                            {frame.tags.map((tag, i) => (
                              <span
                                key={i}
                                className="px-3 py-1 rounded-pill"
                                style={{
                                  background: 'rgba(212, 175, 55, 0.12)',
                                  border: '1px solid rgba(212, 175, 55, 0.35)',
                                  color: '#FCF6BA',
                                  fontSize: '12px',
                                  fontWeight: 600,
                                }}
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ================= TYPE: MEDIA RIGHT ================= */}
              {frame.type === 'media-right' && (
                <div className="container" style={{ maxWidth: '1140px' }}>
                  <div className="row align-items-center justify-content-between flex-row-reverse g-4">
                    <div className="col-lg-6 col-md-7">
                      <div
                        className="position-relative overflow-hidden shadow-2xl"
                        style={{
                          borderRadius: '26px',
                          border: '2px solid rgba(212, 175, 55, 0.45)',
                          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.85)',
                          height: '420px',
                        }}
                      >
                        <img
                          src={frame.image}
                          alt={frame.title || 'Flooring Craft'}
                          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                        />
                        {frame.badge && (
                          <div
                            className="position-absolute top-0 end-0 m-3 px-3 py-1 rounded-pill"
                            style={{
                              background: 'rgba(13, 11, 8, 0.9)',
                              backdropFilter: 'blur(8px)',
                              border: '1px solid rgba(212, 175, 55, 0.4)',
                              color: '#FCF6BA',
                              fontSize: '12px',
                              fontWeight: 700,
                              letterSpacing: '0.08em',
                            }}
                          >
                            {frame.badge}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="col-lg-6 col-md-5 pe-lg-4">
                      <div
                        className="p-4 p-lg-5 rounded-4 shadow-xl"
                        style={{
                          background: 'rgba(18, 14, 10, 0.88)',
                          backdropFilter: 'blur(16px)',
                          border: '1px solid rgba(212, 175, 55, 0.35)',
                          borderRadius: '28px',
                        }}
                      >
                        <h2
                          className="fw-bold mb-3"
                          style={{
                            fontSize: 'clamp(26px, 3.2vw, 38px)',
                            background: 'linear-gradient(135deg, #FFFFFF 60%, #FCF6BA 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                          }}
                        >
                          {frame.title}
                        </h2>
                        <p className="text-white-50 mb-3" style={{ fontSize: '15px', lineHeight: 1.7 }}>
                          {frame.description}
                        </p>
                        {frame.tags && (
                          <div className="d-flex flex-wrap gap-2 pt-2">
                            {frame.tags.map((tag, i) => (
                              <span
                                key={i}
                                className="px-3 py-1 rounded-pill"
                                style={{
                                  background: 'rgba(212, 175, 55, 0.12)',
                                  border: '1px solid rgba(212, 175, 55, 0.35)',
                                  color: '#FCF6BA',
                                  fontSize: '12px',
                                  fontWeight: 600,
                                }}
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ================= TYPE: TEXT CENTER ================= */}
              {frame.type === 'text-center' && (
                <div className="container" style={{ maxWidth: '860px' }}>
                  <div
                    className="p-5 text-center rounded-5 shadow-2xl"
                    style={{
                      background: 'rgba(18, 14, 10, 0.9)',
                      backdropFilter: 'blur(16px)',
                      border: '1px solid rgba(212, 175, 55, 0.35)',
                    }}
                  >
                    <div
                      className="d-inline-flex align-items-center gap-2 px-3 py-1 rounded-pill mb-3"
                      style={{
                        background: 'rgba(212, 175, 55, 0.15)',
                        border: '1px solid rgba(212, 175, 55, 0.35)',
                        color: '#FCF6BA',
                        fontSize: '12px',
                        fontWeight: 700,
                        letterSpacing: '0.1em',
                      }}
                    >
                      {frame.title}
                    </div>
                    <h2 className="fw-bold text-white mb-3" style={{ fontSize: 'clamp(28px, 3.5vw, 42px)' }}>
                      {frame.subtitle}
                    </h2>
                    <p className="text-white-50 mb-0" style={{ fontSize: '17px', lineHeight: 1.8 }}>
                      {frame.description}
                    </p>
                  </div>
                </div>
              )}

              {/* ================= TYPE: TEAM (FRAME 8) ================= */}
              {frame.type === 'team' && (
                <div className="container" style={{ maxWidth: '1080px' }}>
                  <div
                    className="p-4 p-lg-5 rounded-5 shadow-2xl"
                    style={{
                      background: 'rgba(18, 14, 10, 0.9)',
                      backdropFilter: 'blur(16px)',
                      border: '1px solid rgba(212, 175, 55, 0.35)',
                    }}
                  >
                    <div className="text-center mb-4">
                      <div
                        className="d-inline-flex align-items-center gap-2 px-3 py-1 rounded-pill mb-2"
                        style={{
                          background: 'rgba(212, 175, 55, 0.15)',
                          border: '1px solid rgba(212, 175, 55, 0.3)',
                          color: '#FCF6BA',
                          fontSize: '12px',
                          fontWeight: 700,
                          letterSpacing: '0.1em',
                        }}
                      >
                        {frame.title}
                      </div>
                      <h2 className="fw-bold text-white mb-0" style={{ fontSize: 'clamp(24px, 3.2vw, 36px)' }}>
                        {frame.subtitle}
                      </h2>
                    </div>

                    <div className="row g-4 justify-content-center">
                      <div className="col-md-4 col-sm-6">
                        <div
                          className="overflow-hidden shadow-lg position-relative"
                          style={{
                            borderRadius: '20px',
                            border: '1px solid rgba(212, 175, 55, 0.3)',
                            background: '#16120B',
                          }}
                        >
                          <img src="/Our Team/1.jpg" alt="Zeeshan" style={{ width: '100%', height: '240px', objectFit: 'cover' }} />
                          <div
                            className="p-3 text-center"
                            style={{ background: 'rgba(22, 18, 11, 0.95)', borderTop: '1px solid rgba(212, 175, 55, 0.2)' }}
                          >
                            <h4 className="fw-bold text-white mb-0" style={{ fontSize: '17px' }}>Zeeshan</h4>
                            <span style={{ color: '#FCF6BA', fontSize: '12px' }}>Master Fitter &amp; Estimator</span>
                          </div>
                        </div>
                      </div>

                      <div className="col-md-4 col-sm-6">
                        <div
                          className="overflow-hidden shadow-lg position-relative"
                          style={{
                            borderRadius: '20px',
                            border: '1px solid rgba(212, 175, 55, 0.3)',
                            background: '#16120B',
                          }}
                        >
                          <img src="/Our Team/2.jpg" alt="Ali" style={{ width: '100%', height: '240px', objectFit: 'cover' }} />
                          <div
                            className="p-3 text-center"
                            style={{ background: 'rgba(22, 18, 11, 0.95)', borderTop: '1px solid rgba(212, 175, 55, 0.2)' }}
                          >
                            <h4 className="fw-bold text-white mb-0" style={{ fontSize: '17px' }}>Ali</h4>
                            <span style={{ color: '#FCF6BA', fontSize: '12px' }}>Carpet &amp; LVT Specialist</span>
                          </div>
                        </div>
                      </div>

                      <div className="col-md-4 col-sm-6">
                        <div
                          className="overflow-hidden shadow-lg position-relative"
                          style={{
                            borderRadius: '20px',
                            border: '1px solid rgba(212, 175, 55, 0.3)',
                            background: '#16120B',
                          }}
                        >
                          <img src="/Our Team/3.jpg" alt="Hassan" style={{ width: '100%', height: '240px', objectFit: 'cover' }} />
                          <div
                            className="p-3 text-center"
                            style={{ background: 'rgba(22, 18, 11, 0.95)', borderTop: '1px solid rgba(212, 175, 55, 0.2)' }}
                          >
                            <h4 className="fw-bold text-white mb-0" style={{ fontSize: '17px' }}>Hassan</h4>
                            <span style={{ color: '#FCF6BA', fontSize: '12px' }}>Subfloor &amp; Screed Specialist</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ================= TYPE: CTA (FINAL DESTINATION) ================= */}
              {frame.type === 'cta' && (
                <div
                  className="text-center p-5 rounded-5 shadow-2xl"
                  style={{
                    maxWidth: '840px',
                    background: 'rgba(18, 14, 10, 0.92)',
                    backdropFilter: 'blur(16px)',
                    border: '1px solid rgba(212, 175, 55, 0.4)',
                  }}
                >
                  <div
                    className="d-inline-flex align-items-center gap-2 px-4 py-2 rounded-pill mb-3"
                    style={{
                      background: 'rgba(212, 175, 55, 0.15)',
                      border: '1px solid rgba(212, 175, 55, 0.4)',
                      color: '#FCF6BA',
                      fontSize: '13px',
                      fontWeight: 700,
                      letterSpacing: '0.1em',
                    }}
                  >
                    <i className="fa-solid fa-award" style={{ color: '#D4AF37' }}></i>
                    WEST MIDLANDS PREMIER FITTERS
                  </div>
                  <h2
                    className="fw-bold mb-3"
                    style={{
                      fontSize: 'clamp(32px, 5vw, 56px)',
                      background: 'linear-gradient(135deg, #BF953F 0%, #FCF6BA 35%, #B38728 70%, #AA771C 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}
                  >
                    {frame.title}
                  </h2>
                  <p className="text-white-50 mx-auto mb-4" style={{ fontSize: '18px', maxWidth: '620px', lineHeight: 1.6 }}>
                    {frame.description}
                  </p>

                  <div className="d-flex flex-wrap align-items-center justify-content-center gap-3">
                    <Link
                      href={frame.ctaLink || '/contact'}
                      className="px-5 py-3 rounded-pill fw-bold text-dark text-decoration-none shadow-lg transition-all"
                      style={{
                        background: 'linear-gradient(135deg, #BF953F 0%, #FCF6BA 25%, #B38728 50%, #FBF5B7 75%, #AA771C 100%)',
                        fontSize: '16px',
                        letterSpacing: '0.02em',
                      }}
                    >
                      {frame.ctaText} <i className="fa-solid fa-arrow-right ms-2"></i>
                    </Link>

                    <a
                      href="tel:07903723774"
                      className="btn btn-outline-light rounded-pill px-4 py-3 fw-bold d-inline-flex align-items-center gap-2"
                      style={{ borderColor: 'rgba(212, 175, 55, 0.4)', color: '#FCF6BA' }}
                    >
                      <i className="fa-solid fa-phone" style={{ color: '#D4AF37' }}></i>
                      07903 723 774
                    </a>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* FLOATING TOP NAVIGATION HUD */}
      <div
        style={{
          position: 'fixed',
          top: '24px',
          left: '24px',
          right: '24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          zIndex: 100,
          pointerEvents: 'auto',
        }}
      >
        <Link
          href="/"
          className="d-flex align-items-center gap-2 px-4 py-2 rounded-pill text-decoration-none shadow-lg"
          style={{
            background: 'rgba(13, 11, 8, 0.9)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(212, 175, 55, 0.35)',
            color: '#FFFFFF',
            fontSize: '13px',
            fontWeight: 600,
          }}
        >
          <i className="fa-solid fa-arrow-left" style={{ color: '#D4AF37' }}></i>
          <span>Home</span>
        </Link>

        {/* Depth Progress Capsule */}
        <div
          className="d-none d-md-flex align-items-center gap-3 px-4 py-2 rounded-pill"
          style={{
            background: 'rgba(13, 11, 8, 0.9)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(212, 175, 55, 0.25)',
            fontSize: '12px',
            color: '#FCF6BA',
            fontWeight: 600,
          }}
        >
          <span style={{ letterSpacing: '0.08em' }}>3D DEPTH JOURNEY</span>
          <div style={{ width: '100px', height: '4px', background: 'rgba(255, 255, 255, 0.15)', borderRadius: '4px', overflow: 'hidden' }}>
            <div
              style={{
                width: `${Math.round(scrollProgress * 100)}%`,
                height: '100%',
                background: 'linear-gradient(to right, #BF953F, #FCF6BA)',
                transition: 'width 0.1s linear',
              }}
            />
          </div>
          <span>{Math.round(scrollProgress * 100)}%</span>
        </div>

        {/* Ambient Sound Toggle Button */}
        <button
          onClick={toggleAudio}
          className="d-flex align-items-center gap-2 px-4 py-2 rounded-pill shadow-lg border-0"
          style={{
            background: isPlaying ? 'linear-gradient(135deg, #BF953F, #FCF6BA)' : 'rgba(13, 11, 8, 0.9)',
            color: isPlaying ? '#16120B' : '#FCF6BA',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(212, 175, 55, 0.35)',
            fontSize: '13px',
            fontWeight: 700,
            cursor: 'pointer',
            transition: 'all 0.3s ease',
          }}
        >
          <i className={`fa-solid ${isPlaying ? 'fa-volume-high' : 'fa-volume-xmark'}`}></i>
          <span className="d-none d-sm-inline">{isPlaying ? 'Sound On' : 'Ambient Music'}</span>
        </button>
      </div>

      {/* FLOATING BOTTOM ACTIONS */}
      <div
        style={{
          position: 'fixed',
          bottom: '24px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 100,
          pointerEvents: 'auto',
        }}
      >
        <Link
          href="/contact"
          className="px-4 py-2 rounded-pill shadow-lg text-decoration-none d-inline-flex align-items-center gap-2"
          style={{
            background: 'rgba(22, 18, 11, 0.92)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(212, 175, 55, 0.45)',
            color: '#FCF6BA',
            fontSize: '13px',
            fontWeight: 700,
          }}
        >
          <span>Book Free Home Survey</span>
          <i className="fa-solid fa-arrow-right" style={{ color: '#D4AF37' }}></i>
        </Link>
      </div>
    </div>
  );
}
