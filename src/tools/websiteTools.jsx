import { Briefcase, Globe } from 'lucide-react';
import FormTool from './FormTool.jsx';
import { LANGUAGES } from './ToolShell.jsx';

// ─────────────────────────────────────────────────────────────────────────────
// Website Builder tools
//
// These tools ask the user a rich set of questions (tech stack, goals, design,
// sections, hosting, SEO …) and turn the answers into ONE complete, copy-paste
// build prompt they can hand to an AI web-app builder (v0, Cursor, Claude,
// ChatGPT, Bolt, Lovable, …) to actually generate the site.
// ─────────────────────────────────────────────────────────────────────────────

// ── Reusable option lists (lots of choices, as requested) ──
const FRONTEND = [
  'No preference',
  'Plain HTML, CSS & JavaScript',
  'React',
  'Next.js (React)',
  'Vue.js',
  'Nuxt (Vue)',
  'Svelte / SvelteKit',
  'Astro',
  'Angular',
  'SolidJS',
  'Remix',
  'Gatsby',
  'Qwik',
  'Preact',
  'Alpine.js',
  'jQuery',
  'Ember.js',
  'Lit (Web Components)',
  'Blazor (C#)',
  'Flutter Web',
  'HTMX',
  'Bootstrap (HTML/CSS)',
  'Tailwind + Vanilla',
  'Webflow (no-code)',
  'Framer (no-code)',
  'WordPress (theme)',
];

const BACKEND = [
  'None — static / frontend only',
  'No preference',
  'Node.js + Express',
  'Node.js + NestJS',
  'Node.js + Fastify',
  'Next.js API routes',
  'Python + FastAPI',
  'Python + Django',
  'Python + Flask',
  'PHP + Laravel',
  'PHP (plain)',
  'Ruby on Rails',
  'Java + Spring Boot',
  'Go (Golang)',
  'Go + Gin',
  'Rust (Axum / Actix)',
  'Elixir + Phoenix',
  'Kotlin + Ktor',
  '.NET / C#',
  'Firebase (Backend-as-a-Service)',
  'Supabase (Backend-as-a-Service)',
  'Appwrite',
  'PocketBase',
  'Strapi (Headless CMS)',
  'Sanity (Headless CMS)',
  'WordPress (Headless)',
  'GraphQL (Apollo)',
];

const DATABASE = [
  'None',
  'No preference',
  'PostgreSQL',
  'MySQL',
  'MongoDB',
  'SQLite',
  'MariaDB',
  'Redis',
  'Firebase Firestore',
  'Supabase (Postgres)',
  'PlanetScale',
  'DynamoDB',
];

const STYLING = [
  'Tailwind CSS',
  'shadcn/ui + Tailwind',
  'Plain CSS',
  'CSS Modules',
  'SCSS / Sass',
  'Styled Components',
  'Bootstrap',
  'Material UI (MUI)',
  'Chakra UI',
  'Ant Design',
  'Bulma',
  'No preference',
];

// Design styles shown as visual swatches so users can pick by look.
const DESIGN_VIBE = [
  { value: 'Minimal & clean', label: 'Minimal & clean', colors: ['#0f172a', '#f1f5f9'] },
  { value: 'Bold & modern', label: 'Bold & modern', colors: ['#4f46e5', '#ec4899'] },
  { value: 'Dark & techy', label: 'Dark & techy', colors: ['#0b1020', '#22d3ee'] },
  { value: 'Colorful & playful', label: 'Colorful & playful', colors: ['#f59e0b', '#ec4899', '#8b5cf6'] },
  { value: 'Elegant & luxury', label: 'Elegant & luxury', colors: ['#111827', '#c9a227'] },
  { value: 'Corporate & professional', label: 'Corporate & pro', colors: ['#1e3a8a', '#e2e8f0'] },
  { value: 'Glassmorphism', label: 'Glassmorphism', colors: ['#a5b4fc', '#f0abfc'] },
  { value: 'Neubrutalism', label: 'Neubrutalism', colors: ['#facc15', '#000000'] },
  { value: 'Retro / Y2K', label: 'Retro / Y2K', colors: ['#22d3ee', '#f472b6'] },
  { value: 'Warm & friendly', label: 'Warm & friendly', colors: ['#fb923c', '#fde68a'] },
  { value: 'Nature / earthy', label: 'Nature / earthy', colors: ['#166534', '#a3e635'] },
  { value: 'Monochrome B&W', label: 'Monochrome B&W', colors: ['#000000', '#ffffff'] },
  { value: 'Pastel / soft', label: 'Pastel / soft', colors: ['#c4b5fd', '#fbcfe8'] },
  { value: 'Cyberpunk / neon', label: 'Cyberpunk / neon', colors: ['#a21caf', '#22d3ee'] },
  { value: 'Editorial / magazine', label: 'Editorial', colors: ['#1c1917', '#f5f5f4'] },
];

// Named palettes shown as swatches (value stays descriptive for the prompt).
const PALETTE = [
  { value: 'Let the AI decide', label: 'Let AI decide', colors: ['#e2e8f0', '#94a3b8'] },
  { value: 'Indigo & Violet', label: 'Indigo & Violet', colors: ['#4f46e5', '#7c3aed', '#a78bfa'] },
  { value: 'Ocean Blue', label: 'Ocean Blue', colors: ['#0ea5e9', '#0369a1', '#bae6fd'] },
  { value: 'Emerald & Teal', label: 'Emerald & Teal', colors: ['#059669', '#14b8a6', '#a7f3d0'] },
  { value: 'Sunset Orange', label: 'Sunset Orange', colors: ['#ea580c', '#f59e0b', '#fed7aa'] },
  { value: 'Rose & Pink', label: 'Rose & Pink', colors: ['#e11d48', '#ec4899', '#fbcfe8'] },
  { value: 'Royal Purple', label: 'Royal Purple', colors: ['#6d28d9', '#a855f7', '#e9d5ff'] },
  { value: 'Slate Monochrome', label: 'Slate Mono', colors: ['#0f172a', '#475569', '#cbd5e1'] },
  { value: 'Black & Gold', label: 'Black & Gold', colors: ['#111827', '#c9a227', '#f5deb3'] },
  { value: 'Forest Green', label: 'Forest Green', colors: ['#14532d', '#16a34a', '#bbf7d0'] },
  { value: 'Crimson Red', label: 'Crimson Red', colors: ['#b91c1c', '#ef4444', '#fecaca'] },
  { value: 'Cyber Neon', label: 'Cyber Neon', colors: ['#0b1020', '#22d3ee', '#a21caf'] },
  { value: 'Warm Earth', label: 'Warm Earth', colors: ['#7c2d12', '#d97706', '#fde68a'] },
  { value: 'Sky & Cloud', label: 'Sky & Cloud', colors: ['#38bdf8', '#e0f2fe', '#f8fafc'] },
  { value: 'Custom (see colors field)', label: 'Custom', colors: ['#64748b', '#f1f5f9'] },
];

const COLOR_MODE = ['Light mode', 'Dark mode', 'Both (with a toggle)'];

const ANIMATION = [
  'None — clean & fast',
  'Minimal (gentle fade-ins)',
  'Subtle (scroll reveal + hover)',
  'Smooth (page transitions)',
  'Rich (parallax + micro-interactions)',
  'Playful (bouncy & springy)',
  'Cinematic (scroll-driven storytelling)',
  'Heavy (cursor, particles, 3D)',
];

const FONT_VIBE = [
  'Modern sans-serif',
  'Elegant serif',
  'Techy monospace',
  'Playful rounded',
  'Editorial serif + sans mix',
  'Bold display + clean body',
  'Handwritten / script accents',
  'No preference',
];

const HOSTING = [
  'No preference',
  'Vercel',
  'Netlify',
  'GitHub Pages',
  'Cloudflare Pages',
  'AWS',
  'Firebase Hosting',
  'Render',
  'Railway',
  'DigitalOcean',
  'cPanel / shared hosting',
];

const YES_NO = ['Yes', 'No'];

// 50+ professional titles (used as a datalist → pick a preset OR type custom).
const PROFESSIONAL_TITLES = [
  'Full Stack Developer', 'Frontend Developer', 'Backend Developer', 'Web Developer',
  'Mobile App Developer', 'iOS Developer', 'Android Developer', 'Software Engineer',
  'DevOps Engineer', 'Cloud Engineer', 'Game Developer', 'WordPress Developer',
  'Shopify Developer', 'QA / Test Engineer', 'Data Engineer', 'Machine Learning Engineer',
  'AI Engineer', 'Data Scientist', 'Data Analyst', 'Blockchain Developer',
  'Embedded Systems Engineer', 'Site Reliability Engineer', 'Security Engineer',
  'Systems Administrator', 'Database Administrator', 'UI/UX Designer', 'Product Designer',
  'Graphic Designer', 'Web Designer', 'Visual Designer', 'Motion Designer', 'Brand Designer',
  'Illustrator', '3D Artist', 'Interaction Designer', 'Product Manager', 'Project Manager',
  'Scrum Master', 'Business Analyst', 'Technical Writer', 'Digital Marketer', 'SEO Specialist',
  'Content Writer', 'Copywriter', 'Social Media Manager', 'Content Creator', 'Growth Marketer',
  'Marketing Manager', 'Brand Strategist', 'Photographer', 'Videographer', 'Video Editor',
  'YouTuber', 'Podcaster', 'Animator', 'Music Producer', 'Voice-Over Artist', 'Freelancer',
  'Consultant', 'Entrepreneur', 'Founder / CEO', 'Virtual Assistant', 'Coach / Mentor',
  'Architect', 'Interior Designer', 'Financial Advisor', 'Real Estate Agent', 'Lawyer',
  'Doctor', 'Teacher / Educator', 'Writer / Author', 'Fitness Trainer', 'Chef',
];

// Industry / niche suggestions (used for business portfolios and websites).
const INDUSTRIES = [
  'Technology / SaaS', 'E-commerce / Retail', 'Health & Wellness', 'Fitness & Gym',
  'Food & Restaurant', 'Real Estate', 'Finance / Fintech', 'Education / E-learning',
  'Travel & Hospitality', 'Beauty & Fashion', 'Marketing / Agency', 'Legal',
  'Medical / Healthcare', 'Construction / Home services', 'Nonprofit', 'Entertainment / Media',
  'Automotive', 'Photography / Creative', 'Consulting', 'Manufacturing',
];

const language = {
  name: 'language',
  label: 'Output Language',
  type: 'select',
  advanced: true,
  default: 'English',
  options: LANGUAGES,
};

// Only add a line when the user actually filled the field in.
const line = (label, value) => {
  const v = (value ?? '').toString().trim();
  return v ? `${label}: ${v}\n` : '';
};

// Shared design/style fields reused by both tools (as swatches + selects).
const designFields = [
  {
    name: 'designVibe',
    label: 'Design style / vibe',
    emoji: '🎨',
    type: 'swatch',
    default: 'Minimal & clean',
    options: DESIGN_VIBE,
  },
  {
    name: 'palette',
    label: 'Color palette',
    emoji: '🌈',
    type: 'swatch',
    default: 'Let the AI decide',
    options: PALETTE,
  },
  {
    name: 'colorMode',
    label: 'Light or dark mode',
    emoji: '🌗',
    type: 'select',
    default: 'Both (with a toggle)',
    options: COLOR_MODE,
  },
  {
    name: 'animations',
    label: 'Animation level',
    emoji: '✨',
    type: 'select',
    default: 'Subtle (scroll reveal + hover)',
    options: ANIMATION,
  },
];

const DEFS = [
  // ── Portfolio website ──
  {
    id: 'site-portfolio',
    name: 'Portfolio Website Prompt',
    description:
      'Answer a few questions about you or your business, your work and your style, and get one complete, copy-paste build prompt for a professional portfolio website.',
    icon: Briefcase,
    config: {
      submitLabel: 'Generate Portfolio Prompt',
      fields: [
        {
          name: 'entity',
          label: 'Personal or business portfolio?',
          emoji: '🧷',
          type: 'select',
          default: 'Personal',
          options: ['Personal', 'Business / Brand'],
        },
        {
          name: 'name',
          label: 'Your name or business name',
          emoji: '👤',
          type: 'text',
          required: true,
          requiredMsg: 'Please enter your name or business name.',
          placeholder: 'e.g., Alex Johnson  /  Pixel Studio',
        },
        {
          name: 'role',
          label: 'Professional title (pick one or type your own)',
          emoji: '💼',
          type: 'datalist',
          showIf: (v) => v.entity !== 'Business / Brand',
          placeholder: 'e.g., Full Stack Developer',
          options: PROFESSIONAL_TITLES,
        },
        {
          name: 'businessType',
          label: 'What does your business do? / Industry',
          emoji: '🏢',
          type: 'datalist',
          showIf: (v) => v.entity === 'Business / Brand',
          placeholder: 'e.g., Fitness studio, SaaS for accountants, coffee brand…',
          options: INDUSTRIES,
        },
        {
          name: 'frontend',
          label: 'Frontend technology',
          emoji: '🖥️',
          type: 'select',
          default: 'Next.js (React)',
          options: FRONTEND,
        },
        {
          name: 'backend',
          label: 'Backend technology',
          emoji: '⚙️',
          type: 'select',
          default: 'None — static / frontend only',
          options: BACKEND,
        },
        {
          name: 'goal',
          label: 'Primary goal',
          emoji: '🎯',
          type: 'select',
          default: 'All of the above',
          options: [
            'Get a full-time job',
            'Land remote work',
            'Attract recruiters',
            'Get freelance clients',
            'Showcase personal projects',
            'Build a personal brand',
            'Switch careers',
            'Get internships',
            'Promote my business / agency',
            'Generate leads & enquiries',
            'Sell products / services',
            'Build credibility & authority',
            'Attract investors',
            'Showcase client work / case studies',
            'All of the above',
          ],
        },
        {
          name: 'audience',
          label: 'Target audience',
          emoji: '🧑‍🤝‍🧑',
          type: 'select',
          default: 'A mix of everyone',
          options: [
            'Recruiters & hiring managers',
            'Startup founders',
            'Tech companies',
            'Agencies',
            'Direct freelance clients',
            'Small business owners',
            'Enterprise / corporate clients',
            'Investors',
            'Fellow developers / peers',
            'Local customers',
            'General public',
            'A mix of everyone',
          ],
        },
        ...designFields,
        {
          name: 'about',
          label: 'About you / your business (2–3 sentences)',
          emoji: '📝',
          type: 'textarea',
          rows: 3,
          placeholder:
            'e.g., I’m a full stack developer with 5 years building SaaS products. I care about clean UX and fast, accessible interfaces…',
        },
        {
          name: 'projects',
          label: 'Projects to showcase (name, what it solves, tech, live/GitHub link)',
          emoji: '🚀',
          type: 'textarea',
          rows: 4,
          placeholder:
            '1) TaskFlow — team task manager, React + Node + Postgres, https://taskflow.app / github.com/…\n2) …',
        },
        {
          name: 'skills',
          label: 'Your skills (languages, frameworks, tools)',
          emoji: '🛠️',
          type: 'textarea',
          rows: 3,
          placeholder: 'e.g., JavaScript, TypeScript, React, Node.js, PostgreSQL, Figma, AWS…',
        },
        // ── Advanced ──
        {
          name: 'layout',
          label: 'Layout',
          type: 'select',
          advanced: true,
          default: 'Single-page scrolling',
          options: ['Single-page scrolling', 'Multi-page with a nav bar'],
        },
        {
          name: 'styling',
          label: 'Styling / UI library',
          type: 'select',
          advanced: true,
          default: 'Tailwind CSS',
          options: STYLING,
        },
        {
          name: 'font',
          label: 'Typography vibe',
          type: 'select',
          advanced: true,
          default: 'Modern sans-serif',
          options: FONT_VIBE,
        },
        {
          name: 'database',
          label: 'Database (if any)',
          type: 'select',
          advanced: true,
          default: 'None',
          options: DATABASE,
        },
        {
          name: 'colors',
          label: 'Custom colors / hex (optional)',
          type: 'text',
          advanced: true,
          placeholder: 'e.g., #0F172A / #3B82F6',
        },
        {
          name: 'experience',
          label: 'Experience, education, certifications',
          type: 'textarea',
          advanced: true,
          rows: 3,
          placeholder: 'Companies, roles & dates; degrees; certifications/awards…',
        },
        {
          name: 'extras',
          label: 'Extra sections & features',
          type: 'textarea',
          advanced: true,
          rows: 3,
          placeholder:
            'e.g., downloadable resume button, blog, testimonials, "Available for hire" badge, tagline, currently-learning…',
        },
        {
          name: 'contact',
          label: 'Contact & social links',
          type: 'text',
          advanced: true,
          placeholder: 'e.g., contact form (EmailJS) + LinkedIn, GitHub, Twitter/X, Dribbble',
        },
        {
          name: 'hosting',
          label: 'Hosting preference',
          type: 'select',
          advanced: true,
          default: 'No preference',
          options: HOSTING,
        },
        {
          name: 'seo',
          label: 'SEO & analytics important?',
          type: 'select',
          advanced: true,
          default: 'Yes',
          options: YES_NO,
        },
        language,
      ],
      build: (v) => ({
        system:
          'You are an expert prompt engineer who writes detailed, ready-to-use build prompts for ' +
          'AI web-app builders (v0, Cursor, Claude, ChatGPT, Bolt, Lovable). From the answers ' +
          `below, write ONE complete, copy-paste-ready build prompt (in ${v.language}) that ` +
          `instructs an AI to build a professional ${v.entity === 'Business / Brand' ? 'business/brand' : 'personal'} ` +
          'portfolio website. The prompt you write must, in clean Markdown, clearly specify: the ' +
          'goal & target audience; the exact tech stack (frontend, backend, styling, database, ' +
          'hosting); the full page/section structure and what each section contains; the projects ' +
          'to feature; skills, experience & education; the visual design (style, color palette, ' +
          'typography, light/dark, animation level); mobile/tablet/desktop responsiveness; ' +
          'accessibility; SEO meta tags & Open Graph; and every requested extra (resume button, ' +
          'blog, testimonials, contact form, social links, availability badge). Fill any blanks ' +
          'with sensible, modern defaults. End with a short "Acceptance criteria" checklist. ' +
          'Output ONLY the build prompt — no preamble or explanation.',
        user:
          line('Portfolio type', v.entity) +
          line('Name / brand', v.name) +
          line('Professional title', v.role) +
          line('Business / industry', v.businessType) +
          line('Frontend', v.frontend) +
          line('Backend', v.backend) +
          line('Database', v.database) +
          line('Styling / UI library', v.styling) +
          line('Primary goal', v.goal) +
          line('Target audience', v.audience) +
          line('About', v.about) +
          line('Projects', v.projects) +
          line('Skills', v.skills) +
          line('Experience & education', v.experience) +
          line('Layout', v.layout) +
          line('Design vibe', v.designVibe) +
          line('Color palette', v.palette) +
          line('Custom colors', v.colors) +
          line('Typography', v.font) +
          line('Color mode', v.colorMode) +
          line('Animation level', v.animations) +
          line('Extra sections & features', v.extras) +
          line('Contact & social', v.contact) +
          line('Hosting', v.hosting) +
          line('SEO & analytics important', v.seo),
        maxTokens: 3200,
        temperature: 0.7,
      }),
      loading: {
        label: 'Building your portfolio prompt',
        messages: [
          'Locking in your tech stack…',
          'Structuring the sections…',
          'Detailing the design system…',
          'Adding SEO & responsiveness…',
          'Writing acceptance criteria…',
        ],
      },
      result: { title: 'Portfolio Build Prompt', filename: 'portfolio-build-prompt' },
    },
  },

  // ── General / common website ──
  {
    id: 'site-website',
    name: 'Website Builder Prompt',
    description:
      'For business, landing, SaaS, e-commerce, blog and more. Pick your goal, pages, tech stack and style, and get one complete build prompt ready to hand to an AI builder.',
    icon: Globe,
    config: {
      submitLabel: 'Generate Website Prompt',
      fields: [
        {
          name: 'brand',
          label: 'Your name or business name',
          emoji: '🏢',
          type: 'text',
          required: true,
          requiredMsg: 'Please enter your name or business name.',
          placeholder: 'e.g., Bloom Yoga Studio',
        },
        {
          name: 'siteType',
          label: 'What kind of website?',
          emoji: '🌐',
          type: 'select',
          default: 'Business / company site',
          options: [
            'Business / company site',
            'Landing page',
            'SaaS product site',
            'Startup site',
            'E-commerce store',
            'Blog / magazine',
            'Agency / studio',
            'Portfolio / creative',
            'Restaurant / café',
            'Personal / creator site',
            'Nonprofit / community',
            'Membership / community',
            'Event / conference',
            'Course / education',
            'Directory / listing',
            'Booking / appointments',
            'Real estate',
            'Medical / clinic',
            'Fitness / gym',
            'Photography',
            'Wedding / event',
            'Documentation / knowledge base',
          ],
        },
        {
          name: 'oneLiner',
          label: 'One-line description',
          emoji: '🎯',
          type: 'text',
          placeholder: 'e.g., A booking site for a boutique yoga studio in Austin',
        },
        {
          name: 'primaryAction',
          label: 'The #1 action a visitor should take',
          emoji: '👉',
          type: 'select',
          default: 'Contact / enquire',
          options: [
            'Contact / enquire',
            'Buy a product',
            'Sign up / create account',
            'Book an appointment',
            'Subscribe (newsletter)',
            'Join a waitlist',
            'Download something',
            'Request a demo',
            'Apply / submit a form',
            'Donate',
            'Watch a video / demo',
            'Just browse / learn',
          ],
        },
        {
          name: 'frontend',
          label: 'Frontend technology',
          emoji: '🖥️',
          type: 'select',
          default: 'Next.js (React)',
          options: FRONTEND,
        },
        {
          name: 'backend',
          label: 'Backend technology',
          emoji: '⚙️',
          type: 'select',
          default: 'No preference',
          options: BACKEND,
        },
        {
          name: 'audience',
          label: 'Target audience (pick one or type your own)',
          emoji: '🧑‍🤝‍🧑',
          type: 'datalist',
          placeholder: 'e.g., small-business owners, 25–45, not very technical',
          options: [
            'Small business owners',
            'Startups & founders',
            'Enterprise / corporate clients',
            'Other businesses (B2B)',
            'General consumers (B2C)',
            'Young adults (18–30)',
            'Professionals (30–50)',
            'Parents & families',
            'Students',
            'Local customers / community',
            'Global / international audience',
            'Tech-savvy users',
            'Non-technical users',
            'Investors',
            'Nonprofits / donors',
            'Everyone / general public',
          ],
        },
        {
          name: 'industry',
          label: 'Industry / niche (pick or type)',
          emoji: '🏷️',
          type: 'datalist',
          placeholder: 'e.g., Fitness, SaaS, Real estate…',
          options: INDUSTRIES,
        },
        ...designFields,
        {
          name: 'pages',
          label: 'Pages / sections you need',
          emoji: '📄',
          type: 'textarea',
          rows: 3,
          placeholder: 'e.g., Home, About, Services, Pricing, Blog, Contact',
        },
        {
          name: 'features',
          label: 'Functionality needed',
          emoji: '🧩',
          type: 'textarea',
          rows: 3,
          placeholder:
            'e.g., contact form, user login/auth, payments (Stripe), CMS for blog, search, live chat, maps…',
        },
        // ── Advanced ──
        {
          name: 'styling',
          label: 'Styling / UI library',
          type: 'select',
          advanced: true,
          default: 'Tailwind CSS',
          options: STYLING,
        },
        {
          name: 'database',
          label: 'Database (if any)',
          type: 'select',
          advanced: true,
          default: 'No preference',
          options: DATABASE,
        },
        {
          name: 'font',
          label: 'Typography vibe',
          type: 'select',
          advanced: true,
          default: 'Modern sans-serif',
          options: FONT_VIBE,
        },
        {
          name: 'colors',
          label: 'Custom colors / hex (optional)',
          type: 'text',
          advanced: true,
          placeholder: 'e.g., #16A34A / #0F172A',
        },
        {
          name: 'integrations',
          label: 'Third-party integrations',
          type: 'text',
          advanced: true,
          placeholder: 'e.g., Stripe, Calendly, Mailchimp, Google Maps, Intercom',
        },
        {
          name: 'contact',
          label: 'How should visitors reach you? / form destination',
          type: 'text',
          advanced: true,
          placeholder: 'e.g., contact form → email via Resend; WhatsApp; phone',
        },
        {
          name: 'hosting',
          label: 'Hosting preference',
          type: 'select',
          advanced: true,
          default: 'No preference',
          options: HOSTING,
        },
        {
          name: 'seo',
          label: 'SEO important (rank on Google)?',
          type: 'select',
          advanced: true,
          default: 'Yes',
          options: YES_NO,
        },
        {
          name: 'analytics',
          label: 'Add visitor analytics?',
          type: 'select',
          advanced: true,
          default: 'Yes',
          options: YES_NO,
        },
        language,
      ],
      build: (v) => ({
        system:
          'You are an expert prompt engineer who writes detailed, ready-to-use build prompts for ' +
          'AI web-app builders (v0, Cursor, Claude, ChatGPT, Bolt, Lovable). From the answers ' +
          `below, write ONE complete, copy-paste-ready build prompt (in ${v.language}) that ` +
          'instructs an AI to build the described website. The prompt you write must, in clean ' +
          'Markdown, clearly specify: the purpose & the single primary call-to-action; the target ' +
          'audience; the exact tech stack (frontend, backend, styling, database, hosting); the ' +
          'full page/section structure and what each page contains; required functionality & ' +
          'third-party integrations; the visual design (style, color palette, typography, ' +
          'light/dark, animation level); mobile/tablet/desktop responsiveness; performance; ' +
          'accessibility; SEO meta tags, Open Graph & sitemap; analytics; and security basics ' +
          '(SSL, form validation, privacy). Fill any blanks with sensible, modern defaults. End ' +
          'with a short "Acceptance criteria" checklist. Output ONLY the build prompt — no ' +
          'preamble or explanation.',
        user:
          line('Name / brand', v.brand) +
          line('Website type', v.siteType) +
          line('Industry / niche', v.industry) +
          line('One-line description', v.oneLiner) +
          line('Primary call-to-action', v.primaryAction) +
          line('Target audience', v.audience) +
          line('Pages / sections', v.pages) +
          line('Frontend', v.frontend) +
          line('Backend', v.backend) +
          line('Database', v.database) +
          line('Styling / UI library', v.styling) +
          line('Functionality', v.features) +
          line('Third-party integrations', v.integrations) +
          line('Design vibe', v.designVibe) +
          line('Color palette', v.palette) +
          line('Custom colors', v.colors) +
          line('Typography', v.font) +
          line('Color mode', v.colorMode) +
          line('Animation level', v.animations) +
          line('Contact / form destination', v.contact) +
          line('Hosting', v.hosting) +
          line('SEO important', v.seo) +
          line('Analytics', v.analytics),
        maxTokens: 3200,
        temperature: 0.7,
      }),
      loading: {
        label: 'Building your website prompt',
        messages: [
          'Framing the goal & CTA…',
          'Mapping pages & features…',
          'Locking in the tech stack…',
          'Detailing the design system…',
          'Adding SEO, performance & security…',
        ],
      },
      result: { title: 'Website Build Prompt', filename: 'website-build-prompt' },
    },
  },
];

// Registry-ready entries for the "Website Builder" category.
export const WEBSITE_TOOLS = DEFS.map((d) => ({
  id: d.id,
  name: d.name,
  description: d.description,
  category: 'Website Builder',
  icon: d.icon,
  available: true,
  // eslint-disable-next-line react/display-name
  component: () => <FormTool config={{ icon: d.icon, title: d.name, description: d.description, ...d.config }} />,
}));
