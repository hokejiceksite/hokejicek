// sw.js (scope '/')
// Note: ServiceWorker fetches are subject to CORS - pokud origin blokuje, nebude fungovat.
// This SW proxies only the single manifest request and subsequent segment requests (rewrites URLs).
const ORIGIN = 'https://stream-48.mazana.tv/V2_emn.m3u8s?codec_id=1240&session=omg';

self.addEventListener('install', e=> { self.skipWaiting(); });
self.addEventListener('activate', e=> { self.clients.claim(); });

self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  // Handle our proxy path
  if (url.pathname === '/sw-proxy/stream.m3u8') {
    event.respondWith(handleManifest(event.request));
    return;
  }

  // We also intercept TS/fMP4 segment requests that start with /sw-proxy/segment/...
  if (url.pathname.startsWith('/sw-proxy/segment/')) {
    // extract actual origin segment path encoded in query
    const segPath = url.searchParams.get('u');
    if (segPath) {
      event.respondWith(fetch(segPath, { method: 'GET', headers: {'User-Agent':'hokejicek-sw/1.0'} }));
      return;
    }
  }
  // otherwise: normal fetch (let browser/network handle)
});

async function handleManifest(req){
  try {
    // fetch original manifest from origin
    const upstream = await fetch(ORIGIN, { method: 'GET', headers: {'User-Agent':'hokejicek-sw/1.0'} });
    if (!upstream.ok) return new Response('upstream error', {status:502});
    const text = await upstream.text();

    // rewrite segment URLs: replace absolute URLs or relative paths with our /sw-proxy/segment/?u=ENC
    // This is a simple replace for common .ts lines. Might need adjustments for variant playlists.
    const rewritten = text.replace(/^(.*\.ts.*)$/gm, (match)=>{
      // match could be "segment0001.ts" or full URL
      const seg = match.trim();
      const encoded = encodeURIComponent(new URL(seg, ORIGIN).toString());
      return `/sw-proxy/segment/?u=${encoded}`;
    });

    // respond as manifest
    return new Response(rewritten, { status: 200, headers: { 'Content-Type': 'application/vnd.apple.mpegurl' }});
  } catch(e){
    return new Response('proxy error', {status:500});
  }
}
