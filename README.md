# Bihar Udyog Mitra AI · उद्योग मित्र

**AI-first Centralized Integrated Management System (CIMS) for MSMEs — Department of Industries, Government of Bihar.**

Built in response to Tender No. 1127/UM for the RAMP (Raising and Accelerating MSME Performance) programme. Mirrors the Vite + React + Vercel serverless architecture used in our Rajasthan Tourism AI app, with Anthropic Claude as the conversational intelligence layer.

## What makes this different

This is not a portal with a chatbot bolted on. AI is the **experience layer** across three personas:

| Persona | AI Copilot |
|---------|------------|
| **MSME Owner** (entrepreneur, job-seeker) | `Udyog Mitra AI` — bilingual conversational onboarding, voice in Hindi/English, scheme matchmaker, DPR auto-builder, grievance auto-routing, live market demand intelligence |
| **DIC Officer** (district industries officer, MSME coordinator) | Application triage with AI red/green flags, stressed-MSME predictions, grievance theme clustering |
| **Secretary / CM** | `Ask Bihar` cockpit — voice briefing, anomaly heat map, what-if policy simulator, KG-driven root cause analysis |

Spine: **MSME Knowledge Graph + NLP scheme ingestion + bilingual voice + predictive intelligence layer**, all aligned with the AI requirements articulated in Section 4.2 of the Bihar Scope (PR document) and Section 7.1.16 of the Technical Proposal.

## Stack

- Vite + React 18 (SPA)
- React Router DOM
- Vercel serverless functions (`/api/*`) → Anthropic Claude (`claude-haiku-4-5` with `claude-sonnet-4-6` fallback)
- Web Speech API for voice input (browser-native, no third-party dependency)
- Mobile-first 420px shell, Inter + Noto Sans Devanagari typography

## Local development

Two modes, depending on what you need:

```bash
npm install

# Mode A — UI only (fast HMR; AI calls fall back to offline knowledge)
npm run dev              # http://localhost:3001

# Mode B — Full stack with live Anthropic Claude API
npx vercel dev           # http://localhost:3000  (one-time: npm i -g vercel + vercel login)
```

`.env` already contains `ANTHROPIC_API_KEY`. The fallback UI gracefully shows offline answers when the API key isn't reachable — so even `npm run dev` lets you demo the flows.

## Deploy

1. `git init && git add . && git commit -m "Bihar Udyog Mitra AI v1"` → push to GitHub
2. Vercel dashboard → "Import Project" → pick the repo → keep defaults
3. Vercel env vars → add `ANTHROPIC_API_KEY` (paste your key)
4. Deploy. `/api/chat` and `/api/live-data` auto-become serverless endpoints.

## Project layout

```
api/
  chat.js          Claude API integration with full Bihar MSME system prompt
  live-data.js     Live ecosystem stats (schemes, deadlines, district KPIs) for prompt enrichment
src/
  context/         AppContext (user, profile, language)
  data/            schemes.js (Central + State schemes), districts.js (all 38 Bihar districts)
  components/      AppBar, BottomNav, NearbyMSME (value-add like Rajasthan's "nearby pin")
  screens/         Splash, PersonaSelect, Login, ProfileSetup, MSMEHome,
                   UdyogMitraAI (HERO), SchemeMatcher, DPRBuilder, Grievance,
                   MarketIntel, OfficerDashboard, SecretaryCockpit
```

## CEO talking points

1. **Conversation is the UI**: MSME owner can speak Hindi — "मेरा garments ka business hai Bhagalpur me, loan chahiye" — and AI does scheme matching, eligibility check, DPR draft, MUDRA branch lookup, in one thread.
2. **AI for the top**: CM/Secretary asks "Show Gaya textile distress" — AI fuses MSME Knowledge Graph + live disbursement data and answers with a chart.
3. **AI for the middle**: DIC officer sees a pre-triaged inbox where applications come in with AI-generated risk flags and recommendations.
4. **Compliance + WOW together**: Every feature mapped to a scope-document requirement (Section 4.2, 4.3) — but delivered as an AI experience, not a form.
