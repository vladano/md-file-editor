const test = require('node:test');
const assert = require('node:assert');
const { getAppInfo, detailsText, isAllowedLink, LINKS } = require('../src/app-info');

const pkg = { name: 'md-file-editor', productName: 'MD File Editor', version: '1.2.3', author: { name: 'vladano' } };
const versions = { electron: '1.0.0', chrome: '2.0.0', node: '3.0.0' };

test('getAppInfo reads product, version and author from package.json', () => {
  const info = getAppInfo(pkg, versions);
  assert.strictEqual(info.product, 'MD File Editor');
  assert.strictEqual(info.version, '1.2.3');
  assert.match(info.copyright, /vladano/);
  assert.strictEqual(info.electron, '1.0.0');
});

test('detailsText includes version, runtime and source', () => {
  const text = detailsText(getAppInfo(pkg, versions), 'TestOS');
  assert.match(text, /MD File Editor 1\.2\.3/);
  assert.match(text, /OS: TestOS/);
  assert.match(text, /Electron: 1\.0\.0/);
  assert.match(text, /github\.com\/vladano\/md-file-editor/);
});

test('only project links may be opened', () => {
  assert.ok(LINKS.every((l) => isAllowedLink(l.url)));
  assert.strictEqual(isAllowedLink('https://example.com'), false);
});
