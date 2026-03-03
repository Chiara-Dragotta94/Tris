<script setup>
import { computed } from 'vue'

// Questo componente riceve tutto lo stato dal padre e si limita a mostrarlo in UI.
const props = defineProps({
  tabellone: {
    type: Array,
    required: true
  },
  simboloCorrente: {
    type: String,
    required: true
  },
  simboloVincitore: {
    type: String,
    default: null
  },
  celleVincenti: {
    type: Array,
    default: () => []
  },
  partitaTerminata: {
    type: Boolean,
    required: true
  },
  pareggio: {
    type: Boolean,
    required: true
  },
  nomeGiocatoreX: {
    type: String,
    required: true
  },
  nomeGiocatoreO: {
    type: String,
    required: true
  },
  messaggioEvento: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['clic-cella', 'nuova-partita', 'abbandona'])

function nomeDaSimbolo(simbolo) {
  // Converto il simbolo in nome per avere messaggi chiari e leggibili.
  return simbolo === 'X' ? props.nomeGiocatoreX : props.nomeGiocatoreO
}

const chiaveLineaVincente = computed(() => {
  // Ordino gli indici per ottenere una chiave stabile (es. 0-4-8) per le classi CSS.
  if (!props.celleVincenti?.length) return ''
  return [...props.celleVincenti].sort((a, b) => a - b).join('-')
})

function cellaVincente(indice) {
  // Mi serve per evidenziare con stile dedicato solo le 3 celle della combinazione vincente.
  return props.celleVincenti.includes(indice)
}
</script>

<template>
  <section class="pannello-gioco">
    <h1 class="titolo">Tris</h1>
    <!-- Rendo il messaggio "animabile" cambiando key quando il testo si aggiorna. -->
    <p class="messaggio-evento" :key="messaggioEvento">{{ messaggioEvento }}</p>

    <p v-if="simboloVincitore" class="stato-partita">
      Vincitore: <strong>{{ nomeDaSimbolo(simboloVincitore) }} ({{ simboloVincitore }})</strong>
    </p>
    <p v-else-if="pareggio" class="stato-partita">
      <strong>Partita in pareggio.</strong>
    </p>
    <p v-else class="stato-partita">
      Turno di <strong>{{ nomeDaSimbolo(simboloCorrente) }} ({{ simboloCorrente }})</strong>
    </p>

    <div class="griglia">
      <!-- Disegno le 9 celle del tabellone e inoltro al padre l'indice cliccato. -->
      <button
        v-for="(cella, indice) in tabellone"
        :key="indice"
        type="button"
        class="cella"
        :class="{ 'cella-vincente': cellaVincente(indice) }"
        :disabled="partitaTerminata"
        @click="emit('clic-cella', indice)"
      >
        {{ cella }}
      </button>

      <div
        v-if="chiaveLineaVincente"
        class="linea-vincente"
        :class="`linea-${chiaveLineaVincente}`"
      ></div>
    </div>

    <div class="azioni">
      <!-- Il reset rilancia una nuova partita senza toccare il punteggio sessione. -->
      <button type="button" class="bottone secondario" @click="emit('nuova-partita')">
        Nuova partita
      </button>
      <button
        type="button"
        class="bottone pericolo"
        :disabled="partitaTerminata"
        @click="emit('abbandona')"
      >
        Abbandona partita
      </button>
    </div>
  </section>
</template>

<style scoped>
.pannello-gioco {
  display: grid;
  gap: 1rem;
  justify-items: center;
}

.titolo {
  margin: 0;
  font-size: 2rem;
  letter-spacing: 0.04em;
}

.messaggio-evento {
  margin: 0;
  background: rgba(255, 255, 255, 0.16);
  color: #ffffff;
  border: 1px solid rgba(255, 255, 255, 0.3);
  padding: 0.55rem 0.85rem;
  border-radius: 12px;
  animation: apparizioneMessaggio 380ms ease;
}

.stato-partita {
  margin: 0;
  font-size: 1.05rem;
  color: #f7f7f7;
}

.griglia {
  --dimensione-cella: 94px;
  --spazio: 10px;
  display: grid;
  grid-template-columns: repeat(3, var(--dimensione-cella));
  gap: var(--spazio);
  position: relative;
  overflow: hidden;
}

.cella {
  width: var(--dimensione-cella);
  height: var(--dimensione-cella);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.25);
  background: rgba(255, 255, 255, 0.15);
  color: #ffffff;
  font-size: 2rem;
  font-weight: 700;
  transition: transform 0.15s ease, background 0.15s ease, box-shadow 0.2s ease;
}

.cella:hover:enabled {
  transform: translateY(-2px);
  background: rgba(255, 255, 255, 0.24);
  box-shadow: 0 8px 14px rgba(0, 0, 0, 0.25);
}

.cella:disabled {
  cursor: not-allowed;
  opacity: 0.85;
}

.cella-vincente {
  background: rgba(80, 227, 194, 0.35);
  border-color: rgba(80, 227, 194, 0.75);
  animation: battitoCella 420ms ease-in-out 2;
}

.linea-vincente {
  position: absolute;
  z-index: 2;
  pointer-events: none;
  background: linear-gradient(90deg, #ffd166, #ef476f);
  box-shadow: 0 0 10px rgba(255, 209, 102, 0.8);
  top: var(--linea-top);
  left: var(--linea-left);
  width: var(--linea-lunghezza);
  height: 6px;
  border-radius: 99px;
  transform-origin: center center;
  transform: translate(-50%, -50%) rotate(var(--linea-rotazione)) scaleX(0);
  animation: disegnaLinea 420ms ease-out forwards;
}

.linea-0-1-2,
.linea-3-4-5,
.linea-6-7-8 {
  --linea-left: 50%;
  --linea-lunghezza: 84%;
  --linea-rotazione: 0deg;
}

.linea-0-1-2 {
  --linea-top: 16.66%;
}

.linea-3-4-5 {
  --linea-top: 50%;
}

.linea-6-7-8 {
  --linea-top: 83.33%;
}

.linea-0-3-6,
.linea-1-4-7,
.linea-2-5-8 {
  --linea-top: 50%;
  --linea-lunghezza: 84%;
  --linea-rotazione: 90deg;
}

.linea-0-3-6 {
  --linea-left: 16.66%;
}

.linea-1-4-7 {
  --linea-left: 50%;
}

.linea-2-5-8 {
  --linea-left: 83.33%;
}

.linea-0-4-8,
.linea-2-4-6 {
  --linea-top: 50%;
  --linea-left: 50%;
  --linea-lunghezza: 98%;
}

.linea-0-4-8 {
  --linea-rotazione: 45deg;
}

.linea-2-4-6 {
  --linea-rotazione: -45deg;
}

@keyframes disegnaLinea {
  from {
    transform: translate(-50%, -50%) rotate(var(--linea-rotazione)) scaleX(0);
  }
  to {
    transform: translate(-50%, -50%) rotate(var(--linea-rotazione)) scaleX(1);
  }
}

@keyframes battitoCella {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.06);
  }
}

@keyframes apparizioneMessaggio {
  from {
    opacity: 0;
    transform: translateY(-6px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.azioni {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.7rem;
}

.bottone {
  border: none;
  color: #ffffff;
  font-weight: 600;
  padding: 0.7rem 1.1rem;
  border-radius: 12px;
}

.secondario {
  background: #2354e6;
}

.pericolo {
  background: #b71c1c;
}

.bottone:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}
</style>
