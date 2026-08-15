'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    projects: 0,
    services: 0,
    posts: 0,
    faqs: 0
  });

  useEffect(() => {
    async function fetchStats() {
      const [proj, serv, post, faq] = await Promise.all([
        supabase.from('projects').select('slug', { count: 'exact', head: true }),
        supabase.from('services').select('slug', { count: 'exact', head: true }),
        supabase.from('posts').select('id', { count: 'exact', head: true }),
        supabase.from('faqs').select('id', { count: 'exact', head: true })
      ]);
      setStats({
        projects: proj.count || 0,
        services: serv.count || 0,
        posts: post.count || 0,
        faqs: faq.count || 0
      });
    }
    fetchStats();
  }, []);

  const cards = [
    { title: 'Total Projects', count: stats.projects, icon: 'fa-images', link: '/admin/projects' },
    { title: 'Active Services', count: stats.services, icon: 'fa-layer-group', link: '/admin/services' },
    { title: 'Blog Posts', count: stats.posts, icon: 'fa-pen-nib', link: '/admin/blogs' },
    { title: 'FAQs', count: stats.faqs, icon: 'fa-circle-question', link: '/admin/faqs' },
  ];

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">Welcome Back, Admin</h2>
        <p className="text-gray-400">Manage your website content efficiently.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((c, i) => (
          <Link href={c.link} key={i}>
            <div className="bg-[#1a1a1a] p-6 rounded-2xl border border-[#333] hover:border-[#D4AF37] transition-all group cursor-pointer">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-[#222] rounded-xl flex items-center justify-center group-hover:bg-[#D4AF37] group-hover:bg-opacity-20 transition-colors">
                  <i className={`fa-solid ${c.icon} text-xl text-gray-400 group-hover:text-[#D4AF37] transition-colors`}></i>
                </div>
              </div>
              <h3 className="text-gray-400 font-medium mb-1">{c.title}</h3>
              <p className="text-3xl font-bold text-white">{c.count}</p>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-12 bg-[#1a1a1a] p-8 rounded-3xl border border-[#333]">
        <h3 className="text-xl font-bold text-white mb-6"><i className="fa-solid fa-rocket text-[#D4AF37] mr-3"></i>Quick Actions</h3>
        <div className="flex flex-wrap gap-4">
          <Link href="/admin/projects/new" className="px-6 py-3 bg-[#D4AF37] text-black font-bold rounded-xl hover:bg-[#b5952f] transition-colors">
            Add New Project
          </Link>
          <Link href="/admin/blogs/new" className="px-6 py-3 bg-[#222] text-white font-medium rounded-xl border border-[#333] hover:border-[#D4AF37] hover:text-[#D4AF37] transition-colors">
            Write Blog Post
          </Link>
          <Link href="/admin/pages" className="px-6 py-3 bg-[#222] text-white font-medium rounded-xl border border-[#333] hover:border-[#D4AF37] hover:text-[#D4AF37] transition-colors">
            Edit Homepage
          </Link>
        </div>
      </div>
    </div>
  );
}
