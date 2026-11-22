# MD File Editor

[![Latest release](https://img.shields.io/github/v/release/vladano/md-file-editor?include_prereleases)](https://github.com/vladano/md-file-editor/releases/latest)
[![Build](https://github.com/vladano/md-file-editor/actions/workflows/build.yml/badge.svg)](https://github.com/vladano/md-file-editor/actions/workflows/build.yml)
[![CI](https://github.com/vladano/md-file-editor/actions/workflows/ci.yml/badge.svg)](https://github.com/vladano/md-file-editor/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/github/license/vladano/md-file-editor)](LICENSE)
![Platforms](https://img.shields.io/badge/platforms-Windows%20%7C%20macOS%20%7C%20Linux-blue)

A free, open source desktop Markdown reader and editor for Windows, macOS and Linux, built with Electron and markdown-it.

- Live preview, editor and split view
- Math (KaTeX), Mermaid diagrams, syntax highlighting, tables, task lists, footnotes
- Export to HTML and PDF
- Works offline, no account needed

This app was created using the [AWS Kiro](https://kiro.dev) IDE environment.

<p align="center">
  <img src="screenshot.JPG" alt="MD File Editor screenshot" width="600">
</p>

Features: preview / editor / split view, outline panel, zoom in/out, light/dark theme, find, GitHub-style tables, task lists, footnotes, emoji, KaTeX math, Mermaid diagrams, syntax highlighting, live reload on file change, drag & drop, export to HTML and PDF.

## Quick start

```bash
git clone https://github.com/vladano/md-file-editor.git
cd md-file-editor
npm install
npm start
```

To open a specific file: `npx electron . path/to/file.md`. To run the unit tests: `npm test`.

## Download and install

Download the latest version for your OS from the [Releases page](https://github.com/vladano/md-file-editor/releases/latest).

| OS | Download |
|---|---|
| Windows | Installer (`Setup ... .exe`) or portable `.exe` |
| macOS | `.dmg` (Intel and Apple Silicon) or `.zip` |
| Linux | `.AppImage`, `.deb` or `.tar.gz` |

Each release includes a `SHA256SUMS.txt` file so you can verify your download.

The builds are not code signed yet, so your OS may show a warning on first launch:

- Windows: SmartScreen shows "Windows protected your PC". Click "More info" > "Run anyway".
- macOS: right-click the app and choose Open, or run `xattr -cr "/Applications/MD File Editor.app"`.
- Linux: `chmod +x` the AppImage, or install the `.deb` with `sudo apt install ./file.deb`.

To build it yourself, see [docs/BUILDING.md](docs/BUILDING.md).
## Requirements

- [Node.js](https://nodejs.org) 20 or newer (includes npm)
- Git (optional, to clone the repository)

Install dependencies once:

```bash
npm install
```

Run in development mode:

```bash
npm start
# or open a specific file
npx electron . path/to/file.md
```

## Building binaries

Step-by-step build instructions for Windows, macOS, Linux (including WSL 2 and Docker) and GitHub Actions are in [docs/BUILDING.md](docs/BUILDING.md).

Short version: `npm run dist:win`, `npm run dist:mac` or `npm run dist:linux`, each on its own OS. Output goes to `dist/`. See also the [build commands reference](#build-commands-reference).

## Unit tests

Unit tests use the built-in [Node.js test runner](https://nodejs.org/api/test.html), so they need no extra dependencies. Run them on any OS (PowerShell, Git Bash, Linux, WSL, macOS):

```bash
npm test
```

Run a single file, or only the tests whose name matches a pattern:

```bash
node --test test/markdown.test.js
node --test --test-name-pattern="outline" "test/**/*.test.js"
```

| Test file | Module under test | What it covers |
|---|---|---|
| `test/markdown.test.js` | `src/markdown.js` | Heading ids, tables, task lists, footnotes, emoji, code highlighting, Mermaid blocks, KaTeX math, outline extraction |
| `test/file-utils.test.js` | `src/file-utils.js` | Markdown extension check, picking the file from command-line arguments, resolving relative links |
| `test/text-utils.test.js` | `src/text-utils.js` | Word count, line endings, zoom limits, link/image classification, window title, find and wrap-around |

The GitHub Actions workflow runs `npm test` before every build.

The tests cover the logic in `src/`. The Electron windows, menus, dialogs and DOM code in `main.js`, `preload.js` and `renderer.js` are not unit tested. Check those by hand with the checklist below.

## Test checklist

Open `sample.md` in the app (from source or a built binary) and check:

- The file opens and the window title shows `sample.md - MD File Editor`.
- Ctrl+1 / Ctrl+2 / Ctrl+3 switch between preview, editor and split view.
- Zoom works with the − / 100% / + toolbar buttons, Ctrl+mouse wheel, and Ctrl+= / Ctrl+- / Ctrl+0.
- The preview shows the table, task list, math formula, highlighted code, Mermaid diagram and footnote.
- Ctrl+F finds text, Ctrl+B toggles the outline, Ctrl+T toggles the theme.
- After an edit the title shows `●`, and Ctrl+S saves and clears it.
- File > Export as HTML and Export as PDF each create a file.
- Editing `sample.md` in another editor reloads the preview automatically.

## Build commands reference

| Command | Result |
|---|---|
| `npm run dist` | Build for the current OS |
| `npm run dist:win` | Windows installer + portable |
| `npm run dist:mac` | macOS dmg + zip |
| `npm run dist:linux` | AppImage, deb, tar.gz |
| `npm run dist:all` | All three (works only where the toolchains are available) |

## App icon

No custom icon is included, so the default Electron icon is used. To add one, create a `build/` folder with:

- `build/icon.ico` (Windows, 256x256)
- `build/icon.icns` (macOS)
- `build/icon.png` (Linux, 512x512)

electron-builder picks them up automatically.

## Keyboard shortcuts

| Shortcut | Action |
|---|---|
| Ctrl+O / Ctrl+S / Ctrl+Shift+S | Open / Save / Save As |
| Ctrl+1 / Ctrl+2 / Ctrl+3 | Preview / Editor / Split view |
| Ctrl+B | Toggle outline |
| Ctrl+T | Toggle theme |
| Ctrl+F | Find |
| Ctrl+= / Ctrl+- / Ctrl+0 | Zoom in / out / reset |
| Ctrl+mouse wheel | Zoom |

On macOS use Cmd instead of Ctrl.

## License

MIT License. Free to use, copy, modify and distribute for personal and commercial purposes. Copyright (c) 2026 [vladano](https://github.com/vladano).

The copyright notice and the permission notice in the [LICENSE](LICENSE) file must be kept in all copies or substantial portions of the software.
