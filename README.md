# Il teatro dell'apparenza — guida audio per Accademia Carrara

Sito statico pensato per smartphone e pubblicazione gratuita su GitHub Pages.

## Funzioni
- Dieci tappe collegate dal tema dell'identità e dell'apparenza.
- Un accostamento musicale italiano per ogni opera, con motivazione e collegamento alla ricerca YouTube. I brani sono suggerimenti editoriali, non una playlist ufficiale del museo.
- Audio generato sul dispositivo tramite `SpeechSynthesis` del browser: non richiede API, account o file MP3.
- Controlli pausa/riprendi/ferma.
- Testo consultabile anche senza audio.
- Avanzamento salvato localmente sul dispositivo.
- Layout responsive e controllo per aumentare il testo.

## Pubblicazione su GitHub Pages
1. Crea un repository GitHub, ad esempio `teatro-dell-apparenza`.
2. Carica `index.html`, `styles.css`, `app.js` e `README.md` nella radice del repository.
3. Apri **Settings → Pages**.
4. In **Build and deployment**, seleziona **Deploy from a branch**.
5. Seleziona il branch `main` e la cartella `/ (root)`, poi salva.
6. Dopo la pubblicazione, GitHub mostrerà l'indirizzo del sito nelle impostazioni Pages.

Non c'è una fase di build: sono file HTML, CSS e JavaScript statici.

## Audio su telefono
L'audio usa la voce italiana installata nel browser/sistema operativo. La qualità e la disponibilità delle voci variano tra dispositivi. Su alcuni browser la sintesi vocale può interrompersi passando ad altre app o bloccando lo schermo. Per una riproduzione più affidabile anche con schermo spento, la versione successiva può usare file audio MP3 preregistrati.

## Importante: verifica prima della visita
Questa è una prima versione editoriale. Le interpretazioni sono originali; non sono testi ufficiali del museo. Alcuni titoli provengono da materiali didattici dell'Accademia Carrara, ma disponibilità, titolo catalografico esatto e sala possono cambiare. Le indicazioni di sala sono marcate “da verificare” quando non sono state confermate. Prima di usare il percorso in museo:
- controlla ogni opera nel [catalogo ufficiale](https://lacarrara.it/collezioni-online/);
- verifica che sia esposta nel giorno della visita;
- aggiorna sala e titolo se necessario.

Il sito non scarica immagini delle opere: i collegamenti portano al catalogo ufficiale. Questo evita di incorporare immagini senza aver verificato i relativi diritti.

## Accostamenti musicali
I brani sono collegati alle opere come contrappunti interpretativi, non come illustrazioni letterali. Ogni scheda apre una ricerca YouTube: così puoi scegliere una versione ufficiale o una registrazione disponibile senza dipendere da un URL video che potrebbe cambiare. I metadati musicali sono nel campo `music` di ogni elemento dell'array `works` in `app.js`.

## Personalizzazione
I testi e i dati delle opere sono nell'array `works` all'inizio di `app.js`. Puoi modificare:
- `artist`, `title`, `room`, `question`, `text`;
- `source` e `sourceLabel`.

Il progresso è salvato nel `localStorage` del browser e resta separato per dispositivo/browser.

## Licenza
Puoi modificare e pubblicare questo progetto per uso personale. Verifica separatamente diritti e condizioni prima di redistribuire immagini o materiali di terzi.
