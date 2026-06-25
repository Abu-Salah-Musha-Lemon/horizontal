/* ════════════════════════════════════════════════════════════
   GLASSMORPHIC PORTFOLIO — script.js
   Same horizontal-scroll mechanism runs on desktop, tablet,
   and mobile — no device branching for the core nav logic.
   ════════════════════════════════════════════════════════════ */

const TOTAL = 6;
let current = 0;

const track        = document.getElementById('track');
const sdots         = document.querySelectorAll('.sdot');
const navLinks      = document.querySelectorAll('.nav-link');
const drawerLinks   = document.querySelectorAll('.drawer-link');
const navPrev       = document.getElementById('navPrev');
const navNext       = document.getElementById('navNext');
const counterCur    = document.getElementById('counterCur');
const progressFill  = document.getElementById('progressFill');
const hamburger     = document.getElementById('hamburger');
const drawer        = document.getElementById('mobileDrawer');
const overlay       = document.getElementById('drawerOverlay');
const modalOverlay  = document.getElementById('modalOverlay');
const modalTitle    = document.getElementById('modalTitle');
const modalBody     = document.getElementById('modalBody');
const modalTag      = document.getElementById('modalTag');

/* ════════ CORE NAV — identical path for every device ════════ */
function goTo(i) {
  i = Math.max(0, Math.min(TOTAL - 1, i));
  current = i;
  track.scrollTo({ left: i * window.innerWidth, behavior: 'smooth' });
  updateUI(i);
  closeDrawer();
}
function step(dir) { goTo(current + dir); }

function updateUI(i) {
  sdots.forEach((d, j) => d.classList.toggle('active', j === i));
  navLinks.forEach((a, j) => a.classList.toggle('active', j === i));
  drawerLinks.forEach((a, j) => a.classList.toggle('active', j === i));
  navPrev.classList.toggle('disabled', i === 0);
  navNext.classList.toggle('disabled', i === TOTAL - 1);
  if (counterCur) counterCur.textContent = String(i + 1).padStart(2, '0');
  if (progressFill) progressFill.style.width = `${(i / (TOTAL - 1)) * 100}%`;
}

/* Sync UI when user scrolls/swipes the track directly */
track.addEventListener('scroll', () => {
  const i = Math.round(track.scrollLeft / window.innerWidth);
  if (i !== current && i >= 0 && i < TOTAL) { current = i; updateUI(i); }
}, { passive: true });

/* Mouse wheel → horizontal pan (desktop/trackpad) */
let wheelTimer = null;
track.addEventListener('wheel', (e) => {
  e.preventDefault();
  clearTimeout(wheelTimer);
  wheelTimer = setTimeout(() => {
    const mag = Math.abs(e.deltaY) > Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
    if (mag > 35) goTo(current + 1);
    else if (mag < -35) goTo(current - 1);
  }, 25);
}, { passive: false });

/* Touch swipe — works the same on phones and tablets */
let touchStartX = 0, touchStartY = 0;
track.addEventListener('touchstart', (e) => {
  touchStartX = e.touches[0].clientX;
  touchStartY = e.touches[0].clientY;
}, { passive: true });
track.addEventListener('touchend', (e) => {
  const dx = touchStartX - e.changedTouches[0].clientX;
  const dy = touchStartY - e.changedTouches[0].clientY;
  if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 45) {
    dx > 0 ? goTo(current + 1) : goTo(current - 1);
  }
}, { passive: true });

/* Keyboard */
document.addEventListener('keydown', (e) => {
  const tag = document.activeElement.tagName.toLowerCase();
  if (['input', 'textarea', 'select'].includes(tag)) return;
  if (e.key === 'ArrowRight' || e.key === 'ArrowDown') goTo(current + 1);
  if (e.key === 'ArrowLeft'  || e.key === 'ArrowUp')   goTo(current - 1);
  if (e.key === 'Escape') { closeModal(); closeDrawer(); }
});

/* Click handlers */
sdots.forEach(d => d.addEventListener('click', () => goTo(+d.dataset.i)));
navLinks.forEach(a => a.addEventListener('click', (e) => { e.preventDefault(); goTo(+a.dataset.i); }));
drawerLinks.forEach(a => a.addEventListener('click', (e) => { e.preventDefault(); goTo(+a.dataset.i); }));

/* Resize: re-snap to current panel so layout stays correct */
let resizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    track.scrollTo({ left: current * window.innerWidth, behavior: 'instant' });
  }, 150);
});

/* ════════ MOBILE DRAWER ════════ */
function openDrawer() {
  drawer.classList.add('open'); overlay.classList.add('open');
  hamburger.classList.add('open'); document.body.style.overflow = 'hidden';
}
function closeDrawer() {
  drawer.classList.remove('open'); overlay.classList.remove('open');
  hamburger.classList.remove('open'); document.body.style.overflow = '';
}
hamburger.addEventListener('click', () => drawer.classList.contains('open') ? closeDrawer() : openDrawer());
overlay.addEventListener('click', closeDrawer);

/* ════════ PROJECT MODAL ════════
   ✏️ EDIT: fill in real project details here */
const PROJECTS = {
  swapnolok: {
    tag: 'Brand Identity',
    title: 'Swapnolok Community Center',
    desc: 'A complete visual identity for a community center in Khulna — logo redesign, color system, large-format outdoor banners, event posters, bi-fold leaflets, one-way vision glass prints, writing pads, and notice boards. Delivered print-ready in CMYK at 300 DPI.'
  },
  pipeline: {
    tag: 'Dev Project',
    title: 'Video Transition Pipeline',
    desc: 'A custom Python video pipeline (video_pipline_v4.py) with a stage-based architecture and interactive transition selector. Includes shredder_twirl, a CapCut-accurate venetian-blind strip-flip effect, and glitch_flash, an RGB-split chromatic aberration transition.'
  },
  carousel: {
    tag: 'Social Media',
    title: 'LinkedIn Case Study Carousel',
    desc: 'A 10-slide 1080×1080px carousel built in Canva Pro to present the Swapnolok branding project — cover, overview, logo variations, palette, typography, mockups, and a closing CTA — formatted for both LinkedIn and Behance.'
  },
  cleanup: {
    tag: 'Dev Project',
    title: 'Smart Cleanup Script',
    desc: 'Smart-WindowsUpdate-Cleanup.bat — a two-phase batch script with a registry-based auto-resume-after-reboot architecture, DISM/SFC handling, timestamped logging, and silent disk cleanup across 22 categories.'
  }
};

function openProject(key) {
  const p = PROJECTS[key];
  if (!p) return;
  modalTag.textContent = p.tag;
  modalTitle.textContent = p.title;
  modalBody.textContent = p.desc;
  modalOverlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeModal() {
  modalOverlay.classList.remove('open');
  document.body.style.overflow = '';
}
modalOverlay.addEventListener('click', (e) => { if (e.target === modalOverlay) closeModal(); });

/* ════════ CONTACT FORM ════════
   ✏️ EDIT: connect to Formspree / EmailJS / Netlify — see README */
function handleSubmit(e) {
  e.preventDefault();
  const btn = e.target.querySelector('button[type="submit"]');
  const success = document.getElementById('formSuccess');
  btn.textContent = 'Sending…';
  btn.disabled = true;
  setTimeout(() => {
    e.target.reset();
    btn.textContent = 'Send message →';
    btn.disabled = false;
    success.classList.add('show');
    setTimeout(() => success.classList.remove('show'), 5000);
  }, 1000);
}

/* ════════ INIT ════════ */
document.addEventListener('DOMContentLoaded', () => updateUI(0));

window.goTo = goTo;
window.step = step;
window.openProject = openProject;
window.closeModal = closeModal;
window.handleSubmit = handleSubmit;
