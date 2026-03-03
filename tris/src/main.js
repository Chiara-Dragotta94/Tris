// Qui avvio l'app Vue: importo gli stili globali e monto il componente radice.
import { createApp } from 'vue'
import './style.css'
import App from './App.vue'

// Uso #app come punto di montaggio unico della Single Page Application.
createApp(App).mount('#app')
