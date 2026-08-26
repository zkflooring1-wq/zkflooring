"use client";

import { useState, useEffect, useRef } from "react";
import AdminLayout from "@/components/layout/AdminLayout";
import FormField from "@/components/ui/FormField";
import SaveBar from "@/components/ui/SaveBar";
import LoadingState from "@/components/ui/LoadingState";
import toast from "react-hot-toast";
import { Monitor, Smartphone, Tablet, RotateCw, ExternalLink } from "lucide-react";
import Link from "next/link";

const TABS = [
  "Breadcrumb",
  "Header & Showcase",
  "Consultation Banner",
  "SEO Configuration"
];

const DEFAULT_PROJECTS_PAGE_DATA = {
  breadcrumb: {
    title: "Our Projects",
    subtitle: "Projects"
  },
  header: {
    badge: "Completed Installations",
    title: "Our Flooring Projects",
    description: "Browse our portfolio of completed residential and commercial flooring installations across Birmingham and the West Midlands."
  },
  callout: {
    subtitle: "Have a Project in Mind?",
    phone: "07903 723 774",
    cta_text: "Request Free Project Survey",
    cta_link: "/contact"
  }
};

export default function ProjectsPageEditor() {
  const [activeTab, setActiveTab] = useState(TABS[0]);
  const [data, setData] = useState<any>(DEFAULT_PROJECTS_PAGE_DATA);
  const [seo, setSeo] = useState({ seoTitle: "", seoDescription: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [device, setDevice] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [previewKey, setPreviewKey] = useState(0);

  useEffect(() => {
    fetch(`/api/pages/projects`)
      .then((r) => r.json())
      .then((d) => {
        const sections = d.page?.sections || {};
        const merged = {
          breadcrumb: { ...DEFAULT_PROJECTS_PAGE_DATA.breadcrumb, ...(sections.breadcrumb || {}) },
          header: { ...DEFAULT_PROJECTS_PAGE_DATA.header, ...(sections.header || {}) },
          callout: { ...DEFAULT_PROJECTS_PAGE_DATA.callout, ...(sections.callout || {}) },
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
        else if (path.startsWith('header')) setActiveTab("Header & Showcase");
        else if (path.startsWith('callout')) setActiveTab("Consultation Banner");
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
      const res = await fetch(`/api/pages/projects`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: "Projects",
          sections: data,
          seo_data: seo
        })
      });
      if (!res.ok) throw new Error();
      toast.success("Projects page saved successfully!");
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

  if (loading) {
    return (
      <AdminLayout title="Projects Page" breadcrumb={["Pages", "Projects"]}>
        <LoadingState />
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Projects Page" breadcrumb={["Pages", "Projects"]}>
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
                <FormField label="Page Title (Main Heading)">
                  <input
                    type="text"
                    value={data.breadcrumb?.title || ""}
                    onChange={(e) => updateSection('breadcrumb', { ...data.breadcrumb, title: e.target.value })}
                    placeholder="Our Projects"
                    className="w-full px-3 py-2 bg-obsidian-50/50 border border-obsidian-200 rounded-lg text-sm text-obsidian-900 font-bold focus:bg-white focus:outline-none focus:border-gold-500"
                  />
                </FormField>
                <FormField label="Breadcrumb Subtitle (Navigation link)">
                  <input
                    type="text"
                    value={data.breadcrumb?.subtitle || ""}
                    onChange={(e) => updateSection('breadcrumb', { ...data.breadcrumb, subtitle: e.target.value })}
                    placeholder="Projects"
                    className="w-full px-3 py-2 bg-obsidian-50/50 border border-obsidian-200 rounded-lg text-sm text-obsidian-800 focus:bg-white focus:outline-none focus:border-gold-500"
                  />
                </FormField>
              </div>
            )}

            {/* Tab 2: Header & Showcase */}
            {activeTab === "Header & Showcase" && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <FormField label="Badge Subtitle">
                  <input
                    type="text"
                    value={data.header?.badge || ""}
                    onChange={(e) => updateSection('header', { ...data.header, badge: e.target.value })}
                    placeholder="Completed Installations"
                    className="w-full px-3 py-2 bg-obsidian-50/50 border border-obsidian-200 rounded-lg text-sm font-semibold focus:outline-none focus:border-gold-500"
                  />
                </FormField>
                <FormField label="Section Title">
                  <input
                    type="text"
                    value={data.header?.title || ""}
                    onChange={(e) => updateSection('header', { ...data.header, title: e.target.value })}
                    placeholder="Our Flooring Projects"
                    className="w-full px-3 py-2 bg-obsidian-50/50 border border-obsidian-200 rounded-lg text-sm font-bold focus:outline-none focus:border-gold-500"
                  />
                </FormField>
                <FormField label="Section Description">
                  <textarea
                    rows={3}
                    value={data.header?.description || ""}
                    onChange={(e) => updateSection('header', { ...data.header, description: e.target.value })}
                    placeholder="Browse our portfolio of completed residential and commercial flooring..."
                    className="w-full px-3 py-2 bg-obsidian-50/50 border border-obsidian-200 rounded-lg text-sm focus:outline-none focus:border-gold-500 resize-none"
                  />
                </FormField>

                <div className="p-3.5 bg-gold-50/60 border border-gold-200/60 rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-gold-900">Manage Individual Projects</span>
                    <Link
                      href="/projects"
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-gold-800 hover:text-gold-950 underline"
                    >
                      Open Projects Manager <ExternalLink className="w-3 h-3" />
                    </Link>
                  </div>
                  <p className="text-xs text-gold-800 leading-relaxed">
                    To add, edit or delete individual case studies (images, client, location, duration, area), use the <strong>Projects</strong> tab in the main sidebar.
                  </p>
                </div>
              </div>
            )}

            {/* Tab 3: Consultation Banner */}
            {activeTab === "Consultation Banner" && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <FormField label="Banner Subtitle / Top Tag">
                  <input
                    type="text"
                    value={data.callout?.subtitle || ""}
                    onChange={(e) => updateSection('callout', { ...data.callout, subtitle: e.target.value })}
                    placeholder="Have a Project in Mind?"
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
                    placeholder="Request Free Project Survey"
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

            {/* Tab 4: SEO Configuration */}
            {activeTab === "SEO Configuration" && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <FormField label="SEO Meta Title">
                  <input
                    type="text"
                    value={seo.seoTitle}
                    onChange={(e) => setSeo(p => ({ ...p, seoTitle: e.target.value }))}
                    placeholder="Our Flooring Projects | ZK Flooring Birmingham"
                    className="w-full px-3 py-2 bg-obsidian-50/50 border border-obsidian-200 rounded-lg text-sm focus:outline-none focus:border-gold-500"
                  />
                </FormField>
                <FormField label="SEO Meta Description">
                  <textarea
                    rows={4}
                    value={seo.seoDescription}
                    onChange={(e) => setSeo(p => ({ ...p, seoDescription: e.target.value }))}
                    placeholder="Explore ZK Flooring's completed residential & commercial flooring projects..."
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
                Projects Page Live Preview (Interactive)
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
                src="http://localhost:3000/projects?editMode=true"
                className="w-full h-full border-0"
                title="Projects Live Preview"
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
