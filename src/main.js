import './assets/main.css'
// main.js or App.vue
import { createApp } from 'vue'
import App from './App.vue'
// import router from './router'
// import { createPinia } from 'pinia'
import '@fortawesome/fontawesome-free/css/all.css'
import store from "./stores/store"

const app = createApp(App)


app.use(store);
// app.use(router)

app.mount('#app')