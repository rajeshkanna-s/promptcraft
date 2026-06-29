import { Globe2 } from 'lucide-react';
import FormTool from './FormTool.jsx';

const DEFS = [
  {
    id: 'web-domain-ideas',
    name: 'Domain Name Ideas',
    description: 'Generate unique and memorable domain names quickly.',
    icon: Globe2,
    config: {
      fields: [
        {
          name: 'niche',
          label: 'What is your brand, industry, or niche?',
          emoji: '🛒',
          type: 'text',
          required: true,
          requiredMsg: 'Please enter your brand/niche.',
          placeholder: 'e.g., eco-friendly pet food, AI writing software',
        },
        {
          name: 'extension',
          label: 'Preferred Domain Extension',
          emoji: '🌐',
          type: 'select',
          required: true,
          options: [
            { value: 'com', label: '.com only' },
            { value: 'tech-io', label: '.tech / .io / .ai (Tech focus)' },
            { value: 'co-net', label: '.co / .net / .org' },
            { value: 'any', label: 'Show various extensions' },
          ],
          default: 'com',
        },
      ],
      build: (v) => ({
        system:
          'You are a brand naming specialist. Generate 15 distinct, catchy, and memorable domain name ideas ' +
          'tailored to the niche and extension criteria. For each suggestion, provide a brief rationale ' +
          'explaining its appeal. Format in clean Markdown.',
        user: `Niche: ${v.niche}\nPreferred Extension: ${v.extension}`,
        maxTokens: 2000,
        temperature: 0.85,
      }),
      loading: {
        label: 'Generating domain ideas',
        messages: ['Brainstorming keywords…', 'Blending word segments…', 'Filtering unique extension paths…'],
      },
      result: { title: 'Recommended Domain Names', filename: 'domain-name-ideas' },
    },
  },
  {
    id: 'web-creative-homepage',
    name: 'Creative Home Page',
    description: 'Create Landing Pages That Truly Connect with Your Audience.',
    icon: Globe2,
    config: {
      fields: [
        {
          name: 'business',
          label: 'Describe your business or product',
          emoji: '🏢',
          type: 'textarea',
          required: true,
          requiredMsg: 'Please describe your business.',
          placeholder: 'e.g., EcoWash - a waterless car wash service delivered to your home',
        },
      ],
      build: (v) => ({
        system:
          'You are a conversion copywriter. Write a full layout draft for a Creative Home Page / Landing Page. ' +
          'Include sections: 1) Hero Headline & Subheadline, 2) Primary Call-to-Action (CTA), 3) Key Benefits ' +
          'or Value Propositions (3 items), 4) How it Works (3 steps), and 5) Trust / Testimonial placeholder. ' +
          'Format in clean Markdown.',
        user: `Business Details: ${v.business}`,
        maxTokens: 2500,
        temperature: 0.8,
      }),
      loading: {
        label: 'Designing Homepage Copy',
        messages: ['Drafting hero headlines…', 'Structuring benefits outline…', 'Adding call-to-actions…'],
      },
      result: { title: 'Homepage / Landing Page Copy Draft', filename: 'homepage-copy' },
    },
  },
  {
    id: 'web-about-us',
    name: 'About Us Page',
    description: "Create a captivating 'About Us' section with customer feedback.",
    icon: Globe2,
    config: {
      fields: [
        {
          name: 'company',
          label: 'Company Name & Founding Story',
          emoji: '📖',
          type: 'textarea',
          required: true,
          requiredMsg: 'Please enter founding story details.',
          placeholder: 'e.g., Founded in 2021 by two designers who wanted to reduce plastic waste in homes…',
        },
        {
          name: 'feedback',
          label: 'Customer Feedback or Testimonials (optional)',
          emoji: '🗣️',
          type: 'textarea',
          required: false,
          placeholder: 'e.g., "Love the quality of their cups!" - Sarah, "Finally, eco cups that last!" - Mike',
        },
      ],
      build: (v) => {
        const feedbackStr = v.feedback ? `Customer Testimonials:\n${v.feedback.trim()}` : '';
        return {
          system:
            'You are a brand storyteller. Draft an engaging, human, and authentic "About Us" page copy. ' +
            'Structure it with: 1) Our Mission, 2) The Spark (Our Story of how we started), 3) What We Stand For ' +
            '(Core Values), and 4) Integrations of customer feedback showcasing community support. Format in clean Markdown.',
          user: `Company details: ${v.company}\n${feedbackStr}`,
          maxTokens: 2500,
          temperature: 0.8,
        };
      },
      loading: {
        label: 'Writing About Us story',
        messages: ['Framing brand mission…', 'Structuring core values…', 'Polishing testimonial links…'],
      },
      result: { title: 'About Us Page Copy', filename: 'about-us-copy' },
    },
  },
  {
    id: 'web-aida-model',
    name: 'A-I-D-A model',
    description: 'Easily create content that resonates with your target customers.',
    icon: Globe2,
    config: {
      fields: [
        {
          name: 'product',
          label: 'Product or Service details',
          emoji: '🛍️',
          type: 'textarea',
          required: true,
          requiredMsg: 'Please enter product details.',
          placeholder: 'Describe your product/service, core offer, and benefits…',
        },
      ],
      build: (v) => ({
        system:
          'You are a marketing strategist. Write a highly structured copy block utilizing the AIDA model: ' +
          'Attention (hook to grab interest), Interest (explain features/benefits to peak curiosity), ' +
          'Desire (build emotional attachment or solve pain points), and Action (clear call to action). ' +
          'Format in clean Markdown.',
        user: `Product Details: ${v.product}`,
        maxTokens: 2000,
        temperature: 0.8,
      }),
      loading: {
        label: 'Structuring AIDA copy',
        messages: ['Hooking attention…', 'Building user interest…', 'Formulating call to action…'],
      },
      result: { title: 'AIDA Marketing Copy', filename: 'aida-copy' },
    },
  },
  {
    id: 'web-service-page',
    name: 'Service Page Content',
    description: 'Write Content That Captures and Resonates With Audience.',
    icon: Globe2,
    config: {
      fields: [
        {
          name: 'service',
          label: 'What is the service name?',
          emoji: '🛠️',
          type: 'text',
          required: true,
          requiredMsg: 'Please enter the service name.',
          placeholder: 'e.g., Custom Woodworking, Remote Tech Support',
        },
        {
          name: 'details',
          label: 'Describe the service features & what customers get',
          emoji: '📋',
          type: 'textarea',
          required: true,
          requiredMsg: 'Please enter service details.',
          placeholder: 'e.g., custom sizes, hand crafted, 10-year warranty, free shipping',
        },
      ],
      build: (v) => ({
        system:
          'You are a conversion writer. Draft a comprehensive page for a specific service. ' +
          'Outline: 1) Catchy Heading, 2) Service Overview, 3) 5 Bulleted Key Benefits/Features, ' +
          '4) FAQ section (3 questions), and 5) A clear Booking/Contact Call to Action. Format in clean Markdown.',
        user: `Service Name: ${v.service}\nDetails: ${v.details}`,
        maxTokens: 2500,
        temperature: 0.75,
      }),
      loading: {
        label: 'Drafting Service Page Content',
        messages: ['Outlining service details…', 'Formatting benefit bullets…', 'Creating FAQs…'],
      },
      result: { title: 'Service Webpage Copy', filename: 'service-page-copy' },
    },
  },
  {
    id: 'web-individual-service',
    name: 'Individual Service - Full Page',
    description: 'Transform your ideas into engaging service webpage content.',
    icon: Globe2,
    config: {
      fields: [
        {
          name: 'service',
          label: 'Service Name',
          emoji: '🛠️',
          type: 'text',
          required: true,
          requiredMsg: 'Please enter service name.',
          placeholder: 'e.g., On-Demand Pool Cleaning Service',
        },
        {
          name: 'about',
          label: 'How does it benefit the customer?',
          emoji: '💡',
          type: 'textarea',
          required: true,
          requiredMsg: 'Please enter customer benefits.',
          placeholder: 'e.g., saves time, sparkling clean water, no chemical balancing needed, weekly reports',
        },
      ],
      build: (v) => ({
        system:
          'You are an SEO and landing page writer. Write a comprehensive, long-form individual service page. ' +
          'Include sections: Title, Subtitle, Pain Point Introduction, Our Solution / Process (Step-by-step), ' +
          'Pricing/Plan options guide, and CTA. Format in clean Markdown.',
        user: `Service: ${v.service}\nBenefits: ${v.about}`,
        maxTokens: 3000,
        temperature: 0.75,
      }),
      loading: {
        label: 'Drafting Service Full Page',
        messages: ['Writing pain point hook…', 'Detailing process guidelines…', 'Structuring plans…'],
      },
      result: { title: 'Individual Service Full Webpage Copy', filename: 'individual-service-page' },
    },
  },
  {
    id: 'web-service-desc',
    name: 'Get Service Descriptions',
    description: "Accurate Service Descriptions to Boost Your Business's Value.",
    icon: Globe2,
    config: {
      fields: [
        {
          name: 'services',
          label: 'List of services (one per line)',
          emoji: '📋',
          type: 'textarea',
          required: true,
          requiredMsg: 'Please list your services.',
          placeholder: 'e.g.,\nDeep Home Cleaning\nWindow Washing\nCarpet Steaming',
        },
      ],
      build: (v) => ({
        system:
          'You are a corporate copywriter. Write a brief, punchy, value-driven paragraph description (50-70 words) ' +
          'for each listed service, suitable for card components or grid lists. Format in clean Markdown.',
        user: `List of Services:\n${v.services}`,
        maxTokens: 2000,
        temperature: 0.75,
      }),
      loading: {
        label: 'Drafting Card Descriptions',
        messages: ['Parsing service array…', 'Writing summary cards…', 'Refining word counts…'],
      },
      result: { title: 'Service Grid Descriptions', filename: 'service-grid-descriptions' },
    },
  },
  {
    id: 'web-landing-image-desc',
    name: 'Image Content of the Landing Page',
    description: 'Channel your creative vision into visuals for your site.',
    icon: Globe2,
    config: {
      fields: [
        {
          name: 'pageTheme',
          label: 'Describe your website theme or product',
          emoji: '🎨',
          type: 'textarea',
          required: true,
          requiredMsg: 'Please enter landing page theme.',
          placeholder: 'e.g., A minimalist mobile app for tracking daily water intake, blue/white interface',
        },
      ],
      build: (v) => ({
        system:
          'You are a UI/UX art director. Recommend 5 specific image asset concepts for a landing page ' +
          '(e.g., Hero background illustration, feature icons, mockups). For each concept, describe ' +
          'the visual subject, style guidelines, and provide a copyable Midjourney v6/DALL-E 3 prompt ' +
          'to generate it. Format in clean Markdown.',
        user: `Page Theme/Product: ${v.pageTheme}`,
        maxTokens: 2500,
        temperature: 0.8,
      }),
      loading: {
        label: 'Designing Landing Visual Concepts',
        messages: ['Establishing visual balance…', 'Aligning layout blocks…', 'Formulating prompt vectors…'],
      },
      result: { title: 'Landing Page Image Concept Prompts', filename: 'landing-visual-prompts' },
    },
  },
  {
    id: 'web-bab-model',
    name: 'B-A-B model',
    description: 'Craft persuasive narratives that drive engagement and conversions.',
    icon: Globe2,
    config: {
      fields: [
        {
          name: 'before',
          label: 'Before state (What is the customer struggling with?)',
          emoji: '📉',
          type: 'textarea',
          required: true,
          requiredMsg: 'Please enter the before state.',
          placeholder: 'e.g., manually updating database spreadsheets is slow and leads to errors',
        },
        {
          name: 'after',
          label: 'After state (What does success look like?)',
          emoji: '📈',
          type: 'textarea',
          required: true,
          requiredMsg: 'Please enter the after state.',
          placeholder: 'e.g., a one-click dashboard that syncs spreadsheets automatically in 2 seconds',
        },
        {
          name: 'bridge',
          label: 'The Bridge (What is your product or service?)',
          emoji: '🌉',
          type: 'text',
          required: true,
          requiredMsg: 'Please enter the product/service name.',
          placeholder: 'e.g., SyncFlow AI Integration Tool',
        },
      ],
      build: (v) => ({
        system:
          'You are a copywriter. Write a persuasive marketing narrative using the Before-After-Bridge (BAB) model. ' +
          'Present: 1) The Before (the customer\'s struggle and cost of inaction), 2) The After (the ideal future state), ' +
          'and 3) The Bridge (how your product/service seamlessly moves them from struggle to success). Format in clean Markdown.',
        user: `Before: ${v.before}\nAfter: ${v.after}\nBridge (Product): ${v.bridge}`,
        maxTokens: 2200,
        temperature: 0.8,
      }),
      loading: {
        label: 'Formulating BAB copy',
        messages: ['Detailing pain points…', 'Painting future vision…', 'Constructing product bridge…'],
      },
      result: { title: 'Before-After-Bridge Marketing Copy', filename: 'bab-copy' },
    },
  },
  {
    id: 'web-pas-model',
    name: 'P-A-S model',
    description: "Understand Your Audience's Issues and Offer the Ideal Solution.",
    icon: Globe2,
    config: {
      fields: [
        {
          name: 'problem',
          label: 'The Problem (What is the core issue?)',
          emoji: '💥',
          type: 'textarea',
          required: true,
          requiredMsg: 'Please enter the core problem.',
          placeholder: 'e.g., local businesses struggle to get reviews on Google',
        },
        {
          name: 'product',
          label: 'The Solution (What is your product or service?)',
          emoji: '💡',
          type: 'text',
          required: true,
          requiredMsg: 'Please enter the product/solution.',
          placeholder: 'e.g., ReviewBoost tap-to-review NFC cards',
        },
      ],
      build: (v) => ({
        system:
          'You are a direct response copywriter. Write structured marketing copy following the ' +
          'Problem-Agitate-Solve (PAS) model. 1) Problem: Clearly identify the customer\'s pain point. ' +
          '2) Agitate: Magnify the pain point, show what happens if it remains unresolved, highlight emotional/financial costs. ' +
          '3) Solve: Introduce the product/service as the ultimate, simple relief. Format in clean Markdown.',
        user: `Problem: ${v.problem}\nSolution (Product): ${v.product}`,
        maxTokens: 2000,
        temperature: 0.8,
      }),
      loading: {
        label: 'Formulating PAS copy',
        messages: ['Framing problem context…', 'Agitating core feelings…', 'Injecting solution brief…'],
      },
      result: { title: 'Problem-Agitate-Solve Marketing Copy', filename: 'pas-copy' },
    },
  },
  {
    id: 'web-pastor-model',
    name: 'PASTOR model',
    description: 'Prompt Action with Target Audience-Focused Content.',
    icon: Globe2,
    config: {
      fields: [
        {
          name: 'niche',
          label: 'Product / Service Niche',
          emoji: '🛒',
          type: 'text',
          required: true,
          requiredMsg: 'Please enter product niche details.',
          placeholder: 'e.g., Premium fitness coaching for busy executives',
        },
        {
          name: 'problem',
          label: 'Target Problem',
          emoji: '💥',
          type: 'textarea',
          required: true,
          requiredMsg: 'Please enter the target problem.',
          placeholder: 'e.g., Executives have zero time for gym commutes, poor diet due to business travel',
        },
      ],
      build: (v) => ({
        system:
          'You are a sales letter copywriter. Draft a sales copy block based on the PASTOR model: ' +
          'P: Problem (state the customer\'s pain), A: Amplify (consequences of not fixing it), ' +
          'S: Story & Solution (a narrative of recovery/success with your solution), ' +
          'T: Testimonial/Transformation (proof of success), O: Offer (what they get/value), ' +
          'R: Response (what they need to do next). Format in clean Markdown.',
        user: `Niche: ${v.niche}\nProblem: ${v.problem}`,
        maxTokens: 2800,
        temperature: 0.8,
      }),
      loading: {
        label: 'Formulating PASTOR copy',
        messages: ['Outlining story element…', 'Detailing value offer…', 'Polishing final call-to-actions…'],
      },
      result: { title: 'PASTOR Sales Letter Copy', filename: 'pastor-copy' },
    },
  },
  {
    id: 'web-branding-package',
    name: 'Branding Package',
    description: 'Streamline your branding process with the Branding Package.',
    icon: Globe2,
    config: {
      fields: [
        {
          name: 'company',
          label: 'Company Name',
          emoji: '🏢',
          type: 'text',
          required: true,
          requiredMsg: 'Please enter company name.',
          placeholder: 'e.g., ZenFlora',
        },
        {
          name: 'niche',
          label: 'What does your company do?',
          emoji: '🌸',
          type: 'textarea',
          required: true,
          requiredMsg: 'Please enter what your company does.',
          placeholder: 'e.g., We deliver organic houseplants with custom pots and plant care guides',
        },
      ],
      build: (v) => ({
        system:
          'You are a branding consultant. Build a complete Branding Package brief. Include: ' +
          '1) Catchy Brand tagline / slogan, 2) Primary & Secondary color palettes (with hex codes), ' +
          '3) Typography recommendations (Google Fonts pairings), 4) Suggested Logo concept description, ' +
          'and 5) A sample 50-word brand intro pitch. Format in clean Markdown.',
        user: `Company Name: ${v.company}\nNiche & Offerings: ${v.niche}`,
        maxTokens: 2500,
        temperature: 0.8,
      }),
      loading: {
        label: 'Building Branding Package',
        messages: ['Writing slogan options…', 'Matching color hex palettes…', 'Drafting brand introduction…'],
      },
      result: { title: 'Brand Identity Package Brief', filename: 'brand-package' },
    },
  },
];

// Registry-ready entries for the "Website Content" category.
export const WEB_CONTENT_TOOLS = DEFS.map((d) => ({
  id: d.id,
  name: d.name,
  description: d.description,
  category: 'Website Content',
  icon: d.icon,
  available: true,
  // eslint-disable-next-line react/display-name
  component: () => <FormTool config={{ icon: d.icon, title: d.name, description: d.description, ...d.config }} />,
}));
