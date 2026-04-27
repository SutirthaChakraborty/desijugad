/* ==========================================================================
   Desi Jugad — Main JS (shared utilities)
   ========================================================================== */

/* ── Auto-load shared modules (theme, command palette, recent tools) ────────
   Resolves paths so the same script works from /, /convert/*, /ai/*, /blog/*. */
(function () {
  function rootPrefix() {
    var p = window.location.pathname;
    if (p.indexOf('/convert/') !== -1 || p.indexOf('/ai/') !== -1 || p.indexOf('/blog/') !== -1) return '../';
    return '';
  }
  function load(src) {
    var s = document.createElement('script');
    s.src = rootPrefix() + 'assets/js/' + src;
    s.defer = true;
    document.head.appendChild(s);
  }
  // Theme first (applies data-theme early to avoid FOUC)
  load('theme.js');
  // Tools data → recent → palette (dependency order)
  load('tools-data.js');
  load('recent-tools.js');
  load('command-palette.js');
})();

/* ── Mouse-based parallax (hero section)
   Moves hero blobs and card with mouse position. Disabled on touch / reduced-motion. ─ */
(function() {
  const hero = document.querySelector('.hero');
  if (!hero) return;
  // Skip parallax on touch devices, narrow viewports, and when the user prefers reduced motion
  var isTouch = window.matchMedia && window.matchMedia('(pointer: coarse)').matches;
  var prefersReduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var isNarrow = window.innerWidth < 720;
  if (isTouch || prefersReduce || isNarrow) return;

  const layers = [
    { selector: '.hero::before',  speed: 0.025 },
    { selector: '.hero::after',   speed: 0.018 },
    { selector: '.hero-card',     speed: 0.04  },
    { selector: '.speed-pill',    speed: 0.06  },
    { selector: '.hero-text h1',  speed: 0.012 },
  ];

  // We track actual DOM elements
  const heroCard  = hero.querySelector('.hero-card');
  const speedPill = hero.querySelector('.speed-pill');
  const heroH1    = hero.querySelector('h1');
  const heroBg    = hero; // blobs via CSS var trick

  let mouseX = 0, mouseY = 0;
  let raf = null;

  function lerp(a, b, t) { return a + (b - a) * t; }

  let curCardX = 0, curCardY = 0;
  let curPillX = 0, curPillY = 0;
  let curH1X   = 0, curH1Y   = 0;
  let curBgX   = 0, curBgY   = 0;

  function update() {
    const rect  = hero.getBoundingClientRect();
    const cx    = rect.left + rect.width  / 2;
    const cy    = rect.top  + rect.height / 2;
    const dx    = (mouseX - cx) / rect.width;
    const dy    = (mouseY - cy) / rect.height;

    const smooth = 0.08;

    if (heroCard) {
      const tx = dx * 28, ty = dy * 18;
      curCardX = lerp(curCardX, tx, smooth);
      curCardY = lerp(curCardY, ty, smooth);
      heroCard.style.transform = `rotate(${1.4 - dx * 1.5}deg) translate(${curCardX}px, ${curCardY}px)`;
    }
    if (speedPill) {
      const tx = dx * -22, ty = dy * -14;
      curPillX = lerp(curPillX, tx, smooth);
      curPillY = lerp(curPillY, ty, smooth);
      speedPill.style.transform = `rotate(${-4 + dx * 2}deg) translate(${curPillX}px, ${curPillY}px)`;
    }
    if (heroH1) {
      const tx = dx * 8, ty = dy * 5;
      curH1X = lerp(curH1X, tx, smooth * 0.6);
      curH1Y = lerp(curH1Y, ty, smooth * 0.6);
      heroH1.style.transform = `translate(${curH1X}px, ${curH1Y}px)`;
    }
    // Move CSS blob pseudo-elements via custom props on the hero element
    const bx = dx * -40, by = dy * -25;
    curBgX = lerp(curBgX, bx, smooth * 0.5);
    curBgY = lerp(curBgY, by, smooth * 0.5);
    hero.style.setProperty('--blob-x', curBgX + 'px');
    hero.style.setProperty('--blob-y', curBgY + 'px');

    raf = requestAnimationFrame(update);
  }

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  // Pause when mouse leaves viewport
  document.addEventListener('mouseleave', () => {
    if (raf) { cancelAnimationFrame(raf); raf = null; }
  });
  document.addEventListener('mouseenter', () => {
    if (!raf) raf = requestAnimationFrame(update);
  });

  // Also run on touch devices (limited)
  document.addEventListener('touchmove', (e) => {
    if (e.touches[0]) { mouseX = e.touches[0].clientX; mouseY = e.touches[0].clientY; }
  }, { passive: true });

  raf = requestAnimationFrame(update);
})();

/* Mobile menu toggle */
(function() {
  const toggle = document.querySelector('.menu-toggle');
  const links = document.querySelector('.nav-links');
  if (!toggle || !links) return;
  toggle.addEventListener('click', () => {
    links.classList.toggle('open');
    const isOpen = links.classList.contains('open');
    toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });
})();

/* Local file-mode link normalization
   Makes root-absolute links like "/ai/" work when opened via file:// */
(function() {
  if (window.location.protocol !== 'file:') return;

  const pathname = window.location.pathname;
  const markers = ['/ai/', '/blog/', '/convert/'];
  const marker = markers.find(part => pathname.includes(part));
  const siteRootPath = marker
    ? pathname.slice(0, pathname.indexOf(marker) + 1)
    : pathname.slice(0, pathname.lastIndexOf('/') + 1);
  const siteRootUrl = new URL(`file://${siteRootPath}`);

  function toFileSafePath(path) {
    if (!path || typeof path !== 'string' || !path.startsWith('/')) return path;

    if (path === '/') return new URL('index.html', siteRootUrl).href;
    if (path.startsWith('/#')) return new URL(`index.html${path.slice(1)}`, siteRootUrl).href;

    let cleaned = path.slice(1);
    if (cleaned.endsWith('/')) cleaned += 'index.html';
    return new URL(cleaned, siteRootUrl).href;
  }

  window.DJ_RESOLVE_PATH = toFileSafePath;

  // Normalize absolute root paths like "/ai/", "/blog/"
  document.querySelectorAll('a[href^="/"]').forEach((anchor) => {
    const rawHref = anchor.getAttribute('href');
    const normalizedHref = toFileSafePath(rawHref);
    if (normalizedHref) anchor.setAttribute('href', normalizedHref);
  });

  // Normalize relative directory links on file:// — handles both plain dirs and dirs with hashes:
  //   "../"            → "../index.html"
  //   "../#converters" → "../index.html#converters"   ← the broken case
  //   "../blog/"       → "../blog/index.html"
  //   "./"             → "./index.html"
  document.querySelectorAll('a[href]').forEach((anchor) => {
    const rawHref = anchor.getAttribute('href');
    // Skip: already-handled absolute paths, external URLs, pure fragment links, mailto/tel
    if (!rawHref ||
        rawHref.startsWith('/') ||
        rawHref.startsWith('http') ||
        rawHref.startsWith('mailto:') ||
        rawHref.startsWith('tel:') ||
        rawHref.startsWith('#')) return;

    const hashIdx = rawHref.indexOf('#');
    const pathPart = hashIdx >= 0 ? rawHref.slice(0, hashIdx) : rawHref;
    const hashPart = hashIdx >= 0 ? rawHref.slice(hashIdx) : '';

    // Only rewrite if the path component itself ends with "/" (points at a directory)
    if (pathPart.endsWith('/')) {
      anchor.setAttribute('href', pathPart + 'index.html' + hashPart);
    }
  });
})();

/* Ensure consistent Settings nav item across pages */
(function() {
  const navLinks = document.querySelector('.nav-links');
  if (!navLinks) return;

  const settingsHref = (typeof window.DJ_RESOLVE_PATH === 'function')
    ? window.DJ_RESOLVE_PATH('/ai/settings.html')
    : '/ai/settings.html';

  const allAnchors = Array.from(navLinks.querySelectorAll('a'));
  const existingSettings = allAnchors.find((anchor) => {
    const href = anchor.getAttribute('href') || '';
    const text = (anchor.textContent || '').toLowerCase();
    return href.includes('ai/settings.html') || text.includes('settings') || text.includes('api key');
  });

  if (existingSettings) {
    existingSettings.setAttribute('href', settingsHref);
    existingSettings.classList.add('nav-cta');
    return;
  }

  // Only inject a Settings link on AI Studio pages — not on the homepage, blog, or converter pages
  const isAiPage = window.location.pathname.includes('/ai/') ||
                   window.location.pathname.endsWith('/ai');
  if (!isAiPage) return;

  const item = document.createElement('li');
  const anchor = document.createElement('a');
  anchor.href = settingsHref;
  anchor.textContent = 'Settings';
  anchor.className = 'nav-cta';
  item.appendChild(anchor);
  navLinks.appendChild(item);
})();

/* Toast notifications */
window.showToast = function(message, type = 'default', duration = 3000) {
  let toast = document.querySelector('.toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.className = 'toast';
  toast.textContent = message;
  if (type) toast.classList.add(type);
  // force reflow
  void toast.offsetWidth;
  toast.classList.add('show');
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => toast.classList.remove('show'), duration);
};

/* Scroll reveal animations */
(function() {
  if (!('IntersectionObserver' in window)) return;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
})();

/* Shared: show/hide no-results message on homepage tool grid */
(function() {
  window._djShowNoResults = function(show) {
    let msg = document.getElementById('no-results-msg');
    if (!msg) {
      const converterSection = document.getElementById('converters');
      const grid = converterSection ? converterSection.querySelector('.converter-grid') : null;
      if (!grid) return;
      msg = document.createElement('p');
      msg.id = 'no-results-msg';
      msg.className = 'no-results-msg';
      msg.textContent = 'No tools match your search. Try a different keyword.';
      grid.after(msg);
    }
    msg.style.display = show ? '' : 'none';
  };
})();

/* Category filter (homepage) */
(function() {
  const filters = document.querySelectorAll('.category-filter button');
  const converterSection = document.getElementById('converters');
  const cards = converterSection
    ? converterSection.querySelectorAll('.converter-card')
    : document.querySelectorAll('.converter-card');
  if (!filters.length) return;
  filters.forEach(btn => {
    btn.addEventListener('click', () => {
      const cat = btn.dataset.category;
      filters.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      // Clear search when switching category
      const searchInput = document.getElementById('toolSearch');
      if (searchInput) searchInput.value = '';
      if (window._djShowNoResults) window._djShowNoResults(false);
      cards.forEach(card => {
        if (cat === 'all' || card.dataset.category === cat) {
          card.style.display = '';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
})();

/* Tool search (homepage) */
(function() {
  const searchInput = document.getElementById('toolSearch');
  if (!searchInput) return;
  const converterSection = document.getElementById('converters');
  const cards = converterSection
    ? Array.from(converterSection.querySelectorAll('.converter-card'))
    : [];
  const filters = document.querySelectorAll('.category-filter button');

  searchInput.addEventListener('input', () => {
    const q = searchInput.value.trim().toLowerCase();
    if (!q) {
      // Restore active category filter
      const activeFilter = document.querySelector('.category-filter button.active');
      const cat = activeFilter ? activeFilter.dataset.category : 'all';
      cards.forEach(card => { card.style.display = (cat === 'all' || card.dataset.category === cat) ? '' : 'none'; });
      if (window._djShowNoResults) window._djShowNoResults(false);
      return;
    }
    // Switch category filter to "All" visually
    filters.forEach(b => b.classList.remove('active'));
    const allBtn = document.querySelector('.category-filter button[data-category="all"]');
    if (allBtn) allBtn.classList.add('active');

    let visibleCount = 0;
    cards.forEach(card => {
      const title = (card.querySelector('.card-title') || card).textContent.toLowerCase();
      const desc  = (card.querySelector('.card-desc')  || card).textContent.toLowerCase();
      const show  = title.includes(q) || desc.includes(q);
      card.style.display = show ? '' : 'none';
      if (show) visibleCount++;
    });
    if (window._djShowNoResults) window._djShowNoResults(visibleCount === 0);
  });

  // Clear on Escape
  searchInput.addEventListener('keydown', e => {
    if (e.key === 'Escape') { searchInput.value = ''; searchInput.dispatchEvent(new Event('input')); }
  });
})();

/* Mega-menu keyboard/click accessibility */
(function() {
  document.querySelectorAll('.nav-has-menu').forEach(item => {
    const trigger = item.querySelector('.nav-menu-trigger');
    if (!trigger) return;
    // Toggle on click (works for both mobile accordion and desktop fallback)
    trigger.addEventListener('click', (e) => {
      // On desktop, hover handles it — but allow click too
      if (window.innerWidth <= 720) {
        e.preventDefault();
        item.classList.toggle('open');
      }
    });
    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!item.contains(e.target)) item.classList.remove('open');
    });
    // Close mega on Escape
    item.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') item.classList.remove('open');
    });
  });
})();

/* Format file size */
window.formatBytes = function(bytes) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/* Download helper */
window.downloadBlob = function(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 100);
};

/* Copy text to clipboard */
window.copyToClipboard = async function(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (e) {
    // Fallback
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.left = '-9999px';
    document.body.appendChild(ta);
    ta.select();
    try {
      document.execCommand('copy');
      document.body.removeChild(ta);
      return true;
    } catch {
      document.body.removeChild(ta);
      return false;
    }
  }
};

/* Current year in footer */
document.querySelectorAll('[data-year]').forEach(el => {
  el.textContent = new Date().getFullYear();
});

/* Global conversion counter — increment on every tool page visit */
(function() {
  const isToolPage = window.location.pathname.includes('/convert/') ||
                     window.location.pathname.includes('/ai/');
  if (!isToolPage) return;
  const n = parseInt(localStorage.getItem('dj_conv_seed') || '0', 10);
  localStorage.setItem('dj_conv_seed', String(n + 1));
})();

/* Load Noto Sans Devanagari lazily when Hindi is activated */
function loadDevanagariFont() {
  if (document.getElementById('dj-devanagari-font')) return;
  const link = document.createElement('link');
  link.id = 'dj-devanagari-font';
  link.rel = 'stylesheet';
  link.href = 'https://fonts.googleapis.com/css2?family=Noto+Sans+Devanagari:wght@400;500;700&display=swap';
  document.head.appendChild(link);
}

/* ── Language toggle (EN ↔ हि)
   Reads [data-i18n] attributes and swaps text based on chosen locale ──────── */
(function() {
  const strings = {
    en: {
      'nav.converters':   'Converters',
      'nav.how':          'How it works',
      'nav.blog':         'Blog',
      'nav.about':        'About',
      'nav.cta':          'Start converting',
      'hero.eyebrow':     'Private. Free. Forever.',
      'hero.h1.line1':    'Convert anything,',
      'hero.h1.accent':   'without the upload.',
      'hero.lead':        'Images, documents, data, subtitles — transformed right inside your browser. No sign-up, no watermark, no nonsense. Your files never leave your device.',
      'hero.cta.primary': 'Explore converters',
      'hero.cta.secondary':'How it works',
      'trust.inbrowser':  '100% in-browser',
      'trust.noupload':   'No uploads ever',
      'trust.notrack':    'No tracking',
      'trust.nosignup':   'No sign-up',
      'converters.eyebrow':'Every tool you need',
      'converters.h2':    'One place for every conversion.',
      'converters.p':     'Pick a converter, drop your file, and watch it transform — instantly, locally, privately.',
      'filter.all':       'All',
      'filter.image':     'Images',
      'filter.document':  'Documents',
      'filter.data':      'Data',
      'filter.text':      'Text',
      'filter.media':     'Media',
      'filter.util':      'Utilities',
      'footer.tagline':   'Free, private file conversion for everyone. Your files never leave your device — because they shouldn\'t have to.',
      'footer.madein':    'Proudly made in India, built for the world.',
    },
    hi: {
      'nav.converters':   'टूल्स',
      'nav.how':          'कैसे काम करता है',
      'nav.blog':         'ब्लॉग',
      'nav.about':        'हमारे बारे में',
      'nav.cta':          'शुरू करें',
      'hero.eyebrow':     'निजी। मुफ़्त। हमेशा के लिए।',
      'hero.h1.line1':    'कुछ भी कन्वर्ट करें,',
      'hero.h1.accent':   'बिना अपलोड किए।',
      'hero.lead':        'इमेज, दस्तावेज़, डेटा, सबटाइटल — सब कुछ सीधे आपके ब्राउज़र में। कोई साइन-अप नहीं, कोई वॉटरमार्क नहीं। आपकी फ़ाइलें आपके डिवाइस पर ही रहती हैं।',
      'hero.cta.primary': 'टूल देखें',
      'hero.cta.secondary':'कैसे काम करता है',
      'trust.inbrowser':  '100% ब्राउज़र में',
      'trust.noupload':   'कोई अपलोड नहीं',
      'trust.notrack':    'कोई ट्रैकिंग नहीं',
      'trust.nosignup':   'कोई रजिस्ट्रेशन नहीं',
      'converters.eyebrow':'सभी ज़रूरी टूल',
      'converters.h2':    'हर कन्वर्शन के लिए एक जगह।',
      'converters.p':     'टूल चुनें, फ़ाइल डालें, और तुरंत नतीजा पाएं — स्थानीय, निजी।',
      'filter.all':       'सभी',
      'filter.image':     'इमेज',
      'filter.document':  'दस्तावेज़',
      'filter.data':      'डेटा',
      'filter.text':      'टेक्स्ट',
      'filter.media':     'मीडिया',
      'filter.util':      'यूटिलिटी',
      'footer.tagline':   'सबके लिए मुफ़्त, निजी फ़ाइल कन्वर्शन। आपकी फ़ाइलें आपके डिवाइस पर ही रहती हैं।',
      'footer.madein':    'भारत में बना, दुनिया के लिए।',
    }
  };

  let currentLang = localStorage.getItem('dj-lang') || 'en';
  if (currentLang === 'hi') loadDevanagariFont();

  function applyLang(lang) {
    currentLang = lang;
    localStorage.setItem('dj-lang', lang);
    if (lang === 'hi') loadDevanagariFont();
    document.documentElement.lang = lang === 'hi' ? 'hi' : 'en';
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.dataset.i18n;
      if (strings[lang] && strings[lang][key] !== undefined) {
        el.textContent = strings[lang][key];
      }
    });
    // Update toggle button label
    const btn = document.getElementById('lang-toggle');
    if (btn) btn.textContent = lang === 'hi' ? 'EN' : 'हि';
    // Update html font for Hindi
    document.body.classList.toggle('lang-hi', lang === 'hi');
  }

  // Inject toggle button into navbar
  function injectToggle() {
    const navInner = document.querySelector('.nav-inner');
    if (!navInner || document.getElementById('lang-toggle')) return;
    const btn = document.createElement('button');
    btn.id = 'lang-toggle';
    btn.className = 'lang-toggle';
    btn.setAttribute('aria-label', 'Toggle language');
    btn.textContent = currentLang === 'hi' ? 'EN' : 'हि';
    btn.addEventListener('click', () => applyLang(currentLang === 'en' ? 'hi' : 'en'));
    // Insert before menu-toggle
    const menuToggle = navInner.querySelector('.menu-toggle');
    if (menuToggle) navInner.insertBefore(btn, menuToggle);
    else navInner.appendChild(btn);
  }

  document.addEventListener('DOMContentLoaded', () => {
    injectToggle();
    applyLang(currentLang);
  });
  // Also run immediately if DOM is already ready
  if (document.readyState !== 'loading') {
    injectToggle();
    applyLang(currentLang);
  }

  window.setLanguage = applyLang;
})();

/* ── Converter-page dropzone: drag-over pulse + desi copy ───────────────────
   Enhances .dropzone elements on all tool pages with visual drag feedback.
   The hero dropzone on index.html gets its own CSS-driven animation. */
(function() {
  var dz = document.querySelector('.dropzone');
  if (!dz) return;

  dz.addEventListener('dragover', function(e) {
    e.preventDefault();
    dz.classList.add('drag-over');
  });
  dz.addEventListener('dragleave', function() {
    dz.classList.remove('drag-over');
  });
  dz.addEventListener('drop', function() {
    dz.classList.remove('drag-over');
  });

  // Add a bouncing arrow hint below the dropzone icon if no animation exists yet
  var icon = dz.querySelector('.dropzone-icon');
  if (icon && !dz.querySelector('.dz-drop-label')) {
    var label = document.createElement('p');
    label.className = 'dz-drop-label sub';
    label.style.cssText = 'font-size:0.8rem;margin-top:0.5rem;color:var(--ink-muted);';
    label.textContent = 'Yahan drop karo ya click karke select karo 📂';
    var existingSub = dz.querySelector('p.sub');
    if (!existingSub) icon.parentNode.insertBefore(label, icon.nextSibling);
  }
})();

/* ── Hero dropzone drag-over class (index.html) ─────────────────────────── */
(function() {
  var hdz = document.getElementById('hero-dropzone');
  if (!hdz) return;
  document.addEventListener('dragover', function(e) {
    if (e.dataTransfer && e.dataTransfer.types && Array.from(e.dataTransfer.types).indexOf('Files') !== -1) {
      hdz.classList.add('drag-over');
    }
  });
  document.addEventListener('dragleave', function(e) {
    if (e.relatedTarget === null || !document.body.contains(e.relatedTarget)) {
      hdz.classList.remove('drag-over');
    }
  });
  document.addEventListener('drop', function() {
    hdz.classList.remove('drag-over');
  });
})();

/* Hash-scroll fix
   When arriving from another page with a #hash, some browsers land at the
   top or cut off the target under the sticky nav. Re-scroll after load. */
(function () {
  function scrollToHash() {
    const hash = window.location.hash;
    if (!hash) return;
    const target = document.querySelector(hash);
    if (!target) return;
    // Temporarily disable smooth scroll so the jump is instant & reliable
    document.documentElement.style.scrollBehavior = 'auto';
    target.scrollIntoView();
    // Restore smooth scroll
    requestAnimationFrame(() => {
      document.documentElement.style.scrollBehavior = '';
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', scrollToHash);
  } else {
    scrollToHash();
  }
})();

/* ── Smart cross-tool internal linking ──────────────────────────────────────
   Injects a "You might also like" pill-strip at the bottom of converter/AI
   tool pages. Groups tools by category so related tools appear together.
   Signals topical authority to Google and reduces bounce rate. */
(function() {
  var isToolPage = window.location.pathname.includes('/convert/') ||
                   window.location.pathname.includes('/ai/');
  if (!isToolPage) return;

  /* Category clusters → related tools to surface */
  var clusters = {
    image: [
      {t:'HEIC → JPG',u:'heic-to-jpg.html'},
      {t:'Image Compressor',u:'image-compress.html'},
      {t:'Image Converter',u:'image-converter.html'},
      {t:'Image Resize',u:'image-resize.html'},
      {t:'Image Cropper',u:'image-cropper.html'},
      {t:'JPG → WebP',u:'jpg-to-webp.html'},
      {t:'WebP → JPG',u:'webp-to-jpg.html'},
      {t:'SVG → PNG',u:'svg-to-png.html'},
      {t:'Background Remover',u:'../ai/bg-remove.html'},
      {t:'Remove EXIF Metadata',u:'image-metadata.html'},
      {t:'OCR (Image to Text)',u:'ocr.html'},
      {t:'Meme Generator',u:'meme-generator.html'},
      {t:'Favicon Generator',u:'favicon-generator.html'},
      {t:'Color Palette',u:'color-palette.html'},
    ],
    pdf: [
      {t:'PDF Merge & Split',u:'pdf-merge.html'},
      {t:'PDF Compressor',u:'pdf-compressor.html'},
      {t:'PDF Rotate',u:'pdf-rotate.html'},
      {t:'PDF Watermark',u:'pdf-watermark.html'},
      {t:'Images to PDF',u:'image-to-pdf.html'},
      {t:'PDF to Images',u:'pdf-to-image.html'},
    ],
    media: [
      {t:'Video Compressor',u:'video-compressor.html'},
      {t:'Video Converter',u:'video-converter.html'},
      {t:'Video Trimmer',u:'video-trimmer.html'},
      {t:'Video → Audio',u:'video-to-audio.html'},
      {t:'Video → GIF',u:'video-to-gif.html'},
      {t:'GIF → Video',u:'gif-to-video.html'},
      {t:'Audio Converter',u:'audio-converter.html'},
      {t:'Text to Speech',u:'text-to-speech.html'},
      {t:'Speech to Text',u:'speech-to-text.html'},
      {t:'SRT → VTT',u:'srt-to-vtt.html'},
    ],
    data: [
      {t:'JSON Formatter',u:'json-formatter.html'},
      {t:'JSON → CSV',u:'json-to-csv.html'},
      {t:'CSV → Excel',u:'csv-to-excel.html'},
      {t:'JSON → YAML',u:'json-to-yaml.html'},
      {t:'XML → JSON',u:'xml-to-json.html'},
      {t:'Markdown → HTML',u:'markdown-to-html.html'},
      {t:'Regex Tester',u:'regex-tester.html'},
      {t:'Diff Checker',u:'diff-checker.html'},
      {t:'Code Beautifier',u:'code-beautifier.html'},
      {t:'Base64',u:'base64.html'},
      {t:'URL Tools',u:'url-tools.html'},
      {t:'Word Counter',u:'word-counter.html'},
      {t:'Readability Analyzer',u:'readability-analyzer.html'},
      {t:'Timestamp Converter',u:'timestamp-converter.html'},
    ],
    calc: [
      {t:'SIP Calculator',u:'sip-calculator.html'},
      {t:'EMI Calculator',u:'emi-calculator.html'},
      {t:'Income Tax Calc',u:'income-tax-calculator.html'},
      {t:'GST Calculator',u:'gst-calculator.html'},
      {t:'BMI Calculator',u:'bmi-calculator.html'},
      {t:'Age Calculator',u:'age-calculator.html'},
      {t:'Loan Calculator',u:'loan-calculator.html'},
      {t:'Compound Interest',u:'compound-interest-calculator.html'},
      {t:'CAGR Calculator',u:'cagr-calculator.html'},
      {t:'Percentage Calc',u:'percentage-calculator.html'},
      {t:'Retirement Calc',u:'retirement-calculator.html'},
      {t:'Debt Payoff',u:'debt-payoff-calculator.html'},
    ],
    util: [
      {t:'QR Code Generator',u:'qr-code.html'},
      {t:'QR Code Scanner',u:'qr-scanner.html'},
      {t:'Password Generator',u:'password-gen.html'},
      {t:'Barcode Generator',u:'barcode-generator.html'},
      {t:'Barcode Scanner',u:'barcode-scanner.html'},
      {t:'Unit Converter',u:'unit-converter.html'},
      {t:'Currency Converter',u:'currency-converter.html'},
      {t:'Color Converter',u:'color-converter.html'},
      {t:'Hash Generator',u:'hash-generator.html'},
      {t:'Resume Builder',u:'resume-builder.html'},
      {t:'Invoice Generator',u:'invoice-generator.html'},
      {t:'Receipt Generator',u:'receipt-generator.html'},
      {t:'Pomodoro Timer',u:'pomodoro-timer.html'},
      {t:'Translate',u:'translate.html'},
    ]
  };

  /* Map filename fragments → category */
  var catMap = {
    'heic':'image','image':'image','jpg':'image','webp':'image','png':'image','svg':'image','color-p':'image','meme':'image','favicon':'image','ocr':'image','metadata':'image',
    'pdf':'pdf',
    'video':'media','audio':'media','speech':'media','srt':'media','gif-to':'media',
    'json':'data','csv':'data','yaml':'data','xml':'data','markdown':'data','regex':'data','diff':'data','code-b':'data','base64':'data','url-tool':'data','word-c':'data','readab':'data','timestamp':'data',
    'sip':'calc','emi':'calc','tax':'calc','gst':'calc','bmi':'calc','age-':'calc','loan':'calc','compound':'calc','cagr':'calc','percent':'calc','retire':'calc','debt':'calc','lead-v':'calc','churn':'calc','adsense':'calc',
    'qr':'util','password':'util','barcode':'util','unit-':'util','currency':'util','color-c':'util','hash':'util','resume':'util','invoice':'util','receipt':'util','pomodoro':'util','translate':'util','text-':'util','serp':'util','secret':'util'
  };

  var cur = window.location.pathname.toLowerCase();
  var cat = null;
  for (var k in catMap) {
    if (cur.indexOf(k) !== -1) { cat = catMap[k]; break; }
  }
  if (!cat) cat = 'util';

  var candidates = clusters[cat] || [];
  var related = candidates.filter(function(c) {
    return cur.indexOf(c.u.replace('../','').replace('.html','')) === -1;
  }).slice(0, 6);

  if (!related.length) return;

  /* Build the widget */
  var section = document.createElement('section');
  section.className = 'related-tools';
  section.setAttribute('aria-label', 'Related free tools');
  var heading = document.createElement('h3');
  heading.textContent = 'Related free tools';
  section.appendChild(heading);

  var grid = document.createElement('div');
  grid.className = 'related-tools-grid';
  grid.style.cssText = 'display:flex;flex-wrap:wrap;gap:0.6rem;margin-top:0.75rem';

  related.forEach(function(r) {
    var base = cur.includes('/ai/') ? '' : '../convert/';
    if (r.u.startsWith('../')) base = '';
    var a = document.createElement('a');
    a.href = base + r.u.replace('../convert/','../convert/').replace('../ai/','../ai/');
    a.textContent = r.t;
    a.className = 'related-tool-link';
    a.style.cssText = 'display:inline-flex;align-items:center;padding:0.4rem 0.9rem;border:1px solid var(--line,#E8E1D3);border-radius:999px;font-size:0.82rem;color:var(--ink,#141413);text-decoration:none;background:var(--surface,#fff);transition:border-color 0.15s,transform 0.15s';
    a.onmouseover = function(){this.style.borderColor='var(--indigo,#7051BC)';this.style.transform='translateY(-1px)';};
    a.onmouseout = function(){this.style.borderColor='var(--line,#E8E1D3)';this.style.transform='';};
    grid.appendChild(a);
  });
  section.appendChild(grid);

  /* Find best insertion point — after .related-tools if exists, else before footer */
  var existing = document.querySelector('.related-tools');
  if (existing) {
    /* page already has a related section — don't duplicate */
    return;
  }
  var footer = document.querySelector('footer.footer, footer');
  var main   = document.querySelector('main');
  if (footer && footer.parentNode) {
    footer.parentNode.insertBefore(section, footer);
  } else if (main) {
    main.appendChild(section);
  }
})();
