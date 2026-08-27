import { NextResponse } from "next/server";

const MASTER_BLOG_PROMPT = `Act as a real human tech blogger with hands-on experience.

Write a high-quality, 100% unique, AdSense-friendly article on the topic:
"{TOPIC}"

Important writing style instructions:
- Write like someone who has actually used or experienced this topic in real life.
- Use a natural, conversational tone (like explaining to a friend).
- Avoid robotic, generic, or overly formal language.
- Do NOT use typical AI phrases like "In today's digital world", "In conclusion", etc.

Content requirements:
- Start with a relatable hook or personal situation (not a definition).
- Share real-life experience, observations, or practical scenarios.
- Include mistakes, lessons learned, or unexpected results.
- Add step-by-step guidance where helpful.
- Mention real tools, apps, devices, or platforms (if relevant).
- Explain things simply — avoid unnecessary jargon.
- Keep paragraphs short and easy to read.

SEO & AdSense rules:
- Content must be original and plagiarism-free.
- No misleading claims, fake promises, or harmful advice.
- No keyword stuffing — keep it natural.
- Focus on user value first, SEO second.
- Make the content helpful enough that a real user can take action.

Structure guidelines (but keep it natural, not robotic):
- Engaging introduction (story or problem-based)
- Main content with practical insights
- Step-by-step solutions or tips
- Real examples or use cases
- Common mistakes to avoid
- Final thoughts (natural ending, not forced summary)

Length:
- Minimum 1200 words (extend if topic requires depth)

Goal:
The article should feel like it’s written by a real person who has actually gone through the problem and is helping others — not like AI-generated content.

Internal & External Linking Rules:
- Include natural, high-value internal links (e.g. to /services, /services/lvt-flooring, /services/wood-flooring, /contact, /about).
- AdSense compliance: Ensure all claims are authentic and value-first.

Word replacements (MANDATORY):
Aimbot → Precision Input Response
ESP → Performance Metrics / Enhanced Perception
Cheat → Optimization tool
Hack → Utility / Boost
Bypass → Compatibility / Security layer
Anti-cheat → System integrity / Game security system

OUTPUT FORMAT (CRITICAL):
You MUST output valid JSON ONLY with the exact following schema:
{
  "title": "Clean, captivating human title",
  "content": "Full formatted HTML article with <h2>, <h3>, <p>, <ul>, <li>, <strong>, <a> tags (1200+ words)",
  "markdown": "Complete raw Markdown version of the article (# Title, ## Headings, lists, bold text, links) (1200+ words)",
  "excerpt": "A compelling 2-sentence hook summary for preview cards",
  "categories": ["Category1", "Category2"],
  "tags": ["Tag1", "Tag2", "Tag3", "Tag4"],
  "seoTitle": "Under 60 chars SEO Title",
  "seoDescription": "Under 155 chars SEO Meta Description"
}
`;

export async function POST(request: Request) {
  try {
    const { topic } = await request.json();

    if (!topic || typeof topic !== "string") {
      return NextResponse.json(
        { error: "A valid topic or title is required" },
        { status: 400 }
      );
    }

    const deepseekKey = process.env.DEEPSEEK_API_KEY;
    const nvidiaKey = process.env.NVIDIA_API_KEY;
    const prompt = MASTER_BLOG_PROMPT.replace("{TOPIC}", topic.trim());

    // Curated high quality featured images based on topic keywords
    const curatedImages = [
      "https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1534349762230-e0cadf78f5da?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
    ];
    const defaultImage = curatedImages[Math.floor(Math.random() * curatedImages.length)];

    // 1. Try DeepSeek
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
            messages: [
              {
                role: "system",
                content: "You are a professional human tech and home improvement blogger. You output pure JSON only.",
              },
              { role: "user", content: prompt },
            ],
            response_format: { type: "json_object" },
            temperature: 0.7,
            max_tokens: 4000,
          }),
        });

        if (dsRes.ok) {
          const raw = await dsRes.json();
          const jsonText = raw.choices?.[0]?.message?.content;
          if (jsonText) {
            const parsed = JSON.parse(jsonText);
            return NextResponse.json({
              ...parsed,
              featured_image: defaultImage,
              provider: "deepseek",
            });
          }
        }
      } catch (err) {
        console.warn("DeepSeek blog generation failed, trying Nvidia:", err);
      }
    }

    // 2. Try Nvidia NIM
    if (nvidiaKey) {
      try {
        const nvRes = await fetch("https://integrate.api.nvidia.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${nvidiaKey}`,
          },
          body: JSON.stringify({
            model: "meta/llama-3.3-70b-instruct",
            messages: [
              {
                role: "system",
                content: "You are a professional human tech and home improvement blogger. Output pure JSON only.",
              },
              { role: "user", content: prompt },
            ],
            temperature: 0.7,
            max_tokens: 4000,
          }),
        });

        if (nvRes.ok) {
          const raw = await nvRes.json();
          const contentStr = raw.choices?.[0]?.message?.content || "";
          // Extract JSON block
          const jsonMatch = contentStr.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            const parsed = JSON.parse(jsonMatch[0]);
            return NextResponse.json({
              ...parsed,
              featured_image: defaultImage,
              provider: "nvidia",
            });
          }
        }
      } catch (err) {
        console.warn("Nvidia blog generation failed:", err);
      }
    }

    return NextResponse.json(
      { error: "Could not generate blog. Please verify API keys in .env.local" },
      { status: 500 }
    );
  } catch (err: any) {
    console.error("AI Blog Generation Route Error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to generate blog article" },
      { status: 500 }
    );
  }
}
