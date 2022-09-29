import type {SidebarConfig} from '@vuepress/theme-default'

export const zh: SidebarConfig = {
  '/guide/': [
    {
      text: '指南',
      children: ['/guide/README.md', '/guide/questions.md']
    }
  ],
  '/libs/vr360-core/': [
    {
      text: 'vr360-core',
      children: [
        '/libs/vr360-core/README.md',
        '/libs/vr360-core/properties.md',
        '/libs/vr360-core/methods.md',
        '/libs/vr360-core/events.md',
        '/libs/vr360-core/example.md'
      ]
    }
  ]
}
