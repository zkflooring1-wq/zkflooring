import React from 'react';
import { supabase } from '@/lib/supabase';
import { getSetting, HeaderContact } from '@/lib/settings';
import HeroSlider from '@/components/HeroSlider';
import { EditModeProvider } from '@/components/editor/EditModeProvider';
import { EditableField } from '@/components/editor/EditableField';
import { EditableImage } from '@/components/editor/EditableImage';

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

  const defaultMarqueeItems = [
    "Carpet Flooring",
    "Carpet Tile",
    "Vinyl Flooring",
    "LVT Flooring",
    "Professional Installation",
    "Self Levelling",
    "Floor Preparation"
  ];
  const marqueeItems = (Array.isArray(sections.marquee) && sections.marquee.length > 0) ? sections.marquee : defaultMarqueeItems;

  const defaultProcessSteps = [
    {
      step_text: "STEP 01",
      icon: "https://img.icons8.com/plumpy/24/tape-measure-sewing.png",
      title: "Site Consultation",
      description: "Understand the space, assess the flooring requirements, and recommend the right solution."
    },
    {
      step_text: "STEP 02",
      icon: "https://img.icons8.com/plumpy/24/wallpaper-roll.png",
      title: "Product Selection",
      description: "Explore the right carpets, carpet tiles, vinyl, LVT, and flooring options for your space."
    },
    {
      step_text: "STEP 03",
      icon: "https://img.icons8.com/plumpy/24/cut-paper.png",
      title: "Professional Installation",
      description: "Prepare the surface and install your selected flooring with precision and professional workmanship."
    },
    {
      step_text: "STEP 04",
      icon: "https://img.icons8.com/plumpy/24/best-seller.png",
      title: "Final Inspection & Support",
      description: "Complete the final checks and provide reliable support after your flooring installation."
    }
  ];
  const processData = {
    section_title: sections.process?.section_title || 'PR<span className="text-theme">O</span>CESS',
    steps: (sections.process?.steps && sections.process.steps.length > 0) ? sections.process.steps : defaultProcessSteps
  };

  const defaultTeamMembers = [
    {
      name: "Jobaer Khanom",
      role: "UI/UX Designer",
      image: "/Our Team/1.jpg"
    },
    {
      name: "Sayma D. Farna",
      role: "App Developer",
      image: "/Our Team/2.jpg"
    },
    {
      name: "Jubin E. Nawtail",
      role: "SEO Marketer",
      image: "/Our Team/3.jpg"
    }
  ];
  const teamData = {
    section_subtitle: sections.team?.section_subtitle || "Our Team",
    section_title: sections.team?.section_title || "Meet the Expert Team Powering Our <br />Goals and Ambitions",
    members: (sections.team?.members && sections.team.members.length > 0) ? sections.team.members : defaultTeamMembers
  };

  const activeReviews = (sections.testimonials?.reviews && sections.testimonials.reviews.length > 0) ? sections.testimonials.reviews : reviews;
  const firstRow = activeReviews.slice(0, Math.ceil(activeReviews.length / 2));
  const secondRow = activeReviews.slice(Math.ceil(activeReviews.length / 2));

  const heroSlides = (Array.isArray(sections.hero) && sections.hero.length > 0) ? sections.hero : defaultSliderImages;

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

  const services = sections.services || {
    section_subtitle: "Our Services",
    section_title: "Specialist Flooring Solutions & <br />Precision Installation",
    cards: [
      {
        number: "01.",
        sub_heading: "PREPARATION",
        title: "Expert Self Levelling & <br /> Subfloor Preparation",
        description: "Ensure a perfectly smooth and durable foundation for your new floors. Our professional self-levelling services guarantee a flawless finish with moisture testing and DPM barrier protection.",
        image: "/services/Self Levelling.webp",
        link: "/contact",
        tags: ["Latex Screed", "Plywood", "DPM", "Moisture Testing"]
      },
      {
        number: "02.",
        sub_heading: "INSTALLATION",
        title: "Premium Carpet & <br /> Carpet Tile Fitting",
        description: "From luxurious domestic carpets to heavy-duty commercial tiles, we provide expert installation tailored to your space with premium underlays and master gripper stretching.",
        image: "/services/Carpet, Carpet Tile.webp",
        link: "/contact",
        tags: ["Broadloom", "Carpet Tiles", "Underlay", "Stair Runners"]
      },
      {
        number: "03.",
        sub_heading: "INSTALLATION",
        title: "Luxury Vinyl Tile (LVT) & <br /> Sheet Vinyl Flooring",
        description: "Transform your interiors with versatile, 100% water-resistant vinyl solutions. We specialize in precision fitting for stunning LVT herringbone layouts and seamless commercial sheets.",
        image: "/services/Vinyl, Vinyl Tile.webp",
        link: "/contact",
        tags: ["LVT", "Sheet Vinyl", "Amtico", "Karndean"]
      }
    ]
  };

  const defaultPricingPlans = [
    {
      name: "Starter",
      price: "29 USD",
      cycle: "/ month",
      description: "Organize Daily Task by free",
      cta_text: "Join this Plan",
      cta_link: "/contact",
      is_popular: false,
      features: [
        { text: "3 Users available", isActive: true },
        { text: "Limited tools", isActive: true },
        { text: "Unlimited Supports", isActive: true },
        { text: "API Access", isActive: false },
        { text: "Premium apps", isActive: false },
      ]
    },
    {
      name: "Starter",
      price: "39 USD",
      cycle: "/ month",
      description: "Organize Daily Task by free",
      cta_text: "Join this Plan",
      cta_link: "/contact",
      is_popular: true,
      features: [
        { text: "3 Users available", isActive: true },
        { text: "Limited tools", isActive: true },
        { text: "Unlimited Supports", isActive: true },
        { text: "API Access", isActive: true },
        { text: "Premium apps", isActive: false },
      ]
    },
    {
      name: "Business",
      price: "39 USD",
      cycle: "/ month",
      description: "Organize Daily Task by free",
      cta_text: "Join this Plan",
      cta_link: "/contact",
      is_popular: false,
      features: [
        { text: "3 Users available", isActive: true },
        { text: "Limited tools", isActive: true },
        { text: "Unlimited Supports", isActive: true },
        { text: "API Access", isActive: true },
        { text: "Premium apps", isActive: true },
      ]
    }
  ];

  const pricingData = {
    section_subtitle: sections.pricing?.section_subtitle || "Pricing Plans",
    section_title: sections.pricing?.section_title || "Choose the Perfect Plans for <br /> Your Business Growth",
    plans: (sections.pricing?.plans && sections.pricing.plans.length > 0) ? sections.pricing.plans : defaultPricingPlans
  };

  // Fetch dynamic published blog posts from Supabase
  const { data: dbPublishedPosts } = await supabase
    .from('posts')
    .select('id, title, slug, featured_image, created_at')
    .eq('status', 'published')
    .order('created_at', { ascending: false })
    .limit(3);

  const defaultBlogCards = [
    {
      image: "/slider/Carpet.webp",
      date: "16 Aug, 2025",
      title: "Top 10 Most Popular Flooring Trends for UK Homes",
      link: "/blog",
      comments: "Flooring Guide"
    },
    {
      image: "/slider/Laminate Flooring.webp",
      date: "17 Aug, 2025",
      title: "How to Choose Between LVT and Real Hardwood Flooring",
      link: "/blog",
      comments: "Flooring Guide"
    },
    {
      image: "/slider/Vinyl Tile.webp",
      date: "29 Aug, 2025",
      title: "Complete Guide to Subfloor Preparation and Screeding",
      link: "/blog",
      comments: "Flooring Guide"
    }
  ];

  const dynamicBlogCards = (dbPublishedPosts && dbPublishedPosts.length > 0)
    ? dbPublishedPosts.map((p) => ({
        image: p.featured_image || "/slider/Carpet.webp",
        date: new Date(p.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        title: p.title,
        link: `/blog/${p.slug}`,
        comments: "Flooring Guide"
      }))
    : defaultBlogCards;

  const blogData = {
    section_subtitle: sections.blog?.section_subtitle || "Latest Blog",
    section_title: sections.blog?.section_title || "Read our Latest Insights & Flooring Guides",
    cards: dynamicBlogCards
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
    <EditModeProvider initialData={sections}>
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
                        <EditableImage key={i} path={`features.social_proof_images.${i}`} fallback={img} alt={`Client ${i + 1}`} />
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
                      <span className="count-number"><EditableField path="features.social_proof_count" fallback={features.social_proof_count || "3,600"} /></span>
                    </div>
                    <div className="rating-viewers"><EditableField path="features.social_proof_label" fallback={features.social_proof_label || "active customers"} /></div>
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
                    <EditableImage path="features.boxes.0.icon" fallback="/assets/images/feature/hm1-icon01.webp" alt="icon" />
                  </div>
                  <h2><EditableField path="features.boxes.0.title" fallback="Premium Carpet <br />Fitting" isHtml /></h2>
                  <p><EditableField path="features.boxes.0.description" fallback="Professional fitting services with a wide selection of luxurious carpets for every room." /></p>
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
                    <EditableImage path="features.boxes.1.icon" fallback="/assets/images/feature/hm1-icon02.webp" alt="icon" />
                  </div>
                  <h2><EditableField path="features.boxes.1.title" fallback="Hardwood & LVT <br />Installations" isHtml /></h2>
                  <p><EditableField path="features.boxes.1.description" fallback="Durable and stylish Luxury Vinyl Tiles (LVT) and hardwood options fitted to perfection." /></p>
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
            <div className="tv-service-inner space mx-30 ml-mx-0 overflow-hidden">
                <div className="container">
                    
                    <div className="row mb-50">
                        <div className="col-lg-12 text-center">
                            <div className="title-wrap two" data-wow-duration="2s" data-wow-delay=".0s">
                                <div className="sub-title-2 text-theme two">
                                  <i className="fa-solid fa-circle-check"></i>
                                  <EditableField path="services.section_subtitle" fallback={services.section_subtitle || "Our Services"} />
                                </div>
                                <h2 className="sec-title text-dark">
                                  <EditableField path="services.section_title" fallback={services.section_title || "Specialist Flooring Solutions & <br />Precision Installation"} isHtml={true} />
                                </h2>
                            </div>
                        </div>
                    </div>

                    <div className="row gy-30">
                        <div className="col-lg-12">
                            <div className="tv-service-item-inner">
                              {(services.cards || []).map((card: any, idx: number) => {
                                const isPinned = idx < (services.cards.length - 1);
                                return (
                                  <div key={idx} className={`service-item-wrap ${isPinned ? 'service-item-pin' : ''}`}>
                                    <div className="tv-service-item">
                                      <div className="service-number">
                                        <EditableField path={`services.cards.${idx}.number`} fallback={card.number || `0${idx + 1}.`} />
                                      </div>
                                      <div className="service-left">
                                        <div className="overlay-anim4 overflow-hidden">
                                          <EditableImage
                                            path={`services.cards.${idx}.image`}
                                            fallback={card.image || "/services/Self Levelling.webp"}
                                            alt={card.title || "Service"}
                                            width={700}
                                            height={479}
                                            style={{ width: '700px', height: '479px', maxWidth: '100%', objectFit: 'cover', display: 'block' }}
                                          />
                                        </div>
                                      </div>
                                      <div className="service-right">
                                        <h6>
                                          <EditableField path={`services.cards.${idx}.sub_heading`} fallback={card.sub_heading || "FLOORING"} />
                                        </h6>
                                        <h2>
                                          <EditableField path={`services.cards.${idx}.title`} fallback={card.title || ""} isHtml />
                                        </h2>
                                        <p>
                                          <EditableField path={`services.cards.${idx}.description`} fallback={card.description} />
                                        </p>
                                        <a href={card.link || "/contact"} className="learn-more">
                                          Learn More <i className="fa-solid fa-arrow-up-right"></i>
                                        </a>

                                        {Array.isArray(card.tags) && card.tags.filter(Boolean).length > 0 && (
                                          <>
                                            <div className="border my-40"></div>
                                            <div className="tags">
                                              {card.tags.filter(Boolean).map((t: string, tIdx: number) => (
                                                <span key={tIdx}>
                                                  <EditableField path={`services.cards.${idx}.tags.${tIdx}`} fallback={t} />
                                                </span>
                                              ))}
                                            </div>
                                          </>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}
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
                            {marqueeItems.map((item: string, i: number) => (
                              <li key={i} className="item m-item">
                                <img className="icon" src="assets/images/icons/marquee-icon.png" alt="" />
                                <EditableField path={`marquee.${i}`} fallback={item} />
                              </li>
                            ))}
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
            <div className="process-inner mx-30 ml-mx-0 space overflow-hidden xxl-br-0 position-relative" style={{ background: 'linear-gradient(135deg, #BF953F 0%, #FCF6BA 25%, #B38728 50%, #FBF5B7 75%, #AA771C 100%)', borderRadius: '0 0 30px 30px' }}>
                <div className="container position-relative">
                    
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="process-title mt--25">
                                <h2 className="text-white text-center">
                                  <EditableField path="process.section_title" fallback='PR<span className="text-theme">O</span>CESS' isHtml />
                                </h2>
                            </div>
                        </div>
                    </div>
                    <div className="row gy-30">
                        {processData.steps?.map((step: any, idx: number) => (
                          <div key={idx} className="col-xl-3 col-lg-4 col-md-6 col-sm-6">
                              <div className="tv-process-item wow fadeInRightBig" data-wow-delay={`${0.2 + idx * 0.1}s`}>
                                  <h4 className="title-text"><EditableField path={`process.steps.${idx}.step_text`} fallback={step.step_text || `STEP 0${idx + 1}`} /></h4>
                                  <div className="process-box">
                                      <div className="icon">
                                        <EditableImage path={`process.steps.${idx}.icon`} fallback={step.icon || "https://img.icons8.com/plumpy/24/tape-measure-sewing.png"} alt="icon" width={24} height={24} />
                                      </div>
                                      <h3 className="title"><EditableField path={`process.steps.${idx}.title`} fallback={step.title} /></h3>
                                      <p><EditableField path={`process.steps.${idx}.description`} fallback={step.description} /></p>
                                  </div>
                              </div>
                          </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
        
        <section className="tv-team-section bg-light space">
            <div className="container">
                
                <div className="title-wrap three text-center">
                    <div className="sub-title-2 text-theme"><i className="fa-solid fa-circle-check"></i><EditableField path="team.section_subtitle" fallback="Our Team" /></div>
                    <h2 className="sec-title"><EditableField path="team.section_title" fallback="Meet the Expert Team Powering Our <br />Goals and Ambitions" isHtml /></h2>
                </div>
                <div className="row gy-30">
                    {teamData.members?.map((member: any, idx: number) => (
                      <div key={idx} className="col-xl-4 col-lg-6 col-md-6 col-sm-6">
                          <div className="tv-team-card wow fadeInUp" data-wow-delay={`${0.2 + idx * 0.2}s`}>
                              <div className="team-photo">
                                  <EditableImage path={`team.members.${idx}.image`} fallback={member.image || `/Our Team/${idx + 1}.jpg`} alt={member.name} style={{ width: '100%', height: '420px', objectFit: 'cover' }} />
                              </div>
                              <div className="team-info">
                                  <div className="info-inner">
                                      <h3 className="team-name"><a href="#"><EditableField path={`team.members.${idx}.name`} fallback={member.name} /></a></h3>
                                      <p className="team-role"><EditableField path={`team.members.${idx}.role`} fallback={member.role} /></p>
                                  </div>
                              </div>
                          </div>
                      </div>
                    ))}
                </div>
            </div>
        </section>
        
        <section className="tv-testimonial-section bg-light overflow-hidden">
            <div className="tv-testi-inner br-30 ml-br-0 space position-relative mx-30 xxl-mx-0 overflow-hidden" style={{ background: 'linear-gradient(135deg, #BF953F 0%, #FCF6BA 25%, #B38728 50%, #FBF5B7 75%, #AA771C 100%)', borderRadius: '30px' }}>
                    <div className="container">
                        
                        <div className="row">
                            <div className="col-lg-12">
                                <div className="testimonial-content-wrap d-flex justify-content-between sm-flex-column">
                                    <div className="title-wrap two">
                                        <div className="sub-title-2 two" style={{ background: '#16120B', color: '#FCF6BA' }}><i className="fa-solid fa-circle-check"></i><EditableField path="testimonials.section_subtitle" fallback="Testimonials" /></div>
                                        <h2 className="sec-title" style={{ color: '#16120B', fontWeight: 800 }}>
                                          <EditableField path="testimonials.section_title" fallback="Helping Business in 3,000+ <br /> Different Industries" isHtml />
                                        </h2>
                                    </div>
                                    <div className="testimonial-btn-wrapper">
                                        <div className="scribble-shape scribble md-d-none">
                                            <img src="/assets/images/testimonial/scribble01.webp" alt="" />
                                        </div>
                                        <div className="client-social-proof">
                                            <div className="social">
                                                <EditableImage path="testimonials.social_images.0" fallback={sections.testimonials?.social_images?.[0] || "/assets/images/social/social-img02.webp"} alt="Client 02" />
                                                <EditableImage path="testimonials.social_images.1" fallback={sections.testimonials?.social_images?.[1] || "/assets/images/social/social-img03.webp"} alt="Client 03" />
                                                <h4 style={{ background: '#16120B', color: '#FCF6BA' }}>+3K</h4>
                                            </div>
                                            <h4 className="text" style={{ color: '#16120B', fontWeight: 700 }}>
                                              <EditableField path="testimonials.trusted_text" fallback="Trusted Clients <br /> Worldwide" isHtml />
                                            </h4>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-lg-12">
                                <div style={{
                                    overflow: 'hidden',
                                    width: '100%',
                                    position: 'relative',
                                    padding: '1rem 0',
                                    WebkitMaskImage: 'linear-gradient(to right, transparent 0%, rgba(0, 0, 0, 1) 7%, rgba(0, 0, 0, 1) 93%, transparent 100%)',
                                    maskImage: 'linear-gradient(to right, transparent 0%, rgba(0, 0, 0, 1) 7%, rgba(0, 0, 0, 1) 93%, transparent 100%)',
                                }}>
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
                                        {[...firstRow, ...firstRow].map((review, index) => {
                                          const realIdx = index % activeReviews.length;
                                          return (
                                            <div key={`first-${index}`} style={{ width: '20rem', flexShrink: 0 }}>
                                                <div style={{
                                                    height: '100%', width: '100%', cursor: 'pointer', overflow: 'hidden',
                                                    borderRadius: '0.75rem', border: '1px solid rgba(255, 255, 255, 0.4)', backgroundColor: '#ffffff', boxShadow: '0 4px 15px rgba(0, 0, 0, 0.05)', padding: '1.5rem',
                                                }}>
                                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                                        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '0.75rem' }}>
                                                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                                <p style={{ margin: 0, fontSize: '0.875rem', fontWeight: 600, color: '#1f2937' }}>
                                                                  <EditableField path={`testimonials.reviews.${realIdx}.name`} fallback={review.name} />
                                                                </p>
                                                                <p style={{ margin: 0, fontSize: '0.75rem', fontWeight: 500, color: '#6b7280' }}>
                                                                  <EditableField path={`testimonials.reviews.${realIdx}.username`} fallback={review.username} />
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <p style={{ margin: 0, fontSize: '0.875rem', color: '#374151', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden', lineHeight: 1.6 }}>
                                                          <EditableField path={`testimonials.reviews.${realIdx}.body`} fallback={review.body} />
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                          );
                                        })}
                                    </div>
                                    
                                    <div className="custom-marquee-content-right">
                                        {[...secondRow, ...secondRow].map((review, index) => {
                                          const realIdx = (index % secondRow.length) + firstRow.length;
                                          return (
                                            <div key={`second-${index}`} style={{ width: '20rem', flexShrink: 0 }}>
                                                <div style={{
                                                    height: '100%', width: '100%', cursor: 'pointer', overflow: 'hidden',
                                                    borderRadius: '0.75rem', border: '1px solid rgba(255, 255, 255, 0.4)', backgroundColor: '#ffffff', boxShadow: '0 4px 15px rgba(0, 0, 0, 0.05)', padding: '1.5rem',
                                                }}>
                                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                                        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '0.75rem' }}>
                                                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                                <p style={{ margin: 0, fontSize: '0.875rem', fontWeight: 600, color: '#1f2937' }}>
                                                                  <EditableField path={`testimonials.reviews.${realIdx}.name`} fallback={review.name} />
                                                                </p>
                                                                <p style={{ margin: 0, fontSize: '0.75rem', fontWeight: 500, color: '#6b7280' }}>
                                                                  <EditableField path={`testimonials.reviews.${realIdx}.username`} fallback={review.username} />
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <p style={{ margin: 0, fontSize: '0.875rem', color: '#374151', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden', lineHeight: 1.6 }}>
                                                          <EditableField path={`testimonials.reviews.${realIdx}.body`} fallback={review.body} />
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                          );
                                        })}
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
            </div>
        </section>

        {/* Pricing Section */}
        <section className="tv-pricing-section space bg-light">
            <div className="shape-mockup z-1 spin d-none d-xxl-block" data-left="15%" data-bottom="69%"><img src="/assets/images/pricing/eart.webp" alt="..." /></div>
            <div className="shape-mockup z-1 spin2 d-none d-xxl-block" data-right="15%" data-bottom="69%"><img src="/assets/images/pricing/spin-shape.webp" alt="..." /></div>

            <div className="container">
                <div className="row">
                    <div className="col-lg-12">
                        <div className="title-wrap text-center three">
                            <div className="sub-title-2 text-theme"><i className="fa-solid fa-circle-check"></i><EditableField path="pricing.section_subtitle" fallback={pricingData.section_subtitle} /></div>
                            <h2 className="sec-title"><EditableField path="pricing.section_title" fallback={pricingData.section_title} isHtml /></h2>
                        </div>
                    </div>
                </div>
                <div className="row gy-30 align-items-end">
                    {pricingData.plans.map((plan: any, pIdx: number) => (
                      <div key={pIdx} className="col-lg-4 col-md-6 col-sm-6">
                          <div className={`tv-pricing-card ${plan.is_popular ? 'style2' : ''} wow fadeInUp`} data-wow-delay={`${0.5 + pIdx * 0.2}s`}>
                              {plan.is_popular && (
                                <div className="popular-badge"><i className="fa-solid fa-fire"></i> Most Popular</div>
                              )}
                              <div className="pricing-inner-box">
                                  {plan.is_popular && (
                                    <div className="top-icon spin"><img src="/assets/images/pricing/spin-shape02.webp" alt="" /></div>
                                  )}
                                  <div className="pricing-inner">
                                      <div className="pricing-plan">
                                          <h5 className="plan"><EditableField path={`pricing.plans.${pIdx}.name`} fallback={plan.name} /></h5>
                                          <div className="price">
                                              <h2><EditableField path={`pricing.plans.${pIdx}.price`} fallback={plan.price} /></h2>
                                              <span className="billing-cycle"><EditableField path={`pricing.plans.${pIdx}.cycle`} fallback={plan.cycle || "/ month"} /></span>
                                          </div>
                                          <p><EditableField path={`pricing.plans.${pIdx}.description`} fallback={plan.description} /></p>
                                          <a href={plan.cta_link || "/contact"} className="theme-btn mt-25 w-100 br-25">
                                              <span className="link-effect">
                                                  <span className="effect-1"><EditableField path={`pricing.plans.${pIdx}.cta_text`} fallback={plan.cta_text || "Join this Plan"} /></span>
                                                  <span className="effect-1"><EditableField path={`pricing.plans.${pIdx}.cta_text`} fallback={plan.cta_text || "Join this Plan"} /></span>
                                              </span>
                                              <span className="arrow1"><i className="fa-solid fa-arrow-right"></i></span>
                                          </a>
                                          <h4>Key Features</h4>
                                      </div>
                                      <ul className="features">
                                          {plan.features?.map((feat: any, fIdx: number) => (
                                            <li key={fIdx} className={feat.isActive ? "" : "disabled"}>
                                              <span className="checkmark"><i className={`fa-solid ${feat.isActive ? 'fa-circle-check' : 'fa-circle-x'}`}></i></span>
                                              <EditableField path={`pricing.plans.${pIdx}.features.${fIdx}.text`} fallback={feat.text} />
                                            </li>
                                          ))}
                                      </ul>
                                  </div>
                              </div>
                          </div>
                      </div>
                    ))}
                </div>
            </div>
        </section>

        {/* Latest Blog Section */}
        <section className="tv-blog-section space bg-color2">
            <div className="container">
                <div className="row">
                    <div className="col-lg-12">
                        <div className="title-wrap text-center">
                            <div className="sub-title-2 text-theme"><i className="fa-solid fa-circle-check"></i><EditableField path="blog.section_subtitle" fallback={blogData.section_subtitle} /></div>
                            <h2 className="sec-title"><EditableField path="blog.section_title" fallback={blogData.section_title} isHtml /></h2>
                        </div>
                    </div>
                </div>
                <div className="row gy-25">
                    {blogData.cards.map((card: any, bIdx: number) => (
                      <div key={bIdx} className="col-lg-4 col-md-6 col-sm-6">
                          <article className="blog-single-box">
                              <div className="inner-box">
                                  <div className="blog-image">
                                      <EditableImage path={`blog.cards.${bIdx}.image`} fallback={card.image || "/assets/images/blog/blog01.webp"} alt="Blog Image" />
                                      <div className="category-tag"><span></span><EditableField path={`blog.cards.${bIdx}.date`} fallback={card.date || "16 Aug, 2025"} /></div>
                                  </div>
                                  <div className="blog-content">
                                      <h4 className="title"><a href={card.link || "/contact"}><EditableField path={`blog.cards.${bIdx}.title`} fallback={card.title} isHtml /></a></h4>
                                      <div className="pt-25 pb-30"><div className="border dark"></div></div>
                                      <div className="blog-meta">
                                          <a href={card.link || "/contact"} className="continue-reading">Explore More</a>
                                          <span><EditableField path={`blog.cards.${bIdx}.comments`} fallback={card.comments || "(0) Comments"} /></span>
                                      </div>
                                  </div>
                              </div>
                          </article>
                      </div>
                    ))}
                </div>
            </div>
        </section>

    </main>
    </EditModeProvider>
  );
}
