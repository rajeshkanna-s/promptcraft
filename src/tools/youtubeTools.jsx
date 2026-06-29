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
  Award,
  Package,
  Briefcase,
  Image,
  Mic,
  Users,
  FileText,
  Play,
  Smile,
  List,
  HelpCircle,
  Video
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
    name: 'Script for YouTube Video',
    description: 'This tool will help you generate a captivating and engaging YouTube video script based on a title and provided talking points.',
    icon: Youtube,
    config: {
      fields: [
        {
          name: 'title',
          label: 'What is your YouTube Video title?',
          emoji: '🎬',
          type: 'text',
          required: true,
          requiredMsg: 'Please enter your video title.',
          placeholder: 'e.g., 10 Ways to Improve Your Mental Health',
        },
        {
          name: 'keyPoints',
          label: 'Key Points (optional)',
          emoji: '📝',
          type: 'textarea',
          rows: 4,
          placeholder: 'Please list the main topics for your video. e.g., Introduction, Product Features etc...',
        },
        {
          name: 'audience',
          label: 'Who is your target audience for your video? (optional)',
          emoji: '👥',
          type: 'text',
          placeholder: 'Please specify your intended viewer group. e.g., Young adults, Working professionals',
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
        user: `Video Title: ${v.title}\n` +
          (v.keyPoints ? `Key Points: ${v.keyPoints}\n` : '') +
          (v.audience ? `Target Audience: ${v.audience}\n` : ''),
        maxTokens: wt(v.words),
      }),
      loading: { label: 'Writing your script', messages: ['Hooking the viewer…', 'Structuring sections…', 'Adding b-roll cues…', 'Wrapping with a CTA…'] },
      result: { title: 'Your YouTube script', filename: 'yt-script' },
    },
  },
  {
    id: 'yt-tag-generator',
    name: 'Youtube Tag Generator',
    description: 'Let our AI tool do the work for you by generating SEO-friendly tags for your YouTube Shorts/videos in any language.',
    icon: Tags,
    config: {
      fields: [
        {
          name: 'script',
          label: 'Enter your video script.',
          emoji: '🏷️',
          type: 'textarea',
          rows: 6,
          required: true,
          requiredMsg: 'Please paste your video script.',
          placeholder: 'Please paste your video script here',
        },
        language,
      ],
      build: (v) => ({
        system:
          `You are a YouTube SEO expert. In ${v.language}, generate a comma-separated list of ` +
          `about 20 highly relevant, SEO-optimized tags and keywords for a YouTube video based on ` +
          `the provided script. Output ONLY the tags as a comma-separated list, with no preamble, ` +
          `no markdown formatting, and no explanation.`,
        user: v.script,
        maxTokens: 1000,
        temperature: 0.5,
      }),
      loading: { label: 'Generating tags', messages: ['Reading script…', 'Extracting keywords…', 'Formatting tags…'] },
      result: { title: 'Generated Tags', filename: 'yt-tags' },
    },
  },
  {
    id: 'yt-video-intro-creator',
    name: 'Video Intro Script Creator',
    description: 'This tool crafts compelling and suspenseful introductions for your YouTube videos, ensuring your audience is immediately hooked and eager to keep watching.',
    icon: Video,
    config: {
      fields: [
        {
          name: 'title',
          label: 'What is your YouTube Video title?',
          emoji: '🎬',
          type: 'text',
          required: true,
          requiredMsg: 'Please enter your video title.',
          placeholder: 'e.g., 10 Ways to Improve Your Mental Health',
        },
        language,
      ],
      build: (v) => ({
        system:
          `You are an expert YouTube intro writer. In ${v.language}, write 3 alternative, highly compelling ` +
          `and suspenseful introduction script options (hooks) for a YouTube video based on the title. ` +
          `Each intro option should be around 50-100 words, use pattern interrupts or curious questions, ` +
          `and establish a powerful hook. Use clean Markdown with "## Intro Option 1", "## Intro Option 2", ` +
          `and "## Intro Option 3" headings.`,
        user: `Video Title: ${v.title}`,
        maxTokens: 1200,
        temperature: 0.85,
      }),
      loading: { label: 'Crafting introductions', messages: ['Analyzing title…', 'Drafting hooks…', 'Building suspense…'] },
      result: { title: 'Video Intro Options', filename: 'yt-intros' },
    },
  },
  {
    id: 'yt-branding',
    name: 'YouTube Branding',
    description: 'Get unique branding for your YouTube channel with our tool. Receive name suggestions, topic ideas, and logo inspiration by answering a few simple questions.',
    icon: Award,
    config: {
      fields: [
        {
          name: 'channelName',
          label: 'Channel Name (optional)',
          emoji: '🏷️',
          type: 'text',
          placeholder: 'Channel Name if any',
        },
        {
          name: 'topics',
          label: 'What topics do you love and want to share on your YouTube channel?',
          emoji: '❤️',
          type: 'textarea',
          rows: 3,
          required: true,
          requiredMsg: 'Please specify the topics you want to share.',
          placeholder: 'e.g., Food, Travel, Tech, Beauty, Gaming etc...',
        },
        {
          name: 'audience',
          label: 'Who do you want to watch your videos? (Target Audience)',
          emoji: '👥',
          type: 'textarea',
          rows: 3,
          required: true,
          requiredMsg: 'Please specify your target audience.',
          placeholder: 'e.g., Teens, Working Professionals, Parents etc...',
        },
        {
          name: 'videoType',
          label: 'What kind of videos do you want to make?',
          emoji: '🎥',
          type: 'textarea',
          rows: 3,
          required: true,
          requiredMsg: 'Please describe the kind of videos you plan to make.',
          placeholder: 'e.g., How-to guides, fun vlogs, educational tutorials, reviews, etc...',
        },
        {
          name: 'tone',
          label: 'How do you want your channel to feel? (Tone & Style)',
          emoji: '✨',
          type: 'textarea',
          rows: 3,
          required: true,
          requiredMsg: 'Please specify the tone and style.',
          placeholder: 'e.g., Fun and casual, warm and serious, or inspirational etc...',
        },
        language,
      ],
      build: (v) => ({
        system:
          `You are an expert branding consultant and YouTube channel strategist. In ${v.language}, ` +
          `generate a complete YouTube branding kit in Markdown. Provide:\n` +
          `- "## Channel Name Suggestions" (5 creative names, especially if the user didn't specify one, or variations if they did)\n` +
          `- "## Content Niches & Topic Ideas"\n` +
          `- "## Logo & Visual Identity Design Inspiration" (describing themes, color palettes, and imagery)\n` +
          `- "## Tone of Voice & Style Guidelines"`,
        user: `Proposed Channel Name: ${v.channelName || 'Not specified'}\n` +
          `Topics: ${v.topics}\n` +
          `Target Audience: ${v.audience}\n` +
          `Video Types: ${v.videoType}\n` +
          `Channel Tone: ${v.tone}`,
        maxTokens: 2500,
        temperature: 0.9,
      }),
      loading: { label: 'Generating branding kit', messages: ['Designing names…', 'Exploring topic niches…', 'Brainstorming logo themes…', 'Defining brand voice…'] },
      result: { title: 'YouTube Branding Kit', filename: 'yt-branding' },
    },
  },
  {
    id: 'yt-content-package',
    name: 'YouTube Content Package',
    description: "Streamline your YouTube creation process with our All-in-One YouTube Content tool. From generating engaging video titles and descriptions to selecting the right tags and hashtags, this tool enhances your video's visibility.",
    icon: Package,
    config: {
      fields: [
        {
          name: 'topic',
          label: 'Enter the topic of your video',
          emoji: '🎬',
          type: 'text',
          required: true,
          requiredMsg: 'Please enter your video topic.',
          placeholder: 'e.g., How to sign up for WordPress',
        },
        {
          name: 'keyPoints',
          label: "Are there any specific points you'd like to cover? (Optional)",
          emoji: '📝',
          type: 'textarea',
          rows: 4,
          placeholder: 'e.g., keyword, dialogue, points',
        },
        language,
      ],
      build: (v) => ({
        system:
          `You are a professional YouTube SEO and content creation specialist. In ${v.language}, ` +
          `generate a complete content package in Markdown. It must include:\n` +
          `- "## Catchy Video Titles" (5 options)\n` +
          `- "## SEO Description" (with a compelling intro, summary, and keywords)\n` +
          `- "## Tags & Hashtags" (15 SEO tags and 5 relevant hashtags)\n` +
          `- "## Core Script Talking Points" (bulleted content segments to guide recording)`,
        user: `Video Topic: ${v.topic}\n` +
          (v.keyPoints ? `Specific Points/Keywords: ${v.keyPoints}` : ''),
        maxTokens: 2500,
        temperature: 0.8,
      }),
      loading: { label: 'Creating package', messages: ['Drafting titles…', 'Optimizing SEO description…', 'Extracting tags…', 'Outlining talking points…'] },
      result: { title: 'YouTube Content Package', filename: 'yt-content-package' },
    },
  },
  {
    id: 'yt-video-marketing-script',
    name: 'Video Marketing Script Collection',
    description: 'Generate customized video scripts for your business in minutes with our easy-to-use Video Marketing Script Collection tool.',
    icon: Briefcase,
    config: {
      fields: [
        {
          name: 'hasWebsite',
          label: 'Already have a Website?',
          emoji: '🌐',
          type: 'select',
          default: 'No',
          options: ['No', 'Yes'],
        },
        {
          name: 'companyName',
          label: 'Company Name',
          emoji: '🏢',
          type: 'text',
          required: true,
          requiredMsg: 'Please enter your company name.',
          placeholder: 'Enter your company name',
        },
        {
          name: 'businessDetails',
          label: 'What are the key details about your business?',
          emoji: '📝',
          type: 'textarea',
          rows: 4,
          required: true,
          requiredMsg: 'Please describe your business.',
          placeholder: 'Please give a brief description of your business, e.g., values, USP, contact info etc...',
        },
        {
          name: 'productDetails',
          label: 'Any specific product or service you are looking to promote?',
          emoji: '🚀',
          type: 'textarea',
          rows: 4,
          required: true,
          requiredMsg: 'Please specify the product or service details.',
          placeholder: 'Detail the product or service features, price, value proposition...',
        },
        {
          name: 'idealCustomer',
          label: 'Who is your ideal customer?',
          emoji: '🎯',
          type: 'textarea',
          rows: 3,
          required: true,
          requiredMsg: 'Please specify your ideal customer.',
          placeholder: 'e.g., Small business owners, busy moms, college students...',
        },
        {
          name: 'cta',
          label: 'How should viewers be prompted to buy or use your product/service?',
          emoji: '📣',
          type: 'textarea',
          rows: 3,
          required: true,
          requiredMsg: 'Please enter the call to action.',
          placeholder: 'e.g., Click the link in description, visit our website, sign up for free trial...',
        },
        language,
      ],
      build: (v) => ({
        system:
          `You are a top-tier product marketer and ad copywriter. In ${v.language}, write a ` +
          `collection of 3 customized video marketing scripts for the business. Use clean Markdown ` +
          `with headings for each script, including visual/b-roll cues in brackets and spoken voiceover:\n` +
          `- "## Script 1: 30-Second Explainer Script" (Fast, punchy, problem-solution focus)\n` +
          `- "## Script 2: 60-Second Feature/Benefit Script" (Focusing on benefits, USP, and value)\n` +
          `- "## Script 3: Problem-focused Ad Script" (Resonating with the target audience's core struggle)`,
        user: `Company Name: ${v.companyName}\n` +
          `Has Website: ${v.hasWebsite}\n` +
          `Business Details: ${v.businessDetails}\n` +
          `Product/Service to Promote: ${v.productDetails}\n` +
          `Ideal Customer: ${v.idealCustomer}\n` +
          `Call to Action (CTA): ${v.cta}`,
        maxTokens: 2500,
        temperature: 0.8,
      }),
      loading: { label: 'Generating scripts', messages: ['Studying business profile…', 'Scripting 30s explainer…', 'Scripting 60s benefit video…', 'Adding marketing hooks…'] },
      result: { title: 'Marketing Script Collection', filename: 'marketing-scripts' },
    },
  },
  {
    id: 'yt-image-prompts-generator',
    name: 'YouTube Image Prompts Generator',
    description: 'This tool helps you quickly generate engaging YouTube thumbnail prompts that appeal to young audiences, complete with fun design ideas and attention-grabbing visuals.',
    icon: Image,
    config: {
      fields: [
        {
          name: 'channelName',
          label: 'Channel Name (optional)',
          emoji: '🏷️',
          type: 'text',
          placeholder: 'e.g., TechTips',
        },
        {
          name: 'title',
          label: 'What is your YouTube Video title?',
          emoji: '🎬',
          type: 'text',
          required: true,
          requiredMsg: 'Please enter your video title.',
          placeholder: 'e.g., 10 Ways to Improve Your Mental Health',
        },
        language,
      ],
      build: (v) => ({
        system:
          `You are a graphic designer and YouTube thumbnail strategist. In ${v.language}, generate 5 ` +
          `distinct, engaging thumbnail concepts appealing to young audiences. For each concept, write:\n` +
          `- "### Concept [N]"\n` +
          `- "Visual Layout": (Describe colors, contrast, character faces, facial expressions, and focal points)\n` +
          `- "Text Overlay": (Vibrant, high-impact text of 1-3 words)\n` +
          `- "AI Image Generator Prompt": (A ready-to-use English prompt optimized for tools like Midjourney or DALL-E, including keywords like "high contrast", "cinematic lighting", and "crisp details")`,
        user: `Channel Name: ${v.channelName || 'Not specified'}\n` +
          `Video Title: ${v.title}`,
        maxTokens: 2000,
        temperature: 0.85,
      }),
      loading: { label: 'Generating image prompts', messages: ['Designing layouts…', 'Writing text overlays…', 'Constructing AI prompts…'] },
      result: { title: 'Thumbnail Image Prompts', filename: 'thumbnail-prompts' },
    },
  },
  {
    id: 'yt-script-podcasting',
    name: 'Script for Podcasting',
    description: 'Create Podcast Scripts That Your Audiences Will Love by structuring content that resonates with your audience and aligns with your chosen format.',
    icon: Mic,
    config: {
      fields: [
        {
          name: 'topic',
          label: "What's the main topic of your podcast episode?",
          emoji: '🎙️',
          type: 'text',
          required: true,
          requiredMsg: 'Please enter the podcast topic.',
          placeholder: 'e.g., Cooking tutorial, Gaming walkthrough, Book review etc...',
        },
        {
          name: 'keyPoints',
          label: 'Could you list the key points or highlights you want to cover? (optional)',
          emoji: '📝',
          type: 'textarea',
          rows: 4,
          placeholder: 'Key ideas, bullet points or interview questions...',
        },
        {
          name: 'format',
          label: "What's the format of your podcast?",
          emoji: '⚡',
          type: 'select',
          default: 'Solo',
          options: ['Solo', 'Guest Interview', 'Storytelling', 'Panel Discussion', 'Conversation', 'Co-hosted'],
        },
        {
          name: 'audience',
          label: 'Who is your Target Audience?',
          emoji: '👥',
          type: 'text',
          required: true,
          requiredMsg: 'Please enter your target audience.',
          placeholder: 'e.g., Tech enthusiasts, book lovers, young parents',
        },
        language,
      ],
      build: (v) => ({
        system:
          `You are an expert podcast producer. In ${v.language}, write a comprehensive and structured ` +
          `podcast episode outline and script guide matching a "${v.format}" format. Organize in Markdown:\n` +
          `- "## Episode Intro": (Intro hook, welcoming the audience, stating value and sponsors if any)\n` +
          `- "## Main Conversation Outlines": (3 structured sub-segments with guiding questions or topics)\n` +
          `- "## Interactive Elements / Questions"\n` +
          `- "## Episode Outro & Call to Action" (reviews, social follows, next episode teaser)`,
        user: `Topic: ${v.topic}\n` +
          `Format: ${v.format}\n` +
          `Key Points: ${v.keyPoints || 'Not specified'}\n` +
          `Audience: ${v.audience}`,
        maxTokens: 2500,
        temperature: 0.8,
      }),
      loading: { label: 'Scripting podcast', messages: ['Writing intro hook…', 'Outlining discussion segments…', 'Formatting script…'] },
      result: { title: 'Podcast Episode Script', filename: 'podcast-script' },
    },
  },
  {
    id: 'yt-audience-analysis',
    name: 'YouTube Audience Analysis',
    description: "Know Your YouTube Viewers Better. This tool analyzes video titles to provide detailed insights about the potential audience, including their characteristics, situations, and goals.",
    icon: Users,
    config: {
      fields: [
        {
          name: 'title',
          label: 'What is the Topic or Title of your YouTube Video?',
          emoji: '🎬',
          type: 'text',
          required: true,
          requiredMsg: 'Please enter the video title/topic.',
          placeholder: 'e.g., 10 Ways to Improve Your Mental Health',
        },
        language,
      ],
      build: (v) => ({
        system:
          `You are an expert audience strategist. In ${v.language}, analyze the potential viewer base ` +
          `for a YouTube video with the given title. Provide a comprehensive report in Markdown:\n` +
          `- "## Target Demographics" (age group, interests, occupations, behavioral patterns)\n` +
          `- "## Core Pain Points & Challenges" (what are they struggling with related to this title)\n` +
          `- "## Audience Goals & Goals of Watching" (what do they hope to learn or achieve)\n` +
          `- "## Recommendations for the Creator" (video tone, pacing, thumbnail hooks, CTAs to use)`,
        user: `Video Title: ${v.title}`,
        maxTokens: 2000,
        temperature: 0.75,
      }),
      loading: { label: 'Analyzing audience', messages: ['Studying demographics…', 'Mapping viewer struggles…', 'Formulating strategies…'] },
      result: { title: 'Audience Analysis Report', filename: 'audience-analysis' },
    },
  },
  {
    id: 'yt-script-generator',
    name: 'YT Script Generator',
    description: 'This tool helps YouTube creators craft detailed, engaging, and audience-focused video scripts for specific parts of their video outline, saving time and ensuring polished content.',
    icon: FileText,
    config: {
      fields: [
        {
          name: 'title',
          label: 'What is your YouTube Video title?',
          emoji: '🎬',
          type: 'text',
          required: true,
          requiredMsg: 'Please enter the video title.',
          placeholder: 'e.g., 10 Ways to Improve Your Mental Health',
        },
        {
          name: 'outline',
          label: 'Enter the complete script outline for your video',
          emoji: '📋',
          type: 'textarea',
          rows: 4,
          required: true,
          requiredMsg: 'Please enter the video outline.',
          placeholder: 'e.g., Intro, Section 1: Time Management, Section 2: Building Habits, Outro',
        },
        {
          name: 'introScript',
          label: 'Can you share your intro script for the video? (optional)',
          emoji: '🎙️',
          type: 'textarea',
          rows: 3,
          placeholder: 'Paste your intro script here if any...',
        },
        {
          name: 'keyStats',
          label: 'Can you share any information, key stats, research data or facts about your video topic? (optional)',
          emoji: '📊',
          type: 'textarea',
          rows: 3,
          placeholder: 'Provide the important information, facts, statistics, or trends...',
        },
        language,
      ],
      build: (v) => ({
        system:
          `You are a professional YouTube scriptwriter. In ${v.language}, write a highly engaging, ` +
          `detailed video script following the outline. Weave in the provided key stats and research ` +
          `data seamlessly. Format with spoken narration, b-roll/visual instructions in brackets ` +
          `[like this], and neat Markdown headers for outline chapters.`,
        user: `Video Title: ${v.title}\n` +
          `Outline: ${v.outline}\n` +
          `Intro Script: ${v.introScript || 'None'}\n` +
          `Stats & Facts: ${v.keyStats || 'None'}`,
        maxTokens: 3000,
        temperature: 0.8,
      }),
      loading: { label: 'Generating script', messages: ['Integrating facts & data…', 'Drafting dialogue…', 'Structuring script blocks…', 'Adding visual cues…'] },
      result: { title: 'YouTube Script Segment', filename: 'yt-script-generator' },
    },
  },
  {
    id: 'yt-hook-intro-maker',
    name: 'YT Hook & Intro Maker',
    description: "This tool helps you craft compelling YouTube intro scripts that hook your audience, clearly convey the video's value, and keep viewers engaged right from the start.",
    icon: Play,
    config: {
      fields: [
        {
          name: 'title',
          label: 'What is the Topic or Title of your YouTube Video?',
          emoji: '🎬',
          type: 'text',
          required: true,
          requiredMsg: 'Please enter the video title/topic.',
          placeholder: 'e.g., 10 Ways to Improve Your Mental Health',
        },
        {
          name: 'challenges',
          label: 'What challenges does your audience face, and how does your video help them succeed?',
          emoji: '🧩',
          type: 'textarea',
          rows: 4,
          required: true,
          requiredMsg: 'Please specify the audience challenges.',
          placeholder: 'e.g., Difficulty managing time, lack of confidence, etc.',
        },
        {
          name: 'keyStats',
          label: 'Can you share any information, key stats, research data or facts about your video topic? (optional)',
          emoji: '📊',
          type: 'textarea',
          rows: 4,
          placeholder: 'Provide the important information, facts, statistics, or trends about your video topic.',
        },
        language,
      ],
      build: (v) => ({
        system:
          `You are an expert video copywriter specializing in YouTube hooks. In ${v.language}, craft 3 ` +
          `compelling intro scripts (each about 45-60 seconds when spoken) that hook the audience. ` +
          `For each option, provide: a powerful opening line (first 5 seconds), value statement (why watch), ` +
          `and brief overview of what they will learn. Use headings:\n` +
          `- "## Option 1: Problem-Solution Hook" (Emphasize target challenges)\n` +
          `- "## Option 2: Statistic & Fact Hook" (Use the stats/data provided to create curiosity)\n` +
          `- "## Option 3: Storyteller / Vision Hook" (Create visual suspense)`,
        user: `Video Title: ${v.title}\n` +
          `Challenges: ${v.challenges}\n` +
          `Key Stats/Data: ${v.keyStats || 'None'}`,
        maxTokens: 1500,
        temperature: 0.85,
      }),
      loading: { label: 'Creating hooks', messages: ['Analyzing audience challenge…', 'Drafting hook variations…', 'Polishing intros…'] },
      result: { title: 'YouTube Hook & Intro Scripts', filename: 'yt-hooks' },
    },
  },
  {
    id: 'yt-funny-short-generator',
    name: 'Funny Short Script Generator',
    description: 'This tool helps you craft funny, engaging YouTube Shorts scripts by generating witty, fast-paced skits based on your chosen scenario, making it perfect for content creators looking to entertain their audience in a matter of minutes.',
    icon: Smile,
    config: {
      fields: [
        {
          name: 'situation',
          label: "What's the main situation or scenario?",
          emoji: '🎭',
          type: 'textarea',
          rows: 3,
          required: true,
          requiredMsg: 'Please describe the skit scenario.',
          placeholder: 'e.g., A job interview gone wrong, an awkward first date, etc.',
        },
        language,
      ],
      build: (v) => ({
        system:
          `You are a comedy writer and script producer. In ${v.language}, write a funny, fast-paced 30-60 ` +
          `second YouTube Shorts skit script. The script should feature 1-2 characters, quick-fire ` +
          `dialogue, sharp comedic timing, pattern interrupts, and visual actions described in brackets ` +
          `[like this]. End with a comedic twist or punchline and a CTA to subscribe. Use Markdown.`,
        user: `Scenario/Situation: ${v.situation}`,
        maxTokens: 1500,
        temperature: 0.95,
      }),
      loading: { label: 'Scripting skit', messages: ['Finding comedic angle…', 'Writing fast-paced dialogue…', 'Adding punchline…'] },
      result: { title: 'Funny Short Script', filename: 'funny-shorts-script' },
    },
  },
  {
    id: 'yt-script-outline-generator',
    name: 'YT Script Outline Generator',
    description: 'This tool helps YouTubers create detailed, engaging, and well-structured script outlines based on their video topic, making content creation faster and more effective.',
    icon: List,
    config: {
      fields: [
        {
          name: 'title',
          label: 'What is the Topic or Title of your YouTube Video?',
          emoji: '🎬',
          type: 'text',
          required: true,
          requiredMsg: 'Please enter the video title/topic.',
          placeholder: 'e.g., 10 Ways to Improve Your Mental Health',
        },
        {
          name: 'introScript',
          label: 'Can you share your intro script for the video? (optional)',
          emoji: '🎙️',
          type: 'textarea',
          rows: 4,
          placeholder: 'Please paste your intro here',
        },
        {
          name: 'keyStats',
          label: 'Can you share any information, key stats, research data or facts about your video topic? (optional)',
          emoji: '📊',
          type: 'textarea',
          rows: 4,
          placeholder: 'Provide the important information, facts, statistics, or trends about your video topic.',
        },
        language,
      ],
      build: (v) => ({
        system:
          `You are an expert YouTube content director. In ${v.language}, generate a highly detailed and ` +
          `structured outline for a YouTube video based on the title, intro, and key stats. Format in Markdown:\n` +
          `- "## Section 1: Hook & Intro Outline" (With hook triggers and value statement)\n` +
          `- "## Section 2: Main Body Segments" (Divide into 3-5 logical points. For each point, outline: Key Argument, Visuals/B-Roll ideas, and Specific Talking Points)\n` +
          `- "## Section 3: Conclusion & Outro Outline" (Summarizing key message, Call to Action)`,
        user: `Video Title: ${v.title}\n` +
          `Intro Script: ${v.introScript || 'None'}\n` +
          `Key Stats/Data: ${v.keyStats || 'None'}`,
        maxTokens: 2200,
        temperature: 0.8,
      }),
      loading: { label: 'Generating outline', messages: ['Breaking down topics…', 'Structuring segments…', 'Outlining CTAs…'] },
      result: { title: 'YouTube Script Outline', filename: 'yt-script-outline' },
    },
  },
  {
    id: 'yt-research-questions-generator',
    name: 'YT Research Questions Generator',
    description: 'This tool generates targeted research questions to help YouTube creators explore and address their audience\'s pain points, solve problems, and create more impactful videos.',
    icon: HelpCircle,
    config: {
      fields: [
        {
          name: 'challenges',
          label: 'What are the main challenges your audience is struggling with?',
          emoji: '🧩',
          type: 'textarea',
          rows: 4,
          required: true,
          requiredMsg: 'Please enter the audience challenges.',
          placeholder: 'e.g., Difficulty managing time, lack of confidence, etc.',
        },
        {
          name: 'problems',
          label: 'What specific problems are you aiming to solve in your video?',
          emoji: '🔧',
          type: 'textarea',
          rows: 4,
          required: true,
          requiredMsg: 'Please enter the problems to solve.',
          placeholder: 'e.g., How to stay organized, how to boost self-esteem, etc.',
        },
        language,
      ],
      build: (v) => ({
        system:
          `You are a research analyst and content planner. In ${v.language}, generate a list of 10 targeted ` +
          `research questions to help the creator dig deeper into their audience's problems. Group in Markdown:\n` +
          `- "## Audience Psychology Questions" (Uncover underlying emotions/fears)\n` +
          `- "## Practical & Behavioral Questions" (Analyze how they act/work)\n` +
          `- "## Solution-Validation Questions" (Identify what actual tools/solutions they need)\n` +
          `Include a brief note explaining how answering each question will make the video content more effective.`,
        user: `Audience Struggles: ${v.challenges}\n` +
          `Problems to Solve: ${v.problems}`,
        maxTokens: 1800,
        temperature: 0.8,
      }),
      loading: { label: 'Generating questions', messages: ['Mapping audience pain points…', 'Formulating research queries…', 'Polishing guide…'] },
      result: { title: 'Targeted Research Questions', filename: 'yt-research-questions' },
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
          emoji: '📱',
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
          emoji: '📣',
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
    id: 'yt-viral-shorts',
    name: 'Viral Shorts/Reels Script',
    description: 'Turn the latest info into a viral, share-worthy short-form script.',
    icon: Flame,
    config: {
      fields: [
        {
          name: 'info',
          label: "What's the latest information you've found out about your topic?",
          emoji: '🔥',
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
