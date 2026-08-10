# Setup and verification

## Requirements

- Node.js 22.12 or newer
- npm 10 or newer

This is a fully static frontend. It has no environment variables, API credentials, backend, or database.

## Install and run

Use the committed lockfile rather than resolving new dependency versions:

```bash
npm ci
npm run dev
```

Vite listens on `127.0.0.1:5173`. It is deliberately not exposed to the local network.

## Test and build

```bash
npm test
npm audit
npm run build
npm run preview
```

The test suite verifies:

- The ten-viewport intro and original video/text crossfade windows
- The 1% establishing view before the first orb
- Eighteen two-unit camera segments and final pullback
- Story fade-in, hold, and fade-out timing
- Deterministic finite orb placement
- The complete women sequence and HTTPS biography URLs

## Behavior contract

- Desktop body height: `50000px`; tablet: `35000px`; mobile: `25000px`
- Intro: two local videos and pattern overlay, followed by a crossfade to the visualization
- Visualization: gradient sky, faceted terrain, 480 stars, and 18 animated golden orb canvases
- Camera: one timeline unit of eased travel and one unit of hold per woman
- Story: year, name, field, summary, biography link, and progress pill
- Outro: responsive 854:480 installation video, three source links, and original footer

The responsive breakpoints, colors, text, spacing, scroll distances, story timing, and camera targets are preserved from the prior accepted replica. Procedural randomness now uses fixed seeds so the same scene can be tested and reproduced.

## Assets

All runtime assets are local except for the closing YouTube embed:

- `public/videos/fancy_reduced.mp4`
- `public/videos/timelapse_reduced.mp4`
- `public/images/bg-pattern.png`
- `public/fonts/opensans-400.woff2`
- `public/fonts/opensans-400i.woff2`
- `public/fonts/opensans-700.woff2`

The font files identify as Google Open Sans version 196805 with regular, italic, and bold styles. Their SHA-256 checksums are:

```text
ce39fe93a4c5179c0d53a4bdc2a378bdd713cdcfd15d812b0e26694d7f6d9867  opensans-400.woff2
920971d9555fc7f93ddffa2375d65a9e36ca425b6bf8bc142b14c922eaeec218  opensans-400i.woff2
aa4b76b7fcdebb911745fec80e8e6708ca26bfe3361118c0d96462029f4c130c  opensans-700.woff2
```

## Deployment and access

The production URL is recorded in `site.toml`. The `hosting_access_granted` field describes submission ownership transfer; it does not configure public access or firewall policy.

Before deploying, verify the Vercel project’s current:

- Team and project members
- Git integration and deploy hooks
- Environment variables and secrets
- Firewall rules and temporary bypasses
- Active access tokens

Do not deploy from an unreviewed local `.vercel` link. Confirm the intended account and project first. The security headers in `vercel.json` should be checked on the resulting preview before promoting it to production.

Walkthrough video: <https://pxl.cl/c7DnV>
