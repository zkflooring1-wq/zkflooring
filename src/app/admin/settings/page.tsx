'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const [headerContact, setHeaderContact] = useState({
    phone: '',
    phone_link: '',
    address: '',
    email: ''
  });

  async function fetchSettings() {
    setLoading(true);
    const { data } = await supabase.from('settings').select('*').eq('key', 'header_contact').single();
    if (data && data.value) {
      setHeaderContact(data.value);
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');

    const { error } = await supabase
      .from('settings')
      .upsert({ key: 'header_contact', value: headerContact });

    if (error) {
      setMessage('Error saving settings: ' + error.message);
    } else {
      setMessage('Settings saved successfully!');
      setTimeout(() => setMessage(''), 3000);
    }
    setSaving(false);
  };

  if (loading) return <div className="text-gray-400">Loading settings...</div>;

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">Global Settings</h2>
        <p className="text-gray-400">Manage contact information and global variables.</p>
      </div>

      <form onSubmit={handleSave} className="bg-[#1a1a1a] p-8 rounded-2xl border border-[#333] space-y-6">
        <h3 className="text-xl font-bold text-[#D4AF37] border-b border-[#333] pb-4 mb-6">Contact Information</h3>
        
        {message && (
          <div className={`p-4 rounded-xl ${message.includes('Error') ? 'bg-red-500 bg-opacity-20 text-red-500' : 'bg-green-500 bg-opacity-20 text-green-500'}`}>
            {message}
          </div>
        )}

        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-400 mb-2">Display Phone Number</label>
            <input 
              type="text" 
              required
              value={headerContact.phone} 
              onChange={e => setHeaderContact({ ...headerContact, phone: e.target.value })}
              className="w-full bg-[#222] border border-[#333] rounded-xl px-4 py-3 text-white focus:border-[#D4AF37]" 
              placeholder="e.g. 07903 723 774"
            />
          </div>
          <div>
            <label className="block text-gray-400 mb-2">Phone Link (tel:)</label>
            <input 
              type="text" 
              required
              value={headerContact.phone_link} 
              onChange={e => setHeaderContact({ ...headerContact, phone_link: e.target.value })}
              className="w-full bg-[#222] border border-[#333] rounded-xl px-4 py-3 text-white focus:border-[#D4AF37]" 
              placeholder="e.g. tel:07903723774"
            />
          </div>
        </div>

        <div>
          <label className="block text-gray-400 mb-2">Email Address</label>
          <input 
            type="email" 
            required
            value={headerContact.email} 
            onChange={e => setHeaderContact({ ...headerContact, email: e.target.value })}
            className="w-full bg-[#222] border border-[#333] rounded-xl px-4 py-3 text-white focus:border-[#D4AF37]" 
          />
        </div>

        <div>
          <label className="block text-gray-400 mb-2">Physical Address</label>
          <input 
            type="text" 
            required
            value={headerContact.address} 
            onChange={e => setHeaderContact({ ...headerContact, address: e.target.value })}
            className="w-full bg-[#222] border border-[#333] rounded-xl px-4 py-3 text-white focus:border-[#D4AF37]" 
          />
        </div>

        <div className="pt-4">
          <button 
            type="submit" 
            disabled={saving}
            className="px-8 py-4 bg-[#D4AF37] text-black font-bold rounded-xl hover:bg-[#b5952f] transition-colors disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </form>
    </div>
  );
}
