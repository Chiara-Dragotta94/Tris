<script setup>
import { ref } from 'vue'

const emit = defineEmits(['avvia'])

// In questo componente raccolgo i nomi dei due giocatori prima di mostrare la griglia.
const nomeGiocatoreX = ref('')
const nomeGiocatoreO = ref('')
const errore = ref('')

function avviaPartita() {
  // Se l'utente lascia vuoto, assegno un nome di default per non bloccare la partita.
  const nomeX = nomeGiocatoreX.value.trim() || 'Giocatore X'
  const nomeO = nomeGiocatoreO.value.trim() || 'Giocatore O'

  // Evito che due persone giochino con lo stesso nome per chiarezza in UI e punteggi.
  if (nomeX === nomeO) {
    errore.value = 'I nomi dei giocatori devono essere diversi.'
    return
  }

  errore.value = ''
  // Invio al componente padre i due nomi validati.
  emit('avvia', { nomeX, nomeO })
}
</script>

<template>
  <section class="contenitore">
    <h1>Tris</h1>
    <!-- Qui raccolgo i nomi prima di mostrare la griglia di gioco. -->
    <p class="sottotitolo">Scegliete i nomi e date il via alla sfida.</p>

    <label for="giocatore-x">Giocatore X</label>
    <input
      id="giocatore-x"
      v-model="nomeGiocatoreX"
      type="text"
      placeholder="Es. Luca"
    />

    <label for="giocatore-o">Giocatore O</label>
    <input
      id="giocatore-o"
      v-model="nomeGiocatoreO"
      type="text"
      placeholder="Es. Sara"
    />

    <p v-if="errore" class="errore">{{ errore }}</p>
    <button type="button" @click="avviaPartita">Avvia partita</button>
  </section>
</template>

<style scoped>
.contenitore {
  max-width: 470px;
  margin: 1rem auto;
  display: grid;
  gap: 0.8rem;
  text-align: left;
  background: rgba(255, 255, 255, 0.14);
  border: 1px solid rgba(255, 255, 255, 0.22);
  border-radius: 14px;
  padding: 1.1rem;
  color: #ffffff;
}

h1,
p {
  margin: 0;
}

.sottotitolo {
  color: #e1f1ff;
}

label {
  font-weight: 600;
}

input {
  padding: 0.55rem 0.7rem;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.45);
  background: rgba(255, 255, 255, 0.95);
  color: #0b1f33;
}

button {
  margin-top: 0.45rem;
  border: none;
  color: #ffffff;
  font-weight: 600;
  background: linear-gradient(90deg, #0077b6, #00b4d8);
}

.errore {
  color: #ffe8e8;
  background: rgba(183, 28, 28, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 8px;
  padding: 0.45rem 0.55rem;
  font-size: 0.95rem;
}
</style>
