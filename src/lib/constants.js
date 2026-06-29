// Static option lists shared across the app (input panel + system-prompt builder).

// Prompt "type" changes the kind of output the model is asked to produce.
export const PROMPT_TYPES = [
  { id: 'image', label: 'Image Generation', hint: 'Prompts for Midjourney, DALL·E, SDXL, etc.' },
  { id: 'writing', label: 'Creative Writing', hint: 'Story seeds, scene starters, narrative hooks.' },
  { id: 'persona', label: 'Chatbot / Persona', hint: 'System personas for assistants & characters.' },
  { id: 'coding', label: 'Coding', hint: 'Well-scoped engineering / build prompts.' },
  { id: 'general', label: 'General', hint: 'All-purpose, versatile prompts.' },
];

// Optional tone modifier appended to the system instructions.
export const TONES = [
  { id: 'none', label: 'Default' },
  { id: 'cinematic', label: 'Cinematic' },
  { id: 'minimalist', label: 'Minimalist' },
  { id: 'detailed', label: 'Detailed' },
  { id: 'playful', label: 'Playful' },
  { id: 'professional', label: 'Professional' },
];

// How many prompts to generate per batch.
export const COUNT_OPTIONS = [3, 5, 10];

// Prompt length — drives both the wording in the system prompt and the
// per-prompt token budget (see api.js).
export const LENGTHS = [
  {
    id: 'short',
    label: 'Short',
    instruction: '1-2 concise sentences',
    tokensPerPrompt: 160,
  },
  {
    id: 'medium',
    label: 'Medium',
    instruction: '3-5 descriptive sentences',
    tokensPerPrompt: 380,
  },
  {
    id: 'long',
    label: 'Long',
    instruction:
      'a rich, fully-detailed paragraph of at least 6-10 sentences, layering in specific ' +
      'details (subject, setting, mood, style, composition, constraints) so the prompt is ' +
      'thorough and immediately usable',
    tokensPerPrompt: 750,
  },
  // "Custom" lets the user target an exact character budget (see CUSTOM_LENGTH).
  { id: 'custom', label: 'Custom', instruction: '', tokensPerPrompt: 0 },
];

// Bounds for the custom character-count input.
export const CUSTOM_LENGTH = { min: 50, max: 1000, default: 500 };

export const MAX_HISTORY = 20;

// Human-readable description used inside the system prompt for each type.
export const TYPE_DESCRIPTIONS = {
  image: 'image-generation',
  writing: 'creative-writing',
  persona: 'chatbot persona / system-prompt',
  coding: 'software-engineering',
  general: 'general-purpose AI',
};
