/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-explicit-any */
import type {FunctionalComponent} from 'vue-demi'
import {isVue2, Vue2, install} from 'vue-demi'

export const nextTwoTick = () =>
  new Promise<void>(resolve => {
    setTimeout(() => {
      setTimeout(resolve)
    })
  })

export function setProps(props: Record<string, any>) {
  const {style, class: className, ...otherProps} = props
  return isVue2
    ? {
        style,
        class: className,
        props: otherProps
      }
    : {
        style,
        class: className,
        ...props
      }
}

export function createFunctionComponent(fn: (...args: any[]) => any) {
  return isVue2
    ? {
        functional: true,
        render: fn
      }
    : (fn as FunctionalComponent)
}

/**
 * get functional component slots
 * @param ctx functional component context
 * @returns slots
 */
export function getSlots(ctx: any, slotName: string) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  const slots: Record<string, any> = isVue2 ? ctx.slots?.() : ctx.slots
  const slot = slots[slotName]
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call
  return typeof slot === 'function' ? slot() : slot
}

export function setupVueSwitch() {
  if (isVue2) {
    Vue2.config.productionTip = false
    Vue2.config.devtools = false
    install(Vue2) // install vue composition-api
  }
}
