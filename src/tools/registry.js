import { PenLine, FileText, Wand2, BookOpen } from 'lucide-react';
import BlogWriter from './BlogWriter.jsx';
import Summarizer from './Summarizer.jsx';
import TextHumanizer from './TextHumanizer.jsx';
import StorybookCreator from './StorybookCreator.jsx';

// ─────────────────────────────────────────────────────────────────────────────
// Tool registry
//
// Add a new tool by appending an entry here and pointing `component` at its
// React component. The sidebar, routing, and default selection all read from
// this list — no other wiring needed.
//
// `available: false` shows the tool in the sidebar as "Coming soon" (greyed out)
// until its component is built.
// ─────────────────────────────────────────────────────────────────────────────
export const TOOLS = [
  {
    id: 'blog-writer',
    name: 'Blog Writer',
    description: 'Easily create in-depth blog posts for any topic',
    category: 'Writing',
    icon: PenLine,
    component: BlogWriter,
    available: true,
  },
  {
    id: 'summarizer',
    name: 'AI Summarizer',
    description: 'Summarize transcripts, notes or any text',
    category: 'Productivity',
    icon: FileText,
    component: Summarizer,
    available: true,
  },
  {
    id: 'text-humanizer',
    name: 'Text Humanizer',
    description: 'Make AI-generated text sound natural and human',
    category: 'Writing',
    icon: Wand2,
    component: TextHumanizer,
    available: true,
  },
  {
    id: 'storybook-creator',
    name: 'Storybook Creator',
    description: 'Turn an idea into an illustrated story, page by page',
    category: 'Creative',
    icon: BookOpen,
    component: StorybookCreator,
    available: true,
  },
];

export const getTool = (id) => TOOLS.find((t) => t.id === id);
export const firstAvailableTool = () => TOOLS.find((t) => t.available) || TOOLS[0];
