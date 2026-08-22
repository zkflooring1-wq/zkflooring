"use client";

import AdminLayout from "@/components/layout/AdminLayout";
import Link from "next/link";
import { Home, Info, ArrowRight } from "lucide-react";

const pages = [
  { label: "Home Page", description: "Hero slider, features, about section, contact callback", href: "/pages/home", icon: Home },
  { label: "About Page", description: "About section content and company information", href: "/pages/about", icon: Info },
];

export default function PagesIndex() {
  return (
    <AdminLayout title="Pages" breadcrumb={["Content", "Pages"]}>
      <div className="max-w-3xl">
        <h2 className="text-xl font-bold text-obsidian-800 font-[var(--font-heading)] mb-6">
          Page Content Management
        </h2>
        <div className="space-y-4">
          {pages.map((page) => (
            <Link
              key={page.href}
              href={page.href}
              className="flex items-center gap-4 p-5 bg-white rounded-[var(--radius-card)] border border-obsidian-100/50 shadow-sm hover:shadow-md hover:border-gold-300 transition-all group"
            >
              <div className="w-12 h-12 rounded-xl bg-obsidian-50 group-hover:bg-gold-50 flex items-center justify-center transition-colors">
                <page.icon className="w-5 h-5 text-obsidian-400 group-hover:text-gold-500 transition-colors" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-obsidian-800">{page.label}</h3>
                <p className="text-xs text-obsidian-400 mt-0.5">{page.description}</p>
              </div>
              <ArrowRight className="w-4 h-4 text-obsidian-300 group-hover:text-gold-500 transition-colors" />
            </Link>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}