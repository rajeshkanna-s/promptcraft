// Curated starter ideas for the prompt generator. Clicking one prefills the
// generator via the ?idea= query param so users get a great first result fast.
// Each item: { title, idea, type: 'text'|'image'|'video', tone }
// Valid tones: none | cinematic | minimalist | detailed | playful | professional

export const TEMPLATE_GROUPS = [
  {
    category: 'Writing & Content',
    emoji: '✍️',
    color: 'violet',
    items: [
      { title: 'Blog post outline', idea: 'a detailed blog post about the benefits of morning routines', type: 'text', tone: 'professional' },
      { title: 'Catchy headlines', idea: '10 catchy headlines for an article on remote work productivity', type: 'text', tone: 'none' },
      { title: 'Product description', idea: 'a persuasive product description for a stainless-steel water bottle', type: 'text', tone: 'professional' },
      { title: 'Story starter', idea: 'a mysterious short story set in an abandoned lighthouse', type: 'text', tone: 'cinematic' },
      { title: 'Essay introduction', idea: 'an engaging introduction for an essay on climate change solutions', type: 'text', tone: 'detailed' },
      { title: 'Poem', idea: 'a short, heartfelt poem about the changing seasons', type: 'text', tone: 'minimalist' },
      { title: 'Book summary', idea: 'a concise chapter-by-chapter summary framework for a non-fiction book', type: 'text', tone: 'professional' },
      { title: 'Rewrite formally', idea: 'rewrite a casual message into a polished, professional tone', type: 'text', tone: 'professional' },
    ],
  },
  {
    category: 'Marketing & Social',
    emoji: '📣',
    color: 'rose',
    items: [
      { title: 'Instagram caption', idea: 'an engaging Instagram caption for a coffee shop’s new autumn menu', type: 'text', tone: 'playful' },
      { title: 'Facebook ad copy', idea: 'Facebook ad copy for an online yoga course for beginners', type: 'text', tone: 'professional' },
      { title: 'Cold email', idea: 'a cold email pitching a web-design service to local restaurants', type: 'text', tone: 'professional' },
      { title: 'Viral video hook', idea: 'a scroll-stopping hook for a short video about saving money', type: 'text', tone: 'playful' },
      { title: 'Tweet / X thread', idea: 'a 6-tweet thread sharing productivity tips for freelancers', type: 'text', tone: 'none' },
      { title: 'LinkedIn post', idea: 'a LinkedIn post announcing a career change into tech', type: 'text', tone: 'professional' },
      { title: 'YouTube title & description', idea: 'a click-worthy YouTube title and description for a budget travel vlog', type: 'text', tone: 'none' },
      { title: 'Brand tagline', idea: 'memorable taglines for an eco-friendly cleaning products brand', type: 'text', tone: 'minimalist' },
    ],
  },
  {
    category: 'Business & Startup',
    emoji: '💼',
    color: 'amber',
    items: [
      { title: 'Business names', idea: 'brandable business names for a sustainable fashion startup', type: 'text', tone: 'none' },
      { title: 'Elevator pitch', idea: 'a 30-second elevator pitch for an app that helps freelancers get paid on time', type: 'text', tone: 'professional' },
      { title: 'Value proposition', idea: 'a value proposition for a project-management tool for creative teams', type: 'text', tone: 'professional' },
      { title: 'Mission statement', idea: 'a clear mission and vision statement for a community food co-op', type: 'text', tone: 'professional' },
      { title: 'SWOT analysis', idea: 'a SWOT analysis for a small independent bookstore', type: 'text', tone: 'detailed' },
      { title: 'Pricing page copy', idea: 'pricing page copy for a SaaS with three subscription tiers', type: 'text', tone: 'professional' },
      { title: 'Investor one-liner', idea: 'a punchy one-line pitch for investors about an AI note-taking app', type: 'text', tone: 'minimalist' },
    ],
  },
  {
    category: 'Coding & Tech',
    emoji: '💻',
    color: 'blue',
    items: [
      { title: 'Code helper', idea: 'a Python function that removes duplicates from a list while keeping order', type: 'text', tone: 'none' },
      { title: 'Explain a concept', idea: 'explain how JWT authentication works to a junior developer', type: 'text', tone: 'detailed' },
      { title: 'Regex builder', idea: 'a regex to validate email addresses with a clear explanation', type: 'text', tone: 'none' },
      { title: 'SQL query', idea: 'a SQL query to find the top 5 customers by total spend', type: 'text', tone: 'none' },
      { title: 'Debug helper', idea: 'common causes and fixes for a “cannot read property of undefined” error in JavaScript', type: 'text', tone: 'detailed' },
      { title: 'Git commit message', idea: 'a clear conventional git commit message for adding dark mode support', type: 'text', tone: 'minimalist' },
      { title: 'Code comments', idea: 'helpful inline comments explaining a recursive fibonacci function', type: 'text', tone: 'none' },
    ],
  },
  {
    category: 'Email & Communication',
    emoji: '✉️',
    color: 'cyan',
    items: [
      { title: 'Follow-up email', idea: 'a polite follow-up email after sending a proposal a week ago', type: 'text', tone: 'professional' },
      { title: 'Thank-you note', idea: 'a warm thank-you email after a job interview', type: 'text', tone: 'professional' },
      { title: 'Apology email', idea: 'a sincere apology email to a customer for a late delivery', type: 'text', tone: 'professional' },
      { title: 'Meeting request', idea: 'a concise email requesting a 15-minute intro call', type: 'text', tone: 'professional' },
      { title: 'Out-of-office', idea: 'a friendly out-of-office auto-reply for a two-week holiday', type: 'text', tone: 'playful' },
    ],
  },
  {
    category: 'Career & Study',
    emoji: '🎓',
    color: 'indigo',
    items: [
      { title: 'Resume bullets', idea: 'strong resume bullet points for a marketing manager who grew social following', type: 'text', tone: 'professional' },
      { title: 'Cover letter', idea: 'a tailored cover letter for a UX designer role at a startup', type: 'text', tone: 'professional' },
      { title: 'Interview answer', idea: 'a STAR-method answer for “tell me about a time you handled conflict”', type: 'text', tone: 'professional' },
      { title: 'Study notes', idea: 'clean study notes on the causes of World War I', type: 'text', tone: 'detailed' },
      { title: 'Flashcards', idea: '10 question-and-answer flashcards about the human digestive system', type: 'text', tone: 'none' },
      { title: 'Explain simply (ELI5)', idea: 'explain how blockchain works like I’m five years old', type: 'text', tone: 'playful' },
    ],
  },
  {
    category: 'Personal & Fun',
    emoji: '🎉',
    color: 'emerald',
    items: [
      { title: 'Birthday message', idea: 'a heartfelt and funny birthday message for a best friend', type: 'text', tone: 'playful' },
      { title: 'Wedding speech', idea: 'a warm best-man speech with a couple of light jokes', type: 'text', tone: 'playful' },
      { title: 'Workout plan', idea: 'a beginner 4-week home workout plan with no equipment', type: 'text', tone: 'detailed' },
      { title: 'Recipe idea', idea: 'a quick 20-minute healthy dinner recipe using chicken and vegetables', type: 'text', tone: 'none' },
      { title: 'Trip itinerary', idea: 'a 3-day travel itinerary for a first visit to Rome', type: 'text', tone: 'detailed' },
      { title: 'Gift ideas', idea: 'thoughtful gift ideas under $50 for a coffee-loving dad', type: 'text', tone: 'none' },
    ],
  },
  {
    category: 'Images & Art',
    emoji: '🎨',
    color: 'fuchsia',
    items: [
      { title: 'Logo concept', idea: 'a minimalist logo for a space-themed tea brand', type: 'image', tone: 'minimalist' },
      { title: 'Fantasy scene', idea: 'a floating city above the clouds at golden hour', type: 'image', tone: 'cinematic' },
      { title: 'Product shot', idea: 'a luxury perfume bottle on a marble surface with soft light', type: 'image', tone: 'professional' },
      { title: 'Character design', idea: 'a friendly robot barista in a cozy cafe, cartoon style', type: 'image', tone: 'playful' },
      { title: 'Phone wallpaper', idea: 'a serene abstract gradient wallpaper in calming blues and purples', type: 'image', tone: 'minimalist' },
      { title: 'Coloring page', idea: 'a black-and-white coloring page of a happy dragon in a garden', type: 'image', tone: 'playful' },
      { title: 'Album cover', idea: 'a retro 80s synthwave album cover with neon grids and a sunset', type: 'image', tone: 'cinematic' },
    ],
  },
  {
    category: 'Video & Motion',
    emoji: '🎬',
    color: 'sky',
    items: [
      { title: 'Product teaser', idea: 'a 10-second teaser for a sleek new smartwatch', type: 'video', tone: 'cinematic' },
      { title: 'Explainer clip', idea: 'an explainer video showing how solar panels work', type: 'video', tone: 'detailed' },
      { title: 'Travel reel', idea: 'a fast-paced travel reel through the streets of Tokyo at night', type: 'video', tone: 'cinematic' },
      { title: 'YouTube intro', idea: 'a punchy 5-second animated intro for a tech review channel', type: 'video', tone: 'playful' },
      { title: 'Ad spot', idea: 'a 15-second social ad for a food-delivery app with upbeat energy', type: 'video', tone: 'playful' },
    ],
  },
];
