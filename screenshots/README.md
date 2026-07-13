# Screenshots

Capture the following screenshots for submission:

## Desktop (1440×900)
- File: `home-desktop.png`
- Route: `/`
- Device: Desktop 1440×900
- Content: Initial view with first woman (Grace Hopper) highlighted in the dot field, showing title "One Amongst Many", subtitle, and her story text overlay.

## Mobile (390×844)
- File: `home-mobile.png`
- Route: `/`
- Device: Mobile 390×844 (iPhone 12/13 size)
- Content: Initial view adapted for mobile, with text overlay readable and dot field visible.

## How to capture

1. Run the dev server:
   ```bash
   npm run dev
   ```

2. Open http://localhost:5173 in Chrome

3. For desktop:
   - Open DevTools (F12)
   - Toggle device toolbar (Ctrl+Shift+M)
   - Set dimensions to 1440×900
   - Take screenshot of initial view (first woman)

4. For mobile:
   - In device toolbar, set to 390×844 or iPhone 12 Pro
   - Take screenshot of initial view

5. Save screenshots to this directory:
   - `screenshots/home-desktop.png`
   - `screenshots/home-mobile.png`

## Notes
- The visualization shows a field of dots with one highlighted (brighter, larger, with glow)
- Text overlay shows woman's name, role, and description
- Progress indicator shows "1 of 20" etc.
- Dark blue background (#0b1e38) with off-white text (#fffef5)
