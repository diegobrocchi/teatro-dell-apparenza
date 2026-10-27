# Dieci modi di guardare — Accademia Carrara

Guida web statica mobile-first per GitHub Pages. Include il percorso “Il teatro dell’apparenza” e nove percorsi tematici aggiuntivi.

## Contenuto
- `index.html`: interfaccia responsive: elenco dei percorsi con miniature, poi la pagina del percorso scelto
- `styles.css`: stile mobile-first e immagini grandi
- `app.js`: avanzamento per percorso, immagini, interazioni
- `manifest.webmanifest`, `sw.js`, cartella `icons/`: rendono il sito un’app installabile (PWA) usabile anche offline
- `routes.js`: contenuti, opere, immagini, testi e musica dei dieci percorsi
- `AGGIORNA_IL_GIORNO_PRIMA.txt`: prompt da riutilizzare il giorno prima della visita (solo per chi cura la guida: non è collegato dalla pagina)

## Pubblicazione
1. Estrai lo ZIP.
2. Carica nella repository tutti i file dello ZIP, compresa la cartella `icons/`, mantenendo la stessa struttura.
3. In GitHub vai in **Settings → Pages → Deploy from a branch**, seleziona `main` e `/root`.
4. Attendi la pubblicazione.

## Nota importante sulle sale e sulla disponibilità
Il catalogo ufficiale dell’Accademia Carrara si aggiorna nel tempo. In questa versione alcune collocazioni sono indicate come da riconfermare e alcune immagini usano la ricerca Wikimedia anziché un file diretto. Prima della visita esegui il prompt in `AGGIORNA_IL_GIORNO_PRIMA.txt`: controlla le schede ufficiali, escludi opere non esposte, verifica le immagini e riordina ogni percorso per sala. Non considerare questa bozza come attestazione della disponibilità il giorno della visita.

## Immagini e musica
Le immagini si caricano da Wikimedia Commons o da pagine di ricerca Commons e richiedono connessione Internet. Ogni immagine apre la propria fonte o la ricerca della fonte.

## App sul telefono (PWA)
- **Android (Chrome):** nella pagina iniziale compare il pulsante “Aggiungi alla Home”.
- **iPhone/iPad:** in Safari, Condividi → “Aggiungi alla schermata Home” (la pagina mostra l’istruzione). Su iPhone l’app installata ha uno spazio dati separato da Safari: il download delle immagini per l’uso offline va fatto aprendo l’app dall’icona.
- **Uso offline:** il pulsante “Scarica per l’uso offline” salva le immagini sul telefono. Testi e immagini salvate funzionano senza rete; i link YouTube e le fonti richiedono la connessione.
- **Quando aggiorni il sito:** cambia il valore `VERSION` in cima a `sw.js`. Chi ha l’app vede la nuova versione alla prima apertura con connessione.
