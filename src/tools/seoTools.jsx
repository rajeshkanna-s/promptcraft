import { Globe, Compass, Sparkles, Search, Network, Award, Layers, HelpCircle } from 'lucide-react';
import FormTool from './FormTool.jsx';

const DEFS = [
  {
    id: 'seo-meta-title-desc',
    name: 'Meta Title and Description',
    description: 'Get perfect title and description for your blog or website. It is SEO-friendly and easy to use.',
    icon: Globe,
    config: {
      fields: [
        {
          name: 'keyword',
          label: 'Enter your target keyword',
          emoji: '🎯',
          type: 'text',
          required: true,
          requiredMsg: 'Please enter your target keyword.',
          placeholder: 'e.g., best coffee maker, web design tips...',
        },
        {
          name: 'instructions',
          label: 'Advanced Settings (optional)',
          emoji: '⚙️',
          type: 'text',
          required: false,
          placeholder: 'e.g. emphasize target audience, specify brand name',
          advanced: true,
        },
      ],
      build: (v) => {
        const extra = v.instructions ? `Advanced instructions: ${v.instructions.trim()}` : '';
        return {
          system:
            'You are an SEO expert. Write a set of 5 SEO-optimized meta titles (under 60 characters) ' +
            'and meta descriptions (under 160 characters) for the given keyword. Use clean Markdown ' +
            'structure with clear divisions and character counts.',
          user: `Target Keyword: ${v.keyword}\n${extra}`,
          maxTokens: 2500,
          temperature: 0.7,
        };
      },
      loading: {
        label: 'Generating meta tags',
        messages: ['Analyzing keyword relevance…', 'Crafting CTR titles…', 'Writing optimized descriptions…'],
      },
      result: { title: 'SEO Meta Titles & Descriptions', filename: 'meta-tags' },
    },
  },
  {
    id: 'seo-long-tail-keyword',
    name: 'Long-tail Keyword Generator',
    description: 'Give us your chosen keyword and allow us to construct a table of 30 unique long tail keywords, accompanying blog post titles, categories, and identified search intents.',
    icon: Compass,
    config: {
      fields: [
        {
          name: 'keyword',
          label: 'Enter your target keyword',
          emoji: '🎯',
          type: 'text',
          required: true,
          requiredMsg: 'Please enter your target keyword.',
          placeholder: 'e.g., sustainable living',
        },
        {
          name: 'instructions',
          label: 'Advanced Settings (optional)',
          emoji: '⚙️',
          type: 'text',
          required: false,
          placeholder: 'e.g. prioritize transactional intent',
          advanced: true,
        },
      ],
      build: (v) => {
        const extra = v.instructions ? `Advanced instructions: ${v.instructions.trim()}` : '';
        return {
          system:
            'You are an SEO analyst. For the given target keyword, generate a Markdown table containing ' +
            'exactly 30 unique long-tail keywords. The table must have these columns: "Long-Tail Keyword", ' +
            '"Search Intent" (e.g., Informational, Commercial, Transactional), "Category", and "Suggested Blog Post Title".',
          user: `Target Keyword: ${v.keyword}\n${extra}`,
          maxTokens: 3500,
          temperature: 0.8,
        };
      },
      loading: {
        label: 'Generating long-tail keywords',
        messages: ['Expanding search queries…', 'Determining intents…', 'Formulating blog titles…', 'Creating Markdown table…'],
      },
      result: { title: '30 Long-Tail Keywords', filename: 'long-tail-keywords' },
    },
  },
  {
    id: 'seo-clickbait-title',
    name: 'Clickbait Title Generator',
    description: 'A tool that crafts catchy, clickbait-style blog post titles, tailored to boost your ranking for specific long-tail keywords and enhance transactional search terms.',
    icon: Sparkles,
    config: {
      fields: [
        {
          name: 'keywords',
          label: 'Enter your keyword(s)',
          emoji: '🔑',
          type: 'textarea',
          required: true,
          requiredMsg: 'Please enter the keywords.',
          placeholder: 'e.g., lose weight fast, programming hacks',
        },
        {
          name: 'count',
          label: 'Number of Titles you need?',
          emoji: '🔢',
          type: 'text',
          required: false,
          placeholder: 'Example: 10',
        },
        {
          name: 'instructions',
          label: 'Advanced Settings (optional)',
          emoji: '⚙️',
          type: 'text',
          required: false,
          placeholder: 'e.g. dramatic tone, listicle style',
          advanced: true,
        },
      ],
      build: (v) => {
        const count = parseInt(v.count, 10) || 10;
        const extra = v.instructions ? `Advanced settings: ${v.instructions.trim()}` : '';
        return {
          system:
            `You are a viral content strategist. Create high-CTR, clickbait-style blog post titles ` +
            `based on the provided keywords. The output should be a clean list of titles. Generate exactly ${count} titles.`,
          user: `Keywords: ${v.keywords}\n${extra}`,
          maxTokens: 2000,
          temperature: 0.85,
        };
      },
      loading: {
        label: 'Generating clickbait titles',
        messages: ['Brainstorming hooks…', 'Polishing emotional triggers…', 'Finalizing high-CTR titles…'],
      },
      result: { title: 'Clickbait Titles', filename: 'clickbait-titles' },
    },
  },
  {
    id: 'seo-onpage-guide',
    name: 'Related Keyword & On Page SEO Guide',
    description: 'This tool helps optimize your page with keyword variations, related keywords, SEO-friendly titles, meta descriptions, and page slug suggestions. It also provides on-page content structures.',
    icon: Search,
    config: {
      fields: [
        {
          name: 'business',
          label: "What's Your Business About?",
          emoji: '🏢',
          type: 'textarea',
          required: true,
          requiredMsg: 'Please describe your business.',
          placeholder: 'Example: A landscaping company in Tempe Arizona',
        },
        {
          name: 'instructions',
          label: 'Advanced Settings (optional)',
          emoji: '⚙️',
          type: 'text',
          required: false,
          placeholder: 'e.g. target local audience',
          advanced: true,
        },
      ],
      build: (v) => {
        const extra = v.instructions ? `Advanced instructions: ${v.instructions.trim()}` : '';
        return {
          system:
            'You are an on-page SEO optimizer. Write a comprehensive On-Page SEO Guide for the described ' +
            'business or webpage content. Include keyword variations, related search terms, 3 SEO titles, ' +
            '3 meta descriptions, suggested SEO page slugs, and an outline/structure for the homepage ' +
            'or main content block. Use clean Markdown formatting.',
          user: `Business Description: ${v.business}\n${extra}`,
          maxTokens: 3000,
          temperature: 0.75,
        };
      },
      loading: {
        label: 'Building On-Page SEO Guide',
        messages: ['Analyzing niche queries…', 'Generating slug recommendations…', 'Drafting page hierarchy…'],
      },
      result: { title: 'On-Page SEO Brief', filename: 'onpage-seo-guide' },
    },
  },
  {
    id: 'seo-topical-map',
    name: 'Create Topical Map',
    description: "A handy tool that crafts a topical map for your blog, targeting specific keywords to enhance your blog's ranking.",
    icon: Network,
    config: {
      fields: [
        {
          name: 'keyword',
          label: 'Enter your target keyword',
          emoji: '🎯',
          type: 'text',
          required: true,
          requiredMsg: 'Please enter your target keyword.',
          placeholder: 'e.g., search engine optimization',
        },
        {
          name: 'count',
          label: 'Number of Titles you need?',
          emoji: '🔢',
          type: 'text',
          required: false,
          placeholder: 'Example: 10',
        },
        {
          name: 'instructions',
          label: 'Advanced Settings (optional)',
          emoji: '⚙️',
          type: 'text',
          required: false,
          placeholder: 'e.g. focus on beginner guides',
          advanced: true,
        },
      ],
      build: (v) => {
        const count = parseInt(v.count, 10) || 10;
        const extra = v.instructions ? `Advanced settings: ${v.instructions.trim()}` : '';
        return {
          system:
            `You are an SEO content architect. For the target keyword, construct a topical map to build domain ` +
            `authority. Outline primary category hubs, secondary clusters, and exactly ${count} sub-topics / article ideas ` +
            `that fully cover the search space. Use clear nested Markdown bullet hierarchy.`,
          user: `Target Keyword: ${v.keyword}\n${extra}`,
          maxTokens: 3000,
          temperature: 0.8,
        };
      },
      loading: {
        label: 'Building Topical Map',
        messages: ['Mapping keyword intersections…', 'Defining semantic nodes…', 'Formulating topic categories…'],
      },
      result: { title: 'Topical Authority Map', filename: 'topical-map' },
    },
  },
  {
    id: 'seo-ranking-guidelines',
    name: 'Ranking Guidelines for 1 Keyword',
    description: 'Improve your content strategy with targeted keyword guidelines, semantic SEO entities, and outline suggestions.',
    icon: Award,
    config: {
      fields: [
        {
          name: 'keyword',
          label: 'Enter your target keyword',
          emoji: '🎯',
          type: 'text',
          required: true,
          requiredMsg: 'Please enter your target keyword.',
          placeholder: 'e.g., remote project management software',
        },
      ],
      build: (v) => ({
        system:
          'You are an SEO ranking specialist. Provide complete ranking guidelines for targeting a single keyword. ' +
          'Include target audience profile, primary search intent, list of semantic SEO entities to include, ' +
          'related queries, recommended word count, H1/H2 header guidelines, and brief meta tag instructions. ' +
          'Use clean Markdown formatting.',
        user: `Keyword: ${v.keyword}`,
        maxTokens: 2500,
        temperature: 0.7,
      }),
      loading: {
        label: 'Generating Ranking Guidelines',
        messages: ['Analyzing search intent…', 'Extracting entities…', 'Formulating structural outlines…'],
      },
      result: { title: 'SEO Ranking Blueprint', filename: 'ranking-guidelines' },
    },
  },
  {
    id: 'seo-keyword-clustering',
    name: 'Keyword Clustering',
    description: 'Analyze keywords like a pro. It sorts and clusters keywords based on their search intent, and provides a list of long-tail keywords.',
    icon: Layers,
    config: {
      fields: [
        {
          name: 'keyword',
          label: 'Enter your target keyword',
          emoji: '🎯',
          type: 'text',
          required: true,
          requiredMsg: 'Please enter your target keyword.',
          placeholder: 'e.g., content marketing tools',
        },
        {
          name: 'instructions',
          label: 'Advanced Settings (optional)',
          emoji: '⚙️',
          type: 'text',
          required: false,
          placeholder: 'e.g. target B2B niche',
          advanced: true,
        },
      ],
      build: (v) => {
        const extra = v.instructions ? `Advanced instructions: ${v.instructions.trim()}` : '';
        return {
          system:
            'You are an SEO clustering expert. For the target keyword/topic, output clustered groups of terms. ' +
            'Group them by intent (Informational, Commercial, Transactional) and explain the cluster relationships. ' +
            'Present the output in clean Markdown with clear headings.',
          user: `Target Keyword: ${v.keyword}\n${extra}`,
          maxTokens: 3000,
          temperature: 0.75,
        };
      },
      loading: {
        label: 'Clustering keywords',
        messages: ['Grouping query intents…', 'Assigning intent scores…', 'Organizing cluster groups…'],
      },
      result: { title: 'Keyword Cluster Analysis', filename: 'keyword-clusters' },
    },
  },
  {
    id: 'seo-quora-answer',
    name: 'Quora Answer',
    description: 'Save time by generating Quora responses in a natural human-like style aligned with your niche.',
    icon: HelpCircle,
    config: {
      fields: [
        {
          name: 'brand',
          label: 'Product/Brand Name',
          emoji: '🏷️',
          type: 'text',
          required: true,
          requiredMsg: 'Please enter your brand/product name.',
          placeholder: 'Type your Product/Brand name here',
        },
        {
          name: 'niche',
          label: 'Describe Niche',
          emoji: '🏢',
          type: 'textarea',
          required: true,
          requiredMsg: 'Please describe the niche.',
          placeholder: 'Describe your Niche',
        },
        {
          name: 'question',
          label: 'Enter your Quora Question',
          emoji: '❓',
          type: 'textarea',
          required: true,
          requiredMsg: 'Please enter the question to answer.',
          placeholder: 'Paste the Quora question you want to answer here',
        },
      ],
      build: (v) => ({
        system:
          'You are a professional brand manager and copywriter. Write a highly informative, helpful, and natural ' +
          'Quora response for the given question. Subtly mention and advocate for the product/brand in a non-biased, ' +
          'organic way. Use an engaging, conversational, human-like voice. Use clean Markdown formatting.',
        user: `Brand/Product Name: ${v.brand}\nNiche: ${v.niche}\nQuora Question: ${v.question}`,
        maxTokens: 2500,
        temperature: 0.8,
      }),
      loading: {
        label: 'Generating Quora Response',
        messages: ['Analyzing Quora question…', 'Weaving brand organically…', 'Writing conversational copy…'],
      },
      result: { title: 'Draft Quora Answer', filename: 'quora-answer' },
    },
  },
];

// Registry-ready entries for the "SEO Tools" category.
export const SEO_TOOLS = DEFS.map((d) => ({
  id: d.id,
  name: d.name,
  description: d.description,
  category: 'SEO Tools',
  icon: d.icon,
  available: true,
  // eslint-disable-next-line react/display-name
  component: () => <FormTool config={{ icon: d.icon, title: d.name, description: d.description, ...d.config }} />,
}));
