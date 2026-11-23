# Testing

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
- Help > About MD File Editor opens a modal window with the icon, version, description, copyright and five links. A link opens in the browser, "Copy details" puts the version and system details on the clipboard, and Esc or Close closes it. Check it in light and dark mode.
- The window, taskbar and installer show the MD File Editor icon, not the default Electron icon.
