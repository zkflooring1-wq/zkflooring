import React from 'react';

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
          transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s ease;
        }
        .zk-card-wrapper:hover {
          transform: translateY(-8px);
          box-shadow: 0 22px 45px rgba(191, 149, 63, 0.22) !important;
        }
        .zk-card-wrapper:hover .zk-card-img {
          transform: scale(1.06);
        }
        .zk-card-btn {
          transition: all 0.25s ease;
        }
        .zk-card-btn:hover {
          filter: brightness(1.12);
          transform: translateY(-2px);
          box-shadow: 0 6px 22px rgba(212, 175, 55, 0.45) !important;
        }
      `}</style>

      <div className="container">
        {/* Section Header Title */}
        <div className="row mb-50">
          <div className="col-lg-12 text-center">
            <div className="title-wrap two">
              <div className="sub-title-2 text-theme two">
                <i className="fa-solid fa-circle-check"></i>Our Services
              </div>
              <h2 className="sec-title text-dark">
                Premium Flooring Services for <br />Residential and Commercial Spaces
              </h2>
              <p className="text-muted mt-2" style={{ maxWidth: '650px', margin: '0 auto', fontSize: '15px' }}>
                Expert supply, subfloor preparation, and certified installation across Birmingham and the West Midlands.
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
                {/* Top Image Container (Filled, No empty space, exact 240px container height) */}
                <div
                  style={{
                    position: 'relative',
                    height: '240px',
                    width: '100%',
                    overflow: 'hidden',
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
                      transition: 'transform 0.4s ease',
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
                      background: 'rgba(22, 18, 11, 0.65)',
                      backdropFilter: 'blur(12px)',
                      WebkitBackdropFilter: 'blur(12px)',
                      border: '1px solid rgba(212, 175, 55, 0.5)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#D4AF37',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.25)',
                    }}
                  >
                    <i className="fa-solid fa-gem" style={{ fontSize: '13px' }}></i>
                  </div>
                </div>

                {/* Card Body on White Background */}
                <div
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

                  {/* CardDescription / Badges */}
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
                          borderRadius: '9999px',
                          fontSize: '11px',
                          fontWeight: 600,
                          color: '#AA771C',
                          background: 'rgba(212, 175, 55, 0.08)',
                          border: '1px solid rgba(212, 175, 55, 0.35)',
                          letterSpacing: '0.2px',
                        }}
                      >
                        {badge}
                      </span>
                    ))}
                  </div>

                  {/* CardContent (Short description) */}
                  <p
                    style={{
                      color: '#555555',
                      fontSize: '13.5px',
                      lineHeight: '1.6',
                      marginBottom: '20px',
                      flexGrow: 1,
                    }}
                  >
                    {service.summary}
                  </p>

                  {/* CardFooter (Info highlight + CTA Button) */}
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
                        {service.infoLabel}
                      </span>
                      <span
                        style={{
                          fontSize: '15px',
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
                      {service.ctaText || 'Get a Quote'} <i className="fa-solid fa-arrow-up-right" style={{ fontSize: '11px' }}></i>
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

