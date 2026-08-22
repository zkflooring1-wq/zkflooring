import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { listAllR2Objects, PUBLIC_URL } from "@/lib/r2";

function getMimeType(key: string): string {
  const ext = key.split(".").pop()?.toLowerCase() || "";
  const mimeMap: Record<string, string> = {
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    png: "image/png",
    gif: "image/gif",
    webp: "image/webp",
    svg: "image/svg+xml",
    avif: "image/avif",
    bmp: "image/bmp",
    ico: "image/x-icon",
    mp4: "video/mp4",
    webm: "video/webm",
    pdf: "application/pdf",
  };
  return mimeMap[ext] || "application/octet-stream";
}

function getFileName(key: string): string {
  return key.split("/").pop() || key;
}

export async function POST(request: Request) {
  try {
    const supabase = createServerClient();

    // Check if force resync is requested (clears stale records from old buckets)
    let forceResync = false;
    try {
      const body = await request.json();
      forceResync = body?.force === true;
    } catch {
      // No body or invalid JSON is fine — default to incremental sync
    }

    // List all objects from R2
    const r2Objects = await listAllR2Objects();

    if (forceResync) {
      // Delete all existing media records that don't match current R2 bucket URL
      // This handles the case where credentials were changed to a different bucket
      const { data: existingMedia } = await supabase
        .from("media")
        .select("id, url");

      if (existingMedia && existingMedia.length > 0) {
        const staleIds = existingMedia
          .filter((m: { id: string; url: string }) => !m.url.startsWith(PUBLIC_URL))
          .map((m: { id: string; url: string }) => m.id);

        if (staleIds.length > 0) {
          await supabase.from("media").delete().in("id", staleIds);
        }
      }
    }

    if (r2Objects.length === 0) {
      return NextResponse.json({ synced: 0, total: 0, message: "No files found in R2 bucket" });
    }

    // Get all existing r2_keys from the media table
    const { data: existingMedia, error: fetchError } = await supabase
      .from("media")
      .select("r2_key");

    if (fetchError) {
      return NextResponse.json({ error: fetchError.message }, { status: 500 });
    }

    const existingKeys = new Set(
      (existingMedia || []).map((m: { r2_key: string }) => m.r2_key)
    );

    // Filter to only new objects
    const newObjects = r2Objects.filter((obj) => !existingKeys.has(obj.key));

    if (newObjects.length === 0) {
      return NextResponse.json({
        synced: 0,
        total: r2Objects.length,
        message: "All R2 objects are already synced",
      });
    }

    // Insert new objects into the media table in batches of 50
    let syncedCount = 0;
    const batchSize = 50;

    for (let i = 0; i < newObjects.length; i += batchSize) {
      const batch = newObjects.slice(i, i + batchSize).map((obj) => ({
        name: getFileName(obj.key),
        url: `${PUBLIC_URL}/${obj.key}`,
        r2_key: obj.key,
        type: getMimeType(obj.key),
        size: obj.size,
        created_at: obj.lastModified
          ? obj.lastModified.toISOString()
          : new Date().toISOString(),
      }));

      const { error: insertError } = await supabase
        .from("media")
        .insert(batch);

      if (!insertError) {
        syncedCount += batch.length;
      }
    }

    return NextResponse.json({
      synced: syncedCount,
      total: r2Objects.length,
      message: `Synced ${syncedCount} new media files from R2`,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Sync failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
