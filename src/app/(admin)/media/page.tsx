"use client";

import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import AdminLayout from "@/components/layout/AdminLayout";
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
  Search,
  List,
  LayoutGrid,
  Sparkles,
  ExternalLink,
  Eye
} from "lucide-react";
import toast from "react-hot-toast";

const TYPE_FILTERS = [
  { label: "All Media", value: "" },
  { label: "Images", value: "image" },
  { label: "Documents", value: "application" },
  { label: "Videos", value: "video" },
];

export default function MediaPage() {
  const [media, setMedia] = useState<Media[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "name" | "size">("newest");
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");

  const [uploading, setUploading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedMedia, setSelectedMedia] = useState<Media | null>(null);
  const [imageDims, setImageDims] = useState<{ w: number; h: number } | null>(null);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [hasSynced, setHasSynced] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [bulkDeleting, setBulkDeleting] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  const fetchMedia = useCallback(() => {
    setLoading(true);
    setError(null);
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (typeFilter) params.set("type", typeFilter);
    params.set("page", String(page));
    params.set("limit", "80");
    fetch(`/api/media?${params}`)
      .then((r) => r.json())
      .then((d) => {
        setMedia(d.media || []);
        setTotal(d.total || 0);
        setTotalPages(d.totalPages || 1);
      })
      .catch(() => setError("Failed to load media assets"))
      .finally(() => setLoading(false));
  }, [search, typeFilter, page]);

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
          toast.success(`Synced ${data.synced} files from cloud storage`);
        } else {
          toast.success(data.message || "Media library is up to date");
        }
        fetchMedia();
      } else {
        toast.error(data.error || "Storage sync failed");
      }
    } catch {
      toast.error("Failed to sync storage");
    } finally {
      setSyncing(false);
      setHasSynced(true);
    }
  }, [fetchMedia]);

  useEffect(() => {
    fetchMedia();
  }, [fetchMedia]);

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
      toast.success(`${successCount} asset(s) uploaded successfully!`);
      fetchMedia();
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await fetch(`/api/media/${deleteId}`, { method: "DELETE" });
      toast.success("Media asset deleted");
      setDeleteId(null);
      if (selectedMedia?.id === deleteId) setSelectedMedia(null);
      fetchMedia();
    } catch {
      toast.error("Failed to delete asset");
    } finally {
      setDeleting(false);
    }
  };

  const toggleSelection = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const selectAll = () => {
    if (selectedIds.size === media.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(media.map((m) => m.id)));
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

  const copyUrl = (item: Media, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    navigator.clipboard.writeText(item.url);
    setCopiedId(item.id);
    toast.success("URL copied to clipboard!");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const copySnippet = (type: "markdown" | "html" | "raw") => {
    if (!selectedMedia) return;
    let snippet = selectedMedia.url;
    if (type === "markdown") snippet = `![${selectedMedia.name}](${selectedMedia.url})`;
    if (type === "html") snippet = `<img src="${selectedMedia.url}" alt="${selectedMedia.name}" />`;
    navigator.clipboard.writeText(snippet);
    toast.success(`${type.toUpperCase()} snippet copied!`);
  };

  const formatSize = (bytes: number) => {
    if (!bytes || bytes === 0) return "0 B";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1048576).toFixed(1)} MB`;
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "Just now";
    return new Date(dateStr).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const getFileExtension = (name: string) => {
    return name.split(".").pop()?.toUpperCase() || "IMG";
  };

  // Calculate quick stats
  const totalBytes = useMemo(() => {
    return media.reduce((acc, curr) => acc + (curr.size || 0), 0);
  }, [media]);

  // Sort filtered media
  const sortedMedia = useMemo(() => {
    return [...media].sort((a, b) => {
      if (sortBy === "name") return a.name.localeCompare(b.name);
      if (sortBy === "size") return (b.size || 0) - (a.size || 0);
      if (sortBy === "oldest") return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });
  }, [media, sortBy]);

  return (
    <AdminLayout title="Media Assets Library" breadcrumb={["Media Hub"]}>
      <div className="space-y-6 pb-24 max-w-7xl mx-auto">
        
        {/* Top Header Card - Deep Obsidian & Gold Styling */}
        <div className="relative overflow-hidden rounded-2xl bg-[#16120B] border border-[#BF953F]/30 p-6 shadow-xl text-white">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#BF953F]/15 border border-[#BF953F]/40 text-[#FCF6BA] text-xs font-bold tracking-wide uppercase mb-3">
                <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                Cloud Asset Storage (R2 / Supabase)
              </div>
              <h1 className="text-2xl lg:text-3xl font-extrabold text-[#FFFFFF] tracking-tight font-[var(--font-heading)]">
                Media Library &amp; Files
              </h1>
              <p className="text-[#C8C3BA] text-sm mt-1 max-w-xl">
                Manage, preview, and copy public URLs for all website images, flooring photos, and assets.
              </p>
            </div>

            {/* Quick Metrics & Actions */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="px-4 py-2.5 rounded-xl bg-white/10 border border-white/15 backdrop-blur-md text-left">
                <div className="text-[11px] uppercase tracking-wider text-[#A8A39A] font-semibold">Total Assets</div>
                <div className="text-lg font-bold text-[#FCF6BA]">{total} <span className="text-xs text-[#A8A39A] font-normal">files</span></div>
              </div>

              <div className="px-4 py-2.5 rounded-xl bg-white/10 border border-white/15 backdrop-blur-md text-left">
                <div className="text-[11px] uppercase tracking-wider text-[#A8A39A] font-semibold">Storage Used</div>
                <div className="text-lg font-bold text-[#FFFFFF]">{formatSize(totalBytes)}</div>
              </div>

              <button
                onClick={() => syncMedia(true)}
                disabled={syncing}
                className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-[#241D14] hover:bg-[#2F261B] text-[#FCF6BA] border border-[#BF953F]/40 text-sm font-semibold transition-all shadow-md disabled:opacity-50"
                title="Sync cloud storage files"
              >
                <RefreshCw className={`w-4 h-4 text-[#D4AF37] ${syncing ? "animate-spin" : ""}`} />
                <span>{syncing ? "Syncing..." : "Sync Storage"}</span>
              </button>

              <button
                onClick={() => inputRef.current?.click()}
                disabled={uploading}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-[#BF953F] via-[#FCF6BA] to-[#B38728] hover:brightness-105 text-[#16120B] text-sm font-bold shadow-lg shadow-[#BF953F]/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <Upload className="w-4 h-4" />
                <span>Upload Assets</span>
              </button>
            </div>
          </div>
        </div>

        {/* Drag & Drop Upload Zone */}
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setIsDragging(false);
            if (e.dataTransfer.files.length) handleUpload(e.dataTransfer.files);
          }}
          onClick={() => inputRef.current?.click()}
          className={`relative group rounded-2xl border-2 border-dashed p-6 text-center transition-all cursor-pointer overflow-hidden ${
            isDragging
              ? "border-[#BF953F] bg-[#FAF6EE] shadow-lg scale-[1.005]"
              : "border-[#D4AF37]/40 hover:border-[#BF953F] bg-[#FFFFFF] hover:bg-[#FAF8F5] shadow-xs"
          }`}
        >
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

          {uploading ? (
            <div className="flex flex-col items-center justify-center py-3">
              <Loader2 className="w-8 h-8 text-[#B38728] animate-spin mb-2" />
              <p className="text-sm font-bold text-[#16120B]">Uploading media to cloud storage...</p>
              <p className="text-xs text-[#736E67] mt-0.5">Please wait while assets are optimized.</p>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 py-1">
              <div className="w-12 h-12 rounded-2xl bg-[#FAF6EE] border border-[#BF953F]/30 flex items-center justify-center text-[#B38728] shadow-inner group-hover:scale-110 transition-transform">
                <Upload className="w-5 h-5" />
              </div>
              <div className="text-center sm:text-left">
                <p className="text-sm font-bold text-[#16120B] group-hover:text-[#B38728] transition-colors">
                  Click to browse files or drag &amp; drop here
                </p>
                <p className="text-xs text-[#736E67] mt-0.5">
                  High quality <span className="font-semibold text-[#16120B]">WEBP, PNG, JPG, SVG</span> up to 15MB each
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Toolbar: Search, Filters, Sort & View Switcher */}
        <div className="bg-[#FFFFFF] rounded-2xl border border-gray-200 p-4 shadow-xs space-y-3">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            
            {/* Search Input */}
            <div className="relative flex-1 min-w-[240px]">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              <input
                type="text"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                placeholder="Search images by name..."
                className="w-full pl-10 pr-9 py-2.5 bg-[#FAF8F5] border border-gray-300 rounded-xl text-sm text-[#16120B] focus:bg-white focus:outline-none focus:border-[#BF953F] focus:ring-2 focus:ring-[#BF953F]/20 transition-all font-medium placeholder:text-gray-400"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Type Filters */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
              {TYPE_FILTERS.map((filter) => {
                const isActive = typeFilter === filter.value;
                return (
                  <button
                    key={filter.value}
                    onClick={() => {
                      setTypeFilter(filter.value);
                      setPage(1);
                    }}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                      isActive
                        ? "bg-[#16120B] text-[#FCF6BA] shadow-sm border border-[#BF953F]/40"
                        : "bg-[#FAF8F5] text-gray-700 hover:bg-gray-100 hover:text-black border border-gray-200"
                    }`}
                  >
                    {filter.label}
                  </button>
                );
              })}
            </div>

            {/* Sort & View Mode Switcher */}
            <div className="flex items-center gap-2 justify-end">
              <select
                value={sortBy}
                onChange={(e: any) => setSortBy(e.target.value)}
                className="px-3 py-2 bg-[#FAF8F5] border border-gray-300 rounded-xl text-xs font-semibold text-gray-700 focus:outline-none focus:border-[#BF953F] cursor-pointer"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="name">Name (A-Z)</option>
                <option value="size">Largest Size</option>
              </select>

              {/* View Switcher Toggle */}
              <div className="flex items-center bg-[#FAF8F5] border border-gray-300 rounded-xl p-1 gap-1">
                <button
                  onClick={() => setViewMode("list")}
                  className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    viewMode === "list"
                      ? "bg-[#16120B] text-[#FCF6BA] shadow-xs"
                      : "text-gray-600 hover:text-black"
                  }`}
                  title="List View"
                >
                  <List className="w-3.5 h-3.5" />
                  <span>List</span>
                </button>
                <button
                  onClick={() => setViewMode("grid")}
                  className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    viewMode === "grid"
                      ? "bg-[#16120B] text-[#FCF6BA] shadow-xs"
                      : "text-gray-600 hover:text-black"
                  }`}
                  title="Grid View"
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                  <span>Grid</span>
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* Media Content */}
        {loading ? (
          <LoadingState />
        ) : error ? (
          <ErrorState message={error} onRetry={fetchMedia} />
        ) : sortedMedia.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center shadow-xs">
            <div className="w-16 h-16 rounded-full bg-[#FAF6EE] border border-[#BF953F]/30 flex items-center justify-center mx-auto mb-4 text-[#B38728]">
              <ImageIcon className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-[#16120B]">No media assets found</h3>
            <p className="text-sm text-gray-500 mt-1 max-w-md mx-auto">
              {search || typeFilter
                ? "No files matched your search filters. Try clearing or changing your query."
                : "Your media library is empty. Click the button below to upload your first image."}
            </p>
            <button
              onClick={() => (search || typeFilter ? (setSearch(""), setTypeFilter("")) : inputRef.current?.click())}
              className="mt-5 px-5 py-2.5 rounded-xl bg-[#16120B] text-[#FCF6BA] hover:bg-black font-semibold text-xs transition-all shadow-md"
            >
              {search || typeFilter ? "Clear Search Filters" : "Upload First Asset"}
            </button>
          </div>
        ) : (
          <>
            {/* 1. LIST VIEW (Default & Clean) */}
            {viewMode === "list" && (
              <div className="bg-[#FFFFFF] rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
                {/* List Header */}
                <div className="bg-[#FAF8F5] border-b border-gray-200 px-4 py-3 flex items-center justify-between text-xs font-bold text-gray-600 uppercase tracking-wider">
                  <div className="flex items-center gap-3 flex-1">
                    <input
                      type="checkbox"
                      checked={selectedIds.size > 0 && selectedIds.size === media.length}
                      onChange={selectAll}
                      className="rounded text-[#B38728] focus:ring-[#B38728] w-4 h-4 cursor-pointer"
                    />
                    <span>Asset Item ({sortedMedia.length})</span>
                  </div>
                  <div className="hidden sm:flex items-center gap-8 text-right pr-2">
                    <span className="w-20">Format</span>
                    <span className="w-24">File Size</span>
                    <span className="w-28">Upload Date</span>
                    <span className="w-36 text-center">Actions</span>
                  </div>
                </div>

                {/* List Items */}
                <div className="divide-y divide-gray-100">
                  {sortedMedia.map((item) => {
                    const isSelected = selectedIds.has(item.id);
                    const isImg = item.type?.startsWith("image/");
                    return (
                      <div
                        key={item.id}
                        onClick={() => {
                          setSelectedMedia(item);
                          setImageDims(null);
                        }}
                        className={`group px-4 py-3 flex items-center justify-between gap-4 hover:bg-[#FAF6EE]/50 transition-colors cursor-pointer ${
                          isSelected ? "bg-[#FAF6EE] border-l-4 border-l-[#B38728]" : ""
                        }`}
                      >
                        {/* Left: Checkbox, Thumbnail & Name */}
                        <div className="flex items-center gap-3.5 flex-1 min-w-0">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleSelection(item.id)}
                            onClick={(e) => e.stopPropagation()}
                            className="rounded text-[#B38728] focus:ring-[#B38728] w-4 h-4 cursor-pointer flex-shrink-0"
                          />

                          {/* Sharp Preview Thumbnail */}
                          <div className="w-14 h-14 rounded-xl overflow-hidden bg-gray-100 border border-gray-200 flex-shrink-0 flex items-center justify-center shadow-xs">
                            {isImg ? (
                              <img
                                src={item.url}
                                alt={item.name}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                loading="lazy"
                              />
                            ) : (
                              <FileText className="w-6 h-6 text-gray-400" />
                            )}
                          </div>

                          {/* File Details */}
                          <div className="min-w-0 flex-1">
                            <h4 className="text-sm font-bold text-[#16120B] truncate group-hover:text-[#AA771C] transition-colors" title={item.name}>
                              {item.name}
                            </h4>
                            <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
                              <span className="font-mono text-[11px] px-1.5 py-0.2 bg-gray-100 text-gray-700 rounded font-semibold">
                                {getFileExtension(item.name)}
                              </span>
                              <span>•</span>
                              <span>{formatSize(item.size)}</span>
                              <span className="sm:hidden">•</span>
                              <span className="sm:hidden">{formatDate(item.created_at)}</span>
                            </div>
                          </div>
                        </div>

                        {/* Right: Meta columns & Action Buttons */}
                        <div className="flex items-center gap-3 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
                          <div className="hidden sm:flex items-center gap-8 text-right text-xs text-gray-600 font-medium">
                            <span className="w-20 font-mono uppercase font-bold text-gray-700">{getFileExtension(item.name)}</span>
                            <span className="w-24 font-semibold text-gray-900">{formatSize(item.size)}</span>
                            <span className="w-28 text-gray-500">{formatDate(item.created_at)}</span>
                          </div>

                          {/* Quick Actions */}
                          <div className="flex items-center gap-1.5 pl-2">
                            <button
                              onClick={(e) => copyUrl(item, e)}
                              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#FAF8F5] hover:bg-[#16120B] hover:text-[#FCF6BA] text-[#16120B] border border-gray-300 text-xs font-bold transition-all shadow-2xs"
                              title="Copy URL"
                            >
                              {copiedId === item.id ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
                              <span className="hidden md:inline">Copy</span>
                            </button>

                            <button
                              onClick={() => {
                                setSelectedMedia(item);
                                setImageDims(null);
                              }}
                              className="p-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
                              title="Inspect Image"
                            >
                              <Eye className="w-4 h-4" />
                            </button>

                            <button
                              onClick={() => setDeleteId(item.id)}
                              className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 transition-colors"
                              title="Delete File"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 2. GRID VIEW (Optional switch) */}
            {viewMode === "grid" && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {sortedMedia.map((item) => {
                  const isSelected = selectedIds.has(item.id);
                  const isImg = item.type?.startsWith("image/");
                  return (
                    <div
                      key={item.id}
                      onClick={() => {
                        if (selectedIds.size > 0) toggleSelection(item.id);
                        else {
                          setSelectedMedia(item);
                          setImageDims(null);
                        }
                      }}
                      className={`group bg-[#FFFFFF] rounded-2xl border transition-all duration-300 cursor-pointer overflow-hidden relative flex flex-col ${
                        isSelected
                          ? "border-[#BF953F] ring-2 ring-[#BF953F]/30 shadow-md scale-[0.99]"
                          : "border-gray-200 hover:border-[#BF953F] hover:shadow-xl hover:-translate-y-1"
                      }`}
                    >
                      {/* Top Checkbox */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleSelection(item.id);
                        }}
                        className={`absolute top-2.5 left-2.5 z-20 w-6 h-6 rounded-lg flex items-center justify-center transition-all ${
                          isSelected
                            ? "bg-[#BF953F] text-[#16120B] font-bold opacity-100 shadow-md"
                            : "bg-black/50 backdrop-blur-md text-white opacity-0 group-hover:opacity-100 hover:bg-black/70"
                        }`}
                      >
                        {isSelected ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : <div className="w-2.5 h-2.5 rounded-sm border border-white" />}
                      </button>

                      {/* Format Badge */}
                      <div className="absolute top-2.5 right-2.5 z-10 px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-md text-[10px] font-bold text-[#FCF6BA] uppercase tracking-wider border border-white/10">
                        {getFileExtension(item.name)}
                      </div>

                      {/* Thumbnail Box */}
                      <div className="aspect-square w-full bg-gray-100 relative overflow-hidden flex items-center justify-center">
                        {isImg ? (
                          <img
                            src={item.url}
                            alt={item.name}
                            loading="lazy"
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-108"
                          />
                        ) : (
                          <FileText className="w-12 h-12 text-gray-300" />
                        )}

                        {/* Overlay with Action Buttons */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between p-3">
                          <button
                            onClick={(e) => copyUrl(item, e)}
                            className="p-2 rounded-lg bg-white/95 hover:bg-white text-gray-900 shadow-md transition-all hover:scale-110"
                            title="Copy Public URL"
                          >
                            {copiedId === item.id ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setDeleteId(item.id);
                            }}
                            className="p-2 rounded-lg bg-red-600 hover:bg-red-500 text-white shadow-md transition-all hover:scale-110"
                            title="Delete Asset"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Metadata */}
                      <div className="p-3 bg-white flex flex-col justify-between flex-1">
                        <p className="text-xs font-bold text-gray-900 truncate" title={item.name}>
                          {item.name}
                        </p>
                        <div className="flex items-center justify-between text-[11px] text-gray-500 mt-1 font-medium">
                          <span>{formatSize(item.size)}</span>
                          <span>{formatDate(item.created_at)}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <p className="text-xs font-semibold text-gray-500">
                  Showing page <span className="text-gray-900 font-bold">{page}</span> of{" "}
                  <span className="text-gray-900 font-bold">{totalPages}</span> ({total} total assets)
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page <= 1}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold text-gray-700 bg-white border border-gray-300 hover:border-[#BF953F] disabled:opacity-40 transition-all shadow-2xs"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" /> Previous
                  </button>
                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page >= totalPages}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold text-gray-700 bg-white border border-gray-300 hover:border-[#BF953F] disabled:opacity-40 transition-all shadow-2xs"
                  >
                    Next <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}

      </div>

      {/* Floating Bulk Action Bar */}
      {selectedIds.size > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-[#16120B] text-white px-5 py-3 rounded-2xl shadow-2xl border border-[#BF953F]/40 flex items-center gap-4 animate-in slide-in-from-bottom-5 duration-200">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-[#BF953F] text-[#16120B] font-extrabold text-xs flex items-center justify-center">
              {selectedIds.size}
            </span>
            <span className="text-xs font-bold text-[#FCF6BA]">assets selected</span>
          </div>

          <div className="h-4 w-px bg-gray-700"></div>

          <button onClick={selectAll} className="text-xs text-gray-300 hover:text-white font-semibold">
            {selectedIds.size === media.length ? "Deselect All" : "Select All"}
          </button>

          <button
            onClick={() => setSelectedIds(new Set())}
            className="text-xs text-gray-400 hover:text-white"
          >
            Cancel
          </button>

          <button
            onClick={handleBulkDelete}
            disabled={bulkDeleting}
            className="px-3.5 py-1.5 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-md disabled:opacity-50"
          >
            {bulkDeleting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
            Delete Selected
          </button>
        </div>
      )}

      {/* Luxury Media Detail & Inspector Modal */}
      {selectedMedia && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/75 backdrop-blur-md transition-opacity"
            onClick={() => setSelectedMedia(null)}
          />
          <div className="relative bg-white rounded-3xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col border border-[#BF953F]/30 animate-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-[#16120B] text-white">
              <div className="flex items-center gap-2.5 overflow-hidden">
                <span className="px-2.5 py-0.5 rounded-full bg-[#BF953F]/20 border border-[#BF953F]/40 text-[10px] font-mono font-bold text-[#FCF6BA] uppercase">
                  {getFileExtension(selectedMedia.name)}
                </span>
                <h3 className="text-sm font-bold text-white truncate max-w-md">
                  {selectedMedia.name}
                </h3>
              </div>
              <button
                onClick={() => setSelectedMedia(null)}
                className="text-gray-400 hover:text-white p-1 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              
              {/* Image Preview Canvas */}
              <div className="bg-[#16120B] rounded-2xl flex items-center justify-center p-6 min-h-[300px] max-h-[420px] overflow-hidden relative border border-gray-800 shadow-inner">
                {selectedMedia.type?.startsWith("image/") ? (
                  <img
                    src={selectedMedia.url}
                    alt={selectedMedia.name}
                    onLoad={(e) => {
                      const img = e.currentTarget;
                      setImageDims({ w: img.naturalWidth, h: img.naturalHeight });
                    }}
                    className="max-h-[380px] max-w-full object-contain rounded-lg shadow-2xl"
                  />
                ) : (
                  <div className="py-12 flex flex-col items-center gap-3">
                    <FileText className="w-20 h-20 text-[#D4AF37]" />
                    <p className="text-sm text-gray-300 font-semibold">Document Asset Preview</p>
                  </div>
                )}
              </div>

              {/* Metadata Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 bg-[#FAF8F5] rounded-xl border border-gray-200">
                  <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">File Size</div>
                  <div className="text-xs font-bold text-gray-900 mt-0.5">{formatSize(selectedMedia.size)}</div>
                </div>

                <div className="p-3 bg-[#FAF8F5] rounded-xl border border-gray-200">
                  <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Dimensions</div>
                  <div className="text-xs font-bold text-gray-900 mt-0.5">
                    {imageDims ? `${imageDims.w} × ${imageDims.h} px` : "Auto-detected"}
                  </div>
                </div>

                <div className="p-3 bg-[#FAF8F5] rounded-xl border border-gray-200">
                  <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">File Type</div>
                  <div className="text-xs font-bold text-gray-900 mt-0.5 truncate">{selectedMedia.type || "image/webp"}</div>
                </div>

                <div className="p-3 bg-[#FAF8F5] rounded-xl border border-gray-200">
                  <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Date Added</div>
                  <div className="text-xs font-bold text-gray-900 mt-0.5">{formatDate(selectedMedia.created_at)}</div>
                </div>
              </div>

              {/* Public URL Box & Snippets */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Public Asset URL</label>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => copySnippet("markdown")}
                      className="text-[11px] px-2 py-0.5 bg-gray-100 hover:bg-[#FAF6EE] text-gray-700 font-semibold rounded border border-gray-200"
                    >
                      Copy Markdown
                    </button>
                    <button
                      onClick={() => copySnippet("html")}
                      className="text-[11px] px-2 py-0.5 bg-gray-100 hover:bg-[#FAF6EE] text-gray-700 font-semibold rounded border border-gray-200"
                    >
                      Copy HTML
                    </button>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={selectedMedia.url}
                    className="flex-1 px-3.5 py-2.5 bg-[#FAF8F5] border border-gray-300 rounded-xl text-xs text-gray-800 font-mono selection:bg-[#FCF6BA]"
                  />
                  <button
                    onClick={() => copyUrl(selectedMedia)}
                    className="px-4 py-2.5 rounded-xl bg-[#16120B] hover:bg-black text-[#FCF6BA] font-bold text-xs flex items-center gap-1.5 transition-colors shadow-sm"
                  >
                    {copiedId === selectedMedia.id ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                    Copy URL
                  </button>
                </div>
              </div>

              {/* Bottom Action Buttons */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <button
                  onClick={() => {
                    setDeleteId(selectedMedia.id);
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete Permanently
                </button>

                <a
                  href={selectedMedia.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  Open in New Tab
                </a>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* Permanent Delete Confirmation Dialog */}
      <ConfirmDialog
        open={!!deleteId}
        title="Delete Media Asset"
        message="Are you sure you want to permanently delete this media asset? This action will remove it from cloud storage."
        confirmLabel="Delete Asset"
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </AdminLayout>
  );
}