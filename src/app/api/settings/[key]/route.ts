import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ key: string }> }
) {
  const { key } = await params;
  const supabase = createServerClient();

  const { data, error } = await supabase
    .from("settings")
    .select("*")
    .eq("key", key)
    .single();

  if (error) {
    return NextResponse.json({ value: {} });
  }

  return NextResponse.json({ value: data.value, updated_at: data.updated_at });
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ key: string }> }
) {
  const { key } = await params;
  const supabase = createServerClient();
  const body = await request.json();

  const { data, error } = await supabase
    .from("settings")
    .upsert(
      {
        key,
        value: body.value,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "key" }
    )
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ value: data.value });
}