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

  const reviews = [
    {
      name: "Sarah Jenkins",
      username: "@sarah_j",
      body: "“The carpet installation was completely flawless. The team was highly professional, clean, and transformed our living room entirely. I highly recommend ZK Flooring!”",
      profile: "",
    },
    {
      name: "Mark Thompson",
      username: "@mthompson",
      body: "“Incredible quality and service! We chose their premium hardwood flooring for our office, and the finish is simply stunning. Will definitely use them again for future projects.”",
      profile: "",
    },
    {
      name: "Emma Davis",
      username: "@emma_davis",
      body: "“ZK Flooring made the entire process so easy. From selecting the right carpets to the final fitting, their attention to detail is truly unmatched here in Birmingham.”",
      profile: "",
    },
    {
      name: "David Roberts",
      username: "@david_rob",
      body: "“We couldn't be happier with our new laminate floors. They look exactly like real wood but are so much easier to maintain. Excellent workmanship by the fitters!”",
      profile: "",
    },
    {
      name: "Laura Bennett",
      username: "@laura_b",
      body: "“Fast, reliable, and very reasonably priced. The installation team arrived right on time and did an amazing job with our bedroom carpets. Absolutely five stars!”",
      profile: "",
    },
    {
      name: "James Wilson",
      username: "@jwilson",
      body: "“Outstanding service from start to finish. Our luxury vinyl tiles look incredible in the kitchen. ZK Flooring truly understands quality and customer care.”",
      profile: "",
    },
    {
      name: "Olivia Clark",
      username: "@olivia_c",
      body: "“A highly professional team with a fantastic range of flooring options. They guided us perfectly, and the installation was done exactly on our tight schedule.”",
      profile: "",
    },
  ];

  const firstRow = reviews.slice(0, Math.ceil(reviews.length / 2));
  const secondRow = reviews.slice(Math.ceil(reviews.length / 2));

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

        <section className="tv-service-section bg-light position-relative overflow-hidden space">
            <style>{`
                .tv-service-section .tv-service-inner .tv-service-item .service-right .tags {
                    display: grid;
                    grid-template-columns: repeat(3, 105px);
                    gap: 10px;
                    max-width: 340px;
                }
                .tv-service-section .tv-service-inner .tv-service-item .service-right .tags span {
                    display: inline-flex !important;
                    align-items: center !important;
                    justify-content: center !important;
                    width: 105px !important;
                    height: 52px !important;
                    min-height: 52px !important;
                    max-height: 52px !important;
                    padding: 4px 6px !important;
                    box-sizing: border-box !important;
                    text-align: center !important;
                    line-height: 1.25 !important;
                    font-size: 13px !important;
                }
            `}</style>
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
                                            <div className="overlay-anim4 overflow-hidden">
                                                <img
                                                    src="/services/Self Levelling.webp"
                                                    alt="Self Levelling"
                                                    width={700}
                                                    height={479}
                                                    style={{ width: '700px', height: '479px', maxWidth: '100%', objectFit: 'cover', display: 'block' }}
                                                />
                                            </div>
                                        </div>
                                        <div className="service-right">
                                            <h6>PREPARATION</h6>
                                            <h2>Expert Self Levelling & <br /> Subfloor Preparation</h2>
                                            <p> Ensure a perfectly smooth and durable foundation for your new floors. <br /> Our professional self-levelling services guarantee a flawless finish...
                                            </p>
                                            <a href="/contact" className="learn-more">Learn More <i className="fa-solid fa-arrow-up-right"></i></a>

                                            <div className="border my-40"></div>
                                            <div className="tags">
                                                <span>Latex Screed</span>
                                                <span>Plywood</span>
                                                <span>DPM</span>
                                                <span>Moisture Testing</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="service-item-wrap service-item-pin">
                                    <div className="tv-service-item">
                                    <div className="service-number">02.</div>
                                    <div className="service-left">
                                        <div className="overlay-anim4 overflow-hidden">
                                            <img
                                                src="/services/Carpet, Carpet Tile.webp"
                                                alt="Carpet & Carpet Tile"
                                                width={700}
                                                height={479}
                                                style={{ width: '700px', height: '479px', maxWidth: '100%', objectFit: 'cover', display: 'block' }}
                                            />
                                        </div>
                                    </div>
                                    <div className="service-right">
                                        <h6>INSTALLATION</h6>
                                        <h2>Premium Carpet & <br /> Carpet Tile Fitting</h2>
                                        <p> From luxurious domestic carpets to heavy-duty commercial tiles, <br /> we provide expert installation tailored to your space...
                                        </p>
                                        <a href="/contact" className="learn-more">Learn More <i className="fa-solid fa-arrow-up-right"></i></a>

                                        <div className="border my-40"></div>
                                        <div className="tags">
                                            <span>Broadloom</span>
                                            <span>Carpet Tiles</span>
                                            <span>Underlay</span>
                                            <span>Stair Runners</span>
                                        </div>
                                    </div>
                                    </div>                                
                                </div>
                                <div className="service-item-wrap">
                                    <div className="tv-service-item">
                                        <div className="service-number">03.</div>
                                        <div className="service-left">
                                            <div className="overlay-anim4 overflow-hidden">
                                                <img
                                                    src="/services/Vinyl, Vinyl Tile.webp"
                                                    alt="Vinyl & LVT"
                                                    width={700}
                                                    height={479}
                                                    style={{ width: '700px', height: '479px', maxWidth: '100%', objectFit: 'cover', display: 'block' }}
                                                />
                                            </div>
                                        </div>
                                        <div className="service-right">
                                            <h6>INSTALLATION</h6>
                                            <h2>Luxury Vinyl Tile (LVT) & <br /> Sheet Vinyl Flooring</h2>
                                            <p> Transform your interiors with versatile, water-resistant vinyl solutions. <br /> We specialize in precision fitting for stunning LVT and seamless sheets...
                                            </p>
                                            <a href="/contact" className="learn-more">Learn More <i className="fa-solid fa-arrow-up-right"></i></a>

                                            <div className="border my-40"></div>
                                            <div className="tags">
                                                <span>LVT</span>
                                                <span>Sheet Vinyl</span>
                                                <span>Amtico</span>
                                                <span>Karndean</span>
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
                            <li className="item m-item"><img className="icon" src="assets/images/icons/marquee-icon.png" alt="" /> Carpet Flooring</li>
                            <li className="item m-item"><img className="icon" src="assets/images/icons/marquee-icon.png" alt="" /> Carpet Tile</li>
                            <li className="item m-item"><img className="icon" src="assets/images/icons/marquee-icon.png" alt="" /> Vinyl Flooring</li>
                            <li className="item m-item"><img className="icon" src="assets/images/icons/marquee-icon.png" alt="" /> LVT Flooring</li>
                            <li className="item m-item"><img className="icon" src="assets/images/icons/marquee-icon.png" alt="" /> Professional Installation</li>
                            <li className="item m-item"><img className="icon" src="assets/images/icons/marquee-icon.png" alt="" /> Self Levelling</li>
                            <li className="item m-item"><img className="icon" src="assets/images/icons/marquee-icon.png" alt="" /> Floor Preparation</li>
                        </ul>
                    </div>
                 </div>
            </div>
        </div>




        
        <section className="tv-process-section bg-light position-relative">
            <style>{`
                .tv-process-section .tv-process-item {
                    height: 100%;
                    display: flex;
                    flex-direction: column;
                }
                .tv-process-section .process-box {
                    display: flex !important;
                    flex-direction: column !important;
                    height: 355px !important;
                    min-height: 355px !important;
                    max-height: 355px !important;
                    box-sizing: border-box !important;
                    width: 100% !important;
                }
                .tv-process-section .process-box .title {
                    min-height: 54px !important;
                    display: flex !important;
                    align-items: center !important;
                    justify-content: center !important;
                    margin-top: 50px !important;
                    margin-bottom: 12px !important;
                }
                .tv-process-section .process-box p {
                    margin: 0 !important;
                    flex-grow: 1 !important;
                }
            `}</style>
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
                                    <div className="icon"><img width="24" height="24" src="https://img.icons8.com/plumpy/24/tape-measure-sewing.png" alt="tape-measure-sewing" /></div>
                                    <h3 className="title">Site Consultation</h3>
                                    <p>Understand the space, assess the flooring requirements, and recommend the right solution.</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-xl-3 col-lg-4 col-md-6 col-sm-6">
                            <div className="tv-process-item wow fadeInRightBig" data-wow-delay=".3s">
                                <h4 className="title-text">STEP 02</h4>
                                <div className="process-box">
                                    <div className="icon"><img width="24" height="24" src="https://img.icons8.com/plumpy/24/wallpaper-roll.png" alt="wallpaper-roll" /></div>
                                    <h3 className="title">Product Selection</h3>
                                    <p>Explore the right carpets, carpet tiles, vinyl, LVT, and flooring options for your space.</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-xl-3 col-lg-4 col-md-6 col-sm-6">
                            <div className="tv-process-item  wow fadeInRightBig" data-wow-delay=".4s">
                                <h4 className="title-text">STEP 03</h4>
                                <div className="process-box">
                                    <div className="icon"><img width="24" height="24" src="https://img.icons8.com/plumpy/24/cut-paper.png" alt="cut-paper" /></div>
                                    <h3 className="title">Professional Installation</h3>
                                    <p>Prepare the surface and install your selected flooring with precision and professional workmanship.</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-xl-3 col-lg-4 col-md-6 col-sm-6">
                            <div className="tv-process-item wow fadeInRightBig" data-wow-delay=".5s">
                                <h4 className="title-text">STEP 04</h4>
                                <div className="process-box">
                                    <div className="icon"><img width="24" height="24" src="https://img.icons8.com/plumpy/24/best-seller.png" alt="best-seller" /></div>
                                    <h3 className="title">Final Inspection &amp; Support</h3>
                                    <p>Complete the final checks and provide reliable support after your flooring installation.</p>
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
                                <img src="/Our Team/1.jpg" alt="Jobaer Khanom" style={{ width: '100%', height: '420px', objectFit: 'cover' }} />
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
                                <img src="/Our Team/2.jpg" alt="Sayma D. Farna" style={{ width: '100%', height: '420px', objectFit: 'cover' }} />
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
                                <img src="/Our Team/3.jpg" alt="Jubin E. Nawtail" style={{ width: '100%', height: '420px', objectFit: 'cover' }} />
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


                        <div className="row">
                            <div className="col-lg-12">
                                <div style={{ overflow: 'hidden', width: '100%', position: 'relative', padding: '1rem 0' }}>
                                    <style dangerouslySetInnerHTML={{__html: `
                                        @keyframes customMarqueeLeft {
                                            0% { transform: translateX(0); }
                                            100% { transform: translateX(-50%); }
                                        }
                                        @keyframes customMarqueeRight {
                                            0% { transform: translateX(-50%); }
                                            100% { transform: translateX(0); }
                                        }
                                        .custom-marquee-content-left {
                                            display: flex;
                                            gap: 1.5rem;
                                            width: max-content;
                                            animation: customMarqueeLeft 30s linear infinite;
                                        }
                                        .custom-marquee-content-right {
                                            display: flex;
                                            gap: 1.5rem;
                                            width: max-content;
                                            animation: customMarqueeRight 30s linear infinite;
                                        }
                                        .custom-marquee-content-left:hover, .custom-marquee-content-right:hover {
                                            animation-play-state: paused;
                                        }
                                    `}} />
                                    
                                    <div className="custom-marquee-content-left" style={{ marginBottom: '1.5rem' }}>
                                        {[...firstRow, ...firstRow].map((review, index) => (
                                            <div key={`first-${index}`} style={{ width: '20rem', flexShrink: 0 }}>
                                                <div style={{
                                                    height: '100%', width: '100%', cursor: 'pointer', overflow: 'hidden',
                                                    borderRadius: '0.75rem', border: '1px solid rgba(255, 255, 255, 0.4)', backgroundColor: '#ffffff', boxShadow: '0 4px 15px rgba(0, 0, 0, 0.05)', padding: '1.5rem',
                                                }}>
                                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                                        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '0.75rem' }}>
                                                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                                <p style={{ margin: 0, fontSize: '0.875rem', fontWeight: 600, color: '#1f2937' }}>{review.name}</p>
                                                                <p style={{ margin: 0, fontSize: '0.75rem', fontWeight: 500, color: '#6b7280' }}>{review.username}</p>
                                                            </div>
                                                        </div>
                                                        <p style={{ margin: 0, fontSize: '0.875rem', color: '#374151', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden', lineHeight: 1.6 }}>{review.body}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    
                                    <div className="custom-marquee-content-right">
                                        {[...secondRow, ...secondRow].map((review, index) => (
                                            <div key={`second-${index}`} style={{ width: '20rem', flexShrink: 0 }}>
                                                <div style={{
                                                    height: '100%', width: '100%', cursor: 'pointer', overflow: 'hidden',
                                                    borderRadius: '0.75rem', border: '1px solid rgba(255, 255, 255, 0.4)', backgroundColor: '#ffffff', boxShadow: '0 4px 15px rgba(0, 0, 0, 0.05)', padding: '1.5rem',
                                                }}>
                                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                                        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '0.75rem' }}>
                                                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                                <p style={{ margin: 0, fontSize: '0.875rem', fontWeight: 600, color: '#1f2937' }}>{review.name}</p>
                                                                <p style={{ margin: 0, fontSize: '0.75rem', fontWeight: 500, color: '#6b7280' }}>{review.username}</p>
                                                            </div>
                                                        </div>
                                                        <p style={{ margin: 0, fontSize: '0.875rem', color: '#374151', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden', lineHeight: 1.6 }}>{review.body}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
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
