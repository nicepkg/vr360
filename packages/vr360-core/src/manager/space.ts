/* eslint-disable @typescript-eslint/ban-ts-comment */
import * as THREE from 'three'
import type {TextureCacheLoader} from '../helper'
import {isEqual} from '../helper'
import {EventEmitter} from 'eventemitter3'
import type {ConfigModelManager} from './index'
import type {CubeSpaceTextureUrls, SpaceConfig} from '../types'
import type {TipManagerEvents, TipManagerOptions} from './tip'
import {tipEventNames, TipManager} from './tip'

/**
 * 空间管理器事件列表
 */
export type SpaceManagerEvents = TipManagerEvents

export type SpaceEventName = keyof SpaceManagerEvents
export const spaceEventNames: SpaceEventName[] = [...tipEventNames]

export type SpaceManagerOptions = Omit<TipManagerOptions, 'tipContainer'> & {
  tipContainer?: HTMLElement
}

/**
 * curd SpaceConfig to threejs
 */
export class SpaceManager
  extends EventEmitter<SpaceManagerEvents>
  implements ConfigModelManager<SpaceConfig, THREE.Group>
{
  private container: HTMLElement
  private camera: THREE.PerspectiveCamera
  private scene: THREE.Scene
  private renderer: THREE.WebGLRenderer
  private parent: THREE.Object3D
  private tipContainer?: HTMLElement
  private textureCacheLoader: TextureCacheLoader

  private spaceIdGroupMap = new Map<string, THREE.Group>()
  private spaceIdTipManager = new Map<string, TipManager>()

  constructor(options: SpaceManagerOptions) {
    super()
    this.container = options.container
    this.camera = options.camera
    this.scene = options.scene
    this.renderer = options.renderer
    this.parent = options.parent
    this.tipContainer = options.tipContainer
    this.textureCacheLoader = options.textureCacheLoader
  }

  /**
   * 创建提示管理器
   * @param parent threejs 组
   * @returns 提示管理器
   */
  private createTipManager(parent: THREE.Object3D): TipManager | undefined {
    if (!this.tipContainer) return

    const tipManager = new TipManager({
      container: this.container,
      camera: this.camera,
      scene: this.scene,
      renderer: this.renderer,
      tipContainer: this.tipContainer,
      textureCacheLoader: this.textureCacheLoader,
      parent
    })

    // 提示的事件继承
    tipEventNames.forEach(eventName => {
      tipManager.on(eventName, e => {
        // @ts-ignore
        this.emit(eventName, e)
      })
    })

    return tipManager
  }

  /**
   * 创建正方体空间 mesh
   * @param cubeSpaceTextureUrls 空间贴图
   */
  private createCubeSpaceMesh(cubeSpaceTextureUrls: CubeSpaceTextureUrls) {
    // 创建空间
    const boxGeometry = new THREE.BoxGeometry(100, 100, 100)

    // 随机挑选一个面翻转扩大，使得贴图能够正常渲染
    boxGeometry.scale(-1, 1, 1)

    // 贴材质
    const boxMaterials = this.createCubeSpaceMaterials(cubeSpaceTextureUrls)
    const spaceMesh = new THREE.Mesh(boxGeometry, boxMaterials)
    return spaceMesh
  }

  /**
   * 创建正方体空间材料
   * @param cubeSpaceTextureUrls 空间贴图
   */
  private createCubeSpaceMaterials(cubeSpaceTextureUrls: CubeSpaceTextureUrls) {
    const directions = ['right', 'left', 'top', 'bottom', 'front', 'back'] as const
    const boxMaterials: THREE.MeshBasicMaterial[] = directions.map(direction => {
      const texture = this.textureCacheLoader.loadUrl(
        cubeSpaceTextureUrls[direction as keyof typeof cubeSpaceTextureUrls]
      )
      return new THREE.MeshBasicMaterial({map: texture})
    })
    return boxMaterials
  }

  public create(spaceConfig: SpaceConfig): THREE.Group {
    const {cubeSpaceTextureUrls, tips = [], id} = spaceConfig
    const group = new THREE.Group()

    // 创建提示精灵
    if (this.tipContainer) {
      const tipManager = this.createTipManager(group)!
      tips.forEach(tip => {
        const sprite = tipManager.findOrCreate(tip)
        group.add(sprite)
      })
      this.spaceIdTipManager.set(id, tipManager)
    }

    // 创建空间
    const spaceMesh = this.createCubeSpaceMesh(cubeSpaceTextureUrls)
    spaceMesh.userData.type = 'spaceMesh'

    // 挂载当前 spaceConfig 到 group 上，在事件里面使用（更新时会覆盖这个挂载）
    group.userData.type = 'spaceGroup'
    group.userData.spaceConfig = spaceConfig

    group.add(spaceMesh)
    this.spaceIdGroupMap.set(id, group)

    return group
  }

  public add(spaceConfig: SpaceConfig): THREE.Group {
    const group = this.findOrCreate(spaceConfig)
    this.parent.add(group)
    return group
  }

  public update(spaceConfig: Partial<SpaceConfig> & Pick<SpaceConfig, 'id'>): THREE.Group | undefined {
    const {id, tips, cubeSpaceTextureUrls} = spaceConfig
    const group = this.spaceIdGroupMap.get(id)

    if (!group) return

    if (tips && this.tipContainer) {
      const tipManager = this.spaceIdTipManager.get(id) ?? this.createTipManager(group)!

      const sprites = new Set(
        tips.map(tip => {
          const sprite = tipManager.update(tip) ?? tipManager.create(tip)
          return sprite
        })
      )

      const children = [...group.children]

      // 找出需要删除的精灵并删除
      children.forEach(child => {
        if (child.type === 'Sprite' && child.userData.type === 'tipSprite' && !sprites.has(child as THREE.Sprite)) {
          group.remove(child)
        }
      })

      // 找出需要添加的精灵并添加
      sprites.forEach(sprite => {
        if (!group.children.includes(sprite)) {
          group.add(sprite)
        }
      })
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (cubeSpaceTextureUrls && !isEqual(group.userData.spaceConfig?.cubeSpaceTextureUrls, cubeSpaceTextureUrls)) {
      let spaceMesh = group.children.find(child => child.type === 'Mesh' && child.userData.type === 'spaceMesh') as
        | THREE.Mesh
        | undefined

      if (!spaceMesh) {
        spaceMesh = this.createCubeSpaceMesh(cubeSpaceTextureUrls)
      } else {
        const boxMaterials = this.createCubeSpaceMaterials(cubeSpaceTextureUrls)
        spaceMesh.material = boxMaterials
      }
    }

    group.userData.spaceConfig = spaceConfig
    // this.spaceIdGroupMap.set(id, group)
    return group
  }

  public find(spaceConfig: string | (Partial<SpaceConfig> & Pick<SpaceConfig, 'id'>)): THREE.Group | undefined {
    const id = typeof spaceConfig === 'string' ? spaceConfig : spaceConfig.id
    return this.spaceIdGroupMap.get(id)
  }

  public findOrCreate(spaceConfig: SpaceConfig): THREE.Group {
    const group = this.find(spaceConfig)
    if (group) return group
    return this.create(spaceConfig)
  }

  public remove(spaceConfig: string | (Partial<SpaceConfig> & Pick<SpaceConfig, 'id'>)): void {
    const id = typeof spaceConfig === 'string' ? spaceConfig : spaceConfig.id
    const group = this.spaceIdGroupMap.get(id)

    if (!group) return
    this.parent.remove(group)
    this.spaceIdGroupMap.delete(id)
    this.spaceIdTipManager.delete(id)
  }

  public removeAll(): void {
    this.spaceIdGroupMap.forEach(group => {
      this.parent.remove(group)
    })

    this.spaceIdTipManager.forEach(tipManager => {
      tipManager.destroy()
    })

    this.spaceIdGroupMap.clear()
    this.spaceIdTipManager.clear()
  }

  public destroy(): void {
    this.removeAll()
    this.removeAllListeners()
  }
}
