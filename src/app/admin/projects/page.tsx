'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchProjects() {
    setLoading(true);
    const { data, error } = await supabase.from('projects').select('*').order('created_at', { ascending: false });
    if (!error && data) {
      setProjects(data);
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleDelete = async (slug: string) => {
    if (confirm('Are you sure you want to delete this project?')) {
      await supabase.from('projects').delete().eq('slug', slug);
      fetchProjects();
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">Projects</h2>
          <p className="text-gray-400">Manage your flooring portfolio.</p>
        </div>
        <Link href="/admin/projects/new" className="px-5 py-3 bg-[#D4AF37] text-black font-bold rounded-xl hover:bg-[#b5952f] transition-colors">
          <i className="fa-solid fa-plus mr-2"></i>Add Project
        </Link>
      </div>

      <div className="bg-[#1a1a1a] rounded-2xl border border-[#333] overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-400">Loading...</div>
        ) : projects.length === 0 ? (
          <div className="p-8 text-center text-gray-400">No projects found. Add one above.</div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#222] border-b border-[#333] text-gray-300">
                <th className="p-4 font-semibold">Image</th>
                <th className="p-4 font-semibold">Title</th>
                <th className="p-4 font-semibold">Location</th>
                <th className="p-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((proj) => (
                <tr key={proj.slug} className="border-b border-[#333] hover:bg-[#222] transition-colors">
                  <td className="p-4">
                    <img src={proj.image} alt={proj.title} className="w-16 h-12 object-cover rounded-lg border border-[#444]" />
                  </td>
                  <td className="p-4 font-medium text-white">{proj.title}</td>
                  <td className="p-4 text-gray-400">{proj.location}</td>
                  <td className="p-4 text-right">
                    <Link href={`/admin/projects/${proj.slug}`} className="text-[#D4AF37] hover:underline mr-4">Edit</Link>
                    <button onClick={() => handleDelete(proj.slug)} className="text-red-500 hover:underline">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
