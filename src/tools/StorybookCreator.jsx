import { useState } from 'react';
import { BookOpen } from 'lucide-react';
import { generateText } from '../lib/api.js';
import { mdToHtml } from '../lib/markdown.js';
import ResultEditor from '../components/ResultEditor.jsx';
import LoadingResult from '../components/LoadingResult.jsx';
import { ToolHeader, ToolError, ToolButton, fieldClass, labelClass, LANGUAGES } from './ToolShell.jsx';

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
const PAGE_LENGTHS = [
  { id: 'short', label: 'Short (1-2 sentences)', instruction: '1-2 short, simple sentences' },
  { id: 'medium', label: 'Medium (3-4 sentences)', instruction: '3-4 sentences' },
  { id: 'long', label: 'Long (5-7 sentences)', instruction: '5-7 rich, descriptive sentences' },
];

export default function StorybookCreator() {
  const [idea, setIdea] = useState('');
  const [audience, setAudience] = useState('Kids (5-8)');
  const [genre, setGenre] = useState('Adventure');
  const [pages, setPages] = useState(6);
  const [pageLength, setPageLength] = useState('medium');
  const [language, setLanguage] = useState('English');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [story, setStory] = useState('');

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
      const out = await generateText({
        system:
          'You are a beloved children’s storybook author and illustrator. Create an original, ' +
          `age-appropriate storybook for the "${audience}" audience in the ${genre} genre, ` +
          `written in ${language}.\n\n` +
          'Format the output in clean Markdown EXACTLY like this:\n' +
          '# <Story Title>\n' +
          '_A short one-line tagline._\n\n' +
          `Then exactly ${pages} pages. For each page use:\n` +
          '## Page <n>\n' +
          `<${
            PAGE_LENGTHS.find((l) => l.id === pageLength)?.instruction || '3-4 sentences'
          } of story text appropriate for the audience>\n\n` +
          '**Illustration:** <a vivid image-generation prompt describing the scene, characters, ' +
          'setting, art style and mood>\n\n' +
          'Keep characters and style consistent across pages. End with a warm, satisfying ' +
          'conclusion. Respond with ONLY the Markdown, no preamble.',
        user: `Story idea: ${idea.trim()}`,
        maxTokens: 4000,
        temperature: 0.9,
      });
      setStory(out.trim());
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <ToolHeader
        icon={BookOpen}
        title="Storybook Creator"
        description="Turn an idea into an illustrated story, page by page"
      />

      <form
        onSubmit={create}
        className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-6"
      >
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
      </form>

      {loading ? (
        <div className="mt-6">
          <LoadingResult
            title="Your storybook"
            label="Creating your storybook"
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
