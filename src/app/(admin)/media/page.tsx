"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import AdminLayout from "@/components/layout/AdminLayout";
import PageHeader from "@/components/ui/PageHeader";
import SearchBar from "@/components/ui/SearchBar";
import EmptyState from "@/components/ui/EmptyState";
import LoadingState from "@/components/ui/LoadingState";
import ErrorState from "@/components/ui/ErrorState";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import type { Media } from "@/types/database";
import { Upload, Image as ImageIcon, Trash2, Copy, Loader2, Check } from "lucide-react";
import toast from "react-hot-toast";

export default function MediaPage() {
  const [media, setMedia] = useState<Media[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [uploading, setUploading] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const fetchMedia = useCallback(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    fetch(`/api/media?${params}`)
      .then((r) => r.json())
      .then((d) => setMedia(d.media || []))
      .catch(() => setError("Failed to load media"))
      .finally(() => setLoading(false));
  }, [search]);

  useEffect(() => { fetchMedia(); }, [fetchMedia]);

  const handleUpload = async (files: FileList) => {
    setUploading(true);
    let successCount = 0;
    for (const file of Array.from(files)) {
      try {
        const formData = new FormData();
        formData.append("file", file);
        const res = await fetch("/api/media/upload", { method: "POST", body: formData });
        if (res.ok) successCount++;
      } catch { /* continue */ }
    }
    setUploading(false);
    if (successCount > 0) {
      toast.success(`${successCount} file(s) uploaded`);
      fetchMedia();
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await fetch(`/api/media/${deleteId}`, { method: "DELETE" });
      toast.success("Media deleted");
      setDeleteId(null);
      fetchMedia();
    } catch { toast.error("Failed to delete"); }
    finally { setDeleting(false); }
  };

  const copyUrl = (item: Media) => {
    navigator.clipboard.writeText(item.url);
    setCopiedId(item.id);
    toast.success("URL copied!");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1048576).toFixed(1)} MB`;
  };

  return (
    <AdminLayout title="Media Library" breadcrumb={["Media"]}>
      <PageHeader title="Media Library" description="Upload and manage your images" actionLabel="Upload" actionIcon={Upload} onAction={() => inputRef.current?.click()} />

      {/* Drop zone */}
      <div
        className="mb-6 border-2 border-dashed border-obsidian-200 hover:border-gold-300 rounded-[var(--radius-card)] p-8 text-center transition-all cursor-pointer bg-white"
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => { e.preventDefault(); if (e.dataTransfer.files.length) handleUpload(e.dataTransfer.files); }}
      >
        {uploading ? (
          <Loader2 className="w-8 h-8 text-gold-400 animate-spin mx-auto" />
        ) : (
          <>
            <Upload className="w-8 h-8 text-obsidian-300 mx-auto mb-2" />
            <p className="text-sm text-obsidian-500 font-medium">Click or drag files to upload</p>
            <p className="text-xs text-obsidian-300 mt-1">PNG, JPG, WEBP, SVG up to 10MB each</p>
          </>
        )}
      </div>

      <input ref={inputRef} type="file" accept="image/*" multiple className="hidden" onChange={(e) => { if (e.target.files?.length) handleUpload(e.target.files); e.target.value = ""; }} />

      <div className="mb-6"><SearchBar value={search} onChange={setSearch} placeholder="Search media..." /></div>

      {loading ? <LoadingState /> : error ? <ErrorState message={error} onRetry={fetchMedia} /> : media.length === 0 ? (
        <EmptyState icon={ImageIcon} title="No media files" description="Upload your first image" actionLabel="Upload" onAction={() => inputRef.current?.click()} />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {media.map((item) => (
            <div key={item.id} className="group bg-white rounded-xl border border-obsidian-100/50 shadow-sm overflow-hidden hover:shadow-md transition-all">
              <div className="aspect-square relative bg-obsidian-50">
                <img src={item.url} alt={item.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                  <button onClick={() => copyUrl(item)} className="p-2 bg-white/90 rounded-lg text-obsidian-700 hover:bg-white transition-all" title="Copy URL">
                    {copiedId === item.id ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                  </button>
                  <button onClick={() => setDeleteId(item.id)} className="p-2 bg-white/90 rounded-lg text-red-500 hover:bg-white transition-all" title="Delete">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="p-2.5">
                <p className="text-xs font-medium text-obsidian-700 truncate">{item.name}</p>
                <p className="text-[10px] text-obsidian-400 mt-0.5">{formatSize(item.size)}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog open={!!deleteId} title="Delete Media" message="This will permanently delete this file from storage." confirmLabel="Delete" loading={deleting} onConfirm={handleDelete} onCancel={() => setDeleteId(null)} />
    </AdminLayout>
  );
}