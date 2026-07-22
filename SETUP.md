# Setup & Deployment — One Amongst Many

A scroll-driven data visualization of women in computing, built for the Web Craft track. **Self-contained**: Three.js procedural terrain + glowing orbs, no external assets, no backend services. Faithful replica of oneamongstmany.com.

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
React 18 + Vite 5 + TypeScript, Three.js for 3D terrain + orb field visualization (procedural low-poly hills, star field, 18 glowing orbs with 4-layer warm golden glow), native scroll handling with requestAnimationFrame, CSS Modules with custom properties for styling. Fully self-contained - no external video or image CDN dependencies.

## Environment variables
**None.** The site is fully static with no API keys or services. (`.env.example` is a placeholder only.)

## Routes
- `/` — Single-page scroll experience (30,000px desktop, 10,000px mobile): Dot field visualization with highlighted woman, text overlay with her story, progress indicator. Scroll to progress through 20 women in computing history.

## Assets
**All visuals are procedural — no external images or videos (self-contained):**
- **Visualization:** Three.js WebGL - low-poly terrain (220 size, 72 segments with procedural height), 650 star particles, 18 glowing orbs (each 4 spheres with warm golden palette #ffe8a0, #ffcc66, #ffb84d, #e6a040) positioned via actual coordinates from original site. Camera zooms from wide landscape to close-up per scroll.
- **Intro:** Self-contained CSS radial gradients + procedural star noise replaces original external mp4 videos (fancy_reduced.mp4, timelapse_reduced.mp4) and bg-pattern.png - no runtime external requests.
- **Fonts:** Open Sans (400, 400 italic, 700) self-hosted as woff2 in `public/fonts/`. No external font requests.
- **Data:** `src/data/women3d.ts` with 18 women in computing (actual original site coordinates), each with name, year, fields, shortSummary, url, backlinks, and 3D position.
- **Images/Videos:** None external — all visuals are WebGL or CSS procedural. Screenshots are actual captures from localhost.

## Replication notes - Faithful to oneamongstmany.com
- **3D Terrain:** Procedural PlaneGeometry 220x220, 72 segments, height function with sin/cos waves + noise for low rolling hills (amplitude ~2.9, 2.05, 1.38). Color #2c445f muted dark slate blue matching screenshot. Wireframe overlay at 0.14 opacity for low-poly facet emphasis. Position y -6.8, z -6.2 to push horizon to ~28% from bottom.
- **Orbs:** 18 women from original site, each orb = 4 concentric spheres with warm palette (core #ffe8a0 0.78, mid #ffcc66 0.68, #ffb84d 0.58, outer #e6a040 0.48) - NOT white washout. Size based on backlinks (0.4-1.0). Position scaled: x gathered 0.35 toward center 12, y 0.22 scale -0.3 offset to lower near horizon, z x1.6 -34 for depth. Floating via sin elapsedTime 0.18. Highlighted scales to 3.2x with intense golden glow.
- **Camera:** Landing view at (12, 0.3, 34) looking at (12, 1.8, -26) - low near terrain, hills prominent, orbs lower gathered center, no terrain ends visible (FOV 32). On scroll, lerps to highlighted orb at +22z with lookAt y-3.5 for downward horizon.
- **Stars:** 650 points, soft white texture via radial gradient canvas, size 1.35, opacity 0.62, AdditiveBlending, distributed 520x110x360.
- **Scroll mapping:** Body 30,000px desktop / 10,000px mobile. Intro spans 4 viewport heights: scrollOpacity fades 0-0.9, fancy 0-1 visible then 1-1.4 fade, legend 0.8-1.3 fade in, 1.3-2.2 hold, 2.2-2.9 fade out (ensures 2nd screen clearly visible, no skip to 3rd). Visualization starts at 0.82*introHeight. First 8% shows wide field no highlighted orb (matching Image1 screenshot). After threshold, progress maps to woman index.
- **Text overlay:** Orb info fixed center 50%/50% with radial gradient #fff8e7 to #ffbf6b, 70px 45px padding, border-radius 50%, glow shadows. Year with border-bottom, name clamp 1.5-2.3rem 700, fields italic, summary 0.84rem, read more link. Progress indicator bottom center "X of 18" with backdrop blur. Crossfade via keyframes fadeSlideIn.
- **Color scheme:** Background #0b1e38 dark blue per PRD, text #fffef5 off-white, sky #1e2e4a, terrain #2c445f.
- **Responsive:** Mobile 390px body 10,000px, subsection width calc(100%-40px), orbInfo max-width 100%-40px padding 20px, font scales down.
- **Reduced motion:** CSS disables animations for arrow, orbInfo, stars, transitions. JS could be extended to instant lerp.
- **Performance:** Three.js with 18 orbs *4 spheres = 72 meshes + 1 terrain 72 seg + 650 star points. requestAnimationFrame, passive scroll, GPU transform.
- **Accessibility:** Semantic h1 for title, h2 for woman name, canvas aria-label + role img, keyboard scrollable, color contrast AAA, lang en, progress aria-live polite.

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
