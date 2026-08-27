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
import { Sparkles, Wand2, X, Check, Loader2, BookOpen } from "lucide-react";
import toast from "react-hot-toast";

const RichTextEditor = dynamic(() => import("@/components/ui/RichTextEditor"), { ssr: false });

interface BlogEditorProps {
  postId?: string;
}

export default function BlogEditor({ postId }: BlogEditorProps) {
  const router = useRouter();
  const isNew = !postId;
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // AI Generator Modal State
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [aiTopic, setAiTopic] = useState("");
  const [aiGenerating, setAiGenerating] = useState(false);
  const [aiStep, setAiStep] = useState("");

  const [form, setForm] = useState({
    title: "",
    slug: "",
    content: "",
    status: "draft" as "draft" | "published",
    featured_image: "",
    categories: [] as string[],
    tags: [] as string[],
    excerpt: "",
    author: "ZK Flooring",
    seo_data: { seoTitle: "", seoDescription: "" },
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!isNew) {
      fetch(`/api/blogs/${postId}`)
        .then((r) => r.json())
        .then((d) => {
          if (d.post) {
            const p = d.post as Post;
            setForm({
              title: p.title,
              slug: p.slug,
              content: p.content,
              status: p.status,
              featured_image: p.featured_image || "",
              categories: p.categories || [],
              tags: p.tags || [],
              excerpt: p.excerpt || "",
              author: p.author || "ZK Flooring",
              seo_data: {
                seoTitle: p.seo_data?.seoTitle || "",
                seoDescription: p.seo_data?.seoDescription || "",
              },
            });
          }
        })
        .finally(() => setLoading(false));
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
      const res = await fetch(url, {
        method: isNew ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save");
      toast.success(isNew ? "Post created!" : "Post updated!");
      router.push("/blogs");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await fetch(`/api/blogs/${postId}`, { method: "DELETE" });
      toast.success("Post deleted");
      router.push("/blogs");
    } catch {
      toast.error("Failed to delete");
    } finally {
      setDeleting(false);
    }
  };

  const update = (field: string, value: unknown) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  // 1-Click AI Blog Generation Handler
  const handleGenerateWithAI = async () => {
    const topicToUse = aiTopic.trim() || form.title.trim();
    if (!topicToUse) {
      toast.error("Please enter an article topic or title");
      return;
    }

    setAiGenerating(true);
    setAiStep("Crafting human perspective & hook (1200+ words)...");

    try {
      setTimeout(() => setAiStep("Applying AdSense structure & step-by-step guidance..."), 4000);
      setTimeout(() => setAiStep("Formatting headings, tags & SEO meta..."), 9000);

      const res = await fetch("/api/ai/generate-blog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic: topicToUse }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Generation failed");

      // Auto-populate all fields
      const autoSlug = (data.title || topicToUse)
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-");

      setForm((prev) => ({
        ...prev,
        title: data.title || topicToUse,
        slug: autoSlug,
        content: data.content || "",
        excerpt: data.excerpt || "",
        categories: data.categories?.length ? data.categories : ["Flooring Tips", "Guides"],
        tags: data.tags?.length ? data.tags : ["Flooring", "LVT", "Home Improvement"],
        author: "ZK Flooring Specialist",
        featured_image: prev.featured_image || data.featured_image || "",
        seo_data: {
          seoTitle: data.seoTitle || data.title || "",
          seoDescription: data.seoDescription || data.excerpt || "",
        },
      }));

      toast.success("✨ 1200+ Word Human-Grade Blog Article Generated!");
      setAiModalOpen(false);
    } catch (err: any) {
      toast.error(err.message || "Failed to generate blog with AI");
    } finally {
      setAiGenerating(false);
      setAiStep("");
    }
  };

  if (loading) {
    return (
      <AdminLayout title="Loading..." breadcrumb={["Content", "Blog Posts"]}>
        <LoadingState />
      </AdminLayout>
    );
  }

  return (
    <AdminLayout
      title={isNew ? "New Blog Post" : `Edit: ${form.title}`}
      breadcrumb={["Content", "Blog Posts", isNew ? "New" : form.title]}
    >
      <div className="max-w-4xl space-y-6">
        {/* Top 1-Click AI Banner */}
        <div className="bg-gradient-to-r from-obsidian-900 via-obsidian-850 to-obsidian-900 border border-gold-400/30 rounded-[var(--radius-card)] p-5 text-white shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-gold-400 to-gold-600 text-obsidian-950 flex items-center justify-center font-bold shadow-md shadow-gold-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold font-[var(--font-heading)] text-white">
                1-Click AI Blog & SEO Content Generator
              </h4>
              <p className="text-xs text-obsidian-300 mt-0.5">
                Generate 100% unique, human-grade, AdSense-ready 1200+ word articles with SEO titles & tags.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              setAiTopic(form.title || "");
              setAiModalOpen(true);
            }}
            className="px-4 py-2.5 bg-gradient-to-r from-gold-400 to-gold-500 hover:from-gold-300 hover:to-gold-400 text-obsidian-950 font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2 shrink-0"
          >
            <Wand2 className="w-3.5 h-3.5" />
            Generate with AI
          </button>
        </div>

        {/* Post Details Card */}
        <div className="bg-white rounded-[var(--radius-card)] border border-obsidian-100/50 shadow-sm p-6 space-y-5">
          <h3 className="text-sm font-semibold text-obsidian-700 font-[var(--font-heading)]">Post Details</h3>
          <FormField label="Title" required error={errors.title}>
            <input
              type="text"
              value={form.title}
              onChange={(e) => {
                update("title", e.target.value);
                if (isNew) {
                  update(
                    "slug",
                    e.target.value
                      .toLowerCase()
                      .replace(/[^a-z0-9\s-]/g, "")
                      .replace(/\s+/g, "-")
                  );
                }
              }}
              placeholder="e.g. Best Water-Resistant Flooring for UK Homes in 2026"
              className="w-full px-3 py-2.5 bg-white border border-obsidian-200 rounded-[var(--radius-input)] text-sm focus:outline-none focus:border-gold-400 focus:ring-1 focus:ring-gold-400/20"
            />
          </FormField>
          <SlugField value={form.slug} onChange={(v) => update("slug", v)} titleValue={form.title} error={errors.slug} />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <FormField label="Author">
              <input
                type="text"
                value={form.author}
                onChange={(e) => update("author", e.target.value)}
                className="w-full px-3 py-2.5 bg-white border border-obsidian-200 rounded-[var(--radius-input)] text-sm focus:outline-none focus:border-gold-400 focus:ring-1 focus:ring-gold-400/20"
                placeholder="e.g. ZK Flooring Specialist"
              />
            </FormField>
            <FormField label="Status">
              <select
                value={form.status}
                onChange={(e) => update("status", e.target.value)}
                className="w-full px-3 py-2.5 bg-white border border-obsidian-200 rounded-[var(--radius-input)] text-sm focus:outline-none focus:border-gold-400 focus:ring-1 focus:ring-gold-400/20"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </FormField>
          </div>
          <FormField label="Categories">
            <TagInput
              value={form.categories}
              onChange={(v) => update("categories", v)}
              placeholder="Add category..."
              suggestions={["Flooring Tips", "Project Updates", "Industry News", "Guides", "LVT Flooring", "Hardwood"]}
            />
          </FormField>
          <FormField label="Tags">
            <TagInput
              value={form.tags}
              onChange={(v) => update("tags", v)}
              placeholder="Add tag..."
              suggestions={["LVT", "Hardwood", "Laminate", "Carpet", "Birmingham", "Underfloor Heating"]}
            />
          </FormField>
        </div>

        {/* Featured Image */}
        <div className="bg-white rounded-[var(--radius-card)] border border-obsidian-100/50 shadow-sm p-6 space-y-5">
          <h3 className="text-sm font-semibold text-obsidian-700 font-[var(--font-heading)]">Featured Image</h3>
          <ImageUploader value={form.featured_image} onChange={(v) => update("featured_image", v)} />
        </div>

        {/* Excerpt */}
        <div className="bg-white rounded-[var(--radius-card)] border border-obsidian-100/50 shadow-sm p-6 space-y-5">
          <h3 className="text-sm font-semibold text-obsidian-700 font-[var(--font-heading)]">Excerpt / Summary Hook</h3>
          <textarea
            value={form.excerpt}
            onChange={(e) => update("excerpt", e.target.value)}
            rows={3}
            className="w-full px-3 py-2.5 bg-white border border-obsidian-200 rounded-[var(--radius-input)] text-sm focus:outline-none focus:border-gold-400 focus:ring-1 focus:ring-gold-400/20 resize-none"
            placeholder="Brief 2-sentence summary for listings and Google snippets..."
          />
        </div>

        {/* Article Content (Rich Text) */}
        <div className="bg-white rounded-[var(--radius-card)] border border-obsidian-100/50 shadow-sm p-6 space-y-5">
          <h3 className="text-sm font-semibold text-obsidian-700 font-[var(--font-heading)]">Article Content</h3>
          <RichTextEditor value={form.content} onChange={(v) => update("content", v)} placeholder="Start writing or generate with AI..." />
        </div>

        {/* SEO Meta */}
        <div className="bg-white rounded-[var(--radius-card)] border border-obsidian-100/50 shadow-sm p-6 space-y-5">
          <h3 className="text-sm font-semibold text-obsidian-700 font-[var(--font-heading)]">Search Engine Optimization (SEO)</h3>
          <FormField label="SEO Title" hint="Optimal length: 50-60 characters">
            <input
              type="text"
              value={form.seo_data.seoTitle}
              onChange={(e) => update("seo_data", { ...form.seo_data, seoTitle: e.target.value })}
              className="w-full px-3 py-2.5 bg-white border border-obsidian-200 rounded-[var(--radius-input)] text-sm focus:outline-none focus:border-gold-400 focus:ring-1 focus:ring-gold-400/20"
            />
          </FormField>
          <FormField label="SEO Description" hint="Optimal length: 140-160 characters">
            <textarea
              value={form.seo_data.seoDescription}
              onChange={(e) => update("seo_data", { ...form.seo_data, seoDescription: e.target.value })}
              rows={2}
              className="w-full px-3 py-2.5 bg-white border border-obsidian-200 rounded-[var(--radius-input)] text-sm focus:outline-none focus:border-gold-400 focus:ring-1 focus:ring-gold-400/20 resize-none"
            />
          </FormField>
        </div>

        <SaveBar
          onSave={() => handleSave()}
          onDelete={!isNew ? () => setShowDelete(true) : undefined}
          saving={saving}
          saveLabel={isNew ? "Create Post" : "Save Changes"}
        />
      </div>

      {/* AI BLOG GENERATOR MODAL */}
      {aiModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-[var(--radius-card)] border border-obsidian-200 shadow-2xl max-w-lg w-full p-6 space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-obsidian-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-gold-500 text-obsidian-950 flex items-center justify-center font-bold">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-obsidian-900 font-[var(--font-heading)]">
                    1-Click AI Blog & SEO Generator
                  </h3>
                  <p className="text-[11px] text-obsidian-400">100% Unique, AdSense-Friendly Human Writer</p>
                </div>
              </div>
              {!aiGenerating && (
                <button onClick={() => setAiModalOpen(false)} className="text-obsidian-400 hover:text-obsidian-700 p-1">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-obsidian-700 block mb-1.5">
                  Article Topic or Working Title *
                </label>
                <input
                  type="text"
                  disabled={aiGenerating}
                  value={aiTopic}
                  onChange={(e) => setAiTopic(e.target.value)}
                  placeholder="e.g. Best Water-Resistant Flooring for UK Homes in 2026"
                  className="w-full px-3.5 py-2.5 bg-obsidian-50 border border-obsidian-200 rounded-xl text-xs text-obsidian-900 focus:outline-none focus:border-gold-400"
                />
              </div>

              <div className="p-3.5 rounded-xl bg-gold-50/50 border border-gold-200/60 space-y-1.5 text-xs text-obsidian-700">
                <div className="font-bold text-gold-800 flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-gold-600" />
                  What AI will generate for you:
                </div>
                <ul className="list-disc list-inside text-[11px] text-obsidian-600 space-y-1 pl-1">
                  <li><strong>1200+ Words:</strong> Human tone, real scenarios & step-by-step guidance.</li>
                  <li><strong>AdSense Compliant:</strong> Zero robotic jargon & proper keyword flow.</li>
                  <li><strong>Full SEO Meta:</strong> Optimized Title, Description, Excerpt & Tags.</li>
                  <li><strong>Featured Image:</strong> Auto-curated high-res flooring image.</li>
                </ul>
              </div>

              {aiGenerating && (
                <div className="p-4 rounded-xl bg-obsidian-900 text-white space-y-2 border border-gold-500/30">
                  <div className="flex items-center gap-2.5 text-xs text-gold-300 font-bold">
                    <Loader2 className="w-4 h-4 animate-spin text-gold-400" />
                    Generating Full Article...
                  </div>
                  <p className="text-[11px] text-obsidian-300 animate-pulse">{aiStep}</p>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-obsidian-100">
              <button
                type="button"
                disabled={aiGenerating}
                onClick={() => setAiModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-obsidian-500 hover:text-obsidian-800"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={aiGenerating || !aiTopic.trim()}
                onClick={handleGenerateWithAI}
                className="px-5 py-2.5 bg-gradient-to-r from-gold-400 to-gold-500 hover:from-gold-300 hover:to-gold-400 text-obsidian-950 font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2 disabled:opacity-50"
              >
                <Wand2 className="w-3.5 h-3.5" />
                {aiGenerating ? "Writing 1200+ Words..." : "Generate Full Article ➔"}
              </button>
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={showDelete}
        title="Delete Post"
        message="This will permanently delete this blog post."
        confirmLabel="Delete"
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setShowDelete(false)}
      />
    </AdminLayout>
  );
}