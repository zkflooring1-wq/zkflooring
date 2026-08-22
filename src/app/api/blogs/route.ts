import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const supabase = createServerClient();
  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search") || "";
  const status = searchParams.get("status") || "";
  const category = searchParams.get("category") || "";
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "20");

  let query = supabase.from("posts").select("*", { count: "exact" });

  if (search) {
    query = query.ilike("title", `%${search}%`);
  }
  if (status) {
    query = query.eq("status", status);
  }
  if (category) {
    query = query.contains("categories", [category]);
  }

  query = query.order("created_at", { ascending: false });
  query = query.range((page - 1) * limit, page * limit - 1);

  const { data, error, count } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    posts: data || [],
    total: count || 0,
    page,
    totalPages: Math.ceil((count || 0) / limit),
  });
}

export async function POST(request: Request) {
  const supabase = createServerClient();
  const body = await request.json();

  const { data: existing } = await supabase
    .from("posts")
    .select("slug")
    .eq("slug", body.slug)
    .single();

  if (existing) {
    return NextResponse.json(
      { error: "A post with this slug already exists" },
      { status: 409 }
    );
  }

  const { data, error } = await supabase
    .from("posts")
    .insert({
      title: body.title,
      slug: body.slug,
      content: body.content || "",
      status: body.status || "draft",
      featured_image: body.featured_image || null,
      categories: body.categories || [],
      tags: body.tags || [],
      seo_data: body.seo_data || {},
      excerpt: body.excerpt || null,
      author: body.author || null,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ post: data }, { status: 201 });
}