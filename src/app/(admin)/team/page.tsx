'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Team } from '@/types/database';
import AdminLayout from '@/components/layout/AdminLayout';
import PageHeader from '@/components/ui/PageHeader';
import DataTable from '@/components/ui/DataTable';
import StatusBadge from '@/components/ui/StatusBadge';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import toast from 'react-hot-toast';

export default function TeamPage() {
  const [members, setMembers] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      const res = await fetch('/api/team');
      if (res.ok) {
        setMembers(await res.json());
      }
    } catch (err) {
      toast.error('Failed to load team members');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      const res = await fetch(`/api/team/${deleteId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');
      toast.success('Member deleted successfully');
      setMembers(members.filter(m => m.id !== deleteId));
    } catch (err) {
      toast.error('Error deleting member');
    } finally {
      setDeleteId(null);
    }
  };

  return (
    <AdminLayout title="Team Members" breadcrumb={["Team"]}>
      <div className="space-y-6">
      <PageHeader 
        title="Team Members" 
        description="Manage the team members displayed on the frontend."
        actionLabel="Add Member"
        actionHref="/team/new"
      />
      <DataTable
        keyField="id"
        data={members}
        
        columns={[
          { key: 'col_1', 
            label: 'Member',
            render: (m) => (
              <div className="flex items-center space-x-3">
                {m.image ? (
                  <img src={m.image} alt={m.name} className="w-10 h-10 rounded-full object-cover" />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-zk-light flex items-center justify-center text-zk-dark font-bold">
                    {m.name.charAt(0)}
                  </div>
                )}
                <div>
                  <div className="font-medium text-zk-obsidian">{m.name}</div>
                  <div className="text-sm text-gray-500">{m.role}</div>
                </div>
              </div>
            )
          },
          { label: 'Sort Order', key: 'sort_order' },
          { key: 'col_2',  label: 'Added', render: (m) => new Date(m.created_at).toLocaleDateString() }
        ]}
                actions={(m: any) => (
          <div className="flex items-center gap-2">
            <Link href={`/team/${m.id}`} className="text-obsidian-400 hover:text-gold-500 transition-colors">
              Edit
            </Link>
            <button onClick={() => setDeleteId(m.id)} className="text-obsidian-400 hover:text-red-500 transition-colors">
              Delete
            </button>
          </div>
        )}
      />
      <ConfirmDialog
        open={!!deleteId}
        title="Delete Member"
        message="Are you sure you want to delete this team member? This action cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
    </AdminLayout>
  );
}
