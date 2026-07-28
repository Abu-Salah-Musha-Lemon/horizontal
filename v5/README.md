# Portfolio Website — Layout & Customization Guide

## Files
```
portfolio/
├── index.html   — HTML structure (panels, content, components)
├── style.css    — All styles (tokens, layout, components)
├── script.js    — Navigation, interactions, form logic
└── README.md    — This guide
```

---

## Layout System

### Desktop (> 768px)
- Horizontal scroll with CSS scroll-snap
- Each section = 100vw × 100vh panel
- Navigate: mouse wheel, ←→ arrow keys, dots, nav arrows, navbar links

### Mobile (≤ 768px)
- Vertical scroll (normal flow)
- Each section stacks top-to-bottom
- Hamburger menu → slide-out drawer
- IntersectionObserver updates active nav state

---

## How to Customize

### 1. Change Colors
Open `style.css` → `:root` block at the top.
The 6 key variables to retheme everything:

```css
--color-bg:            #0f0c1a;   /* page background       */
--color-surface:       #17122a;   /* card backgrounds      */
--color-accent:        #7b5ea7;   /* primary accent purple */
--color-accent-bright: #a07de0;   /* hover / lighter tone  */
--color-highlight:     #c9a96e;   /* gold for "featured"   */
--color-text:          #f0eaff;   /* primary text          */
```

### 2. Change Fonts
1. Go to https://fonts.google.com and pick two fonts
2. Update the `<link>` tag in `index.html` (the Google Fonts URL)
3. In `style.css`, change:
```css
--font-display: 'Syne', sans-serif;   /* for headings */
--font-body:    'Inter', sans-serif;  /* for body text */
```

### 3. Add a New Panel
1. In `index.html`, copy any `<section class="panel">` block and give it a new `id` and `data-panel` number
2. Add a nav link for it in both `.nav-links` and `.mobile-drawer`
3. In `script.js`, add the panel ID to the `PANEL_IDS` array
4. Add a dot `<button class="sdot">` in the scroll-dots section
5. Add a `pb-yourpanel` background class in `style.css`

### 4. Edit Project Cards
In `index.html`, find the `.work-grid` section.
Each card has:
- `--thumb-from` / `--thumb-to` CSS vars for the thumbnail gradient
- emoji icon
- tag chip (class: `wcard-tag-chip`, `wcard-tag-dev`, `wcard-tag-social`)
- title and description

In `script.js`, find the `PROJECT_DATA` object and add an entry
matching the name you pass to `openProject()`.

### 5. Set Up the Contact Form
In `script.js`, find the `handleSubmit` function.
Replace the `setTimeout` with a real API call.

**Option A — Formspree (free, easy):**
```js
fetch('https://formspree.io/f/YOUR_FORM_ID', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
  body: JSON.stringify({ name, email, subject, message })
})
.then(r => r.ok ? showSuccess() : showError())
```

**Option B — EmailJS (no backend needed):**
```js
emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', { name, email, message });
```

**Option C — Netlify Forms:**
Add `data-netlify="true"` to the `<form>` tag and deploy to Netlify.

### 6. Change Service Prices
Find the `.scard-price` elements in `index.html`.
Change `৳8,000` etc. to your own prices / currency.

### 7. Add Social Links
In the `<footer>` at the bottom of the contact panel:
```html
<a href="https://your-link.com" target="_blank">Platform Name</a>
```

---

## Color Themes (Ready to paste into :root)

### Dark Ocean (blue tones)
```css
--color-bg:            #08101a;
--color-surface:       #0d1c2e;
--color-accent:        #1a6eb5;
--color-accent-bright: #4a9fe0;
--color-highlight:     #e0a840;
```

### Dark Forest (green tones)
```css
--color-bg:            #0a120c;
--color-surface:       #101e12;
--color-accent:        #2a7a3a;
--color-accent-bright: #5ac870;
--color-highlight:     #c8a840;
```

### Charcoal + Coral
```css
--color-bg:            #141210;
--color-surface:       #1e1a18;
--color-accent:        #c04030;
--color-accent-bright: #e86050;
--color-highlight:     #e0b840;
```

---

## Hosting (Free Options)
- **Netlify**: drag-and-drop the folder at app.netlify.com
- **GitHub Pages**: push to a repo, enable Pages in settings
- **Vercel**: connect GitHub repo, auto-deploys on push
