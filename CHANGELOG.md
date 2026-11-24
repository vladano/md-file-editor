# Changelog

All notable changes to this project are documented here.
The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and the project uses [Semantic Versioning](https://semver.org/).

## [Unreleased]

## [1.1.1] - 2026-11-23
### Added
- Release files are signed with Sigstore build provenance attestations. Verify a download with `gh attestation verify <file> --repo vladano/md-file-editor`.
### Changed
- README and the manual test checklist now cover the About window.

## [1.1.0] - 2026-11-23
### Added
- Help > About MD File Editor: shows the version, description, copyright and project links (source code, documentation, latest release, issues, license), with a "Copy details" button for bug reports.

## [1.0.3] - 2026-11-22
### Added
- macOS `.dmg` and `.zip` builds (Intel and Apple Silicon) in the Build workflow. They are attached to releases together with the Windows and Linux binaries.
- Bug reporting guidance and issue template configuration.

## [1.0.2] - 2026-11-22
### Fixed
- PDF export no longer leaves a mostly empty page before a code block that is taller than one page. Such blocks now start right after their heading and split across pages.
### Added
- The PDF export example now includes a listing taller than a page.

## [1.0.1] - 2026-11-22
### Fixed
- PDF export no longer leaves a heading alone at the bottom of a page, and no longer splits code blocks, tables, quotes or images that fit on one page. Long code lines now wrap in the PDF.


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

[Unreleased]: https://github.com/vladano/md-file-editor/compare/v1.0.3...HEAD
[1.0.3]: https://github.com/vladano/md-file-editor/compare/v1.0.2...v1.0.3
[1.0.2]: https://github.com/vladano/md-file-editor/compare/v1.0.1...v1.0.2
[1.0.1]: https://github.com/vladano/md-file-editor/compare/v1.0.0...v1.0.1
[1.0.0]: https://github.com/vladano/md-file-editor/releases/tag/v1.0.0
