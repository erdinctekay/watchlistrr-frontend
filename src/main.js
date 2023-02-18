import { createApp } from 'vue'
import App from './App.vue'
import { createPinia } from 'pinia'
import './style.css'
import router from './router'

import { Dropdown } from 'bootstrap'

const pinia = createPinia()
const app = createApp(App)

// prettier-ignore
app
    .use(pinia)
    .use(router)
    .mount('#app')
