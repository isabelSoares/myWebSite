# Research: Photo Privacy, Build Health, and Repository Profile

**Date**: 2026-10-23  
**Status**: Complete — no `NEEDS CLARIFICATION` items remain.

## Decision 1: Keep originals outside the repository and publish approved derivatives

**Decision**: Move full-resolution originals to a private local directory outside the repository (`PHOTO_ORIGINALS_DIR`, default `../myWebSite-originals/photos`). Generate web-sized derivatives into `ts-app/public/photos/generated/` and commit only those derivatives plus a generated manifest.

**Rationale**: The public repository is the leak vector the owner is concerned about. Removing originals from the current tree and build output is the only reliable static-hosting fix. Keeping derivatives in the repository preserves free GitHub Pages hosting, needs no runtime secrets, and lets CI build without access to private storage.

**Alternatives considered**:
- **Git LFS for originals**: LFS objects are still fetchable from a public repository and add deployment complexity. Rejected.
- **Private git submodule**: GitHub Pages CI would need credentials and the submodule content could still be exposed. Rejected.
- **External object storage with signed URLs**: Better access control, but requires a backend or serverless signer, secrets, and a paid/account-based service. Rejected for this static portfolio.
- **Cloudinary or similar image host**: Convenient transformations, but public delivery URLs remain downloadable and the free tier adds an external dependency. Rejected.

## Decision 2: Use `sharp` for local derivative generation

**Decision**: Add `sharp` as a local development dependency and use it in `scripts/build-photos.js`.

**Rationale**: `sharp` provides EXIF-aware rotation, metadata stripping, high-quality resizing, and WebP encoding in one Node API. It is fast enough for a 194-photo batch and avoids shelling out to platform-specific tools. It runs locally only; CI consumes the committed output.

**Alternatives considered**:
- **ImageMagick**: Powerful but relies on a system binary and has inconsistent metadata behavior across machines.
- **squoosh-cli**: Good compression, but slower and less convenient for batch metadata/size validation.
- **Browser canvas**: Cannot process files during a Node build and would require a headless browser.
- **Cloudinary/ImageKit transformations**: Adds an account and network dependency; local generation is simpler and reproducible.

## Decision 3: Generate two WebP sizes with bounded dimensions

**Decision**: Generate a 540 px thumbnail (quality ~72) and an 1800 px full derivative (quality ~80), both WebP, with metadata removed and orientation normalized. Enforce thumbnail ≤ 120 KB / 600 px and full ≤ 500 KB / 2000 px in release checks.

**Rationale**: The film strip shows small frames and the dialog shows a larger image. Two sizes avoid shipping 1800 px files for the strip while keeping the dialog sharp. WebP has broad modern-browser support and good compression. Bounded dimensions make the "no originals in build output" rule mechanically verifiable.

**Alternatives considered**:
- **Single image per photo**: Simpler, but wastes bandwidth in the film strip.
- **AVIF**: Better compression, but slower encoding and less predictable support in the current toolchain.
- **Full `srcset` ladder**: Better responsiveness, but more files and more UI complexity for a small portfolio.
- **Keep original dimensions**: Rejected because it preserves large files and makes originals indistinguishable from derivatives.

## Decision 4: Use content-hash filenames and a generated manifest

**Decision**: Name derivatives with a content hash and write `ts-app/src/data/photo-manifest.json`. Keep curation data in `ts-app/photo-sources.json` with album names, source filenames, alt text, manual rotations, and publication flags.

**Rationale**: Hashes prevent original filenames from being exposed, avoid collisions, and invalidate caches when an image is replaced. The manifest gives the UI stable dimensions and paths and lets validation compare source and output without needing private originals. A separate curation file preserves album order and rotations that cannot be inferred from a folder scan.

**Alternatives considered**:
- **Keep original filenames**: Leaks the mapping to private files and risks stale caches after replacement.
- **Parse `Hobbies.tsx` directly**: Brittle and mixes curation data with UI code.
- **Auto-discover every file in the private folder**: Loses ordering, alt text, rotations, and the ability to keep an image private.
- **Timestamps in filenames**: Non-deterministic and creates needless churn.

## Decision 5: Revoke by regenerating the manifest, not by signed URLs

**Decision**: Revocation means marking a source entry unpublished or removing it, running `photos:build`, and deploying the new manifest. Old derivatives are removed from the generated directory and the current build.

**Rationale**: The static site cannot issue or validate signed URLs without a backend. Because originals are no longer public, approved derivatives can be public and revocable through deployment. This matches the specification's realistic goal: protect originals and deter casual reuse, not prevent screenshots.

**Alternatives considered**:
- **Cloudflare Worker + R2 signed URLs**: Stronger link control, but adds a service, secrets, and operational work.
- **Time-limited URLs baked at build time**: Links expire and break the gallery.
- **Client-side token checks**: Trivially bypassed and not worth the complexity.

## Decision 6: Use lightweight deterrence with a visible copyright notice

**Decision**: Disable native dragging on gallery images, prevent image context menus, apply `user-select: none` / `-webkit-user-drag: none`, and show `Photographs © Isabel Soares. Please do not reuse without permission.` No watermark by default.

**Rationale**: These measures stop the easiest casual save actions without blocking navigation, keyboard access, or screen readers. A visible notice provides the ownership signal required by the spec. A watermark would change the portfolio's visual quality and is not required.

**Alternatives considered**:
- **Watermark every image**: Stronger deterrence, but harms the portfolio presentation and is hard to reverse.
- **Render into canvas only**: Breaks accessibility and image semantics; screenshots still work.
- **Block right-click globally**: Harasses normal users and does not stop determined copying.
- **Disable all keyboard shortcuts**: Not feasible and harms accessibility.

## Decision 7: Modernize the TypeScript target and suppress only the remaining deprecation

**Decision**: Set `target` to `ES2020`, keep `moduleResolution: "node"`, and add `"ignoreDeprecations": "6.0"`. Add a release check that asserts this configuration and fails on deprecation output.

**Rationale**: ES2020 is supported by the project's modern-browser policy and removes the ES5 deprecation. TypeScript 4.9.5 is required by the current CRA 5 setup and cannot use `moduleResolution: "bundler"` (introduced in TypeScript 5). Suppressing the `node10` warning is therefore temporary and must be documented. A configuration check prevents a future edit from silently reintroducing ES5 or removing the suppression without a migration.

**Alternatives considered**:
- **Upgrade to TypeScript 5 and use `bundler` resolution**: Cleaner long-term, but increases CRA 5 compatibility risk and is outside the selected scope.
- **Keep ES5 and suppress both warnings**: Does not modernize the output and contradicts the selected clarification.
- **Use `node16`/`nodenext` resolution**: Changes module semantics and is not appropriate for the existing CRA bundler setup.
- **Do nothing**: Leaves a future build break and a noisy editor.

## Decision 8: Drive repository settings through `gh repo edit`

**Decision**: Update the GitHub description, homepage, and topics with `gh repo edit`, and make the README self-contained with the same information.

**Rationale**: The description, homepage, and topics are GitHub settings, not files. `gh` is already authenticated in this environment and provides a repeatable command. The README remains the detailed source of truth so the repository is understandable even without the sidebar metadata.

**Alternatives considered**:
- **Manual GitHub UI changes**: Not reproducible and easy to forget.
- **README-only changes**: Does not improve the repository card, search topics, or homepage link.

## Decision 9: Enforce the photo boundary in release verification

**Decision**: Add `validate-photo-privacy.js` and `validate-tsconfig.js`, integrate both into `verify:release`, and add Node tests for each. Continue using the existing GitHub Pages workflow.

**Rationale**: A one-time manual cleanup is not durable. The release check must fail if a future change re-adds a tracked original, a raw GitHub photo link, an oversized derivative, a stale manifest, or the deprecated compiler settings. The existing release runner already centralizes required checks and prints actionable failures.

**Alternatives considered**:
- **CI-only shell checks**: Harder to test locally and easy to drift.
- **Manual review**: Not reliable for binary assets.
- **Pre-commit hooks**: Useful but not a substitute for the deployment gate.

## Decision 10: Do not rewrite git history in this feature

**Decision**: Remove originals from the current tree and document that old commits and caches may still contain earlier copies. A history rewrite remains a separate, explicit decision.

**Rationale**: Rewriting a public repository's history is destructive, requires coordination, and can break clones and links. The specification explicitly keeps it out of scope. The plan must not imply that a history rewrite has happened.

**Alternatives considered**:
- **`git filter-repo` immediately**: Strongest removal, but destructive and outside the approved scope.
- **Delete and recreate the repository**: Loses issues, stars, and history; not appropriate.
- **Ignore the history issue**: Misleading; rejected.

## Decision 11: Discourage image indexing with `robots.txt`

**Decision**: Add `Disallow: /myWebSite/photos/` to `ts-app/public/robots.txt`.

**Rationale**: Search engines can index public derivative URLs. A path-level disallow reduces accidental discovery while keeping the site itself indexable. It is advisory and does not provide access control.

**Alternatives considered**:
- **No robots change**: Leaves image search as an easy discovery path.
- **Disallow the whole site**: Hurts portfolio discoverability.
- **`X-Robots-Tag` headers**: GitHub Pages does not provide per-path header control.

## Open Questions

None. All specification clarifications are resolved and all technical unknowns are covered by the decisions above.
