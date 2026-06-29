import { PhoneCall, HelpCircle, MessageSquareText } from 'lucide-react';
import FormTool from './FormTool.jsx';

const DEFS = [
  {
    id: 'support-caller-generator',
    name: 'AI Caller prompt generator',
    description: 'This tool helps businesses create customized AI voice assistants that handle customer calls efficiently, ensuring clear, relevant, and friendly interactions tailored to their specific needs.',
    icon: PhoneCall,
    config: {
      fields: [
        {
          name: 'company',
          label: 'What is the name of your company?',
          emoji: '🏢',
          type: 'text',
          required: true,
          requiredMsg: 'Please enter your company name.',
          placeholder: 'ABC company',
        },
        {
          name: 'about',
          label: 'Can you describe your company and its products or services?',
          emoji: '🔍',
          type: 'textarea',
          required: true,
          requiredMsg: 'Please describe your company and services.',
          placeholder: 'Please provide a brief description of your company and services',
        },
        {
          name: 'recipient',
          label: 'Who will the assistant be calling?',
          emoji: '☎️',
          type: 'text',
          required: true,
          requiredMsg: 'Please enter who the assistant is calling.',
          placeholder: 'e.g., customers with failed payments, Customers with overdue invoices, Patients to schedule appointments etc...',
        },
        {
          name: 'tasks',
          label: 'What tasks should the assistant do, or what info should it gather from callers?',
          emoji: '🎯',
          type: 'textarea',
          required: true,
          requiredMsg: 'Please enter the tasks/goals of the assistant.',
          placeholder: 'e.g., Schedule appointments, answer queries about our services',
        },
        {
          name: 'closing',
          label: 'What should the assistant do or say after getting information from the caller? (optional)',
          emoji: '🔄',
          type: 'textarea',
          required: false,
          placeholder: "e.g., Confirm the booking details and say, 'You'll receive an email about the booking shortly.'",
        },
        {
          name: 'instructions',
          label: 'Advanced Settings (optional)',
          emoji: '⚙️',
          type: 'text',
          required: false,
          placeholder: 'e.g., polite and friendly voice, brief sentences',
          advanced: true,
        },
      ],
      build: (v) => {
        const closingStr = v.closing ? `Post-call action: ${v.closing.trim()}` : '';
        const extra = v.instructions ? `Advanced instructions: ${v.instructions.trim()}` : '';
        return {
          system:
            'You are an expert conversational AI prompt engineer. Design a complete, detailed System Prompt ' +
            'and Dialog Script blueprint for an AI Caller Voice Assistant. Structure it with: 1) Role Description & ' +
            'Persona, 2) Conversation Flow & States, 3) Core Tasks & Information to Gather, 4) Call Closing instructions, ' +
            'and 5) An Example Dialog Script showing a friendly, realistic conversation. Format in clean Markdown.',
          user:
            `Company Name: ${v.company}\nDescription: ${v.about}\n` +
            `Recipient Profile: ${v.recipient}\nTasks: ${v.tasks}\n` +
            `${closingStr}\n${extra}`,
          maxTokens: 3000,
          temperature: 0.8,
        };
      },
      loading: {
        label: 'Designing AI Caller Prompt',
        messages: ['Analyzing conversation flow…', 'Mapping state variables…', 'Writing prompt instructions…'],
      },
      result: { title: 'AI Caller Assistant Prompt', filename: 'ai-caller-prompt' },
    },
  },
  {
    id: 'support-faq-generator',
    name: 'FAQ Generator',
    description: 'This tool efficiently guides you in creating tailored FAQs, ensuring your questions and answers are directly relevant and clearly structured for any specific topic and context.',
    icon: HelpCircle,
    config: {
      fields: [
        {
          name: 'topic',
          label: 'What is the main topic or subject for the FAQs?',
          emoji: '📚',
          type: 'text',
          required: true,
          requiredMsg: 'Please enter the main FAQ topic.',
          placeholder: 'e.g., Online Payment Methods, Using a Mobile Banking App etc...',
        },
        {
          name: 'channel',
          label: 'Where will these FAQs be used?',
          emoji: '🤪',
          type: 'text',
          required: true,
          requiredMsg: 'Please enter where the FAQs will be hosted.',
          placeholder: 'e.g., E-commerce website, Banking App help section etc...',
        },
      ],
      build: (v) => ({
        system:
          'You are a customer support strategist. Create a comprehensive, well-structured FAQ (Frequently ' +
          'Asked Questions) document containing 10 highly relevant questions and detailed, friendly answers. ' +
          'Tailor the content specifically to the topic and the channel/context where they will be displayed. ' +
          'Format in clean Markdown.',
        user: `Topic: ${v.topic}\nChannel: ${v.channel}`,
        maxTokens: 2500,
        temperature: 0.75,
      }),
      loading: {
        label: 'Generating FAQ content',
        messages: ['Identifying frequent queries…', 'Drafting clear answers…', 'Formatting FAQ sections…'],
      },
      result: { title: 'Generated FAQs', filename: 'faqs' },
    },
  },
  {
    id: 'support-review-response',
    name: 'Customer Review Response',
    description: 'This tool simplifies crafting tailored responses to customer reviews, enhancing brand reputation and customer engagement.',
    icon: MessageSquareText,
    config: {
      fields: [
        {
          name: 'review',
          label: "Please share the customer's review or message you received?",
          emoji: '💬',
          type: 'textarea',
          required: true,
          requiredMsg: 'Please paste the customer review.',
          placeholder: 'e.g., "Great service, would definitely recommend!"',
        },
        {
          name: 'platform',
          label: 'Where would you like the response to be posted?',
          emoji: '📮',
          type: 'select',
          required: true,
          options: [
            { value: 'google', label: 'Google Reviews' },
            { value: 'trustpilot', label: 'Trustpilot' },
            { value: 'yelp', label: 'Yelp' },
            { value: 'appstore', label: 'App Store / Google Play' },
            { value: 'social', label: 'Social Media / Facebook' },
            { value: 'email', label: 'Email Response' },
          ],
          default: 'google',
        },
        {
          name: 'business',
          label: 'Tell us about your business or the product that your customer is referring to.',
          emoji: '🛍️',
          type: 'text',
          required: true,
          requiredMsg: 'Please enter details about your business/product.',
          placeholder: 'Please describe your business or product briefly',
        },
        {
          name: 'context',
          label: 'Context of the conversation (optional)',
          emoji: '🗣️',
          type: 'textarea',
          required: false,
          placeholder: 'Please specify the context of the conversation, e.g., Discussing business strategies etc.',
        },
      ],
      build: (v) => {
        const contextStr = v.context ? `Conversation context: ${v.context.trim()}` : '';
        return ({
          system:
            'You are a public relations and customer success manager. Draft a polite, professional, and engaging ' +
            'response to the customer review. Acknowledge their feedback, address any concerns organically, ' +
            'maintain a brand-aligned voice, and tailor the response style to the chosen platform (e.g. public ' +
            'platform review vs. a direct customer email). Output in clean Markdown.',
          user: `Review: ${v.review}\nPlatform: ${v.platform}\nBusiness Info: ${v.business}\n${contextStr}`,
          maxTokens: 2000,
          temperature: 0.7,
        });
      },
      loading: {
        label: 'Drafting Review Response',
        messages: ['Analyzing review sentiment…', 'Incorporating brand values…', 'Polishing professional tone…'],
      },
      result: { title: 'Customer Review Response Draft', filename: 'review-response' },
    },
  },
];

// Registry-ready entries for the "Support Tools" category.
export const SUPPORT_TOOLS = DEFS.map((d) => ({
  id: d.id,
  name: d.name,
  description: d.description,
  category: 'Support Tools',
  icon: d.icon,
  available: true,
  // eslint-disable-next-line react/display-name
  component: () => <FormTool config={{ icon: d.icon, title: d.name, description: d.description, ...d.config }} />,
}));
