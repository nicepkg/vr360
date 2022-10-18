/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react'
import ReactDom from 'react-dom'

import type {ReactProps} from './ReactProps'
import {attachEventProps, createForwardRef, dashToPascalCase, isCoveredByReact} from './utils'

type IonicReactInternalProps<ElementType> = {
  forwardedRef?: React.Ref<ElementType>
  children?: React.ReactNode
  href?: string
  target?: string
  style?: string
  ref?: React.Ref<any>
  className?: string
}

export const createReactComponent = <PropType, ElementType>(tagName: string) => {
  const displayName = dashToPascalCase(tagName)
  const ReactComponent = class extends React.Component<IonicReactInternalProps<ElementType>> {
    // eslint-disable-next-line @typescript-eslint/no-useless-constructor
    constructor(props: IonicReactInternalProps<ElementType>) {
      super(props)
    }

    componentDidMount() {
      this.componentDidUpdate(this.props)
    }

    componentDidUpdate(prevProps: IonicReactInternalProps<ElementType>) {
      // eslint-disable-next-line react/no-find-dom-node
      const node = ReactDom.findDOMNode(this) as HTMLElement
      attachEventProps(node, this.props, prevProps)
    }

    render() {
      const {children, forwardedRef, style, ...cProps} = this.props

      const propsToPass = Object.keys(cProps).reduce((acc, name) => {
        if (name.startsWith('on') && name[2] === name[2].toUpperCase()) {
          const eventName = name.slice(2).toLowerCase()
          if (isCoveredByReact(eventName)) {
            ;(acc as Record<string, any>)[name] = (cProps as Record<string, any>)[name]
          }
        }
        return acc
      }, {})

      const newProps: any = {
        ...propsToPass,
        ref: forwardedRef,
        style
      }

      return React.createElement(tagName, newProps, children)
    }

    static get displayName() {
      return displayName
    }
  }
  return createForwardRef<PropType & ReactProps, ElementType>(ReactComponent, displayName)
}
