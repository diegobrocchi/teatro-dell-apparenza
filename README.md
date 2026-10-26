# Dieci modi di guardare — Accademia Carrara

Guida web statica mobile-first per GitHub Pages. Include il percorso “Il teatro dell’apparenza” e nove percorsi tematici aggiuntivi.

## Contenuto
- `index.html`: interfaccia responsive con selettore di percorso
- `styles.css`: stile mobile-first e immagini grandi
- `app.js`: sintesi vocale, avanzamento per percorso, interazioni
- `routes.js`: contenuti, opere, immagini, testi e musica dei dieci percorsi
- `AGGIORNA_IL_GIORNO_PRIMA.txt`: prompt da riutilizzare il giorno prima della visita

## Pubblicazione
1. Estrai lo ZIP.
2. Carica i cinque file web (`index.html`, `styles.css`, `app.js`, `routes.js`, `AGGIORNA_IL_GIORNO_PRIMA.txt`) e questo README nella repository.
3. In GitHub vai in **Settings → Pages → Deploy from a branch**, seleziona `main` e `/root`.
4. Attendi la pubblicazione.

## Nota importante sulle sale e sulla disponibilità
Il catalogo ufficiale dell’Accademia Carrara si aggiorna nel tempo. In questa versione alcune collocazioni sono indicate come da riconfermare e alcune immagini usano la ricerca Wikimedia anziché un file diretto. Prima della visita esegui il prompt in `AGGIORNA_IL_GIORNO_PRIMA.txt`: controlla le schede ufficiali, escludi opere non esposte, verifica le immagini e riordina ogni percorso per sala. Non considerare questa bozza come attestazione della disponibilità il giorno della visita.

## Immagini e audio
Le immagini si caricano da Wikimedia Commons o da pagine di ricerca Commons e richiedono connessione Internet. Ogni immagine apre la propria fonte o la ricerca della fonte. L’audio delle spiegazioni usa `SpeechSynthesis` del browser: voce e comportamento dipendono dal telefono/browser. I brani musicali si aprono su YouTube e non sono incorporati nel sito.
