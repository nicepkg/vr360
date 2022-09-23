/* eslint-disable @typescript-eslint/no-explicit-any */
declare module '*.vue' {
  import type {DefineComponent} from 'vue-demi'
  // eslint-disable-next-line @typescript-eslint/ban-types
  const Component: DefineComponent<{}, {}, any>
  export default Component
}

declare module 'vue-demi/scripts/utils.js' {
  /**
   * switch vue version
   */
  const switchVersion: (vueVersion: 2 | 3 | number) => void
}
