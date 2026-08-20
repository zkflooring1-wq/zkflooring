'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import Script from 'next/script';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    // Basic logout by deleting cookie
    document.cookie = 'admin_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    router.push('/admin-login.php');
  };

  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: 'fa-table-columns' },
    { name: 'Pages', path: '/admin/pages', icon: 'fa-file-lines' },
    { name: 'Projects', path: '/admin/projects', icon: 'fa-images' },
    { name: 'Services', path: '/admin/services', icon: 'fa-layer-group' },
    { name: 'Blog Posts', path: '/admin/blogs', icon: 'fa-pen-nib' },
    { name: 'FAQs', path: '/admin/faqs', icon: 'fa-circle-question' },
    { name: 'Settings', path: '/admin/settings', icon: 'fa-gear' },
  ];

  return (
    <>
      <Script src="https://cdn.tailwindcss.com" strategy="afterInteractive" />
      <div className="flex h-screen bg-[#111] text-gray-200 font-sans">
        {/* Sidebar */}
        <aside className="w-64 bg-[#1a1a1a] border-r border-[#333] flex flex-col">
        <div className="p-6 border-b border-[#333]">
          <h2 className="text-2xl font-bold text-white">ZK<span className="text-[#D4AF37]">Admin</span></h2>
        </div>
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.path || (item.path !== '/admin' && pathname.startsWith(item.path));
            return (
              <Link 
                key={item.name} 
                href={item.path}
                className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors ${
                  isActive 
                    ? 'bg-[#D4AF37] bg-opacity-10 text-[#D4AF37]' 
                    : 'text-gray-400 hover:bg-[#222] hover:text-white'
                }`}
              >
                <i className={`fa-solid ${item.icon} w-5`}></i>
                <span className="font-medium">{item.name}</span>
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-[#333]">
          <button 
            onClick={handleLogout}
            className="flex items-center space-x-3 px-4 py-3 w-full text-left rounded-xl text-gray-400 hover:bg-red-500 hover:bg-opacity-10 hover:text-red-500 transition-colors"
          >
            <i className="fa-solid fa-arrow-right-from-bracket w-5"></i>
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden bg-[#111]">
        <header className="h-20 border-b border-[#333] bg-[#1a1a1a] flex items-center px-8 justify-between">
          <h1 className="text-xl font-bold text-white">
            {navItems.find(i => pathname === i.path || (i.path !== '/admin' && pathname.startsWith(i.path)))?.name || 'Admin'}
          </h1>
          <div className="flex items-center space-x-4">
            <a href="/" target="_blank" className="text-sm text-[#D4AF37] hover:underline flex items-center gap-2">
              <i className="fa-solid fa-arrow-up-right-from-square"></i> View Website
            </a>
          </div>
        </header>
        <div className="flex-1 overflow-auto p-8">
          {children}
        </div>
      </main>
    </div>
    </>
  );
}
