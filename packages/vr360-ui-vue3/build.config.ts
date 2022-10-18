import {defineBuildConfig} from 'unbuild'

export default defineBuildConfig({
  entries: ['./src/index'],
  clean: true,
  declaration: true,
  externals: ['vue'],
  rollup: {
    emitCJS: true,
    cjsBridge: true
  }
})
