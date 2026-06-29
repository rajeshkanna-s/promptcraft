import { Facebook, Linkedin, Instagram, Video, Hash, User, Layers } from 'lucide-react';
import FormTool from './FormTool.jsx';

const DEFS = [
  {
    id: 'sm-facebook-post',
    name: 'Facebook Post',
    description: 'Craft compelling Facebook posts with our AI Tool. Follow the 4A writing formula to engage your audience effectively.',
    icon: Facebook,
    config: {
      fields: [
        {
          name: 'about',
          label: 'What is your post about?',
          emoji: '📣',
          type: 'textarea',
          required: true,
          requiredMsg: 'Please enter what your post is about.',
          placeholder: 'Write about your product, announcement, launch, or offer...',
        },
        {
          name: 'instructions',
          label: 'Advanced Settings (optional)',
          emoji: '⚙️',
          type: 'text',
          required: false,
          placeholder: 'e.g. dramatic hook, focus on discounts',
          advanced: true,
        },
      ],
      build: (v) => {
        const extra = v.instructions ? `Advanced settings: ${v.instructions.trim()}` : '';
        return {
          system:
            'You are a social media copywriter. Write a highly engaging Facebook post using the 4A framework ' +
            '(Attention, Association, Action, Acceleration). Hook the reader, form an association with their ' +
            'needs/desires, provide a clear Call-To-Action (Action), and create urgency or speed (Acceleration). ' +
            'Include relevant emojis and a few key hashtags. Format in clean Markdown.',
          user: `Topic/Offer: ${v.about}\n${extra}`,
          maxTokens: 2000,
          temperature: 0.8,
        };
      },
      loading: {
        label: 'Writing Facebook post',
        messages: ['Attracting attention…', 'Building association…', 'Adding call to action…'],
      },
      result: { title: 'Generated Facebook Post', filename: 'facebook-post' },
    },
  },
  {
    id: 'sm-linkedin-post',
    name: 'LinkedIn Post',
    description: 'Make your LinkedIn posts stand out! Create short, impactful posts on any topic. Get ready for a surge in comments and interactions.',
    icon: Linkedin,
    config: {
      fields: [
        {
          name: 'about',
          label: 'What is your post about?',
          emoji: '📣',
          type: 'textarea',
          required: true,
          requiredMsg: 'Please enter what your post is about.',
          placeholder: 'Share professional insights, advice, or career news...',
        },
        {
          name: 'instructions',
          label: 'Advanced Settings (optional)',
          emoji: '⚙️',
          type: 'text',
          required: false,
          placeholder: 'e.g. conversational tone, end with a question',
          advanced: true,
        },
      ],
      build: (v) => {
        const extra = v.instructions ? `Advanced settings: ${v.instructions.trim()}` : '';
        return {
          system:
            'You are a LinkedIn content creator. Write a professional, high-engagement LinkedIn post. ' +
            'Make it short, structured with readable line breaks, starting with a compelling hook line. ' +
            'End the post with an engaging open-ended question to drive comments. Include relevant hashtags. ' +
            'Do not use generic corporate jargon. Use clean Markdown.',
          user: `Topic: ${v.about}\n${extra}`,
          maxTokens: 2000,
          temperature: 0.75,
        };
      },
      loading: {
        label: 'Writing LinkedIn post',
        messages: ['Hooking professionals…', 'Structuring readable lines…', 'Adding conversation triggers…'],
      },
      result: { title: 'Generated LinkedIn Post', filename: 'linkedin-post' },
    },
  },
  {
    id: 'sm-instagram-hashtag',
    name: 'Instagram Hashtag Generator',
    description: 'Making your Instagram posts stand out with perfectly curated hashtags.',
    icon: Hash,
    config: {
      fields: [
        {
          name: 'profile',
          label: 'What is your Profile About?',
          emoji: '🔥',
          type: 'text',
          required: true,
          requiredMsg: 'Please describe what your profile is about.',
          placeholder: 'Eg: E-Learning, Cooking',
        },
        {
          name: 'title',
          label: 'Title of the Post',
          emoji: '📝',
          type: 'text',
          required: true,
          requiredMsg: 'Please enter the title/topic of your post.',
          placeholder: 'Eg: Independence Day 29% Offer',
        },
      ],
      build: (v) => ({
        system:
          'You are an Instagram growth strategist. Based on the profile niche and the specific post title, ' +
          'generate a categorized list of exactly 30 hashtags. Segment them into: 10 High Reach/Broad hashtags, ' +
          '10 Medium Reach hashtags, and 10 Niche/Highly Targeted hashtags. Format in clean Markdown.',
        user: `Profile Niche: ${v.profile}\nPost Title: ${v.title}`,
        maxTokens: 1500,
        temperature: 0.8,
      }),
      loading: {
        label: 'Curating hashtags',
        messages: ['Analyzing niche relevancy…', 'Sifting trending terms…', 'Sorting reach levels…'],
      },
      result: { title: 'Curated Instagram Hashtags', filename: 'instagram-hashtags' },
    },
  },
  {
    id: 'sm-linkedin-profile',
    name: 'LinkedIn Profile Builder',
    description: 'Enhance your LinkedIn profile with tailored content—our tool makes creating a professional profile easy.',
    icon: User,
    config: {
      submitLabel: 'Save and Continue',
      fields: [
        {
          name: 'section',
          label: 'Profile Section',
          emoji: '👤',
          type: 'select',
          required: true,
          options: [
            { value: 'headline', label: 'Profile Headline' },
            { value: 'about', label: 'About Section (Summary)' },
            { value: 'experience', label: 'Work Experience Description' },
          ],
          default: 'headline',
        },
        {
          name: 'highlights',
          label: 'Can you share a brief summary or key highlights from your resume?',
          emoji: '📑',
          type: 'textarea',
          required: true,
          requiredMsg: 'Please share your key highlights/resume summary.',
          placeholder: 'Please summarize your key qualifications, skills, and achievements.',
        },
      ],
      build: (v) => ({
        system:
          'You are a professional resume writer and career coach. Draft a compelling LinkedIn profile ' +
          'component for the specified section based on the resume highlights. Make it professional, ' +
          'impact-driven, and rich with keywords. Output ONLY the drafted text for the selected section.',
        user: `Section to build: ${v.section}\nResume Highlights: ${v.highlights}`,
        maxTokens: 2500,
        temperature: 0.7,
      }),
      loading: {
        label: 'Building profile section',
        messages: ['Reviewing resume highlights…', 'Optimizing industry keywords…', 'Drafting high-impact copy…'],
      },
      result: { title: 'LinkedIn Profile Section', filename: 'linkedin-profile-draft' },
    },
  },
  {
    id: 'sm-instagram-caption',
    name: 'Instagram Caption',
    description: 'Make your Instagram posts stand out with this Amazing AI Tool! It generates engaging captions with emojis, a hook, a call to action, and 25 relevant hashtags.',
    icon: Instagram,
    config: {
      fields: [
        {
          name: 'about',
          label: 'What is your post about?',
          emoji: '📣',
          type: 'textarea',
          required: true,
          requiredMsg: 'Please enter what the post is about.',
          placeholder: 'Write about the visual, photo, or theme of the post...',
        },
        {
          name: 'count',
          label: 'No. of captions required?',
          emoji: '🔢',
          type: 'select',
          required: true,
          options: [
            { value: '1', label: '1 caption' },
            { value: '3', label: '3 captions' },
            { value: '5', label: '5 captions' },
          ],
          default: '3',
        },
        {
          name: 'instructions',
          label: 'Advanced Settings (optional)',
          emoji: '⚙️',
          type: 'text',
          required: false,
          placeholder: 'e.g. aesthetic style, casual voice',
          advanced: true,
        },
      ],
      build: (v) => {
        const extra = v.instructions ? `Advanced instructions: ${v.instructions.trim()}` : '';
        return {
          system:
            'You are an Instagram copywriter. Write the requested number of caption variations. ' +
            'Each caption must include: 1) A strong, click-worthy hook in the first line, 2) Emojis throughout, ' +
            '3) A clear call-to-action (CTA), and 4) Exactly 25 relevant hashtags at the bottom. ' +
            'Use clean Markdown separating each variant.',
          user: `Post Details: ${v.about}\nCaptions needed: ${v.count}\n${extra}`,
          maxTokens: 2500,
          temperature: 0.85,
        };
      },
      loading: {
        label: 'Writing captions',
        messages: ['Brainstorming hook lines…', 'Injecting style & emojis…', 'Adding CTA & hashtags…'],
      },
      result: { title: 'Instagram Caption Variations', filename: 'instagram-captions' },
    },
  },
  {
    id: 'sm-reel-script',
    name: 'Script for Instagram Reel',
    description: 'This tool will help you generate detailed, engaging scripts for Instagram Reels.',
    icon: Video,
    config: {
      fields: [
        {
          name: 'topic',
          label: 'What is the topic or title of your Instagram Reel?',
          emoji: '🎬',
          type: 'text',
          required: true,
          requiredMsg: 'Please enter a Reel topic/title.',
          placeholder: "e.g., 'Summer Travel Vlog', 'Healthy Smoothie Recipe', 'Fashion Haul' etc.",
        },
        {
          name: 'keyPoints',
          label: 'Key Points (optional)',
          emoji: '📝',
          type: 'textarea',
          required: false,
          placeholder: 'Please list the main topics for your video. e.g., Introduction, Product Features etc...',
        },
        {
          name: 'audience',
          label: 'Who is your target audience for your video? (optional)',
          emoji: '👥',
          type: 'text',
          required: false,
          placeholder: 'Please specify your intended viewer group. e.g., Young adults, Working professionals',
        },
      ],
      build: (v) => {
        const points = v.keyPoints ? `Key Points: ${v.keyPoints.trim()}` : '';
        const aud = v.audience ? `Target Audience: ${v.audience.trim()}` : '';
        return {
          system:
            'You are a short-form video creator. Write a comprehensive visual and verbal script for a 30-60 second ' +
            'Instagram Reel. Include: 1) Hook suggestions (first 3 seconds), 2) Scene-by-scene instructions ' +
            'with visual/camera directions in brackets, 3) Spoken voiceover text, and 4) Text overlays ' +
            '(captions) to show on screen. Keep the pacing fast and highly engaging. Format in clean Markdown.',
          user: `Reel Topic/Title: ${v.topic}\n${points}\n${aud}`,
          maxTokens: 3000,
          temperature: 0.8,
        };
      },
      loading: {
        label: 'Scripting Reel',
        messages: ['Developing 3-second hook…', 'Arranging scene timelines…', 'Adding script voiceover…'],
      },
      result: { title: 'Instagram Reel Script', filename: 'instagram-reel-script' },
    },
  },
  {
    id: 'sm-instagram-carousel',
    name: 'Instagram Carousel',
    description: 'Your one-stop solution for captivating Instagram carousel content, from topic ideas to the final caption, all in your chosen language.',
    icon: Layers,
    config: {
      fields: [
        {
          name: 'about',
          label: 'What is your post about?',
          emoji: '📣',
          type: 'textarea',
          required: true,
          requiredMsg: 'Please enter what the carousel is about.',
          placeholder: 'e.g. 5 steps to start coding, morning routine for productivity',
        },
        {
          name: 'slides',
          label: 'No. of slides required?',
          emoji: '🔢',
          type: 'select',
          required: true,
          options: [
            { value: '3', label: '3 slides' },
            { value: '5', label: '5 slides' },
            { value: '7', label: '7 slides' },
            { value: '10', label: '10 slides' },
          ],
          default: '5',
        },
        {
          name: 'instructions',
          label: 'Advanced Settings (optional)',
          emoji: '⚙️',
          type: 'text',
          required: false,
          placeholder: 'e.g. minimal design style, bold fonts',
          advanced: true,
        },
      ],
      build: (v) => {
        const extra = v.instructions ? `Advanced instructions: ${v.instructions.trim()}` : '';
        return {
          system:
            'You are an Instagram carousel designer. Create a slide-by-slide text plan for a carousel post based ' +
            'on the topic. For each slide, write the Slide Number, the visual layout description/idea, and the exact ' +
            'text/headings to show. Include a dedicated Intro Slide (Slide 1) and a Call-To-Action Outro Slide ' +
            '(final slide). Also write a caption with hashtags to accompany the post. Output in clean Markdown.',
          user: `Topic: ${v.about}\nSlide Count: ${v.slides}\n${extra}`,
          maxTokens: 3000,
          temperature: 0.8,
        };
      },
      loading: {
        label: 'Designing Carousel Plan',
        messages: ['Outlining slide topics…', 'Formulating visual layouts…', 'Drafting caption copy…'],
      },
      result: { title: 'Instagram Carousel Outline', filename: 'instagram-carousel' },
    },
  },
];

// Registry-ready entries for the "Social Media Tools" category.
export const SOCIAL_MEDIA_TOOLS = DEFS.map((d) => ({
  id: d.id,
  name: d.name,
  description: d.description,
  category: 'Social Media Tools',
  icon: d.icon,
  available: true,
  // eslint-disable-next-line react/display-name
  component: () => <FormTool config={{ icon: d.icon, title: d.name, description: d.description, ...d.config }} />,
}));
