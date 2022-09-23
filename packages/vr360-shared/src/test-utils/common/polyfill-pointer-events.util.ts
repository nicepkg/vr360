export const polyfillPointerEvents = () => {
  /* eslint-disable @typescript-eslint/no-explicit-any */
  // polyfill for jsdom (https://github.com/jsdom/jsdom/pull/2666)
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (!global.PointerEvent) {
    class PointerEvent extends MouseEvent {
      public pointerId?: number

      constructor(type: string, params: PointerEventInit = {}) {
        super(type, params)
        this.pointerId = params.pointerId
      }
    }
    global.PointerEvent = PointerEvent as any
  }
}
