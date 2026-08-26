import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const supabase = createServerClient();

  const searchSlugs = (slug === "home" || slug === "") ? ["home", "/"] : [slug];

  const { data, error } = await supabase
    .from("pages")
    .select("*")
    .in("slug", searchSlugs)
    .limit(1)
    .maybeSingle();

  if (error || !data) {
    // Page doesn't exist yet — return empty structure so editor loads cleanly
    return NextResponse.json({ page: { slug, title: slug, sections: {}, seo_data: {} } });
  }

  return NextResponse.json({ page: data });
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const supabase = createServerClient();
  const body = await request.json();

  const slugsToUpdate = (slug === "home" || slug === "") ? ["home", "/"] : [slug];

  let lastData: any = null;
  for (const s of slugsToUpdate) {
    const { data } = await supabase
      .from("pages")
      .upsert({
        slug: s,
        title: body.title || s,
        sections: body.sections || {},
        seo_data: body.seo_data || {},
        updated_at: new Date().toISOString(),
      }, { onConflict: "slug" })
      .select()
      .single();
    if (data) lastData = data;
  }

  return NextResponse.json({ page: lastData || { slug, sections: body.sections } });
}