// app/api/debate/route.ts

import Anthropic from "@anthropic-ai/sdk";
import OpenAI from "openai";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { AGENTS, Agent } from "@/lib/agents";
import { buildUserPrompt, PreviousMessage } from "@/lib/prompts";

// ---------- Provider detection ----------
// Each agent's model string determines which SDK to use.
// Anthropic: starts with "claude-"
// OpenAI:    starts with "gpt-"
// Google:    starts with "gemini-"
type Provider = "anthropic" | "openai" | "google";

function detectProvider(model: string): Provider {
  if (model.startsWith("claude-")) return "anthropic";
  if (model.startsWith("gpt-"))    return "openai";
  if (model.startsWith("gemini-")) return "google";
  throw new Error(`Unknown model provider for: ${model}`);
}

// ---------- Unified streaming call ----------
// Calls the correct SDK based on provider and yields tokens one by one.
// All three SDKs support streaming — we normalize them here so
// the main loop never needs to know which provider it's talking to.
async function* streamAgentTokens(
  agent: Agent,
  userPrompt: string,
  anthropic: Anthropic,
  openaiKey?: string,
  geminiKey?: string,
): AsyncGenerator<string> {
  const provider = detectProvider(agent.model);

  if (provider === "anthropic") {
    const stream = await anthropic.messages.stream({
      model: agent.model,
      max_tokens: 600,
      system: agent.systemPrompt,
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
    if (!openaiKey) throw new Error("OpenAI API key not provided. Add it in Settings.");
    const openai = new OpenAI({ apiKey: openaiKey });
    const stream = await openai.chat.completions.create({
      model: agent.model,
      max_tokens: 600,
      stream: true,
      messages: [
        { role: "system", content: agent.systemPrompt },
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
    if (!geminiKey) throw new Error("Gemini API key not provided. Add it in Settings.");
    const google = new GoogleGenerativeAI(geminiKey);
    const geminiModel = google.getGenerativeModel({
      model: agent.model,
      systemInstruction: agent.systemPrompt,
    });

    const result = await geminiModel.generateContentStream(userPrompt);

    for await (const chunk of result.stream) {
      const token = chunk.text();
      if (token) yield token;
    }
    return;
  }
}

// ---------- Language instruction ----------
function langInstruction(lang: string): string {
  return lang === 'he'
    ? '\nIMPORTANT: You must respond entirely in Hebrew (עברית). Every word of your response must be in Hebrew — no English allowed.'
    : '';
}

// ---------- POST handler ----------
export async function POST(request: Request) {
  const { topic, depth, lang = 'en', apiKey, openaiKey, geminiKey } = await request.json();
  if (!apiKey) return new Response("No API key provided. Add your Anthropic key in Settings.", { status: 401 });
  const anthropic = new Anthropic({ apiKey });

  if (!topic?.trim()) {
    return new Response("Missing topic", { status: 400 });
  }

  const agentCount = depth === "mini" ? 3 : depth === "quick" ? 4 : 8;
  const HAIKU = "claude-haiku-4-5-20251001" as const;
  const agents = AGENTS.slice(0, agentCount).map(a =>
    depth === "mini" ? { ...a, model: HAIKU } : a
  );
  const encoder = new TextEncoder();
  const previousMessages: PreviousMessage[] = [];

  const stream = new ReadableStream({
    async start(controller) {

      // Helper: encode and send a named SSE event
      function send(event: string, data: object) {
        const line = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
        controller.enqueue(encoder.encode(line));
      }

      try {
        // ---------- Topic validation ----------
        // Maya quickly checks if the topic is a meaningful software idea before
        // spinning up the full team. Uses Haiku for speed.
        const validationMsg = await anthropic.messages.create({
          model: "claude-haiku-4-5-20251001",
          max_tokens: 120,
          system: `You are Maya Levi, an engineering team orchestrator.
Decide if the topic is a meaningful software product or system worth analyzing by an engineering team.
If YES: respond with exactly the word VALID and nothing else.
If NO (gibberish, too short/vague, offensive, or clearly not a software idea): respond with a short 1-2 sentence message in first person explaining what kind of input you need. Be direct and friendly. Do not start with "I'm sorry".${langInstruction(lang)}`,
          messages: [{ role: "user", content: `Topic: "${topic}"` }],
        });

        const validationText =
          validationMsg.content[0].type === "text"
            ? validationMsg.content[0].text.trim()
            : "VALID";

        if (!validationText.startsWith("VALID")) {
          send("invalid_topic", { message: validationText });
          return;
        }

        // ---------- Main agent loop ----------
        for (const agent of agents) {
          // Tell the frontend this agent is starting
          send("agent_start", {
            id:       agent.id,
            name:     agent.name,
            role:     agent.role,
            model:    agent.model,
            initials: agent.initials,
            avatarBg: agent.avatarBg,
            provider: detectProvider(agent.model), // useful for frontend badges
          });

          const userPrompt = buildUserPrompt(topic, previousMessages);
          let fullText = "";

          // Inject language instruction into this agent's system prompt
          const agentWithLang = {
            ...agent,
            systemPrompt: agent.systemPrompt + langInstruction(lang),
          };

          // Stream tokens from whichever provider this agent uses
          for await (const token of streamAgentTokens(agentWithLang, userPrompt, anthropic, openaiKey, geminiKey)) {
            fullText += token;
            send("token", { id: agent.id, initials: agent.initials, token });
          }

          // Save the full response so the next agent has context
          previousMessages.push({
            name: agent.name,
            role: agent.role,
            text: fullText,
          });

          send("agent_done", { id: agent.id });
        }

        // ---------- Final synthesis (always Maya / Opus) ----------
        // Maya synthesizes everything into a Decision Record.
        // She always runs on Anthropic regardless of other agents' providers.
        send("synthesis_start", {});

        const synthesisUserPrompt = `The team just finished discussing "${topic}".
Write a 2-3 sentence Decision Record: the chosen stack, the key tradeoff,
and the recommended first action. Be specific, no vague advice.`;

        // Build the conversation history for Maya's context
        const synthesisMessages: Anthropic.MessageParam[] = [
          ...previousMessages.map((m) => ({
            role: "user" as const,
            content: `${m.name} (${m.role}): ${m.text}`,
          })),
          { role: "user", content: synthesisUserPrompt },
        ];

        const synthStream = await anthropic.messages.stream({
          model:     depth === "mini" ? "claude-haiku-4-5-20251001" : "claude-opus-4-6",
          max_tokens: 400,
          system:    AGENTS[0].systemPrompt + langInstruction(lang),
          messages:  synthesisMessages,
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
        // Send the error to the frontend so it can display a message
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