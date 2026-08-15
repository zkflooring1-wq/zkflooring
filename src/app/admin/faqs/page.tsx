'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function AdminFaqsPage() {
  const [faqs, setFaqs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  
  const [formData, setFormData] = useState({
    question: '',
    answer: ''
  });

  async function fetchFaqs() {
    setLoading(true);
    const { data, error } = await supabase.from('faqs').select('*').order('id', { ascending: true });
    if (!error && data) setFaqs(data);
    setLoading(false);
  }

  useEffect(() => {
    fetchFaqs();
  }, []);

  const handleEdit = (faq: any) => {
    setEditingId(faq.id);
    setFormData({ question: faq.question, answer: faq.answer });
    setModalOpen(true);
  };

  const handleAddNew = () => {
    setEditingId(null);
    setFormData({ question: '', answer: '' });
    setModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this FAQ?')) {
      await supabase.from('faqs').delete().eq('id', id);
      fetchFaqs();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      await supabase.from('faqs').update(formData).eq('id', editingId);
    } else {
      await supabase.from('faqs').insert([formData]);
    }
    setModalOpen(false);
    fetchFaqs();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">FAQs</h2>
          <p className="text-gray-400">Manage Frequently Asked Questions.</p>
        </div>
        <button onClick={handleAddNew} className="px-5 py-3 bg-[#D4AF37] text-black font-bold rounded-xl hover:bg-[#b5952f] transition-colors">
          <i className="fa-solid fa-plus mr-2"></i>Add FAQ
        </button>
      </div>

      <div className="bg-[#1a1a1a] rounded-2xl border border-[#333] overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-400">Loading...</div>
        ) : faqs.length === 0 ? (
          <div className="p-8 text-center text-gray-400">No FAQs found.</div>
        ) : (
          <div className="divide-y divide-[#333]">
            {faqs.map((faq) => (
              <div key={faq.id} className="p-6 hover:bg-[#222] transition-colors flex justify-between items-start">
                <div className="pr-8">
                  <h4 className="text-lg font-bold text-white mb-2">{faq.question}</h4>
                  <p className="text-gray-400">{faq.answer}</p>
                </div>
                <div className="flex space-x-4 flex-shrink-0">
                  <button onClick={() => handleEdit(faq)} className="text-[#D4AF37] hover:underline">Edit</button>
                  <button onClick={() => handleDelete(faq.id)} className="text-red-500 hover:underline">Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
          <div className="bg-[#1a1a1a] border border-[#333] rounded-3xl w-full max-w-lg p-8 shadow-2xl">
            <h3 className="text-2xl font-bold text-white mb-6">{editingId ? 'Edit FAQ' : 'Add FAQ'}</h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-gray-400 mb-2">Question</label>
                <input 
                  type="text" 
                  required
                  value={formData.question} 
                  onChange={e => setFormData({ ...formData, question: e.target.value })}
                  className="w-full bg-[#222] border border-[#333] rounded-xl px-4 py-3 text-white focus:border-[#D4AF37]" 
                />
              </div>
              <div>
                <label className="block text-gray-400 mb-2">Answer</label>
                <textarea 
                  required
                  rows={4}
                  value={formData.answer} 
                  onChange={e => setFormData({ ...formData, answer: e.target.value })}
                  className="w-full bg-[#222] border border-[#333] rounded-xl px-4 py-3 text-white focus:border-[#D4AF37]" 
                ></textarea>
              </div>
              <div className="flex justify-end space-x-4 pt-4">
                <button type="button" onClick={() => setModalOpen(false)} className="px-6 py-3 text-gray-400 hover:text-white">Cancel</button>
                <button type="submit" className="px-6 py-3 bg-[#D4AF37] text-black font-bold rounded-xl hover:bg-[#b5952f] transition-colors">
                  Save FAQ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
