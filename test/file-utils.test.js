const { test, describe } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { MARKDOWN_EXTENSIONS, isMarkdownPath, fileFromArgv, resolveRelative } = require('../src/file-utils');

describe('isMarkdownPath', () => {
  test('accepts every supported extension, case-insensitively', () => {
    for (const ext of MARKDOWN_EXTENSIONS) {
      assert.equal(isMarkdownPath(`a.${ext}`), true, ext);
      assert.equal(isMarkdownPath(`A.${ext.toUpperCase()}`), true, ext);
    }
  });
  test('rejects other files and non-strings', () => {
    for (const p of ['a.txt', 'a.md.bak', 'md', 'a.mdx', '', null, undefined, 42]) {
      assert.equal(isMarkdownPath(p), false, String(p));
    }
  });
});

describe('fileFromArgv', () => {
  const existing = new Set(['notes.md', 'C:\\docs\\a.md']);
  const isFile = (p) => existing.has(p);

  test('development: skips electron and app dir', () => {
    assert.equal(fileFromArgv(['electron', '.', 'notes.md'], false, isFile), 'notes.md');
  });
  test('development: does not treat the app dir as the file', () => {
    assert.equal(fileFromArgv(['electron', 'notes.md'], false, isFile), undefined);
  });
  test('packaged: skips only the executable', () => {
    assert.equal(fileFromArgv(['MD File Editor.exe', 'C:\\docs\\a.md'], true, isFile), 'C:\\docs\\a.md');
  });
  test('ignores flags such as --no-sandbox', () => {
    assert.equal(fileFromArgv(['app', '--no-sandbox', 'notes.md'], true, isFile), 'notes.md');
  });
  test('ignores arguments that are not existing files', () => {
    assert.equal(fileFromArgv(['app', 'missing.md', 'notes.md'], true, isFile), 'notes.md');
    assert.equal(fileFromArgv(['app', 'missing.md'], true, isFile), undefined);
  });
  test('default isFile checks the real file system (directories are not files)', () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'mdr-'));
    const file = path.join(dir, 'real.md');
    fs.writeFileSync(file, '# hi');
    try {
      assert.equal(fileFromArgv(['app', dir, file], true), file);
    } finally {
      fs.rmSync(dir, { recursive: true, force: true });
    }
  });
});

describe('resolveRelative', () => {
  const base = path.resolve('/docs/guide/index.md');
  const always = () => true;
  const never = () => false;

  test('resolves relative to the folder of the current file', () => {
    assert.equal(resolveRelative(base, 'other.md', always), path.resolve('/docs/guide/other.md'));
    assert.equal(resolveRelative(base, '../readme.md', always), path.resolve('/docs/readme.md'));
  });
  test('strips #anchor and ?query', () => {
    assert.equal(resolveRelative(base, 'other.md#setup', always), path.resolve('/docs/guide/other.md'));
    assert.equal(resolveRelative(base, 'other.md?x=1', always), path.resolve('/docs/guide/other.md'));
  });
  test('decodes URL-encoded characters', () => {
    assert.equal(resolveRelative(base, 'my%20notes.md', always), path.resolve('/docs/guide/my notes.md'));
  });
  test('does not throw on malformed encoding', () => {
    assert.equal(resolveRelative(base, 'bad%E0%A4%A.md', always), path.resolve('/docs/guide/bad%E0%A4%A.md'));
  });
  test('returns null when the target does not exist', () => {
    assert.equal(resolveRelative(base, 'other.md', never), null);
  });
  test('returns null for a pure anchor link', () => {
    assert.equal(resolveRelative(base, '#section', always), null);
  });
  test('passes the resolved path to the exists check', () => {
    let seen;
    resolveRelative(base, 'x.md', (p) => { seen = p; return true; });
    assert.equal(seen, path.resolve('/docs/guide/x.md'));
  });
});
