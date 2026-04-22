// Desi Jugad AI Proxy — CORS pass-through for Replicate, Suno, OpenAI
// Runs on Cloudflare Pages Functions. No API keys are stored server-side.
// This function never logs, stores, or inspects Authorization header values.

const TARGETS = {
  replicate: 'https://api.replicate.com',
  suno:      'https://api.sunoapi.org',
  openai:    'https://api.openai.com',
  gemini:    'https://generativelanguage.googleapis.com',
};

const CORS_HEADERS = {
  'Access-Control-Allow-Origin':  '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Authorization, Content-Type, Prefer, X-API-Key, X-Goog-Api-Key',
  'Access-Control-Max-Age':       '86400',
};

function isBlockedHostname(hostname) {
  if (!hostname) return true;
  const value = hostname.toLowerCase();
  return value === 'localhost'
    || value.endsWith('.localhost')
    || value === '127.0.0.1'
    || value === '0.0.0.0'
    || value === '::1'
    || value.startsWith('10.')
    || value.startsWith('192.168.')
    || /^172\.(1[6-9]|2\d|3[01])\./.test(value);
}

function getUpstreamBase(target, url) {
  if (target !== 'suno') return TARGETS[target];

  const customBase = url.searchParams.get('base');
  if (!customBase) return TARGETS[target];

  let parsed;
  try {
    parsed = new URL(customBase);
  } catch {
    throw new Response(JSON.stringify({ error: 'invalid custom base url' }), {
      status: 400,
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
    });
  }

  if (parsed.protocol !== 'https:' || isBlockedHostname(parsed.hostname)) {
    throw new Response(JSON.stringify({ error: 'custom base url not allowed' }), {
      status: 400,
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
    });
  }

  return parsed.origin;
}

export async function onRequest(context) {
  const { request } = context;

  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: CORS_HEADERS });
  }

  const url    = new URL(request.url);
  const target = url.searchParams.get('target');
  const path   = url.searchParams.get('path') || '';

  if (!TARGETS[target]) {
    return new Response(JSON.stringify({ error: 'unknown target' }), {
      status: 400,
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
    });
  }

  let upstreamBase;
  try {
    upstreamBase = getUpstreamBase(target, url);
  } catch (response) {
    return response;
  }
  const upstream = upstreamBase + path;

  const fwdHeaders = new Headers();
  const auth  = request.headers.get('authorization');
  const xkey  = request.headers.get('x-api-key');
  const gkey  = request.headers.get('x-goog-api-key');
  const prefr = request.headers.get('prefer');
  // Forward auth header verbatim — never read or log its value
  if (auth)  fwdHeaders.set('Authorization', auth);
  if (xkey)  fwdHeaders.set('X-API-Key', xkey);
  if (gkey)  fwdHeaders.set('X-Goog-Api-Key', gkey);
  if (!gkey && xkey && target === 'gemini') fwdHeaders.set('X-Goog-Api-Key', xkey);
  if (prefr) fwdHeaders.set('Prefer', prefr);
  fwdHeaders.set('Content-Type', request.headers.get('content-type') || 'application/json');

  const upstreamResp = await fetch(upstream, {
    method:  request.method,
    headers: fwdHeaders,
    body:    ['GET', 'HEAD'].includes(request.method) ? undefined : await request.text(),
  });

  const body = await upstreamResp.text();
  return new Response(body, {
    status: upstreamResp.status,
    headers: {
      ...CORS_HEADERS,
      'Content-Type': upstreamResp.headers.get('content-type') || 'application/json',
    },
  });
}
