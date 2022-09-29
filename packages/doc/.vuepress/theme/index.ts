import type {Theme} from '@vuepress/core'
import {defaultTheme} from '@vuepress/theme-default'
import {path} from '@vuepress/utils'
import {navbar, sidebar} from '../configs'
import {isProd} from '../utils/common'

const pathResolve = (..._path: string[]) => path.resolve(__dirname, ..._path)

export const localTheme = (): Theme => {
  return {
    name: 'vuepress-theme-local',
    extends: defaultTheme({
      logo: '/images/logo.png',
      logoDark: '/images/logo-dark.png',

      repo: 'nicepkg/vr360',

      docsBranch: 'master',

      docsDir: 'packages/doc',

      // theme-level locales config
      locales: {
        /**
         * Chinese locale config
         */
        '/': {
          // navbar
          navbar: navbar.zh,
          selectLanguageName: '简体中文',
          selectLanguageText: '选择语言',
          selectLanguageAriaLabel: '选择语言',

          // sidebar
          sidebar: sidebar.zh,

          // page meta
          editLinkText: '在 GitHub 上编辑此页',
          lastUpdatedText: '上次更新',
          contributorsText: '贡献者',

          // custom containers
          tip: '提示',
          warning: '注意',
          danger: '警告',

          // 404 page
          notFound: ['这里什么都没有', '我们怎么到这来了？', '这是一个 404 页面', '看起来我们进入了错误的链接'],
          backToHome: '返回首页',

          // a11y
          openInNewWindow: '在新窗口打开',
          toggleColorMode: '切换主题',
          toggleSidebar: '切换侧边栏'
        },

        /**
         * English locale config
         *
         * As the default locale of @vuepress/theme-default is English,
         * we don't need to set all of the locale fields
         */
        '/en/': {
          // navbar
          navbar: navbar.en,

          // sidebar
          sidebar: sidebar.en,

          // page meta
          editLinkText: 'Edit this page on GitHub'
        }
      },

      themePlugins: {
        // only enable git plugin in production mode
        git: isProd,
        // use shiki plugin in production mode instead
        prismjs: !isProd,
        // disable the @vuepress/plugin-nprogress plugin to fix the bug of `Cannot set properties of undefined (setting 'NProgress')`
        nprogress: false
      }
    }),
    alias: {
      '@theme/HomeFeatures.vue': pathResolve('components/HomeFeatures.vue')
    }
  }
}
