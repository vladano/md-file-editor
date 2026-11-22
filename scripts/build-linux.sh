#!/usr/bin/env bash
# Builds Linux AppImage, .deb and .tar.gz (x64).
# Run on Linux (or WSL / Docker). Usage: ./scripts/build-linux.sh
set -euo pipefail
cd "$(dirname "$0")/.."

command -v node >/dev/null || { echo "Node.js is required (https://nodejs.org)." >&2; exit 1; }

echo "> Installing dependencies..."
npm ci

echo "> Building Linux binaries..."
npx electron-builder --linux

echo "> Done. Output is in ./dist"
ls -lh dist | grep -E '\.(AppImage|deb|tar\.gz)$' || true
