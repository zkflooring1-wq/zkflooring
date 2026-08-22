"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import AdminLayout from "@/components/layout/AdminLayout";
import FormField from "@/components/ui/FormField";
import SlugField from "@/components/ui/SlugField";
import ImageUploader from "@/components/ui/ImageUploader";
import TagInput from "@/components/ui/TagInput";
import SaveBar from "@/components/ui/SaveBar";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import LoadingState from "@/components/ui/LoadingState";
import type { Post } from "@/types/database";
import toast from "react-hot-toast";

const RichTextEditor = dynamic(() => import("@/components/ui/RichTextEditor"), { ssr: false });

interface BlogEditorProps { postId?: string; }

export default function BlogEditor({ postId }: BlogEditorProps) {
  const router = useRouter();
  const isNew = !postId;
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [form, setForm] = useState({
    title: "", slug: "", content: "", status: "draft" as "draft" | "published",
    featured_image: "", categories: [] as string[], tags: [] as string[],
    excerpt: "", author: "",
    seo_data: { seoTitle: "", seoDescription: "" },
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!isNew) {
      fetch(`/api/blogs/${postId}`).then((r) => r.json()).then((d) => {
        if (d.post) {
          const p = d.post as Post;
          setForm({
            title: p.title, slug: p.slug, content: p.content, status: p.status,
            featured_image: p.featured_image || "", categories: p.categories || [],
            tags: p.tags || [], excerpt: p.excerpt || "", author: p.author || "",
            seo_data: { seoTitle: p.seo_data?.seoTitle || "", seoDescription: p.seo_data?.seoDescription || "" },
          });
        }
      }).finally(() => setLoading(false));
    }
  }, [postId, isNew]);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.title.trim()) errs.title = "Title is required";
    if (!form.slug.trim()) errs.slug = "Slug is required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSave = async (status?: "draft" | "published") => {
    if (!validate()) return;
    setSaving(true);
    const payload = { ...form, status: status || form.status };
    try {
      const url = isNew ? "/api/blogs" : `/api/blogs/${postId}`;
      const res = await fetch(url, { method: isNew ? "POST" : "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save");
      toast.success(isNew ? "Post created!" : "Post updated!");
      router.push("/blogs");
    } catch (err) { toast.error(err instanceof Error ? err.message : "Failed to save"); }
    finally { setSaving(false); }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try { await fetch(`/api/blogs/${postId}`, { method: "DELETE" }); toast.success("Post deleted"); router.push("/blogs"); }
    catch { toast.error("Failed to delete"); }
    finally { setDeleting(false); }
  };

  const update = (field: string, value: unknown) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  if (loading) return <AdminLayout title="Loading..." breadcrumb={["Content", "Blog Posts"]}><LoadingState /></AdminLayout>;

  return (
    <AdminLayout title={isNew ? "New Blog Post" : `Edit: ${form.title}`} breadcrumb={["Content", "Blog Posts", isNew ? "New" : form.title]}>
      <div className="max-w-4xl space-y-6">
        <div className="bg-white rounded-[var(--radius-card)] border border-obsidian-100/50 shadow-sm p-6 space-y-5">
          <h3 className="text-sm font-semibold text-obsidian-700 font-[var(--font-heading)]">Post Details</h3>
          <FormField label="Title" required error={errors.title}>
            <input type="text" value={form.title} onChange={(e) => { update("title", e.target.value); if (isNew) update("slug", e.target.value.toLowerCase().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-")); }}
              className="w-full px-3 py-2.5 bg-white border border-obsidian-200 rounded-[var(--radius-input)] text-sm focus:outline-none focus:border-gold-400 focus:ring-1 focus:ring-gold-400/20" />
          </FormField>
          <SlugField value={form.slug} onChange={(v) => update("slug", v)} titleValue={form.title} error={errors.slug} />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <FormField label="Author"><input type="text" value={form.author} onChange={(e) => update("author", e.target.value)} className="w-full px-3 py-2.5 bg-white border border-obsidian-200 rounded-[var(--radius-input)] text-sm focus:outline-none focus:border-gold-400 focus:ring-1 focus:ring-gold-400/20" placeholder="e.g. ZK Flooring" /></FormField>
            <FormField label="Status">
              <select value={form.status} onChange={(e) => update("status", e.target.value)} className="w-full px-3 py-2.5 bg-white border border-obsidian-200 rounded-[var(--radius-input)] text-sm focus:outline-none focus:border-gold-400 focus:ring-1 focus:ring-gold-400/20">
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </FormField>
          </div>
          <FormField label="Categories"><TagInput value={form.categories} onChange={(v) => update("categories", v)} placeholder="Add category..." suggestions={["Flooring Tips", "Project Updates", "Industry News", "Guides"]} /></FormField>
        </div>

        <div className="bg-white rounded-[var(--radius-card)] border border-obsidian-100/50 shadow-sm p-6 space-y-5">
          <h3 className="text-sm font-semibold text-obsidian-700 font-[var(--font-heading)]">Featured Image</h3>
          <ImageUploader value={form.featured_image} onChange={(v) => update("featured_image", v)} />
        </div>

        <div className="bg-white rounded-[var(--radius-card)] border border-obsidian-100/50 shadow-sm p-6 space-y-5">
          <h3 className="text-sm font-semibold text-obsidian-700 font-[var(--font-heading)]">Excerpt</h3>
          <textarea value={form.excerpt} onChange={(e) => update("excerpt", e.target.value)} rows={3}
            className="w-full px-3 py-2.5 bg-white border border-obsidian-200 rounded-[var(--radius-input)] text-sm focus:outline-none focus:border-gold-400 focus:ring-1 focus:ring-gold-400/20 resize-none" placeholder="Brief summary for listings..." />
        </div>

        <div className="bg-white rounded-[var(--radius-card)] border border-obsidian-100/50 shadow-sm p-6 space-y-5">
          <h3 className="text-sm font-semibold text-obsidian-700 font-[var(--font-heading)]">Article Content</h3>
          <RichTextEditor value={form.content} onChange={(v) => update("content", v)} placeholder="Start writing your article..." />
        </div>

        <div className="bg-white rounded-[var(--radius-card)] border border-obsidian-100/50 shadow-sm p-6 space-y-5">
          <h3 className="text-sm font-semibold text-obsidian-700 font-[var(--font-heading)]">SEO</h3>
          <FormField label="SEO Title"><input type="text" value={form.seo_data.seoTitle} onChange={(e) => update("seo_data", { ...form.seo_data, seoTitle: e.target.value })} className="w-full px-3 py-2.5 bg-white border border-obsidian-200 rounded-[var(--radius-input)] text-sm focus:outline-none focus:border-gold-400 focus:ring-1 focus:ring-gold-400/20" /></FormField>
          <FormField label="SEO Description"><textarea value={form.seo_data.seoDescription} onChange={(e) => update("seo_data", { ...form.seo_data, seoDescription: e.target.value })} rows={2} className="w-full px-3 py-2.5 bg-white border border-obsidian-200 rounded-[var(--radius-input)] text-sm focus:outline-none focus:border-gold-400 focus:ring-1 focus:ring-gold-400/20 resize-none" /></FormField>
        </div>

        <SaveBar onSave={() => handleSave()} onDelete={!isNew ? () => setShowDelete(true) : undefined} saving={saving} saveLabel={isNew ? "Create Post" : "Save Changes"} />
      </div>
      <ConfirmDialog open={showDelete} title="Delete Post" message="This will permanently delete this blog post." confirmLabel="Delete" loading={deleting} onConfirm={handleDelete} onCancel={() => setShowDelete(false)} />
    </AdminLayout>
  );
}