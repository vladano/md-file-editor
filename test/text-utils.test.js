const { test, describe } = require('node:test');
const assert = require('node:assert/strict');
const T = require('../src/text-utils');

describe('countWords', () => {
  test('counts words separated by any whitespace', () => {
    assert.equal(T.countWords('one two\tthree\nfour  five'), 5);
  });
  test('returns 0 for empty or whitespace-only text', () => {
    assert.equal(T.countWords(''), 0);
    assert.equal(T.countWords('   \n\t '), 0);
  });
  test('counts Markdown syntax tokens as words', () => {
    assert.equal(T.countWords('# Title'), 2);
  });
});

describe('normalizeEol', () => {
  test('converts CRLF and CR to LF', () => {
    assert.equal(T.normalizeEol('a\r\nb\rc\nd'), 'a\nb\nc\nd');
  });
  test('leaves LF-only text unchanged', () => {
    assert.equal(T.normalizeEol('a\nb'), 'a\nb');
  });
});

describe('clampZoom', () => {
  test('keeps values inside the range', () => {
    assert.equal(T.clampZoom(1.5), 1.5);
  });
  test('clamps to the minimum and maximum', () => {
    assert.equal(T.clampZoom(0.1), T.ZOOM_MIN);
    assert.equal(T.clampZoom(10), T.ZOOM_MAX);
  });
  test('rounds floating point noise from repeated +0.1 steps', () => {
    let z = 1;
    for (let i = 0; i < 3; i++) z = T.clampZoom(z + 0.1);
    assert.equal(z, 1.3);
  });
  test('falls back to 1 for invalid input', () => {
    assert.equal(T.clampZoom(NaN), 1);
    assert.equal(T.clampZoom('abc'), 1);
    assert.equal(T.clampZoom(undefined), 1);
  });
  test('accepts numeric strings (values read from localStorage)', () => {
    assert.equal(T.clampZoom('1.2'), 1.2);
  });
});

describe('isRelativeSrc', () => {
  test('true for relative paths', () => {
    assert.equal(T.isRelativeSrc('images/a.png'), true);
    assert.equal(T.isRelativeSrc('./a.png'), true);
    assert.equal(T.isRelativeSrc('../a%20b.png'), true);
  });
  test('false for absolute URLs, data URIs, protocol-relative and anchors', () => {
    for (const s of ['https://x.com/a.png', 'http://x/a.png', 'file:///C:/a.png', 'data:image/png;base64,AA', '//cdn/a.png', '#top']) {
      assert.equal(T.isRelativeSrc(s), false, s);
    }
  });
  test('false for empty values', () => {
    assert.equal(T.isRelativeSrc(''), false);
    assert.equal(T.isRelativeSrc(null), false);
  });
});

describe('isExternalHref', () => {
  test('true for links with a scheme', () => {
    for (const h of ['https://kiro.dev', 'mailto:a@b.c', 'file:///x.md', 'vscode://x']) {
      assert.equal(T.isExternalHref(h), true, h);
    }
  });
  test('false for relative links and anchors', () => {
    for (const h of ['other.md', './docs/a.md#x', '#section', '']) {
      assert.equal(T.isExternalHref(h), false, h);
    }
  });
});

describe('baseName / stripExtension / windowTitle', () => {
  test('baseName handles Windows and POSIX paths', () => {
    assert.equal(T.baseName('C:\\docs\\readme.md'), 'readme.md');
    assert.equal(T.baseName('/home/u/notes.md'), 'notes.md');
  });
  test('baseName returns Untitled when there is no path', () => {
    assert.equal(T.baseName(null), 'Untitled');
    assert.equal(T.baseName(''), 'Untitled');
  });
  test('stripExtension removes only the last extension', () => {
    assert.equal(T.stripExtension('a.b.md'), 'a.b');
    assert.equal(T.stripExtension('noext'), 'noext');
  });
  test('windowTitle marks unsaved changes', () => {
    assert.equal(T.windowTitle('/x/a.md', false), 'a.md - MD File Editor');
    assert.equal(T.windowTitle('/x/a.md', true), '● a.md - MD File Editor');
    assert.equal(T.windowTitle(null, false), 'Untitled - MD File Editor');
  });
});

describe('lineToOffset', () => {
  const text = 'ab\ncde\n\nf';
  test('returns the start offset of each line', () => {
    assert.equal(T.lineToOffset(text, 0), 0);
    assert.equal(T.lineToOffset(text, 1), 3);
    assert.equal(T.lineToOffset(text, 2), 7);
    assert.equal(T.lineToOffset(text, 3), 8);
    assert.equal(text[T.lineToOffset(text, 3)], 'f');
  });
  test('does not run past the end for out-of-range lines', () => {
    assert.equal(T.lineToOffset(text, 99), text.length + 1);
  });
});

describe('findInText', () => {
  const text = 'Foo bar foo BAR foo';
  test('finds forward from the selection end, case-insensitively', () => {
    assert.equal(T.findInText(text, 'foo', 0, 0, 1), 0);
    assert.equal(T.findInText(text, 'foo', 0, 3, 1), 8);
    assert.equal(T.findInText(text, 'FOO', 8, 11, 1), 16);
  });
  test('wraps around to the start when searching forward', () => {
    assert.equal(T.findInText(text, 'foo', 16, 19, 1), 0);
  });
  test('finds backward from the selection start', () => {
    assert.equal(T.findInText(text, 'foo', 16, 19, -1), 8);
    assert.equal(T.findInText(text, 'foo', 8, 11, -1), 0);
  });
  test('wraps around to the end when searching backward from the start', () => {
    assert.equal(T.findInText(text, 'foo', 0, 3, -1), 16);
  });
  test('returns -1 when there is no match or no query', () => {
    assert.equal(T.findInText(text, 'zzz', 0, 0, 1), -1);
    assert.equal(T.findInText(text, '', 0, 0, 1), -1);
  });
});

describe('findAll', () => {
  test('returns all non-overlapping, case-insensitive matches', () => {
    assert.deepEqual(T.findAll('aAaa', 'aa'), [0, 2]);
    assert.deepEqual(T.findAll('Hello hello', 'HELLO'), [0, 6]);
  });
  test('returns an empty list for no match or empty query', () => {
    assert.deepEqual(T.findAll('abc', 'x'), []);
    assert.deepEqual(T.findAll('abc', ''), []);
  });
});

describe('cycleIndex', () => {
  test('moves forward and wraps to 0', () => {
    assert.equal(T.cycleIndex(0, 1, 3), 1);
    assert.equal(T.cycleIndex(2, 1, 3), 0);
  });
  test('moves backward and wraps to the end', () => {
    assert.equal(T.cycleIndex(0, -1, 3), 2);
  });
  test('first step from "nothing selected" (-1) selects the first match', () => {
    assert.equal(T.cycleIndex(-1, 0, 3), 0); // new search
    assert.equal(T.cycleIndex(-1, 1, 3), 0);
    assert.equal(T.cycleIndex(-1, -1, 3), 2);
  });
  test('returns -1 when there are no results', () => {
    assert.equal(T.cycleIndex(0, 1, 0), -1);
  });
});

describe('isTallCode', () => {
  test('short blocks are kept together on one page', () => {
    assert.equal(T.isTallCode(10, 1), false);
    assert.equal(T.isTallCode(30, 1), false);
  });
  test('blocks of about 80% of a page or more may split', () => {
    assert.equal(T.isTallCode(38, 1), true);
    assert.equal(T.isTallCode(70, 1), true);
  });
  test('depends on the zoom level', () => {
    assert.equal(T.isTallCode(30, 1.5), true);
    assert.equal(T.isTallCode(38, 0.5), false);
  });
  test('treats a missing zoom as 1', () => {
    assert.equal(T.isTallCode(70), true);
  });
});
