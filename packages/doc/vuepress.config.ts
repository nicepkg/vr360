import {defineUserConfig} from 'vuepress'
import {path} from '@vuepress/utils'
import {viteBundler} from '@vuepress/bundler-vite'
import {plugins} from './.vuepress/plugins'
import {bundlerConfig} from './bundler.config'
import {localTheme} from './.vuepress/theme'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const pathResolve = (..._path: string[]) => path.resolve(__dirname, ..._path)

export default defineUserConfig({
  base: '/',

  head: [
    [
      'link',
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '16x16',
        href: `/images/icons/favicon-16x16.png`
      }
    ],
    [
      'link',
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '32x32',
        href: `/images/icons/favicon-32x32.png`
      }
    ],
    ['link', {rel: 'manifest', href: '/manifest.webmanifest'}],
    ['meta', {name: 'application-name', content: 'Vr360'}],
    ['meta', {name: 'apple-mobile-web-app-title', content: 'Vr360'}],
    ['meta', {name: 'apple-mobile-web-app-status-bar-style', content: 'black'}],
    ['link', {rel: 'apple-touch-icon', href: `/images/icons/apple-touch-icon.png`}],
    [
      'link',
      {
        rel: 'mask-icon',
        href: '/images/icons/safari-pinned-tab.svg',
        color: '#0c4dc4'
      }
    ],
    ['meta', {name: 'msapplication-TileColor', content: '#0c4dc4'}],
    ['meta', {name: 'theme-color', content: '#0c4dc4'}]
  ],

  // site-level locales config
  locales: {
    '/': {
      lang: 'zh-CN',
      title: 'Vr360',
      description: '快速实现你的全景浏览开发需求'
    }
    // '/en/': {
    //   lang: 'en-US',
    //   title: 'Vr360',
    //   description: 'Quickly realize your panoramic browsing development needs'
    // }
  },

  theme: localTheme(),
  bundler: viteBundler(bundlerConfig),
  templateDev: pathResolve('.vuepress/index.build.html'),
  templateBuild: pathResolve('.vuepress/index.build.html'),
  markdown: {
    importCode: {
      handleImportPath: str => str.replace(/^@/, pathResolve('.vuepress'))
    }
  },
  plugins
})
