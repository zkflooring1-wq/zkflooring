'use client';

import React from 'react';

interface FlooringService {
  title: string;
  category: string;
  image: string;
  desc: string;
  tags: string[];
}

interface ServicesSectionProps {
  flooringServices: FlooringService[];
}

export default function ServicesSection({ flooringServices }: ServicesSectionProps) {
  return (
    <section className="tv-service-section bg-light position-relative overflow-hidden space">

      <div className="tv-service-inner space bg-theme3 mx-30 ml-mx-0 overflow-hidden br-30">
        <div className="container">
          <div className="row">
            <div className="col-lg-12 text-center">
              <div className="title-wrap two white" data-wow-duration="2s" data-wow-delay=".0s">
                <div className="sub-title-2 text-white two">
                  <i className="fa-solid fa-circle-check"></i>Services
                </div>
                <h2 className="sec-title text-white">
                  Premium Flooring Services for <br />Residential and Commercial Spaces
                </h2>
              </div>
            </div>
          </div>
          <div className="row gy-30 mt-30">
            <div className="col-lg-12">
              <div className="tv-service-item-inner" style={{ position: 'relative' }}>
                {flooringServices.map((service, index) => (
                  <div
                    key={index}
                    className="service-item-wrap"
                    style={{
                      position: 'sticky',
                      top: `${130 + index * 15}px`,
                      zIndex: index + 1,
                      marginBottom: index === flooringServices.length - 1 ? '0' : '40px',
                      transition: 'all 0.3s ease',
                    }}
                  >
                    <div
                      className="tv-service-item"
                      style={{
                        background: '#FFFFFF',
                        borderRadius: '24px',
                        border: '1px solid rgba(212, 175, 55, 0.25)',
                        boxShadow: '0 15px 40px rgba(0, 0, 0, 0.1)',
                        padding: '30px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '30px',
                        position: 'relative',
                        width: '100%',
                      }}
                    >
                      <div className="service-number">{String(index + 1).padStart(2, '0')}.</div>
                      <div
                        className="service-left"
                        style={{
                          width: '420px',
                          minWidth: '320px',
                          height: '280px',
                          flexShrink: 0,
                          borderRadius: '20px',
                          overflow: 'hidden',
                        }}
                      >
                        <img
                          src={service.image}
                          alt={service.title}
                          loading="lazy"
                          decoding="async"
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      </div>
                      <div className="service-right" style={{ flexGrow: 1, paddingRight: '20px' }}>
                        <h6
                          style={{
                            fontSize: '13px',
                            fontWeight: 600,
                            color: '#D4AF37',
                            letterSpacing: '1px',
                            textTransform: 'uppercase',
                            background: 'rgba(212, 175, 55, 0.1)',
                            padding: '4px 14px',
                            borderRadius: '20px',
                            display: 'inline-block',
                            marginBottom: '12px',
                          }}
                        >
                          {service.category}
                        </h6>
                        <h2 style={{ fontSize: '28px', fontWeight: 700, color: '#16120B', marginBottom: '12px' }}>
                          {service.title}
                        </h2>
                        <p style={{ color: '#555555', fontSize: '15px', lineHeight: '1.6', marginBottom: '20px' }}>
                          {service.desc}
                        </p>
                        <a href="/contact" className="learn-more">
                          Get a Quote <i className="fa-solid fa-arrow-up-right"></i>
                        </a>
                        <div className="border my-20" style={{ borderTop: '1px solid #f0f0f0', margin: '20px 0' }}></div>
                        <div className="tags" style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                          {service.tags.map((tag, tIndex) => (
                            <span
                              key={tIndex}
                              style={{
                                fontSize: '12px',
                                padding: '4px 12px',
                                borderRadius: '14px',
                                background: '#FAF6EE',
                                color: '#16120B',
                                border: '1px solid rgba(212, 175, 55, 0.2)',
                                fontWeight: 500,
                              }}
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
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
  );
}
