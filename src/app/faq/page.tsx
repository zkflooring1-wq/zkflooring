'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { EditModeProvider } from '@/components/editor/EditModeProvider';
import { EditableField } from '@/components/editor/EditableField';

interface FaqItem {
  id: number;
  question: string;
  answer: string;
  category?: string;
}

const DEFAULT_FAQ_DATA = {
  breadcrumb: {
    title: "Frequently Asked Questions",
    subtitle: "FAQ"
  },
  header: {
    badge: "Got Questions?",
    title: "Everything You Need to Know",
    description: "Clear, transparent answers about our flooring materials, subfloor levelling, free in-home sample visits, and trade guarantees."
  },
  items: [
    {
      id: 1,
      category: 'Surveys & Quotes',
      question: 'Do you offer free home surveys and measurements in Birmingham?',
      answer: 'Yes, 100% free with zero obligation. We visit your home or business with our mobile showroom featuring hundreds of carpet, LVT, hardwood, and laminate samples. We take laser-accurate measurements and provide a transparent, fixed quote.',
    },
    {
      id: 2,
      category: 'Installation & Prep',
      question: 'Do I need to prepare my subfloor or remove old flooring?',
      answer: 'Our team handles complete end-to-end preparation. We test for moisture (DPM), remove and responsibly dispose of old flooring, repair uneven surfaces, install ply boarding, and apply latex self-levelling screed to guarantee a mirror-flat, durable base.',
    },
    {
      id: 3,
      category: 'Materials & LVT',
      question: 'What is the difference between LVT (Luxury Vinyl Tile) and laminate flooring?',
      answer: 'LVT is 100% waterproof, exceptionally durable, and ideal for moisture-prone areas like kitchens, bathrooms, and hallways. It can be installed in custom patterns like herringbone. Laminate provides the authentic look of real timber at a cost-effective price point, offering superior scratch resistance for living areas and bedrooms.',
    },
    {
      id: 4,
      category: 'Timing & Process',
      question: 'How long does a typical flooring installation take?',
      answer: 'Most single-room or staircase carpet/laminate installations are completed within 1 working day. Full house installations or commercial projects typically take 2 to 4 days depending on required subfloor preparation and curing times.',
    },
    {
      id: 5,
      category: 'Guarantees & Insurance',
      question: 'Do you provide a guarantee on your workmanship?',
      answer: 'Yes, all ZK Flooring installations are backed by our comprehensive 10-Year Trade Workmanship Guarantee alongside manufacturer product warranties. We are also fully covered by £5,000,000 Public Liability Insurance for complete peace of mind.',
    },
    {
      id: 6,
      category: 'White-Glove Care',
      question: 'Will your fitters help move furniture and trim doors?',
      answer: 'Yes, we offer white-glove property care. Our certified fitters can assist with moving heavy furniture, cleanly undercutting door bottoms to clear new carpet and underlay heights, and performing full post-installation vacuuming and waste removal.',
    },
    {
      id: 7,
      category: 'Coverage Areas',
      question: 'What areas across Birmingham and the West Midlands do you cover?',
      answer: 'We cover all areas of Birmingham (Solihull, Sutton Coldfield, Edgbaston, Harborne, Moseley, Small Heath, Yardley, Hall Green, etc.) and extend throughout the entire West Midlands for residential and commercial flooring contracts.',
    },
  ],
  callout: {
    subtitle: "Still Have A Specific Question?",
    phone: "07903 723 774",
    cta_text: "Ask Our Specialists",
    cta_link: "/contact"
  }
};

export default function FAQPage() {
  const [data, setData] = useState<any>(DEFAULT_FAQ_DATA);
  const [activeId, setActiveId] = useState<number | null>(1);
  const [activeCategory, setActiveCategory] = useState<string>('All');

  useEffect(() => {
    async function fetchData() {
      try {
        const [pageRes, faqRes] = await Promise.all([
          supabase.from('pages').select('sections').eq('slug', 'faq').maybeSingle(),
          supabase.from('faqs').select('*').order('id', { ascending: true })
        ]);

        const pageSections = pageRes.data?.sections || {};
        const items = (faqRes.data && faqRes.data.length > 0) 
          ? faqRes.data 
          : (pageSections.items || DEFAULT_FAQ_DATA.items);

        setData({
          breadcrumb: { ...DEFAULT_FAQ_DATA.breadcrumb, ...(pageSections.breadcrumb || {}) },
          header: { ...DEFAULT_FAQ_DATA.header, ...(pageSections.header || {}) },
          items: items,
          callout: { ...DEFAULT_FAQ_DATA.callout, ...(pageSections.callout || {}) },
        });

        if (items.length > 0) setActiveId(items[0].id);
      } catch {
        // fallback to defaults
      }
    }
    fetchData();
  }, []);

  const toggleAccordion = (id: number) => {
    setActiveId(activeId === id ? null : id);
  };

  const faqs = data.items || DEFAULT_FAQ_DATA.items;
  const breadcrumb = data.breadcrumb || DEFAULT_FAQ_DATA.breadcrumb;
  const header = data.header || DEFAULT_FAQ_DATA.header;
  const callout = data.callout || DEFAULT_FAQ_DATA.callout;

  const categories = ['All', ...Array.from(new Set(faqs.map((f: any) => f.category || 'General').filter(Boolean)))];

  const filteredFaqs = activeCategory === 'All' 
    ? faqs 
    : faqs.filter((f: any) => (f.category || 'General') === activeCategory);

  return (
    <EditModeProvider initialData={data}>
    <main>
      <style>{`
        .zk-faq-card {
          border: 1px solid rgba(212, 175, 55, 0.22);
          border-radius: 18px;
          background: #FFFFFF;
          transition: all 0.3s ease;
          overflow: hidden;
          margin-bottom: 14px;
        }
        .zk-faq-card.active {
          border-color: rgba(212, 175, 55, 0.6);
          box-shadow: 0 10px 30px rgba(179, 135, 40, 0.1);
        }
        .zk-faq-btn {
          width: 100%;
          text-align: left;
          background: none;
          border: none;
          padding: 22px 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          cursor: pointer;
          font-weight: 700;
          color: #16120B;
          transition: color 0.2s ease;
        }
        .zk-faq-btn:hover {
          color: #AA771C;
        }
        .zk-faq-icon {
          width: 34px;
          height: 34px;
          border-radius: 50%;
          background: #FAF8F5;
          border: 1px solid rgba(212, 175, 55, 0.3);
          color: #AA771C;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 13px;
          flex-shrink: 0;
          transition: all 0.3s ease;
        }
        .zk-faq-card.active .zk-faq-icon {
          background: linear-gradient(135deg, #BF953F, #FCF6BA, #B38728);
          color: #16120B;
          transform: rotate(180deg);
        }
        .zk-faq-body {
          padding: 0 24px 22px 24px;
          color: #55524E;
          font-size: 14.5px;
          line-height: 1.7;
        }
        .zk-cat-pill {
          padding: 8px 18px;
          border-radius: 30px;
          font-size: 13px;
          font-weight: 600;
          border: 1px solid rgba(212, 175, 55, 0.25);
          background: #FFFFFF;
          color: #16120B;
          cursor: pointer;
          transition: all 0.25s ease;
        }
        .zk-cat-pill:hover, .zk-cat-pill.active {
          background: #16120B;
          color: #FCF6BA;
          border-color: #16120B;
        }
        .tv-faq-section.space {
          padding-top: 70px !important;
          padding-bottom: 40px !important;
        }
        @media (max-width: 767px) {
          .tv-faq-section.space {
            padding-top: 40px !important;
            padding-bottom: 15px !important;
          }
          .zk-faq-consult-box {
            margin-top: 20px !important;
            padding: 20px 16px !important;
          }
        }
        @media (max-width: 575px) {
          .zk-faq-btn {
            padding: 16px 16px;
            font-size: 15px !important;
          }
          .zk-faq-body {
            padding: 0 16px 16px 16px;
            font-size: 13.5px !important;
          }
          .zk-faq-icon {
            width: 28px;
            height: 28px;
            font-size: 11px;
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
                    <h2 className="title"><EditableField path="breadcrumb.title" fallback={breadcrumb.title || "Frequently Asked Questions"} /></h2>
                    <ul className="page-breadcrumb">
                      <li><a href="/"><i className="fa-solid fa-house-chimney"></i>Home</a></li>
                      <li><span>/</span> <EditableField path="breadcrumb.subtitle" fallback={breadcrumb.subtitle || "FAQ"} /></li>
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

      {/* FAQ Section */}
      <section className="tv-faq-section space bg-light">
        <div className="container">
          {/* Header */}
          <div className="title-wrap text-center three mb-40">
            <div className="sub-title-2 text-theme">
              <i className="fa-solid fa-circle-check"></i><EditableField path="header.badge" fallback={header.badge || "Got Questions?"} />
            </div>
            <h2 className="sec-title" style={{ fontSize: 'clamp(26px, 3.5vw, 40px)', lineHeight: 1.25 }}>
              <EditableField path="header.title" fallback={header.title || "Everything You Need to Know"} isHtml />
            </h2>
            <p className="text-secondary mx-auto" style={{ maxWidth: '640px', fontSize: '15px', lineHeight: 1.65 }}>
              <EditableField path="header.description" fallback={header.description || "Clear, transparent answers about our flooring materials, subfloor levelling, free in-home sample visits, and trade guarantees."} />
            </p>
          </div>

          {/* Category Filter Pills */}
          {categories.length > 2 && (
            <div className="d-flex flex-wrap justify-content-center gap-2 mb-40">
              {(categories as string[]).map((cat: string, idx: number) => (
                <button
                  key={idx}
                  className={`zk-cat-pill ${activeCategory === cat ? 'active' : ''}`}
                  onClick={() => setActiveCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}

          {/* FAQ Accordion List */}
          <div className="row justify-content-center">
            <div className="col-lg-9 col-md-11">
              <div className="zk-faq-list">
                {filteredFaqs.map((faq: any, index: number) => {
                  const isOpen = activeId === faq.id;
                  const itemIndex = faqs.findIndex((f: any) => f.id === faq.id);
                  const pathPrefix = itemIndex !== -1 ? `items.${itemIndex}` : `items.${index}`;

                  return (
                    <div key={faq.id || index} className={`zk-faq-card ${isOpen ? 'active' : ''}`}>
                      <button
                        className="zk-faq-btn"
                        onClick={() => toggleAccordion(faq.id)}
                        aria-expanded={isOpen}
                      >
                        <div className="d-flex align-items-center gap-3">
                          <span
                            style={{
                              fontSize: '13px',
                              fontWeight: 800,
                              color: isOpen ? '#AA771C' : '#8C867D',
                              letterSpacing: '0.5px',
                            }}
                          >
                            {String(index + 1).padStart(2, '0')}.
                          </span>
                          <span style={{ fontSize: '16px', lineHeight: 1.35 }}>
                            <EditableField path={`${pathPrefix}.question`} fallback={faq.question} />
                          </span>
                        </div>
                        <div className="zk-faq-icon">
                          <i className="fa-solid fa-chevron-down"></i>
                        </div>
                      </button>

                      {isOpen && (
                        <div className="zk-faq-body">
                          <p style={{ margin: 0 }}>
                            <EditableField path={`${pathPrefix}.answer`} fallback={faq.answer} />
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Direct Consultation / Free Quote Banner */}
              <div
                className="zk-faq-consult-box mt-4 p-4 d-flex flex-wrap align-items-center justify-content-between gap-3"
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
                      width: '48px',
                      height: '48px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #BF953F, #FCF6BA, #B38728)',
                      color: '#16120B',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '19px',
                      fontWeight: 700,
                      flexShrink: 0,
                    }}
                  >
                    <i className="fa-solid fa-phone"></i>
                  </div>
                  <div>
                    <span style={{ fontSize: '11px', color: '#FCF6BA', textTransform: 'uppercase', letterSpacing: '0.6px', display: 'block' }}>
                      <EditableField path="callout.subtitle" fallback={callout.subtitle || "Still Have A Specific Question?"} />
                    </span>
                    <a
                      href={`tel:${(callout.phone || "07903 723 774").replace(/\s+/g, '')}`}
                      style={{ fontSize: '18px', fontWeight: 800, color: '#FFFFFF', textDecoration: 'none' }}
                    >
                      <EditableField path="callout.phone" fallback={callout.phone || "07903 723 774"} />
                    </a>
                  </div>
                </div>

                <a
                  href={callout.cta_link || "/contact"}
                  className="theme-btn br-30"
                  style={{
                    background: 'linear-gradient(to right, #BF953F, #FCF6BA, #B38728, #FBF5B7, #AA771C)',
                    color: '#16120B',
                    fontWeight: 700,
                    fontSize: '14px',
                    padding: '12px 24px',
                    border: 'none',
                    borderRadius: '30px',
                    textDecoration: 'none',
                  }}
                >
                  <span className="link-effect">
                    <span className="effect-1"><EditableField path="callout.cta_text" fallback={callout.cta_text || "Ask Our Specialists"} /></span>
                    <span className="effect-1"><EditableField path="callout.cta_text" fallback={callout.cta_text || "Ask Our Specialists"} /></span>
                  </span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
    </EditModeProvider>
  );
}


