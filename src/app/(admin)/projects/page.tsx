"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import AdminLayout from "@/components/layout/AdminLayout";
import PageHeader from "@/components/ui/PageHeader";
import SearchBar from "@/components/ui/SearchBar";
import FilterBar from "@/components/ui/FilterBar";
import DataTable, { type Column } from "@/components/ui/DataTable";
import EmptyState from "@/components/ui/EmptyState";
import LoadingState from "@/components/ui/LoadingState";
import ErrorState from "@/components/ui/ErrorState";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import type { Project } from "@/types/database";
import { Pencil, Trash2, Copy, FolderKanban } from "lucide-react";
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

export default function ProjectsPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [deleteSlug, setDeleteSlug] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchProjects = useCallback(() => {
    setLoading(true);
    setError(null);
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (category) params.set("category", category);
    params.set("page", page.toString());

    fetch(`/api/projects?${params}`)
      .then((r) => r.json())
      .then((d) => {
        setProjects(d.projects || []);
        setTotalPages(d.totalPages || 1);
      })
      .catch(() => setError("Failed to load projects"))
      .finally(() => setLoading(false));
  }, [search, category, page]);

  useEffect(() => { fetchProjects(); }, [fetchProjects]);

  const handleDelete = async () => {
    if (!deleteSlug) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/projects/${deleteSlug}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      toast.success("Project deleted");
      setDeleteSlug(null);
      fetchProjects();
    } catch {
      toast.error("Failed to delete project");
    } finally {
      setDeleting(false);
    }
  };

  const handleDuplicate = async (project: Project) => {
    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...project,
          slug: `${project.slug}-copy-${Date.now()}`,
          title: `${project.title} (Copy)`,
        }),
      });
      if (!res.ok) throw new Error();
      toast.success("Project duplicated");
      fetchProjects();
    } catch {
      toast.error("Failed to duplicate project");
    }
  };

  const columns: Column<Project>[] = [
    {
      key: "title",
      label: "Title",
      sortable: true,
      render: (p) => (
        <div>
          <p className="font-medium text-obsidian-800">{p.title}</p>
          <p className="text-xs text-obsidian-400 mt-0.5">{p.slug}</p>
        </div>
      ),
    },
    { key: "category", label: "Category", sortable: true },
    { key: "location", label: "Location" },
    {
      key: "created_at",
      label: "Created",
      sortable: true,
      render: (p) => (
        <span className="text-xs text-obsidian-400">
          {new Date(p.created_at).toLocaleDateString()}
        </span>
      ),
    },
  ];

  return (
    <AdminLayout title="Projects" breadcrumb={["Content", "Projects"]}>
      <PageHeader
        title="Projects"
        description={`Manage your flooring project portfolio`}
        actionLabel="Add Project"
        actionHref="/projects/new"
      />

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="flex-1">
          <SearchBar value={search} onChange={setSearch} placeholder="Search projects..." />
        </div>
        <FilterBar
          filters={[
            {
              label: "All Categories",
              value: category,
              options: CATEGORIES.map((c) => ({ label: c, value: c })),
              onChange: setCategory,
            },
          ]}
        />
      </div>

      {loading ? (
        <LoadingState />
      ) : error ? (
        <ErrorState message={error} onRetry={fetchProjects} />
      ) : projects.length === 0 ? (
        <EmptyState
          icon={FolderKanban}
          title="No projects found"
          description="Create your first project to showcase your work"
          actionLabel="Add Project"
          actionHref="/projects/new"
        />
      ) : (
        <DataTable
          columns={columns}
          data={projects}
          keyField="slug"
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
          onRowClick={(p) => router.push(`/projects/${p.slug}`)}
          actions={(p) => (
            <>
              <button
                onClick={() => router.push(`/projects/${p.slug}`)}
                className="p-1.5 rounded-lg text-obsidian-400 hover:bg-obsidian-50 hover:text-obsidian-600 transition-all"
                title="Edit"
              >
                <Pencil className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => handleDuplicate(p)}
                className="p-1.5 rounded-lg text-obsidian-400 hover:bg-obsidian-50 hover:text-obsidian-600 transition-all"
                title="Duplicate"
              >
                <Copy className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setDeleteSlug(p.slug)}
                className="p-1.5 rounded-lg text-obsidian-400 hover:bg-red-50 hover:text-red-500 transition-all"
                title="Delete"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </>
          )}
        />
      )}

      <ConfirmDialog
        open={!!deleteSlug}
        title="Delete Project"
        message="Are you sure you want to delete this project? This action cannot be undone."
        confirmLabel="Delete"
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteSlug(null)}
      />
    </AdminLayout>
  );
}