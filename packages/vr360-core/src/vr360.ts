/* eslint-disable unicorn/no-array-callback-reference */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
/* eslint-disable @typescript-eslint/no-unnecessary-condition */
import * as THREE from 'three'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'
import TWEEN from '@tweenjs/tween.js'
import {EventEmitter} from 'eventemitter3'
import {addListenerToThreeObject, convertMousePositionToThreePosition, TextureCacheLoader} from './helper'
import type {Position, SpaceConfig, Vr360Events, Vr360Options} from './types'
import type {SpaceManagerEvents} from './manager/space'
import {SpaceManager} from './manager/space'

export class Vr360 extends EventEmitter<Vr360Events> {
  /**
   * 销毁队列
   */
  private destroyTasks: (() => void)[] = []

  /**
   * 当前空间 id
   */
  private currentSpaceId = ''

  /**
   * 初始化空间 id
   */
  public initSpaceId?: string

  /**
   * texture 缓存器
   */
  private textureCacheLoader: TextureCacheLoader

  /**
   * 容器
   */
  public container: HTMLElement

  /**
   * 相机
   */
  public camera: THREE.PerspectiveCamera

  /**
   * 场景
   */
  public scene: THREE.Scene

  /**
   * 渲染器
   */
  public renderer: THREE.WebGLRenderer

  /**
   * 控制器
   */
  public controls: OrbitControls

  /**
   * 提示的容器
   */
  public tipContainer?: HTMLElement

  /**
   * 空间管理器
   */
  public spaceManager: SpaceManager

  /**
   * 空间配置
   */
  public spacesConfig: SpaceConfig[]

  /**
   * 容器宽
   */
  public get containerWidth() {
    return this.container.clientWidth
  }

  /**
   * 容器高
   */
  public get containerHeight() {
    return this.container.clientHeight
  }

  constructor(options: Vr360Options) {
    super()
    const {container, tipContainer, initSpaceId, spacesConfig = []} = options

    this.textureCacheLoader = TextureCacheLoader.getInstance()
    this.container = container
    this.camera = this.createCamera()
    this.scene = this.createScene()
    this.renderer = this.createRenderer()
    this.updateContainerSize()
    this.controls = this.createControls()
    this.container.append(this.renderer.domElement)

    this.tipContainer = tipContainer
    this.spacesConfig = [...spacesConfig]
    this.initSpaceId = String(initSpaceId || '')

    // 为 mesh 添加事件支持
    addListenerToThreeObject(() => {
      return {
        camera: this.camera,
        scene: this.scene,
        renderer: this.renderer
      }
    })

    // 缓存所有纹理
    this.cacheAllTextures()

    // 创建空间管理器
    this.spaceManager = this.createSpaceManager()

    // 实例化空间
    this.updateSpacesConfig(this.spacesConfig)

    // 初始化切换到第一个空间
    // this.switchSpace(this.currentSpaceId)
  }

  /**
   * 一次性加载并配置里所有的纹理图片
   */
  public cacheAllTextures(): void {
    const urls = this.spacesConfig.reduce<string[]>((urls, spaceConfig) => {
      const {cubeSpaceTextureUrls} = spaceConfig
      return [...urls, ...Object.values(cubeSpaceTextureUrls)]
    }, [])
    this.textureCacheLoader.loadUrls(urls)
  }

  /**
   * 监听页面尺寸变化，更新画布尺寸
   * @returns 返回取消监听函数
   */
  public listenResize(): () => void {
    const resizeFn = () => {
      this.updateContainerSize()
    }
    window.addEventListener('resize', resizeFn)

    const remove = () => {
      window.removeEventListener('resize', resizeFn)
    }

    this.destroyTasks.push(remove)
    return remove
  }

  /**
   * 更新容器宽高
   */
  public updateContainerSize(): void {
    const width = this.containerWidth
    const height = this.containerHeight
    if (this.camera) {
      this.camera.aspect = width / height
      this.camera.updateProjectionMatrix()
    }

    if (this.renderer) {
      this.renderer.setSize(width, height)
    }
  }

  /**
   * 更新 spaceConfig
   */
  public updateSpacesConfig(newSpacesConfig: SpaceConfig[]): void {
    const oldSpacesConfig = this.spacesConfig

    const newSpacesIds = new Set<string>()
    newSpacesConfig.map(spaceConfig => {
      // 如果空间已经存在，则更新空间配置，否则创建空间
      this.spaceManager.update(spaceConfig) ?? this.spaceManager.create(spaceConfig)
      newSpacesIds.add(String(spaceConfig.id))
    })

    oldSpacesConfig.map(spaceConfig => {
      // 删掉旧的空间
      if (!newSpacesIds.has(String(spaceConfig.id))) {
        this.spaceManager.remove(String(spaceConfig.id))
      }
    })

    this.spacesConfig = [...newSpacesConfig]

    // 如果当前空间不存在，则切换到另一个空间
    if (!this.currentSpaceId || !newSpacesIds.has(this.currentSpaceId)) {
      // 默认空间 id
      const defaultSpaceId = String(newSpacesConfig[0].id || '')

      // 要跳转的空间 id
      const switchSpaceId =
        !this.currentSpaceId && this.initSpaceId ? this.initSpaceId || defaultSpaceId : defaultSpaceId

      this.switchSpace(switchSpaceId)
    }
  }

  /**
   * 切换空间
   * @param id 空间 id
   * @param clickPosition 点击切换的位置，如果提高则会自动计算过渡动画
   */
  public switchSpace(id: string, clickPosition?: THREE.Vector3): void {
    const targetSpaceId = String(id)

    // 相同的房间就不执行跳转了
    if (this.currentSpaceId === targetSpaceId || !targetSpaceId) return

    const spaceGroup = this.spaceManager.find(targetSpaceId)

    // 找不到空间 id 相关的空间组，不执行跳转
    if (!spaceGroup) return

    // 找到空间组，但是挂载的信息丢失了，抛错
    if (!spaceGroup.userData.spaceConfig) throw new Error('vr360: spaceConfig 不存在')

    this.currentSpaceId = targetSpaceId

    const spaceConfig = spaceGroup.userData.spaceConfig as SpaceConfig
    const {camera} = spaceConfig

    // 添加目标空间进场景
    if (!this.scene.children.includes(spaceGroup)) {
      this.scene.add(spaceGroup)
    }

    // 从场景里移除其它空间
    this.scene.children.forEach(child => {
      if (child instanceof THREE.Group && child.userData.type === 'spaceGroup' && child !== spaceGroup) {
        this.scene.remove(child)
      }
    })

    // 场景动画结束时，添加小标签和白点
    const handleCompleteTween = () => {
      // 触发切换空间完成事件
      this.emit('afterSwitchSpace', {spaceConfig: spaceConfig})
    }

    // 下一个镜头的位置
    const targetPosition: Position = {
      x: camera?.position?.x ?? 0,
      y: camera?.position?.y ?? 0,
      z: camera?.position?.z ?? 0
    }

    if (clickPosition) {
      // 用 tween.js 添加镜头切换动画
      const fromPosition: Position = {
        x: targetPosition.x - (clickPosition.x - this.camera.position.x),
        y: targetPosition.y - (clickPosition.y - this.camera.position.y),
        z: targetPosition.z - (clickPosition.z - this.camera.position.z)
      }
      new TWEEN.Tween(fromPosition)
        .to(targetPosition, 500)
        .onUpdate(position => {
          this.camera.position.set(position.x, position.y, position.z)
        })
        .easing(TWEEN.Easing.Linear.None)
        .start()
        .onComplete(() => {
          handleCompleteTween()
        })
    } else {
      this.camera.position.set(targetPosition.x, targetPosition.y, targetPosition.z)
      handleCompleteTween()
    }
  }

  /**
   * 渲染
   */
  public render(): void {
    requestAnimationFrame(this.render.bind(this))
    this.controls.update()
    this.handleUpdate()
    TWEEN.update()
  }

  /**
   * 每次渲染更新时执行一些东西
   */
  private handleUpdate(): void {
    this.emit('update')
    this.renderer.render(this.scene, this.camera)
  }

  /**
   * 创建场景
   * @returns 返回场景
   */
  private createScene(): THREE.Scene {
    const scene = new THREE.Scene()

    this.destroyTasks.push(() => {
      scene.remove(...scene.children)
    })

    return scene
  }

  /**
   * 创建相机
   * @returns 返回相机
   */
  private createCamera(): THREE.PerspectiveCamera {
    const camera = new THREE.PerspectiveCamera(75, this.containerWidth / this.containerHeight, 0.01, 10_000)
    camera.position.set(0, 0, 0)

    return camera
  }

  /**
   * 创建 renderer 渲染器
   * @returns 返回渲染器
   */
  private createRenderer(): THREE.WebGLRenderer {
    const renderer = new THREE.WebGLRenderer({
      antialias: true
    })
    renderer.setClearColor(0xff_ff_ff, 1)
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.setSize(this.containerWidth, this.containerHeight)

    this.destroyTasks.push(() => {
      renderer.dispose()
      renderer.forceContextLoss()
      renderer.domElement.remove()
    })

    return renderer
  }

  /**
   * 创建控制器
   * @returns 返回控制器
   */
  private createControls(): OrbitControls {
    const controls = new OrbitControls(this.camera, this.renderer.domElement)
    controls.listenToKeyEvents(window)
    controls.autoRotate = false
    controls.autoRotateSpeed = 0.5
    controls.enableZoom = true
    controls.enableDamping = false
    controls.enablePan = true
    controls.enableRotate = true
    controls.minDistance = 1
    controls.maxDistance = 100
    // controls.maxPolarAngle = Math.PI / 2
    // controls.screenSpacePanning = false

    // 控制器初始化位置为相机看到的位置
    controls.target = new THREE.Vector3(0, 0, 1)
    controls.update()

    this.destroyTasks.push(() => {
      controls.dispose()
    })

    return controls
  }

  /**
   * 创建空间管理器
   */
  private createSpaceManager(): SpaceManager {
    const spaceManager = new SpaceManager({
      container: this.container,
      camera: this.camera,
      scene: this.scene,
      renderer: this.renderer,
      tipContainer: this.tipContainer,
      textureCacheLoader: this.textureCacheLoader,
      parent: this.scene
    })

    // 空间事件继承
    const spaceEvents: (keyof SpaceManagerEvents)[] = ['showTip', 'hideTip', 'clickTip', 'afterSwitchSpace']

    spaceEvents.forEach(eventName => {
      spaceManager.on(eventName, e => {
        // @ts-ignore
        this.emit(eventName, e)
      })
    })

    // 特殊处理
    spaceManager.on('switchSpace', e => {
      this.switchSpace(e.targetSpaceId, e.clickPosition)
    })

    return spaceManager
  }

  /**
   * 把鼠标 x、y坐标转换为画布内的三维坐标
   * @param x 鼠标 x 坐标
   * @param y 鼠标 y 坐标
   * @returns 返回三维坐标
   */
  public getPositionFromMouseXY(x: number, y: number): Position {
    return convertMousePositionToThreePosition({
      mouseX: x,
      mouseY: y,
      getDeps: () => ({
        camera: this.camera,
        renderer: this.renderer,
        scene: this.scene
      })
    })
  }

  /**
   * 卸载实例
   */
  public destroy(): void {
    this.destroyTasks.forEach(task => task())
    this.removeAllListeners()
  }
}
