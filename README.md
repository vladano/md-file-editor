# MD File Editor

A desktop Markdown reader and editor built with Electron and markdown-it.

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

Prebuilt binaries are not published yet. You have two options:

- Build them yourself for Windows, macOS or Linux (see [Building binaries](#building-binaries)). The installers are written to `dist/`.
- Run the [GitHub Actions](.github/workflows/build.yml) workflow (Actions > Build > Run workflow, or push a tag like `v1.0.0`) and download the binaries from the run's Artifacts section.

| OS | Output |
|---|---|
| Windows | NSIS installer and portable `.exe` |
| macOS | `.dmg` and `.zip` |
| Linux | `.AppImage`, `.deb` and `.tar.gz` |

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

Binaries are produced by [electron-builder](https://www.electron.build) and written to the `dist/` folder.

Build each OS on that same OS. macOS apps can only be built on a Mac. Linux `.deb` packages need Linux tools. If you don't have all three machines, use the GitHub Actions workflow described below.

### Windows

Tested on Windows 10 22H2 with Node.js 24. On Windows you can build only the Windows binaries. For Linux use [WSL 2](#linux-on-windows-with-wsl-2) or [Docker](#linux-with-docker). For macOS use a Mac or [GitHub Actions](#all-platforms-with-github-actions).

There are no automated tests. Testing means running the app and checking it with the [test checklist](#test-checklist).

#### PowerShell

```powershell
cd G:\md-file-editor

# 1. Install dependencies (first time, or after package.json changes)
npm install

# 2. Run the app from source
npm start
npx electron . sample.md          # open a specific file

# 3. Build Windows binaries (installer + portable exe)
npm run dist:win
# or use the script (it runs a clean "npm ci" first):
pwsh ./scripts/build-windows.ps1

# 4. Test the built app
& ".\dist\win-unpacked\MD File Editor.exe" .\sample.md
& ".\dist\MD File Editor-1.0.0-portable.exe" .\sample.md
```

If you only have Windows PowerShell 5.1 (no `pwsh`), or the script is blocked by the execution policy, use:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\build-windows.ps1
```

#### Git Bash

```bash
cd /g/md-file-editor

# 1. Install dependencies
npm install

# 2. Run the app from source
npm start
npx electron . sample.md

# 3. Build Windows binaries
npm run dist:win
# or call the PowerShell script from bash:
powershell -ExecutionPolicy Bypass -File scripts/build-windows.ps1

# 4. Test the built app (quote the path, it contains spaces)
& "./dist/win-unpacked/MD File Editor.exe" sample.md
& "./dist/MD File Editor-1.0.0-portable.exe" sample.md
```

In Git Bash, `build-mac.sh` stops with a message because it only runs on macOS. `build-linux.sh` will start, but electron-builder can't build Linux packages on Windows. Use WSL 2 or Docker instead.

#### Output

Files written to `dist/`:

| File | Description |
|---|---|
| `MD File Editor Setup 1.0.0.exe` | Installer (x64 + arm64), lets you choose the install folder |
| `MD File Editor-1.0.0-portable.exe` | Portable app (x64, about 130 MB), no install needed |
| `win-unpacked/` | Unpacked app folder for quick testing (`MD File Editor.exe`) |

`npm run dist:win` builds all three targets and takes a few minutes. For a faster test build (portable x64 only), run:

```powershell
npx electron-builder --win portable --x64
```

#### Install, run and uninstall

- Installer: run `MD File Editor Setup 1.0.0.exe`, choose a folder and finish. MD File Editor is added to the Start menu, and `.md` files can be opened with it (right-click > Open with > MD File Editor). Uninstall it from Settings > Apps.
- Portable: copy `MD File Editor-1.0.0-portable.exe` anywhere and run it. You can drag a `.md` file onto the exe to open it.

#### Code signing

Unsigned builds trigger a Windows SmartScreen warning ("More info" > "Run anyway"). To sign, set `CSC_LINK` (path to `.pfx`) and `CSC_KEY_PASSWORD` before building:

```powershell
$env:CSC_LINK = "C:\path\to\certificate.pfx"
$env:CSC_KEY_PASSWORD = "<password>"
npm run dist:win
```

#### Windows troubleshooting

| Problem | Fix |
|---|---|
| `Package "electron" is only allowed in "devDependencies"` | `electron` must be listed under `devDependencies` in `package.json`, not `dependencies`. |
| Build fails with "file is in use" or "access denied" in `dist\` | Close every running `MD File Editor.exe` (check Task Manager), then build again. |
| `running scripts is disabled on this system` | Use `powershell -ExecutionPolicy Bypass -File .\scripts\build-windows.ps1`. |
| `pwsh` is not recognized | PowerShell 7 isn't installed. Use `powershell` (5.1) as shown above, or install PowerShell 7. |
| SmartScreen blocks the app | Expected for unsigned builds. Click "More info" > "Run anyway", or sign the build. |
| Warning `GpuControl.CreateCommandBuffer` in the terminal | Harmless Chromium message. Ignore it. |
| `default Electron icon is used` during build | No custom icon yet. See [App icon](#app-icon). |

### macOS

Run on macOS in Terminal:

```bash
chmod +x scripts/build-mac.sh
./scripts/build-mac.sh
# or
npm run dist:mac
```

Output in `dist/`:

| File | Description |
|---|---|
| `MD File Editor-1.0.0.dmg` / `MD File Editor-1.0.0-arm64.dmg` | Disk images for Intel and Apple Silicon |
| `MD File Editor-1.0.0-mac.zip` / `MD File Editor-1.0.0-arm64-mac.zip` | Zipped `.app` bundles |

Without an Apple Developer certificate the app is unsigned. To open it the first time, right-click the app and choose Open, or run:

```bash
xattr -cr "/Applications/MD File Editor.app"
```

To sign and notarize, set `CSC_LINK`, `CSC_KEY_PASSWORD`, `APPLE_ID`, `APPLE_APP_SPECIFIC_PASSWORD` and `APPLE_TEAM_ID` before building.

### Linux

Run on Linux (Ubuntu/Debian tested), or in WSL or Docker:

```bash
chmod +x scripts/build-linux.sh
./scripts/build-linux.sh
# or
npm run dist:linux
```

Output in `dist/`:

| File | Description |
|---|---|
| `MD File Editor-1.0.0.AppImage` | Runs on most distros: `chmod +x` then double-click |
| `md-file-editor_1.0.0_amd64.deb` | Debian/Ubuntu package: `sudo apt install ./md-file-editor_1.0.0_amd64.deb` |
| `md-file-editor-1.0.0.tar.gz` | Plain archive |

AppImage on newer distros may need FUSE: `sudo apt install libfuse2`.

#### Runtime libraries

Electron needs these system libraries to run, both from source and as a built app. On Ubuntu/Debian install them once:

```bash
sudo apt update
sudo apt install -y libnss3 libnspr4 libgtk-3-0 libgbm1 libasound2 libxss1 libxtst6 libnotify4 libsecret-1-0 libfuse2 fonts-noto-color-emoji
```

On Ubuntu 24.04 some package names end in `t64` (for example `libasound2t64`). apt usually suggests the right name if one isn't found.

Check that nothing is missing. No output means all libraries are installed:

```bash
ldd dist/linux-unpacked/md-file-editor | grep "not found"
```

#### Test the Linux build

```bash
./dist/linux-unpacked/md-file-editor sample.md      # unpacked build
./dist/MD\ Reader-1.0.0.AppImage sample.md          # AppImage

sudo apt install ./dist/md-file-editor_1.0.0_amd64.deb   # install the .deb
md-file-editor sample.md                                  # run the installed app
sudo apt remove md-file-editor                            # uninstall
```

### Linux on Windows with WSL 2

You can build and run the Linux version on a Windows PC with WSL 2. Tested with Ubuntu 22.04 on Windows 10 22H2, using WSL 2 from the Microsoft Store with WSLg.

#### 1. Check WSL

In PowerShell:

```powershell
wsl --version      # should list a "WSLg version" line, which is needed to show Linux GUI windows
wsl -l -v          # lists installed distros
```

If the default distro is not Ubuntu (Docker Desktop installs `docker-desktop`, for example), open Ubuntu by name or make it the default:

```powershell
wsl -d Ubuntu-22.04
wsl --set-default Ubuntu-22.04   # optional, then plain "wsl" opens Ubuntu
```

You can also open Ubuntu from the Start menu ("Ubuntu 22.04") or from the Windows Terminal tab dropdown. The prompt changes to something like `user@PC:~$`, which means you are in Linux. Run all of the following steps there.

#### 2. One-time setup in Ubuntu

Install Node.js 20 or newer if `node -v` shows nothing or an old version, for example with [nvm](https://github.com/nvm-sh/nvm):

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash
source ~/.bashrc
nvm install 22
```

Install rsync and the runtime libraries:

```bash
sudo apt update
sudo apt install -y rsync libnss3 libnspr4 libgtk-3-0 libgbm1 libasound2 libxss1 libxtst6 libnotify4 libsecret-1-0 libfuse2 fonts-noto-color-emoji
```

`sudo` asks for your Ubuntu user's password, which you set when Ubuntu was first installed. It is not your Windows password. Nothing is shown while you type. If you have forgotten it, reset it from PowerShell:

```powershell
wsl -d Ubuntu-22.04 -u root passwd <your-ubuntu-user>
```

#### 3. Copy the project into the Linux file system

Don't build directly in `/mnt/g/...` (the Windows drive). Its `node_modules` folder contains Windows Electron binaries, and builds on `/mnt/...` are much slower. Copy the code to your Linux home folder, skipping `node_modules` and `dist`:

```bash
rsync -a --delete --exclude node_modules --exclude dist /mnt/g/md-file-editor/ ~/md-file-editor/
cd ~/md-file-editor
npm ci
```

Change `/mnt/g/md-file-editor/` to wherever the project is on Windows. Drive `G:` is `/mnt/g`, `C:` is `/mnt/c`, and so on.

#### 4. Run from source

```bash
npm start
npx electron . sample.md
```

WSLg opens the app window on the Windows desktop.

#### 5. Build

```bash
npm run dist:linux        # or: ./scripts/build-linux.sh
```

The AppImage, `.deb` and `.tar.gz` are written to `~/md-file-editor/dist/`. Test them with the commands in [Test the Linux build](#test-the-linux-build).

To copy the files to Windows:

```bash
mkdir -p /mnt/g/md-file-editor/dist
cp dist/*.AppImage dist/*.deb dist/*.tar.gz /mnt/g/md-file-editor/dist/
```

You can also browse the Linux files from Windows Explorer at `\\wsl$\Ubuntu-22.04\home\<your-ubuntu-user>\md-file-editor\dist`.

#### 6. After changing code on Windows

Sync and rebuild:

```bash
rsync -a --delete --exclude node_modules --exclude dist /mnt/g/md-file-editor/ ~/md-file-editor/
cd ~/md-file-editor && npm ci && npm run dist:linux
```

`npm ci` is only needed when `package.json` or `package-lock.json` changed.

#### Run WSL commands from PowerShell or Git Bash

You can run any of the commands above from Windows without opening an Ubuntu shell:

```powershell
wsl -d Ubuntu-22.04 -- bash -lc 'cd ~/md-file-editor && npm run dist:linux'
```

### Linux troubleshooting

| Problem | Fix |
|---|---|
| `error while loading shared libraries: libnspr4.so` (or another `.so`) | A runtime library is missing. Install it with apt (see [Runtime libraries](#runtime-libraries)). `ldd dist/linux-unpacked/md-file-editor \| grep "not found"` lists what is missing. |
| Sandbox error when running `npm start` | For local testing, add `--no-sandbox`: `npx electron . --no-sandbox sample.md` |
| AppImage complains about FUSE | Install `libfuse2` (`libfuse2t64` on Ubuntu 24.04), or run it with `--appimage-extract-and-run` |
| `.deb` build fails with "Please specify project homepage" | `package.json` needs `homepage` and `author.email`. Set them to your real values. |
| `wsl` fails with `execvpe(bash) failed` | The default distro is not Ubuntu (for example `docker-desktop`). Use `wsl -d Ubuntu-22.04` or `wsl --set-default Ubuntu-22.04`. |
| No window appears under WSL | `wsl --version` must list WSLg, and `echo $DISPLAY` inside Ubuntu should print `:0`. Update WSL with `wsl --update`. |
| Warnings such as `GpuControl.CreateCommandBuffer`, `dri3 extension not supported`, `org.freedesktop.portal` | Harmless under WSLg. Ignore them. |

### Linux with Docker

Build the Linux binaries from Docker on any OS:

```bash
docker run --rm -v "$PWD":/project -w /project electronuserland/builder \
  bash -c "npm ci && npx electron-builder --linux"
```

### All platforms with GitHub Actions

`.github/workflows/build.yml` builds Windows, macOS and Linux on native runners.

1. Push the project to a GitHub repository.
2. Go to Actions > Build > Run workflow (or push a tag such as `v1.0.0`).
3. When it finishes, download the binaries from the run's Artifacts section.

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
