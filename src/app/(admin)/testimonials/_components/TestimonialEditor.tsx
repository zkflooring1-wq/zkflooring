'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import PageHeader from '@/components/ui/PageHeader';
import FormField from '@/components/ui/FormField';
import ImageUploader from '@/components/ui/ImageUploader';
import SaveBar from '@/components/ui/SaveBar';
import toast from 'react-hot-toast';

export default function TestimonialEditor({ id }: { id?: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    body: '',
    image: '',
    rating: 5,
    enabled: true,
    sort_order: 0,
  });

  useEffect(() => {
    if (id) {
      fetch(`/api/testimonials/${id}`)
        .then(res => res.json())
        .then(data => setFormData({
          name: data.name || '',
          username: data.username || '',
          body: data.body || '',
          image: data.image || '',
          rating: data.rating || 5,
          enabled: data.enabled !== false,
          sort_order: data.sort_order || 0,
        }))
        .catch(() => toast.error('Failed to load testimonial'));
    }
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(id ? `/api/testimonials/${id}` : '/api/testimonials', {
        method: id ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error('Failed to save');
      toast.success(id ? 'Testimonial updated' : 'Testimonial created');
      router.push('/testimonials');
      router.refresh();
    } catch (err) {
      toast.error('Error saving testimonial');
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 pb-24">
      <PageHeader 
        title={id ? 'Edit Testimonial' : 'New Testimonial'} 
        description={id ? 'Update testimonial details.' : 'Add a new testimonial.'}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
            <h3 className="text-lg font-bold text-zk-obsidian mb-4">Review Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField label="Customer Name" required>
                <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-zk-gold focus:border-zk-gold" required />
              </FormField>
              <FormField label="Username (Optional)">
                <input type="text" value={formData.username} onChange={e => setFormData({...formData, username: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-zk-gold focus:border-zk-gold" />
              </FormField>
            </div>
            
            <FormField label="Review Text" required>
              <textarea value={formData.body} onChange={e => setFormData({...formData, body: e.target.value})} rows={4} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-zk-gold focus:border-zk-gold" required></textarea>
            </FormField>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField label="Rating (1-5)">
                <input type="number" min="1" max="5" value={formData.rating} onChange={e => setFormData({...formData, rating: parseInt(e.target.value) || 5})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-zk-gold focus:border-zk-gold" />
              </FormField>
              <FormField label="Sort Order">
                <input type="number" value={formData.sort_order} onChange={e => setFormData({...formData, sort_order: parseInt(e.target.value) || 0})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-zk-gold focus:border-zk-gold" />
              </FormField>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-zk-obsidian mb-4">Customer Image</h3>
            <ImageUploader 
              value={formData.image} 
              onChange={val => setFormData({...formData, image: val})} 
            />
          </div>
          
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-zk-obsidian mb-4">Status</h3>
            <label className="flex items-center cursor-pointer">
              <div className="relative">
                <input type="checkbox" className="sr-only" checked={formData.enabled} onChange={e => setFormData({...formData, enabled: e.target.checked})} />
                <div className={`block w-14 h-8 rounded-full ${formData.enabled ? 'bg-zk-gold' : 'bg-gray-300'}`}></div>
                <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition transform ${formData.enabled ? 'translate-x-6' : ''}`}></div>
              </div>
              <div className="ml-3 text-zk-obsidian font-medium">
                {formData.enabled ? 'Active (Published)' : 'Disabled (Hidden)'}
              </div>
            </label>
          </div>
        </div>
      </div>

      <SaveBar saving={loading} 
        onCancel={() => router.push('/testimonials')}
      />
    </form>
  );
}
