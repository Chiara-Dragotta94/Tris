# Tris (Tic Tac Toe) - Vue 3

Mini-sito del gioco Tris realizzato con Vue 3 e Vite.

## Obiettivi coperti

- Griglia 3x3 visibile appena inizia la partita
- Primo click sempre `X`, poi alternanza automatica `X/O`
- Possibilita di scegliere il nome dei giocatori
- Pulsante **Abbandona partita**: chi preme perde e la vittoria va all'altro
- Conteggio vittorie di `X` e `O` valido solo durante la sessione (in memoria)
- Messaggi dinamici quando:
  - la partita inizia
  - cambia il turno
  - un giocatore vince
  - la partita termina in pareggio
  - un giocatore abbandona

## Avvio progetto

```bash
npm install
npm run dev
```

Per creare una build di produzione:

```bash
npm run build
```

## Struttura del progetto

- `src/App.vue`
  - coordina tutta l'app
  - gestisce nomi, punteggi di sessione e messaggi evento
  - collega i componenti `Giocatore` e `Griglia`
- `src/components/Giocatore.vue`
  - form per inserire i nomi dei giocatori
  - validazione semplice (nomi diversi)
- `src/components/Griglia.vue`
  - render della griglia 3x3
  - pulsanti azione: nuova partita / abbandona partita
  - mostra stato e messaggi
- `src/composables/useTris.js`
  - logica pura del gioco:
    - mossa su cella
    - cambio turno
    - controllo vittoria
    - controllo pareggio
    - reset
    - abbandono

## Logica dei punteggi di sessione

I punteggi (`vittorieX`, `vittorieO`) sono gestiti in `App.vue` con `ref`.
Non viene usato `localStorage`, quindi:

- se ricarichi la pagina, i punteggi si azzerano
- se chiudi l'app, i punteggi si azzerano

Questo comportamento rispetta il requisito: salvare il valore delle vittorie solo finche l'app resta aperta.

