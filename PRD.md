# One Amongst Many — Product Requirements Document

## 1. Product Overview

One Amongst Many is a scroll-driven tribute to women in computing. It presents a single, meditative page where a visitor scrolls through a vast vertical journey. The journey begins with an introductory narrative set against atmospheric video backgrounds, then opens into a night landscape — a dark sky with sparse stars above low rolling hills — populated by warm golden glowing orbs. Each orb represents one woman.

The core experience is camera travel. As the visitor scrolls, the viewpoint glides smoothly through the landscape from orb to orb, slowing to dwell at each woman. During that dwell, a centered story card appears with her biography, achievements, and a link to learn more. A subtle progress indicator shows position within the sequence, and the experience ends with a wider pullback and an outro offering video and further reading.

The tone is editorial, intimate, and atmospheric. The product balances cinematic motion with legibility, letting scroll control pacing while keeping text readable and navigation effortless.

## 2. Audience and Core Experience

### Audience
- General public curious about computing history and representation.
- Students, educators, and advocates seeking accessible stories of women in technology.
- Visitors who enjoy scrollytelling, data-visualization, and immersive narrative.

### Core user goals
- Understand why this collection exists and how it is organized.
- Encounter each woman sequentially through smooth camera movement.
- Read a concise story at each stop and optionally follow a link to learn more.
- See overall progress and reach a satisfying conclusion with additional resources.

### Core flows
- **Intro flow:** Visitor lands at top, sees title, byline, and introduction describing the project's purpose. Scrolling advances a crossfade from the first atmospheric background to a second background and legend text explaining that each orb is sized by renown and positioned by year. A bouncing cue at the bottom encourages scrolling.
- **Visualization journey:** After the introduction, the full landscape appears — stars, sky gradient, and terrain — with clustered golden orbs in the distance. Continued scrolling moves the camera deeper into the field, approaching each orb in order, holding briefly, then moving to the next. Text appears only when the camera is settled at an orb and fades out before travel resumes.
- **Story consumption:** At each orb, a fixed centered card shows year, name, field, short summary, and `read more →` link. The card animates in with a gentle upward slide and fade, then fades out as the visitor scrolls onward.
- **Completion flow:** After the final orb, the camera pulls back to a wide view and an outro fades in with an embedded video and links to deeper essays. Footer text reads `Made with love in Brooklyn, 2019.`

### Key qualities
- Calm, uninterrupted scroll control with no other navigation competing for attention.
- Sense of scale created by a very tall scroll runway.
- Warm, glowing presence for each individual against a cool, dark environment.

## 3. Global Design System

### Typography
- **Family:** `Open Sans`, sans-serif, served from `/fonts/opensans-400.woff2`, `/fonts/opensans-400i.woff2`, `/fonts/opensans-700.woff2` with `font-display: swap`.
- **Body:** `18px` / line-height `2`, weight `400`, antialiased. On small viewports, body scales to `14px`.
- **Title:** `2em`, weight `700`, centered, letter-spacing tight.
- **Byline:** `0.85em`, centered, margin below `2rem`.
- **Orb year label:** `1.25em`, weight `700`, bottom border `1px`, displayed inline-block.
- **Orb name:** `1.5em` up to `clamp(1.5rem, 3.8vw, 2.3rem)` on larger screens, weight `700`, line-height `1.15`.
- **Orb fields:** `0.85rem`, italic, opacity `0.9`.
- **Orb summary:** Line-height `1.6`, max-width `~320px`, centered.
- **Progress pill:** `0.85rem`, letter-spacing `0.05em`, opacity `0.6`.
- Links use inherited color with `1px solid` underline, hover switches to `1px dashed`.

### Color tokens
- `--color-bg`: `#192e4c` — deep navy page background, also sky zenith.
- `--color-text`: `#fffef5` — warm off-white primary text.
- `--color-accent`: `#e8a838` — accent.
- `--color-dot`: `rgba(255,254,245,0.3)` — dim star/dot treatment.
- `--color-highlight`: `#fffef5` — highlighted state.
- **Sky gradient:** Vertical gradient from `#192e4c` at top, through `#1e3558` at `40%`, `#2a446e` at `70%`, to `#345488` at horizon.
- **Terrain:** Base `#213344` muted dark slate blue with flat-shaded low-poly facets and subtle wireframe emphasis at `0.14` opacity `#3a556f`.
- **Orb golden palette:** Warm overlapping circles using screen blending — core `#ffe8a0` at `0.78` opacity, inner mid `#ffcc66` at `0.68`, mid `#ffb84d` at `0.58`, outer `#e6a040` at `0.48`. All within an orb plane size `1.25`.
- **Stars:** Soft white `#FFFEF5` small discs, opacity varied by scale.
- **Orb text glow:** Text shadow `0 0 12px rgba(255,254,245,0.6), 0 0 24px rgba(255,254,245,0.3)` to ensure legibility over dark sky without a solid backing.
- **Progress pill:** Background `rgba(11,30,56,0.6)` with blur `8px`, border `1px solid rgba(255,254,245,0.15)`.

### Layout and spacing
- Single-column page with no header navigation.
- Page scroll runway is very tall: approximately `50000px` on desktop and `25000px` on small viewports, creating distinct intro span of `10` viewports plus visualization span.
- Fixed layers covering viewport: intro layer at `z-index 5`, visualization canvas at `z-index 1`, story overlay at `z-index 10`, outro at `z-index 20`, progress at `z-index 30`.
- Content width: intro text block `600px` centered; story card max-width `340px` centered; outro uses `min-content` width centered.
- Gutters: intro paragraphs have `1.5rem` bottom margin, line-height `2` with justified alignment.
- Radii: progress pill `20px`, story card has no solid background but legacy circular treatment used `50%` radius when background present.

### Visual components (product/UI building blocks)
- **Intro text block:** Title, byline with author links, two to three paragraphs of editorial body.
- **Video background pair:** Two full-cover videos placed behind intro text, both `autoplay`, `muted`, `loop`, `playsInline`.
- **Pattern overlay:** Full-cover image `/images/bg-pattern.png` at `0.3` opacity, non-interactive.
- **Bounce cue:** Centered character `⌄` at bottom, animated with vertical bounce.
- **Canvas landscape:** WebGL canvas fixed to viewport showing sky gradient sphere, terrain plane, star field, and orb billboards.
- **Orb billboard:** Plane representing one woman, containing `4 to 7` overlapping warm circles that drift slowly within a constrained radius, with `screen` blending to create glowing effect.
- **Story card:** Fixed center card with year, name, field, summary, and `read more` link. Appears on entry to an orb, animates with `fadeSlideIn`.
- **Progress indicator:** Fixed bottom-center pill showing `1 of 18` style count.
- **Outro panel:** Fixed center panel containing YouTube iframe embed and credit links.

### Motion language
- **Global:** `html { scroll-behavior: smooth; }`
- **Video crossfade:** Opacity transition `0.3s ease`.
- **Story entrance:** Keyframes `fadeSlideIn` from `opacity 0` and `translate(-50%, -45%)` to `opacity 1` and `translate(-50%, -50%)`, duration `0.6s` to `0.9s`, timing `ease-out`, triggered anew each time the displayed woman changes.
- **Bounce cue:** Keyframes bounce `0%: translateY(0)`, `50%: translateY(-20px)`, `100%: translateY(0)`, duration `1.5s`, `ease-in-out`, infinite.
- **Camera travel:** Linear scrub of a timeline where each orb receives `2` units ( `1` move + `1` hold ). Final pullback after last orb lasts `2` units. Travel eases smoothly toward target with subtle lerp so motion feels continuous.
- **Orb floating:** Gentle idle bob — vertical `sin` at `0.35` amplitude, horizontal `sin` at `0.22` amplitude, slow frequencies.
- **Circle drift:** Each of the inner circles drifts independently within its orb using slow pseudo-noise and circular motion, creating organic blob movement.

### Responsive system
- **Breakpoint small:** `320px` to `480px` considered mobile.
- **Body height:** Switches from long desktop runway to shorter mobile runway to keep effort proportional.
- **Intro block:** On small screens, top moves from `40vh` to `45vh`, left anchored `0`, width becomes `calc(100% - 40px)` with `20px` padding, transform only `translateY(-50%)`.
- **Story card:** On small, max-width `calc(100% - 40px)`, padding reduces to `20px`, name scales to `1.75rem`, summary to `0.85rem`.
- **Arrow cue:** On small, bottom moves from `80px` to `10px`.
- **Outro iframe:** Desktop `854px` by `480px`, small `340px` by `240px`.
- **Touch target:** No small custom targets; native scroll and standard link hit areas.

### Image / media treatment
- Video backgrounds fill viewport via minimum `100vw` width and `100vh` height, centered with `translate(-50%, -50%)`, non-interactive.
- Pattern overlay covers entire intro with low opacity, preserving legibility of text over video.
- Canvas visuals are procedural — no baked hero images — except for pattern overlay and video backgrounds from `/public`.
- Embedded video in outro is standard YouTube embed.

## 4. Global Accessibility Requirements

- Keyboard reachability: All content reachable by native scroll using arrow keys, Page Up/Down, Home/End, and Tab to reach byline links, story `read more` links, and outro credit links. No keyboard traps.
- Visible focus: Link focus indicated by persistent underline and hover/focus change from solid to dashed border.
- Heading structure: Document starts with `One Amongst Many` as `h1`. Story card provides woman name as the next heading level in reading order. Outro credits include strong heading `Read more about One Amongst Many here:`.
- Landmarks: Intro region, main visualization described as image, outro region.
- Accessible names:
  - Canvas has `role="img"` and aria label `3D visualization of women in computing, showing glowing orbs representing individuals arranged in a landscape. Scroll to explore each woman's story.`
  - Progress indicator has `aria-live="polite"` and reads like `3 of 18`.
  - Story links have discernible text `read more` plus arrow indicating external.
- Alt text: Meaningful imagery handled via canvas aria label and story text. Decorative pattern overlay at `0.3` opacity treated as decorative and non-interactive.
- Contrast: Text `#fffef5` on background `#192e4c` exceeds WCAG AAA. Story text `#0b1e38` with light glow text-shadow maintains readability against dark sky; orb text uses dark color with luminous shadow rather than relying on low contrast alone.
- Reduced motion: When user prefers reduced motion, the bounce cue animation and story entrance animation are disabled, and video and overlay opacity transitions are removed. Canvas starfield and orb drift remain subtle but without aggressive motion.
- Media: Videos are decorative backgrounds, muted and without audio, looped, not requiring captions as they convey atmosphere, not information.
- Language: Document declares `<html lang="en">`.

## 5. Global Content and Data

### Brand and copy
- Product name spelled `One Amongst Many`.
- Voice: Reflective, respectful, concise.
- Footer closing: `Made with love in Brooklyn, 2019.`

### Intro copy (exact)
- **Title:** `One Amongst Many`
- **Byline:** `by Christina Dacanay, Tina Rungsawang, and Shirley Wu` — where `Christina Dacanay` links to `http://cdacanay.com/`, `Tina Rungsawang` to `https://tina.pizza/`, `Shirley Wu` to `http://sxywu.com/`.
- **First paragraph:** `Young women entering fields dominated by men often feel like there is no history of people like them in their field. We know now that this is an issue of storytelling, not of history. Women have been contributing to every field, however invisibly, since the beginning of time.`
- **Second paragraph:** `One Amongst Many attempts to illuminate the histories of women in computing that have been diminished or erased. It is a data installation where each woman is arranged in a field by the year of her greatest achievement, and the height of the orb correlated to her renown. Every orb starts dimmed, and gets brighter each time another person reads about them, literally shedding light on the woman's accomplishments.`
- **Second screen legend paragraph:** `One Amongst Many is a physical data visualization created at New York University's ITP Master's program. The original installation consisted of 16-20 illuminated orbs suspended from the ceiling, each with a woman's biography inside. This website is a digital analog to the installation, so that people around the world can learn about these incredible women in computing.`
- **Scroll cue:** `⌄`

### Navigation and links
- Intro byline links are all external with new tab behavior.
- No internal navigation aside from scroll.

### Data structure
- Collection contains `18` women. Each record includes:
  - `name` — full name
  - `year` — year of notable achievement (e.g., `1944`, `1985`)
  - `fields` — role / discipline text
  - `shortSummary` — one concise sentence, used in centered card
  - `summary` — longer description (used as source for short summary; card shows short version)
  - `url` — Wikipedia or authoritative biography link
  - `backlinks` — number representing renown, influences circle count and visual prominence
  - `birthYear` — birth year or empty when unknown
  - `references` — number influencing circle count inside orb (range `4` to `7`)

### Complete women inventory

| Name | Year | Fields | Short summary | Url | Backlinks |
| --- | --- | --- | --- | --- | --- |
| Adele Goldstine | 1944 | Mathmatician, computer programmer | Wrote the manual for the first electronic digital computer, ENIAC. | https://en.wikipedia.org/wiki/Adele_Goldstine | 246 |
| Barbara Paulson | 1948 | Human computer | One of the first women scientists at NASA's JPL, calculated rocket trajectories by hand. | https://en.wikipedia.org/wiki/Barbara_Paulson | 17 |
| Kathleen Booth | 1949 | Computer scientist | Invented the first assembly language. | https://en.wikipedia.org/wiki/Kathleen_Booth | 39 |
| Grace Hopper | 1949 | Computer scientist, United States Navy rear admiral | First person to design a compiler for a programming language. | https://en.wikipedia.org/wiki/Grace_Hopper | 1257 |
| Katherine Johnson | 1958 | Mathematician | Calculated trajectories, launch windows and emergency return paths critical to the success of the first and subsequent U.S. crewed spaceflights. | https://en.wikipedia.org/wiki/Katherine_Johnson | 484 |
| Margaret Hamilton | 1965 | Computer scientist, systems engineer, business owner | Programmed the onboard flight software for NASA's Apollo Moon mission computers. | https://en.wikipedia.org/wiki/Margaret_Hamilton_(software_engineer) | 104 |
| Erna Schneider Hoover | 1971 | Mathematician | Invented a computerized telephone switching method that replaced switchboards and "revolutionized modern communication". | https://en.wikipedia.org/wiki/Erna_Schneider_Hoover | 1145 |
| Jude Milhon | 1973 | Hacker, author | Coined the term cypherpunk and maintained Community Memory, the first public computerized bulletin board system. | https://en.wikipedia.org/wiki/Jude_Milhon | 28 |
| Carol Shaw | 1980 | Video game designer and programmer | Considered to the first modern female games designer, released a 3D version of tic-tac-toe for the Atari 2600. | https://en.wikipedia.org/wiki/Carol_Shaw | 16 |
| Roberta Williams | 1980 | Video game designer, writer, co-founder | Pioneered the graphic adventure game format in Mystery House and the King's Quest series. | https://en.wikipedia.org/wiki/Roberta_Williams | 194 |
| Susan Kare | 1984 | Artist, graphic designer | Designed the original icons for the Macintosh, including the moving watch, paintbrush and trash can. | https://en.wikipedia.org/wiki/Susan_Kare | 153 |
| Radia Perlman | 1985 | Computer programmer, network engineer | Came up with a way to route information packets in an "infinitely scalable" way that allowed large networks like the Internet to function. | https://en.wikipedia.org/wiki/Radia_Perlman | 1242 |
| Jaime Levy | 1990 | Author, lecturer, interace designer, user experience strategist | Created one of the first e-Zines, CyberRag, which included articles, games and animations loaded onto diskettes. | https://en.wikipedia.org/wiki/Jaime_Levy | 19 |
| Nancy Hafkin | 1990 | Networking pioneer | Worked on networking and enabling email connections in 10 African countries. | https://en.wikipedia.org/wiki/Nancy_Hafkin | 87 |
| Hu Qiheng | 1994 | Computer scientist | Leader of the team who installed the first TCP/IP connection for China | https://en.wikipedia.org/wiki/Hu_Qiheng | 86 |
| Lucy Sanders | 2004 | CEO | Founded the National Center for Women & Information Technology to address the gender gap in computing. | https://en.wikipedia.org/wiki/Lucy_Sanders | 19 |
| Mary Lou Jepsen | 2005 | Technical executive, inventor | Prolific inventor in the fields of display, imaging, and computer hardware, and the co-founder and CTO of One Laptop Per Child | https://en.wikipedia.org/wiki/Mary_Lou_Jepsen | 49 |
| Coraline Ada Ehmke | 2014 | Software developer, open source advocate | Drafted the Contributor Covenant to bring inclusion to the world of open source project development. | https://en.wikipedia.org/wiki/Coraline_Ada_Ehmke | 29 |

### Asset-to-content mapping

| Asset path | Usage |
| --- | --- |
| `/fonts/opensans-400.woff2` | Body and secondary text |
| `/fonts/opensans-400i.woff2` | Italic field labels and byline emphasis |
| `/fonts/opensans-700.woff2` | Title, orb name, year label, strong headings |
| `/images/bg-pattern.png` | Low-opacity pattern overlay covering entire intro, decorative |
| `/videos/fancy_reduced.mp4` | First intro background video, full-cover, behind first screen text |
| `/videos/timelapse_reduced.mp4` | Second intro background video, full-cover, behind second screen legend text |

### Outro content

| Label | Url or copy |
| --- | --- |
| Embedded video | `https://www.youtube.com/embed/bEM0CRdCrQo` |
| Heading | `Read more about One Amongst Many here:` |
| Christina's essay | `http://www.cdacanay.com/itp-blog/2019/12/23/one-amongst-many-connecting-womxn-in-computing` — linked as `Christina's design-centric recounting` |
| Tina's story | `https://tina.pizza/one-amongst-many` — linked as `Tina's physical computing story` |
| Shirley's write-up | `http://www.datasketch.es/june/` — linked as `Shirley's data visualization write-up` |
| Footer | `Made with love in Brooklyn, 2019.` |

## 6. Product Surfaces

### Home Page — Route `/`

- Purpose:
  - Provide the entire journey in one scrollable page.
  - Guide visitors from editorial introduction into immersive visualization and onward to conclusion.

#### Intro Narrative Region (first 10 viewports of scroll)

- Content:
  - Heading `One Amongst Many`
  - Byline with three author links as listed in Global Content
  - Two editorial paragraphs about history and project purpose
  - Second-screen paragraph explaining physical installation context
  - Scroll cue `⌄`
- Structure, components, and assets:
  - Full viewport fixed layer covering screen with `z-index 5`.
  - Inside, video backgrounds layer holding two videos: `/videos/fancy_reduced.mp4` and `/videos/timelapse_reduced.mp4` each full-cover, centered, non-interactive, with opacity crossfade driven by scroll.
  - Pattern overlay `/images/bg-pattern.png` at `0.3` opacity over videos.
  - Text block `600px` wide, centered at `40vh` / `50vw` with `translate(-50%, -50%)`, justified alignment, `z-index 10`, pointer events enabled so links are clickable while videos remain behind.
  - Second text block same dimensions but separate timing.
  - Bounce cue full-width centered at `bottom 80px`, `3em` size.
- Behavior / states:
  - On page entry, view starts at top, intro fully opaque.
  - As visitor scrolls down through intro span (first `10` viewports), first text block fades out over early portion of timeline, first video fades out shortly after, second text and second video fade in between `0.8` and `1.3` of a `0`-to-`3` timeline, hold fully visible `1.3` to `2.2`, then fade out `2.2` to `2.9`.
  - Arrow cue stays visible through first and second screens, then fades out `2.2` to `2.9`.
  - Entire intro layer fades out over `2.2` to `3` to reveal visualization underneath without abrupt cut.
  - When scroll passes `82%` of intro span, intro becomes hidden and visualization is considered active.
  - When text blocks are transparent, their links become non-interactive due to invisibility.
- Responsive behavior:
  - At `320px` to `480px`, text block width becomes `calc(100% - 40px)` with `20px` padding, anchored at `top 45vh` left `0` with only vertical centering, font size `14px`.
  - Bounce cue bottom `10px` on small screens.
- Accessibility notes:
  - Heading hierarchy starts with `h1`.
  - Byline links have discernible text and open in new tab.
  - Videos marked as decorative via pointer-events none and muted autoplay; no information conveyed only by video.

#### Orb Field Visualization Region

- Content:
  - No textual content itself — presents environment.
  - Visual elements: sky gradient, terrain plane with subtle wireframe facet lines, `480` star discs, `18` orb billboards each grouping `4` to `7` warm golden circles.
- Structure, components, and assets:
  - Fixed canvas filling viewport `100vw` by `100vh` anchored at `inset 0`, `z-index 1`.
  - Sky rendered as inner sphere with vertical gradient canvas `2px` by `512px` mapped around scene.
  - Terrain as low-poly plane with randomized height and flat shading, rotated to appear horizontal, placed below eye height to push horizon low (~bottom third).
  - Wireframe overlay same geometry as terrain, line material `#3a556f` at `0.14` opacity.
  - Stars distributed using Gaussian around center, random scale, for sparse night sky.
  - Orbs positioned according to year (depth) and renown (height), clustered tightly toward center via gathering transform so screenshot-like composition shows orbs centrally rather than spread edge to edge. Orb size range `0.4` to `1.0` based on backlink count, but plane itself remains `1.25` base, with scale animated on highlight.
  - Each orb's inner circles use screen blending with alpha layers `0.05`, `0.1`, `0.85` and radius scales `1`, `0.75`, `0.5`.
- Behavior / states:
  - When intro active, canvas sits behind intro and is already rendering but visually obscured.
  - When intro fades, canvas becomes dominant with wide overview showing all orbs small, no story card yet for first `1%` of visualization scroll.
  - As visitor scrolls into visualization span (after `10` viewports), progress from `0` to `1` scrubs a paused camera timeline. Each orb gets a segment of `2` units: `1` to move to it, `1` to hold there. Final segment of `2` units pulls camera back to wide, high view.
  - Camera moves smoothly with gentle lerp toward target at each orb: near-eye position raised slightly above orb height, looking slightly down and beyond orb.
  - Orb idle animation: perpetual slow bob and horizontal drift while not highlighted; internal circles drift continuously via pseudo-noise.
  - Orb distance fade: orbs far from camera (more than `15` units) fade in opacity and scale down to `0` as distance grows, so only nearby orbs are prominent.
  - Rendering runs on `requestAnimationFrame` at display rate, with only near or highlighted orb textures updated each frame to keep performance smooth.
  - On resize, camera aspect and renderer size adjust to fill viewport.
- Responsive behavior:
  - Canvas always full viewport on both desktop and mobile.
  - No reduction in orb count on mobile, but visual density reduced by distance fading and clustering.
- Accessibility notes:
  - Canvas has `role="img"` and descriptive aria label as in Global requirements.
  - No interaction trapped in canvas; scroll remains primary control.
  - Reduced motion disables aggressive bounce and story entrance; canvas idle motion remains subtle.

#### Story Overlay and Progress Region

- Content:
  - When active, shows:
    - Year label e.g. `1984` in bold with bottom border
    - Name e.g. `Susan Kare`
    - Fields e.g. `Artist, graphic designer` in italic
    - Short summary sentence or two, e.g. `Designed the original icons for the Macintosh, including the moving watch, paintbrush and trash can.`
    - Link `read more →` to `url` from inventory
  - Progress pill e.g. `5 of 18`
- Structure, components, and assets:
  - Overlay container fixed, occupies `min-height 100vh`, `z-index 10`, pointer events none by default, opacity driven by timeline logic.
  - Story card inside, fixed at `50%` / `50%` with `translate(-50%, -50%)`, max-width `340px`, padding `24px`, centered text, text color `#0b1e38` with glow shadow, `z-index 20`, pointer events auto when visible so `read more` link is clickable.
  - Animation `fadeSlideIn` `0.9s ease-out` restarted on each new woman by key change.
  - Progress pill fixed bottom center `bottom 24px` `left 50%` `translateX(-50%)`, background `rgba(11,30,56,0.6)` blur `8px`, border `1px solid rgba(255,254,245,0.15)`, `z-index 30`, pointer events none.
- Behavior / states:
  - Story appears only after camera has arrived at orb. Logic: within each orb segment `2` units, local time `0` to `0.5` no text, `0.5` to `0.7` fade in, `0.7` to `1.7` hold at `1`, `1.7` to `1.9` fade out, after `1.9` hidden. This ensures text is not visible during camera travel.
  - When hidden, overlay uses `visibility: hidden` to prevent invisible links capturing clicks.
  - Progress appears only when visualization active and a story index is active (e.g., `showTextIndex >=0`), otherwise hidden.
  - Text card keyed by current woman index so entrance animation restarts on each change.
  - Link opens external biography in new tab.
  - If visitor scrolls quickly, story index debounces so that camera target and text stay synchronized, avoiding flicker.
- Responsive behavior:
  - Small screens: max-width `calc(100% - 40px)`, name `1.75rem`, summary `0.85rem`.
- Accessibility notes:
  - Year shown with strong emphasis, name as prominent heading.
  - Link text `read more` is followed by arrow and entire card context provides accessible name via surrounding name/year.
  - Progress pill has `aria-live="polite"` for announcements.

#### Outro Region

- Content:
  - YouTube iframe `https://www.youtube.com/embed/bEM0CRdCrQo`
  - Heading `Read more about One Amongst Many here:`
  - Three credit links as per Global Content
  - Footer `Made with love in Brooklyn, 2019.`
- Structure, components, and assets:
  - Fixed center panel at `top 50vh` `left 50vw` `translate(-50%, -50%)`, width `min-content`, centered text, `z-index 20`, color `#fffef5`, pointer events auto when visible.
  - Inner paragraphs include iframe and credit links stacked with `10px` vertical margin on links.
  - Credits section has top margin `28px`, footer top margin `24px` and `0.85em` font size italic.
- Behavior / states:
  - Hidden during intro and main visualization.
  - Becomes visible after camera timeline passes `orbs.length * 2 + 0.5` plus `0.5` fade duration, opacity `0` → `1` over `0.5` of timeline progress.
  - When hidden, uses `visibility: hidden` to prevent invisible iframe capturing interaction.
  - When visible, iframe plays independently.
- Responsive behavior:
  - Iframe size `854` by `480` desktop, `340` by `240` small, determined by phone detection.
- Accessibility notes:
  - Iframe has standard YouTube title and allows fullscreen.
  - Credit links have discernible text and open in new tab.
  - Outro remains keyboard reachable when visible.

### Global Shell — Shared Foundation

- Purpose:
  - Provide page structure, fonts, long scroll runway, and reset styles shared by all regions.
- Content:
  - Document language `en`.
  - Body background `#192e4c`, text `#fffef5`.
- Structure, components, and assets:
  - Root element `min-height 100vh`.
  - Body font `Open Sans` with fallbacks, self-hosted woff2 files from `/public/fonts/`.
  - Global reset `margin 0`, `padding 0`, `box-sizing border-box`.
  - Link base style solid underline, hover dashed.
  - No header or footer navigation; footer only appears as part of outro content.
- Behavior / states:
  - On entry, history scroll restoration set to manual and page scrolled to top.
  - Scroll listening uses passive listener for performance.
- Responsive behavior:
  - Body height switches at small breakpoint as described.
  - Prevents horizontal overflow with `overflow-x hidden`.
  - Font smoothing antialiased on WebKit.
- Accessibility notes:
  - Document language declared.
  - Focus remains visible via link underline styles.
  - No horizontal scroll traps.

## 7. Acceptance Criteria

### Intro Narrative
- Title `One Amongst Many` appears as primary heading at top of initial view.
- Byline with three author links to `cdacanay.com`, `tina.pizza`, `sxywu.com` is present and clickable.
- First two editorial paragraphs and second-screen legend paragraph display with exact copy listed in Global Content.
- Two videos `/videos/fancy_reduced.mp4` and `/videos/timelapse_reduced.mp4` cover the background, auto-play muted and loop, with visible crossfade as visitor scrolls through first `10` viewports.
- Pattern overlay `/images/bg-pattern.png` shows at `0.3` opacity over videos.
- Bounce cue `⌄` is centered at bottom, bounces vertically, and fades out as introduction ends.

### Visualization Journey
- Full-viewport canvas shows dark sky gradient from `#192e4c` to `#345488`, `480` small star discs, and low rolling terrain `#213344` with subtle wireframe `#3a556f` at `0.14` opacity occupying bottom third.
- Eighteen orbs rendered as billboards with `4` to `7` warm golden overlapping circles each (`#ffe8a0`, `#ffcc66`, `#ffb84d`, `#e6a040`) using screen blending and gentle drift.
- Wide landing view shows all orbs small and clustered center with no story card for first `1%` of visualization scroll.
- Scrolling advances camera smoothly through orbs in year order as listed in inventory; each orb dwell includes `1` move plus `1` hold, final pullback smooth.
- Orb idle floating and internal circle drift are visible and continuous.

### Story Overlay and Progress
- When camera settles at an orb, centered card appears with year bold bordered, name prominent, fields italic, short summary, and `read more →` link to correct Wikipedia url per inventory.
- Card entrance uses fade upward from `-45%` to `-50%` over `0.6s` to `0.9s` ease-out, restarts on each woman change, and fades out before camera leaves.
- Progress pill at bottom center shows current position like `1 of 18` through `18 of 18`, with blurred dark background, and updates only when a story is active.
- Quick scrolling does not cause flicker; text syncs to camera dwell window `0.5` to `1.9` of each segment.

### Outro
- After last orb, camera pulls back to wide view and outro fades in over `0.5` timeline units.
- YouTube embed `https://www.youtube.com/embed/bEM0CRdCrQo` visible and playable.
- Three credit links with exact titles appear, plus footer `Made with love in Brooklyn, 2019.`
- Hidden outro does not block clicks when invisible.

### Responsive and Accessibility
- At `1440px` width body is long scroll, no horizontal overflow; at `390px` width intro block becomes `calc(100% - 40px)`, story card adapts, iframe scales to `340` by `240`.
- Keyboard scroll moves through entire experience; Tab reaches byline and `read more` and outro links with visible focus.
- Canvas has role `img` and descriptive aria label covering purpose and scroll instruction.
- Progress indicator uses polite live region.
- When reduced motion preferred, bounce and story entrance animations disabled.

### Assets and Content Completeness
- All `18` women from inventory present with exact names, years, fields, and short summaries as listed.
- Self-hosted fonts from `/fonts/` in use, no external font requests.
- Public assets `/images/bg-pattern.png`, `/videos/fancy_reduced.mp4`, `/videos/timelapse_reduced.mp4` appear in intro as specified.
- Page background `#192e4c` and text `#fffef5` used globally.
