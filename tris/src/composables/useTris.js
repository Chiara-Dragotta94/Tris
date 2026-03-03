import { computed, ref } from 'vue'

// Tengo separate le combinazioni in costante per evitare duplicazioni nella logica.
const combinazioniVittoria = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
]

export function useTris() {
  // Qui tengo lo stato principale della partita: tabellone, turno e risultato finale.
  const tabellone = ref(Array(9).fill(''))
  const simboloCorrente = ref('X')
  const simboloVincitore = ref(null)
  const celleVincenti = ref([])
  const partitaTerminata = ref(false)

  // Considero pareggio quando il tabellone e pieno e non esiste un vincitore.
  const pareggio = computed(
    () => !simboloVincitore.value && tabellone.value.every((cella) => cella !== '')
  )

  function controllaVittoria() {
    // Controllo tutte le combinazioni possibili per capire se qualcuno ha completato una linea.
    for (const [a, b, c] of combinazioniVittoria) {
      const simboloA = tabellone.value[a]

      if (
        simboloA &&
        simboloA === tabellone.value[b] &&
        simboloA === tabellone.value[c]
      ) {
        simboloVincitore.value = simboloA
        celleVincenti.value = [a, b, c]
        partitaTerminata.value = true
        // Interrompo subito: una volta trovato il vincitore non serve altro controllo.
        return true
      }
    }

    if (pareggio.value) {
      partitaTerminata.value = true
    }

    return false
  }

  function giocaCella(indice) {
    // Ignoro il click se la partita e gia finita o se la cella e gia occupata.
    if (partitaTerminata.value || tabellone.value[indice]) return

    tabellone.value[indice] = simboloCorrente.value
    const haVinto = controllaVittoria()

    if (!haVinto && !pareggio.value) {
      simboloCorrente.value = simboloCorrente.value === 'X' ? 'O' : 'X'
    }
  }

  function nuovaPartita() {
    // Reinizializzo solo la partita corrente; i punteggi vengono gestiti altrove.
    tabellone.value = Array(9).fill('')
    simboloCorrente.value = 'X'
    simboloVincitore.value = null
    celleVincenti.value = []
    partitaTerminata.value = false
  }

  function abbandonaPartita() {
    // Chi abbandona perde: assegno la vittoria automatica all'altro simbolo.
    if (partitaTerminata.value) return null

    simboloVincitore.value = simboloCorrente.value === 'X' ? 'O' : 'X'
    partitaTerminata.value = true
    return simboloVincitore.value
  }

  return {
    tabellone,
    simboloCorrente,
    simboloVincitore,
    celleVincenti,
    partitaTerminata,
    pareggio,
    giocaCella,
    nuovaPartita,
    abbandonaPartita
  }
}
