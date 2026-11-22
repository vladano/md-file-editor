# Builds the Windows installer (NSIS, x64 + arm64) and a portable .exe.
# Usage:  pwsh ./scripts/build-windows.ps1
$ErrorActionPreference = 'Stop'
Set-Location (Join-Path $PSScriptRoot '..')

if (-not (Get-Command node -ErrorAction SilentlyContinue)) { throw 'Node.js is required (https://nodejs.org).' }

Write-Host '> Installing dependencies...'
npm ci
if ($LASTEXITCODE -ne 0) { throw 'npm ci failed' }

Write-Host '> Building Windows binaries...'
npx electron-builder --win
if ($LASTEXITCODE -ne 0) { throw 'electron-builder failed' }

Write-Host '> Done. Output is in .\dist'
Get-ChildItem dist -File | Select-Object Name, @{n='MB';e={[math]::Round($_.Length/1MB,1)}}
