"use client";

import AdminLayout from "@/components/layout/AdminLayout";
import Link from "next/link";
import { Phone, Share2, SquareMenu, Globe, ArrowRight } from "lucide-react";

const settingsPages = [
  { label: "Contact Info", description: "Phone, email, address, operating hours", href: "/settings/contact", icon: Phone },
  { label: "Social Links", description: "Facebook, Instagram, Twitter/X, Pinterest", href: "/settings/social", icon: Share2 },
  { label: "Footer", description: "Copyright text, company description, footer links", href: "/settings/footer", icon: SquareMenu },
  { label: "SEO", description: "Site title, meta description, canonical URL", href: "/settings/seo", icon: Globe },
];

export default function SettingsIndex() {
  return (
    <AdminLayout title="Settings" breadcrumb={["Settings"]}>
      <div className="max-w-3xl">
        <h2 className="text-xl font-bold text-obsidian-800 font-[var(--font-heading)] mb-6">Global Settings</h2>
        <div className="space-y-4">
          {settingsPages.map((item) => (
            <Link key={item.href} href={item.href}
              className="flex items-center gap-4 p-5 bg-white rounded-[var(--radius-card)] border border-obsidian-100/50 shadow-sm hover:shadow-md hover:border-gold-300 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-obsidian-50 group-hover:bg-gold-50 flex items-center justify-center transition-colors">
                <item.icon className="w-5 h-5 text-obsidian-400 group-hover:text-gold-500 transition-colors" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-obsidian-800">{item.label}</h3>
                <p className="text-xs text-obsidian-400 mt-0.5">{item.description}</p>
              </div>
              <ArrowRight className="w-4 h-4 text-obsidian-300 group-hover:text-gold-500 transition-colors" />
            </Link>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}