import { BookOpen } from 'lucide-react';
import FormTool from './FormTool.jsx';

const genres = [
  { id: 'nonfiction', name: 'Nonfiction Book Title Generator', genre: 'Nonfiction' },
  { id: 'children', name: "Children's Book Title Generator", genre: "Children's / Kids" },
  { id: 'fantasy', name: 'Fantasy Book Title Generator', genre: 'Fantasy / Magic' },
  { id: 'romance', name: 'Romance Book Title Generator', genre: 'Romance / Love Story' },
  { id: 'scifi', name: 'Science Fiction Book Title Generator', genre: 'Science Fiction / Cyberpunk / Space Opera' },
  { id: 'mystery', name: 'Mystery Book Title Generator', genre: 'Mystery / Detective' },
  { id: 'crime', name: 'Crime Book Title Generator', genre: 'Crime / Thriller' },
  { id: 'biography', name: 'Biography Book Title Generator', genre: 'Biography / Memoir' },
  { id: 'horror', name: 'Horror Book Title Generator', genre: 'Horror / Paranormal / Suspense' },
  { id: 'historical', name: 'Historical Fiction Book Title Generator', genre: 'Historical Fiction' },
  { id: 'poem', name: 'Poem Title Generator', genre: 'Poetry' },
];

const DEFS = [
  {
    id: 'book-kids-story-gen',
    name: 'Kids Story Book Content Generator',
    description: 'Start Creating Imaginative Kids Stories Instantly.',
    icon: BookOpen,
    config: {
      fields: [
        {
          name: 'theme',
          label: 'What is the theme or moral of the story?',
          emoji: '🎈',
          type: 'text',
          required: true,
          requiredMsg: 'Please enter the story theme.',
          placeholder: 'e.g., sharing is caring, kindness to animals',
        },
        {
          name: 'characters',
          label: 'Describe the main characters',
          emoji: '🐻',
          type: 'textarea',
          required: true,
          requiredMsg: 'Please describe the characters.',
          placeholder: 'e.g., Barnaby the sleepy bear, Pippa the energetic squirrel',
        },
      ],
      build: (v) => ({
        system:
          'You are a children\'s book author. Write an imaginative, engaging kids story book content ' +
          'complete with narration page-by-page (5 pages total). For each page, provide: 1) Narration text, ' +
          'and 2) A detailed illustration prompt for drawing that scene. Format in clean Markdown.',
        user: `Theme/Moral: ${v.theme}\nCharacters: ${v.characters}`,
        maxTokens: 2500,
        temperature: 0.85,
      }),
      loading: {
        label: 'Generating Kids Story Book',
        messages: ['Developing character interactions…', 'Structuring page plots…', 'Adding moral hooks…'],
      },
      result: { title: 'Kids Illustrated Story Book', filename: 'kids-story-book' },
    },
  },
  {
    id: 'book-idea-gen',
    name: 'Book Idea Generator',
    description: 'Transform your book idea into a detailed blueprint swiftly.',
    icon: BookOpen,
    config: {
      fields: [
        {
          name: 'concept',
          label: 'What is your basic book idea or premise?',
          emoji: '💡',
          type: 'textarea',
          required: true,
          requiredMsg: 'Please enter your basic premise.',
          placeholder: 'e.g., A time traveler who gets stuck in the year 1888 and falls in love with a local librarian.',
        },
      ],
      build: (v) => ({
        system:
          'You are a creative writing coach. Turn the user\'s basic book premise into a structured blueprint. ' +
          'Provide: 1) Expanded high-level plot synopsis, 2) Key character profiles (protagonist, antagonist), ' +
          '3) Core conflicts, and 4) 3 suggested plot twists. Format in clean Markdown.',
        user: `Basic Premise: ${v.concept}`,
        maxTokens: 3000,
        temperature: 0.8,
      }),
      loading: {
        label: 'Expanding Book Blueprint',
        messages: ['Tracing story arcs…', 'Drafting character profiles…', 'Injecting dramatic conflicts…'],
      },
      result: { title: 'Book Idea Blueprint', filename: 'book-blueprint' },
    },
  },
  {
    id: 'book-outline-gen',
    name: 'Book Outline Generator',
    description: 'Transform your ideas into well-organized chapters with ease.',
    icon: BookOpen,
    config: {
      fields: [
        {
          name: 'details',
          label: 'Provide plot, theme, and details of your book',
          emoji: '📜',
          type: 'textarea',
          required: true,
          requiredMsg: 'Please enter book details.',
          placeholder: 'e.g., A space travel thriller about a crew exploring a silent alien vessel in deep orbit.',
        },
      ],
      build: (v) => ({
        system:
          'You are a book outline architect. Create a structured 10-chapter outline for the book. ' +
          'For each chapter, write: 1) Chapter Title, 2) Main narrative goal, and 3) 3 key plot points ' +
          'or events to cover. Format in clean Markdown.',
        user: `Book Details: ${v.details}`,
        maxTokens: 3000,
        temperature: 0.75,
      }),
      loading: {
        label: 'Generating Chapter Outline',
        messages: ['Pacing chapter narrative…', 'Formulating structural beats…', 'Polishing outline document…'],
      },
      result: { title: 'Book Chapter Outline', filename: 'book-outline' },
    },
  },
  {
    id: 'book-cover-ideas',
    name: 'Book Cover Image Ideas',
    description: 'Generate Unique Cover Image Ideas for Your Book.',
    icon: BookOpen,
    config: {
      fields: [
        {
          name: 'title',
          label: 'Book Title & Author (optional)',
          emoji: '🏷️',
          type: 'text',
          required: false,
          placeholder: 'e.g., Echoes of Eternity by Jane Doe',
        },
        {
          name: 'concept',
          label: 'What is the book about / core visual metaphor?',
          emoji: '📸',
          type: 'textarea',
          required: true,
          requiredMsg: 'Please describe the book visual metaphor.',
          placeholder: 'e.g., A lone astronaut staring down a massive glowing wormhole in space',
        },
      ],
      build: (v) => {
        const titleStr = v.title ? `Book Title/Author: ${v.title.trim()}` : '';
        return {
          system:
            'You are an art director. Generate 3 distinct Midjourney/DALL-E cover design prompts ' +
            'based on the visual metaphor. Detail typography placement suggestions, overall layout composition, ' +
            'and dominant color themes. Format in clean Markdown.',
          user: `${titleStr}\nVisual Concept: ${v.concept}`,
          maxTokens: 2500,
          temperature: 0.8,
        };
      },
      loading: {
        label: 'Designing Cover Ideas',
        messages: ['Establishing visual balance…', 'Selecting color themes…', 'Drafting layout instructions…'],
      },
      result: { title: 'Book Cover Design Concept Prompts', filename: 'book-cover-concepts' },
    },
  },
  {
    id: 'book-chapter-writer',
    name: 'Book Chapter Writer (Non-Fiction)',
    description: 'This tool helps you generate detailed, structured content for specific chapters.',
    icon: BookOpen,
    config: {
      fields: [
        {
          name: 'chapterTitle',
          label: 'Chapter Title / Number',
          emoji: '📄',
          type: 'text',
          required: true,
          requiredMsg: 'Please enter chapter title.',
          placeholder: 'e.g., Chapter 3: The Power of Habits',
        },
        {
          name: 'outline',
          label: 'Detailed Chapter Outline or Key Points to cover',
          emoji: '📝',
          type: 'textarea',
          required: true,
          requiredMsg: 'Please enter key chapter points.',
          placeholder: 'e.g., Explain cue-routine-reward loop, trigger signals, habit stacking, real-world examples',
        },
      ],
      build: (v) => ({
        system:
          'You are a professional non-fiction writer. Write a comprehensive, detailed draft for the specified ' +
          'chapter based on the outline. Write in a clear, informative, and engaging voice with subheadings, ' +
          'bullet points for readability, and key summaries. Format in clean Markdown.',
        user: `Chapter Title: ${v.chapterTitle}\nKey Points: ${v.outline}`,
        maxTokens: 3500,
        temperature: 0.7,
      }),
      loading: {
        label: 'Drafting Non-Fiction Chapter',
        messages: ['Expanding outline beats…', 'Writing core thesis…', 'Formatting subheadings…'],
      },
      result: { title: 'Chapter Draft', filename: 'nonfiction-chapter-draft' },
    },
  },
  {
    id: 'book-title-gen',
    name: 'Book Title Generator',
    description: 'Instantly generate captivating book titles for any genre.',
    icon: BookOpen,
    config: {
      fields: [
        {
          name: 'genre',
          label: 'Book Genre',
          emoji: '📖',
          type: 'text',
          required: true,
          requiredMsg: 'Please enter the genre.',
          placeholder: 'e.g., Thriller, Romance, Sci-Fi',
        },
        {
          name: 'concept',
          label: 'Tell us about your book plot or premise',
          emoji: '💡',
          type: 'textarea',
          required: true,
          requiredMsg: 'Please enter book plot/premise.',
          placeholder: 'e.g., A cybersecurity expert discovers an AI has taken control of the stock exchange.',
        },
      ],
      build: (v) => ({
        system:
          'You are a book publisher. Generate 10 captivating, market-ready title ideas for the specified ' +
          'genre and book premise. Categorize them by style (e.g. Mysterious, Direct, Dramatic). Format in clean Markdown.',
        user: `Genre: ${v.genre}\nPlot/Premise: ${v.concept}`,
        maxTokens: 1500,
        temperature: 0.85,
      }),
      loading: {
        label: 'Generating Book Titles',
        messages: ['Analyzing market trends…', 'Brainstorming keywords…', 'Refining title structures…'],
      },
      result: { title: 'Generated Book Titles', filename: 'book-titles' },
    },
  },
  {
    id: 'book-chapter-summarizer',
    name: 'Book Chapter Summarizer',
    description: 'Get straight to the main ideas with chapter summaries.',
    icon: BookOpen,
    config: {
      fields: [
        {
          name: 'content',
          label: 'Paste Chapter Text here',
          emoji: '📋',
          type: 'textarea',
          required: true,
          requiredMsg: 'Please paste chapter text.',
          placeholder: 'Paste the text of the chapter you want to summarize…',
        },
      ],
      build: (v) => ({
        system:
          'You are a literary editor. Summarize the provided chapter text. Include: 1) One-sentence summary, ' +
          '2) Detailed chronological plot summary/bullet points, and 3) List of key characters and their ' +
          'developments in this chapter. Format in clean Markdown.',
        user: `Chapter Content:\n${v.content}`,
        maxTokens: 2500,
        temperature: 0.4,
      }),
      loading: {
        label: 'Summarizing Chapter',
        messages: ['Reading text blocks…', 'Extracting key character beats…', 'Drafting summaries…'],
      },
      result: { title: 'Chapter Summary', filename: 'chapter-summary' },
    },
  },
  {
    id: 'book-kids-long',
    name: 'Kids Story Book (Long without image prompt)',
    description: 'Get Your Kids Smiling with New engaging Stories.',
    icon: BookOpen,
    config: {
      fields: [
        {
          name: 'theme',
          label: 'Moral or theme of the story',
          emoji: '🎈',
          type: 'text',
          required: true,
          requiredMsg: 'Please enter the theme.',
          placeholder: 'e.g., perseverance, honesty is the best policy',
        },
        {
          name: 'setting',
          label: 'Setting & Characters',
          emoji: '🦊',
          type: 'textarea',
          required: true,
          requiredMsg: 'Please enter setting and characters.',
          placeholder: 'e.g., A magical forest, a brave little fox named Felix who is afraid of the dark',
        },
      ],
      build: (v) => ({
        system:
          'You are a storyteller. Write a detailed, long, engaging story for kids based on the moral theme and setting. ' +
          'Ensure the narrative uses child-friendly vocabulary, rich descriptive descriptions, dialogue, ' +
          'and maintains a warm tone. Do not write image prompts. Format in clean Markdown.',
        user: `Theme: ${v.theme}\nSetting & Characters: ${v.setting}`,
        maxTokens: 3000,
        temperature: 0.85,
      }),
      loading: {
        label: 'Writing Kids Story',
        messages: ['Drafting character introduction…', 'Building dramatic plot beats…', 'Closing with warm moral resolve…'],
      },
      result: { title: 'Kids Story Book Draft', filename: 'long-kids-story' },
    },
  },
  {
    id: 'book-amazon-details',
    name: 'Book Details Generator for Amazon',
    description: 'Boost Your Amazon Book Sales With Optimized Details.',
    icon: BookOpen,
    config: {
      fields: [
        {
          name: 'title',
          label: 'Book Title',
          emoji: '🏷️',
          type: 'text',
          required: true,
          requiredMsg: 'Please enter book title.',
          placeholder: 'e.g., The Silent Ship',
        },
        {
          name: 'blurb',
          label: 'Paste draft book blurb or basic synopsis',
          emoji: '📖',
          type: 'textarea',
          required: true,
          requiredMsg: 'Please enter synopsis.',
          placeholder: 'Paste the general summary of the book here…',
        },
      ],
      build: (v) => ({
        system:
          'You are an Amazon self-publishing expert. Create highly optimized book details for Amazon KDP ' +
          'based on the title and blurb. Provide: 1) A copy-written KDP Book Description (using bold headings, ' +
          'bullet points, and emotional hooks), 2) 7 relevant search keywords, and 3) 3 KDP category path suggestions. ' +
          'Format in clean Markdown.',
        user: `Book Title: ${v.title}\nSynopsis: ${v.blurb}`,
        maxTokens: 2500,
        temperature: 0.75,
      }),
      loading: {
        label: 'Optimizing Amazon Book Details',
        messages: ['Refining marketing copy blurb…', 'Searching KDP category paths…', 'Drafting search keywords…'],
      },
      result: { title: 'Amazon Listing Book Details', filename: 'amazon-listing-details' },
    },
  },
  // Spreading genre title generators
  ...genres.map((g) => ({
    id: `book-genre-title-${g.id}`,
    name: g.name,
    description: `Instantly generate captivating ${g.genre} book titles.`,
    icon: BookOpen,
    config: {
      fields: [
        {
          name: 'concept',
          label: 'What is the book plot, theme, or major keywords?',
          emoji: '💡',
          type: 'textarea',
          required: true,
          requiredMsg: 'Please fill in plot concepts.',
          placeholder: `Provide details to generate ${g.genre} titles…`,
        },
      ],
      build: (v) => ({
        system:
          `You are a book publisher specializing in ${g.genre} literature. Generate 15 distinct, high-impact ` +
          `book title ideas based on the plot theme. Group them into styles (e.g. Modern, Classic, Poetic, Suspenseful). ` +
          `Include a brief line explaining the visual mood of each title. Format in clean Markdown.`,
        user: `Plot details: ${v.concept}`,
        maxTokens: 2000,
        temperature: 0.85,
      }),
      loading: {
        label: `Generating ${g.genre} Titles`,
        messages: ['Brainstorming industry patterns…', 'Blending keyword values…', 'Refining title list…'],
      },
      result: { title: `${g.genre} Title Recommendations`, filename: `${g.id}-titles` },
    },
  })),
];

// Registry-ready entries for the "Book Writing" category.
export const BOOK_WRITING_TOOLS = DEFS.map((d) => ({
  id: d.id,
  name: d.name,
  description: d.description,
  category: 'Book Writing',
  icon: d.icon,
  available: true,
  // eslint-disable-next-line react/display-name
  component: () => <FormTool config={{ icon: d.icon, title: d.name, description: d.description, ...d.config }} />,
}));
