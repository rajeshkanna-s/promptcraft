import { TrendingUp } from 'lucide-react';
import FormTool from './FormTool.jsx';

const DEFS = [
  {
    id: 'mkt-strategy',
    name: 'Marketing Strategy Generator',
    description: 'Create a comprehensive marketing plan to grow your business.',
    icon: TrendingUp,
    config: {
      fields: [
        {
          name: 'company',
          label: 'Company or Product Name',
          emoji: '🏢',
          type: 'text',
          required: true,
          requiredMsg: 'Please enter company/product name.',
          placeholder: 'e.g., Sparkly Clean (eco-friendly cleaning service)',
        },
        {
          name: 'about',
          label: 'What does your company do and who is it for?',
          emoji: '💡',
          type: 'textarea',
          required: true,
          requiredMsg: 'Please enter company details.',
          placeholder: 'e.g., We provide organic, safe home cleaning services for busy working parents in urban areas.',
        },
        {
          name: 'budget',
          label: 'Marketing Budget Level',
          emoji: '💰',
          type: 'select',
          required: true,
          options: [
            { value: 'low', label: 'Low / Organic focus (SEO, social, word-of-mouth)' },
            { value: 'medium', label: 'Medium (paid social ads, sponsorships)' },
            { value: 'high', label: 'High (omnichannel, billboards, influencers, paid search)' },
          ],
          default: 'low',
        },
      ],
      build: (v) => ({
        system:
          'You are a Chief Marketing Officer. Build a comprehensive marketing strategy report based on the ' +
          'company background and budget. Include: 1) Executive Summary, 2) Positioning & Key Messages, ' +
          '3) Recommended Marketing Channels, and 4) A 30-Day Launch Action Plan. Format in clean Markdown.',
        user: `Company Name: ${v.company}\nDescription: ${v.about}\nMarketing Budget Level: ${v.budget}`,
        maxTokens: 3000,
        temperature: 0.8,
      }),
      loading: {
        label: 'Designing marketing strategy',
        messages: ['Analyzing niche market size…', 'Selecting optimal marketing channels…', 'Drafting 30-day plan…'],
      },
      result: { title: 'Marketing Strategy Plan', filename: 'marketing-strategy' },
    },
  },
  {
    id: 'mkt-persona',
    name: 'Target Audience Persona',
    description: 'Define your ideal customer profile with demographics and behaviors.',
    icon: TrendingUp,
    config: {
      fields: [
        {
          name: 'product',
          label: 'What is your product or service?',
          emoji: '🛍️',
          type: 'text',
          required: true,
          requiredMsg: 'Please enter product details.',
          placeholder: 'e.g., high-end ergonomic desk chairs',
        },
        {
          name: 'audience',
          label: 'General audience description',
          emoji: '👥',
          type: 'textarea',
          required: true,
          requiredMsg: 'Please describe the target audience.',
          placeholder: 'e.g., remote workers and software engineers who sit for long hours',
        },
      ],
      build: (v) => ({
        system:
          'You are a consumer researcher. Create a highly detailed Target Customer Persona profile based on the ' +
          'product and target audience. Include: 1) Persona Nickname, 2) Demographics (Age, Income, Occupation, Location), ' +
          '3) Core values & goals, 4) Major frustrations & pain points, and 5) Buying behaviors. Format in clean Markdown.',
        user: `Product: ${v.product}\nAudience Target: ${v.audience}`,
        maxTokens: 2500,
        temperature: 0.8,
      }),
      loading: {
        label: 'Generating audience persona',
        messages: ['Synthesizing demographics…', 'Mapping values & objectives…', 'Structuring persona brief…'],
      },
      result: { title: 'Target Customer Persona', filename: 'audience-persona' },
    },
  },
  {
    id: 'mkt-brand-voice',
    name: 'Brand Voice & Style Guide',
    description: 'Establish a consistent brand personality and communication style.',
    icon: TrendingUp,
    config: {
      fields: [
        {
          name: 'company',
          label: 'Company Name',
          emoji: '🏢',
          type: 'text',
          required: true,
          requiredMsg: 'Please enter company name.',
          placeholder: 'e.g., EcoNest',
        },
        {
          name: 'personality',
          label: 'Describe your brand in 3 adjectives',
          emoji: '🎭',
          type: 'text',
          required: true,
          requiredMsg: 'Please enter adjectives.',
          placeholder: 'e.g., playful, knowledgeable, eco-conscious',
        },
        {
          name: 'examples',
          label: 'What does your company do?',
          emoji: '📝',
          type: 'textarea',
          required: true,
          requiredMsg: 'Please describe company offerings.',
          placeholder: 'e.g., We sell sustainable home decor items made of bamboo and cork.',
        },
      ],
      build: (v) => ({
        system:
          'You are a brand strategist. Generate a formal Brand Voice & Tone style guide. Outline: ' +
          '1) Brand Persona overview, 2) Voice Adjectives & explanations, 3) A "Do & Don\'t" table for word choices, ' +
          'and 4) 3 example marketing messages rewritten in this voice. Format in clean Markdown.',
        user: `Company Name: ${v.company}\nBrand Adjectives: ${v.personality}\nCore Product: ${v.examples}`,
        maxTokens: 2500,
        temperature: 0.75,
      }),
      loading: {
        label: 'Developing brand voice guidelines',
        messages: ['Setting stylistic tone…', 'Building Do & Don\'t vocabularies…', 'Writing tone templates…'],
      },
      result: { title: 'Brand Voice & Tone Guide', filename: 'brand-style-guide' },
    },
  },
  {
    id: 'mkt-newsletter',
    name: 'Newsletter Campaign Planner',
    description: 'Map out engaging email newsletters to nurture your leads.',
    icon: TrendingUp,
    config: {
      fields: [
        {
          name: 'topic',
          label: 'What is the newsletter campaign theme or launch details?',
          emoji: '📧',
          type: 'textarea',
          required: true,
          requiredMsg: 'Please enter campaign details.',
          placeholder: 'e.g., educational tips on cybersecurity, winter clearance discount push',
        },
        {
          name: 'frequency',
          label: 'Campaign Structure',
          emoji: '🗓️',
          type: 'select',
          required: true,
          options: [
            { value: 'single', label: '1 single detailed newsletter' },
            { value: 'sequence-3', label: 'A 3-part nurture sequence' },
            { value: 'sequence-5', label: 'A 5-part nurture sequence' },
          ],
          default: 'sequence-3',
        },
      ],
      build: (v) => ({
        system:
          'You are an email marketer. Create the requested newsletter campaign plan. For each email ' +
          'in the plan/sequence, provide: 1) Subject line options, 2) Preview text, 3) Key educational ' +
          'or promotional message outline, and 4) Main Call-To-Action (CTA) suggestion. Format in clean Markdown.',
        user: `Campaign Topic: ${v.topic}\nFrequency/Structure: ${v.frequency}`,
        maxTokens: 3000,
        temperature: 0.8,
      }),
      loading: {
        label: 'Designing newsletter sequence',
        messages: ['Planning nurture sequence map…', 'Writing engaging subject lines…', 'Drafting call-to-actions…'],
      },
      result: { title: 'Newsletter Campaign Outline', filename: 'newsletter-campaign' },
    },
  },
];

// Registry-ready entries for the "Marketing Tools" category.
export const MARKETING_TOOLS = DEFS.map((d) => ({
  id: d.id,
  name: d.name,
  description: d.description,
  category: 'Marketing Tools',
  icon: d.icon,
  available: true,
  // eslint-disable-next-line react/display-name
  component: () => <FormTool config={{ icon: d.icon, title: d.name, description: d.description, ...d.config }} />,
}));
