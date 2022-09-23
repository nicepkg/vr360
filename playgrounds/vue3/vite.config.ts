import path from 'node:path'
import type {UserConfig} from 'vite'
import {defineConfig, loadEnv} from 'vite'
import Vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import Unocss from 'unocss/vite'
import {switchVersion} from 'vue-demi/scripts/utils.js'

const pathResolve = (...args: string[]) => path.resolve(__dirname, ...args)

switchVersion(3)

export default defineConfig(({mode}) => {
  // 根据当前工作目录中的“mode”加载env文件。
  // 将第三个参数设置为 '' 以加载所有 env
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const env = loadEnv(mode, process.cwd(), '')

  return {
    resolve: {
      dedupe: ['vue', 'vue-demi', '@vue/runtime-core', '@vue/runtime-dom'], // use the same version
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

      // https://github.com/antfu/unocss
      // 有关配置，请参见 unocss.config.ts
      Unocss()
    ],

    server: {
      host: true
    }
  } as UserConfig
})
