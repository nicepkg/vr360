/* eslint-disable @typescript-eslint/no-explicit-any */
export const dashToPascalCase = (str: string) =>
  str
    .toLowerCase()
    .split('-')
    .map(segment => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join('')
export const camelToDashCase = (str: string) => str.replace(/([A-Z])/g, (m: string) => `-${m[0].toLowerCase()}`)

export const attachEventProps = (
  node: HTMLElement,
  newProps: Record<string, any>,
  oldProps: Record<string, any> = {}
) => {
  // add any classes in className to the class list
  const className = getClassName(node.classList, newProps, oldProps)
  if (className !== '') {
    node.className = className
  }

  Object.keys(newProps).forEach(name => {
    if (
      name === 'children' ||
      name === 'style' ||
      name === 'ref' ||
      name === 'class' ||
      name === 'className' ||
      name === 'forwardedRef'
    ) {
      return
    }
    if (name.startsWith('on') && name[2] === name[2].toUpperCase()) {
      const eventName = name.slice(2)
      const eventNameLc = eventName[0].toLowerCase() + eventName.slice(1)

      if (!isCoveredByReact(eventNameLc)) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        syncEvent(node, eventNameLc, newProps[name])
      }
    } else {
      if (typeof newProps[name] === 'object') {
        ;(node as Record<string, any>)[name] = newProps[name]
      } else {
        node.setAttribute(camelToDashCase(name), newProps[name] as string)
      }
    }
  })
}

export const getClassName = (classList: DOMTokenList, newProps: Record<string, any>, oldProps: Record<string, any>) => {
  const newClassProp: string = newProps.className || newProps.class
  const oldClassProp: string = oldProps.className || oldProps.class
  // map the classes to Maps for performance
  const currentClasses = arrayToMap(classList)
  const incomingPropClasses = arrayToMap(newClassProp ? newClassProp.split(' ') : [])
  const oldPropClasses = arrayToMap(oldClassProp ? oldClassProp.split(' ') : [])
  const finalClassNames: string[] = []
  // loop through each of the current classes on the component
  // to see if it should be a part of the classNames added
  currentClasses.forEach(currentClass => {
    if (incomingPropClasses.has(currentClass)) {
      // add it as its already included in classnames coming in from newProps
      finalClassNames.push(currentClass)
      incomingPropClasses.delete(currentClass)
    } else if (!oldPropClasses.has(currentClass)) {
      // add it as it has NOT been removed by user
      finalClassNames.push(currentClass)
    }
  })
  incomingPropClasses.forEach(s => finalClassNames.push(s))
  return finalClassNames.join(' ')
}

/**
 * Checks if an event is supported in the current execution environment.
 * @license Modernizr 3.0.0pre (Custom Build) | MIT
 */
export const isCoveredByReact = (eventNameSuffix: string, doc: Document = document) => {
  const eventName = 'on' + eventNameSuffix
  let isSupported = eventName in doc

  if (!isSupported) {
    const element = doc.createElement('div')
    element.setAttribute(eventName, 'return;')
    isSupported = typeof (element as Record<string, any>)[eventName] === 'function'
  }

  return isSupported
}

export const syncEvent = (node: Element, eventName: string, newEventHandler?: (e: Event) => any) => {
  const eventStore: Record<string, any> =
    (node as Record<string, any>).__events || ((node as Record<string, any>).__events = {})
  const oldEventHandler: (() => void) | undefined = eventStore[eventName]

  // Remove old listener so they don't double up.
  if (oldEventHandler) {
    node.removeEventListener(eventName, oldEventHandler)
  }

  // Bind new listener.
  node.addEventListener(
    eventName,
    (eventStore[eventName] = function handler(e: Event) {
      if (newEventHandler) {
        newEventHandler.call(this, e)
      }
    })
  )
}

const arrayToMap = (arr: string[] | DOMTokenList) => {
  const map = new Map<string, string>()
  ;(arr as string[]).forEach((s: string) => map.set(s, s))
  return map
}
