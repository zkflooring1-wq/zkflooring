import React from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Contact Us | ZK Flooring Birmingham",
  description: "Get in touch with ZK Flooring for free quotes, home surveys, and expert flooring advice in Birmingham and surrounding West Midlands areas.",
};

export default function ContactPage() {
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
                    <h2 className="title">Contact Us</h2>
                    <ul className="page-breadcrumb">
                      <li><a href="/"><i className="fa-solid fa-house-chimney"></i>Home</a></li>
                      <li><span>/</span> Contact Us</li>
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
          <div className="row gy-30">
            <div className="col-lg-5">
              <div className="contact-content-wrap">
                <div className="title-wrap">
                  <div className="sub-title-2 text-theme"><i className="fa-solid fa-circle-check"></i>Contact Us</div>
                  <h2 className="sec-title">Get in Touch with ZK Flooring Birmingham</h2>
                  <p>Ready for your new carpet or luxury flooring? Contact our expert fitters for a free estimate or home consultation.</p>
                </div>
                <div className="contact-info">
                  <div className="contact-item">
                    <div className="icon">
                      <i className="fa-sharp fa-regular fa-location-dot"></i>
                    </div>
                    <div className="info">
                      <h4 className="title">Our Address</h4>
                      <p>B10 9HH, Hobmoor Road, Small Heath, <br /> Birmingham, United Kingdom</p>
                    </div>
                  </div>
                  <div className="contact-item">
                    <div className="icon">
                      <i className="fa-light fa-circle-phone"></i>
                    </div>
                    <div className="info">
                      <h4 className="title">Call Us Anytime</h4>
                      <div className="content">
                        Phone: <a href="tel:07903723774">07903 723 774</a><br />
                        Mon - Sat: 8:00 AM - 6:30 PM
                      </div>
                    </div>
                  </div>
                  <div className="contact-item">
                    <div className="icon">
                      <i className="fa-light fa-envelope"></i>
                    </div>
                    <div className="info">
                      <h4 className="title">Send E-Mail</h4>
                      <div className="content">
                        <a href="mailto:example@gmail.com">example@gmail.com</a>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="social-links">
                  <a href="#">
                    <span className="link-effect">
                      <span className="effect-1">Facebook</span>
                      <span className="effect-1">Facebook</span>
                    </span>
                  </a>
                  <a href="#">
                    <span className="link-effect">
                      <span className="effect-1">Instagram</span>
                      <span className="effect-1">Instagram</span>
                    </span>
                  </a>
                </div>
              </div>
            </div>
            <div className="col-lg-7">
              <div className="contact-form">
                <h2 className="title mt--5 mb-35">Request a Free Survey & Quote</h2>
                <form id="contact_form" className="contact_form" action="#" method="post">
                  <div className="form-grid">
                    <div className="form-group">
                      <span className="icon"><i className="fa-slab-press fa-regular fa-user"></i></span>
                      <input type="text" id="fullName" name="name" placeholder="Your Name" required autoComplete="on" />
                    </div>
                    <div className="form-group">
                      <span className="icon"><i className="fa-regular fa-envelope"></i></span>
                      <input type="email" id="userEmail" name="email" placeholder="Email Address" required autoComplete="on" />
                    </div>
                  </div>
                  <div className="form-grid">
                    <div className="form-group">
                      <span className="icon"><i className="fa-solid fa-phone"></i></span>
                      <input type="text" id="phone" name="phone" placeholder="Phone No." required autoComplete="off" />
                    </div>
                    <div className="form-group">
                      <select className="custom-select" id="service" name="service" autoComplete="off" defaultValue="">
                        <option value="" disabled>Select Flooring Type</option>
                        <option value="carpet">Carpet & Underlay</option>
                        <option value="lvt">Luxury Vinyl Tile (LVT)</option>
                        <option value="hardwood">Real Wood / Engineered</option>
                        <option value="laminate">Laminate Flooring</option>
                        <option value="spc">SPC Rigid Core</option>
                        <option value="commercial">Commercial Flooring</option>
                        <option value="subfloor">Subfloor Preparation</option>
                      </select>
                    </div>
                  </div>
                  <div className="form-group">
                    <textarea id="msg" name="msg" placeholder="Write Message" required></textarea>
                  </div>
                  <div className="form-group terms">
                    <input type="checkbox" id="terms" required />
                    <label htmlFor="terms">I agree to all terms and conditions.</label>
                  </div>
                  <button type="submit" className="theme-btn mt-30" data-loading-text="Please wait...">
                    <span className="link-effect">
                      <span className="effect-1">Submit Now</span>
                      <span className="effect-1">Submit Now</span>
                    </span>
                    <span className="arrow-all">
                      <i>
                        <svg width="16" height="19" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M2 6H10M10 6L6 2M10 6L6 10" stroke="#D4AF37" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <svg width="16" height="19" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M2 6H10M10 6L6 2M10 6L6 10" stroke="#D4AF37" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </i>
                    </span>
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Map */}
      <div className="tv-contact-map">
        <div className="container-fluid p-0">
          <div className="row">
            <div className="map-box">
              <iframe className="map-canvas" src="https://maps.google.com/maps?q=Hobmoor%20Road%2C%20Small%20Heath%2C%20Birmingham%20B10%209HH&t=m&z=14&output=embed&iwloc=near" allowFullScreen loading="lazy" title="ZK Flooring Location"></iframe>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
