/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unnecessary-condition */
import * as THREE from 'three'
import type {DeepRequired, DeepPartial, Position, ThreeObjectBase} from './types'

let raycaster: THREE.Raycaster
let mouse: THREE.Vector2
function getSingleValue() {
  if (!raycaster) raycaster = new THREE.Raycaster()
  if (!mouse) mouse = new THREE.Vector2()
  return {
    raycaster,
    mouse
  }
}

export type ConvertMousePositionToThreePositionOptions = {
  /**
   * 鼠标 x 坐标
   */
  mouseX: number

  /**
   * 鼠标 y 坐标
   */
  mouseY: number

  /**
   * 获取依赖函数
   */
  getDeps: GetAddListenerToThreeObjectDeps
}

/**
 * 转换鼠标位置到 three 坐标
 * @param options 配置
 * @returns x,y,z 坐标
 */
export function convertMousePositionToThreePosition(options: ConvertMousePositionToThreePositionOptions): Position {
  const {mouseX, mouseY, getDeps} = options
  const {camera, scene, renderer} = getDeps()
  if (!camera || !scene || !renderer) return {x: 0, y: 0, z: 0}
  const {raycaster, mouse} = getSingleValue()
  const renderDomBound = renderer.domElement.getBoundingClientRect()

  mouse.x = ((mouseX - renderDomBound.left) / renderer.domElement.clientWidth) * 2 - 1
  mouse.y = -((mouseY - renderDomBound.top) / renderer.domElement.clientHeight) * 2 + 1

  raycaster.setFromCamera(mouse, camera)

  const intersects = raycaster.intersectObjects(scene.children)
  const firstIntersect = intersects[0] ?? undefined
  return firstIntersect.point ?? {x: 0, y: 0, z: 0}
}

/**
 * 获取依赖函数
 */
export type GetAddListenerToThreeObjectDeps = () => {
  /**
   * 摄像机实例
   */
  camera?: THREE.PerspectiveCamera

  /**
   * 场景实例
   */
  scene?: THREE.Scene

  /**
   * 渲染器实例
   */
  renderer?: THREE.WebGLRenderer
}

export type ThreeObjectDispatchEvent<T extends keyof HTMLElementEventMap> = {
  type: T
  intersect: THREE.Intersection
  sourceEvent: HTMLElementEventMap[T]
  isMouseDown: boolean
}

/**
 * 为 threejs 对象添加事件监听器
 * @param getDeps 获取依赖函数
 * @param events 监听的事件名称列表
 */
export function addListenerToThreeObject(
  getDeps: GetAddListenerToThreeObjectDeps,
  events: (keyof HTMLElementEventMap)[] = ['click', 'mousemove', 'touchmove', 'mousedown', 'mouseup']
) {
  const renderElement = getDeps().renderer?.domElement
  if (!renderElement) return
  const {raycaster, mouse} = getSingleValue()

  // 上一个点击的对象
  let mouseoverPreIntersect: THREE.Intersection | undefined

  // 鼠标是否处于按压状态，用于传给 tip 判断，在按下鼠标滑动时不显示 tip
  let isMouseDown = false

  ;['mousedown'].map(eventName =>
    renderElement.addEventListener(eventName, () => {
      isMouseDown = true
    })
  )
  ;['mouseup'].map(eventName =>
    renderElement.addEventListener(eventName, () => {
      isMouseDown = false
    })
  )

  function handleEvent(eventName: string, event: MouseEvent | TouchEvent) {
    event.preventDefault()
    const {camera, scene, renderer} = getDeps()
    if (!camera || !scene || !renderer) return
    const renderDomBound = renderer.domElement.getBoundingClientRect()

    const clientX = (event as TouchEvent)?.changedTouches?.[0]?.clientX ?? (event as MouseEvent).clientX
    const clientY = (event as TouchEvent)?.changedTouches?.[0]?.clientY ?? (event as MouseEvent).clientY

    mouse.x = ((clientX - renderDomBound.left) / renderer.domElement.clientWidth) * 2 - 1
    mouse.y = -((clientY - renderDomBound.top) / renderer.domElement.clientHeight) * 2 + 1

    raycaster.setFromCamera(mouse, camera)

    const intersects = raycaster.intersectObjects(scene.children)
    const firstIntersect = intersects[0] ?? undefined

    if (!firstIntersect) return

    if (
      ['mousemove', 'touchmove'].includes(eventName) &&
      mouseoverPreIntersect?.object.uuid !== firstIntersect.object.uuid
    ) {
      // 在 mousemove 事件时, 并且本次鼠标指中的 three 对象和上一个对象不相同时
      // 触发上个 hover 对象的 mouseout 事件
      mouseoverPreIntersect?.object.dispatchEvent({
        type: 'mouseout',
        intersect: mouseoverPreIntersect,
        sourceEvent: event,
        isMouseDown
      } as ThreeObjectDispatchEvent<'mouseout'>)
      mouseoverPreIntersect = firstIntersect

      // 设置鼠标样式
      const cursor = firstIntersect.object.userData.cursor || 'default'
      if (renderElement && renderElement.style.cursor !== cursor) renderElement.style.cursor = cursor

      // 触发本次 hover 对象的 mouseover 事件
      firstIntersect.object.dispatchEvent({
        type: 'mouseover',
        intersect: firstIntersect,
        sourceEvent: event,
        isMouseDown
      } as ThreeObjectDispatchEvent<'mouseover'>)
    }

    // 射线范围内没有东西，终止流程
    if (intersects.length <= 0) return

    // if (eventName === 'click') {
    //   console.log(`当前点击位置: x=${firstIntersect.point.x}, y=${firstIntersect.point.y}, z=${firstIntersect.point.z}`)
    // }

    firstIntersect.object.dispatchEvent({
      type: eventName === 'touchmove' ? 'mousemove' : eventName,
      intersect: firstIntersect,
      sourceEvent: event,
      isMouseDown
    } as ThreeObjectDispatchEvent<keyof HTMLElementEventMap>)
  }

  for (const eventName of events) {
    renderElement.addEventListener(eventName, event => handleEvent(eventName, event as MouseEvent))
  }
}

/**
 * 纹理缓存加载器
 */
export class TextureCacheLoader {
  static instance: TextureCacheLoader
  static getInstance() {
    if (!TextureCacheLoader.instance) TextureCacheLoader.instance = new TextureCacheLoader()
    return TextureCacheLoader.instance
  }

  /**
   * 缓存
   */
  private cache = new Map<string, THREE.Texture>()

  /**
   * 加载器
   */
  private loader = new THREE.TextureLoader()

  /**
   * 根据单个链接加载纹理
   * @param url 图片链接
   * @returns 返回纹理
   */
  loadUrl(url: string) {
    if (this.cache.has(url)) return this.cache.get(url)
    const texture = this.loader.load(url)
    this.cache.set(url, texture)
    return texture
  }

  /**
   * 根据多个链接加载纹理
   * @param urls 图片链接数组
   * @returns 返回纹理数组
   */
  loadUrls(urls: string[]) {
    return urls.map(url => this.loadUrl(url))
  }
}

/**
 * 判断该对象是否含有该键名
 * @param obj 对象
 * @param key 键名
 * @returns 返回该对象是否含有该键名
 */
export function hasOwnProperty(obj: any, key: string): boolean {
  return Object.prototype.hasOwnProperty.call(obj, key)
}

/**
 * 判断两个值是否相等
 * @param a 值 a
 * @param b 值 b
 * @returns 值 a 和 值 b 是否相等
 */
export function isEqual(a: any, b: any): boolean {
  if (a === b) return true
  if (typeof a !== typeof b) return false
  if (typeof a !== 'object') return false
  if (a === null || b === null) return false
  if (Array.isArray(a) !== Array.isArray(b)) return false
  if (Array.isArray(a)) {
    if (a.length !== b.length) return false
    for (const [i, element] of a.entries()) {
      if (!isEqual(element, b[i])) return false
    }
    return true
  }
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  const aKeys = Object.keys(a)
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  const bKeys = Object.keys(b)
  if (aKeys.length !== bKeys.length) return false
  for (const key of aKeys) {
    if (!isEqual(a[key], b[key])) return false
  }
  return true
}

/**
 * 防抖
 * @param func 函数
 * @param wait 延迟时间，单位毫秒
 * @param immediate 是否立即执行
 * @returns 返回一个新的函数
 */
export function debounce<T extends (...args: any[]) => any>(func: T, wait: number, immediate = true) {
  let timeout: number | undefined
  let hasRunImmediate = false
  return function (this: any, ...args: Parameters<T>) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    const run = () => func.apply(this, args)

    if (timeout) clearTimeout(timeout)
    if (immediate && !hasRunImmediate) {
      hasRunImmediate = true
      run()
    } else {
      timeout = window.setTimeout(run, wait)
    }
  } as T
}

/**
 * 更新 threejs 3d 对象的位置、缩放、旋转等基础信息
 * @param object threejs 3d 对象
 * @param baseInfo 位置、缩放、旋转信息
 */
export function update3dObjectBaseInfo(object: THREE.Object3D, baseInfo: Partial<ThreeObjectBase>): void {
  const {position, rotate, scale} = baseInfo
  if (position && !new THREE.Vector3(position.x, position.y, position.z).equals(object.position)) {
    object.position.set(position.x, position.y, position.z)
  }

  if (scale && !new THREE.Vector3(scale.x, scale.y, scale.z).equals(object.scale)) {
    object.scale.set(scale.x, scale.y, scale.z)
  }

  if (rotate && !new THREE.Euler(rotate.x, rotate.y, rotate.z).equals(object.rotation)) {
    object.rotation.set(rotate.x, rotate.y, rotate.z)
  }
}

/**
 * 获取 threejs 3d 对象的位置、缩放、旋转等基础信息
 * @param object threejs 3d 对象
 * @returns 返回 threejs 3d 对象的位置、缩放、旋转等基础信息
 */
export function get3dObjectBaseInfo(object?: THREE.Object3D): ThreeObjectBase {
  return {
    position: {
      x: object?.position?.x ?? 0,
      y: object?.position?.y ?? 0,
      z: object?.position?.z ?? 0
    },
    rotate: {
      x: object?.rotation?.x ?? 0,
      y: object?.rotation?.y ?? 0,
      z: object?.rotation?.z ?? 0
    },
    scale: {
      x: object?.scale?.x ?? 1,
      y: object?.scale?.y ?? 1,
      z: object?.scale?.z ?? 1
    }
  }
}

/**
 * 处理位置、缩放、旋转等基础信息默认值
 * @param baseInfo 位置、缩放、旋转信息
 * @returns 返回位置、缩放、旋转等基础信息
 */
export function formatBaseInfo(baseInfo: DeepPartial<ThreeObjectBase> | undefined): DeepRequired<ThreeObjectBase> {
  return {
    position: {
      x: baseInfo?.position?.x ?? 0,
      y: baseInfo?.position?.y ?? 0,
      z: baseInfo?.position?.z ?? 0
    },
    rotate: {
      x: baseInfo?.rotate?.x ?? 0,
      y: baseInfo?.rotate?.y ?? 0,
      z: baseInfo?.rotate?.z ?? 0
    },
    scale: {
      x: baseInfo?.scale?.x ?? 1,
      y: baseInfo?.scale?.y ?? 1,
      z: baseInfo?.scale?.z ?? 1
    }
  }
}
