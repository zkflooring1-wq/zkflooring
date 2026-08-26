"use client";

import { useState, useEffect, useRef } from "react";
import AdminLayout from "@/components/layout/AdminLayout";
import FormField from "@/components/ui/FormField";
import SaveBar from "@/components/ui/SaveBar";
import LoadingState from "@/components/ui/LoadingState";
import toast from "react-hot-toast";
import { Monitor, Smartphone, Tablet, Plus, Trash2, RotateCw } from "lucide-react";

const TABS = [
  "Breadcrumb",
  "Header Section",
  "FAQ Questions",
  "Consultation Box",
  "SEO Configuration"
];

const DEFAULT_FAQ_DATA = {
  breadcrumb: {
    title: "Frequently Asked Questions",
    subtitle: "FAQ"
  },
  header: {
    badge: "Got Questions?",
    title: "Everything You Need to Know",
    description: "Clear, transparent answers about our flooring materials, subfloor levelling, free in-home sample visits, and trade guarantees."
  },
  items: [
    {
      id: 1,
      category: 'Surveys & Quotes',
      question: 'Do you offer free home surveys and measurements in Birmingham?',
      answer: 'Yes, 100% free with zero obligation. We visit your home or business with our mobile showroom featuring hundreds of carpet, LVT, hardwood, and laminate samples. We take laser-accurate measurements and provide a transparent, fixed quote.',
    },
    {
      id: 2,
      category: 'Installation & Prep',
      question: 'Do I need to prepare my subfloor or remove old flooring?',
      answer: 'Our team handles complete end-to-end preparation. We test for moisture (DPM), remove and responsibly dispose of old flooring, repair uneven surfaces, install ply boarding, and apply latex self-levelling screed to guarantee a mirror-flat, durable base.',
    },
    {
      id: 3,
      category: 'Materials & LVT',
      question: 'What is the difference between LVT (Luxury Vinyl Tile) and laminate flooring?',
      answer: 'LVT is 100% waterproof, exceptionally durable, and ideal for moisture-prone areas like kitchens, bathrooms, and hallways. It can be installed in custom patterns like herringbone. Laminate provides the authentic look of real timber at a cost-effective price point, offering superior scratch resistance for living areas and bedrooms.',
    },
    {
      id: 4,
      category: 'Timing & Process',
      question: 'How long does a typical flooring installation take?',
      answer: 'Most single-room or staircase carpet/laminate installations are completed within 1 working day. Full house installations or commercial projects typically take 2 to 4 days depending on required subfloor preparation and curing times.',
    },
    {
      id: 5,
      category: 'Guarantees & Insurance',
      question: 'Do you provide a guarantee on your workmanship?',
      answer: 'Yes, all ZK Flooring installations are backed by our comprehensive 10-Year Trade Workmanship Guarantee alongside manufacturer product warranties. We are also fully covered by £5,000,000 Public Liability Insurance for complete peace of mind.',
    },
  ],
  callout: {
    subtitle: "Still Have A Specific Question?",
    phone: "07903 723 774",
    cta_text: "Ask Our Specialists",
    cta_link: "/contact"
  }
};

export default function FAQPageEditor() {
  const [activeTab, setActiveTab] = useState(TABS[0]);
  const [data, setData] = useState<any>(DEFAULT_FAQ_DATA);
  const [seo, setSeo] = useState({ seoTitle: "", seoDescription: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [device, setDevice] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [previewKey, setPreviewKey] = useState(0);

  useEffect(() => {
    fetch(`/api/pages/faq`)
      .then((r) => r.json())
      .then((d) => {
        const sections = d.page?.sections || {};
        const merged = {
          breadcrumb: { ...DEFAULT_FAQ_DATA.breadcrumb, ...(sections.breadcrumb || {}) },
          header: { ...DEFAULT_FAQ_DATA.header, ...(sections.header || {}) },
          items: sections.items && Array.isArray(sections.items) && sections.items.length > 0
            ? sections.items 
            : DEFAULT_FAQ_DATA.items,
          callout: { ...DEFAULT_FAQ_DATA.callout, ...(sections.callout || {}) },
        };
        setData(merged);
        if (d.page?.seo_data) {
          setSeo({
            seoTitle: d.page.seo_data.seoTitle || "",
            seoDescription: d.page.seo_data.seoDescription || "",
          });
        }
      })
      .catch(() => toast.error("Failed to load page data"))
      .finally(() => setLoading(false));

    const handleMessage = (e: MessageEvent) => {
      if (e.data?.type === 'FIELD_CLICKED') {
        const path = e.data.path || '';
        if (path.startsWith('breadcrumb')) setActiveTab("Breadcrumb");
        else if (path.startsWith('header')) setActiveTab("Header Section");
        else if (path.startsWith('items')) setActiveTab("FAQ Questions");
        else if (path.startsWith('callout')) setActiveTab("Consultation Box");
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
      const res = await fetch(`/api/pages/faq`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: "FAQ",
          sections: data,
          seo_data: seo
        })
      });
      if (!res.ok) throw new Error();
      toast.success("FAQ page saved successfully!");
    } catch {
      toast.error("Failed to save changes");
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

  const addFaqItem = () => {
    const newItem = {
      id: Date.now(),
      category: 'General',
      question: 'New Question Title',
      answer: 'Answer to the question goes here with complete helpful details.'
    };
    const newItems = [...(data.items || []), newItem];
    updateSection('items', newItems);
  };

  const removeFaqItem = (index: number) => {
    const newItems = (data.items || []).filter((_: any, i: number) => i !== index);
    if (newItems.length === 0) {
      toast.error("You must have at least one question");
      return;
    }
    updateSection('items', newItems);
  };

  if (loading) {
    return (
      <AdminLayout title="FAQ Page" breadcrumb={["Pages", "FAQ"]}>
        <LoadingState />
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="FAQ Page" breadcrumb={["Pages", "FAQ"]}>
      <div className="flex flex-col lg:flex-row gap-6 pb-24 lg:h-[calc(100vh-120px)]">
        
        {/* Editor Panel (Left) */}
        <div className="w-full lg:w-1/3 flex flex-col gap-4 overflow-y-auto pr-2 custom-scrollbar">
          {/* Tabs List */}
          <div className="bg-white rounded-[var(--radius-card)] border border-obsidian-100/50 shadow-sm overflow-hidden flex-shrink-0">
            <div className="p-3 border-b border-obsidian-100 bg-obsidian-50/50 flex items-center justify-between">
              <h3 className="font-semibold text-obsidian-700 font-[var(--font-heading)] text-sm">
                Section: <span className="text-gold-700 font-bold">{activeTab}</span>
              </h3>
              <span className="text-[11px] bg-gold-50 text-gold-700 px-2 py-0.5 rounded-full border border-gold-200/50 font-medium">
                Live Edit
              </span>
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
              <div className="space-y-4 animate-in fade-in duration-200">
                <FormField label="Page Title (Heading)">
                  <input
                    type="text"
                    value={data.breadcrumb?.title || ""}
                    onChange={(e) => updateSection('breadcrumb', { ...data.breadcrumb, title: e.target.value })}
                    placeholder="Frequently Asked Questions"
                    className="w-full px-3 py-2 bg-obsidian-50/50 border border-obsidian-200 rounded-lg text-sm text-obsidian-900 font-bold focus:bg-white focus:outline-none focus:border-gold-500"
                  />
                </FormField>
                <FormField label="Breadcrumb Subtitle (Nav Link)">
                  <input
                    type="text"
                    value={data.breadcrumb?.subtitle || ""}
                    onChange={(e) => updateSection('breadcrumb', { ...data.breadcrumb, subtitle: e.target.value })}
                    placeholder="FAQ"
                    className="w-full px-3 py-2 bg-obsidian-50/50 border border-obsidian-200 rounded-lg text-sm text-obsidian-800 focus:bg-white focus:outline-none focus:border-gold-500"
                  />
                </FormField>
              </div>
            )}

            {/* Tab 2: Header Section */}
            {activeTab === "Header Section" && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <FormField label="Badge Subtitle">
                  <input
                    type="text"
                    value={data.header?.badge || ""}
                    onChange={(e) => updateSection('header', { ...data.header, badge: e.target.value })}
                    placeholder="Got Questions?"
                    className="w-full px-3 py-2 bg-obsidian-50/50 border border-obsidian-200 rounded-lg text-sm font-semibold focus:outline-none focus:border-gold-500"
                  />
                </FormField>
                <FormField label="Section Title">
                  <input
                    type="text"
                    value={data.header?.title || ""}
                    onChange={(e) => updateSection('header', { ...data.header, title: e.target.value })}
                    placeholder="Everything You Need to Know"
                    className="w-full px-3 py-2 bg-obsidian-50/50 border border-obsidian-200 rounded-lg text-sm font-bold focus:outline-none focus:border-gold-500"
                  />
                </FormField>
                <FormField label="Section Description">
                  <textarea
                    rows={3}
                    value={data.header?.description || ""}
                    onChange={(e) => updateSection('header', { ...data.header, description: e.target.value })}
                    placeholder="Clear, transparent answers about our flooring materials..."
                    className="w-full px-3 py-2 bg-obsidian-50/50 border border-obsidian-200 rounded-lg text-sm focus:outline-none focus:border-gold-500 resize-none"
                  />
                </FormField>
              </div>
            )}

            {/* Tab 3: FAQ Questions */}
            {activeTab === "FAQ Questions" && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <div className="flex justify-between items-center">
                  <h4 className="text-xs font-bold text-obsidian-800 uppercase tracking-wider">
                    Questions List ({data.items?.length || 0})
                  </h4>
                  <button
                    type="button"
                    onClick={addFaqItem}
                    className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold text-gold-700 bg-gold-50 hover:bg-gold-100 border border-gold-200 rounded-lg transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Question
                  </button>
                </div>

                <div className="space-y-3">
                  {(data.items || []).map((faq: any, idx: number) => (
                    <div key={faq.id || idx} className="p-3.5 bg-obsidian-50/70 border border-obsidian-200 rounded-xl space-y-2.5 relative group">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-mono font-bold text-gold-700">Q{idx + 1}</span>
                          <input
                            type="text"
                            value={faq.category || "General"}
                            onChange={(e) => {
                              const newItems = [...data.items];
                              newItems[idx] = { ...newItems[idx], category: e.target.value };
                              updateSection('items', newItems);
                            }}
                            placeholder="Category (e.g. Surveys & Quotes)"
                            className="px-2 py-0.5 bg-white border border-obsidian-200 rounded text-[11px] font-semibold text-obsidian-700 focus:outline-none"
                          />
                        </div>
                        {data.items.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeFaqItem(idx)}
                            className="text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-50 transition-colors"
                            title="Delete FAQ"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                      <input
                        type="text"
                        value={faq.question || ""}
                        onChange={(e) => {
                          const newItems = [...data.items];
                          newItems[idx] = { ...newItems[idx], question: e.target.value };
                          updateSection('items', newItems);
                        }}
                        placeholder="Question text"
                        className="w-full px-3 py-1.5 bg-white border border-obsidian-200 rounded-lg text-xs font-bold focus:outline-none focus:border-gold-500"
                      />
                      <textarea
                        rows={3}
                        value={faq.answer || ""}
                        onChange={(e) => {
                          const newItems = [...data.items];
                          newItems[idx] = { ...newItems[idx], answer: e.target.value };
                          updateSection('items', newItems);
                        }}
                        placeholder="Answer text"
                        className="w-full px-3 py-1.5 bg-white border border-obsidian-200 rounded-lg text-xs focus:outline-none focus:border-gold-500 resize-none"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab 4: Consultation Box */}
            {activeTab === "Consultation Box" && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <FormField label="Banner Subtitle / Top Tag">
                  <input
                    type="text"
                    value={data.callout?.subtitle || ""}
                    onChange={(e) => updateSection('callout', { ...data.callout, subtitle: e.target.value })}
                    placeholder="Still Have A Specific Question?"
                    className="w-full px-3 py-2 bg-obsidian-50/50 border border-obsidian-200 rounded-lg text-sm focus:outline-none focus:border-gold-500"
                  />
                </FormField>
                <FormField label="Phone Number">
                  <input
                    type="text"
                    value={data.callout?.phone || ""}
                    onChange={(e) => updateSection('callout', { ...data.callout, phone: e.target.value })}
                    placeholder="07903 723 774"
                    className="w-full px-3 py-2 bg-obsidian-50/50 border border-obsidian-200 rounded-lg text-sm font-bold focus:outline-none focus:border-gold-500"
                  />
                </FormField>
                <FormField label="CTA Button Text">
                  <input
                    type="text"
                    value={data.callout?.cta_text || ""}
                    onChange={(e) => updateSection('callout', { ...data.callout, cta_text: e.target.value })}
                    placeholder="Ask Our Specialists"
                    className="w-full px-3 py-2 bg-obsidian-50/50 border border-obsidian-200 rounded-lg text-sm focus:outline-none focus:border-gold-500"
                  />
                </FormField>
                <FormField label="CTA Button Link">
                  <input
                    type="text"
                    value={data.callout?.cta_link || ""}
                    onChange={(e) => updateSection('callout', { ...data.callout, cta_link: e.target.value })}
                    placeholder="/contact"
                    className="w-full px-3 py-2 bg-obsidian-50/50 border border-obsidian-200 rounded-lg text-sm focus:outline-none focus:border-gold-500"
                  />
                </FormField>
              </div>
            )}

            {/* Tab 5: SEO Configuration */}
            {activeTab === "SEO Configuration" && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <FormField label="SEO Meta Title">
                  <input
                    type="text"
                    value={seo.seoTitle}
                    onChange={(e) => setSeo(p => ({ ...p, seoTitle: e.target.value }))}
                    placeholder="Frequently Asked Questions | ZK Flooring Birmingham"
                    className="w-full px-3 py-2 bg-obsidian-50/50 border border-obsidian-200 rounded-lg text-sm focus:outline-none focus:border-gold-500"
                  />
                </FormField>
                <FormField label="SEO Meta Description">
                  <textarea
                    rows={4}
                    value={seo.seoDescription}
                    onChange={(e) => setSeo(p => ({ ...p, seoDescription: e.target.value }))}
                    placeholder="Clear, transparent answers about our flooring materials, subfloor levelling..."
                    className="w-full px-3 py-2 bg-obsidian-50/50 border border-obsidian-200 rounded-lg text-sm focus:outline-none focus:border-gold-500 resize-none"
                  />
                </FormField>
              </div>
            )}

          </div>
        </div>

        {/* Visual Preview Panel (Right) */}
        <div className="w-full lg:w-2/3 bg-obsidian-50 rounded-[var(--radius-card)] border border-obsidian-200 shadow-inner overflow-hidden flex flex-col min-h-[600px] lg:h-full">
          <div className="bg-obsidian-800 text-white p-2.5 flex items-center justify-between shadow-md z-10">
            <div className="flex items-center gap-2 px-2">
              <div className="w-3 h-3 rounded-full bg-red-400"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
              <div className="w-3 h-3 rounded-full bg-green-400"></div>
              <span className="ml-3 text-xs font-mono text-obsidian-300 hidden sm:inline">
                FAQ Page Live Preview (Interactive)
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setPreviewKey(k => k + 1)}
                title="Reload Preview"
                className="p-1.5 rounded hover:bg-obsidian-700 text-obsidian-300 hover:text-white transition-colors"
              >
                <RotateCw className="w-3.5 h-3.5" />
              </button>
              <div className="h-4 w-px bg-obsidian-700 mx-1"></div>
              <button 
                onClick={() => setDevice('mobile')} 
                title="Mobile View"
                className={`p-1.5 rounded transition-colors ${device === 'mobile' ? 'bg-gold-500/20 text-gold-400' : 'text-obsidian-400 hover:bg-obsidian-700 hover:text-white'}`}
              >
                <Smartphone className="w-4 h-4" />
              </button>
              <button 
                onClick={() => setDevice('tablet')} 
                title="Tablet View"
                className={`p-1.5 rounded transition-colors ${device === 'tablet' ? 'bg-gold-500/20 text-gold-400' : 'text-obsidian-400 hover:bg-obsidian-700 hover:text-white'}`}
              >
                <Tablet className="w-4 h-4" />
              </button>
              <button 
                onClick={() => setDevice('desktop')} 
                title="Desktop View"
                className={`p-1.5 rounded transition-colors ${device === 'desktop' ? 'bg-gold-500/20 text-gold-400' : 'text-obsidian-400 hover:bg-obsidian-700 hover:text-white'}`}
              >
                <Monitor className="w-4 h-4" />
              </button>
            </div>
          </div>
          
          <div className="flex-1 flex justify-center p-4 bg-obsidian-100 min-h-0 overflow-hidden">
            <div className={`bg-white shadow-2xl transition-all duration-300 ease-in-out h-full rounded-lg overflow-hidden ${
              device === 'mobile' ? 'w-[375px]' : 
              device === 'tablet' ? 'w-[768px]' : 'w-full'
            }`}>
              <iframe
                key={previewKey}
                ref={iframeRef}
                src="http://localhost:3000/faq?editMode=true"
                className="w-full h-full border-0"
                title="FAQ Live Preview"
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
