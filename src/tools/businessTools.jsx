import { Building2, Sparkles, Target, Rocket, Gem } from 'lucide-react';
import FormTool from './FormTool.jsx';
import { LANGUAGES } from './ToolShell.jsx';

const language = {
  name: 'language',
  label: 'Output Language',
  type: 'select',
  advanced: true,
  default: 'English',
  options: LANGUAGES,
};

const DEFS = [
  {
    id: 'biz-name-generator',
    name: 'Business Name Generator',
    description: 'Generate creative, brandable business name ideas with a quick rationale for each.',
    icon: Building2,
    config: {
      submitLabel: 'Generate Names',
      fields: [
        { name: 'about', label: 'What does your business do?', emoji: '💡', type: 'textarea', rows: 3, required: true, requiredMsg: 'Describe your business.', placeholder: 'e.g., a subscription box for specialty coffee' },
        { name: 'style', label: 'Name style', emoji: '🎨', type: 'select', default: 'Modern', options: ['Modern', 'Playful', 'Elegant', 'Techy', 'Classic', 'Made-up / brandable', 'One word', 'Descriptive'] },
        { name: 'keywords', label: 'Words to include or hint at (optional)', emoji: '🔑', type: 'text', placeholder: 'e.g., brew, roast, daily' },
        language,
      ],
      build: (v) => ({
        system: `You are a branding expert. In ${v.language}, generate 20 ${v.style.toLowerCase()} business name ideas for the described business. For each, add a very short (5–8 word) rationale. Prefer names that sound available and are easy to say/spell. Output a clean numbered Markdown list.`,
        user: `Business: ${v.about}\nStyle: ${v.style}\nKeywords: ${v.keywords || 'none'}`,
        maxTokens: 1400,
        temperature: 0.95,
      }),
      loading: { label: 'Generating names', messages: ['Exploring word plays…', 'Checking brandability…', 'Writing rationales…'] },
      result: { title: 'Business Name Ideas', filename: 'business-names' },
    },
  },
  {
    id: 'biz-slogan',
    name: 'Slogan & Tagline Generator',
    description: 'Create catchy slogans and taglines that capture your brand in a few words.',
    icon: Sparkles,
    config: {
      submitLabel: 'Generate Slogans',
      fields: [
        { name: 'brand', label: 'Brand / product name', emoji: '🏷️', type: 'text', required: true, requiredMsg: 'Enter your brand name.', placeholder: 'e.g., BrewBox' },
        { name: 'about', label: 'What does it do / stand for?', emoji: '💡', type: 'textarea', rows: 3, required: true, requiredMsg: 'Describe the brand.', placeholder: 'e.g., specialty coffee delivered monthly' },
        { name: 'tone', label: 'Tone', emoji: '🎭', type: 'select', default: 'Catchy', options: ['Catchy', 'Professional', 'Playful', 'Inspirational', 'Bold', 'Minimal'] },
        language,
      ],
      build: (v) => ({
        system: `You are a brand copywriter. In ${v.language}, write 15 short, memorable slogans/taglines (${v.tone.toLowerCase()} tone) for the brand. Keep each under 8 words, varied in angle. Output a clean numbered Markdown list only.`,
        user: `Brand: ${v.brand}\nAbout: ${v.about}`,
        maxTokens: 900,
        temperature: 0.95,
      }),
      loading: { label: 'Generating slogans', messages: ['Playing with words…', 'Trimming to punchy lines…', 'Picking the best angles…'] },
      result: { title: 'Slogans & Taglines', filename: 'slogans' },
    },
  },
  {
    id: 'biz-mission',
    name: 'Mission & Vision Statement',
    description: 'Craft clear, inspiring mission and vision statements for your organization.',
    icon: Target,
    config: {
      submitLabel: 'Write Statements',
      fields: [
        { name: 'about', label: 'About your organization', emoji: '🏢', type: 'textarea', rows: 3, required: true, requiredMsg: 'Describe your organization.', placeholder: 'e.g., we help small farms sell directly to local customers' },
        { name: 'values', label: 'Core values / what matters (optional)', emoji: '❤️', type: 'text', placeholder: 'e.g., sustainability, community, fairness' },
        language,
      ],
      build: (v) => ({
        system: `You are a brand strategist. In ${v.language}, write a clear mission statement, a vision statement, and 4–6 concise core values for the organization. Make them specific and inspiring, not generic. Use Markdown with "## Mission", "## Vision", "## Core Values" headings.`,
        user: `Organization: ${v.about}\nValues hint: ${v.values || 'none'}`,
        maxTokens: 1100,
        temperature: 0.8,
      }),
      loading: { label: 'Writing statements', messages: ['Clarifying purpose…', 'Shaping the vision…', 'Defining values…'] },
      result: { title: 'Mission & Vision', filename: 'mission-vision' },
    },
  },
  {
    id: 'biz-elevator-pitch',
    name: 'Elevator Pitch Generator',
    description: 'Get a crisp 30-second pitch that explains what you do and why it matters.',
    icon: Rocket,
    config: {
      submitLabel: 'Write Pitch',
      fields: [
        { name: 'about', label: 'What do you do?', emoji: '💡', type: 'textarea', rows: 3, required: true, requiredMsg: 'Describe what you do.', placeholder: 'e.g., an app that helps freelancers get paid on time' },
        { name: 'audience', label: 'Who is it for?', emoji: '🎯', type: 'text', required: true, requiredMsg: 'Who is it for?', placeholder: 'e.g., freelancers and small agencies' },
        { name: 'context', label: 'Where will you use it?', emoji: '📍', type: 'select', default: 'Networking / general', options: ['Networking / general', 'Investor pitch', 'Sales call', 'Job interview'] },
        language,
      ],
      build: (v) => ({
        system: `You are a pitch coach. In ${v.language}, write 3 versions of a ~30-second elevator pitch tailored for "${v.context}": a one-liner, a short paragraph, and a slightly longer version. Focus on the problem, the solution, and why it's compelling. Use Markdown headings.`,
        user: `What: ${v.about}\nAudience: ${v.audience}\nContext: ${v.context}`,
        maxTokens: 1000,
        temperature: 0.8,
      }),
      loading: { label: 'Writing your pitch', messages: ['Framing the problem…', 'Sharpening the hook…', 'Timing it to 30 seconds…'] },
      result: { title: 'Elevator Pitch', filename: 'elevator-pitch' },
    },
  },
  {
    id: 'biz-value-prop',
    name: 'Value Proposition Builder',
    description: 'Craft a clear value proposition that explains why customers should choose you.',
    icon: Gem,
    config: {
      submitLabel: 'Build Value Prop',
      fields: [
        { name: 'product', label: 'Product / service', emoji: '📦', type: 'textarea', rows: 3, required: true, requiredMsg: 'Describe your product.', placeholder: 'e.g., project management tool for creative teams' },
        { name: 'audience', label: 'Target customer', emoji: '🎯', type: 'text', required: true, requiredMsg: 'Who is the customer?', placeholder: 'e.g., design agencies of 5–50 people' },
        { name: 'problem', label: 'Main problem you solve', emoji: '🧩', type: 'textarea', rows: 2, placeholder: 'e.g., scattered feedback and missed deadlines' },
        language,
      ],
      build: (v) => ({
        system: `You are a positioning expert. In ${v.language}, craft a value proposition for the product. Provide: a one-sentence value proposition, 3 headline options, 3 supporting benefit bullets, and a short "why us" differentiator. Use clean Markdown with headings.`,
        user: `Product: ${v.product}\nCustomer: ${v.audience}\nProblem: ${v.problem || 'not specified'}`,
        maxTokens: 1200,
        temperature: 0.8,
      }),
      loading: { label: 'Building value prop', messages: ['Pinpointing the benefit…', 'Writing headlines…', 'Finding your edge…'] },
      result: { title: 'Value Proposition', filename: 'value-proposition' },
    },
  },
];

export const BUSINESS_TOOLS = DEFS.map((d) => ({
  id: d.id,
  name: d.name,
  description: d.description,
  category: 'Business Tools',
  icon: d.icon,
  available: true,
  // eslint-disable-next-line react/display-name
  component: () => <FormTool config={{ icon: d.icon, title: d.name, description: d.description, ...d.config }} />,
}));
