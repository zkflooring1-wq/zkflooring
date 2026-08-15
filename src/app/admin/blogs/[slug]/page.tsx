'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import ImageUpload from '@/components/admin/ImageUpload';

export default function EditBlogPage({ params }: { params: { slug: string } }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    content: '',
    status: 'published',
    featured_image: '',
    seo_data: { excerpt: '', author: '', seoTitle: '', seoDescription: '' },
    categories: ['Flooring Insights']
  });

  const isNew = params.slug === 'new';

  useEffect(() => {
    if (isNew) {
      setInitialLoading(false);
      return;
    }
    async function fetchPost() {
      const { data, error } = await supabase.from('posts').select('*').eq('id', params.slug).single();
      if (data) {
        setFormData({
          title: data.title || '',
          slug: data.slug || '',
          content: data.content || '',
          status: data.status || 'published',
          featured_image: data.featured_image || '',
          seo_data: data.seo_data || { excerpt: '', author: '', seoTitle: '', seoDescription: '' },
          categories: data.categories || ['Flooring Insights']
        });
      }
      setInitialLoading(false);
    }
    fetchPost();
  }, [params.slug, isNew]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const payload = {
      title: formData.title,
      slug: formData.slug,
      content: formData.content,
      status: formData.status,
      featured_image: formData.featured_image,
      seo_data: formData.seo_data,
      categories: formData.categories
    };

    try {
      if (isNew) {
        const { error } = await supabase.from('posts').insert([payload]);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('posts').update(payload).eq('id', params.slug);
        if (error) throw error;
      }
      router.push('/admin/blogs');
    } catch (err: any) {
      setError(err.message || 'Error saving post');
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) return <div className="text-gray-400">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto pb-20">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">{isNew ? 'Write Blog Post' : 'Edit Blog Post'}</h2>
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
            <label className="block text-gray-400 mb-2">URL Slug</label>
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

        <div>
          <label className="block text-gray-400 mb-2">Status</label>
          <select
            value={formData.status}
            onChange={e => setFormData({ ...formData, status: e.target.value })}
            className="w-full bg-[#222] border border-[#333] rounded-xl px-4 py-3 text-white focus:border-[#D4AF37]"
          >
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>
        </div>

        <div>
          <label className="block text-gray-400 mb-2">Cover Image</label>
          <ImageUpload 
            currentImage={formData.featured_image}
            folder="blogs"
            onImageUploaded={(url) => setFormData({ ...formData, featured_image: url })}
          />
        </div>

        <div>
          <label className="block text-gray-400 mb-2">Excerpt (Short Summary)</label>
          <textarea 
            rows={3}
            value={formData.seo_data.excerpt} 
            onChange={e => setFormData({ ...formData, seo_data: { ...formData.seo_data, excerpt: e.target.value } })}
            className="w-full bg-[#222] border border-[#333] rounded-xl px-4 py-3 text-white focus:border-[#D4AF37]" 
          ></textarea>
        </div>

        <div>
          <label className="block text-gray-400 mb-2">Blog Content (HTML allowed)</label>
          <textarea 
            required
            rows={15}
            value={formData.content} 
            onChange={e => setFormData({ ...formData, content: e.target.value })}
            className="w-full bg-[#222] border border-[#333] rounded-xl px-4 py-3 text-white focus:border-[#D4AF37] font-mono text-sm leading-relaxed" 
            placeholder="<p>Write your blog content here...</p>"
          ></textarea>
        </div>

        <div className="border-t border-[#333] pt-6">
          <h3 className="text-xl font-bold text-white mb-4">SEO Settings</h3>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-400 mb-2">SEO Title</label>
              <input 
                type="text" 
                value={formData.seo_data.seoTitle} 
                onChange={e => setFormData({ ...formData, seo_data: { ...formData.seo_data, seoTitle: e.target.value } })}
                className="w-full bg-[#222] border border-[#333] rounded-xl px-4 py-3 text-white focus:border-[#D4AF37]" 
              />
            </div>
            <div>
              <label className="block text-gray-400 mb-2">Author Name</label>
              <input 
                type="text" 
                value={formData.seo_data.author} 
                onChange={e => setFormData({ ...formData, seo_data: { ...formData.seo_data, author: e.target.value } })}
                className="w-full bg-[#222] border border-[#333] rounded-xl px-4 py-3 text-white focus:border-[#D4AF37]" 
              />
            </div>
          </div>
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="w-full py-4 bg-[#D4AF37] text-black font-bold rounded-xl hover:bg-[#b5952f] transition-colors disabled:opacity-50"
        >
          {loading ? 'Saving...' : 'Save Blog Post'}
        </button>
      </form>
    </div>
  );
}
