import { Code2 } from 'lucide-react';
import FormTool from './FormTool.jsx';

const DEFS = [
  {
    id: 'code-generator',
    name: 'Code Generator',
    description: 'Skip the coding research and get personalized solutions Instantly.',
    icon: Code2,
    config: {
      fields: [
        {
          name: 'lang',
          label: 'Programming Language',
          emoji: '💻',
          type: 'text',
          required: true,
          requiredMsg: 'Please enter target programming language.',
          placeholder: 'e.g., JavaScript, Python, Rust',
        },
        {
          name: 'prompt',
          label: 'What should the code do?',
          emoji: '📝',
          type: 'textarea',
          required: true,
          requiredMsg: 'Please enter instructions for the code.',
          placeholder: 'e.g., a function to fetch weather data from an API and cache it for 1 hour',
        },
      ],
      build: (v) => ({
        system:
          'You are a senior software developer. Write clean, efficient, and well-commented code in the ' +
          'specified language to solve the user\'s prompt. Surround the code in markdown code fences ' +
          'and write a brief explanation of how it works. Format in clean Markdown.',
        user: `Language: ${v.lang}\nInstructions: ${v.prompt}`,
        maxTokens: 2500,
        temperature: 0.2,
      }),
      loading: {
        label: 'Generating code solutions',
        messages: ['Structuring algorithms…', 'Writing code logic…', 'Adding comments & explanations…'],
      },
      result: { title: 'Generated Code Solution', filename: 'generated-code' },
    },
  },
  {
    id: 'code-explainer',
    name: 'Code Explainer',
    description: 'Break down complicated code into clear, digestible explanations.',
    icon: Code2,
    config: {
      fields: [
        {
          name: 'code',
          label: 'Paste your code here',
          emoji: '📋',
          type: 'textarea',
          required: true,
          requiredMsg: 'Please paste the code you want explained.',
          placeholder: 'Paste the functions, classes, or code block here…',
        },
      ],
      build: (v) => ({
        system:
          'You are a computer science instructor. Break down the user\'s code block step-by-step. ' +
          'Provide: 1) High-level overview of what the code does, 2) Line-by-line or section-by-section breakdown, ' +
          'and 3) Complexity analysis (Time & Space complexity in Big O notation). Format in clean Markdown.',
        user: `Code to explain:\n${v.code}`,
        maxTokens: 2500,
        temperature: 0.3,
      }),
      loading: {
        label: 'Analyzing code architecture',
        messages: ['Parsing code symbols…', 'Tracing logical flow…', 'Calculating complexity indexes…'],
      },
      result: { title: 'Code Explanation & Analysis', filename: 'code-explanation' },
    },
  },
  {
    id: 'code-completion',
    name: 'Code Completion',
    description: 'Enhance coding experience with automated code suggestions.',
    icon: Code2,
    config: {
      fields: [
        {
          name: 'partialCode',
          label: 'Paste your partial code / file content',
          emoji: '📝',
          type: 'textarea',
          required: true,
          requiredMsg: 'Please paste your partial code block.',
          placeholder: 'Paste code up to the point you want completed…',
        },
        {
          name: 'intent',
          label: 'What should be completed next? (optional)',
          emoji: '💡',
          type: 'text',
          required: false,
          placeholder: 'e.g., complete the calculateTotal function supporting tax rates',
        },
      ],
      build: (v) => {
        const goal = v.intent ? `Intent: ${v.intent.trim()}` : 'Complete the code naturally.';
        return {
          system:
            'You are an AI pair programmer. Complete the provided partial code block naturally. Maintain ' +
            'the existing style, indentation, naming conventions, and patterns. Output ONLY the completed ' +
            'lines within code fences without redundant explanation.',
          user: `Partial Code:\n${v.partialCode}\n${goal}`,
          maxTokens: 2500,
          temperature: 0.2,
        };
      },
      loading: {
        label: 'Predicting code completion',
        messages: ['Analyzing pattern files…', 'Inferring next statement…', 'Completing code block…'],
      },
      result: { title: 'Completed Code block', filename: 'completed-code' },
    },
  },
  {
    id: 'code-bug-detector',
    name: 'Bug Detector',
    description: 'Instantly resolve errors in your code with step-by-step instructions.',
    icon: Code2,
    config: {
      fields: [
        {
          name: 'code',
          label: 'Paste buggy code',
          emoji: '🐛',
          type: 'textarea',
          required: true,
          requiredMsg: 'Please paste the buggy code block.',
          placeholder: 'Paste the code causing errors or bugs…',
        },
        {
          name: 'errorMsg',
          label: 'Error message / Unexpected behavior (optional)',
          emoji: '⚠️',
          type: 'text',
          required: false,
          placeholder: 'e.g., TypeError: Cannot read property of undefined',
        },
      ],
      build: (v) => {
        const err = v.errorMsg ? `Error Details: ${v.errorMsg.trim()}` : '';
        return {
          system:
            'You are an expert debugger. Analyze the provided code for bugs, logic flaws, memory leaks, ' +
            'or syntax issues. Provide: 1) An explanation of what the bug is, 2) The corrected code in code fences, ' +
            'and 3) Best practices to avoid this issue. Format in clean Markdown.',
          user: `Buggy Code:\n${v.code}\n${err}`,
          maxTokens: 2500,
          temperature: 0.2,
        };
      },
      loading: {
        label: 'Detecting bugs',
        messages: ['Scanning syntax tree…', 'Finding runtime exceptions…', 'Drafting fixes…'],
      },
      result: { title: 'Debugging Report & Fixes', filename: 'debugging-report' },
    },
  },
  {
    id: 'code-converter',
    name: 'Code Converter',
    description: 'Save Time with Our Efficient Code Translation.',
    icon: Code2,
    config: {
      fields: [
        {
          name: 'sourceLang',
          label: 'Source Language',
          emoji: '📥',
          type: 'text',
          required: true,
          requiredMsg: 'Please enter source language.',
          placeholder: 'e.g., JavaScript',
        },
        {
          name: 'targetLang',
          label: 'Target Language',
          emoji: '📤',
          type: 'text',
          required: true,
          requiredMsg: 'Please enter target language.',
          placeholder: 'e.g., TypeScript / Go',
        },
        {
          name: 'code',
          label: 'Paste code to convert',
          emoji: '📋',
          type: 'textarea',
          required: true,
          requiredMsg: 'Please paste code to convert.',
          placeholder: 'Paste source code here…',
        },
      ],
      build: (v) => ({
        system:
          'You are a code compiler and translation tool. Convert the provided code from the source language ' +
          'to the target language. Preserve the naming conventions, parameters, and logical behavior exactly. ' +
          'Output the converted code in markdown code fences, followed by a brief list of conversion notes. ' +
          'Format in clean Markdown.',
        user: `Convert from ${v.sourceLang} to ${v.targetLang}:\nCode:\n${v.code}`,
        maxTokens: 2500,
        temperature: 0.2,
      }),
      loading: {
        label: 'Translating code syntax',
        messages: ['Parsing source syntax…', 'Remapping native functions…', 'Formatting target code…'],
      },
      result: { title: 'Translated Code Block', filename: 'converted-code' },
    },
  },
  {
    id: 'code-documentation',
    name: 'Code Documentation',
    description: 'Enhance developer productivity with easy-to-create code documentation.',
    icon: Code2,
    config: {
      fields: [
        {
          name: 'code',
          label: 'Paste code block',
          emoji: '📋',
          type: 'textarea',
          required: true,
          requiredMsg: 'Please paste code to document.',
          placeholder: 'Paste the functions, classes, or files you want to document…',
        },
      ],
      build: (v) => ({
        system:
          'You are a technical writer. Generate high-quality inline documentation (e.g., JSDoc, Javadoc, Docstrings) ' +
          'and an external markdown documentation guide for the provided code. Detail the parameters, return types, ' +
          'and write an usage example. Format in clean Markdown.',
        user: `Code to document:\n${v.code}`,
        maxTokens: 2500,
        temperature: 0.2,
      }),
      loading: {
        label: 'Generating developer documentation',
        messages: ['Reading function footprints…', 'Generating block comments…', 'Writing usage guides…'],
      },
      result: { title: 'Generated API Documentation', filename: 'api-documentation' },
    },
  },
  {
    id: 'code-refactor',
    name: 'Code Refactor',
    description: 'Fine-Tune Your Code for Better Maintenance.',
    icon: Code2,
    config: {
      fields: [
        {
          name: 'code',
          label: 'Paste code to refactor',
          emoji: '📋',
          type: 'textarea',
          required: true,
          requiredMsg: 'Please paste code to refactor.',
          placeholder: 'Paste source code here…',
        },
        {
          name: 'goal',
          label: 'Refactoring Goal (optional)',
          emoji: '🎯',
          type: 'text',
          required: false,
          placeholder: 'e.g., improve performance, split into smaller helper functions, improve readability',
        },
      ],
      build: (v) => {
        const goalStr = v.goal ? `Refactoring Goal: ${v.goal.trim()}` : 'Improve readability, maintainability, and clean code principles.';
        return {
          system:
            'You are a senior software architect. Refactor the provided code block according to the refactoring goal. ' +
            'Output: 1) Refactored code inside code fences, and 2) A list of specific improvements made (e.g., ' +
            'decreased complexity, resolved naming issues). Format in clean Markdown.',
          user: `Code:\n${v.code}\n${goalStr}`,
          maxTokens: 2500,
          temperature: 0.2,
        };
      },
      loading: {
        label: 'Refactoring code syntax',
        messages: ['Identifying architectural smell…', 'Optimizing variable scopes…', 'Polishing clean code blocks…'],
      },
      result: { title: 'Refactored Code & Summary', filename: 'refactored-code' },
    },
  },
];

// Registry-ready entries for the "Code Tools" category.
export const CODE_TOOLS = DEFS.map((d) => ({
  id: d.id,
  name: d.name,
  description: d.description,
  category: 'Code Tools',
  icon: d.icon,
  available: true,
  // eslint-disable-next-line react/display-name
  component: () => <FormTool config={{ icon: d.icon, title: d.name, description: d.description, ...d.config }} />,
}));
