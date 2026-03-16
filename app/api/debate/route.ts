// app/api/debate/route.ts

import Anthropic from "@anthropic-ai/sdk";
import OpenAI from "openai";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { AGENTS, Agent } from "@/lib/agents";
import { buildUserPrompt, PreviousMessage } from "@/lib/prompts";

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
  userPrompt: string
): AsyncGenerator<string> {
  const provider = detectProvider(agent.model);

  if (provider === "anthropic") {
    const stream = await anthropic.messages.stream({
      model: agent.model,
      max_tokens: 300,
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
    // OpenAI uses the chat completions streaming API.
    // system prompt goes in as a "system" role message.
    const stream = await openai.chat.completions.create({
      model: agent.model,
      max_tokens: 300,
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
    // Gemini uses generateContentStream.
    // System instruction is passed separately, not as a chat message.
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

// ---------- POST handler ----------
export async function POST(request: Request) {
  const { topic, depth } = await request.json();

  if (!topic?.trim()) {
    return new Response("Missing topic", { status: 400 });
  }

  const agentCount = depth === "quick" ? 4 : 8;
  const agents = AGENTS.slice(0, agentCount);
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

          // Stream tokens from whichever provider this agent uses
          for await (const token of streamAgentTokens(agent, userPrompt)) {
            fullText += token;
            send("token", { id: agent.id, token });
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
          model:     "claude-opus-4-6",
          max_tokens: 200,
          system:    AGENTS[0].systemPrompt, // Maya's system prompt
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