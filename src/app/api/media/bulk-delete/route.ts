import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { deleteFromR2 } from "@/lib/r2";

export async function POST(request: Request) {
  try {
    const { ids } = await request.json();

    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ error: "No IDs provided" }, { status: 400 });
    }

    const supabase = createServerClient();

    // Get the media records to find the R2 keys
    const { data: mediaItems, error: fetchError } = await supabase
      .from("media")
      .select("id, r2_key")
      .in("id", ids);

    if (fetchError) {
      return NextResponse.json({ error: fetchError.message }, { status: 500 });
    }

    if (!mediaItems || mediaItems.length === 0) {
      return NextResponse.json({ success: true }); // Nothing to delete
    }

    // Delete from R2 (in parallel chunks or all at once)
    const deletePromises = mediaItems.map((item) => deleteFromR2(item.r2_key).catch(() => {}));
    await Promise.all(deletePromises);

    // Delete from database
    const { error: deleteError } = await supabase
      .from("media")
      .delete()
      .in("id", ids);

    if (deleteError) {
      return NextResponse.json({ error: deleteError.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, deletedCount: mediaItems.length });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Bulk delete failed";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
