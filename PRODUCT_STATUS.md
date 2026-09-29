# Product Status — Piggy Nails Gallery

**Goal:** Complete releasable product with full GUI frontend, complete backend, and GitHub Release.

## Current state (2026-09-29)

| Area | Status | Notes |
|------|--------|-------|
| Frontend (React/Vite/Tailwind) | Present | Gallery, shop, subscription, booking, admin |
| Backend (Express/TS, Drizzle, Postgres) | Present | API + Stripe + webhooks |
| Mobile (Capacitor/Expo) | Present | Android pipeline improved; signingConfigs on main |
| Payments (Stripe) | Present | Live integration documented |
| Fulfillment (CJ Dropshipping) | Documented | Guides in repo |
| Email (SendGrid) | Documented | Setup guides present |
| CI (pnpm aligned) | Fixed on main | All workflows pin pnpm@10.4.1 + frozen-lockfile |
| Android signing | Fixed on main | No committed keystore; CI secrets path |
| GitHub Release | v1.0.0 (prerelease, no assets) | Cut a full v1.0.1 when APK can be built locally/self-hosted |
| Hosted Actions | Blocked | Account billing lock — use local-ci / self-hosted / act |

## How to validate offline

```bash
bash scripts/local-ci.sh
```

## How to produce a signed APK offline

See `ANDROID_BUILD_GUIDE.md` and `docs/CI_WORKAROUNDS.md`. Requires local keystore + Android SDK.

## Next product-delivery steps

1. Build APK locally or via self-hosted runner and attach to a full GitHub Release.
2. Promote release from prerelease → full once smoke-tested.
3. Clear remaining open PR #6 by merging or closing after confirming main has the fixes.
