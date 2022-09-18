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
  events: Array<keyof HTMLElementEventMap> = ['click', 'mouseover', 'mouseout']
) {
  const renderElement = getDeps().renderer?.domElement
  if (!renderElement) return
  const raycaster = new THREE.Raycaster()
  const mouse = new THREE.Vector2()

  function handleMouseDown(eventName: string, event: MouseEvent) {
    event.preventDefault()
    const {camera, scene, renderer} = getDeps()
    if (!camera || !scene || !renderer) return

    mouse.x = (event.clientX / renderer.domElement.clientWidth) * 2 - 1
    mouse.y = -(event.clientY / renderer.domElement.clientHeight) * 2 + 1

    raycaster.setFromCamera(mouse, camera)

    const intersects = raycaster.intersectObjects(scene.children)

    if (intersects.length > 0) {
      intersects[0]?.object?.dispatchEvent?.({type: eventName})
    }
  }

  events.forEach(eventName => {
    renderElement.addEventListener(eventName, event => handleMouseDown(eventName, event as MouseEvent))
  })
}

export interface Vr360Events {
  /**
   * 每帧更新回调
   */
  update: () => void
}

export interface Position {
  x: number
  y: number
  z: number
}

export interface HotPoint {
  position: Position
  targetSpaceId: string
}

export interface SpaceConfig {
  id: string
  centerPosition: Position
  hotPoints: HotPoint[]
  textureUrls: {
    left: string
    right: string
    top: string
    bottom: string
    front: string
    back: string
  }
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
   * 空间配置
   */
  spacesConfig: SpaceConfig[]
}

export class Vr360 extends EventEmitter<Vr360Events> {
  public container: HTMLElement
  public camera: THREE.PerspectiveCamera
  public scene: THREE.Scene
  public renderer: THREE.WebGLRenderer
  public controls: OrbitControls

  public hotPointMeshes: THREE.Mesh[] = []
  public hotPointTextureUrl: string

  public centerPointMesh!: THREE.Mesh
  public centerPointTextureUrl: string

  public get containerWidth() {
    return this.container.clientWidth
  }

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
    const {container, hotPointTextureUrl, centerPointTextureUrl, spacesConfig} = options

    this.container = container
    this.updateContainerSize()
    this.camera = this.createCamera()
    this.scene = this.createScene()
    this.renderer = this.createRenderer()
    this.controls = this.createControls()
    this.container.appendChild(this.renderer.domElement)

    this.hotPointTextureUrl = hotPointTextureUrl || 'picture/hotpot.png'
    this.centerPointTextureUrl = centerPointTextureUrl || 'picture/center.png'

    // 为 mesh 添加事件支持
    addListenerToThreeObject(() => {
      return {
        camera: this.camera,
        scene: this.scene,
        renderer: this.renderer
      }
    })

    this.setSpacesConfig(spacesConfig)
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
   * 设置 space config
   */
  public setSpacesConfig(spacesConfig: SpaceConfig[], spaceId?: string | undefined) {
    const currentSpaceId = spaceId || spacesConfig[0].id
    spacesConfig.map(spaceConfig => {
      const {id, centerPosition, hotPoints = [], textureUrls = []} = spaceConfig
      if (id !== currentSpaceId) return

      // 调整相机位置
      this.camera.position.set(centerPosition.x, centerPosition.y, centerPosition.z)

      // 创建小白点
      const hotPointMeshes = hotPoints.map(hotPoint => {
        return this.createHotPointMesh(
          hotPoint.position.x,
          hotPoint.position.y,
          hotPoint.position.z,
          hotPoint.targetSpaceId
        )
      })

      this.scene.add(...hotPointMeshes)

      // 创建空间
      const boxGeometry = new THREE.BoxGeometry(100, 100, 100)

      // 随机挑选一个面翻转扩大，使得贴图能够正常渲染
      boxGeometry.scale(-1, 1, 1)

      const boxMaterials: THREE.MeshBasicMaterial[] = []
      const directions = ['right', 'left', 'top', 'bottom', 'front', 'back'] as const
      directions.map(direction => {
        const texture = new THREE.TextureLoader().load(textureUrls[direction as keyof typeof textureUrls])
        boxMaterials.push(new THREE.MeshBasicMaterial({map: texture}))
      })
      const spaceMesh = new THREE.Mesh(boxGeometry, boxMaterials)

      this.scene.add(spaceMesh)
    })
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
   * @param x x 坐标
   * @param y y 坐标
   * @param z z 坐标
   * @param targetSpaceId 跳转的空间 id
   */
  private createHotPointMesh(x: number, y: number, z: number, targetSpaceId: string | undefined) {
    const geometry = new THREE.CircleGeometry(4, 20, 0, 2 * Math.PI)
    geometry.scale(-1, 1, 1)
    const hotPointMesh = new THREE.Mesh(
      geometry,
      new THREE.MeshBasicMaterial({
        map: new THREE.TextureLoader().load(this.hotPointTextureUrl),
        transparent: true
      })
    )

    hotPointMesh.rotation.x = Math.PI / 2
    hotPointMesh.position.set(x, y, z)

    hotPointMesh.addEventListener('click', () => {
      console.log('调转到空间', targetSpaceId)
    })

    return hotPointMesh
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
