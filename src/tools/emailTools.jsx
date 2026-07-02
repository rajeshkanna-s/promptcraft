import { Mail, Send, Repeat, Newspaper, Type, Reply } from 'lucide-react';
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
const tone = {
  name: 'tone',
  label: 'Tone',
  type: 'select',
  default: 'Professional',
  options: ['Professional', 'Friendly', 'Formal', 'Casual', 'Persuasive', 'Enthusiastic', 'Concise'],
};

const DEFS = [
  {
    id: 'email-cold',
    name: 'Cold Email Writer',
    description: 'Write cold outreach emails that get replies — personalized, benefit-led and with a clear CTA.',
    icon: Send,
    config: {
      submitLabel: 'Write Cold Email',
      fields: [
        { name: 'sender', label: 'Who are you / your company?', emoji: '🧑‍💼', type: 'textarea', rows: 2, required: true, requiredMsg: 'Tell us who you are.', placeholder: 'e.g., I run a design studio that builds Webflow sites for startups' },
        { name: 'recipient', label: 'Who are you emailing?', emoji: '🎯', type: 'text', required: true, requiredMsg: 'Who is the recipient?', placeholder: 'e.g., Head of Marketing at a SaaS company' },
        { name: 'offer', label: 'What are you offering / what do you want?', emoji: '💡', type: 'textarea', rows: 3, required: true, requiredMsg: 'What are you offering?', placeholder: 'e.g., a free landing-page audit; I want to book a 15-min call' },
        tone,
        language,
      ],
      build: (v) => ({
        system: `You are an expert cold-email copywriter. In ${v.language}, write a short, personalized cold email in a ${v.tone.toLowerCase()} tone. Include a compelling subject line, a personalized opener, a concise value proposition, social proof if reasonable, and one clear call to action. Keep it under 150 words. Use clean Markdown with a "Subject:" line first.`,
        user: `Sender: ${v.sender}\nRecipient: ${v.recipient}\nOffer/Goal: ${v.offer}`,
        maxTokens: 900,
        temperature: 0.8,
      }),
      loading: { label: 'Writing your cold email', messages: ['Crafting the subject line…', 'Personalizing the opener…', 'Sharpening the CTA…'] },
      result: { title: 'Cold Email', filename: 'cold-email' },
    },
  },
  {
    id: 'email-followup',
    name: 'Follow-up Email',
    description: 'Write polite, effective follow-up emails that nudge without being pushy.',
    icon: Repeat,
    config: {
      submitLabel: 'Write Follow-up',
      fields: [
        { name: 'context', label: 'What are you following up on?', emoji: '📌', type: 'textarea', rows: 3, required: true, requiredMsg: 'What is this follow-up about?', placeholder: 'e.g., I sent a proposal last week and haven’t heard back' },
        { name: 'number', label: 'Which follow-up is this?', emoji: '🔢', type: 'select', default: '1st follow-up', options: ['1st follow-up', '2nd follow-up', 'Final follow-up'] },
        tone,
        language,
      ],
      build: (v) => ({
        system: `You are an expert at follow-up emails. In ${v.language}, write a concise ${v.number} in a ${v.tone.toLowerCase()} tone. Reference the prior context, add a small piece of new value or a gentle reason to reply, and end with a low-friction call to action. Under 120 words. Include a "Subject:" line. Clean Markdown.`,
        user: `Context: ${v.context}\nStage: ${v.number}`,
        maxTokens: 800,
        temperature: 0.75,
      }),
      loading: { label: 'Writing your follow-up', messages: ['Recalling the context…', 'Adding a reason to reply…', 'Keeping it gentle…'] },
      result: { title: 'Follow-up Email', filename: 'followup-email' },
    },
  },
  {
    id: 'email-newsletter',
    name: 'Newsletter Writer',
    description: 'Turn a topic or a few bullet points into an engaging email newsletter.',
    icon: Newspaper,
    config: {
      submitLabel: 'Write Newsletter',
      fields: [
        { name: 'topic', label: 'Newsletter topic', emoji: '📰', type: 'text', required: true, requiredMsg: 'Enter a topic.', placeholder: 'e.g., 5 productivity tips for remote teams' },
        { name: 'points', label: 'Key points to include (optional)', emoji: '📝', type: 'textarea', rows: 3, placeholder: 'Bullet points, links, announcements…' },
        { name: 'audience', label: 'Audience (optional)', emoji: '👥', type: 'text', placeholder: 'e.g., our SaaS customers' },
        tone,
        language,
      ],
      build: (v) => ({
        system: `You are a newsletter writer. In ${v.language}, write an engaging email newsletter in a ${v.tone.toLowerCase()} tone about the topic. Include a catchy subject line, a warm intro, well-structured sections with short paragraphs, and a closing CTA. Use clean Markdown with a "Subject:" line first.`,
        user: `Topic: ${v.topic}\nKey points: ${v.points || 'none'}\nAudience: ${v.audience || 'general subscribers'}`,
        maxTokens: 1800,
        temperature: 0.8,
      }),
      loading: { label: 'Writing your newsletter', messages: ['Drafting the subject…', 'Structuring sections…', 'Polishing the CTA…'] },
      result: { title: 'Newsletter', filename: 'newsletter' },
    },
  },
  {
    id: 'email-subject-lines',
    name: 'Subject Line Generator',
    description: 'Generate high-open-rate email subject lines for any campaign.',
    icon: Type,
    config: {
      submitLabel: 'Generate Subject Lines',
      fields: [
        { name: 'about', label: 'What is the email about?', emoji: '✉️', type: 'textarea', rows: 3, required: true, requiredMsg: 'Describe the email.', placeholder: 'e.g., a 30% Black Friday sale on our courses' },
        { name: 'style', label: 'Style', emoji: '🎭', type: 'select', default: 'Mixed', options: ['Mixed', 'Curiosity', 'Urgency', 'Benefit-driven', 'Question', 'Personalized', 'Playful'] },
        language,
      ],
      build: (v) => ({
        system: `You are an email marketing expert. In ${v.language}, generate 15 high-open-rate subject lines (${v.style} style) for the described email. Keep each under 60 characters, avoid spammy words, and vary the angles. Output a clean numbered Markdown list only.`,
        user: `Email is about: ${v.about}`,
        maxTokens: 900,
        temperature: 0.9,
      }),
      loading: { label: 'Generating subject lines', messages: ['Testing angles…', 'Maximizing open rate…', 'Trimming length…'] },
      result: { title: 'Subject Lines', filename: 'subject-lines' },
    },
  },
  {
    id: 'email-reply',
    name: 'Email Reply Writer',
    description: 'Paste an email you received and get a well-worded reply in your chosen tone.',
    icon: Reply,
    config: {
      submitLabel: 'Write Reply',
      fields: [
        { name: 'received', label: 'Paste the email you received', emoji: '📥', type: 'textarea', rows: 5, required: true, requiredMsg: 'Paste the email.', placeholder: 'Paste the message you want to reply to…' },
        { name: 'intent', label: 'What do you want to say back?', emoji: '💬', type: 'textarea', rows: 2, required: true, requiredMsg: 'What is your reply about?', placeholder: 'e.g., accept the meeting but propose Thursday instead' },
        tone,
        language,
      ],
      build: (v) => ({
        system: `You are a professional communication assistant. In ${v.language}, write a clear, well-structured email reply in a ${v.tone.toLowerCase()} tone that addresses the received email and conveys the sender's intent. Keep it appropriately concise. Include a "Subject:" line if a new one helps. Clean Markdown.`,
        user: `Received email:\n${v.received}\n\nMy intent for the reply: ${v.intent}`,
        maxTokens: 1200,
        temperature: 0.7,
      }),
      loading: { label: 'Writing your reply', messages: ['Reading the email…', 'Framing your response…', 'Setting the tone…'] },
      result: { title: 'Email Reply', filename: 'email-reply' },
    },
  },
];

export const EMAIL_TOOLS = DEFS.map((d) => ({
  id: d.id,
  name: d.name,
  description: d.description,
  category: 'Email Tools',
  icon: d.icon,
  available: true,
  // eslint-disable-next-line react/display-name
  component: () => <FormTool config={{ icon: d.icon, title: d.name, description: d.description, ...d.config }} />,
}));
