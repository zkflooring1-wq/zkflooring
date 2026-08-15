import React from 'react';
import type { Metadata } from 'next';
import NewsletterLottie from '@/components/NewsletterLottie';

export const metadata: Metadata = {
  title: "About Us | ZK Flooring Birmingham",
  description: "Learn about ZK Flooring, Birmingham's trusted specialists in premium carpet, hardwood, LVT, laminate, and commercial flooring installations with 15+ years of experience.",
};

export default function AboutPage() {
  return (
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
                    <h2 className="title">About Us</h2>
                    <ul className="page-breadcrumb">
                      <li><a href="/"><i className="fa-solid fa-house-chimney"></i>Home</a></li>
                      <li><span>/</span> About Us</li>
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
                    <img src="/assets/images/social/social-img01.webp" alt="Client 01" />
                    <img src="/assets/images/social/social-img02.webp" alt="Client 02" />
                    <img src="/assets/images/social/social-img03.webp" alt="Client 03" />
                    <h4>+3K</h4>
                  </div>
                  <div className="count-box mt-30"><span className="count-number odometer" data-count="3600">3,600</span></div>
                  <div className="rating-viewers">Satisfied Property Owners</div>
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
                <div className="logo mb-40"><img src="/assets/images/feature/hm1-icon01.webp" alt="Flooring Icon" /></div>
                <h2>Residential & Commercial <br />Flooring</h2>
                <p className="flex-grow-1">Expert supply and precision installation of luxury carpet, hardwood, LVT, and vinyl for homes and offices across Birmingham.</p>
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
                <div className="logo mb-40"><img src="/assets/images/feature/hm1-icon02.webp" alt="Subfloor Icon" /></div>
                <h2>Subfloor Preparation <br />& Self-Levelling</h2>
                <p className="flex-grow-1">Flawless subfloor levelling, latex screeding, and ply boarding ensuring perfectly smooth, durable surfaces.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section Three */}
      <section className="tv-about-section style-3 space bg-light">
        <div className="container">
          <div className="row gy-30 align-items-center">
            <div className="col-lg-4">
              <div className="about-left">
                <div className="about-thumb">
                  <img className="br-20" src="/assets/images/about/hm3-img01.webp" alt="ZK Flooring Craftsmanship" />
                </div>
                <div className="pt-50 pb-30 md-d-none">
                  <div className="border"></div>
                </div>
                <div className="counter">
                  <div className="about-counter">
                    <div className="count-box"><span className="count-number odometer" data-count="15">15</span></div>
                    <div className="text">
                      <span>+</span>
                      <p>Years of <br /> Experience</p>
                    </div>
                    <div className="scribble md-d-none"><img src="/assets/images/icons/scribble-2.webp" alt="" /></div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-5 col-md-6 col-sm-6">
              <div className="about-content-wrap">
                {/* Section Title */}
                <div className="title-wrap three">
                  <div className="sub-title-2 text-theme"><i className="fa-solid fa-circle-check"></i>Get to Know Us</div>
                  <h2 className="sec-title">Transforming Birmingham Properties with Precision Flooring Solutions</h2>
                  <p>ZK Flooring is Birmingham&apos;s trusted specialist for premium carpet, hardwood, LVT, laminate, and commercial vinyl installations. We deliver craftsmanship, reliability, and top-tier materials to every project across the West Midlands.</p>
                </div>
                {/* Skills */}
                <div className="skills">
                  <div className="skill-item">
                    <div className="skill-header">
                      <div className="skill-title">Carpet & Underlay Fitting</div>
                    </div>
                    <div className="skill-bar">
                      <div className="bar-inner">
                        <div className="bar progress-line" style={{ width: '98%' }}>
                          <div className="skill-percentage">
                            <div className="count-box"><span className="count-text">98</span>%</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="skill-item">
                    <div className="skill-header">
                      <div className="skill-title">Hardwood & LVT Installation</div>
                    </div>
                    <div className="skill-bar">
                      <div className="bar-inner">
                        <div className="bar progress-line" style={{ width: '95%' }}>
                          <div className="skill-percentage">
                            <div className="count-box"><span className="count-text">95</span>%</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <a href="/contact" className="theme-btn mt-40 br-30">
                  <span className="link-effect">
                    <span className="effect-1">Request Free Survey</span>
                    <span className="effect-1">Request Free Survey</span>
                  </span>
                  <span className="arrow-all">
                    <i>
                      <svg width="16" height="19" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M2 6H10M10 6L6 2M10 6L6 10" stroke="#1053f3" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      <svg width="16" height="19" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M2 6H10M10 6L6 2M10 6L6 10" stroke="#1053f3" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </i>
                  </span>
                </a>
              </div>
            </div>
            <div className="col-lg-3 col-md-6 col-sm-6 d-flex align-items-end">
              <div className="about-right ml-40 xs-ml-0">
                <div className="profile-card overlay-anim1 mt-40">
                  <img className="image overlay-anim1" src="/Our Team/1.jpg" alt="ZK Flooring Lead Fitter" />
                  <div className="profile-details">
                    <h5 className="name">ZK FLOORING</h5>
                    <p className="title">Master Flooring Installer</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section Two */}
      <section className="tv-team-section style-2 bg-light position-relative z-2">
        <div className="team-inner space overflow-hidden position-relative mx-30 xxl-mx-0">
          
          <div className="container">
            <div className="row gy-30">
              <div className="col-lg-4 col-md-6">
                <div className="team-content-wrap">
                  <div className="title-wrap">
                    <div className="sub-title-2 text-theme two"><i className="fa-solid fa-circle-check"></i>Our Fitters</div>
                    <h2 className="sec-title">Meet Our Expert Flooring Installation Team</h2>
                  </div>
                  <div className="team-social-wrapper">
                    <div className="client-social-proof">
                      <div className="social">
                        <img src="/assets/images/social/social-img02.webp" alt="Fitter 02" />
                        <img src="/assets/images/social/social-img03.webp" alt="Fitter 03" />
                        <h4>+3K</h4>
                      </div>
                      <h4 className="text">Trade-Certified <br />Installers</h4>
                      <div className="scribble-shape scribble md-d-none">
                        <img src="/assets/images/team/hm2-scribble.webp" alt="" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-8 col-md-12">
                <div className="row gy-30">
                  <div className="col-md-4">
                    <div className="tv-team-card style-2">
                      <div className="team-photo">
                        <img src="/Our Team/1.jpg" alt="Flooring Specialist" style={{ objectFit: 'cover', height: '350px', width: '100%' }} />
                      </div>
                      <div className="team-info">
                        <div className="info-inner">
                          <h3 className="team-name text-dark">Zeeshan</h3>
                          <p className="team-role text-dark">Master Fitter</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="tv-team-card style-2">
                      <div className="team-photo">
                        <img src="/Our Team/2.jpg" alt="Master Carpet Fitter" style={{ objectFit: 'cover', height: '350px', width: '100%' }} />
                      </div>
                      <div className="team-info">
                        <div className="info-inner">
                          <h3 className="team-name text-dark">Ali</h3>
                          <p className="team-role text-dark">Installation Expert</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="tv-team-card style-2">
                      <div className="team-photo">
                        <img src="/Our Team/3.jpg" alt="Flooring Technician" style={{ objectFit: 'cover', height: '350px', width: '100%' }} />
                      </div>
                      <div className="team-info">
                        <div className="info-inner">
                          <h3 className="team-name text-dark">Hassan</h3>
                          <p className="team-role text-dark">Subfloor Specialist</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Achievement Section */}
      <section className="space bg-light">
        <div className="container">
          <div className="row gy-30 align-items-center">
            <div className="col-lg-6">
              <div className="achivement-content-wrapper pe-lg-4">
                <div className="title-wrap three">
                  <div className="sub-title-2 text-theme mb-2"><i className="fa-solid fa-circle-check"></i>Our Track Record</div>
                  <h2 className="sec-title mb-4">Trusted by Homeowners <br />and Businesses Across <br />Birmingham & Beyond</h2>
                  <p className="mb-4 opacity-75">ZK Flooring has delivered premium carpet, LVT, hardwood, and commercial vinyl installations to over 3,600 satisfied property owners across the West Midlands.</p>
                </div>
                <div className="inner-contact d-flex align-items-center mt-4">
                  <div className="icon me-3 bg-theme rounded-circle d-flex align-items-center justify-content-center" style={{ width: '60px', height: '60px' }}>
                    <i className="fa-solid fa-phone text-dark fs-4"></i>
                  </div>
                  <div className="content">
                    <h6 className="call-text text-theme mb-1">Need Help?</h6>
                    <a className="call-phone text-dark fs-5 fw-bold text-decoration-none" href="tel:07903723774">07903 723 774</a>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="row gy-4">
                <div className="col-sm-6">
                  <div className="p-4 rounded-4" style={{ backgroundColor: '#1d1912', border: '1px solid #332d22' }}>
                    <h3 className="text-theme fw-bold mb-2 display-6"><span className="odometer" data-count="3600">3,600</span>+</h3>
                    <p className="text-white mb-0 fw-semibold">Projects Completed</p>
                  </div>
                </div>
                <div className="col-sm-6">
                  <div className="p-4 rounded-4" style={{ backgroundColor: '#1d1912', border: '1px solid #332d22' }}>
                    <h3 className="text-theme fw-bold mb-2 display-6"><span className="odometer" data-count="15">15</span>+</h3>
                    <p className="text-white mb-0 fw-semibold">Years of Experience</p>
                  </div>
                </div>
                <div className="col-sm-6">
                  <div className="p-4 rounded-4" style={{ backgroundColor: '#1d1912', border: '1px solid #332d22' }}>
                    <h3 className="text-theme fw-bold mb-2 display-6"><span className="odometer" data-count="98">98</span>%</h3>
                    <p className="text-white mb-0 fw-semibold">Customer Satisfaction</p>
                  </div>
                </div>
                <div className="col-sm-6">
                  <div className="p-4 rounded-4" style={{ backgroundColor: '#1d1912', border: '1px solid #332d22' }}>
                    <h3 className="text-theme fw-bold mb-2 display-6"><span className="odometer" data-count="6">6</span>+</h3>
                    <p className="text-white mb-0 fw-semibold">Flooring Categories</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
