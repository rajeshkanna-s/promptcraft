import { ShieldCheck, EyeOff, RefreshCw, FileText } from 'lucide-react';
import FormTool from './FormTool.jsx';

const DEFS = [
  {
    id: 'rewrite-plagiarism-ai-bypass',
    name: 'Rewrite Article (Plagiarism Free & AI Detector Bypass)',
    description: 'Transform Existing Blogs into Unique, AI-Detection Free Articles.',
    icon: ShieldCheck,
    config: {
      fields: [
        {
          name: 'content',
          label: 'Provide your Article/Blogpost or any other content to rewrite.',
          emoji: '🤖',
          type: 'textarea',
          required: true,
          requiredMsg: 'Please paste the content you want to rewrite.',
          placeholder: "Please paste the AI-produced content that you'd like to be revised to sound more human.",
          note: 'Note: Only English language content is supported.',
        },
      ],
      build: (v) => ({
        system:
          'You are an expert copywriter. Your task is to rewrite the provided article or blog post ' +
          'so that it is completely unique (plagiarism-free) and easily bypasses AI content detectors ' +
          '(like GPTZero, Copyleaks, Turnitin). Use advanced vocabulary, varied sentence structures, ' +
          'idioms, and natural transitions to make it sound human-authored. Maintain all key information ' +
          'and original intent, but change the phrasing completely. Output ONLY the rewritten article in clean Markdown.',
        user: v.content,
        maxTokens: 3000,
        temperature: 0.85,
      }),
      loading: {
        label: 'Rewriting your content',
        messages: [
          'Analyzing style patterns…',
          'Varying sentence complexity…',
          'Injecting human-like phrasing…',
          'Eliminating plagiarism markers…',
        ],
      },
      result: { title: 'Rewritten Article (AI Bypass)', filename: 'plagiarism-free-rewrite' },
    },
  },
  {
    id: 'rewrite-extreme-ai-bypass',
    name: 'Rewrite Article (Extreme AI Bypass)',
    description: 'Make AI Authored Articles Go Undetected with a Rewrite.',
    icon: EyeOff,
    config: {
      fields: [
        {
          name: 'content',
          label: 'Provide your Article/Blogpost or any other content to rewrite.',
          emoji: '🤖',
          type: 'textarea',
          required: true,
          requiredMsg: 'Please paste the content you want to rewrite.',
          placeholder: "Please paste the AI-produced content that you'd like to be revised to sound more human.",
          maxLength: 20000,
        },
      ],
      build: (v) => ({
        system:
          'You are a high-level language specialist. Rewrite the given text to make it extremely ' +
          'human-like and completely undetectable by any AI detectors. Use highly diverse sentence lengths, ' +
          'varying levels of perplexity and burstiness, informal phrasing, active voice, and subtle ' +
          'conversational style elements that AI models do not typically use. Preserve the core meaning ' +
          'but transform the vocabulary and style thoroughly. Output ONLY the rewritten text in clean Markdown.',
        user: v.content,
        maxTokens: 3500,
        temperature: 0.9,
      }),
      loading: {
        label: 'Generating extreme bypass text',
        messages: [
          'Injecting maximum linguistic variation…',
          'Bypassing advanced detectors…',
          'Randomizing sentence structure…',
          'Optimizing readability…',
        ],
      },
      result: { title: 'Rewritten Article (Extreme Bypass)', filename: 'extreme-bypass-rewrite' },
    },
  },
  {
    id: 'paraphrasing-content',
    name: 'Paraphrasing Content',
    description: 'Quickly transform your text into a new and unique form.',
    icon: RefreshCw,
    config: {
      fields: [
        {
          name: 'content',
          label: 'Enter the text you want to rewrite.',
          emoji: '✍️',
          type: 'textarea',
          required: true,
          requiredMsg: 'Please enter the text you want to paraphrase.',
          placeholder: 'Please provide the text you want to rephrase.',
        },
        {
          name: 'tone',
          label: 'How should the new version sound? (optional)',
          emoji: '🌟',
          type: 'text',
          required: false,
          placeholder: 'Please specify your desired tone and style. e.g., formal, fun, simple, Casual',
        },
      ],
      build: (v) => {
        const toneStr = v.tone ? v.tone.trim() : 'natural';
        return {
          system:
            `You are an expert editor. Paraphrase the user's text to express the exact same meaning ` +
            `in a completely new, unique, and fresh form. Swap key words with contextual synonyms, ` +
            `restructure clauses, and rewrite sections while keeping the message identical. ` +
            `Write in a tone that is: ${toneStr}. Output ONLY the paraphrased text in clean Markdown.`,
          user: v.content,
          maxTokens: 2500,
          temperature: 0.8,
        };
      },
      loading: {
        label: 'Paraphrasing your text',
        messages: [
          'Finding synonyms…',
          'Reordering phrases…',
          'Refining tone…',
          'Formatting output…',
        ],
      },
      result: { title: 'Paraphrased Content', filename: 'paraphrased' },
    },
  },
  {
    id: 'rewrite-article-standard',
    name: 'Rewrite Article',
    description: 'Experience Renewed Content Without Changing Original Context.',
    icon: FileText,
    config: {
      fields: [
        {
          name: 'content',
          label: 'Provide your Article/Blogpost or any other content to rewrite.',
          emoji: '🤖',
          type: 'textarea',
          required: true,
          requiredMsg: 'Please paste the content you want to rewrite.',
          placeholder: "Please paste the AI-produced content that you'd like to be revised to sound more human.",
          maxLength: 20000,
        },
        {
          name: 'instructions',
          label: 'Additional Instructions (optional)',
          emoji: '⚙️',
          type: 'text',
          required: false,
          placeholder: 'e.g. emphasize active voice, simplify vocabulary',
          advanced: true,
        },
      ],
      build: (v) => {
        const customInstructions = v.instructions
          ? `Adhere to these additional instructions closely: ${v.instructions.trim()}`
          : 'Refine clarity and sentence flow.';
        return {
          system:
            'You are a professional editor. Rewrite the provided article or text to improve clarity, ' +
            `flow, and engagement without changing the original context or meaning. Make it sound refreshed ` +
            `and renewed. ${customInstructions} Output ONLY the rewritten text in clean Markdown.`,
          user: v.content,
          maxTokens: 3000,
          temperature: 0.75,
        };
      },
      loading: {
        label: 'Rewriting text',
        messages: [
          'Polishing clarity…',
          'Improving flow…',
          'Aligning context…',
        ],
      },
      result: { title: 'Rewritten Article', filename: 'rewritten' },
    },
  },
];

// Registry-ready entries for the "Rewriting Tools" category.
export const REWRITING_TOOLS = DEFS.map((d) => ({
  id: d.id,
  name: d.name,
  description: d.description,
  category: 'Rewriting Tools',
  icon: d.icon,
  available: true,
  // eslint-disable-next-line react/display-name
  component: () => <FormTool config={{ icon: d.icon, title: d.name, description: d.description, ...d.config }} />,
}));
