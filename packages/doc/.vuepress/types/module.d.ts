/* eslint-disable @typescript-eslint/no-explicit-any */

declare module '*.vue' {
  import type {DefineComponent} from 'vue'
  // eslint-disable-next-line @typescript-eslint/ban-types
  const Component: DefineComponent<{}, {}, any>
  export default Component
}
