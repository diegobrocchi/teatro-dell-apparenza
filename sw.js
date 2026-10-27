/* Service worker — Dieci percorsi, Accademia Carrara
   Quando aggiorni i file del sito, cambia VERSION: i telefoni scaricheranno la nuova versione. */
const VERSION = "2026-10-27-4";
const SHELL_CACHE = "carrara-app-" + VERSION;
const IMG_CACHE = "carrara-immagini";   // non viene cancellata agli aggiornamenti
const DATA_CACHE = "carrara-dati";

const SHELL = [
  "./", "./index.html", "./styles.css", "./app.js", "./routes.js", "./manifest.webmanifest",
  "./icons/icon-192.png", "./icons/icon-512.png", "./icons/apple-touch-icon.png", "./icons/favicon-32.png"
];

self.addEventListener("install", event => {
  event.waitUntil(caches.open(SHELL_CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k.startsWith("carrara-app-") && k !== SHELL_CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", event => {
  const req = event.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);

  // File del sito: prima la rete (così si vede sempre l'ultima versione), la cache se offline
  if (url.origin === self.location.origin) {
    event.respondWith(shellNetworkFirst(req));
    return;
  }
  // Immagini Wikimedia: prima la cache (così funzionano anche senza rete)
  if ((url.hostname === "commons.wikimedia.org" && url.pathname.startsWith("/wiki/Special:FilePath")) ||
      url.hostname === "upload.wikimedia.org") {
    event.respondWith(cacheFirst(req, IMG_CACHE));
    return;
  }
  // Ricerche immagini su Commons: prima la rete, poi la cache
  if (url.hostname === "commons.wikimedia.org" && url.pathname === "/w/api.php") {
    event.respondWith(networkFirst(req, DATA_CACHE));
  }
});

async function shellNetworkFirst(req) {
  const cache = await caches.open(SHELL_CACHE);
  const key = req.mode === "navigate" ? "./index.html" : req;
  try {
    // con segnale debole non si aspetta più di 4 secondi, poi si usa la copia salvata
    const res = await Promise.race([
      fetch(req, { cache: "no-cache" }),
      new Promise((_, reject) => setTimeout(() => reject(new Error("timeout")), 4000))
    ]);
    if (res && res.ok && !res.redirected) cache.put(key, res.clone());
    return res;
  } catch (e) {
    const cached = await cache.match(key, { ignoreSearch: true });
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
