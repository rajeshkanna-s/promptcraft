import { Languages, SpellCheck, SlidersHorizontal, Feather } from 'lucide-react';
import FormTool from './FormTool.jsx';
import { LANGUAGES } from './ToolShell.jsx';

const DEFS = [
  {
    id: 'lang-translator',
    name: 'AI Translator',
    description: 'Translate text between languages naturally, preserving meaning and tone.',
    icon: Languages,
    config: {
      submitLabel: 'Translate',
      fields: [
        { name: 'text', label: 'Text to translate', emoji: '📝', type: 'textarea', rows: 5, required: true, requiredMsg: 'Enter text to translate.', placeholder: 'Paste or type the text…' },
        { name: 'to', label: 'Translate to', emoji: '🌍', type: 'select', default: 'Spanish', options: LANGUAGES },
        { name: 'style', label: 'Style', emoji: '🎭', type: 'select', default: 'Natural', options: ['Natural', 'Formal', 'Casual', 'Literal / precise'] },
      ],
      build: (v) => ({
        system: `You are an expert translator. Translate the user's text into ${v.to} using a ${v.style.toLowerCase()} style. Preserve meaning, tone and formatting. Output ONLY the translation — no preamble, no notes, no quotes.`,
        user: v.text,
        maxTokens: 2000,
        temperature: 0.4,
      }),
      loading: { label: 'Translating', messages: ['Reading the text…', 'Translating naturally…', 'Preserving tone…'] },
      result: { title: 'Translation', filename: 'translation' },
    },
  },
  {
    id: 'lang-grammar',
    name: 'Grammar & Spelling Fixer',
    description: 'Fix grammar, spelling and punctuation while keeping your original meaning.',
    icon: SpellCheck,
    config: {
      submitLabel: 'Fix My Text',
      fields: [
        { name: 'text', label: 'Your text', emoji: '✍️', type: 'textarea', rows: 6, required: true, requiredMsg: 'Enter your text.', placeholder: 'Paste the text you want corrected…' },
        { name: 'mode', label: 'Correction level', emoji: '🎚️', type: 'select', default: 'Grammar & clarity', options: ['Grammar & spelling only', 'Grammar & clarity', 'Full rewrite for flow'] },
      ],
      build: (v) => ({
        system: `You are a meticulous editor. Correct the user's text (${v.mode.toLowerCase()}), fixing grammar, spelling and punctuation, and improving clarity where asked — WITHOUT changing the original meaning or voice. Output ONLY the corrected text in clean Markdown, no commentary.`,
        user: v.text,
        maxTokens: 2000,
        temperature: 0.4,
      }),
      loading: { label: 'Fixing your text', messages: ['Checking grammar…', 'Fixing punctuation…', 'Improving clarity…'] },
      result: { title: 'Corrected Text', filename: 'corrected-text' },
    },
  },
  {
    id: 'lang-tone-changer',
    name: 'Tone Changer',
    description: 'Rewrite any text in a different tone — professional, friendly, confident and more.',
    icon: SlidersHorizontal,
    config: {
      submitLabel: 'Change Tone',
      fields: [
        { name: 'text', label: 'Your text', emoji: '📝', type: 'textarea', rows: 5, required: true, requiredMsg: 'Enter your text.', placeholder: 'Paste the text to rewrite…' },
        { name: 'tone', label: 'New tone', emoji: '🎭', type: 'select', default: 'Professional', options: ['Professional', 'Friendly', 'Confident', 'Formal', 'Casual', 'Empathetic', 'Persuasive', 'Enthusiastic', 'Diplomatic'] },
      ],
      build: (v) => ({
        system: `You are a skilled copy editor. Rewrite the user's text in a ${v.tone.toLowerCase()} tone while keeping the same meaning and key details. Output ONLY the rewritten text in clean Markdown, no commentary.`,
        user: v.text,
        maxTokens: 1800,
        temperature: 0.7,
      }),
      loading: { label: 'Changing the tone', messages: ['Reading the text…', 'Adjusting the voice…', 'Polishing…'] },
      result: { title: 'Rewritten Text', filename: 'tone-changed' },
    },
  },
  {
    id: 'lang-simplifier',
    name: 'Text Simplifier',
    description: 'Rewrite complex text into clear, plain language anyone can understand.',
    icon: Feather,
    config: {
      submitLabel: 'Simplify',
      fields: [
        { name: 'text', label: 'Complex text', emoji: '📄', type: 'textarea', rows: 6, required: true, requiredMsg: 'Enter text to simplify.', placeholder: 'Paste jargon-heavy or complex text…' },
        { name: 'level', label: 'Target reading level', emoji: '🎯', type: 'select', default: 'Plain English', options: ['Plain English', 'Middle-school level', 'Very simple (ESL friendly)'] },
        { name: 'language', label: 'Output Language', type: 'select', advanced: true, default: 'English', options: LANGUAGES },
      ],
      build: (v) => ({
        system: `You are an expert at plain-language writing. In ${v.language}, rewrite the user's text at a "${v.level}" reading level: use short sentences, common words, and remove jargon — while keeping all key information. Output ONLY the simplified text in clean Markdown.`,
        user: v.text,
        maxTokens: 1800,
        temperature: 0.5,
      }),
      loading: { label: 'Simplifying', messages: ['Removing jargon…', 'Shortening sentences…', 'Keeping the meaning…'] },
      result: { title: 'Simplified Text', filename: 'simplified-text' },
    },
  },
];

export const LANGUAGE_TOOLS = DEFS.map((d) => ({
  id: d.id,
  name: d.name,
  description: d.description,
  category: 'Language Tools',
  icon: d.icon,
  available: true,
  // eslint-disable-next-line react/display-name
  component: () => <FormTool config={{ icon: d.icon, title: d.name, description: d.description, ...d.config }} />,
}));
