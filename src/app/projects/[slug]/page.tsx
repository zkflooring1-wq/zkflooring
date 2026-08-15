import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

interface ProjectDetail {
  slug: string;
  title: string;
  category: string;
  image: string;
  location: string;
  description: string[];
  highlights: string[];
}

import { supabase } from '@/lib/supabase';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const { data: project } = await supabase.from('projects').select('*').eq('slug', slug).single();
  if (!project) return { title: "Project | ZK Flooring Birmingham" };
  return {
    title: `${project.title} | ZK Flooring Projects`,
    description: project.description && project.description.length ? project.description[0] : '',
  };
}

export default async function ProjectDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { data: project } = await supabase.from('projects').select('*').eq('slug', slug).single();

  if (!project) {
    notFound();
  }

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

      {/* Project Details Section */}
      <section className="project-details space bg-light">
        <div className="container">
          <div className="project-details__top">
            <div className="project-details__img overlay-anim1">
              <img className="br-10 w-100" src={project.image} alt={project.title} />
            </div>
          </div>
          <div className="row mt-40">
            <div className="col-lg-8">
              <div className="project-details__content">
                <h3 className="title-two">{project.title}</h3>
                {(project.description || []).map((p: string, idx: number) => (
                  <p key={idx}>{p}</p>
                ))}
                <div className="row service-details-box my-40 md-my-0 md-gy-30">
                  {(project.highlights || []).map((hl: string, idx: number) => (
                    <div key={idx} className="col-lg-6 col-md-6">
                      <div className="service-box-inner">
                        <div className="content">
                          <div className="text"><i className="fa-solid fa-circle-check text-theme me-2"></i>{hl}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="col-lg-4">
              <div className="project-details__info">
                <ul>
                  <li><span className="title"><i className="fas fa-folder"></i>Category</span><span className="text">{project.category}</span></li>
                  <li><span className="title"><i className="fas fa-map-marker-alt"></i>Location</span><span className="text">{project.location}</span></li>
                  <li><span className="title"><i className="fas fa-phone"></i>Contact</span><span className="text"><a href="tel:07903723774">07903 723 774</a></span></li>
                </ul>
                <a href="/contact" className="theme-btn mt-30 br-30 w-100 text-center">
                  <span className="link-effect">
                    <span className="effect-1">Get Free Quote</span>
                    <span className="effect-1">Get Free Quote</span>
                  </span>
                  <span className="arrow-all">
                    <i>
                      <svg width="16" height="19" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M2 6H10M10 6L6 2M10 6L6 10" stroke="#1053f3" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                      </svg>
                      <svg width="16" height="19" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M2 6H10M10 6L6 2M10 6L6 10" stroke="#1053f3" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
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
