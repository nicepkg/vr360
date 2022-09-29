import {path} from '@vuepress/utils'
import type {ViteBundlerOptions} from 'vuepress'

const pathResolve = (..._path: string[]) => path.resolve(__dirname, ..._path)
export const bundlerConfig = {
  viteOptions: {
    resolve: {
      alias: [
        {
          find: /@(?=\/)/,
          replacement: pathResolve('./.vuepress')
        }
      ]
    },
    build: {
      chunkSizeWarningLimit: Number.POSITIVE_INFINITY
    }
  }
} as ViteBundlerOptions
