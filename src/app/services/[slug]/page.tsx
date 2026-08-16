import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

interface ServiceDetail {
  slug: string;
  title: string;
  category: string;
  image: string;
  summary: string;
  description: string[];
  features: string[];
}

import { supabase } from '@/lib/supabase';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const { data: service } = await supabase.from('services').select('*').eq('slug', slug).single();
  if (!service) return { title: "Service | ZK Flooring Birmingham" };
  return {
    title: `${service.title} | ZK Flooring Services Birmingham`,
    description: service.summary,
  };
}

export default async function ServiceDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { data: service } = await supabase.from('services').select('*').eq('slug', slug).single();
  const { data: allServicesData } = await supabase.from('services').select('*').order('created_at', { ascending: false });
  const allServices = allServicesData || [];

  if (!service) {
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
                    <h2 className="title">Service Details</h2>
                    <ul className="page-breadcrumb">
                      <li><a href="/"><i className="fa-solid fa-house-chimney"></i>Home</a></li>
                      <li><span>/</span><a href="/services"> Services</a></li>
                      <li><span>/</span> {service.title}</li>
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

      {/* Service Details Section */}
      <section className="services-details space bg-light">
        <div className="container">
          <div className="row">
            <div className="col-xl-4 col-lg-4">
              <div className="service-sidebar">
                <div className="sidebar-widget service-sidebar-single">
                  <div className="widget-box category-list">
                    <h4 className="sidebar-title"> All Services </h4>
                    <div className="sidebar-service-list">
                      <ul>
                        {allServices.map((item) => (
                          <li key={item.slug} className={item.slug === slug ? 'current' : ''}>
                            <a href={`/services/${item.slug}`}>{item.title} <i className="fas fa-arrow-right"></i></a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <div className="widget-box service-details-help bg-dark">
                    <div className="bg image"><img src="/assets/images/service/details-bg.webp" alt="" /></div>
                    <div className="service-details-content">
                      <div className="icon"><img src="/assets/images/icons/contact.png" alt="" /></div>
                      <h2 className="help-title">Need Flooring Help? <br />Contact Us</h2>
                      <p className="text">Expert flooring advice and free home surveys across Birmingham and surrounding areas.</p>
                      <div className="help-contact">
                        <a href="/contact" className="theme-btn br-30">
                          <span className="link-effect">
                            <span className="effect-1">Contact with Us</span>
                            <span className="effect-1">Contact with Us</span>
                          </span>
                          <span className="arrow-all">
                            <i>
                              <svg width="16" height="19" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M2 6H10M10 6L6 2M10 6L6 10" stroke="#D4AF37" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                              </svg>
                              <svg width="16" height="19" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M2 6H10M10 6L6 2M10 6L6 10" stroke="#D4AF37" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                              </svg>
                            </i>
                          </span>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-xl-8 col-lg-8">
              <div className="services-details__content">
                <div className="image overlay-anim1">
                  <img className="br-10 w-100" src={service.image} alt={service.title} />
                </div>
                <h3 className="title-two">{service.title}</h3>
                {(service.description || []).map((p: string, idx: number) => (
                  <p key={idx} className={idx < (service.description?.length || 0) - 1 ? '' : 'mb-0'}>{p}</p>
                ))}
                <div className="row service-details-box my-40 md-my-0 md-gy-30">
                  {(service.features || []).map((feat: string, idx: number) => (
                    <div key={idx} className="col-lg-6 col-md-6">
                      <div className="service-box-inner">
                        <div className="content">
                          <div className="text"><i className="fa-solid fa-circle-check text-theme me-2"></i>{feat}</div>
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
    </main>
  );
}
