import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, service, room_size, estimated_cost, message, source } = body;

    if (!name || !phone) {
      return NextResponse.json(
        { error: "Name and Phone number are required" },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from("leads")
      .insert([
        {
          name: name.trim(),
          email: email?.trim() || null,
          phone: phone.trim(),
          service: service || "General Inquiry",
          room_size: room_size || null,
          estimated_cost: estimated_cost || null,
          message: message?.trim() || null,
          source: source || "contact_form",
          status: "new",
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Supabase insert lead error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, lead: data });
  } catch (err: any) {
    console.error("Error creating lead:", err);
    return NextResponse.json(
      { error: err.message || "Failed to process lead" },
      { status: 500 }
    );
  }
}
