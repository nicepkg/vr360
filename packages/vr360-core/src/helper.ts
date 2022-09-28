/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unnecessary-condition */
import * as THREE from 'three'
import type {Position} from './types'

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

/**
 * 为 threejs 对象添加事件监听器
 * @param getDeps 获取依赖函数
 * @param events 监听的事件名称列表
 */
export function addListenerToThreeObject(
  getDeps: GetAddListenerToThreeObjectDeps,
  events: (keyof HTMLElementEventMap)[] = ['click', 'mousemove', 'touchmove']
) {
  const renderElement = getDeps().renderer?.domElement
  if (!renderElement) return
  const {raycaster, mouse} = getSingleValue()
  let mouseoverPreIntersect: THREE.Intersection | undefined

  function handleEvent(eventName: string, event: MouseEvent) {
    event.preventDefault()
    const {camera, scene, renderer} = getDeps()
    if (!camera || !scene || !renderer) return
    const renderDomBound = renderer.domElement.getBoundingClientRect()

    mouse.x = ((event.clientX - renderDomBound.left) / renderer.domElement.clientWidth) * 2 - 1
    mouse.y = -((event.clientY - renderDomBound.top) / renderer.domElement.clientHeight) * 2 + 1

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
        sourceEvent: event
      })
      mouseoverPreIntersect = firstIntersect

      // 设置鼠标样式
      const cursor = firstIntersect.object.userData.cursor || 'default'
      if (renderElement && renderElement.style.cursor !== cursor) renderElement.style.cursor = cursor

      // 触发本次 hover 对象的 mouseover 事件
      firstIntersect.object.dispatchEvent({
        type: 'mouseover',
        intersect: firstIntersect,
        sourceEvent: event
      })
    }

    // 射线范围内没有东西，终止流程
    if (intersects.length <= 0) return

    if (eventName === 'click') {
      console.log(`当前点击位置: x=${firstIntersect.point.x}, y=${firstIntersect.point.y}, z=${firstIntersect.point.z}`)
    }

    firstIntersect.object.dispatchEvent({
      type: eventName,
      intersect: firstIntersect,
      sourceEvent: event
    })
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

export function hasOwnProperty(obj: any, key: string) {
  return Object.prototype.hasOwnProperty.call(obj, key)
}

export function isEqual(a: any, b: any) {
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
