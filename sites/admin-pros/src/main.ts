import { createApp } from 'vue'
import router from './routers'
import stores from './stores'
import setup from './setup'
import App from './app.vue'

const app = createApp(App).use(router).use(stores).use(setup)

app.mount('#app')
// router.isReady().then(() => app.mount('#app'));
