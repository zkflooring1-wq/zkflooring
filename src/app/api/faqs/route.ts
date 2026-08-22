import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const supabase = createServerClient();
  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search") || "";

  let query = supabase.from("faqs").select("*");

  if (search) {
    query = query.or(`question.ilike.%${search}%,answer.ilike.%${search}%`);
  }

  query = query.order("sort_order", { ascending: true }).order("id", { ascending: true });

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ faqs: data || [] });
}

export async function POST(request: Request) {
  const supabase = createServerClient();
  const body = await request.json();

  const { data, error } = await supabase
    .from("faqs")
    .insert({
      question: body.question,
      answer: body.answer,
      sort_order: body.sort_order || 0,
      enabled: body.enabled !== undefined ? body.enabled : true,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ faq: data }, { status: 201 });
}

export async function PUT(request: Request) {
  const supabase = createServerClient();
  const body = await request.json();

  // Bulk reorder
  if (body.reorder && Array.isArray(body.items)) {
    const updates = body.items.map(
      (item: { id: number; sort_order: number }) =>
        supabase
          .from("faqs")
          .update({ sort_order: item.sort_order })
          .eq("id", item.id)
    );
    await Promise.all(updates);
    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ error: "Invalid request" }, { status: 400 });
}