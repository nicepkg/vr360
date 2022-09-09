/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-empty-interface */
declare interface Window {
  // extend the window
  sg_rsa: {
    encryptLong(str: string): string
    Base64: {
      encode(str: string): string
      decode(str: string): string
    }
  }
}

declare module '*.vue' {
  import {type DefineComponent} from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare module 'virtual:*' {
  const result: any
  export default result
}

declare module 'vue-demi/scripts/utils.js' {
  /**
   * 切换 vue 版本
   */
  const switchVersion: (vueVersion: 2 | 3) => void
}
