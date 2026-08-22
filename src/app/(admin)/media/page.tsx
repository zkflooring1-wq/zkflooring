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
import {
  Upload,
  Image as ImageIcon,
  Trash2,
  Copy,
  Loader2,
  Check,
  RefreshCw,
  X,
  FileText,
  Calendar,
  HardDrive,
  Link2,
  ChevronLeft,
  ChevronRight,
  Filter,
} from "lucide-react";
import toast from "react-hot-toast";

const TYPE_FILTERS = [
  { label: "All Files", value: "" },
  { label: "Images", value: "image" },
  { label: "Videos", value: "video" },
  { label: "Documents", value: "application" },
];

export default function MediaPage() {
  const [media, setMedia] = useState<Media[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [uploading, setUploading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedMedia, setSelectedMedia] = useState<Media | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [hasSynced, setHasSynced] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [bulkDeleting, setBulkDeleting] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const fetchMedia = useCallback(() => {
    setLoading(true);
    setError(null);
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (typeFilter) params.set("type", typeFilter);
    params.set("page", String(page));
    params.set("limit", "60");
    fetch(`/api/media?${params}`)
      .then((r) => r.json())
      .then((d) => {
        setMedia(d.media || []);
        setTotal(d.total || 0);
        setTotalPages(d.totalPages || 1);
      })
      .catch(() => setError("Failed to load media"))
      .finally(() => setLoading(false));
  }, [search, typeFilter, page]);

  // Auto-sync on first load if media is empty
  const syncMedia = useCallback(async (force = false) => {
    setSyncing(true);
    try {
      const res = await fetch("/api/media/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ force }),
      });
      const data = await res.json();
      if (res.ok) {
        if (data.synced > 0) {
          toast.success(`Synced ${data.synced} files from storage`);
        } else {
          toast.success(data.message || "Media library is up to date");
        }
        fetchMedia();
      } else {
        toast.error(data.error || "Sync failed");
      }
    } catch {
      toast.error("Failed to sync media");
    } finally {
      setSyncing(false);
      setHasSynced(true);
    }
  }, [fetchMedia]);

  useEffect(() => {
    fetchMedia();
  }, [fetchMedia]);

  // Auto-sync on first visit — use force to clean stale records from old buckets
  useEffect(() => {
    if (!loading && media.length === 0 && !hasSynced && !error) {
      syncMedia(true);
    }
  }, [loading, media.length, hasSynced, error, syncMedia]);

  const handleUpload = async (files: FileList) => {
    setUploading(true);
    let successCount = 0;
    for (const file of Array.from(files)) {
      try {
        const formData = new FormData();
        formData.append("file", file);
        const res = await fetch("/api/media/upload", {
          method: "POST",
          body: formData,
        });
        if (res.ok) successCount++;
        else {
          const err = await res.json();
          toast.error(`Failed to upload ${file.name}: ${err.error}`);
        }
      } catch {
        toast.error(`Failed to upload ${file.name}`);
      }
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
      if (selectedMedia?.id === deleteId) setSelectedMedia(null);
      fetchMedia();
    } catch {
      toast.error("Failed to delete");
    } finally {
      setDeleting(false);
    }
  };

  const toggleSelection = (id: string) => {
    setSelectedIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) newSet.delete(id);
      else newSet.add(id);
      return newSet;
    });
  };

  const selectAll = () => {
    if (selectedIds.size === media.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(media.map(m => m.id)));
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.size === 0) return;
    setBulkDeleting(true);
    try {
      const res = await fetch("/api/media/bulk-delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: Array.from(selectedIds) }),
      });
      if (res.ok) {
        toast.success(`Deleted ${selectedIds.size} files`);
        setSelectedIds(new Set());
        fetchMedia();
      } else {
        const data = await res.json();
        toast.error(data.error || "Bulk delete failed");
      }
    } catch {
      toast.error("Bulk delete failed");
    } finally {
      setBulkDeleting(false);
    }
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

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const getFileExtension = (name: string) => {
    return name.split(".").pop()?.toUpperCase() || "FILE";
  };

  return (
    <AdminLayout title="Media Library" breadcrumb={["Media"]}>
      <PageHeader
        title="Media Library"
        description={`${total} file${total !== 1 ? "s" : ""} in storage`}
        actionLabel="Upload"
        actionIcon={Upload}
        onAction={() => inputRef.current?.click()}
      />

      {/* Drop zone */}
      <div
        className="mb-6 border-2 border-dashed border-obsidian-200 hover:border-gold-300 rounded-[var(--radius-card)] p-8 text-center transition-all cursor-pointer bg-white"
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          if (e.dataTransfer.files.length) handleUpload(e.dataTransfer.files);
        }}
      >
        {uploading ? (
          <Loader2 className="w-8 h-8 text-gold-400 animate-spin mx-auto" />
        ) : (
          <>
            <Upload className="w-8 h-8 text-obsidian-300 mx-auto mb-2" />
            <p className="text-sm text-obsidian-500 font-medium">
              Click or drag files to upload
            </p>
            <p className="text-xs text-obsidian-300 mt-1">
              PNG, JPG, WEBP, SVG up to 10MB each
            </p>
          </>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => {
          if (e.target.files?.length) handleUpload(e.target.files);
          e.target.value = "";
        }}
      />

      {/* Search, Filters & Sync Row */}
      <div className="mb-6 flex flex-col sm:flex-row gap-3 items-start sm:items-center">
        <div className="flex-1 w-full sm:w-auto">
          <SearchBar
            value={search}
            onChange={(v) => {
              setSearch(v);
              setPage(1);
            }}
            placeholder="Search media..."
          />
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-obsidian-300 pointer-events-none" />
            <select
              value={typeFilter}
              onChange={(e) => {
                setTypeFilter(e.target.value);
                setPage(1);
              }}
              className="pl-9 pr-4 py-2 bg-white border border-obsidian-200 rounded-[var(--radius-input)] text-sm text-obsidian-700 focus:outline-none focus:border-gold-400 appearance-none cursor-pointer"
            >
              {TYPE_FILTERS.map((f) => (
                <option key={f.value} value={f.value}>
                  {f.label}
                </option>
              ))}
            </select>
          </div>
          <button
            onClick={() => syncMedia(true)}
            disabled={syncing}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-obsidian-600 bg-white border border-obsidian-200 hover:border-gold-300 hover:bg-gold-50/30 rounded-[var(--radius-input)] transition-all disabled:opacity-50"
            title="Sync existing R2 files into the media library"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 ${syncing ? "animate-spin" : ""}`}
            />
            {syncing ? "Syncing..." : "Sync R2"}
          </button>
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <LoadingState />
      ) : error ? (
        <ErrorState message={error} onRetry={fetchMedia} />
      ) : media.length === 0 ? (
        <EmptyState
          icon={ImageIcon}
          title="No media files"
          description={
            search || typeFilter
              ? "No files match your search. Try different filters."
              : "Upload your first image or sync existing files from R2 storage."
          }
          actionLabel={search || typeFilter ? undefined : "Upload"}
          onAction={
            search || typeFilter
              ? undefined
              : () => inputRef.current?.click()
          }
        />
      ) : (
        <>
          {selectedIds.size > 0 && (
            <div className="mb-4 p-3 bg-gold-50 border border-gold-200 rounded-[var(--radius-card)] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-sm font-semibold text-obsidian-800">
                  {selectedIds.size} selected
                </span>
                <button
                  onClick={selectAll}
                  className="text-xs font-medium text-gold-600 hover:text-gold-700"
                >
                  {selectedIds.size === media.length ? "Deselect All" : "Select All"}
                </button>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedIds(new Set())}
                  className="px-3 py-1.5 text-xs font-medium text-obsidian-600 bg-white border border-obsidian-200 hover:bg-obsidian-50 rounded-lg transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleBulkDelete}
                  disabled={bulkDeleting}
                  className="px-3 py-1.5 text-xs font-medium text-white bg-red-500 hover:bg-red-600 rounded-lg transition-all flex items-center gap-1.5 disabled:opacity-50"
                >
                  {bulkDeleting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                  Delete Selected
                </button>
              </div>
            </div>
          )}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {media.map((item) => {
              const isSelected = selectedIds.has(item.id);
              return (
              <div
                key={item.id}
                className={`group bg-white rounded-xl border shadow-sm overflow-hidden hover:shadow-md transition-all cursor-pointer relative ${isSelected ? 'border-gold-400 ring-1 ring-gold-400' : 'border-obsidian-100/50'}`}
                onClick={() => {
                  if (selectedIds.size > 0) {
                    toggleSelection(item.id);
                  } else {
                    setSelectedMedia(item);
                  }
                }}
              >
                {/* Selection Checkbox */}
                <div 
                  className={`absolute top-2 left-2 z-20 p-1 rounded-md transition-all ${isSelected ? 'bg-gold-500 opacity-100' : 'bg-white/80 opacity-0 group-hover:opacity-100 hover:bg-white'} border ${isSelected ? 'border-gold-500' : 'border-obsidian-200'}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleSelection(item.id);
                  }}
                >
                  <Check className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-obsidian-300 opacity-0 group-hover:opacity-100'}`} />
                </div>
                
                <div className="aspect-square relative bg-obsidian-50">
                  {item.type.startsWith("image/") ? (
                    <img
                      src={item.url}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <FileText className="w-10 h-10 text-obsidian-200" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        copyUrl(item);
                      }}
                      className="p-2 bg-white/90 rounded-lg text-obsidian-700 hover:bg-white transition-all"
                      title="Copy URL"
                    >
                      {copiedId === item.id ? (
                        <Check className="w-4 h-4 text-green-500" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeleteId(item.id);
                      }}
                      className="p-2 bg-white/90 rounded-lg text-red-500 hover:bg-white transition-all"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="p-2.5">
                  <p className="text-xs font-medium text-obsidian-700 truncate">
                    {item.name}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[10px] text-obsidian-400">
                      {formatSize(item.size)}
                    </span>
                    <span className="text-[10px] text-obsidian-300">•</span>
                    <span className="text-[10px] px-1.5 py-0.5 bg-obsidian-50 text-obsidian-400 rounded font-medium">
                      {getFileExtension(item.name)}
                    </span>
                  </div>
                </div>
              </div>
            )})}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6 pt-4 border-t border-obsidian-100">
              <p className="text-sm text-obsidian-400">
                Page {page} of {totalPages} · {total} files
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1}
                  className="p-2 text-sm text-obsidian-500 bg-white border border-obsidian-200 rounded-lg hover:border-obsidian-300 disabled:opacity-40 transition-all"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page >= totalPages}
                  className="p-2 text-sm text-obsidian-500 bg-white border border-obsidian-200 rounded-lg hover:border-obsidian-300 disabled:opacity-40 transition-all"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Media Detail Modal */}
      {selectedMedia && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setSelectedMedia(null)}
          />
          <div className="relative bg-white rounded-[var(--radius-card)] shadow-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-obsidian-100">
              <h3 className="text-base font-semibold text-obsidian-800 truncate pr-4">
                {selectedMedia.name}
              </h3>
              <button
                onClick={() => setSelectedMedia(null)}
                className="text-obsidian-300 hover:text-obsidian-500 flex-shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Preview */}
            <div className="bg-obsidian-50 flex items-center justify-center p-4">
              {selectedMedia.type.startsWith("image/") ? (
                <img
                  src={selectedMedia.url}
                  alt={selectedMedia.name}
                  className="max-h-[400px] max-w-full object-contain rounded-lg"
                />
              ) : (
                <div className="py-12 flex flex-col items-center gap-2">
                  <FileText className="w-16 h-16 text-obsidian-200" />
                  <p className="text-sm text-obsidian-400">No preview available</p>
                </div>
              )}
            </div>

            {/* Metadata */}
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-xs text-obsidian-400">
                    <FileText className="w-3 h-3" />
                    File Name
                  </div>
                  <p className="text-sm font-medium text-obsidian-700 break-all">
                    {selectedMedia.name}
                  </p>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-xs text-obsidian-400">
                    <HardDrive className="w-3 h-3" />
                    File Size
                  </div>
                  <p className="text-sm font-medium text-obsidian-700">
                    {formatSize(selectedMedia.size)}
                  </p>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-xs text-obsidian-400">
                    <ImageIcon className="w-3 h-3" />
                    Type
                  </div>
                  <p className="text-sm font-medium text-obsidian-700">
                    {selectedMedia.type}
                  </p>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-xs text-obsidian-400">
                    <Calendar className="w-3 h-3" />
                    Uploaded
                  </div>
                  <p className="text-sm font-medium text-obsidian-700">
                    {formatDate(selectedMedia.created_at)}
                  </p>
                </div>
              </div>

              {/* URL */}
              <div className="space-y-1.5">
                <div className="flex items-center gap-1.5 text-xs text-obsidian-400">
                  <Link2 className="w-3 h-3" />
                  Public URL
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={selectedMedia.url}
                    className="flex-1 px-3 py-2 bg-obsidian-50 border border-obsidian-200 rounded-[var(--radius-input)] text-xs text-obsidian-600 font-mono"
                  />
                  <button
                    onClick={() => copyUrl(selectedMedia)}
                    className="px-3 py-2 text-sm font-medium text-obsidian-600 bg-white border border-obsidian-200 hover:border-gold-300 rounded-[var(--radius-input)] transition-all flex items-center gap-1.5"
                  >
                    {copiedId === selectedMedia.id ? (
                      <Check className="w-3.5 h-3.5 text-green-500" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                    Copy
                  </button>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3 pt-2 border-t border-obsidian-100">
                <button
                  onClick={() => {
                    setDeleteId(selectedMedia.id);
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-500 bg-red-50 hover:bg-red-100 rounded-[var(--radius-button)] transition-all"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Delete
                </button>
                <a
                  href={selectedMedia.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-obsidian-600 bg-obsidian-50 hover:bg-obsidian-100 rounded-[var(--radius-button)] transition-all"
                >
                  Open in New Tab
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={!!deleteId}
        title="Delete Media"
        message="This will permanently delete this file from storage. This action cannot be undone."
        confirmLabel="Delete"
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </AdminLayout>
  );
}