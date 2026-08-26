"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import {
  LayoutDashboard,
  Inbox,
  FolderKanban,
  Wrench,
  FileText,
  HelpCircle,
  FileStack,
  Image as ImageIcon,
  Settings,
  User,
  Users,
  MessageSquare,
  LogOut,
  X,
  ChevronRight,
} from "lucide-react";
import toast from "react-hot-toast";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/leads", label: "Leads CRM", icon: Inbox, hasBadge: true },
  { href: "/projects", label: "Projects", icon: FolderKanban },
  { href: "/services", label: "Services", icon: Wrench },
  { href: "/blogs", label: "Blog Posts", icon: FileText },
  { href: "/faqs", label: "FAQs", icon: HelpCircle },
  { href: "/team", label: "Team", icon: Users },
  { href: "/testimonials", label: "Testimonials", icon: MessageSquare },
  { href: "/pages", label: "Pages", icon: FileStack },
  { href: "/media", label: "Media", icon: ImageIcon },
  { href: "/settings", label: "Settings", icon: Settings },
  { href: "/profile", label: "Profile", icon: User },
];

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [newLeadsCount, setNewLeadsCount] = useState(0);

  useEffect(() => {
    fetch("/api/leads/stats")
      .then((r) => r.json())
      .then((d) => {
        if (d && typeof d.new === "number") {
          setNewLeadsCount(d.new);
        }
      })
      .catch(() => {});
  }, [pathname]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("Logged out successfully");
    router.push("/login");
    router.refresh();
  };

  const isActive = (href: string) => {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-[260px] bg-obsidian-900 border-r border-obsidian-700/50 flex flex-col transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo */}
        <div className="h-[70px] flex items-center justify-between px-6 border-b border-obsidian-700/50">
          <Link href="/dashboard" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-gold-400 via-gold-300 to-gold-500 flex items-center justify-center shadow-md shadow-gold-500/20">
              <span className="font-[var(--font-heading)] font-black text-obsidian-900 text-sm tracking-wider">
                ZK
              </span>
            </div>
            <div>
              <h1 className="text-white font-semibold text-sm font-[var(--font-heading)] tracking-tight">
                ZK Flooring
              </h1>
              <p className="text-obsidian-400 text-[10px] tracking-wider uppercase">
                Admin Panel
              </p>
            </div>
          </Link>
          <button
            onClick={onClose}
            className="lg:hidden text-obsidian-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {navItems.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                  active
                    ? "bg-gold-400/10 text-gold-300"
                    : "text-obsidian-300 hover:bg-obsidian-800 hover:text-white"
                }`}
              >
                <item.icon
                  className={`w-[18px] h-[18px] flex-shrink-0 ${
                    active ? "text-gold-400" : "text-obsidian-400 group-hover:text-obsidian-200"
                  }`}
                />
                <span className="flex-1">{item.label}</span>
                {item.hasBadge && newLeadsCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-amber-500 text-obsidian-950 text-[10px] font-extrabold shadow-sm animate-pulse">
                    {newLeadsCount}
                  </span>
                )}
                {active && !item.hasBadge && (
                  <ChevronRight className="w-3.5 h-3.5 text-gold-400" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="px-3 pb-4 border-t border-obsidian-700/50 pt-4">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-obsidian-400 hover:bg-red-500/10 hover:text-red-400 transition-all w-full"
          >
            <LogOut className="w-[18px] h-[18px]" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
}
