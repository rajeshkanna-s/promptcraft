// Static option lists shared across the app (input panel + system-prompt builder).

// Top-level prompt category — what kind of model the prompts target.
export const PROMPT_TYPES = [
  { id: 'text', label: 'Text', hint: 'Prompts for ChatGPT, Claude, writing & code.' },
  { id: 'image', label: 'Image', hint: 'Prompts for Midjourney, DALL·E, SDXL, Flux.' },
  { id: 'video', label: 'Video', hint: 'Prompts for Sora, Veo, Runway, Kling.' },
];

// Per-category option groups. Each group renders as a dropdown in the input
// panel and is woven into the system prompt (see api.js).
export const TYPE_OPTIONS = {
  text: [
    {
      key: 'purpose',
      label: 'Purpose',
      default: 'general',
      choices: [
        { id: 'general', label: 'General' },
        { id: 'writing', label: 'Creative writing' },
        { id: 'persona', label: 'Chatbot / persona' },
        { id: 'coding', label: 'Coding' },
        { id: 'marketing', label: 'Marketing copy' },
      ],
    },
  ],
  image: [
    {
      key: 'aspect',
      label: 'Aspect ratio',
      default: '1:1',
      choices: [
        { id: '1:1', label: 'Square 1:1' },
        { id: '16:9', label: 'Landscape 16:9' },
        { id: '9:16', label: 'Vertical 9:16' },
        { id: '4:3', label: 'Standard 4:3' },
        { id: '3:2', label: 'Photo 3:2' },
      ],
    },
    {
      key: 'style',
      label: 'Visual style',
      default: 'photorealistic',
      choices: [
        { id: 'photorealistic', label: 'Photorealistic' },
        { id: 'digital-art', label: 'Digital art' },
        { id: '3d-render', label: '3D render' },
        { id: 'anime', label: 'Anime / manga' },
        { id: 'oil-painting', label: 'Oil painting' },
        { id: 'watercolor', label: 'Watercolor' },
        { id: 'pixel-art', label: 'Pixel art' },
      ],
    },
  ],
  video: [
    {
      key: 'aspect',
      label: 'Aspect ratio',
      default: '16:9',
      choices: [
        { id: '16:9', label: 'Landscape 16:9' },
        { id: '9:16', label: 'Vertical 9:16' },
        { id: '1:1', label: 'Square 1:1' },
        { id: '21:9', label: 'Cinematic 21:9' },
      ],
    },
    {
      key: 'duration',
      label: 'Duration',
      default: '10s',
      choices: [
        { id: '5s', label: '~5 seconds' },
        { id: '10s', label: '~10 seconds' },
        { id: '30s', label: '~30 seconds' },
      ],
    },
    {
      key: 'motion',
      label: 'Camera / motion',
      default: 'dynamic',
      choices: [
        { id: 'static', label: 'Static shot' },
        { id: 'dynamic', label: 'Dynamic motion' },
        { id: 'pan', label: 'Cinematic pan' },
        { id: 'aerial', label: 'Aerial / drone' },
        { id: 'tracking', label: 'Tracking shot' },
      ],
    },
  ],
};

// Build the default option object for a given category.
export function defaultTypeOptions(type) {
  const groups = TYPE_OPTIONS[type] || [];
  return Object.fromEntries(groups.map((g) => [g.key, g.default]));
}

// Resolve the selected choice object for one option group.
export function getOptionChoice(type, key, value) {
  const group = (TYPE_OPTIONS[type] || []).find((g) => g.key === key);
  if (!group) return null;
  return group.choices.find((c) => c.id === (value ?? group.default)) || group.choices[0];
}

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
// Max is set well above what the "Long" preset produces (~1000-1500 chars),
// so Custom can always go longer than any preset.
export const CUSTOM_LENGTH = { min: 50, max: 4000, default: 800 };

export const MAX_HISTORY = 20;

// How each text "purpose" is described inside the system prompt.
export const TEXT_PURPOSE_DESCRIPTIONS = {
  general: 'general-purpose AI',
  writing: 'creative-writing',
  persona: 'chatbot persona / system-prompt',
  coding: 'software-engineering',
  marketing: 'marketing & copywriting',
};
