import type {SidebarConfig} from '@vuepress/theme-default'

export const en: SidebarConfig = {
  '/en/guide/': [
    {
      text: 'Guide',
      children: ['/en/guide/README.md', '/en/guide/questions.md']
    }
  ]
}
