import type {Config} from '@stencil/core'
import {sass} from '@stencil/sass'
import {vueOutputTarget} from './scripts/vue-output-target'
import {reactOutputTarget as react} from '@stencil/react-output-target'
// import {angularOutputTarget} from '@stencil/angular-output-target'

// const angularDirectivesPath = '../elements-angular/elements/src/directives'
const reactProxyPath = '../vr360-ui-react/src/components'
const vueProxyPath = '../vr360-ui-vue3/src'

export const config: Config = {
  buildEs5: false,
  extras: {
    cssVarsShim: true,
    dynamicImportShim: true,
    shadowDomShim: true,
    safari10: true,
    scriptDataOpts: true,
    appendChildSlotFix: false,
    cloneNodeFix: false,
    slotChildNodesFix: true,
    experimentalImportInjection: true
  },
  globalStyle: './src/global/common.scss',
  enableCache: true,
  sourceMap: process.env.NODE_ENV === 'development',
  namespace: 'vr360-ui',
  outputTargets: [
    {
      type: 'dist',
      esmLoaderPath: './loader'
    },
    {
      type: 'dist-custom-elements'
    },
    {type: 'docs-readme'},
    react({
      componentCorePackage: '@nicepkg/vr360-ui',
      proxiesFile: `${reactProxyPath}/index.ts`,
      includeDefineCustomElements: true
    }),
    // angularOutputTarget({
    //   componentCorePackage: '@nicepkg/vr360-ui',
    //   directivesProxyFile: `${angularDirectivesPath}/proxies.ts`,
    //   directivesUtilsFile: angularDirectivesPath,
    //   directivesArrayFile: `${angularDirectivesPath}/proxies-list.ts`
    // }),
    vueOutputTarget({
      componentCorePackage: '@nicepkg/vr360-ui',
      proxiesFile: `${vueProxyPath}/proxies.ts`,
      includeDefineCustomElements: false,
      // external event names (valueChange, checkedChange, ...) have to be mapped to vue event names
      // see elements-vue/src/index.ts
      componentModels: []
    })
  ],
  plugins: [
    sass({
      injectGlobalPaths: [],
      includePaths: ['./src/components', '../../node_modules']
    })
  ],
  preamble: 'Crafted with ❤ by nicepkg'
}
