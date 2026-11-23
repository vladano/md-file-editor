const os = require('os');

const REPOSITORY_URL = 'https://github.com/vladano/md-file-editor';

/** Project links shown in the About window. Only these URLs may be opened from it. */
const LINKS = [
  { id: 'repo', label: 'Source code on GitHub', url: REPOSITORY_URL },
  { id: 'manual', label: 'Documentation', url: `${REPOSITORY_URL}#documentation` },
  { id: 'releases', label: 'Check for a newer version', url: `${REPOSITORY_URL}/releases/latest` },
  { id: 'issues', label: 'Report a problem or suggest an idea', url: `${REPOSITORY_URL}/issues/new/choose` },
  { id: 'license', label: 'Free and open source: MIT License', url: `${REPOSITORY_URL}/blob/main/LICENSE` }
];

const DESCRIPTION = 'Free cross-platform Markdown editor and reader with live preview, Mermaid diagrams and math.';

/** Builds the data the About window shows, from package.json and the runtime versions. */
function getAppInfo(pkg, versions = process.versions) {
  const author = pkg.author && pkg.author.name ? pkg.author.name : 'the authors';
  const year = new Date().getFullYear();
  return {
    product: pkg.productName || pkg.name,
    version: pkg.version,
    description: DESCRIPTION,
    copyright: `Copyright © ${year} ${author}`,
    repositoryUrl: REPOSITORY_URL,
    links: LINKS,
    electron: versions.electron,
    chrome: versions.chrome,
    node: versions.node
  };
}

/** Text for "Copy details": what a bug report needs to know about this installation. */
function detailsText(info, platform = `${os.type()} ${os.release()} (${os.arch()})`) {
  return [
    `${info.product} ${info.version}`,
    `OS: ${platform}`,
    `Electron: ${info.electron}  Chromium: ${info.chrome}  Node.js: ${info.node}`,
    `Source: ${info.repositoryUrl}`
  ].join('\n');
}

function isAllowedLink(url) {
  return LINKS.some((l) => l.url === url);
}

module.exports = { REPOSITORY_URL, LINKS, getAppInfo, detailsText, isAllowedLink };
