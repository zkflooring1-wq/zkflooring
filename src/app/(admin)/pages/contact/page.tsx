"use client";

import { useState, useEffect, useRef } from "react";
import AdminLayout from "@/components/layout/AdminLayout";
import FormField from "@/components/ui/FormField";
import SaveBar from "@/components/ui/SaveBar";
import LoadingState from "@/components/ui/LoadingState";
import toast from "react-hot-toast";
import { Monitor, Smartphone, Tablet, RotateCw } from "lucide-react";

const TABS = [
  "Breadcrumb",
  "Header Section",
  "Contact Info Cards",
  "Survey Form Copy",
  "Google Maps Embed",
  "SEO Configuration"
];

const DEFAULT_CONTACT_DATA = {
  breadcrumb: {
    title: "Contact Us",
    subtitle: "Contact Us"
  },
  header: {
    badge: "Get In Touch",
    title: "Connect with ZK Flooring Birmingham",
    description: "Ready to upgrade your home or commercial premises? Contact our certified fitters for a free estimate or to book an in-home sample survey."
  },
  details: {
    address_title: "Our Headquarters",
    address_text: "B10 9HH, Hobmoor Road, Small Heath,\nBirmingham, West Midlands, UK",
    phone_title: "Call Us Directly",
    phone_number: "07903 723 774",
    phone_hours: "Mon – Sat: 8:00 AM – 6:30 PM (Sunday Closed)",
    email_title: "Send An Email",
    email_address: "zkflooring1@gmail.com"
  },
  form: {
    badge: "Free Measuring & Samples",
    title: "Request a Free Home Survey & Quote",
    description: "Fill out the details below and our lead specialist will confirm your appointment within 2 hours."
  },
  map: {
    embed_url: "https://maps.google.com/maps?q=Hobmoor%20Road%2C%20Small%20Heath%2C%20Birmingham%20B10%209HH&t=m&z=14&output=embed&iwloc=near"
  }
};

export default function ContactPageEditor() {
  const [activeTab, setActiveTab] = useState(TABS[0]);
  const [data, setData] = useState<any>(DEFAULT_CONTACT_DATA);
  const [seo, setSeo] = useState({ seoTitle: "", seoDescription: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [device, setDevice] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [previewKey, setPreviewKey] = useState(0);

  useEffect(() => {
    fetch(`/api/pages/contact`)
      .then((r) => r.json())
      .then((d) => {
        const sections = d.page?.sections || {};
        const merged = {
          breadcrumb: { ...DEFAULT_CONTACT_DATA.breadcrumb, ...(sections.breadcrumb || {}) },
          header: { ...DEFAULT_CONTACT_DATA.header, ...(sections.header || {}) },
          details: { ...DEFAULT_CONTACT_DATA.details, ...(sections.details || {}) },
          form: { ...DEFAULT_CONTACT_DATA.form, ...(sections.form || {}) },
          map: { ...DEFAULT_CONTACT_DATA.map, ...(sections.map || {}) },
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
        else if (path.startsWith('details')) setActiveTab("Contact Info Cards");
        else if (path.startsWith('form')) setActiveTab("Survey Form Copy");
        else if (path.startsWith('map')) setActiveTab("Google Maps Embed");
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
      const res = await fetch(`/api/pages/contact`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: "Contact",
          sections: data,
          seo_data: seo
        })
      });
      if (!res.ok) throw new Error();
      toast.success("Contact page saved successfully!");
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
      <AdminLayout title="Contact Page" breadcrumb={["Pages", "Contact"]}>
        <LoadingState />
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Contact Page" breadcrumb={["Pages", "Contact"]}>
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
                    placeholder="Contact Us"
                    className="w-full px-3 py-2 bg-obsidian-50/50 border border-obsidian-200 rounded-lg text-sm text-obsidian-900 font-bold focus:bg-white focus:outline-none focus:border-gold-500"
                  />
                </FormField>
                <FormField label="Breadcrumb Subtitle (Nav Link)">
                  <input
                    type="text"
                    value={data.breadcrumb?.subtitle || ""}
                    onChange={(e) => updateSection('breadcrumb', { ...data.breadcrumb, subtitle: e.target.value })}
                    placeholder="Contact Us"
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
                    placeholder="Get In Touch"
                    className="w-full px-3 py-2 bg-obsidian-50/50 border border-obsidian-200 rounded-lg text-sm font-semibold focus:outline-none focus:border-gold-500"
                  />
                </FormField>
                <FormField label="Section Title">
                  <input
                    type="text"
                    value={data.header?.title || ""}
                    onChange={(e) => updateSection('header', { ...data.header, title: e.target.value })}
                    placeholder="Connect with ZK Flooring Birmingham"
                    className="w-full px-3 py-2 bg-obsidian-50/50 border border-obsidian-200 rounded-lg text-sm font-bold focus:outline-none focus:border-gold-500"
                  />
                </FormField>
                <FormField label="Section Description">
                  <textarea
                    rows={3}
                    value={data.header?.description || ""}
                    onChange={(e) => updateSection('header', { ...data.header, description: e.target.value })}
                    placeholder="Ready to upgrade your home or commercial premises?..."
                    className="w-full px-3 py-2 bg-obsidian-50/50 border border-obsidian-200 rounded-lg text-sm focus:outline-none focus:border-gold-500 resize-none"
                  />
                </FormField>
              </div>
            )}

            {/* Tab 3: Contact Info Cards */}
            {activeTab === "Contact Info Cards" && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <div className="p-3.5 bg-obsidian-50/70 border border-obsidian-200 rounded-xl space-y-3">
                  <h4 className="text-xs font-bold text-obsidian-800 uppercase tracking-wider">🏢 Office / Headquarters</h4>
                  <FormField label="Address Title">
                    <input
                      type="text"
                      value={data.details?.address_title || ""}
                      onChange={(e) => updateSection('details', { ...data.details, address_title: e.target.value })}
                      placeholder="Our Headquarters"
                      className="w-full px-3 py-1.5 bg-white border border-obsidian-200 rounded-lg text-xs font-bold focus:outline-none focus:border-gold-500"
                    />
                  </FormField>
                  <FormField label="Address Text (Supports Multiple Lines)">
                    <textarea
                      rows={2}
                      value={data.details?.address_text || ""}
                      onChange={(e) => updateSection('details', { ...data.details, address_text: e.target.value })}
                      placeholder="B10 9HH, Hobmoor Road, Small Heath, Birmingham..."
                      className="w-full px-3 py-1.5 bg-white border border-obsidian-200 rounded-lg text-xs focus:outline-none focus:border-gold-500 resize-none"
                    />
                  </FormField>
                </div>

                <div className="p-3.5 bg-obsidian-50/70 border border-obsidian-200 rounded-xl space-y-3">
                  <h4 className="text-xs font-bold text-obsidian-800 uppercase tracking-wider">📞 Direct Phone</h4>
                  <FormField label="Phone Title">
                    <input
                      type="text"
                      value={data.details?.phone_title || ""}
                      onChange={(e) => updateSection('details', { ...data.details, phone_title: e.target.value })}
                      placeholder="Call Us Directly"
                      className="w-full px-3 py-1.5 bg-white border border-obsidian-200 rounded-lg text-xs font-bold focus:outline-none focus:border-gold-500"
                    />
                  </FormField>
                  <FormField label="Phone Number">
                    <input
                      type="text"
                      value={data.details?.phone_number || ""}
                      onChange={(e) => updateSection('details', { ...data.details, phone_number: e.target.value })}
                      placeholder="07903 723 774"
                      className="w-full px-3 py-1.5 bg-white border border-obsidian-200 rounded-lg text-xs font-bold focus:outline-none focus:border-gold-500"
                    />
                  </FormField>
                  <FormField label="Operating Hours">
                    <input
                      type="text"
                      value={data.details?.phone_hours || ""}
                      onChange={(e) => updateSection('details', { ...data.details, phone_hours: e.target.value })}
                      placeholder="Mon – Sat: 8:00 AM – 6:30 PM (Sunday Closed)"
                      className="w-full px-3 py-1.5 bg-white border border-obsidian-200 rounded-lg text-xs focus:outline-none focus:border-gold-500"
                    />
                  </FormField>
                </div>

                <div className="p-3.5 bg-obsidian-50/70 border border-obsidian-200 rounded-xl space-y-3">
                  <h4 className="text-xs font-bold text-obsidian-800 uppercase tracking-wider">✉️ Email Support</h4>
                  <FormField label="Email Title">
                    <input
                      type="text"
                      value={data.details?.email_title || ""}
                      onChange={(e) => updateSection('details', { ...data.details, email_title: e.target.value })}
                      placeholder="Send An Email"
                      className="w-full px-3 py-1.5 bg-white border border-obsidian-200 rounded-lg text-xs font-bold focus:outline-none focus:border-gold-500"
                    />
                  </FormField>
                  <FormField label="Email Address">
                    <input
                      type="email"
                      value={data.details?.email_address || ""}
                      onChange={(e) => updateSection('details', { ...data.details, email_address: e.target.value })}
                      placeholder="zkflooring1@gmail.com"
                      className="w-full px-3 py-1.5 bg-white border border-obsidian-200 rounded-lg text-xs focus:outline-none focus:border-gold-500"
                    />
                  </FormField>
                </div>
              </div>
            )}

            {/* Tab 4: Survey Form Copy */}
            {activeTab === "Survey Form Copy" && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <FormField label="Form Tag / Badge">
                  <input
                    type="text"
                    value={data.form?.badge || ""}
                    onChange={(e) => updateSection('form', { ...data.form, badge: e.target.value })}
                    placeholder="Free Measuring & Samples"
                    className="w-full px-3 py-2 bg-obsidian-50/50 border border-obsidian-200 rounded-lg text-sm focus:outline-none focus:border-gold-500"
                  />
                </FormField>
                <FormField label="Form Main Title">
                  <input
                    type="text"
                    value={data.form?.title || ""}
                    onChange={(e) => updateSection('form', { ...data.form, title: e.target.value })}
                    placeholder="Request a Free Home Survey & Quote"
                    className="w-full px-3 py-2 bg-obsidian-50/50 border border-obsidian-200 rounded-lg text-sm font-bold focus:outline-none focus:border-gold-500"
                  />
                </FormField>
                <FormField label="Form Description">
                  <textarea
                    rows={3}
                    value={data.form?.description || ""}
                    onChange={(e) => updateSection('form', { ...data.form, description: e.target.value })}
                    placeholder="Fill out the details below and our lead specialist..."
                    className="w-full px-3 py-2 bg-obsidian-50/50 border border-obsidian-200 rounded-lg text-sm focus:outline-none focus:border-gold-500 resize-none"
                  />
                </FormField>
              </div>
            )}

            {/* Tab 5: Google Maps Embed */}
            {activeTab === "Google Maps Embed" && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <FormField label="Google Maps Embed URL">
                  <textarea
                    rows={4}
                    value={data.map?.embed_url || ""}
                    onChange={(e) => updateSection('map', { ...data.map, embed_url: e.target.value })}
                    placeholder="https://maps.google.com/maps?q=..."
                    className="w-full px-3 py-2 bg-obsidian-50/50 border border-obsidian-200 rounded-lg text-xs font-mono focus:outline-none focus:border-gold-500 resize-none"
                  />
                </FormField>
                <p className="text-xs text-obsidian-400">
                  Tip: Enter the Google Maps Embed src link to display your exact office or showroom pin on the contact page.
                </p>
              </div>
            )}

            {/* Tab 6: SEO Configuration */}
            {activeTab === "SEO Configuration" && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <FormField label="SEO Meta Title">
                  <input
                    type="text"
                    value={seo.seoTitle}
                    onChange={(e) => setSeo(p => ({ ...p, seoTitle: e.target.value }))}
                    placeholder="Contact ZK Flooring | Free Home Measuring Birmingham"
                    className="w-full px-3 py-2 bg-obsidian-50/50 border border-obsidian-200 rounded-lg text-sm focus:outline-none focus:border-gold-500"
                  />
                </FormField>
                <FormField label="SEO Meta Description">
                  <textarea
                    rows={4}
                    value={seo.seoDescription}
                    onChange={(e) => setSeo(p => ({ ...p, seoDescription: e.target.value }))}
                    placeholder="Contact ZK Flooring Birmingham today for free measuring and samples..."
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
                Contact Page Live Preview (Interactive)
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
                src="http://localhost:3000/contact?editMode=true"
                className="w-full h-full border-0"
                title="Contact Live Preview"
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
