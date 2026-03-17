// app/api/generate-prototypes/route.ts

import Anthropic from "@anthropic-ai/sdk";
import { ConceptData } from "@/types";

export const maxDuration = 60;

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

async function generateHTML(concept: ConceptData, topic: string, langNote = ''): Promise<string> {
  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 6000,
    messages: [
      {
        role: "user",
        content: `Build a complete, beautiful, self-contained HTML prototype for this product:

Product name: ${concept.title}
What it is: ${concept.description}
UX direction: ${concept.ux}
Visual/layout: ${concept.visual}
Topic area: ${topic}

CRITICAL RULES — read carefully:
1. Use INLINE styles (style="...") on every element. NO <style> tag anywhere.
2. This forces you to write all body content first without a large CSS block eating tokens.
3. Use real, realistic content for "${topic}" — not placeholder text, not AI agent names.
4. Include: navigation bar, hero section, at least 2 feature sections, footer.
5. Make it look like a real launched product (polished, not a wireframe).
6. Use Google Fonts via a single <link> tag in <head> if needed.
7. No other external dependencies.
8. Return ONLY the HTML. Start with <!DOCTYPE html>. No markdown, no explanation.${langNote}`,
      },
    ],
  });

  const text = response.content[0].type === "text" ? response.content[0].text : "";
  return text
    .replace(/^```html\n?/m, "")
    .replace(/^```\n?/m, "")
    .replace(/\n?```$/m, "")
    .trim();
}

export async function POST(request: Request) {
  const { topic, concepts, lang = 'en' } = await request.json() as {
    topic: string;
    concepts: Record<string, ConceptData>;
    lang?: string;
  };

  if (!topic || !concepts?.A || !concepts?.B) {
    return new Response("Missing topic or concepts", { status: 400 });
  }

  const langNote = lang === 'he'
    ? '\n10. Write ALL visible text content in the HTML (nav links, headings, paragraphs, button labels, etc.) in Hebrew (עברית). Add dir="rtl" to the <body> tag.'
    : '';

  try {
    const ids = (['A', 'B', 'C'] as const).filter(id => concepts[id]);
    const htmlResults = await Promise.all(ids.map(id => generateHTML(concepts[id], topic, langNote)));
    const result = Object.fromEntries(ids.map((id, i) => [id, htmlResults[i]]));

    return Response.json(result);

  } catch (err) {
    return new Response(`Generation failed: ${String(err)}`, { status: 500 });
  }
}
