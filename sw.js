/* Service worker — Dieci percorsi, Accademia Carrara
   Non serve più cambiare nulla qui quando aggiorni il sito: i file della guida
   vengono sempre chiesti prima alla rete e la pagina controlla da sola se è
   uscita una versione nuova (vedi "Aggiornamento automatico" in app.js).
   Cambia SW_REVISION solo se modifichi questo file. */
const SW_REVISION = "2026-10-28-3";
const SHELL_CACHE = "carrara-app";        // file della guida (index, css, js, icone)
const IMG_CACHE = "carrara-immagini";    // immagini Wikimedia scaricate per l'uso offline
const DATA_CACHE = "carrara-dati";
const AUDIO_CACHE = "carrara-musica";   // brani salvati con "Scarica la musica"

const SHELL = [
  "./index.html", "./styles.css", "./app.js", "./routes.js", "./manifest.webmanifest",
  "./icons/icon-192.png", "./icons/icon-512.png", "./icons/apple-touch-icon.png", "./icons/favicon-32.png"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(SHELL_CACHE)
      .then(c => Promise.all(SHELL.map(u => fetch(u, { cache: "no-store" }).then(r => r.ok && c.put(cleanKey(u), r)).catch(() => {}))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    // cache delle versioni precedenti (si chiamavano "carrara-app-<data>")
    const old = keys.filter(k => k.startsWith("carrara-app-"));
    await Promise.all(old.map(k => caches.delete(k)));
    await self.clients.claim();
    // Se c'era una versione precedente, ricarica le pagine aperte: così chi aveva
    // la guida già aperta vede subito quella nuova, senza dover fare nulla.
    if (old.length) {
      const wins = await self.clients.matchAll({ type: "window" });
      wins.forEach(w => { try { w.navigate(w.url); } catch (e) {} });
    }
  })());
});

self.addEventListener("fetch", event => {
  const req = event.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);

  if (url.origin === self.location.origin) {
    event.respondWith(shellNetworkFirst(req));
    return;
  }
  // Musica: se il brano è stato salvato si serve dalla cache (anche a pezzi, come chiedono i telefoni)
  if (/\.mp3$/i.test(url.pathname) && (url.hostname === "upload.wikimedia.org" || /(^|\.)archive\.org$/.test(url.hostname))) {
    event.respondWith(audioResponse(req));
    return;
  }
  if ((url.hostname === "commons.wikimedia.org" && url.pathname.startsWith("/wiki/Special:FilePath")) ||
      url.hostname === "upload.wikimedia.org") {
    event.respondWith(cacheFirst(req, IMG_CACHE));
    return;
  }
  if (url.hostname === "commons.wikimedia.org" && url.pathname === "/w/api.php") {
    event.respondWith(networkFirst(req, DATA_CACHE));
  }
});

// chiave di cache senza parametri (?v=...) e con la pagina sempre come index.html
function cleanKey(u) {
  const url = new URL(u, self.location.href);
  url.search = ""; url.hash = "";
  if (url.pathname.endsWith("/")) url.pathname += "index.html";
  return url.href;
}

async function shellNetworkFirst(req) {
  const cache = await caches.open(SHELL_CACHE);
  const key = req.mode === "navigate" ? cleanKey("./index.html") : cleanKey(req.url);
  try {
    // con segnale debole non si aspetta più di 4 secondi, poi si usa la copia salvata
    const res = await Promise.race([
      fetch(req.mode === "navigate" ? req : req.url, { cache: "no-cache" }),
      new Promise((_, reject) => setTimeout(() => reject(new Error("timeout")), 4000))
    ]);
    if (res && res.ok && !res.redirected) cache.put(key, res.clone());
    return res;
  } catch (e) {
    const cached = await cache.match(key);
    return cached || new Response("Sei offline e questa pagina non è ancora salvata.", { status: 503, headers: { "Content-Type": "text/plain; charset=utf-8" } });
  }
}

async function cacheFirst(req, name) {
  const cache = await caches.open(name);
  const cached = await cache.match(req.url);
  if (cached) return cached;
  try {
    const res = await fetch(req);
    if (res && (res.ok || res.type === "opaque")) cache.put(req.url, res.clone());
    return res;
  } catch (e) {
    return Response.error();
  }
}

async function networkFirst(req, name) {
  const cache = await caches.open(name);
  try {
    const res = await fetch(req);
    if (res && res.ok) cache.put(req.url, res.clone());
    return res;
  } catch (e) {
    return (await cache.match(req.url)) || Response.error();
  }
}

async function audioResponse(req) {
  const cache = await caches.open(AUDIO_CACHE);
  const cached = await cache.match(req.url.split("#")[0]);
  if (!cached) {
    try { return await fetch(req); } catch (e) { return Response.error(); }
  }
  const blob = await cached.blob();
  const size = blob.size;
  const type = cached.headers.get("Content-Type") || "audio/mpeg";
  const range = req.headers.get("Range");
  const m = range && /bytes=(\d*)-(\d*)/.exec(range);
  if (!m) {
    return new Response(blob, { status: 200, headers: { "Content-Type": type, "Content-Length": String(size), "Accept-Ranges": "bytes" } });
  }
  let start = m[1] === "" ? NaN : parseInt(m[1], 10);
  let end = m[2] === "" ? NaN : parseInt(m[2], 10);
  if (isNaN(start)) { start = Math.max(0, size - (isNaN(end) ? 0 : end)); end = size - 1; }  // bytes=-N
  if (isNaN(end) || end >= size) end = size - 1;
  if (start >= size || start > end) {
    return new Response(null, { status: 416, headers: { "Content-Range": `bytes */${size}` } });
  }
  return new Response(blob.slice(start, end + 1), { status: 206, headers: {
    "Content-Type": type, "Content-Length": String(end - start + 1),
    "Content-Range": `bytes ${start}-${end}/${size}`, "Accept-Ranges": "bytes" } });
}
