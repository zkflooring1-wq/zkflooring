"use client";

import { useState, useEffect, useRef } from "react";
import AdminLayout from "@/components/layout/AdminLayout";
import SaveBar from "@/components/ui/SaveBar";
import LoadingState from "@/components/ui/LoadingState";
import toast from "react-hot-toast";
import { Monitor, Smartphone, Tablet } from "lucide-react";

import HeroEditor from "./_components/HeroEditor";
import FeaturesEditor from "./_components/FeaturesEditor";
import AboutEditor from "./_components/AboutEditor";
import ServicesEditor from "./_components/ServicesEditor";
import MarqueeEditor from "./_components/MarqueeEditor";
import ProcessEditor from "./_components/ProcessEditor";
import TeamEditor from "./_components/TeamEditor";
import TestimonialsEditor from "./_components/TestimonialsEditor";
import PricingEditor from "./_components/PricingEditor";
import BlogEditor from "./_components/BlogEditor";
import ContactEditor from "./_components/ContactEditor";

const TABS = [
  "Hero Slider", "Features", "About Us", "Services", "Marquee", "Process", 
  "Our Team", "Testimonials", "Pricing", "Latest Blog", "Contact"
];

const DEFAULT_HERO_SLIDES = [
  {
    title: "Luxury & Comfort <br /><span>Carpet Fitting</span>",
    sub_title: "ZK FLOORING SERVICES",
    description: "Transform your home with soft, durable, and expertly fitted carpets across Birmingham & surrounding regions.",
    bg_image: "/slider/Carpet.webp",
    cta_text: "Explore Carpets",
    cta_link: "/services",
    video_url: "https://www.youtube.com/watch?v=SMKPKGW083c",
    badge_text: "ZK FLOORING PREMIUM CARPET FITTING SERVICE",
  },
  {
    title: "Durable & Stylish <br /><span>Laminate Flooring</span>",
    sub_title: "EXPERT INSTALLATION",
    description: "High-quality laminate flooring options designed for elegance, easy maintenance, and long-lasting performance.",
    bg_image: "/slider/Laminate Flooring.webp",
    cta_text: "View Laminates",
    cta_link: "/services",
    video_url: "https://www.youtube.com/watch?v=SMKPKGW083c",
    badge_text: "ZK FLOORING PREMIUM CARPET FITTING SERVICE",
  },
  {
    title: "Sleek LVT & <br /><span>Vinyl Tiles</span>",
    sub_title: "PREMIUM DESIGN",
    description: "Luxury Vinyl Tiles (LVT) with waterproof durability and stunning modern aesthetic finishes for any space.",
    bg_image: "/slider/Vinyl Tile.webp",
    cta_text: "Discover LVT",
    cta_link: "/services",
    video_url: "https://www.youtube.com/watch?v=SMKPKGW083c",
    badge_text: "ZK FLOORING PREMIUM CARPET FITTING SERVICE",
  },
  {
    title: "Versatile Sheet <br /><span>Vinyl Flooring</span>",
    sub_title: "COMMERCIAL & DOMESTIC",
    description: "Seamless, easy-to-clean vinyl flooring solutions ideal for kitchens, bathrooms, offices, and heavy traffic areas.",
    bg_image: "/slider/Vinyl flooring.webp",
    cta_text: "Get a Free Quote",
    cta_link: "/contact",
    video_url: "https://www.youtube.com/watch?v=SMKPKGW083c",
    badge_text: "ZK FLOORING PREMIUM CARPET FITTING SERVICE",
  },
  {
    title: "Heavy Duty <br /><span>Carpet Tile Solutions</span>",
    sub_title: "COMMERCIAL CONTRACTING",
    description: "Modular, high-durability carpet tiles engineered for offices, retail stores, and commercial establishments.",
    bg_image: "/slider/Carpet Tile.webp",
    cta_text: "Contact Us",
    cta_link: "/contact",
    video_url: "https://www.youtube.com/watch?v=SMKPKGW083c",
    badge_text: "ZK FLOORING PREMIUM CARPET FITTING SERVICE",
  }
];

const DEFAULT_FEATURES_DATA = {
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
};

const DEFAULT_ABOUT_DATA = {
  title: "Transforming Spaces with <br /> Precision and Quality Craftsmanship",
  sub_title: "WHO WE ARE",
  since_text: "Since 2007",
  description: "ZK Flooring is Birmingham's trusted contractor for carpets, laminate, engineered wood, vinyl, and subfloor preparation. We service a 100-200 mile radius from Hobmoor Road, Small Heath.",
  main_image: "/assets/images/about/hm1-img01.webp",
  side_image: "/assets/images/about/hm1-img03.webp",
  cta_text: "Explore More",
  cta_link: "/about",
};

const DEFAULT_SERVICES_DATA = {
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

const DEFAULT_MARQUEE_DATA = [
  "Carpet Flooring",
  "Carpet Tile",
  "Vinyl Flooring",
  "LVT Flooring",
  "Professional Installation",
  "Self Levelling",
  "Floor Preparation"
];

const DEFAULT_PROCESS_DATA = {
  section_title: 'PR<span className="text-theme">O</span>CESS',
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
};

const DEFAULT_TEAM_DATA = {
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
};

const DEFAULT_TESTIMONIALS_DATA = {
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
};

const DEFAULT_CONTACT_DATA = {
  title: "Connect with us for next <br />Gen Flooring Projects",
  sub_title: "Get in Touch",
  card_label: "Call us anytime",
  card_phone: "07903723774",
  card_phone_link: "tel:07903723774"
};

export default function HomePageEditor() {
  const [activeTab, setActiveTab] = useState(TABS[0]);
  const [data, setData] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [device, setDevice] = useState<"desktop" | "tablet" | "mobile">("desktop");

  useEffect(() => {
    fetch(`/api/pages/home`)
      .then((r) => r.json())
      .then((d) => {
        const sections = d.page?.sections || {};
        if (!sections.hero || !Array.isArray(sections.hero) || sections.hero.length === 0) {
          sections.hero = DEFAULT_HERO_SLIDES;
        }
        if (!sections.features || !sections.features.boxes || sections.features.boxes.length === 0) {
          sections.features = DEFAULT_FEATURES_DATA;
        }
        if (!sections.about || !sections.about.title) {
          sections.about = DEFAULT_ABOUT_DATA;
        }
        if (!sections.services || !sections.services.cards || sections.services.cards.length === 0) {
          sections.services = DEFAULT_SERVICES_DATA;
        }
        if (!sections.marquee || !Array.isArray(sections.marquee) || sections.marquee.length === 0) {
          sections.marquee = DEFAULT_MARQUEE_DATA;
        }
        if (!sections.process || !sections.process.steps || sections.process.steps.length === 0) {
          sections.process = DEFAULT_PROCESS_DATA;
        }
        if (!sections.team || !sections.team.members || sections.team.members.length === 0) {
          sections.team = DEFAULT_TEAM_DATA;
        }
        if (!sections.testimonials || !sections.testimonials.reviews || sections.testimonials.reviews.length === 0) {
          sections.testimonials = DEFAULT_TESTIMONIALS_DATA;
        }
        if (!sections.contact_callback || !sections.contact_callback.title) {
          sections.contact_callback = DEFAULT_CONTACT_DATA;
        }
        setData(sections);
      })
      .catch(() => toast.error("Failed to load page data"))
      .finally(() => setLoading(false));

    const handleMessage = (e: MessageEvent) => {
      if (e.data?.type === 'FIELD_CLICKED') {
        const path = e.data.path;
        if (path.startsWith('hero')) setActiveTab("Hero Slider");
        else if (path.startsWith('features')) setActiveTab("Features");
        else if (path.startsWith('about')) setActiveTab("About Us");
        else if (path.startsWith('services')) setActiveTab("Services");
        else if (path.startsWith('marquee')) setActiveTab("Marquee");
        else if (path.startsWith('process')) setActiveTab("Process");
        else if (path.startsWith('team')) setActiveTab("Our Team");
        else if (path.startsWith('testimonials')) setActiveTab("Testimonials");
        else if (path.startsWith('pricing')) setActiveTab("Pricing");
        else if (path.startsWith('blog')) setActiveTab("Latest Blog");
        else if (path.startsWith('contact')) setActiveTab("Contact");
      } else if (e.data?.type === 'FIELD_UPDATED') {
        const { path, value } = e.data;
        setData((prev: any) => {
          const newData = JSON.parse(JSON.stringify(prev || {}));
          const keys = path.split('.');
          let curr = newData;
          for (let i = 0; i < keys.length - 1; i++) {
            if (!curr[keys[i]]) curr[keys[i]] = {};
            curr = curr[keys[i]];
          }
          curr[keys[keys.length - 1]] = value;
          return newData;
        });
        toast.success("Updated live on page! Click Save to publish.", { id: 'visual-update', duration: 2500 });
      }
    };
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch(`/api/pages/home`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: "Home",
          sections: data,
        })
      });
      if (!res.ok) throw new Error();
      toast.success("Home page updated!");
    } catch {
      toast.error("Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const updateSection = (sectionKey: string, sectionData: any) => {
    setData((prev: any) => {
       const newData = { ...prev, [sectionKey]: sectionData };
       // Send postMessage to iframe to update live
       if (iframeRef.current?.contentWindow) {
         iframeRef.current.contentWindow.postMessage({
           type: 'UPDATE_FIELD',
           path: sectionKey,
           value: sectionData
         }, '*');
       }
       return newData;
    });
  };

  if (loading) {
    return (
      <AdminLayout title="Home Page" breadcrumb={["Pages", "Home"]}>
        <LoadingState />
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Home Page" breadcrumb={["Pages", "Home"]}>
      <div className="flex flex-col lg:flex-row gap-6 pb-24 lg:h-[calc(100vh-120px)]">
        
        {/* Editor Panel (Left) */}
        <div className="w-full lg:w-1/3 flex flex-col gap-4 overflow-y-auto pr-2 custom-scrollbar">
          {/* Tabs List */}
          <div className="bg-white rounded-[var(--radius-card)] border border-obsidian-100/50 shadow-sm overflow-hidden flex-shrink-0">
            <div className="p-3 border-b border-obsidian-100 bg-obsidian-50/50">
              <h3 className="font-semibold text-obsidian-700 font-[var(--font-heading)]">Edit Section: {activeTab}</h3>
            </div>
            <div className="p-2 flex flex-wrap gap-1.5">
              {TABS.map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    activeTab === tab 
                      ? "bg-gradient-to-r from-obsidian-900 to-obsidian-950 text-gold-300 shadow-sm border border-gold-500/20" 
                      : "text-obsidian-600 hover:bg-obsidian-50 hover:text-obsidian-900 bg-obsidian-50/50 border border-obsidian-200/50"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-[var(--radius-card)] border border-obsidian-100/50 shadow-sm p-5 flex-1 min-h-0 overflow-y-auto">
            {activeTab === "Hero Slider" && <HeroEditor data={data.hero || []} onChange={d => updateSection('hero', d)} />}
            {activeTab === "Features" && <FeaturesEditor data={data.features || {}} onChange={d => updateSection('features', d)} />}
            {activeTab === "About Us" && <AboutEditor data={data.about || {}} onChange={d => updateSection('about', d)} />}
            {activeTab === "Services" && <ServicesEditor data={data.services || {}} onChange={d => updateSection('services', d)} />}
            {activeTab === "Marquee" && <MarqueeEditor data={data.marquee || []} onChange={d => updateSection('marquee', d)} />}
            {activeTab === "Process" && <ProcessEditor data={data.process || {}} onChange={d => updateSection('process', d)} />}
            {activeTab === "Our Team" && <TeamEditor data={data.team || {}} onChange={d => updateSection('team', d)} />}
            {activeTab === "Testimonials" && <TestimonialsEditor data={data.testimonials || {}} onChange={d => updateSection('testimonials', d)} />}
            {activeTab === "Pricing" && <PricingEditor data={data.pricing || {}} onChange={d => updateSection('pricing', d)} />}
            {activeTab === "Latest Blog" && <BlogEditor data={data.blog || {}} onChange={d => updateSection('blog', d)} />}
            {activeTab === "Contact" && <ContactEditor data={data.contact_callback || {}} onChange={d => updateSection('contact_callback', d)} />}
          </div>
        </div>

        {/* Visual Preview Panel (Right) */}
        <div className="w-full lg:w-2/3 bg-obsidian-50 rounded-[var(--radius-card)] border border-obsidian-200 shadow-inner overflow-hidden flex flex-col min-h-[600px] lg:h-full">
          <div className="bg-obsidian-800 text-white p-2 flex items-center justify-between shadow-md z-10">
            <div className="flex items-center gap-2 px-2">
              <div className="w-3 h-3 rounded-full bg-red-400"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
              <div className="w-3 h-3 rounded-full bg-green-400"></div>
              <span className="ml-4 text-xs font-mono text-obsidian-300">Visual Editor - Live Preview</span>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setDevice('mobile')} className={`p-1.5 rounded ${device === 'mobile' ? 'bg-obsidian-600' : 'hover:bg-obsidian-700'}`}><Smartphone className="w-4 h-4" /></button>
              <button onClick={() => setDevice('tablet')} className={`p-1.5 rounded ${device === 'tablet' ? 'bg-obsidian-600' : 'hover:bg-obsidian-700'}`}><Tablet className="w-4 h-4" /></button>
              <button onClick={() => setDevice('desktop')} className={`p-1.5 rounded ${device === 'desktop' ? 'bg-obsidian-600' : 'hover:bg-obsidian-700'}`}><Monitor className="w-4 h-4" /></button>
            </div>
          </div>
          
          <div className="flex-1 flex justify-center p-4 bg-obsidian-100 min-h-0">
            <div className={`bg-white shadow-2xl transition-all duration-300 ease-in-out h-full ${
              device === 'mobile' ? 'w-[375px]' : 
              device === 'tablet' ? 'w-[768px]' : 'w-full'
            }`}>
              <iframe
                ref={iframeRef}
                src="http://localhost:3000?editMode=true"
                className="w-full h-full border-0"
                title="Live Preview"
                allow="clipboard-write; clipboard-read"
              />
            </div>
          </div>
        </div>

      </div>

      <SaveBar onSave={handleSave} saving={saving} />
    </AdminLayout>
  );
}