declare module '*.vue' {
  import type {VueConstructor} from 'vue'
  const component: VueConstructor
  export default component
}

declare module 'vue-demi/scripts/utils.js' {
  /**
   * switch vue version
   */
  const switchVersion: (vueVersion: 2 | 3 | number) => void
}
