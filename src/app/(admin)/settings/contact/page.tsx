"use client";

import { useState, useEffect } from "react";
import AdminLayout from "@/components/layout/AdminLayout";
import FormField from "@/components/ui/FormField";
import SaveBar from "@/components/ui/SaveBar";
import LoadingState from "@/components/ui/LoadingState";
import toast from "react-hot-toast";

interface ContactSettings { phone: string; phone_link: string; email: string; address: string; hours: string; }

export default function ContactSettingsPage() {
  const [data, setData] = useState<ContactSettings>({ phone: "", phone_link: "", email: "", address: "", hours: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/settings/contact").then(r => r.json()).then(d => { if (d.value) setData({...data, ...d.value}); }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try { await fetch("/api/settings/contact", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ value: data }) }); toast.success("Contact settings saved!"); }
    catch { toast.error("Failed to save"); } finally { setSaving(false); }
  };

  if (loading) return <AdminLayout title="Contact Settings" breadcrumb={["Settings", "Contact"]}><LoadingState /></AdminLayout>;

  return (
    <AdminLayout title="Contact Settings" breadcrumb={["Settings", "Contact"]}>
      <div className="max-w-3xl space-y-6">
        <div className="bg-white rounded-[var(--radius-card)] border border-obsidian-100/50 shadow-sm p-6 space-y-5">
          <FormField label="Phone Number"><input type="text" value={data.phone} onChange={(e) => setData(p => ({...p, phone: e.target.value}))} className="w-full px-3 py-2.5 bg-white border border-obsidian-200 rounded-[var(--radius-input)] text-sm focus:outline-none focus:border-gold-400" placeholder="0121 234 5678" /></FormField>
          <FormField label="Phone Link" hint="tel: format"><input type="text" value={data.phone_link} onChange={(e) => setData(p => ({...p, phone_link: e.target.value}))} className="w-full px-3 py-2.5 bg-white border border-obsidian-200 rounded-[var(--radius-input)] text-sm focus:outline-none focus:border-gold-400" placeholder="tel:01212345678" /></FormField>
          <FormField label="Email"><input type="email" value={data.email} onChange={(e) => setData(p => ({...p, email: e.target.value}))} className="w-full px-3 py-2.5 bg-white border border-obsidian-200 rounded-[var(--radius-input)] text-sm focus:outline-none focus:border-gold-400" /></FormField>
          <FormField label="Address"><textarea value={data.address} onChange={(e) => setData(p => ({...p, address: e.target.value}))} rows={3} className="w-full px-3 py-2.5 bg-white border border-obsidian-200 rounded-[var(--radius-input)] text-sm focus:outline-none focus:border-gold-400 resize-none" /></FormField>
          <FormField label="Operating Hours"><input type="text" value={data.hours} onChange={(e) => setData(p => ({...p, hours: e.target.value}))} className="w-full px-3 py-2.5 bg-white border border-obsidian-200 rounded-[var(--radius-input)] text-sm focus:outline-none focus:border-gold-400" placeholder="Mon-Fri 8am-6pm" /></FormField>
        </div>
        <SaveBar onSave={handleSave} saving={saving} />
      </div>
    </AdminLayout>
  );
}