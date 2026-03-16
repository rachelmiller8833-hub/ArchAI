# AI Model Debate: How to Build an AI-Powered Architecture Brainstorming Platform

**Topic:** A website where developers type a software idea, click "Start Discussion," and multiple AI agents simulate a technical debate — producing architecture suggestions and frontend prototypes. Supports two user types: Developer (own API keys) and Client (temp access code using developer's keys).

**Participants:**
- **Opus** — Orchestrator + System Architect (senior, thorough, decisive)
- **Sonnet** — Frontend Architect + AI Engineer (pragmatic, UX-focused, streaming-obsessed)
- **Haiku** — Cost Optimization Engineer + Startup Advisor (blunt, scrappy, cost-obsessed)

---

## STEP 1 — PRODUCT UNDERSTANDING

---

**Opus:** This product solves a real and painful gap: the early-stage architectural brainstorming phase of software development is expensive, slow, and gatekept by experience. Junior developers stare at blank pages; solo founders pay consultants thousands of dollars for what amounts to a structured conversation about trade-offs. This tool democratizes that by simulating a multi-perspective technical discussion — the kind you'd get from a seasoned engineering team — on demand, for any idea, at the cost of a few API calls.

Success looks like this: a developer types "I want to build a Twitch-like platform for cooking streams" and within 60-90 seconds receives a structured, multi-perspective technical debate covering architecture, frontend options, cost trade-offs, and security considerations — complete with a rough prototype scaffold they can actually start coding from. The output is not a generic ChatGPT answer; it is a *simulated team discussion* with tension, trade-offs, and dissent between roles. The secondary success metric is the Client flow: a developer shares a temp code with a non-technical founder, who can explore ideas using the developer's API budget with guardrails. Retention means people come back for their *next* idea.

**Sonnet:** This product solves the "blank page" problem for developers and technical clients who have a software idea but lack the structured framework to translate it into actionable architecture decisions. Instead of a single AI response, it simulates a multi-perspective technical debate — surfacing tradeoffs that a solo developer might never think to ask about. Success looks like a user leaving with a concrete, defensible architecture plan and at least one prototype scaffold they can actually run, not just a wall of text they have to parse themselves.

The dual user model (Developer with own keys, Client with temp access codes) is smart — it turns the tool into a consultative product that developers can resell or share with non-technical stakeholders. Full success means the AI discussion feels genuinely adversarial and complementary, not like five agents saying the same thing with different hats on.

**Haiku:** This product solves "blank page paralysis" for developers — it's a decision-making accelerator, not a code generator. Success = developers getting unstuck faster and making better architectural choices. The real win is stickiness (do they come back?) and whether you can build a sustainable business around API key delegation without becoming a cost liability yourself.

---

## STEP 2 — ARCHITECTURE OPTIONS

---

**Opus:** Let me propose three options clearly.

**Option A — MVP Fast (Ship in 2-3 weeks)**

Philosophy: single deployable unit. No microservices. No queues. Get it live, get feedback, iterate.

- **Frontend:** Next.js 14 (App Router) on Vercel. Tailwind + shadcn/ui. SSE for streaming agent responses.
- **Backend:** Next.js API Routes. Everything in one repo, one deployment.
- **Database:** Vercel Postgres (Neon) or SQLite via Turso. Tables: `users`, `sessions`, `discussions` (full JSON blob), `client_codes` (with `developer_id`, `expires_at`, `max_requests`, `requests_used`).
- **Auth:** NextAuth.js v5. Developers use GitHub OAuth. Clients enter a 6-character alphanumeric code — no OAuth, the code *is* the auth.
- **AI Orchestration:** Sequential chain. A single API route calls agents in a for-loop, each with a role-injected system prompt plus accumulated context. Responses stream via SSE as each agent "speaks." No framework needed — raw API calls.
- **API Key Handling:** AES-256-GCM encrypted at rest, decrypted in-memory at request time. Clients never see keys.
- **Rate Limiting:** In-database counter, increment `requests_used` on each client request.
- **Cost:** ~$0/month infrastructure (Vercel free + Neon free).

**Option B — Scalable (10k+ concurrent users)**

Philosophy: proper separation of concerns. Async job processing. Real-time infrastructure. Migrate here after MVP proves demand.

- **Frontend:** Next.js + WebSocket (Socket.io or Partykit) for real-time streaming. XState or Zustand state machine for discussion lifecycle.
- **Backend:** Separate Fastify/Hono service on Railway/Render/Fly.io.
- **Database:** PostgreSQL (Supabase). Normalized: `users`, `api_key_vaults`, `client_codes`, `discussions`, `discussion_messages` (one row per agent turn with `role`, `content`, `token_count`, `latency_ms`, `model_used`).
- **Job Queue:** BullMQ + Redis (Upstash). Prompt submitted → job enqueued → worker runs agent chain → publishes to Redis Pub/Sub → WebSocket pushes to client.
- **AI Orchestration:** Parallel DAG. Orchestrator runs first, then System Architect + Frontend Architect in parallel, then Cost + Security critics, then PM + Startup Advisor. `Promise.all` for parallel steps. 25-40s total vs 60-90s sequential.
- **Auth:** Auth.js for developers. Short-lived JWTs for clients (issued after access code validation).
- **Cost:** ~$20-50/month.

**Option C — Low Cost ($0 infra)**

Philosophy: every dollar matters. Optimize for 80% value from 20% of agents.

- **Frontend:** Static SPA (Vite + React or Astro). Hosted on Cloudflare Pages (free: unlimited requests + bandwidth).
- **Backend:** Cloudflare Workers (free tier: 100k requests/day).
- **Database:** Cloudflare D1 (SQLite at edge, free tier).
- **Auth:** Custom JWT with `jose`. Email + password (Argon2 via WASM). No Auth.js overhead.
- **AI Orchestration — real savings here:**
  1. Model tiering: Orchestrator + System Architect on frontier models (Sonnet, GPT-4o). Security + Cost agents on mid-tier (Haiku, GPT-4o-mini). PM + Startup Advisor on cheapest available. Cuts API costs 40-60%.
  2. Prompt compression: after every 3 agent turns, a cheap model summarizes context. Keeps token usage linear not quadratic.
  3. Semantic cache: embed prompts, check Cloudflare Vectorize for similarity >0.92, return cached discussion. 15-25% cache hit rate on common ideas.
  4. Reduced agent count for Clients: 4 agents instead of 8. "Quick Discussion" vs "Full Discussion" framing.
- **Cost:** $0/month infrastructure.

**Summary table:**

| Dimension | Option A (MVP Fast) | Option B (Scalable) | Option C (Low Cost) |
|---|---|---|---|
| Time to ship | 2-3 weeks | 6-8 weeks | 3-4 weeks |
| Monthly infra cost | $0 | $20-50 | $0 |
| Discussion latency | 60-90s | 25-40s | 45-70s |
| Max concurrent users | ~50 | 10,000+ | ~200 |
| Agent orchestration | Sequential loop | Parallel DAG | Sequential + tiered models |
| Auth complexity | Low (NextAuth) | Medium (JWT + OAuth) | Medium (custom JWT) |

My recommendation: start with Option A. Validate demand. Migrate to B when you have 20+ consistent daily developers. Borrow C's model tiering and caching immediately — those are pure optimizations that work in any architecture.

---

**Sonnet:** Let me push back and add what's missing.

**On Option A — the streaming UX that nobody addresses:**

Use Next.js App Router + Vercel AI SDK. But the critical UX move most MVPs miss: stream each agent *independently and in parallel*, not sequentially. Users should see the Orchestrator start typing while the System Architect is already mid-response. Sequential streaming kills the "live debate" illusion completely.

Even simple UX fixes help: a randomized 150-400ms jitter between agent stream starts dramatically improves perceived authenticity. What's consistently overlooked is turn ordering logic — if the Security Engineer always responds before the Cost Engineer, the debate feels scripted.

The temp access code flow for Client users gets bolted on as an afterthought in fast MVPs and becomes a security liability. Rate limiting and key scoping need to be first-class, not a middleware patch.

**On Option B — SSE, not WebSockets:**

The frontend subscribes to a single SSE stream and demultiplexes into per-agent UI lanes. This is where most scalable implementations over-engineer: they reach for WebSockets when SSE is sufficient and far simpler to cache, resume, and proxy through a CDN edge. Here you want a proper agent graph — LangGraph or a lightweight homegrown DAG — where the Orchestrator genuinely reads prior agent outputs before routing.

The massive miss in Option B: **state persistence**. Users will expect to return to a prior discussion, share a permalink, or export the debate as a structured document. Designing the data model for a "discussion session" — with ordered turns, agent roles, and a final synthesis artifact — needs to happen at the schema level now, not be retrofitted.

**On Option C — two-phase UX and prompt caching:**

Phase 1: stream a short "agent stance" (2-3 sentences) for each role — fast, cheap, immediately visible. Phase 2: lazy-expand individual agents on click to stream the full reasoning. Cuts perceived cost roughly in half.

Use Anthropic's `cache_control` headers on shared system context across all agents in a session — 60-80% cache hit rate opportunity that almost nobody implements. Also overlooked: if the product promises "frontend prototype options," that output needs to be *rendered*, not just described. Even a minimal live CodeSandbox or StackBlitz embed changes the value proposition from "report" to "artifact."

---

**Haiku:** I'll react from a cost + startup lens. Do we really need all of this?

**Option A risk:** a sequential for-loop means users wait 2-5 minutes for a full response. That's unacceptable before you even know if the problem is real. Better: ship a "stance only" MVP in week 1, validate the problem is real, *then* go full multi-agent. Option A delays validation by 2 weeks.

**Option B risk:** architecture porn. You're burning 4-6 weeks building distributed infrastructure for a product that doesn't exist yet. I'd never build Option B first — you need to *know the market*. The $20-50/month upside doesn't justify 6 weeks of dev.

**Hidden costs neither Opus nor Sonnet quantified:** at 1000 DAU running 10 discussions/day, frontier models for all agents could be $45k-120k/month in raw API costs. Model tiering isn't optimization — it's survival. And the API key delegation model is a trap: if users bring their own keys, you have near-zero marginal cost but also near-zero monetization leverage. The business model question is "who pays for the tokens" and you'd better answer it before you have users.

---

## STEP 3 — CROSS CRITIQUE

---

**Opus** *(honest self-critique + reacting to Sonnet and Haiku):*

What is wrong with Option A? Two real problems I glossed over.

First, the temp access code flow is worse than Sonnet flagged. A shareable 6-character code is a leaked screenshot away from unauthorized access to someone's API keys. That's not acceptable. The MVP needs real auth — at minimum a hashed password or magic link. That's ~4 hours of work, not optional.

Second, Option A has no state persistence and that's a bigger problem than I admitted. If the value prop is "decision accelerator," users need to reference past decisions. A fire-and-forget architecture has zero retention mechanics. Sonnet is right — the session data model needs to exist from day one.

What is risky in Option B? Execution time disguised as architecture quality. Building a proper DAG with dependency resolution, error handling, partial failure recovery, and state checkpointing is a 3-6 week project on its own. I proposed it as though it's a configuration choice. It isn't. It's a system.

On Sonnet's parallel streaming: I agree with parallel streaming but disagree with the jitter. Parallel streaming is architecturally simpler in some ways — fire N API calls, pipe each stream to the client tagged with agent ID. But the jitter is UX polish masquerading as architecture. Do it in CSS with `animation-delay`, not by actually delaying API calls and burning latency. Artificial delays in a product selling speed is contradictory.

The deeper tension Sonnet didn't resolve: parallel streaming means the Orchestrator can't read prior agent outputs before synthesizing. You can't have both without a two-phase architecture — agents stream in parallel first, Orchestrator runs after all complete. That's the real design decision.

On CodeSandbox embeds: scope creep. Full stop. Generating runnable code turns us from a decision-making tool into a code generation tool. We'd lose to Cursor, Bolt, v0, and every tool already optimized for that.

On Haiku's hidden cost challenge: at 1000 DAU with frontier models for all 5-8 agent calls per run, we're looking at $45k-120k/month. Sonnet's tiered model suggestion isn't optimization — it's survival. This should be in the MVP, not deferred. I also budgeted zero time for error handling. In practice, retry logic, graceful degradation, and clear error states are 20-30% of frontend engineering effort for any streaming LLM product.

My revised position: Option A is right, but with three things non-negotiable from day one — real auth, session persistence, and tiered models.

---

**Sonnet** *(reacting to Opus and Haiku):*

**On Option A's sequential for-loop:** this is not just a performance issue — it's a UX catastrophe for this specific product. With 4-8 agent roles and 8-15 seconds per LLM call, users wait 32-120 seconds staring at a spinner before seeing anything. That fails in investor demos and kills trial conversion on first use.

The deeper issue: sequential execution encodes a false assumption — that each agent *needs* the previous agent's full output before it can begin. PM analysis and risk perspectives are frequently parallelizable; they're reading the same brief, not chaining outputs. Opus serialized them because a for-loop is easier to write, not because the domain requires it.

What's actually acceptable for MVP: streaming with visible agent progression. Even if agents run sequentially under the hood, the user must see tokens arriving from Agent 1 while Agent 2 is queued. A for-loop with SSE streaming per-agent is acceptable. A for-loop with blocking await-then-render is not shippable.

**On Option B's WebSockets:** Opus reached for WebSockets out of habit. It's the wrong tool. LLM streaming is a unidirectional, server-to-client data flow. The client sends one request, then receives a long stream of tokens. There is no meaningful client-to-server real-time channel needed during inference. WebSockets solve a bidirectional, low-latency problem. This is not that problem.

Specifically: WebSockets break on serverless and edge runtimes. Socket.io adds 30KB+ to the client bundle. Horizontal scaling requires sticky sessions or a Redis pub/sub adapter — and that Redis dependency exists largely to compensate for choosing WebSockets. SSE is stateless HTTP, requires no sticky sessions, and auto-reconnects natively.

**On "Start with A then migrate to B":** strategically sound, architecturally lazy. The migration from sequential to parallel execution is not a refactor — it's a rewrite of the orchestration layer. A for-loop in a Next.js API route does not migrate gracefully. You throw it away.

The honest recommendation: start with A's infrastructure but B's orchestration contract. Define the agent runner as an async generator pipeline, not a for-loop. Each agent is a function that yields streaming chunks. This makes the transition to parallel trivial — switch from `await agent()` to `Promise.all([agent(), agent()])`. Add the schema columns for model tiering and prompt caching from day one even if they're null. This costs 4 hours more and eliminates the rewrite.

**On Haiku's stickiness concern:** Haiku is right that API key delegation is the business, but wrong if they think stickiness follows automatically from utility. The failure mode: users try it once, get useful output, copy-paste it somewhere, and never return. The product becomes a one-shot generator.

What actually drives return visits: persistent project memory ("Project: Redesign checkout flow — last run 3 days ago"), the shareable artifact (a linkable URL to a completed analysis introduces a second user at zero cost), and diff-on-rerun (users who iterate on a brief need to see what changed between runs). None of these require different infrastructure. They require product decisions made now that shape the data model.

**What Opus missed entirely about the frontend prototype requirement:** Opus's architecture treats agent output as a stream of markdown text. That's insufficient. Every agent must return a typed JSON object with sections, not free-form prose. The orchestrator needs to know the shape of each agent's output to compose a coherent prototype spec. A markdown blob in a chat bubble is not a prototype. The export/handoff story is also completely missing from all three options.

---

**Haiku** *(reacting to Opus and Sonnet):*

**Option A's #1 mistake from a startup lens:** Opus buried the real problem. Sequential agent loop = users wait 2-5 minutes. But more importantly, you're spending 2-3 weeks building multi-agent infrastructure before you've validated that the core idea resonates. Ship a "stance only" MVP in week 1. Auth flow, SSE streaming, persistence — all proven before you add the complexity. Option A delays validation by 2 weeks unnecessarily.

**Would I ever build Option B first?** Never. You're burning 4-6 weeks on distributed infrastructure for a product with zero proven demand. The $20-50/month infra savings don't justify the dev cost. Ship Option A, prove retention, then decide if you need BullMQ.

**Is Sonnet's parallel streaming with jitter a real UX win?** Premature. Jitter just adds latency. Parallel agents streaming are nice-to-have theater — users care if the debate is *interesting*, not if it feels "live." Build serializable debate state first so you can replay and share discussions. Polish later.

**Is the CodeSandbox embed worth the scope?** Dead weight. You're building a debate platform, not an IDE. If users want to run code, that's V2. Focus on making arguments sharp, searchable, and shareable. Scope creep kills startups faster than bad tech.

**The one thing BOTH missed that will actually kill this startup:** user acquisition and retention loops. Nobody cares about your debate platform unless there's a reason for their friends to show up. No viral loop, no invite mechanic, no social graph = ghost town. The shareable URL is a start, but it's passive. You need network effects *designed in from day 1*, not bolted on later. Neither proposal mentions how users find each other or debates worth reading.

---

## STEP 4 — FINAL DECISION

---

**Opus** *(as Orchestrator):*

**Recommended architecture: Option A (with modifications)**

Because:
- Option A's core strength — a single deployable Next.js unit — is the fastest path to a working product. The fatal flaw (blocking for-loop) is fixable without adopting Option B's infrastructure. Replace the synchronous loop with an **async generator pipeline** that yields each agent's result as it completes, streamed via SSE. This gives us Option B's perceived performance without its operational complexity.
- Real auth (magic link via Resend) replaces the temp access code scheme, which was a security liability. This adds ~1 day of implementation, not a week.
- Model tiering is a survival constraint. At 1000 DAU with frontier models for all 5-8 agent calls, costs hit $45k-120k/month. Routing secondary agents through Haiku/GPT-4o-mini cuts this 60-70% while preserving quality where it matters.
- Session persistence (a JSON blob column on the debates table) gives us rerun-with-diff and project memory at near-zero cost. This was the single biggest UX gap in Option A — users need to iterate on outputs, not start from scratch.

**What we are NOT building (and why):**
- WebSocket infrastructure / Socket.io — data flow is unidirectional (server to client). SSE works natively on serverless, requires no connection state management, auto-reconnects. WebSockets solve a problem we don't have.
- CodeSandbox embeds or live code previews — scope creep that serves zero users in an argumentation tool. We'd be evaluated on code quality and lose to Cursor, Bolt, and v0.
- Parallel agent execution with staggered jitter — the visual stagger effect is 4 lines of CSS animation-delay, not an API concern. Agents run sequentially because each step genuinely depends on prior output (Stance → Research → Arguments → Counterarguments → Synthesis). There's no real parallelism to exploit in this dependency chain.
- Social graph / invite mechanics for v1 — Haiku is right that user acquisition matters, but building social features before proving the core product works is how projects die. The viral loop is the shareable output URL, which we get for free from session persistence.

**The 3 things Sonnet and Haiku forced us to add that weren't in the original options:**
- **Structured agent output schema with a rendering contract.** Every agent returns a typed JSON object (not raw markdown): `agentId`, `status`, `sections` (array of titled content blocks), `metadata` (model, tokens, latency). The frontend renders from this schema. This enables diff-on-rerun, future format changes, and structured exports without touching agent prompts.
- **Error handling budget: retry logic with graceful degradation.** LLM API calls fail 3-8% of the time. Each agent gets 2 retries with exponential backoff. If a non-critical agent fails after retries, the system renders the output without that section rather than failing the entire run. This is 20-30% of real frontend effort — budgeted zero in all original options.
- **"Stance-only" MVP as week 1 milestone.** Haiku's sharpest contribution: ship a single-agent version (topic in, structured stance out) by end of week 1. This validates auth, SSE streaming, output rendering, and persistence before adding the multi-agent pipeline. It de-risks the entire project.

---

## STEP 5 — ARCHITECTURE ARTIFACTS

---

### Architecture Explanation

The system is a server-rendered Next.js application deployed on Vercel, using Server-Sent Events to stream multi-agent debate analysis to the browser in real time. When a user submits a topic, the backend spawns an async generator pipeline that runs five agents in sequence — Stance Analyst, Research Agent, Argument Builder, Counterargument Agent, and Synthesis Agent — each receiving the accumulated context from prior agents. As each agent completes, its typed JSON output is yielded through the generator, serialized as an SSE event, and rendered into the growing output document on the client. The user sees each section appear within 3-8 seconds of the previous one, rather than waiting 30-120 seconds for the entire analysis.

Authentication uses passwordless magic links sent via Resend. A user enters their email, receives a login link, and gets a session cookie lasting 30 days. No password to forget, no OAuth complexity, roughly 80 lines of code on top of the sessions table we already need. The sessions table also stores a JSON blob of each completed analysis, enabling users to revisit past outputs and rerun analyses with modified parameters — getting a visual diff of what changed.

Model tiering is enforced at the agent router level. The Stance Analyst and Argument Builder — the two agents whose output quality users directly evaluate — use Claude Sonnet or GPT-4o. The Research Agent, Counterargument Agent, and Synthesis Agent use Claude Haiku or GPT-4o-mini. This routing is configured in a single model-map file and can be adjusted without code changes. At 1,000 DAU running an average of 3 analyses per day, this keeps API costs in the $15k-25k/month range rather than $45k-120k.

Every agent returns output conforming to a shared TypeScript interface: `agentId`, `status`, `sections` (array of titled content blocks with optional citations), and `metadata` (model used, token count, latency). The frontend renders from this contract, not from raw text. This means agent prompts and models can change independently of the rendering layer, and diff-on-rerun is a straightforward object comparison rather than a string diff.

---

### Architecture Diagram (Text Format)

```
┌─────────────────────────────────────────────────────────────────────┐
│                          CLIENT (Browser)                           │
│                                                                     │
│  ┌──────────┐    ┌──────────────┐    ┌───────────────────────────┐  │
│  │  Auth UI  │    │  Topic Form  │    │   Output Renderer         │  │
│  │ (magic    │    │  (submit     │    │   - Streams sections as   │  │
│  │  link     │    │   topic +    │    │     SSE events arrive     │  │
│  │  flow)    │    │   params)    │    │   - Renders from typed    │  │
│  └─────┬────┘    └──────┬───────┘    │     AgentOutput schema    │  │
│        │               │            │   - CSS stagger animation  │  │
│        │               │            │   - Error/retry UI states  │  │
│        │               │            └───────────┬───────────────┘  │
└────────┼───────────────┼────────────────────────┼──────────────────┘
         │               │                        ▲
         │ POST          │ POST /api/analyze       │ SSE (text/event-stream)
         │ /auth/login   │                         │
         ▼               ▼                         │
┌────────────────────────────────────────────────────────────────────┐
│                       NEXT.JS on VERCEL                            │
│                                                                    │
│  ┌───────────────┐   ┌─────────────────────────────────────────┐  │
│  │  Auth Route   │   │  /api/analyze (Edge Function)           │  │
│  │  - Send magic │   │  1. Validate session                    │  │
│  │    link via   │   │  2. Create debate record                │  │
│  │    Resend     │   │  3. Start async generator pipeline      │  │
│  │  - Set cookie │   │  4. Yield SSE events per agent          │  │
│  └───────────────┘   └──────────────────────────────────────┬──┘  │
│                                                             │      │
│               ┌─────────────────────────────────────────────▼───┐  │
│               │       AGENT PIPELINE (async generator)          │  │
│               │                                                 │  │
│               │  ┌─────────────────┐  Model: Sonnet / GPT-4o   │  │
│               │  │ 1. Stance       ├─── yield AgentOutput ────▶ │  │
│               │  │    Analyst      │                            │  │
│               │  └────────┬────────┘                           │  │
│               │           │ accumulated context                │  │
│               │  ┌─────────────────┐  Model: Haiku / Mini      │  │
│               │  │ 2. Research     ├─── yield AgentOutput ────▶ │  │
│               │  │    Agent        │                            │  │
│               │  └────────┬────────┘                           │  │
│               │           │ accumulated context                │  │
│               │  ┌─────────────────┐  Model: Sonnet / GPT-4o   │  │
│               │  │ 3. Argument     ├─── yield AgentOutput ────▶ │  │
│               │  │    Builder      │                            │  │
│               │  └────────┬────────┘                           │  │
│               │           │ accumulated context                │  │
│               │  ┌─────────────────┐  Model: Haiku / Mini      │  │
│               │  │ 4. Counter-     ├─── yield AgentOutput ────▶ │  │
│               │  │    argument     │                            │  │
│               │  └────────┬────────┘                           │  │
│               │           │ accumulated context                │  │
│               │  ┌─────────────────┐  Model: Haiku / Mini      │  │
│               │  │ 5. Synthesis    ├─── yield AgentOutput ────▶ │  │
│               │  │    Agent        │   (SSE Serializer)        │  │
│               │  └─────────────────┘                           │  │
│               └─────────────────────────────────────────────────┘  │
│                                                                    │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │                     POSTGRES (Neon)                          │  │
│  │                                                              │  │
│  │  users            sessions           debates                 │  │
│  │  ┌─────────────┐  ┌──────────────┐  ┌────────────────────┐  │  │
│  │  │ id          │  │ id           │  │ id                 │  │  │
│  │  │ email       │  │ user_id      │  │ user_id            │  │  │
│  │  │ created_at  │  │ token (hash) │  │ topic              │  │  │
│  │  └─────────────┘  │ expires_at   │  │ status             │  │  │
│  │                   └──────────────┘  │ agent_outputs(JSONB)│  │  │
│  │  client_codes                       │ model_map (JSONB)   │  │  │
│  │  ┌─────────────┐                   │ created_at          │  │  │
│  │  │ id          │                   └────────────────────┘  │  │
│  │  │ developer_id│                                           │  │
│  │  │ code (hash) │                                           │  │
│  │  │ max_requests│                                           │  │
│  │  │ requests_used│                                          │  │
│  │  │ expires_at  │                                           │  │
│  │  └─────────────┘                                           │  │
│  └──────────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────────┘

External Services:
  ┌──────────┐   ┌───────────────────┐   ┌──────────┐
  │  Resend  │   │  Anthropic API    │   │  OpenAI  │
  │ (email   │   │  (Claude Sonnet + │   │  API     │
  │  magic   │   │   Claude Haiku)   │   │  (GPT-4o │
  │  links)  │   └───────────────────┘   │  + Mini) │
  └──────────┘                           └──────────┘
```

---

### Short PRD

**Problem**
Early-stage architectural brainstorming is expensive, slow, and gatekept by experience. Junior developers stare at blank pages; solo founders pay consultants thousands of dollars for structured conversations about trade-offs. There is no tool that automatically generates a structured, multi-perspective technical debate for any software idea.

**Users**
- **Developer user:** Provides their own API keys (Anthropic, OpenAI). Runs full discussions. Can generate temporary access codes for clients.
- **Client user:** Receives a temp code from a developer. Describes ideas and generates analyses using the developer's API keys, subject to rate limits and usage caps set by the developer.

**Core Features (Launch)**
- Passwordless auth via magic link (Resend) for developers; access code auth for clients
- Single text input: describe your software idea
- Multi-agent analysis pipeline: Stance Analyst → Research → Arguments → Counterarguments → Synthesis
- Real-time SSE streaming — each section renders as its agent completes (no full-page spinner)
- Typed agent output schema (JSON, not raw markdown) driving the renderer
- Session persistence — revisit past analyses, rerun with modifications, visual diff between runs
- Shareable output URLs (public read-only link per analysis)
- Model tiering: Stance Analyst + Argument Builder on Sonnet/GPT-4o; secondary agents on Haiku/GPT-4o-mini
- Client code management: developer sets `max_requests`, `expires_at`; system enforces via DB counter
- Retry logic: 2 retries per agent with exponential backoff; graceful degradation for non-critical agent failures
- Week 1 milestone: single-agent "Stance only" version deployed and validated before multi-agent pipeline

**Out of Scope (v1)**
- Real-time collaboration or multi-user editing
- CodeSandbox / StackBlitz live code embeds
- Social features (follow, comment, invite)
- WebSocket infrastructure
- Custom agent creation or prompt editing by users
- PDF/document export
- Mobile native apps
- Semantic similarity cache (design for it in schema; implement in v2)

**Success Metrics**
- **Week 1:** Stance-only MVP deployed, auth working, <5s time-to-first-content
- **Week 3:** Full 5-agent pipeline live, <30s total analysis time, session persistence and shareable URLs working
- **Week 6:** 100 organic users, >40% return within 7 days, API cost per analysis <$0.12
- **Month 3:** 1,000 DAU, monthly API spend <$25k, median 3 analyses per active user per day

---

*Debate conducted by Claude Opus 4.6, Claude Sonnet 4.6, and Claude Haiku 4.5 — March 2026*
