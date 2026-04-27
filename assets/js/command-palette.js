/* Desi Jugad — global command palette (⌘K from any page).
   Self-injects DOM. Uses window.DJ_ALL_TOOLS from tools-data.js.
   If an existing #cmd-overlay is on the page (e.g. the homepage), it is reused. */
(function () {
  'use strict';
  if (window.djPalette) return;
  if (!window.DJ_ALL_TOOLS) return; // wait until tools-data.js has loaded

  /* If the homepage's inline palette is already wired (defines cpOpen + an existing
     #cmd-overlay with #cmd-results), defer to it: only expose djPalette as an alias
     and skip our own DOM injection / keydown binding to avoid double-fire. */
  var existingOverlay = document.getElementById('cmd-overlay');
  var existingResults = document.getElementById('cmd-results');
  if (typeof window.cpOpen === 'function' && existingOverlay && existingResults) {
    window.djPalette = { open: window.cpOpen, close: function(){ existingOverlay.classList.remove('open'); } };
    return;
  }

  var TOOLS = window.DJ_ALL_TOOLS;

  /* Inject palette DOM if not already present */
  function ensureDOM() {
    var overlay = document.getElementById('cmd-overlay');
    if (overlay) return overlay;

    overlay = document.createElement('div');
    overlay.id = 'cmd-overlay';
    overlay.className = 'dj-cmd-overlay';
    overlay.innerHTML =
      '<div class="dj-cmd-modal" role="dialog" aria-label="Search tools">' +
        '<div class="dj-cmd-input-wrap">' +
          '<svg class="dj-cmd-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>' +
          '<input id="cmd-input" type="search" placeholder="Search 80+ tools…" autocomplete="off" autocorrect="off" spellcheck="false">' +
          '<kbd class="dj-cmd-esc">esc</kbd>' +
        '</div>' +
        '<div id="cmd-results" class="dj-cmd-results"></div>' +
      '</div>';
    document.body.appendChild(overlay);
    injectStyles();
    return overlay;
  }

  function injectStyles() {
    if (document.getElementById('dj-cmd-styles')) return;
    var s = document.createElement('style');
    s.id = 'dj-cmd-styles';
    s.textContent = [
      '.dj-cmd-overlay { position:fixed; inset:0; background:color-mix(in srgb, var(--ink) 35%, transparent); backdrop-filter:blur(6px); z-index:9999; display:none; align-items:flex-start; justify-content:center; padding:10vh 1rem 1rem; }',
      '.dj-cmd-overlay.open { display:flex; }',
      '.dj-cmd-modal { width:100%; max-width:640px; background:var(--surface); border:1px solid var(--line); border-radius:var(--radius); box-shadow:var(--shadow-lg); overflow:hidden; }',
      '.dj-cmd-input-wrap { display:flex; align-items:center; gap:0.75rem; padding:0.95rem 1.1rem; border-bottom:1px solid var(--line); }',
      '.dj-cmd-icon { width:18px; height:18px; color:var(--ink-muted); flex-shrink:0; }',
      '.dj-cmd-input-wrap input { flex:1; background:none; border:none; outline:none; font-size:1.05rem; color:var(--ink); font-family:var(--font-sans); }',
      '.dj-cmd-esc { font-family:var(--font-mono); font-size:0.7rem; padding:0.15rem 0.4rem; border:1px solid var(--line); border-radius:4px; color:var(--ink-muted); background:color-mix(in srgb, var(--ink) 4%, var(--surface)); }',
      '.dj-cmd-results { max-height:60vh; overflow-y:auto; padding:0.5rem; }',
      '.dj-cmd-section-label { font-size:0.7rem; font-family:var(--font-mono); text-transform:uppercase; letter-spacing:0.1em; color:var(--ink-muted); padding:0.6rem 0.7rem 0.3rem; }',
      '.dj-cmd-item { display:flex; align-items:center; gap:0.85rem; padding:0.6rem 0.7rem; border-radius:var(--radius-sm); cursor:pointer; transition:background 0.12s; }',
      '.dj-cmd-item.selected, .dj-cmd-item:hover { background:color-mix(in srgb, var(--indigo) 8%, transparent); }',
      '.dj-cmd-item-icon { width:36px; height:36px; flex-shrink:0; display:flex; align-items:center; justify-content:center; background:color-mix(in srgb, var(--ink) 5%, var(--surface)); border-radius:var(--radius-sm); font-size:1.1rem; }',
      '.dj-cmd-item-text { flex:1; min-width:0; }',
      '.dj-cmd-item-name { font-size:0.95rem; font-weight:500; color:var(--ink); }',
      '.dj-cmd-item-desc { font-size:0.82rem; color:var(--ink-muted); white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }',
      '.dj-cmd-item-enter { font-family:var(--font-mono); font-size:0.78rem; color:var(--ink-muted); opacity:0; transition:opacity 0.12s; }',
      '.dj-cmd-item.selected .dj-cmd-item-enter { opacity:1; }',
      '.dj-cmd-empty { padding:1.5rem 1rem; text-align:center; color:var(--ink-muted); font-size:0.92rem; }',
      '@media (max-width: 600px) { .dj-cmd-overlay { padding-top:5vh; } .dj-cmd-input-wrap input { font-size:1rem; } }',
    ].join('\n');
    document.head.appendChild(s);
  }

  var overlay, input, resultsEl;
  var selected = -1;
  var filtered = [];
  var open = false;

  function init() {
    overlay = ensureDOM();
    input = document.getElementById('cmd-input');
    resultsEl = document.getElementById('cmd-results');

    /* If the page used the original (pre-modular) structure, give it our class */
    if (!overlay.classList.contains('dj-cmd-overlay')) overlay.classList.add('dj-cmd-overlay');

    input.addEventListener('input', render);
    overlay.addEventListener('click', function (e) { if (e.target === overlay) close(); });
  }

  function isOpen() { return overlay.classList.contains('open'); }

  function openPalette() {
    if (!overlay) init();
    overlay.classList.add('open');
    open = true;
    input.value = '';
    selected = -1;
    render();
    setTimeout(function () { input.focus(); }, 40);
  }
  function close() { if (overlay) overlay.classList.remove('open'); open = false; }

  function itemHTML(t) {
    return '<div class="dj-cmd-item" data-url="' + t.url + '">' +
      '<div class="dj-cmd-item-icon">' + (t.icon || '🔧') + '</div>' +
      '<div class="dj-cmd-item-text">' +
        '<div class="dj-cmd-item-name">' + escape(t.name) + '</div>' +
        '<div class="dj-cmd-item-desc">' + escape(t.desc || '') + '</div>' +
      '</div>' +
      '<div class="dj-cmd-item-enter">↵</div>' +
    '</div>';
  }

  function render() {
    var q = input.value.trim().toLowerCase();
    var html = '';
    var recents = (window.djRecent ? window.djRecent.read() : []).slice(0, 4);
    selected = -1;

    if (!q) {
      if (recents.length) {
        html += '<div class="dj-cmd-section-label">Jump back in</div>';
        html += recents.map(function (r) {
          return itemHTML({ name: r.name, desc: '', icon: r.icon, url: r.url });
        }).join('');
      }
      filtered = TOOLS;
      html += '<div class="dj-cmd-section-label">All tools</div>';
      html += TOOLS.map(itemHTML).join('');
    } else {
      filtered = TOOLS.filter(function (t) {
        var hay = (t.name + ' ' + (t.desc || '')).toLowerCase();
        return hay.indexOf(q) !== -1;
      });
      if (filtered.length) {
        html += filtered.map(itemHTML).join('');
      } else {
        html += '<div class="dj-cmd-empty">No tools match "' + escape(q) + '"</div>';
      }
    }

    resultsEl.innerHTML = html;
    resultsEl.querySelectorAll('.dj-cmd-item').forEach(function (el, i) {
      el.addEventListener('click', function () { window.location.href = el.dataset.url; });
      el.addEventListener('mouseenter', function () { selected = i; highlight(); });
    });
  }

  function highlight() {
    var items = resultsEl.querySelectorAll('.dj-cmd-item');
    items.forEach(function (el, i) { el.classList.toggle('selected', i === selected); });
    var sel = resultsEl.querySelector('.dj-cmd-item.selected');
    if (sel) sel.scrollIntoView({ block: 'nearest' });
  }

  function escape(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c];
    });
  }

  /* Global keybindings */
  document.addEventListener('keydown', function (e) {
    var meta = e.metaKey || e.ctrlKey;
    if (meta && (e.key === 'k' || e.key === 'K')) {
      e.preventDefault();
      if (isOpen()) close(); else openPalette();
      return;
    }
    if (!overlay || !isOpen()) return;
    var items = resultsEl.querySelectorAll('.dj-cmd-item');
    if (e.key === 'Escape') { close(); }
    else if (e.key === 'ArrowDown') { e.preventDefault(); selected = Math.min(selected + 1, items.length - 1); highlight(); }
    else if (e.key === 'ArrowUp')   { e.preventDefault(); selected = Math.max(selected - 1, 0); highlight(); }
    else if (e.key === 'Enter') {
      if (selected >= 0 && items[selected]) window.location.href = items[selected].dataset.url;
      else if (filtered.length) window.location.href = filtered[0].url;
    }
  });

  /* Public API */
  window.djPalette = { open: openPalette, close: close };
  /* Backwards-compat for existing inline bindings on the homepage */
  if (!window.cpOpen) window.cpOpen = openPalette;

  /* Hook a search input on the page (if it exists) to open palette on click */
  document.addEventListener('DOMContentLoaded', function () {
    init();
    var search = document.getElementById('toolSearch');
    if (search && !search.dataset.djHooked) {
      search.dataset.djHooked = '1';
      search.addEventListener('mousedown', function (e) { e.preventDefault(); openPalette(); });
    }
    /* Floating ⌘K trigger button when not on the homepage */
    if (!document.getElementById('dj-palette-fab') && !document.querySelector('.hero')) {
      var fab = document.createElement('button');
      fab.id = 'dj-palette-fab';
      fab.setAttribute('aria-label', 'Search all tools (⌘K)');
      fab.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>';
      fab.style.cssText = 'position:fixed;bottom:1.25rem;right:1.25rem;width:46px;height:46px;border-radius:50%;border:1px solid var(--line);background:var(--surface);color:var(--ink);box-shadow:var(--shadow);cursor:pointer;z-index:9990;display:flex;align-items:center;justify-content:center;transition:transform .15s;';
      fab.addEventListener('mouseenter', function(){ fab.style.transform = 'scale(1.05)'; });
      fab.addEventListener('mouseleave', function(){ fab.style.transform = ''; });
      fab.addEventListener('click', openPalette);
      document.body.appendChild(fab);
    }
  });
  if (document.readyState !== 'loading') init();
})();
