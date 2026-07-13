# Setup & Deployment — One Amongst Many

A scroll-driven data visualization of women in computing, built for the Web Craft track. **Self-contained**: procedural Canvas dot field, no external assets, no backend services.

## Prerequisites
- Node.js >= 18
- npm (lockfile is `package-lock.json`)

## Local development
```bash
npm install
npm run dev      # Vite dev server at http://localhost:5173
```

## Production build
```bash
npm run build    # tsc + vite build -> dist/
npm run preview  # serve the production build locally at http://localhost:4173
```

## Tests
```bash
npm test         # Vitest (placeholder — visual experience, minimal unit tests)
```

## Tech stack
React 18 + Vite 5 + TypeScript, HTML Canvas 2D for the dot field visualization, native scroll handling with requestAnimationFrame, CSS Modules with custom properties for styling.

## Environment variables
**None.** The site is fully static with no API keys or services. (`.env.example` is a placeholder only.)

## Routes
- `/` — Single-page scroll experience (30,000px desktop, 10,000px mobile): Dot field visualization with highlighted woman, text overlay with her story, progress indicator. Scroll to progress through 20 women in computing history.

## Assets
**All visuals are procedural — no external images:**
- **Visualization:** HTML Canvas 2D rendering 2,000-5,000 dots (depending on viewport) with one highlighted at a time. Dots have subtle parallax on scroll for depth.
- **Fonts:** Open Sans (400, 400 italic, 700) self-hosted as woff2 in `public/fonts/`. No external font requests.
- **Data:** `src/data/women.json` with 20 women in computing, each with name, role, description, and position in the dot field.
- **Images/Videos:** None — all visuals are Canvas or CSS.

## Replication notes
- **Dot field:** 5,000 dots on desktop (2,000 on mobile) scattered randomly across the viewport. Each dot represents a person in computing. One dot at a time is highlighted — larger (7px vs 2.5px), full opacity, bright color (#fffef5), with glow effect and outer ring.
- **Scroll mapping:** Page height is 30,000px on desktop (10,000px on mobile). Scroll position maps to a specific woman in the dataset (20 women, each occupies ~1,500px desktop / 500px mobile). The highlighted dot smoothly transitions to the new position over 0.8s with ease-out.
- **Text overlay:** Fixed-position overlay shows current woman's name (large heading), role/title (italic), 2-3 sentence description, and progress indicator (e.g., "3 of 20"). Text crossfades over 0.6s with subtle slide animation when the woman changes.
- **Parallax:** Dot field has subtle parallax on scroll — dots move at slightly different speeds based on their "depth" value to create a sense of dimensionality.
- **Color scheme:** Background #0b1e38 (dark blue), text #fffef5 (off-white), dots rgba(255, 254, 245, 0.3) by default, highlighted dot #fffef5 with glow.
- **Responsive:** Body height reduces to 10,000px on mobile (320-480px). Dot count reduces to 2,000. Text overlay adapts to smaller viewport with reduced font sizes. No horizontal overflow.
- **Reduced motion:** `prefers-reduced-motion: reduce` disables smooth dot transitions (instant instead), disables parallax, and cuts text changes instead of crossfade.
- **Performance:** Dot count capped at 5,000; uses requestAnimationFrame for smooth 60fps rendering; scroll handler is passive; uses transform/opacity only for animations.
- **Accessibility:** Semantic HTML with proper heading hierarchy (h1 for title, h2 for woman name, h3 for role). Canvas has aria-label describing the visualization. Keyboard scrollable. Color contrast exceeds WCAG AAA. Respects reduced motion preference.

## Narration / Walkthrough Video
Narrated screen-recording walkthrough, uploaded to pxl.cl per Web Craft submission requirements.

- Main walkthrough: _Pending — will be recorded after deployment_

The video is **not committed to this repo** — it lives on pxl.cl; only the link above is tracked.

## Deployment
_Pending_ — deploy to Vercel with firewall restricting access to Meta IPs (`163.114.128.0/20`, `199.201.64.0/22`), then transfer project ownership to the AAI Web Craft team. The live URL and `hosting_access_granted` in `site.toml` will be updated after transfer.

### Vercel deployment steps
1. Push repo to GitHub under `codimango` org (private)
2. Import project in Vercel, set framework to Vite
3. Add firewall rules for Meta IPs
4. Deploy and verify at the live URL
5. Add `aai_webcraft@meta.com` as project owner
6. Update `site.toml` with live URL and set `hosting_access_granted = true`
