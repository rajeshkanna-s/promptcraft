import { Briefcase, FileText, Award } from 'lucide-react';
import FormTool from './FormTool.jsx';

const DEFS = [
  {
    id: 'hr-job-description',
    name: 'Job Description Generator',
    description: 'This AI-tool crafts comprehensive job descriptions for LinkedIn, based on the role, company, and requirements you specify.',
    icon: Briefcase,
    config: {
      fields: [
        {
          name: 'role',
          label: 'Role',
          emoji: '🧑‍💻',
          type: 'text',
          required: true,
          requiredMsg: 'Please enter the role title.',
          placeholder: 'Full Stack Developer',
        },
        {
          name: 'company',
          label: 'Company Name',
          emoji: '🏢',
          type: 'text',
          required: true,
          requiredMsg: 'Please enter the company name.',
          placeholder: 'ABC company',
        },
        {
          name: 'about',
          label: 'What does your Company do?',
          emoji: '🏢',
          type: 'textarea',
          required: true,
          requiredMsg: 'Please describe what your company does.',
          placeholder: 'We make saas products on ai based content generation',
        },
        {
          name: 'requirements',
          label: 'Requirements',
          emoji: '📋',
          type: 'textarea',
          required: true,
          requiredMsg: 'Please list the role requirements.',
          placeholder: '2-5 years of experience in developing react application. Need to have ability to work individually',
        },
        {
          name: 'instructions',
          label: 'Advanced Settings (optional)',
          emoji: '⚙️',
          type: 'text',
          required: false,
          placeholder: 'e.g. dynamic and startup tone, specify remote work',
          advanced: true,
        },
      ],
      build: (v) => {
        const extra = v.instructions ? `Advanced settings: ${v.instructions.trim()}` : '';
        return {
          system:
            'You are an expert HR recruitment writer. Create a highly professional, detailed job description ' +
            'suitable for LinkedIn or job boards. Structure it with: 1) Job Overview, 2) About the Company, ' +
            '3) Key Responsibilities, 4) Skills and Qualifications, and 5) Benefits & Perks. Format in clean Markdown.',
          user:
            `Role: ${v.role}\nCompany: ${v.company}\nCompany Profile: ${v.about}\n` +
            `Requirements: ${v.requirements}\n${extra}`,
          maxTokens: 3000,
          temperature: 0.8,
        };
      },
      loading: {
        label: 'Generating job description',
        messages: ['Framing role overview…', 'Listing duties & skills…', 'Adding benefits section…'],
      },
      result: { title: 'LinkedIn Job Description', filename: 'job-description' },
    },
  },
  {
    id: 'hr-relieving-letter',
    name: 'Relieving Letter Generator',
    description: 'This tool helps you to create a formal way of communicating to the employee that the resignation has been accepted.',
    icon: FileText,
    config: {
      fields: [
        {
          name: 'role',
          label: 'What is the Job Title?',
          emoji: '🧑‍💼',
          type: 'text',
          required: true,
          requiredMsg: 'Please enter the employee job title.',
          placeholder: 'e.g., researcher, developer',
        },
        {
          name: 'relievingDate',
          label: "What is the employees' relieving / last working date?",
          emoji: '📅',
          type: 'text',
          required: true,
          requiredMsg: 'Please enter the relieving date.',
          placeholder: 'e.g., 10-12-2021',
        },
        {
          name: 'sections',
          label: 'Are there any specific sections or details you want to include in the letter? (optional)',
          emoji: '📝',
          type: 'textarea',
          required: false,
          placeholder: "Include sections for the employee's responsibilities.",
        },
      ],
      build: (v) => {
        const extra = v.sections ? `Custom items to mention: ${v.sections.trim()}` : '';
        return {
          system:
            'You are an HR manager. Draft a formal, legally compliant, and polite relieving letter to an employee ' +
            'confirming the acceptance of their resignation and documenting their last working date. Include gratitude ' +
            'for their contributions and wishes for future endeavors. Format in clean Markdown.',
          user: `Job Title: ${v.role}\nRelieving Date: ${v.relievingDate}\n${extra}`,
          maxTokens: 2500,
          temperature: 0.7,
        };
      },
      loading: {
        label: 'Generating Relieving Letter',
        messages: ['Preparing corporate letterhead layout…', 'Drafting relieving confirmation…', 'Writing career wishes…'],
      },
      result: { title: 'Formal Relieving Letter', filename: 'relieving-letter' },
    },
  },
  {
    id: 'hr-performance-appraisal',
    name: 'Performance Appraisal Letter',
    description: 'This tool helps you to create a performance appraisal letter to notify specific employees to praise their work performance during a calendar year.',
    icon: Award,
    config: {
      fields: [
        {
          name: 'role',
          label: 'What is the role/designation?',
          emoji: '🧑‍💻',
          type: 'text',
          required: true,
          requiredMsg: 'Please enter the employee role designation.',
          placeholder: 'e.g., salesman, developer',
        },
        {
          name: 'achievements',
          label: 'What are his/her key achievements?',
          emoji: '🤩',
          type: 'textarea',
          required: true,
          requiredMsg: 'Please list their key achievements.',
          placeholder: 'He creating a cutting-edge e-commerce platform, increasing company sales by 30%.',
        },
        {
          name: 'improvements',
          label: 'What areas does the employee need to improve?',
          emoji: '💪',
          type: 'text',
          required: true,
          requiredMsg: 'Please enter the improvement points.',
          placeholder: 'Needs to improve in time management',
        },
        {
          name: 'sections',
          label: 'Are there any specific sections or details you want to include in the letter? (optional)',
          emoji: '📝',
          type: 'textarea',
          required: false,
          placeholder: "Include sections for the employee's responsibilities.",
        },
        {
          name: 'instructions',
          label: 'Advanced Settings (optional)',
          emoji: '⚙️',
          type: 'text',
          required: false,
          placeholder: 'e.g. encouraging and warm tone',
          advanced: true,
        },
      ],
      build: (v) => {
        const customSec = v.sections ? `Include these sections/details: ${v.sections.trim()}` : '';
        const extra = v.instructions ? `Advanced options: ${v.instructions.trim()}` : '';
        return {
          system:
            'You are a corporate manager or HR lead. Draft a structured, encouraging performance appraisal ' +
            'letter for an employee. Acknowledge and highlight their key achievements, suggest the specified ' +
            'improvement areas constructively, outline expectations for the next review cycle, and include details ' +
            'on the next steps. Format in clean Markdown.',
          user:
            `Role: ${v.role}\nKey Achievements: ${v.achievements}\n` +
            `Improvement Areas: ${v.improvements}\n${customSec}\n${extra}`,
          maxTokens: 3000,
          temperature: 0.75,
        };
      },
      loading: {
        label: 'Creating Appraisal Letter',
        messages: ['Compiling achievements…', 'Formulating improvement feedback…', 'Drafting performance summary…'],
      },
      result: { title: 'Performance Appraisal Letter', filename: 'performance-appraisal' },
    },
  },
];

// Registry-ready entries for the "HR Tools" category.
export const HR_TOOLS = DEFS.map((d) => ({
  id: d.id,
  name: d.name,
  description: d.description,
  category: 'HR Tools',
  icon: d.icon,
  available: true,
  // eslint-disable-next-line react/display-name
  component: () => <FormTool config={{ icon: d.icon, title: d.name, description: d.description, ...d.config }} />,
}));
