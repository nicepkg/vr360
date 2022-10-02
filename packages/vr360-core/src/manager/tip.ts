import * as THREE from 'three'
import type {TextureCacheLoader, ThreeObjectDispatchEvent} from '../helper'
import {update3dObjectBaseInfo} from '../helper'
import type {Tip} from '../types'
import defaultTipUrl from '../assets/tips.png'
import {EventEmitter} from 'eventemitter3'
import type {ConfigModelManager} from '../manager'

/**
 * 触发提示时的回调 event
 */
export type ShowTipEvent = {
  /**
   * 提示配置信息
   */
  tip: Tip

  /**
   * 相对于 container 的 left
   */
  left: number

  /**
   * 相对于 container 的 top
   */
  top: number
}

/**
 * 隐藏提示时的回调 event
 */
export type HideTipEvent = {
  tip: Tip
}

/**
 * 点击提示时的回调 event
 */
export type ClickTipEvent = {
  tip: Tip
}

/**
 * 切换空间事件
 */
export type SwitchSpaceEvent = {
  /**
   * 跳转目标空间的 id
   */
  targetSpaceId: string

  /**
   * 点击切换的位置
   */
  clickPosition?: THREE.Vector3
}

/**
 * 提示管理器事件列表
 */
export type TipManagerEvents = {
  /**
   * 触发提示时的回调
   */
  showTip: (e: ShowTipEvent) => void

  /**
   * 隐藏提示时的回调
   */
  hideTip: (e: HideTipEvent) => void

  /**
   * 点击提示时的回调
   */
  clickTip: (e: ClickTipEvent) => void

  /**
   * 切换空间时的回调
   */
  switchSpace: (e: SwitchSpaceEvent) => void
}

export type TipEventName = keyof TipManagerEvents
export const tipEventNames: TipEventName[] = ['showTip', 'hideTip', 'clickTip', 'switchSpace']

export type TipManagerOptions = {
  /**
   * 容器
   */
  container: HTMLElement

  /**
   * 相机
   */
  camera: THREE.PerspectiveCamera

  /**
   * 场景
   */
  scene: THREE.Scene

  /**
   * 渲染器
   */
  renderer: THREE.WebGLRenderer

  /**
   * 3d 组, 用于添加提示 sprite
   */
  parent: THREE.Object3D

  /**
   * texture 缓存器
   */
  textureCacheLoader: TextureCacheLoader

  /**
   * 提示容器
   */
  tipContainer: HTMLElement
}

/**
 * 提示配置管理器
 */
export class TipManager extends EventEmitter<TipManagerEvents> implements ConfigModelManager<Tip, THREE.Sprite> {
  private container: HTMLElement
  private camera: THREE.PerspectiveCamera
  private scene: THREE.Scene
  private renderer: THREE.WebGLRenderer
  private parent: THREE.Object3D
  private textureCacheLoader: TextureCacheLoader
  private tipContainer: HTMLElement

  private tipIdSpriteMap = new Map<string, THREE.Sprite>()

  constructor(options: TipManagerOptions) {
    super()
    this.container = options.container
    this.camera = options.camera
    this.scene = options.scene
    this.renderer = options.renderer
    this.parent = options.parent
    this.textureCacheLoader = options.textureCacheLoader
    this.tipContainer = options.tipContainer
  }

  public create(tip: Tip): THREE.Sprite {
    const {position, textureUrl = defaultTipUrl, scale, rotate, id} = tip
    const texture = this.textureCacheLoader.loadUrl(textureUrl)
    const material = new THREE.SpriteMaterial({map: texture})
    const sprite = new THREE.Sprite(material)

    // 调整位置大小旋转角度
    sprite.scale.set(scale?.x ?? 3, scale?.y ?? 3, scale?.z ?? 3)
    sprite.position.set(position.x, position.y, position.z)
    if (rotate) {
      sprite.rotation.set(rotate.x, rotate.y, rotate.z)
    }

    // 设置鼠标样式
    sprite.userData.cursor = 'pointer'

    // 挂载当前 tip 到 sprite 上，在事件里面使用（更新时会覆盖这个挂载）
    sprite.userData.type = 'tipSprite'
    sprite.userData.tip = tip

    // 触发展示 tips 事件
    const emitShowTip = (e: ThreeObjectDispatchEvent<'mouseover'> | ThreeObjectDispatchEvent<'mouseup'>) => {
      // hover 的对象
      const intersect = e.intersect
      const tipFromUserData = intersect.object.userData.tip as Tip

      const containerHalfWidth = this.container.clientWidth / 2
      const containerHalfHeight = this.container.clientHeight / 2

      // 注意：如果外面是使用 display none 控制 tip 显隐，这里的 tipContainer 宽高均为 0，导致 tip 偏移
      const tipContainerWidth = this.tipContainer.clientWidth
      const tipContainerHeight = this.tipContainer.clientHeight
      const rendererOffsetLeft = this.renderer.domElement.offsetLeft
      const rendererOffsetTop = this.renderer.domElement.offsetTop
      const percentPosition = intersect.object.position.clone().project(this.camera)
      const left = (percentPosition.x + 1) * containerHalfWidth - tipContainerWidth / 2 + rendererOffsetLeft
      const top = (1 - percentPosition.y) * containerHalfHeight - tipContainerHeight / 2 + rendererOffsetTop

      const showTipEvent: ShowTipEvent = {tip: tipFromUserData, left, top}
      // console.log('展示提示', showTipEvent)
      this.emit('showTip', showTipEvent)
    }

    // 鼠标 hover 时展示提示
    sprite.addEventListener('mouseover', _e => {
      const e = _e as unknown as ThreeObjectDispatchEvent<'mouseover'>

      // 如果鼠标处于按压下状态，不展示提示，此举是为了防止和 controls 滑动冲突导致位置偏差
      if (e.isMouseDown) return

      emitShowTip(e)
    })

    // 如果在 tip 上松开鼠标，则判断为需要展示 tips，因为用户可能 controls 滑倒 tips 再松开
    sprite.addEventListener('mouseup', _e => {
      const e = _e as unknown as ThreeObjectDispatchEvent<'mouseup'>

      emitShowTip(e)
    })

    // 鼠标移出时移除提示
    sprite.addEventListener('mouseout', _e => {
      const e = _e as unknown as ThreeObjectDispatchEvent<'mouseout'>

      const intersect = e.intersect
      const tipFromUserData = intersect.object.userData.tip as Tip

      const hideTipEvent: HideTipEvent = {tip: tipFromUserData}
      // console.log('隐藏提示', hideTipEvent)
      this.emit('hideTip', hideTipEvent)
    })

    sprite.addEventListener('click', _e => {
      const e = _e as unknown as ThreeObjectDispatchEvent<'click'>

      const intersect = e.intersect
      const tipFromUserData = intersect.object.userData.tip as Tip

      this.emit('clickTip', {tip: tipFromUserData})

      if (tipFromUserData.targetSpaceId) {
        // 存在目标空间 id，点击跳转
        // 跳转时隐藏提示
        this.emit('hideTip', {tip: tipFromUserData})

        const switchSpaceEvent: SwitchSpaceEvent = {
          targetSpaceId: tipFromUserData.targetSpaceId,
          clickPosition: intersect.point
        }

        // console.log('调转到空间', switchSpaceEvent)
        this.emit('switchSpace', switchSpaceEvent)
      }
    })

    this.tipIdSpriteMap.set(id, sprite)
    return sprite
  }

  public add(tip: Tip): THREE.Sprite {
    const sprite = this.findOrCreate(tip)
    this.parent.add(sprite)
    return sprite
  }

  public update(tip: Partial<Tip> & Pick<Tip, 'id'>): THREE.Sprite | undefined {
    const {id, textureUrl, position, scale, rotate} = tip
    const sprite = this.tipIdSpriteMap.get(id)

    if (!sprite) return

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (textureUrl && textureUrl !== sprite.material.map?.image?.src) {
      const texture = this.textureCacheLoader.loadUrl(textureUrl)
      const material = new THREE.SpriteMaterial({map: texture})
      sprite.material = material
    }

    update3dObjectBaseInfo(sprite, {
      position,
      scale,
      rotate
    })

    sprite.userData.tip = tip
    // this.tipIdSpriteMap.set(id, sprite)
    return sprite
  }

  public find(tip: string | (Partial<Tip> & Pick<Tip, 'id'>)): THREE.Sprite | undefined {
    const id = typeof tip === 'string' ? tip : tip.id
    return this.tipIdSpriteMap.get(id)
  }

  public findOrCreate(tip: Tip): THREE.Sprite {
    const sprite = this.find(tip)
    if (sprite) return sprite
    return this.create(tip)
  }

  public remove(tip: string | (Partial<Tip> & Pick<Tip, 'id'>)): void {
    const id = typeof tip === 'string' ? tip : tip.id
    const sprite = this.tipIdSpriteMap.get(id)
    if (!sprite) return

    this.parent.remove(sprite)
    this.tipIdSpriteMap.delete(id)
  }

  public removeAll(): void {
    this.tipIdSpriteMap.forEach(sprite => {
      this.parent.remove(sprite)
    })
    this.tipIdSpriteMap.clear()
  }

  public destroy(): void {
    this.removeAll()
    this.removeAllListeners()
  }
}
