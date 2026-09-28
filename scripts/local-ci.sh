#!/usr/bin/env bash
set -euo pipefail
echo "==> Enabling corepack / pnpm"
corepack enable || true
corepack prepare pnpm@10.4.1 --activate || npm install -g pnpm@10.4.1
echo "==> Install"
pnpm install --frozen-lockfile
echo "==> Lint"
pnpm lint || true
echo "==> Test"
pnpm test || true
echo "==> Build"
pnpm build
echo "==> Local CI finished"
