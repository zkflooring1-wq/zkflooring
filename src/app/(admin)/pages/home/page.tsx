"use client";

import { useState, useEffect } from "react";
import AdminLayout from "@/components/layout/AdminLayout";
import FormField from "@/components/ui/FormField";
import ImageUploader from "@/components/ui/ImageUploader";
import RepeaterField from "@/components/ui/RepeaterField";
import SaveBar from "@/components/ui/SaveBar";
import LoadingState from "@/components/ui/LoadingState";
import { Plus, Trash2, GripVertical } from "lucide-react";
import toast from "react-hot-toast";

interface HeroSlide {
  title: string;
  subtitle: string;
  description: string;
  background_image: string;
  cta_text: string;
  cta_link: string;
  video_url: string;
  order: number;
  enabled: boolean;
}

interface HomePageData {
  hero_slides: HeroSlide[];
  features: {
    customer_count: string;
    social_proof: string;
    service_highlights: string[];
  };
  about: {
    title: string;
    description: string;
    experience_years: string;
  };
  contact_callback: {
    hotline_text: string;
  };
}

const defaultData: HomePageData = {
  hero_slides: [],
  features: { customer_count: "", social_proof: "", service_highlights: [] },
  about: { title: "", description: "", experience_years: "" },
  contact_callback: { hotline_text: "" },
};

export default function HomePageEditor() {
  const [data, setData] = useState<HomePageData>(defaultData);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/pages/home")
      .then((r) => r.json())
      .then((d) => {
        if (d.page?.sections) {
          setData({ ...defaultData, ...d.page.sections });
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/pages/home", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: "Home", sections: data }),
      });
      if (!res.ok) throw new Error();
      toast.success("Home page updated!");
    } catch {
      toast.error("Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const addSlide = () => {
    setData((prev) => ({
      ...prev,
      hero_slides: [
        ...prev.hero_slides,
        {
          title: "",
          subtitle: "",
          description: "",
          background_image: "",
          cta_text: "",
          cta_link: "",
          video_url: "",
          order: prev.hero_slides.length,
          enabled: true,
        },
      ],
    }));
  };

  const updateSlide = (index: number, field: string, value: unknown) => {
    setData((prev) => {
      const slides = [...prev.hero_slides];
      slides[index] = { ...slides[index], [field]: value };
      return { ...prev, hero_slides: slides };
    });
  };

  const removeSlide = (index: number) => {
    setData((prev) => ({
      ...prev,
      hero_slides: prev.hero_slides.filter((_, i) => i !== index),
    }));
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
      <div className="max-w-4xl space-y-6">
        {/* Hero Slider */}
        <div className="bg-white rounded-[var(--radius-card)] border border-obsidian-100/50 shadow-sm p-6 space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-obsidian-700 font-[var(--font-heading)]">
              Hero Slider
            </h3>
            <button
              type="button"
              onClick={addSlide}
              className="inline-flex items-center gap-1.5 text-sm text-gold-500 hover:text-gold-600 font-medium"
            >
              <Plus className="w-3.5 h-3.5" /> Add Slide
            </button>
          </div>

          {data.hero_slides.map((slide, i) => (
            <div
              key={i}
              className="border border-obsidian-100 rounded-xl p-5 space-y-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <GripVertical className="w-4 h-4 text-obsidian-300" />
                  <span className="text-xs font-semibold text-obsidian-500">
                    Slide {i + 1}
                  </span>
                  {!slide.enabled && (
                    <span className="text-[10px] bg-obsidian-100 text-obsidian-500 px-2 py-0.5 rounded">
                      Disabled
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => updateSlide(i, "enabled", !slide.enabled)}
                    className={`text-xs font-medium px-2 py-1 rounded ${slide.enabled ? "bg-green-50 text-green-600" : "bg-obsidian-50 text-obsidian-400"}`}
                  >
                    {slide.enabled ? "Enabled" : "Disabled"}
                  </button>
                  <button
                    type="button"
                    onClick={() => removeSlide(i)}
                    className="p-1 text-obsidian-400 hover:text-red-500"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField label="Title">
                  <input type="text" value={slide.title} onChange={(e) => updateSlide(i, "title", e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-obsidian-200 rounded-lg text-sm focus:outline-none focus:border-gold-400" />
                </FormField>
                <FormField label="Subtitle">
                  <input type="text" value={slide.subtitle} onChange={(e) => updateSlide(i, "subtitle", e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-obsidian-200 rounded-lg text-sm focus:outline-none focus:border-gold-400" />
                </FormField>
              </div>

              <FormField label="Description">
                <textarea value={slide.description} onChange={(e) => updateSlide(i, "description", e.target.value)} rows={2}
                  className="w-full px-3 py-2 bg-white border border-obsidian-200 rounded-lg text-sm focus:outline-none focus:border-gold-400 resize-none" />
              </FormField>

              <FormField label="Background Image">
                <ImageUploader value={slide.background_image} onChange={(v) => updateSlide(i, "background_image", v)} />
              </FormField>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <FormField label="CTA Text">
                  <input type="text" value={slide.cta_text} onChange={(e) => updateSlide(i, "cta_text", e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-obsidian-200 rounded-lg text-sm focus:outline-none focus:border-gold-400" />
                </FormField>
                <FormField label="CTA Link">
                  <input type="text" value={slide.cta_link} onChange={(e) => updateSlide(i, "cta_link", e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-obsidian-200 rounded-lg text-sm focus:outline-none focus:border-gold-400" />
                </FormField>
                <FormField label="Video URL">
                  <input type="text" value={slide.video_url} onChange={(e) => updateSlide(i, "video_url", e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-obsidian-200 rounded-lg text-sm focus:outline-none focus:border-gold-400" />
                </FormField>
              </div>
            </div>
          ))}
        </div>

        {/* Features / Social Proof */}
        <div className="bg-white rounded-[var(--radius-card)] border border-obsidian-100/50 shadow-sm p-6 space-y-5">
          <h3 className="text-sm font-semibold text-obsidian-700 font-[var(--font-heading)]">Features & Social Proof</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <FormField label="Customer Counter" hint="e.g. 500+">
              <input type="text" value={data.features.customer_count} onChange={(e) => setData(p => ({...p, features: {...p.features, customer_count: e.target.value}}))}
                className="w-full px-3 py-2.5 bg-white border border-obsidian-200 rounded-[var(--radius-input)] text-sm focus:outline-none focus:border-gold-400" />
            </FormField>
            <FormField label="Social Proof Text">
              <input type="text" value={data.features.social_proof} onChange={(e) => setData(p => ({...p, features: {...p.features, social_proof: e.target.value}}))}
                className="w-full px-3 py-2.5 bg-white border border-obsidian-200 rounded-[var(--radius-input)] text-sm focus:outline-none focus:border-gold-400" />
            </FormField>
          </div>
          <RepeaterField value={data.features.service_highlights || []} onChange={(v) => setData(p => ({...p, features: {...p.features, service_highlights: v}}))} label="Service Highlights" addLabel="Add Highlight" />
        </div>

        {/* About Override */}
        <div className="bg-white rounded-[var(--radius-card)] border border-obsidian-100/50 shadow-sm p-6 space-y-5">
          <h3 className="text-sm font-semibold text-obsidian-700 font-[var(--font-heading)]">About Section</h3>
          <FormField label="Custom Title">
            <input type="text" value={data.about.title} onChange={(e) => setData(p => ({...p, about: {...p.about, title: e.target.value}}))}
              className="w-full px-3 py-2.5 bg-white border border-obsidian-200 rounded-[var(--radius-input)] text-sm focus:outline-none focus:border-gold-400" />
          </FormField>
          <FormField label="Description">
            <textarea value={data.about.description} onChange={(e) => setData(p => ({...p, about: {...p.about, description: e.target.value}}))} rows={4}
              className="w-full px-3 py-2.5 bg-white border border-obsidian-200 rounded-[var(--radius-input)] text-sm focus:outline-none focus:border-gold-400 resize-none" />
          </FormField>
          <FormField label="Experience Years" hint="e.g. 15">
            <input type="text" value={data.about.experience_years} onChange={(e) => setData(p => ({...p, about: {...p.about, experience_years: e.target.value}}))}
              className="w-full px-3 py-2.5 bg-white border border-obsidian-200 rounded-[var(--radius-input)] text-sm focus:outline-none focus:border-gold-400" />
          </FormField>
        </div>

        {/* Contact Callback */}
        <div className="bg-white rounded-[var(--radius-card)] border border-obsidian-100/50 shadow-sm p-6 space-y-5">
          <h3 className="text-sm font-semibold text-obsidian-700 font-[var(--font-heading)]">Contact Callback</h3>
          <FormField label="Hotline Text">
            <input type="text" value={data.contact_callback.hotline_text} onChange={(e) => setData(p => ({...p, contact_callback: {...p.contact_callback, hotline_text: e.target.value}}))}
              className="w-full px-3 py-2.5 bg-white border border-obsidian-200 rounded-[var(--radius-input)] text-sm focus:outline-none focus:border-gold-400" />
          </FormField>
        </div>

        <SaveBar onSave={handleSave} saving={saving} saveLabel="Save Home Page" />
      </div>
    </AdminLayout>
  );
}