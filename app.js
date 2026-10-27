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
function searchTermsFrom(page, fallback) {
  try { const q = new URL(page).searchParams.get("search"); if (q) return q; } catch (e) {}
  return fallback;
}
function filePathUrl(file, width) {
  return `${COMMONS}/wiki/Special:FilePath/${encodeURIComponent(file)}?width=${width}`;
}
// Elenco immagini di un'opera, normalizzato
function imagesOf(w) {
  const list = w.images || [{ file: w.image, caption: `${w.artist}, ${w.title}`, page: w.imagePage }];
  return list.map(img => ({
    file: isSearchPage(img.page) ? null : img.file,
    page: img.page,
    caption: img.caption || `${w.artist}, ${w.title}`,
    query: searchTermsFrom(img.page, `${w.artist} ${w.title} Accademia Carrara`)
  }));
}

// Ricerca su Wikimedia Commons (usata solo quando manca un file diretto o non si carica)
const searchCache = {};
function searchCommons(query) {
  if (!searchCache[query]) {
    const url = `${COMMONS}/w/api.php?action=query&format=json&origin=*&generator=search&gsrnamespace=6&gsrlimit=1` +
      `&gsrsearch=${encodeURIComponent(query + " filetype:bitmap")}&prop=imageinfo&iiprop=url&iiurlwidth=${W_CARD}`;
    searchCache[query] = fetch(url).then(r => r.json()).then(data => {
      const pages = data && data.query && data.query.pages;
      if (!pages) return null;
      const p = Object.values(pages)[0];
      const info = p && p.imageinfo && p.imageinfo[0];
      if (!info) return null;
      return { file: p.title.replace(/^File:/, ""), page: info.descriptionurl };
    }).catch(() => null);
  }
  return searchCache[query];
}

// Carica un'immagine provando: file diretto → ricerca → riquadro "non disponibile"
function loadImage(imgEl, candidates, width, onFail) {
  let i = 0;
  const tryNext = async () => {
    while (i < candidates.length) {
      const c = candidates[i++];
      let file = c.file, page = c.page;
      if (!file) {
        const found = await searchCommons(c.query);
        if (!found) continue;
        file = found.file; page = found.page;
      }
      const ok = await new Promise(res => {
        imgEl.onload = () => res(true);
        imgEl.onerror = () => res(false);
        imgEl.src = filePathUrl(file, width);
      });
      if (ok) { imgEl.classList.remove("loading"); imgEl.dataset.file = file; imgEl.dataset.page = page || ""; return { file, page }; }
      if (c.file) { // il file diretto non esiste: prova anche con la ricerca
        const found = await searchCommons(c.query);
        if (found && found.file !== c.file) candidates.splice(i, 0, { file: found.file, page: found.page, query: c.query });
      }
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
        <div class="rc-meta"><span>${total} opere</span>${status}</div>
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
          <a class="source-link" href="${esc(w.museumPage)}" target="_blank" rel="noopener">Scheda dell’opera ↗</a>
        </div>
        <section class="history"><h4>Un po’ di storia</h4><p>${esc(w.history)}</p>
          <p class="history-meta">Fonte: <a href="${esc(w.historySourceUrl)}" target="_blank" rel="noopener">${esc(w.historySource)} ↗</a></p>
          <p class="availability"><strong>Dove si trova:</strong> ${esc(w.availability)}</p></section>
        <div class="music-pick"><div class="music-kicker">DA ASCOLTARE</div><p class="music-title"><strong>${esc(w.music.title)}</strong> — ${esc(w.music.artist)}</p><p class="music-style">${esc(w.music.style)}</p><p class="music-note">${esc(w.music.note)}</p><a class="music-link" href="${esc(w.music.url)}" target="_blank" rel="noopener">▶ Ascolta su YouTube ↗</a></div>
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
  let done = 0, failed = 0;
  const grab = url => fetch(url, { mode: "no-cors" });
  for (const { img, thumb } of jobs) {
    txt.textContent = `Scarico le immagini… ${done + failed + 1} di ${jobs.length}`;
    try {
      let file = img.file;
      if (!file) { const found = await searchCommons(img.query); file = found && found.file; }
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

if ("serviceWorker" in navigator && location.protocol !== "file:") {
  navigator.serviceWorker.register("./sw.js").catch(() => {});
  navigator.serviceWorker.addEventListener("controllerchange", refreshAppBox);
}

loadProgress();
route();
refreshAppBox();
