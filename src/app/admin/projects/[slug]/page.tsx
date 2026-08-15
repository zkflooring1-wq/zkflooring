'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import ImageUpload from '@/components/admin/ImageUpload';

export default function EditProjectPage({ params }: { params: { slug: string } }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    slug: '',
    title: '',
    category: '',
    image: '',
    location: '',
    description: [''],
    highlights: ['']
  });

  const isNew = params.slug === 'new';

  useEffect(() => {
    if (isNew) {
      setInitialLoading(false);
      return;
    }
    async function fetchProject() {
      const { data, error } = await supabase.from('projects').select('*').eq('slug', params.slug).single();
      if (data) {
        setFormData(data);
      }
      setInitialLoading(false);
    }
    fetchProject();
  }, [params.slug, isNew]);

  const handleArrayChange = (field: 'description' | 'highlights', index: number, value: string) => {
    const newArr = [...formData[field]];
    newArr[index] = value;
    setFormData({ ...formData, [field]: newArr });
  };

  const addArrayItem = (field: 'description' | 'highlights') => {
    setFormData({ ...formData, [field]: [...formData[field], ''] });
  };

  const removeArrayItem = (field: 'description' | 'highlights', index: number) => {
    const newArr = formData[field].filter((_, i) => i !== index);
    setFormData({ ...formData, [field]: newArr });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isNew) {
        const { error } = await supabase.from('projects').insert([formData]);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('projects').update(formData).eq('slug', params.slug);
        if (error) throw error;
      }
      router.push('/admin/projects');
    } catch (err: any) {
      setError(err.message || 'Error saving project');
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) return <div className="text-gray-400">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">{isNew ? 'Add Project' : 'Edit Project'}</h2>
        <button onClick={() => router.back()} className="text-gray-400 hover:text-white">Cancel</button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 bg-[#1a1a1a] p-8 rounded-2xl border border-[#333]">
        {error && <div className="bg-red-500 bg-opacity-20 text-red-500 p-4 rounded-xl">{error}</div>}
        
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-400 mb-2">Title</label>
            <input 
              type="text" 
              required
              value={formData.title} 
              onChange={e => {
                const title = e.target.value;
                setFormData(prev => ({ 
                  ...prev, 
                  title, 
                  slug: isNew ? title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') : prev.slug 
                }))
              }}
              className="w-full bg-[#222] border border-[#333] rounded-xl px-4 py-3 text-white focus:border-[#D4AF37]" 
            />
          </div>
          <div>
            <label className="block text-gray-400 mb-2">Slug</label>
            <input 
              type="text" 
              required
              disabled={!isNew}
              value={formData.slug} 
              onChange={e => setFormData({ ...formData, slug: e.target.value })}
              className="w-full bg-[#222] border border-[#333] rounded-xl px-4 py-3 text-white focus:border-[#D4AF37] disabled:opacity-50" 
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-400 mb-2">Category (e.g. LVT Flooring)</label>
            <input 
              type="text" 
              required
              value={formData.category} 
              onChange={e => setFormData({ ...formData, category: e.target.value })}
              className="w-full bg-[#222] border border-[#333] rounded-xl px-4 py-3 text-white focus:border-[#D4AF37]" 
            />
          </div>
          <div>
            <label className="block text-gray-400 mb-2">Location (e.g. Solihull, West Midlands)</label>
            <input 
              type="text" 
              required
              value={formData.location} 
              onChange={e => setFormData({ ...formData, location: e.target.value })}
              className="w-full bg-[#222] border border-[#333] rounded-xl px-4 py-3 text-white focus:border-[#D4AF37]" 
            />
          </div>
        </div>

        <div>
          <label className="block text-gray-400 mb-2">Cover Image</label>
          <ImageUpload 
            currentImage={formData.image}
            folder="projects"
            onImageUploaded={(url) => setFormData({ ...formData, image: url })}
          />
        </div>

        <div>
          <label className="block text-gray-400 mb-2 flex justify-between">
            <span>Description Paragraphs</span>
            <button type="button" onClick={() => addArrayItem('description')} className="text-[#D4AF37] text-sm">+ Add Paragraph</button>
          </label>
          {formData.description.map((desc, index) => (
            <div key={index} className="flex gap-2 mb-3">
              <textarea 
                rows={2}
                value={desc} 
                onChange={e => handleArrayChange('description', index, e.target.value)}
                className="w-full bg-[#222] border border-[#333] rounded-xl px-4 py-3 text-white focus:border-[#D4AF37]" 
              ></textarea>
              <button type="button" onClick={() => removeArrayItem('description', index)} className="px-4 text-red-500 hover:bg-red-500 hover:bg-opacity-20 rounded-xl">
                <i className="fa-solid fa-trash"></i>
              </button>
            </div>
          ))}
        </div>

        <div>
          <label className="block text-gray-400 mb-2 flex justify-between">
            <span>Highlights (Bullet Points)</span>
            <button type="button" onClick={() => addArrayItem('highlights')} className="text-[#D4AF37] text-sm">+ Add Highlight</button>
          </label>
          {formData.highlights.map((feat, index) => (
            <div key={index} className="flex gap-2 mb-3">
              <input 
                type="text" 
                value={feat} 
                onChange={e => handleArrayChange('highlights', index, e.target.value)}
                className="w-full bg-[#222] border border-[#333] rounded-xl px-4 py-3 text-white focus:border-[#D4AF37]" 
              />
              <button type="button" onClick={() => removeArrayItem('highlights', index)} className="px-4 text-red-500 hover:bg-red-500 hover:bg-opacity-20 rounded-xl">
                <i className="fa-solid fa-trash"></i>
              </button>
            </div>
          ))}
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="w-full py-4 bg-[#D4AF37] text-black font-bold rounded-xl hover:bg-[#b5952f] transition-colors disabled:opacity-50"
        >
          {loading ? 'Saving...' : 'Save Project'}
        </button>
      </form>
    </div>
  );
}
