# Glassmorphism Portfolio — Layout & Design System

## Design Reference
Built from 4 reference images sharing: glassmorphism (frosted glass cards),
soft glowing 3D-style accents, layered depth, and "FEATURE" badge cards.

## Color System — 60 / 30 / 10
| Role | Color | Usage |
|---|---|---|
| 60% Dominant | `#0B1220 → #1A1438` gradient | Page background |
| 30% Secondary | `rgba(255,255,255,0.06–0.09)` glass | Cards, navbar, modal |
| 10% Accent | `#8B7CF6 → #6C8CF5 → #4DA8E0` gradient | Badges, CTAs, key icons only |

The accent gradient is used **only** on: the "FEATURE" tag, primary buttons,
active nav state, progress bar, and icon badges — never as a large fill,
keeping it under the 10% ceiling.

## Golden Ratio (φ = 1.618)
- **Layout split**: `.grid-phi` and `.work-grid` use `61.8% / 38.2%` columns
- **Type scale**: 16 → 26 → 42 → 68 → 110px (×1.618 per step)
- **Spacing scale**: Fibonacci 8-13-21-34-55-89-144 (converges to φ)

## Horizontal Scroll — Same on Every Device
Unlike typical responsive sites that switch to vertical scroll on mobile,
this site keeps **one horizontal-scroll mechanism** across desktop, tablet,
and phone — driven by `scroll-snap-type: x mandatory` plus matching
touch-swipe, wheel, and keyboard handlers in `script.js`. Layout density
adapts (grids stack, type scales down) but the navigation model stays identical.

## Files
```
glass-portfolio/
├── index.html
├── style.css
├── script.js
└── README.md
```

## Customization
- **Retheme**: edit `--c-bg-*` and `--c-accent-*` in `style.css` `:root`
- **Glass intensity**: adjust `--glass-blur` and `--glass-bg` opacity
- **Add panels**: copy a `<section class="panel">`, add to `TOTAL` in script.js, add a dot + nav link
- **Real project data**: edit `PROJECTS` object in `script.js`
- **Contact form**: replace the `setTimeout` in `handleSubmit()` with Formspree/EmailJS/Netlify

## Hosting
Netlify (drag-and-drop), GitHub Pages, or Vercel — all free.
