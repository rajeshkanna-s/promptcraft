import { useEffect, useRef, useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit'; // v3: bundles Link, Underline, etc.
import { Image } from '@tiptap/extension-image';
import { Placeholder } from '@tiptap/extension-placeholder';
import { TaskList } from '@tiptap/extension-task-list';
import { TaskItem } from '@tiptap/extension-task-item';
import { Table, TableRow, TableHeader, TableCell } from '@tiptap/extension-table';
import {
  Heading1,
  Heading2,
  Bold,
  Italic,
  Strikethrough,
  Minus,
  Quote,
  List,
  ListOrdered,
  ListChecks,
  IndentDecrease,
  IndentIncrease,
  Table as TableIcon,
  Image as ImageIcon,
  Link as LinkIcon,
  Code,
  SquareCode,
  Copy,
  Check,
  Download,
  Sparkles,
} from 'lucide-react';

// One toolbar button.
function TBtn({ onClick, active, disabled, title, children }) {
  return (
    <button
      type="button"
      onMouseDown={(e) => e.preventDefault()} // keep editor selection
      onClick={onClick}
      disabled={disabled}
      title={title}
      aria-pressed={active}
      className={`inline-flex h-8 w-8 items-center justify-center rounded-md text-slate-600 transition disabled:opacity-40 dark:text-slate-300 ${
        active
          ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300'
          : 'hover:bg-slate-100 dark:hover:bg-slate-800'
      }`}
    >
      {children}
    </button>
  );
}

function Divider() {
  return <span className="mx-1 h-5 w-px bg-slate-200 dark:bg-slate-700" />;
}

function Toolbar({ editor }) {
  if (!editor) return null;
  const can = editor.can();

  return (
    <div className="flex flex-wrap items-center gap-0.5 border-b border-slate-200 bg-slate-50 px-2 py-1.5 dark:border-slate-800 dark:bg-slate-800/50">
      <TBtn
        title="Heading 1"
        active={editor.isActive('heading', { level: 1 })}
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
      >
        <Heading1 size={16} />
      </TBtn>
      <TBtn
        title="Heading 2"
        active={editor.isActive('heading', { level: 2 })}
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
      >
        <Heading2 size={16} />
      </TBtn>
      <TBtn
        title="Bold"
        active={editor.isActive('bold')}
        onClick={() => editor.chain().focus().toggleBold().run()}
      >
        <Bold size={16} />
      </TBtn>
      <TBtn
        title="Italic"
        active={editor.isActive('italic')}
        onClick={() => editor.chain().focus().toggleItalic().run()}
      >
        <Italic size={16} />
      </TBtn>
      <TBtn
        title="Strikethrough"
        active={editor.isActive('strike')}
        onClick={() => editor.chain().focus().toggleStrike().run()}
      >
        <Strikethrough size={16} />
      </TBtn>

      <Divider />

      <TBtn title="Horizontal rule" onClick={() => editor.chain().focus().setHorizontalRule().run()}>
        <Minus size={16} />
      </TBtn>
      <TBtn
        title="Quote"
        active={editor.isActive('blockquote')}
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
      >
        <Quote size={16} />
      </TBtn>

      <Divider />

      <TBtn
        title="Bullet list"
        active={editor.isActive('bulletList')}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
      >
        <List size={16} />
      </TBtn>
      <TBtn
        title="Numbered list"
        active={editor.isActive('orderedList')}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
      >
        <ListOrdered size={16} />
      </TBtn>
      <TBtn
        title="Task list"
        active={editor.isActive('taskList')}
        onClick={() => editor.chain().focus().toggleTaskList().run()}
      >
        <ListChecks size={16} />
      </TBtn>
      <TBtn
        title="Outdent"
        disabled={!can.liftListItem('listItem') && !can.liftListItem('taskItem')}
        onClick={() =>
          editor.chain().focus().liftListItem('taskItem').liftListItem('listItem').run()
        }
      >
        <IndentDecrease size={16} />
      </TBtn>
      <TBtn
        title="Indent"
        disabled={!can.sinkListItem('listItem') && !can.sinkListItem('taskItem')}
        onClick={() =>
          editor.chain().focus().sinkListItem('taskItem').sinkListItem('listItem').run()
        }
      >
        <IndentIncrease size={16} />
      </TBtn>

      <Divider />

      <TBtn
        title="Insert table"
        onClick={() =>
          editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()
        }
      >
        <TableIcon size={16} />
      </TBtn>
      <TBtn
        title="Insert image"
        onClick={() => {
          const url = window.prompt('Image URL');
          if (url) editor.chain().focus().setImage({ src: url }).run();
        }}
      >
        <ImageIcon size={16} />
      </TBtn>
      <TBtn
        title="Insert / edit link"
        active={editor.isActive('link')}
        onClick={() => {
          const prev = editor.getAttributes('link').href || '';
          const url = window.prompt('Link URL', prev);
          if (url === null) return;
          if (url === '') editor.chain().focus().unsetLink().run();
          else editor.chain().focus().setLink({ href: url }).run();
        }}
      >
        <LinkIcon size={16} />
      </TBtn>

      <Divider />

      <TBtn
        title="Inline code"
        active={editor.isActive('code')}
        onClick={() => editor.chain().focus().toggleCode().run()}
      >
        <Code size={16} />
      </TBtn>
      <TBtn
        title="Code block"
        active={editor.isActive('codeBlock')}
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
      >
        <SquareCode size={16} />
      </TBtn>
    </div>
  );
}

export default function ResultEditor({
  content,
  title = 'Your Result',
  filename = 'promptcraft',
  placeholder = 'Your generated content will appear here…',
}) {
  const [copied, setCopied] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [stats, setStats] = useState({ words: 0, chars: 0 });
  const lastContent = useRef(null);

  const computeStats = (ed) => {
    if (!ed) return;
    const text = ed.getText();
    const trimmed = text.trim();
    setStats({ words: trimmed ? trimmed.split(/\s+/).length : 0, chars: text.length });
  };

  const editor = useEditor({
    onUpdate: ({ editor: ed }) => computeStats(ed),
    extensions: [
      StarterKit.configure({ link: { openOnClick: false, autolink: true } }),
      Image,
      Placeholder.configure({ placeholder }),
      TaskList,
      TaskItem.configure({ nested: true }),
      Table.configure({ resizable: true }),
      TableRow,
      TableHeader,
      TableCell,
    ],
    content: content || '',
    editorProps: {
      attributes: {
        class: 'pc-editor focus:outline-none min-h-[20rem] px-5 py-4',
      },
    },
  });

  // Load fresh generated content into the editor (without wiping manual edits
  // between generations — only updates when the incoming content changes).
  useEffect(() => {
    if (editor && content != null && content !== lastContent.current) {
      editor.commands.setContent(content);
      lastContent.current = content;
      computeStats(editor);
    }
  }, [editor, content]);

  const copyText = async () => {
    try {
      await navigator.clipboard.writeText(editor?.getText() ?? '');
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* ignore */
    }
  };

  const download = (format) => {
    setMenuOpen(false);
    if (!editor) return;
    const stamp = new Date().toISOString().slice(0, 10);
    let data = '';
    let mime = 'text/plain';
    let ext = 'txt';
    if (format === 'html') {
      data = editor.getHTML();
      mime = 'text/html';
      ext = 'html';
    } else if (format === 'md') {
      data = editor.getText();
      mime = 'text/markdown';
      ext = 'md';
    } else {
      data = editor.getText();
    }
    const blob = new Blob([data], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}-${stamp}.${ext}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const btnClass =
    'inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 shadow-sm transition hover:border-indigo-300 hover:text-indigo-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:border-indigo-700 dark:hover:text-indigo-300';

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-md ring-1 ring-black/[0.02] dark:border-slate-800 dark:bg-slate-900">
      {/* Gradient accent strip */}
      <div className="h-1 bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500" />

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 bg-gradient-to-r from-indigo-50/70 to-fuchsia-50/40 px-4 py-3 dark:border-slate-800 dark:from-slate-800/50 dark:to-slate-800/20">
        <div className="flex items-center gap-2.5">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-fuchsia-500 text-white shadow-sm">
            <Sparkles size={16} />
          </span>
          <div className="leading-tight">
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">{title}</h3>
            <p className="text-[11px] text-slate-400 dark:text-slate-500">
              {stats.words.toLocaleString()} words · {stats.chars.toLocaleString()} characters ·
              editable
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <button type="button" onClick={copyText} title="Copy all text" className={btnClass}>
            {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
            {copied ? 'Copied' : 'Copy'}
          </button>
          <div className="relative">
            <button
              type="button"
              onClick={() => setMenuOpen((o) => !o)}
              title="Download"
              className={btnClass}
            >
              <Download size={14} /> Download
            </button>
            {menuOpen && (
              <div className="absolute right-0 z-10 mt-1 w-36 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg dark:border-slate-700 dark:bg-slate-800">
                {[
                  ['md', 'Markdown (.md)'],
                  ['txt', 'Text (.txt)'],
                  ['html', 'HTML (.html)'],
                ].map(([fmt, label]) => (
                  <button
                    key={fmt}
                    type="button"
                    onClick={() => download(fmt)}
                    className="block w-full px-3 py-2 text-left text-xs font-medium text-slate-600 transition hover:bg-indigo-50 hover:text-indigo-700 dark:text-slate-300 dark:hover:bg-slate-700"
                  >
                    {label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <Toolbar editor={editor} />

      {/* Editable content (scrolls within the panel for long output) */}
      <div className="thin-scroll max-h-[34rem] overflow-y-auto">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
