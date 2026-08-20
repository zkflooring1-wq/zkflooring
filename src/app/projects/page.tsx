import React from 'react';
import type { Metadata } from 'next';
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

  return (
    <main>
      <style>{`
        .zk-project-card {
          transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s ease;
        }
        .zk-project-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 22px 45px rgba(191, 149, 63, 0.22) !important;
        }
        .zk-project-card:hover .zk-project-img {
          transform: scale(1.06);
        }
        .zk-project-btn {
          transition: all 0.25s ease;
        }
        .zk-project-btn:hover {
          filter: brightness(1.12);
          transform: translateY(-2px);
          box-shadow: 0 6px 22px rgba(212, 175, 55, 0.45) !important;
        }
      `}</style>

      {/* Start Breadcrumb Section */}
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

      {/* Project Section */}
      <section className="tv-project-section space bg-light">
        <div className="container">
          {/* Section Header */}
          <div className="title-wrap text-center three mb-50">
            <div className="sub-title-2 text-theme">
              <i className="fa-solid fa-circle-check"></i>Our Portfolio
            </div>
            <h2 className="sec-title">Recent Flooring Installations</h2>
            <p className="text-muted mt-2" style={{ maxWidth: '680px', margin: '0 auto', fontSize: '15px' }}>
              Explore our completed carpet, luxury vinyl tile, engineered hardwood, subfloor prep, and commercial vinyl installations across Birmingham and the West Midlands.
            </p>
          </div>

          {/* 3-Column Responsive Project Grid */}
          <div className="row gy-40">
            {projects.map((project) => (
              <div key={project.slug} className="col-lg-4 col-md-6 col-sm-12">
                <div
                  className="zk-project-card"
                  style={{
                    position: 'relative',
                    borderRadius: '20px',
                    overflow: 'hidden',
                    background: 'linear-gradient(#FFFFFF, #FFFFFF) padding-box, linear-gradient(135deg, #BF953F 0%, #FCF6BA 50%, #B38728 100%) border-box',
                    border: '2px solid transparent',
                    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.07)',
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100%',
                  }}
                >
                  {/* Top Image Container */}
                  <div
                    style={{
                      position: 'relative',
                      height: '240px',
                      width: '100%',
                      overflow: 'hidden',
                    }}
                  >
                    <img
                      src={project.image}
                      alt={project.title}
                      className="zk-project-img"
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        display: 'block',
                        transition: 'transform 0.4s ease',
                      }}
                    />

                    {/* Top-Left Category Badge */}
                    <div
                      style={{
                        position: 'absolute',
                        top: '14px',
                        left: '14px',
                        padding: '4px 12px',
                        borderRadius: '20px',
                        background: 'rgba(22, 18, 11, 0.75)',
                        backdropFilter: 'blur(10px)',
                        WebkitBackdropFilter: 'blur(10px)',
                        border: '1px solid rgba(212, 175, 55, 0.45)',
                        color: '#D4AF37',
                        fontSize: '11px',
                        fontWeight: 600,
                        letterSpacing: '0.3px',
                      }}
                    >
                      {project.category}
                    </div>

                    {/* Top-Right Location Badge */}
                    <div
                      style={{
                        position: 'absolute',
                        top: '14px',
                        right: '14px',
                        padding: '4px 10px',
                        borderRadius: '20px',
                        background: 'rgba(255, 255, 255, 0.9)',
                        backdropFilter: 'blur(8px)',
                        WebkitBackdropFilter: 'blur(8px)',
                        color: '#16120B',
                        fontSize: '11px',
                        fontWeight: 600,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
                      }}
                    >
                      <i className="fa-solid fa-location-dot" style={{ color: '#AA771C', fontSize: '10px' }}></i>
                      {project.location.split(',')[0]}
                    </div>
                  </div>

                  {/* Card Content */}
                  <div
                    style={{
                      padding: '24px 22px 20px 22px',
                      display: 'flex',
                      flexDirection: 'column',
                      flexGrow: 1,
                      background: '#FFFFFF',
                    }}
                  >
                    {/* Project Title */}
                    <h3
                      style={{
                        fontSize: '20px',
                        fontWeight: 700,
                        color: '#16120B',
                        marginBottom: '10px',
                        lineHeight: '1.3',
                      }}
                    >
                      <a 
                        href={`/projects/${project.slug}`}
                        style={{ color: '#16120B', textDecoration: 'none', transition: 'color 0.2s ease' }}
                      >
                        {project.title}
                      </a>
                    </h3>

                    {/* Highlight Tags */}
                    {project.highlights && project.highlights.length > 0 && (
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          flexWrap: 'wrap',
                          marginBottom: '14px',
                        }}
                      >
                        {project.highlights.slice(0, 2).map((hl, hIdx) => (
                          <span
                            key={hIdx}
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              padding: '3px 10px',
                              borderRadius: '9999px',
                              fontSize: '11px',
                              fontWeight: 600,
                              color: '#AA771C',
                              background: 'rgba(212, 175, 55, 0.08)',
                              border: '1px solid rgba(212, 175, 55, 0.35)',
                              letterSpacing: '0.2px',
                            }}
                          >
                            {hl}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Short Description */}
                    <p
                      style={{
                        color: '#555555',
                        fontSize: '13.5px',
                        lineHeight: '1.6',
                        marginBottom: '20px',
                        flexGrow: 1,
                      }}
                    >
                      {project.shortDesc}
                    </p>

                    {/* Card Footer with Meta Stats & Action */}
                    <div
                      style={{
                        borderTop: '1px solid rgba(212, 175, 55, 0.2)',
                        paddingTop: '16px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '10px',
                        marginTop: 'auto',
                      }}
                    >
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span
                          style={{
                            fontSize: '10.5px',
                            fontWeight: 600,
                            textTransform: 'uppercase',
                            color: '#8c8273',
                            letterSpacing: '0.5px',
                          }}
                        >
                          TIMELINE / AREA
                        </span>
                        <span
                          style={{
                            fontSize: '14px',
                            fontWeight: 700,
                            color: '#16120B',
                          }}
                        >
                          {project.duration} • {project.area}
                        </span>
                      </div>

                      <a
                        href={`/projects/${project.slug}`}
                        className="zk-project-btn"
                        style={{
                          background: 'linear-gradient(135deg, #BF953F 0%, #FCF6BA 50%, #B38728 100%)',
                          color: '#16120B',
                          fontWeight: 700,
                          fontSize: '13px',
                          padding: '9px 18px',
                          borderRadius: '10px',
                          textDecoration: 'none',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          boxShadow: '0 4px 15px rgba(179, 135, 40, 0.35)',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        View Project <i className="fa-solid fa-arrow-up-right" style={{ fontSize: '11px' }}></i>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

