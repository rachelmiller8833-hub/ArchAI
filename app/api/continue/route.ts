// app/api/continue/route.ts

import Anthropic from "@anthropic-ai/sdk";
import OpenAI from "openai";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { AGENTS } from "@/lib/agents";

// ---------- Provider clients ----------
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const google = new GoogleGenerativeAI(
  process.env.GEMINI_API_KEY ?? ""
);

// ---------- Provider detection ----------
type Provider = "anthropic" | "openai" | "google";

function detectProvider(model: string): Provider {
  if (model.startsWith("claude-")) return "anthropic";
  if (model.startsWith("gpt-"))    return "openai";
  if (model.startsWith("gemini-")) return "google";
  throw new Error(`Unknown provider for model: ${model}`);
}

// ---------- Previous message shape ----------
interface PreviousMessage {
  name: string;
  role: string;
  text: string;
}

// ---------- Unified streaming call ----------
// Same pattern as debate/route.ts — normalizes all three SDKs
// into a single async generator that yields tokens one by one.
async function* streamTokens(
  model: string,
  systemPrompt: string,
  userPrompt: string
): AsyncGenerator<string> {
  const provider = detectProvider(model);

  if (provider === "anthropic") {
    const stream = await anthropic.messages.stream({
      model,
      max_tokens: 400,
      system: systemPrompt,
      messages: [{ role: "user", content: userPrompt }],
    });
    for await (const chunk of stream) {
      if (
        chunk.type === "content_block_delta" &&
        chunk.delta.type === "text_delta"
      ) {
        yield chunk.delta.text;
      }
    }
    return;
  }

  if (provider === "openai") {
    const stream = await openai.chat.completions.create({
      model,
      max_tokens: 400,
      stream: true,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user",   content: userPrompt },
      ],
    });
    for await (const chunk of stream) {
      const token = chunk.choices[0]?.delta?.content;
      if (token) yield token;
    }
    return;
  }

  if (provider === "google") {
    const geminiModel = google.getGenerativeModel({
      model,
      systemInstruction: systemPrompt,
    });
    const result = await geminiModel.generateContentStream(userPrompt);
    for await (const chunk of result.stream) {
      const token = chunk.text();
      if (token) yield token;
    }
    return;
  }
}

// ---------- Build the follow-up prompt ----------
// Only 3 agents respond to follow-up questions:
// Maya (orchestrator), David (architect), Alex (AI engineer).
// This keeps costs low and responses focused.
function buildFollowUpPrompt(
  question: string,
  topic: string,
  protoName: string,
  previousMessages: PreviousMessage[]
): string {
  const transcript = previousMessages
    .map(m => `${m.name} (${m.role}): ${m.text}`)
    .join("\n\n");

  return `The team previously analyzed "${topic}" and the user selected prototype: "${protoName}".

Here is the relevant conversation so far:
${transcript}

The user now asks: "${question}"

Answer based on your role, the selected prototype, and the previous discussion.
Be specific and practical. 3-5 sentences max. No bullet points.`;
}

// ---------- Language instruction ----------
function langInstruction(lang: string): string {
  return lang === 'he'
    ? '\nIMPORTANT: You must respond entirely in Hebrew (עברית). Every word of your response must be in Hebrew — no English allowed.'
    : '';
}

// ---------- POST handler ----------
export async function POST(request: Request) {
  const { topic, question, protoName, previousMessages, lang = 'en', depth = 'full' } = await request.json();

  if (!question?.trim()) {
    return new Response("Missing question", { status: 400 });
  }

  const encoder = new TextEncoder();

  // Only these 3 agents respond to follow-up questions
  const HAIKU = "claude-haiku-4-5-20251001";
  const CONTINUE_AGENT_IDS = ["maya", "david", "alex"];
  const agents = AGENTS
    .filter(a => CONTINUE_AGENT_IDS.includes(a.id))
    .map(a => depth === "mini" ? { ...a, model: HAIKU } : a);

  const stream = new ReadableStream({
    async start(controller) {

      function send(event: string, data: object) {
        const line = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
        controller.enqueue(encoder.encode(line));
      }

      try {
        const userPrompt = buildFollowUpPrompt(
          question,
          topic,
          protoName,
          previousMessages ?? []
        );

        // ---------- Stream each of the 3 agents ----------
        for (const agent of agents) {
          send("agent_start", {
            id:       agent.id,
            name:     agent.name,
            role:     agent.role,
            model:    agent.model,
            initials: agent.initials,
            avatarBg: agent.avatarBg,
          });

          let fullText = "";

          for await (const token of streamTokens(
            agent.model,
            agent.systemPrompt + langInstruction(lang),
            userPrompt
          )) {
            fullText += token;
            send("token", { id: agent.id, initials: agent.initials, token });
          }

          send("agent_done", { id: agent.id });
        }

        // ---------- Maya synthesizes the round ----------
        send("synthesis_start", {});

        const synthesisPrompt = `The user asked: "${question}"
The team just responded. Write a 2-sentence summary of the consensus
and the single most important next action for the user.
Be direct and specific to the "${protoName}" prototype.`;

        const synthStream = await anthropic.messages.stream({
          model:      depth === "mini" ? "claude-haiku-4-5-20251001" : "claude-opus-4-6",
          max_tokens: 150,
          system:     AGENTS[0].systemPrompt + langInstruction(lang),
          messages:   [{ role: "user", content: synthesisPrompt }],
        });

        for await (const chunk of synthStream) {
          if (
            chunk.type === "content_block_delta" &&
            chunk.delta.type === "text_delta"
          ) {
            send("synthesis_token", { token: chunk.delta.text });
          }
        }

        send("done", {});

      } catch (err) {
        send("error", { message: String(err) });
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type":  "text/event-stream",
      "Cache-Control": "no-cache",
      "Connection":    "keep-alive",
    },
  });
}