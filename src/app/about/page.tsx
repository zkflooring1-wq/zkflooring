import React from 'react';
import type { Metadata } from 'next';
import { supabase } from '@/lib/supabase';
import { EditModeProvider } from '@/components/editor/EditModeProvider';
import { EditableField } from '@/components/editor/EditableField';
import { EditableImage } from '@/components/editor/EditableImage';

export const metadata: Metadata = {
  title: "About Us | ZK Flooring Birmingham",
  description: "Learn about ZK Flooring, Birmingham's trusted specialists in premium carpet, hardwood, LVT, laminate, and commercial flooring installations with 15+ years of experience.",
};

const DEFAULT_ABOUT_DATA = {
  breadcrumb: {
    title: "About Us",
    subtitle: "About Us"
  },
  features: {
    social_proof_count: "3,600",
    social_proof_label: "Satisfied Property Owners",
    social_proof_images: [
      "/assets/images/social/social-img01.webp",
      "/assets/images/social/social-img02.webp",
      "/assets/images/social/social-img03.webp"
    ],
    boxes: [
      {
        icon: "/assets/images/feature/hm1-icon01.webp",
        title: "Residential & Commercial <br />Flooring",
        description: "Expert supply and precision installation of luxury carpet, hardwood, LVT, and vinyl for homes and offices across Birmingham."
      },
      {
        icon: "/assets/images/feature/hm1-icon02.webp",
        title: "Subfloor Preparation <br />& Self-Levelling",
        description: "Flawless subfloor levelling, latex screeding, and ply boarding ensuring perfectly smooth, durable surfaces."
      }
    ]
  },
  showcase: {
    main_image: "/about page/1.webp",
    fitter_image: "/about page/2.webp",
    fitter_name: "ZK FLOORING",
    fitter_title: "Master Flooring Installer",
    experience_years: "15",
    experience_label: "Years of Trade Excellence"
  },
  editorial: {
    badge: "Get to Know Us",
    title: "Transforming Birmingham Properties with Precision Flooring Solutions",
    description: "ZK Flooring is Birmingham's trusted specialist for premium carpet, hardwood, LVT, laminate, and commercial vinyl installations. We deliver unmatched craftsmanship, reliability, and top-tier materials to every project across the West Midlands.",
    metrics: [
      {
        title: "Carpet & Underlay Fitting",
        tag: "98% Satisfaction",
        progress: "98%",
        desc: "Luxury high-tog underlays, invisible seam joins, and tailored staircase runners."
      },
      {
        title: "Hardwood & LVT Installation",
        tag: "95% Accuracy Score",
        progress: "95%",
        desc: "Subfloor latex screeding, herringbone patterns, and premium Amtico & Karndean LVT."
      }
    ],
    cta_text: "Request Free Survey",
    cta_link: "/contact",
    phone: "07903 723 774",
    phone_link: "tel:07903723774"
  },
  standards: {
    badge: "Why Choose ZK Flooring",
    title: "The Craftsmanship Standards That Set Us Apart",
    description: "From precision subfloor preparation to the final bespoke trim, we deliver flawless results backed by transparent pricing, expert master fitters, and total peace of mind.",
    cards: [
      {
        icon: "fa-solid fa-ruler-combined",
        tag: "Precision Prep",
        title: "Laser-Leveled Subfloor Prep",
        desc: "Moisture testing, ply boarding, and latex self-levelling screeding to ensure your floors stay perfectly flat, silent, and stable."
      },
      {
        icon: "fa-solid fa-truck-fast",
        tag: "Convenience",
        title: "Free Home Survey & Samples",
        desc: "We bring hundreds of luxury carpet, LVT, and hardwood samples right to your door for accurate in-room color matching and measuring."
      },
      {
        icon: "fa-solid fa-wand-magic-sparkles",
        tag: "Zero Mess",
        title: "White-Glove Property Care",
        desc: "We treat your home with total respect. Furniture moving, precise door trimming, dust-contained cutting, and spotless cleanup."
      },
      {
        icon: "fa-solid fa-shield-halved",
        tag: "Guaranteed",
        title: "10-Year Trade Guarantee",
        desc: "Every installation is backed by our comprehensive 10-year workmanship guarantee and £5M full public liability insurance cover."
      }
    ]
  },
  achievements: {
    subtitle: "Our Track Record",
    title: "Trusted by Homeowners & Businesses Across Birmingham & Beyond",
    description: "ZK Flooring has delivered premium carpet, LVT, hardwood, and commercial vinyl installations to over 3,600 satisfied property owners across the West Midlands.",
    phone: "07903 723 774",
    stats: [
      { number: "3,600+", label: "Projects Completed", desc: "Homes & commercial properties fitted" },
      { number: "15+", label: "Years of Experience", desc: "Master floor fitting craftsmanship" },
      { number: "98%", label: "Customer Satisfaction", desc: "5-star verified reviews & ratings" },
      { number: "6+", label: "Flooring Categories", desc: "Carpet, LVT, Wood, Vinyl & Screed" }
    ]
  }
};

export default async function AboutPage() {
  const { data: pageData } = await supabase
    .from('pages')
    .select('sections')
    .eq('slug', 'about')
    .maybeSingle();

  const sections = pageData?.sections || DEFAULT_ABOUT_DATA;

  const features = sections.features || DEFAULT_ABOUT_DATA.features;
  const showcase = sections.showcase || DEFAULT_ABOUT_DATA.showcase;
  const editorial = sections.editorial || DEFAULT_ABOUT_DATA.editorial;
  const standards = sections.standards || DEFAULT_ABOUT_DATA.standards;
  const achievements = sections.achievements || DEFAULT_ABOUT_DATA.achievements;

  return (
    <EditModeProvider initialData={sections}>
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
                    <h2 className="title"><EditableField path="breadcrumb.title" fallback={sections.breadcrumb?.title || "About Us"} /></h2>
                    <ul className="page-breadcrumb">
                      <li><a href="/"><i className="fa-solid fa-house-chimney"></i>Home</a></li>
                      <li><span>/</span> <EditableField path="breadcrumb.subtitle" fallback={sections.breadcrumb?.subtitle || "About Us"} /></li>
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

      {/* Feature Section One */}
      <section className="tv-feature-section bg-light space-top">
        <div className="container">
          <div className="row gy-30 align-items-stretch">
            <div className="col-lg-4 col-md-6 col-sm-6">
              <div className="tv-feature-item h-100 d-flex flex-column">
                <div className="client-social-proof flex-grow-1">
                  <div className="social">
                    <EditableImage path="features.social_proof_images.0" fallback={features.social_proof_images?.[0] || "/assets/images/social/social-img01.webp"} alt="Client 01" />
                    <EditableImage path="features.social_proof_images.1" fallback={features.social_proof_images?.[1] || "/assets/images/social/social-img02.webp"} alt="Client 02" />
                    <EditableImage path="features.social_proof_images.2" fallback={features.social_proof_images?.[2] || "/assets/images/social/social-img03.webp"} alt="Client 03" />
                    <h4>+3K</h4>
                  </div>
                  <div className="count-box mt-30"><span className="count-number"><EditableField path="features.social_proof_count" fallback={features.social_proof_count || "3,600"} /></span></div>
                  <div className="rating-viewers"><EditableField path="features.social_proof_label" fallback={features.social_proof_label || "Satisfied Property Owners"} /></div>
                  <a href="/contact" className="theme-btn style2 mt-20 br-30 mt-auto">
                    <span className="link-effect">
                      <span className="effect-1">Get a Quote</span>
                      <span className="effect-1">Get a Quote</span>
                    </span>
                    <span className="arrow-all-2">
                      <i>
                        <svg width="11" height="12" viewBox="0 0 12 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M10.0035 3.90804L1.41153 12.5L0 11.0885L8.59097 2.49651H1.01922V0.5H12V11.4808H10.0035V3.90804Z" fill="white"></path>
                        </svg>
                        <svg width="11" height="12" viewBox="0 0 12 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M10.0035 3.90804L1.41153 12.5L0 11.0885L8.59097 2.49651H1.01922V0.5H12V11.4808H10.0035V3.90804Z" fill="white"></path>
                        </svg>
                      </i>
                    </span>
                  </a>
                  <div className="scribble-shape1 moving">
                    <img src="/assets/images/feature/scribble.webp" alt="" />
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-4 col-md-6 col-sm-6">
              <div className="tv-feature-box h-100 d-flex flex-column">
                <div className="icon-top">
                  <div className="icon">
                    <i>
                      <svg width="12" height="13" viewBox="0 0 12 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M10.0035 3.90804L1.41153 12.5L0 11.0885L8.59097 2.49651H1.01922V0.5H12V11.4808H10.0035V3.90804Z" fill="white"></path>
                      </svg>
                      <svg width="12" height="13" viewBox="0 0 12 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M10.0035 3.90804L1.41153 12.5L0 11.0885L8.59097 2.49651H1.01922V0.5H12V11.4808H10.0035V3.90804Z" fill="white"></path>
                      </svg>
                    </i>
                  </div>
                </div>
                <div className="logo mb-40">
                  <EditableImage path="features.boxes.0.icon" fallback={features.boxes?.[0]?.icon || "/assets/images/feature/hm1-icon01.webp"} alt="Flooring Icon" />
                </div>
                <h2><EditableField path="features.boxes.0.title" fallback={features.boxes?.[0]?.title || "Residential & Commercial <br />Flooring"} isHtml /></h2>
                <p className="flex-grow-1"><EditableField path="features.boxes.0.description" fallback={features.boxes?.[0]?.description || "Expert supply and precision installation of luxury carpet, hardwood, LVT, and vinyl for homes and offices across Birmingham."} /></p>
              </div>
            </div>
            <div className="col-lg-4 col-md-6 col-sm-6">
              <div className="tv-feature-box bg-theme3 h-100 d-flex flex-column">
                <div className="icon-top">
                  <div className="icon style2 bg-dark">
                    <i>
                      <svg width="12" height="13" viewBox="0 0 12 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M10.0035 3.90804L1.41153 12.5L0 11.0885L8.59097 2.49651H1.01922V0.5H12V11.4808H10.0035V3.90804Z" fill="white"></path>
                      </svg>
                      <svg width="12" height="13" viewBox="0 0 12 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M10.0035 3.90804L1.41153 12.5L0 11.0885L8.59097 2.49651H1.01922V0.5H12V11.4808H10.0035V3.90804Z" fill="white"></path>
                      </svg>
                    </i>
                  </div>
                </div>
                <div className="logo mb-40">
                  <EditableImage path="features.boxes.1.icon" fallback={features.boxes?.[1]?.icon || "/assets/images/feature/hm1-icon02.webp"} alt="Subfloor Icon" />
                </div>
                <h2><EditableField path="features.boxes.1.title" fallback={features.boxes?.[1]?.title || "Subfloor Preparation <br />& Self-Levelling"} isHtml /></h2>
                <p className="flex-grow-1"><EditableField path="features.boxes.1.description" fallback={features.boxes?.[1]?.description || "Flawless subfloor levelling, latex screeding, and ply boarding ensuring perfectly smooth, durable surfaces."} /></p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Redesigned About Section */}
      <section className="about-redesign-section space bg-light">
        <div className="container">
          <div className="row gy-50 align-items-center">
            {/* Visual Showcase (Left) */}
            <div className="col-lg-6">
              <div className="about-showcase-wrapper">
                <div className="main-thumb-card">
                  <EditableImage
                    path="showcase.main_image"
                    className="main-img"
                    fallback={showcase.main_image || "/about page/1.webp"}
                    alt="ZK Flooring Master Craftsmanship"
                  />
                </div>

                <div className="fitter-floating-card">
                  <EditableImage
                    path="showcase.fitter_image"
                    className="fitter-img"
                    fallback={showcase.fitter_image || "/about page/2.webp"}
                    alt="ZK Flooring Lead Fitter"
                  />
                  <div className="fitter-badge-glass">
                    <div className="d-flex align-items-center gap-2">
                      <span className="gold-dot"></span>
                      <div>
                        <h5 className="fitter-name"><EditableField path="showcase.fitter_name" fallback={showcase.fitter_name || "ZK FLOORING"} /></h5>
                        <p className="fitter-title"><EditableField path="showcase.fitter_title" fallback={showcase.fitter_title || "Master Flooring Installer"} /></p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="experience-badge-floating">
                  <div className="exp-icon-wrap">
                    <i className="fa-solid fa-award"></i>
                  </div>
                  <div className="exp-text-wrap">
                    <div className="d-flex align-items-baseline">
                      <span className="exp-number"><EditableField path="showcase.experience_years" fallback={showcase.experience_years || "15"} /></span>
                      <span className="exp-plus">+</span>
                    </div>
                    <span className="exp-label"><EditableField path="showcase.experience_label" fallback={showcase.experience_label || "Years of Trade Excellence"} /></span>
                  </div>
                </div>
              </div>
            </div>

            {/* Editorial Content (Right) */}
            <div className="col-lg-6">
              <div className="about-editorial-wrap ps-xl-4">
                <div className="about-badge-pill mb-3">
                  <i className="fa-solid fa-circle-check"></i>
                  <span><EditableField path="editorial.badge" fallback={editorial.badge || "Get to Know Us"} /></span>
                </div>

                <h2 className="sec-title mb-3" style={{ fontSize: 'clamp(28px, 3.2vw, 42px)', lineHeight: 1.25 }}>
                  <EditableField path="editorial.title" fallback={editorial.title || "Transforming Birmingham Properties with Precision Flooring Solutions"} isHtml />
                </h2>

                <p className="about-lead-text mb-4">
                  <EditableField path="editorial.description" fallback={editorial.description || "ZK Flooring is Birmingham's trusted specialist for premium carpet, hardwood, LVT, laminate, and commercial vinyl installations."} />
                </p>

                <div className="about-metrics-list mb-4">
                  {(editorial.metrics || []).map((m: any, idx: number) => (
                    <div key={idx} className="about-metric-card">
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <div className="d-flex align-items-center gap-3">
                          <div className="metric-icon-box">
                            <i className={`fa-solid ${idx === 0 ? 'fa-layer-group' : 'fa-ruler-combined'}`}></i>
                          </div>
                          <h4 className="metric-title"><EditableField path={`editorial.metrics.${idx}.title`} fallback={m.title} /></h4>
                        </div>
                        <span className="metric-badge-tag"><EditableField path={`editorial.metrics.${idx}.tag`} fallback={m.tag} /></span>
                      </div>
                      <div className="metric-progress-track mb-2">
                        <div className="metric-progress-fill" style={{ width: m.progress || '95%' }}></div>
                      </div>
                      <p className="metric-desc">
                        <EditableField path={`editorial.metrics.${idx}.desc`} fallback={m.desc} />
                      </p>
                    </div>
                  ))}
                </div>

                <div className="about-actions-row d-flex flex-wrap align-items-center gap-4 pt-2">
                  <a href={editorial.cta_link || "/contact"} className="theme-btn br-30">
                    <span className="link-effect">
                      <span className="effect-1"><EditableField path="editorial.cta_text" fallback={editorial.cta_text || "Request Free Survey"} /></span>
                      <span className="effect-1"><EditableField path="editorial.cta_text" fallback={editorial.cta_text || "Request Free Survey"} /></span>
                    </span>
                    <span className="arrow-all">
                      <i>
                        <svg width="16" height="19" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M2 6H10M10 6L6 2M10 6L6 10" stroke="#16120B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <svg width="16" height="19" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M2 6H10M10 6L6 2M10 6L6 10" stroke="#16120B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </i>
                    </span>
                  </a>

                  <div className="about-direct-contact">
                    <div className="direct-icon">
                      <i className="fa-solid fa-phone-volume"></i>
                    </div>
                    <div className="ms-3">
                      <span className="direct-subtitle">Direct Consultation</span>
                      <a href={editorial.phone_link || "tel:07903723774"} className="direct-number">
                        <EditableField path="editorial.phone" fallback={editorial.phone || "07903 723 774"} />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Craftsmanship Standards & Guarantees Section */}
      <section className="about-standards-section space bg-white">
        <div className="container">
          <div className="row justify-content-center text-center mb-50">
            <div className="col-lg-8">
              <div className="about-badge-pill mb-3">
                <i className="fa-solid fa-gem"></i>
                <span><EditableField path="standards.badge" fallback={standards.badge || "Why Choose ZK Flooring"} /></span>
              </div>
              <h2 className="sec-title mb-3" style={{ fontSize: 'clamp(28px, 3.2vw, 42px)', lineHeight: 1.25 }}>
                <EditableField path="standards.title" fallback={standards.title || "The Craftsmanship Standards That Set Us Apart"} isHtml />
              </h2>
              <p className="about-lead-text mx-auto" style={{ maxWidth: '680px' }}>
                <EditableField path="standards.description" fallback={standards.description || "From precision subfloor preparation to the final bespoke trim, we deliver flawless results backed by transparent pricing."} />
              </p>
            </div>
          </div>

          <div className="row gy-30">
            {(standards.cards || []).map((card: any, idx: number) => (
              <div key={idx} className="col-lg-3 col-md-6">
                <div className="standards-card">
                  <div className="card-icon-wrap">
                    <i className={card.icon || "fa-solid fa-gem"}></i>
                  </div>
                  <span className="card-tag"><EditableField path={`standards.cards.${idx}.tag`} fallback={card.tag} /></span>
                  <h3 className="card-title"><EditableField path={`standards.cards.${idx}.title`} fallback={card.title} /></h3>
                  <p className="card-desc">
                    <EditableField path={`standards.cards.${idx}.desc`} fallback={card.desc} />
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Achievement Section */}
      <section className="space bg-light">
        <div className="container">
          <div className="row gy-40 align-items-center">
            <div className="col-lg-5">
              <div className="achivement-content-wrapper pe-lg-3">
                <div className="sub-title-2 text-theme mb-2">
                  <i className="fa-solid fa-circle-check"></i><EditableField path="achievements.subtitle" fallback={achievements.subtitle || "Our Track Record"} />
                </div>
                <h2 className="sec-title mb-3" style={{ fontSize: 'clamp(28px, 3.2vw, 40px)', lineHeight: 1.25 }}>
                  <EditableField path="achievements.title" fallback={achievements.title || "Trusted by Homeowners & Businesses Across Birmingham & Beyond"} isHtml />
                </h2>
                <p className="mb-4 text-secondary" style={{ fontSize: '15px', lineHeight: 1.7 }}>
                  <EditableField path="achievements.description" fallback={achievements.description || "ZK Flooring has delivered premium carpet, LVT, hardwood, and commercial vinyl installations."} />
                </p>

                <div className="inner-contact d-flex align-items-center mt-4">
                  <div
                    className="icon me-3 bg-theme rounded-circle d-flex align-items-center justify-content-center"
                    style={{ width: '56px', height: '56px', flexShrink: 0 }}
                  >
                    <i className="fa-solid fa-phone text-dark fs-4"></i>
                  </div>
                  <div className="content">
                    <h6 className="call-text text-theme mb-1" style={{ fontSize: '13px', fontWeight: 600 }}>Need Help?</h6>
                    <a className="call-phone text-dark fs-5 fw-bold text-decoration-none" href="tel:07903723774">
                      <EditableField path="achievements.phone" fallback={achievements.phone || "07903 723 774"} />
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-7">
              <div className="row gy-3">
                {(achievements.stats || []).map((st: any, idx: number) => (
                  <div key={idx} className="col-sm-6">
                    <div
                      className="p-4 rounded-4 h-100"
                      style={{
                        backgroundColor: '#FFFFFF',
                        border: '1px solid rgba(212, 175, 55, 0.25)',
                        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.04)',
                      }}
                    >
                      <h3 className="fw-bold mb-1" style={{ color: '#AA771C', fontSize: '36px' }}>
                        <EditableField path={`achievements.stats.${idx}.number`} fallback={st.number} />
                      </h3>
                      <p className="text-dark mb-1 fw-bold" style={{ fontSize: '16px' }}>
                        <EditableField path={`achievements.stats.${idx}.label`} fallback={st.label} />
                      </p>
                      <p className="text-muted mb-0" style={{ fontSize: '13px' }}>
                        <EditableField path={`achievements.stats.${idx}.desc`} fallback={st.desc} />
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
    </EditModeProvider>
  );
}
