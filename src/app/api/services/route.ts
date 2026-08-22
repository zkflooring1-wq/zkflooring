import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const supabase = createServerClient();
  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search") || "";
  const category = searchParams.get("category") || "";

  let query = supabase.from("services").select("*");

  if (search) {
    query = query.ilike("title", `%${search}%`);
  }
  if (category) {
    query = query.eq("category", category);
  }

  query = query.order("created_at", { ascending: false });

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ services: data || [] });
}

export async function POST(request: Request) {
  const supabase = createServerClient();
  const body = await request.json();

  const { data: existing } = await supabase
    .from("services")
    .select("slug")
    .eq("slug", body.slug)
    .single();

  if (existing) {
    return NextResponse.json(
      { error: "A service with this slug already exists" },
      { status: 409 }
    );
  }

  const { data, error } = await supabase
    .from("services")
    .insert({
      slug: body.slug,
      title: body.title,
      category: body.category,
      image: body.image || "",
      summary: body.summary || null,
      description: body.description || [],
      features: body.features || [],
      info_label: body.info_label || null,
      info_value: body.info_value || null,
      cta_text: body.cta_text || null,
      cta_link: body.cta_link || null,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ service: data }, { status: 201 });
}