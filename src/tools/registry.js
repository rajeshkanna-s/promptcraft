import {
  PenLine,
  FileText,
  Wand2,
  BookOpen,
  Calculator,
  QrCode,
  CaseSensitive,
  Type,
  AlignLeft,
  KeyRound,
  Binary,
  Braces,
  Palette,
  ImageDown,
  FileCode2,
  Fingerprint,
} from 'lucide-react';
import BlogWriter from './BlogWriter.jsx';
import Summarizer from './Summarizer.jsx';
import TextHumanizer from './TextHumanizer.jsx';
import StorybookCreator from './StorybookCreator.jsx';
import TokenCalculator from './TokenCalculator.jsx';
import QRCodeGenerator from './QRCodeGenerator.jsx';
import CaseConverter from './utilities/CaseConverter.jsx';
import WordCounter from './utilities/WordCounter.jsx';
import LoremIpsum from './utilities/LoremIpsum.jsx';
import PasswordGenerator from './utilities/PasswordGenerator.jsx';
import EncoderDecoder from './utilities/EncoderDecoder.jsx';
import JsonFormatter from './utilities/JsonFormatter.jsx';
import ColorPalette from './utilities/ColorPalette.jsx';
import ImageCompressor from './utilities/ImageCompressor.jsx';
import MarkdownConverter from './utilities/MarkdownConverter.jsx';
import UuidGenerator from './utilities/UuidGenerator.jsx';
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
import { WEBSITE_TOOLS } from './websiteTools.jsx';
import { EMAIL_TOOLS } from './emailTools.jsx';
import { CAREER_TOOLS } from './careerTools.jsx';
import { BUSINESS_TOOLS } from './businessTools.jsx';
import { STUDY_TOOLS } from './studyTools.jsx';
import { LANGUAGE_TOOLS } from './languageTools.jsx';

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
  // ── Website Builder (config-driven, see websiteTools.jsx) ──
  ...WEBSITE_TOOLS,
  // ── Email Tools (config-driven, see emailTools.jsx) ──
  ...EMAIL_TOOLS,
  // ── Career Tools (config-driven, see careerTools.jsx) ──
  ...CAREER_TOOLS,
  // ── Business Tools (config-driven, see businessTools.jsx) ──
  ...BUSINESS_TOOLS,
  // ── Study Tools (config-driven, see studyTools.jsx) ──
  ...STUDY_TOOLS,
  // ── Language Tools (config-driven, see languageTools.jsx) ──
  ...LANGUAGE_TOOLS,
  // ── Utilities (client-side, no AI) ──
  {
    id: 'token-calculator',
    name: 'Token Calculator',
    description: 'Estimate tokens, characters and words from pasted text or a .txt / .md file',
    category: 'Utilities',
    icon: Calculator,
    component: TokenCalculator,
    available: true,
  },
  {
    id: 'qr-code-generator',
    name: 'QR Code Generator',
    description: 'Turn any URL or text into a QR code and download it as PNG, JPG or PDF',
    category: 'Utilities',
    icon: QrCode,
    component: QRCodeGenerator,
    available: true,
  },
  {
    id: 'case-converter',
    name: 'Case Converter',
    description: 'Convert text to UPPERCASE, lowercase, Title Case, camelCase, snake_case and more',
    category: 'Utilities',
    icon: CaseSensitive,
    component: CaseConverter,
    available: true,
  },
  {
    id: 'word-counter',
    name: 'Word & Character Counter',
    description: 'Count words, characters, sentences, paragraphs and reading time in real time',
    category: 'Utilities',
    icon: Type,
    component: WordCounter,
    available: true,
  },
  {
    id: 'lorem-ipsum-generator',
    name: 'Lorem Ipsum Generator',
    description: 'Generate placeholder text — paragraphs, sentences or words — for mockups',
    category: 'Utilities',
    icon: AlignLeft,
    component: LoremIpsum,
    available: true,
  },
  {
    id: 'password-generator',
    name: 'Password Generator',
    description: 'Generate strong, random passwords securely in your browser',
    category: 'Utilities',
    icon: KeyRound,
    component: PasswordGenerator,
    available: true,
  },
  {
    id: 'base64-url-encoder',
    name: 'Base64 & URL Encoder / Decoder',
    description: 'Encode or decode text with Base64 or URL (percent) encoding, instantly',
    category: 'Utilities',
    icon: Binary,
    component: EncoderDecoder,
    available: true,
  },
  {
    id: 'json-formatter',
    name: 'JSON Formatter & Validator',
    description: 'Beautify, minify and validate JSON with clear error messages',
    category: 'Utilities',
    icon: Braces,
    component: JsonFormatter,
    available: true,
  },
  {
    id: 'color-palette-generator',
    name: 'Color Palette Generator',
    description: 'Generate beautiful color palettes and copy hex codes with one click',
    category: 'Utilities',
    icon: Palette,
    component: ColorPalette,
    available: true,
  },
  {
    id: 'image-compressor',
    name: 'Image Compressor & Resizer',
    description: 'Shrink and resize JPG, PNG or WebP images locally — no server upload',
    category: 'Utilities',
    icon: ImageDown,
    component: ImageCompressor,
    available: true,
  },
  {
    id: 'markdown-to-html',
    name: 'Markdown to HTML Converter',
    description: 'Convert Markdown to clean HTML with a live preview and copyable output',
    category: 'Utilities',
    icon: FileCode2,
    component: MarkdownConverter,
    available: true,
  },
  {
    id: 'uuid-generator',
    name: 'UUID Generator',
    description: 'Generate random version-4 UUIDs and copy them individually or all at once',
    category: 'Utilities',
    icon: Fingerprint,
    component: UuidGenerator,
    available: true,
  },
];

export const getTool = (id) => TOOLS.find((t) => t.id === id);
export const firstAvailableTool = () => TOOLS.find((t) => t.available) || TOOLS[0];
