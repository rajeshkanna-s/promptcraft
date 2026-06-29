import { GraduationCap, BookOpen, Smile, HelpCircle, ClipboardList } from 'lucide-react';
import FormTool from './FormTool.jsx';

const DEFS = [
  {
    id: 'edu-quiz-generator',
    name: 'Quiz Generator',
    description: 'This tool easily creates interactive quizzes, serving as your quizmaster to enhance engagement.',
    icon: GraduationCap,
    config: {
      fields: [
        {
          name: 'about',
          label: 'What is the quiz about?',
          emoji: '😅',
          type: 'text',
          required: true,
          requiredMsg: 'Please fill in what the quiz is about.',
          placeholder: 'e.g., geography quizzes, history quizzes, etc',
        },
        {
          name: 'count',
          label: 'No. of questions',
          emoji: '❓',
          type: 'text',
          required: true,
          requiredMsg: 'Please enter the number of questions.',
          placeholder: 'Please choose a value between 1 to 25',
        },
        {
          name: 'type',
          label: 'Question types',
          emoji: '⁉️',
          type: 'select',
          required: true,
          options: [
            { value: 'multiple-choice', label: 'Multiple Choice' },
            { value: 'true-false', label: 'True / False' },
            { value: 'short-answer', label: 'Short Answer' },
            { value: 'mixed', label: 'Mixed' },
          ],
          default: 'multiple-choice',
        },
        {
          name: 'difficulty',
          label: 'Difficulty Level',
          emoji: '⚔️',
          type: 'select',
          required: true,
          options: [
            { value: 'easy', label: 'Easy' },
            { value: 'medium', label: 'Medium' },
            { value: 'hard', label: 'Hard' },
          ],
          default: 'medium',
        },
        {
          name: 'instructions',
          label: 'Advanced Settings (optional)',
          emoji: '⚙️',
          type: 'text',
          required: false,
          placeholder: 'e.g., include hints, target high school level',
          advanced: true,
        },
      ],
      build: (v) => {
        const extra = v.instructions ? `Advanced instructions: ${v.instructions.trim()}` : '';
        return {
          system:
            'You are an educational quizmaster. Based on the topic, question count, type, and difficulty level, ' +
            'generate a complete interactive quiz. Format it in clean Markdown. For each question, provide: ' +
            '1) Question text, 2) Options (if multiple-choice or true-false), 3) A hidden/collapsed Answer Key ' +
            '(using markdown collapsible <details> tag).',
          user: `Topic: ${v.about}\nQuestions: ${v.count}\nType: ${v.type}\nDifficulty: ${v.difficulty}\n${extra}`,
          maxTokens: 3000,
          temperature: 0.8,
        };
      },
      loading: {
        label: 'Generating your quiz',
        messages: ['Compiling quiz questions…', 'Formulating answer options…', 'Creating hidden answer keys…'],
      },
      result: { title: 'Generated Quiz', filename: 'quiz' },
    },
  },
  {
    id: 'edu-course-creator',
    name: 'Course Creator',
    description: 'Design custom courses with content across 8 modules using the Course Creator, ideal for educators and beginners alike.',
    icon: BookOpen,
    config: {
      submitLabel: 'Save and Continue',
      fields: [
        {
          name: 'dept',
          label: 'Course Name',
          emoji: '📚',
          type: 'select',
          required: true,
          options: [
            { value: 'tech', label: 'Technology & Programming' },
            { value: 'business', label: 'Business & Management' },
            { value: 'health', label: 'Health & Fitness' },
            { value: 'art', label: 'Art & Design' },
            { value: 'social', label: 'Social Sciences' },
          ],
          default: 'tech',
        },
        {
          name: 'title',
          label: "What's the title of your course?",
          emoji: '📄',
          type: 'text',
          required: true,
          requiredMsg: 'Please enter the title of your course.',
          placeholder: 'Please enter the title of your course.',
        },
        {
          name: 'outline',
          label: 'Could you share the detailed outline of your course? (Max. 8 Modules)',
          emoji: '📜',
          type: 'textarea',
          required: true,
          requiredMsg: 'Please enter the detailed course outline.',
          placeholder: 'Please provide a detailed outline of your course',
        },
        {
          name: 'audience',
          label: 'Who is your intended audience? (Optional)',
          emoji: '🧑‍🎓',
          type: 'text',
          required: false,
          placeholder: 'e.g., Beginners, Executives, Students, Professionals etc..',
        },
      ],
      build: (v) => ({
        system:
          'You are a professional curriculum designer. Based on the course field/department, course title, ' +
          'and outlined modules (max 8), draft a comprehensive, high-quality course syllabus. For each module ' +
          'in the outline, write a brief overview, 3 key learning objectives, and 2 sample reading recommendations ' +
          'or lecture topics. Present in clean Markdown.',
        user: `Field: ${v.dept}\nCourse Title: ${v.title}\nOutline: ${v.outline}\nAudience: ${v.audience}`,
        maxTokens: 3500,
        temperature: 0.75,
      }),
      loading: {
        label: 'Designing Course Curriculum',
        messages: ['Structuring syllabus outline…', 'Drafting module details…', 'Formulating reading materials…'],
      },
      result: { title: 'Detailed Course Syllabus', filename: 'course-syllabus' },
    },
  },
  {
    id: 'edu-emoji-puzzle',
    name: 'Emoji Puzzle',
    description: 'This tool generates fun and challenging emoji-based quizzes, perfect for testing puzzle-solving skills.',
    icon: Smile,
    config: {
      fields: [
        {
          name: 'about',
          label: 'What is your quiz about?',
          emoji: '📚',
          type: 'text',
          required: true,
          requiredMsg: 'Please enter what the emoji quiz is about.',
          placeholder: 'e.g., geography quizzes, history quizzes, etc',
        },
        {
          name: 'count',
          label: 'How many questions do you want?',
          emoji: '🔢',
          type: 'text',
          required: true,
          requiredMsg: 'Please enter the number of questions.',
          placeholder: 'Please choose a value between 1 to 25',
        },
      ],
      build: (v) => ({
        system:
          'You are a puzzle master. Create a fun emoji-based guessing game quiz (e.g. guessing movie titles, ' +
          'popular sayings, geography, or history concepts using emojis). Generate the specified number of questions. ' +
          'For each question, show the emoji sequence and provide the solution inside a collapsed markdown <details> block.',
        user: `Topic: ${v.about}\nQuestion Count: ${v.count}`,
        maxTokens: 2000,
        temperature: 0.85,
      }),
      loading: {
        label: 'Generating Emoji Puzzles',
        messages: ['Selecting themed subjects…', 'Mapping concepts to emojis…', 'Drafting puzzle blocks…'],
      },
      result: { title: 'Emoji Puzzle Challenge', filename: 'emoji-quiz' },
    },
  },
  {
    id: 'edu-two-option-quiz',
    name: '2-Option Quiz',
    description: 'This tool helps you quickly generate a structured 2-option quiz on any topic, complete with answer keys.',
    icon: HelpCircle,
    config: {
      fields: [
        {
          name: 'about',
          label: "What's the quiz topic?",
          emoji: '📚',
          type: 'text',
          required: true,
          requiredMsg: 'Please enter the quiz topic.',
          placeholder: 'e.g., geography quizzes, history quizzes, etc',
        },
        {
          name: 'difficulty',
          label: 'Difficulty Level',
          emoji: '⚔️',
          type: 'select',
          required: true,
          options: [
            { value: 'easy', label: 'Easy' },
            { value: 'medium', label: 'Medium' },
            { value: 'hard', label: 'Hard' },
          ],
          default: 'medium',
        },
        {
          name: 'count',
          label: 'How many questions do you want?',
          emoji: '🔢',
          type: 'text',
          required: true,
          requiredMsg: 'Please enter the question count.',
          placeholder: 'Please choose a value between 1 to 25',
        },
      ],
      build: (v) => ({
        system:
          'You are an educator. Generate a structured A/B style binary choice (2 options) quiz based on ' +
          'the topic, difficulty, and question count. For each question, output: 1) Question text, ' +
          '2) Option A and Option B, and 3) A hidden/collapsed Answer Key (using markdown collapsible <details> tag). ' +
          'Also suggest a brief image keyword for visual matching.',
        user: `Topic: ${v.about}\nDifficulty: ${v.difficulty}\nQuestion Count: ${v.count}`,
        maxTokens: 2500,
        temperature: 0.8,
      }),
      loading: {
        label: 'Creating 2-Option Quiz',
        messages: ['Drafting binary choice prompts…', 'Structuring answer pairs…', 'Formatting keys…'],
      },
      result: { title: '2-Option Quiz Questions', filename: 'two-option-quiz' },
    },
  },
  {
    id: 'edu-project-proposal',
    name: 'Project Proposal',
    description: 'This user-friendly tool streamlines the entire proposal creation process, helping you save time and increase your chances of success.',
    icon: ClipboardList,
    config: {
      fields: [
        {
          name: 'domain',
          label: 'What is the specific field or domain of the project proposal?',
          emoji: '🤓',
          type: 'text',
          required: true,
          requiredMsg: 'Please enter the project domain.',
          placeholder: 'e.g., technology, education, healthcare',
        },
        {
          name: 'objective',
          label: 'What is the main objective or purpose of the project?',
          emoji: '🤗',
          type: 'text',
          required: true,
          requiredMsg: 'Please enter the project objective.',
          placeholder: 'e.g., To reduce campus waste and increase recycling.',
        },
        {
          name: 'sections',
          label: 'Are there specific sections or details you want included in the project proposal? (optional)',
          emoji: '🙋',
          type: 'text',
          required: false,
          placeholder: 'e.g., methodology, budget',
        },
      ],
      build: (v) => {
        const extra = v.sections ? `Adhere to these requested sections: ${v.sections.trim()}` : '';
        return {
          system:
            'You are a professional proposal writer. Draft a formal, well-structured project proposal ' +
            'based on the domain, core objective, and specific requested sections. Structure the output ' +
            'with sections: Executive Summary, Project Objectives, Methodology & Approach, Timeline & ' +
            'Deliverables, and Budget & Resource Plan. Use professional business language and format in clean Markdown.',
          user: `Domain/Field: ${v.domain}\nObjective: ${v.objective}\n${extra}`,
          maxTokens: 3000,
          temperature: 0.75,
        };
      },
      loading: {
        label: 'Drafting Project Proposal',
        messages: ['Framing objectives…', 'Structuring methodology…', 'Estimating budget outline…'],
      },
      result: { title: 'Formal Project Proposal Draft', filename: 'project-proposal' },
    },
  },
];

// Registry-ready entries for the "Education Tools" category.
export const EDUCATION_TOOLS = DEFS.map((d) => ({
  id: d.id,
  name: d.name,
  description: d.description,
  category: 'Education Tools',
  icon: d.icon,
  available: true,
  // eslint-disable-next-line react/display-name
  component: () => <FormTool config={{ icon: d.icon, title: d.name, description: d.description, ...d.config }} />,
}));
