export function generateUniqueId() {
  // Math.random 应该是唯一的，因为它的种子算法。
  // 将其转换为 base 36（数字 + 字母），并获取前 9 个字符
  // 在小数点后。
  return '_' + Math.random().toString(36).slice(2, 11)
}

export function getSlotContent(el: HTMLElement, slotName: string): HTMLElement | null {
  return el.querySelector(`[slot="${slotName}"]`)
}

/**
 * 检查给定元素在给定槽处是否至少有一个子节点
 * @param el 里面有一个（命名的）槽的元素
 * @param slotName 要检查的插槽的名称。如果未提供，则使用默认插槽。
 * @return `true` 如果插槽中的孩子存在，否则 `false`
 */
export function hasSlotContent(el: HTMLElement, slotName?: string): boolean {
  return slotName
    ? el.querySelectorAll(`[slot="${slotName}"]`).length > 0
    : el.querySelector('slot')?.assignedElements().length === 0
}

/**
 * 聚焦第一个具有 `data-ino-focus` 属性的元素。
 *
 * @param el 要搜索的宿主元素
 */
export function focusIfExists(el: Element): void {
  ;(el.querySelector('[data-ino-focus]') as HTMLElement).focus()
}

export function moveCursorToEnd(el: HTMLInputElement) {
  const len = el.value.length

  el.focus()
  el.setSelectionRange(len, len)
}

export function preventEvent(event: CustomEvent<unknown>) {
  event.stopPropagation()
  event.preventDefault()
}
