const url = 'https://vsdvpvmnwmpwvjmcckju.supabase.co/rest/v1/pages';
const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZzZHZwdm1ud21wd3ZqbWNja2p1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MDY1OTI2MiwiZXhwIjoyMDk2MjM1MjYyfQ.mmmSfEp4G0kkstv_3gwR5-V8Bn4a9voBWGORoSpvTKI';

const homeSections = {
  hero: [
    {
      title: "Luxury & Comfort <br /><span>Carpet Fitting</span>",
      sub_title: "ZK FLOORING SERVICES",
      description: "Transform your home with soft, durable, and expertly fitted carpets across Birmingham & surrounding regions.",
      bg_image: "/slider/Carpet.webp",
      cta_text: "Explore Carpets",
      cta_link: "/services",
      video_url: "https://www.youtube.com/watch?v=SMKPKGW083c",
      badge_text: "ZK FLOORING PREMIUM CARPET FITTING SERVICE"
    },
    {
      title: "Durable & Stylish <br /><span>Laminate Flooring</span>",
      sub_title: "EXPERT INSTALLATION",
      description: "High-quality laminate flooring options designed for elegance, easy maintenance, and long-lasting performance.",
      bg_image: "/slider/Laminate Flooring.webp",
      cta_text: "View Laminates",
      cta_link: "/services",
      video_url: "https://www.youtube.com/watch?v=SMKPKGW083c",
      badge_text: "ZK FLOORING PREMIUM CARPET FITTING SERVICE"
    },
    {
      title: "Sleek LVT & <br /><span>Vinyl Tiles</span>",
      sub_title: "PREMIUM DESIGN",
      description: "Luxury Vinyl Tiles (LVT) with waterproof durability and stunning modern aesthetic finishes for any space.",
      bg_image: "/slider/Vinyl Tile.webp",
      cta_text: "Discover LVT",
      cta_link: "/services",
      video_url: "https://www.youtube.com/watch?v=SMKPKGW083c",
      badge_text: "ZK FLOORING PREMIUM CARPET FITTING SERVICE"
    },
    {
      title: "Versatile Sheet <br /><span>Vinyl Flooring</span>",
      sub_title: "COMMERCIAL & DOMESTIC",
      description: "Seamless, easy-to-clean vinyl flooring solutions ideal for kitchens, bathrooms, offices, and heavy traffic areas.",
      bg_image: "/slider/Vinyl flooring.webp",
      cta_text: "Get a Free Quote",
      cta_link: "/contact",
      video_url: "https://www.youtube.com/watch?v=SMKPKGW083c",
      badge_text: "ZK FLOORING PREMIUM CARPET FITTING SERVICE"
    },
    {
      title: "Heavy Duty <br /><span>Carpet Tile Solutions</span>",
      sub_title: "COMMERCIAL CONTRACTING",
      description: "Modular, high-durability carpet tiles engineered for offices, retail stores, and commercial establishments.",
      bg_image: "/slider/Carpet Tile.webp",
      cta_text: "Contact Us",
      cta_link: "/contact",
      video_url: "https://www.youtube.com/watch?v=SMKPKGW083c",
      badge_text: "ZK FLOORING PREMIUM CARPET FITTING SERVICE"
    }
  ],
  features: {
    social_proof_count: "3,600",
    social_proof_label: "active customers",
    social_proof_images: [
      "/assets/images/social/social-img01.webp",
      "/assets/images/social/social-img02.webp",
      "/assets/images/social/social-img03.webp"
    ],
    boxes: [
      {
        icon: "/assets/images/feature/hm1-icon01.webp",
        title: "Premium Carpet <br />Fitting",
        description: "Professional fitting services with a wide selection of luxurious carpets for every room."
      },
      {
        icon: "/assets/images/feature/hm1-icon02.webp",
        title: "Durable Vinyl <br />Flooring",
        description: "High-quality, water-resistant vinyl and LVT flooring crafted for modern living spaces."
      }
    ]
  },
  about: {
    title: "Transforming Spaces with <br /> Precision and Quality Craftsmanship",
    sub_title: "WHO WE ARE",
    since_text: "Since 2007",
    description: "ZK Flooring is Birmingham's trusted contractor for carpets, laminate, engineered wood, vinyl, and subfloor preparation. We service a 100-200 mile radius from Hobmoor Road, Small Heath.",
    main_image: "/assets/images/about/hm1-img01.webp",
    side_image: "/assets/images/about/hm1-img03.webp",
    cta_text: "Explore More",
    cta_link: "/about"
  },
  services: {
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
  },
  marquee: [
    "Carpet Flooring",
    "Carpet Tile",
    "Vinyl Flooring",
    "LVT Flooring",
    "Professional Installation",
    "Self Levelling",
    "Floor Preparation"
  ],
  process: {
    section_title: "PR<span className=\"text-theme\">O</span>CESS",
    steps: [
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
    ]
  },
  team: {
    section_subtitle: "Our Team",
    section_title: "Meet the Expert Team Powering Our <br />Goals and Ambitions",
    members: [
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
    ]
  },
  testimonials: {
    section_subtitle: "Testimonials",
    section_title: "Helping Business in 3,000+ <br /> Different Industries",
    trusted_text: "Trusted Clients <br /> Worldwide",
    social_images: [
      "/assets/images/social/social-img02.webp",
      "/assets/images/social/social-img03.webp"
    ],
    reviews: [
      {
        name: "Sarah Jenkins",
        username: "@sarah_j",
        body: "“The carpet installation was completely flawless. The team was highly professional, clean, and transformed our living room entirely. I highly recommend ZK Flooring!”"
      },
      {
        name: "Mark Thompson",
        username: "@mthompson",
        body: "“Incredible quality and service! We chose their premium hardwood flooring for our office, and the finish is simply stunning. Will definitely use them again for future projects.”"
      },
      {
        name: "Emma Davis",
        username: "@emma_davis",
        body: "“ZK Flooring made the entire process so easy. From selecting the right carpets to the final fitting, their attention to detail is truly unmatched here in Birmingham.”"
      },
      {
        name: "David Roberts",
        username: "@david_rob",
        body: "“We couldn't be happier with our new laminate floors. They look exactly like real wood but are so much easier to maintain. Excellent workmanship by the fitters!”"
      },
      {
        name: "Laura Bennett",
        username: "@laura_b",
        body: "“Fast, reliable, and very reasonably priced. The installation team arrived right on time and did an amazing job with our bedroom carpets. Absolutely five stars!”"
      },
      {
        name: "James Wilson",
        username: "@jwilson",
        body: "“Outstanding service from start to finish. Our luxury vinyl tiles look incredible in the kitchen. ZK Flooring truly understands quality and customer care.”"
      }
    ]
  },
  contact_callback: {
    title: "Connect with us for next <br />Gen Flooring Projects",
    sub_title: "Get in Touch",
    card_label: "Call us anytime",
    card_phone: "07903723774",
    card_phone_link: "tel:07903723774"
  }
};

const slugs = ['home', '/'];

async function seed() {
  for (const slug of slugs) {
    const patchUrl = `${url}?slug=eq.${encodeURIComponent(slug)}`;
    const res = await fetch(patchUrl, {
      method: 'PATCH',
      headers: {
        apikey: key,
        Authorization: 'Bearer ' + key,
        'Content-Type': 'application/json',
        Prefer: 'return=representation'
      },
      body: JSON.stringify({
        title: 'Home',
        sections: homeSections,
        updated_at: new Date().toISOString()
      })
    });
    console.log(`Seeded ${slug} via PATCH: status ${res.status}`);
  }
}

seed();
