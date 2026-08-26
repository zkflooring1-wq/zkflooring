import React from 'react';
import type { Metadata } from 'next';
import ServicesSection, { defaultZkServices } from '@/components/ServicesSection';
import { supabase } from '@/lib/supabase';

export const metadata: Metadata = {
  title: "Our Flooring Services | ZK Flooring Birmingham",
  description: "Explore ZK Flooring's comprehensive installation services: Carpet fitting, LVT, hardwood, laminate, and commercial flooring in Birmingham.",
};

export default async function ServicesPage() {
  const { data: dbServices } = await supabase.from('services').select('*').order('created_at', { ascending: false });
  const flooringServices = dbServices && dbServices.length > 0 ? dbServices : defaultZkServices;

  return (
    <main>
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
                    <h2 className="title">Our Services</h2>
                    <ul className="page-breadcrumb">
                      <li><a href="/"><i className="fa-solid fa-house-chimney"></i>Home</a></li>
                      <li><span>/</span> Services</li>
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

      {/* Services Section */}
      <ServicesSection flooringServices={flooringServices} />

      {/* 4-Step Installation Workflow Section */}
      <section className="space bg-white" style={{ position: 'relative' }}>
        <div className="container">
          {/* Header */}
          <div className="row justify-content-center text-center mb-50">
            <div className="col-lg-8">
              <div className="about-badge-pill mb-3">
                <i className="fa-solid fa-layer-group"></i>
                <span>Our Seamless Process</span>
              </div>
              <h2 className="sec-title mb-3" style={{ fontSize: 'clamp(26px, 3.5vw, 40px)', lineHeight: 1.25 }}>
                How We Deliver Flawless Flooring in 4 Simple Steps
              </h2>
              <p className="text-secondary mx-auto" style={{ maxWidth: '640px', fontSize: '15px', lineHeight: 1.65 }}>
                From our initial free mobile showroom survey to the final bespoke trim, our trade-certified installers make the entire experience smooth and stress-free.
              </p>
            </div>
          </div>

          {/* 4 Workflow Steps Grid */}
          <div className="row gy-30">
            {/* Step 1 */}
            <div className="col-lg-3 col-md-6">
              <div
                className="p-4 rounded-4 h-100 d-flex flex-column"
                style={{
                  backgroundColor: '#FAF8F5',
                  border: '1px solid rgba(212, 175, 55, 0.22)',
                  boxShadow: '0 6px 20px rgba(0,0,0,0.02)',
                  position: 'relative',
                }}
              >
                <div
                  style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '12px',
                    background: '#16120B',
                    color: '#FCF6BA',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '18px',
                    fontWeight: 800,
                    marginBottom: '16px',
                    border: '1px solid rgba(212, 175, 55, 0.35)',
                  }}
                >
                  01
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#16120B', marginBottom: '8px' }}>
                  Free Home Survey
                </h3>
                <p style={{ fontSize: '13.5px', color: '#635E57', lineHeight: 1.6, margin: 0 }}>
                  We bring 100s of luxury samples directly to your door, take precision laser measurements, and provide a fixed quote.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="col-lg-3 col-md-6">
              <div
                className="p-4 rounded-4 h-100 d-flex flex-column"
                style={{
                  backgroundColor: '#FAF8F5',
                  border: '1px solid rgba(212, 175, 55, 0.22)',
                  boxShadow: '0 6px 20px rgba(0,0,0,0.02)',
                  position: 'relative',
                }}
              >
                <div
                  style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '12px',
                    background: '#16120B',
                    color: '#FCF6BA',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '18px',
                    fontWeight: 800,
                    marginBottom: '16px',
                    border: '1px solid rgba(212, 175, 55, 0.35)',
                  }}
                >
                  02
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#16120B', marginBottom: '8px' }}>
                  Subfloor Prep
                </h3>
                <p style={{ fontSize: '13.5px', color: '#635E57', lineHeight: 1.6, margin: 0 }}>
                  DPM moisture barrier testing, ply boarding, and latex self-levelling screed to create a mirror-flat, stable foundation.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="col-lg-3 col-md-6">
              <div
                className="p-4 rounded-4 h-100 d-flex flex-column"
                style={{
                  backgroundColor: '#FAF8F5',
                  border: '1px solid rgba(212, 175, 55, 0.22)',
                  boxShadow: '0 6px 20px rgba(0,0,0,0.02)',
                  position: 'relative',
                }}
              >
                <div
                  style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '12px',
                    background: '#16120B',
                    color: '#FCF6BA',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '18px',
                    fontWeight: 800,
                    marginBottom: '16px',
                    border: '1px solid rgba(212, 175, 55, 0.35)',
                  }}
                >
                  03
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#16120B', marginBottom: '8px' }}>
                  Master Fitting
                </h3>
                <p style={{ fontSize: '13.5px', color: '#635E57', lineHeight: 1.6, margin: 0 }}>
                  Expert installation by certified fitters with seamless stretching, herringbone alignments, and custom door/skirting trims.
                </p>
              </div>
            </div>

            {/* Step 4 */}
            <div className="col-lg-3 col-md-6">
              <div
                className="p-4 rounded-4 h-100 d-flex flex-column"
                style={{
                  backgroundColor: '#FAF8F5',
                  border: '1px solid rgba(212, 175, 55, 0.22)',
                  boxShadow: '0 6px 20px rgba(0,0,0,0.02)',
                  position: 'relative',
                }}
              >
                <div
                  style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '12px',
                    background: '#16120B',
                    color: '#FCF6BA',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '18px',
                    fontWeight: 800,
                    marginBottom: '16px',
                    border: '1px solid rgba(212, 175, 55, 0.35)',
                  }}
                >
                  04
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#16120B', marginBottom: '8px' }}>
                  Cleanup &amp; Warranty
                </h3>
                <p style={{ fontSize: '13.5px', color: '#635E57', lineHeight: 1.6, margin: 0 }}>
                  Complete dust-controlled cleanup, off-cut removal, furniture replaced, and your 10-year trade warranty certificate.
                </p>
              </div>
            </div>
          </div>

          {/* Direct Consultation Callout */}
          <div
            className="mt-5 p-4 d-flex flex-wrap align-items-center justify-content-between gap-3"
            style={{
              backgroundColor: '#16120B',
              borderRadius: '24px',
              border: '1px solid rgba(212, 175, 55, 0.35)',
              boxShadow: '0 12px 30px rgba(0,0,0,0.15)',
              overflow: 'hidden',
            }}
          >
            <div className="d-flex align-items-center gap-3">
              <div
                style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #BF953F, #FCF6BA, #B38728)',
                  color: '#16120B',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '20px',
                  fontWeight: 700,
                  flexShrink: 0,
                }}
              >
                <i className="fa-solid fa-phone"></i>
              </div>
              <div>
                <span style={{ fontSize: '11px', color: '#FCF6BA', textTransform: 'uppercase', letterSpacing: '0.6px', display: 'block' }}>
                  Speak Directly With Our Fitters
                </span>
                <a
                  href="tel:07903723774"
                  style={{ fontSize: '18px', fontWeight: 800, color: '#FFFFFF', textDecoration: 'none' }}
                >
                  07903 723 774
                </a>
              </div>
            </div>

            <a
              href="/contact"
              className="theme-btn br-30"
              style={{
                background: 'linear-gradient(to right, #BF953F, #FCF6BA, #B38728, #FBF5B7, #AA771C)',
                color: '#16120B',
                fontWeight: 700,
                fontSize: '14px',
                padding: '12px 26px',
                border: 'none',
                borderRadius: '30px',
                textDecoration: 'none',
              }}
            >
              <span className="link-effect">
                <span className="effect-1">Book Free Home Survey</span>
                <span className="effect-1">Book Free Home Survey</span>
              </span>
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}

