/* eslint-disable @typescript-eslint/no-explicit-any */
import type {VNode} from 'vue'
import {defineComponent, h} from 'vue'

const createComponent = (name: string, render: (props: Record<string, any>) => VNode) =>
  defineComponent({
    name,
    render() {
      const props = {...this.$props, ...this.$attrs}
      return render(props)
    }
  })

export const FullscreenIcon = createComponent('FullscreenIcon', props => {
  //
  //   <svg width="1em" height="1em" viewBox="0 0 24 24" {...props}>
  //     <path d="M5 5h5v2H7v3H5V5m9 0h5v5h-2V7h-3V5m3 9h2v5h-5v-2h3v-3m-7 3v2H5v-5h2v3h3z" fill="currentColor"></path>
  //   </svg>
  //

  return h(
    'svg',
    {
      width: '1em',
      height: '1em',
      viewBox: '0 0 24 24',
      ...props
    },
    [
      h('path', {
        d: 'M5 5h5v2H7v3H5V5m9 0h5v5h-2V7h-3V5m3 9h2v5h-5v-2h3v-3m-7 3v2H5v-5h2v3h3z',
        fill: 'currentColor'
      })
    ]
  )
})

export const ExitFullscreenIcon = createComponent('ExitFullscreenIcon', props => {
  // <svg width="1em" height="1em" viewBox="0 0 24 24" {...props}>
  //   <path d="M14 14h5v2h-3v3h-2v-5m-9 0h5v5H8v-3H5v-2m3-9h2v5H5V8h3V5m11 3v2h-5V5h2v3h3z" fill="currentColor"></path>
  // </svg>

  return h(
    'svg',
    {
      width: '1em',
      height: '1em',
      viewBox: '0 0 24 24',
      ...props
    },
    [
      h('path', {
        d: 'M14 14h5v2h-3v3h-2v-5m-9 0h5v5H8v-3H5v-2m3-9h2v5H5V8h3V5m11 3v2h-5V5h2v3h3z',
        fill: 'currentColor'
      })
    ]
  )
})
