import { GraduationCap, Baby, NotebookPen, HelpCircle, ListTree } from 'lucide-react';
import FormTool from './FormTool.jsx';
import { LANGUAGES } from './ToolShell.jsx';

const language = {
  name: 'language',
  label: 'Output Language',
  type: 'select',
  advanced: true,
  default: 'English',
  options: LANGUAGES,
};

const DEFS = [
  {
    id: 'study-flashcards',
    name: 'Flashcard Generator',
    description: 'Turn any topic or notes into question-and-answer flashcards for quick studying.',
    icon: GraduationCap,
    config: {
      submitLabel: 'Generate Flashcards',
      fields: [
        { name: 'topic', label: 'Topic or paste your notes', emoji: '📚', type: 'textarea', rows: 5, required: true, requiredMsg: 'Enter a topic or notes.', placeholder: 'e.g., Photosynthesis — or paste your class notes' },
        { name: 'count', label: 'How many cards?', emoji: '🔢', type: 'select', default: '10', options: ['5', '10', '15', '20'] },
        { name: 'level', label: 'Level', emoji: '🎓', type: 'select', default: 'Intermediate', options: ['Beginner', 'Intermediate', 'Advanced'] },
        language,
      ],
      build: (v) => ({
        system: `You are a study coach. In ${v.language}, create ${v.count} ${v.level.toLowerCase()} flashcards from the topic/notes. Format each as a Markdown row in a table with columns "Q" and "A", or as "**Q:** … / **A:** …" pairs. Keep questions clear and answers concise but complete.`,
        user: `Topic/notes: ${v.topic}`,
        maxTokens: 2000,
        temperature: 0.6,
      }),
      loading: { label: 'Making flashcards', messages: ['Reading the material…', 'Writing questions…', 'Checking answers…'] },
      result: { title: 'Flashcards', filename: 'flashcards' },
    },
  },
  {
    id: 'study-eli5',
    name: 'Explain Like I’m 5 (ELI5)',
    description: 'Explain any complex topic in simple, easy-to-understand language.',
    icon: Baby,
    config: {
      submitLabel: 'Explain Simply',
      fields: [
        { name: 'topic', label: 'What should I explain?', emoji: '🧠', type: 'textarea', rows: 3, required: true, requiredMsg: 'Enter a topic.', placeholder: 'e.g., How does blockchain work?' },
        { name: 'level', label: 'Explain for', emoji: '🎯', type: 'select', default: 'A curious 5-year-old', options: ['A curious 5-year-old', 'A 10-year-old', 'A high-school student', 'A smart beginner adult'] },
        language,
      ],
      build: (v) => ({
        system: `You are a brilliant teacher. In ${v.language}, explain the topic simply and clearly for "${v.level}". Use a friendly tone, a relatable analogy, short sentences, and a 1-line summary at the end. Avoid jargon. Clean Markdown.`,
        user: `Explain: ${v.topic}`,
        maxTokens: 1200,
        temperature: 0.8,
      }),
      loading: { label: 'Simplifying', messages: ['Finding an analogy…', 'Removing jargon…', 'Making it click…'] },
      result: { title: 'Simple Explanation', filename: 'eli5' },
    },
  },
  {
    id: 'study-notes',
    name: 'Study Notes Maker',
    description: 'Turn long text, articles or transcripts into clean, structured study notes.',
    icon: NotebookPen,
    config: {
      submitLabel: 'Make Study Notes',
      fields: [
        { name: 'content', label: 'Paste the material', emoji: '📄', type: 'textarea', rows: 7, required: true, requiredMsg: 'Paste the material.', maxLength: 20000, placeholder: 'Paste an article, chapter or transcript…' },
        { name: 'style', label: 'Note style', emoji: '🗂️', type: 'select', default: 'Bullet outline', options: ['Bullet outline', 'Cornell notes', 'Key points + summary', 'Q&A study guide'] },
        language,
      ],
      build: (v) => ({
        system: `You are an expert at summarizing for study. In ${v.language}, convert the material into clean "${v.style}" study notes: capture key concepts, definitions, and takeaways with clear headings and bullet points. Bold important terms. End with a short summary. Clean Markdown.`,
        user: `Material:\n${v.content}`,
        maxTokens: 2500,
        temperature: 0.5,
      }),
      loading: { label: 'Making study notes', messages: ['Reading the material…', 'Extracting key points…', 'Structuring notes…'] },
      result: { title: 'Study Notes', filename: 'study-notes' },
    },
  },
  {
    id: 'study-quiz',
    name: 'Quiz Generator',
    description: 'Create a multiple-choice quiz (with answers) from any topic or notes.',
    icon: HelpCircle,
    config: {
      submitLabel: 'Generate Quiz',
      fields: [
        { name: 'topic', label: 'Topic or notes', emoji: '📚', type: 'textarea', rows: 5, required: true, requiredMsg: 'Enter a topic or notes.', placeholder: 'e.g., World War II causes — or paste notes' },
        { name: 'count', label: 'Number of questions', emoji: '🔢', type: 'select', default: '10', options: ['5', '10', '15', '20'] },
        { name: 'type', label: 'Question type', emoji: '❓', type: 'select', default: 'Multiple choice', options: ['Multiple choice', 'True / False', 'Mixed', 'Short answer'] },
        language,
      ],
      build: (v) => ({
        system: `You are a teacher. In ${v.language}, create a ${v.count}-question ${v.type.toLowerCase()} quiz on the topic. For multiple choice, give 4 options (A–D). Put all correct answers in a clearly separated "## Answer Key" section at the end. Clean Markdown.`,
        user: `Topic/notes: ${v.topic}`,
        maxTokens: 2200,
        temperature: 0.6,
      }),
      loading: { label: 'Building your quiz', messages: ['Writing questions…', 'Creating options…', 'Preparing the answer key…'] },
      result: { title: 'Quiz', filename: 'quiz' },
    },
  },
  {
    id: 'study-essay-outline',
    name: 'Essay Outline Generator',
    description: 'Get a structured essay outline with thesis, arguments and supporting points.',
    icon: ListTree,
    config: {
      submitLabel: 'Generate Outline',
      fields: [
        { name: 'topic', label: 'Essay topic / question', emoji: '📝', type: 'textarea', rows: 2, required: true, requiredMsg: 'Enter the essay topic.', placeholder: 'e.g., Should social media be regulated?' },
        { name: 'type', label: 'Essay type', emoji: '📄', type: 'select', default: 'Argumentative', options: ['Argumentative', 'Persuasive', 'Expository', 'Compare & contrast', 'Narrative', 'Analytical'] },
        { name: 'length', label: 'Target length', emoji: '📏', type: 'select', default: '5 paragraphs', options: ['5 paragraphs', 'Short (3 sections)', 'Long (7+ sections)'] },
        language,
      ],
      build: (v) => ({
        system: `You are a writing tutor. In ${v.language}, create a detailed ${v.type.toLowerCase()} essay outline (${v.length}) for the topic. Include a thesis statement, an intro hook, body sections each with a main argument and 2–3 supporting points/evidence ideas, counter-argument if relevant, and a conclusion. Clean Markdown with headings.`,
        user: `Topic: ${v.topic}`,
        maxTokens: 1800,
        temperature: 0.7,
      }),
      loading: { label: 'Outlining your essay', messages: ['Forming a thesis…', 'Structuring arguments…', 'Adding evidence ideas…'] },
      result: { title: 'Essay Outline', filename: 'essay-outline' },
    },
  },
];

export const STUDY_TOOLS = DEFS.map((d) => ({
  id: d.id,
  name: d.name,
  description: d.description,
  category: 'Study Tools',
  icon: d.icon,
  available: true,
  // eslint-disable-next-line react/display-name
  component: () => <FormTool config={{ icon: d.icon, title: d.name, description: d.description, ...d.config }} />,
}));
