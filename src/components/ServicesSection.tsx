import React from 'react';
import { EditableField } from '@/components/editor/EditableField';

export interface FlooringServiceItem {
  slug: string;
  title: string;
  category: string;
  image: string;
  badges: string[];
  summary: string;
  infoLabel: string;
  infoValue: string;
  ctaText?: string;
  ctaLink?: string;
}

export const defaultZkServices: FlooringServiceItem[] = [
  {
    slug: 'carpet-fitting',
    title: 'Carpet & Carpet Tile Fitting',
    category: 'INSTALLATION',
    image: '/services/Carpet, Carpet Tile.webp',
    badges: ['Domestic Carpets', 'Carpet Tiles', 'Underlay Included'],
    summary: 'From deep-pile luxury residential carpets to heavy-duty contract carpet tiles, our certified fitters provide precision measuring, gripper fitting, and flawless stretching.',
    infoLabel: 'CONSULTATION',
    infoValue: 'Free Home Survey',
    ctaText: 'Get a Quote',
    ctaLink: '/contact',
  },
  {
    slug: 'luxury-vinyl-tile',
    title: 'Luxury Vinyl Tile (LVT) & Sheet Vinyl',
    category: 'INSTALLATION',
    image: '/services/Vinyl, Vinyl Tile.webp',
    badges: ['Herringbone LVT', 'Sheet Vinyl', 'Amtico & Karndean'],
    summary: 'Transform your home or commercial interiors with 100% waterproof Luxury Vinyl Tiles and heavy-duty sheet vinyl. Specializing in intricate herringbone layouts and seamless borders.',
    infoLabel: 'FINISH OPTIONS',
    infoValue: 'Plank & Herringbone',
    ctaText: 'Get a Quote',
    ctaLink: '/contact',
  },
  {
    slug: 'subfloor-preparation',
    title: 'Self Levelling & Subfloor Prep',
    category: 'PREPARATION',
    image: '/services/Self Levelling.webp',
    badges: ['Latex Screeding', 'Ply Boarding', 'DPM Membrane'],
    summary: 'Ensure a perfectly level and durable foundation for any floor covering. We specialize in high-grade latex screed, moisture testing, damp-proof membranes, and ply boarding.',
    infoLabel: 'SURFACE PREP',
    infoValue: 'Laser-Level Finish',
    ctaText: 'Get a Quote',
    ctaLink: '/contact',
  },
  {
    slug: 'hardwood-flooring',
    title: 'Solid & Engineered Hardwood',
    category: 'TIMBER',
    image: '/services/Vinyl, Vinyl Tile.webp',
    badges: ['Engineered Oak', 'Solid Timber', 'Parquet Fitting'],
    summary: 'Timeless natural wood and multi-ply engineered oak installations. Expertly fitted with acoustic dampening underlays and expansion profiling for lifetime durability.',
    infoLabel: 'DURABILITY',
    infoValue: 'Real Timber Elegance',
    ctaText: 'Get a Quote',
    ctaLink: '/contact',
  },
  {
    slug: 'laminate-flooring',
    title: 'Laminate Flooring Installation',
    category: 'LAMINATE',
    image: '/about page/1.webp',
    badges: ['AC4/AC5 Rated', 'Click-Lock System', 'Scratch Resistant'],
    summary: 'High-durability, cost-effective laminate flooring with authentic woodgrain and stone finishes. Ideal for high-traffic domestic areas, rental properties, and retail spaces.',
    infoLabel: 'RATING',
    infoValue: 'Commercial Grade',
    ctaText: 'Get a Quote',
    ctaLink: '/contact',
  },
  {
    slug: 'commercial-flooring',
    title: 'Commercial Safety Flooring & Vinyl',
    category: 'COMMERCIAL',
    image: '/about page/2.webp',
    badges: ['Safety Vinyl', 'Cap & Cove Skirting', 'Altro & Polyflor'],
    summary: 'Hygienic, slip-resistant safety vinyl and heavy contract flooring fitted to exact health and safety standards for commercial kitchens, medical clinics, offices, and schools.',
    infoLabel: 'COMPLIANCE',
    infoValue: 'BS 8203 Certified',
    ctaText: 'Get a Quote',
    ctaLink: '/contact',
  },
];

interface ServicesSectionProps {
  flooringServices?: any[];
}

export default function ServicesSection({ flooringServices }: ServicesSectionProps) {
  const servicesToRender: FlooringServiceItem[] = 
    flooringServices && flooringServices.length >= 4
      ? flooringServices.map((s, idx) => ({
          slug: s.slug || `service-${idx}`,
          title: s.title,
          category: s.category || 'FLOORING',
          image: s.image || defaultZkServices[idx % defaultZkServices.length].image,
          badges: s.features || s.tags || s.badges || defaultZkServices[idx % defaultZkServices.length].badges,
          summary: s.summary || s.desc || defaultZkServices[idx % defaultZkServices.length].summary,
          infoLabel: s.infoLabel || defaultZkServices[idx % defaultZkServices.length].infoLabel,
          infoValue: s.infoValue || defaultZkServices[idx % defaultZkServices.length].infoValue,
          ctaText: s.ctaText || 'Get a Quote',
          ctaLink: s.slug ? `/services/${s.slug}` : '/contact',
        }))
      : defaultZkServices;

  return (
    <section className="tv-service-section bg-light position-relative overflow-hidden space">
      <style>{`
        .zk-card-wrapper {
          transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.35s ease, border-color 0.35s ease;
        }
        .zk-card-wrapper:hover {
          transform: translateY(-6px);
          border-color: rgba(212, 175, 55, 0.6) !important;
          box-shadow: 0 18px 40px rgba(179, 135, 40, 0.18) !important;
        }
        .zk-card-wrapper:hover .zk-card-img {
          transform: scale(1.05);
        }
        .zk-card-btn {
          transition: all 0.25s ease;
        }
        .zk-card-btn:hover {
          filter: brightness(1.1);
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(179, 135, 40, 0.45) !important;
        }
        @media (max-width: 575px) {
          .zk-card-img-wrap {
            height: 200px !important;
          }
          .zk-card-body-wrap {
            padding: 18px 16px 16px 16px !important;
          }
          .zk-card-title {
            font-size: 18px !important;
          }
          .zk-card-footer {
            flex-wrap: wrap !important;
            gap: 12px !important;
          }
        }
      `}</style>

      <div className="container">
        {/* Section Header Title */}
        <div className="row mb-50">
          <div className="col-lg-12 text-center">
            <div className="title-wrap two">
              <div className="sub-title-2 text-theme two">
                <i className="fa-solid fa-circle-check"></i>
                <EditableField path="services_header.badge" fallback="Our Services" />
              </div>
              <h2 className="sec-title text-dark" style={{ fontSize: 'clamp(26px, 3.5vw, 42px)', lineHeight: 1.25 }}>
                <EditableField path="services_header.title" fallback={"Premium Flooring Services for <br class=\"d-none d-sm-block\" />Residential & Commercial Spaces"} isHtml />
              </h2>
              <p className="text-muted mt-2" style={{ maxWidth: '650px', margin: '0 auto', fontSize: '15px', lineHeight: 1.65 }}>
                <EditableField path="services_header.description" fallback="Expert supply, subfloor preparation, and certified installation across Birmingham and the West Midlands." />
              </p>
            </div>
          </div>
        </div>

        {/* 3-Column Responsive Services Grid */}
        <div className="row gy-40">
          {servicesToRender.map((service, index) => (
            <div key={service.slug || index} className="col-lg-4 col-md-6 col-sm-12">
              <div
                className="zk-card-wrapper"
                style={{
                  position: 'relative',
                  borderRadius: '22px',
                  overflow: 'hidden',
                  background: '#FFFFFF',
                  border: '1px solid rgba(212, 175, 55, 0.25)',
                  boxShadow: '0 8px 25px rgba(0, 0, 0, 0.04)',
                  display: 'flex',
                  flexDirection: 'column',
                  height: '100%',
                }}
              >
                {/* Top Image Container */}
                <div
                  className="zk-card-img-wrap"
                  style={{
                    position: 'relative',
                    height: '230px',
                    width: '100%',
                    overflow: 'hidden',
                    backgroundColor: '#EAE5DC',
                  }}
                >
                  <img
                    src={service.image}
                    alt={service.title}
                    className="zk-card-img"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      display: 'block',
                      transition: 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
                    }}
                  />

                  {/* Top-Right Floating Icon Button */}
                  <div
                    style={{
                      position: 'absolute',
                      top: '14px',
                      right: '14px',
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      background: 'rgba(22, 18, 11, 0.75)',
                      backdropFilter: 'blur(10px)',
                      WebkitBackdropFilter: 'blur(10px)',
                      border: '1px solid rgba(212, 175, 55, 0.5)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#FCF6BA',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.25)',
                    }}
                  >
                    <i className="fa-solid fa-gem" style={{ fontSize: '13px' }}></i>
                  </div>
                </div>

                {/* Card Body */}
                <div
                  className="zk-card-body-wrap"
                  style={{
                    padding: '24px 22px 20px 22px',
                    display: 'flex',
                    flexDirection: 'column',
                    flexGrow: 1,
                    background: '#FFFFFF',
                  }}
                >
                  {/* CardTitle */}
                  <h3
                    className="zk-card-title"
                    style={{
                      fontSize: '20px',
                      fontWeight: 700,
                      color: '#16120B',
                      marginBottom: '10px',
                      lineHeight: '1.3',
                    }}
                  >
                    {service.title}
                  </h3>

                  {/* Card Badges */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      flexWrap: 'wrap',
                      marginBottom: '14px',
                    }}
                  >
                    {service.badges.map((badge, bIdx) => (
                      <span
                        key={bIdx}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          padding: '3px 10px',
                          borderRadius: '20px',
                          fontSize: '11px',
                          fontWeight: 600,
                          color: '#8F6B1E',
                          background: 'rgba(212, 175, 55, 0.1)',
                          border: '1px solid rgba(212, 175, 55, 0.22)',
                          letterSpacing: '0.2px',
                        }}
                      >
                        {badge}
                      </span>
                    ))}
                  </div>

                  {/* Card Description */}
                  <p
                    style={{
                      color: '#55524E',
                      fontSize: '13.5px',
                      lineHeight: '1.6',
                      marginBottom: '20px',
                      flexGrow: 1,
                    }}
                  >
                    {service.summary}
                  </p>

                  {/* Card Footer (Info + Luxury Button) */}
                  <div
                    className="zk-card-footer"
                    style={{
                      borderTop: '1px solid rgba(212, 175, 55, 0.18)',
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
                          color: '#8C867D',
                          letterSpacing: '0.5px',
                        }}
                      >
                        {service.infoLabel}
                      </span>
                      <span
                        style={{
                          fontSize: '14px',
                          fontWeight: 700,
                          color: '#16120B',
                        }}
                      >
                        {service.infoValue}
                      </span>
                    </div>

                    <a
                      href={service.ctaLink || '/contact'}
                      className="zk-card-btn"
                      style={{
                        background: 'linear-gradient(to right, #BF953F, #FCF6BA, #B38728, #FBF5B7, #AA771C)',
                        color: '#16120B',
                        fontWeight: 700,
                        fontSize: '13px',
                        padding: '9px 18px',
                        borderRadius: '30px',
                        textDecoration: 'none',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        border: 'none',
                        boxShadow: '0 4px 15px rgba(179, 135, 40, 0.28)',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {service.ctaText || 'Get a Quote'} <i className="fa-solid fa-arrow-right" style={{ fontSize: '11px' }}></i>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

