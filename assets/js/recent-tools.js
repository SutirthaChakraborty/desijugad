/* Desi Jugad — recent-tools tracking + UI strip.
   Auto-records the current page if it matches a tool URL.
   Renders a "Jump back in" strip into #dj-recent-strip if present. */
(function () {
  'use strict';
  if (window.djRecent) return;

  var KEY = 'dj_recent';

  function read() {
    try { return JSON.parse(localStorage.getItem(KEY) || '[]'); }
    catch (e) { return []; }
  }
  function write(list) {
    try { localStorage.setItem(KEY, JSON.stringify(list)); } catch (e) {}
  }
  function record(tool) {
    if (!tool || !tool.url) return;
    var list = read().filter(function (x) { return basename(x.url) !== basename(tool.url); });
    list.unshift({ name: tool.name, url: tool.url, icon: tool.icon || '🔧', ts: Date.now() });
    list = list.slice(0, 10);
    write(list);
  }
  function basename(url) {
    var u = (url || '').split('?')[0].split('#')[0];
    var i = u.lastIndexOf('/');
    return (i >= 0 ? u.slice(i + 1) : u) || 'index.html';
  }

  /* Auto-record on tool page visit */
  function autoRecord() {
    if (!window.DJ_ALL_TOOLS) return;
    var here = window.location.pathname.split('/').pop() || 'index.html';
    var match = window.DJ_ALL_TOOLS.find(function (t) { return basename(t.url) === here; });
    if (match) {
      record({ name: match.name, url: match.url, icon: match.icon });
    }
  }

  /* Render recent strip into #dj-recent-strip (if present on the current page) */
  function renderStrip() {
    var host = document.getElementById('dj-recent-strip');
    if (!host) return;
    var list = read().slice(0, 6);
    if (!list.length) { host.style.display = 'none'; return; }
    var P = (window.location.pathname.indexOf('/convert/') !== -1 ||
             window.location.pathname.indexOf('/ai/') !== -1 ||
             window.location.pathname.indexOf('/blog/') !== -1) ? '../' : '';
    host.innerHTML =
      '<div class="dj-recent-label">Jump back in</div>' +
      '<div class="dj-recent-chips">' +
      list.map(function (t) {
        // Normalize URL for current page depth
        var href = t.url;
        if (href && !/^(https?:|\/)/.test(href)) {
          // Strip any leading "../" and re-prefix
          href = href.replace(/^(\.\.\/)+/, '');
          href = P + href;
        }
        return '<a href="' + href + '" class="dj-recent-chip">' +
               '<span class="dj-recent-icon">' + (t.icon || '🔧') + '</span>' +
               '<span class="dj-recent-name">' + esc(t.name) + '</span></a>';
      }).join('') +
      '</div>';
    host.style.display = '';
  }

  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) {
    return { '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c];
  }); }

  window.djRecent = { read: read, record: record, render: renderStrip };

  document.addEventListener('DOMContentLoaded', function () {
    autoRecord();
    renderStrip();
  });
  if (document.readyState !== 'loading') {
    autoRecord();
    renderStrip();
  }
})();
