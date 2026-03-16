# ArchAI — AI Architecture Brainstorming

ArchAI is a multi-agent AI tool that analyzes your software idea through the eyes of 8 specialized engineers. Each agent streams their response in real time, giving you an architecture decision record, a PRD, and 3 prototype designs — in under 2 minutes.

---

## How It Works

1. **Configure** — Describe your software idea and choose discussion depth (4 or 8 agents)
2. **Discussion** — 8 AI engineers debate the architecture in real time via streaming
3. **Choose Design** — Pick from 3 prototype designs prepared by the team
4. **Refine** — Ask follow-up questions and get targeted answers from the team

---

## The Team

| Agent | Role | Model |
|---|---|---|
| Maya Levi | Orchestrator | Claude Opus 4.6 |
| David Park | System Architect | Gemini 2.5 Pro |
| Priya Sharma | Frontend Architect | Claude Haiku 4.5 |
| Alex Chen | AI Engineer | GPT-5.4 |
| Jordan Kim | Cost Engineer | Claude Haiku 4.5 |
| Sarah Mueller | Security Engineer | Claude Haiku 4.5 |
| Marcus Johnson | Product Manager | Claude Haiku 4.5 |
| Elena Vasquez | Startup Advisor | Claude Haiku 4.5 |

---

## Tech Stack

- **Framework** — Next.js 15 App Router
- **Styling** — Tailwind CSS
- **Streaming** — Server-Sent Events (SSE)
- **AI Providers** — Anthropic, OpenAI, Google Gemini
- **Language** — TypeScript

---

## Project Structure
```
arch-ai/
├── app/
│   ├── api/
│   │   ├── debate/
│   │   │   └── route.ts        # Main debate SSE endpoint (8 agents)
│   │   └── continue/
│   │       └── route.ts        # Follow-up SSE endpoint (3 agents)
│   ├── components/
│   │   ├── StepInput.tsx       # Step 1 — topic input + settings
│   │   ├── StepDebate.tsx      # Step 2 — live agent debate
│   │   ├── StepPrototypes.tsx  # Step 3 — prototype selection
│   │   └── StepContinue.tsx    # Step 4 — follow-up questions
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx                # Root — global state + step routing
├── lib/
│   ├── agents.ts               # Agent definitions + system prompts
│   └── prompts.ts              # Prompt builder utilities
├── types/
│   └── index.ts                # Shared TypeScript types
├── .env.local                  # API keys (never committed)
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

### 3. Add your API keys

Create a `.env.local` file in the root:
```bash
ANTHROPIC_API_KEY=sk-ant-...
OPENAI_API_KEY=sk-...
GEMINI_API_KEY=AIza...
```

Get your keys from:
- Anthropic → https://console.anthropic.com/settings/keys
- OpenAI → https://platform.openai.com/api-keys
- Gemini → https://aistudio.google.com/app/apikey

### 4. Run the dev server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Languages

ArchAI supports **English** and **Hebrew** (RTL). Toggle with the `עב` button in the top nav.

---

## Cost Per Session

| Depth | Agents | Estimated Cost |
|---|---|---|
| Quick | 4 agents | ~$0.02 |
| Full | 8 agents | ~$0.05 |

---

## License

MIT