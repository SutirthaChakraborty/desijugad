/* ==========================================================================
   Desi Jugad — AI Studio shared helper
   Keys are stored in localStorage only. Never sent to any Desi Jugad server.
   ========================================================================== */

const STORAGE_KEYS = 'dj_ai_keys_v1';
const STORAGE_USAGE = 'dj_ai_usage_v1';
const PROXY_BASE = '/api/proxy';
const DEFAULT_SUNO_PROVIDER = 'https://api.sunoapi.org';

/* ── Custom error types ───────────────────────────────────────────────────── */
class NoKeyError extends Error {
  constructor(service) {
    super(`No API key set for ${service}`);
    this.name = 'NoKeyError';
    this.service = service;
  }
}
window.NoKeyError = NoKeyError;

/* ── Key management ──────────────────────────────────────────────────────── */
function loadKeys() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS) || '{}');
  } catch { return {}; }
}
function saveKeys(keys) {
  try { localStorage.setItem(STORAGE_KEYS, JSON.stringify(keys)); } catch {}
}

window.AIKeys = {
  get(service) {
    return loadKeys()[service] || null;
  },
  set(service, value) {
    const trimmed = (value || '').trim();
    if (!trimmed) return;
    const keys = loadKeys();
    keys[service] = trimmed;
    saveKeys(keys);
  },
  clear(service) {
    const keys = loadKeys();
    delete keys[service];
    saveKeys(keys);
  },
  clearAll() {
    try { localStorage.removeItem(STORAGE_KEYS); } catch {}
  },
  mask(key) {
    if (!key || key.length < 8) return '••••••••';
    return key.slice(0, 4) + '••••' + key.slice(-4);
  },
};

window.getKey = function(service) {
  return window.AIKeys.get(service);
};

window.setKey = function(service, value) {
  window.AIKeys.set(service, value);
};

window.clearKey = function(service) {
  window.AIKeys.clear(service);
};

window.clearAllKeys = function() {
  window.AIKeys.clearAll();
};

window.maskKey = function(key) {
  return window.AIKeys.mask(key);
};

/* ── Suno provider URL (user can override) ───────────────────────────────── */
window.getSunoBase = function() {
  try {
    return localStorage.getItem('dj_suno_provider') || DEFAULT_SUNO_PROVIDER;
  } catch { return DEFAULT_SUNO_PROVIDER; }
};
window.setSunoProvider = function(url) {
  try { localStorage.setItem('dj_suno_provider', url); } catch {}
};

/* ── Usage logging ───────────────────────────────────────────────────────── */
window.logUsage = function(service, model, prompt, costEstimate) {
  try {
    const log = JSON.parse(localStorage.getItem(STORAGE_USAGE) || '[]');
    log.unshift({
      ts: new Date().toISOString(),
      service,
      model,
      prompt: (prompt || '').slice(0, 80),
      cost: costEstimate || 0,
    });
    if (log.length > 200) log.length = 200;
    localStorage.setItem(STORAGE_USAGE, JSON.stringify(log));
  } catch {}
};

window.getUsageLog = function() {
  try { return JSON.parse(localStorage.getItem(STORAGE_USAGE) || '[]'); } catch { return []; }
};

window.clearUsageLog = function() {
  try { localStorage.removeItem(STORAGE_USAGE); } catch {}
};

/* ── Error toast UI ──────────────────────────────────────────────────────── */
window.showErrorToast = function(title, detail, action) {
  let wrap = document.getElementById('ai-error-toast');
  if (!wrap) {
    wrap = document.createElement('div');
    wrap.id = 'ai-error-toast';
    wrap.style.cssText = 'position:fixed;bottom:2rem;left:50%;transform:translateX(-50%) translateY(100px);background:var(--danger);color:#fff;padding:1rem 1.5rem;border-radius:var(--radius);box-shadow:var(--shadow-lg);z-index:9999;max-width:480px;width:calc(100% - 2rem);opacity:0;transition:all 0.4s var(--ease);display:flex;gap:1rem;align-items:flex-start;font-size:0.92rem;';
    document.body.appendChild(wrap);
  }
  let actionFn = action?.fn;
  if (typeof actionFn === 'string' && typeof window.DJ_RESOLVE_PATH === 'function') {
    actionFn = actionFn.replace(/window\.location\s*=\s*['\"]([^'\"]+)['\"]/g, (_, path) => {
      return `window.location='${window.DJ_RESOLVE_PATH(path)}'`;
    });
  }
  const actionHtml = action
    ? `<button onclick="${actionFn}" style="background:rgba(255,255,255,0.2);border:1px solid rgba(255,255,255,0.4);color:#fff;padding:0.3rem 0.75rem;border-radius:6px;font-size:0.82rem;cursor:pointer;margin-top:0.4rem;">${action.label}</button>`
    : '';
  wrap.innerHTML = `<div style="flex:1"><strong>${title}</strong><div style="margin-top:0.25rem;opacity:0.85;">${detail}</div>${actionHtml}</div><button onclick="this.parentElement.style.opacity=0" style="background:none;border:none;color:#fff;font-size:1.2rem;cursor:pointer;line-height:1;padding:0">×</button>`;
  requestAnimationFrame(() => {
    wrap.style.transform = 'translateX(-50%) translateY(0)';
    wrap.style.opacity = '1';
  });
  clearTimeout(wrap._timer);
  wrap._timer = setTimeout(() => { wrap.style.opacity = '0'; wrap.style.transform = 'translateX(-50%) translateY(100px)'; }, 7000);
};

/* ── Redirect to settings if no key ─────────────────────────────────────── */
function requireKey(service) {
  const key = window.AIKeys.get(service);
  if (!key) {
    window.showErrorToast(
      'API key missing',
      `Add your ${service} key in settings to continue.`,
      { label: 'Go to Settings →', fn: `window.location='/ai/settings.html?need=${service}'` }
    );
    throw new NoKeyError(service);
  }
  return key;
}

/* ── Replicate API helpers ───────────────────────────────────────────────── */
window.Replicate = {
  async _proxy(method, path, body, key) {
    const url = `${PROXY_BASE}?target=replicate&path=${encodeURIComponent(path)}`;
    const opts = {
      method,
      headers: {
        'Authorization': `Bearer ${key}`,
        'Content-Type': 'application/json',
        'Prefer': 'wait',
      },
    };
    if (body) opts.body = JSON.stringify(body);
    const resp = await fetch(url, opts);
    if (resp.status === 401) throw Object.assign(new Error('Key rejected'), { code: 401 });
    if (resp.status === 402) throw Object.assign(new Error('Insufficient credits'), { code: 402 });
    if (resp.status === 429) throw Object.assign(new Error('Rate limited'), { code: 429 });
    if (!resp.ok) throw Object.assign(new Error('Replicate error ' + resp.status), { code: resp.status });
    return resp.json();
  },

  async poll(id, key, { onProgress, timeoutMs = 600000 } = {}) {
    const start = Date.now();
    while (true) {
      if (Date.now() - start > timeoutMs) throw Object.assign(new Error('Timed out'), { code: 'timeout' });
      await new Promise(r => setTimeout(r, 2500));
      const data = await this._proxy('GET', `/v1/predictions/${id}`, null, key);
      if (onProgress) onProgress({ status: data.status, logs: data.logs, output: data.output });
      if (data.status === 'succeeded') return data.output;
      if (data.status === 'failed')   throw Object.assign(new Error(data.error || 'Prediction failed'), { code: 'failed' });
      if (data.status === 'canceled') throw Object.assign(new Error('Prediction canceled'), { code: 'canceled' });
    }
  },

  async run(modelSlug, input, { onProgress, timeoutMs } = {}) {
    const key = requireKey('replicate');
    const [owner, name] = modelSlug.split('/');
    let data = await this._proxy('POST', `/v1/models/${owner}/${name}/predictions`, { input }, key);
    if (data.status === 'succeeded') return data.output;
    return this.poll(data.id, key, { onProgress, timeoutMs });
  },

  async runCustom(version, input, { onProgress, timeoutMs } = {}) {
    const key = requireKey('replicate');
    let data = await this._proxy('POST', '/v1/predictions', { version, input }, key);
    if (data.status === 'succeeded') return data.output;
    return this.poll(data.id, key, { onProgress, timeoutMs });
  },

  async cancel(id) {
    const key = window.AIKeys.get('replicate');
    if (!key) return;
    await this._proxy('POST', `/v1/predictions/${id}/cancel`, {}, key);
  },

  async getAccount() {
    const key = requireKey('replicate');
    return this._proxy('GET', '/v1/account', null, key);
  },
};

window.replicate = window.Replicate;

/* ── Suno API helpers ────────────────────────────────────────────────────── */
window.Suno = {
  _sunoProxy(method, path, body, key) {
    const base = window.getSunoBase();
    const params = new URLSearchParams({
      target: 'suno',
      path,
    });
    if (base && base !== DEFAULT_SUNO_PROVIDER) params.set('base', base);
    const url = `${PROXY_BASE}?${params.toString()}`;
    const opts = {
      method,
      headers: { 'Authorization': `Bearer ${key}`, 'X-API-Key': key, 'Content-Type': 'application/json' },
    };
    if (body) opts.body = JSON.stringify(body);
    return fetch(url, opts).then(r => r.json());
  },

  async generate(input, { onProgress, timeoutMs = 900000 } = {}) {
    const key = requireKey('suno');
    const resp = await this._sunoProxy('POST', '/api/v1/generate', input, key);
    if (!resp.data?.taskId) throw new Error(resp.msg || 'Suno error');
    const taskId = resp.data.taskId;
    const start = Date.now();
    while (true) {
      if (Date.now() - start > timeoutMs) throw Object.assign(new Error('Suno timed out'), { code: 'timeout' });
      await new Promise(r => setTimeout(r, 3000));
      const poll = await this._sunoProxy('GET', `/api/v1/generate/${taskId}`, null, key);
      const status = poll.data?.status;
      if (onProgress) onProgress({ status, data: poll.data });
      if (status === 'SUCCESS') return poll.data.response?.sunoData || [];
      if (status === 'FAILED')  throw new Error('Suno generation failed');
    }
  },

  async generateLyrics(prompt) {
    const key = requireKey('suno');
    const resp = await this._sunoProxy('POST', '/api/v1/lyrics', { prompt }, key);
    return resp.data;
  },

  async extend(audioId, prompt, durationSeconds = 60) {
    const key = requireKey('suno');
    return this._sunoProxy('POST', '/api/v1/extend', { audioId, prompt, durationSeconds }, key);
  },

  async generateMusicVideo(taskId, audioId, { onProgress, timeoutMs = 900000 } = {}) {
    const key = requireKey('suno');
    const resp = await this._sunoProxy('POST', '/api/v1/mp4/generate', {
      taskId, audioId, author: 'Desi Jugad User', domainName: 'desijugad.co.in',
    }, key);
    const videoTaskId = resp.data?.taskId;
    if (!videoTaskId) throw new Error('No video task ID from Suno');
    const start = Date.now();
    while (true) {
      if (Date.now() - start > timeoutMs) throw Object.assign(new Error('Video timed out'), { code: 'timeout' });
      await new Promise(r => setTimeout(r, 5000));
      const poll = await this._sunoProxy('GET', `/api/v1/mp4/record-info?taskId=${videoTaskId}`, null, key);
      if (onProgress) onProgress({ data: poll.data });
      if (poll.data?.videoUrl) return poll.data.videoUrl;
    }
  },

  async getCredits() {
    const key = window.AIKeys.get('suno');
    if (!key) return null;
    const resp = await this._sunoProxy('GET', '/api/v1/credit', null, key);
    return resp.data?.credits ?? null;
  },
};

window.suno = window.Suno;

/* ── Upload temp file (for Replicate audio input) ────────────────────────── */
window.uploadTempFile = async function(file, { onStatus } = {}) {
  if (onStatus) onStatus('Uploading audio to tmpfiles.org…');
  try {
    const form = new FormData();
    form.append('file', file);
    const resp = await fetch('https://tmpfiles.org/api/v1/upload', { method: 'POST', body: form });
    const data = await resp.json();
    if (data.data?.url) {
      const rawUrl = data.data.url.replace('tmpfiles.org/', 'tmpfiles.org/dl/');
      if (onStatus) onStatus('Audio hosted at tmpfiles.org (1-hour link)');
      return rawUrl;
    }
  } catch {}
  if (onStatus) onStatus('tmpfiles.org failed, trying file.io…');
  try {
    const form = new FormData();
    form.append('file', file);
    const resp = await fetch('https://file.io/?expires=1d', { method: 'POST', body: form });
    const data = await resp.json();
    if (data.link) {
      if (onStatus) onStatus('Audio hosted at file.io (24-hour link)');
      return data.link;
    }
  } catch {}
  throw new Error('Could not host audio file — please paste a direct URL instead');
};

/* ── Error code → friendly message ──────────────────────────────────────── */
window.handleAIError = function(err, retryFn) {
  if (err instanceof NoKeyError) return;
  const code = err.code || 0;
  if (code === 401) {
    window.showErrorToast('Key rejected', 'Your API key was rejected. Check it in settings.', { label: 'Fix in Settings →', fn: "window.location='/ai/settings.html'" });
  } else if (code === 402) {
    window.showErrorToast('Out of credits', 'Top up your Replicate account to continue.', { label: 'Add credits →', fn: "window.open('https://replicate.com/account/billing')" });
  } else if (code === 429) {
    window.showErrorToast('Too many requests', 'Waiting 20 seconds then retrying…', null);
    if (retryFn) setTimeout(retryFn, 20000);
  } else if (code === 'timeout') {
    window.showErrorToast('Taking too long', 'This is taking longer than expected. Check your Replicate dashboard for the prediction status.', { label: 'Replicate Dashboard →', fn: "window.open('https://replicate.com/predictions')" });
  } else if (!navigator.onLine) {
    window.showErrorToast('You\'re offline', 'Generations need internet. Your offline converters still work.', null);
  } else {
    window.showErrorToast('Something went wrong', err.message || 'Replicate returned an error. Try again in a moment.', retryFn ? { label: 'Retry', fn: retryFn.toString() + '()' } : null);
  }
};

/* ── Offline banner ──────────────────────────────────────────────────────── */
(function() {
  function checkOnline() {
    let banner = document.getElementById('offline-banner');
    if (!navigator.onLine) {
      if (!banner) {
        banner = document.createElement('div');
        banner.id = 'offline-banner';
        banner.style.cssText = 'position:fixed;top:0;left:0;right:0;background:var(--danger);color:#fff;text-align:center;padding:0.6rem;font-size:0.9rem;z-index:9998;';
        banner.textContent = 'You\'re offline. Generations need internet. Your file converters still work.';
        document.body.prepend(banner);
      }
    } else if (banner) {
      banner.remove();
    }
  }
  window.addEventListener('online', checkOnline);
  window.addEventListener('offline', checkOnline);
  document.addEventListener('DOMContentLoaded', checkOnline);
})();
