// ─────────────────────────────────────────────────────────────────────────────
// API integration
// ─────────────────────────────────────────────────────────────────────────────
//
// PromptCraft asks an LLM to expand a short idea into N polished prompts and to
// reply with ONLY a JSON array of strings. Two transports are provided below:
//
//   1. callAiChat()    — DEFAULT. Talks to a Supabase Edge Function that proxies
//                        to a provider (NVIDIA / OpenRouter). The browser only
//                        ever sees a PUBLISHABLE key, so no secret leaks.
//
//   2. callAnthropic() — Direct Anthropic Messages API. Handy if you'd rather
//                        call Claude yourself. NOTE: this puts your secret API
//                        key in client-side code, which is fine for local play
//                        but NOT safe for a deployed site — proxy it instead.
//
// `generatePrompts()` at the bottom is the single entry point the UI calls; it
// builds the system prompt, picks a transport, and parses the JSON safely.
// ─────────────────────────────────────────────────────────────────────────────

import { TYPE_DESCRIPTIONS, TONES, LENGTHS, CUSTOM_LENGTH } from './constants.js';

// Clamp a custom character target into the allowed range.
function clampChars(n) {
  const v = Number(n) || CUSTOM_LENGTH.default;
  return Math.min(CUSTOM_LENGTH.max, Math.max(CUSTOM_LENGTH.min, Math.round(v)));
}

// All config comes from Vite env vars (see .env / .env.example).
const CONFIG = {
  endpoint: import.meta.env.VITE_AI_ENDPOINT,
  publishableKey: import.meta.env.VITE_AI_PUBLISHABLE_KEY,
  provider: import.meta.env.VITE_AI_PROVIDER || 'nvidia',
  modelId: import.meta.env.VITE_AI_MODEL_ID,
  tokenSlotId: import.meta.env.VITE_AI_TOKEN_SLOT_ID,
};

/**
 * Build the dynamic system prompt from the selected type + tone.
 * The model is instructed to return ONLY a JSON array of strings.
 */
export function buildSystemPrompt({ count, type, tone, length, customChars }) {
  const typeLabel = TYPE_DESCRIPTIONS[type] || 'general-purpose AI';
  const toneObj = TONES.find((t) => t.id === tone);
  const toneClause =
    toneObj && toneObj.id !== 'none' ? ` in a ${toneObj.label.toLowerCase()} style` : '';

  // Length controls how long/detailed each prompt should be.
  const lengthObj = LENGTHS.find((l) => l.id === length) || LENGTHS[1];

  // Custom length: target an exact character budget instead of a preset.
  const lengthInstruction =
    length === 'custom'
      ? `approximately ${clampChars(customChars)} characters long (a detailed, self-contained prompt that stays close to this length)`
      : lengthObj.instruction;

  return (
    `You are an expert prompt engineer. Given a short user input, generate exactly ` +
    `${count} distinct, high-quality ${typeLabel} prompts${toneClause}. ` +
    `Each prompt should be ${lengthInstruction}, vivid and specific, and expand ` +
    `meaningfully on the user's idea. Respond ONLY with a valid JSON array of ${count} ` +
    `strings, nothing else — no markdown formatting, no code fences, no explanation, no preamble.`
  );
}

/**
 * Transport #1 — Supabase Edge Function proxy (default).
 * Returns the model's raw text content.
 */
async function callAiChat({ system, user, maxTokens = 1000 }) {
  // The proxy accepts a single `prompt` string, so we fold the system
  // instructions and the user's idea into one message.
  const prompt = `${system}\n\nUser input: "${user}"`;

  const res = await fetch(CONFIG.endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      apikey: CONFIG.publishableKey,
      Authorization: `Bearer ${CONFIG.publishableKey}`,
    },
    body: JSON.stringify({
      provider: CONFIG.provider,
      modelId: CONFIG.modelId,
      tokenSlotId: CONFIG.tokenSlotId,
      prompt,
      temperature: 0.8,
      top_p: 0.9,
      max_tokens: maxTokens,
      // Long batches take longer to generate, so scale the timeout with size.
      attempt_timeout_ms: Math.min(60000, 20000 + maxTokens * 4),
      stream: false,
    }),
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => '');
    throw new Error(`Request failed (${res.status}). ${detail.slice(0, 200)}`);
  }

  const data = await res.json();
  // The proxy returns { content, model, usage, ... }.
  return data.content ?? '';
}

/**
 * Transport #2 — Direct Anthropic Messages API (optional alternative).
 *
 * To use this instead of the proxy:
 *   1. Set VITE_ANTHROPIC_API_KEY in your .env (sk-ant-...).
 *   2. Swap `callAiChat` for `callAnthropic` inside generatePrompts().
 *
 * ⚠️  This exposes your secret key in the browser bundle. Only do it for local
 *     experiments; for production, route the call through your own backend.
 */
// eslint-disable-next-line no-unused-vars
async function callAnthropic({ system, user }) {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': import.meta.env.VITE_ANTHROPIC_API_KEY, // <-- plug in your key
      'anthropic-version': '2023-06-01',
      // Required for browser calls; remove when calling from a server.
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-6',
      max_tokens: 1000,
      system,
      messages: [{ role: 'user', content: `User input: "${user}"` }],
    }),
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => '');
    throw new Error(`Anthropic request failed (${res.status}). ${detail.slice(0, 200)}`);
  }

  const data = await res.json();
  // Anthropic returns { content: [{ type: 'text', text: '...' }], ... }.
  return data?.content?.[0]?.text ?? '';
}

/**
 * Robustly turn model output into an array of prompt strings.
 * Handles clean JSON, fenced JSON, and a line-based fallback.
 */
export function parsePrompts(raw, expectedCount) {
  if (!raw || typeof raw !== 'string') return [];

  // 1) Strip ```json ... ``` fences if the model added them anyway.
  let text = raw.trim().replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();

  // 2) Try a direct JSON.parse, then a salvaged substring between [ ... ].
  const candidates = [text];
  const first = text.indexOf('[');
  const last = text.lastIndexOf(']');
  if (first !== -1 && last !== -1 && last > first) {
    candidates.push(text.slice(first, last + 1));
  }

  for (const candidate of candidates) {
    try {
      const parsed = JSON.parse(candidate);
      if (Array.isArray(parsed)) {
        const strings = parsed.map((p) => String(p).trim()).filter(Boolean);
        if (strings.length) return strings;
      }
    } catch {
      // fall through to the next strategy
    }
  }

  // 3) Last-resort fallback: split into lines, drop numbering / bullets / quotes.
  const lines = text
    .split('\n')
    .map((l) => l.replace(/^\s*(?:[-*•]|\d+[.)])\s*/, '').replace(/^["']|["',]+$/g, '').trim())
    .filter((l) => l.length > 0);

  if (lines.length) return lines.slice(0, expectedCount || lines.length);

  return [];
}

/**
 * Single entry point used by the UI.
 * @returns {Promise<string[]>} array of generated prompt strings
 */
export async function generatePrompts({ input, count, type, tone, length, customChars }) {
  const system = buildSystemPrompt({ count, type, tone, length, customChars });

  // Budget tokens by length × count (+headroom for JSON syntax), capped sanely.
  // For custom mode, estimate ~1 token per 3 chars plus a small buffer.
  const lengthObj = LENGTHS.find((l) => l.id === length) || LENGTHS[1];
  const perPrompt =
    length === 'custom' ? Math.ceil(clampChars(customChars) / 3) + 60 : lengthObj.tokensPerPrompt;
  const maxTokens = Math.min(8000, count * perPrompt + 200);

  // Swap to callAnthropic({ system, user: input }) here to use Claude directly.
  const raw = await callAiChat({ system, user: input, maxTokens });

  const prompts = parsePrompts(raw, count);
  if (!prompts.length) {
    throw new Error("The model didn't return any usable prompts. Try regenerating.");
  }
  return prompts;
}
