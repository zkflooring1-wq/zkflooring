"use client";

import { useState, useEffect, useRef } from "react";
import AdminLayout from "@/components/layout/AdminLayout";
import FormField from "@/components/ui/FormField";
import ImageUploader from "@/components/ui/ImageUploader";
import SaveBar from "@/components/ui/SaveBar";
import LoadingState from "@/components/ui/LoadingState";
import toast from "react-hot-toast";
import { Monitor, Smartphone, Tablet } from "lucide-react";

const TABS = [
  "Breadcrumb",
  "Features & Proof",
  "Story Showcase",
  "Editorial & Metrics",
  "Standards & Quality",
  "Track Record Stats"
];

const DEFAULT_ABOUT_DATA = {
  breadcrumb: {
    title: "About Us",
    subtitle: "About Us"
  },
  features: {
    social_proof_count: "3,600",
    social_proof_label: "Satisfied Property Owners",
    social_proof_images: [
      "/assets/images/social/social-img01.webp",
      "/assets/images/social/social-img02.webp",
      "/assets/images/social/social-img03.webp"
    ],
    boxes: [
      {
        icon: "/assets/images/feature/hm1-icon01.webp",
        title: "Residential & Commercial <br />Flooring",
        description: "Expert supply and precision installation of luxury carpet, hardwood, LVT, and vinyl for homes and offices across Birmingham."
      },
      {
        icon: "/assets/images/feature/hm1-icon02.webp",
        title: "Subfloor Preparation <br />& Self-Levelling",
        description: "Flawless subfloor levelling, latex screeding, and ply boarding ensuring perfectly smooth, durable surfaces."
      }
    ]
  },
  showcase: {
    main_image: "/about page/1.webp",
    fitter_image: "/about page/2.webp",
    fitter_name: "ZK FLOORING",
    fitter_title: "Master Flooring Installer",
    experience_years: "15",
    experience_label: "Years of Trade Excellence"
  },
  editorial: {
    badge: "Get to Know Us",
    title: "Transforming Birmingham Properties with Precision Flooring Solutions",
    description: "ZK Flooring is Birmingham's trusted specialist for premium carpet, hardwood, LVT, laminate, and commercial vinyl installations. We deliver unmatched craftsmanship, reliability, and top-tier materials to every project across the West Midlands.",
    metrics: [
      {
        title: "Carpet & Underlay Fitting",
        tag: "98% Satisfaction",
        progress: "98%",
        desc: "Luxury high-tog underlays, invisible seam joins, and tailored staircase runners."
      },
      {
        title: "Hardwood & LVT Installation",
        tag: "95% Accuracy Score",
        progress: "95%",
        desc: "Subfloor latex screeding, herringbone patterns, and premium Amtico & Karndean LVT."
      }
    ],
    cta_text: "Request Free Survey",
    cta_link: "/contact",
    phone: "07903 723 774",
    phone_link: "tel:07903723774"
  },
  standards: {
    badge: "Why Choose ZK Flooring",
    title: "The Craftsmanship Standards That Set Us Apart",
    description: "From precision subfloor preparation to the final bespoke trim, we deliver flawless results backed by transparent pricing, expert master fitters, and total peace of mind.",
    cards: [
      {
        icon: "fa-solid fa-ruler-combined",
        tag: "Precision Prep",
        title: "Laser-Leveled Subfloor Prep",
        desc: "Moisture testing, ply boarding, and latex self-levelling screeding to ensure your floors stay perfectly flat, silent, and stable."
      },
      {
        icon: "fa-solid fa-truck-fast",
        tag: "Convenience",
        title: "Free Home Survey & Samples",
        desc: "We bring hundreds of luxury carpet, LVT, and hardwood samples right to your door for accurate in-room color matching and measuring."
      },
      {
        icon: "fa-solid fa-wand-magic-sparkles",
        tag: "Zero Mess",
        title: "White-Glove Property Care",
        desc: "We treat your home with total respect. Furniture moving, precise door trimming, dust-contained cutting, and spotless cleanup."
      },
      {
        icon: "fa-solid fa-shield-halved",
        tag: "Guaranteed",
        title: "10-Year Trade Guarantee",
        desc: "Every installation is backed by our comprehensive 10-year workmanship guarantee and £5M full public liability insurance cover."
      }
    ]
  },
  achievements: {
    subtitle: "Our Track Record",
    title: "Trusted by Homeowners & Businesses Across Birmingham & Beyond",
    description: "ZK Flooring has delivered premium carpet, LVT, hardwood, and commercial vinyl installations to over 3,600 satisfied property owners across the West Midlands.",
    phone: "07903 723 774",
    stats: [
      { number: "3,600+", label: "Projects Completed", desc: "Homes & commercial properties fitted" },
      { number: "15+", label: "Years of Experience", desc: "Master floor fitting craftsmanship" },
      { number: "98%", label: "Customer Satisfaction", desc: "5-star verified reviews & ratings" },
      { number: "6+", label: "Flooring Categories", desc: "Carpet, LVT, Wood, Vinyl & Screed" }
    ]
  }
};

export default function AboutPageEditor() {
  const [activeTab, setActiveTab] = useState(TABS[0]);
  const [data, setData] = useState<any>(DEFAULT_ABOUT_DATA);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [device, setDevice] = useState<"desktop" | "tablet" | "mobile">("desktop");

  useEffect(() => {
    fetch(`/api/pages/about`)
      .then((r) => r.json())
      .then((d) => {
        const sections = d.page?.sections || {};
        const merged = {
          breadcrumb: { ...DEFAULT_ABOUT_DATA.breadcrumb, ...(sections.breadcrumb || {}) },
          features: { ...DEFAULT_ABOUT_DATA.features, ...(sections.features || {}) },
          showcase: { ...DEFAULT_ABOUT_DATA.showcase, ...(sections.showcase || {}) },
          editorial: { ...DEFAULT_ABOUT_DATA.editorial, ...(sections.editorial || {}) },
          standards: { ...DEFAULT_ABOUT_DATA.standards, ...(sections.standards || {}) },
          achievements: { ...DEFAULT_ABOUT_DATA.achievements, ...(sections.achievements || {}) },
        };
        setData(merged);
      })
      .catch(() => toast.error("Failed to load page data"))
      .finally(() => setLoading(false));

    const handleMessage = (e: MessageEvent) => {
      if (e.data?.type === 'FIELD_CLICKED') {
        const path = e.data.path;
        if (path.startsWith('breadcrumb')) setActiveTab("Breadcrumb");
        else if (path.startsWith('features')) setActiveTab("Features & Proof");
        else if (path.startsWith('showcase')) setActiveTab("Story Showcase");
        else if (path.startsWith('editorial')) setActiveTab("Editorial & Metrics");
        else if (path.startsWith('standards')) setActiveTab("Standards & Quality");
        else if (path.startsWith('achievements')) setActiveTab("Track Record Stats");
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
      const res = await fetch(`/api/pages/about`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: "About",
          sections: data,
        })
      });
      if (!res.ok) throw new Error();
      toast.success("About page updated!");
    } catch {
      toast.error("Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const updateSection = (sectionKey: string, sectionData: any) => {
    setData((prev: any) => {
      const newData = { ...prev, [sectionKey]: sectionData };
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
      <AdminLayout title="About Page" breadcrumb={["Pages", "About"]}>
        <LoadingState />
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="About Page" breadcrumb={["Pages", "About"]}>
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

          {/* Form Content */}
          <div className="bg-white rounded-[var(--radius-card)] border border-obsidian-100/50 shadow-sm p-5 flex-1 min-h-0 overflow-y-auto space-y-4">
            
            {/* Tab 1: Breadcrumb */}
            {activeTab === "Breadcrumb" && (
              <div className="space-y-4">
                <FormField label="Page Title">
                  <input
                    type="text"
                    value={data.breadcrumb?.title || ""}
                    onChange={(e) => updateSection('breadcrumb', { ...data.breadcrumb, title: e.target.value })}
                    className="w-full px-3 py-2 bg-obsidian-50/50 border border-obsidian-200 rounded-lg text-sm text-obsidian-900 font-bold focus:bg-white focus:outline-none focus:border-gold-500"
                  />
                </FormField>
                <FormField label="Breadcrumb Subtitle">
                  <input
                    type="text"
                    value={data.breadcrumb?.subtitle || ""}
                    onChange={(e) => updateSection('breadcrumb', { ...data.breadcrumb, subtitle: e.target.value })}
                    className="w-full px-3 py-2 bg-obsidian-50/50 border border-obsidian-200 rounded-lg text-sm text-obsidian-800 focus:bg-white focus:outline-none focus:border-gold-500"
                  />
                </FormField>
              </div>
            )}

            {/* Tab 2: Features & Proof */}
            {activeTab === "Features & Proof" && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <FormField label="Social Proof Count">
                    <input
                      type="text"
                      value={data.features?.social_proof_count || ""}
                      onChange={(e) => updateSection('features', { ...data.features, social_proof_count: e.target.value })}
                      className="w-full px-3 py-2 bg-obsidian-50/50 border border-obsidian-200 rounded-lg text-sm text-obsidian-900 font-bold focus:bg-white focus:outline-none focus:border-gold-500"
                    />
                  </FormField>
                  <FormField label="Proof Label">
                    <input
                      type="text"
                      value={data.features?.social_proof_label || ""}
                      onChange={(e) => updateSection('features', { ...data.features, social_proof_label: e.target.value })}
                      className="w-full px-3 py-2 bg-obsidian-50/50 border border-obsidian-200 rounded-lg text-sm text-obsidian-800 focus:bg-white focus:outline-none focus:border-gold-500"
                    />
                  </FormField>
                </div>

                <div className="pt-2 border-t border-obsidian-100 space-y-4">
                  <h4 className="text-xs font-bold text-obsidian-700">Feature Boxes (2)</h4>
                  {(data.features?.boxes || []).map((box: any, bIdx: number) => (
                    <div key={bIdx} className="p-3 bg-obsidian-50/50 border border-obsidian-200 rounded-xl space-y-2">
                      <span className="text-xs font-mono font-bold text-gold-700">BOX 0{bIdx + 1}</span>
                      <FormField label="Box Title (HTML allowed)">
                        <input
                          type="text"
                          value={box.title || ""}
                          onChange={(e) => {
                            const newBoxes = [...data.features.boxes];
                            newBoxes[bIdx] = { ...newBoxes[bIdx], title: e.target.value };
                            updateSection('features', { ...data.features, boxes: newBoxes });
                          }}
                          className="w-full px-3 py-1.5 bg-white border border-obsidian-200 rounded-lg text-xs font-bold focus:outline-none focus:border-gold-500"
                        />
                      </FormField>
                      <FormField label="Box Description">
                        <textarea
                          rows={2}
                          value={box.description || ""}
                          onChange={(e) => {
                            const newBoxes = [...data.features.boxes];
                            newBoxes[bIdx] = { ...newBoxes[bIdx], description: e.target.value };
                            updateSection('features', { ...data.features, boxes: newBoxes });
                          }}
                          className="w-full px-3 py-1.5 bg-white border border-obsidian-200 rounded-lg text-xs focus:outline-none focus:border-gold-500 resize-none"
                        />
                      </FormField>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab 3: Story Showcase */}
            {activeTab === "Story Showcase" && (
              <div className="space-y-4">
                <FormField label="Main Showcase Image">
                  <ImageUploader
                    value={data.showcase?.main_image || ""}
                    onChange={(url) => updateSection('showcase', { ...data.showcase, main_image: url })}
                  />
                </FormField>

                <div className="grid grid-cols-2 gap-3 pt-2 border-t border-obsidian-100">
                  <FormField label="Fitter Portrait Image">
                    <ImageUploader
                      value={data.showcase?.fitter_image || ""}
                      onChange={(url) => updateSection('showcase', { ...data.showcase, fitter_image: url })}
                    />
                  </FormField>
                  <div className="space-y-2">
                    <FormField label="Fitter Name">
                      <input
                        type="text"
                        value={data.showcase?.fitter_name || ""}
                        onChange={(e) => updateSection('showcase', { ...data.showcase, fitter_name: e.target.value })}
                        className="w-full px-3 py-1.5 bg-obsidian-50/50 border border-obsidian-200 rounded-lg text-xs font-bold focus:outline-none focus:border-gold-500"
                      />
                    </FormField>
                    <FormField label="Fitter Title">
                      <input
                        type="text"
                        value={data.showcase?.fitter_title || ""}
                        onChange={(e) => updateSection('showcase', { ...data.showcase, fitter_title: e.target.value })}
                        className="w-full px-3 py-1.5 bg-obsidian-50/50 border border-obsidian-200 rounded-lg text-xs focus:outline-none focus:border-gold-500"
                      />
                    </FormField>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2 border-t border-obsidian-100">
                  <FormField label="Experience Years">
                    <input
                      type="text"
                      value={data.showcase?.experience_years || ""}
                      onChange={(e) => updateSection('showcase', { ...data.showcase, experience_years: e.target.value })}
                      className="w-full px-3 py-2 bg-obsidian-50/50 border border-obsidian-200 rounded-lg text-sm font-bold focus:outline-none focus:border-gold-500"
                    />
                  </FormField>
                  <FormField label="Experience Badge Text">
                    <input
                      type="text"
                      value={data.showcase?.experience_label || ""}
                      onChange={(e) => updateSection('showcase', { ...data.showcase, experience_label: e.target.value })}
                      className="w-full px-3 py-2 bg-obsidian-50/50 border border-obsidian-200 rounded-lg text-sm focus:outline-none focus:border-gold-500"
                    />
                  </FormField>
                </div>
              </div>
            )}

            {/* Tab 4: Editorial & Metrics */}
            {activeTab === "Editorial & Metrics" && (
              <div className="space-y-4">
                <FormField label="Badge Subtitle">
                  <input
                    type="text"
                    value={data.editorial?.badge || ""}
                    onChange={(e) => updateSection('editorial', { ...data.editorial, badge: e.target.value })}
                    className="w-full px-3 py-2 bg-obsidian-50/50 border border-obsidian-200 rounded-lg text-sm text-obsidian-800 font-semibold focus:outline-none focus:border-gold-500"
                  />
                </FormField>
                <FormField label="Editorial Title (HTML allowed)">
                  <textarea
                    rows={2}
                    value={data.editorial?.title || ""}
                    onChange={(e) => updateSection('editorial', { ...data.editorial, title: e.target.value })}
                    className="w-full px-3 py-2 bg-obsidian-50/50 border border-obsidian-200 rounded-lg text-sm font-bold focus:outline-none focus:border-gold-500 resize-none font-mono"
                  />
                </FormField>
                <FormField label="Editorial Description">
                  <textarea
                    rows={3}
                    value={data.editorial?.description || ""}
                    onChange={(e) => updateSection('editorial', { ...data.editorial, description: e.target.value })}
                    className="w-full px-3 py-2 bg-obsidian-50/50 border border-obsidian-200 rounded-lg text-sm focus:outline-none focus:border-gold-500 resize-none"
                  />
                </FormField>

                <div className="grid grid-cols-2 gap-3 pt-2 border-t border-obsidian-100">
                  <FormField label="Button Label">
                    <input
                      type="text"
                      value={data.editorial?.cta_text || ""}
                      onChange={(e) => updateSection('editorial', { ...data.editorial, cta_text: e.target.value })}
                      className="w-full px-3 py-2 bg-obsidian-50/50 border border-obsidian-200 rounded-lg text-sm focus:outline-none focus:border-gold-500"
                    />
                  </FormField>
                  <FormField label="Phone Number">
                    <input
                      type="text"
                      value={data.editorial?.phone || ""}
                      onChange={(e) => updateSection('editorial', { ...data.editorial, phone: e.target.value })}
                      className="w-full px-3 py-2 bg-obsidian-50/50 border border-obsidian-200 rounded-lg text-sm font-bold focus:outline-none focus:border-gold-500"
                    />
                  </FormField>
                </div>
              </div>
            )}

            {/* Tab 5: Standards & Quality */}
            {activeTab === "Standards & Quality" && (
              <div className="space-y-4">
                <FormField label="Section Title">
                  <input
                    type="text"
                    value={data.standards?.title || ""}
                    onChange={(e) => updateSection('standards', { ...data.standards, title: e.target.value })}
                    className="w-full px-3 py-2 bg-obsidian-50/50 border border-obsidian-200 rounded-lg text-sm font-bold focus:outline-none focus:border-gold-500"
                  />
                </FormField>
                <FormField label="Section Description">
                  <textarea
                    rows={2}
                    value={data.standards?.description || ""}
                    onChange={(e) => updateSection('standards', { ...data.standards, description: e.target.value })}
                    className="w-full px-3 py-2 bg-obsidian-50/50 border border-obsidian-200 rounded-lg text-sm focus:outline-none focus:border-gold-500 resize-none"
                  />
                </FormField>

                <div className="space-y-3 pt-2 border-t border-obsidian-100">
                  <h4 className="text-xs font-bold text-obsidian-700">Standards Cards (4)</h4>
                  {(data.standards?.cards || []).map((card: any, cIdx: number) => (
                    <div key={cIdx} className="p-3 bg-obsidian-50/50 border border-obsidian-200 rounded-xl space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-mono font-bold text-gold-700">CARD 0{cIdx + 1}: {card.tag}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          value={card.tag || ""}
                          onChange={(e) => {
                            const newCards = [...data.standards.cards];
                            newCards[cIdx] = { ...newCards[cIdx], tag: e.target.value };
                            updateSection('standards', { ...data.standards, cards: newCards });
                          }}
                          placeholder="Tag"
                          className="px-2.5 py-1.5 bg-white border border-obsidian-200 rounded-lg text-xs font-bold focus:outline-none"
                        />
                        <input
                          type="text"
                          value={card.title || ""}
                          onChange={(e) => {
                            const newCards = [...data.standards.cards];
                            newCards[cIdx] = { ...newCards[cIdx], title: e.target.value };
                            updateSection('standards', { ...data.standards, cards: newCards });
                          }}
                          placeholder="Card Title"
                          className="px-2.5 py-1.5 bg-white border border-obsidian-200 rounded-lg text-xs font-bold focus:outline-none"
                        />
                      </div>
                      <textarea
                        rows={2}
                        value={card.desc || ""}
                        onChange={(e) => {
                          const newCards = [...data.standards.cards];
                          newCards[cIdx] = { ...newCards[cIdx], desc: e.target.value };
                          updateSection('standards', { ...data.standards, cards: newCards });
                        }}
                        className="w-full px-2.5 py-1.5 bg-white border border-obsidian-200 rounded-lg text-xs focus:outline-none resize-none"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab 6: Track Record Stats */}
            {activeTab === "Track Record Stats" && (
              <div className="space-y-4">
                <FormField label="Section Title">
                  <input
                    type="text"
                    value={data.achievements?.title || ""}
                    onChange={(e) => updateSection('achievements', { ...data.achievements, title: e.target.value })}
                    className="w-full px-3 py-2 bg-obsidian-50/50 border border-obsidian-200 rounded-lg text-sm font-bold focus:outline-none focus:border-gold-500"
                  />
                </FormField>

                <div className="space-y-3 pt-2 border-t border-obsidian-100">
                  <h4 className="text-xs font-bold text-obsidian-700">Stat Cards (4)</h4>
                  {(data.achievements?.stats || []).map((st: any, sIdx: number) => (
                    <div key={sIdx} className="p-3 bg-obsidian-50/50 border border-obsidian-200 rounded-xl space-y-2">
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          value={st.number || ""}
                          onChange={(e) => {
                            const newStats = [...data.achievements.stats];
                            newStats[sIdx] = { ...newStats[sIdx], number: e.target.value };
                            updateSection('achievements', { ...data.achievements, stats: newStats });
                          }}
                          placeholder="Stat Number (e.g. 3,600+)"
                          className="px-2.5 py-1.5 bg-white border border-obsidian-200 rounded-lg text-xs font-bold text-gold-700 focus:outline-none"
                        />
                        <input
                          type="text"
                          value={st.label || ""}
                          onChange={(e) => {
                            const newStats = [...data.achievements.stats];
                            newStats[sIdx] = { ...newStats[sIdx], label: e.target.value };
                            updateSection('achievements', { ...data.achievements, stats: newStats });
                          }}
                          placeholder="Label (e.g. Projects Completed)"
                          className="px-2.5 py-1.5 bg-white border border-obsidian-200 rounded-lg text-xs font-bold focus:outline-none"
                        />
                      </div>
                      <input
                        type="text"
                        value={st.desc || ""}
                        onChange={(e) => {
                          const newStats = [...data.achievements.stats];
                          newStats[sIdx] = { ...newStats[sIdx], desc: e.target.value };
                          updateSection('achievements', { ...data.achievements, stats: newStats });
                        }}
                        placeholder="Description (e.g. Homes & commercial properties fitted)"
                        className="w-full px-2.5 py-1.5 bg-white border border-obsidian-200 rounded-lg text-xs focus:outline-none"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>

        {/* Visual Preview Panel (Right) */}
        <div className="w-full lg:w-2/3 bg-obsidian-50 rounded-[var(--radius-card)] border border-obsidian-200 shadow-inner overflow-hidden flex flex-col min-h-[600px] lg:h-full">
          <div className="bg-obsidian-800 text-white p-2 flex items-center justify-between shadow-md z-10">
            <div className="flex items-center gap-2 px-2">
              <div className="w-3 h-3 rounded-full bg-red-400"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
              <div className="w-3 h-3 rounded-full bg-green-400"></div>
              <span className="ml-4 text-xs font-mono text-obsidian-300">About Page - Visual Editor Preview</span>
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
                src="http://localhost:3000/about?editMode=true"
                className="w-full h-full border-0"
                title="About Live Preview"
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