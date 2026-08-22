"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AdminLayout from "@/components/layout/AdminLayout";
import FormField from "@/components/ui/FormField";
import SaveBar from "@/components/ui/SaveBar";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import LoadingState from "@/components/ui/LoadingState";
import toast from "react-hot-toast";

interface FaqEditorProps { faqId?: string; }

export default function FaqEditor({ faqId }: FaqEditorProps) {
  const router = useRouter();
  const isNew = !faqId;
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [form, setForm] = useState({ question: "", answer: "", enabled: true, sort_order: 0 });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!isNew) {
      fetch(`/api/faqs/${faqId}`).then((r) => r.json()).then((d) => {
        if (d.faq) setForm({ question: d.faq.question, answer: d.faq.answer, enabled: d.faq.enabled !== false, sort_order: d.faq.sort_order || 0 });
      }).finally(() => setLoading(false));
    }
  }, [faqId, isNew]);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.question.trim()) errs.question = "Question is required";
    if (!form.answer.trim()) errs.answer = "Answer is required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setSaving(true);
    try {
      const url = isNew ? "/api/faqs" : `/api/faqs/${faqId}`;
      const res = await fetch(url, { method: isNew ? "POST" : "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      if (!res.ok) { const d = await res.json(); throw new Error(d.error); }
      toast.success(isNew ? "FAQ created!" : "FAQ updated!");
      router.push("/faqs");
    } catch (err) { toast.error(err instanceof Error ? err.message : "Failed to save"); }
    finally { setSaving(false); }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try { await fetch(`/api/faqs/${faqId}`, { method: "DELETE" }); toast.success("FAQ deleted"); router.push("/faqs"); }
    catch { toast.error("Failed to delete"); }
    finally { setDeleting(false); }
  };

  if (loading) return <AdminLayout title="Loading..." breadcrumb={["Content", "FAQs"]}><LoadingState /></AdminLayout>;

  return (
    <AdminLayout title={isNew ? "New FAQ" : "Edit FAQ"} breadcrumb={["Content", "FAQs", isNew ? "New" : "Edit"]}>
      <div className="max-w-3xl space-y-6">
        <div className="bg-white rounded-[var(--radius-card)] border border-obsidian-100/50 shadow-sm p-6 space-y-5">
          <FormField label="Question" required error={errors.question}>
            <input type="text" value={form.question} onChange={(e) => { setForm(p => ({...p, question: e.target.value})); setErrors(p => ({...p, question: ""})); }}
              className="w-full px-3 py-2.5 bg-white border border-obsidian-200 rounded-[var(--radius-input)] text-sm focus:outline-none focus:border-gold-400 focus:ring-1 focus:ring-gold-400/20"
              placeholder="e.g. How long does carpet fitting take?" />
          </FormField>
          <FormField label="Answer" required error={errors.answer}>
            <textarea value={form.answer} onChange={(e) => { setForm(p => ({...p, answer: e.target.value})); setErrors(p => ({...p, answer: ""})); }}
              rows={6} className="w-full px-3 py-2.5 bg-white border border-obsidian-200 rounded-[var(--radius-input)] text-sm focus:outline-none focus:border-gold-400 focus:ring-1 focus:ring-gold-400/20 resize-none"
              placeholder="Provide a detailed answer..." />
          </FormField>
          <div className="flex items-center gap-3">
            <label className="text-sm font-medium text-obsidian-700">Enabled</label>
            <button type="button" onClick={() => setForm(p => ({...p, enabled: !p.enabled}))}
              className={`relative w-10 h-6 rounded-full transition-colors ${form.enabled ? 'bg-gold-400' : 'bg-obsidian-200'}`}>
              <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${form.enabled ? 'translate-x-4' : ''}`} />
            </button>
          </div>
        </div>
        <SaveBar onSave={handleSave} onDelete={!isNew ? () => setShowDelete(true) : undefined} saving={saving} saveLabel={isNew ? "Create FAQ" : "Save Changes"} />
      </div>
      <ConfirmDialog open={showDelete} title="Delete FAQ" message="This will permanently delete this FAQ." confirmLabel="Delete" loading={deleting} onConfirm={handleDelete} onCancel={() => setShowDelete(false)} />
    </AdminLayout>
  );
}