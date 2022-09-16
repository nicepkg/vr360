<template>
  <div>
    <div id="container"></div>
  </div>
</template>

<script setup lang="ts">
/* eslint-disable import/no-named-as-default-member */
import * as THREE from 'three'
import TWEEN from '@tweenjs/tween.js'
import {onMounted} from 'vue'

onMounted(() => {
  let container: HTMLElement
  let camera: THREE.PerspectiveCamera
  let scene: THREE.Scene
  let renderer: THREE.WebGLRenderer
  let mesh_living: THREE.Mesh
  let mesh_circle: THREE.Mesh
  let mesh_center: THREE.Mesh
  let geometry_living: THREE.BoxGeometry
  let geometry_circle: THREE.CircleGeometry
  let geometry_center: THREE.CircleGeometry

  let isUserInteracting = false //用户是否交互
  let onPointerDownPointerX = 0
  let onPointerDownPointerY = 0 //鼠标点击的位置
  let lon = 90
  let phi = 0
  let onPointerDownLon = 0 //经度
  let lat = 0
  let onPointerDownLat = 0 //维度
  let theta = 0 //计算相机的位置
  let target = new THREE.Vector3() //三维向量
  let time = 0

  let materialArray: THREE.ShaderMaterial[] = []
  //定义盒子的材质，采用自定义着色器
  let texturesArray: THREE.Texture[] = []
  texturesArray.push(new THREE.TextureLoader().load('picture/FirstHousing/door/right.jpeg'))
  texturesArray.push(new THREE.TextureLoader().load('picture/FirstHousing/door/left.jpeg'))
  texturesArray.push(new THREE.TextureLoader().load('picture/FirstHousing/door/top.jpeg'))
  texturesArray.push(new THREE.TextureLoader().load('picture/FirstHousing/door/bottom.jpeg'))
  texturesArray.push(new THREE.TextureLoader().load('picture/FirstHousing/door/front.jpeg'))
  texturesArray.push(new THREE.TextureLoader().load('picture/FirstHousing/door/back.jpeg'))
  texturesArray.push(new THREE.TextureLoader().load('picture/FirstHousing/living-room/right.jpeg'))
  texturesArray.push(new THREE.TextureLoader().load('picture/FirstHousing/living-room/left.jpeg'))
  texturesArray.push(new THREE.TextureLoader().load('picture/FirstHousing/living-room/top.jpeg'))
  texturesArray.push(new THREE.TextureLoader().load('picture/FirstHousing/living-room/bottom.jpeg'))
  texturesArray.push(new THREE.TextureLoader().load('picture/FirstHousing/living-room/front.jpeg'))
  texturesArray.push(new THREE.TextureLoader().load('picture/FirstHousing/living-room/back.jpeg'))

  const vertexShader = `
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
}
`

  const fragmentShader = `
// 声明一个纹理对象变量
uniform sampler2D texture1;
uniform sampler2D texture2;
uniform float time;
// 顶点片元化后有多少个片元就有多少个纹理坐标数据 vUv
varying vec2 vUv;
void main() {
    //内置函数texture2D通过纹理坐标vUv获得贴图texture的像素值
    // gl_FragColor = texture2D( texture1, vUv );
    gl_FragColor = mix(texture2D( texture1, vUv ),texture2D( texture2, vUv ), time);
  }
`

  //初始化函数
  function init() {
    container = document.getElementById('container')!
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.01, 10000) //相机初试位置
    camera.position.set(0, 0, 0)

    scene = new THREE.Scene()

    //定义盒子模型的骨架
    geometry_living = new THREE.BoxGeometry(100, 100, 100) //设置正方体和骨架分段数
    //定义行走点的骨架
    geometry_circle = new THREE.CircleGeometry(4, 20, 0, 2 * Math.PI)

    geometry_center = new THREE.CircleGeometry(12, 40, 0, 2 * Math.PI)
    //随机挑选一个面翻转扩大，使得贴图能够正常渲染
    geometry_living.scale(-1, 1, 1)
    geometry_circle.scale(-1, 1, 1)
    geometry_center.scale(-1, 1, 1)

    //渲染六个面
    time = 0
    for (let i = 0; i < 6; i++) {
      materialArray.push(
        new THREE.ShaderMaterial({
          uniforms: {
            texture1: {
              value: texturesArray[i]
            },
            //用于渐变的纹理
            texture2: {
              value: texturesArray[6 + i]
            },
            time: {
              value: time
            }
          },
          // 顶点着色器
          vertexShader,
          // 片元着色器
          fragmentShader,
          side: THREE.DoubleSide
        })
      )
    }

    //定义盒子的网格
    mesh_living = new THREE.Mesh(geometry_living, materialArray) //为骨架贴上贴图

    mesh_living.position.set(0, 0, 0)

    //定义白点的材质
    mesh_circle = new THREE.Mesh(
      geometry_circle,
      new THREE.MeshBasicMaterial({
        map: new THREE.TextureLoader().load('picture/hotpot.png'),
        transparent: true
      })
    )
    mesh_circle.rotation.x = Math.PI / 2
    mesh_circle.position.set(-10, -25, 40)

    mesh_center = new THREE.Mesh(
      geometry_center,
      new THREE.MeshBasicMaterial({
        map: new THREE.TextureLoader().load('picture/center.png'),
        transparent: true,
        opacity: 0.4
      })
    )
    mesh_center.rotation.x = Math.PI / 2
    mesh_center.rotation.z = Math.PI
    mesh_center.position.set(camera.position.x, camera.position.y - 20, camera.position.z)
    scene.add(mesh_living)

    scene.add(mesh_circle)

    scene.add(mesh_center)

    //定义渲染器
    renderer = new THREE.WebGLRenderer({
      antialias: true
    })
    renderer.setClearColor(0xffffff, 1)
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.setSize(window.innerWidth, window.innerHeight)
    container?.appendChild(renderer.domElement) //body元素中插入canvas对象

    document.addEventListener('click', mouseClickEvent, false)
    document.addEventListener('mousedown', mouseMoveEvent, false)
    //添加电脑事件
    document.addEventListener('mousedown', onDocumentMouseDown, false)
    document.addEventListener('mousemove', onDocumentMouseMove, false)
    document.addEventListener('mouseup', onDocumentMouseUp, false)
    document.addEventListener('wheel', onDocumentMouseWheel, false)
    //添加手机事件
    document.addEventListener('touchstart', onDocumentTouchStart, {passive: false})
    document.addEventListener('touchmove', onDocumentTouchMove, {passive: false})
    document.addEventListener('touchend', onDocumentTouchEnd, {passive: false})
    document.addEventListener('touchstart', mouseMoveEvent, {passive: false})
    document.addEventListener('touchstart', mouseClickEvent, {passive: false})
    //刷新按钮，页面重置后的事件
    window.addEventListener('resize', onWindowResize, false)

    // container.addEventListener('click', mouseClickEvent, false);
    // container.addEventListener('mousemove', mouseMoveEvent, false);
    // //添加电脑事件
    // document.addEventListener('mousedown',onDocumentMouseDown,false);
    // document.addEventListener('mousemove',onDocumentMouseMove,false);
    // document.addEventListener('mouseup',onDocumentMouseUp,false);
    // document.addEventListener('wheel',onDocumentMouseWheel,false);
    // //添加手机事件
    // document.addEventListener('touchstart',onDocumentTouchStart,{passive:false});
    // document.addEventListener('touchmove',onDocumentTouchMove,{passive:false});
    // document.addEventListener('touchstart',mouseMoveEvent,{passive:false});
    // document.addEventListener('touchstart',mouseClickEvent,{passive:false});
    // //刷新按钮，页面重置后的事件
    // window.addEventListener('resize',onWindowResize,false);
  }

  var mouse = new THREE.Vector2()
  function mouseMoveEvent(event: MouseEvent | TouchEvent) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const isTouchEvent = (v: any): v is TouchEvent => Boolean(v.touches)
    if (isTouchEvent(event)) {
      mouse.width = (event.touches[0].pageX / container.clientWidth) * 2 - 1
      mouse.height = -(event.touches[0].pageY / container.clientHeight) * 2 + 1
    } else {
      mouse.width = (event.clientX / container.clientWidth) * 2 - 1
      mouse.height = -(event.clientY / container.clientHeight) * 2 + 1
    }
  }

  type Move = {
    mix: number
    s_x: number
    s_y: number
    s_z: number
  }
  function mouseClickEvent(event: MouseEvent | TouchEvent) {
    event.preventDefault()
    // 射线捕捉
    let raycaster = new THREE.Raycaster()
    raycaster.setFromCamera(mouse, camera)
    let intersects = raycaster.intersectObjects([mesh_circle])
    let move_begin: Move = {
      mix: 0,
      s_x: 1.5,
      s_y: 1.5,
      s_z: 3
    }
    let move_end: Move = {
      mix: 1,
      s_x: 1,
      s_y: 1,
      s_z: 1
    }
    if (intersects.length > 0) {
      if (mesh_circle.position.z > 0) {
        mesh_circle.position.set(-10, -25, -40)
        move_begin.mix = 0
        move_end.mix = 1
        ChangeScene(move_begin, move_end)
      } else if (mesh_circle.position.z < 0) {
        mesh_circle.position.set(-10, -25, 40)
        move_begin.mix = 1
        move_end.mix = 0
        ChangeScene(move_begin, move_end)
      }
    }
    setTimeout(function () {
      isUserInteracting = false
      console.log('我执行了！')
    }, 1000)
  }

  //切换函数
  function ChangeScene(move_begin: Move, move_end: Move) {
    mesh_living.scale.set(1.5, 1.5, 3)
    new TWEEN.Tween(move_begin)
      .to(move_end, 1000)
      .easing(TWEEN.Easing.Quadratic.Out)
      .onUpdate(function () {
        isUserInteracting = true
        mesh_living.scale.set(move_begin.s_x, move_begin.s_y, move_begin.s_z)
        time = move_begin.mix
        console.log('time', time)
        if (time < 1) {
          for (let i = 0; i < 6; i++) {
            materialArray[i].uniforms.time.value = time
          }
        } else {
          isUserInteracting = false
          mesh_center.position.set(camera.position.x, camera.position.y - 20, camera.position.z)
          console.log('动画执行完毕！')
        }
      })
      .start()
  }
  function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
  }

  function onDocumentMouseDown(event: MouseEvent) {
    event.preventDefault()
    isUserInteracting = true
    onPointerDownPointerX = event.clientX
    onPointerDownPointerY = event.clientY

    onPointerDownLon = lon
    onPointerDownLat = lat
  }
  function onDocumentMouseMove(event: MouseEvent) {
    if (isUserInteracting === true) {
      lon = (onPointerDownPointerX - event.clientX) * 0.1 + onPointerDownLon
      lat = (event.clientY - onPointerDownPointerY) * 0.1 + onPointerDownLat
    }
  }
  function onDocumentMouseUp() {
    isUserInteracting = false
  }
  function onDocumentMouseWheel(event: WheelEvent) {
    var fov = camera.fov + event.deltaY * 0.05

    camera.fov = THREE.MathUtils.clamp(fov, 10, 75)

    camera.updateProjectionMatrix()
  }
  function onDocumentTouchStart(event: TouchEvent) {
    if (event.touches.length == 1) {
      isUserInteracting = true
      event.preventDefault()

      onPointerDownPointerX = event.touches[0].pageX
      onPointerDownPointerY = event.touches[0].pageY

      onPointerDownLon = lon
      onPointerDownLat = lat
    }
  }
  function onDocumentTouchEnd() {
    isUserInteracting = false
  }
  function onDocumentTouchMove(event: TouchEvent) {
    if (event.touches.length == 1) {
      event.preventDefault()

      lon = (onPointerDownPointerX - event.touches[0].pageX) * 0.1 + onPointerDownLon
      lat = (event.touches[0].pageY - onPointerDownPointerY) * 0.1 + onPointerDownLat
    }
  }
  function animate() {
    requestAnimationFrame(animate)
    update()
    TWEEN.update()
  }
  function update() {
    if (isUserInteracting === false) {
      lon += 0.1
    }

    lat = Math.max(-45, Math.min(85, lat))
    phi = THREE.MathUtils.degToRad(90 - lat)
    theta = THREE.MathUtils.degToRad(lon)

    target.x = 500 * Math.sin(phi) * Math.cos(theta)
    target.y = 500 * Math.cos(phi)
    target.z = 500 * Math.sin(phi) * Math.sin(theta)

    camera.lookAt(target)

    renderer.render(scene, camera)
  }
  init()
  animate()
})
</script>

<style scoped></style>
