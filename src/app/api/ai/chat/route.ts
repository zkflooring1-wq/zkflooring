import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

function buildDynamicSystemPrompt(settings: any): string {
  const assistantName = settings?.assistantName || "ZK Flooring AI Advisor";
  const systemInstructions =
    settings?.systemInstructions ||
    "You are the expert flooring consultant for ZK Flooring in Birmingham & West Midlands. Provide quick, accurate pricing and recommend booking a 100% Free Home Survey.";
  const serviceAreas =
    settings?.serviceAreas ||
    "Birmingham, Solihull, Sutton Coldfield, Wolverhampton, Coventry, Dudley, and West Midlands.";
  const pricing = settings?.pricing || {
    lvtMin: 40,
    lvtMax: 85,
    engineeredWoodMin: 60,
    engineeredWoodMax: 130,
    solidWoodMin: 70,
    solidWoodMax: 150,
    laminateMin: 22,
    laminateMax: 50,
    carpetMin: 18,
    carpetMax: 45,
    subfloorMin: 8,
    subfloorMax: 20,
  };
  const tone = settings?.tone || "concise";
  const customQA = Array.isArray(settings?.customQA) ? settings.customQA : [];
  const specialPromotions = settings?.specialPromotions || "";

  let toneGuidance = "Keep answers SHORT, CONCISE, and PUNCHY (under 3-4 bullet points or 2-3 sentences max).";
  if (tone === "friendly") {
    toneGuidance = "Be warm, friendly, consultative and polite while keeping answers structured and easy to read.";
  } else if (tone === "formal") {
    toneGuidance = "Use an architectural, elegant, high-end luxury British interior tone.";
  }

  let qaKnowledge = "";
  if (customQA.length > 0) {
    qaKnowledge = "\n\nCUSTOM BUSINESS KNOWLEDGE & POLICIES:\n" +
      customQA
        .filter((q: any) => q.question && q.answer)
        .map((q: any) => `• When asked "${q.question}": Answer: ${q.answer}`)
        .join("\n");
  }

  let promoGuidance = "";
  if (specialPromotions) {
    promoGuidance = `\n\nACTIVE PROMOTION / SPECIAL OFFER:\nMention when relevant: "${specialPromotions}"`;
  }

  return `You are "${assistantName}", the expert flooring advisor for ZK Flooring in ${serviceAreas}.

CORE MISSION:
${systemInstructions}

TONE & STYLE:
${toneGuidance}

CURRENT OFFICIAL RATE CARD (£/m² Supply + Professional Fitting):
• Luxury Vinyl Tile (LVT / SPC): £${pricing.lvtMin} – £${pricing.lvtMax}/m²
• Engineered Hardwood: £${pricing.engineeredWoodMin} – £${pricing.engineeredWoodMax}/m²
• Solid Hardwood: £${pricing.solidWoodMin} – £${pricing.solidWoodMax}/m²
• Premium Laminate: £${pricing.laminateMin} – £${pricing.laminateMax}/m²
• Luxury & Commercial Carpet: £${pricing.carpetMin} – £${pricing.carpetMax}/m²
• Subfloor Screeding / Prep: £${pricing.subfloorMin} – £${pricing.subfloorMax}/m²

RULES:
1. When room size (e.g. 20 m²) is provided, directly calculate the price range with the rate card above.
2. Note that exact quotes depend on subfloor condition and room layout.
3. Suggest booking our 100% Free On-Site Laser Measurement & Sample Survey.
4. Friendly British English.${qaKnowledge}${promoGuidance}`;
}

export async function POST(request: Request) {
  try {
    const { messages } = await request.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: "Messages array is required" },
        { status: 400 }
      );
    }

    // 1. Fetch dynamic AI Training settings from Supabase
    let dynamicSystemPrompt = "";
    try {
      const { data: settingRow } = await supabaseAdmin
        .from("settings")
        .select("value")
        .eq("key", "ai_training")
        .single();

      dynamicSystemPrompt = buildDynamicSystemPrompt(settingRow?.value);
    } catch {
      dynamicSystemPrompt = buildDynamicSystemPrompt(null);
    }

    const groqKey = process.env.GROQ_API_KEY;
    const deepseekKey = process.env.DEEPSEEK_API_KEY;
    const geminiKey = process.env.GEMINI_API_KEY;

    const fullMessages: ChatMessage[] = [
      { role: "system", content: dynamicSystemPrompt },
      ...messages.slice(-6), // keep recent 6 messages for context
    ];

    // 1. Try DeepSeek (Configured primary)
    if (deepseekKey) {
      try {
        const dsRes = await fetch("https://api.deepseek.com/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${deepseekKey}`,
          },
          body: JSON.stringify({
            model: "deepseek-chat",
            messages: fullMessages,
            temperature: 0.5,
            max_tokens: 300,
          }),
        });

        if (dsRes.ok) {
          const data = await dsRes.json();
          const reply = data.choices?.[0]?.message?.content;
          if (reply) {
            return NextResponse.json({ reply, provider: "deepseek" });
          }
        }
      } catch (err) {
        console.warn("DeepSeek attempt failed, falling back:", err);
      }
    }

    // 2. Try Gemini
    if (geminiKey) {
      try {
        const contents = messages.slice(-6).map((m: any) => ({
          role: m.role === "assistant" ? "model" : "user",
          parts: [{ text: m.content }],
        }));

        const geminiRes = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              systemInstruction: {
                parts: [{ text: dynamicSystemPrompt }],
              },
              contents,
              generationConfig: {
                temperature: 0.5,
                maxOutputTokens: 300,
              },
            }),
          }
        );

        if (geminiRes.ok) {
          const data = await geminiRes.json();
          const reply = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (reply) {
            return NextResponse.json({ reply, provider: "gemini" });
          }
        }
      } catch (err) {
        console.warn("Gemini attempt failed:", err);
      }
    }

    // Fallback smart offline response
    let fallbackReply = `Hello! Welcome to ZK Flooring Birmingham.

Based on current UK rates (supply + fitting):
• **Luxury Vinyl Tile (LVT)**: £40 – £85/m²
• **Engineered Hardwood**: £60 – £130/m²
• **Premium Laminate**: £22 – £50/m²
• **Luxury Carpet**: £18 – £45/m²

Would you like to book our **100% Free On-Site Laser Survey** to get an exact quote?`;

    return NextResponse.json({ reply: fallbackReply, provider: "smart-fallback" });
  } catch (err: any) {
    console.error("AI Chat route exception:", err);
    return NextResponse.json(
      { error: err.message || "Failed to generate AI response" },
      { status: 500 }
    );
  }
}
