let activeRoute = 0;
let completedByRoute = {};
let currentUtterance = null;
let isPaused = false;
let largeText = false;
const select = document.getElementById("routeSelect");
const root = document.getElementById("artworks");
const audioDock = document.getElementById("audioDock");
const dockTitle = document.getElementById("dockTitle");
const progressText = document.getElementById("progressText");
const progressFill = document.getElementById("progressFill");

routes.forEach((route, i) => {
  const opt = document.createElement("option");
  opt.value = String(i);
  opt.textContent = `${String(i + 1).padStart(2, "0")} · ${route.title}`;
  select.appendChild(opt);
});
function doneSet() {
  if (!completedByRoute[activeRoute]) completedByRoute[activeRoute] = new Set();
  return completedByRoute[activeRoute];
}
function saveProgress() {
  try {
    const serial = {};
    Object.keys(completedByRoute).forEach(k => serial[k] = Array.from(completedByRoute[k]));
    localStorage.setItem("carraraTenRoutesProgress", JSON.stringify(serial));
  } catch(e) {}
  updateProgress();
}
function loadProgress() {
  try {
    const saved = JSON.parse(localStorage.getItem("carraraTenRoutesProgress") || "{}");
    Object.keys(saved).forEach(k => completedByRoute[k] = new Set(saved[k]));
  } catch(e) {}
}
function updateProgress() {
  const done = doneSet().size;
  const total = routes[activeRoute].works.length;
  progressText.textContent = `${done} di ${total} opere segnate`;
  progressFill.style.width = `${total ? done / total * 100 : 0}%`;
  root.querySelectorAll(".done-toggle").forEach(btn => {
    const idx = Number(btn.dataset.index);
    const isDone = doneSet().has(idx);
    btn.setAttribute("aria-pressed", String(isDone));
    btn.textContent = isDone ? "✓ Segnata" : "Segna vista";
    btn.closest(".artwork").classList.toggle("done", isDone);
  });
}
function stopSpeech() {
  if ("speechSynthesis" in window) window.speechSynthesis.cancel();
  currentUtterance = null; isPaused = false; audioDock.hidden = true;
}
function speak(idx) {
  if (!("speechSynthesis" in window)) {
    alert("Questo browser non supporta la sintesi vocale. Puoi leggere il testo nella scheda.");
    return;
  }
  stopSpeech();
  const w = routes[activeRoute].works[idx];
  currentUtterance = new SpeechSynthesisUtterance(`${w.artist}. ${w.title}. ${w.text} Domanda per te: ${w.question}`);
  currentUtterance.lang = "it-IT";
  currentUtterance.rate = 0.93;
  currentUtterance.onstart = () => {
    audioDock.hidden = false;
    dockTitle.textContent = `${String(idx + 1).padStart(2, "0")} · ${w.title}`;
    document.getElementById("pauseAudio").textContent = "Pausa";
    isPaused = false;
  };
  currentUtterance.onend = () => {
    doneSet().add(idx); saveProgress(); audioDock.hidden = true; currentUtterance = null; isPaused = false;
  };
  currentUtterance.onerror = (event) => {
    if (event.error !== "canceled" && event.error !== "interrupted") {
      audioDock.hidden = true;
      alert("La voce del dispositivo non è riuscita a riprodurre il testo. Prova a riavviare l'audio.");
    }
  };
  window.speechSynthesis.speak(currentUtterance);
}
function imageMarkup(w) {
  const imgs = w.images || [{file:w.image, caption:`${w.artist}, ${w.title}`, page:w.imagePage}];
  return imgs.map(img => {
    const direct = img.page.includes("Special:MediaSearch") ? img.page : `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(img.file)}?width=1800`;
    return `<figure class="painting-figure"><img src="${direct}" alt="${img.caption || `${w.artist}, ${w.title}`}" loading="lazy" decoding="async"><figcaption>${img.caption || `${w.artist}, ${w.title}`} · <a href="${img.page}" target="_blank" rel="noopener">fonte immagine / licenza ↗</a></figcaption></figure>`;
  }).join("");
}
function render() {
  const route = routes[activeRoute];
  document.getElementById("routeSubtitle").textContent = route.subtitle;
  document.getElementById("routeIntro").textContent = route.intro;
  document.getElementById("workCount").textContent = `${route.works.length} tappe`;
  document.getElementById("roomOrder").textContent = "Sale in ordine crescente";
  root.innerHTML = route.works.map((w, i) => `
    <article class="artwork ${doneSet().has(i) ? "done" : ""}" id="opera-${i+1}">
      <div class="artwork-top"><div class="number">${String(i+1).padStart(2,"0")}</div><div><h3>${w.title}</h3><p class="artist">${w.artist}</p></div><span class="sala">${w.roomLabel}</span></div>
      <div class="painting-gallery">${imageMarkup(w)}</div>
      <div class="artwork-body">
        <section class="history"><h4>Storia documentata</h4><p>${w.history}</p><p class="history-meta"><strong>Fonte:</strong> ${w.historySource} · ${w.historySourceType} · <a href="${w.historySourceUrl}" target="_blank" rel="noopener">Apri la fonte ↗</a></p><p class="availability"><strong>Esposizione:</strong> ${w.availability}</p></section>
        <p class="question">${w.question}</p>
        <div class="actions"><button class="listen" type="button" data-index="${i}">▶ Ascolta spiegazione</button><button class="read-toggle" type="button" aria-expanded="false" data-index="${i}">Leggi il testo</button><button class="done-toggle" type="button" aria-pressed="${doneSet().has(i)}" data-index="${i}">${doneSet().has(i) ? "✓ Segnata" : "Segna vista"}</button></div>
        <div class="script" id="script-${i}" aria-hidden="true"><p>${w.text}</p><p><strong>Domanda:</strong> ${w.question}</p><p><strong>Datazione:</strong> ${w.date}</p><a class="source-link" href="${w.museumPage}" target="_blank" rel="noopener">Apri la scheda o la fonte catalografica ↗</a></div>
        <div class="music-pick"><div class="music-kicker">ACCOSTAMENTO MUSICALE</div><p class="music-title"><strong>${w.music.title}</strong> — ${w.music.artist}</p><p class="music-style">${w.music.style}</p><p class="music-note">${w.music.note}</p><a class="music-link" href="${w.music.url}" target="_blank" rel="noopener">▶ Cerca il brano su YouTube ↗</a></div>
      </div>
    </article>`).join("");
  root.querySelectorAll(".listen").forEach(btn => btn.addEventListener("click", () => speak(Number(btn.dataset.index))));
  root.querySelectorAll(".read-toggle").forEach(btn => btn.addEventListener("click", () => {
    const script = document.getElementById(`script-${btn.dataset.index}`);
    const open = script.classList.toggle("open");
    script.setAttribute("aria-hidden", String(!open));
    btn.setAttribute("aria-expanded", String(open));
    btn.textContent = open ? "Nascondi testo" : "Leggi il testo";
  }));
  root.querySelectorAll(".done-toggle").forEach(btn => btn.addEventListener("click", () => {
    const idx = Number(btn.dataset.index);
    if (doneSet().has(idx)) doneSet().delete(idx); else doneSet().add(idx);
    saveProgress();
  }));
  updateProgress();
}
select.addEventListener("change", () => { stopSpeech(); activeRoute = Number(select.value); render(); window.scrollTo({top:0,behavior:"smooth"}); });
document.getElementById("pauseAudio").addEventListener("click", () => {
  if (!("speechSynthesis" in window)) return;
  if (isPaused) { window.speechSynthesis.resume(); isPaused = false; document.getElementById("pauseAudio").textContent = "Pausa"; }
  else { window.speechSynthesis.pause(); isPaused = true; document.getElementById("pauseAudio").textContent = "Riprendi"; }
});
document.getElementById("stopAudio").addEventListener("click", stopSpeech);
document.getElementById("resetProgress").addEventListener("click", () => {
  if (confirm("Vuoi azzerare l'avanzamento di questo percorso sul dispositivo?")) { completedByRoute[activeRoute] = new Set(); saveProgress(); }
});
document.getElementById("textSize").addEventListener("click", () => {
  largeText = !largeText; document.body.classList.toggle("large-text", largeText);
  document.getElementById("textSize").textContent = largeText ? "A−" : "A+";
});
document.addEventListener("visibilitychange", () => {
  if (document.hidden && "speechSynthesis" in window && !isPaused) window.speechSynthesis.pause();
});
loadProgress();
render();
