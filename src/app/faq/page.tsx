'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export default function FAQPage() {
  const [faqs, setFaqs] = useState<any[]>([]);
  const [activeId, setActiveId] = useState<number | null>(null);

  useEffect(() => {
    async function fetchFaqs() {
      const { data } = await supabase.from('faqs').select('*').order('id', { ascending: true });
      if (data) {
        setFaqs(data);
        if (data.length > 0) setActiveId(data[0].id);
      }
    }
    fetchFaqs();
  }, []);

  const toggleAccordion = (id: number) => {
    setActiveId(activeId === id ? null : id);
  };

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
                    <h2 className="title">Faq</h2>
                    <ul className="page-breadcrumb">
                      <li><a href="/"><i className="fa-solid fa-house-chimney"></i>Home</a></li>
                      <li><span>/</span> Faq</li>
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

      {/* Faq Section Two */}
      <section className="tv-faq-section style-2 space bg-light">
        <div className="shape-mockup sm-d-none" data-top="12%" data-left="13%"><img src="/assets/images/faq/circle-shape.webp" alt="shape" /></div>
        <div className="shape-mockup sm-d-none" data-top="12%" data-right="15%"><img src="/assets/images/faq/question-shape.webp" alt="shape" /></div>
        <div className="container">
          <div className="title-wrap text-center three">
            <div className="sub-title-2 text-theme"><i className="fa-solid fa-circle-check"></i>FAQ</div>
            <h2 className="sec-title">Frequently Asked Questions</h2>
            <p>Common questions about our flooring services, installation process, <br /> and what to expect when working with ZK Flooring.</p>
          </div>
          <div className="row justify-content-center">
            <div className="faq-column col-lg-8">
              <div className="inner-column mt-15 md-mt-0">
                <ul className="accordion-box">
                  {faqs.map((faq, index) => {
                    const isOpen = activeId === faq.id;
                    return (
                      <li key={faq.id} className={`accordion ${isOpen ? 'active-block' : ''}`}>
                        <div
                          className={`acc-btn bg-white ${isOpen ? 'active' : ''}`}
                          onClick={() => toggleAccordion(faq.id)}
                          style={{ cursor: 'pointer' }}
                        >
                          {String(index + 1).padStart(2, '0')}. {faq.question}
                          <div className="icon"></div>
                        </div>
                        <div className={`acc-content ${isOpen ? 'active' : ''}`} style={{ display: isOpen ? 'block' : 'none' }}>
                          <div className="content bg-white">
                            <div className="text">{faq.answer}</div>
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
