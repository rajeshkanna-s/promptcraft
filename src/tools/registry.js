import { PenLine, FileText, Wand2, BookOpen } from 'lucide-react';
import BlogWriter from './BlogWriter.jsx';
import Summarizer from './Summarizer.jsx';
import TextHumanizer from './TextHumanizer.jsx';
import StorybookCreator from './StorybookCreator.jsx';
import { YOUTUBE_TOOLS } from './youtubeTools.jsx';
import { REWRITING_TOOLS } from './rewritingTools.jsx';
import { SEO_TOOLS } from './seoTools.jsx';
import { SOCIAL_MEDIA_TOOLS } from './socialMediaTools.jsx';
import { IDEA_TOOLS } from './ideaTools.jsx';
import { EDUCATION_TOOLS } from './educationTools.jsx';
import { SUPPORT_TOOLS } from './supportTools.jsx';
import { HR_TOOLS } from './hrTools.jsx';
import { IMAGE_TOOLS } from './imageTools.jsx';
import { ADVERTISING_TOOLS } from './advertisingTools.jsx';
import { CODE_TOOLS } from './codeTools.jsx';
import { MARKETING_TOOLS } from './marketingTools.jsx';
import { BOOK_WRITING_TOOLS } from './bookWritingTools.jsx';
import { WEB_CONTENT_TOOLS } from './webContentTools.jsx';

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
  // ── YouTube Tools (config-driven, see youtubeTools.jsx) ──
  ...YOUTUBE_TOOLS,
  // ── Rewriting Tools (config-driven, see rewritingTools.jsx) ──
  ...REWRITING_TOOLS,
  // ── SEO Tools (config-driven, see seoTools.jsx) ──
  ...SEO_TOOLS,
  // ── Social Media Tools (config-driven, see socialMediaTools.jsx) ──
  ...SOCIAL_MEDIA_TOOLS,
  // ── Idea Generation Tools (config-driven, see ideaTools.jsx) ──
  ...IDEA_TOOLS,
  // ── Education Tools (config-driven, see educationTools.jsx) ──
  ...EDUCATION_TOOLS,
  // ── Support Tools (config-driven, see supportTools.jsx) ──
  ...SUPPORT_TOOLS,
  // ── HR Tools (config-driven, see hrTools.jsx) ──
  ...HR_TOOLS,
  // ── Image Prompts (config-driven, see imageTools.jsx) ──
  ...IMAGE_TOOLS,
  // ── Advertising Tools (config-driven, see advertisingTools.jsx) ──
  ...ADVERTISING_TOOLS,
  // ── Code Tools (config-driven, see codeTools.jsx) ──
  ...CODE_TOOLS,
  // ── Marketing Tools (config-driven, see marketingTools.jsx) ──
  ...MARKETING_TOOLS,
  // ── Book Writing (config-driven, see bookWritingTools.jsx) ──
  ...BOOK_WRITING_TOOLS,
  // ── Website Content (config-driven, see webContentTools.jsx) ──
  ...WEB_CONTENT_TOOLS,
];

export const getTool = (id) => TOOLS.find((t) => t.id === id);
export const firstAvailableTool = () => TOOLS.find((t) => t.available) || TOOLS[0];
