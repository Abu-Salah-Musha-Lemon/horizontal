# Glassmorphic Portfolio — Layout & Customization Guide

Built from your 4 reference images: frosted glass cards, "FEATURE" pill
tags, a 3D floating orb hero, and an asymmetric golden-ratio work grid.

## Files
```
glass-portfolio/
├── index.html   — structure (6 horizontal panels)
├── style.css    — design tokens, glass cards, layout
├── script.js    — navigation, modal, form (same engine on all devices)
└── README.md
```

## The Math Behind the Layout

### 60 / 30 / 10 Color Rule
| % | Variable | Hex | Used for |
|---|----------|-----|----------|
| 60% | `--c-60` | `#0A1628` | Page background — always dominant |
| 30% | `--c-30` / `.glass-card` | `#16243D` (blurred) | Cards, panels, surfaces |
| 10% | `--c-10` | `#5B7FFF` | Buttons, active states, icons, glows — **never backgrounds** |

Stick to this discipline when adding content: if you reach for blue for
anything beyond a button, link, or icon, you're breaking the ratio.

### Golden Ratio (φ = 1.618)
- **Type scale**: 16 → 26 → 42 → 68 → 110px, each step ×1.618
- **Spacing scale**: Fibonacci 8-13-21-34-55-89-144 (converges to φ, gives clean round numbers)
- **Layout splits**: `.grid-phi` divides any two-column section 61.8% / 38.2% — used in the hero, about, and contact panels
- **Work grid**: the large project card spans 61.8% width × full height; the three small cards share the remaining 38.2%

## How to Customize

### Change Colors
Edit the 5 core variables in `style.css` → `:root`:
```css
--c-60:  #0A1628;   /* background */
--c-30:  #16243D;   /* card surface */
--c-10:  #5B7FFF;   /* accent — buttons, icons, glow */
--c-muted: #9FB0CC;  /* secondary text */
--c-white: #FFFFFF;  /* primary text */
```

### Add a Project Card
1. In `index.html`, copy a `.wcard` block inside `.work-grid`
2. In `script.js`, add an entry to the `PROJECTS` object with a matching key

### Add a Floating Feature Card (Panel 4)
Copy a `.ffeature` block — give it a new `ff-N` class and position it with
`top` / `left` in the matching CSS rule (`.ff-1`, `.ff-2`, etc.)

### Connect the Contact Form
In `script.js` → `handleSubmit()`, replace the demo `setTimeout` with a
real call to Formspree, EmailJS, or Netlify Forms (examples in the
function comments).

### Fonts
Currently: **Plus Jakarta Sans** (display) + **Inter** (body) — both free
on Google Fonts, chosen to match the rounded-geometric headline style in
your reference images. Swap the `<link>` in `index.html` and the
`--font-display` / `--font-body` variables to change.

## Responsiveness — One System, Every Device
The horizontal scroll-snap mechanism is **identical** on desktop, tablet,
and mobile — there's no separate "mobile layout" that breaks the
experience. What changes per breakpoint:
- Padding and font sizes scale down (via `clamp()` and Fibonacci spacing)
- The golden-ratio two-column grids (`.grid-phi`, `.about-layout`,
  `.work-grid`) stack to a single column under 900px
- Floating feature cards (Panel 4) drop their absolute positioning and
  stack vertically under 900px
- Touch swipe is enabled in addition to wheel/keyboard/dot navigation

## Hosting
- **Netlify**: drag the folder onto app.netlify.com
- **GitHub Pages**: push to a repo, enable Pages
- **Vercel**: connect repo, auto-deploy
