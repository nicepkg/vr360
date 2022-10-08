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

        const defaultFiles: ProjectFiles = {
          'src/demo.css': (await import('./public/code-demo-templates/demo.css.txt?raw')).default,
          '.stackblitzrc': `{
            "startCommand": "npm run dev"
          }`
        }

        switch (mode) {
          case 'node':
          case 'vue3':
            return {
              ...defaultFiles,
              'src/App.vue': (await import('./public/code-demo-templates/vue3/src/App.vue.txt?raw')).default,
              'src/main.ts': (await import('./public/code-demo-templates/vue3/src/main.ts.txt?raw')).default,
              'types/module.d.ts': (await import('./public/code-demo-templates/vue3/types/module.d.ts.txt?raw'))
                .default,
              'index.html': (await import('./public/code-demo-templates/vue3/index.html.txt?raw')).default,
              'vite.config.ts': (await import('./public/code-demo-templates/vue3/vite.config.ts.txt?raw')).default,
              'package.json': (await import('./public/code-demo-templates/vue3/package.json.txt?raw')).default,
              'tsconfig.json': (await import('./public/code-demo-templates/vue3/tsconfig.json.txt?raw')).default
            } as ProjectFiles
          case 'vue2':
            return {
              ...defaultFiles,
              'src/App.vue': (await import('./public/code-demo-templates/vue2/src/App.vue.txt?raw')).default,
              'src/main.ts': (await import('./public/code-demo-templates/vue2/src/main.ts.txt?raw')).default,
              'types/module.d.ts': (await import('./public/code-demo-templates/vue2/types/module.d.ts.txt?raw'))
                .default,
              'index.html': (await import('./public/code-demo-templates/vue2/index.html.txt?raw')).default,
              'vite.config.ts': (await import('./public/code-demo-templates/vue2/vite.config.ts.txt?raw')).default,
              'package.json': (await import('./public/code-demo-templates/vue2/package.json.txt?raw')).default,
              'tsconfig.json': (await import('./public/code-demo-templates/vue2/tsconfig.json.txt?raw')).default
            } as ProjectFiles
          case 'react':
            return {
              ...defaultFiles,
              'src/main.tsx': (await import('./public/code-demo-templates/react/src/main.tsx.txt?raw')).default,
              'index.html': (await import('./public/code-demo-templates/react/index.html.txt?raw')).default,
              'package.json': (await import('./public/code-demo-templates/react/package.json.txt?raw')).default,
              'tsconfig.json': (await import('./public/code-demo-templates/react/tsconfig.json.txt?raw')).default,
              'vite.config.ts': (await import('./public/code-demo-templates/react/vite.config.ts.txt?raw')).default
            } as ProjectFiles
          case 'html':
            return {
              'package.json': (await import('./public/code-demo-templates/html/package.json.txt?raw')).default,
              'demo.css': (await import('./public/code-demo-templates/demo.css.txt?raw')).default,
              '.stackblitzrc': `{
                "startCommand": "npm run dev"
              }`
            } as ProjectFiles
          default:
            return {}
        }
      }
    }
  }
})
