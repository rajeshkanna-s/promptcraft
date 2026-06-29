import { Image } from 'lucide-react';
import FormTool from './FormTool.jsx';

const DEFS = [
  {
    id: 'img-logo-ideas',
    name: 'Logo Design Ideas',
    description: 'Looking for a Unique Logo? Get Inspired with Our Ideas.',
    icon: Image,
    config: {
      fields: [
        {
          name: 'brandName',
          label: 'Brand Name',
          emoji: '🏷️',
          type: 'text',
          required: true,
          requiredMsg: 'Please enter your brand name.',
          placeholder: 'e.g., PromptCraft, EcoBrew',
        },
        {
          name: 'about',
          label: 'What does your company or brand do?',
          emoji: '💡',
          type: 'textarea',
          required: true,
          requiredMsg: 'Please describe what your brand does.',
          placeholder: 'e.g., A modern SaaS tool for AI copywriters, A cozy organic coffee shop',
        },
        {
          name: 'style',
          label: 'Preferred Logo Style',
          emoji: '🎨',
          type: 'select',
          required: true,
          options: [
            { value: 'minimalist', label: 'Minimalist & Clean' },
            { value: 'mascot', label: 'Mascot or Character' },
            { value: 'vintage', label: 'Vintage / Emblem' },
            { value: 'abstract', label: 'Abstract / Geometric' },
            { value: 'monogram', label: 'Monogram / Lettermark' },
          ],
          default: 'minimalist',
        },
      ],
      build: (v) => ({
        system:
          'You are a professional brand designer and AI image prompt expert. Create 5 distinct, high-quality ' +
          'Midjourney/DALL-E 3 image generation prompts for the specified brand name and style. For each option, ' +
          'provide a descriptive prompt, a brief rationale behind the visual metaphors, and suggested color hex codes. ' +
          'Format in clean Markdown.',
        user: `Brand Name: ${v.brandName}\nCompany Description: ${v.about}\nPreferred Style: ${v.style}`,
        maxTokens: 2500,
        temperature: 0.8,
      }),
      loading: {
        label: 'Designing Logo Concepts',
        messages: ['Analyzing brand values…', 'Brainstorming geometric symbols…', 'Drafting prompt tokens…'],
      },
      result: { title: 'Logo Design Prompts', filename: 'logo-prompts' },
    },
  },
  {
    id: 'img-coloring-book',
    name: 'Coloring Book Image Prompts Generator',
    description: 'Create Fun Coloring Page Ideas',
    icon: Image,
    config: {
      fields: [
        {
          name: 'subject',
          label: 'What is the theme or subject of the coloring page?',
          emoji: '🦄',
          type: 'textarea',
          required: true,
          requiredMsg: 'Please enter the coloring book subject.',
          placeholder: 'e.g., a friendly dragon reading a book under a tree, a magical unicorn jumping over a rainbow',
        },
        {
          name: 'targetAge',
          label: 'Target Age Group',
          emoji: '👶',
          type: 'select',
          required: true,
          options: [
            { value: 'toddlers', label: 'Toddlers (thick lines, simple shapes)' },
            { value: 'kids', label: 'Kids aged 5-10 (moderate detail, cute elements)' },
            { value: 'adults', label: 'Adults / Teens (intricate mandalas, high detail)' },
          ],
          default: 'kids',
        },
      ],
      build: (v) => ({
        system:
          'You are an illustrator and coloring book publisher. Create 3 highly optimized AI image prompts ' +
          '(suitable for Midjourney or DALL-E) that generate clean black-and-white coloring pages. Include phrases ' +
          'like "black and white outline, pure white background, thick lines, no shading" depending on the target age group. ' +
          'Output the prompts inside code blocks and explain why they will produce clean results. Format in clean Markdown.',
        user: `Coloring Page Subject: ${v.subject}\nTarget Age: ${v.targetAge}`,
        maxTokens: 2000,
        temperature: 0.8,
      }),
      loading: {
        label: 'Creating Coloring Page Prompts',
        messages: ['Setting linework constraints…', 'Adding negative prompts (no shading)…', 'Polishing prompt templates…'],
      },
      result: { title: 'Coloring Book Prompts', filename: 'coloring-book-prompts' },
    },
  },
  {
    id: 'img-realistic-portrait',
    name: 'Realistic Portrait Image Prompts',
    description: 'Bring Your Imagination to Life with Tailored Real-Life Image Prompts.',
    icon: Image,
    config: {
      fields: [
        {
          name: 'desc',
          label: 'Describe the person or character',
          emoji: '👤',
          type: 'textarea',
          required: true,
          requiredMsg: 'Please describe the portrait subject.',
          placeholder: 'e.g., An elderly sailor with wrinkled skin, weathered eyes, and a white beard, wearing a woolen cap',
        },
        {
          name: 'lighting',
          label: 'Lighting & Atmosphere Style',
          emoji: '💡',
          type: 'select',
          required: true,
          options: [
            { value: 'cinematic', label: 'Cinematic / Dramatic (chiaroscuro, side-lit)' },
            { value: 'golden-hour', label: 'Golden Hour (warm, soft sunlight)' },
            { value: 'studio', label: 'Studio Lighting (clean, softbox, professional)' },
            { value: 'neon', label: 'Neon / Cyberpunk (vibrant contrast colors)' },
          ],
          default: 'cinematic',
        },
      ],
      build: (v) => ({
        system:
          'You are a portrait photographer and prompt architect. Design 3 detailed, hyper-realistic photo prompts ' +
          'for Midjourney v6/DALL-E 3 based on the character description. Use specific photography terminology ' +
          '(e.g., focal length 85mm, f/1.8 lens, detailed skin texture, raw photo, realistic lighting style). ' +
          'Format the prompts inside copyable markdown blockquotes and provide configuration instructions. Format in clean Markdown.',
        user: `Character Description: ${v.desc}\nLighting Style: ${v.lighting}`,
        maxTokens: 2200,
        temperature: 0.85,
      }),
      loading: {
        label: 'Constructing Portrait Prompts',
        messages: ['Choosing lens and camera specs…', 'Optimizing lighting parameters…', 'Finalizing details…'],
      },
      result: { title: 'Portrait Image Prompts', filename: 'portrait-prompts' },
    },
  },
  {
    id: 'img-ai-art',
    name: 'AI Art',
    description: 'Translate Your Thoughts into Striking Visual Art',
    icon: Image,
    config: {
      fields: [
        {
          name: 'idea',
          label: 'What is your creative concept or idea?',
          emoji: '💭',
          type: 'textarea',
          required: true,
          requiredMsg: 'Please enter your art concept.',
          placeholder: 'e.g., an underwater city made of glowing jellyfish and stained glass, surrealist dreamscape',
        },
        {
          name: 'style',
          label: 'Artistic Style / Movement',
          emoji: '🖌️',
          type: 'select',
          required: true,
          options: [
            { value: 'surrealism', label: 'Surrealism (Dali, Magritte style)' },
            { value: 'cyberpunk', label: 'Cyberpunk / Synthwave' },
            { value: 'watercolor', label: 'Dreamy Watercolor' },
            { value: 'oil-painting', label: 'Classical Oil Painting (Rembrandt/Impressionism)' },
            { value: 'digital-illustration', label: 'Modern Flat Digital Illustration' },
            { value: 'anime', label: 'Detailed Anime/Manga Art' },
          ],
          default: 'surrealism',
        },
      ],
      build: (v) => ({
        system:
          'You are a digital artist. Turn the user\'s creative concept into 3 premium AI art prompts. ' +
          'Incorporate style-specific keywords, textures, camera techniques, and color palettes. Write ' +
          'each prompt inside a copyable code block followed by tips to run it. Format in clean Markdown.',
        user: `Concept Idea: ${v.idea}\nArt Style: ${v.style}`,
        maxTokens: 2500,
        temperature: 0.9,
      }),
      loading: {
        label: 'Generating AI Art Prompts',
        messages: ['Blending art movement details…', 'Formulating stylistic keywords…', 'Refining texture prompts…'],
      },
      result: { title: 'Artistic Prompts', filename: 'artistic-prompts' },
    },
  },
  {
    id: 'img-book-prompt',
    name: 'Image Prompt Creator for Books',
    description: 'Transform Words Into Images for Your Story Instantly.',
    icon: Image,
    config: {
      fields: [
        {
          name: 'genre',
          label: 'Book Genre',
          emoji: '📖',
          type: 'text',
          required: true,
          requiredMsg: 'Please enter the book genre.',
          placeholder: 'e.g., Fantasy, Sci-Fi, Romance, Mystery',
        },
        {
          name: 'scene',
          label: 'Describe the scene or character you want to visualize',
          emoji: '🎭',
          type: 'textarea',
          required: true,
          requiredMsg: 'Please describe the book scene.',
          placeholder: 'e.g., An ancient wizard holding a glowing staff standing at the edge of a crumbling cliff face',
        },
      ],
      build: (v) => ({
        system:
          'You are a book cover designer and illustrator. Create 3 highly descriptive prompts (Midjourney/DALL-E) ' +
          'tailored specifically to the book genre and scene description. Ensure the prompts generate book cover/illustration ' +
          'level quality, specifying aspect ratios (e.g. --ar 2:3 for book covers) and mood keywords. Format in clean Markdown.',
        user: `Genre: ${v.genre}\nScene Details: ${v.scene}`,
        maxTokens: 2500,
        temperature: 0.8,
      }),
      loading: {
        label: 'Creating Book Illustration Prompts',
        messages: ['Setting cover ratios…', 'Tuning composition weight…', 'Drafting prompts…'],
      },
      result: { title: 'Book Illustration Prompts', filename: 'book-illustration-prompts' },
    },
  },
  {
    id: 'img-headshot-prompts',
    name: 'Professional Headshot Image Prompts',
    description: 'Custom-Made Realistic Headshots at Your Fingertips.',
    icon: Image,
    config: {
      fields: [
        {
          name: 'gender',
          label: 'Gender / Appearance Details',
          emoji: '👥',
          type: 'text',
          required: true,
          requiredMsg: 'Please enter general appearance/gender.',
          placeholder: 'e.g., Professional woman in her late 30s, short brown hair',
        },
        {
          name: 'profession',
          label: 'Profession / Industry Style',
          emoji: '💼',
          type: 'select',
          required: true,
          options: [
            { value: 'corporate', label: 'Corporate / Finance (suit, office background)' },
            { value: 'creative', label: 'Creative / Tech (smart casual, warm studio background)' },
            { value: 'academic', label: 'Academic / Medical (professional lab coat, library background)' },
          ],
          default: 'corporate',
        },
      ],
      build: (v) => ({
        system:
          'You are a professional corporate photographer. Write 3 detailed prompts to generate high-quality headshots ' +
          'for LinkedIn profiles or company sites. Include parameters like camera type (Canon EOS R5, 85mm f/1.4 lens), ' +
          'studio lighting setups, smart attire, confident expression, and soft depth of field background. Format in clean Markdown.',
        user: `Subject Details: ${v.gender}\nProfession Focus: ${v.profession}`,
        maxTokens: 2200,
        temperature: 0.75,
      }),
      loading: {
        label: 'Drafting Headshot Prompts',
        messages: ['Simulating camera focus…', 'Drafting studio lighting…', 'Polishing headshot prompts…'],
      },
      result: { title: 'Professional Headshot Prompts', filename: 'headshot-prompts' },
    },
  },
  {
    id: 'img-print-design',
    name: 'Print design prompts',
    description: 'Generate Creative Designs for Merchandise.',
    icon: Image,
    config: {
      fields: [
        {
          name: 'item',
          label: 'What merchandise is this for?',
          emoji: '👕',
          type: 'select',
          required: true,
          options: [
            { value: 'tshirt', label: 'T-Shirt Print' },
            { value: 'mug', label: 'Coffee Mug Design' },
            { value: 'poster', label: 'Wall Poster' },
            { value: 'sticker', label: 'Sticker / Decal' },
          ],
          default: 'tshirt',
        },
        {
          name: 'concept',
          label: 'Describe the design concept or slogan',
          emoji: '💡',
          type: 'textarea',
          required: true,
          requiredMsg: 'Please enter the design concept.',
          placeholder: 'e.g., retro 90s gaming controller with the quote "Game Over", botanical floral drawing',
        },
      ],
      build: (v) => ({
        system:
          'You are a merchandise product designer. Generate 3 highly optimized image prompts (Midjourney/DALL-E) ' +
          'to create vector-like, isolated merchandise prints. Include keywords like "isolated on white background, ' +
          'vector graphic style, vector illustration, screen printing style, vibrant color, t-shirt design mockup" ' +
          'to ensure ease of editing. Format in clean Markdown.',
        user: `Merchandise: ${v.item}\nConcept: ${v.concept}`,
        maxTokens: 2200,
        temperature: 0.8,
      }),
      loading: {
        label: 'Designing Print Prompts',
        messages: ['Adding vector constraints…', 'Refining print style settings…', 'Finalizing design prompts…'],
      },
      result: { title: 'Merchandise Print Prompts', filename: 'print-design-prompts' },
    },
  },
  {
    id: 'img-whiteboard-visuals',
    name: 'Whiteboard Visuals Generator',
    description: 'Create Compelling Texts and Visuals for your Animation Scenes.',
    icon: Image,
    config: {
      fields: [
        {
          name: 'topic',
          label: 'What is the scene or topic about?',
          emoji: '✏️',
          type: 'textarea',
          required: true,
          requiredMsg: 'Please enter the whiteboard scene/topic.',
          placeholder: 'e.g., Explaining the concept of blockchain to a beginner, showing user growth statistics',
        },
      ],
      build: (v) => ({
        system:
          'You are a whiteboard animator. Based on the topic, outline 5 storyboard scenes. For each scene, ' +
          'provide: 1) Visual description (exactly what is drawn on the board), 2) On-screen text (key words), ' +
          '3) Narrative voiceover script, and 4) A Midjourney prompt to generate clean black-and-white whiteboard ' +
          'illustration style assets ("whiteboard illustration, simple black marker drawing, hand drawn, isolated white background"). ' +
          'Format in clean Markdown.',
        user: `Whiteboard Topic: ${v.topic}`,
        maxTokens: 2500,
        temperature: 0.8,
      }),
      loading: {
        label: 'Generating Whiteboard Scenes',
        messages: ['Outlining animation sequence…', 'Formulating marker drawings…', 'Drafting prompt lines…'],
      },
      result: { title: 'Whiteboard Storyboard & Prompts', filename: 'whiteboard-visuals' },
    },
  },
];

// Registry-ready entries for the "Image Prompts" category.
export const IMAGE_TOOLS = DEFS.map((d) => ({
  id: d.id,
  name: d.name,
  description: d.description,
  category: 'Image Prompts',
  icon: d.icon,
  available: true,
  // eslint-disable-next-line react/display-name
  component: () => <FormTool config={{ icon: d.icon, title: d.name, description: d.description, ...d.config }} />,
}));
