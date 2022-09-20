/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable import/no-named-as-default-member */
import * as THREE from 'three'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'
import TWEEN from '@tweenjs/tween.js'
import {EventEmitter} from 'eventemitter3'

type GetAddListenerToThreeObjectDeps = () => {
  camera?: THREE.PerspectiveCamera
  scene?: THREE.Scene
  renderer?: THREE.WebGLRenderer
}

function addListenerToThreeObject(
  getDeps: GetAddListenerToThreeObjectDeps,
  events: Array<keyof HTMLElementEventMap> = ['click', 'mousemove']
) {
  const renderElement = getDeps().renderer?.domElement
  if (!renderElement) return
  const raycaster = new THREE.Raycaster()
  const mouse = new THREE.Vector2()
  let mouseoverPreIntersect: THREE.Intersection

  function handleEvent(eventName: string, event: MouseEvent) {
    event.preventDefault()
    const {camera, scene, renderer} = getDeps()
    if (!camera || !scene || !renderer) return

    mouse.x = (event.clientX / renderer.domElement.clientWidth) * 2 - 1
    mouse.y = -(event.clientY / renderer.domElement.clientHeight) * 2 + 1

    raycaster.setFromCamera(mouse, camera)

    const intersects = raycaster.intersectObjects(scene.children)

    // 射线范围内没有东西，终止流程
    if (intersects.length <= 0) return

    if (eventName === 'click') {
      console.log(`当前点击位置: x=${intersects[0].point.x}, y=${intersects[0].point.y}, z=${intersects[0].point.z}`)
    }

    if (eventName === 'mousemove' && mouseoverPreIntersect?.object?.uuid !== intersects[0].object.uuid) {
      // 在 mousemove 事件时, 并且本次鼠标指中的 three 对象和上一个对象不相同时，触发上个对象 mouseout 事件和本次对象 mouseover 事件
      mouseoverPreIntersect?.object?.dispatchEvent?.({type: 'mouseout', intersect: mouseoverPreIntersect})
      mouseoverPreIntersect = intersects[0]
      intersects[0]?.object?.dispatchEvent?.({type: 'mouseover', intersect: intersects[0]})
    }

    intersects[0]?.object?.dispatchEvent?.({type: eventName, intersect: intersects[0]})
  }

  events.forEach(eventName => {
    renderElement.addEventListener(eventName, event => handleEvent(eventName, event as MouseEvent))
  })
}

export interface ShowTipEvent {
  tip: Tip
  left: number
  top: number
}

export interface HideTipEvent {
  tip: Tip
}

export interface Vr360Events {
  /**
   * 每帧更新回调
   */
  update: () => void

  /**
   * 触发提示时的回调
   */
  showTip: (e: ShowTipEvent) => void

  /**
   * 隐藏提示时的回调
   */
  hideTip: (e: HideTipEvent) => void
}

export interface Position {
  x: number
  y: number
  z: number
}

export interface Scale {
  x: number
  y: number
  z: number
}

export interface HotPoint {
  position: Position
  scale?: Scale
  targetSpaceId: string
}

export interface CubeSpaceTextureUrls {
  left: string
  right: string
  top: string
  bottom: string
  front: string
  back: string
}

export interface Tip {
  position: Position
  scale?: Scale
  textureUrl?: string
  [key: string]: any
}

export interface SpaceConfig {
  spaceId: string
  cameraPosition?: Position
  hotPoints?: HotPoint[]
  tips?: Tip[]
  cubeSpaceTextureUrls: CubeSpaceTextureUrls
}

interface Vr360Options {
  /**
   * 容器
   */
  container: HTMLElement

  /**
   * 用于点击跳转场景的白点图片 url
   */
  hotPointTextureUrl?: string

  /**
   * 用于标示东南西北的脚下图片 url
   */
  centerPointTextureUrl?: string

  /**
   * 提示的 element 节点
   */
  tipContainer?: HTMLElement

  /**
   * 初始显示的空间 id
   */
  initSpaceId?: string

  /**
   * 空间配置
   */
  spacesConfig: SpaceConfig[]
}

export class Vr360 extends EventEmitter<Vr360Events> {
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
   * 小白点贴图链接
   */
  public hotPointTextureUrl: string

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

  // 顶点着色器
  private vertexShader = `
  // attribute vec3 position;
  // attribute vec3 color;
  // 系统自动声明顶点纹理坐标变量uv
  // attribute vec2 uv;
  // varying关键字声明一个变量表示顶点纹理坐标插值后的结果
  varying vec2 vUv;
  void main(){
      // 顶点纹理坐标uv数据进行插值计算
      vUv = uv;
      // 投影矩阵projectionMatrix、视图矩阵viewMatrix、模型矩阵modelMatrix
      gl_Position = projectionMatrix*viewMatrix*modelMatrix*vec4( position, 1.0 );
  }`

  constructor(options: Vr360Options) {
    super()
    const {container, hotPointTextureUrl, centerPointTextureUrl, tipContainer, initSpaceId, spacesConfig = []} = options

    this.container = container
    this.updateContainerSize()
    this.camera = this.createCamera()
    this.scene = this.createScene()
    this.renderer = this.createRenderer()
    this.controls = this.createControls()
    this.container.appendChild(this.renderer.domElement)

    this.spacesConfig = spacesConfig

    this.hotPointTextureUrl = hotPointTextureUrl || 'picture/hotpot.png'
    this.centerPointTextureUrl = centerPointTextureUrl || 'picture/center.png'

    this.tipContainer = tipContainer

    // 为 mesh 添加事件支持
    addListenerToThreeObject(() => {
      return {
        camera: this.camera,
        scene: this.scene,
        renderer: this.renderer
      }
    })

    // 初始化切换到第一个空间
    this.switchSpace(spacesConfig[0]?.spaceId)
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

    return () => {
      window.removeEventListener('resize', resizeFn)
    }
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
   */
  public switchSpace(id?: string | undefined) {
    const targetSpaceId = String(id || this.spacesConfig[0].spaceId || '')
    const spaceConfig = this.spacesConfig.find(item => String(item.spaceId || '') === String(targetSpaceId))
    if (!spaceConfig) return

    const {cameraPosition, hotPoints = [], cubeSpaceTextureUrls, tips = []} = spaceConfig

    // 调整相机位置
    this.camera.position.set(cameraPosition?.x ?? 0, cameraPosition?.y ?? 0, cameraPosition?.z ?? 0)

    // 场景元素列表
    const sceneChildren: THREE.Object3D[] = []

    // 创建小白点
    const hotPointMeshes = hotPoints.map(hotPoint => {
      const mesh = this.createHotPointMesh(hotPoint)
      mesh.userData.spaceId = targetSpaceId
      return mesh
    })
    sceneChildren.push(...hotPointMeshes)

    // 创建提示精灵
    if (this.tipContainer) {
      const tipSprites = tips.map(tip => {
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

    // 把场景元素列表添加到场景
    this.scene.add(...sceneChildren)
  }

  /**
   * 创建正方体空间 mesh
   */
  public createCubeSpaceMesh(cubeSpaceTextureUrls: CubeSpaceTextureUrls) {
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
  public createCubeSpaceMaterials(cubeSpaceTextureUrls: CubeSpaceTextureUrls) {
    const directions = ['right', 'left', 'top', 'bottom', 'front', 'back'] as const
    const boxMaterials: THREE.MeshBasicMaterial[] = directions.map(direction => {
      const texture = new THREE.TextureLoader().load(
        cubeSpaceTextureUrls[direction as keyof typeof cubeSpaceTextureUrls]
      )
      return new THREE.MeshBasicMaterial({map: texture})
    })
    return boxMaterials
  }

  /**
   * 渲染
   */
  public render() {
    requestAnimationFrame(this.render.bind(this))
    this.handleUpdate()
    TWEEN.update()
  }

  /**
   * 每次渲染更新时执行一些东西
   */
  private handleUpdate() {
    this.emit('update')
    this.updateCenterPointMesh()
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
    const camera = new THREE.PerspectiveCamera(75, this.containerWidth / this.containerHeight, 0.01, 10000)
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
    renderer.setClearColor(0xffffff, 1)
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.setSize(this.containerWidth, this.containerHeight)
    return renderer
  }

  /**
   * 创建控制器
   * @returns 返回控制器
   */
  private createControls() {
    const controls = new OrbitControls(this.camera, this.renderer.domElement)
    controls.listenToKeyEvents(window)
    // controls.autoRotate = false
    // controls.dampingFactor = 0.05
    controls.enableZoom = true
    controls.enableDamping = true
    controls.enablePan = true
    controls.enableRotate = true
    controls.minDistance = 1
    controls.maxDistance = 100
    // controls.maxPolarAngle = Math.PI / 2
    // controls.screenSpacePanning = false
    return controls
  }

  /**
   * 创建白点用于点击跳转场景
   * @param hotPoint 小白点配置
   * @returns 返回小白点 mesh
   */
  private createHotPointMesh(hotPoint: HotPoint) {
    const {position, scale, targetSpaceId} = hotPoint
    const geometry = new THREE.CircleGeometry(4, 20, 0, 2 * Math.PI)
    geometry.scale(scale?.x ?? -1, scale?.y ?? 1, scale?.z ?? 1)
    const hotPointMesh = new THREE.Mesh(
      geometry,
      new THREE.MeshBasicMaterial({
        map: new THREE.TextureLoader().load(this.hotPointTextureUrl),
        transparent: true
      })
    )

    hotPointMesh.rotation.x = Math.PI / 2
    hotPointMesh.position.set(position.x, position.y, position.z)

    hotPointMesh.addEventListener('click', () => {
      console.log('调转到空间', targetSpaceId)
      this.switchSpace(targetSpaceId)
    })

    return hotPointMesh
  }

  /**
   * 创建提示精灵
   * @param tip 单个提示配置
   * @returns 返回提示精灵
   */
  public createTipSprite(tip: Tip, tipContainer: HTMLElement) {
    const {position, textureUrl = 'picture/tip.png', scale, ...otherTipInfo} = tip
    const texture = new THREE.TextureLoader().load(textureUrl)
    const material = new THREE.SpriteMaterial({map: texture})
    const sprite = new THREE.Sprite(material)
    sprite.scale.set(scale?.x ?? 3, scale?.y ?? 3, scale?.z ?? 3)
    sprite.position.set(position.x, position.y, position.z)
    sprite.userData = otherTipInfo
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

    sprite.addEventListener('mouseout', e => {
      console.log('隐藏提示', {tip})
      this.emit('hideTip', {
        tip
      })
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
          map: new THREE.TextureLoader().load(this.centerPointTextureUrl),
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
}
