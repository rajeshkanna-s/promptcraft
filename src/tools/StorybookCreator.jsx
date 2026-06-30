import { useState } from 'react';
import { BookOpen } from 'lucide-react';
import { generateText } from '../lib/api.js';
import { mdToHtml } from '../lib/markdown.js';
import ResultEditor from '../components/ResultEditor.jsx';
import LoadingResult from '../components/LoadingResult.jsx';
import { ToolHeader, ToolError, ToolButton, ToolFormCard, fieldClass, labelClass, LANGUAGES } from './ToolShell.jsx';

const AUDIENCES = ['Toddlers (2-4)', 'Kids (5-8)', 'Tweens (9-12)', 'Teens', 'Adults'];
const GENRES = [
  'Adventure',
  'Fantasy',
  'Fairy Tale',
  'Bedtime',
  'Sci-Fi',
  'Mystery',
  'Educational',
  'Funny',
];
const PAGE_OPTIONS = [4, 6, 8, 10, 12];
// Each page is a full page of prose — at least 20 sentences.
const PAGE_LENGTHS = [
  { id: 'standard', label: 'Standard (~20 sentences)', sentences: 20 },
  { id: 'long', label: 'Long (~30 sentences)', sentences: 30 },
  { id: 'epic', label: 'Epic (~40 sentences)', sentences: 40 },
];

export default function StorybookCreator() {
  const [idea, setIdea] = useState('');
  const [audience, setAudience] = useState('Kids (5-8)');
  const [genre, setGenre] = useState('Adventure');
  const [pages, setPages] = useState(6);
  const [pageLength, setPageLength] = useState('standard');
  const [language, setLanguage] = useState('English');

  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState('');
  const [error, setError] = useState('');
  const [story, setStory] = useState('');

  // Pull a JSON object out of a model response (handles stray prose/fences).
  const parsePlan = (raw, n) => {
    try {
      const s = raw.indexOf('{');
      const e = raw.lastIndexOf('}');
      const obj = JSON.parse(raw.slice(s, e + 1));
      const beats = Array.isArray(obj.beats) ? obj.beats.map(String) : [];
      while (beats.length < n) beats.push('Continue the story.');
      return {
        title: obj.title || idea.trim(),
        tagline: obj.tagline || '',
        style: obj.style || '',
        beats: beats.slice(0, n),
      };
    } catch {
      return { title: idea.trim(), tagline: '', style: '', beats: Array(n).fill('Continue the story.') };
    }
  };

  const create = async (e) => {
    e?.preventDefault();
    if (!idea.trim()) {
      setError('Describe your story idea first.');
      return;
    }
    setError('');
    setLoading(true);
    setStory('');
    try {
      const sentences = PAGE_LENGTHS.find((l) => l.id === pageLength)?.sentences || 20;

      // 1) Plan the book (title, tagline, style/characters, one beat per page) so
      //    the page-by-page calls stay consistent.
      setProgress('Planning the story…');
      const planRaw = await generateText({
        system:
          `You are a storybook author. Plan an original ${genre} storybook for the "${audience}" ` +
          `audience, written in ${language}. Respond with ONLY valid JSON (no markdown, no ` +
          `preamble): {"title": string, "tagline": string, "style": string describing the art ` +
          `style and the main characters to keep consistent, "beats": array of exactly ${pages} ` +
          `one-sentence page beats that tell the full arc}.`,
        user: `Story idea: ${idea.trim()}`,
        maxTokens: 1200,
        temperature: 0.9,
      });
      const plan = parsePlan(planRaw, pages);

      // 2) Write each page on its own — this is what reliably hits the
      //    "at least N sentences" requirement (a single call tapers off).
      let md = `# ${plan.title}\n\n${plan.tagline ? `_${plan.tagline}_\n` : ''}`;
      let recap = '';
      for (let i = 0; i < pages; i++) {
        setProgress(`Writing page ${i + 1} of ${pages}…`);
        const isLast = i === pages - 1;
        const pageRaw = await generateText({
          system:
            `You are writing page ${i + 1} of ${pages} of a ${genre} storybook for the ` +
            `"${audience}" audience, in ${language}. Keep characters and art style consistent: ` +
            `${plan.style}. Write AT LEAST ${sentences} full, vivid sentences of flowing ` +
            `narrative for THIS page — use description, action, dialogue and feelings, and keep ` +
            `writing until you reach at least ${sentences} sentences. Do NOT stop short and do ` +
            `NOT rush. ${isLast ? 'Bring the story to a warm, satisfying conclusion. ' : ''}` +
            `After the prose, add exactly one final line starting with "**Illustration:** " that ` +
            `describes a vivid image-generation prompt for this page (scene, characters, setting, ` +
            `art style, mood). Output ONLY the page prose followed by that illustration line — no ` +
            `page heading, no preamble.`,
          user:
            `Overall idea: ${idea.trim()}\n` +
            `This page's beat: ${plan.beats[i]}\n` +
            `Story so far: ${recap || '(this is the first page)'}`,
          maxTokens: Math.min(4000, sentences * 32 + 300),
          temperature: 0.9,
        });
        const pageText = pageRaw.trim();
        md += `\n## Page ${i + 1}\n\n${pageText}\n`;
        const prose = pageText.split('**Illustration:**')[0].trim();
        recap = (recap + ' ' + prose).slice(-900);
      }
      setStory(md.trim());
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
      setProgress('');
    }
  };

  return (
    <div>
      <ToolHeader
        icon={BookOpen}
        title="Storybook Creator"
        description="Turn an idea into an illustrated story, page by page"
      />

      <ToolFormCard onSubmit={create}>
        <label htmlFor="story-idea" className={labelClass}>
          Story idea
        </label>
        <textarea
          id="story-idea"
          value={idea}
          onChange={(e) => setIdea(e.target.value)}
          rows={3}
          placeholder="e.g. A shy little fox who learns to make friends in a glowing forest"
          className={fieldClass}
        />

        <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <label htmlFor="story-audience" className={labelClass}>
              Audience
            </label>
            <select
              id="story-audience"
              value={audience}
              onChange={(e) => setAudience(e.target.value)}
              className={fieldClass}
            >
              {AUDIENCES.map((a) => (
                <option key={a} value={a}>
                  {a}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="story-genre" className={labelClass}>
              Genre
            </label>
            <select
              id="story-genre"
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
              className={fieldClass}
            >
              {GENRES.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="story-pages" className={labelClass}>
              Pages
            </label>
            <select
              id="story-pages"
              value={pages}
              onChange={(e) => setPages(Number(e.target.value))}
              className={fieldClass}
            >
              {PAGE_OPTIONS.map((p) => (
                <option key={p} value={p}>
                  {p} pages
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="story-page-length" className={labelClass}>
              Length per page
            </label>
            <select
              id="story-page-length"
              value={pageLength}
              onChange={(e) => setPageLength(e.target.value)}
              className={fieldClass}
            >
              {PAGE_LENGTHS.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="story-lang" className={labelClass}>
              Language
            </label>
            <select
              id="story-lang"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className={fieldClass}
            >
              {LANGUAGES.map((l) => (
                <option key={l} value={l}>
                  {l}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-4">
          <ToolError message={error} />
        </div>

        <div className="mt-4">
          <ToolButton type="submit" loading={loading}>
            <BookOpen size={18} />
            {loading ? 'Creating your storybook…' : 'Create Storybook'}
          </ToolButton>
        </div>
      </ToolFormCard>

      {loading ? (
        <div className="mt-6">
          <LoadingResult
            title="Your storybook"
            label={progress || 'Creating your storybook'}
            messages={[
              'Dreaming up characters…',
              'Plotting the adventure…',
              'Writing page by page…',
              'Sketching illustration prompts…',
              'Adding the happy ending…',
            ]}
          />
        </div>
      ) : story ? (
        <div className="mt-6">
          <ResultEditor
            content={mdToHtml(story)}
            title="Your storybook"
            filename="storybook"
            placeholder="Your storybook will appear here…"
          />
        </div>
      ) : null}
    </div>
  );
}
