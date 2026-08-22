"use client";

import { Menu, ExternalLink, Bell } from "lucide-react";

interface TopbarProps {
  title: string;
  breadcrumb?: string[];
  onMenuClick: () => void;
}

export default function Topbar({ title, breadcrumb, onMenuClick }: TopbarProps) {
  const frontendUrl = process.env.NEXT_PUBLIC_FRONTEND_URL || "http://localhost:3000";

  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-obsidian-100/50">
      <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 h-16">
        {/* Left side */}
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 -ml-2 rounded-xl text-obsidian-400 hover:bg-obsidian-50 hover:text-obsidian-700 transition-all"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div>
            {breadcrumb && breadcrumb.length > 0 && (
              <div className="flex items-center gap-1.5 text-[11px] text-obsidian-300 mb-0.5">
                {breadcrumb.map((crumb, i) => (
                  <span key={i} className="flex items-center gap-1.5">
                    {i > 0 && <span>/</span>}
                    <span>{crumb}</span>
                  </span>
                ))}
              </div>
            )}
            <h1 className="text-lg font-semibold text-obsidian-800 font-[var(--font-heading)]">
              {title}
            </h1>
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2">
          <button className="p-2 rounded-xl text-obsidian-400 hover:bg-obsidian-50 hover:text-obsidian-700 transition-all relative">
            <Bell className="w-4.5 h-4.5" />
          </button>

          <a
            href={frontendUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-obsidian-600 bg-obsidian-50 hover:bg-obsidian-100 rounded-[var(--radius-button)] transition-all"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            View Website
          </a>
        </div>
      </div>
    </header>
  );
}