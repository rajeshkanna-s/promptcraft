import {
  Youtube,
  Lightbulb,
  Tags,
  Film,
  Megaphone,
  Clock,
  ListVideo,
  LayoutGrid,
  Flame,
} from 'lucide-react';
import FormTool from './FormTool.jsx';
import { LANGUAGES } from './ToolShell.jsx';

// Reusable field presets.
const language = {
  name: 'language',
  label: 'Select Language',
  type: 'select',
  advanced: true,
  default: 'English',
  options: LANGUAGES,
};
const wordCount = {
  name: 'words',
  label: 'Word Count',
  type: 'select',
  default: '800',
  options: [
    { value: '300', label: '~300 words' },
    { value: '500', label: '~500 words' },
    { value: '800', label: '~800 words' },
    { value: '1200', label: '~1200 words' },
    { value: '1800', label: '~1800 words' },
    { value: '2500', label: '~2500 words' },
  ],
};

const wt = (v) => Math.min(8000, (Number(v) || 800) * 2 + 500); // word-count → token budget

// Each tool's definition (config drives the generic FormTool).
const DEFS = [
  {
    id: 'yt-script-creator',
    name: 'Youtube Script Creator',
    description: 'Save time and effort by generating captivating YouTube scripts instantly.',
    icon: Youtube,
    config: {
      fields: [
        {
          name: 'topic',
          label: 'Enter your video topic & the points you want to cover?',
          emoji: '🎬',
          type: 'textarea',
          rows: 5,
          required: true,
          requiredMsg: 'Please enter your video topic.',
          placeholder: 'Video topic, what your audience is looking for, points you want to cover.',
        },
        wordCount,
        language,
      ],
      build: (v) => ({
        system:
          `You are an expert YouTube scriptwriter. Write a captivating, engaging YouTube video ` +
          `script of about ${v.words} words in ${v.language}. Include a strong hook in the first ` +
          `lines, a brief intro, well-structured sections covering the key points, [visual / ` +
          `b-roll cues in brackets], and a clear call to action. Use clean Markdown with headings.`,
        user: v.topic,
        maxTokens: wt(v.words),
      }),
      loading: { label: 'Writing your script', messages: ['Hooking the viewer…', 'Structuring sections…', 'Adding b-roll cues…', 'Wrapping with a CTA…'] },
      result: { title: 'Your YouTube script', filename: 'yt-script' },
    },
  },
  {
    id: 'yt-title-thumbnail',
    name: 'Title & Thumbnail Ideas',
    description: 'Boost your YouTube views with top-notch video title suggestions.',
    icon: Lightbulb,
    config: {
      fields: [
        {
          name: 'keywords',
          label: 'Enter your keyword(s)',
          emoji: '🔑',
          type: 'textarea',
          rows: 4,
          required: true,
          requiredMsg: 'Please enter at least one keyword.',
          placeholder: 'e.g. budget travel, packing tips, solo trip',
        },
        language,
      ],
      build: (v) => ({
        system:
          `You are a YouTube growth expert. In ${v.language}, generate 10 catchy, high-CTR video ` +
          `title ideas and 5 thumbnail concepts (each with bold on-screen text + a short visual ` +
          `description). Use Markdown with "## Titles" and "## Thumbnail Ideas" sections.`,
        user: `Keywords: ${v.keywords}`,
        maxTokens: 1500,
        temperature: 0.9,
      }),
      loading: { label: 'Brainstorming titles', messages: ['Studying the keywords…', 'Maximizing click-through…', 'Sketching thumbnails…'] },
      result: { title: 'Titles & thumbnail ideas', filename: 'yt-titles' },
    },
  },
  {
    id: 'yt-description-tags',
    name: 'Description & Tags',
    description: 'Boost your YouTube video views with optimized descriptions and tags.',
    icon: Tags,
    config: {
      fields: [
        {
          name: 'script',
          label: 'Enter your video script.',
          emoji: '📝',
          type: 'textarea',
          rows: 7,
          required: true,
          requiredMsg: 'Please paste your video script.',
          placeholder: 'Please paste your video script here',
        },
        language,
      ],
      build: (v) => ({
        system:
          `You are a YouTube SEO expert. From the video script, in ${v.language}, write: an ` +
          `optimized description (compelling first 2 lines, a concise summary, suggested ` +
          `timestamps if inferable, and relevant hashtags) and a list of ~20 SEO tags (comma ` +
          `separated). Use Markdown with "## Description" and "## Tags" sections.`,
        user: v.script,
        maxTokens: 2000,
      }),
      loading: { label: 'Optimizing for search', messages: ['Reading the script…', 'Writing the description…', 'Picking SEO tags…'] },
      result: { title: 'Description & tags', filename: 'yt-description-tags' },
    },
  },
  {
    id: 'yt-shorts-reels',
    name: 'Shorts & Reels Script Creator',
    description: 'Turn your video transcript or ideas into engaging Shorts & Reels script.',
    icon: Film,
    config: {
      fields: [
        {
          name: 'points',
          label: 'Please enter the key points or video transcript details',
          type: 'textarea',
          rows: 5,
          required: true,
          requiredMsg: 'Please enter your key points or transcript.',
          placeholder: 'I want to talk about idea1, idea 2...',
        },
        language,
      ],
      build: (v) => ({
        system:
          `You are a short-form video scriptwriter. In ${v.language}, turn the key points into an ` +
          `engaging 30-60 second Shorts/Reels script with a scroll-stopping hook in the first ` +
          `line, punchy spoken lines, [on-screen text cues in brackets], and a strong CTA. ` +
          `Use Markdown.`,
        user: v.points,
        maxTokens: 1500,
        temperature: 0.9,
      }),
      loading: { label: 'Scripting your short', messages: ['Crafting the hook…', 'Tightening the pacing…', 'Adding text cues…'] },
      result: { title: 'Shorts / Reels script', filename: 'shorts-script' },
    },
  },
  {
    id: 'yt-explainer',
    name: 'Explainer Video Script',
    description: 'Engage your audience with impactful voiceover scripts for your videos.',
    icon: Megaphone,
    config: {
      fields: [
        {
          name: 'product',
          label: 'Describe your Product / Service',
          type: 'textarea',
          rows: 4,
          required: true,
          requiredMsg: 'Please describe your product or service.',
          placeholder: 'What are you promoting, who are you targeting, and what is the main benefit?',
        },
        { name: 'minWords', label: 'Minimum words', type: 'number', placeholder: 'e.g. 150', default: '150' },
        { name: 'maxWords', label: 'Maximum words', type: 'number', placeholder: 'e.g. 300', default: '300' },
        language,
      ],
      build: (v) => ({
        system:
          `You are a voiceover scriptwriter for explainer videos. In ${v.language}, write a ` +
          `compelling explainer voiceover script of ${v.minWords || 150}-${v.maxWords || 300} ` +
          `words that opens with a hook, frames the problem, presents the product/service as the ` +
          `solution, highlights key benefits, and closes with a strong call to action. Use a ` +
          `natural, spoken tone. Markdown.`,
        user: v.product,
        maxTokens: Math.min(4000, (Number(v.maxWords) || 300) * 3 + 400),
      }),
      loading: { label: 'Writing your voiceover', messages: ['Framing the problem…', 'Presenting the solution…', 'Polishing the CTA…'] },
      result: { title: 'Explainer video script', filename: 'explainer-script' },
    },
  },
  {
    id: 'yt-timestamps',
    name: 'Timestamps',
    description: 'Find key points instantly with highlighted timestamps.',
    icon: Clock,
    config: {
      fields: [
        {
          name: 'script',
          label: 'Enter your video script with timestamps.',
          emoji: '🕘',
          type: 'textarea',
          rows: 8,
          required: true,
          requiredMsg: 'Please paste your transcript.',
          maxLength: 10000,
          placeholder: 'Paste your transcript (ideally with timestamps) here…',
        },
      ],
      build: (v) => ({
        system:
          'You are a YouTube editor. From the transcript, identify the key chapter points and ' +
          'output YouTube chapter timestamps in "mm:ss — Title" format, starting at 00:00. If the ' +
          'transcript already contains times, use them; otherwise estimate evenly across the ' +
          'content. Output a clean Markdown list only.',
        user: v.script,
        maxTokens: 1200,
        temperature: 0.4,
      }),
      loading: { label: 'Finding key moments', messages: ['Scanning the transcript…', 'Marking chapters…', 'Formatting timestamps…'] },
      result: { title: 'Chapter timestamps', filename: 'timestamps' },
    },
  },
  {
    id: 'yt-idea-planner',
    name: 'YT Idea & Content Planner',
    description: 'Save time and generate relevant video ideas effortlessly.',
    icon: ListVideo,
    config: {
      fields: [
        {
          name: 'niche',
          label: 'What is the specific niche you want to create YouTube videos for?',
          emoji: '🔍',
          type: 'text',
          required: true,
          requiredMsg: 'Please enter your niche.',
          placeholder: 'e.g. Cooking, Travel, Fitness, Photography...',
        },
        language,
      ],
      build: (v) => ({
        system:
          `You are a YouTube content strategist. For the given niche, in ${v.language}, create a ` +
          `content plan in Markdown: "## Video Ideas" (10 ideas, each with a one-line angle), ` +
          `"## Suggested Series / Playlists", and "## Talking Points" outlining the top 3 ideas.`,
        user: `Niche: ${v.niche}`,
        maxTokens: 2500,
        temperature: 0.9,
      }),
      loading: { label: 'Planning your content', messages: ['Exploring the niche…', 'Generating ideas…', 'Outlining talking points…'] },
      result: { title: 'Content plan', filename: 'content-plan' },
    },
  },
  {
    id: 'yt-all-in-one',
    name: 'All-in-One YT Content',
    description: 'Simplify YouTube content creation process with one tool.',
    icon: LayoutGrid,
    config: {
      fields: [
        {
          name: 'topic',
          label: 'Enter your video topic & the points you want to cover?',
          emoji: '🎥',
          type: 'textarea',
          rows: 5,
          required: true,
          requiredMsg: 'Please enter your video topic.',
          placeholder: 'Video topic, what your audience is looking for, points you want to cover.',
        },
        wordCount,
        language,
      ],
      build: (v) => ({
        system:
          `You are a full-stack YouTube content creator. For the given topic, in ${v.language}, ` +
          `produce a complete package in Markdown with these sections: "## Titles" (5 options), ` +
          `"## Script" (a full ~${v.words}-word script with hook, sections, [visual cues] and a ` +
          `CTA), "## Description" (SEO-optimized), and "## Tags" (~15 comma-separated tags).`,
        user: v.topic,
        maxTokens: wt(v.words) + 800,
      }),
      loading: { label: 'Creating everything', messages: ['Drafting titles…', 'Writing the script…', 'Optimizing description…', 'Picking tags…'] },
      result: { title: 'All-in-one YT content', filename: 'yt-all-in-one' },
    },
  },
  {
    id: 'yt-viral-shorts',
    name: 'Viral Shorts/Reels Script',
    description: 'Turn the latest info into a viral, share-worthy short-form script.',
    icon: Flame,
    config: {
      fields: [
        {
          name: 'info',
          label: "What's the latest information you've found out about your topic?",
          type: 'textarea',
          rows: 5,
          required: true,
          requiredMsg: 'Please share the info about your topic.',
          placeholder: 'Please share the info you have found about your topic.',
        },
        language,
      ],
      build: (v) => ({
        system:
          `You are a viral short-form video expert. Using the latest info provided, in ` +
          `${v.language}, write a highly shareable, viral-style Shorts/Reels script with an ` +
          `irresistible 1-second hook, fast punchy pacing, pattern interrupts, [on-screen text ` +
          `cues in brackets], and a CTA that drives shares and follows. Use Markdown.`,
        user: v.info,
        maxTokens: 1600,
        temperature: 0.95,
      }),
      loading: { label: 'Going viral', messages: ['Crafting the 1-second hook…', 'Adding pattern interrupts…', 'Driving the CTA…'] },
      result: { title: 'Viral short script', filename: 'viral-short' },
    },
  },
];

// Registry-ready entries for the "YouTube Tools" category.
export const YOUTUBE_TOOLS = DEFS.map((d) => ({
  id: d.id,
  name: d.name,
  description: d.description,
  category: 'YouTube Tools',
  icon: d.icon,
  available: true,
  // eslint-disable-next-line react/display-name
  component: () => <FormTool config={{ icon: d.icon, title: d.name, description: d.description, ...d.config }} />,
}));
