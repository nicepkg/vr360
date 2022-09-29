import type {NavbarConfig} from '@vuepress/theme-default'
import {version} from '../../utils/common'

export const en: NavbarConfig = [
  {
    text: 'Guide',
    link: '/en/guide/'
  },
  {
    text: `v${version}`,
    children: [
      {
        text: 'Releases',
        link: 'https://github.com/nicepkg/vr360/releases'
      }
    ]
  }
]
