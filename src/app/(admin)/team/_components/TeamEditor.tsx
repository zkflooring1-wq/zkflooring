'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import PageHeader from '@/components/ui/PageHeader';
import FormField from '@/components/ui/FormField';
import ImageUploader from '@/components/ui/ImageUploader';
import SaveBar from '@/components/ui/SaveBar';
import toast from 'react-hot-toast';

export default function TeamEditor({ id }: { id?: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    image: '',
    sort_order: 0,
  });

  useEffect(() => {
    if (id) {
      fetch(`/api/team/${id}`)
        .then(res => res.json())
        .then(data => setFormData({
          name: data.name || '',
          role: data.role || '',
          image: data.image || '',
          sort_order: data.sort_order || 0,
        }))
        .catch(() => toast.error('Failed to load member'));
    }
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(id ? `/api/team/${id}` : '/api/team', {
        method: id ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error('Failed to save');
      toast.success(id ? 'Member updated' : 'Member created');
      router.push('/team');
      router.refresh();
    } catch (err) {
      toast.error('Error saving member');
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 pb-24">
      <PageHeader 
        title={id ? 'Edit Team Member' : 'New Team Member'} 
        description={id ? 'Update member details.' : 'Add a new member to the team.'}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
            <h3 className="text-lg font-bold text-zk-obsidian mb-4">Basic Information</h3>
            <FormField label="Full Name" required>
              <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-zk-gold focus:border-zk-gold" required />
            </FormField>
            <FormField label="Role / Title" required>
              <input type="text" value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-zk-gold focus:border-zk-gold" required />
            </FormField>
            <FormField label="Sort Order">
              <input type="number" value={formData.sort_order} onChange={e => setFormData({...formData, sort_order: parseInt(e.target.value) || 0})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-zk-gold focus:border-zk-gold" />
            </FormField>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-zk-obsidian mb-4">Profile Image</h3>
            <ImageUploader 
              value={formData.image} 
              onChange={val => setFormData({...formData, image: val})} 
            />
          </div>
        </div>
      </div>

      <SaveBar saving={loading} 
        onCancel={() => router.push('/team')}
      />
    </form>
  );
}
