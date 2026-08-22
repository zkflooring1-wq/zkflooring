import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { uploadToR2 } from "@/lib/r2";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Generate unique key
    const ext = file.name.split(".").pop() || "jpg";
    const timestamp = Date.now();
    const cleanName = file.name
      .replace(/\.[^/.]+$/, "")
      .replace(/[^a-zA-Z0-9-_]/g, "-")
      .toLowerCase();
    const key = `media/${timestamp}-${cleanName}.${ext}`;

    // Upload to R2
    const url = await uploadToR2(key, buffer, file.type);

    // Record in database
    const supabase = createServerClient();
    const { data, error } = await supabase
      .from("media")
      .insert({
        name: file.name,
        url,
        r2_key: key,
        type: file.type,
        size: file.size,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(
      { media: data, url: data.url },
      { status: 201 }
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Upload failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}