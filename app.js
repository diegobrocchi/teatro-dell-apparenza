/* Dieci percorsi — Accademia Carrara */

// Immagine di copertina di ogni percorso: elenco di opere in ordine di preferenza
// (se la prima immagine non si carica, si prova la successiva).
const COVERS = {
  "apparenza": ["isotta", "lotto"],
  "sacro": ["jacopo", "girolamo", "lotto"],
  "sguardi": ["ceruti", "botticelli"],
  "ruoli": ["pisanello", "isotta"],
  "tempo": ["pellizza", "redetti"],
  "dettagli": ["lotto", "isotta"],
  "vulnerabilita": ["redetti", "spini"],
  "identita": ["galgario", "botticelli"],
  "silenzio": ["girolamo", "jacopo", "baschenis", "pellizza"],
  "lavoro-oggetti": ["baschenis", "ceruti"]
};

// Larghezze standard delle miniature Wikimedia
const W_THUMB = 500, W_CARD = 960, W_FULL = 1920;
const COMMONS = "https://commons.wikimedia.org";

let activeRoute = -1;
const completedByRoute = {};
let largeText = false;

const $ = id => document.getElementById(id);
const root = $("artworks");

/* ---------- Opere: indice per chiave ---------- */
const worksByKey = {};
routes.forEach(r => r.works.forEach(w => { if (w.key && !worksByKey[w.key]) worksByKey[w.key] = w; }));

/* ---------- Immagini ---------- */
function esc(s) { return String(s ?? "").replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c])); }

function isSearchPage(page) { return !page || page.includes("Special:MediaSearch"); }
function filePathUrl(file, width) {
  return `${COMMONS}/wiki/Special:FilePath/${encodeURIComponent(file)}?width=${width}`;
}
// Elenco immagini di un'opera, normalizzato
function imagesOf(w) {
  const list = w.images || [{ file: w.image, caption: `${w.artist}, ${w.title}`, page: w.imagePage }];
  return list.map(img => ({
    file: isSearchPage(img.page) ? null : img.file,
    page: img.page,
    caption: img.caption || `${w.artist}, ${w.title}`
  }));
}

// Carica l'immagine indicata; se non si carica mostra il riquadro "non disponibile".
// (Nessuna ricerca automatica: rischierebbe di mostrare un'opera diversa.)
function loadImage(imgEl, candidates, width, onFail) {
  let i = 0;
  const tryNext = async () => {
    while (i < candidates.length) {
      const c = candidates[i++];
      if (!c.file) continue;
      const ok = await new Promise(res => {
        imgEl.onload = () => res(true);
        imgEl.onerror = () => res(false);
        imgEl.src = filePathUrl(c.file, width);
      });
      if (ok) { imgEl.classList.remove("loading"); imgEl.dataset.file = c.file; imgEl.dataset.page = c.page || ""; return { file: c.file, page: c.page }; }
    }
    onFail && onFail();
    return null;
  };
  return tryNext();
}

/* ---------- Avanzamento ---------- */
function doneSet(r = activeRoute) {
  if (!completedByRoute[r]) completedByRoute[r] = new Set();
  return completedByRoute[r];
}
function saveProgress() {
  try {
    const serial = {};
    Object.keys(completedByRoute).forEach(k => serial[k] = Array.from(completedByRoute[k]));
    localStorage.setItem("carraraTenRoutesProgress", JSON.stringify(serial));
  } catch (e) {}
  updateProgress();
}
function loadProgress() {
  try {
    const saved = JSON.parse(localStorage.getItem("carraraTenRoutesProgress") || "{}");
    Object.keys(saved).forEach(k => completedByRoute[k] = new Set(saved[k]));
  } catch (e) {}
}
function updateProgress() {
  if (activeRoute < 0) return;
  const done = doneSet().size;
  const total = routes[activeRoute].works.length;
  $("progressText").textContent = `${done} di ${total} opere viste`;
  $("progressFill").style.width = `${total ? done / total * 100 : 0}%`;
  root.querySelectorAll(".done-toggle").forEach(btn => {
    const idx = Number(btn.dataset.index);
    const isDone = doneSet().has(idx);
    btn.setAttribute("aria-pressed", String(isDone));
    btn.textContent = isDone ? "✓ Vista" : "Segna come vista";
    btn.closest(".artwork").classList.toggle("done", isDone);
  });
}

function roomsOf(r) {
  const rooms = [...new Set(r.works.map(w => w.room))].sort((a, b) => a - b);
  return rooms.length > 1 ? `Sale ${rooms[0]}–${rooms[rooms.length - 1]}` : `Sala ${rooms[0]}`;
}

/* ---------- Home: elenco percorsi ---------- */
function renderHome() {
  const list = $("routeList");
  list.innerHTML = routes.map((r, i) => {
    const done = doneSet(i).size, total = r.works.length;
    const status = done === 0 ? "" : done >= total ? `<span class="rc-done">✓ completato</span>` : `<span class="rc-done">${done}/${total} viste</span>`;
    return `<a class="route-card" href="#/percorso/${encodeURIComponent(r.id)}">
      <div class="rc-thumb"><img alt="" data-route="${i}" class="loading"><span class="rc-num">${String(i + 1).padStart(2, "0")}</span></div>
      <div class="rc-body">
        <p class="rc-sub">${esc(r.subtitle)}</p>
        <h3 class="rc-title">${esc(r.title)}</h3>
        <p class="rc-intro">${esc(r.intro)}</p>
        <div class="rc-meta"><span>${total} opere</span><span>${roomsOf(r)}</span>${status}</div>
      </div>
    </a>`;
  }).join("");
  list.querySelectorAll("img[data-route]").forEach(img => {
    const r = routes[Number(img.dataset.route)];
    const keys = COVERS[r.id] || [];
    const candidates = [];
    keys.forEach(k => { const w = worksByKey[k]; if (w) candidates.push(imagesOf(w)[0]); });
    r.works.forEach(w => candidates.push(imagesOf(w)[0])); // ultima risorsa: qualunque opera del percorso
    loadImage(img, candidates, W_THUMB, () => { img.remove(); });
  });
}

/* ---------- Un dettaglio ---------- */
const EXTRA_LABEL = { dettaglio: "Da cercare sulla tela", tempo: "Linea del tempo", fuori: "Fuori dal quadro", museo: "Fuori dal museo" };
function extraMarkup(w, i) {
  const e = w.extra; if (!e) return "";
  let visual = "";
  if (e.crop) {
    const c = e.crop;
    const ratio = (c.w / c.h) * c.ar; // larghezza/altezza del ritaglio
    const url = filePathUrl(c.file, W_FULL);
    visual = `
      <div class="detail-crop" role="img" aria-label="Particolare: ${esc(e.title)}" data-i="${i}"
        style="aspect-ratio:${ratio.toFixed(3)};background-image:url('${url.replace(/'/g, "%27")}');background-size:${(100 / c.w * 100).toFixed(2)}% auto;background-position:${(c.x / (100 - c.w) * 100).toFixed(2)}% ${(c.y / (100 - c.h) * 100).toFixed(2)}%"></div>
      <button class="where-btn" type="button" data-i="${i}" aria-expanded="false">Dov’è nel quadro?</button>
      <div class="where" id="where-${i}" hidden>
        <div class="where-frame" style="aspect-ratio:${c.ar.toFixed(4)};background-image:url('${filePathUrl(c.file, W_THUMB).replace(/'/g, "%27")}')">
          <span class="where-box" style="left:${c.x}%;top:${c.y}%;width:${c.w}%;height:${c.h}%"></span>
        </div>
      </div>`;
  }
  const src = (e.sources || []).map(([t, u]) => `<a href="${esc(u)}" target="_blank" rel="noopener">${esc(t)} ↗</a>`).join(" · ");
  return `<section class="extra extra-${e.kind}">
      <div class="extra-kicker">UN DETTAGLIO · ${esc((EXTRA_LABEL[e.kind] || "").toUpperCase())}</div>
      <h4 class="extra-title">${esc(e.title)}</h4>
      ${visual}
      <p class="extra-text">${esc(e.text)}</p>
      ${src ? `<p class="extra-src">Fonti: ${src}</p>` : ""}
    </section>`;
}

/* ---------- Musica d'epoca (player integrato) ---------- */
let player = null, playingIdx = null;
function fmtTime(t) { if (!isFinite(t)) return "–:––"; t = Math.round(t); return Math.floor(t / 60) + ":" + String(t % 60).padStart(2, "0"); }
function trackMarkup(w, i) {
  const t = w.track; if (!t) return "";
  const facts = (t.facts || []).map(([n, u]) => `<a href="${esc(u)}" target="_blank" rel="noopener">${esc(n)} ↗</a>`).join(" · ");
  return `<div class="track" id="track-${i}">
      <div class="music-kicker">MUSICA DEL TEMPO DELL’OPERA</div>
      <div class="track-row">
        <button class="track-play" type="button" data-i="${i}" aria-label="Ascolta ${esc(t.title)}">▶</button>
        <div class="track-info">
          <p class="track-title"><strong>${esc(t.title)}</strong> — ${esc(t.composer)}</p>
          <div class="track-bar"><span class="track-fill"></span></div>
          <p class="track-time"><span class="track-cur">0:00</span> / <span class="track-dur">${t.duration ? fmtTime(t.duration) : "–:––"}</span></p>
        </div>
      </div>
      <p class="track-note">${esc(t.note)}</p>
      <p class="track-credit">Esecuzione: ${esc(t.performer)} · <a href="${esc(t.licenseUrl)}" target="_blank" rel="noopener">${esc(t.license)}</a> · <a href="${esc(t.page || t.src)}" target="_blank" rel="noopener">fonte ↗</a>${facts ? `<br>Notizie: ${facts}` : ""}</p>
    </div>`;
}
function trackUI(i) { const el = $(`track-${i}`); return el && { el, btn: el.querySelector(".track-play"), fill: el.querySelector(".track-fill"), cur: el.querySelector(".track-cur"), dur: el.querySelector(".track-dur"), bar: el.querySelector(".track-bar") }; }
function stopTrack() {
  if (player) { player.pause(); }
  if (playingIdx !== null) { const u = trackUI(playingIdx); if (u) { u.btn.textContent = "▶"; u.el.classList.remove("playing"); } }
}
function toggleTrack(i) {
  const w = routes[activeRoute].works[i];
  if (!player) {
    player = new Audio(); player.preload = "none";
    player.addEventListener("timeupdate", () => { const u = trackUI(playingIdx); if (!u) return; u.cur.textContent = fmtTime(player.currentTime); if (player.duration) { u.fill.style.width = (player.currentTime / player.duration * 100) + "%"; u.dur.textContent = fmtTime(player.duration); } });
    player.addEventListener("ended", () => { const u = trackUI(playingIdx); if (u) { u.btn.textContent = "▶"; u.el.classList.remove("playing"); u.fill.style.width = "0%"; } });
    player.addEventListener("waiting", () => { const u = trackUI(playingIdx); if (u) u.btn.textContent = "…"; });
    player.addEventListener("playing", () => { const u = trackUI(playingIdx); if (u) u.btn.textContent = "❚❚"; });
    player.addEventListener("error", () => { const u = trackUI(playingIdx); if (u) { u.btn.textContent = "▶"; u.el.classList.remove("playing"); u.cur.textContent = "Brano non disponibile senza connessione"; } });
  }
  if (playingIdx === i && !player.paused) { stopTrack(); return; }
  if (playingIdx !== i) { stopTrack(); player.src = w.track.src; playingIdx = i; }
  const u = trackUI(i); u.el.classList.add("playing"); u.btn.textContent = "…";
  player.play().catch(() => { u.btn.textContent = "▶"; u.el.classList.remove("playing"); });
  if ("mediaSession" in navigator) {
    try { navigator.mediaSession.metadata = new MediaMetadata({ title: w.track.title, artist: w.track.composer, album: w.title }); } catch (e) {}
  }
}
function seekTrack(i, ev) {
  if (playingIdx !== i || !player || !player.duration) return;
  const r = ev.currentTarget.getBoundingClientRect();
  player.currentTime = Math.max(0, Math.min(1, (ev.clientX - r.left) / r.width)) * player.duration;
}

/* ---------- Percorso ---------- */
function imageMarkup(w, i) {
  const imgs = imagesOf(w);
  return `<div class="painting-gallery ${imgs.length > 1 ? "two" : ""}">` + imgs.map((img, j) => `
    <figure class="painting-figure">
      <div class="img-frame"><img class="loading" alt="${esc(img.caption)}" data-w="${i}" data-j="${j}" decoding="async"></div>
      <figcaption>${esc(img.caption)} · <a class="src" href="${esc(img.page)}" target="_blank" rel="noopener">fonte e licenza ↗</a></figcaption>
    </figure>`).join("") + `</div>`;
}

function renderRoute() {
  const route = routes[activeRoute];
  $("routeNumber").textContent = `Percorso ${String(activeRoute + 1).padStart(2, "0")} di ${routes.length}`;
  $("routeTitle").textContent = route.title;
  $("routeSubtitle").textContent = route.subtitle;
  $("routeIntro").textContent = route.intro;
  $("routeRooms").textContent = `${route.works.length} opere · piano 2 · ${roomsOf(route).toLowerCase()}, in ordine di visita`;
  document.title = `${route.title} — Accademia Carrara`;
  const next = (activeRoute + 1) % routes.length;
  $("nextRoute").href = `#/percorso/${encodeURIComponent(routes[next].id)}`;
  $("nextRoute").textContent = `Prossimo: ${routes[next].title} →`;

  root.innerHTML = route.works.map((w, i) => `
    <article class="artwork ${doneSet().has(i) ? "done" : ""}" id="opera-${i + 1}">
      <div class="artwork-top"><div class="number">${String(i + 1).padStart(2, "0")}</div><div><h3>${esc(w.title)}</h3><p class="artist">${esc(w.artist)}${w.date ? ` · ${esc(w.date)}` : ""}</p></div><span class="sala">${esc(w.roomLabel)}</span></div>
      ${imageMarkup(w, i)}
      <div class="artwork-body">
        <p class="question">${esc(w.question)}</p>
        <p class="work-text">${esc(w.text)}</p>
        <div class="actions">
          <button class="done-toggle" type="button" aria-pressed="false" data-index="${i}">Segna come vista</button>
          <a class="source-link" href="${esc(w.museumPage)}" target="_blank" rel="noopener">${w.museumPage2 ? "Scheda di Bernardo ↗" : "Scheda dell’opera ↗"}</a>${w.museumPage2 ? `<a class="source-link" href="${esc(w.museumPage2)}" target="_blank" rel="noopener">Scheda di Pace ↗</a>` : ""}
        </div>
        ${extraMarkup(w, i)}
        <section class="history"><h4>Un po’ di storia</h4><p>${esc(w.history)}</p>
          <p class="history-meta">Fonte: <a href="${esc(w.historySourceUrl)}" target="_blank" rel="noopener">${esc(w.historySource)} ↗</a></p>
          <p class="availability"><strong>Dove si trova:</strong> ${esc(w.availability)}</p></section>
        ${trackMarkup(w, i)}
        <div class="music-pick"><div class="music-kicker">${w.track ? "UN ABBINAMENTO DI OGGI" : "MUSICA ABBINATA"}</div><p class="music-title"><strong>${esc(w.music.title)}</strong> — ${esc(w.music.artist)}</p><p class="music-style">${esc(w.music.style)}</p><p class="music-note">${esc(w.music.note)}</p><a class="music-link" href="${esc(w.music.url)}" target="_blank" rel="noopener">Cerca il brano su YouTube ↗</a></div>
      </div>
    </article>`).join("");

  // immagini
  root.querySelectorAll("img[data-w]").forEach(img => {
    const w = route.works[Number(img.dataset.w)];
    const info = imagesOf(w)[Number(img.dataset.j)];
    const fig = img.closest(".painting-figure");
    loadImage(img, [info], W_CARD, () => {
      const a = fig.querySelector("a.src"); if (a) { a.previousSibling.textContent = a.previousSibling.textContent.replace(/ · $/, ""); a.remove(); }
      img.closest(".img-frame").innerHTML = `<div class="img-missing"><span>▢</span>Immagine non disponibile.<br>La troverai dal vero in museo.</div>`;
    }).then(res => {
      const a = fig.querySelector("a.src");
      if (res && res.page && a) a.href = res.page;
    });
    img.addEventListener("click", () => openLightbox(img));
  });

  root.querySelectorAll(".track-play").forEach(btn => btn.addEventListener("click", () => toggleTrack(Number(btn.dataset.i))));
  root.querySelectorAll(".track").forEach(el => { const i = Number(el.id.slice(6)); el.querySelector(".track-bar").addEventListener("click", ev => seekTrack(i, ev)); });
  root.querySelectorAll(".where-btn").forEach(btn => btn.addEventListener("click", () => {
    const box = $(`where-${btn.dataset.i}`);
    box.hidden = !box.hidden;
    btn.setAttribute("aria-expanded", String(!box.hidden));
    btn.textContent = box.hidden ? "Dov’è nel quadro?" : "Nascondi";
  }));
  root.querySelectorAll(".detail-crop").forEach(el => el.addEventListener("click", () => {
    const w = route.works[Number(el.dataset.i)];
    openLightboxFile(w.extra.crop.file, w.extra.title);
  }));
  root.querySelectorAll(".done-toggle").forEach(btn => btn.addEventListener("click", () => {
    const idx = Number(btn.dataset.index);
    if (doneSet().has(idx)) doneSet().delete(idx); else doneSet().add(idx);
    saveProgress();
  }));
  updateProgress();
}

/* ---------- Ingrandimento ---------- */
function openLightbox(img) {
  if (!img.dataset.file) return;
  const big = $("lightboxImg");
  big.onerror = () => { big.onerror = null; big.src = img.src; }; // senza rete: usa l'immagine già salvata
  big.src = filePathUrl(img.dataset.file, W_FULL);
  $("lightboxImg").alt = img.alt;
  $("lightboxCaption").textContent = img.alt;
  $("lightbox").hidden = false;
  document.body.style.overflow = "hidden";
}
function openLightboxFile(file, caption) {
  const big = $("lightboxImg");
  big.onerror = null;
  big.src = filePathUrl(file, W_FULL);
  big.alt = caption;
  $("lightboxCaption").textContent = caption;
  $("lightbox").hidden = false;
  document.body.style.overflow = "hidden";
}
function closeLightbox() {
  $("lightbox").hidden = true;
  $("lightboxImg").removeAttribute("src");
  document.body.style.overflow = "";
}
$("lightbox").addEventListener("click", closeLightbox);
document.addEventListener("keydown", e => { if (e.key === "Escape") closeLightbox(); });

/* ---------- Navigazione ---------- */
function route() {
  closeLightbox();
  stopTrack(); playingIdx = null;
  const m = location.hash.match(/^#\/percorso\/(.+)$/);
  const idx = m ? routes.findIndex(r => r.id === decodeURIComponent(m[1])) : -1;
  if (idx >= 0) {
    activeRoute = idx;
    $("homeView").hidden = true;
    $("routeView").hidden = false;
    renderRoute();
  } else {
    activeRoute = -1;
    $("routeView").hidden = true;
    $("homeView").hidden = false;
    document.title = "Dieci percorsi — Accademia Carrara";
    renderHome();
  }
  window.scrollTo(0, 0);
}
window.addEventListener("hashchange", route);

$("resetProgress").addEventListener("click", () => {
  if (confirm("Vuoi azzerare le opere segnate in questo percorso?")) { completedByRoute[activeRoute] = new Set(); saveProgress(); }
});
$("textSize").addEventListener("click", () => {
  largeText = !largeText; document.body.classList.toggle("large-text", largeText);
  $("textSize").textContent = largeText ? "A−" : "A+";
});
/* ---------- App installabile e uso offline ---------- */
const isStandalone = () => window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone === true;
const isIos = /iPhone|iPad|iPod/.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
let deferredPrompt = null;

function refreshAppBox() {
  const standalone = isStandalone();
  $("installAndroid").hidden = standalone || !deferredPrompt;
  $("installIos").hidden = standalone || !isIos;
  $("offlineBox").hidden = !("serviceWorker" in navigator && navigator.serviceWorker.controller);
  $("appTitle").textContent = standalone ? "Pronta per la visita" : "Tienila sul telefono";
  refreshMusicBox();
  $("appBox").hidden = $("installAndroid").hidden && $("installIos").hidden && $("offlineBox").hidden;
  try { if (localStorage.getItem("carraraOfflineReady")) markOfflineReady(); } catch (e) {}
}
function markOfflineReady() {
  $("offlineText").textContent = "Immagini salvate su questo telefono: puoi usarla anche senza connessione.";
  $("offlineBtn").textContent = "Aggiorna le immagini";
}

window.addEventListener("beforeinstallprompt", e => { e.preventDefault(); deferredPrompt = e; refreshAppBox(); });
window.addEventListener("appinstalled", () => { deferredPrompt = null; refreshAppBox(); });
$("installBtn").addEventListener("click", async () => {
  if (!deferredPrompt) return;
  deferredPrompt.prompt();
  await deferredPrompt.userChoice.catch(() => null);
  deferredPrompt = null; refreshAppBox();
});

async function downloadForOffline() {
  const btn = $("offlineBtn"), txt = $("offlineText");
  btn.disabled = true;
  try { if (navigator.storage && navigator.storage.persist) await navigator.storage.persist(); } catch (e) {}
  const jobs = [];
  Object.values(worksByKey).forEach(w => imagesOf(w).forEach((img, j) => jobs.push({ img, thumb: j === 0 })));
  Object.values(worksByKey).forEach(w => { if (w.extra && w.extra.crop) jobs.push({ detail: w.extra.crop.file }); });
  let done = 0, failed = 0;
  const grab = url => fetch(url, { mode: "no-cors" });
  for (const { img, thumb, detail } of jobs) {
    txt.textContent = `Scarico le immagini… ${done + failed + 1} di ${jobs.length}`;
    try {
      if (detail) { await grab(filePathUrl(detail, W_FULL)); await grab(filePathUrl(detail, W_THUMB)); done++; continue; }
      const file = img.file;
      if (!file) throw new Error("non trovata");
      await grab(filePathUrl(file, W_CARD));
      if (thumb) await grab(filePathUrl(file, W_THUMB));
      done++;
    } catch (e) { failed++; }
  }
  btn.disabled = false;
  if (done === 0) {
    txt.textContent = "Non riesco a scaricare le immagini: controlla la connessione e riprova.";
    return;
  }
  try { localStorage.setItem("carraraOfflineReady", "1"); } catch (e) {}
  markOfflineReady();
  if (failed) $("offlineText").textContent += ` (${failed} immagini non disponibili.)`;
}
$("offlineBtn").addEventListener("click", downloadForOffline);

// Musica per l'uso offline: i brani si salvano interi in una cache dedicata
function uniqueTracks() { const m = new Map(); Object.values(worksByKey).forEach(w => { if (w.track) m.set(w.track.src, w.track); }); return [...m.values()]; }
function musicSizeMB() { return Math.round(uniqueTracks().reduce((a, t) => a + (t.sizeMB || 0), 0)); }
async function musicSaved() {
  try { const c = await caches.open("carrara-musica"); const keys = await c.keys(); return uniqueTracks().every(t => keys.some(k => k.url === t.src)); } catch (e) { return false; }
}
async function refreshMusicBox() {
  if (!("caches" in window)) { $("musicBtn").hidden = true; $("musicText").hidden = true; return; }
  if (await musicSaved()) { $("musicText").textContent = "Musica salvata su questo telefono: si ascolta anche senza connessione."; $("musicBtn").textContent = "Aggiorna la musica"; }
  else { $("musicText").textContent = `La musica del tempo delle opere pesa circa ${musicSizeMB()} MB: meglio scaricarla con il wi-fi.`; $("musicBtn").textContent = "Scarica la musica"; }
}
async function downloadMusic() {
  const btn = $("musicBtn"), txt = $("musicText"); btn.disabled = true;
  try { if (navigator.storage && navigator.storage.persist) await navigator.storage.persist(); } catch (e) {}
  const list = uniqueTracks(); let ok = 0, fail = 0;
  const cache = await caches.open("carrara-musica");
  for (const t of list) {
    txt.textContent = `Scarico la musica… ${ok + fail + 1} di ${list.length}`;
    try { const r = await fetch(t.src, { mode: "cors" }); if (!r.ok) throw new Error(r.status); await cache.put(t.src, r); ok++; }
    catch (e) { fail++; }
  }
  btn.disabled = false;
  await refreshMusicBox();
  if (fail) txt.textContent = `Salvati ${ok} brani su ${list.length}: riprova con una connessione migliore per gli altri.`;
}
$("musicBtn").addEventListener("click", downloadMusic);

if ("serviceWorker" in navigator && location.protocol !== "file:") {
  navigator.serviceWorker.register("./sw.js").catch(() => {});
  navigator.serviceWorker.addEventListener("controllerchange", refreshAppBox);
}

/* ---------- Aggiornamento automatico ----------
   La pagina confronta i file che sta usando con quelli pubblicati. Se sono cambiati
   (nuova pubblicazione su GitHub) si ricarica da sola, tornando allo stesso punto.
   Controlla all'apertura, quando l'app torna in primo piano, quando torna la rete
   e ogni 30 minuti. Non serve cambiare numeri di versione. */
const WATCH = ["./index.html", "./app.js", "./routes.js", "./styles.css"];
function hashText(t) { let h = 5381; for (let i = 0; i < t.length; i++) h = ((h << 5) + h + t.charCodeAt(i)) | 0; return (h >>> 0).toString(36) + ":" + t.length; }
async function fingerprint(fromCache) {
  const parts = [];
  for (const u of WATCH) {
    const abs = new URL(u, location.href); abs.hash = ""; abs.search = "";
    const res = fromCache ? await caches.match(abs.href) : await fetch(abs.href, { cache: "no-cache" });
    if (!res || !res.ok) return null;
    parts.push(hashText(await res.text()));
  }
  return parts.join("|");
}
let baseline = null, lastCheck = 0;
async function initBaseline() {
  try {
    if ("caches" in window && navigator.serviceWorker && navigator.serviceWorker.controller) baseline = await fingerprint(true);
    if (!baseline) baseline = await fingerprint(false);
  } catch (e) { baseline = null; }
}
async function checkForUpdate() {
  if (!baseline || !navigator.onLine || location.protocol === "file:") return;
  if (Date.now() - lastCheck < 60000) return;
  lastCheck = Date.now();
  try {
    const now = await fingerprint(false);
    if (now && now !== baseline) applyUpdate();
  } catch (e) {}
}
async function applyUpdate() {
  try {
    const last = Number(sessionStorage.getItem("carraraAutoReload") || 0);
    if (Date.now() - last < 120000) return; // evita ricariche a ripetizione
    sessionStorage.setItem("carraraAutoReload", String(Date.now()));
    sessionStorage.setItem("carraraRestore", JSON.stringify({ hash: location.hash, y: window.scrollY }));
  } catch (e) {}
  try {
    const reg = navigator.serviceWorker && await navigator.serviceWorker.getRegistration();
    if (reg) await Promise.race([reg.update(), new Promise(r => setTimeout(r, 3000))]);
  } catch (e) {}
  location.reload();
}
function restoreAfterUpdate() {
  let data = null;
  try { data = JSON.parse(sessionStorage.getItem("carraraRestore") || "null"); sessionStorage.removeItem("carraraRestore"); } catch (e) {}
  if (!data) return;
  if (data.hash === location.hash) setTimeout(() => window.scrollTo(0, data.y || 0), 150);
  const t = document.createElement("div");
  t.className = "toast"; t.textContent = "Guida aggiornata all’ultima versione";
  document.body.appendChild(t);
  setTimeout(() => t.classList.add("show"), 50);
  setTimeout(() => { t.classList.remove("show"); setTimeout(() => t.remove(), 400); }, 3500);
}
document.addEventListener("visibilitychange", () => { if (document.visibilityState === "visible") checkForUpdate(); });
window.addEventListener("online", checkForUpdate);
window.addEventListener("pageshow", e => { if (e.persisted) checkForUpdate(); });
setInterval(() => { if (document.visibilityState === "visible") checkForUpdate(); }, 30 * 60 * 1000);

loadProgress();
route();
refreshAppBox();
restoreAfterUpdate();
// la base di confronto si prende dopo qualche secondo, quando il service worker ha salvato i file appena serviti
setTimeout(async () => { await initBaseline(); lastCheck = 0; checkForUpdate(); }, 4000);
