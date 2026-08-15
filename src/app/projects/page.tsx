import React from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Our Flooring Projects | ZK Flooring Birmingham",
  description: "View ZK Flooring's completed projects across Birmingham: carpet fitting, LVT herringbone, hardwood flooring, and commercial vinyl installations.",
};

import { supabase } from '@/lib/supabase';

export default async function ProjectsPage() {
  const { data: dbProjects } = await supabase.from('projects').select('*').order('created_at', { ascending: false });
  const projects = dbProjects || [];
  return (
    <main>
      {/* Start Breadcrumb Section */}
      <section className="tv-breadcrumb-section">
        <div className="tv-breadcrumb-inner mx-30 ml-mx-0 position-relative overflow-hidden br-30 ml-br-0" style={{ background: 'linear-gradient(to right, #BF953F, #FCF6BA, #B38728, #FBF5B7, #AA771C)' }}><div className="bg"></div>
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
          <div className="title-wrap text-center three">
            <div className="sub-title-2 text-theme"><i className="fa-solid fa-circle-check"></i>Our Work</div>
            <h2 className="sec-title">Recent Flooring Installations</h2>
            <p>Explore our completed carpet, LVT, hardwood, and vinyl <br /> installations across Birmingham and surrounding areas.</p>
          </div>
          <div className="row gy-40 image_load">
            {projects.map((project) => (
              <div key={project.slug} className="col-lg-4 col-md-6 col-sm-12">
                <a href={`/projects/${project.slug}`} style={{ textDecoration: 'none' }}>
                  <div className="zk-premium-project-card">
                    <div className="premium-image-wrapper">
                      <span className="premium-badge">{project.category}</span>
                      <img src={project.image} alt={project.title} />
                      <div className="premium-overlay"></div>
                    </div>
                    
                    <div className="premium-content">
                      <div className="premium-location">
                        <i className="fa-solid fa-location-dot"></i> {project.location}
                      </div>
                      <h4 className="premium-title">
                        {project.title}
                      </h4>
                      
                      <div className="premium-footer">
                        <span className="premium-explore-btn">
                          View Installation
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </span>
                      </div>
                    </div>
                  </div>
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
