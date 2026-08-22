"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AdminLayout from "@/components/layout/AdminLayout";
import FormField from "@/components/ui/FormField";
import SlugField from "@/components/ui/SlugField";
import ImageUploader from "@/components/ui/ImageUploader";
import RepeaterField from "@/components/ui/RepeaterField";
import SaveBar from "@/components/ui/SaveBar";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import LoadingState from "@/components/ui/LoadingState";
import type { Service } from "@/types/database";
import toast from "react-hot-toast";

interface ServiceEditorProps { slug?: string; }

export default function ServiceEditor({ slug }: ServiceEditorProps) {
  const router = useRouter();
  const isNew = !slug;
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [form, setForm] = useState({
    title: "", slug: "", category: "", image: "", summary: "",
    description: [""], features: [""],
    info_label: "", info_value: "", cta_text: "", cta_link: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!isNew) {
      fetch(`/api/services/${slug}`).then((r) => r.json()).then((d) => {
        if (d.service) {
          const s = d.service as Service;
          setForm({
            title: s.title, slug: s.slug, category: s.category, image: s.image,
            summary: s.summary || "",
            description: Array.isArray(s.description) ? (s.description as string[]) : [""],
            features: Array.isArray(s.features) ? (s.features as string[]) : [""],
            info_label: s.info_label || "", info_value: s.info_value || "",
            cta_text: s.cta_text || "", cta_link: s.cta_link || "",
          });
        }
      }).finally(() => setLoading(false));
    }
  }, [slug, isNew]);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.title.trim()) errs.title = "Title is required";
    if (!form.slug.trim()) errs.slug = "Slug is required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setSaving(true);
    try {
      const url = isNew ? "/api/services" : `/api/services/${slug}`;
      const res = await fetch(url, { method: isNew ? "POST" : "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save");
      toast.success(isNew ? "Service created!" : "Service updated!");
      router.push("/services");
    } catch (err) { toast.error(err instanceof Error ? err.message : "Failed to save"); }
    finally { setSaving(false); }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await fetch(`/api/services/${slug}`, { method: "DELETE" });
      toast.success("Service deleted");
      router.push("/services");
    } catch { toast.error("Failed to delete"); }
    finally { setDeleting(false); }
  };

  const update = (field: string, value: unknown) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  if (loading) return <AdminLayout title="Loading..." breadcrumb={["Content", "Services"]}><LoadingState /></AdminLayout>;

  return (
    <AdminLayout title={isNew ? "New Service" : `Edit: ${form.title}`} breadcrumb={["Content", "Services", isNew ? "New" : form.title]}>
      <div className="max-w-4xl space-y-6">
        <div className="bg-white rounded-[var(--radius-card)] border border-obsidian-100/50 shadow-sm p-6 space-y-5">
          <h3 className="text-sm font-semibold text-obsidian-700 font-[var(--font-heading)]">Basic Information</h3>
          <FormField label="Title" required error={errors.title}>
            <input type="text" value={form.title} onChange={(e) => { update("title", e.target.value); if (isNew) update("slug", e.target.value.toLowerCase().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-")); }}
              className="w-full px-3 py-2.5 bg-white border border-obsidian-200 rounded-[var(--radius-input)] text-sm focus:outline-none focus:border-gold-400 focus:ring-1 focus:ring-gold-400/20" />
          </FormField>
          <SlugField value={form.slug} onChange={(v) => update("slug", v)} titleValue={form.title} error={errors.slug} />
          <FormField label="Category">
            <input type="text" value={form.category} onChange={(e) => update("category", e.target.value)}
              className="w-full px-3 py-2.5 bg-white border border-obsidian-200 rounded-[var(--radius-input)] text-sm focus:outline-none focus:border-gold-400 focus:ring-1 focus:ring-gold-400/20" placeholder="e.g. Carpet Fitting" />
          </FormField>
        </div>

        <div className="bg-white rounded-[var(--radius-card)] border border-obsidian-100/50 shadow-sm p-6 space-y-5">
          <h3 className="text-sm font-semibold text-obsidian-700 font-[var(--font-heading)]">Cover Image</h3>
          <ImageUploader value={form.image} onChange={(v) => update("image", v)} />
        </div>

        <div className="bg-white rounded-[var(--radius-card)] border border-obsidian-100/50 shadow-sm p-6 space-y-5">
          <h3 className="text-sm font-semibold text-obsidian-700 font-[var(--font-heading)]">Content</h3>
          <FormField label="Summary">
            <textarea value={form.summary} onChange={(e) => update("summary", e.target.value)} rows={3}
              className="w-full px-3 py-2.5 bg-white border border-obsidian-200 rounded-[var(--radius-input)] text-sm focus:outline-none focus:border-gold-400 focus:ring-1 focus:ring-gold-400/20 resize-none" />
          </FormField>
          <RepeaterField value={form.description as string[]} onChange={(v) => update("description", v)} label="Description Paragraphs" addLabel="Add Paragraph" />
          <RepeaterField value={form.features as string[]} onChange={(v) => update("features", v)} label="Features / Badges" placeholder="e.g. 100% Waterproof" addLabel="Add Feature" />
        </div>

        <div className="bg-white rounded-[var(--radius-card)] border border-obsidian-100/50 shadow-sm p-6 space-y-5">
          <h3 className="text-sm font-semibold text-obsidian-700 font-[var(--font-heading)]">Additional Details</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <FormField label="Info Label"><input type="text" value={form.info_label} onChange={(e) => update("info_label", e.target.value)} className="w-full px-3 py-2.5 bg-white border border-obsidian-200 rounded-[var(--radius-input)] text-sm focus:outline-none focus:border-gold-400 focus:ring-1 focus:ring-gold-400/20" /></FormField>
            <FormField label="Info Value"><input type="text" value={form.info_value} onChange={(e) => update("info_value", e.target.value)} className="w-full px-3 py-2.5 bg-white border border-obsidian-200 rounded-[var(--radius-input)] text-sm focus:outline-none focus:border-gold-400 focus:ring-1 focus:ring-gold-400/20" /></FormField>
            <FormField label="CTA Text"><input type="text" value={form.cta_text} onChange={(e) => update("cta_text", e.target.value)} className="w-full px-3 py-2.5 bg-white border border-obsidian-200 rounded-[var(--radius-input)] text-sm focus:outline-none focus:border-gold-400 focus:ring-1 focus:ring-gold-400/20" /></FormField>
            <FormField label="CTA Link"><input type="text" value={form.cta_link} onChange={(e) => update("cta_link", e.target.value)} className="w-full px-3 py-2.5 bg-white border border-obsidian-200 rounded-[var(--radius-input)] text-sm focus:outline-none focus:border-gold-400 focus:ring-1 focus:ring-gold-400/20" /></FormField>
          </div>
        </div>

        <SaveBar onSave={handleSave} onDelete={!isNew ? () => setShowDelete(true) : undefined} saving={saving} saveLabel={isNew ? "Create Service" : "Save Changes"} />
      </div>
      <ConfirmDialog open={showDelete} title="Delete Service" message="This will permanently delete this service." confirmLabel="Delete" loading={deleting} onConfirm={handleDelete} onCancel={() => setShowDelete(false)} />
    </AdminLayout>
  );
}