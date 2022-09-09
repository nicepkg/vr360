declare global {
  type DOMEvent<T extends Element = HTMLElement, E extends Event = Event> = E & {
    target: T | null
  }
}
