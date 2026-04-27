/* Desi Jugad — theme (light / dark / system).
   Persists to localStorage under dj_theme.
   Auto-injects a toggle button into the nav bar. */
(function () {
  'use strict';
  if (window.djTheme) return;

  var KEY = 'dj_theme';
  var html = document.documentElement;

  function getStored() {
    try { return localStorage.getItem(KEY) || 'system'; } catch (e) { return 'system'; }
  }
  function setStored(v) {
    try { localStorage.setItem(KEY, v); } catch (e) {}
  }
  function systemPrefersDark() {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  }
  function effectiveTheme() {
    var t = getStored();
    if (t === 'system') return systemPrefersDark() ? 'dark' : 'light';
    return t;
  }
  function apply() {
    var eff = effectiveTheme();
    html.setAttribute('data-theme', eff);
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', eff === 'dark' ? '#141413' : '#7051BC');
  }
  function cycle() {
    var t = getStored();
    var next = t === 'system' ? 'dark' : t === 'dark' ? 'light' : 'system';
    setStored(next);
    apply();
    refreshButton();
  }

  function refreshButton() {
    var btn = document.getElementById('dj-theme-toggle');
    if (!btn) return;
    var t = getStored();
    var label = t === 'dark' ? '🌙' : t === 'light' ? '☀️' : '◐';
    var title = t === 'dark' ? 'Dark mode (click for light)' : t === 'light' ? 'Light mode (click for system)' : 'System mode (click for dark)';
    btn.textContent = label;
    btn.title = title;
    btn.setAttribute('aria-label', title);
  }

  function injectButton() {
    if (document.getElementById('dj-theme-toggle')) return;
    var navInner = document.querySelector('.nav-inner');
    if (!navInner) return;
    var btn = document.createElement('button');
    btn.id = 'dj-theme-toggle';
    btn.className = 'dj-theme-toggle';
    btn.style.cssText = 'background:none;border:1px solid var(--line);border-radius:50%;width:34px;height:34px;font-size:0.95rem;cursor:pointer;color:var(--ink);display:inline-flex;align-items:center;justify-content:center;transition:border-color .15s,transform .15s;margin-right:0.5rem;';
    btn.addEventListener('mouseenter', function(){ btn.style.borderColor = 'var(--indigo)'; });
    btn.addEventListener('mouseleave', function(){ btn.style.borderColor = 'var(--line)'; });
    btn.addEventListener('click', cycle);

    /* Insert before the menu-toggle (or lang-toggle if it exists) */
    var menuToggle = navInner.querySelector('.menu-toggle');
    var langToggle = navInner.querySelector('#lang-toggle');
    if (langToggle) navInner.insertBefore(btn, langToggle);
    else if (menuToggle) navInner.insertBefore(btn, menuToggle);
    else navInner.appendChild(btn);

    refreshButton();
  }

  /* Apply early to avoid flash */
  apply();

  /* React to system pref changes when theme is "system" */
  if (window.matchMedia) {
    var mq = window.matchMedia('(prefers-color-scheme: dark)');
    var onChange = function () { if (getStored() === 'system') apply(); };
    if (mq.addEventListener) mq.addEventListener('change', onChange);
    else if (mq.addListener) mq.addListener(onChange);
  }

  document.addEventListener('DOMContentLoaded', injectButton);
  if (document.readyState !== 'loading') injectButton();

  window.djTheme = { get: getStored, set: function(v){ setStored(v); apply(); refreshButton(); }, cycle: cycle };
})();
