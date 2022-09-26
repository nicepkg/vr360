/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
/* eslint-disable @typescript-eslint/no-unnecessary-condition */
import * as THREE from 'three'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'
import TWEEN from '@tweenjs/tween.js'
import {EventEmitter} from 'eventemitter3'
import {addListenerToThreeObject, TextureCacheLoader} from './helper'
import type {CubeSpaceTextureUrls, Position, SpaceConfig, Tip, Vr360Events, Vr360Options} from './types'
import defaultTipUrl from './assets/tips.png'

export class Vr360 extends EventEmitter<Vr360Events> {
  /**
   * 销毁队列
   */
  private destroyTasks: (() => void)[] = []

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
   * 空间配置
   */
  public spacesConfig: SpaceConfig[]

  /**
   * 中心点网格
   */
  public centerPointMesh!: THREE.Mesh

  /**
   * 中心点贴图链接
   */
  public centerPointTextureUrl: string

  /**
   * 提示的容器
   */
  public tipContainer?: HTMLElement

  /**
   * 空间网格
   */
  public spaceMesh?: THREE.Mesh

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
    const {container, centerPointTextureUrl, tipContainer, initSpaceId, spacesConfig = []} = options

    this.textureCacheLoader = new TextureCacheLoader()
    this.container = container
    this.camera = this.createCamera()
    this.scene = this.createScene()
    this.renderer = this.createRenderer()
    this.updateContainerSize()
    this.controls = this.createControls()
    this.container.append(this.renderer.domElement)

    this.tipContainer = tipContainer
    this.spacesConfig = spacesConfig
    this.centerPointTextureUrl = centerPointTextureUrl || 'picture/center.png'

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

    // 初始化切换到第一个空间
    this.switchSpace(initSpaceId)
  }

  /**
   * 一次性加载并配置里所有的纹理图片
   */
  public cacheAllTextures() {
    const urls = this.spacesConfig.reduce<string[]>((urls, spaceConfig) => {
      const {cubeSpaceTextureUrls} = spaceConfig
      return [...urls, ...Object.values(cubeSpaceTextureUrls)]
    }, [])
    this.textureCacheLoader.loadUrls(urls)
  }

  /**
   * 从链接或者缓存中加载纹理
   * @param url 纹理图片链接
   * @returns 纹理
   */
  private getTextureFromUrl(url: string) {
    return this.textureCacheLoader.load(url)
  }

  /**
   * 监听页面尺寸变化，更新画布尺寸
   * @returns 返回取消监听函数
   */
  public listenResize() {
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
  public updateContainerSize() {
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
   * 切换空间
   * @param id 空间 id
   * @param clickPosition 点击切换的位置，如果提高则会自动计算过渡动画
   */
  public switchSpace(id?: string | undefined, clickPosition?: THREE.Vector3) {
    const targetSpaceId = String(id || this.spacesConfig[0].spaceId || '')
    const spaceConfig = this.spacesConfig.find(item => String(item.spaceId || '') === String(targetSpaceId))
    if (!spaceConfig) return

    const {cameraPosition, cubeSpaceTextureUrls, tips = []} = spaceConfig

    // 场景元素列表
    const sceneChildren: THREE.Object3D[] = []

    // 创建提示精灵
    if (this.tipContainer) {
      const tipSprites = tips.map(tip => {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const sprite = this.createTipSprite(tip, this.tipContainer!)
        sprite.userData.spaceId = targetSpaceId
        return sprite
      })
      sceneChildren.push(...tipSprites)
    }

    if (!this.spaceMesh) {
      // 创建空间 mesh
      this.spaceMesh = this.createCubeSpaceMesh(cubeSpaceTextureUrls)
      sceneChildren.push(this.spaceMesh)
    } else {
      // 已经有空间 mesh 就替换材质
      this.spaceMesh.material = this.createCubeSpaceMaterials(cubeSpaceTextureUrls)
    }

    // 过滤带有 spaceId 的场景
    this.scene.children = this.scene.children.filter(item => !item.userData.spaceId)

    // 场景动画结束时，添加小标签和白点
    const handleCompleteTween = () => {
      // 把场景元素列表添加到场景
      this.scene.add(...sceneChildren)

      // 触发切换空间完成事件
      this.emit('afterSwitchSpace', {spaceConfig: spaceConfig})
    }

    // 下一个镜头的位置
    const targetPosition: Position = {
      x: cameraPosition?.x ?? 0,
      y: cameraPosition?.y ?? 0,
      z: cameraPosition?.z ?? 0
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
   * 创建正方体空间 mesh
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
      const texture = this.getTextureFromUrl(cubeSpaceTextureUrls[direction as keyof typeof cubeSpaceTextureUrls])
      return new THREE.MeshBasicMaterial({map: texture})
    })
    return boxMaterials
  }

  /**
   * 渲染
   */
  public render() {
    requestAnimationFrame(this.render.bind(this))
    this.controls.update()
    this.handleUpdate()
    TWEEN.update()
  }

  /**
   * 每次渲染更新时执行一些东西
   */
  private handleUpdate() {
    this.emit('update')
    // this.updateCenterPointMesh()
    this.renderer.render(this.scene, this.camera)
  }

  /**
   * 创建场景
   * @returns 返回场景
   */
  private createScene() {
    const scene = new THREE.Scene()
    return scene
  }

  /**
   * 创建相机
   * @returns 返回相机
   */
  private createCamera() {
    const camera = new THREE.PerspectiveCamera(75, this.containerWidth / this.containerHeight, 0.01, 10_000)
    camera.position.set(0, 0, 0)
    return camera
  }

  /**
   * 创建 renderer 渲染器
   * @returns 返回渲染器
   */
  private createRenderer() {
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
  private createControls() {
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

    return controls
  }

  /**
   * 创建提示精灵
   * @param tip 单个提示配置
   * @returns 返回提示精灵
   */
  private createTipSprite(tip: Tip, tipContainer: HTMLElement) {
    const {position, textureUrl = defaultTipUrl, scale, rotate, targetSpaceId} = tip
    const texture = this.getTextureFromUrl(textureUrl)
    const material = new THREE.SpriteMaterial({map: texture})
    const sprite = new THREE.Sprite(material)

    // 调整位置大小旋转角度
    sprite.scale.set(scale?.x ?? 3, scale?.y ?? 3, scale?.z ?? 3)
    sprite.position.set(position.x, position.y, position.z)
    if (rotate) {
      sprite.rotateX(rotate.x)
      sprite.rotateY(rotate.y)
      sprite.rotateZ(rotate.z)
    }

    // 设置鼠标样式
    sprite.userData.cursor = 'pointer'

    // 鼠标 hover 时展示提示
    sprite.addEventListener('mouseover', e => {
      const intersect = e.intersect as THREE.Intersection
      const containerHalfWidth = this.containerWidth / 2
      const containerHalfHeight = this.containerHeight / 2

      // 注意：如果外面是使用 display none 控制 tip 显隐，这里的 tipContainer 宽高均为 0，导致 tip 偏移
      const tipContainerWidth = tipContainer.clientWidth
      const tipContainerHeight = tipContainer.clientHeight
      const rendererOffsetLeft = this.renderer.domElement.offsetLeft
      const rendererOffsetTop = this.renderer.domElement.offsetTop
      const percentPosition = intersect.object.position.clone().project(this.camera)
      const left = (percentPosition.x + 1) * containerHalfWidth - tipContainerWidth / 2 + rendererOffsetLeft
      const top = (1 - percentPosition.y) * containerHalfHeight - tipContainerHeight / 2 + rendererOffsetTop

      console.log('展示提示', {
        tip,
        left,
        top
      })
      this.emit('showTip', {
        tip,
        left,
        top
      })
    })

    // 鼠标移出时移除提示
    sprite.addEventListener('mouseout', () => {
      console.log('隐藏提示', {tip})
      this.emit('hideTip', {
        tip
      })
    })

    sprite.addEventListener('click', e => {
      this.emit('clickTip', {tip})

      if (targetSpaceId) {
        // 存在目标空间 id，点击跳转
        // 跳转时隐藏提示
        this.emit('hideTip', {
          tip
        })
        const intersect = e.intersect as THREE.Intersection
        console.log('调转到空间', targetSpaceId, e.sourceEvent)
        this.switchSpace(targetSpaceId, intersect.point)
      }
    })

    return sprite
  }

  /**
   * 更新当前视觉所在位置的 mesh，用于标示东南西北
   */
  private updateCenterPointMesh() {
    if (!this.centerPointMesh) {
      const geometry = new THREE.CircleGeometry(12, 40, 0, 2 * Math.PI)
      geometry.scale(-1, 1, 1)
      this.centerPointMesh = new THREE.Mesh(
        geometry,
        new THREE.MeshBasicMaterial({
          map: this.getTextureFromUrl(this.centerPointTextureUrl),
          transparent: true,
          opacity: 0.4
        })
      )

      this.centerPointMesh.rotation.x = Math.PI / 2
      this.centerPointMesh.rotation.z = Math.PI
      this.scene.add(this.centerPointMesh)
    }

    this.centerPointMesh.position.set(this.camera.position.x, this.camera.position.y - 20, this.camera.position.z)
  }

  /**
   * 卸载实例
   */
  public destroy() {
    this.destroyTasks.forEach(task => task())
  }
}
