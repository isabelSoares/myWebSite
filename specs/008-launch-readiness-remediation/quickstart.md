# Quickstart: Launch Readiness Remediation

**Feature**: `008-launch-readiness-remediation`
**Purpose**: Prove that the launch evidence is complete, the project records match the shipped site, and the remaining launch risks are measured or explicitly accepted.

## Prerequisites

- Node.js 24 or newer and npm.
- A clean checkout of `fix/launch-readiness-remediation`.
- The production assistant endpoint available for the release check.
- Google Chrome available for visual captures (already installed on the development machine).
- Network access to the published site for the capacity and direct-link checks.

Run all commands from the repository root unless stated otherwise.

## 1. Confirm the baseline counts

```sh
cd ts-app
node -e "const m=require('./src/data/photo-manifest.json'); const a=m.albums; console.log('albums', a.length); console.log('album photos', a.reduce((n,x)=>n+x.photos.length,0)); console.log('featured', Object.keys(m.featured).length);"
du -sk public/photos/generated
find public/photos/generated -type f | wc -l
```

Expected:

- 14 albums.
- 172 album photos.
- 2 featured photos.
- 348 generated derivatives.
- A total footprint near 59.92 MB before any budget change.

## 2. Run the automated launch gate

```sh
cd ts-app
REACT_APP_AI_ASSISTANT_URL="https://ai-photo-assistant.isabel-srsoares.workers.dev/" npm run verify:release
```

Expected final line:

```text
Release check: PASS (N passed, 0 failed, 1 skipped)
```

The `photos.total-size` line MUST show the footprint, file count, configured limit, and remaining headroom. See [contracts/photo-budget-report.md](./contracts/photo-budget-report.md).

## 3. Capture visual evidence

Build and serve the production output from the published base path, then capture:

| Route | Viewport | What to inspect |
|-------|----------|-----------------|
| `/` | 320, 768, 1440 px | Featured portrait fully visible, natural ratio, no horizontal overflow |
| `/hobbies` | 320, 768, 1440 px | Featured hero fully visible, natural ratio, no horizontal overflow |
| `/`, `/resume`, `/projects`, `/hobbies` | 1440 px | Dark appearance on a fresh storage profile |
| Unknown path | 1440 px | Not-found experience renders |
| Album strip and dialog | 1440 px | Representative photos are upright, uncropped, and navigation moves in the shown direction |

Use headless Chrome screenshots or a manual browser pass. Save or reference each capture in the verification record. If a check cannot be executed, record `UNVERIFIED` with the reason and owner; do not mark it `PASS`.

For the full 19-photo review, follow the 007 quickstart and record either each photo's result or a representative sample plus the remaining owner action.

## 4. Confirm the default appearance

1. Clear the `dark-mode` key from local storage.
2. Load every main route and reload each one.
3. Confirm dark mode with no light flash.
4. Choose light, reload, and confirm light persists.
5. Choose dark, reload, and confirm dark persists.

Expected: the resolved default is dark, an explicit choice survives reloads, and the browser theme color matches. See [contracts/verification-record.md](./contracts/verification-record.md) for the status values.

## 5. Record direct-link behavior

```sh
for p in "" resume projects hobbies; do
  curl -sS -o /dev/null -w "/$p -> %{http_code}\n" "https://isabelsoares.github.io/myWebSite/$p"
done
```

Expected on the current host: `/` returns 200 and the other routes return 404 while the response body still contains the SPA root and renders the correct section. Record the observed codes and the launch decision. See [contracts/documentation-consistency.md](./contracts/documentation-consistency.md).

## 6. Measure published capacity

```sh
cd ts-app
npm run load:smoke -- --concurrency=100 --duration=15 --url=https://isabelsoares.github.io/myWebSite/
npm run load:smoke -- --concurrency=1000 --duration=15 --url=https://isabelsoares.github.io/myWebSite/
```

Record the request count, error count, error rate, and p95 latency for the highest clean run. If the 1,000-client run fails because of client-side socket limits, record the highest clean concurrency and mark the target `UNPROVEN` with the tested ceiling.

Expected: the record clearly distinguishes site capacity from client-side limits and states whether albums or the assistant were exercised.

## 7. Confirm record consistency

```sh
grep -RIn "245 MB\|202 files\|raw.githubusercontent.com.*photos" README.md specs/005-pre-launch-verification/scalability-report.md specs/007-photo-display-and-theme || true
grep -RIn "174 album\|60 MB" README.md specs/006-photo-privacy-and-profile/quickstart.md specs/007-photo-display-and-theme || true
test ! -e tasks.md && echo "root tasks.md removed"
```

Expected: no stale footprint, count, or external-host claims remain in the current records; the root `tasks.md` is gone.

## 8. Re-run the gate after every record or script change

```sh
cd ts-app
REACT_APP_AI_ASSISTANT_URL="https://ai-photo-assistant.isabel-srsoares.workers.dev/" npm run verify:release
```

Expected: `Release check: PASS`, with the headroom line reflecting the 64 MB configured limit.

## Completion criteria

- `specs/008-launch-readiness-remediation/verification-record.md` exists and covers every formerly open 007 task.
- The 007 task list has inline status notes for anything still open.
- The data-model invariant, plan counts, capacity report, README, and budget statements agree with the manifest and the release check.
- The 1,000-visitor target is marked proven only if measured.
- The direct-link decision is recorded.
- The root stray task artifact is removed.
- All automated gates pass.
