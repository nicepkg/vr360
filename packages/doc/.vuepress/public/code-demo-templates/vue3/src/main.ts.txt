import {createApp} from 'vue'
import App from './App.vue'

// css
import 'uno.css'
import '@unocss/reset/tailwind.css'

const app = createApp(App)
app.mount('#app')

app.config.globalProperties.productionTip = false
