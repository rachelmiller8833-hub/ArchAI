# ArchAI — AI Architecture Brainstorming

ArchAI is a multi-agent AI tool that analyzes your software idea through the eyes of up to 8 specialized engineers. Each agent streams their response in real time, giving you an architecture decision record, a PRD, and 2–3 prototype designs — in under 2 minutes.

---

## How It Works

1. **Configure** — Describe your software idea and choose discussion depth (Mini / Quick / Full)
2. **Discussion** — AI engineers debate the architecture in real time via streaming
3. **Choose Design** — Review, edit, and pick from 2–3 generated prototype designs
4. **Refine** — Ask follow-up questions, then generate a refined HTML from the discussion

---

## The Team

| Agent | Role | Model |
|---|---|---|
| Maya Levi | Orchestrator | Claude Opus 4.6 |
| David Park | System Architect | Claude Sonnet 4.6 |
| Priya Sharma | Frontend Architect | Claude Haiku 4.5 |
| Alex Chen | AI Engineer | Claude Haiku 4.5 |
| Jordan Kim | Cost Engineer | Claude Haiku 4.5 |
| Sarah Mueller | Security Engineer | Claude Haiku 4.5 |
| Marcus Johnson | Product Manager | Claude Haiku 4.5 |
| Elena Vasquez | Startup Advisor | Claude Haiku 4.5 |

> In **Mini** mode all agents run on Haiku to minimize cost.

---

## Discussion Depths

| Mode | Agents | Prototypes | Est. Tokens | Est. Cost |
|---|---|---|---|---|
| Mini | 3 (all Haiku) | 2 | ~14K | ~$0.15 |
| Quick | 4 (mixed) | 3 | ~25K | ~$0.30 |
| Full | 8 (mixed) | 3 | ~45K | ~$0.40 |

---

## Tech Stack

- **Framework** — Next.js 15 App Router
- **Styling** — Tailwind CSS
- **Streaming** — Server-Sent Events (SSE)
- **AI Provider** — Anthropic (Claude Opus 4.6 · Sonnet 4.6 · Haiku 4.5)
- **Language** — TypeScript

---

## Project Structure
```
arch-ai/
├── app/
│   ├── api/
│   │   ├── debate/
│   │   │   └── route.ts            # Main debate SSE endpoint
│   │   ├── continue/
│   │   │   └── route.ts            # Follow-up SSE endpoint (3 agents)
│   │   ├── extract-concepts/
│   │   │   └── route.ts            # Extracts 2–3 product directions from debate
│   │   ├── generate-prototypes/
│   │   │   └── route.ts            # Generates 2–3 full HTML prototypes
│   │   └── generate-refined/
│   │       └── route.ts            # Generates 1 refined HTML after follow-up
│   ├── components/
│   │   ├── StepInput.tsx           # Step 1 — topic input + depth selector
│   │   ├── StepDebate.tsx          # Step 2 — live agent debate
│   │   ├── StepPrototypes.tsx      # Step 3 — review, edit & select prototype
│   │   └── StepContinue.tsx        # Step 4 — follow-up questions + refined HTML
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx                    # Root — global state + step routing
├── lib/
│   ├── agents.ts                   # Agent definitions + system prompts
│   ├── prompts.ts                  # Prompt builder utilities
│   └── demoData.ts                 # Demo dataset (TO_BE_REMOVED before shipping)
├── types/
│   └── index.ts                    # Shared TypeScript types
├── .env.local                      # API keys (never committed)
├── tailwind.config.ts
├── postcss.config.js
└── tsconfig.json
```

---

## Getting Started

### 1. Clone the repo
```bash
git clone https://github.com/YOUR_USERNAME/arch-ai.git
cd arch-ai
```

### 2. Install dependencies
```bash
npm install
```

### 3. Add your API key

Create a `.env.local` file in the root:
```bash
ANTHROPIC_API_KEY=sk-ant-...
```

Get your key from: https://console.anthropic.com/settings/keys

> OpenAI and Gemini keys are optional — the app runs fully on Anthropic models by default.

### 4. Run the dev server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Features

- **Live streaming debate** — watch agents think in real time
- **Demo mode** — replay a full pre-built debate (no API key needed)
- **Inline concept editing** — edit product directions before generating prototypes
- **HTML download** — download any prototype as a standalone HTML file
- **PRD download** — export a full architecture document as Markdown
- **Refined HTML** — generate an updated prototype after the follow-up discussion
- **Stop & Resume** — stop a debate or follow-up mid-stream and resume from where it left off
- **Hebrew (RTL) support** — full UI and AI responses in Hebrew

---

## Languages

ArchAI supports **English** and **Hebrew** (RTL). Toggle with the `עב` button in the top nav.

---

## License

MIT
