# Lumen Field — An Immersive Archive of Women in Computing — Product Requirements Document

## 1. Product Overview

Lumen Field is an original, single-page scrollytelling archive honoring women whose work shaped computing. Visitors move through a prolonged vertical scroll that begins with an atmospheric editorial introduction and then opens into a night landscape — a deep cool sky with sparse stars above low, faceted terrain — populated by warm, glowing orbs. Each orb represents one individual.

The core interaction is scroll-driven camera travel. As the visitor scrolls, the viewpoint glides through the field from one orb to the next, pausing briefly at each. During the pause, a centered story card presents her year of impact, name, field, a concise one-line contribution, and an external reference link. A discreet progress indicator shows position within the sequence, and the experience concludes with a wider pullback and a closing panel offering a short documentary embed and further reading.

The tone is editorial, calm, and cinematic. The product prioritizes continuity of motion, legibility of text, and a sense of scale created by a very tall scroll runway and clustering of distant lights.

This is an original concept inspired by physical data installations where illuminated volumes hold individual biographies, reinterpreted as a virtual night-field that anyone can traverse at their own pace. It is not a replica of an existing named site and does not reuse that site's editorial wording, personal bylines, or creator essays.

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
- **Intro flow:** Visitor lands at top, sees title, subtitle explaining the archive's purpose, and two to three short editorial paragraphs describing why the collection exists and how orbs encode time and prominence. A soft looping downward cue near the bottom encourages scrolling. Two slow atmospheric video layers crossfade behind the text as the visitor moves through the first portion of the scroll.
- **Visualization journey:** After the introduction, the full landscape appears — sky, stars, terrain, and clustered golden orbs in the distance. Continued scrolling moves the camera deeper into the field, approaching each orb in chronological order, holding briefly, then moving to the next. Text appears only when the camera has settled and fades out before travel resumes.
- **Story consumption:** At each orb, a fixed centered card shows year, name, field, short contribution, and a link to an encyclopedia entry. The card enters with a gentle upward drift and fade, then fades out as the visitor scrolls onward.
- **Completion flow:** After the final orb, the camera pulls back to a wide elevated view and a closing panel fades in with an embedded documentary video and links to further reading about computing history. A brief original footer line closes the page.

### Key qualities
- Calm, uninterrupted scroll control with no competing navigation.
- Sense of scale created by a very tall scroll runway.
- Warm glowing presence for each individual against a cool dark environment.
- Original editorial voice throughout — no verbatim copy from any prior tribute site.

## 3. Global Design System

### Typography
- **Family:** `Open Sans`, sans-serif, served from `/fonts/opensans-400.woff2`, `/fonts/opensans-400i.woff2`, `/fonts/opensans-700.woff2` with `font-display: swap` and generic sans-serif fallback.
- **Body:** `18px` / line-height `2`, weight `400`, antialiased. On small viewports scales to `14px`.
- **Title:** `2em`, weight `700`, centered.
- **Subtitle:** `0.95em`, centered, opacity moderated, margin below `2rem`.
- **Orb year label:** Approximately `0.9rem` to `1.25em`, weight `700`, with a subtle bottom border, displayed inline-block.
- **Orb name:** Approximately `1.5em` up to `clamp(1.5rem, 3.8vw, 2.3rem)` on larger screens, weight `700`, line-height `1.15`.
- **Orb fields:** Around `0.82rem` to `0.85rem`, italic, opacity `0.85` to `0.9`.
- **Orb summary:** Line-height `1.55` to `1.6`, max-width `~300px` to `~340px`, centered.
- **Progress pill:** Around `0.85rem`, letter-spacing `0.05em`, opacity `0.6`.
- Links use inherited color with a solid underline that becomes dashed on hover/focus.

### Color tokens
- `--color-bg`: `#192e4c` — deep navy page background and sky zenith.
- `--color-text`: `#fffef5` — warm off-white primary text.
- `--color-accent`: `#e8a838` — accent for interactive emphasis.
- `--color-dot`: `rgba(255,254,245,0.3)` — dim star treatment.
- `--color-highlight`: `#fffef5` — highlighted state.
- **Sky gradient:** Vertical gradient from `#192e4c` at zenith, through `#1e3558` around `40%`, `#2a446e` around `70%`, to `#345488` at horizon.
- **Terrain:** Base around `#213344` to `#2c445f`, muted dark slate blue with flat-shaded low-poly facets and a faint wireframe emphasis at low opacity using `#3a556f`.
- **Orb golden palette:** Warm overlapping circles using screen blending — core near `#ffe8a0` at higher opacity, inner mid near `#ffcc66`, mid near `#ffb84d`, outer near `#e6a040`, each with descending opacity to create layered glow. Shared orb plane size around `1.25`.
- **Stars:** Soft off-white small discs, opacity varied by scale.
- **Orb text legibility:** Dark text on a warm radial glow, optionally enhanced with a very soft luminous shadow to keep readability against dark sky without a hard rectangular backdrop.
- **Progress pill:** Background around `rgba(11,30,56,0.6)` with blur around `8px` and a faint border.

### Layout and spacing
- Single-column page with no header navigation.
- Scroll runway is intentionally very tall: approximately `50000px` on desktop and `25000px` on small viewports, creating a distinct intro span of several viewports plus a long visualization span.
- Fixed layers covering viewport: intro layer above canvas, story overlay mid depth, closing panel above that, progress indicator topmost, ensuring intro sits over canvas and progress remains visible.
- Content width: intro text block max `600px` centered (fluid on tablet/mobile); story card max-width `340px` centered; closing panel uses `min-content` width centered.
- Gutters: editorial paragraphs have comfortable bottom margin and generous line-height with justified or left-aligned text depending on breakpoint.
- Radii: progress pill rounded to pill shape, story card uses soft glow without hard corner clipping.

### Visual components (product/UI building blocks)
- **Intro text block:** Title, subtitle describing curatorial intent, and two to three short editorial paragraphs in original wording.
- **Video background pair:** Two full-cover looped atmospheric videos placed behind intro text, muted, autoplay, inline playback.
- **Pattern overlay:** Full-cover subtle pattern image at low opacity, non-interactive, to add texture.
- **Scroll cue:** Centered downward chevron character near bottom that animates with a gentle looping vertical motion.
- **Canvas landscape:** WebGL canvas fixed to viewport showing sky gradient, terrain plane, star field, and orb billboards.
- **Orb billboard:** Plane representing one figure, containing several overlapping warm circles that drift slowly within a constrained radius, using screen blending for glow.
- **Story card:** Fixed center card with year, name, field, summary, and reference link. Appears on arrival at an orb with a soft fade and upward drift.
- **Progress indicator:** Fixed bottom-center pill showing position like "5 of 18".
- **Closing panel:** Fixed center panel containing a documentary embed and further reading links.

### Motion language
- **Global:** Smooth scrolling enabled so programmatic scroll animates rather than jumps.
- **Video crossfade:** Opacity transition with a short ease (around a few hundred milliseconds) between atmospheric backgrounds driven by scroll timeline.
- **Story entrance:** Centered card enters from a slight vertical offset below its resting position with a fade from transparent to opaque, duration under one second with an ease-out curve, restarted each time the displayed figure changes.
- **Scroll cue motion:** Downward indicator moves vertically in a loop — from rest position upward slightly and back — with a slow ease-in-out over about one and a half seconds, infinitely, drawing attention to scroll.
- **Camera travel:** Scroll progress scrubs a paused timeline where each orb receives a move segment followed by a hold segment. Final pullback after last orb lasts longer. Travel eases smoothly toward target with subtle interpolation so motion feels continuous rather than stepped.
- **Orb idle motion:** Gentle floating — small vertical and horizontal bob at slow frequencies — creating calm breathing.
- **Circle drift inside orbs:** Each inner circle drifts independently within its orb using slow pseudo-noise and circular motion, creating organic blob movement.
- No motion description references concrete CSS keyframe identifiers; all motion is described by its perceived behavior and timing qualities.

### Responsive system
- **Breakpoint small:** `320px` to `480px` considered mobile.
- **Body height:** Switches from long desktop runway to shorter mobile runway to keep effort proportional.
- **Intro block:** On small screens, top shifts slightly lower, width becomes fluid with side gutters, and only vertical centering is applied.
- **Story card:** On small, max-width becomes viewport minus gutters, padding reduces, name and summary scale down modestly.
- **Scroll cue:** Lowered closer to bottom edge on small screens.
- **Outro embed:** Large dimensions on desktop, compact dimensions on small (for example around `340x240` on mobile vs larger on desktop).
- **Touch target:** No custom small targets; native scroll and standard link hit areas.

### Image / media treatment
- Video backgrounds fill viewport via minimum viewport width and height, centered, non-interactive.
- Pattern overlay covers entire intro with low opacity, preserving legibility of text over video.
- Canvas visuals are procedural — no baked hero images — except for pattern overlay and two intro videos from `/public`.
- Embedded video in closing panel is a standard privacy-enhanced embed.
- **Fallbacks:** If atmospheric videos fail to load or autoplay is blocked, intro shows solid deep navy background with pattern overlay retained and editorial text at full opacity so purpose remains readable. If pattern image fails, intro degrades to solid navy and videos alone. If body font fails, fallback sans-serif maintains line-height and readability. Closing video if blocked shows a text link fallback.

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
- Reduced motion: When user prefers reduced motion, the looping scroll cue motion and story entrance drift are disabled, and video crossfade opacity transitions are simplified. Canvas idle motion remains subtle without aggressive movement.
- Media: Intro videos are decorative backgrounds, muted without audio, looped, not requiring captions as they convey atmosphere, not information.
- Language: Document declares `<html lang="en">`.

## 5. Global Content and Data

### Brand and copy
- Product name for this iteration: `Lumen Field` (original name for this Web Craft submission; repository name retains historical identifier for hosting).
- Voice: Reflective, respectful, concise, original — no verbatim reuse of editorial copy from any existing tribute site.
- Intro copy is newly authored for this project, describing how computing histories often under-represent women's contributions and how a field of lights invites slow encounter.
- Footer closing is an original line such as "An original Web Craft archive — built with care for open histories." — not reproducing any prior site's Brooklyn byline.
- No real-person bylines linking to external portfolios are presented as product identity.

### Navigation and links
- No internal navigation aside from scroll.
- Story reference links point to public encyclopedia biographies for each figure, opened in a new tab.
- Closing panel provides one documentary video embed and two to three generic further-reading links to public resources about computing history (not personal design-essay URLs from another project's creators).

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
- **Phase 2 — Styling:** Color tokens, typography scale, sky gradient, terrain base and wireframe emphasis, star discs, orb golden palette with screen blending, glow treatments, radii, pattern overlay low opacity, video cover centering, responsive max-widths.
- **Phase 3 — Interactivity:** Native scroll progress mapping, intro crossfade timeline, visualization progress scrub, camera timeline per orb (move plus hold plus final pullback), orb focus detection with debounce, story visibility window, progress indicator updates, link interactions, resize handling.
- **Phase 4 — Polish:** Gentle entrance drift and fade for story, soft looping cue motion, idle bob and internal drift for orbs, distance fade for far orbs, smooth scrolling, blurred progress pill, reduced-motion handling, fallback for missing media.

Flow presents Intro → Visualization → Story/Progress → Closing → Global Shell foundation, following user journey while respecting phasing above.

### Home Page — Route `/`

- Purpose:
  - Provide the entire journey in one scrollable page.
  - Guide visitors from editorial introduction into immersive visualization and onward to conclusion.

#### Intro Narrative Region (first several viewports of scroll)

- Content:
  - Heading with original product title (for example "Lumen Field").
  - Subtitle explaining curatorial intent, for example noting that stories shape belonging and this field surfaces pioneers whose work is often under-told.
  - Two to three short paragraphs of newly authored editorial copy: one paragraph on how computing histories have often overlooked women's contributions, a second on how arranging figures by year and relative prominence creates a navigable field, and an optional third on the inspiration from physical illumination installations reinterpreted digitally.
  - Scroll cue character (downward chevron) suggesting continuation.
- Structure, components, and assets:
  - Full viewport fixed layer covering screen at topmost intro depth.
  - Inside, video backgrounds layer holding two videos: `/videos/fancy_reduced.mp4` and `/videos/timelapse_reduced.mp4` each full-cover, centered, non-interactive, with opacity crossfade driven by scroll.
  - Pattern overlay `/images/bg-pattern.png` at low opacity over videos.
  - Text block max around `600px` wide, centered at mid viewport, readable line-height, at higher depth than videos, interactive so links remain clickable while videos remain behind.
  - Second text block same dimensions but staggered timing.
  - Scroll cue full-width centered near bottom with gentle vertical looping motion.
- Behavior / states:
  - On page entry, view starts at top, intro fully opaque.
  - As visitor scrolls through intro span (several viewports), first text block fades out over early portion of timeline, first video fades out shortly after, second text and second video fade in in the middle portion, hold fully visible, then fade out toward the end of intro.
  - Cue stays visible through most of intro, then fades out as introduction ends.
  - Entire intro layer fades out to reveal visualization underneath without abrupt cut.
  - When scroll passes most of intro span (around four-fifths), intro becomes hidden and visualization is considered active.
  - When text blocks are transparent, their links become non-interactive.
- Responsive behavior:
  - At small widths, text block width becomes fluid with side gutters, anchored slightly lower, font size reduces, and only vertical centering applied.
  - Scroll cue moves closer to bottom edge on small screens.
- Accessibility notes:
  - Heading hierarchy starts with `h1`.
  - Videos marked as decorative via pointer-events none and muted autoplay; no information conveyed only by video.
  - Text remains selectable and reachable via keyboard.

#### Orb Field Visualization Region

- Content:
  - No textual content itself — presents environment.
  - Visual elements: sky gradient, terrain plane with subtle wireframe facet lines, several hundred star discs, and `18` orb billboards each grouping `4` to `7` warm golden circles.
- Structure, components, and assets:
  - Fixed canvas filling viewport anchored to cover screen behind narrative.
  - Sky rendered as inner gradient sphere.
  - Terrain as low-poly plane with randomized height and flat shading, rotated to appear horizontal, placed below eye height to push horizon toward bottom third.
  - Wireframe overlay same geometry as terrain, subtle line at low opacity.
  - Stars distributed with variation around center, random scale, for sparse night sky.
  - Orbs positioned according to year (depth) and prominence (height), clustered toward center so composition shows orbs centrally rather than spread edge to edge. Size range based on prominence metric, with scale animated on highlight.
  - Each orb's inner circles use screen blending with multiple alpha layers and radius scales for layered glow.
- Behavior / states:
  - When intro active, canvas sits behind intro and is already rendering but visually obscured.
  - When intro fades, canvas becomes dominant with wide overview showing all orbs small, no story card yet for brief opening portion of visualization scroll.
  - As visitor scrolls into visualization span, normalized progress scrubs a paused camera timeline. Each orb gets a segment: part to move to it, part to hold there. Final segment pulls camera back to wide, high view.
  - Camera moves smoothly with gentle interpolation toward target at each orb: near-eye position raised slightly above orb height, looking slightly down and beyond orb.
  - Orb idle animation: perpetual slow bob and horizontal drift while not highlighted; internal circles drift continuously.
  - Orb distance fade: orbs far from camera fade in opacity and scale down as distance grows, so only nearby orbs are prominent.
  - Rendering runs on animation frame at display rate, with only near or highlighted orb textures updated each frame to keep performance smooth.
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
  - Story card inside, fixed centered, max-width around `340px`, padded, centered text, dark text on luminous warm backing for legibility over dark sky, interactive when visible so reference link remains clickable.
  - Entrance motion described as gentle upward drift with fade, duration under one second, ease-out curve, restarted on each new figure.
  - Progress pill fixed bottom center, translucent dark with blur, rounded, non-interactive.
- Behavior / states:
  - Story appears only after camera has arrived at orb. Within each orb dwell segment, early portion hides text, middle portion fades in and holds fully visible, late portion fades out before travel resumes, ensuring text does not show during camera movement.
  - When hidden, overlay prevents invisible links from capturing clicks.
  - Progress appears only when visualization is active and a figure is currently focused.
  - Card is keyed by current figure so entrance restarts on each change.
  - Link opens external reference in new tab.
  - If visitor scrolls quickly, focused index updates with short debounce so camera target and text stay synchronized, avoiding flicker.
- Responsive behavior:
  - Small screens: max-width fluid with gutters, name and summary scale down slightly.
- Accessibility notes:
  - Year shown with strong emphasis, name as prominent heading.
  - Progress pill uses polite live region for announcements.

#### Closing Region

- Content:
  - Privacy-enhanced documentary video embed (privacy-enhanced YouTube domain) with fallback link text if embed is blocked.
  - Heading inviting further reading about computing history.
  - Two to three generic further-reading links to public archival resources or encyclopedia portals about women in computing, opened in new tabs, described with original link text (for example "Explore the broader history of women in computing" rather than creator personal essay titles).
  - Original footer line such as "An original Web Craft archive — built with care for open histories."
- Structure, components, and assets:
  - Fixed center panel centered via viewport translation, width around min-content, centered text, higher depth than canvas, pointer events enabled when visible.
  - Inner paragraphs include embed and credit links stacked.
  - Credits section with top margin, footer with smaller italic sizing.
- Behavior / states:
  - Hidden during intro and main visualization.
  - Becomes visible after camera timeline passes beyond last orb plus a short fade duration, opacity transitioning from hidden to visible.
  - When hidden, uses hidden visibility to prevent invisible iframe capturing interaction.
  - When visible, iframe plays independently.
- Responsive behavior:
  - Embed size larger on desktop and compact on small, determined by viewport width.
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
  - On entry, history scroll restoration set to manual and page scrolled to top.
  - Scroll listening uses passive listener for performance.
- Responsive behavior:
  - Body height switches at small breakpoint as described.
  - Prevents horizontal overflow.
- Accessibility notes:
  - Document language declared.
  - Focus remains visible via link underline styles.
  - No horizontal scroll traps.

## 7. Acceptance Criteria

### Intro Narrative
- Title appears as primary heading at top of initial view with original wording (not reproducing another site's exact phrase beyond generic concept).
- Subtitle and two to three editorial paragraphs display with newly authored copy describing purpose and organization of the field.
- Two videos and pattern overlay cover background, auto-play muted and loop, with visible crossfade as visitor scrolls through opening viewports.
- Pattern overlay shows at low opacity over videos.
- Downward cue is centered at bottom, moves with soft vertical looping motion, and fades out as introduction ends.

### Visualization Journey
- Full-viewport canvas shows dark sky gradient, several hundred small star discs, and low rolling terrain with subtle wireframe emphasis occupying bottom third.
- Eighteen orbs rendered as billboards with `4` to `7` warm golden overlapping circles each using screen blending and gentle drift.
- Wide landing view shows all orbs small and clustered center with no story card for brief opening of visualization scroll.
- Scrolling advances camera smoothly through orbs in chronological order; each orb dwell includes move plus hold, final pullback smooth.
- Orb idle floating and internal circle drift are visible and continuous.

### Story Overlay and Progress
- When camera settles at an orb, centered card appears with year bold bordered, name prominent, fields italic, short contribution, and reference link to correct public URL per inventory.
- Card entrance uses a gentle upward drift combined with fade over under one second with ease-out, restarts on each figure change, and fades out before camera leaves.
- Progress pill at bottom center shows current position like "1 of 18" through "18 of 18", with blurred dark background, and updates only when a story is active.
- Quick scrolling does not cause flicker; text syncs to camera dwell window.

### Closing
- After last orb, camera pulls back to wide view and closing panel fades in over a short timeline.
- Privacy-enhanced documentary embed is visible and playable with fallback link if blocked.
- Two to three generic further-reading links plus original footer line appear, not reproducing personal essay titles or portfolio URLs from another product.
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
