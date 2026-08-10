# One Amongst Many — Web Craft Submission

A faithful, scroll-driven recreation of [oneamongstmany.com](https://oneamongstmany.com). The experience moves from an atmospheric video introduction into a Three.js landscape of 18 glowing orbs, one for each featured woman in computing, before closing with the original installation video and credits.

Live site: <https://sulattphone-webcraft-oneamongstmany.vercel.app>

## Local development

Node.js 22.12 or newer is required.

```bash
npm ci
npm run dev
```

The local server listens only on `http://127.0.0.1:5173`.

```bash
npm test
npm run build
npm run preview
```

## Implementation

- React 18, TypeScript, Three.js, and Vite
- Native, deterministic scroll and camera timeline; no animation framework
- Self-hosted Open Sans, pattern image, and two intro videos
- Static frontend with no API, environment variables, authentication, cookies, or browser storage
- Responsive desktop, tablet, and mobile pacing matching the original experience

The visualization is split into pure timeline, camera, layout, random, and rendering modules under `src/visualization/`. Unit tests lock the intro crossfade, two-unit orb rhythm, camera targets, data sequence, and scroll boundaries.

## Security posture

- Exact dependency versions and a reviewed npm lockfile
- Zero known npm audit findings at the time of this rewrite
- Development and preview servers bound to loopback
- Privacy-enhanced, sandboxed YouTube embed with limited permissions
- HTTPS-only outbound links
- Production CSP, Permissions-Policy, framing, MIME-sniffing, referrer, and cross-origin headers in `vercel.json`
- Full cleanup of WebGL resources, timers, animation frames, and browser listeners

Deployment firewall rules, ownership, members, bypasses, and tokens are managed by the hosting platform and are not controlled by `site.toml` or this application.

## Submission material

- Product requirements: `PRD.md`
- Setup and verification: `SETUP.md`
- Feature rubrics: `features.json`
- Desktop and mobile captures: `screenshots/`
- Walkthrough: <https://pxl.cl/c7DnV>
