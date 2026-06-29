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

import {
  TEXT_PURPOSE_DESCRIPTIONS,
  TONES,
  LENGTHS,
  CUSTOM_LENGTH,
  getOptionChoice,
} from './constants.js';

// Clamp a custom character target into the allowed range.
function clampChars(n) {
  const v = Number(n) || CUSTOM_LENGTH.default;
  return Math.min(CUSTOM_LENGTH.max, Math.max(CUSTOM_LENGTH.min, Math.round(v)));
}

// Build the "what kind of prompt" label + a category-specific requirements
// clause from the selected category and its options (aspect ratio, style, …).
function buildTypeClause(type, options = {}) {
  const choice = (key) => getOptionChoice(type, key, options[key]);

  if (type === 'image') {
    const aspect = choice('aspect')?.id || '1:1';
    const style = choice('style')?.label.toLowerCase() || 'photorealistic';
    return {
      label: 'image-generation',
      requirements:
        ` Every prompt must be written for a text-to-image model and must explicitly state a ` +
        `${aspect} aspect ratio and a ${style} visual style, and describe subject, setting, ` +
        `lighting, color palette, composition and level of detail.`,
    };
  }

  if (type === 'video') {
    const aspect = choice('aspect')?.id || '16:9';
    const duration = choice('duration')?.label.toLowerCase() || '~10 seconds';
    const motion = choice('motion')?.label.toLowerCase() || 'dynamic motion';
    return {
      label: 'text-to-video',
      requirements:
        ` Every prompt must be written for a text-to-video model and must explicitly state a ` +
        `${aspect} aspect ratio, ${duration} duration and ${motion} camera work, and describe ` +
        `the scene, subject action, pacing, lighting and mood across the shot.`,
    };
  }

  // text (default)
  const purpose = choice('purpose')?.id || 'general';
  return {
    label: TEXT_PURPOSE_DESCRIPTIONS[purpose] || 'general-purpose AI',
    requirements: '',
  };
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
export function buildSystemPrompt({ count, type, tone, length, customChars, typeOptions }) {
  const { label: typeLabel, requirements } = buildTypeClause(type, typeOptions);
  const toneObj = TONES.find((t) => t.id === tone);
  const toneClause =
    toneObj && toneObj.id !== 'none' ? ` in a ${toneObj.label.toLowerCase()} style` : '';

  // Length controls how long/detailed each prompt should be.
  const lengthObj = LENGTHS.find((l) => l.id === length) || LENGTHS[1];

  // Custom length: target an exact character budget instead of a preset.
  const lengthInstruction =
    length === 'custom'
      ? `at least ${clampChars(customChars)} characters long — a thorough, self-contained prompt ` +
        `packed with concrete, specific detail (subject, setting, mood, style, composition, ` +
        `constraints, requirements). Keep expanding with relevant detail until you reach that ` +
        `length; do NOT stop short of ${clampChars(customChars)} characters`
      : lengthObj.instruction;

  return (
    `You are an expert prompt engineer. Given a short user input, generate exactly ` +
    `${count} distinct, high-quality ${typeLabel} prompts${toneClause}. ` +
    `Each prompt should be ${lengthInstruction}, vivid and specific, and expand ` +
    `meaningfully on the user's idea.${requirements} Respond ONLY with a valid JSON array of ` +
    `${count} strings, nothing else — no markdown formatting, no code fences, no explanation, ` +
    `no preamble.`
  );
}

/**
 * Low-level transport — POST a single prompt string to the Supabase proxy and
 * return the model's raw text content. Shared by every feature in the app.
 */
async function callProxy({ prompt, maxTokens = 1000, temperature = 0.8, topP = 0.9 }) {
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
      temperature,
      top_p: topP,
      max_tokens: maxTokens,
      // Bigger responses take longer to generate, so scale the timeout with size.
      attempt_timeout_ms: Math.min(90000, 20000 + maxTokens * 4),
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
 * Transport #1 — prompt-generator flavored call (folds system + user idea).
 */
async function callAiChat({ system, user, maxTokens = 1000 }) {
  const prompt = `${system}\n\nUser input: "${user}"`;
  return callProxy({ prompt, maxTokens });
}

/**
 * General-purpose text generation used by the Tools pages (Blog Writer,
 * Summarizer, …). Returns the model's raw text — no JSON parsing.
 */
export async function generateText({ system = '', user, maxTokens = 2000, temperature = 0.8 }) {
  const prompt = system ? `${system}\n\n${user}` : user;
  return callProxy({ prompt, maxTokens, temperature });
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
export async function generatePrompts({ input, count, type, tone, length, customChars, typeOptions }) {
  const system = buildSystemPrompt({ count, type, tone, length, customChars, typeOptions });

  // Budget tokens by length × count (+headroom for JSON syntax), capped sanely.
  // For custom mode, estimate ~1 token per 3 chars plus a small buffer.
  const lengthObj = LENGTHS.find((l) => l.id === length) || LENGTHS[1];
  // ~1 token ≈ 3 chars of output, plus headroom so the model can reach (and
  // slightly exceed) the target instead of being cut off early.
  const perPrompt =
    length === 'custom'
      ? Math.ceil(clampChars(customChars) / 2.5) + 80
      : lengthObj.tokensPerPrompt;
  const maxTokens = Math.min(16000, count * perPrompt + 200);

  // Swap to callAnthropic({ system, user: input }) here to use Claude directly.
  const raw = await callAiChat({ system, user: input, maxTokens });

  const prompts = parsePrompts(raw, count);
  if (!prompts.length) {
    throw new Error("The model didn't return any usable prompts. Try regenerating.");
  }
  return prompts;
}

const stripQuotes = (s) => s.trim().replace(/^["'`]+|["'`]+$/g, '').trim();

/**
 * Expand a short, vague seed into a richer, more specific one-line idea brief.
 * Used by the "Enhance my idea" button.
 */
export async function enhanceIdea(idea) {
  const raw = await generateText({
    system:
      'You turn a short, vague idea into ONE richer, more specific and evocative idea brief ' +
      '(under 25 words) that will produce noticeably better AI prompts. Respond with ONLY the ' +
      'improved idea text — no quotes, no preamble, no list, no options.',
    user: `Idea: ${idea}`,
    maxTokens: 120,
    temperature: 0.9,
  });
  return stripQuotes(raw) || idea;
}

/**
 * Transform a single existing prompt: regenerate a fresh one, or rewrite it
 * longer / shorter / translated. Returns the new prompt string.
 */
export async function transformPrompt({
  action,
  prompt,
  language,
  // settings used when regenerating a fresh single prompt
  input,
  type,
  typeOptions,
  tone,
  length,
  customChars,
}) {
  if (action === 'regenerate') {
    const out = await generatePrompts({
      input,
      count: 1,
      type,
      typeOptions,
      tone,
      length,
      customChars,
    });
    return out[0];
  }

  const instruction = {
    longer: 'Rewrite this prompt to be noticeably longer and more detailed, preserving its intent.',
    shorter: 'Rewrite this prompt to be more concise while keeping its core intent.',
    translate: `Translate this prompt into ${language}, preserving meaning and detail.`,
  }[action];

  const out = await generateText({
    system: `You edit AI prompts. ${instruction} Respond with ONLY the resulting prompt text — no quotes, no preamble, no explanation.`,
    user: prompt,
    maxTokens: 1400,
    temperature: 0.7,
  });
  return stripQuotes(out) || prompt;
}
