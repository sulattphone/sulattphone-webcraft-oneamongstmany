# Lumen Field — An Immersive Archive of Women in Computing — Product Requirements Document

## 1. Product Overview

Lumen Field is an original, single-page scrollytelling archive honoring women whose work shaped computing. Visitors move through a prolonged vertical scroll that begins with an atmospheric editorial introduction and then opens into a night landscape — a deep cool sky with sparse stars above low, faceted terrain — populated by warm, glowing orbs. Each orb represents one individual.

The core interaction is scroll-driven camera travel. As the visitor scrolls, the viewpoint glides through the field from one orb to the next, pausing briefly at each. During the pause, a centered story card presents her year of impact, name, field, a concise one-line contribution, and an external reference link. A discreet progress indicator shows position within the sequence, and the experience concludes with a wider pullback and a closing panel offering a short documentary embed and further reading.

The tone is editorial, calm, and cinematic. The product prioritizes continuity of motion, legibility of text, and a sense of scale created by a very tall scroll runway and clustering of distant lights.

This is an original concept inspired by physical data installations where illuminated volumes hold individual biographies, reinterpreted as a virtual night-field that anyone can traverse at their own pace.

## 2. Audience and Core Experience

### Audience
- General public curious about computing history and representation.
- Students, educators, and advocates seeking accessible stories of women in technology.
- Visitors who enjoy scrollytelling, data-visualization, and immersive narrative.

### Core user goals
- Understand the curatorial intent and how the field is organized (chronology plus relative prominence).
- Encounter each individual sequentially through smooth camera movement.
- Read a concise story at each stop and optionally follow a reference link to learn more.
- See overall progress and reach a satisfying conclusion with additional resources.

### Core flows
- **Intro flow:** Visitor lands at top, sees title, subtitle explaining the archive's purpose, and exactly three short editorial paragraphs describing why the collection exists and how orbs encode time and prominence. A looping downward cue near the bottom encourages scrolling. Two atmospheric video layers crossfade behind the text according to the exact scroll timeline in the motion specification.
- **Visualization journey:** After the introduction, the full landscape appears — sky, stars, terrain, and clustered golden orbs in the distance. Continued scrolling moves the camera deeper into the field, approaching each orb in chronological order, holding briefly, then moving to the next. Text appears only when the camera has settled and fades out before travel resumes.
- **Story consumption:** At each orb, a fixed centered card shows year, name, field, short contribution, and a link to an encyclopedia entry. The card enters with a gentle upward drift and fade, then fades out as the visitor scrolls onward.
- **Completion flow:** After the final orb, the camera pulls back to a wide elevated view and a closing panel fades in with an embedded documentary video and links to further reading about computing history. A brief original footer line closes the page.

### Key qualities
- Calm, uninterrupted scroll control with no competing navigation.
- Sense of scale created by a very tall scroll runway.
- Warm glowing presence for each individual against a cool dark environment.
- Original editorial voice throughout with newly authored copy for all editorial sections.

## 3. Global Design System

### Typography
- **Family:** `Open Sans`, sans-serif, served from `/fonts/opensans-400.woff2`, `/fonts/opensans-400i.woff2`, `/fonts/opensans-700.woff2` with `font-display: swap` and generic sans-serif fallback.
- **Body:** `18px` on viewports at least `769px` wide, `16px` from `481px` through `768px`, and `14px` from `320px` through `480px`; line-height `2`, weight `400`, antialiased.
- **Title:** `2em`, weight `700`, centered.
- **Subtitle/byline:** `0.85em`, centered, margin below `2rem`.
- **Orb year label:** `1.25em`, weight `700`, `1px solid #0b1e38` bottom border, displayed inline-block.
- **Orb name:** `1.5em` on desktop, `2rem` from `481px` through `768px`, and `1.75rem` at `480px` and below; weight `700`, line-height `1.15`.
- **Orb fields:** `0.85rem`, italic, opacity `0.9`.
- **Orb summary:** Inherits the body size on desktop, uses `0.95rem` from `481px` through `768px`, and `0.85rem` at `480px` and below; line-height `1.6`, max-width `320px`, centered.
- **Progress pill:** `0.85rem`, letter-spacing `0.05em`, opacity `0.6`.
- Links use inherited color with a `1px solid` bottom border; hover changes the border style to dashed, while keyboard focus adds a `2px solid currentColor` outline with `4px` offset.

### Color tokens
- `--color-bg`: `#192e4c` — deep navy page background and sky zenith.
- `--color-text`: `#fffef5` — warm off-white primary text.
- `--color-accent`: `#e8a838` — accent for interactive emphasis.
- `--color-dot`: `rgba(255,254,245,0.3)` — dim star treatment.
- `--color-highlight`: `#fffef5` — highlighted state.
- **Sky gradient:** Vertical gradient from `#192e4c` at `0%`, through `#1e3558` at `40%` and `#2a446e` at `70%`, to `#345488` at `100%`.
- **Terrain:** `#213344` with double-sided, flat-shaded facets and roughness `1`.
- **Orb golden palette:** Each circle color is interpolated within the exact endpoint range `#ffe070` to `#f08840`. Three screen-blended layers use radius multipliers `1`, `0.75`, and `0.5` with alpha values `0.05`, `0.1`, and `0.85`. Every orb uses a `1.25 × 1.25` plane.
- **Stars:** Exactly `480` off-white `#fffef5` discs, each with base radius `0.075`, `20` radial segments, and a deterministic scale in the interval `[0, 1)`.
- **Orb text legibility:** Text color `#0b1e38` with shadows `0 0 12px rgba(255,254,245,0.6)` and `0 0 24px rgba(255,254,245,0.3)`; there is no hard rectangular backdrop.
- **Progress pill:** Background `rgba(11,30,56,0.6)`, blur `8px`, and border `1px solid rgba(255,254,245,0.15)`.

### Layout and spacing
- Single-column page with no header navigation.
- Scroll runway height is `50000px` at `769px` and above, `35000px` from `481px` through `768px`, and `25000px` at `480px` and below. The intro consumes exactly `10` viewport heights before the remaining runway maps to the visualization.
- Fixed layers use these exact stack depths: canvas `1`, intro `5`, narrative overlay `10`, story card and closing panel `20`, and progress indicator `30`.
- Intro text has `max-width: 600px`; story text has `max-width: 340px` with `24px` padding; the closing panel width is `min(854px, calc(100vw - 40px))` and its media keeps an `854 / 480` aspect ratio.
- Editorial paragraphs use `1.5rem` bottom margin, line-height `2`, and justified alignment.
- The progress pill uses a `20px` radius and `6px 14px` padding. The story card has no filled box or clipped corners.

### Visual components (product/UI building blocks)
- **Intro text block:** Title, subtitle describing curatorial intent, and exactly three short editorial paragraphs in original wording.
- **Video background pair:** Two full-cover looped atmospheric videos placed behind intro text, muted, autoplay, inline playback.
- **Pattern overlay:** Full-cover pattern image at opacity `0.3`, non-interactive, to add texture.
- **Scroll cue:** Centered downward chevron character near bottom that animates with a gentle looping vertical motion.
- **Canvas landscape:** WebGL canvas fixed to viewport showing sky gradient, terrain plane, star field, and orb billboards.
- **Orb billboard:** Plane representing one figure, containing several overlapping warm circles that drift slowly within a constrained radius, using screen blending for glow.
- **Story card:** Fixed center card with year, name, field, summary, and reference link. Appears on arrival at an orb with a soft fade and upward drift.
- **Progress indicator:** Fixed bottom-center pill showing position like "5 of 18".
- **Closing panel:** Fixed center panel containing a documentary embed and further reading links.

### Motion language
- **Global:** Smooth scrolling enabled so programmatic scroll animates rather than jumps.
- **Video crossfade:** This is scroll-scrubbed, not clock-timed. Across the intro's normalized `0–3` timeline:
  - First video: stays at opacity `1` through `1.0` and fades linearly to `0` from `1.0–1.4`.
  - Second video: fades linearly from `0–1` over `0.8–1.3`, holds through `2.2`, and fades linearly to `0` over `2.2–2.9`.
  - Because scroll directly controls opacity, there is no independent millisecond duration or CSS easing.
- **Story entrance:** The centered card animates from opacity `0` and `translate(-50%, -45%)` to opacity `1` and `translate(-50%, -50%)` over exactly `0.9s` with `ease-out`, restarting whenever the displayed figure changes.
- **Scroll cue motion:** The downward indicator runs an infinite `1.5s ease-in-out` cycle, moving from `translateY(0)` at `0%` to `translateY(-20px)` at `50%` and back to `translateY(0)` at `100%`.
- **Camera travel:** Each orb receives exactly `2` normalized timeline units: `1` unit of travel followed by `1` unit of hold. Travel uses quadratic ease-out. The final pullback lasts exactly `2` units.
- **Orb idle motion:** The orb planes remain fixed while their internal circles move, preventing the chronological layout from wandering.
- **Circle drift inside orbs:** Internal motion advances at `0.6` phase units per second; each circle follows deterministic pseudo-noise plus circular motion, with its speed mapped from `0.5` through `1.0` by the figure's age at achievement.
- No motion description references concrete CSS keyframe identifiers; all motion is described by its perceived behavior and timing qualities.

### Responsive system
- **Breakpoint small:** `320px` to `480px` considered mobile.
- **Body height:** `50000px` at `769px` and above, `35000px` from `481px` through `768px`, and `25000px` at `480px` and below.
- **Intro block:** Desktop uses `top: 40vh`, `width: calc(100% - 40px)`, and `max-width: 600px`. Tablet uses `top: 42vh`, `width: calc(100% - 60px)`, and `12px` horizontal padding. Mobile uses `top: 45vh`, `left: 0`, `width: calc(100% - 40px)`, `20px` padding, and `translateY(-50%)`.
- **Story card:** Desktop and mobile use `max-width: 340px` with `24px` padding. Tablet uses `max-width: calc(100% - 60px)` with `20px` padding. Responsive text sizes follow the exact typography values above.
- **Scroll cue:** Bottom offset is `80px` on desktop, `40px` on tablet, and `10px` on mobile.
- **Outro embed:** Desktop width is `min(854px, calc(100vw - 40px))`; tablet width is `calc(100% - 60px)` capped at `640px`; mobile width is `min(340px, calc(100vw - 40px))`. All sizes retain aspect ratio `854 / 480`.
- **Touch target:** No custom small targets; native scroll and standard link hit areas.

### Image / media treatment
- Video backgrounds fill viewport via minimum viewport width and height, centered, non-interactive.
- Pattern overlay covers the entire intro at opacity `0.3`, preserving legibility of text over video.
- Canvas visuals are procedural — no baked hero images — except for pattern overlay and two intro videos from `/public`.
- Embedded video in closing panel is a standard privacy-enhanced embed.
- **Fallbacks:**
  - If atmospheric videos fail to load or autoplay is blocked, intro shows solid deep navy background with pattern overlay retained and editorial text at full opacity so purpose remains readable.
  - If pattern image fails, intro degrades to solid navy and videos alone.
  - If body font fails, fallback sans-serif maintains line-height and readability.
  - If closing video is blocked, show a text link fallback.

## 4. Global Accessibility Requirements

- Keyboard reachability: All content reachable by native scroll using arrow keys, Page Up/Down, Home/End, and Tab to reach byline links, story reference links, and closing panel links. No keyboard traps.
- Visible focus: Link focus indicated by persistent underline and hover/focus change from solid to dashed border.
- Heading structure: Document starts with main title as `h1`. Story card provides figure name as next heading level in reading order. Closing panel includes a strong heading inviting further reading.
- Landmarks: Intro region, main visualization described as image, closing region.
- Accessible names:
  - Canvas has `role="img"` and an aria label describing the 3D field of glowing orbs representing women in computing and that scrolling explores each story.
  - Progress indicator has `aria-live="polite"` and announces position like "3 of 18".
  - Story links have discernible text with arrow indicating external reference.
- Alt text: Decorative pattern treated as decorative and non-interactive. Meaningful imagery conveyed via canvas aria label and story text.
- Contrast: Primary text `#fffef5` on `#192e4c` exceeds WCAG AAA. Story card uses dark text on a warm luminous backing with optional soft glow to maintain readability.
- Reduced motion: When user prefers reduced motion, smooth scrolling, the looping scroll cue, the story entrance animation, and all canvas circle motion are disabled. Scroll-scrubbed intro opacity remains directly controlled by scroll position.
- Media: Intro videos are decorative backgrounds, muted without audio, looped, not requiring captions as they convey atmosphere, not information.
- Language: Document declares `<html lang="en">`.

## 5. Global Content and Data

### Brand and copy
- Product name: `Lumen Field`.
- Voice: Reflective, respectful, concise, and original with newly authored editorial copy.
- Intro copy is newly authored for this project, describing how computing histories often under-represent women's contributions and how a field of lights invites slow encounter.
- No real-person bylines linking to external portfolios are presented as product identity.

### Navigation and links
- No internal navigation aside from scroll.
- Story reference links point to public encyclopedia biographies for each figure, opened in a new tab.

### Data structure
- Collection contains `18` figures. Each record includes:
  - `name` — full name
  - `year` — year of notable contribution
  - `fields` — role / discipline text
  - `shortSummary` — one concise original sentence describing key contribution
  - `summary` — longer description sourced from public knowledge, paraphrased
  - `url` — public encyclopedia or authoritative biography link (https)
  - `backlinks` — number representing broader citation prominence, influencing visual prominence
  - `birthYear` — birth year or null when not widely documented
  - `references` — number influencing inner circle count inside orb (range `4` to `7`)

### Complete women inventory (public figures, original concise summaries)

| Name | Year | Fields | Short summary | Url | Backlinks |
| --- | --- | --- | --- | --- | --- |
| Adele Goldstine | 1944 | Mathematician, computer programmer | Authored the manual and programming workflows for the ENIAC early electronic computer. | https://en.wikipedia.org/wiki/Adele_Goldstine | 246 |
| Barbara Paulson | 1948 | Human computer | Early scientist at JPL who computed rocket trajectories by hand. | https://en.wikipedia.org/wiki/Barbara_Paulson | 17 |
| Kathleen Booth | 1949 | Computer scientist | Designed an early assembly language and tooling for early stored-program machines. | https://en.wikipedia.org/wiki/Kathleen_Booth | 39 |
| Grace Hopper | 1949 | Computer scientist, United States Navy rear admiral | Pioneered the first compiler and championed machine-independent programming languages. | https://en.wikipedia.org/wiki/Grace_Hopper | 1257 |
| Katherine Johnson | 1958 | Mathematician | Performed trajectory and return-path calculations critical to early crewed spaceflights. | https://en.wikipedia.org/wiki/Katherine_Johnson | 484 |
| Margaret Hamilton | 1965 | Computer scientist, systems engineer, business owner | Led development of onboard flight software for the Apollo lunar missions. | https://en.wikipedia.org/wiki/Margaret_Hamilton_(software_engineer) | 104 |
| Erna Schneider Hoover | 1971 | Mathematician | Created a computerized telephone switching control system that improved resilience under load. | https://en.wikipedia.org/wiki/Erna_Schneider_Hoover | 1145 |
| Jude Milhon | 1973 | Hacker, author | Coined cypherpunk and helped sustain Community Memory, an early public bulletin-board system. | https://en.wikipedia.org/wiki/Jude_Milhon | 28 |
| Carol Shaw | 1980 | Video game designer and programmer | Early female game designer known for 3D Tic-Tac-Toe and River Raid for Atari 2600. | https://en.wikipedia.org/wiki/Carol_Shaw | 16 |
| Roberta Williams | 1980 | Video game designer, writer, co-founder | Pioneered graphic adventure games through Mystery House and King's Quest. | https://en.wikipedia.org/wiki/Roberta_Williams | 194 |
| Susan Kare | 1984 | Artist, graphic designer | Designed the original Macintosh icon set including the watch, brush, and trash can. | https://en.wikipedia.org/wiki/Susan_Kare | 153 |
| Radia Perlman | 1985 | Computer programmer, network engineer | Invented the spanning-tree protocol enabling scalable bridged networks. | https://en.wikipedia.org/wiki/Radia_Perlman | 1242 |
| Jaime Levy | 1990 | Author, lecturer, interface designer, user experience strategist | Created early electronic magazines and interactive work distributed on floppy media. | https://en.wikipedia.org/wiki/Jaime_Levy | 19 |
| Nancy Hafkin | 1990 | Networking pioneer | Advanced networking and email connectivity initiatives across multiple African countries. | https://en.wikipedia.org/wiki/Nancy_Hafkin | 87 |
| Hu Qiheng | 1994 | Computer scientist | Led deployment of the first TCP/IP connection establishing China's early Internet link. | https://en.wikipedia.org/wiki/Hu_Qiheng | 86 |
| Lucy Sanders | 2004 | CEO | Founded the National Center for Women & Information Technology. | https://en.wikipedia.org/wiki/Lucy_Sanders | 19 |
| Mary Lou Jepsen | 2005 | Technical executive, inventor | Inventor in display and imaging hardware and co-founder of One Laptop per Child. | https://en.wikipedia.org/wiki/Mary_Lou_Jepsen | 49 |
| Coraline Ada Ehmke | 2014 | Software developer, open source advocate | Authored the Contributor Covenant to encourage inclusive open-source communities. | https://en.wikipedia.org/wiki/Coraline_Ada_Ehmke | 29 |

### Asset-to-content mapping

| Asset path | Usage |
| --- | --- |
| `/fonts/opensans-400.woff2` | Body and secondary text, fallback sans-serif |
| `/fonts/opensans-400i.woff2` | Italic field labels and emphasis, fallback sans-serif |
| `/fonts/opensans-700.woff2` | Title, orb name, year label, strong headings, fallback sans-serif |
| `/images/bg-pattern.png` | Low-opacity pattern overlay covering intro, decorative, fallback solid navy if missing |
| `/videos/fancy_reduced.mp4` | First intro background video, full-cover, behind opening editorial |
| `/videos/timelapse_reduced.mp4` | Second intro background video, full-cover, behind second editorial block |

## 6. Product Surfaces

Build phasing by dependency:

- **Phase 1 — Structure:** Global shell with language, font loading, long scroll runway, fixed layer stack (intro, canvas, overlay, closing, progress), intro text blocks with title/subtitle/paragraphs, semantic headings, canvas placeholder, story card shell, closing panel with video placeholder.
- **Phase 2 — Styling:** Color tokens, typography scale, four-stop sky gradient, `#213344` flat-shaded terrain, `480` star discs, orb color endpoint range with screen blending, exact glow layers, `20px` pill radius, pattern overlay at opacity `0.3`, video cover centering, and responsive max-widths.
- **Phase 3 — Interactivity:** Native scroll progress mapping, intro crossfade timeline, visualization progress scrub, camera timeline per orb (move plus hold plus final pullback), orb focus detection with debounce, story visibility window, progress indicator updates, link interactions, resize handling.
- **Phase 4 — Polish:** Gentle entrance drift and fade for story, soft looping cue motion, idle bob and internal drift for orbs, distance fade for far orbs, smooth scrolling, blurred progress pill, reduced-motion handling, fallback for missing media.

Flow presents Intro → Visualization → Story/Progress → Closing → Global Shell foundation, following user journey while respecting phasing above.

### Home Page — Route `/`

- Purpose:
  - Provide the entire journey in one scrollable page.
  - Guide visitors from editorial introduction into immersive visualization and onward to conclusion.

#### Intro Narrative Region (first `10` viewport heights of scroll)

- Content:
  - Heading with original product title (for example "Lumen Field").
  - Subtitle explaining curatorial intent, for example noting that stories shape belonging and this field surfaces pioneers whose work is often under-told.
  - Exactly three short paragraphs of newly authored editorial copy: one on how computing histories have overlooked women's contributions, one on how arranging figures by year and relative prominence creates a navigable field, and one on physical illumination installations reinterpreted digitally.
  - Scroll cue character (downward chevron) suggesting continuation.
- Structure, components, and assets:
  - Full viewport fixed layer covering screen at topmost intro depth.
  - Inside, video backgrounds layer holding two videos: `/videos/fancy_reduced.mp4` and `/videos/timelapse_reduced.mp4` each full-cover, centered, non-interactive, with opacity crossfade driven by scroll.
  - Pattern overlay `/images/bg-pattern.png` at opacity `0.3` over videos.
  - Text block `max-width: 600px`, centered at `top: 40vh` and `left: 50vw` on desktop with line-height `2`, at stack depth `10`, interactive so links remain clickable while videos remain behind.
  - Second text block same dimensions but staggered timing.
  - Scroll cue is full-width and centered; bottom offsets follow the Responsive system and motion is defined above.
- Behavior / states:
  - On page entry, view starts at top, intro fully opaque.
  - Scroll maps the first `10` viewport heights to normalized intro time `0–3`:
    - First text: fades linearly from opacity `1–0` over time `0–0.9`.
    - First video: fades `1–0` over `1.0–1.4`.
    - Second text and video: fade `0–1` over `0.8–1.3`, hold at `1` through `2.2`, then fade `1–0` over `2.2–2.9`.
  - The cue holds opacity `1` through intro time `2.2`, then fades linearly to `0` over `2.2–2.9`.
  - The entire intro layer holds opacity `1` through time `2.2`, then fades linearly to `0` over `2.2–3.0`.
  - Visualization rendering becomes visible after `82%` of the intro distance, exactly `8.2` viewport heights from the top.
  - When text blocks are transparent, their links become non-interactive.
- Responsive behavior:
  - Intro block, body text, and scroll cue follow the Responsive system values for desktop, tablet, and mobile rather than redefining them here.
- Accessibility notes:
  - Heading hierarchy starts with `h1`.
  - Videos marked as decorative via pointer-events none and muted autoplay; no information conveyed only by video.
  - Text remains selectable and reachable via keyboard.

#### Orb Field Visualization Region

- Content:
  - No textual content itself — presents environment.
  - Visual elements: the four-stop sky gradient, flat-shaded terrain plane, exactly `480` star discs, and `18` orb billboards each grouping `4` to `7` warm golden circles.
- Structure, components, and assets:
  - Fixed canvas filling viewport anchored to cover screen behind narrative.
  - Sky rendered as inner gradient sphere.
  - Terrain uses `#213344`, flat shading, roughness `1`, double-sided rendering, and a rotation of `-π/2` around the x-axis; it is translated `-3` on local z to sit below eye height.
  - Stars use base radius `0.075`, `20` segments, color `#fffef5`, and deterministic scales in `[0, 1)`.
  - Orb depth maps years `1944–2014` to `0` through `-27`; height maps backlink prominence `16–1257` to `-1` through `2`. A deterministic collision layout keeps horizontal centers at least `2.5` scene units apart before the documented offsets are applied.
  - Each orb's inner circles use screen blending with radius multipliers `1`, `0.75`, and `0.5` and corresponding alphas `0.05`, `0.1`, and `0.85`.
- Behavior / states:
  - When intro active, canvas sits behind intro and is already rendering but visually obscured.
  - When intro fades, the canvas becomes dominant with a wide overview. No orb is focused for the first `1%` of visualization progress, and the first story remains hidden until local timeline time `0.5`.
  - Normalized visualization progress scrubs a `38`-unit camera timeline: `18` orb segments of `2` units each followed by a `2`-unit final pullback. Each orb segment allocates `1` unit to movement and `1` unit to holding.
  - Camera starts from an elevated front position. Each orb target is positioned slightly forward of its depth at its height and centered horizontally, using quadratic ease-out. Final target is a wide elevated view beyond the maximum layout depth.
  - Orb planes remain fixed; internal circles drift continuously at `0.6` phase units per second when reduced motion is not requested.
  - Orb scale is `1` through camera distance `15`, decreases linearly from `1–0` between distances `15–37.5`, and remains `0` beyond `37.5`.
  - Rendering runs on animation frame at display rate. Orb textures update when distance is below `25`, the orb is focused, or the experience is in the focus-free establishing state.
  - On resize, camera aspect and renderer size adjust to fill viewport.
- Responsive behavior:
  - Canvas always full viewport on both desktop and mobile.
  - No reduction in orb count on mobile, but visual density reduced by distance fading and clustering.
- Accessibility notes:
  - Canvas has `role="img"` and descriptive aria label.
  - No interaction trapped in canvas; scroll remains primary control.
  - Reduced motion keeps idle motion subtle without aggressive translation.

#### Story Overlay and Progress Region

- Content:
  - When active, shows year label, name, fields in italic, short contribution summary, and a reference link.
  - Progress pill showing current position like "5 of 18".
- Structure, components, and assets:
  - Overlay container fixed, occupies at least full viewport height, mid depth, non-interactive by default, opacity driven by scroll timeline.
  - Story card inside, fixed at `top: 50%` and `left: 50%`, `max-width: 340px`, `24px` padding, centered text, and dark `#0b1e38` text with the exact two-layer shadow defined above; it is interactive only when visible.
  - Entrance moves from `translate(-50%, -45%)` and opacity `0` to `translate(-50%, -50%)` and opacity `1` over `0.9s ease-out`, restarting on each new figure.
  - Progress pill is fixed `24px` from the bottom center with `6px 14px` padding, `20px` radius, `8px` blur, and no pointer interaction.
- Behavior / states:
  - Within each `2`-unit orb segment, story opacity follows these phases:
    - `0` through local time `0.5`.
    - Fades linearly `0–1` over `0.5–0.7`.
    - Holds at `1` over `0.7–1.7`.
    - Fades linearly `1–0` over `1.7–1.9`.
    - Remains `0` through `2.0`.
  - When hidden, overlay prevents invisible links from capturing clicks.
  - Progress appears only when visualization is active and a figure is currently focused.
  - Card is keyed by current figure so entrance restarts on each change.
  - Link opens external reference in new tab.
  - The canvas focus index uses an exact `200ms` delay to prevent highlight flicker during quick scrolling; story index and opacity remain directly tied to the scrubbed timeline.
- Responsive behavior:
  - Story card sizing and typography follow the Responsive system and typography scale defined in the global design system.
- Accessibility notes:
  - Year shown with strong emphasis, name as prominent heading.
  - Progress pill uses polite live region for announcements.

#### Closing Region

- Content:
  - Privacy-enhanced documentary video embed (privacy-enhanced YouTube domain) with fallback link text if embed is blocked.
  - Heading inviting further reading about computing history.
  - Exactly three generic further-reading links to public archival resources or encyclopedia portals about women in computing, opened in new tabs, described with original link text, for example "Explore the broader history of women in computing".
  - Original footer line authored for this archive, for example "Built with care for open histories."
- Structure, components, and assets:
  - Fixed center panel at `top: 50vh`, `left: 50vw`, and stack depth `20`, translated `-50%` on both axes. Desktop width is `min(854px, calc(100vw - 40px))`; pointer events are enabled only when visible.
  - Inner paragraphs include embed and credit links stacked.
  - Credits section with top margin, footer with smaller italic sizing.
- Behavior / states:
  - Hidden during intro and main visualization.
  - Becomes visible at camera time `36.5` and fades linearly from opacity `0–1` over exactly `0.5` timeline units, reaching full opacity at `37.0`.
  - When hidden, uses hidden visibility to prevent invisible iframe capturing interaction.
  - When visible, iframe plays independently.
- Responsive behavior:
  - Outro embed sizing follows the Responsive system and retains aspect ratio `854 / 480`.
- Accessibility notes:
  - Iframe has descriptive title, allows fullscreen, and is sandboxed with only permissions required for playback.
  - Links have discernible text and open in new tab.
  - Closing region remains keyboard reachable when visible.

### Global Shell — Shared Foundation

- Purpose:
  - Provide page structure, fonts, long scroll runway, and reset styles shared by all regions.
- Content:
  - Document language `en`.
  - Body background deep navy and warm off-white text.
- Structure, components, and assets:
  - Root element min-height `100vh`.
  - Body font `Open Sans` with fallbacks, self-hosted woff2 files from `/fonts/`.
  - Global reset with margin zero, padding zero, box-sizing border-box.
  - Link base style solid underline, hover dashed.
  - No header or footer navigation; footer only appears as part of closing content.
- Behavior / states:
  - On entry, view starts at top of the page.
  - Scroll interaction remains smooth and responsive across desktop and mobile.
- Responsive behavior:
  - Body height switches at small breakpoint as described.
  - Prevents horizontal overflow.
- Accessibility notes:
  - Document language declared.
  - Focus remains visible via link underline styles.
  - No horizontal scroll traps.

## 7. Acceptance Criteria

### Intro Narrative
- Title appears as primary heading at top of initial view with original wording.
- Subtitle and exactly three editorial paragraphs display with newly authored copy describing purpose and organization of the field.
- Two videos and pattern overlay cover background, auto-play muted and loop, with visible crossfade as visitor scrolls through opening viewports.
- Pattern overlay covers the intro over both videos.
- Downward cue is centered, animates with gentle looping vertical motion, and fades as intro concludes.

### Visualization Journey
- Full-viewport canvas shows sky gradient, star field, and flat-shaded terrain occupying lower portion of view.
- Orbs rendered as billboards with warm overlapping circles using screen blending and gentle drift, each grouping multiple circles.
- Wide landing view shows all orbs small and clustered center with no focused orb during initial establishing view and no story until dwell begins.
- Scrolling advances the camera through orbs in chronological order with distinct travel and hold phases per orb and a final pullback to wide view.
- Internal circle motion continues gently while orb planes remain fixed in layout.

### Story Overlay and Progress
- When camera settles at an orb, centered card appears with year, name, field, short contribution, and reference link to correct public URL per inventory.
- Card entrance animates with soft upward drift and fade, restarts on each figure change, and syncs to camera dwell window without flicker.
- Progress pill at bottom center shows current position like "1 of 18" through "18 of 18", with blurred dark background, and updates only when a story is active.
- Quick scrolling does not cause flicker; text syncs to camera dwell.

### Closing
- After the last orb, camera pulls back to wide elevated view and closing panel fades in.
- Privacy-enhanced documentary embed is visible and playable with fallback link if blocked.
- Exactly three generic further-reading links plus original footer line appear with newly authored link text.
- Hidden closing does not block clicks when invisible.

### Responsive and Accessibility
- At large width body provides long scroll with no horizontal overflow; at tablet width intro block uses fluid width and scales; at narrow width intro and story adapt with gutters and scaled embed.
- Keyboard scroll moves through entire experience; Tab reaches intro links (if any), story reference links, and closing links with visible focus.
- Canvas has role img and descriptive aria label covering purpose and scroll instruction.
- Progress indicator uses polite live region.
- When reduced motion preferred, looping cue and story drift animations are disabled.

### Assets and Content Completeness
- All `18` figures from inventory present with names, years, fields, and original short contributions.
- Self-hosted fonts from `/fonts/` in use, no external font requests.
- Public assets `/images/bg-pattern.png`, `/videos/fancy_reduced.mp4`, `/videos/timelapse_reduced.mp4` appear in intro as specified, with solid color fallbacks.
- Page background deep navy and warm off-white text used globally.
