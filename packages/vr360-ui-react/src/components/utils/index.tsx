/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react'

export type IonicReactExternalProps<PropType, ElementType> = PropType & {
  ref?: React.RefObject<ElementType>
  children?: React.ReactNode
}

export const createForwardRef = <PropType, ElementType>(ReactComponent: any, displayName: string) => {
  const forwardRef = (props: IonicReactExternalProps<PropType, ElementType>, ref: React.Ref<ElementType>) => {
    return <ReactComponent {...props} forwardedRef={ref} />
  }
  forwardRef.displayName = displayName

  return React.forwardRef(forwardRef)
}

export * from './attachEventProps'
