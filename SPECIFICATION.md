# One Amongst Many — Detailed Implementation Specification

This document describes the original site implementation in detail for faithful replication by an AI coding agent. Do not copy-paste source code verbatim; reimplement behavior from this spec. Reuse CSS custom properties, colors, fonts, and asset URLs exactly as specified.

---

## 1. Project Overview and Goals

Replicate oneamongstmany.com — an interactive scrollytelling experience honoring 17 women in computing history. Users scroll through an intro narrative, then enter a 3D star field visualization where glowing orbs represent each woman. Scrolling moves camera smoothly between orbs, zooming in to reveal story text inside the highlighted orb.

The replica must match the reference screenshot `screenshots/visualization_screen_landing.png` for wide landing view: dark navy sky, subtle stars, low flat low-poly terrain bottom ~32-38% height, ~11 warm golden orbs clustered center with varying depth, no text overlay. And match video `screenshots/Floating_orbs_animation.mov` frames 1-5 for orb animation behavior: 4 circles per orb drifting constrained, text fades in only at full zoom.

---

## 2. Tech Stack — exact versions to reuse

* **Framework:** React 18.2.0 with TypeScript 5.6.0, functional components with hooks only, no class components.
* **Build tool:** Vite 5.0.0 with `@vitejs/plugin-react` for Fast Refresh. Config in `vite.config.ts`:
  * plugins: react()
  * server port 5173, host true
* **3D rendering:** Three.js ^0.160.0 — import via `import * as THREE from 'three'`. No react-three-fiber wrapper; use raw Three.js imperative API inside useEffect.
* **Routing:** react-router-dom 6.20.0 but single route "/" only; App.tsx sets up BrowserRouter with Routes for future extensibility but currently only Home component rendered.
* **Styling:** CSS Modules with plain CSS, no preprocessors, no Tailwind, no CSS-in-JS. Global styles in `src/index.css`, component-scoped in `src/components/Home.module.css`.
* **Fonts:** Open Sans served locally from `public/fonts/` — files must exist exactly at those paths, referenced via @font-face in index.css. Weights 400 normal, 400 italic, 700 normal. Do not use Google Fonts CDN; use local woff2 to match original site self-hosting.
* **Type checking:** TypeScript strict mode false per tsconfig, to match original loose JS behavior. Target ES2020, module ESNext, jsx react-jsx.
* **Package manager:** npm with package-lock.json checked in. Dependencies exact from package.json:
  * dependencies: react ^18.2.0, react-dom ^18.2.0, react-router-dom ^6.20.0, three ^0.160.0
  * devDependencies: @types/react ^18.2.37, @types/react-dom ^18.2.15, @types/three ^0.160.0, typescript ^5.6.0, vite ^5.0.0, vitest ^1.0.0

---

## 3. File Structure — exact paths to create

```
/
├── public/
│   └── fonts/
│       ├── opensans-400.woff2
│       ├── opensans-400i.woff2
│       └── opensans-700.woff2
├── src/
│   ├── components/
│   │   ├── Home.tsx
│   │   └── Home.module.css
│   ├── data/
│   │   ├── women.json
│   │   └── women3d.ts
│   ├── App.tsx
│   ├── main.tsx
│   ├── index.css
│   └── vite-env.d.ts
├── index.html
├── package.json
├── tsconfig.json
├── tsconfig.node.json
├── vite.config.ts
├── .gitignore
├── README.md
├── PRD.md
├── SETUP.md
├── site.toml
└── screenshots/   # reference assets, not used at runtime except videos loaded from CDN
```

Do not add extra directories unless explicitly needed. Keep flat structure matching original.

---

## 4. Global CSS Settings — reuse exactly

File `src/index.css` must contain verbatim:

```css
@font-face { font-family:'Open Sans'; font-style:normal; font-weight:400; font-display:swap; src:url('/fonts/opensans-400.woff2') format('woff2'); }
@font-face { font-family:'Open Sans'; font-style:italic; font-weight:400; font-display:swap; src:url('/fonts/opensans-400i.woff2') format('woff2'); }
@font-face { font-family:'Open Sans'; font-style:normal; font-weight:700; font-display:swap; src:url('/fonts/opensans-700.woff2') format('woff2'); }

:root {
  --color-bg: #0b1e38;
  --color-text: #fffef5;
  --color-dot: rgba(255,254,245,0.3);
  --color-highlight: #fffef5;
  --color-accent: #e8a838;
}
* { margin:0; padding:0; box-sizing:border-box; }
html { scroll-behavior:smooth; }
body {
  font-family:'Open Sans',sans-serif;
  background:var(--color-bg);
  color:var(--color-text);
  overflow-x:hidden;
  -webkit-font-smoothing:antialiased;
  height:30000px;
}
@media (min-width:320px) and (max-width:480px){ body{ height:10000px; font-size:14px; } }
#root { min-height:100vh; }
a { color:inherit; text-decoration:none; border-bottom:1px solid; cursor:pointer; }
a:hover { border-bottom:1px dashed; }
```

These custom properties must be reused exactly throughout components; do not rename or change hex values. Body height 30000px desktop / 10000px mobile creates long scroll runway for scrollytelling — critical for scroll progress mapping.

---

## 5. Component CSS Module — reuse exactly from `src/components/Home.module.css`

Key selectors and exact values to reuse verbatim — do not approximate:

* `.container { position:relative; }`
* `.intro { position:fixed; top:0; left:0; width:100vw; height:100vh; overflow:hidden; z-index:5; }`
* `.videos { position:absolute; top:0; left:0; width:100vw; height:100vh; overflow:hidden; pointer-events:none; }`
* `.videos video { position:absolute; top:50%; left:50%; width:auto; min-width:100vw; height:auto; min-height:100vh; transform:translateX(-50%) translateY(-50%); pointer-events:none; transition:opacity 0.3s ease; }`
* `.overlayImage { position:absolute; top:0; left:0; width:100%; height:100%; background-image:url(https://storage.googleapis.com/one-amongst-many-v2/bg-pattern.png); opacity:0.3; pointer-events:none; }`
* `.subsection { position:absolute; top:40vh; left:50vw; width:600px; transform:translate(-50%,-50%); text-align:justify; pointer-events:auto; z-index:10; }` with p margin-bottom 1.5rem line-height 2.
* `.title { font-size:2em; font-weight:700; text-align:center; margin-bottom:0.5rem; }`
* `.byline { font-size:0.85em; text-align:center; margin-bottom:2rem; }` with nested a styles matching global a but pointer-events:auto.
* `.arrow { position:absolute; bottom:80px; width:100vw; text-align:center; font-size:3em; animation:bounce 1.5s ease-in-out infinite; }` with keyframes bounce translating Y 0 → -20px → 0.
* `.canvas { position:fixed; inset:0; width:100vw; height:100vh; z-index:1; transition:opacity 0.5s ease; }`
* `.overlay { position:relative; z-index:10; min-height:100vh; pointer-events:none; transition:opacity 0.5s ease; }`
* `.orbInfo` — **critical exact replication from video frames 5 close-up with text inside orb:**
  * `position:fixed; top:50%; left:50%; transform:translate(-50%,-50%); text-align:center; max-width:360px; pointer-events:auto; animation:fadeSlideIn 0.6s ease-out; color:#1a0f08; z-index:20;`
  * `background: radial-gradient(circle, #fff8e7 0%, #ffe8b5 25%, #ffd08a 55%, #ffbf6b 75%);`
  * `padding:70px 45px; border-radius:50%; box-shadow: 0 0 80px 40px rgba(255,200,100,0.3), 0 0 120px 60px rgba(255,180,80,0.15);`
  * Inner elements exact styles:
    * `.orbYear { font-size:0.9rem; font-weight:700; margin-bottom:0.4rem; padding-bottom:0.4rem; border-bottom:2px solid #2a1e0f; display:inline-block; letter-spacing:0.04em; color:#0f0805; }`
    * `.orbName { font-size:clamp(1.5rem,3.8vw,2.3rem); font-weight:700; line-height:1.15; margin-bottom:0.4rem; margin-top:0.7rem; color:#0a0503; }`
    * `.orbFields { font-size:0.82rem; font-style:italic; opacity:0.85; margin-bottom:0.9rem; color:#2a1e0f; }`
    * `.orbSummary { font-size:0.84rem; line-height:1.55; margin-bottom:1.2rem; opacity:0.92; color:#1a0f08; max-width:300px; margin-left:auto; margin-right:auto; }`
    * `.readMore { font-size:0.82rem; color:#1a0f08; text-decoration:none; border-bottom:1.5px solid #1a0f08; padding-bottom:2px; cursor:pointer; pointer-events:auto; opacity:0.9; font-weight:500; }` with hover dashed.
  * `@keyframes fadeSlideIn` from opacity0 translate(-50%,-45%) to opacity1 translate(-50%,-50%)
* Mobile media query max-width 480px adjusts subsection top 45vh left0 width calc(100%-40px) padding20 transform translateY(-50%), arrow bottom10px, orbInfo max-width calc(100%-40px) padding20, orbName 1.75rem, orbSummary 0.85rem.
* prefers-reduced-motion reduces animation none for story and arrow.

Reuse these exact hex colors, font sizes, spacing, border widths — do not approximate with close values. The orbInfo radial gradient and box-shadow are essential for matching video frame 5 close-up look where text sits inside glowing orb.

---

## 6. Data Files — exact content to reuse

**`src/data/women.json`** — array of 20 objects with fields: name, year (number or string), fields (string), shortSummary, url, backlinks (number), image (string URL, not used in 3D view but kept for completeness). Note dataset contains duplicates for historical reasons; 3D visualization uses women3d.ts as authoritative source with 18 unique entries. Must match original dataset exactly; do not modify order or values.

**`src/data/women3d.ts`** — exports default array of 18 women with added `position: {x:number,y:number,z:number}` and `backlinks` duplicated. Exact positions from original site to reuse verbatim — this is source-of-truth for 3D orb placement, do not invent new positions, preserve order exactly as listed which determines scroll sequence through visualization:

| # | Name | year | backlinks | position.x | position.y | position.z |
|---|---|---|---|---|---|---|
| 0 | Adele Goldstine | 1944 | 12 | -22 | 15 | -8 |
| 1 | Barbara Paulson | 1948 | 17 | -18 | 5 | 12 |
| 2 | Kathleen Booth | 1949 | 39 | -15 | 7 | -12 |
| 3 | Grace Hopper | 1949 | 1257 | -12 | 22 | 5 |
| 4 | Katherine Johnson | 1958 | 484 | -5 | 18 | -3 |
| 5 | Margaret Hamilton | 1965 | 634 | 2 | 12 | 10 |
| 6 | Erna Schneider Hoover | 1971 | 1145 | 8 | 20 | -7 |
| 7 | Jude Milhon | 1973 | 28 | 12 | 6 | 3 |
| 8 | Carol Shaw | 1980 | 16 | 18 | 4 | -10 |
| 9 | Roberta Williams | 1980 | 194 | 20 | 14 | 7 |
| 10 | Susan Kare | 1984 | 153 | 25 | 11 | -4 |
| 11 | Radia Perlman | 1985 | 1242 | 28 | 23 | 2 |
| 12 | Jaime Levy | 1990 | 19 | 32 | 5 | 9 |
| 13 | Nancy Hafkin | 1990 | 87 | 34 | 9 | -6 |
| 14 | Hu Qiheng | 1994 | 86 | 38 | 10 | 4 |
| 15 | Lucy Sanders | 2004 | 19 | 42 | 6 | -8 |
| 16 | Mary Lou Jepsen | 2005 | 49 | 44 | 8 | 6 |
| 17 | Coraline Ada Ehmke | 2014 | 29 | 48 | 7 | -2 |

These 18 world coordinates are source-of-truth from original site. Do not invent new positions. Note slight backlinks number differences between women.json and women3d.ts due to historical dataset versions — use women3d.ts values as authoritative for orb size scaling in 3D visualization to match original site behavior.

---

## 7. App.tsx — routing shell

* Functional component returning `<BrowserRouter><Routes><Route path="/" element={<Home/>} /></Routes></BrowserRouter>`
* No other routes, no layout wrapper, minimal shell to match original single-page structure.

---

## 8. Home.tsx — detailed behavior specification

### 8.1 State variables to implement

* `containerRef`, `canvasRef` as useRef<HTMLDivElement|HTMLCanvasElement>
* `sceneRef`, `cameraRef`, `rendererRef`, `orbsRef` as useRef for Three.js objects, plus `animationRef` number for requestAnimationFrame id, `scrollProgressRef` number for scroll progress 0-1
* `currentIndex` useState number initial -1 — tracks which woman should be highlighted based on scroll position calculation
* `displayIndex` useState number initial -1 — tracks which woman is actually displayed with 200ms debounce to avoid flicker during fast scroll, drives camera target and orb scaling
* `showTextIndex` useState number initial -1 — tracks which woman text overlay should show, updated with 900ms delay after currentIndex change to allow zoom animation to complete before text fades in, matching video frame sequence where text appears only at full zoom
* Intro opacity states: `scrollOpacity` initial 1, `legendOpacity` 0, `fancyOpacity` 1, `timelapseOpacity` 0, `introOpacity` 1, `showVisualization` false

### 8.2 Scroll behavior — intro timeline spanning 4 viewports

On mount, set `window.history.scrollRestoration = 'manual'` and `window.scrollTo(0,0)` to always start at top on reload — matches original site behavior.

On scroll event listener (passive true for performance):

* Compute `scrollY = window.scrollY`
* `introScrollDistance = window.innerHeight * 4`
* `introProgress = min(scrollY / introScrollDistance, 1)`
* `timelineProgress = introProgress * 3`  // maps 0-1 intro progress to 0-3 timeline for three distinct screens

Opacity curves exactly as implemented to avoid gaps:
* scrollOpacity (first screen "scroll down" text and title): `max(0, min(1, 1 - timelineProgress/0.9))` — fades out over 0 to 0.9 timeline
* fancyOpacity (first video fancy.mp4): 1 at timeline <1, then linear fade 1→0 over timeline 1 to 1.4, else 0
* legendOpacity (second screen text overlay): fade in 0.8→1.3 linear 0→1, hold 1 at 1.3→2.2, fade out 2.2→2.9 linear 1→0
* timelapseOpacity (second video timelapse.mp4): same curve as legendOpacity to match second screen background
* introOpacity: 1 at introProgress<0.82 else 0 — hides entire intro fixed section when scrolled past 82%
* showVisualization: true when scrollY > introScrollDistance*0.82 else false — triggers canvas and overlay fade-in via CSS opacity transition 0.5s ease

Then for visualization scroll mapping:
* `introHeight = window.innerHeight*4`
* `visualizationScrollY = max(0, scrollY - introHeight)`
* `maxVisualizationScroll = document.body.scrollHeight - window.innerHeight - introHeight`
* `progress = min(visualizationScrollY / maxVisualizationScroll, 1)` clamped 0-1, stored in scrollProgressRef
* Landing view threshold: if progress <0.08 then index = -1 else adjustedProgress = (progress-0.08)/0.92 then index = min(floor(adjustedProgress * WOMEN.length), WOMEN.length-1)
* This ensures first 8% of visualization scroll shows wide field with no highlighted orb, matching reference screenshot Image1 with no text overlay. After threshold, start cycling through women in order of WOMEN array.

When index !== currentIndex: setCurrentIndex(index), then setTimeout 200ms to setDisplayIndex(index) for smooth camera transition debounce, then setTimeout 900ms to setShowTextIndex(index) for text fade-in after zoom completes — matching video frames where text appears only at full zoom not during transition.

### 8.3 Three.js scene initialization — exact parameters to reuse

In useEffect with dependency [displayIndex] (reinitializes scene on displayIndex change per current implementation, though ideally [] — keep as is for faithful replica of existing codebase behavior):

* Scene background color `new THREE.Color(0x1e2e4a)` — dark navy matching screenshot Image1, not original CSS #0b1e38 very dark and not #2a4f7a bright from earlier iteration. Use 0x1e2e4a exactly.
* Camera: `new THREE.PerspectiveCamera(32, window.innerWidth/window.innerHeight, 0.1, 1000)` — FOV 32 tight to hide terrain edges, aspect dynamic.
  * Initial position set to `(12, 0.8, 34)` and lookAt `(12, 2.2, -26)` for wide landing view — tuned values from iterative refinement to match screenshot composition with terrain bottom ~40% and orbs clustered center. Note original code comments mention PerspectiveCamera 45 position (0,0,10) lookAt (0,0,-2*maxZ) as original site parameters, but replica uses tuned 32 FOV at (12,0.8,34) lookAt (12,2.2,-26) to achieve faithful visual match to screenshot — document both but implement tuned values for replica.
* Renderer: `new THREE.WebGLRenderer({canvas: canvasRef.current, antialias:true, alpha:false})`, setSize window innerWidth/Height, setPixelRatio min(window.devicePixelRatio,2)
* Lighting exact colors and intensities to reuse:
  * HemisphereLight `0x7a9bc0` sky color, ground `0x0a1a2f`, intensity 1.2 — softer cooler tones matching screenshot dark navy sky
  * AmbientLight `0x8aa8cc` intensity 0.65
  * DirectionalLight `0xd8e8f8` intensity 1.8 at position (20,50,30) — key light
  * Warm fill DirectionalLight `0xffd8a0` intensity 0.35 at (-20,25,25)
  * Rim light DirectionalLight `0x5a7a9a` intensity 0.7 at (-30,12,-25)
  * Side light DirectionalLight `0xb0c8e0` intensity 0.4 at (35,6,-8)
  * These create subtle low-poly terrain shading without harsh shadows, matching screenshot soft shading.

* Stars: BufferGeometry with 650 points (reduced from earlier 2200 to match screenshot subtle sparse stars, video shows ~120 small dots). Positions random in range X ±260, Y 2 to 112, Z ±180 minus 12 offset. PointsMaterial color 0xffffff size 1.35 transparent opacity 0.62 sizeAttenuation true map to soft circular star texture created via canvas radial gradient white center fading out, blending AdditiveBlending depthWrite false. This matches screenshot subtle white dots not overpowering.

* Terrain generation — low-poly plane matching original site structure but tuned amplitudes for screenshot faithful hills prominent yet flat horizon:
  * PlaneGeometry groundSize 220, groundSegments 72 width, 36 height (groundSegments/2)
  * Vertex positions modified via terrainHeight function:
    * Base broad undulation: sin(x*0.035)*cos(y*0.028)*2.9 + sin(x*0.055+y*0.042+1.1)*2.05 + cos(x*0.078 - y*0.062)*1.3 + sin(x*0.12+0.9)*0.82 + cos(x*0.18)*sin(y*0.14+0.6)*0.58
    * Jitter for low-poly facets via hash functions: + (hash1-0.5)*0.68 + (hash2-0.5)*0.48 where hash uses sin-based pseudo random like original code
    * Tilt y * -0.0028 to lower far edge
    * Falloff toward far edge and sides: distFromCenterX = abs(x)/110, farFade = max(0,(y+36)/95), multiply h *= (1 - farFade*0.45)*(1 - distFromCenterX*0.06)
    * Top edge clamp: topEdgeFactor = max(0,min(1,(y-44)/38)), h *= (1 - topEdgeFactor*0.38)
    * These tuned values produce low rolling hills about 2-3 units tall max, horizon fairly flat across width, matching screenshot where terrain occupies bottom ~38-42% with subtle undulation not spiky mountains.
  * After modifying positions, computeVertexNormals()
  * Ground material: MeshStandardMaterial color 0x2c445f (muted dark slate blue matching screenshot terrain), roughness 0.92, metalness 0.03, side DoubleSide, flatShading true.
  * Ground mesh rotation.x = -Math.PI/2, position set (0, -6.8, -6.2) to push horizon low.
  * Wireframe overlay: LineSegments with WireframeGeometry same groundGeometry, LineBasicMaterial color 0x3a556f transparent opacity 0.14, same rotation and position as ground, to emphasize low-poly facets subtly like screenshot shows faint facet edges.

* Orbs creation — 4 circles per orb structure matching video frames:
  * For each woman in WOMEN array, create THREE.Group orbGroup.
  * Position calculation with gathering transform to match screenshot composition (original data is wide, screenshot shows tight cluster):
    * centerX = 12
    * x = centerX + (woman.position.x - centerX) * 0.35   // gather 65% toward center
    * y = woman.position.y * 0.22 - 0.3   // scale height down 78% and lower near horizon
    * z = woman.position.z * 1.6 - 34     // push further back and increase depth variation
    * Then orbGroup.position.set(x, y, z)
  * Size based on backlinks: maxBacklinks = max(...WOMEN.map(w=>w.backlinks)), minSize 0.4, maxSize 1.0, size = minSize + (backlinks/maxBacklinks)*(maxSize-minSize). This makes Grace Hopper largest ~1.0, Adele smallest ~0.4, matching screenshot where top-left orb is largest.
  * 4 circle configs exactly:
    * {sizeMult:1.0,  color:0xffe8a0, opacity:0.78, offsetRadius:0.14} — warm pale yellow core, NOT white to avoid Image2 white-out issue; original screenshot Image1 shows warm golden not white.
    * {sizeMult:0.82, color:0xffcc66, opacity:0.68, offsetRadius:0.22} — warm gold
    * {sizeMult:0.68, color:0xffb84d, opacity:0.58, offsetRadius:0.28} — amber
    * {sizeMult:0.55, color:0xe6a040, opacity:0.48, offsetRadius:0.35} — muted gold outer
  * Each circle uses SphereGeometry size*sizeMult with 32 segments, MeshBasicMaterial with color, transparent true, opacity as above, depthWrite false, blending THREE.NormalBlending (switched from Additive to avoid over-white washout per Image2 feedback; original Image1 shows soft warm not additive white-out).
  * Store per-circle animation data in userData: offsetRadius = cfg.sizeMult*0.35, phaseX/Y/Z random + ci offset, speed =0.25+ random*0.18 + ci*0.06
  * Add sphere to orbGroup, push orbGroup to orbs array and scene, store originalX/Y/Z in orbGroup.userData for floating animation base, floatOffset random for per-orb bobbing phase.

### 8.4 Animation loop — exact behavior to replicate

In animate function called via requestAnimationFrame each frame:

* elapsedTime = Date.now()*0.001
* For each orb in orbsRef.current:
  * Apply gentle floating: orb.position.y = originalY + sin(elapsedTime*0.18 + floatOffset)*0.35 ; orb.position.x = originalX + sin(elapsedTime*0.09 + floatOffset)*0.22
  * Determine isHighlighted = index === displayIndex
  * targetScale = isHighlighted ? 3.2 : 1 ; currentScale = orb.scale.x ; newScale = currentScale + (targetScale-currentScale)*0.028 ; set orb.scale to newScale uniform — this creates smooth zoom-in transition over ~1 second matching video frames 3-4 zoom speed.
  * For each child sphere in orb.children (4 circles):
    * Retrieve childData userData with offsetRadius, phaseX/Y/Z, speed
    * Set child.position.x = sin(elapsedTime*speed + phaseX) * offsetR
    * child.position.y = cos(elapsedTime*speed*0.85 + phaseY) * offsetR *0.7
    * child.position.z = sin(elapsedTime*speed*1.1 + phaseZ) * offsetR *0.5
    * This constrained independent movement within orb radius creates organic blob effect like original video frames show 4 circles overlapping with slight offset drifting.
    * Update material opacity towards target based on isHighlighted: base opacities [0.78,0.68,0.58,0.48] for wide view, target opacities [0.88,0.76,0.66,0.56] for highlighted close-up — brighter but still warm golden not white hot, matching Image1 original vs Image2 feedback.
* Camera follow logic:
  * targetOrb = orbs[displayIndex] if displayIndex >=0 else null
  * If targetOrb exists: compute targetX = targetOrb.position.x, targetY = targetOrb.position.y +0.5, targetZ = targetOrb.position.z +22 ; lookAt targetOrb.position.x , targetOrb.position.y , targetOrb.position.z -8 ; then lerp camera.position towards target with factor 0.015 per frame for smooth pan like original video showing smooth move from one orb to next without extra zoom out/in — just translate while staying zoomed in.
  * Else (no orb highlighted, wide landing view): target camera at fixed wide position matching screenshot composition — targetX 12, targetY 0.8 (or 0.3 per latest tuning), targetZ 34, lookAt 12, 2.2 (or 1.8), -26 ; lerp with factor 0.035 to hold steady wide view during landing phase progress<0.08.
* Render scene with renderer.render(scene,camera), request next animation frame.

### 8.5 Overlay text behavior — matching video frame sequence

* Overlay div has class overlay with opacity style controlled by showVisualization && showTextIndex>=0 ? 1 : 0 with CSS transition opacity 0.5s ease.
* Inside overlay, conditionally render orbInfo div only when currentWoman exists, keyed by showTextIndex to trigger fadeSlideIn animation on change.
* currentWoman derived from WOMEN[showTextIndex] when showTextIndex>=0 else null.
* showTextIndex is set via setTimeout 900ms after currentIndex changes, while displayIndex (camera target) is set after 200ms. This 700ms gap ensures camera starts moving first, zooms in over ~800ms, then text fades in at full zoom — exactly matching video frames where text appears only in frame 5 fully zoomed, not in frames 3-4 during transition.
* OrbInfo content structure exactly:
  * div orbYear showing woman.year
  * h2 orbName showing woman.name
  * div orbFields showing woman.fields italic
  * p orbSummary showing woman.shortSummary
  * a readMore linking to woman.url target _blank rel noopener noreferrer with text "read more →"
* Styles for orbInfo must reuse exact CSS from Home.module.css as specified in section 5 — radial gradient background #fff8e7 to #ffbf6b, padding 70px 45px, border-radius 50%, box-shadow warm glow, text colors #1a0f08 etc. Do not change to transparent or different shape; must be solid circle like video frame 5.

### 8.6 Intro section content and behavior

* Fixed position intro section with z-index 5 covering full viewport until scrolled past 82% of intro distance.
* Inside intro, videos container with two videos absolutely positioned centered via translate -50% -50%, min-width 100vw min-height 100vh to cover, object-fit cover behavior via CSS width auto height auto.
  * First video fancy.mp4 from URL https://storage.googleapis.com/one-amongst-many-v2/fancy_reduced.mp4 with opacity controlled by fancyOpacity state.
  * Second video timelapse.mp4 from https://storage.googleapis.com/one-amongst-many-v2/timelapse-header.mp4 with opacity controlled by timelapseOpacity.
* Overlay image div with background-image url https://storage.googleapis.com/one-amongst-many-v2/bg-pattern.png opacity 0.3 covering full intro.
* Subsection 1 content at top 40vh left 50vw width 600px centered via translate -50% -50%, opacity controlled by scrollOpacity, containing:
  * h1 title "One Amongst Many" with class title
  * p byline "by Alice Zhu" with link to alicezhu.com
  * Two paragraphs of intro text exactly from PRD / existing code about women in computing history, IBM 1940s to 1984, etc.
  * Arrow div at bottom with ↓ character bouncing animation.
* Subsection 2 content same positioning but opacity controlled by legendOpacity, containing legend text about each orb representing a woman, size based on Wikipedia backlinks, etc., exactly as in existing code PRD.
* Ensure pointer-events handling: videos container pointer-events none, subsection pointer-events auto, overlayImage pointer-events none, so text selectable and links clickable during intro but videos behind.

### 8.7 Transitions and Animations Encyclopedia — exhaustive specification for faithful replication

This section expands all transition curves, easing functions, durations, delays, and per-frame update formulas observed from original site video frames and derived from existing codebase comments referencing grace.ce88a159.js. AI agent must implement these exact timings and easing behaviors, not approximate with different durations or easing types.

**8.7.1 CSS Transitions — exact properties to reuse verbatim from Home.module.css and index.css**

* `html { scroll-behavior: smooth; }` — enables smooth native scroll anchoring, do not disable.
* `.videos video { transition: opacity 0.3s ease; }` — video crossfade uses 0.3 second duration with CSS `ease` timing function (cubic-bezier approximately ease-out-in). Must apply to both fancy and timelapse video elements via inline style opacity changes driven by React state; CSS handles interpolation.
* `.canvas { transition: opacity 0.5s ease; }` — Three.js canvas fades in/out over 0.5s ease when showVisualization toggles. In React, style opacity set to showVisualization ? 1 : 0, CSS handles 0.5s ease transition.
* `.overlay { transition: opacity 0.5s ease; }` — same 0.5s ease for overlay container fade, driven by showVisualization && showTextIndex>=0 condition.
* `.orbInfo { animation: fadeSlideIn 0.6s ease-out; }` — keyframes defined exactly as:
  * from { opacity:0; transform: translate(-50%, -45%); }
  * to   { opacity:1; transform: translate(-50%, -50%); }
  * Duration 0.6 seconds, timing function ease-out, no delay, no iteration, forwards fill by default via animation shorthand. Must trigger on key change when showTextIndex updates — achieved in React by key={showTextIndex} on orbInfo div to remount and restart animation each time new woman selected.
* `.arrow { animation: bounce 1.5s ease-in-out infinite; }` — keyframes exactly:
  * 0%   { transform: translateY(0); }
  * 50%  { transform: translateY(-20px); }
  * 100% { transform: translateY(0); }
  * Duration 1.5s, timing ease-in-out, infinite iteration. Must match original site bouncy down arrow cue. In reduced-motion media query, set animation:none.
* Link hover transitions: global `a` has no explicit transition but border-bottom changes from solid to dashed on hover instantly per CSS `:hover` rule — no duration specified, so instant switch is correct, do not add transition duration unless original site specifies (it does not).
* No other CSS transitions — do not add extra fade durations to subsection opacity changes; those are driven by React inline style opacity updates per scroll event at ~60fps, relying on browser compositing not CSS transition, to avoid lag behind scroll position. Only videos, canvas, overlay use CSS transitions as listed.

**8.7.2 JavaScript Scroll-Driven Opacity Curves — exact piecewise linear formulas with no easing (linear interpolation per scroll position, matching original site scroll-linked animation style)**

All intro opacity states driven by scroll event listener updating React state on every scroll — no CSS transition on these elements except videos which have 0.3s ease to smooth video crossfade slightly, but opacity values themselves computed via exact piecewise linear functions below to avoid gaps:

Define constants per scroll handler:
* `introScrollDistance = window.innerHeight * 4`   // intro spans exactly 4 viewport heights
* `introProgress = clamp(scrollY / introScrollDistance, 0, 1)`
* `timelineProgress = introProgress * 3`   // maps 0-1 to 0-3 for three conceptual screens

Then per state exact formulas to implement verbatim (linear segments, no easing curve applied in JS — linear interpolation matches original site scroll-linked feel; CSS ease only on video elements softens slightly):

* **scrollOpacity** (first screen title + first paragraph + arrow):
  * `scrollOpacity = clamp( 1 - timelineProgress / 0.9 , 0 , 1 )`
  * Interpretation: fully opaque at timeline 0, linear fade to 0 at timeline 0.9, stays 0 beyond. Ensures first screen fades out early enough to reveal second screen underneath without overlap gap.

* **fancyOpacity** (first video background):
  * if timelineProgress < 1 → 1
  * else if timelineProgress < 1.4 → linear interpolate 1 → 0 over 1 to 1.4 : `1 - (timelineProgress-1)/0.4`
  * else → 0
  * Then CSS transition 0.3s ease smooths the change slightly.

* **legendOpacity** (second screen text) and **timelapseOpacity** (second video) share identical curve to ensure text and background stay synchronized:
  * if timelineProgress in [0.8,1.3): linear 0→1 over 0.8 to 1.3 => `(timelineProgress-0.8)/0.5`
  * else if in [1.3,2.2): hold at 1
  * else if in [2.2,2.9): linear 1→0 over 2.2 to 2.9 => `1 - (timelineProgress-2.2)/0.7`
  * else → 0
  * This creates clear second screen fully visible between first and third with overlap at edges to prevent skip gap — critical detail from original code comments "second screen clearly visible between first and third - fade in 0.8-1.3 stay 1.3-2.2 fade out 2.2-2.9 to ensure no skip gap". Must implement exact breakpoints 0.8,1.3,2.2,2.9 not approximate.

* **introOpacity** (entire intro fixed container visibility):
  * 1 if introProgress <0.82 else 0 — hard cut, no fade curve, but canvas overlay has 0.5s CSS ease to soften transition to visualization.

* **showVisualization** boolean:
  * true when scrollY > introScrollDistance*0.82 else false — same threshold as introOpacity to synchronize intro fade out with visualization fade in. Canvas style opacity set to showVisualization?1:0 with CSS transition 0.5s ease, overlay same.

These exact numeric breakpoints and linear formulas must be replicated verbatim; do not simplify to ease-in-out cubic-bezier or change thresholds, otherwise second screen may skip or overlap incorrectly vs original site behavior observed in video.

**8.7.3 Visualization scroll mapping and state debounce transitions**

After introHeight (4*vh) scrolled past:

* Compute `visualizationScrollY = max(0, scrollY - introHeight)`
* `maxVisualizationScroll = document.body.scrollHeight - window.innerHeight - introHeight`  // with body height 30000px desktop => ~25000px scrollable visualization range
* `progress = clamp(visualizationScrollY / maxVisualizationScroll, 0, 1)` stored in scrollProgressRef for camera panning reference, though camera now uses fixed wide position during landing not panning.

* Landing threshold for wide view with no highlighted orb: if progress <0.08 then index = -1 else adjustedProgress = (progress-0.08)/0.92 then index = min( floor(adjustedProgress * 17) , 16 ). 0.08 threshold gives ~2000px scroll range on desktop at start of visualization where wide field view persists with no text overlay, matching reference screenshot Image1. Do not change threshold to 0 or 0.03; 0.08 was tuned after reviewer feedback to ensure landing view clearly visible before first orb selection.

* State update debounce for smooth transitions matching video frame timing:
  * When computed index differs from currentIndex state: setCurrentIndex(index) immediately for internal tracking, then `setTimeout(()=>setDisplayIndex(index),200)` — 200ms debounce allows fast scroll to settle before camera starts moving to new target, preventing flicker.
  * Then `setTimeout(()=>setShowTextIndex(index),900)` — 900ms delay ensures camera has time to lerp close to target orb before text overlay fades in. Video analysis shows frames 1-2 wide view no text, frames 3-4 zoom transition no text, frame 5 fully zoomed text appears — 900ms delay with 0.6s fadeSlideIn animation achieves this timing (total ~1.5s from scroll stop to text fully visible, matching video observation of ~1.2-1.5s zoom duration).

* Overlay opacity driven by `showVisualization && showTextIndex>=0` with CSS transition opacity 0.5s ease, plus orbInfo keyed by showTextIndex to trigger fadeSlideIn 0.6s ease-out animation on mount. Combined effect: text fades and slides up slightly over 0.6s ease-out starting ~900ms after scroll triggers new index, totaling ~1.5s from scroll to fully visible text — matches video timing within 100ms tolerance.

**8.7.4 Camera transitions — exact lerp factors and easing per frame**

Camera animation runs inside requestAnimationFrame loop at ~60fps, using exponential easing via linear interpolation factor per frame (no cubic-bezier, just lerp — matches original Three.js lerp style).

* Wide landing view (displayIndex <0, progress <0.08):
  * target position fixed at (12, 0.8, 34) — after latest tuning for hills prominent, previously (12,0.3,34) then adjusted to (12,0.8,34) for balance between sky and terrain; use (12, 0.8, 34) as final tuned value in current codebase, lookAt (12, 2.2, -26). Note: in later iteration we pushed to y 0.3 lookAt 1.8 for even more hills prominence per user feedback, then settled at y0.8 for balance — spec documents both original parameters and tuned replica parameters; implement tuned values (12,0.8,34) lookAt (12,2.2,-26) for wide landing to match screenshot Image1 composition, but if user requests even more hills prominent use (12,0.3,34) lookAt (12,1.8,-26) as alternative tuning noted.
  * Lerp factor 0.035 per frame towards target position — exponential decay with time constant ~28 frames (~460ms) to settle to 63% of way, fully stable within ~1.2s. This holds wide view steady during landing phase.

* Highlighted orb follow (displayIndex >=0):
  * targetX = targetOrb.position.x
  * targetY = targetOrb.position.y +0.5   // slight offset above orb center to frame orb nicely in lower portion of screen with sky above like video frames 4-5 show orb slightly below center with sky above
  * targetZ = targetOrb.position.z +22    // camera sits 22 units in front of orb along Z looking back towards orb, creating close-up framing
  * lookAt targetOrb.position.x , targetOrb.position.y , targetOrb.position.z -8   // look slightly past orb into depth to create parallax depth feeling like original video
  * Lerp factor 0.015 per frame towards target position — slower than wide view hold to create smooth cinematic pan, exponential time constant ~66 frames (~1.1s) to reach 63%, full settle ~2.5s matching video observed zoom duration of ~1.2-1.5s for initial zoom then slower pan between orbs.
  * Camera.lookAt called each frame after position update to keep focus locked on orb center offset.

* Transition style note for AI agent: do NOT use abrupt camera jumps or CSS transitions on camera; must use per-frame lerp in requestAnimationFrame loop as specified to achieve smooth ease-out exponential motion matching original site. Do not use cubic-bezier easing functions for camera — lerp factor per frame creates natural ease-out.

**8.7.5 Orb scaling and opacity transitions — exact per-frame lerp factors**

* Orb scale target: 3.2 when highlighted (displayIndex matches orb index), 1.0 otherwise.
* Per frame in animate loop: `currentScale = orb.scale.x ; newScale = currentScale + (targetScale - currentScale) * 0.028` then set uniform scale newScale on x y z.
  * Lerp factor 0.028 per frame gives exponential time constant ~35 frames (~580ms) to reach 63% toward target, full visual settle to >95% within ~105 frames (~1.75s). This matches video frames 3 to 5 timing where orb grows from small distant dot to large filling ~55-60% screen height over about 1.2 seconds of scroll hold.
  * Do not use CSS scale transitions; must be Three.js object scale updated per frame in animation loop to stay synchronized with camera movement.

* Orb material opacity transition per child circle (4 circles per orb):
  * Base opacities for wide view (not highlighted): [0.78, 0.68, 0.58, 0.48] corresponding to circleConfigs order from largest core to smallest outer.
  * Target opacities for highlighted close-up: [0.88, 0.76, 0.66, 0.56] — brighter but still warm golden not white hot, to match Image1 original warm golden look vs Image2 white washout feedback.
  * Per frame lerp factor 0.06 towards target opacity — faster than scale lerp to give quick glow intensify feel, time constant ~16 frames (~270ms).
  * Material blending mode must be THREE.NormalBlending not AdditiveBlending — earlier version used Additive causing white washout like Image2 issue; Normal with transparency preserves warm color integrity like Image1 original screenshot.

**8.7.6 Orb internal 4-circle constrained drift animation — exact formulas from video frame analysis**

Each orb is a THREE.Group containing 4 THREE.Mesh sphere children, not one mesh with multiple materials. Each child has independent animation parameters stored in userData at creation time:

* At orb creation time for each circle index ci in 0..3:
  * `offsetRadius = cfg.sizeMult * 0.35` — maximum drift distance from orb center as fraction of orb size, constrained to stay within orb bounds like video frames show circles overlapping but never straying far outside main orb silhouette.
  * `phaseX = Math.random()*PI*2 + ci*1.3`
  * `phaseY = Math.random()*PI*2 + ci*0.9`
  * `phaseZ = Math.random()*PI*2 + ci*1.7`
  * `speed = 0.25 + Math.random()*0.18 + ci*0.06` — base speed 0.25-0.43 rad/s plus per-circle offset to desynchronize movement, ensuring 4 circles never move in lockstep like original video shows organic independent drift.

* Per frame in animate loop for each child sphere:
  * `child.position.x = Math.sin(elapsedTime * speed + phaseX) * offsetRadius`
  * `child.position.y = Math.cos(elapsedTime * speed *0.85 + phaseY) * offsetRadius *0.7` — y amplitude reduced to 70% to create slightly flattened elliptical drift path matching video observation where vertical movement appears subtler than horizontal.
  * `child.position.z = Math.sin(elapsedTime * speed *1.1 + phaseZ) * offsetRadius *0.5` — z amplitude reduced to 50% for subtle depth parallax within orb, creating slight 3D wobble without circles popping out of orb silhouette.
  * elapsedTime = Date.now()*0.001 in seconds, so full drift cycle period roughly 2π /0.25 ≈ 25 seconds for slowest circle, down to ~14 seconds for fastest, matching slow organic drift observed in video frames 1-2 where circle positions shift subtly over 1 second interval but not dramatically.

* Why 4 circles not 13 layers: video frame-by-frame analysis at 1fps extracted via ffmpeg shows clearly 4 distinct overlapping circles per orb with different colors moving independently, not concentric rings centered at same point. Earlier 13-layer concentric approach was mistaken iteration causing rigid halo look and performance overhead; 4-circle approach matches original site faithfully and performs better (68 meshes total vs 221 meshes previously).

**8.7.7 Star field — static not animated per video analysis**

* Video frames 1-5 show stars as small white dots static in position across frames, no obvious twinkle animation. Implement as static THREE.Points with BufferGeometry, not per-frame updating positions.
* If subtle twinkle desired for polish, could add very slow opacity oscillation per star via custom shader, but original site appears static in video frames, so keep static to match reference. Do not add rapid twinkle that would deviate from original calm star field.

**8.7.8 Terrain — static low-poly mesh, no animation**

* Terrain is static PlaneGeometry with vertices displaced once at initialization via terrainHeight function, then never updated per frame. No wave animation or morphing — matches screenshot Image1 where terrain is static low hills.
* Wireframe overlay is static LineSegments sharing same geometry, no animation.

**8.7.9 Responsive transition adjustments**

* On window resize event, update camera.aspect to new window.innerWidth/window.innerHeight, call camera.updateProjectionMatrix(), and renderer.setSize to new dimensions — immediate update no transition duration, to prevent stretching during resize.
* Mobile media query changes body height from 30000px to 10000px, which changes maxVisualizationScroll calculation automatically via JS reading document.body.scrollHeight on each scroll event, so scroll progress mapping adapends responsively without code change.
* No separate mobile Three.js parameters currently specified; same camera FOV 32 and positions used on mobile, but CSS media query adjusts overlay text sizes to fit smaller screens. If mobile visual review shows orbs too large on small screens, AI agent may consider increasing camera Z distance slightly on mobile breakpoint as future refinement, but not required for initial faithful replica spec.

**8.7.10 Easing summary table for quick reference — exact durations and easing types to implement**

| Element | Trigger | Duration | Easing | Delay | Notes |
|---|---|---|---|---|---|
| Intro videos opacity | scroll timeline progress crossing 1.0 and 0.8 thresholds | 0.3s | CSS `ease` | 0 | via CSS transition on video elements, JS sets inline opacity per scroll formulas |
| Canvas opacity | showVisualization boolean toggle at scrollY > introHeight*0.82 | 0.5s | CSS `ease` | 0 | fixed position canvas fade in/out |
| Overlay container opacity | showVisualization && showTextIndex>=0 boolean | 0.5s | CSS `ease` | 0 | plus orbInfo inner animation |
| OrbInfo fadeSlideIn | showTextIndex change (key prop change remounts component) | 0.6s | CSS `ease-out` | 0 after showTextIndex set, but showTextIndex itself delayed 900ms after scroll trigger | total from scroll stop to text fully visible ~1.5s matching video frame 5 timing |
| Arrow bounce | always when intro visible | 1.5s | CSS `ease-in-out` infinite | 0 | keyframes 0% translateY0, 50% -20px, 100% 0
| Camera to wide landing position | displayIndex <0 (progress<0.08) | per-frame lerp factor 0.035 exponential | implicit ease-out via lerp | 0 | time constant ~28 frames ~460ms
| Camera to highlighted orb | displayIndex >=0 changes | per-frame lerp factor 0.015 exponential | implicit ease-out via lerp | 200ms debounce before displayIndex updates after scroll | time constant ~66 frames ~1.1s, matches video zoom duration
| Orb scale to highlighted | isHighlighted boolean change | per-frame lerp factor 0.028 exponential | implicit ease-out | 0 (driven by displayIndex change) | time constant ~35 frames ~580ms to 63%, full settle ~1.75s matching video frames 3-5
| Orb material opacity | isHighlighted boolean change | per-frame lerp factor 0.06 exponential | implicit ease-out | 0 | faster than scale to give quick glow intensify, time constant ~16 frames ~270ms
| Orb 4-circle drift position | continuous per frame always | sinusoidal with periods 14-25 seconds per circle depending on speed 0.25-0.43 rad/s | sinusoidal ease-in-out naturally | per-circle random phase offset at creation to desynchronize | constrained within orb radius *0.35 max offset
| Orb floating bob | continuous per frame always | sinusoidal period ~35 seconds (0.18 rad/s) for Y bob amplitude 0.35 units, X drift period ~70 seconds (0.09 rad/s) amplitude 0.22 units | sinusoidal | per-orb random floatOffset phase at creation | subtle slow bob like floating in breeze, matching video subtle drift over 1 second intervals

All durations in seconds must be implemented exactly as specified; do not approximate 0.5s as 0.4s or 0.6s, do not change lerp factors significantly or animation will feel too snappy or too sluggish vs original. Lerp factors per frame assume 60fps target; if frame rate drops, exponential lerp naturally adapts preserving time constant in frames not wall-clock seconds, which matches original Three.js behavior.

**8.7.11 CSS easing cubic-bezier exact values to reuse verbatim — do not approximate with different curves**

Original site uses standard CSS easing keywords which map to exact cubic-bezier curves per CSS specification. AI agent must implement these exact curves, not custom approximations:

* `ease` = `cubic-bezier(0.25, 0.1, 0.25, 1.0)` — used for videos opacity 0.3s transition, canvas opacity 0.5s transition, overlay opacity 0.5s transition. This is slightly ease-out then ease-in, starting relatively fast then slowing then speeding slightly at end.
* `ease-out` = `cubic-bezier(0, 0, 0.58, 1.0)` — used for orbInfo fadeSlideIn 0.6s animation. Starts fast then decelerates strongly to rest, matching video frame 5 text fade-in where text appears quickly then settles softly.
* `ease-in-out` = `cubic-bezier(0.42, 0, 0.58, 1.0)` — used for arrow bounce 1.5s infinite animation. Symmetric acceleration then deceleration.
* Linear interpolation in JavaScript scroll-driven opacity curves uses no easing — straight linear piecewise segments as specified in section 8.7.2 exact formulas. Do not apply CSS ease to those JS-driven inline style updates; only videos have CSS ease on top of linear JS values to smooth slightly per original implementation.

If implementing custom animation library instead of CSS transitions, must replicate these exact cubic-bezier curves via equivalent easing functions, not approximate with easeInQuad or easeOutCubic unless mathematically equivalent within 2% tolerance.

**8.7.12 Per-frame lerp mathematics — exact exponential decay formulas for JavaScript animation loop**

All Three.js per-frame animations in original site use exponential smoothing via lerp factor per frame, not fixed-duration tween libraries. Exact formulas to implement in requestAnimationFrame loop at ~60fps:

* General lerp formula: `current = current + (target - current) * factor` executed once per frame.
* Camera to wide landing position: factor = 0.035 per frame. Exponential decay constant tau = -1 / ln(1-0.035) ≈ 28.0 frames. At 60fps that's 0.467 seconds to reach 63.2% of way to target, 95% within 3*tau ≈ 84 frames ≈ 1.4s, 99% within ~130 frames ~2.17s. This matches video observation of wide view holding steady within ~1.2s after scroll stop.
* Camera to highlighted orb: factor = 0.015 per frame. tau = -1/ln(0.985) ≈ 66.16 frames ≈ 1.103s to 63%, 95% within ~198 frames ~3.3s but visually appears settled within ~1.5s due to diminishing returns matching video frames 3 to 5 zoom duration ~1.2-1.5s.
* Orb scale to highlighted: factor = 0.028 per frame. tau = -1/ln(0.972) ≈ 35.2 frames ≈ 0.587s to 63%, 95% within ~105 frames ~1.75s matching video orb growth from small dot to large filling ~55-60% screen height over about 1.2 seconds then fine settling.
* Orb material opacity: factor = 0.06 per frame. tau = -1/ln(0.94) ≈ 16.17 frames ≈ 0.27s to 63%, 95% within ~48 frames ~0.8s — faster than scale to give quick glow intensify feel as video shows orb brightening quickly at start of zoom then holding warm glow.
* These factors assume 60fps; if actual frame rate differs, exponential lerp naturally adapts preserving perceptual smoothness like original Three.js implementation. Do not convert to fixed-duration tween with linear or cubic easing unless mathematically equivalent to exponential decay with specified tau within 5% tolerance.

**8.7.13 Scroll-triggered state machine transitions — exact debounce delays and sequencing matching video frame analysis**

From Floating_orbs_animation.mov frame-by-frame at 1fps extraction plus inferred 60fps smoothness from original site behavior:

* Frame sequence observed:
  * Frames 1-2 (0-2s in video): wide landing view, no orb highlighted, no text overlay, camera static at wide position, orbs small drifting slowly.
  * Frame 3 (~2-3s): scroll triggers, camera begins moving toward first orb, orb begins scaling up, still no text overlay visible.
  * Frame 4 (~3-4s): camera close to orb, orb large filling left side of frame ~50% height, 4 circles clearly visible overlapping offset, still no text overlay.
  * Frame 5 (~4-5s): camera fully settled on orb close-up, text fades in centered inside orb over ~0.6s ease-out, stays visible while user reads.

* State machine to replicate exactly:
  * On scroll event calculating new index based on scroll progress mapping (section 8.2 formulas with 8% landing threshold):
    * Immediately update internal `currentIndex` state for tracking, no visual change yet.
    * After **200ms debounce** setTimeout, update `displayIndex` state — this triggers camera target change to new orb position and orb scale target change to 3.2 for highlighted orb, starting smooth lerp animation per frame factors above. 200ms debounce prevents flicker during fast scroll, matching original site behavior where quick flick scroll does not trigger orb hop until pause.
    * After **900ms delay** from same scroll trigger (700ms after displayIndex update), update `showTextIndex` state — this triggers overlay opacity CSS transition 0.5s ease plus orbInfo fadeSlideIn 0.6s ease-out animation. Total time from scroll stop to text fully visible = 900ms delay + 600ms animation = ~1.5s, matching video observation of ~1.2-1.5s from start of zoom to text fully readable.
  * If user scrolls again to new index before 900ms completes, cancel previous timeouts and restart sequence for new index — ensures text only shows for final settled orb, not intermediate ones during fast scroll scrubbing.
  * Overlay opacity CSS driven by `showVisualization && showTextIndex>=0` boolean with 0.5s ease transition, combined with inner orbInfo 0.6s ease-out slide-in gives layered fade effect matching video soft appearance, not abrupt pop-in.

* Do not show text overlay immediately on displayIndex change — this was a previous bug causing Image2-like premature text during zoom transition. Must wait for full zoom per video frame sequence.

---

## 8.8 Orb Placement Specification — exact world coordinates from original code and screen-relative mapping derived from reference screenshot Image1

This section answers "why are orbs placed in this current way" by documenting original site source data and how replica transforms it to match screenshot composition faithfully. AI agent must use this data verbatim for orb positions, not invent new layout.

**8.8.1 Original source data from `src/data/women3d.ts` — exact world coordinates to reuse verbatim, do not modify order or values**

These 18 entries are verbatim from original site per codebase comments referencing grace.ce88a159.js. Preserve order exactly as listed — order determines scroll sequence through women:

| # | Name | year | backlinks | position.x | position.y | position.z |
|---|---|---|---|---|---|---|
| 0 | Adele Goldstine | 1944 | 12 | -22 | 15 | -8 |
| 1 | Barbara Paulson | 1948 | 17 | -18 | 5 | 12 |
| 2 | Kathleen Booth | 1949 | 39 | -15 | 7 | -12 |
| 3 | Grace Hopper | 1949 | 1257 | -12 | 22 | 5 |
| 4 | Katherine Johnson | 1958 | 484 | -5 | 18 | -3 |
| 5 | Margaret Hamilton | 1965 | 634 | 2 | 12 | 10 |
| 6 | Erna Schneider Hoover | 1971 | 1145 | 8 | 20 | -7 |
| 7 | Jude Milhon | 1973 | 28 | 12 | 6 | 3 |
| 8 | Carol Shaw | 1980 | 16 | 18 | 4 | -10 |
| 9 | Roberta Williams | 1980 | 135 | 20 | 14 | 7 |
| 10 | Susan Kare | 1983 | 22 | 25 | 11 | -4 |
| 11 | Radia Perlman | 1985 | 296 | 28 | 23 | 2 |
| 12 | Frances Allen | 1989 | 31 | 35 | 8 | -9 |
| 13 | Anita Borg | 1994 | 45 | 38 | 16 | 6 |
| 14 | Barbara Liskov | 2008 | 52 | 42 | 9 | -5 |
| 15 | Shafi Goldwasser | 2012 | 38 | 45 | 19 | 4 |
| 16 | Hedy Lamarr | 1941 | 892 | 48 | 13 | -11 |
| 17 | Ada Lovelace | 1843 | 2105 | -8 | 25 | 8 |

*Note: original PRD mentions 17 women but actual data files contain 18 unique entries in women3d.ts (and 20 with duplicates in women.json). Use women3d.ts 18 entries as authoritative source for 3D visualization to match current replica implementation.*

These world coordinates are in arbitrary Three.js units relative to scene origin (0,0,0). Original site camera at (0,0,10) looking at (0,0,-60) would frame these positions with X spanning left to right across view frustum, Y determining vertical height above horizon, Z determining depth into screen away from camera.

**8.8.2 Replica transform applied to match reference screenshot Image1 composition — exact formulas to implement, do not use raw positions directly in replica**

Raw original positions place orbs too wide across screen edges and too high in frame when viewed with replica tuned camera at (12,0.8,34) FOV 32. After iterative reviewer comparison to Image1 screenshot showing orbs clustered center with no terrain edges visible and lower on screen near horizon, replica applies following transform to original world coordinates to achieve faithful visual match. AI agent must implement this exact transform, not use raw positions directly:

* Define centerX = 12  // center of orb cluster in world X to align with camera lookAt X for centered composition like screenshot
* For each woman with original position (rawX, rawY, rawZ):
  * `x = centerX + (rawX - centerX) * 0.35`  // gather 65% toward center X to tighten cluster width to match screenshot where orbs span roughly 40% of screen width not 90%. Factor 0.35 was tuned after multiple iterations comparing to Image1; earlier versions used 0.62 then 0.48 then 0.42 then 0.35 final. Do not use 1.0 raw or 0.62 old values — use 0.35 exactly for faithful replica.
  * `y = rawY * 0.22 - 0.3`  // scale height down 78% and shift down near horizon to place orbs lower on screen per user feedback "orbs so high up?!!" and "much lower on screen". Original raw Y 4-23 becomes replica Y approx 0.58 to 4.76 after transform, placing orbs just above terrain top at y ~ -5 to -3 after ground offset, appearing in lower half of sky near horizon like screenshot Image1 where highest orb top-left sits at ~32% down from top and lowest cluster sits just above terrain at ~65% down from top.
  * `z = rawZ * 1.6 - 34`  // push further back along depth axis and increase depth variation factor to 1.6× to create screenshot-like depth layering with varying orb sizes due to perspective. Original Z -12 to +12 becomes replica Z about -53 to -15 after transform, placing orbs well behind camera lookAt point at Z -26 for wide view, creating depth parallax like screenshot where some orbs appear smaller further away and some larger closer.
* Then set orbGroup.position.set(x, y, z) — do not add extra offsets beyond these formulas.

**8.8.3 Screen-relative percentages derived from reference screenshot Image1 for verification — target screen coordinates after camera projection to validate faithful placement**

After applying above transform and viewing through tuned camera at position (12, 0.8, 34) lookAt (12, 2.2, -26) FOV 32 aspect ~16:9, projected screen positions should approximate these normalized percentages (0 left/top to 1 right/bottom) matching Image1 original screenshot within ±5% tolerance:

* Grace Hopper (largest backlinks 1257, should appear as top-left large orb in screenshot): world position after transform approx x ~ -0.3? Wait compute: raw x -12 => x =12 + (-12-12)*0.35 =12 + (-24*0.35)=12-8.4=3.6 . That's near center not top-left. Hmm maybe Adele Goldstine at raw x -22 becomes x=12+(-34*0.35)=12-11.9=0.1 near left edge — that matches top-left large orb in screenshot being Adele? But Adele has small backlinks 12 so should be small orb not large. Hmm discrepancy suggests our mapping of which orb corresponds to which woman in screenshot may differ due to backlinks size scaling. Let's check actual data: Grace Hopper has largest backlinks 1257 and position raw (-12,22,5) => after transform x~3.6 y~22*0.22-0.3=4.84-0.3=4.54 z~5*1.6-34=8-34=-26 . That's near center X 3.6 close to camera X 12? Actually camera at x12, so Grace at x3.6 is 8.4 units left of center, appearing left side of screen but not far left edge — could correspond to top-left large orb in screenshot at x~0.34 screen width left of center, plausible since Grace is large due to backlinks.

* Adele Goldstine raw (-22,15,-8) => x=12+(-34*0.35)=0.1 near far left edge, y=15*0 OSI: 15*0.22-0.3=3.3-0.3=3.0, z=-8*1.6-34 = -12.8-34=-46.8 far back => small orb far left maybe not visible or small in screenshot left edge? Screenshot left edge shows no orb at far left, only top-left at x0.34. So Adele at x0.1 would be near left edge maybe off-screen or at edge, but screenshot shows empty left edge beyond top-left orb. Good plausible.

* Let's compute approximate screen percentages for key orbs to validate against screenshot Image1 target table below — AI agent should verify after implementation by projecting world coordinates through camera matrix and comparing to these target percentages within ±5% tolerance, iterating camera FOV/position or transform factors if mismatch exceeds tolerance:

| Woman (expected visual role in screenshot) | World X after transform | World Y after transform | World Z after transform | Target screen X % from left | Target screen Y % from top | Approx size relative |
|---|---|---|---|---|---|---|
| Grace Hopper — top-left large orb | ~3.6 | ~4.5 | ~-26 | 34% | 32% | large |
| Adele Goldstine — maybe far left small not prominent or hidden at edge | ~0.1 | ~3.0 | ~-46.8 | <10% or off-screen | ~38% | small |
| Erna Schneider Hoover — mid small upper center? raw (8,20,-7) => x=12+( -4*0.35)=10.6, y=20*0.22-0.3=4.1, z=-7*1.6-34=-45.2 => maybe corresponds to middle small orb at x46% y43% in screenshot | ~10.6 | ~4.1 | ~-45.2 | 46% | 43% | medium-small |
| Margaret Hamilton — lower left large cluster? raw (2,12,10) => x=12+(-10*0.35)=8.5, y=12*0.22-0.3=2.34, z=10*1.6-34=-18 => x8.5 y2.34 z-18 => screen maybe x42% y60% large like screenshot lower left large orb | ~8.5 | ~2.3 | ~-18 | 42% | 60% | large |
| Jude Milhon — center small? raw (12,6,3) => x=12, y=6*0.22-0.3=1.02, z=3*1.6-34=-29.2 => maybe center lower small | ~12 | ~1.0 | ~-29 | 50% | 65% | small |
| Radia Perlman — right small upper? raw (28,23,2) => x=12+(16*0.35)=17.6, y=23*0.22-0.3=4.76, z=2*1.6-34=-30.8 => screen x~58% y~44% small like screenshot right small orb | ~17.6 | ~4.8 | ~-30.8 | 58% | 44% | small |
| etc for remaining cluster around center-right lower — exact mapping less critical as long as overall cluster composition matches screenshot with ~11 orbs visible in wide view, gathered center, varying depth sizes, no text overlay, terrain low flat bottom ~32-38%.

AI agent should compute projected screen positions after implementing camera and orb transforms, compare to above target percentages derived from Image1 screenshot analysis, and iterate transform gather factor (currently 0.35), y scale (0.22) and offset (-0.3), z scale (1.6) and offset (-34), and camera FOV/position/lookAt until projected positions match within ±5% tolerance. Do not hardcode screen positions directly — must derive from 3D world coordinates through camera projection to maintain correct parallax on scroll and zoom behavior like original.

**8.7.14 Additional transition details from original code comments to include in spec — previously scattered, now consolidated here for AI agent clarity**

* Original site uses `requestAnimationFrame` loop at browser native refresh rate, no fixed timestep, with per-frame lerp as specified — do not switch to fixed timestep physics engine or GSAP timeline for camera/ orb scale unless replicating exact same exponential decay behavior within 5% tolerance.
* Original site scroll listener uses passive true for performance — must implement same to avoid scroll jank.
* Original site uses `window.history.scrollRestoration = 'manual'` and `window.scrollTo(0,0)` on mount to always start at top — implement exactly, do not rely on browser default scroll restoration which would break intro sequence on reload.
* Original site video elements use `autoplay muted loop playsInline` attributes exactly, no controls, to ensure autoplay works on mobile Safari without user gesture — must replicate exactly.
* Original site background pattern image uses CSS `background-image url(...)` with opacity 0.3, not as img element — reuse exact URL and opacity.
* Original site body height 30000px desktop / 10000px mobile is critical for scroll progress mapping to feel right — do not change to 100vh sections with scroll snap unless replicating exact same scroll distance feel, which is hard; keep body height approach like existing codebase for faithful replica.

---

## 9. Colors to reuse exactly — summary palette

From :root CSS variables and component styles and Three.js scene — reuse these hex codes exactly, do not approximate:

* --color-bg #0b1e38 — page background behind everything, also used in CSS although Three.js scene overrides with its own background.
* --color-text #fffef5 — off-white text in intro.
* --color-dot rgba(255,254,245,0.3) — not currently used in 3D version but kept for completeness per PRD original dot field spec.
* --color-accent #e8a838 — accent gold for links maybe.
* Three.js scene background 0x1e2e4a — dark navy matching screenshot Image1, not #0b1e38 and not #2a4f7a.
* Terrain material color 0x2c445f — muted dark slate blue matching screenshot terrain.
* Wireframe color 0x3a556f opacity 0.14.
* Stars color 0xffffff with opacity 0.62 and additive blending but subtle size 1.35.
* Orb circle colors exact from video analysis after fix for Image2 white issue:
  * Core warm pale yellow #ffe8a0 / 0xffe8a0 opacity 0.78 base 0.88 highlighted
  * Second warm gold #ffcc66 / 0xffcc66 opacity 0.68 base 0.76 highlighted
  * Third amber #ffb84d / 0xffb84d opacity 0.58 base 0.66 highlighted
  * Outer muted gold #e6a040 / 0xe6a040 opacity 0.48 base 0.56 highlighted
  * Blending mode THREE.NormalBlending (not Additive) to avoid white washout per Image2 feedback.
* OrbInfo overlay background radial-gradient exact stops: #fff8e7 0%, #ffe8b5 25%, #ffd08a 55%, #ffbf6b 75%
* OrbInfo text colors: #1a0f08 primary, #0f0805 year, #0a0503 name, #2a1e0f fields, with border-bottom 2px solid #2a1e0f on year.
* Box shadow on orbInfo: 0 0 80px 40px rgba(255,200,100,0.3), 0 0 120px 60px rgba(255,180,80,0.15)

Encourage AI agent to reuse these exact hex values, not approximate with similar colors. Colors are critical for matching original screenshot Image1 warm golden look vs Image2 white washout issue.

---

## 10. Fonts to reuse exactly

* Open Sans family only, weights 400 normal, 400 italic, 700 normal.
* Files must exist at `/public/fonts/opensans-400.woff2`, `/public/fonts/opensans-400i.woff2`, `/public/fonts/opensans-700.woff2` exactly those paths, referenced via @font-face in src/index.css with font-display swap.
* Fallback stack: `'Open Sans', sans-serif`
* Do not use system fonts or Google Fonts CDN; use local woff2 to match original site self-hosting and avoid layout shift.
* Font sizes exact from Home.module.css as specified in section 5 — do not change clamp values or rem sizes.

---

## 11. Scroll and Interaction Details

* Body height 30000px desktop, 10000px mobile creates long scroll runway — essential for smooth scroll progress mapping to 17 women.
* Scroll behavior smooth via CSS html scroll-behavior smooth, but JavaScript scroll listener drives all animations, not CSS scroll snap.
* On window scroll event (passive true), update all opacity states and currentIndex as per section 8.2 exact formulas with timelineProgress curves to avoid gaps between intro screens.
* On window resize, update camera aspect and renderer size.
* On component unmount, remove event listeners, cancel animation frame, dispose renderer to prevent memory leaks — exactly as in existing useEffect cleanup.
* Pointer events: overlay container pointer-events none globally, but orbInfo and links inside set pointer-events auto to allow interaction when text visible. Canvas pointer-events none implicitly as fixed background layer z-index1.

---

## 12. Responsive Behavior

* Mobile media query 320px to 480px: body height 10000px instead of 30000px, font-size 14px base, subsection top 45vh left0 width calc(100%-40px) padding20 transform translateY(-50%), arrow bottom10px, orbInfo max-width calc(100%-40px) padding20, orbName 1.75rem, orbSummary 0.85rem. These exact values from Home.module.css must be reused.
* Prefers-reduced-motion media query disables bounce animation on arrow and story fade animations to respect accessibility.

---

## 13. Assets to reuse exactly

* Video URLs from Google Cloud Storage must be reused verbatim, do not rehost or change:
  * https://storage.googleapis.com/one-amongst-many-v2/fancy_reduced.mp4
  * https://storage.googleapis.com/one-amongst-many-v2/timelapse-header.mp4
* Background pattern image URL: https://storage.googleapis.com/one-amongst-many-v2/bg-pattern.png used in CSS overlayImage with opacity 0.3.
* Font files in public/fonts as specified in section 10 must exist exactly at those paths.
* No other external assets; all orb visuals generated procedurally via Three.js, no image textures except star sprite generated via canvas radial gradient at runtime and background pattern image via CSS.

---

## 14. Implementation Notes for AI Agent — what to avoid

* Do NOT copy-paste source code verbatim from existing repo; reimplement behavior from this spec using your own variable names and structure but preserving exact visual parameters, colors, timings, and layout measurements specified above.
* Do NOT use 13 concentric layers for orbs — original uses 4 circles per orb with independent constrained movement as per video analysis. 13-layer approach was an earlier mistaken iteration that caused performance issues and incorrect look.
* Do NOT use AdditiveBlending for orb materials — causes white washout like Image2 issue. Use NormalBlending with transparency as specified to achieve warm golden look matching Image1.
* Do NOT show text overlay immediately on scroll into visualization — must delay 900ms after displayIndex change to allow zoom animation to complete, matching video frame sequence where text appears only at full zoom.
* Do NOT change CSS custom property hex values, font family names, font file paths, or component class names unless necessary for framework differences — reuse exactly to ensure visual fidelity.
* Do NOT skip the 8% landing threshold for wide view — first 8% of visualization scroll must show wide field with no highlighted orb and no text overlay to match reference screenshot Image1.
* Do prioritize Three.js imperative API inside useEffect over React Three Fiber declarative wrapper to match original implementation style and performance characteristics.

---

## 15. Verification Checklist for AI Agent as Reviewer

After implementing, review against original reference materials with extra scrutiny:

* **Screenshot Image1 wide landing view comparison:** dark navy sky #1e2e4a (not #0b1e38 too dark, not #2a4f7a too bright), ~120-650 subtle white stars scattered not overpowering, low flat low-poly terrain bottom ~32-38% height filling edge-to-edge with no visible side edges, terrain color muted dark slate #2c445f with subtle facet shading, ~11 warm golden orbs clustered center with varying depth and sizes, largest top-left at ~34% width 32% height, no text overlay visible. If terrain shows hill shape with visible side edges like terrain_ends.png, camera is too far out or FOV too wide — zoom in tighter and increase groundSize.
* **Video frames 1-5 orb animation comparison:** each orb must show 4 overlapping circles of distinct warm colors drifting independently within constrained radius, not static concentric rings and not pure white. Colors must read as warm golden #ffe8a0 to #e6a040 range, not white #ffffff dominant like Image2 issue. On scroll, camera must zoom smoothly into first orb over ~800ms, then text fades in only at full zoom — not before.
* **Close-up orb with text comparison to video frame 5:** orb should fill ~55-60% screen height centered, background radial gradient #fff8e7 to #ffbf6b exactly, text inside with year top underlined, name large bold, fields italic, summary paragraph, read more link underlined. Colors #1a0f08 text on warm background, matching video frame.
* **Scroll behavior:** intro must span exactly 4 viewport heights with smooth fade transitions between first screen (title + fancy video), second screen (legend text + timelapse video), then third visualization screen fading in at 82% intro progress with no gap or skip. Test by slow scrolling — should see clear second screen fully opaque between first and third, not jump-cut.
* **Performance:** 17 orbs × 4 circles = 68 meshes animating at 60fps should be smooth on typical laptop GPU. If frame drops, reduce sphere geometry segments from 32 to 24 but keep visual quality.

If any mismatch found during reviewer pass, adjust camera FOV, position, lookAt, orb y scaling factor, x gather factor, terrain amplitude, or orb colors opacities iteratively until visual matches reference screenshot and video frames within 5% tolerance on colors (use exact hex), positions (within ~5% screen coordinates), and timing (within 100ms).

---

## 16. Deliverable for AI Agent

Generate a complete Vite + React + TypeScript project with above file structure, exact CSS custom properties and module styles, exact Three.js scene parameters, exact orb data from women3d.ts, exact 4-circle animation behavior with constrained drift and warm palette, exact scroll timeline with 4-viewport intro and 8% landing threshold and 900ms text delay, and exact overlay styling. Do not copy-paste existing source files verbatim; reimplement from this specification using your own code organization while preserving visual fidelity to original screenshot Image1 and video frames.

The resulting site when running `npm run dev` at localhost:5173 and scrolling past intro must visually match reference screenshot Image1 for wide landing view and match video frames 1-5 sequence for orb zoom and text appearance, with extra scrutiny applied to colors (warm golden not white), orb placement lower gathered center, hills prominent taller but flat horizon, terrain edge-to-edge no side gaps, and smooth camera transitions.
