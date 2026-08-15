'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export default function AdminBlogsPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchPosts() {
    setLoading(true);
    const { data, error } = await supabase.from('posts').select('*').order('created_at', { ascending: false });
    if (!error && data) {
      setPosts(data);
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this post?')) {
      await supabase.from('posts').delete().eq('id', id);
      fetchPosts();
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">Blog Posts</h2>
          <p className="text-gray-400">Manage your flooring insights and articles.</p>
        </div>
        <Link href="/admin/blogs/new" className="px-5 py-3 bg-[#D4AF37] text-black font-bold rounded-xl hover:bg-[#b5952f] transition-colors">
          <i className="fa-solid fa-plus mr-2"></i>Write Post
        </Link>
      </div>

      <div className="bg-[#1a1a1a] rounded-2xl border border-[#333] overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-400">Loading...</div>
        ) : posts.length === 0 ? (
          <div className="p-8 text-center text-gray-400">No posts found. Add one above.</div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#222] border-b border-[#333] text-gray-300">
                <th className="p-4 font-semibold">Title</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold">Date</th>
                <th className="p-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => (
                <tr key={post.id} className="border-b border-[#333] hover:bg-[#222] transition-colors">
                  <td className="p-4 font-medium text-white">{post.title}</td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      post.status === 'published' ? 'bg-green-500 bg-opacity-20 text-green-400' : 'bg-yellow-500 bg-opacity-20 text-yellow-400'
                    }`}>
                      {post.status?.toUpperCase() || 'DRAFT'}
                    </span>
                  </td>
                  <td className="p-4 text-gray-400">{new Date(post.created_at).toLocaleDateString()}</td>
                  <td className="p-4 text-right">
                    <Link href={`/admin/blogs/${post.id}`} className="text-[#D4AF37] hover:underline mr-4">Edit</Link>
                    <button onClick={() => handleDelete(post.id)} className="text-red-500 hover:underline">Delete</button>
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
