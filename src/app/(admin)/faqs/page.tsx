"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import AdminLayout from "@/components/layout/AdminLayout";
import PageHeader from "@/components/ui/PageHeader";
import SearchBar from "@/components/ui/SearchBar";
import EmptyState from "@/components/ui/EmptyState";
import LoadingState from "@/components/ui/LoadingState";
import ErrorState from "@/components/ui/ErrorState";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import type { FAQ } from "@/types/database";
import { Pencil, Trash2, HelpCircle, GripVertical, ToggleLeft, ToggleRight } from "lucide-react";
import toast from "react-hot-toast";

export default function FaqsPage() {
  const router = useRouter();
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchFaqs = useCallback(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.set("search", search);

    fetch(`/api/faqs?${params}`)
      .then((r) => r.json())
      .then((d) => setFaqs(d.faqs || []))
      .catch(() => setError("Failed to load FAQs"))
      .finally(() => setLoading(false));
  }, [search]);

  useEffect(() => { fetchFaqs(); }, [fetchFaqs]);

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await fetch(`/api/faqs/${deleteId}`, { method: "DELETE" });
      toast.success("FAQ deleted");
      setDeleteId(null);
      fetchFaqs();
    } catch { toast.error("Failed to delete"); }
    finally { setDeleting(false); }
  };

  const toggleEnabled = async (faq: FAQ) => {
    try {
      await fetch(`/api/faqs/${faq.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...faq, enabled: !faq.enabled }),
      });
      toast.success(faq.enabled ? "FAQ disabled" : "FAQ enabled");
      fetchFaqs();
    } catch { toast.error("Failed to update"); }
  };

  return (
    <AdminLayout title="FAQs" breadcrumb={["Content", "FAQs"]}>
      <PageHeader title="FAQs" description="Manage frequently asked questions" actionLabel="Add FAQ" actionHref="/faqs/new" />

      <div className="mb-6">
        <SearchBar value={search} onChange={setSearch} placeholder="Search FAQs..." />
      </div>

      {loading ? <LoadingState /> : error ? <ErrorState message={error} onRetry={fetchFaqs} /> : faqs.length === 0 ? (
        <EmptyState icon={HelpCircle} title="No FAQs found" description="Add your first FAQ" actionLabel="Add FAQ" actionHref="/faqs/new" />
      ) : (
        <div className="space-y-3">
          {faqs.map((faq) => (
            <div key={faq.id} className={`bg-white rounded-[var(--radius-card)] border shadow-sm p-5 transition-all ${faq.enabled !== false ? 'border-obsidian-100/50' : 'border-obsidian-100/30 opacity-60'}`}>
              <div className="flex items-start gap-3">
                <GripVertical className="w-4 h-4 text-obsidian-300 mt-1 flex-shrink-0 cursor-grab" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-obsidian-800">{faq.question}</p>
                  <p className="text-sm text-obsidian-500 mt-1 line-clamp-2">{faq.answer}</p>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button onClick={() => toggleEnabled(faq)} className="p-1.5 rounded-lg text-obsidian-400 hover:bg-obsidian-50 transition-all" title={faq.enabled !== false ? "Disable" : "Enable"}>
                    {faq.enabled !== false ? <ToggleRight className="w-4 h-4 text-green-500" /> : <ToggleLeft className="w-4 h-4" />}
                  </button>
                  <button onClick={() => router.push(`/faqs/${faq.id}`)} className="p-1.5 rounded-lg text-obsidian-400 hover:bg-obsidian-50 hover:text-obsidian-600 transition-all"><Pencil className="w-3.5 h-3.5" /></button>
                  <button onClick={() => setDeleteId(faq.id)} className="p-1.5 rounded-lg text-obsidian-400 hover:bg-red-50 hover:text-red-500 transition-all"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog open={!!deleteId} title="Delete FAQ" message="Are you sure? This cannot be undone." confirmLabel="Delete" loading={deleting} onConfirm={handleDelete} onCancel={() => setDeleteId(null)} />
    </AdminLayout>
  );
}