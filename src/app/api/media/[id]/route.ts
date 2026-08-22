import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { deleteFromR2 } from "@/lib/r2";

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = createServerClient();

  // Get the media record to find the R2 key
  const { data: media, error: fetchError } = await supabase
    .from("media")
    .select("*")
    .eq("id", id)
    .single();

  if (fetchError || !media) {
    return NextResponse.json({ error: "Media not found" }, { status: 404 });
  }

  try {
    // Delete from R2
    await deleteFromR2(media.r2_key);
  } catch {
    // Continue even if R2 deletion fails (file might already be gone)
  }

  // Delete from database
  const { error } = await supabase.from("media").delete().eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}