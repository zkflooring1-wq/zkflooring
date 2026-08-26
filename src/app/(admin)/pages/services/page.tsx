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
  "Services Header",
  "4-Step Workflow",
  "Consultation Banner",
  "SEO Configuration"
];

const DEFAULT_SERVICES_DATA = {
  breadcrumb: {
    title: "Our Services",
    subtitle: "Services"
  },
  services_header: {
    badge: "Our Services",
    title: "Premium Flooring Services for <br class=\"d-none d-sm-block\" />Residential & Commercial Spaces",
    description: "Expert supply, subfloor preparation, and certified installation across Birmingham and the West Midlands."
  },
  workflow: {
    badge: "Our Seamless Process",
    title: "How We Deliver Flawless Flooring in 4 Simple Steps",
    description: "From our initial free mobile showroom survey to the final bespoke trim, our trade-certified installers make the entire experience smooth and stress-free.",
    steps: [
      {
        num: "01",
        title: "Free Home Survey",
        desc: "We bring 100s of luxury samples directly to your door, take precision laser measurements, and provide a fixed quote."
      },
      {
        num: "02",
        title: "Subfloor Prep",
        desc: "DPM moisture barrier testing, ply boarding, and latex self-levelling screed to create a mirror-flat, stable foundation."
      },
      {
        num: "03",
        title: "Master Fitting",
        desc: "Expert installation by certified fitters with seamless stretching, herringbone alignments, and custom door/skirting trims."
      },
      {
        num: "04",
        title: "Cleanup & Warranty",
        desc: "Complete dust-controlled cleanup, off-cut removal, furniture replaced, and your 10-year trade warranty certificate."
      }
    ]
  },
  callout: {
    subtitle: "Speak Directly With Our Fitters",
    phone: "07903 723 774",
    cta_text: "Book Free Home Survey",
    cta_link: "/contact"
  }
};

export default function ServicesPageEditor() {
  const [activeTab, setActiveTab] = useState(TABS[0]);
  const [data, setData] = useState<any>(DEFAULT_SERVICES_DATA);
  const [seo, setSeo] = useState({ seoTitle: "", seoDescription: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [device, setDevice] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [previewKey, setPreviewKey] = useState(0);

  useEffect(() => {
    fetch(`/api/pages/services`)
      .then((r) => r.json())
      .then((d) => {
        const sections = d.page?.sections || {};
        const merged = {
          breadcrumb: { ...DEFAULT_SERVICES_DATA.breadcrumb, ...(sections.breadcrumb || {}) },
          services_header: { ...DEFAULT_SERVICES_DATA.services_header, ...(sections.services_header || {}) },
          workflow: { 
            ...DEFAULT_SERVICES_DATA.workflow, 
            ...(sections.workflow || {}),
            steps: sections.workflow?.steps && Array.isArray(sections.workflow.steps) && sections.workflow.steps.length > 0
              ? sections.workflow.steps 
              : DEFAULT_SERVICES_DATA.workflow.steps
          },
          callout: { ...DEFAULT_SERVICES_DATA.callout, ...(sections.callout || {}) },
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
        else if (path.startsWith('services_header')) setActiveTab("Services Header");
        else if (path.startsWith('workflow')) setActiveTab("4-Step Workflow");
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
      const res = await fetch(`/api/pages/services`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: "Services",
          sections: data,
          seo_data: seo
        })
      });
      if (!res.ok) throw new Error();
      toast.success("Services page saved successfully!");
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

  const addWorkflowStep = () => {
    const currentSteps = data.workflow?.steps || [];
    const nextNum = String(currentSteps.length + 1).padStart(2, '0');
    const newStep = {
      num: nextNum,
      title: "New Installation Step",
      desc: "Detailed description of this workflow step for the client."
    };
    const updated = {
      ...data.workflow,
      steps: [...currentSteps, newStep]
    };
    updateSection('workflow', updated);
  };

  const removeWorkflowStep = (indexToRemove: number) => {
    const currentSteps = data.workflow?.steps || [];
    if (currentSteps.length <= 1) {
      toast.error("You must have at least one workflow step");
      return;
    }
    const updated = {
      ...data.workflow,
      steps: currentSteps.filter((_: any, idx: number) => idx !== indexToRemove)
    };
    updateSection('workflow', updated);
  };

  if (loading) {
    return (
      <AdminLayout title="Services Page" breadcrumb={["Pages", "Services"]}>
        <LoadingState />
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Services Page" breadcrumb={["Pages", "Services"]}>
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
                    placeholder="Our Services"
                    className="w-full px-3 py-2 bg-obsidian-50/50 border border-obsidian-200 rounded-lg text-sm text-obsidian-900 font-bold focus:bg-white focus:outline-none focus:border-gold-500"
                  />
                </FormField>
                <FormField label="Breadcrumb Subtitle (Nav text)">
                  <input
                    type="text"
                    value={data.breadcrumb?.subtitle || ""}
                    onChange={(e) => updateSection('breadcrumb', { ...data.breadcrumb, subtitle: e.target.value })}
                    placeholder="Services"
                    className="w-full px-3 py-2 bg-obsidian-50/50 border border-obsidian-200 rounded-lg text-sm text-obsidian-800 focus:bg-white focus:outline-none focus:border-gold-500"
                  />
                </FormField>
              </div>
            )}

            {/* Tab 2: Services Header */}
            {activeTab === "Services Header" && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <FormField label="Badge Label">
                  <input
                    type="text"
                    value={data.services_header?.badge || ""}
                    onChange={(e) => updateSection('services_header', { ...data.services_header, badge: e.target.value })}
                    placeholder="Our Services"
                    className="w-full px-3 py-2 bg-obsidian-50/50 border border-obsidian-200 rounded-lg text-sm font-semibold focus:outline-none focus:border-gold-500"
                  />
                </FormField>
                <FormField label="Section Main Title (Supports HTML)">
                  <textarea
                    rows={2}
                    value={data.services_header?.title || ""}
                    onChange={(e) => updateSection('services_header', { ...data.services_header, title: e.target.value })}
                    placeholder="Premium Flooring Services for..."
                    className="w-full px-3 py-2 bg-obsidian-50/50 border border-obsidian-200 rounded-lg text-sm font-bold focus:outline-none focus:border-gold-500 resize-none"
                  />
                </FormField>
                <FormField label="Section Description / Subheading">
                  <textarea
                    rows={3}
                    value={data.services_header?.description || ""}
                    onChange={(e) => updateSection('services_header', { ...data.services_header, description: e.target.value })}
                    placeholder="Expert supply, subfloor preparation..."
                    className="w-full px-3 py-2 bg-obsidian-50/50 border border-obsidian-200 rounded-lg text-sm focus:outline-none focus:border-gold-500 resize-none"
                  />
                </FormField>
                <div className="p-3 bg-gold-50/50 border border-gold-200/50 rounded-xl">
                  <p className="text-xs text-gold-900 leading-relaxed">
                    💡 <strong>Tip:</strong> Individual service cards (Carpet, LVT, Hardwood, etc.) can also be added or managed in the <strong>Services</strong> menu on the sidebar.
                  </p>
                </div>
              </div>
            )}

            {/* Tab 3: 4-Step Workflow */}
            {activeTab === "4-Step Workflow" && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <FormField label="Workflow Badge Text">
                  <input
                    type="text"
                    value={data.workflow?.badge || ""}
                    onChange={(e) => updateSection('workflow', { ...data.workflow, badge: e.target.value })}
                    placeholder="Our Seamless Process"
                    className="w-full px-3 py-2 bg-obsidian-50/50 border border-obsidian-200 rounded-lg text-sm font-semibold focus:outline-none focus:border-gold-500"
                  />
                </FormField>
                <FormField label="Workflow Main Title">
                  <textarea
                    rows={2}
                    value={data.workflow?.title || ""}
                    onChange={(e) => updateSection('workflow', { ...data.workflow, title: e.target.value })}
                    placeholder="How We Deliver Flawless Flooring in 4 Simple Steps"
                    className="w-full px-3 py-2 bg-obsidian-50/50 border border-obsidian-200 rounded-lg text-sm font-bold focus:outline-none focus:border-gold-500 resize-none"
                  />
                </FormField>
                <FormField label="Workflow Description">
                  <textarea
                    rows={3}
                    value={data.workflow?.description || ""}
                    onChange={(e) => updateSection('workflow', { ...data.workflow, description: e.target.value })}
                    placeholder="From our initial free mobile showroom survey..."
                    className="w-full px-3 py-2 bg-obsidian-50/50 border border-obsidian-200 rounded-lg text-sm focus:outline-none focus:border-gold-500 resize-none"
                  />
                </FormField>

                <div className="space-y-3 pt-3 border-t border-obsidian-100">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-obsidian-800 uppercase tracking-wider">
                      Process Steps ({data.workflow?.steps?.length || 0})
                    </h4>
                    <button
                      type="button"
                      onClick={addWorkflowStep}
                      className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold text-gold-700 bg-gold-50 hover:bg-gold-100 border border-gold-200 rounded-lg transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add Step
                    </button>
                  </div>

                  {(data.workflow?.steps || []).map((st: any, idx: number) => (
                    <div key={idx} className="p-3.5 bg-obsidian-50/70 border border-obsidian-200 rounded-xl space-y-2.5 relative group">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[11px] font-bold text-gold-700">Step #{idx + 1}</span>
                        {data.workflow.steps.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeWorkflowStep(idx)}
                            className="text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-50 transition-colors"
                            title="Delete Step"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>

                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={st.num || ""}
                          onChange={(e) => {
                            const newSteps = [...data.workflow.steps];
                            newSteps[idx] = { ...newSteps[idx], num: e.target.value };
                            updateSection('workflow', { ...data.workflow, steps: newSteps });
                          }}
                          placeholder="01"
                          className="w-16 px-2.5 py-1.5 bg-white border border-obsidian-200 rounded-lg text-xs font-bold text-center text-gold-700 focus:outline-none focus:border-gold-500"
                        />
                        <input
                          type="text"
                          value={st.title || ""}
                          onChange={(e) => {
                            const newSteps = [...data.workflow.steps];
                            newSteps[idx] = { ...newSteps[idx], title: e.target.value };
                            updateSection('workflow', { ...data.workflow, steps: newSteps });
                          }}
                          placeholder="Step Title"
                          className="flex-1 px-3 py-1.5 bg-white border border-obsidian-200 rounded-lg text-xs font-bold focus:outline-none focus:border-gold-500"
                        />
                      </div>

                      <textarea
                        rows={2}
                        value={st.desc || ""}
                        onChange={(e) => {
                          const newSteps = [...data.workflow.steps];
                          newSteps[idx] = { ...newSteps[idx], desc: e.target.value };
                          updateSection('workflow', { ...data.workflow, steps: newSteps });
                        }}
                        placeholder="Step Description..."
                        className="w-full px-3 py-1.5 bg-white border border-obsidian-200 rounded-lg text-xs focus:outline-none focus:border-gold-500 resize-none"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab 4: Consultation Banner */}
            {activeTab === "Consultation Banner" && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <FormField label="Banner Subtitle / Top Tag">
                  <input
                    type="text"
                    value={data.callout?.subtitle || ""}
                    onChange={(e) => updateSection('callout', { ...data.callout, subtitle: e.target.value })}
                    placeholder="Speak Directly With Our Fitters"
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
                    placeholder="Book Free Home Survey"
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
                    placeholder="Our Flooring Services | ZK Flooring Birmingham"
                    className="w-full px-3 py-2 bg-obsidian-50/50 border border-obsidian-200 rounded-lg text-sm focus:outline-none focus:border-gold-500"
                  />
                </FormField>
                <FormField label="SEO Meta Description">
                  <textarea
                    rows={4}
                    value={seo.seoDescription}
                    onChange={(e) => setSeo(p => ({ ...p, seoDescription: e.target.value }))}
                    placeholder="Explore ZK Flooring's comprehensive installation services..."
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
                Services Page Live Preview (Interactive)
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
                src="http://localhost:3000/services?editMode=true"
                className="w-full h-full border-0"
                title="Services Live Preview"
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
