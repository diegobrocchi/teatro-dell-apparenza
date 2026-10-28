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
- **Quando aggiorni il sito:** basta pubblicare i file, senza cambiare numeri di versione. La pagina confronta i file che sta usando con quelli pubblicati (all’apertura, quando l’app torna in primo piano, quando torna la rete e ogni 30 minuti) e, se sono cambiati, si ricarica da sola sullo stesso punto, mostrando “Guida aggiornata”. Dopo la pubblicazione GitHub può impiegare qualche minuto a distribuire i file nuovi. Cambia `SW_REVISION` in `sw.js` solo se modifichi `sw.js` stesso.

## Musica
- **Abbinamento di oggi:** link a una ricerca YouTube (esce dall'app).
- **Musica del tempo dell'opera:** player integrato (HTML5) con registrazioni libere da Wikimedia Commons e Internet Archive; crediti e licenza sotto ogni brano. Il pulsante "Scarica la musica" salva i brani sul telefono (cache "carrara-musica") e il service worker li serve anche a pezzi, come richiedono i telefoni, così funzionano offline.
- **Prossimo passo (lettura + musica):** per ogni opera un unico MP3 con la musica d'apertura, la voce con la musica abbassata sotto e la musica finale. Basterà mettere nel campo `track.src` l'indirizzo del nuovo file (ospitato nella cartella `audio/` del sito). Le licenze scelte permettono il montaggio; per CC BY-SA il file montato va distribuito con la stessa licenza e i crediti.
