#!/usr/bin/env bash
# Builds macOS .dmg and .zip (Intel x64 + Apple Silicon arm64).
# Must run on macOS. Usage: ./scripts/build-mac.sh
set -euo pipefail
cd "$(dirname "$0")/.."

if [[ "$(uname)" != "Darwin" ]]; then
  echo "macOS builds must be run on a Mac (or via the GitHub Actions workflow)." >&2
  exit 1
fi
command -v node >/dev/null || { echo "Node.js is required (https://nodejs.org)." >&2; exit 1; }

echo "> Installing dependencies..."
npm ci

# Without an Apple Developer certificate the app is built unsigned.
# To sign/notarize, set CSC_LINK, CSC_KEY_PASSWORD, APPLE_ID,
# APPLE_APP_SPECIFIC_PASSWORD and APPLE_TEAM_ID before running.
if [[ -z "${CSC_LINK:-}" ]]; then
  export CSC_IDENTITY_AUTO_DISCOVERY=false
  echo "> No signing certificate found, building unsigned."
fi

echo "> Building macOS binaries..."
npx electron-builder --mac

echo "> Done. Output is in ./dist"
ls -lh dist | grep -E '\.(dmg|zip)$' || true
