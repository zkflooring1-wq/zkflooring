"use client";

import { useState, useEffect } from "react";
import AdminLayout from "@/components/layout/AdminLayout";
import FormField from "@/components/ui/FormField";
import SaveBar from "@/components/ui/SaveBar";
import LoadingState from "@/components/ui/LoadingState";
import toast from "react-hot-toast";

interface PageData {
  title: string;
  subtitle: string;
  description: string;
  address: string;
  phone: string;
  email: string;
  seoTitle: string;
  seoDescription: string;
}

export default function ContactPageEditor() {
  const slug = "contact";
  const [data, setData] = useState<PageData>({ title: "", subtitle: "", description: "", address: "", phone: "", email: "", seoTitle: "", seoDescription: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch(`/api/pages/${slug}`).then((r) => r.json()).then((d) => {
      if (d.page) {
        setData({
          title: d.page.sections?.title || "",
          subtitle: d.page.sections?.subtitle || "",
          description: d.page.sections?.description || "",
          address: d.page.sections?.address || "",
          phone: d.page.sections?.phone || "",
          email: d.page.sections?.email || "",
          seoTitle: d.page.seo_data?.seoTitle || "",
          seoDescription: d.page.seo_data?.seoDescription || "",
        });
      }
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch(`/api/pages/${slug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: "Contact",
          sections: { title: data.title, subtitle: data.subtitle, description: data.description, address: data.address, phone: data.phone, email: data.email },
          seo_data: { seoTitle: data.seoTitle, seoDescription: data.seoDescription }
        })
      });
      if (!res.ok) throw new Error();
      toast.success("Contact page updated!");
    } catch { toast.error("Failed to save"); }
    finally { setSaving(false); }
  };

  if (loading) return <AdminLayout title="Contact Page" breadcrumb={["Pages", "Contact"]}><LoadingState /></AdminLayout>;

  return (
    <AdminLayout title="Contact Page" breadcrumb={["Pages", "Contact"]}>
      <div className="max-w-3xl space-y-6 pb-24">
        <div className="bg-white rounded-[var(--radius-card)] border border-obsidian-100/50 shadow-sm p-6 space-y-5">
          <h3 className="text-sm font-semibold text-obsidian-700 font-[var(--font-heading)]">Header Content</h3>
          <FormField label="Title"><input type="text" value={data.title} onChange={(e) => setData(p => ({...p, title: e.target.value}))} className="w-full px-3 py-2.5 bg-white border border-obsidian-200 rounded-[var(--radius-input)] text-sm focus:outline-none focus:border-gold-400" /></FormField>
          <FormField label="Subtitle"><input type="text" value={data.subtitle} onChange={(e) => setData(p => ({...p, subtitle: e.target.value}))} className="w-full px-3 py-2.5 bg-white border border-obsidian-200 rounded-[var(--radius-input)] text-sm focus:outline-none focus:border-gold-400" /></FormField>
          <FormField label="Description"><textarea value={data.description} onChange={(e) => setData(p => ({...p, description: e.target.value}))} rows={3} className="w-full px-3 py-2.5 bg-white border border-obsidian-200 rounded-[var(--radius-input)] text-sm focus:outline-none focus:border-gold-400 resize-none" /></FormField>
        </div>

        <div className="bg-white rounded-[var(--radius-card)] border border-obsidian-100/50 shadow-sm p-6 space-y-5">
          <h3 className="text-sm font-semibold text-obsidian-700 font-[var(--font-heading)]">Contact Details</h3>
          <FormField label="Address"><input type="text" value={data.address} onChange={(e) => setData(p => ({...p, address: e.target.value}))} className="w-full px-3 py-2.5 bg-white border border-obsidian-200 rounded-[var(--radius-input)] text-sm focus:outline-none focus:border-gold-400" /></FormField>
          <FormField label="Phone"><input type="text" value={data.phone} onChange={(e) => setData(p => ({...p, phone: e.target.value}))} className="w-full px-3 py-2.5 bg-white border border-obsidian-200 rounded-[var(--radius-input)] text-sm focus:outline-none focus:border-gold-400" /></FormField>
          <FormField label="Email"><input type="text" value={data.email} onChange={(e) => setData(p => ({...p, email: e.target.value}))} className="w-full px-3 py-2.5 bg-white border border-obsidian-200 rounded-[var(--radius-input)] text-sm focus:outline-none focus:border-gold-400" /></FormField>
        </div>

        <div className="bg-white rounded-[var(--radius-card)] border border-obsidian-100/50 shadow-sm p-6 space-y-5">
          <h3 className="text-sm font-semibold text-obsidian-700 font-[var(--font-heading)]">SEO Configuration</h3>
          <FormField label="SEO Title"><input type="text" value={data.seoTitle} onChange={(e) => setData(p => ({...p, seoTitle: e.target.value}))} className="w-full px-3 py-2.5 bg-white border border-obsidian-200 rounded-[var(--radius-input)] text-sm focus:outline-none focus:border-gold-400" /></FormField>
          <FormField label="SEO Description"><textarea value={data.seoDescription} onChange={(e) => setData(p => ({...p, seoDescription: e.target.value}))} rows={3} className="w-full px-3 py-2.5 bg-white border border-obsidian-200 rounded-[var(--radius-input)] text-sm focus:outline-none focus:border-gold-400 resize-none" /></FormField>
        </div>

        <SaveBar onSave={handleSave} saving={saving} />
      </div>
    </AdminLayout>
  );
}
