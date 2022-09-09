import {createApp} from 'vue'
import App from './App.vue'

// css
import 'uno.css'
import './styles/main.css'
import './styles/tailwind-reset.css'

// moment  中文
import 'moment/dist/locale/zh-cn'
import moment from 'moment'

moment.locale('zh-cn')

// 动态设置 html head
import {createHead} from '@vueuse/head'
const head = createHead()

const app = createApp(App)
app.use(head)
app.mount('#app')

app.config.globalProperties.productionTip = false
