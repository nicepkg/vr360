import * as THREE from 'three'

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
  const raycaster = new THREE.Raycaster()
  const mouse = new THREE.Vector2()
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
  load(url: string) {
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
    return urls.map(url => this.load(url))
  }
}
