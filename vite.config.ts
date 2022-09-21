import path from 'path'
import {defineConfig, loadEnv, UserConfig} from 'vite'
import Vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import Inspect from 'vite-plugin-inspect'
import Unocss from 'unocss/vite'
import visualizer from 'rollup-plugin-visualizer'
import {isReport, switchVueVersion} from './scripts/utils'

const pathResolve = (...args: string[]) => path.resolve(__dirname, ...args)

switchVueVersion(3)

export default defineConfig(({mode}) => {
  // 根据当前工作目录中的“mode”加载env文件。
  // 将第三个参数设置为 '' 以加载所有 env
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const env = loadEnv(mode, process.cwd(), '')

  return {
    resolve: {
      alias: {
        '@/': `${pathResolve('./src')}/`
      }
    },

    plugins: [
      // vue3 语法支持
      Vue({
        include: [/\.vue$/],
        reactivityTransform: true
      }),
      vueJsx(),

      // 打包后自动打开分析报告
      visualizer({
        open: isReport()
      }),

      // https://github.com/antfu/unocss
      // 有关配置，请参见 unocss.config.ts
      Unocss(),

      // https://github.com/antfu/vite-plugin-inspect
      // 访问http://localhost:3333/__inspect/查看inspector
      Inspect()
    ],

    server: {
      host: true
    }
  } as UserConfig
})
