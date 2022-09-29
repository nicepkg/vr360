import {defineClientConfig} from '@vuepress/client'
import pkg from '../package.json'

export default defineClientConfig({
  enhance({app}) {
    app.config.globalProperties.version = pkg.version
  }
})
