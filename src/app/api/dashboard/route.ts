import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = createServerClient();

  const [
    { count: projectsCount },
    { count: servicesCount },
    { count: publishedPostsCount },
    { count: draftPostsCount },
    { count: faqsCount },
    { count: mediaCount },
    { data: recentProjects },
    { data: recentPosts },
  ] = await Promise.all([
    supabase.from("projects").select("*", { count: "exact", head: true }),
    supabase.from("services").select("*", { count: "exact", head: true }),
    supabase
      .from("posts")
      .select("*", { count: "exact", head: true })
      .eq("status", "published"),
    supabase
      .from("posts")
      .select("*", { count: "exact", head: true })
      .eq("status", "draft"),
    supabase.from("faqs").select("*", { count: "exact", head: true }),
    supabase.from("media").select("*", { count: "exact", head: true }),
    supabase
      .from("projects")
      .select("slug, title, category, created_at")
      .order("created_at", { ascending: false })
      .limit(5),
    supabase
      .from("posts")
      .select("id, title, status, created_at")
      .order("created_at", { ascending: false })
      .limit(5),
  ]);

  return NextResponse.json({
    stats: {
      projects: projectsCount || 0,
      services: servicesCount || 0,
      publishedPosts: publishedPostsCount || 0,
      draftPosts: draftPostsCount || 0,
      faqs: faqsCount || 0,
      media: mediaCount || 0,
    },
    recentProjects: recentProjects || [],
    recentPosts: recentPosts || [],
  });
}