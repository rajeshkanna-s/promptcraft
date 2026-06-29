import { Lightbulb, Terminal, ShoppingBag } from 'lucide-react';
import FormTool from './FormTool.jsx';

const DEFS = [
  {
    id: 'idea-niche-generator',
    name: 'Niche Idea Generator',
    description: 'Get unique, engaging, and specially tailored niche concepts for content based on a specific category and topic.',
    icon: Lightbulb,
    config: {
      fields: [
        {
          name: 'interest',
          label: 'What are you interested in?',
          emoji: '💖',
          type: 'text',
          required: true,
          requiredMsg: 'Please fill in what you are interested in.',
          placeholder: 'e.g., Health, Technology, Fashion etc..',
        },
      ],
      build: (v) => ({
        system:
          'You are a content strategy expert. Based on the user\'s category/interest, brainstorm 10 unique, ' +
          'highly engaging, and specially tailored sub-niche concepts. For each sub-niche, provide: ' +
          '1) A catchy name, 2) A target audience, 3) 3 specific content topics/angles, and 4) A monetization ' +
          'strategy suggestion. Present in clean Markdown with professional headings.',
        user: `Interests/Categories: ${v.interest}`,
        maxTokens: 3000,
        temperature: 0.9,
      }),
      loading: {
        label: 'Brainstorming niches',
        messages: ['Analyzing interest categories…', 'Sifting niche opportunities…', 'Structuring topic groups…'],
      },
      result: { title: 'Tailored Niche Ideas', filename: 'niche-ideas' },
    },
  },
  {
    id: 'idea-prompt-generator',
    name: 'Prompt Generator',
    description: 'Fire Up Your Writing Process with Great Prompts. Create robust system instructions and templates for LLMs.',
    icon: Terminal,
    config: {
      fields: [
        {
          name: 'goal',
          label: 'What is the specific goal or task you want to achieve?',
          emoji: '🎯',
          type: 'text',
          required: true,
          requiredMsg: 'Please enter the specific goal or task.',
          placeholder: 'e.g., Increase customer base by 20%, Grow annual revenue by 30%, Enhance brand awareness in Rural areas...',
        },
        {
          name: 'extra',
          label: "Is there any additional information or specific details you'd like to include? (optional)",
          emoji: 'ℹ️',
          type: 'textarea',
          required: false,
          placeholder: "Please enter any extra information or insights you'd like to share.",
        },
      ],
      build: (v) => {
        const context = v.extra ? `Additional context: ${v.extra.trim()}` : '';
        return {
          system:
            'You are an expert prompt engineer. Craft a professional, high-performance, structured LLM prompt ' +
            'designed to achieve the user\'s specific goal. The output prompt should contain: 1) Role / Persona, ' +
            '2) Core Task description, 3) Constraints and Rules, 4) Input data placeholder structure, and 5) Expected ' +
            'Output format. Do not execute the prompt; output the compiled prompt template inside Markdown code fences ' +
            'so the user can easily copy it.',
          user: `Goal to achieve: ${v.goal}\n${context}`,
          maxTokens: 2500,
          temperature: 0.8,
        };
      },
      loading: {
        label: 'Drafting LLM Prompt',
        messages: ['Analyzing prompt architecture…', 'Formulating prompt constraints…', 'Adding variable inputs…'],
      },
      result: { title: 'Generated LLM Prompt Template', filename: 'llm-prompt' },
    },
  },
  {
    id: 'idea-amazon-niche-finder',
    name: 'Amazon Niche Finder',
    description: 'Identify Profitable Amazon Niches Tailored to Your Expertise and Interests.',
    icon: ShoppingBag,
    config: {
      fields: [
        {
          name: 'expertise',
          label: 'What are you good at? (or) In which topic do you know most about?',
          emoji: '🧠',
          type: 'text',
          required: true,
          requiredMsg: 'Please fill in your expertise.',
          placeholder: 'e.g., Cooking, Technology, Fashion, etc.',
        },
        {
          name: 'hobbies',
          label: 'What are your main interests or hobbies?',
          emoji: '💖',
          type: 'text',
          required: true,
          requiredMsg: 'Please fill in your interests/hobbies.',
          placeholder: "e.g., I'm passionate about travel.",
        },
      ],
      build: (v) => ({
        system:
          'You are an Amazon affiliate marketing strategist. Based on the user\'s expertise and hobbies, ' +
          'recommend 5 highly profitable and relevant Amazon niches/departments/categories. For each recommendation, ' +
          'provide: 1) The exact Amazon Category/Department path, 2) Potential high-selling product types, ' +
          '3) Target audience details, and 4) An analysis of search demand vs. competition (Low, Medium, High). ' +
          'Format in clean Markdown with tables where appropriate.',
        user: `Expertise: ${v.expertise}\nHobbies: ${v.hobbies}`,
        maxTokens: 2500,
        temperature: 0.85,
      }),
      loading: {
        label: 'Finding profitable Amazon niches',
        messages: ['Cross-referencing expertise & hobbies…', 'Searching affiliate commission tiers…', 'Formulating niche briefs…'],
      },
      result: { title: 'Profitable Amazon Niches', filename: 'amazon-niches' },
    },
  },
];

// Registry-ready entries for the "Idea Generation" category.
export const IDEA_TOOLS = DEFS.map((d) => ({
  id: d.id,
  name: d.name,
  description: d.description,
  category: 'Idea Generation',
  icon: d.icon,
  available: true,
  // eslint-disable-next-line react/display-name
  component: () => <FormTool config={{ icon: d.icon, title: d.name, description: d.description, ...d.config }} />,
}));
