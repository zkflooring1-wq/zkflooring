"use client";

import { useEffect, useState } from "react";
import AdminLayout from "@/components/layout/AdminLayout";
import StatCard from "@/components/ui/StatCard";
import LoadingState from "@/components/ui/LoadingState";
import ErrorState from "@/components/ui/ErrorState";
import StatusBadge from "@/components/ui/StatusBadge";
import Link from "next/link";
import {
  FolderKanban,
  Wrench,
  FileText,
  FileEdit,
  HelpCircle,
  Image as ImageIcon,
  Plus,
  ArrowRight,
} from "lucide-react";

interface DashboardData {
  stats: {
    projects: number;
    services: number;
    publishedPosts: number;
    draftPosts: number;
    faqs: number;
    media: number;
  };
  recentProjects: { slug: string; title: string; category: string; created_at: string }[];
  recentPosts: { id: string; title: string; status: string; created_at: string }[];
}

const quickActions = [
  { label: "Add Project", href: "/projects/new", icon: FolderKanban },
  { label: "Add Service", href: "/services/new", icon: Wrench },
  { label: "Add Blog Post", href: "/blogs/new", icon: FileText },
  { label: "Add FAQ", href: "/faqs/new", icon: HelpCircle },
  { label: "Manage Home", href: "/pages/home", icon: FileEdit },
  { label: "Upload Media", href: "/media", icon: ImageIcon },
];

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = () => {
    setLoading(true);
    setError(null);
    fetch("/api/dashboard")
      .then((r) => r.json())
      .then((d) => setData(d))
      .catch(() => setError("Failed to load dashboard data"))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchData(); }, []);

  return (
    <AdminLayout title="Dashboard" breadcrumb={["Home", "Dashboard"]}>
      {loading ? (
        <LoadingState message="Loading dashboard..." />
      ) : error ? (
        <ErrorState message={error} onRetry={fetchData} />
      ) : data ? (
        <div className="space-y-8">
          {/* Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
            <StatCard label="Projects" value={data.stats.projects} icon={FolderKanban} color="gold" />
            <StatCard label="Services" value={data.stats.services} icon={Wrench} color="blue" />
            <StatCard label="Published Posts" value={data.stats.publishedPosts} icon={FileText} color="green" />
            <StatCard label="Draft Posts" value={data.stats.draftPosts} icon={FileEdit} color="purple" />
            <StatCard label="FAQs" value={data.stats.faqs} icon={HelpCircle} color="gold" />
            <StatCard label="Media Files" value={data.stats.media} icon={ImageIcon} color="blue" />
          </div>

          {/* Quick Actions */}
          <div>
            <h3 className="text-sm font-semibold text-obsidian-700 mb-3 font-[var(--font-heading)]">Quick Actions</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {quickActions.map((action) => (
                <Link
                  key={action.href}
                  href={action.href}
                  className="flex flex-col items-center gap-2 p-4 bg-white rounded-[var(--radius-card)] border border-obsidian-100/50 hover:border-gold-300 hover:shadow-md transition-all group"
                >
                  <div className="w-10 h-10 rounded-xl bg-obsidian-50 group-hover:bg-gold-50 flex items-center justify-center transition-colors">
                    <action.icon className="w-5 h-5 text-obsidian-400 group-hover:text-gold-500 transition-colors" />
                  </div>
                  <span className="text-xs font-medium text-obsidian-600 text-center">{action.label}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Recent Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Projects */}
            <div className="bg-white rounded-[var(--radius-card)] border border-obsidian-100/50 shadow-sm">
              <div className="flex items-center justify-between px-5 py-4 border-b border-obsidian-100">
                <h3 className="text-sm font-semibold text-obsidian-700 font-[var(--font-heading)]">
                  Recent Projects
                </h3>
                <Link
                  href="/projects"
                  className="text-xs text-gold-500 hover:text-gold-600 font-medium flex items-center gap-1"
                >
                  View all <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
              <div className="divide-y divide-obsidian-50">
                {data.recentProjects.length === 0 ? (
                  <p className="px-5 py-8 text-sm text-obsidian-400 text-center">No projects yet</p>
                ) : (
                  data.recentProjects.map((project) => (
                    <Link
                      key={project.slug}
                      href={`/projects/${project.slug}`}
                      className="flex items-center justify-between px-5 py-3 hover:bg-obsidian-50/50 transition-colors"
                    >
                      <div>
                        <p className="text-sm font-medium text-obsidian-700">{project.title}</p>
                        <p className="text-xs text-obsidian-400">{project.category}</p>
                      </div>
                      <span className="text-[10px] text-obsidian-300">
                        {new Date(project.created_at).toLocaleDateString()}
                      </span>
                    </Link>
                  ))
                )}
              </div>
            </div>

            {/* Recent Blog Posts */}
            <div className="bg-white rounded-[var(--radius-card)] border border-obsidian-100/50 shadow-sm">
              <div className="flex items-center justify-between px-5 py-4 border-b border-obsidian-100">
                <h3 className="text-sm font-semibold text-obsidian-700 font-[var(--font-heading)]">
                  Recent Blog Posts
                </h3>
                <Link
                  href="/blogs"
                  className="text-xs text-gold-500 hover:text-gold-600 font-medium flex items-center gap-1"
                >
                  View all <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
              <div className="divide-y divide-obsidian-50">
                {data.recentPosts.length === 0 ? (
                  <p className="px-5 py-8 text-sm text-obsidian-400 text-center">No blog posts yet</p>
                ) : (
                  data.recentPosts.map((post) => (
                    <Link
                      key={post.id}
                      href={`/blogs/${post.id}`}
                      className="flex items-center justify-between px-5 py-3 hover:bg-obsidian-50/50 transition-colors"
                    >
                      <div>
                        <p className="text-sm font-medium text-obsidian-700">{post.title}</p>
                      </div>
                      <StatusBadge
                        status={post.status}
                        variant={post.status === "published" ? "success" : "warning"}
                      />
                    </Link>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </AdminLayout>
  );
}