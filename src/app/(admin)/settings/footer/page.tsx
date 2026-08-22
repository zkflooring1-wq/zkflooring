"use client";

import { useState, useEffect } from "react";
import AdminLayout from "@/components/layout/AdminLayout";
import FormField from "@/components/ui/FormField";
import SaveBar from "@/components/ui/SaveBar";
import LoadingState from "@/components/ui/LoadingState";
import toast from "react-hot-toast";

interface FooterSettings { copyright: string; company_description: string; }

export default function FooterSettingsPage() {
  const [data, setData] = useState<FooterSettings>({ copyright: "", company_description: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/settings/footer").then(r => r.json()).then(d => { if (d.value) setData({...data, ...d.value}); }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try { await fetch("/api/settings/footer", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ value: data }) }); toast.success("Footer settings saved!"); }
    catch { toast.error("Failed to save"); } finally { setSaving(false); }
  };

  if (loading) return <AdminLayout title="Footer Settings" breadcrumb={["Settings", "Footer"]}><LoadingState /></AdminLayout>;

  return (
    <AdminLayout title="Footer Settings" breadcrumb={["Settings", "Footer"]}>
      <div className="max-w-3xl space-y-6">
        <div className="bg-white rounded-[var(--radius-card)] border border-obsidian-100/50 shadow-sm p-6 space-y-5">
          <FormField label="Copyright Text"><input type="text" value={data.copyright} onChange={(e) => setData(p => ({...p, copyright: e.target.value}))} className="w-full px-3 py-2.5 bg-white border border-obsidian-200 rounded-[var(--radius-input)] text-sm focus:outline-none focus:border-gold-400" placeholder="Â© 2024 ZK Flooring. All rights reserved." /></FormField>
          <FormField label="Company Description"><textarea value={data.company_description} onChange={(e) => setData(p => ({...p, company_description: e.target.value}))} rows={4} className="w-full px-3 py-2.5 bg-white border border-obsidian-200 rounded-[var(--radius-input)] text-sm focus:outline-none focus:border-gold-400 resize-none" /></FormField>
        </div>
        <SaveBar onSave={handleSave} saving={saving} />
      </div>
    </AdminLayout>
  );
}