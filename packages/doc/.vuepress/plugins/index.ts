import type {PluginConfig} from 'vuepress'
import {registerComponentsPlugin} from '@vuepress/plugin-register-components'
import {googleAnalyticsPlugin} from '@vuepress/plugin-google-analytics'
import {shikiPlugin} from '@vuepress/plugin-shiki'
import {path} from '@vuepress/utils'
import {isProd} from '../utils/common'

const pathResolve = (..._path: string[]) => path.resolve(__dirname, ..._path)

const vuepressPlugins: PluginConfig = [
  // for google search
  googleAnalyticsPlugin({
    id: ''
  }),
  // auto register globally components
  registerComponentsPlugin({
    componentsDir: pathResolve('../components')
  })
]

if (isProd) {
  vuepressPlugins.push(
    // code highlighting
    shikiPlugin({
      theme: 'dark-plus'
    })
  )
}

export const plugins = vuepressPlugins
