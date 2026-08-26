import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { defaultProjects, FlooringProject } from '@/data/projectsData';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const { data: dbProject } = await supabase.from('projects').select('*').eq('slug', slug).single();
  const project = dbProject || defaultProjects.find(p => p.slug === slug);
  if (!project) return { title: "Project | ZK Flooring Birmingham" };
  return {
    title: `${project.title} | ZK Flooring Projects`,
    description: project.description && project.description.length ? project.description[0] : project.shortDesc || '',
  };
}

export default async function ProjectDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { data: dbProject } = await supabase.from('projects').select('*').eq('slug', slug).single();
  const project: FlooringProject | undefined = dbProject || defaultProjects.find(p => p.slug === slug);

  if (!project) {
    notFound();
  }

  // Get related projects (same category, excluding current)
  const related = defaultProjects
    .filter(p => p.slug !== project.slug)
    .slice(0, 3);

  return (
    <main>
      <style>{`
        .zk-detail-hero-img {
          transition: transform 0.6s ease;
        }
        .zk-detail-hero-wrap:hover .zk-detail-hero-img {
          transform: scale(1.03);
        }
        .zk-detail-highlight-item {
          transition: background 0.25s ease, transform 0.25s ease;
        }
        .zk-detail-highlight-item:hover {
          background: rgba(212, 175, 55, 0.08) !important;
          transform: translateX(4px);
        }
        .zk-detail-related-card {
          transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.35s ease;
        }
        .zk-detail-related-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 22px 44px rgba(0, 0, 0, 0.14) !important;
        }
        .zk-detail-related-card:hover .zk-detail-related-img {
          transform: scale(1.06);
        }
        .zk-detail-cta-btn {
          transition: all 0.25s ease;
        }
        .zk-detail-cta-btn:hover {
          filter: brightness(1.12);
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(212, 175, 55, 0.45) !important;
        }
        @media (max-width: 991px) {
          .zk-detail-meta-sidebar { margin-top: 40px !important; }
          .zk-detail-hero-wrap { height: 380px !important; }
          .zk-detail-hero-content { padding: 30px 26px !important; }
        }
        @media (max-width: 767px) {
          .zk-detail-stats-bar {
            flex-wrap: wrap !important;
          }
          .zk-detail-stat-col {
            flex: 1 1 50% !important;
            border-right: none !important;
            border-bottom: 1px solid rgba(255, 255, 255, 0.08) !important;
            padding: 16px 12px !important;
          }
        }
        @media (max-width: 575px) {
          .zk-detail-hero-wrap { height: 290px !important; border-radius: 18px !important; }
          .zk-detail-hero-content { padding: 20px 16px !important; }
          .zk-detail-hero-title { font-size: 24px !important; }
        }
      `}</style>

      {/* Breadcrumb Section */}
      <section className="tv-breadcrumb-section">
        <div
          className="tv-breadcrumb-inner mx-30 ml-mx-0 position-relative overflow-hidden br-30 ml-br-0"
          style={{ background: 'linear-gradient(to right, #BF953F, #FCF6BA, #B38728, #FBF5B7, #AA771C)' }}
        >
          <div className="bg"></div>
          <div className="container">
            <div className="row">
              <div className="col-12">
                <div className="title-outer">
                  <div className="page-title">
                    <h2 className="title">Project Details</h2>
                    <ul className="page-breadcrumb">
                      <li><a href="/"><i className="fa-solid fa-house-chimney"></i>Home</a></li>
                      <li><span>/</span><a href="/projects"> Projects</a></li>
                      <li><span>/</span> {project.title}</li>
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

      {/* Project Detail Content */}
      <section className="space bg-light">
        <div className="container">
          {/* Hero Image with Overlay */}
          <div
            className="zk-detail-hero-wrap"
            style={{
              position: 'relative',
              borderRadius: '24px',
              overflow: 'hidden',
              height: '480px',
              marginBottom: '0',
              boxShadow: '0 20px 50px rgba(0, 0, 0, 0.12)',
            }}
          >
            <img
              src={project.image}
              alt={project.title}
              className="zk-detail-hero-img"
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
            {/* Dark gradient overlay at bottom */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(0deg, rgba(22,18,11,0.88) 0%, rgba(22,18,11,0.35) 40%, transparent 100%)',
                zIndex: 1,
              }}
            ></div>
            {/* Title and meta on the hero */}
            <div
              className="zk-detail-hero-content"
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                zIndex: 2,
                padding: '40px 44px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px', flexWrap: 'wrap' }}>
                <span
                  style={{
                    display: 'inline-block',
                    padding: '5px 16px',
                    borderRadius: '30px',
                    background: '#FAF6EE',
                    color: '#16120B',
                    fontSize: '12px',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                  }}
                >
                  {project.category}
                </span>
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '5px',
                    color: 'rgba(255,255,255,0.7)',
                    fontSize: '13px',
                    fontWeight: 500,
                  }}
                >
                  <i className="fa-solid fa-location-dot" style={{ color: '#D4AF37' }}></i>
                  {project.location}
                </span>
              </div>
              <h1
                className="zk-detail-hero-title"
                style={{
                  fontSize: 'clamp(24px, 4vw, 36px)',
                  fontWeight: 800,
                  color: '#FFFFFF',
                  lineHeight: 1.2,
                  margin: 0,
                }}
              >
                {project.title}
              </h1>
            </div>
          </div>

          {/* Quick Stats Bar */}
          <div
            className="zk-detail-stats-bar"
            style={{
              display: 'flex',
              justifyContent: 'center',
              background: '#16120B',
              borderRadius: '0 0 20px 20px',
              overflow: 'hidden',
              marginBottom: '50px',
              border: '1px solid rgba(212, 175, 55, 0.25)',
              borderTop: 'none',
            }}
          >
            {[
              { icon: 'fa-regular fa-user', label: 'Client', value: project.client },
              { icon: 'fa-regular fa-clock', label: 'Duration', value: project.duration },
              { icon: 'fa-solid fa-ruler-combined', label: 'Area', value: project.area },
              { icon: 'fa-solid fa-folder', label: 'Category', value: project.category },
            ].map((stat, i) => (
              <div
                key={i}
                className="zk-detail-stat-col"
                style={{
                  flex: 1,
                  padding: '22px 20px',
                  textAlign: 'center',
                  borderRight: i < 3 ? '1px solid rgba(255,255,255,0.08)' : 'none',
                }}
              >
                <div style={{ marginBottom: '4px' }}>
                  <i className={stat.icon} style={{ color: '#D4AF37', fontSize: '14px' }}></i>
                </div>
                <div style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '1.2px', color: 'rgba(255,255,255,0.4)', marginBottom: '2px' }}>
                  {stat.label}
                </div>
                <div style={{ fontSize: '15px', fontWeight: 700, color: '#FFFFFF' }}>
                  {stat.value}
                </div>
              </div>
            ))}
          </div>

          {/* Main Content + Sidebar */}
          <div className="row">
            {/* Left: Project Description */}
            <div className="col-lg-8">
              <div style={{ paddingRight: '20px' }}>
                <h2
                  style={{
                    fontSize: '28px',
                    fontWeight: 800,
                    color: '#16120B',
                    marginBottom: '24px',
                    lineHeight: 1.3,
                  }}
                >
                  Project Overview
                </h2>

                {(project.description || []).map((p: string, idx: number) => (
                  <p
                    key={idx}
                    style={{
                      color: '#555555',
                      fontSize: '15px',
                      lineHeight: 1.8,
                      marginBottom: '18px',
                    }}
                  >
                    {p}
                  </p>
                ))}

                {/* Highlights Section */}
                {project.highlights && project.highlights.length > 0 && (
                  <div style={{ marginTop: '36px' }}>
                    <h3
                      style={{
                        fontSize: '22px',
                        fontWeight: 700,
                        color: '#16120B',
                        marginBottom: '20px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                      }}
                    >
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: '36px',
                          height: '36px',
                          borderRadius: '10px',
                          background: '#D4AF37',
                        }}
                      >
                        <i className="fa-solid fa-list-check" style={{ color: '#16120B', fontSize: '15px' }}></i>
                      </span>
                      Project Highlights
                    </h3>
                    <div className="row gy-3">
                      {project.highlights.map((hl: string, idx: number) => (
                        <div key={idx} className="col-lg-6 col-md-6">
                          <div
                            className="zk-detail-highlight-item"
                            style={{
                              display: 'flex',
                              alignItems: 'flex-start',
                              gap: '12px',
                              padding: '14px 16px',
                              borderRadius: '12px',
                              background: 'rgba(0, 0, 0, 0.02)',
                              border: '1px solid rgba(212, 175, 55, 0.15)',
                            }}
                          >
                            <i
                              className="fa-solid fa-circle-check"
                              style={{
                                color: '#D4AF37',
                                fontSize: '16px',
                                marginTop: '2px',
                                flexShrink: 0,
                              }}
                            ></i>
                            <span style={{ fontSize: '14px', fontWeight: 600, color: '#333333', lineHeight: 1.4 }}>
                              {hl}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right: Sidebar */}
            <div className="col-lg-4">
              <div className="zk-detail-meta-sidebar" style={{ position: 'sticky', top: '120px' }}>
                {/* CTA Card */}
                <div
                  style={{
                    borderRadius: '20px',
                    overflow: 'hidden',
                    background: '#16120B',
                    padding: '36px 28px',
                    marginBottom: '28px',
                    boxShadow: '0 12px 35px rgba(0, 0, 0, 0.1)',
                  }}
                >
                  <div
                    style={{
                      width: '56px',
                      height: '56px',
                      borderRadius: '14px',
                      background: '#D4AF37',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: '20px',
                    }}
                  >
                    <i className="fa-solid fa-phone" style={{ color: '#16120B', fontSize: '22px' }}></i>
                  </div>
                  <h4 style={{ fontSize: '20px', fontWeight: 700, color: '#FFFFFF', marginBottom: '8px' }}>
                    Ready to Start Your Project?
                  </h4>
                  <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.6)', lineHeight: 1.6, marginBottom: '24px' }}>
                    Get a free, no-obligation survey and quote for your flooring installation. Our team is here to help.
                  </p>
                  <a
                    href="tel:07903723774"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      color: '#D4AF37',
                      fontSize: '22px',
                      fontWeight: 800,
                      textDecoration: 'none',
                      marginBottom: '20px',
                    }}
                  >
                    <i className="fa-solid fa-phone-volume" style={{ fontSize: '18px' }}></i>
                    07903 723 774
                  </a>
                  <Link
                    href="/contact"
                    className="zk-detail-cta-btn"
                    style={{
                      display: 'block',
                      width: '100%',
                      textAlign: 'center',
                      padding: '14px 24px',
                      borderRadius: '12px',
                      background: '#D4AF37',
                      color: '#16120B',
                      fontWeight: 700,
                      fontSize: '15px',
                      textDecoration: 'none',
                      boxShadow: '0 4px 15px rgba(212, 175, 55, 0.35)',
                    }}
                  >
                    Get Free Quote <i className="fa-solid fa-arrow-right" style={{ fontSize: '13px', marginLeft: '6px' }}></i>
                  </Link>
                </div>

                {/* Project Info Card */}
                <div
                  style={{
                    borderRadius: '20px',
                    padding: '28px',
                    background: '#FFFFFF',
                    border: '1px solid rgba(212, 175, 55, 0.2)',
                    boxShadow: '0 8px 25px rgba(0, 0, 0, 0.05)',
                  }}
                >
                  <h4 style={{ fontSize: '17px', fontWeight: 700, color: '#16120B', marginBottom: '20px' }}>
                    Project Information
                  </h4>
                  {[
                    { icon: 'fa-solid fa-folder', label: 'Category', value: project.category },
                    { icon: 'fa-solid fa-location-dot', label: 'Location', value: project.location },
                    { icon: 'fa-regular fa-user', label: 'Client', value: project.client },
                    { icon: 'fa-regular fa-clock', label: 'Duration', value: project.duration },
                    { icon: 'fa-solid fa-ruler-combined', label: 'Coverage', value: project.area },
                  ].map((info, i) => (
                    <div
                      key={i}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '14px',
                        padding: '14px 0',
                        borderBottom: i < 4 ? '1px solid rgba(0,0,0,0.06)' : 'none',
                      }}
                    >
                      <div
                        style={{
                          width: '38px',
                          height: '38px',
                          borderRadius: '10px',
                          background: 'rgba(212, 175, 55, 0.1)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                        }}
                      >
                        <i className={info.icon} style={{ color: '#D4AF37', fontSize: '14px' }}></i>
                      </div>
                      <div>
                        <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.8px', color: '#999999', marginBottom: '1px' }}>
                          {info.label}
                        </div>
                        <div style={{ fontSize: '14px', fontWeight: 600, color: '#16120B' }}>
                          {info.value}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Projects */}
      {related.length > 0 && (
        <section className="bg-light" style={{ paddingBottom: '100px' }}>
          <div className="container">
            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
              <h2 style={{ fontSize: '28px', fontWeight: 800, color: '#16120B' }}>More Projects</h2>
              <p style={{ color: '#777', fontSize: '14px', marginTop: '6px' }}>
                Explore more of our completed flooring installations
              </p>
            </div>
            <div className="row gy-4">
              {related.map((rp) => (
                <div key={rp.slug} className="col-lg-4 col-md-6">
                  <Link
                    href={`/projects/${rp.slug}`}
                    className="zk-detail-related-card"
                    style={{
                      display: 'block',
                      position: 'relative',
                      borderRadius: '18px',
                      overflow: 'hidden',
                      height: '300px',
                      boxShadow: '0 8px 25px rgba(0, 0, 0, 0.08)',
                      textDecoration: 'none',
                    }}
                  >
                    <img
                      src={rp.image}
                      alt={rp.title}
                      className="zk-detail-related-img"
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        display: 'block',
                        transition: 'transform 0.5s ease',
                      }}
                    />
                    <div
                      style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'linear-gradient(0deg, rgba(22,18,11,0.88) 0%, rgba(22,18,11,0.35) 50%, transparent 100%)',
                        zIndex: 1,
                      }}
                    ></div>
                    <div
                      style={{
                        position: 'absolute',
                        top: '14px',
                        right: '14px',
                        zIndex: 2,
                        padding: '4px 12px',
                        borderRadius: '20px',
                        background: 'rgba(212, 175, 55, 0.9)',
                        color: '#16120B',
                        fontSize: '11px',
                        fontWeight: 700,
                      }}
                    >
                      {rp.category}
                    </div>
                    <div
                      style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        zIndex: 2,
                        padding: '24px',
                      }}
                    >
                      <div
                        style={{
                          fontSize: '12px',
                          color: 'rgba(255,255,255,0.5)',
                          marginBottom: '6px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '5px',
                        }}
                      >
                        <i className="fa-solid fa-location-dot" style={{ color: '#D4AF37', fontSize: '10px' }}></i>
                        {rp.location}
                      </div>
                      <h4 style={{ fontSize: '18px', fontWeight: 700, color: '#FFFFFF', lineHeight: 1.3, margin: 0 }}>
                        {rp.title}
                      </h4>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
