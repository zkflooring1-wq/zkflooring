import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = createServerClient();

    const { data: leads, error } = await supabase
      .from("leads")
      .select("status, created_at");

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const total = leads?.length || 0;
    const newCount = leads?.filter((l) => l.status === "new").length || 0;
    const contacted = leads?.filter((l) => l.status === "contacted").length || 0;
    const surveyBooked = leads?.filter((l) => l.status === "survey_booked").length || 0;
    const quoteSent = leads?.filter((l) => l.status === "quote_sent").length || 0;
    const completed = leads?.filter((l) => l.status === "completed").length || 0;

    return NextResponse.json({
      total,
      new: newCount,
      contacted,
      surveyBooked,
      quoteSent,
      completed,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
