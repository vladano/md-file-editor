// Markdown rendering pipeline (markdown-it + plugins). Pure Node module, no Electron APIs,
// so it can be used from the preload script and from unit tests.
const MarkdownIt = require('markdown-it');
const anchor = require('markdown-it-anchor');
const hljs = require('highlight.js');

const plug = (m) => m.default || m;

/** Heading id slug: lower-case, drop punctuation, spaces become dashes. */
function slugify(s) {
  return String(s).trim().toLowerCase().replace(/[^\w\- ]+/g, '').replace(/\s+/g, '-');
}

function createMarkdown() {
  const md = new MarkdownIt({
    html: true,
    linkify: true,
    typographer: false,
    highlight(code, lang) {
      if (lang === 'mermaid') return `<pre class="mermaid">${md.utils.escapeHtml(code)}</pre>`;
      if (lang && hljs.getLanguage(lang)) {
        try {
          return `<pre class="hljs"><code>${hljs.highlight(code, { language: lang, ignoreIllegals: true }).value}</code></pre>`;
        } catch { /* fall through to plain output */ }
      }
      return `<pre class="hljs"><code>${md.utils.escapeHtml(code)}</code></pre>`;
    }
  });

  md.use(plug(anchor), { slugify });
  md.use(plug(require('markdown-it-task-lists')), { enabled: false, label: true });
  md.use(plug(require('markdown-it-footnote')));
  const emoji = plug(require('markdown-it-emoji'));
  md.use(emoji.full || emoji);
  md.use(plug(require('@iktakahiro/markdown-it-katex')));

  // Add data-line attributes to top-level block tokens so editor and preview can sync.
  md.core.ruler.push('source_lines', (state) => {
    for (const t of state.tokens) {
      if (t.map && t.nesting >= 0 && t.level === 0) t.attrSet('data-line', String(t.map[0]));
    }
  });

  /** Returns [{ level, text, line, id }] for every heading in the document. */
  function outline(src) {
    const tokens = md.parse(src, {});
    const out = [];
    tokens.forEach((t, i) => {
      if (t.type === 'heading_open') {
        const text = tokens[i + 1].children
          .filter((c) => c.type === 'text' || c.type === 'code_inline')
          .map((c) => c.content)
          .join('');
        out.push({ level: Number(t.tag.slice(1)), text, line: t.map ? t.map[0] : 0, id: t.attrGet('id') });
      }
    });
    return out;
  }

  return { md, render: (src) => md.render(src), outline };
}

module.exports = { createMarkdown, slugify };
