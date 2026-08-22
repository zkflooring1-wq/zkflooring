"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import AdminLayout from "@/components/layout/AdminLayout";
import PageHeader from "@/components/ui/PageHeader";
import SearchBar from "@/components/ui/SearchBar";
import FilterBar from "@/components/ui/FilterBar";
import DataTable, { type Column } from "@/components/ui/DataTable";
import StatusBadge from "@/components/ui/StatusBadge";
import EmptyState from "@/components/ui/EmptyState";
import LoadingState from "@/components/ui/LoadingState";
import ErrorState from "@/components/ui/ErrorState";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import type { Post } from "@/types/database";
import { Pencil, Trash2, FileText } from "lucide-react";
import toast from "react-hot-toast";

export default function BlogsPage() {
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchPosts = useCallback(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (status) params.set("status", status);
    params.set("page", page.toString());

    fetch(`/api/blogs?${params}`)
      .then((r) => r.json())
      .then((d) => { setPosts(d.posts || []); setTotalPages(d.totalPages || 1); })
      .catch(() => setError("Failed to load blog posts"))
      .finally(() => setLoading(false));
  }, [search, status, page]);

  useEffect(() => { fetchPosts(); }, [fetchPosts]);

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await fetch(`/api/blogs/${deleteId}`, { method: "DELETE" });
      toast.success("Post deleted");
      setDeleteId(null);
      fetchPosts();
    } catch { toast.error("Failed to delete"); }
    finally { setDeleting(false); }
  };

  const columns: Column<Post>[] = [
    {
      key: "title", label: "Title",
      render: (p) => (
        <div>
          <p className="font-medium text-obsidian-800">{p.title}</p>
          <p className="text-xs text-obsidian-400 mt-0.5">{p.slug}</p>
        </div>
      ),
    },
    {
      key: "status", label: "Status",
      render: (p) => <StatusBadge status={p.status} variant={p.status === "published" ? "success" : "warning"} />,
    },
    {
      key: "author", label: "Author",
      render: (p) => <span className="text-sm">{p.author || "â€”"}</span>,
    },
    {
      key: "created_at", label: "Date",
      render: (p) => <span className="text-xs text-obsidian-400">{new Date(p.created_at).toLocaleDateString()}</span>,
    },
  ];

  return (
    <AdminLayout title="Blog Posts" breadcrumb={["Content", "Blog Posts"]}>
      <PageHeader title="Blog Posts" description="Manage your blog content" actionLabel="New Post" actionHref="/blogs/new" />

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="flex-1"><SearchBar value={search} onChange={setSearch} placeholder="Search posts..." /></div>
        <FilterBar filters={[{ label: "All Status", value: status, options: [{ label: "Published", value: "published" }, { label: "Draft", value: "draft" }], onChange: setStatus }]} />
      </div>

      {loading ? <LoadingState /> : error ? <ErrorState message={error} onRetry={fetchPosts} /> : posts.length === 0 ? (
        <EmptyState icon={FileText} title="No blog posts found" description="Write your first blog post" actionLabel="New Post" actionHref="/blogs/new" />
      ) : (
        <DataTable columns={columns} data={posts} keyField="id" page={page} totalPages={totalPages} onPageChange={setPage}
          onRowClick={(p) => router.push(`/blogs/${p.id}`)}
          actions={(p) => (
            <>
              <button onClick={() => router.push(`/blogs/${p.id}`)} className="p-1.5 rounded-lg text-obsidian-400 hover:bg-obsidian-50 hover:text-obsidian-600 transition-all"><Pencil className="w-3.5 h-3.5" /></button>
              <button onClick={() => setDeleteId(p.id)} className="p-1.5 rounded-lg text-obsidian-400 hover:bg-red-50 hover:text-red-500 transition-all"><Trash2 className="w-3.5 h-3.5" /></button>
            </>
          )}
        />
      )}
      <ConfirmDialog open={!!deleteId} title="Delete Post" message="This will permanently delete this blog post." confirmLabel="Delete" loading={deleting} onConfirm={handleDelete} onCancel={() => setDeleteId(null)} />
    </AdminLayout>
  );
}