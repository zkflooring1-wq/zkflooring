import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = createServerClient();

  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("slug", id)
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 404 });
  }

  return NextResponse.json({ project: data });
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = createServerClient();
  const body = await request.json();

  // Check slug uniqueness if slug changed
  if (body.slug && body.slug !== id) {
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
  }

  const { data, error } = await supabase
    .from("projects")
    .update({
      title: body.title,
      slug: body.slug,
      category: body.category,
      image: body.image,
      location: body.location,
      short_desc: body.short_desc,
      description: body.description,
      highlights: body.highlights,
      client: body.client,
      duration: body.duration,
      area: body.area,
    })
    .eq("slug", id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ project: data });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = createServerClient();

  const { error } = await supabase.from("projects").delete().eq("slug", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}