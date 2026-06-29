# PromptCraft

An AI-powered prompt generator. Type a short idea (e.g. _"sunset beach"_) and PromptCraft expands it into a batch of polished, ready-to-use prompts — tuned by **type** (Image / Writing / Persona / Coding / General) and **tone** (Cinematic, Minimalist, Detailed, Playful, Professional).

Built with **React 18 + Vite + Tailwind CSS v4 + lucide-react**.

## Features

- Generate **3 / 5 / 10** prompts from a single idea
- **Prompt type** + **Tone** modifiers that reshape the system prompt
- Per-card **Copy** and **Star** (favorite) buttons, plus **Copy All**
- **Regenerate** a fresh batch without retyping
- **History** of the last 20 batches (localStorage) — click to reload
- **Favorites** list (localStorage)
- **Export** all prompts as `.txt` or `.json`
- **Dark / Light** theme toggle (persisted, follows OS by default)
- Skeleton **loading** state, inline **error** handling, live **char/word count**
- Fully **responsive** (mobile → desktop)

## Quick start

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build into dist/
```

## API configuration

Config lives in `.env` (see `.env.example`). By default PromptCraft calls a
**Supabase Edge Function** (`ai-chat`) that proxies to an LLM provider. Only a
**publishable** key reaches the browser — no secret is exposed.

```ini
VITE_AI_ENDPOINT=https://…/functions/v1/ai-chat
VITE_AI_PUBLISHABLE_KEY=sb_publishable_…
VITE_AI_PROVIDER=nvidia            # or "openrouter"
VITE_AI_MODEL_ID=…
VITE_AI_TOKEN_SLOT_ID=…
```

### Plugging in your own key / Anthropic directly

All API logic is isolated in [`src/lib/api.js`](src/lib/api.js):

- `callAiChat()` — the default Supabase proxy transport.
- `callAnthropic()` — a ready-to-use **direct Anthropic Messages API** call
  (model `claude-sonnet-4-6`). Set `VITE_ANTHROPIC_API_KEY` and swap the call
  inside `generatePrompts()`. ⚠️ Calling Anthropic directly from the browser
  exposes your secret key — fine for local play, but proxy it for production.

The model is instructed to return **only a JSON array of strings**; `parsePrompts()`
handles clean JSON, stray code fences, and a line-based fallback if the model
ignores the format.

## Project structure

```
src/
  App.jsx                 # state + generation flow wiring
  context/ThemeContext.jsx
  lib/
    api.js                # API integration + system-prompt builder + JSON parsing
    constants.js          # prompt types, tones, counts
    storage.js            # localStorage helpers (history / favorites / theme)
  components/
    Header.jsx  ThemeToggle.jsx  InputPanel.jsx
    ResultsGrid.jsx  PromptCard.jsx  SkeletonCard.jsx
    Sidebar.jsx  HistoryPanel.jsx  FavoritesPanel.jsx  Footer.jsx
```
