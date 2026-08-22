'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Testimonial } from '@/types/database';
import AdminLayout from '@/components/layout/AdminLayout';
import PageHeader from '@/components/ui/PageHeader';
import DataTable from '@/components/ui/DataTable';
import StatusBadge from '@/components/ui/StatusBadge';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import toast from 'react-hot-toast';

export default function TestimonialsPage() {
  const [items, setItems] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const res = await fetch('/api/testimonials');
      if (res.ok) {
        setItems(await res.json());
      }
    } catch (err) {
      toast.error('Failed to load testimonials');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      const res = await fetch(`/api/testimonials/${deleteId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');
      toast.success('Testimonial deleted successfully');
      setItems(items.filter(i => i.id !== deleteId));
    } catch (err) {
      toast.error('Error deleting testimonial');
    } finally {
      setDeleteId(null);
    }
  };

  return (
    <AdminLayout title="Testimonials" breadcrumb={["Testimonials"]}>
      <div className="space-y-6">
      <PageHeader 
        title="Testimonials" 
        description="Manage the customer reviews shown on the frontend."
        actionLabel="Add Testimonial"
        actionHref="/testimonials/new"
      />
      <DataTable
        keyField="id"
        data={items}
        
        columns={[
          { key: 'col_1', 
            label: 'Reviewer',
            render: (i) => (
              <div className="flex items-center space-x-3">
                {i.image ? (
                  <img src={i.image} alt={i.name} className="w-10 h-10 rounded-full object-cover" />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-zk-light flex items-center justify-center text-zk-dark font-bold">
                    {i.name.charAt(0)}
                  </div>
                )}
                <div>
                  <div className="font-medium text-zk-obsidian">{i.name}</div>
                  <div className="text-xs text-gray-500">{i.username || 'Anonymous'}</div>
                </div>
              </div>
            )
          },
          { key: 'col_2',  label: 'Rating', render: (i) => `${i.rating}/5` },
          { key: 'col_3',  label: 'Status', render: (i) => <StatusBadge status={i.enabled ? 'Active' : 'Disabled'} variant={i.enabled ? 'success' : 'neutral'} /> },
          { key: 'col_4',  label: 'Added', render: (i) => new Date(i.created_at).toLocaleDateString() }
        ]}
                actions={(i: any) => (
          <div className="flex items-center gap-2">
            <Link href={`/testimonials/${i.id}`} className="text-obsidian-400 hover:text-gold-500 transition-colors">
              Edit
            </Link>
            <button onClick={() => setDeleteId(i.id)} className="text-obsidian-400 hover:text-red-500 transition-colors">
              Delete
            </button>
          </div>
        )}
      />
      <ConfirmDialog
        open={!!deleteId}
        title="Delete Testimonial"
        message="Are you sure you want to delete this testimonial? This action cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
    </AdminLayout>
  );
}
