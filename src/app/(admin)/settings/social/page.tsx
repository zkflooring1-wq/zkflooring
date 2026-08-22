"use client";

import { useState, useEffect } from "react";
import AdminLayout from "@/components/layout/AdminLayout";
import FormField from "@/components/ui/FormField";
import SaveBar from "@/components/ui/SaveBar";
import LoadingState from "@/components/ui/LoadingState";
import { Plus, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

interface SocialLink { platform: string; url: string; enabled: boolean; icon: string; }

const PLATFORMS = ["Facebook", "Instagram", "Twitter/X", "Pinterest", "LinkedIn", "YouTube", "TikTok"];

export default function SocialSettingsPage() {
  const [links, setLinks] = useState<SocialLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/settings/social").then(r => r.json()).then(d => { if (d.value?.links) setLinks(d.value.links); }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const addLink = () => { setLinks([...links, { platform: PLATFORMS[0], url: "", enabled: true, icon: "" }]); };
  const removeLink = (i: number) => { setLinks(links.filter((_, idx) => idx !== i)); };
  const updateLink = (i: number, field: string, value: unknown) => { const updated = [...links]; updated[i] = { ...updated[i], [field]: value }; setLinks(updated); };

  const handleSave = async () => {
    setSaving(true);
    try { await fetch("/api/settings/social", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ value: { links } }) }); toast.success("Social links saved!"); }
    catch { toast.error("Failed to save"); } finally { setSaving(false); }
  };

  if (loading) return <AdminLayout title="Social Links" breadcrumb={["Settings", "Social"]}><LoadingState /></AdminLayout>;

  return (
    <AdminLayout title="Social Links" breadcrumb={["Settings", "Social"]}>
      <div className="max-w-3xl space-y-6">
        <div className="bg-white rounded-[var(--radius-card)] border border-obsidian-100/50 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-obsidian-700 font-[var(--font-heading)]">Social Media Links</h3>
            <button type="button" onClick={addLink} className="inline-flex items-center gap-1.5 text-sm text-gold-500 hover:text-gold-600 font-medium"><Plus className="w-3.5 h-3.5" /> Add Link</button>
          </div>
          {links.map((link, i) => (
            <div key={i} className="border border-obsidian-100 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-obsidian-500">Link {i + 1}</span>
                <div className="flex items-center gap-2">
                  <button type="button" onClick={() => updateLink(i, "enabled", !link.enabled)} className={`text-xs px-2 py-1 rounded ${link.enabled ? 'bg-green-50 text-green-600' : 'bg-obsidian-50 text-obsidian-400'}`}>{link.enabled ? 'Enabled' : 'Disabled'}</button>
                  <button type="button" onClick={() => removeLink(i)} className="p-1 text-obsidian-400 hover:text-red-500"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <FormField label="Platform">
                  <select value={link.platform} onChange={(e) => updateLink(i, "platform", e.target.value)} className="w-full px-3 py-2 bg-white border border-obsidian-200 rounded-lg text-sm focus:outline-none focus:border-gold-400">
                    {PLATFORMS.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </FormField>
                <FormField label="URL"><input type="url" value={link.url} onChange={(e) => updateLink(i, "url", e.target.value)} className="w-full px-3 py-2 bg-white border border-obsidian-200 rounded-lg text-sm focus:outline-none focus:border-gold-400" placeholder="https://" /></FormField>
              </div>
            </div>
          ))}
        </div>
        <SaveBar onSave={handleSave} saving={saving} />
      </div>
    </AdminLayout>
  );
}