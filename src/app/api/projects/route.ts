import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const supabase = createServerClient();
  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search") || "";
  const category = searchParams.get("category") || "";
  const location = searchParams.get("location") || "";
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "20");
  const sortField = searchParams.get("sortField") || "created_at";
  const sortDir = searchParams.get("sortDir") || "desc";

  let query = supabase.from("projects").select("*", { count: "exact" });

  if (search) {
    query = query.ilike("title", `%${search}%`);
  }
  if (category) {
    query = query.eq("category", category);
  }
  if (location) {
    query = query.ilike("location", `%${location}%`);
  }

  const ascending = sortDir === "asc";
  query = query.order(sortField, { ascending });
  query = query.range((page - 1) * limit, page * limit - 1);

  const { data, error, count } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    projects: data || [],
    total: count || 0,
    page,
    totalPages: Math.ceil((count || 0) / limit),
  });
}

export async function POST(request: Request) {
  const supabase = createServerClient();
  const body = await request.json();

  // Check slug uniqueness
  const { data: existing } = await supabase
    .from("projects")
    .select("slug")
    .eq("slug", body.slug)
    .single();

  if (existing) {
    return NextResponse.json(
      { error: "A project with this slug already exists" },
      { status: 409 }
    );
  }

  const { data, error } = await supabase
    .from("projects")
    .insert({
      slug: body.slug,
      title: body.title,
      category: body.category,
      image: body.image || "",
      location: body.location || "",
      short_desc: body.short_desc || null,
      description: body.description || [],
      highlights: body.highlights || [],
      client: body.client || null,
      duration: body.duration || null,
      area: body.area || null,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ project: data }, { status: 201 });
}