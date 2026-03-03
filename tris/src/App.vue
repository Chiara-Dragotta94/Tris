<script setup>
import { ref } from 'vue'
import Giocatore from './components/Giocatore.vue'
import Griglia from './components/Griglia.vue'
import { useTris } from './composables/useTris'

// Qui tengo i dati della sessione corrente: nomi e punteggi restano validi finche l'app resta aperta.
const partitaAvviata = ref(false)
const nomeGiocatoreX = ref('Giocatore X')
const nomeGiocatoreO = ref('Giocatore O')
const vittorieX = ref(0)
const vittorieO = ref(0)
const messaggioEvento = ref('Benvenuti! Inserite i nomi e iniziate la sfida.')

const {
  tabellone,
  simboloCorrente,
  simboloVincitore,
  celleVincenti,
  partitaTerminata,
  pareggio,
  giocaCella,
  nuovaPartita,
  abbandonaPartita
} = useTris()

const messaggiTurno = [
  'Tocca a {nome}: questa mossa puo cambiare tutto!',
  'Occhi sul tabellone, {nome}: e il tuo momento.',
  'Vai {nome}, scegli la casella giusta.',
  'Turno di {nome}: punta al tris perfetto.'
]

const messaggiVittoria = [
  'Applausi per {nome}! Tris completato e vittoria meritata.',
  'Grandissimo {nome}! Hai chiuso la partita con stile.',
  '{nome} domina il tabellone: vittoria!',
  'Che giocata, {nome}! Punto pieno.'
]

const messaggiPareggio = [
  'Partita tiratissima: pareggio! Rivincita?',
  'Nessuno molla, nessuno perde: pareggio.',
  'Equilibrio totale sul tabellone. Pareggio!',
  'Sfida alla pari: finisce in pareggio.'
]

function nomeDaSimbolo(simbolo) {
  // Traduco il simbolo in nome per mostrare sempre messaggi personalizzati.
  return simbolo === 'X' ? nomeGiocatoreX.value : nomeGiocatoreO.value
}

function messaggioCasuale(lista) {
  // Scelgo una frase casuale per rendere l'esperienza meno ripetitiva.
  const indice = Math.floor(Math.random() * lista.length)
  return lista[indice]
}

function creaMessaggio(lista, nome) {
  // Sostituisco il placeholder con il nome reale del giocatore.
  return messaggioCasuale(lista).replace('{nome}', nome)
}

function aggiornaPunteggio(simbolo) {
  // Aggiorno il punteggio solo alla fine della partita (vittoria normale o abbandono).
  if (simbolo === 'X') vittorieX.value += 1
  if (simbolo === 'O') vittorieO.value += 1
}

function avvia({ nomeX, nomeO }) {
  // Salvo i nomi, avvio la sessione di gioco e resetto lo stato partita.
  nomeGiocatoreX.value = nomeX
  nomeGiocatoreO.value = nomeO
  partitaAvviata.value = true
  nuovaPartita()
  messaggioEvento.value =
    `Sfida iniziata! ${nomeGiocatoreX.value} gioca con X, ${nomeGiocatoreO.value} con O. Si parte!`
}

function clicCella(indice) {
  // Salvo il turno prima del click per evitare messaggi incoerenti se la mossa viene ignorata.
  const simboloTurnoPrimaDelClick = simboloCorrente.value
  const vincitorePrecedente = simboloVincitore.value

  giocaCella(indice)

  if (!vincitorePrecedente && simboloVincitore.value) {
    aggiornaPunteggio(simboloVincitore.value)
    messaggioEvento.value = creaMessaggio(
      messaggiVittoria,
      nomeDaSimbolo(simboloVincitore.value)
    )
    return
  }

  if (pareggio.value) {
    messaggioEvento.value = messaggioCasuale(messaggiPareggio)
    return
  }

  if (simboloTurnoPrimaDelClick !== simboloCorrente.value) {
    messaggioEvento.value = creaMessaggio(
      messaggiTurno,
      nomeDaSimbolo(simboloCorrente.value)
    )
  }
}

function creaNuovaPartita() {
  nuovaPartita()
  messaggioEvento.value = `Nuova partita! Inizia ${nomeDaSimbolo('X')} (X): buona fortuna.`
}

function abbandona() {
  // Se un giocatore abbandona, il composable restituisce il simbolo vincente.
  const simboloVincente = abbandonaPartita()
  if (!simboloVincente) return

  aggiornaPunteggio(simboloVincente)
  messaggioEvento.value =
    `${nomeDaSimbolo(simboloCorrente.value)} ha abbandonato. Punto a ${nomeDaSimbolo(simboloVincente)}!`
}

function azzeraPunteggiSessione() {
  // Questo reset pulisce solo il punteggio in memoria senza chiudere l'app.
  vittorieX.value = 0
  vittorieO.value = 0
  messaggioEvento.value = 'Punteggi di sessione azzerati. Nuova storia da scrivere!'
}
</script>

<template>
  <main class="pagina">
    <section class="contenitore">
      <!-- Mostro il form iniziale finche la partita non viene avviata. -->
      <Giocatore v-if="!partitaAvviata" @avvia="avvia" />

      <template v-else>
        <!-- Questo blocco riepiloga il punteggio della sessione corrente. -->
        <header class="punteggio">
          <div class="scheda-giocatore">
            <p class="nome">{{ nomeGiocatoreX }} (X)</p>
            <p class="vittorie">{{ vittorieX }} vittorie</p>
          </div>
          <div class="scheda-giocatore">
            <p class="nome">{{ nomeGiocatoreO }} (O)</p>
            <p class="vittorie">{{ vittorieO }} vittorie</p>
          </div>
        </header>

        <Griglia
          :tabellone="tabellone"
          :simbolo-corrente="simboloCorrente"
          :simbolo-vincitore="simboloVincitore"
          :celle-vincenti="celleVincenti"
          :partita-terminata="partitaTerminata"
          :pareggio="pareggio"
          :nome-giocatore-x="nomeGiocatoreX"
          :nome-giocatore-o="nomeGiocatoreO"
          :messaggio-evento="messaggioEvento"
          @clic-cella="clicCella"
          @nuova-partita="creaNuovaPartita"
          @abbandona="abbandona"
        />

        <!-- Questo pulsante azzera solo il conteggio della sessione aperta. -->
        <button type="button" class="bottone-reset-sessione" @click="azzeraPunteggiSessione">
          Azzera punteggi sessione
        </button>
      </template>
    </section>
  </main>
</template>

<style scoped>
.pagina {
  min-height: 100vh;
  padding: 1.5rem;
  background: linear-gradient(135deg, #001219 0%, #003049 40%, #005f73 100%);
}

.contenitore {
  max-width: 760px;
  margin: 0 auto;
  background: rgba(0, 0, 0, 0.25);
  backdrop-filter: blur(4px);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 18px;
  padding: 1.2rem;
  box-shadow: 0 18px 38px rgba(0, 0, 0, 0.35);
}

.punteggio {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.scheda-giocatore {
  background: rgba(255, 255, 255, 0.16);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  padding: 0.75rem;
  color: #ffffff;
  text-align: center;
}

.nome,
.vittorie {
  margin: 0;
}

.nome {
  font-weight: 700;
}

.vittorie {
  margin-top: 0.2rem;
}

.bottone-reset-sessione {
  margin-top: 1rem;
  width: 100%;
  border: none;
  border-radius: 12px;
  color: #ffffff;
  background: #7b2cbf;
  font-weight: 600;
}

@media (max-width: 620px) {
  .punteggio {
    grid-template-columns: 1fr;
  }
}
</style>
