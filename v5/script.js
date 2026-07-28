/* ═══════════════════════════════════════════════════════════
   PORTFOLIO — script.js
   Handles: horizontal scroll nav, dot indicators, mobile
            drawer, keyboard, touch swipe, modal, form
   ═══════════════════════════════════════════════════════════ */

/* ───────────────────────────────────────────
   CONFIG
   ✏️ EDIT: Add panel IDs if you add new panels
─────────────────────────────────────────── */
const PANEL_IDS  = ['home', 'about', 'work', 'services', 'contact'];
const TOTAL      = PANEL_IDS.length;


/* ───────────────────────────────────────────
   STATE
─────────────────────────────────────────── */
let current       = 0;
let isScrolling   = false;
let isMobile      = window.innerWidth <= 768;


/* ───────────────────────────────────────────
   ELEMENT REFS
─────────────────────────────────────────── */
const track         = document.getElementById('track');
const sdots         = document.querySelectorAll('.sdot');
const navLinks      = document.querySelectorAll('.nav-link');
const drawerLinks   = document.querySelectorAll('.drawer-link');
const navPrev       = document.getElementById('navPrev');
const navNext       = document.getElementById('navNext');
const counterEl     = document.getElementById('counterCurrent');
const hamburger     = document.getElementById('hamburger');
const drawer        = document.getElementById('mobileDrawer');
const overlay       = document.getElementById('drawerOverlay');
const modalOverlay  = document.getElementById('modalOverlay');
const modalTitle    = document.getElementById('modalTitle');
const modalBody     = document.getElementById('modalBody');


/* ═══════════════════════════════════════════
   CORE NAVIGATION
═══════════════════════════════════════════ */

/**
 * Navigate to a panel by index.
 * On desktop: horizontal scroll.
 * On mobile: smooth vertical scroll to section.
 */
function goTo(index) {
  index = Math.max(0, Math.min(TOTAL - 1, index));
  current = index;

  if (isMobile) {
    const panel = document.getElementById(PANEL_IDS[index]);
    if (panel) {
      panel.scrollIntoView({ behavior: 'smooth' });
    }
  } else {
    track.scrollTo({
      left: index * window.innerWidth,
      behavior: 'smooth'
    });
  }

  updateUI(index);
  closeDrawer();
}

/** Step forward or backward */
function step(dir) {
  goTo(current + dir);
}

/** Update all UI to reflect active panel */
function updateUI(i) {
  // Dots
  sdots.forEach((d, j) => {
    d.classList.toggle('active', j === i);
    d.setAttribute('aria-current', j === i ? 'true' : 'false');
  });

  // Nav links (desktop)
  navLinks.forEach((a, j) => {
    a.classList.toggle('active', j === i);
  });

  // Drawer links (mobile)
  drawerLinks.forEach((a, j) => {
    a.classList.toggle('active', j === i);
  });

  // Arrows
  navPrev.classList.toggle('disabled', i === 0);
  navNext.classList.toggle('disabled', i === TOTAL - 1);

  // Counter
  if (counterEl) {
    counterEl.textContent = String(i + 1).padStart(2, '0');
  }
}


/* ═══════════════════════════════════════════
   SCROLL LISTENERS
═══════════════════════════════════════════ */

/* ── Desktop: track horizontal scroll position ── */
track.addEventListener('scroll', () => {
  if (isMobile) return;
  const i = Math.round(track.scrollLeft / window.innerWidth);
  if (i !== current && i >= 0 && i < TOTAL) {
    current = i;
    updateUI(i);
  }
}, { passive: true });

/* ── Desktop: mouse wheel → horizontal navigation ── */
let wheelTimer = null;
track.addEventListener('wheel', (e) => {
  if (isMobile) return;
  e.preventDefault();

  clearTimeout(wheelTimer);
  wheelTimer = setTimeout(() => {
    if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
      // Vertical wheel → map to horizontal pan
      if (e.deltaY > 40)       goTo(current + 1);
      else if (e.deltaY < -40) goTo(current - 1);
    } else {
      // Horizontal trackpad
      if (e.deltaX > 40)       goTo(current + 1);
      else if (e.deltaX < -40) goTo(current - 1);
    }
  }, 30);
}, { passive: false });


/* ═══════════════════════════════════════════
   TOUCH SWIPE  (desktop panels + mobile fallback)
═══════════════════════════════════════════ */
let touchStartX = 0;
let touchStartY = 0;

track.addEventListener('touchstart', (e) => {
  touchStartX = e.touches[0].clientX;
  touchStartY = e.touches[0].clientY;
}, { passive: true });

track.addEventListener('touchend', (e) => {
  if (isMobile) return; // mobile uses native vertical scroll
  const dx = touchStartX - e.changedTouches[0].clientX;
  const dy = touchStartY - e.changedTouches[0].clientY;

  // Only act if primarily horizontal
  if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 40) {
    dx > 0 ? goTo(current + 1) : goTo(current - 1);
  }
}, { passive: true });


/* ═══════════════════════════════════════════
   KEYBOARD NAVIGATION
═══════════════════════════════════════════ */
document.addEventListener('keydown', (e) => {
  // Don't hijack when typing in form
  const tag = document.activeElement.tagName.toLowerCase();
  if (['input', 'textarea', 'select'].includes(tag)) return;

  if (e.key === 'ArrowRight' || e.key === 'ArrowDown')  goTo(current + 1);
  if (e.key === 'ArrowLeft'  || e.key === 'ArrowUp')    goTo(current - 1);
  if (e.key === 'Escape')  {
    closeModal();
    closeDrawer();
  }
});


/* ═══════════════════════════════════════════
   DOT & NAV LINK CLICK HANDLERS
═══════════════════════════════════════════ */
sdots.forEach((dot) => {
  dot.addEventListener('click', () => goTo(parseInt(dot.dataset.index)));
});

navLinks.forEach((link) => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    goTo(parseInt(link.dataset.index));
  });
});

drawerLinks.forEach((link) => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    goTo(parseInt(link.dataset.index));
  });
});


/* ═══════════════════════════════════════════
   MOBILE DRAWER
═══════════════════════════════════════════ */
function openDrawer() {
  drawer.classList.add('open');
  overlay.classList.add('open');
  hamburger.classList.add('open');
  hamburger.setAttribute('aria-expanded', 'true');
  document.body.style.overflow = 'hidden';
}

function closeDrawer() {
  drawer.classList.remove('open');
  overlay.classList.remove('open');
  hamburger.classList.remove('open');
  hamburger.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
}

hamburger.addEventListener('click', () => {
  drawer.classList.contains('open') ? closeDrawer() : openDrawer();
});

overlay.addEventListener('click', closeDrawer);


/* ═══════════════════════════════════════════
   PROJECT MODAL
   ✏️ EDIT: Add real project info in the data object below
═══════════════════════════════════════════ */
const PROJECT_DATA = {
  /* ✏️ Key must match the string passed to openProject() in HTML */
  'Swapnolok Community Center Branding': {
    desc: 'A comprehensive visual identity project for Swapnolok Community Center in Khulna. Deliverables included logo redesign, full color system, typography selection, large-format banners (4×8 ft), event posters, bi-fold leaflets, one-way vision glass prints, writing pads, and a notice board. All print files delivered in CMYK at 300 DPI, ready for production.'
  },
  'Python Video Transition Pipeline': {
    desc: 'A custom Python video pipeline (video_pipline_v4.py) built on OpenCV and FFmpeg. Features a stage-based architecture with an interactive transition selector. Custom transitions include shredder_twirl (venetian-blind strip flip simulation, CapCut-accurate) and glitch_flash (RGB channel split with chromatic aberration). Base transitions: cut, fade, zoom_in, slide_left.'
  },
  'LinkedIn Portfolio Carousel': {
    desc: '10-slide LinkedIn carousel (1080×1080px) designed in Canva Pro for showcasing the Swapnolok branding project. Includes cover slide, project overview, logo variations, color palette, typography specimens, print mockups, before/after comparison, and closing CTA. Formatted for both LinkedIn native carousel and Behance case study presentation.'
  },
  'Print Collateral Suite': {
    desc: 'A complete print collateral system covering: writing pads (A5, 50 sheets), notice boards (A2 landscape), one-way vision glass vinyl, pull-up banners (2×6 ft), and event leaflets (DL tri-fold). All designs maintain brand consistency with the Swapnolok identity system. Files delivered as PDF/X-1a for press.'
  },
  'Windows Cleanup Script': {
    desc: 'Smart-WindowsUpdate-Cleanup.bat — a Windows batch script implementing a two-phase execution model. Phase 1 performs pre-reboot cleanup: stops Windows Update services, clears the SoftwareDistribution folder, runs DISM /Online /Cleanup-Image /RestoreHealth, and registers Phase 2 in the registry run key. After reboot, Phase 2 runs SFC /scannow, clears temp files, and removes the registry entry. Features timestamped logging and full error handling.'
  },
};

function openProject(name) {
  const data = PROJECT_DATA[name];
  modalTitle.textContent = name;
  modalBody.textContent  = data ? data.desc : 'Project details coming soon — check back later.';
  modalOverlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  modalOverlay.classList.remove('open');
  document.body.style.overflow = '';
}

modalOverlay.addEventListener('click', (e) => {
  if (e.target === modalOverlay) closeModal();
});


/* ═══════════════════════════════════════════
   CONTACT FORM
   ✏️ EDIT: Replace the fake submit with a real
   service like Formspree, Netlify Forms, or EmailJS
═══════════════════════════════════════════ */
function handleSubmit(e) {
  e.preventDefault();
  const btn     = e.target.querySelector('button[type="submit"]');
  const success = document.getElementById('formSuccess');

  btn.textContent = 'Sending…';
  btn.disabled = true;

  /* ── Replace this timeout with your real API call ──
     Example with Formspree:

     fetch('https://formspree.io/f/YOUR_FORM_ID', {
       method: 'POST',
       headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
       body: JSON.stringify({
         name:    document.getElementById('fname').value,
         email:   document.getElementById('femail').value,
         subject: document.getElementById('fsubject').value,
         message: document.getElementById('fmessage').value,
       })
     })
     .then(r => r.ok ? showSuccess() : showError())
     .catch(showError);
  ──────────────────────────────────────────────── */
  setTimeout(() => {
    e.target.reset();
    btn.textContent = 'Send Message ✦';
    btn.disabled = false;
    success.classList.add('show');
    setTimeout(() => success.classList.remove('show'), 5000);
  }, 1200);
}


/* ═══════════════════════════════════════════
   RESIZE HANDLER
   Recalculate mobile/desktop on window resize
═══════════════════════════════════════════ */
let resizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    isMobile = window.innerWidth <= 768;
    if (!isMobile) {
      // Re-snap to current panel after resize
      track.scrollTo({ left: current * window.innerWidth, behavior: 'instant' });
    }
  }, 150);
});


/* ═══════════════════════════════════════════
   MOBILE: INTERSECTION OBSERVER
   Detect which section is in view on vertical scroll
═══════════════════════════════════════════ */
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries) => {
    if (!isMobile) return;
    entries.forEach(entry => {
      if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
        const panel = entry.target;
        const i = parseInt(panel.dataset.panel);
        if (!isNaN(i) && i !== current) {
          current = i;
          updateUI(i);
        }
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('.panel').forEach(p => observer.observe(p));
}


/* ═══════════════════════════════════════════
   INIT
═══════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  updateUI(0);

  // If URL has a hash, navigate to it
  const hash = window.location.hash.replace('#', '');
  if (hash) {
    const i = PANEL_IDS.indexOf(hash);
    if (i >= 0) setTimeout(() => goTo(i), 100);
  }
});

// Expose goTo globally (used in onclick attributes in HTML)
window.goTo = goTo;
window.step = step;
window.openProject = openProject;
window.closeModal = closeModal;
window.handleSubmit = handleSubmit;
