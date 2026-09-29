# CI Workarounds (GitHub-hosted runners blocked)

Hosted runners fail with *"account is locked due to a billing issue"*. Use these zero-cost paths.

## Local validation (already available)

```bash
bash scripts/local-ci.sh
```

## Run workflows locally with act

```bash
# Install: https://github.com/nektos/act
act -W .github/workflows/test-and-build.yml -P ubuntu-latest=catthehacker/ubuntu:act-latest
```

## Self-hosted runner

1. Repo → Settings → Actions → Runners → New self-hosted runner
2. Install on any Linux machine and start `./run.sh`
3. Workflows using `runs-on: [self-hosted, linux, x64]` will be picked up

Self-hosted often still works under a billing lock (hosted does not).

## Release without Actions

```bash
git tag -a v1.0.1 -m "Release v1.0.1"
git push origin v1.0.1
# Create release in GitHub UI or: gh release create v1.0.1 --generate-notes
```
