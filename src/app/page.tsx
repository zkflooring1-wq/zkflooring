import React from 'react';
import { supabase } from '@/lib/supabase';
import { getSetting, HeaderContact } from '@/lib/settings';
import HeroSlider from '@/components/HeroSlider';

export default async function HomePage() {
  const { data: pageData } = await supabase
    .from('pages')
    .select('sections')
    .eq('slug', '/')
    .single();

  const sections = pageData?.sections || {};
  const hero = sections.hero || {};
  const defaultSliderImages = [
    {
      title: "Luxury & Comfort <br /><span>Carpet Fitting</span>",
      bg_image: "/slider/Carpet.webp",
      cta_link: "/services",
      cta_text: "Explore Carpets",
      sub_title: "ZK FLOORING SERVICES",
      video_url: "https://www.youtube.com/watch?v=SMKPKGW083c",
      description: "Transform your home with soft, durable, and expertly fitted carpets across Birmingham & surrounding regions."
    },
    {
      title: "Durable & Stylish <br /><span>Laminate Flooring</span>",
      bg_image: "/slider/Laminate Flooring.webp",
      cta_link: "/services",
      cta_text: "View Laminates",
      sub_title: "EXPERT INSTALLATION",
      video_url: "https://www.youtube.com/watch?v=SMKPKGW083c",
      description: "High-quality laminate flooring options designed for elegance, easy maintenance, and long-lasting performance."
    },
    {
      title: "Sleek LVT & <br /><span>Vinyl Tiles</span>",
      bg_image: "/slider/Vinyl Tile.webp",
      cta_link: "/services",
      cta_text: "Discover LVT",
      sub_title: "PREMIUM DESIGN",
      video_url: "https://www.youtube.com/watch?v=SMKPKGW083c",
      description: "Luxury Vinyl Tiles (LVT) with waterproof durability and stunning modern aesthetic finishes for any space."
    },
    {
      title: "Versatile Sheet <br /><span>Vinyl Flooring</span>",
      bg_image: "/slider/Vinyl flooring.webp",
      cta_link: "/contact",
      cta_text: "Get a Free Quote",
      sub_title: "COMMERCIAL & DOMESTIC",
      video_url: "https://www.youtube.com/watch?v=SMKPKGW083c",
      description: "Seamless, easy-to-clean vinyl flooring solutions ideal for kitchens, bathrooms, offices, and heavy traffic areas."
    },
    {
      title: "Heavy Duty <br /><span>Carpet Tile Solutions</span>",
      bg_image: "/slider/Carpet Tile.webp",
      cta_link: "/contact",
      cta_text: "Contact Us",
      sub_title: "COMMERCIAL CONTRACTING",
      video_url: "https://www.youtube.com/watch?v=SMKPKGW083c",
      description: "Modular, high-durability carpet tiles engineered for offices, retail stores, and commercial establishments."
    }
  ];

  const heroSlides = defaultSliderImages;

  const features = sections.features || {
    social_proof_count: "3,600",
    social_proof_label: "active customers",
    social_proof_images: [
      "/assets/images/social/social-img01.webp",
      "/assets/images/social/social-img02.webp",
      "/assets/images/social/social-img03.webp"
    ]
  };

  const about = sections.about || {
    title: "Transforming Spaces with <br /> Precision and Quality Craftsmanship",
    cta_link: "/about",
    cta_text: "Explore More",
    main_image: "/assets/images/about/hm1-img01.webp",
    side_image: "/assets/images/about/hm1-img03.webp",
    since_text: "Since 2007",
    description: "ZK Flooring is Birmingham's trusted contractor for carpets, laminate, engineered wood, vinyl, and subfloor preparation. We service a 100-200 mile radius from Hobmoor Road, Small Heath."
  };

  const contactCallback = sections.contact_callback || {
    title: "Connect with us for next <br />Gen Flooring Projects",
    sub_title: "Get in Touch",
    card_label: "Call us anytime",
    card_phone: "07903723774",
    card_phone_link: "tel:07903723774"
  };

  const contactInfo = await getSetting<HeaderContact>('header_contact');
  const globalPhone = contactInfo?.phone || "07903723774";
  const globalPhoneLink = contactInfo?.phone_link || "tel:07903723774";

  return (
    <main>

        {/* Hero Section */}
        <HeroSlider slides={heroSlides} />

        {/* Feature Section */}
        <section className="tv-feature-section bg-light space">
          <div className="container">
            <div className="row gy-30">
              <div className="col-lg-4 col-md-6 col-sm-6">
                <div className="tv-feature-item wow fadeInLeft" data-wow-delay=".5s">
                  <div className="client-social-proof">
                    <div className="social">
                      {features.social_proof_images?.map((img: string, i: number) => (
                        <img key={i} src={img} alt={`Client ${i + 1}`} />
                      )) || (
                        <>
                          <img src="/assets/images/social/social-img01.webp" alt="Client 01" />
                          <img src="/assets/images/social/social-img02.webp" alt="Client 02" />
                          <img src="/assets/images/social/social-img03.webp" alt="Client 03" />
                        </>
                      )}
                      <h4>+3K</h4>
                    </div>
                    <div className="count-box mt-30">
                      <span className="count-number odometer" data-count={features.social_proof_count || "3,600"}>0</span>
                    </div>
                    <div className="rating-viewers">{features.social_proof_label || "active customers"}</div>
                    <a href="/about" className="theme-btn style2 mt-20 br-30">
                      <span className="link-effect">
                        <span className="effect-1">Explore More</span>
                        <span className="effect-1">Explore More</span>
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
                      <img src="/assets/images/feature/scribble.webp" alt="scribble" />
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-4 col-md-6 col-sm-6">
                <div className="tv-feature-box wow fadeInLeft" data-wow-delay=".7s">
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
                    <img src="/assets/images/feature/hm1-icon01.webp" alt="icon" />
                  </div>
                  <h2>Premium Carpet <br />Fitting</h2>
                  <p>Professional fitting services with a wide selection of luxurious carpets for every room.</p>
                </div>
              </div>
              <div className="col-lg-4 col-md-6 col-sm-6">
                <div className="tv-feature-box bg-theme3 wow fadeInLeft" data-wow-delay=".9s">
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
                    <img src="/assets/images/feature/hm1-icon02.webp" alt="icon" />
                  </div>
                  <h2>Hardwood & LVT <br />Installations</h2>
                  <p>Durable and stylish Luxury Vinyl Tiles (LVT) and hardwood options fitted to perfection.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="tv-service-section bg-light position-relative overflow-hidden">
            <div className="p-top-center z-1 wow slideInTop">
                <img src="assets/images/service/hm1-shape-01.webp" alt="" />
            </div>
            <div className="tv-service-inner space bg-theme3 mx-30 ml-mx-0 overflow-hidden">
                <div className="container">
                    
                    <div className="row">
                        <div className="col-lg-12 text-center">
                            <div className="title-wrap two white" data-wow-duration="2s" data-wow-delay=".0s">
                                <div className="sub-title-2 text-white two"><i className="fa-solid fa-circle-check"></i>Services</div>
                                <h2 className="sec-title">Empowering Companies with Reliable <br />and Scalable IT Services</h2>
                            </div>
                        </div>
                    </div>

                    <div className="row gy-30">
                        <div className="col-lg-12">
                            <div className="tv-service-item-inner">
                                <div className="service-item-wrap service-item-pin">
                                    <div className="tv-service-item">
                                        <div className="service-number">01.</div>
                                        <div className="service-left">
                                            <div className="video-btn">
                                                <a className="popup-video" href="https://www.youtube.com/watch?v=SMKPKGW083c" data-fancybox="video-gallery">
                                                    <i className="fa-sharp fa-solid fa-play"></i>
                                                </a>
                                            </div>
                                            <div className="overlay-anim4 overflow-hidden">
                                                <img src="assets/images/service/hm1-img01.webp" alt="Team working" />
                                            </div>
                                        </div>
                                        <div className="service-right">
                                            <h6>CODING</h6>
                                            <h2>Android and IOS Apps <br /> Designing</h2>
                                            <p> Credibly pontificate turnkey processes marketplace transition <br /> competitive testing procedures technology done...
                                            </p>
                                            <a href="service-details.html" className="learn-more">Learn More <i className="fa-solid fa-arrow-up-right"></i></a>

                                            <div className="border my-40"></div>
                                            <div className="tags">
                                                <span>Wordpress</span>
                                                <span>Shopify</span>
                                                <span>Webflow</span>
                                                <span>Framer</span>
                                                <span>Hosting</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="service-item-wrap service-item-pin">
                                    <div className="tv-service-item">
                                    <div className="service-number">02.</div>
                                    <div className="service-left">
                                        <div className="video-btn">
                                            <a className="popup-video" href="https://www.youtube.com/watch?v=SMKPKGW083c" data-fancybox="video-gallery">
                                                <i className="fa-sharp fa-solid fa-play"></i>
                                            </a>
                                        </div>
                                        <div className="overlay-anim4 overflow-hidden">
                                            <img src="assets/images/service/hm1-img02.webp" alt="Team working" />
                                        </div>
                                    </div>
                                    <div className="service-right">
                                        <h6>CODING</h6>
                                        <h2>Digital Transformation <br />and Automation</h2>
                                        <p> Credibly pontificate turnkey processes marketplace transition <br /> competitive testing procedures technology done...
                                        </p>
                                        <a href="service-details.html" className="learn-more">Learn More <i className="fa-solid fa-arrow-up-right"></i></a>

                                        <div className="border my-40"></div>
                                        <div className="tags">
                                            <span>Wordpress</span>
                                            <span>Shopify</span>
                                            <span>Webflow</span>
                                            <span>Framer</span>
                                            <span>Hosting</span>
                                        </div>
                                    </div>
                                    </div>                                
                                </div>
                                <div className="service-item-wrap">
                                    <div className="tv-service-item">
                                        <div className="service-number">03.</div>
                                        <div className="service-left">
                                            <div className="video-btn">
                                                <a className="popup-video" href="https://www.youtube.com/watch?v=SMKPKGW083c" data-fancybox="video-gallery">
                                                    <i className="fa-sharp fa-solid fa-play"></i>
                                                </a>
                                            </div>
                                            <div className="overlay-anim4 overflow-hidden">
                                                <img src="assets/images/service/hm1-img03.webp" alt="Team working" />
                                            </div>
                                        </div>
                                        <div className="service-right">
                                            <h6>DRSIGNING</h6>
                                            <h2>Web and Mobile UI/UX <br />Designing</h2>
                                            <p> Credibly pontificate turnkey processes marketplace transition <br /> competitive testing procedures technology done...
                                            </p>
                                            <a href="service-details.html" className="learn-more">Learn More <i className="fa-solid fa-arrow-up-right"></i></a>

                                            <div className="border my-40"></div>
                                            <div className="tags">
                                                <span>Wordpress</span>
                                                <span>Shopify</span>
                                                <span>Webflow</span>
                                                <span>Framer</span>
                                                <span>Hosting</span>
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





        





        
        <div className="tv-marquee-section bg-light position-relative">
            <div className="tv-marquee-inner mx-30 ml-mx-0 position-relative">
                <div className="container-fluid p-0 overflow-hidden">
                    <div className="slider__marquee clearfix marquee-wrap">
                        <ul className="marquee_mode marquee__group">
                            <li className="item m-item"><img className="icon" src="assets/images/icons/marquee-icon.png" alt="" /> Digital Marketing</li>
                            <li className="item m-item"><img className="icon" src="assets/images/icons/marquee-icon.png" alt="" /> Branding Solutions</li>
                            <li className="item m-item"><img className="icon" src="assets/images/icons/marquee-icon.png" alt="" /> Custom Website</li>
                            <li className="item m-item"><img className="icon" src="assets/images/icons/marquee-icon.png" alt="" /> Innovation Design</li>
                            <li className="item m-item"><img className="icon" src="assets/images/icons/marquee-icon.png" alt="" /> Cyber Security</li>
                        </ul>
                    </div>
                 </div>
            </div>
        </div>




        
        <section className="tv-process-section bg-light position-relative">
            <div className="p-top-center z-1 wow slideInTop">
                <img src="assets/images/process/hm1-shape01.png" alt="" />
            </div>
            <div className="process-inner bg-theme3 mx-30 ml-mx-0 space  overflow-hidden xxl-br-0 position-relative">
                <div className="container position-relative">
                    
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="process-title mt--25">
                                <h2 className="text-white text-center">PR<span className="text-theme">O</span>CESS</h2>
                            </div>
                        </div>
                    </div>
                    <div className="row gy-30">
                        <div className="col-xl-3 col-lg-4 col-md-6 col-sm-6">
                            <div className="tv-process-item wow fadeInRightBig" data-wow-delay=".2s">
                                <h4 className="title-text">STEP 01</h4>
                                <div className="process-box">
                                    <div className="icon"><img src="assets/images/process/hm1-icon1.webp" alt="" /></div>
                                    <h3 className="title">Consult Understand</h3>
                                    <p>Technically sound chains to main and paid marketplace</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-xl-3 col-lg-4 col-md-6 col-sm-6">
                            <div className="tv-process-item wow fadeInRightBig" data-wow-delay=".3s">
                                <h4 className="title-text">STEP 02</h4>
                                <div className="process-box">
                                    <div className="icon"><img src="assets/images/process/hm1-icon2.webp" alt="" /></div>
                                    <h3 className="title">Plan Strategize</h3>
                                    <p>Technically sound chains to main and paid marketplace</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-xl-3 col-lg-4 col-md-6 col-sm-6">
                            <div className="tv-process-item  wow fadeInRightBig" data-wow-delay=".4s">
                                <h4 className="title-text">STEP 03</h4>
                                <div className="process-box">
                                    <div className="icon"><img src="assets/images/process/hm1-icon3.webp" alt="" /></div>
                                    <h3 className="title">Implement Execute</h3>
                                    <p>Technically sound chains to main and paid marketplace</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-xl-3 col-lg-4 col-md-6 col-sm-6">
                            <div className="tv-process-item wow fadeInRightBig" data-wow-delay=".5s">
                                <h4 className="title-text">STEP 04</h4>
                                <div className="process-box">
                                    <div className="icon"><img src="assets/images/process/hm1-icon4.webp" alt="" /></div>
                                    <h3 className="title">Support Optimize</h3>
                                    <p>Technically sound chains to main and paid marketplace</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>






        
        <section className="tv-team-section bg-light space">
            <div className="container">
                
                <div className="title-wrap three text-center">
                    <div className="sub-title-2 text-theme"><i className="fa-solid fa-circle-check"></i>Our Team</div>
                    <h2 className="sec-title">Meet the Expert Team Powering Our <br />Goals and Ambitions</h2>
                </div>
                <div className="row gy-30">
                    <div className="col-xl-4 col-lg-6 col-md-6 col-sm-6">
                        <div className="tv-team-card wow fadeInUp" data-wow-delay=".2s">
                            <div className="team-photo">
                                <img src="/assets/images/team/hm1-img01.webp" alt="Jobaer Khanom" />
                                <div className="team-social">
                                    <a href="#"><i className="fa-brands fa-facebook-f"></i></a>
                                    <a href="#"><i className="fa-brands fa-x-twitter"></i></a>
                                    <a href="#"><i className="fa-brands fa-linkedin-in"></i></a>
                                </div>
                            </div>
                            <div className="team-info">
                                <div className="info-inner">
                                    <h3 className="team-name"><a href="#">Jobaer Khanom</a></h3>
                                    <p className="team-role">UI/UX Designer</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-xl-4 col-lg-6 col-md-6 col-sm-6">
                        <div className="tv-team-card wow fadeInUp" data-wow-delay=".4s">
                            <div className="team-photo">
                            <img src="/assets/images/team/hm1-img02.webp" alt="Sayma D. Farna" />
                            <div className="team-social">
                                <a href="#"><i className="fa-brands fa-facebook-f"></i></a>
                                <a href="#"><i className="fa-brands fa-x-twitter"></i></a>
                                <a href="#"><i className="fa-brands fa-linkedin-in"></i></a>
                            </div>
                            </div>
                            <div className="team-info">
                                <div className="info-inner">
                                    <h3 className="team-name"><a href="#">Sayma D. Farna</a></h3>
                                    <p className="team-role">App Developer</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-xl-4 col-lg-6 col-md-6 col-sm-6">
                        <div className="tv-team-card wow fadeInUp" data-wow-delay=".6s">
                            <div className="team-photo">
                            <img src="/assets/images/team/hm1-img03.webp" alt="Jubin E. Nawtail" />
                            <div className="team-social">
                                <a href="#"><i className="fa-brands fa-facebook-f"></i></a>
                                <a href="#"><i className="fa-brands fa-x-twitter"></i></a>
                                <a href="#"><i className="fa-brands fa-linkedin-in"></i></a>
                            </div>
                            </div>
                            <div className="team-info">
                                <div className="info-inner">
                                    <h3 className="team-name"><a href="#">Jubin E. Nawtail</a></h3>
                                    <p className="team-role">SEO Marketer</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>





        
        <section className="tv-testimonial-section bg-light overflow-hidden">
            <div className="tv-testi-inner br-30 ml-br-0 space position-relative mx-30 xxl-mx-0 overflow-hidden">
                <div className="bg image"><img src="/assets/images/testimonial/hm1-bg01.webp" alt="" /></div>
                    <div className="container">
                        
                        <div className="row">
                            <div className="col-lg-12">
                                <div className="testimonial-content-wrap d-flex justify-content-between sm-flex-column">
                                    <div className="title-wrap two white">
                                        <div className="sub-title-2 two text-white"><i className="fa-solid fa-circle-check"></i>Testimonial</div>
                                        <h2 className="sec-title">Helping Business in 3,000+ <br /> Different Industries</h2>
                                    </div>
                                    <div className="testimonial-btn-wrapper">
                                        <div className="scribble-shape scribble md-d-none">
                                            <img src="/assets/images/testimonial/scribble01.webp" alt="" />
                                        </div>
                                        <div className="client-social-proof">
                                            <div className="social">
                                                <img src="/assets/images/social/social-img02.webp" alt="Client 02" />
                                                <img src="/assets/images/social/social-img03.webp" alt="Client 03" />
                                                <h4>+3K</h4>
                                            </div>
                                            <h4 className="text">Trusted Clients <br /> Worldwide</h4>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        
                        <div className="tv-brands-section  position-relative z-1">
                            <div className="container">
                                <div className="row">
                                    <div className="col-lg-12">
                                        <div className="sponsors-outer  brand-outher">
                                            <div className="trusted-partners d-flex align-items-center">
                                            </div>
                                            <div className="border"></div>
                                            <div className="brands-slider-two swiper py-45">
                                                <div className="swiper-wrapper">
                                                    <div className="swiper-slide">
                                                        <div className="brand-item">
                                                            <a className="image" href="#">
                                                                <img src="/assets/images/brands/01.webp" alt="Brand 01" />
                                                                <img src="/assets/images/brands/01.webp" alt="Brand 01" />
                                                            </a>
                                                        </div>
                                                    </div>
                                                    <div className="swiper-slide">
                                                        <div className="brand-item">
                                                            <a className="image" href="#">
                                                                <img src="/assets/images/brands/02.webp" alt="Brand 02" />
                                                                <img src="/assets/images/brands/02.webp" alt="Brand 02" />
                                                            </a>
                                                        </div>
                                                    </div>
                                                    <div className="swiper-slide">
                                                        <div className="brand-item">
                                                            <a className="image" href="#">
                                                                <img src="/assets/images/brands/03.webp" alt="Brand  03" />
                                                                <img src="/assets/images/brands/03.webp" alt="Brand  03" />
                                                            </a>
                                                        </div>
                                                    </div>
                                                    <div className="swiper-slide">
                                                        <div className="brand-item">
                                                            <a className="image" href="#">
                                                                <img src="/assets/images/brands/04.webp" alt="Brand 04" />
                                                                <img src="/assets/images/brands/04.webp" alt="Brand 04" />
                                                            </a>
                                                        </div>
                                                    </div>
                                                    <div className="swiper-slide">
                                                        <div className="brand-item">
                                                            <a className="image" href="#">
                                                                <img src="/assets/images/brands/05.webp" alt="Brand 05" />
                                                                <img src="/assets/images/brands/05.webp" alt="Brand 05" />
                                                            </a>
                                                        </div>
                                                    </div>
                                                    <div className="swiper-slide">
                                                        <div className="brand-item">
                                                            <a className="image" href="#">
                                                                <img src="/assets/images/brands/06.webp" alt="Brand 06" />
                                                                <img src="/assets/images/brands/06.webp" alt="Brand 06" />
                                                            </a>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="border mb-60"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        
                        <div className="row">
                            <div className="col-lg-12">
                                <div className="testi-slider swiper">
                                    <div className="swiper-wrapper">
                                        <div className="swiper-slide">
                                            <div className="tv-testi-card wow fadeInUp" data-wow-delay=".5s">
                                                <div className="testi-top">
                                                    <div className="image position-relative z-1">
                                                        <img src="/assets/images/testimonial/hm1-testi01.webp" alt="User" />
                                                        <span className="quote-icon"><i className="fa-solid fa-quote-left"></i></span>
                                                    </div>
                                                    <div className="testi-info">
                                                        <h4>Jubin Nawtail</h4>
                                                        <p>App Developer</p>
                                                    </div>
                                                </div>
                                                <div className="testi-content">
                                                    <div className="stars">
                                                        <i className="fas fa-star"></i>
                                                        <i className="fas fa-star"></i>
                                                        <i className="fas fa-star"></i>
                                                        <i className="fas fa-star"></i>
                                                        <i className="fas fa-star"></i>
                                                        <span>(4.8)</span>
                                                    </div>
                                                    <p>“Technically sound chains to main business and paids marketplace technology that’s targeted audience done”</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="swiper-slide">
                                            <div className="tv-testi-card wow fadeInUp" data-wow-delay=".7s">
                                                <div className="testi-top">
                                                    <div className="image position-relative z-1">
                                                        <img src="/assets/images/testimonial/hm1-testi02.webp" alt="User" />
                                                        <span className="quote-icon"><i className="fa-solid fa-quote-left"></i></span>
                                                    </div>
                                                    <div className="testi-info">
                                                        <h4>Apel Mahmud</h4>
                                                        <p>SEO Marketer</p>
                                                    </div>
                                                </div>
                                                <div className="testi-content">
                                                    <div className="stars">
                                                        <i className="fas fa-star"></i>
                                                        <i className="fas fa-star"></i>
                                                        <i className="fas fa-star"></i>
                                                        <i className="fas fa-star"></i>
                                                        <i className="fas fa-star"></i>
                                                        <span>(4.8)</span>
                                                    </div>
                                                    <p>“Technically sound chains to main business and paids marketplace technology that’s targeted audience done”</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="swiper-slide">
                                            <div className="tv-testi-card wow fadeInUp" data-wow-delay=".9s">
                                                <div className="testi-top">
                                                    <div className="image position-relative z-1">
                                                        <img src="/assets/images/testimonial/hm1-testi03.webp" alt="User" />
                                                        <span className="quote-icon"><i className="fa-solid fa-quote-left"></i></span>
                                                    </div>
                                                    <div className="testi-info">
                                                        <h4>John D. Alexon</h4>
                                                        <p>UI/UX Designer</p>
                                                    </div>
                                                </div>
                                                <div className="testi-content">
                                                    <div className="stars">
                                                        <i className="fas fa-star"></i>
                                                        <i className="fas fa-star"></i>
                                                        <i className="fas fa-star"></i>
                                                        <i className="fas fa-star"></i>
                                                        <i className="fas fa-star"></i>
                                                        <span>(4.8)</span>
                                                    </div>
                                                    <p>“Technically sound chains to main business and paids marketplace technology that’s targeted audience done”</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="swiper-slide">
                                            <div className="tv-testi-card wow fadeInUp" data-wow-delay=".5s">
                                                <div className="testi-top">
                                                    <div className="image position-relative z-1">
                                                        <img src="/assets/images/testimonial/hm1-testi01.webp" alt="User" />
                                                        <span className="quote-icon"><i className="fa-solid fa-quote-left"></i></span>
                                                    </div>
                                                    <div className="testi-info">
                                                        <h4>Jubin Nawtail</h4>
                                                        <p>App Developer</p>
                                                    </div>
                                                </div>
                                                <div className="testi-content">
                                                    <div className="stars">
                                                        <i className="fas fa-star"></i>
                                                        <i className="fas fa-star"></i>
                                                        <i className="fas fa-star"></i>
                                                        <i className="fas fa-star"></i>
                                                        <i className="fas fa-star"></i>
                                                        <span>(4.8)</span>
                                                    </div>
                                                    <p>“Technically sound chains to main business and paids marketplace technology that’s targeted audience done”</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="swiper-slide">
                                            <div className="tv-testi-card wow fadeInUp" data-wow-delay=".7s">
                                                <div className="testi-top">
                                                    <div className="image position-relative z-1">
                                                        <img src="/assets/images/testimonial/hm1-testi02.webp" alt="User" />
                                                        <span className="quote-icon"><i className="fa-solid fa-quote-left"></i></span>
                                                    </div>
                                                    <div className="testi-info">
                                                        <h4>Apel Mahmud</h4>
                                                        <p>SEO Marketer</p>
                                                    </div>
                                                </div>
                                                <div className="testi-content">
                                                    <div className="stars">
                                                        <i className="fas fa-star"></i>
                                                        <i className="fas fa-star"></i>
                                                        <i className="fas fa-star"></i>
                                                        <i className="fas fa-star"></i>
                                                        <i className="fas fa-star"></i>
                                                        <span>(4.8)</span>
                                                    </div>
                                                    <p>“Technically sound chains to main business and paids marketplace technology that’s targeted audience done”</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="swiper-slide">
                                            <div className="tv-testi-card wow fadeInUp" data-wow-delay=".9s">
                                                <div className="testi-top">
                                                    <div className="image position-relative z-1">
                                                        <img src="/assets/images/testimonial/hm1-testi03.webp" alt="User" />
                                                        <span className="quote-icon"><i className="fa-solid fa-quote-left"></i></span>
                                                    </div>
                                                    <div className="testi-info">
                                                        <h4>John D. Alexon</h4>
                                                        <p>UI/UX Designer</p>
                                                    </div>
                                                </div>
                                                <div className="testi-content">
                                                    <div className="stars">
                                                        <i className="fas fa-star"></i>
                                                        <i className="fas fa-star"></i>
                                                        <i className="fas fa-star"></i>
                                                        <i className="fas fa-star"></i>
                                                        <i className="fas fa-star"></i>
                                                        <span>(4.8)</span>
                                                    </div>
                                                    <p>“Technically sound chains to main business and paids marketplace technology that’s targeted audience done”</p>
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

        <section className="tv-pricing-section space bg-light">
            <div className="shape-mockup z-1 spin d-none d-xxl-block" data-left="15%" data-bottom="69%"><img src="/assets/images/pricing/eart.webp" alt="..." /></div>
            <div className="shape-mockup z-1 spin2 d-none d-xxl-block" data-right="15%" data-bottom="69%"><img src="/assets/images/pricing/spin-shape.webp" alt="..." /></div>

            <div className="container">
                <div className="row">
                    <div className="col-lg-12">
                        <div className="title-wrap text-center three">
                            <div className="sub-title-2  text-theme"><i className="fa-solid fa-circle-check"></i>Pricing Plans</div>
                            <h2 className="sec-title">Choose the Perfect Plans for <br /> Your Business Growth</h2>
                        </div>
                    </div>
                </div>
                <div className="row gy-30 align-items-end">
                    <div className="col-lg-4 col-md-6 col-sm-6">
                        <div className="tv-pricing-card wow fadeInUp" data-wow-delay=".5s">
                            <div className="pricing-inner-box">
                                <div className="pricing-inner">
                                    <div className="pricing-plan">
                                        <h5 className="plan">Starter</h5>
                                        <div className="price">
                                            <h2>29 USD</h2>
                                            <span className="billing-cycle">/ month</span>
                                        </div>
                                        <p>Organize Daily Task by free</p>
                                        <a href="pricing.html" className="theme-btn mt-25 w-100 br-25">
                                            <span className="link-effect">
                                                <span className="effect-1">Join this Plan</span>
                                                <span className="effect-1">Join this Plan</span>
                                            </span>
                                            <span className="arrow1"><i className="fa-solid fa-arrow-right"></i></span>
                                        </a>
                                        <h4>Key Features</h4>
                                    </div>
                                        <ul className="features">
                                            <li><span className="checkmark"><i className="fa-solid fa-circle-check"></i></span> 3 Users availble</li>
                                            <li><span className="checkmark"><i className="fa-solid fa-circle-check"></i></span> Limited tools</li>
                                            <li><span className="checkmark"><i className="fa-solid fa-circle-check"></i></span> Unlimited Supports</li>
                                            <li className="disabled"><span className="checkmark"><i className="fa-solid fa-circle-x"></i></span> API Access</li>
                                            <li className="disabled"><span className="checkmark"><i className="fa-solid fa-circle-x"></i></span> Premium apps</li>
                                        </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-4 col-md-6 col-sm-6">
                        <div className="tv-pricing-card style2 wow fadeInUp" data-wow-delay=".7s">
                            <div className="popular-badge"><i className="fa-solid fa-fire"></i> Most Popular</div>
                            <div className="pricing-inner-box">
                                <div className="top-icon spin"><img src="/assets/images/pricing/spin-shape02.webp" alt="" /></div>
                                <div className="pricing-inner">
                                    <div className="pricing-plan">
                                        <h5 className="plan">Starter</h5>
                                        <div className="price">
                                            <h2>39 USD</h2>
                                            <span className="billing-cycle">/ month</span>
                                        </div>
                                        <p>Organize Daily Task by free</p>
                                        <a href="pricing.html" className="theme-btn mt-25 w-100 br-25">
                                            <span className="link-effect">
                                                <span className="effect-1">Join this Plan</span>
                                                <span className="effect-1">Join this Plan</span>
                                            </span>
                                            <span className="arrow1"><i className="fa-solid fa-arrow-right"></i></span>
                                        </a>
                                        <h4>Key Features</h4>
                                    </div>
                                        <ul className="features">
                                            <li><span className="checkmark"><i className="fa-solid fa-circle-check"></i></span> 3 Users availble</li>
                                            <li><span className="checkmark"><i className="fa-solid fa-circle-check"></i></span> Limited tools</li>
                                            <li><span className="checkmark"><i className="fa-solid fa-circle-check"></i></span> Unlimited Supports</li>
                                            <li><span className="checkmark"><i className="fa-solid fa-circle-check"></i></span> API Access</li>
                                            <li className="disabled"><span className="checkmark"><i className="fa-solid fa-circle-x"></i></span> Premium apps</li>
                                        </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-4 col-md-6 col-sm-6">
                        <div className="tv-pricing-card wow fadeInUp" data-wow-delay=".9s">
                            <div className="pricing-inner-box">
                                <div className="pricing-inner">
                                    <div className="pricing-plan">
                                        <h5 className="plan">Business</h5>
                                        <div className="price">
                                            <h2>39 USD</h2>
                                            <span className="billing-cycle">/ month</span>
                                        </div>
                                        <p>Organize Daily Task by free</p>
                                        <a href="pricing.html" className="theme-btn mt-25 w-100 br-25">
                                            <span className="link-effect">
                                                <span className="effect-1">Join this Plan</span>
                                                <span className="effect-1">Join this Plan</span>
                                            </span>
                                            <span className="arrow1"><i className="fa-solid fa-arrow-right"></i></span>
                                        </a>
                                        <h4>Key Features</h4>
                                    </div>
                                        <ul className="features">
                                            <li><span className="checkmark"><i className="fa-solid fa-circle-check"></i></span> 3 Users availble</li>
                                            <li><span className="checkmark"><i className="fa-solid fa-circle-check"></i></span> Limited tools</li>
                                            <li><span className="checkmark"><i className="fa-solid fa-circle-check"></i></span> Unlimited Supports</li>
                                            <li><span className="checkmark"><i className="fa-solid fa-circle-check"></i></span> API Access</li>
                                            <li><span className="checkmark"><i className="fa-solid fa-circle-check"></i></span> Premium apps</li>
                                        </ul>
                                    </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <div className="tv-counter-section style-2 bg-light position-relative z-1">
            <div className="counter-inner lg-br-0 py-65 lg-py-40 position-relative mx-30 xxl-mx-0 overflow-hidden">
                <div className="bg image"><img src="/assets/images/counter/hm1-bg01.webp" alt="" /></div>
                <div className="overlay bg-theme mbm-overlay"></div>
                <div className="container">
                    <div className="row gy-30">
                        <div className="col-lg-4 col-md-6">
                            <div className="counter-box">
                                <div className="icon"><img src="/assets/images/counter/hm1-icon01.webp" alt="Icon" /></div>
                                <div className="content">
                                    <h4 className="title mb-0"><span className="count-number odometer" data-count="100">0</span>K+</h4>
                                    <h6 className="text mb-0">Successful Projects</h6>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-4 col-md-6">
                            <div className="counter-box justify-content-center ustify-content-md-center">
                                <div className="icon"><img src="/assets/images/counter/hm1-icon02.webp" alt="Icon" /></div>
                                <div className="content">
                                    <h4 className="title mb-0"><span className="count-number odometer" data-count="270">0</span>+</h4>
                                    <h6 className="text mb-0">All Awards Winning</h6>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-4 col-md-6">
                            <div className="counter-box align-items-start align-items-lg-end">
                                <div className="icon"><img src="/assets/images/counter/hm1-icon03.webp" alt="Icon" /></div>
                                <div className="content">
                                    <h4 className="title mb-0"><span className="count-number odometer" data-count="96">0</span>%</h4>
                                    <h6 className="text mb-0">Satisfaction Rates</h6>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>


        <section className="tv-blog-section space bg-color2">
            <div className="container">
                <div className="row">
                    <div className="col-lg-12">
                        <div className="title-wrap text-center">
                            <div className="sub-title-2 text-theme"><i className="fa-solid fa-circle-check"></i>Latest Blog</div>
                            <h2 className="sec-title">Read our Latest Insights from <br /> Update Blog Posts</h2>
                        </div>
                    </div>
                </div>
                <div className="row gy-25">
                    <div className="col-lg-4 col-md-6 col-sm-6">
                        <article className="blog-single-box">
                            <div className="inner-box">
                                <div className="blog-image">
                                    <img src="/assets/images/blog/blog01.webp" alt="Blog Image" />
                                    <div className="category-tag"><span></span>16 Aug, 2025</div>
                                </div>
                                <div className="blog-content">
                                    <h4 className="title"><a href="blog-details.html">Top 10 Most Popular Tools <br /> For Marketing</a></h4>
                                    <div className="pt-25 pb-30"><div className="border dark"></div></div>
                                    <div className="blog-meta">
                                        <a href="blog-details.html" className="continue-reading">Explore More</a>
                                        <span>(2) Comments</span>
                                    </div>
                                </div>
                            </div>
                        </article>
                    </div>
                    <div className="col-lg-4 col-md-6 col-sm-6">
                        <article className="blog-single-box">
                            <div className="inner-box">
                                <div className="blog-image">
                                    <img src="/assets/images/blog/blog02.webp" alt="Blog Image" />
                                    <div className="category-tag"><span></span>17 Aug, 2025</div>
                                </div>
                                <div className="blog-content">
                                    <h4 className="title"><a href="blog-details.html">Business Growing Tips for <br /> Sales Globally</a></h4>
                                    <div className="pt-25 pb-30"><div className="border dark"></div></div>
                                    <div className="blog-meta">
                                        <a href="blog-details.html" className="continue-reading">Explore More</a>
                                        <span>(5) Comments</span>
                                    </div>
                                </div>
                            </div>
                        </article>
                    </div>
                    <div className="col-lg-4 col-md-6 col-sm-6">
                        <article className="blog-single-box">
                            <div className="inner-box">
                                <div className="blog-image">
                                    <img src="/assets/images/blog/blog03.webp" alt="Blog Image" />
                                    <div className="category-tag"><span></span>29 Aug, 2025</div>
                                </div>
                                <div className="blog-content">
                                    <h4 className="title"><a href="blog-details.html">Installation Sales Navigator <br />Extension on Chrome</a></h4>
                                    <div className="pt-25 pb-30"><div className="border dark"></div></div>
                                    <div className="blog-meta">
                                        <a href="blog-details.html" className="continue-reading">Explore More</a>
                                        <span>(7) Comments</span>
                                    </div>
                                </div>
                            </div>
                        </article>
                    </div>
                </div>
            </div>
        </section>


    </main>
  );
}
