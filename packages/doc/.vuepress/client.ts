/* eslint-disable unicorn/no-await-expression-member */
import type {ProjectFiles} from '@stackblitz/sdk'
import {defineClientConfig} from '@vuepress/client'
import pkg from '../package.json'

export default defineClientConfig({
  enhance({app}) {
    app.config.globalProperties.version = pkg.version

    if (!__VUEPRESS_SSR__) {
      window.loadCodeDemoModeDefaultFiles = async _mode => {
        const mode = _mode as 'node' | 'vue2' | 'vue3' | 'react' | 'html'
        switch (mode) {
          case 'node':
          case 'vue3':
            return {
              'src/App.vue': (await import('./public/code-demo-templates/vue3/src/App.vue.txt?raw')).default,
              'src/main.ts': (await import('./public/code-demo-templates/vue3/src/main.ts.txt?raw')).default,
              'types/module.d.ts': (await import('./public/code-demo-templates/vue3/types/module.d.ts.txt?raw'))
                .default,
              'index.html': (await import('./public/code-demo-templates/vue3/index.html.txt?raw')).default,
              'vite.config.ts': (await import('./public/code-demo-templates/vue3/vite.config.ts.txt?raw')).default,
              'package.json': (await import('./public/code-demo-templates/vue3/package.json.txt?raw')).default,
              'tsconfig.json': (await import('./public/code-demo-templates/vue3/tsconfig.json.txt?raw')).default,
              '.stackblitzrc': `{
                "startCommand": "npm run dev"
              }`
            } as ProjectFiles
          // case 'react':
          //   return {
          //     'public/index.html': `<div id="root"></div>`,
          //     'src/index.tsx': index_tsx,
          //     'src/App.tsx': app_tsx,
          //     'src/main.tsx': code,
          //     'tsconfig.json': ts_config_json,
          //     'package.json': package_json,
          //     'package-lock.json': package_lock_json,
          //     ...options?.files,
          //     '.stackblitzrc': `{
          //       "startCommand": "yarn run start"
          //     }`
          //   }
          default:
            return {}
        }
      }
    }
  }
})
