# One Amongst Many — Web Craft Submission

A scroll-driven tribute to women in computing. Single-page experience combining atmospheric video backgrounds, a Three.js WebGL landscape with floating golden orbs, and scroll-linked camera travel that dwells at each woman's story.

Live: **https://sulattphone-webcraft-oneamongstmany.vercel.app** (AAI team `aai-webcraft/sulattphone-webcraft-oneamongstmany`)

## Quick Start

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # tsc && vite build -> dist/
npm run preview  # http://localhost:4173
```

## Required Files

- `site.toml` — Submission manifest (url, stack, assets, screenshots, hosting_access_granted=true)
- `PRD.md` — Product requirements document (validated PASS R1-R6 / W1-W4)
- `SETUP.md` — Setup & deployment instructions (includes prod URL and walkthrough link https://pxl.cl/c7DnV)
- `.env.example` — Placeholder (no env vars required, static frontend)
- `screenshots/` — Desktop 1440×900 `home-desktop.png` and Mobile 390×844 `home-mobile.png` (user-uploaded)
- `features.json` — Five key rubrics: long-scroll progression, 3D space with floating orbs, scroll camera journey, orb story overlay, atmospheric intro/outro

## Tech Stack

- React 18 + Vite 5 + TypeScript (`tsc && vite build`)
- Three.js 0.160 for 3D terrain, sky gradient sphere, star field, 18 billboard orbs with warm golden glow (#ffe8a0, #ffcc66, #ffb84d, #e6a040)
- GSAP 3.12 for scroll-scrubbed camera timeline (no ScrollTrigger, custom seek)
- CSS Modules (`Home.module.css`) + global custom properties (`index.css`)
- Self-hosted Open Sans 400, 400i, 700 in `/public/fonts/` (woff2)
- Assets from `/public`: `images/bg-pattern.png` (0.3 overlay), `videos/fancy_reduced.mp4` + `timelapse_reduced.mp4` (intro crossfade), fonts above
- No backend, fully static

## Deployment

Deployed to **AAI Web Craft** team via Vercel CLI:

- Project: `aai-webcraft/sulattphone-webcraft-oneamongstmany` (`prj_5EuOFk8BhYdJq64urDCZRaGMzsQj`)
- Production: `https://sulattphone-webcraft-oneamongstmany.vercel.app`
- Build: `added 139 packages, 42 modules transformed, 2.51s`, output `711KB / 205KB gzip`
- Build fix: added missing `gsap` and `@vitejs/plugin-react` to `package.json`

Walkthrough video: **https://pxl.cl/c7DnV** — narrated scroll through intro crossfade → 18 orbs → outro.

See `SETUP.md` for full local, build, Vercel prod deploy steps, PRD validation, and submission checklist.

## Full Guide

See the [Web Craft track guide](https://www.multimango.com/admin/aai-hackathons/web-craft) for complete instructions, field reference, and submission checklist.
