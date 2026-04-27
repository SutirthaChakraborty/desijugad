/* ==========================================================================
   Desi Jugad — AI Studio shared helper (post-proxy rewrite)
   100% browser-direct: Gemini + Pollinations (free, no key) + optional HF.
   No Cloudflare Functions, no /api/proxy. Keys live in localStorage only.
   ========================================================================== */

const STORAGE_KEYS  = 'dj_ai_keys_v1';
const STORAGE_USAGE = 'dj_ai_usage_v1';

const GEMINI_BASE = 'https://generativelanguage.googleapis.com';
const POLLINATIONS_BASE = 'https://image.pollinations.ai';
const HF_BASE = 'https://api-inference.huggingface.co';

/* ── Custom error types ─────────────────────────────────────────────────── */
class NoKeyError extends Error {
  constructor(service) {
    super(`No API key set for ${service}`);
    this.name = 'NoKeyError';
    this.service = service;
  }
}
window.NoKeyError = NoKeyError;

/* ── Key management ─────────────────────────────────────────────────────── */
function loadKeys() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEYS) || '{}'); }
  catch { return {}; }
}
function saveKeys(keys) {
  try { localStorage.setItem(STORAGE_KEYS, JSON.stringify(keys)); } catch {}
}

window.AIKeys = {
  get(service)         { return loadKeys()[service] || null; },
  set(service, value)  {
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
  clearAll() { try { localStorage.removeItem(STORAGE_KEYS); } catch {} },
  mask(key)  {
    if (!key || key.length < 8) return '••••••••';
    return key.slice(0, 4) + '••••' + key.slice(-4);
  },
};

window.getKey       = (s)    => window.AIKeys.get(s);
window.setKey       = (s, v) => window.AIKeys.set(s, v);
window.clearKey     = (s)    => window.AIKeys.clear(s);
window.clearAllKeys = ()     => window.AIKeys.clearAll();
window.maskKey      = (k)    => window.AIKeys.mask(k);

/* ── Usage logging (local only) ─────────────────────────────────────────── */
window.logUsage = function(service, model, prompt, costEstimate) {
  try {
    const log = JSON.parse(localStorage.getItem(STORAGE_USAGE) || '[]');
    log.unshift({
      ts: new Date().toISOString(),
      service, model,
      prompt: (prompt || '').slice(0, 80),
      cost: costEstimate || 0,
    });
    if (log.length > 200) log.length = 200;
    localStorage.setItem(STORAGE_USAGE, JSON.stringify(log));
  } catch {}
};
window.getUsageLog   = () => { try { return JSON.parse(localStorage.getItem(STORAGE_USAGE) || '[]'); } catch { return []; } };
window.clearUsageLog = () => { try { localStorage.removeItem(STORAGE_USAGE); } catch {} };

/* ── Error toast UI ─────────────────────────────────────────────────────── */
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
    actionFn = actionFn.replace(/window\.location\s*=\s*['"]([^'"]+)['"]/g, (_, path) =>
      `window.location='${window.DJ_RESOLVE_PATH(path)}'`);
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
  wrap._timer = setTimeout(() => {
    wrap.style.opacity = '0';
    wrap.style.transform = 'translateX(-50%) translateY(100px)';
  }, 7000);
};

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

/* ── Helpers ────────────────────────────────────────────────────────────── */
function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => {
      const result = r.result || '';
      const idx = result.indexOf(',');
      resolve(idx >= 0 ? result.slice(idx + 1) : result);
    };
    r.onerror = reject;
    r.readAsDataURL(file);
  });
}
window.fileToBase64 = fileToBase64;

/* ── Gemini API (BYOK, browser-direct, CORS-friendly) ───────────────────── */
window.Gemini = {
  /**
   * Generate text via Gemini.
   * model: 'gemini-2.5-flash' | 'gemini-2.5-pro' (etc.)
   * parts: [{text}, {inlineData:{mimeType, data}}, ...] OR a plain string
   */
  async generateText(model, parts, { temperature, maxOutputTokens, system, signal } = {}) {
    const key = requireKey('gemini');
    const contents = [{
      role: 'user',
      parts: typeof parts === 'string' ? [{ text: parts }] : parts,
    }];
    const body = { contents, generationConfig: {} };
    if (typeof temperature === 'number')      body.generationConfig.temperature = temperature;
    if (typeof maxOutputTokens === 'number')  body.generationConfig.maxOutputTokens = maxOutputTokens;
    if (system) body.systemInstruction = { parts: [{ text: system }] };

    const url = `${GEMINI_BASE}/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(key)}`;
    const resp = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal,
    });
    if (resp.status === 401 || resp.status === 403) throw Object.assign(new Error('Key rejected'), { code: 401 });
    if (resp.status === 429) throw Object.assign(new Error('Rate limited'), { code: 429 });
    if (!resp.ok) {
      const txt = await resp.text().catch(() => '');
      throw Object.assign(new Error('Gemini error ' + resp.status + ' — ' + txt), { code: resp.status });
    }
    const data = await resp.json();
    const text = data?.candidates?.[0]?.content?.parts?.map(p => p.text).filter(Boolean).join('') || '';
    return { text, raw: data };
  },

  /**
   * Generate an image with Gemini's image-output models (Imagen 3 / Imagen 4 / gemini-2.5-flash-image).
   * Returns array of { mimeType, data: base64 }.
   */
  async generateImage(model, prompt, { aspectRatio, negativePrompt, signal } = {}) {
    const key = requireKey('gemini');
    // Gemini's image-output endpoint shape: same generateContent, response includes inlineData parts.
    const contents = [{ role: 'user', parts: [{ text: prompt }] }];
    const body = { contents };
    if (aspectRatio) body.generationConfig = { ...(body.generationConfig || {}), responseMimeType: 'image/png' };

    const url = `${GEMINI_BASE}/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(key)}`;
    const resp = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal,
    });
    if (resp.status === 401 || resp.status === 403) throw Object.assign(new Error('Key rejected'), { code: 401 });
    if (resp.status === 429) throw Object.assign(new Error('Rate limited'), { code: 429 });
    if (!resp.ok) {
      const txt = await resp.text().catch(() => '');
      throw Object.assign(new Error('Gemini error ' + resp.status + ' — ' + txt), { code: resp.status });
    }
    const data = await resp.json();
    const parts = data?.candidates?.[0]?.content?.parts || [];
    const images = parts
      .filter(p => p.inlineData)
      .map(p => ({ mimeType: p.inlineData.mimeType, data: p.inlineData.data }));
    if (!images.length) {
      const txt = parts.map(p => p.text).filter(Boolean).join(' ');
      throw new Error(txt || 'No image returned by Gemini');
    }
    return images;
  },

  /**
   * Edit an image (multimodal: image-in, image-out) via Gemini.
   * inputFile: File/Blob, prompt: text instruction.
   */
  async editImage(model, inputFile, prompt, opts = {}) {
    const b64 = await fileToBase64(inputFile);
    const parts = [
      { text: prompt },
      { inlineData: { mimeType: inputFile.type || 'image/png', data: b64 } },
    ];
    const key = requireKey('gemini');
    const url = `${GEMINI_BASE}/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(key)}`;
    const resp = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ role: 'user', parts }] }),
      signal: opts.signal,
    });
    if (resp.status === 401 || resp.status === 403) throw Object.assign(new Error('Key rejected'), { code: 401 });
    if (!resp.ok) {
      const txt = await resp.text().catch(() => '');
      throw Object.assign(new Error('Gemini error ' + resp.status + ' — ' + txt), { code: resp.status });
    }
    const data = await resp.json();
    const ps = data?.candidates?.[0]?.content?.parts || [];
    const out = ps.filter(p => p.inlineData).map(p => ({ mimeType: p.inlineData.mimeType, data: p.inlineData.data }));
    if (!out.length) {
      const txt = ps.map(p => p.text).filter(Boolean).join(' ');
      throw new Error(txt || 'Gemini did not return an image');
    }
    return out;
  },

  /** List available models (handy for the Settings page). */
  async listModels() {
    const key = requireKey('gemini');
    const resp = await fetch(`${GEMINI_BASE}/v1beta/models?key=${encodeURIComponent(key)}`);
    if (!resp.ok) throw Object.assign(new Error('Gemini error ' + resp.status), { code: resp.status });
    const data = await resp.json();
    return data.models || [];
  },
};

/* ── Pollinations (free, no key, CORS-friendly) ─────────────────────────── */
window.Pollinations = {
  /**
   * Build a Pollinations image URL. The image is generated server-side and
   * delivered as a normal <img> response, so no auth headers are needed.
   */
  imageUrl(prompt, { width = 1024, height = 1024, seed, model = 'flux', nologo = true } = {}) {
    const params = new URLSearchParams();
    if (width)  params.set('width', String(width));
    if (height) params.set('height', String(height));
    if (seed != null) params.set('seed', String(seed));
    if (model)  params.set('model', model);
    if (nologo) params.set('nologo', 'true');
    return `${POLLINATIONS_BASE}/prompt/${encodeURIComponent(prompt)}?${params.toString()}`;
  },

  /** Fetch as a Blob (so the user can download it). */
  async fetchImage(prompt, opts = {}) {
    const url = this.imageUrl(prompt, opts);
    const resp = await fetch(url);
    if (!resp.ok) throw new Error('Pollinations error ' + resp.status);
    return resp.blob();
  },
};

/* ── Hugging Face Inference API (optional, BYOK) ────────────────────────── */
window.HF = {
  async run(model, body) {
    const key = requireKey('hf');
    const resp = await fetch(`${HF_BASE}/models/${model}`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (resp.status === 401 || resp.status === 403) throw Object.assign(new Error('Key rejected'), { code: 401 });
    if (resp.status === 429) throw Object.assign(new Error('Rate limited'), { code: 429 });
    if (!resp.ok) {
      const txt = await resp.text().catch(() => '');
      throw Object.assign(new Error('HF error ' + resp.status + ' — ' + txt), { code: resp.status });
    }
    const ct = resp.headers.get('content-type') || '';
    return ct.includes('application/json') ? resp.json() : resp.blob();
  },
};

/* ── Friendly error → toast ─────────────────────────────────────────────── */
window.handleAIError = function(err, retryFn) {
  if (err instanceof NoKeyError) return;
  const code = err.code || 0;
  if (code === 401) {
    window.showErrorToast('Key rejected', 'Your API key was rejected. Check it in settings.', { label: 'Fix in Settings →', fn: "window.location='/ai/settings.html'" });
  } else if (code === 429) {
    window.showErrorToast('Too many requests', 'Slow down a moment, then try again.', null);
    if (retryFn) setTimeout(retryFn, 20000);
  } else if (!navigator.onLine) {
    window.showErrorToast('You\'re offline', 'AI generations need internet. Your offline converters still work.', null);
  } else {
    window.showErrorToast('Aila! Kuch toot gaya', err.message || 'Try again in a moment.', retryFn ? { label: 'Retry', fn: retryFn.toString() + '()' } : null);
  }
};

/* ── Offline banner ─────────────────────────────────────────────────────── */
(function() {
  function checkOnline() {
    let banner = document.getElementById('offline-banner');
    if (!navigator.onLine) {
      if (!banner) {
        banner = document.createElement('div');
        banner.id = 'offline-banner';
        banner.style.cssText = 'position:fixed;top:0;left:0;right:0;background:var(--danger);color:#fff;text-align:center;padding:0.6rem;font-size:0.9rem;z-index:9998;';
        banner.textContent = 'You\'re offline. AI generations need internet. Your file converters still work.';
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
