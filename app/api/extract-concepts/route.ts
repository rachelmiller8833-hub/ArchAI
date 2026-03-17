// app/api/extract-concepts/route.ts

import Anthropic from "@anthropic-ai/sdk";
import { ConceptData } from "@/types";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

interface DebateMessage {
  name: string;
  role: string;
  text: string;
}

export async function POST(request: Request) {
  const { topic, messages, lang = 'en', count = 3 } = await request.json();

  if (!topic || !messages?.length) {
    return new Response("Missing topic or messages", { status: 400 });
  }

  const conceptCount: number = count === 2 ? 2 : 3;

  const langNote = lang === 'he'
    ? '\nIMPORTANT: Write all title, description, ux, and visual fields entirely in Hebrew (עברית).'
    : '';

  const transcript = (messages as DebateMessage[])
    .filter(m => m.text.trim())
    .map(m => `${m.name} (${m.role}): ${m.text}`)
    .join("\n\n");

  try {
    const response = await anthropic.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 800,
      messages: [
        {
          role: "user",
          content: `You are a product strategist. Based on this debate about "${topic}", extract exactly ${conceptCount} distinct product directions that could be built.

Each direction must be genuinely different in purpose, UX, and audience — not just visual variations of the same idea.${langNote}

Debate transcript:
${transcript}

Return ONLY valid JSON in this exact shape (no markdown, no explanation):
{
  "A": {
    "id": "A",
    "title": "Short product name",
    "description": "2-3 sentences describing what this product is and who it's for.",
    "ux": "Key UX idea — how the user interacts with it.",
    "visual": "Key visual/layout idea — what it looks like."
  },
  "B": { "id": "B", ... }${conceptCount === 3 ? ',\n  "C": { "id": "C", ... }' : ''}
}`,
        },
      ],
    });

    const raw = response.content[0].type === "text" ? response.content[0].text : "";
    // Extract the JSON object directly — handles any surrounding text or markdown fences
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("No JSON found in response");
    const concepts: Record<string, ConceptData> = JSON.parse(jsonMatch[0]);

    // Validate shape
    const requiredIds = conceptCount === 2 ? (["A", "B"] as const) : (["A", "B", "C"] as const);
    for (const id of requiredIds) {
      if (!concepts[id]?.title) throw new Error(`Missing concept ${id}`);
    }

    return Response.json(concepts);

  } catch (err) {
    return new Response(`Concept extraction failed: ${String(err)}`, { status: 500 });
  }
}
