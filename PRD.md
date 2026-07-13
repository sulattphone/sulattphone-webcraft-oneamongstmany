# Product Requirements Document — One Amongst Many

**Project:** `sulattphone-webcraft-oneamongstmany`  
**Category:** Web Craft track — Data Visualization  
**Date:** July 2026

**Reference:** https://oneamongstmany.com/ — "A data visualization of women in computing."

## 1. Overview

One Amongst Many is a scroll-driven data visualization that highlights the stories of women in computing. The experience presents a vast field of dots representing people in the tech industry, with one dot highlighted at a time to tell the story of a specific woman. As the user scrolls through a very long page (30,000px on desktop), the visualization progresses through different women, revealing their names, roles, and contributions.

The original site uses a dark blue background (#0b1e38) with light text (#fffef5), Open Sans typography, and a canvas/WebGL visualization of many dots. The experience is meditative and educational, using the scroll to create a sense of scale — one amongst many.

This replication must be fully self-contained: all visualization code, data, and assets bundled statically. No external requests at runtime.

### Goals
- Replicate the core visualization: a field of dots with one highlighted at a time
- Implement long-scroll progression (30,000px desktop, 10,000px mobile) through women in computing stories
- Show name, role, and description for each highlighted woman as the user scrolls
- Maintain the dark blue (#0b1e38) color scheme and Open Sans typography
- Ensure smooth 60fps rendering of the dot field during scroll
- Make the visualization responsive, adapting dot density and scroll length for mobile
- Meet accessibility standards: keyboard scrollable, respects reduced motion, semantic HTML for text content

### Non-Goals
- No backend, CMS, or runtime data fetching — all data is static JSON
- No multi-page routing — single page experience only
- No external asset CDNs — all assets self-hosted
- No analytics or tracking

## 2. Users & Stories

**Audience:** General public, educators, and reviewers interested in data visualization, women in tech history, and scroll storytelling.

- **S1.** As a visitor, I see a field of dots with one highlighted, and text explaining who she is. **AC:** On load, a canvas shows many small dots (people) with one distinctively colored; text overlay shows the woman's name, role, and a brief description.
- **S2.** As I scroll down, the highlighted dot changes to another woman and the text updates. **AC:** Scroll position maps to a specific woman in the dataset; the highlighted dot smoothly transitions; text content crossfades to the new woman's story.
- **S3.** As I continue scrolling, I progress through many women in computing history. **AC:** The visualization cycles through at least 20 women, each with unique position in the dot field and unique story text.
- **S4.** As a mobile visitor, the experience adapts. **AC:** At 390×844, the page height is 10,000px (vs 30,000px desktop); dot field remains readable; text is legible without horizontal scroll.
- **S5.** As a motion-sensitive user, I can reduce animation. **AC:** With `prefers-reduced-motion: reduce`, dot transitions are instant (no smooth movement), and text changes are cut instead of crossfade.

## 3. Information Architecture

Single page with very long vertical scroll:

| Section | Purpose |
|---------|---------|
| Hero/Intro | Title "One Amongst Many", subtitle "A data visualization of women in computing.", initial dot field with first woman highlighted |
| Visualization | Full-viewport canvas with dot field; text overlay updates on scroll to show each woman's story |
| Footer | Credits, data sources, and links to learn more |

**Navigation:** No header nav — the experience is linear scroll only. The scroll itself is the navigation through the dataset.

**Scroll mapping:**
- Desktop: 30,000px page height, each woman occupies ~1,200-1,500px of scroll
- Mobile: 10,000px page height, each woman occupies ~400-500px of scroll
- Total women in dataset: 20-25

## 4. Requirements by Build Layer

### 4A. Structure
- Single-page React app with no routing
- Full-viewport canvas/WebGL layer for the dot visualization (fixed position, behind text)
- Text overlay with woman's name (h2), role (h3), description (p), and progress indicator
- Very tall body: 30,000px desktop, 10,000px mobile (via CSS media query)
- Footer at the bottom with credits

### 4B. Design System

**Color tokens:**
- `--color-bg: #0b1e38` — dark blue background
- `--color-text: #fffef5` — off-white text
- `--color-dot: rgba(255, 254, 245, 0.3)` — default dot color (dim)
- `--color-highlight: #fffef5` — highlighted dot (bright)
- `--color-accent: #e8a838` — accent for links or special elements

**Typography:**
- **Font family:** 'Open Sans', sans-serif (self-hosted, weights 400, 400i, 700)
- **Title:** 2.5rem, weight 700, letter-spacing -0.02em
- **Subtitle:** 1.125rem, weight 400, opacity 0.8
- **Woman name:** `clamp(2rem, 5vw, 3.5rem)`, weight 700
- **Role:** 1.25rem, weight 400, font-style italic, opacity 0.9
- **Description:** 1.125rem, line-height 2, max-width 600px
- **Progress:** 0.875rem, opacity 0.6

**Layout:**
- Text overlay: max-width 800px, padding 40px, positioned bottom-left on desktop, bottom-center on mobile
- Canvas: fixed position, inset 0, z-index 1 (behind text at z-index 10)
- Body height: 30,000px desktop, 10,000px mobile

### 4C. Interactivity & Motion

**Dot Visualization:**
- **Dot field:** 2,000-5,000 dots scattered across the viewport, each representing a person in computing. Dots are small circles (2-3px radius) with low opacity (0.3) by default.
- **Highlighted dot:** One dot at a time is highlighted — larger (6-8px), full opacity, bright color (#fffef5), with a subtle glow effect. The highlighted dot's position corresponds to the current woman in the dataset.
- **Transitions:** When scroll progresses to the next woman, the highlight smoothly moves from the old dot to the new dot over 0.8s (ease-out cubic). The old dot fades to dim, the new dot brightens.
- **Parallax:** The dot field has subtle parallax on scroll — dots move at slightly different speeds based on their "depth" to create a sense of dimensionality.

**Text Overlay:**
- **Content:** Woman's name, role/title, 2-3 sentence description of her contributions, and progress indicator (e.g., "3 of 24").
- **Transitions:** Text crossfades over 0.6s when the woman changes. Old text fades out and slides up 20px; new text fades in and slides up from 20px below.
- **Scroll mapping:** Each woman's story occupies a specific scroll range. The text updates when the scroll position enters that range.

**Scroll Behavior:**
- **Desktop:** 30,000px page height. Each woman gets ~1,200px of scroll space. The highlight transition begins 200px before the next woman's range.
- **Mobile:** 10,000px page height. Each woman gets ~400px of scroll space.
- **Progress indicator:** Updates as the user scrolls, showing current woman index and total.

**Reduced motion:**
- Dot transitions are instant (no smooth movement)
- Text changes are cut (no crossfade)
- Parallax disabled

### 4D. Content & Data

**Dataset:** 20-25 women in computing, each with:
- `name`: Full name (e.g., "Grace Hopper", "Ada Lovelace")
- `role`: Title/role (e.g., "Computer Scientist, United States Navy", "Mathematician")
- `description`: 2-3 sentences about her contributions
- `position`: { x, y } coordinates in the dot field (0-1 normalized)
- `year`: Year of notable contribution (for potential timeline)

**Example entries:**
- Grace Hopper — COBOL, compiler, "Amazing Grace"
- Ada Lovelace — First computer programmer, Analytical Engine
- Katherine Johnson — NASA mathematician, orbital mechanics
- Radia Perlman — "Mother of the Internet", spanning-tree protocol
- etc.

**Text content:**
- **Title:** "One Amongst Many"
- **Subtitle:** "A data visualization of women in computing."
- **Footer:** Credits to original creators, data sources, and links to learn more about women in computing history.

### 4E. Polish & Fallbacks

- **No Canvas fallback:** If Canvas/WebGL unavailable, show a static image of the dot field with the first woman highlighted, and text content still scrolls through stories (without dot transitions).
- **Performance:** Dot count capped at 5,000; use requestAnimationFrame for smooth rendering; debounce scroll handler; use transform for dot positions (GPU accelerated).
- **Reduced motion:** As specified in 4C.
- **Mobile:** Reduce dot count to 2,000 on mobile for performance; simplify glow effects.

## 5. Tech Stack

| Layer | Choice |
|-------|--------|
| Framework | React 18 + Vite 5 + TypeScript |
| Visualization | HTML Canvas 2D (or Three.js Points for WebGL) |
| Motion | GSAP ScrollTrigger OR native scroll with requestAnimationFrame |
| Styling | CSS Modules + custom properties |
| Fonts | Open Sans (self-hosted woff2) |
| Hosting | Vercel static build |

**Rationale:** Canvas 2D is sufficient for dot rendering and keeps bundle small; GSAP ScrollTrigger provides smooth scroll-linked animations; Open Sans matches the original; static build ensures self-containment.

## 6. Setup & Build

```bash
npm install
npm run dev      # Vite dev server at http://localhost:5173
npm run build    # tsc + vite build -> dist/
npm run preview  # serve production build locally
```

**Constraints:**
- No environment variables required
- Production build must type-check cleanly
- All fonts and data bundled statically

## 7. Assets

**Self-hosted:**
- **Fonts:** Open Sans (400, 400i, 700) woff2 files in `public/fonts/`
- **Data:** `src/data/women.json` with 20-25 entries
- **Visualization:** Procedural dot field — no images or models

**No external requests:**
- Google Fonts replaced with self-hosted woff2
- No analytics, no CDN assets

## 8. Self-Containment & Integrity

- No external runtime dependencies: all JS, fonts, and data served from the app
- No CDN links for fonts or assets
- No analytics, tracking, or third-party beacons
- No secrets or API keys
- Data is static JSON, no runtime fetching

## 9. Accessibility & Responsiveness

- Semantic HTML: `<h1>` for title, `<h2>` for woman name, `<p>` for description, proper heading hierarchy
- Keyboard operable: all content reachable via scroll; no keyboard traps
- Reduced motion support per 4C and 4E
- Focus states visible on links
- Color contrast: #fffef5 on #0b1e38 exceeds WCAG AAA
- Responsive: body height 30,000px desktop, 10,000px mobile; text overlay adapts to viewport; dot field scales
- Touch: native scroll works; no small touch targets
- Document language declared: `<html lang="en">`
- Alt text: Canvas has aria-label describing the visualization; text content provides the same information

## 10. Acceptance Criteria & Verification

- **Build:** `npm run build` type-checks and bundles with no errors
- **Visualization:** Dot field renders with 2,000+ dots; one dot highlighted at a time; highlight smoothly transitions on scroll
- **Scroll:** Page height 30,000px desktop / 10,000px mobile; each woman's story occupies correct scroll range; text updates at the right scroll positions
- **Content:** At least 20 women with name, role, description; text crossfades smoothly; progress indicator updates
- **Responsive:** At 1440×900 and 390×844, no horizontal overflow; text legible; dot field visible
- **Reduced motion:** With emulation, dot transitions are instant and text changes are cut
- **Self-containment:** No network requests after initial load; fonts self-hosted; data is static JSON
- **Accessibility:** Keyboard scroll works; semantic headings present; color contrast passes; canvas has aria-label

## 11. Deliverables

- `screenshots/home-desktop.png` (1440×900) and `screenshots/home-mobile.png` (390×844) — initial view with first woman highlighted
- `PRD.md` (this document), `SETUP.md`, `features.json`, `site.toml`
- Private Vercel deployment for review team
- Narrated walkthrough video (link in SETUP.md) showing scroll through multiple women

## 12. Constraints & Risks

- **Performance:** Rendering 5,000 dots at 60fps during scroll can be challenging. Mitigation: use Canvas 2D with efficient drawing, limit dot count on mobile, debounce scroll handler, use transform for positions.
- **Scroll jank:** Long page (30,000px) with scroll-linked animations can cause jank. Mitigation: use requestAnimationFrame, avoid layout thrashing, use transform/opacity only.
- **Data accuracy:** Stories of women in computing must be accurate and respectful. Mitigation: use well-sourced information, cite sources in footer.
- **Mobile performance:** Canvas rendering on mobile GPUs may be slower. Mitigation: reduce dot count to 2,000 on mobile, simplify effects.
- **Original site fidelity:** The original uses specific easing and timing for dot transitions. Mitigation: study the original closely, match the feel even if not pixel-perfect.
