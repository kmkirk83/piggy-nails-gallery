# Local Validation (no GitHub Actions required)

When GitHub-hosted runners are unavailable (e.g. billing lock), run the full product checks locally:

```bash
# Install + lint + test + build
bash scripts/local-ci.sh

# Or step-by-step with the pinned pnpm version
corepack enable
corepack prepare pnpm@10.4.1 --activate
pnpm install --frozen-lockfile
pnpm lint
pnpm test
pnpm build
```

## Android / APK (local)

```bash
pnpm build
pnpm exec capacitor sync android
cd android && ./gradlew assembleRelease
```

Requires Android SDK, Java 21, and a local keystore (or the secrets decoded manually).

## Creating a Release without Actions

```bash
git tag -a v1.0.1 -m "Release v1.0.1"
git push origin v1.0.1
# Then create the GitHub Release via the web UI or `gh release create`
```
