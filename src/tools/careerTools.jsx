import { FileUser, FileText, Linkedin, ListChecks, MessagesSquare } from 'lucide-react';
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
    id: 'career-resume-bullets',
    name: 'Resume Bullet Points',
    description: 'Turn a plain description of what you did into strong, achievement-focused resume bullets.',
    icon: ListChecks,
    config: {
      submitLabel: 'Generate Bullet Points',
      fields: [
        { name: 'role', label: 'Job title / role', emoji: '💼', type: 'text', required: true, requiredMsg: 'Enter your role.', placeholder: 'e.g., Marketing Manager' },
        { name: 'work', label: 'What did you do? (plain description)', emoji: '📝', type: 'textarea', rows: 4, required: true, requiredMsg: 'Describe what you did.', placeholder: 'e.g., ran social media, grew followers, managed a small team, launched campaigns' },
        language,
      ],
      build: (v) => ({
        system: `You are a professional resume writer. In ${v.language}, turn the description into 6 strong resume bullet points for the role. Start each with a powerful action verb, quantify impact with realistic metrics where possible (use placeholders like "X%" if unknown), and keep each to one line. Output a clean Markdown bullet list only.`,
        user: `Role: ${v.role}\nWhat I did: ${v.work}`,
        maxTokens: 900,
        temperature: 0.75,
      }),
      loading: { label: 'Writing your bullets', messages: ['Finding action verbs…', 'Quantifying impact…', 'Polishing wording…'] },
      result: { title: 'Resume Bullet Points', filename: 'resume-bullets' },
    },
  },
  {
    id: 'career-cover-letter',
    name: 'Cover Letter Writer',
    description: 'Generate a tailored, professional cover letter from your background and the job.',
    icon: FileText,
    config: {
      submitLabel: 'Write Cover Letter',
      fields: [
        { name: 'name', label: 'Your name', emoji: '🧑', type: 'text', required: true, requiredMsg: 'Enter your name.', placeholder: 'e.g., Jordan Lee' },
        { name: 'job', label: 'Job title & company', emoji: '🏢', type: 'text', required: true, requiredMsg: 'Enter the job & company.', placeholder: 'e.g., Product Designer at Acme' },
        { name: 'background', label: 'Your relevant experience & skills', emoji: '🎯', type: 'textarea', rows: 4, required: true, requiredMsg: 'Describe your background.', placeholder: 'e.g., 4 years in UX, led a redesign that lifted conversion 20%…' },
        { name: 'jobdesc', label: 'Paste the job description (optional)', emoji: '📋', type: 'textarea', rows: 3, placeholder: 'Paste key requirements to tailor the letter…' },
        language,
      ],
      build: (v) => ({
        system: `You are an expert career coach. In ${v.language}, write a tailored, professional cover letter (3–4 short paragraphs) for the applicant. Open with a strong hook, connect their experience to the role's needs, show enthusiasm for the company, and close with a confident call to action. Clean Markdown.`,
        user: `Applicant: ${v.name}\nApplying for: ${v.job}\nBackground: ${v.background}\nJob description: ${v.jobdesc || 'not provided'}`,
        maxTokens: 1500,
        temperature: 0.75,
      }),
      loading: { label: 'Writing your cover letter', messages: ['Matching you to the role…', 'Crafting the hook…', 'Closing with confidence…'] },
      result: { title: 'Cover Letter', filename: 'cover-letter' },
    },
  },
  {
    id: 'career-linkedin-summary',
    name: 'LinkedIn Summary / About',
    description: 'Write a compelling LinkedIn “About” section that showcases your value.',
    icon: Linkedin,
    config: {
      submitLabel: 'Write LinkedIn About',
      fields: [
        { name: 'role', label: 'Your role / headline', emoji: '💼', type: 'text', required: true, requiredMsg: 'Enter your role.', placeholder: 'e.g., Full Stack Developer' },
        { name: 'about', label: 'Your experience, skills & what you’re about', emoji: '🌟', type: 'textarea', rows: 4, required: true, requiredMsg: 'Describe yourself.', placeholder: 'e.g., 6 years building web apps, love clean UX, mentor juniors…' },
        { name: 'goal', label: 'Goal (optional)', emoji: '🎯', type: 'text', placeholder: 'e.g., open to senior roles / freelance clients' },
        language,
      ],
      build: (v) => ({
        system: `You are a personal-branding expert. In ${v.language}, write a compelling first-person LinkedIn "About" section (3–4 short paragraphs). Open with a strong hook, highlight expertise and results, show personality, and end with a clear invitation aligned to the goal. Use a confident but human tone. Clean Markdown.`,
        user: `Role: ${v.role}\nAbout: ${v.about}\nGoal: ${v.goal || 'grow network and opportunities'}`,
        maxTokens: 1200,
        temperature: 0.8,
      }),
      loading: { label: 'Writing your About section', messages: ['Finding your hook…', 'Highlighting strengths…', 'Adding personality…'] },
      result: { title: 'LinkedIn About', filename: 'linkedin-about' },
    },
  },
  {
    id: 'career-resume-summary',
    name: 'Resume Summary / Objective',
    description: 'Craft a punchy professional summary for the top of your resume.',
    icon: FileUser,
    config: {
      submitLabel: 'Write Summary',
      fields: [
        { name: 'role', label: 'Target role', emoji: '🎯', type: 'text', required: true, requiredMsg: 'Enter the target role.', placeholder: 'e.g., Senior Data Analyst' },
        { name: 'exp', label: 'Years of experience & key strengths', emoji: '📈', type: 'textarea', rows: 3, required: true, requiredMsg: 'Describe your experience.', placeholder: 'e.g., 5 years, SQL/Python, built dashboards, led A/B tests' },
        language,
      ],
      build: (v) => ({
        system: `You are a resume expert. In ${v.language}, write 3 alternative professional summary statements (2–3 sentences each) for the target role, tailored to the experience. Make them results-oriented and ATS-friendly. Use Markdown with "## Option 1/2/3" headings.`,
        user: `Target role: ${v.role}\nExperience & strengths: ${v.exp}`,
        maxTokens: 900,
        temperature: 0.75,
      }),
      loading: { label: 'Writing your summary', messages: ['Distilling your strengths…', 'Tailoring to the role…', 'Making it ATS-friendly…'] },
      result: { title: 'Resume Summary', filename: 'resume-summary' },
    },
  },
  {
    id: 'career-interview-answer',
    name: 'Interview Answer Helper',
    description: 'Get strong, structured answers to common interview questions using the STAR method.',
    icon: MessagesSquare,
    config: {
      submitLabel: 'Draft Answer',
      fields: [
        { name: 'question', label: 'Interview question', emoji: '❓', type: 'textarea', rows: 2, required: true, requiredMsg: 'Enter the question.', placeholder: 'e.g., Tell me about a time you handled conflict' },
        { name: 'context', label: 'Your relevant experience (optional)', emoji: '🧩', type: 'textarea', rows: 3, placeholder: 'Give any real details to personalize the answer…' },
        { name: 'role', label: 'Role you’re interviewing for (optional)', emoji: '💼', type: 'text', placeholder: 'e.g., Project Manager' },
        language,
      ],
      build: (v) => ({
        system: `You are an interview coach. In ${v.language}, write a strong sample answer to the question using the STAR method (Situation, Task, Action, Result). Keep it authentic, concise and confident. If experience is provided, weave it in; otherwise use realistic placeholders. Add 2 quick tips at the end. Clean Markdown.`,
        user: `Question: ${v.question}\nExperience: ${v.context || 'not provided'}\nRole: ${v.role || 'not specified'}`,
        maxTokens: 1200,
        temperature: 0.75,
      }),
      loading: { label: 'Drafting your answer', messages: ['Structuring with STAR…', 'Adding impact…', 'Writing quick tips…'] },
      result: { title: 'Interview Answer', filename: 'interview-answer' },
    },
  },
];

export const CAREER_TOOLS = DEFS.map((d) => ({
  id: d.id,
  name: d.name,
  description: d.description,
  category: 'Career Tools',
  icon: d.icon,
  available: true,
  // eslint-disable-next-line react/display-name
  component: () => <FormTool config={{ icon: d.icon, title: d.name, description: d.description, ...d.config }} />,
}));
