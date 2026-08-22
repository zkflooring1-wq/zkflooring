"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import AdminLayout from "@/components/layout/AdminLayout";
import PageHeader from "@/components/ui/PageHeader";
import SearchBar from "@/components/ui/SearchBar";
import DataTable, { type Column } from "@/components/ui/DataTable";
import EmptyState from "@/components/ui/EmptyState";
import LoadingState from "@/components/ui/LoadingState";
import ErrorState from "@/components/ui/ErrorState";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import type { Service } from "@/types/database";
import { Pencil, Trash2, Wrench } from "lucide-react";
import toast from "react-hot-toast";

export default function ServicesPage() {
  const router = useRouter();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [deleteSlug, setDeleteSlug] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchServices = useCallback(() => {
    setLoading(true);
    setError(null);
    const params = new URLSearchParams();
    if (search) params.set("search", search);

    fetch(`/api/services?${params}`)
      .then((r) => r.json())
      .then((d) => setServices(d.services || []))
      .catch(() => setError("Failed to load services"))
      .finally(() => setLoading(false));
  }, [search]);

  useEffect(() => { fetchServices(); }, [fetchServices]);

  const handleDelete = async () => {
    if (!deleteSlug) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/services/${deleteSlug}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      toast.success("Service deleted");
      setDeleteSlug(null);
      fetchServices();
    } catch {
      toast.error("Failed to delete service");
    } finally {
      setDeleting(false);
    }
  };

  const columns: Column<Service>[] = [
    {
      key: "title",
      label: "Service",
      render: (s) => (
        <div>
          <p className="font-medium text-obsidian-800">{s.title}</p>
          <p className="text-xs text-obsidian-400 mt-0.5">{s.slug}</p>
        </div>
      ),
    },
    { key: "category", label: "Category" },
    {
      key: "created_at",
      label: "Created",
      render: (s) => (
        <span className="text-xs text-obsidian-400">
          {new Date(s.created_at).toLocaleDateString()}
        </span>
      ),
    },
  ];

  return (
    <AdminLayout title="Services" breadcrumb={["Content", "Services"]}>
      <PageHeader title="Services" description="Manage your flooring services" actionLabel="Add Service" actionHref="/services/new" />

      <div className="mb-6">
        <SearchBar value={search} onChange={setSearch} placeholder="Search services..." />
      </div>

      {loading ? <LoadingState /> : error ? <ErrorState message={error} onRetry={fetchServices} /> : services.length === 0 ? (
        <EmptyState icon={Wrench} title="No services found" description="Add your first flooring service" actionLabel="Add Service" actionHref="/services/new" />
      ) : (
        <DataTable
          columns={columns}
          data={services}
          keyField="slug"
          onRowClick={(s) => router.push(`/services/${s.slug}`)}
          actions={(s) => (
            <>
              <button onClick={() => router.push(`/services/${s.slug}`)} className="p-1.5 rounded-lg text-obsidian-400 hover:bg-obsidian-50 hover:text-obsidian-600 transition-all" title="Edit">
                <Pencil className="w-3.5 h-3.5" />
              </button>
              <button onClick={() => setDeleteSlug(s.slug)} className="p-1.5 rounded-lg text-obsidian-400 hover:bg-red-50 hover:text-red-500 transition-all" title="Delete">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </>
          )}
        />
      )}

      <ConfirmDialog open={!!deleteSlug} title="Delete Service" message="Are you sure? This cannot be undone." confirmLabel="Delete" loading={deleting} onConfirm={handleDelete} onCancel={() => setDeleteSlug(null)} />
    </AdminLayout>
  );
}