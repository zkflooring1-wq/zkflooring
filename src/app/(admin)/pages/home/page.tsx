"use client";

import { useState, useEffect, useRef } from "react";
import AdminLayout from "@/components/layout/AdminLayout";
import SaveBar from "@/components/ui/SaveBar";
import LoadingState from "@/components/ui/LoadingState";
import toast from "react-hot-toast";
import { Monitor, Smartphone, Tablet } from "lucide-react";

import HeroEditor from "./_components/HeroEditor";
import FeaturesEditor from "./_components/FeaturesEditor";
import ServicesEditor from "./_components/ServicesEditor";
import MarqueeEditor from "./_components/MarqueeEditor";
import ProcessEditor from "./_components/ProcessEditor";
import TeamEditor from "./_components/TeamEditor";
import TestimonialsEditor from "./_components/TestimonialsEditor";
import PricingEditor from "./_components/PricingEditor";
import BlogEditor from "./_components/BlogEditor";
import ContactEditor from "./_components/ContactEditor";

const TABS = [
  "Hero Slider", "Features", "Services", "Marquee", "Process", 
  "Our Team", "Testimonials", "Pricing", "Latest Blog", "Contact"
];

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
        if (d.page?.sections) {
          setData(d.page.sections);
        }
      })
      .catch(() => toast.error("Failed to load page data"))
      .finally(() => setLoading(false));

    const handleMessage = (e: MessageEvent) => {
      if (e.data?.type === 'FIELD_CLICKED') {
        const path = e.data.path;
        // Map paths to tabs
        if (path.startsWith('hero')) setActiveTab("Hero Slider");
        else if (path.startsWith('features')) setActiveTab("Features");
        else if (path.startsWith('services')) setActiveTab("Services");
        else if (path.startsWith('marquee')) setActiveTab("Marquee");
        else if (path.startsWith('process')) setActiveTab("Process");
        else if (path.startsWith('team')) setActiveTab("Our Team");
        else if (path.startsWith('testimonials')) setActiveTab("Testimonials");
        else if (path.startsWith('pricing')) setActiveTab("Pricing");
        else if (path.startsWith('blog')) setActiveTab("Latest Blog");
        else if (path.startsWith('contact')) setActiveTab("Contact");
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
          {/* Tabs Dropdown for Mobile / List for Desktop */}
          <div className="bg-white rounded-[var(--radius-card)] border border-obsidian-100/50 shadow-sm overflow-hidden flex-shrink-0">
            <div className="p-3 border-b border-obsidian-100 bg-obsidian-50/50">
              <h3 className="font-semibold text-obsidian-700 font-[var(--font-heading)]">Edit Section: {activeTab}</h3>
            </div>
            <div className="p-2 flex flex-wrap gap-2">
              {TABS.map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    activeTab === tab 
                      ? "bg-gold-50 text-gold-600 border border-gold-100" 
                      : "text-obsidian-500 hover:bg-obsidian-50 hover:text-obsidian-700 bg-obsidian-50/30"
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
              />
            </div>
          </div>
        </div>

      </div>

      <SaveBar onSave={handleSave} saving={saving} />
    </AdminLayout>
  );
}