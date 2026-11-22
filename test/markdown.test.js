const { test, describe } = require('node:test');
const assert = require('node:assert/strict');
const { createMarkdown, slugify } = require('../src/markdown');

const { render, outline } = createMarkdown();

describe('slugify', () => {
  test('lower-cases, removes punctuation and joins words with dashes', () => {
    assert.equal(slugify('Hello, World!'), 'hello-world');
    assert.equal(slugify('  Build on  Linux (WSL 2) '), 'build-on-linux-wsl-2');
    assert.equal(slugify('already-slugged_name'), 'already-slugged_name');
  });
});

describe('render: CommonMark basics', () => {
  test('headings get ids and data-line attributes', () => {
    const html = render('# Hello World\n\ntext');
    const h1 = html.match(/<h1([^>]*)>Hello World<\/h1>/);
    assert.ok(h1, 'h1 rendered');
    assert.match(h1[1], /\bid="hello-world"/);
    assert.match(h1[1], /\bdata-line="0"/);
    assert.match(html, /<p data-line="2">text<\/p>/);
  });
  test('emphasis, links and inline code', () => {
    const html = render('*a* **b** [k](https://kiro.dev) `c`');
    assert.match(html, /<em>a<\/em>/);
    assert.match(html, /<strong>b<\/strong>/);
    assert.match(html, /<a href="https:\/\/kiro.dev">k<\/a>/);
    assert.match(html, /<code>c<\/code>/);
  });
  test('bare URLs are linkified', () => {
    assert.match(render('see https://example.com now'), /<a href="https:\/\/example.com">https:\/\/example.com<\/a>/);
  });
  test('raw HTML is passed through (sanitized later in the renderer)', () => {
    assert.match(render('<kbd>Ctrl</kbd>'), /<kbd>Ctrl<\/kbd>/);
  });
});

describe('render: GitHub-flavored extensions', () => {
  test('tables', () => {
    const html = render('| a | b |\n|---|---|\n| 1 | 2 |');
    assert.match(html, /<table[^>]*>/);
    assert.match(html, /<th>a<\/th>/);
    assert.match(html, /<td>2<\/td>/);
  });
  test('task lists render checkboxes', () => {
    const html = render('- [x] done\n- [ ] todo');
    assert.match(html, /contains-task-list/);
    const boxes = html.match(/<input[^>]*type="checkbox"[^>]*>/g) || [];
    assert.equal(boxes.length, 2);
    assert.match(boxes[0], /\bchecked/);
    assert.doesNotMatch(boxes[1], /\bchecked/);
  });
  test('strikethrough', () => {
    assert.match(render('~~gone~~'), /<s>gone<\/s>/);
  });
  test('footnotes', () => {
    const html = render('Text[^1]\n\n[^1]: The note');
    assert.match(html, /class="footnote-ref"/);
    assert.match(html, /The note/);
  });
  test('emoji shortcodes', () => {
    assert.match(render(':smile:'), /😄/);
  });
});

describe('render: code, math and diagrams', () => {
  test('fenced code with a known language is highlighted', () => {
    const html = render('```js\nconst x = 1;\n```');
    assert.match(html, /<pre class="hljs"><code>/);
    assert.match(html, /<span class="hljs-keyword">const<\/span>/);
  });
  test('unknown language falls back to escaped plain code', () => {
    const html = render('```nosuchlang\n<b>&\n```');
    assert.match(html, /<pre class="hljs"><code>&lt;b&gt;&amp;/);
    assert.doesNotMatch(html, /<b>&/);
  });
  test('mermaid blocks become <pre class="mermaid"> with escaped source', () => {
    const html = render('```mermaid\ngraph TD; A-->B;\n```');
    assert.match(html, /<pre class="mermaid">graph TD; A--&gt;B;\n<\/pre>/);
    assert.doesNotMatch(html, /hljs/);
  });
  test('inline math is rendered by KaTeX', () => {
    assert.match(render('$E=mc^2$'), /class="katex"/);
  });
  test('block math is rendered by KaTeX in display mode', () => {
    assert.match(render('$$\n\\frac{a}{b}\n$$'), /katex-display/);
  });
});

describe('outline', () => {
  const src = [
    '# Title',          // 0
    '',
    'intro',
    '## Install `npm`', // 3
    '',
    '### Windows',      // 5
    '',
    '```md',
    '# not a heading',  // inside code fence
    '```',
    'Setext',           // 10
    '------'
  ].join('\n');

  test('lists headings with level, text, source line and id', () => {
    assert.deepEqual(outline(src), [
      { level: 1, text: 'Title', line: 0, id: 'title' },
      { level: 2, text: 'Install npm', line: 3, id: 'install-npm' },
      { level: 3, text: 'Windows', line: 5, id: 'windows' },
      { level: 2, text: 'Setext', line: 10, id: 'setext' }
    ]);
  });
  test('ids match the ids in the rendered HTML', () => {
    const html = render(src);
    for (const h of outline(src)) assert.match(html, new RegExp(`id="${h.id}"`));
  });
  test('returns an empty list when there are no headings', () => {
    assert.deepEqual(outline('just text\n\n- list'), []);
    assert.deepEqual(outline(''), []);
  });
});
