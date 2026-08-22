"use client";

import { useState, useEffect } from "react";
import AdminLayout from "@/components/layout/AdminLayout";
import FormField from "@/components/ui/FormField";
import ImageUploader from "@/components/ui/ImageUploader";
import SaveBar from "@/components/ui/SaveBar";
import LoadingState from "@/components/ui/LoadingState";
import toast from "react-hot-toast";

interface SeoSettings { site_title: string; meta_description: string; canonical_url: string; social_image: string; }

export default function SeoSettingsPage() {
  const [data, setData] = useState<SeoSettings>({ site_title: "", meta_description: "", canonical_url: "", social_image: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/settings/seo").then(r => r.json()).then(d => { if (d.value) setData({...data, ...d.value}); }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try { await fetch("/api/settings/seo", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ value: data }) }); toast.success("SEO settings saved!"); }
    catch { toast.error("Failed to save"); } finally { setSaving(false); }
  };

  if (loading) return <AdminLayout title="SEO Settings" breadcrumb={["Settings", "SEO"]}><LoadingState /></AdminLayout>;

  return (
    <AdminLayout title="SEO Settings" breadcrumb={["Settings", "SEO"]}>
      <div className="max-w-3xl space-y-6">
        <div className="bg-white rounded-[var(--radius-card)] border border-obsidian-100/50 shadow-sm p-6 space-y-5">
          <FormField label="Site Title"><input type="text" value={data.site_title} onChange={(e) => setData(p => ({...p, site_title: e.target.value}))} className="w-full px-3 py-2.5 bg-white border border-obsidian-200 rounded-[var(--radius-input)] text-sm focus:outline-none focus:border-gold-400" placeholder="ZK Flooring - Professional Flooring Services" /></FormField>
          <FormField label="Default Meta Description"><textarea value={data.meta_description} onChange={(e) => setData(p => ({...p, meta_description: e.target.value}))} rows={3} className="w-full px-3 py-2.5 bg-white border border-obsidian-200 rounded-[var(--radius-input)] text-sm focus:outline-none focus:border-gold-400 resize-none" /></FormField>
          <FormField label="Canonical Site URL"><input type="url" value={data.canonical_url} onChange={(e) => setData(p => ({...p, canonical_url: e.target.value}))} className="w-full px-3 py-2.5 bg-white border border-obsidian-200 rounded-[var(--radius-input)] text-sm focus:outline-none focus:border-gold-400" placeholder="https://zkflooring.co.uk" /></FormField>
          <FormField label="Default Social Image"><ImageUploader value={data.social_image} onChange={(v) => setData(p => ({...p, social_image: v}))} /></FormField>
        </div>
        <SaveBar onSave={handleSave} saving={saving} />
      </div>
    </AdminLayout>
  );
}