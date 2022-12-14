import Vue from 'vue'
import App from './App.vue'
import VueCompositionAPI from '@vue/composition-api'

// css
import 'uno.css'
import '@unocss/reset/tailwind.css'

Vue.use(VueCompositionAPI)

Vue.config.productionTip = false

new Vue({
  render: h => h(App)
}).$mount('#app')
