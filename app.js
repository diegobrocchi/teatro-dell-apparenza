const works = [
  {
    artist: "Pisanello",
    title: "Ritratto di Lionello d’Este",
    room: "Sala 2 · da verificare",
    question: "Quando guardiamo un potente, vediamo l’uomo o il ruolo che deve rappresentare?",
    text: "Cominciamo da un profilo netto. Nel Quattrocento il ritratto di corte non serviva soltanto a conservare le sembianze: costruiva una presenza pubblica. La linea del naso, l’acconciatura e la cura dei dettagli fanno apparire il personaggio riconoscibile e composto. Non abbiamo accesso diretto alla sua interiorità; abbiamo un’immagine scelta e costruita. È il primo patto di questo percorso: un ritratto mostra qualcosa, ma nello stesso tempo decide che cosa lasciare fuori.",
    source: "https://lacarrara.it/collezioni-online/",
    sourceLabel: "Cerca nel catalogo ufficiale"
  },
  {
    artist: "Sandro Botticelli",
    title: "Ritratto di Giuliano de’ Medici",
    room: "Collocazione da verificare",
    question: "Un’immagine può diventare più importante della persona che rappresenta?",
    text: "Giuliano de’ Medici appartiene a una famiglia in cui immagine, prestigio e memoria pubblica erano strettamente legati. Il ritratto non è una fotografia neutrale: la posa e la forma dell’immagine partecipano alla costruzione della memoria. Chi viene ritratto può scomparire, mentre il suo volto continua a circolare. Guardando questo dipinto, proviamo a distinguere la persona storica dal personaggio che la pittura consegna ai posteri.",
    source: "https://lacarrara.it/collezioni-online/",
    sourceLabel: "Cerca nel catalogo ufficiale"
  },
  {
    artist: "Lorenzo Lotto",
    title: "Ritratto di Lucina Brembati",
    room: "Sala 10 · da verificare",
    question: "Un dettaglio può parlare a tutti oppure soltanto a chi conosce il codice?",
    text: "Lorenzo Lotto costruisce un ritratto che invita a guardare oltre la somiglianza. Abito, gioielli, gesto e piccoli particolari contribuiscono a raccontare identità e posizione sociale. Alcuni segni possono avere un significato preciso per chi conosceva la donna e il suo ambiente; per noi possono restare enigmatici. Non dobbiamo fingere di decifrare ogni elemento: possiamo chiederci quali indizi abbiamo davanti e quali informazioni ci mancano.",
    source: "https://lacarrara.it/opera/ritratto-di-lucina-brembati/",
    sourceLabel: "Scheda ufficiale dell’opera"
  },
  {
    artist: "Giovan Battista Moroni",
    title: "Ritratto di bambina di casa Redetti",
    room: "Sala 11 · da verificare",
    question: "Quanto della nostra identità ci viene lasciato scegliere?",
    text: "Anche l’infanzia può essere rappresentata attraverso convenzioni sociali: l’abito, la postura, il modo di stare davanti al pittore. La bambina è una persona singola, ma è anche parte di una famiglia e di un mondo che decide come presentarla. Proviamo a non attribuirle emozioni senza prove. Osserviamo invece ciò che il dipinto ci mostra davvero e chiediamoci quanta parte dell’immagine sia scelta individuale e quanta sia ruolo, educazione e aspettativa.",
    source: "https://lacarrara.it/collezioni-online/",
    sourceLabel: "Cerca nel catalogo ufficiale"
  },
  {
    artist: "Giovan Battista Moroni",
    title: "Ritratto di Bernardo e Pace Rivola Spini",
    room: "Collocazione da verificare",
    question: "Che cosa cambia quando l’identità è raccontata in relazione a un’altra persona?",
    text: "Un ritratto doppio non mostra soltanto due individui: mette in scena una relazione. La vicinanza, le posture e il modo in cui i personaggi occupano lo spazio diventano parte del racconto. Ma anche qui è facile inventare una storia che il quadro non dimostra. Fermiamoci sui segnali visibili: come sono presentati? Che cosa li accomuna e che cosa li distingue? L’immagine costruisce una relazione pubblica, non necessariamente una finestra trasparente sui sentimenti privati.",
    source: "https://lacarrara.it/collezioni-online/",
    sourceLabel: "Cerca nel catalogo ufficiale"
  },
  {
    artist: "Giovan Battista Moroni",
    title: "Ritratto di Isotta Brembati",
    room: "Collocazione da verificare",
    question: "Quanto giudichiamo una persona dai segni esteriori del suo rango?",
    text: "Nel ritratto rinascimentale e cinquecentesco, abiti e ornamenti non sono semplici decorazioni: aiutano a rendere visibili ricchezza, appartenenza e reputazione. Oggi rischiamo di leggere questi segnali con categorie diverse da quelle del tempo. Il compito non è indovinare il carattere di Isotta dal suo aspetto, ma capire come un’immagine potesse comunicare una posizione sociale. La domanda si sposta così dal soggetto al pubblico: chi doveva riconoscere quei segni?",
    source: "https://lacarrara.it/collezioni-online/",
    sourceLabel: "Cerca nel catalogo ufficiale"
  },
  {
    artist: "Fra’ Galgario",
    title: "Ritratto di giovane pittore",
    room: "Collocazione da verificare",
    question: "Un’immagine ricca di dettagli ci permette davvero di conoscere qualcuno?",
    text: "La pittura di Fra’ Galgario è capace di dare ai volti e alle superfici una presenza intensa. Ma la precisione visiva non coincide con la conoscenza completa di una persona. Possiamo osservare il volto, gli abiti, la luce e la posa; non possiamo dedurre con certezza la vita interiore del modello. È una distinzione importante anche fuori dal museo: spesso confondiamo un’impressione vivida con una conoscenza profonda.",
    source: "https://lacarrara.it/collezioni-online/",
    sourceLabel: "Cerca nel catalogo ufficiale"
  },
  {
    artist: "Giacomo Ceruti",
    title: "Ritratto di ragazza con ventaglio",
    room: "Collocazione da verificare",
    question: "Quando guardiamo un volto, quanto stiamo osservando e quanto stiamo immaginando?",
    text: "Il ventaglio e l’abbigliamento offrono indizi, ma non autorizzano qualsiasi interpretazione. Davanti a un ritratto possiamo essere tentati di inventare una biografia o attribuire subito un’emozione. Proviamo a separare i due livelli: che cosa vediamo, e che cosa supponiamo? Questa piccola disciplina dello sguardo è il centro del percorso. Guardare con attenzione non significa sapere tutto: significa diventare più consapevoli di ciò che non sappiamo.",
    source: "https://lacarrara.it/collezioni-online/",
    sourceLabel: "Cerca nel catalogo ufficiale"
  },
  {
    artist: "Giovanni Carnovali, detto il Piccio",
    title: "Autoritratto con tavolozza",
    room: "Collocazione da verificare",
    question: "Siamo più sinceri quando raccontiamo noi stessi?",
    text: "Nell’autoritratto, chi dipinge e chi viene rappresentato coincidono. Ma questo non elimina la costruzione dell’immagine: l’autore sceglie posa, espressione e ciò che desidera rendere visibile. L’autoritratto è insieme osservazione e autorappresentazione. La domanda ci riguarda direttamente: quando raccontiamo chi siamo, mostriamo qualcosa di autentico oppure scegliamo una versione di noi che speriamo venga riconosciuta dagli altri?",
    source: "https://lacarrara.it/collezioni-online/",
    sourceLabel: "Cerca nel catalogo ufficiale"
  },
  {
    artist: "Giuseppe Pellizza da Volpedo",
    title: "Ricordo di un dolore",
    room: "Sala 16 · da verificare",
    question: "Che cosa può conoscere un osservatore della vita interiore di un’altra persona?",
    text: "Concludiamo con un’immagine che porta in primo piano il dolore. Qui il ritratto non serve soprattutto a mostrare rango o reputazione: diventa un’indagine sullo stato d’animo e sulla solitudine. Eppure anche l’emozione più intensa, quando è dipinta, resta una rappresentazione. Possiamo essere colpiti e provare empatia, ma non possediamo l’esperienza dell’altro. Forse il limite dell’immagine non è un difetto: è ciò che ci ricorda che ogni persona resta, in parte, inconoscibile.",
    source: "https://lacarrara.it/collezioni-online/",
    sourceLabel: "Cerca nel catalogo ufficiale"
  }
];

const root = document.getElementById("artworks");
const progressText = document.getElementById("progressText");
const progressFill = document.getElementById("progressFill");
const progressBar = document.getElementById("progressBar");
const audioDock = document.getElementById("audioDock");
const dockTitle = document.getElementById("dockTitle");
let currentUtterance = null;
let isPaused = false;
let largeText = false;
const STORAGE_KEY = "teatro-apparenza-progress-v1";
let completed = new Set();

try {
  const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  completed = new Set(saved.filter(n => Number.isInteger(n) && n >= 0 && n < works.length));
} catch (_) {}

function saveProgress() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify([...completed])); } catch (_) {}
  updateProgress();
}
function updateProgress() {
  const count = completed.size;
  progressText.textContent = `${count} di ${works.length} opere ascoltate`;
  progressFill.style.width = `${count / works.length * 100}%`;
  progressBar.setAttribute("aria-valuenow", String(count));
  document.querySelectorAll(".done-toggle").forEach(btn => {
    const idx = Number(btn.dataset.index);
    btn.setAttribute("aria-pressed", completed.has(idx) ? "true" : "false");
    btn.textContent = completed.has(idx) ? "✓ Ascoltata" : "Segna ascoltata";
    btn.closest(".artwork")?.classList.toggle("done", completed.has(idx));
  });
}
function stopSpeech() {
  if ("speechSynthesis" in window) window.speechSynthesis.cancel();
  currentUtterance = null;
  isPaused = false;
  audioDock.hidden = true;
  document.getElementById("pauseAudio").textContent = "Pausa";
}
function speak(idx) {
  if (!("speechSynthesis" in window) || !("SpeechSynthesisUtterance" in window)) {
    alert("La sintesi vocale non è disponibile in questo browser. Puoi aprire «Leggi il testo» e usare la funzione di lettura del dispositivo.");
    return;
  }
  stopSpeech();
  const work = works[idx];
  currentUtterance = new SpeechSynthesisUtterance(`${work.artist}. ${work.title}. ${work.text} La domanda da portare con te è: ${work.question}`);
  currentUtterance.lang = "it-IT";
  currentUtterance.rate = 0.92;
  currentUtterance.pitch = 1;
  currentUtterance.onstart = () => {
    audioDock.hidden = false;
    dockTitle.textContent = `${String(idx + 1).padStart(2, "0")} · ${work.title}`;
    document.getElementById("pauseAudio").textContent = "Pausa";
    isPaused = false;
  };
  currentUtterance.onend = () => {
    completed.add(idx);
    saveProgress();
    audioDock.hidden = true;
    currentUtterance = null;
    isPaused = false;
  };
  currentUtterance.onerror = (event) => {
    if (event.error !== "canceled" && event.error !== "interrupted") {
      audioDock.hidden = true;
      alert("La voce del dispositivo non è riuscita a riprodurre il testo. Prova a riavviare l'audio.");
    }
  };
  window.speechSynthesis.speak(currentUtterance);
}
function render() {
  root.innerHTML = works.map((w, i) => `
    <article class="artwork ${completed.has(i) ? "done" : ""}" id="opera-${i + 1}">
      <div class="artwork-top">
        <div class="number">${String(i + 1).padStart(2, "0")}</div>
        <div><h3>${w.title}</h3><p class="artist">${w.artist}</p></div>
        <span class="sala">${w.room}</span>
      </div>
      <div class="artwork-body">
        <p class="question">${w.question}</p>
        <div class="actions">
          <button class="listen" type="button" data-index="${i}">▶ Ascolta</button>
          <button class="read-toggle" type="button" aria-expanded="false" data-index="${i}">Leggi il testo</button>
          <button class="done-toggle" type="button" aria-pressed="${completed.has(i)}" data-index="${i}">${completed.has(i) ? "✓ Ascoltata" : "Segna ascoltata"}</button>
        </div>
        <div class="script" id="script-${i}" aria-hidden="true">
          <p>${w.text}</p>
          <p><strong>Da discutere:</strong> ${w.question}</p>
          <a class="source-link" href="${w.source}" target="_blank" rel="noopener">${w.sourceLabel} ↗</a>
        </div>
      </div>
    </article>
  `).join("");
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
    if (completed.has(idx)) completed.delete(idx); else completed.add(idx);
    saveProgress();
  }));
  updateProgress();
}
document.getElementById("pauseAudio").addEventListener("click", () => {
  if (!("speechSynthesis" in window)) return;
  if (isPaused) { window.speechSynthesis.resume(); isPaused = false; document.getElementById("pauseAudio").textContent = "Pausa"; }
  else { window.speechSynthesis.pause(); isPaused = true; document.getElementById("pauseAudio").textContent = "Riprendi"; }
});
document.getElementById("stopAudio").addEventListener("click", stopSpeech);
document.getElementById("resetProgress").addEventListener("click", () => {
  if (confirm("Vuoi azzerare l'avanzamento del percorso su questo dispositivo?")) {
    completed.clear(); saveProgress();
  }
});
document.getElementById("textSize").addEventListener("click", () => {
  largeText = !largeText;
  document.body.classList.toggle("large-text", largeText);
  document.getElementById("textSize").textContent = largeText ? "A−" : "A+";
});
document.getElementById("finishButton").addEventListener("click", () => {
  completed = new Set(works.map((_, i) => i));
  saveProgress();
  document.getElementById("percorso").scrollIntoView({ behavior: "smooth" });
});
document.addEventListener("visibilitychange", () => {
  if (document.hidden && "speechSynthesis" in window && !isPaused) window.speechSynthesis.pause();
});
render();
