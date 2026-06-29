import { Megaphone } from 'lucide-react';
import FormTool from './FormTool.jsx';

const DEFS = [
  {
    id: 'ad-facebook-copy',
    name: 'Facebook Ad Copy',
    description: 'Boost Your Facebook Ads with Targeted Text and Headlines.',
    icon: Megaphone,
    config: {
      fields: [
        {
          name: 'product',
          label: 'What is your product or service?',
          emoji: '📦',
          type: 'text',
          required: true,
          requiredMsg: 'Please enter your product/service name.',
          placeholder: 'e.g., Wireless Noise-Cancelling Headphones',
        },
        {
          name: 'about',
          label: 'Key features / benefits / offer',
          emoji: '💡',
          type: 'textarea',
          required: true,
          requiredMsg: 'Please enter product benefits or offer details.',
          placeholder: 'e.g., 30-hour battery life, active noise cancellation, 20% off launch discount',
        },
      ],
      build: (v) => ({
        system:
          'You are a professional Facebook copywriter. Write 3 high-converting Facebook ad copies. ' +
          'For each option, provide: 1) A compelling headline, 2) Primary text body (using emojis, line breaks, ' +
          'and customer-focused benefits), and 3) A recommended Call-to-Action button. Format in clean Markdown.',
        user: `Product/Service: ${v.product}\nKey Details & Offer: ${v.about}`,
        maxTokens: 2500,
        temperature: 0.8,
      }),
      loading: {
        label: 'Writing Facebook Ad Copies',
        messages: ['Brainstorming scroll-stopping hooks…', 'Structuring benefits…', 'Polishing call-to-actions…'],
      },
      result: { title: 'Facebook Ad Copies', filename: 'facebook-ad-copies' },
    },
  },
  {
    id: 'ad-google-copy',
    name: 'Google Ad Copy',
    description: 'Develop High-Impact Google Ads with Ease.',
    icon: Megaphone,
    config: {
      fields: [
        {
          name: 'product',
          label: 'Product / Service / Website Name',
          emoji: '🌐',
          type: 'text',
          required: true,
          requiredMsg: 'Please enter your service/website name.',
          placeholder: 'e.g., PromptCraft AI Assistant',
        },
        {
          name: 'keywords',
          label: 'Target Keywords',
          emoji: '🔑',
          type: 'text',
          required: true,
          requiredMsg: 'Please enter target keywords.',
          placeholder: 'e.g., ai copywriting tool, writing assistant, blog generator',
        },
      ],
      build: (v) => ({
        system:
          'You are a Google Search Ads expert. Based on the product and target keywords, generate 3 Google search ad templates ' +
          'complying with standard limits: exactly 3 headlines (max 30 characters each, separated by |) and ' +
          '2 description lines (max 90 characters each). Format in clean Markdown.',
        user: `Product Name: ${v.product}\nKeywords: ${v.keywords}`,
        maxTokens: 1500,
        temperature: 0.75,
      }),
      loading: {
        label: 'Drafting Google Search Ads',
        messages: ['Adhering to character limits…', 'Optimizing headline keywords…', 'Drafting description blocks…'],
      },
      result: { title: 'Google Ad Templates', filename: 'google-ad-templates' },
    },
  },
  {
    id: 'ad-general-copy',
    name: 'Ad Copy',
    description: 'Turn Heads: Enticing Ad Copies that Spark Curiosity.',
    icon: Megaphone,
    config: {
      fields: [
        {
          name: 'topic',
          label: 'What is the ad copy about?',
          emoji: '📣',
          type: 'textarea',
          required: true,
          requiredMsg: 'Please enter details for the general ad copy.',
          placeholder: 'Describe your product, service, or event details…',
        },
      ],
      build: (v) => ({
        system:
          'You are a direct-response copywriter. Craft 3 variations of general ad copy designed to trigger ' +
          'curiosity, hook the reader, and guide them to a link or landing page. Output in clean Markdown.',
        user: `Ad Topic Details: ${v.topic}`,
        maxTokens: 2000,
        temperature: 0.85,
      }),
      loading: {
        label: 'Formulating Ad Copies',
        messages: ['Injecting psychological triggers…', 'Drafting curiosity hooks…', 'Polishing text flow…'],
      },
      result: { title: 'General Ad Copies', filename: 'general-ad-copy' },
    },
  },
  {
    id: 'ad-targeting-helper',
    name: 'Ad Targeting Helper',
    description: 'Easily identify your target audience and optimize ad performance.',
    icon: Megaphone,
    config: {
      fields: [
        {
          name: 'product',
          label: 'What is your product or service?',
          emoji: '🛍️',
          type: 'text',
          required: true,
          requiredMsg: 'Please enter your product/service.',
          placeholder: 'e.g., Organic baby clothing brand',
        },
        {
          name: 'targetCountry',
          label: 'Target Region / Country',
          emoji: '🌍',
          type: 'text',
          required: true,
          requiredMsg: 'Please enter target region.',
          placeholder: 'e.g., United States, United Kingdom',
        },
      ],
      build: (v) => ({
        system:
          'You are a media buyer and performance marketer. Based on the product and target region, recommend ' +
          '3 target audience personas for Facebook/Google Ads. Include: 1) Demographic details (Age, Gender, Location), ' +
          '2) Interests & Behaviors, 3) Suggested keywords/broad search items, and 4) Audience pain points to address in copy. ' +
          'Format in clean Markdown.',
        user: `Product/Service: ${v.product}\nRegion: ${v.targetCountry}`,
        maxTokens: 2500,
        temperature: 0.8,
      }),
      loading: {
        label: 'Analyzing Target Audiences',
        messages: ['Analyzing demographics…', 'Mapping user behaviors…', 'Structuring targeting criteria…'],
      },
      result: { title: 'Recommended Ad Targeting Profiles', filename: 'ad-targeting-plan' },
    },
  },
  {
    id: 'ad-hook-creator',
    name: 'Ad Hook Creator',
    description: 'Increase Engagement with Powerful Hooks for Your Ads.',
    icon: Megaphone,
    config: {
      fields: [
        {
          name: 'product',
          label: 'What is your product or offer?',
          emoji: '🎯',
          type: 'text',
          required: true,
          requiredMsg: 'Please enter product details.',
          placeholder: 'e.g., 7-day masterclass on becoming a freelance developer',
        },
      ],
      build: (v) => ({
        system:
          'You are a social advertising specialist. Generate 10 high-impact ad hooks categorized into: ' +
          '2 Question hooks, 2 Stat/Fact hooks, 2 Contrast/Before-After hooks, 2 Relatable Problem hooks, and 2 Direct Offer hooks. ' +
          'Format in clean Markdown.',
        user: `Product/Offer: ${v.product}`,
        maxTokens: 2000,
        temperature: 0.85,
      }),
      loading: {
        label: 'Creating Ad Hooks',
        messages: ['Brainstorming questions…', 'Reviewing copy strategies…', 'Sorting hook styles…'],
      },
      result: { title: 'High-Impact Ad Hooks', filename: 'ad-hooks' },
    },
  },
  {
    id: 'ad-user-painpoint',
    name: 'Find User Pain Point',
    description: 'Find the key problems customers have in your region.',
    icon: Megaphone,
    config: {
      fields: [
        {
          name: 'niche',
          label: 'Product Niche or Industry',
          emoji: '🛒',
          type: 'text',
          required: true,
          requiredMsg: 'Please enter the industry/niche.',
          placeholder: 'e.g., Home meal kit delivery service',
        },
        {
          name: 'region',
          label: 'Target Region',
          emoji: '📍',
          type: 'text',
          required: true,
          requiredMsg: 'Please enter target region.',
          placeholder: 'e.g., Urban areas in the USA',
        },
      ],
      build: (v) => ({
        system:
          'You are a market researcher. Based on the niche and region, identify 5 critical customer pain points. ' +
          'For each pain point, detail: 1) What the problem is, 2) Why existing solutions fail, and 3) How the user\'s product ' +
          'niche can solve it. Format in clean Markdown.',
        user: `Niche: ${v.niche}\nRegion: ${v.region}`,
        maxTokens: 2500,
        temperature: 0.8,
      }),
      loading: {
        label: 'Analyzing Customer Pain Points',
        messages: ['Analyzing region demographics…', 'Cross-referencing customer reviews…', 'Synthesizing key pain points…'],
      },
      result: { title: 'Key Customer Pain Points', filename: 'customer-pain-points' },
    },
  },
  {
    id: 'ad-tiktok-copy',
    name: 'TikTok Ads',
    description: 'Get Noticed Instantly with Customizable TikTok Ads.',
    icon: Megaphone,
    config: {
      fields: [
        {
          name: 'about',
          label: 'What is the ad about?',
          emoji: '🎵',
          type: 'textarea',
          required: true,
          requiredMsg: 'Please enter TikTok ad details.',
          placeholder: 'e.g., a teeth whitening kit that works in 10 minutes',
        },
      ],
      build: (v) => ({
        system:
          'You are a TikTok ad scriptwriter. Create 2 energetic TikTok video ad scripts. Each script must include: ' +
          '1) Visual actions/text overlays, 2) Quick pacing spoken lines (hook within first 2 seconds), and ' +
          '3) Trending sound/music ideas. Format in clean Markdown.',
        user: `Topic/Product details: ${v.about}`,
        maxTokens: 2500,
        temperature: 0.85,
      }),
      loading: {
        label: 'Writing TikTok Ad Scripts',
        messages: ['Brainstorming visual hooks…', 'Structuring sound directions…', 'Adding overlay markers…'],
      },
      result: { title: 'TikTok Video Ad Scripts', filename: 'tiktok-ad-scripts' },
    },
  },
  {
    id: 'ad-commercial-script',
    name: 'Commercial Ad Script Generator',
    description: 'This tool creates engaging commercial video scripts that showcase your product.',
    icon: Megaphone,
    config: {
      fields: [
        {
          name: 'product',
          label: 'What is your product or service?',
          emoji: '🎬',
          type: 'text',
          required: true,
          requiredMsg: 'Please enter your product.',
          placeholder: 'e.g., smart pet feeder with built-in camera',
        },
        {
          name: 'duration',
          label: 'Video Duration',
          emoji: '⏱️',
          type: 'select',
          required: true,
          options: [
            { value: '30', label: '30 Seconds' },
            { value: '60', label: '60 Seconds' },
            { value: '90', label: '90 Seconds' },
          ],
          default: '30',
        },
      ],
      build: (v) => ({
        system:
          'You are a commercial scriptwriter. Write a scene-by-scene script for a promotional video. ' +
          'For each scene, detail the time stamp, visual camera direction, audio/voiceover, and text overlays. ' +
          'Format in a clear Markdown table.',
        user: `Product: ${v.product}\nDuration: ${v.duration}s`,
        maxTokens: 3000,
        temperature: 0.8,
      }),
      loading: {
        label: 'Scripting Commercial',
        messages: ['Breaking scenes down…', 'Formulating camera directions…', 'Structuring voiceover copy…'],
      },
      result: { title: 'Commercial Video Script', filename: 'commercial-script' },
    },
  },
  {
    id: 'ad-google-pro',
    name: 'Google Ads Pro',
    description: 'Turn Visitors into Customers with High-Performing Ads.',
    icon: Megaphone,
    config: {
      fields: [
        {
          name: 'url',
          label: 'Landing Page URL or Product Name',
          emoji: '🔗',
          type: 'text',
          required: true,
          requiredMsg: 'Please enter product name or landing URL.',
          placeholder: 'e.g., eco-friendly coffee cups, https://ecocup.com',
        },
        {
          name: 'benefits',
          label: 'Key Selling Points',
          emoji: '🚀',
          type: 'textarea',
          required: true,
          requiredMsg: 'Please list key selling points.',
          placeholder: 'e.g., 100% biodegradable, heat insulation, custom designs available',
        },
      ],
      build: (v) => ({
        system:
          'You are a Google Ads specialist. Draft a pro search campaign copy block with: 3 Headline variations ' +
          '(max 30 chars), 2 description variations (max 90 chars), and 4 extension suggestions (sitelinks, callouts). ' +
          'Format in clean Markdown.',
        user: `Product/URL: ${v.url}\nSelling Points: ${v.benefits}`,
        maxTokens: 2000,
        temperature: 0.75,
      }),
      loading: {
        label: 'Drafting Google Ads Pro Copy',
        messages: ['Optimizing conversion copy…', 'Structuring extensions…', 'Fitting character limits…'],
      },
      result: { title: 'Google Ads Pro Templates', filename: 'google-ads-pro-copy' },
    },
  },
  {
    id: 'ad-linkedin',
    name: 'LinkedIn Ad',
    description: 'Get Professional, Attention-Grabbing LinkedIn Ads Fast.',
    icon: Megaphone,
    config: {
      fields: [
        {
          name: 'b2bProduct',
          label: 'B2B Product / Service details',
          emoji: '💼',
          type: 'textarea',
          required: true,
          requiredMsg: 'Please enter B2B product details.',
          placeholder: 'e.g., enterprise cybersecurity software with automated threat reports',
        },
      ],
      build: (v) => ({
        system:
          'You are a LinkedIn Ads marketer. Create 2 professional LinkedIn single-image/sponsored ad copy blocks. ' +
          'For each, provide: 1) Introductory Text (max 150 characters recommended for mobile visibility), ' +
          '2) Headline (max 70 characters), 3) Description (max 100 characters), and 4) Visual asset ideas. ' +
          'Format in clean Markdown.',
        user: `B2B Product/Service: ${v.b2bProduct}`,
        maxTokens: 2000,
        temperature: 0.75,
      }),
      loading: {
        label: 'Writing LinkedIn Ads',
        messages: ['Polishing B2B messaging…', 'Formulating asset directions…', 'Drafting conversion texts…'],
      },
      result: { title: 'LinkedIn Sponsored Ad Copies', filename: 'linkedin-ad-copies' },
    },
  },
  {
    id: 'ad-twitter',
    name: 'Twitter Ads',
    description: 'Increase Customer Reach with Strategic Twitter Ad Content.',
    icon: Megaphone,
    config: {
      fields: [
        {
          name: 'about',
          label: 'What is the ad promoting?',
          emoji: '🐦',
          type: 'textarea',
          required: true,
          requiredMsg: 'Please enter Twitter ad details.',
          placeholder: 'e.g., a summer clearance sale, a free e-book download for designers',
        },
      ],
      build: (v) => ({
        system:
          'You are a Twitter Ads manager. Write 5 punchy Twitter Ad copy variations (complying with standard ' +
          '280-character limits). Integrate relevant emojis and a single clear call to action link format in each. ' +
          'Format in clean Markdown.',
        user: `Promotion details: ${v.about}`,
        maxTokens: 1800,
        temperature: 0.8,
      }),
      loading: {
        label: 'Formulating Twitter Ads',
        messages: ['Drafting punchy variants…', 'Verifying character counts…', 'Placing call-to-actions…'],
      },
      result: { title: 'Twitter Ad Copies', filename: 'twitter-ad-copies' },
    },
  },
  {
    id: 'ad-instagram',
    name: 'Instagram Ad Copy',
    description: 'Make Instagram Ads Stand Out.',
    icon: Megaphone,
    config: {
      fields: [
        {
          name: 'about',
          label: 'What is your product or service?',
          emoji: '📸',
          type: 'textarea',
          required: true,
          requiredMsg: 'Please enter Instagram ad details.',
          placeholder: 'e.g., stylish minimalist wallets, vegan skin care products',
        },
      ],
      build: (v) => ({
        system:
          'You are an Instagram Ads copywriter. Create 3 highly visual Instagram ad copies. For each, write: ' +
          '1) A descriptive idea for the image/video, 2) Visual text overlay copy, 3) The main caption (starting with ' +
          'a strong hook, structured benefits, and call to action), and 4) 10 relevant hashtags. Format in clean Markdown.',
        user: `Product/Service: ${v.about}`,
        maxTokens: 2500,
        temperature: 0.8,
      }),
      loading: {
        label: 'Generating Instagram Ad Captions',
        messages: ['Brainstorming visual overlay copy…', 'Refining caption hooks…', 'Sifting hashtags…'],
      },
      result: { title: 'Instagram Ad Copies', filename: 'instagram-ad-copies' },
    },
  },
];

// Registry-ready entries for the "Advertising Tools" category.
export const ADVERTISING_TOOLS = DEFS.map((d) => ({
  id: d.id,
  name: d.name,
  description: d.description,
  category: 'Advertising Tools',
  icon: d.icon,
  available: true,
  // eslint-disable-next-line react/display-name
  component: () => <FormTool config={{ icon: d.icon, title: d.name, description: d.description, ...d.config }} />,
}));
