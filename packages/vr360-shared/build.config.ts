import {defineBuildConfig} from 'unbuild'

export default defineBuildConfig({
  entries: ['src/index', 'src/test-utils', 'src/test-vue-utils', 'src/test-react-utils'],
  clean: true,
  declaration: true,
  externals: ['vite', 'vitest', 'vue-demi', 'react'],
  rollup: {
    emitCJS: true,
    cjsBridge: true
  }
})
