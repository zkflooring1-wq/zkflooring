"use client";

import { useState, useEffect } from "react";
import AdminLayout from "@/components/layout/AdminLayout";
import Link from "next/link";
import { Home, Info, ArrowRight, Loader2 } from "lucide-react";

interface PageInfo {
  label: string;
  description: string;
  href: string;
  slug: string;
  icon: typeof Home;
}

const pages: PageInfo[] = [
  {
    label: "Home Page",
    description: "Hero slider, features, about section, contact callback",
    href: "/pages/home",
    slug: "home",
    icon: Home,
  },
  {
    label: "About Page",
    description: "About section content and company information",
    href: "/pages/about",
    slug: "about",
    icon: Info,
  },
  {
    label: "Services Page",
    description: "Services overview and CTA sections",
    href: "/pages/services",
    slug: "services",
    icon: ArrowRight,
  },
  {
    label: "Projects Page",
    description: "Projects showcase configuration",
    href: "/pages/projects",
    slug: "projects",
    icon: ArrowRight,
  },
  {
    label: "Blog Page",
    description: "Blog listing page SEO and header configuration",
    href: "/pages/blog",
    slug: "blog",
    icon: ArrowRight,
  },
  {
    label: "FAQ Page",
    description: "FAQ layout and SEO configuration",
    href: "/pages/faq",
    slug: "faq",
    icon: ArrowRight,
  },
  {
    label: "Contact Page",
    description: "Contact details and location configuration",
    href: "/pages/contact",
    slug: "contact",
    icon: ArrowRight,
  },
];

export default function PagesIndex() {
  const [timestamps, setTimestamps] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTimestamps = async () => {
      const results: Record<string, string> = {};
      for (const page of pages) {
        try {
          const res = await fetch(`/api/pages/${page.slug}`);
          if (res.ok) {
            const data = await res.json();
            if (data.page?.updated_at) {
              results[page.slug] = data.page.updated_at;
            }
          }
        } catch {
          // Silently skip failed fetches
        }
      }
      setTimestamps(results);
      setLoading(false);
    };
    fetchTimestamps();
  }, []);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

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
                <h3 className="text-sm font-semibold text-obsidian-800">
                  {page.label}
                </h3>
                <p className="text-xs text-obsidian-400 mt-0.5">
                  {page.description}
                </p>
                {loading ? (
                  <div className="flex items-center gap-1 mt-1.5">
                    <Loader2 className="w-3 h-3 text-obsidian-200 animate-spin" />
                    <span className="text-[10px] text-obsidian-300">
                      Loading...
                    </span>
                  </div>
                ) : timestamps[page.slug] ? (
                  <p className="text-[10px] text-obsidian-300 mt-1.5">
                    Last updated: {formatDate(timestamps[page.slug])}
                  </p>
                ) : (
                  <p className="text-[10px] text-obsidian-300 mt-1.5">
                    Not yet configured
                  </p>
                )}
              </div>
              <ArrowRight className="w-4 h-4 text-obsidian-300 group-hover:text-gold-500 transition-colors" />
            </Link>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}