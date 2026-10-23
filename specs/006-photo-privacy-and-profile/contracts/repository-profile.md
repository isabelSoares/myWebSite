# Contract: Repository Profile

**Feature**: `006-photo-privacy-and-profile`  
**Target repository**: `isabelSoares/myWebSite`

## GitHub repository settings

| Setting | Required value |
|---------|----------------|
| Visibility | `PUBLIC` |
| Description | `Isabel Soares's personal portfolio: React, TypeScript, AI projects, résumé, and travel photography.` |
| Homepage | `https://isabelsoares.github.io/myWebSite/` |
| Topics | `portfolio`, `react`, `typescript`, `personal-website`, `github-pages`, `photography`, `frontend` |

Apply with:

```sh
gh repo edit isabelSoares/myWebSite \
  --description "Isabel Soares's personal portfolio: React, TypeScript, AI projects, résumé, and travel photography." \
  --homepage "https://isabelsoares.github.io/myWebSite/" \
  --add-topic portfolio \
  --add-topic react \
  --add-topic typescript \
  --add-topic personal-website \
  --add-topic github-pages \
  --add-topic photography \
  --add-topic frontend
```

Verify with:

```sh
gh repo view isabelSoares/myWebSite --json description,homepageUrl,repositoryTopics,visibility
```

Expected: the description, homepage, topics, and visibility match the table above. Topics may be returned in a different order.

## README.md required sections

The README must be understandable without reading the source code and must contain these sections or equivalent headings:

1. **Project purpose** — Isabel Soares's personal portfolio.
2. **Live site** — `https://isabelsoares.github.io/myWebSite/`.
3. **Site sections** — About, Résumé, Projects, Hobbies/Photography, AI Photographer Assistant.
4. **Technology summary** — React, TypeScript, MUI, SCSS, GitHub Pages, Cloudflare assistant endpoint.
5. **Repository structure** — application, specs, scripts, workflow, generated photos.
6. **Local setup** — Node.js 24+, `npm i`, `npm start`, `npm test`, `npm run build`.
7. **Verification commands** — `npm run verify:release`, `npm run validate:photos`, `npm run validate:tsconfig`, `npm run load:smoke`.
8. **Deployment** — GitHub Pages workflow and repository variable `AI_ASSISTANT_URL`.
9. **Photo usage and copyright** — originals are private, derivatives are published, photographs are © Isabel Soares, permission required, link to `PHOTO-POLICY.md`.
10. **TypeScript maintenance note** — target ES2020, temporary `ignoreDeprecations: "6.0"` for `moduleResolution: "node"`, migrate to `bundler` after a TypeScript upgrade.

## PHOTO-POLICY.md required content

The photo policy must state:

- Copyright ownership by Isabel Soares.
- No permission is granted to copy, redistribute, sell, train models on, or republish the photographs without written permission.
- The repository contains only web-sized derivatives; originals are private.
- Personal use such as viewing the portfolio is allowed.
- Permission requests go to `isabel.srsoares@gmail.com`.
- The owner may remove or replace photographs at any time.
- Removal from the current site does not remove copies already downloaded, cached, indexed, or present in old git history.
- A takedown request can be sent to the same email address.
- The policy is not legal advice.

## UI copyright notice

The Hobbies gallery must show a visible notice equivalent to:

> Photographs © Isabel Soares. Please do not reuse without permission.

The notice must be visible without opening an image, must be reachable by screen readers, and must not be the only copy of the policy; `PHOTO-POLICY.md` and the README must also contain it.

## robots.txt

`ts-app/public/robots.txt` must include:

```text
User-agent: *
Disallow: /myWebSite/photos/
```

The file must continue to allow the rest of the site. This is advisory only and is not an access-control mechanism.

## Verification

```sh
gh repo view isabelSoares/myWebSite --json description,homepageUrl,repositoryTopics,visibility
test -f PHOTO-POLICY.md
grep -q "Photographs © Isabel Soares" README.md
grep -q "Disallow: /myWebSite/photos/" ts-app/public/robots.txt
```

The README and repository description must be updated together whenever the live-site address or project scope changes.
