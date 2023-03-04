import { createApp } from 'vue'
import App from './App.vue'
import { createPinia } from 'pinia'
import './style.css'
import router from './router'

const pinia = createPinia()
const app = createApp(App)

// prettier-ignore
app
    .use(pinia)
    .use(router)
    .mount('#app')
