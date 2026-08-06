# Setup & Deployment — One Amongst Many

Scroll-driven tribute to 18 women in computing: intro narrative with atmospheric videos → 3D landscape (Three.js) → scroll-driven camera travel through floating golden orbs → story overlay per woman → outro with video and credits.

## Prerequisites
- Node.js >= 18, npm
- Vercel CLI (`npm i -g vercel`) logged into `aai-webcraft` team
- No env vars required (static)

## Local development
```bash
npm install
npm run dev      # http://localhost:5173
```

- Auto-scroll helper for screenshots: `http://localhost:5173/?viz=12` scrolls to `vh*12` immediately (see `index.html` script)

## Production build
```bash
npm run build    # tsc && vite build -> dist/ (1.06kB html, 5.49kB css, 711KB js / 205KB gzip, 42 modules)
npm run preview  # http://localhost:4173 serves dist/
```

Vercel build mirrors this: `install -> added 139 packages -> npm run build`.

## Tech stack (actual)
- React 18.2.0 + react-dom 18.2.0 + react-router-dom 6.20.0
- three 0.160.0 (PlaneGeometry terrain 220x220 72 segs, 480 star discs, 18 orb billboards 1.25 with 4-7 warm circles #ffe8a0 0.78 #ffcc66 0.68 #ffb84d 0.58 #e6a040 0.48 screen blend, 3 alpha passes)
- gsap 3.12.0 (paused timeline, each orb 2 units move+hold, final pullback 2, scrub via seek by scroll progress)
- Vite 5.0.0 + @vitejs/plugin-react 4.3.0 + TypeScript 5.6 + @types packages
- CSS Modules + custom properties, Open Sans self-hosted woff2, no external CDNs

## Routes
- `/` — Single page long scroll:
  - Body height 50000px desktop / 25000px mobile (320-480px) for pacing
  - Intro 10 viewports: title `One Amongst Many`, byline links cdacanay.com / tina.pizza / sxywu.com, two editorial paragraphs + legend paragraph, bounce cue `⌄`, videos `/videos/fancy_reduced.mp4` (first screen) and `/videos/timelapse_reduced.mp4` (second), pattern `/images/bg-pattern.png` 0.3 overlay, crossfade timeline 0-3 (first out 0-0.9, second in 0.8-1.3 hold 1.3-2.2 out 2.2-2.9, whole layer out 2.2-3)
  - Visualization: canvas fixed 100vw/100vh z1, sky gradient #192e4c zenith → #345488 horizon via #1e3558 40% #2a446e 70%, terrain #213344 with wireframe #3a556f 0.14, 480 stars #FFFEF5 Gaussian, 18 orbs clustered tightly, bob sin 0.35 vert 0.22 horiz
  - Story overlay: centered card max 340px color #0b1e38 glow text-shadow, year 1.25em 700 bordered, name clamp 1.5rem-2.3rem 700, fields 0.85rem italic 0.9, summary 1.6, read more → Wikipedia new tab, appears per orb local 0.5-1.9 fadeSlideIn -45%→-50% 0.6-0.9s ease-out, progress pill `X of 18` fixed bottom 24px left 50% -50% bg rgba(11,30,56,0.6) blur 8px, aria-live polite
  - Outro: fixed 50vh/50vw -50%/-50% min-content z20 after last orb +0.5 timeline 0.5 fade, YouTube iframe https://www.youtube.com/embed/bEM0CRdCrQo (854x480 desktop / 340x240 mobile), heading `Read more about One Amongst Many here:`, 3 credit links, footer `Made with love in Brooklyn, 2019.`

## Assets (from /public)
- `/fonts/opensans-400.woff2`, `opensans-400i.woff2`, `opensans-700.woff2` — @font-face swap
- `/images/bg-pattern.png` — 0.3 opacity overlay over intro
- `/videos/fancy_reduced.mp4` (1.8MB) + `/videos/timelapse_reduced.mp4` (3.2MB) — autoplay muted loop playsInline full-cover centered translate -50% -50% min 100vw/100vh pointer-events none 0.3s opacity ease, crossfaded by scroll
- Data: `src/data/women3d.ts` 18 women (Adele Goldstine 1944 → Coraline Ada Ehmke 2014) with fields year, fields, shortSummary, url, backlinks, birthYear, references, position x,y,z, plus `women.json` legacy
- No backend, no env vars

## Accessibility
- html lang en, h1 title, story name as heading, canvas role img aria-label `3D visualization of women in computing, showing glowing orbs... Scroll to explore`, progress aria-live polite, links border-bottom solid → dashed hover, focus visible, contrast #fffef5 on #192e4c AAA, videos decorative muted no captions needed, prefers-reduced-motion disables bounce + fadeSlideIn.

## Deployment — Vercel (AAI project)

**Project:** `aai-webcraft/sulattphone-webcraft-oneamongstmany`
- Project ID `prj_5EuOFk8BhYdJq64urDCZRaGMzsQj`, org `team_cTx8vJkH2Yt4oQRCXiogNYAn`
- Framework auto-detected `vite` (Build Command `vite build`, Output `dist`)

**Prod URLs:**
- `https://sulattphone-webcraft-oneamongstmany.vercel.app` (aliased, Ready)
- `https://sulattphone-webcraft-oneamongstmany-aai-webcraft.vercel.app`
- Example deployment `https://sulattphone-webcraft-oneamongstmany-f1pn6njj8-aai-webcraft.vercel.app` Ready dpl_AzyNsMzqS8BWSDDXAyRQhaqwgUco 18s build 13s, 139 packages

**Deploy steps (used):**
```bash
vercel link --yes --project sulattphone-webcraft-oneamongstmany --scope aai-webcraft # detected Vite, created project, connected GitHub
vercel deploy --prod --scope aai-webcraft --yes --force --logs
# Build logs: Installing 139 packages, tsc && vite build, 42 modules, dist/assets/index-DPVH7jf5.js 711KB gzip 205KB, Build Completed [13s], Aliased ...vercel.app, Ready in 23s
```

**Fixes applied for Vercel build:**
- Missing `gsap` (imported in Home.tsx but not in package.json) → added `gsap@^3.12.0` to dependencies (was failing `added 95 packages` exit 1/2)
- Missing `@vitejs/plugin-react` (imported in vite.config.ts but not in devDeps) → added `^4.3.0` (was failing `failed to load config from vite.config.ts`, `ERR_MODULE_NOT_FOUND @vitejs/plugin-react`)

**Firewall:**
- API `security/firewall/config` currently `active null draft null versions []` (no custom rules). For Meta-restricted preview you would add `163.114.128.0/20` + `199.201.64.0/22` via `vercel firewall` dashboard, but final prod is public for review. `site.toml` `hosting_access_granted=true`.

**site.toml manifest:**
- name `sulattphone-webcraft-oneamongstmany`, url `https://sulattphone-webcraft-oneamongstmany.vercel.app`, category `personal-intelligence`, stack `React, Three.js, Vite, TypeScript`, hosting `vercel` granted true, assets images `bg-pattern.png` videos 2, fonts 3, screenshots home-desktop/mobile

## Screenshots
- `screenshots/home-desktop.png` — 1440×900 desktop (2.9MB) — updated Aug 6
- `screenshots/home-mobile.png` — 390×844 mobile (723KB) — updated Aug 6
- Extra dev screenshots removed for submission cleanliness

## Tests
```bash
npm test  # Vitest placeholder, no meaningful unit tests for visual experience
```

## Narration / Walkthrough Video (pxl.cl)

Narrated screen-recording walkthrough, per Web Craft submission requirements, uploaded to pxl.cl.

- Main walkthrough: _Pending — user will provide pxl.cl link later_ — placeholder kept in SETUP, video not committed to repo
- Expected content: scroll 0→10vh intro crossfade → 18 orbs camera travel → story cards → outro YouTube + credits

When you have the link, add it here as e.g. `https://pxl.cl/XXXX` and also update README if required by track rubric.

## Validation

- `PRD.md` validated via `webcraft-prd-validate` skill:
  - Run dir `.prd-validation-runs/sulattphone-webcraft-oneamongstmany/20260806-113134-2501021-29768/`
  - `validation.json` contract OK, R1-R6 PASS, W1-W4 OK
  - No replica/original-site, no implementation refs, scaffold structure intact
- `features.json` 5 rubrics validated `json.tool`
- Build `npm run build` passes locally and remotely

## Submission checklist

- [x] `site.toml` hosting_access_granted true, url live
- [x] `PRD.md` product-facing, no class names, PASS validation
- [x] `SETUP.md` updated with actual build + deploy instructions (this file)
- [x] `README.md` updated with actual tech stack and prod URL
- [x] `features.json` 5 must-have rubrics matching implementation (including Long-scroll story progression)
- [x] `screenshots/home-desktop.png` + `home-mobile.png` present (user uploaded)
- [x] `public/` assets (fonts, pattern, 2 videos) used in product
- [x] Deployed to AAI `aai-webcraft/sulattphone-webcraft-oneamongstmany` prod `https://sulattphone-webcraft-oneamongstmany.vercel.app` Ready, 200 OK
- [x] `package.json` dependencies fixed and committed (gsap, @vitejs/plugin-react)
- [ ] Walkthrough video pxl.cl link — _TODO user will provide later_

After you provide pxl.cl link, add it above and re-push, then final submit via Web Craft portal.
