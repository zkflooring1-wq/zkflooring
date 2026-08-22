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
import type { Project } from "@/types/database";
import toast from "react-hot-toast";

const CATEGORIES = [
  "Luxury Vinyl Tile",
  "Carpet & Carpet Tile",
  "Subfloor Preparation",
  "Hardwood Flooring",
  "Commercial Vinyl",
  "Commercial Flooring",
  "Laminate Flooring",
];

interface ProjectEditorProps {
  slug?: string;
}

export default function ProjectEditor({ slug }: ProjectEditorProps) {
  const router = useRouter();
  const isNew = !slug;
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [form, setForm] = useState({
    title: "",
    slug: "",
    category: CATEGORIES[0],
    location: "",
    image: "",
    short_desc: "",
    description: [""],
    highlights: [""],
    client: "",
    duration: "",
    area: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!isNew) {
      fetch(`/api/projects/${slug}`)
        .then((r) => r.json())
        .then((d) => {
          if (d.project) {
            const p = d.project as Project;
            setForm({
              title: p.title,
              slug: p.slug,
              category: p.category,
              location: p.location,
              image: p.image,
              short_desc: p.short_desc || "",
              description: Array.isArray(p.description) ? (p.description as string[]) : [""],
              highlights: Array.isArray(p.highlights) ? (p.highlights as string[]) : [""],
              client: p.client || "",
              duration: p.duration || "",
              area: p.area || "",
            });
          }
        })
        .finally(() => setLoading(false));
    }
  }, [slug, isNew]);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.title.trim()) errs.title = "Title is required";
    if (!form.slug.trim()) errs.slug = "Slug is required";
    if (!form.category) errs.category = "Category is required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setSaving(true);

    try {
      const url = isNew ? "/api/projects" : `/api/projects/${slug}`;
      const method = isNew ? "POST" : "PUT";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save");

      toast.success(isNew ? "Project created!" : "Project updated!");
      router.push("/projects");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const res = await fetch(`/api/projects/${slug}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      toast.success("Project deleted");
      router.push("/projects");
    } catch {
      toast.error("Failed to delete");
    } finally {
      setDeleting(false);
    }
  };

  const update = (field: string, value: unknown) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  if (loading) {
    return (
      <AdminLayout
        title={isNew ? "New Project" : "Edit Project"}
        breadcrumb={["Content", "Projects", isNew ? "New" : "Edit"]}
      >
        <LoadingState />
      </AdminLayout>
    );
  }

  return (
    <AdminLayout
      title={isNew ? "New Project" : `Edit: ${form.title}`}
      breadcrumb={["Content", "Projects", isNew ? "New" : form.title]}
    >
      <div className="max-w-4xl space-y-6">
        {/* Basic Info Card */}
        <div className="bg-white rounded-[var(--radius-card)] border border-obsidian-100/50 shadow-sm p-6 space-y-5">
          <h3 className="text-sm font-semibold text-obsidian-700 font-[var(--font-heading)]">Basic Information</h3>

          <FormField label="Title" required error={errors.title}>
            <input
              type="text"
              value={form.title}
              onChange={(e) => {
                update("title", e.target.value);
                if (isNew || !form.slug) {
                  update("slug", e.target.value.toLowerCase().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-"));
                }
              }}
              className="w-full px-3 py-2.5 bg-white border border-obsidian-200 rounded-[var(--radius-input)] text-sm focus:outline-none focus:border-gold-400 focus:ring-1 focus:ring-gold-400/20"
              placeholder="e.g. Luxury Herringbone LVT Installation"
            />
          </FormField>

          <SlugField value={form.slug} onChange={(v) => update("slug", v)} titleValue={form.title} error={errors.slug} />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <FormField label="Category" required error={errors.category}>
              <select
                value={form.category}
                onChange={(e) => update("category", e.target.value)}
                className="w-full px-3 py-2.5 bg-white border border-obsidian-200 rounded-[var(--radius-input)] text-sm focus:outline-none focus:border-gold-400 focus:ring-1 focus:ring-gold-400/20"
              >
                {CATEGORIES.map((c) => (<option key={c} value={c}>{c}</option>))}
              </select>
            </FormField>

            <FormField label="Location">
              <input type="text" value={form.location} onChange={(e) => update("location", e.target.value)}
                className="w-full px-3 py-2.5 bg-white border border-obsidian-200 rounded-[var(--radius-input)] text-sm focus:outline-none focus:border-gold-400 focus:ring-1 focus:ring-gold-400/20"
                placeholder="e.g. Solihull, West Midlands"
              />
            </FormField>
          </div>
        </div>

        {/* Media Card */}
        <div className="bg-white rounded-[var(--radius-card)] border border-obsidian-100/50 shadow-sm p-6 space-y-5">
          <h3 className="text-sm font-semibold text-obsidian-700 font-[var(--font-heading)]">Cover Image</h3>
          <ImageUploader value={form.image} onChange={(v) => update("image", v)} />
        </div>

        {/* Description Card */}
        <div className="bg-white rounded-[var(--radius-card)] border border-obsidian-100/50 shadow-sm p-6 space-y-5">
          <h3 className="text-sm font-semibold text-obsidian-700 font-[var(--font-heading)]">Content</h3>

          <FormField label="Short Description">
            <textarea value={form.short_desc} onChange={(e) => update("short_desc", e.target.value)}
              rows={3}
              className="w-full px-3 py-2.5 bg-white border border-obsidian-200 rounded-[var(--radius-input)] text-sm focus:outline-none focus:border-gold-400 focus:ring-1 focus:ring-gold-400/20 resize-none"
              placeholder="Brief summary of the project..."
            />
          </FormField>

          <RepeaterField value={form.description as string[]} onChange={(v) => update("description", v)} label="Description Paragraphs" placeholder="Enter a paragraph..." addLabel="Add Paragraph" />
          <RepeaterField value={form.highlights as string[]} onChange={(v) => update("highlights", v)} label="Highlights" placeholder="e.g. Amtico Spacia Herringbone Pattern" addLabel="Add Highlight" />
        </div>

        {/* Details Card */}
        <div className="bg-white rounded-[var(--radius-card)] border border-obsidian-100/50 shadow-sm p-6 space-y-5">
          <h3 className="text-sm font-semibold text-obsidian-700 font-[var(--font-heading)]">Project Details</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <FormField label="Client">
              <input type="text" value={form.client} onChange={(e) => update("client", e.target.value)}
                className="w-full px-3 py-2.5 bg-white border border-obsidian-200 rounded-[var(--radius-input)] text-sm focus:outline-none focus:border-gold-400 focus:ring-1 focus:ring-gold-400/20"
                placeholder="e.g. Private Residence" />
            </FormField>
            <FormField label="Duration">
              <input type="text" value={form.duration} onChange={(e) => update("duration", e.target.value)}
                className="w-full px-3 py-2.5 bg-white border border-obsidian-200 rounded-[var(--radius-input)] text-sm focus:outline-none focus:border-gold-400 focus:ring-1 focus:ring-gold-400/20"
                placeholder="e.g. 3 Days" />
            </FormField>
            <FormField label="Area">
              <input type="text" value={form.area} onChange={(e) => update("area", e.target.value)}
                className="w-full px-3 py-2.5 bg-white border border-obsidian-200 rounded-[var(--radius-input)] text-sm focus:outline-none focus:border-gold-400 focus:ring-1 focus:ring-gold-400/20"
                placeholder="e.g. 68 sq metres" />
            </FormField>
          </div>
        </div>

        <SaveBar onSave={handleSave} onDelete={!isNew ? () => setShowDelete(true) : undefined} saving={saving} saveLabel={isNew ? "Create Project" : "Save Changes"} />
      </div>

      <ConfirmDialog open={showDelete} title="Delete Project" message="This will permanently delete this project." confirmLabel="Delete" loading={deleting} onConfirm={handleDelete} onCancel={() => setShowDelete(false)} />
    </AdminLayout>
  );
}