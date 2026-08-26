'use client';
import React from 'react';
import dynamic from 'next/dynamic';

const NewsletterLottie = dynamic(() => import('@/components/NewsletterLottie'));

export default function Newsletter() {
  return (
    <section className="newsletter-section mb--75">
        <div className="container">
            <div className="row">
                <div className="col-lg-12">
                    <div className="newsletter br-30" style={{ background: '#16120B', boxShadow: '0 14px 35px rgba(0, 0, 0, 0.35)' }}>
                        <div className="arrow-shape md-d-none"><img src="/assets/images/newsletter/arrow-shape.webp" alt="" /></div>
                        <div className="thumb d-none d-xl-block">
                            <NewsletterLottie />
                        </div>
                        <div className="image-text">
                            <img src="/assets/images/icons/check-circle2.png" alt="" />
                            <h3 className="title title-anim" data-animation="bounce-in">Subscribe Our Newsletter <br /> For Latest Updates</h3>
                        </div>
                        <form className="newsletter-form" action="https://formspree.io/f/mzbnjrnb" method="post">
                            <div className="form-group">
                                <input type="email" name="email" className="email" defaultValue="" placeholder="Email Address" autoComplete="on" required />
                                <button type="submit">
                                    <i className="far fa-paper-plane"></i>
                                    <span className="btn-title"></span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </section>
  );
}
