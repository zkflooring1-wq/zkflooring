'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { EditModeProvider } from '@/components/editor/EditModeProvider';
import { EditableField } from '@/components/editor/EditableField';

const DEFAULT_CONTACT_DATA = {
  breadcrumb: {
    title: "Contact Us",
    subtitle: "Contact Us"
  },
  header: {
    badge: "Get In Touch",
    title: "Connect with ZK Flooring Birmingham",
    description: "Ready to upgrade your home or commercial premises? Contact our certified fitters for a free estimate or to book an in-home sample survey."
  },
  details: {
    address_title: "Our Headquarters",
    address_text: "B10 9HH, Hobmoor Road, Small Heath,\nBirmingham, West Midlands, UK",
    phone_title: "Call Us Directly",
    phone_number: "07903 723 774",
    phone_hours: "Mon – Sat: 8:00 AM – 6:30 PM (Sunday Closed)",
    email_title: "Send An Email",
    email_address: "zkflooring1@gmail.com"
  },
  form: {
    badge: "Free Measuring & Samples",
    title: "Request a Free Home Survey & Quote",
    description: "Fill out the details below and our lead specialist will confirm your appointment within 2 hours."
  },
  map: {
    embed_url: "https://maps.google.com/maps?q=Hobmoor%20Road%2C%20Small%20Heath%2C%20Birmingham%20B10%209HH&t=m&z=14&output=embed&iwloc=near"
  }
};

export default function ContactPage() {
  const [data, setData] = useState<any>(DEFAULT_CONTACT_DATA);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    msg: '',
    terms: false,
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Read query parameters (?sample=, ?service=) on mount
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const sample = params.get('sample');
      const service = params.get('service');
      if (sample) {
        setFormData(prev => ({
          ...prev,
          service: `Sample Request: ${sample}`,
          msg: `Hello, I would like to request a free sample pack and in-home survey for ${sample} flooring.`
        }));
      } else if (service) {
        setFormData(prev => ({
          ...prev,
          service: service
        }));
      }
    }

    async function fetchData() {
      try {
        const { data: pageData } = await supabase
          .from('pages')
          .select('sections')
          .eq('slug', 'contact')
          .maybeSingle();

        if (pageData?.sections) {
          setData({
            breadcrumb: { ...DEFAULT_CONTACT_DATA.breadcrumb, ...(pageData.sections.breadcrumb || {}) },
            header: { ...DEFAULT_CONTACT_DATA.header, ...(pageData.sections.header || {}) },
            details: { ...DEFAULT_CONTACT_DATA.details, ...(pageData.sections.details || {}) },
            form: { ...DEFAULT_CONTACT_DATA.form, ...(pageData.sections.form || {}) },
            map: { ...DEFAULT_CONTACT_DATA.map, ...(pageData.sections.map || {}) },
          });
        }
      } catch {
        // fallback
      }
    }
    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          service: formData.service || 'General Inquiry',
          message: formData.msg,
          source: 'contact_form',
        }),
      });
    } catch {
      // Continue gracefully
    } finally {
      setLoading(false);
      setSubmitted(true);
    }
  };

  const breadcrumb = data.breadcrumb || DEFAULT_CONTACT_DATA.breadcrumb;
  const header = data.header || DEFAULT_CONTACT_DATA.header;
  const details = data.details || DEFAULT_CONTACT_DATA.details;
  const form = data.form || DEFAULT_CONTACT_DATA.form;
  const map = data.map || DEFAULT_CONTACT_DATA.map;

  return (
    <EditModeProvider initialData={data}>
    <main>
      <style>{`
        .zk-contact-card {
          background: #FFFFFF;
          border-radius: 24px;
          padding: 40px;
          border: 1px solid rgba(212, 175, 55, 0.25);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.04);
        }
        .zk-contact-item {
          display: flex;
          align-items: flex-start;
          gap: 16px;
          margin-bottom: 24px;
        }
        .zk-contact-icon {
          width: 48px;
          height: 48px;
          border-radius: 14px;
          background: #16120B;
          color: #FCF6BA;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          border: 1px solid rgba(212, 175, 55, 0.35);
          flex-shrink: 0;
          transition: transform 0.3s ease;
        }
        .zk-contact-item:hover .zk-contact-icon {
          background: linear-gradient(135deg, #BF953F, #FCF6BA, #B38728);
          color: #16120B;
          transform: scale(1.06);
        }
        .zk-form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 18px;
          margin-bottom: 18px;
        }
        .zk-input-group {
          position: relative;
          width: 100%;
        }
        .zk-input-group .zk-field-icon {
          position: absolute;
          left: 18px;
          top: 50%;
          transform: translateY(-50%);
          color: #AA771C;
          font-size: 15px;
          pointer-events: none;
        }
        .zk-input-group input,
        .zk-input-group select,
        .zk-input-group textarea {
          width: 100%;
          padding: 14px 18px 14px 48px;
          border-radius: 12px;
          border: 1px solid rgba(212, 175, 55, 0.3);
          background: #FAF8F5;
          color: #16120B;
          font-size: 14.5px;
          outline: none;
          transition: all 0.25s ease;
        }
        .zk-input-group textarea {
          padding-left: 18px;
          min-height: 120px;
          resize: vertical;
        }
        .zk-input-group input:focus,
        .zk-input-group select:focus,
        .zk-input-group textarea:focus {
          background: #FFFFFF;
          border-color: #AA771C;
          box-shadow: 0 0 0 3px rgba(212, 175, 55, 0.18);
        }
        .zk-social-pill {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 18px;
          border-radius: 30px;
          border: 1px solid rgba(212, 175, 55, 0.3);
          background: #FFFFFF;
          color: #16120B;
          font-size: 13px;
          font-weight: 600;
          text-decoration: none;
          transition: all 0.25s ease;
        }
        .zk-social-pill:hover {
          background: #16120B;
          color: #FCF6BA;
          border-color: #16120B;
        }
        @media (max-width: 767px) {
          .zk-form-grid {
            grid-template-columns: 1fr;
            gap: 14px;
            margin-bottom: 14px;
          }
          .zk-contact-card {
            padding: 26px 20px;
          }
        }
        @media (max-width: 575px) {
          .zk-contact-card {
            padding: 22px 16px;
            border-radius: 18px;
          }
          .zk-contact-icon {
            width: 40px;
            height: 40px;
            font-size: 16px;
          }
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
                    <h2 className="title"><EditableField path="breadcrumb.title" fallback={breadcrumb.title || "Contact Us"} /></h2>
                    <ul className="page-breadcrumb">
                      <li><a href="/"><i className="fa-solid fa-house-chimney"></i>Home</a></li>
                      <li><span>/</span> <EditableField path="breadcrumb.subtitle" fallback={breadcrumb.subtitle || "Contact Us"} /></li>
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

      {/* Contact Section */}
      <section className="tv-contact-section inner space bg-light">
        <div className="container">
          <div className="row gy-40">
            {/* Left Column: Direct Info */}
            <div className="col-lg-5">
              <div className="contact-content-wrap pe-lg-2">
                <div className="title-wrap mb-40">
                  <div className="sub-title-2 text-theme mb-2">
                    <i className="fa-solid fa-circle-check"></i><EditableField path="header.badge" fallback={header.badge || "Get In Touch"} />
                  </div>
                  <h2 className="sec-title mb-3" style={{ fontSize: 'clamp(26px, 3.5vw, 40px)', lineHeight: 1.25 }}>
                    <EditableField path="header.title" fallback={header.title || "Connect with ZK Flooring Birmingham"} isHtml />
                  </h2>
                  <p className="text-secondary" style={{ fontSize: '15px', lineHeight: 1.65 }}>
                    <EditableField path="header.description" fallback={header.description || "Ready to upgrade your home or commercial premises? Contact our certified fitters."} />
                  </p>
                </div>

                <div className="contact-info">
                  {/* Address */}
                  <div className="zk-contact-item">
                    <div className="zk-contact-icon">
                      <i className="fa-solid fa-location-dot"></i>
                    </div>
                    <div>
                      <h4 style={{ fontSize: '16px', fontWeight: 700, color: '#16120B', marginBottom: '4px' }}>
                        <EditableField path="details.address_title" fallback={details.address_title || "Our Headquarters"} />
                      </h4>
                      <p style={{ fontSize: '14px', color: '#635E57', lineHeight: 1.5, margin: 0, whiteSpace: 'pre-line' }}>
                        <EditableField path="details.address_text" fallback={details.address_text || "B10 9HH, Hobmoor Road, Small Heath,\nBirmingham, West Midlands, UK"} />
                      </p>
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="zk-contact-item">
                    <div className="zk-contact-icon">
                      <i className="fa-solid fa-phone-volume"></i>
                    </div>
                    <div>
                      <h4 style={{ fontSize: '16px', fontWeight: 700, color: '#16120B', marginBottom: '4px' }}>
                        <EditableField path="details.phone_title" fallback={details.phone_title || "Call Us Directly"} />
                      </h4>
                      <a
                        href={`tel:${(details.phone_number || "07903 723 774").replace(/\s+/g, '')}`}
                        style={{ fontSize: '16px', fontWeight: 800, color: '#16120B', textDecoration: 'none', display: 'block' }}
                      >
                        <EditableField path="details.phone_number" fallback={details.phone_number || "07903 723 774"} />
                      </a>
                      <span style={{ fontSize: '12px', color: '#8C867D' }}>
                        <EditableField path="details.phone_hours" fallback={details.phone_hours || "Mon – Sat: 8:00 AM – 6:30 PM (Sunday Closed)"} />
                      </span>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="zk-contact-item">
                    <div className="zk-contact-icon">
                      <i className="fa-solid fa-envelope"></i>
                    </div>
                    <div>
                      <h4 style={{ fontSize: '16px', fontWeight: 700, color: '#16120B', marginBottom: '4px' }}>
                        <EditableField path="details.email_title" fallback={details.email_title || "Send An Email"} />
                      </h4>
                      <a
                        href={`mailto:${details.email_address || "zkflooring1@gmail.com"}`}
                        style={{ fontSize: '14px', color: '#635E57', textDecoration: 'none' }}
                      >
                        <EditableField path="details.email_address" fallback={details.email_address || "zkflooring1@gmail.com"} />
                      </a>
                    </div>
                  </div>
                </div>

                {/* Social Channels */}
                <div className="d-flex align-items-center gap-2 mt-4 pt-2">
                  <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="zk-social-pill">
                    <i className="fa-brands fa-facebook-f" style={{ color: '#AA771C' }}></i> Facebook
                  </a>
                  <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="zk-social-pill">
                    <i className="fa-brands fa-instagram" style={{ color: '#AA771C' }}></i> Instagram
                  </a>
                </div>
              </div>
            </div>

            {/* Right Column: Contact & Survey Request Form */}
            <div className="col-lg-7">
              <div className="zk-contact-card">
                <div className="mb-4">
                  <span style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', color: '#AA771C' }}>
                    <EditableField path="form.badge" fallback={form.badge || "Free Measuring & Samples"} />
                  </span>
                  <h3 style={{ fontSize: '24px', fontWeight: 800, color: '#16120B', marginTop: '4px', marginBottom: '8px' }}>
                    <EditableField path="form.title" fallback={form.title || "Request a Free Home Survey & Quote"} />
                  </h3>
                  <p style={{ fontSize: '14px', color: '#736E67', margin: 0 }}>
                    <EditableField path="form.description" fallback={form.description || "Fill out the details below and our lead specialist will confirm your appointment within 2 hours."} />
                  </p>
                </div>

                {submitted ? (
                  <div
                    style={{
                      padding: '36px 28px',
                      borderRadius: '16px',
                      background: '#FAF8F5',
                      border: '1px solid rgba(212, 175, 55, 0.4)',
                      textAlign: 'center',
                    }}
                  >
                    <div
                      style={{
                        width: '56px',
                        height: '56px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #BF953F, #FCF6BA, #B38728)',
                        color: '#16120B',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '24px',
                        margin: '0 auto 16px',
                      }}
                    >
                      <i className="fa-solid fa-check"></i>
                    </div>
                    <h4 style={{ fontSize: '20px', fontWeight: 800, color: '#16120B', marginBottom: '8px' }}>
                      Survey Request Received!
                    </h4>
                    <p style={{ fontSize: '14px', color: '#635E57', maxWidth: '420px', margin: '0 auto 20px' }}>
                      Thank you, <strong>{formData.name || 'Valued Customer'}</strong>. Our master fitter will call you shortly at <strong>{formData.phone || 'your number'}</strong> to arrange your free home sample consultation.
                    </p>
                    <button
                      onClick={() => { setSubmitted(false); setFormData({ name: '', email: '', phone: '', service: '', msg: '', terms: false }); }}
                      className="theme-btn br-30"
                      style={{
                        padding: '10px 24px',
                        fontSize: '13px',
                        background: '#16120B',
                        color: '#FCF6BA',
                        border: 'none',
                        borderRadius: '30px',
                        cursor: 'pointer',
                      }}
                    >
                      Submit Another Inquiry
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit}>
                    {/* Row 1: Name & Email */}
                    <div className="zk-form-grid">
                      <div className="zk-input-group">
                        <i className="fa-solid fa-user zk-field-icon"></i>
                        <input
                          type="text"
                          placeholder="Your Full Name"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          required
                        />
                      </div>
                      <div className="zk-input-group">
                        <i className="fa-solid fa-envelope zk-field-icon"></i>
                        <input
                          type="email"
                          placeholder="Email Address"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          required
                        />
                      </div>
                    </div>

                    {/* Row 2: Phone & Service */}
                    <div className="zk-form-grid">
                      <div className="zk-input-group">
                        <i className="fa-solid fa-phone zk-field-icon"></i>
                        <input
                          type="tel"
                          placeholder="Phone Number (e.g. 07903 723 774)"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          required
                        />
                      </div>
                      <div className="zk-input-group">
                        <i className="fa-solid fa-layer-group zk-field-icon"></i>
                        <select
                          value={formData.service}
                          onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                          required
                        >
                          <option value="" disabled>Select Flooring Type / Service</option>
                          {formData.service && ![
                            'Carpet & Underlay Fitting',
                            'Luxury Vinyl Tile (LVT) & Herringbone',
                            'Solid & Engineered Hardwood',
                            'Laminate Flooring Installation',
                            'Commercial Safety Flooring',
                            'Self-Levelling Screed & Subfloor Prep',
                            'Free Mobile Showroom Survey'
                          ].includes(formData.service) && (
                            <option value={formData.service}>{formData.service}</option>
                          )}
                          <option value="Carpet & Underlay Fitting">Carpet &amp; Underlay Fitting</option>
                          <option value="Luxury Vinyl Tile (LVT) & Herringbone">Luxury Vinyl Tile (LVT) &amp; Herringbone</option>
                          <option value="Solid & Engineered Hardwood">Solid &amp; Engineered Hardwood</option>
                          <option value="Laminate Flooring Installation">Laminate Flooring Installation</option>
                          <option value="Commercial Safety Flooring">Commercial Safety Flooring</option>
                          <option value="Self-Levelling Screed & Subfloor Prep">Self-Levelling Screed &amp; Subfloor Prep</option>
                          <option value="Free Mobile Showroom Survey">Free Mobile Showroom Survey</option>
                        </select>
                      </div>
                    </div>

                    {/* Row 3: Message */}
                    <div className="zk-input-group mb-3">
                      <textarea
                        placeholder="Tell us about your project (Room dimensions, location in Birmingham, preferred dates, etc.)..."
                        value={formData.msg}
                        onChange={(e) => setFormData({ ...formData, msg: e.target.value })}
                        required
                      ></textarea>
                    </div>

                    {/* Terms Checkbox */}
                    <div className="d-flex align-items-center gap-2 mb-4">
                      <input
                        type="checkbox"
                        id="terms"
                        checked={formData.terms}
                        onChange={(e) => setFormData({ ...formData, terms: e.target.checked })}
                        required
                        style={{ accentColor: '#AA771C', width: '16px', height: '16px', cursor: 'pointer' }}
                      />
                      <label htmlFor="terms" style={{ fontSize: '13px', color: '#635E57', cursor: 'pointer', margin: 0 }}>
                        I agree to receive a free quote and consultation from ZK Flooring.
                      </label>
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={loading}
                      className="theme-btn br-30"
                      style={{
                        background: 'linear-gradient(to right, #BF953F, #FCF6BA, #B38728, #FBF5B7, #AA771C)',
                        color: '#16120B',
                        fontWeight: 700,
                        fontSize: '15px',
                        padding: '14px 32px',
                        border: 'none',
                        borderRadius: '30px',
                        width: '100%',
                        cursor: 'pointer',
                        boxShadow: '0 6px 20px rgba(179, 135, 40, 0.3)',
                      }}
                    >
                      <span className="link-effect">
                        <span className="effect-1">{loading ? 'Submitting Request...' : 'Submit Free Survey Request'}</span>
                        <span className="effect-1">{loading ? 'Submitting Request...' : 'Submit Free Survey Request'}</span>
                      </span>
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Map */}
      <div className="tv-contact-map" style={{ position: 'relative', overflow: 'hidden' }}>
        <iframe
          className="map-canvas"
          src="https://maps.google.com/maps?q=Hobmoor%20Road%2C%20Small%20Heath%2C%20Birmingham%20B10%209HH&t=m&z=14&output=embed&iwloc=near"
          allowFullScreen
          loading="lazy"
          title="ZK Flooring Location"
          style={{ width: '100%', height: '360px', border: 0, display: 'block' }}
        ></iframe>
      </div>
    </main>
    </EditModeProvider>
  );
}

