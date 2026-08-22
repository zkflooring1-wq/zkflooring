"use client";

import { useState, useEffect } from "react";
import AdminLayout from "@/components/layout/AdminLayout";
import FormField from "@/components/ui/FormField";
import ImageUploader from "@/components/ui/ImageUploader";
import SaveBar from "@/components/ui/SaveBar";
import LoadingState from "@/components/ui/LoadingState";
import toast from "react-hot-toast";

interface AboutData {
  title: string;
  description: string;
  mission: string;
  image: string;
}

export default function AboutPageEditor() {
  const [data, setData] = useState<AboutData>({ title: "", description: "", mission: "", image: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/pages/about").then((r) => r.json()).then((d) => {
      if (d.page?.sections) setData({ title: "", description: "", mission: "", image: "", ...d.page.sections });
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/pages/about", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ title: "About", sections: data }) });
      if (!res.ok) throw new Error();
      toast.success("About page updated!");
    } catch { toast.error("Failed to save"); }
    finally { setSaving(false); }
  };

  if (loading) return <AdminLayout title="About Page" breadcrumb={["Pages", "About"]}><LoadingState /></AdminLayout>;

  return (
    <AdminLayout title="About Page" breadcrumb={["Pages", "About"]}>
      <div className="max-w-3xl space-y-6">
        <div className="bg-white rounded-[var(--radius-card)] border border-obsidian-100/50 shadow-sm p-6 space-y-5">
          <h3 className="text-sm font-semibold text-obsidian-700 font-[var(--font-heading)]">About Content</h3>
          <FormField label="Title"><input type="text" value={data.title} onChange={(e) => setData(p => ({...p, title: e.target.value}))} className="w-full px-3 py-2.5 bg-white border border-obsidian-200 rounded-[var(--radius-input)] text-sm focus:outline-none focus:border-gold-400" /></FormField>
          <FormField label="Description"><textarea value={data.description} onChange={(e) => setData(p => ({...p, description: e.target.value}))} rows={5} className="w-full px-3 py-2.5 bg-white border border-obsidian-200 rounded-[var(--radius-input)] text-sm focus:outline-none focus:border-gold-400 resize-none" /></FormField>
          <FormField label="Mission"><textarea value={data.mission} onChange={(e) => setData(p => ({...p, mission: e.target.value}))} rows={3} className="w-full px-3 py-2.5 bg-white border border-obsidian-200 rounded-[var(--radius-input)] text-sm focus:outline-none focus:border-gold-400 resize-none" /></FormField>
          <FormField label="Image"><ImageUploader value={data.image} onChange={(v) => setData(p => ({...p, image: v}))} /></FormField>
        </div>
        <SaveBar onSave={handleSave} saving={saving} saveLabel="Save About Page" />
      </div>
    </AdminLayout>
  );
}