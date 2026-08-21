import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { defaultProjects, FlooringProject } from '@/data/projectsData';

export const metadata: Metadata = {
  title: "Our Flooring Projects | ZK Flooring Birmingham",
  description: "Explore ZK Flooring's completed residential & commercial flooring projects across Birmingham: LVT herringbone, carpet tile fitting, engineered hardwood, and safety vinyl.",
};

export default async function ProjectsPage() {
  const { data: dbProjects } = await supabase.from('projects').select('*').order('created_at', { ascending: false });
  const projects: FlooringProject[] = dbProjects && dbProjects.length > 0
    ? dbProjects.map((p: any) => ({
        slug: p.slug,
        title: p.title,
        category: p.category || 'Flooring Installation',
        image: p.image || '/services/Vinyl, Vinyl Tile.webp',
        location: p.location || 'Birmingham, West Midlands',
        shortDesc: p.shortDesc || (p.description && p.description.length ? p.description[0] : 'Professional flooring installation completed to highest industry standards.'),
        description: p.description || [],
        highlights: p.highlights || [],
        client: p.client || 'Client Project',
        duration: p.duration || 'Completed',
        area: p.area || 'Full Installation',
      }))
    : defaultProjects;

  const featured = projects[0];
  const remaining = projects.slice(1);

  return (
    <main>
      <style>{`
        .zk-proj-hero-card {
          transition: box-shadow 0.4s ease;
        }
        .zk-proj-hero-card:hover {
          box-shadow: 0 30px 60px rgba(0, 0, 0, 0.18) !important;
        }
        .zk-proj-hero-card:hover .zk-proj-hero-img {
          transform: scale(1.04);
        }
        .zk-proj-grid-card {
          transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.35s ease;
        }
        .zk-proj-grid-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 24px 48px rgba(0, 0, 0, 0.14) !important;
        }
        .zk-proj-grid-card:hover .zk-proj-grid-img {
          transform: scale(1.06);
        }
        .zk-proj-overlay {
          background: linear-gradient(0deg, rgba(22, 18, 11, 0.92) 0%, rgba(22, 18, 11, 0.5) 50%, rgba(22, 18, 11, 0.05) 100%);
        }
        .zk-proj-view-btn {
          transition: all 0.25s ease;
        }
        .zk-proj-view-btn:hover {
          background: #FFFFFF !important;
          color: #16120B !important;
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(255, 255, 255, 0.3) !important;
        }
        .zk-proj-stat-pill {
          background: rgba(255, 255, 255, 0.12);
          backdrop-filter: blur(6px);
          -webkit-backdrop-filter: blur(6px);
          border: 1px solid rgba(255, 255, 255, 0.15);
        }
        @media (max-width: 991px) {
          .zk-proj-hero-inner { flex-direction: column !important; }
          .zk-proj-hero-img-wrap { height: 320px !important; }
          .zk-proj-hero-content { padding: 30px 24px !important; }
        }
        @media (max-width: 575px) {
          .zk-proj-hero-img-wrap { height: 240px !important; }
          .zk-proj-stats-row { flex-direction: column !important; gap: 12px !important; }
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
                    <h2 className="title">Our Projects</h2>
                    <ul className="page-breadcrumb">
                      <li><a href="/"><i className="fa-solid fa-house-chimney"></i>Home</a></li>
                      <li><span>/</span> Projects</li>
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

      {/* Featured Project Hero Section */}
      <section className="space bg-light" style={{ paddingBottom: '40px' }}>
        <div className="container">
          <div className="title-wrap text-center three mb-50">
            <div className="sub-title-2 text-theme">
              <i className="fa-solid fa-circle-check"></i>Completed Installations
            </div>
            <h2 className="sec-title">Our Flooring Projects</h2>
            <p className="text-muted mt-2" style={{ maxWidth: '680px', margin: '0 auto', fontSize: '15px' }}>
              Browse our portfolio of completed residential and commercial flooring installations across Birmingham and the West Midlands.
            </p>
          </div>

          {/* Featured / Highlighted Project - Full Width */}
          {featured && (
            <div
              className="zk-proj-hero-card"
              style={{
                borderRadius: '24px',
                overflow: 'hidden',
                background: '#16120B',
                boxShadow: '0 20px 50px rgba(0, 0, 0, 0.12)',
              }}
            >
              <div
                className="zk-proj-hero-inner"
                style={{ display: 'flex', minHeight: '420px' }}
              >
                {/* Left: Image */}
                <div
                  className="zk-proj-hero-img-wrap"
                  style={{
                    flex: '1 1 55%',
                    position: 'relative',
                    overflow: 'hidden',
                    minHeight: '420px',
                  }}
                >
                  <img
                    src={featured.image}
                    alt={featured.title}
                    className="zk-proj-hero-img"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      display: 'block',
                      transition: 'transform 0.5s ease',
                    }}
                  />
                  {/* Category badge overlay */}
                  <div
                    style={{
                      position: 'absolute',
                      top: '20px',
                      left: '20px',
                      padding: '6px 16px',
                      borderRadius: '30px',
                      background: 'linear-gradient(135deg, #BF953F 0%, #FCF6BA 50%, #B38728 100%)',
                      color: '#16120B',
                      fontSize: '12px',
                      fontWeight: 700,
                      letterSpacing: '0.4px',
                      textTransform: 'uppercase',
                    }}
                  >
                    <i className="fa-solid fa-star" style={{ fontSize: '10px', marginRight: '5px' }}></i>
                    Featured Project
                  </div>
                </div>

                {/* Right: Content */}
                <div
                  className="zk-proj-hero-content"
                  style={{
                    flex: '1 1 45%',
                    padding: '48px 44px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    color: '#FFFFFF',
                  }}
                >
                  <span
                    style={{
                      fontSize: '12px',
                      fontWeight: 600,
                      textTransform: 'uppercase',
                      letterSpacing: '1.5px',
                      color: '#D4AF37',
                      marginBottom: '12px',
                    }}
                  >
                    {featured.category}
                  </span>
                  <h3
                    style={{
                      fontSize: '30px',
                      fontWeight: 800,
                      lineHeight: 1.25,
                      marginBottom: '8px',
                      color: '#FFFFFF',
                    }}
                  >
                    {featured.title}
                  </h3>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      marginBottom: '18px',
                      color: 'rgba(255,255,255,0.6)',
                      fontSize: '13px',
                    }}
                  >
                    <i className="fa-solid fa-location-dot" style={{ color: '#D4AF37', fontSize: '12px' }}></i>
                    {featured.location}
                  </div>
                  <p
                    style={{
                      fontSize: '15px',
                      lineHeight: 1.7,
                      color: 'rgba(255, 255, 255, 0.7)',
                      marginBottom: '28px',
                    }}
                  >
                    {featured.shortDesc}
                  </p>

                  {/* Stats Row */}
                  <div
                    className="zk-proj-stats-row"
                    style={{
                      display: 'flex',
                      gap: '16px',
                      marginBottom: '32px',
                    }}
                  >
                    <div className="zk-proj-stat-pill" style={{ padding: '10px 18px', borderRadius: '12px' }}>
                      <div style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '1px', color: 'rgba(255,255,255,0.5)', marginBottom: '2px' }}>Client</div>
                      <div style={{ fontSize: '14px', fontWeight: 700, color: '#FFFFFF' }}>{featured.client}</div>
                    </div>
                    <div className="zk-proj-stat-pill" style={{ padding: '10px 18px', borderRadius: '12px' }}>
                      <div style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '1px', color: 'rgba(255,255,255,0.5)', marginBottom: '2px' }}>Duration</div>
                      <div style={{ fontSize: '14px', fontWeight: 700, color: '#FFFFFF' }}>{featured.duration}</div>
                    </div>
                    <div className="zk-proj-stat-pill" style={{ padding: '10px 18px', borderRadius: '12px' }}>
                      <div style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '1px', color: 'rgba(255,255,255,0.5)', marginBottom: '2px' }}>Area</div>
                      <div style={{ fontSize: '14px', fontWeight: 700, color: '#FFFFFF' }}>{featured.area}</div>
                    </div>
                  </div>

                  <Link
                    href={`/projects/${featured.slug}`}
                    className="zk-proj-view-btn"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '14px 28px',
                      borderRadius: '12px',
                      border: '2px solid rgba(212, 175, 55, 0.6)',
                      background: 'transparent',
                      color: '#D4AF37',
                      fontWeight: 700,
                      fontSize: '14px',
                      textDecoration: 'none',
                      alignSelf: 'flex-start',
                    }}
                  >
                    View Full Case Study <i className="fa-solid fa-arrow-right" style={{ fontSize: '12px' }}></i>
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Remaining Projects Grid */}
      <section className="bg-light" style={{ paddingBottom: '100px' }}>
        <div className="container">
          <div className="row gy-4">
            {remaining.map((project, idx) => (
              <div key={project.slug} className={idx === 0 || idx === 3 ? 'col-lg-7 col-md-6 col-sm-12' : 'col-lg-5 col-md-6 col-sm-12'}>
                <Link
                  href={`/projects/${project.slug}`}
                  className="zk-proj-grid-card"
                  style={{
                    display: 'block',
                    position: 'relative',
                    borderRadius: '20px',
                    overflow: 'hidden',
                    height: '380px',
                    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.08)',
                    textDecoration: 'none',
                  }}
                >
                  {/* Background Image */}
                  <img
                    src={project.image}
                    alt={project.title}
                    className="zk-proj-grid-img"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      display: 'block',
                      transition: 'transform 0.5s ease',
                    }}
                  />

                  {/* Dark Gradient Overlay */}
                  <div
                    className="zk-proj-overlay"
                    style={{
                      position: 'absolute',
                      inset: 0,
                      zIndex: 1,
                    }}
                  ></div>

                  {/* Top-Right Category Pill */}
                  <div
                    style={{
                      position: 'absolute',
                      top: '18px',
                      right: '18px',
                      zIndex: 2,
                      padding: '5px 14px',
                      borderRadius: '30px',
                      background: 'rgba(212, 175, 55, 0.9)',
                      color: '#16120B',
                      fontSize: '11px',
                      fontWeight: 700,
                      letterSpacing: '0.3px',
                    }}
                  >
                    {project.category}
                  </div>

                  {/* Bottom Content Overlay */}
                  <div
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      zIndex: 2,
                      padding: '28px 26px',
                    }}
                  >
                    {/* Location */}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px',
                        marginBottom: '8px',
                        color: 'rgba(255, 255, 255, 0.6)',
                        fontSize: '12px',
                        fontWeight: 500,
                      }}
                    >
                      <i className="fa-solid fa-location-dot" style={{ color: '#D4AF37', fontSize: '11px' }}></i>
                      {project.location}
                    </div>

                    {/* Title */}
                    <h3
                      style={{
                        fontSize: '22px',
                        fontWeight: 800,
                        color: '#FFFFFF',
                        lineHeight: 1.25,
                        marginBottom: '10px',
                      }}
                    >
                      {project.title}
                    </h3>

                    {/* Meta Stats */}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '16px',
                        fontSize: '12px',
                        color: 'rgba(255, 255, 255, 0.5)',
                      }}
                    >
                      <span>
                        <i className="fa-regular fa-clock" style={{ marginRight: '4px', color: '#D4AF37' }}></i>
                        {project.duration}
                      </span>
                      <span>
                        <i className="fa-solid fa-ruler-combined" style={{ marginRight: '4px', color: '#D4AF37' }}></i>
                        {project.area}
                      </span>
                      <span>
                        <i className="fa-regular fa-user" style={{ marginRight: '4px', color: '#D4AF37' }}></i>
                        {project.client}
                      </span>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
