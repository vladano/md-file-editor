# Changelog

All notable changes to this project are documented here.
The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and the project uses [Semantic Versioning](https://semver.org/).

## [Unreleased]

### Added
- App icon (`build/icon.svg`, `.png`, `.ico`, `.icns`), also used as the window icon.
- Demo GIF (split view with Mermaid and math), "Why this one?" comparison and download button in the README.
- `docs/TESTING.md` with the unit test overview and the manual test checklist.
- MIT license.
- Screenshot, quick start and download sections in the README.
- CI workflow that runs the unit tests on Windows, macOS and Linux.
- Release workflow that publishes Windows and Linux binaries and `SHA256SUMS.txt` when a `v*` tag is pushed.

### Fixed
- `npm test` now works on Node.js 20 (the glob pattern in the test script needs Node 21 or newer).

### Changed
- Renamed the app to MD File Editor (package `md-file-editor`, app ID `com.mdfileeditor.app`).
- Moved the detailed build instructions, build commands reference and app icon notes to `docs/BUILDING.md`.
- Moved the unit test overview and test checklist from the README to `docs/TESTING.md`.

## [1.0.0]

### Added
- Preview, editor and split view, outline panel, zoom, light/dark theme and find.
- GitHub-style tables, task lists, footnotes, emoji, KaTeX math, Mermaid diagrams and syntax highlighting.
- Live reload on file change, drag and drop, export to HTML and PDF.
- Windows, macOS and Linux builds with electron-builder.

[Unreleased]: https://github.com/vladano/md-file-editor/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/vladano/md-file-editor/releases/tag/v1.0.0
