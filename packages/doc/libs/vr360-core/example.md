# 示例

## 效果

<br/>
<DemoA></DemoA>

### vue2 实现

::: demo vue2 -- vue2 示例代码 -- 这里是示例代码的描述

```vue src/Example.vue
<template>
  <div class="relative bg-white w-100vw h-100vh overflow-hidden flex flex-col">
    <div
      ref="tipRef"
      class="tip absolute top-0 left-0 z-99 rounded-4px cursor-pointer z-99 p-4 flex flex-col w-240px h-60px justify-center bg-black bg-op-50 text-white"
      :style="{
        transform: `translate(${tip.left}px, ${tip.top + 50}px)`,
        zIndex: tip.show ? 99 : -1
      }"
    >
      <div class="tip-title font-bold">{{ tip.title }}</div>
      <div class="tip-content">{{ tip.content }}</div>
    </div>
    <div ref="containerRef" class="w-full h-full"></div>
    <div class="w-full h-100px flex items-center">
      <div
        v-for="space in spacesConfig"
        :key="space.id"
        class="w-140px h-70px rounded-4px cursor-pointer ml-4"
        @click="handleSwitchSpace(space)"
      >
        <img class="w-full h-full object-cover rounded-4px" :src="space.cubeSpaceTextureUrls.left" />
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import {Vr360} from '@nicepkg/vr360-core'
import {spacesConfig} from './vr360-config'

export default {
  data() {
    return {
      vr360: null as InstanceType<typeof Vr360> | null,
      spacesConfig,
      tip: {
        top: 0,
        left: 0,
        title: '',
        content: '',
        show: false
      }
    }
  },
  mounted() {
    this.vr360 = new Vr360({
      container: this.$refs.containerRef!,
      tipContainer: this.$refs.tipRef!,
      spacesConfig: this.spacesConfig
    })

    this.vr360.controls.autoRotate = true

    this.vr360.render()

    this.vr360.listenResize()

    this.vr360.on('showTip', e => {
      this.vr360!.controls.autoRotate = false
      const {top, left, tip} = e
      this.tip = {
        top,
        left,
        title: tip.content.title,
        content: tip.content.text,
        show: true
      }
    })

    this.vr360.on('hideTip', () => {
      this.vr360!.controls.autoRotate = true
      this.tip.show = false
    })
  },
  destroy() {
    this.vr360?.destroy?.()
  },
  methods: {
    handleSwitchSpace(space: SpaceConfig) {
      this.vr360?.switchSpace?.(space.id)
    }
  }
}
</script>
```

:::

### vue3 实现

::: demo vue3 -- vue3 示例代码 -- 这里是示例代码的描述

```vue src/Example.vue
<template>
  <div class="relative bg-white w-100vw h-100vh overflow-hidden flex flex-col">
    <div
      ref="tipRef"
      class="tip absolute left-0 top-0 rounded-4px cursor-pointer z-99 p-4 flex flex-col w-240px h-60px justify-center bg-black bg-op-50 text-white"
      :style="{
        transform: `translate(${tipLeft}px, ${tipTop + 50}px)`,
        zIndex: showTip ? 99 : -1
      }"
    >
      <div class="tip-title font-bold">{{ tipTitle }}</div>
      <div class="tip-content">{{ tipContent }}</div>
    </div>
    <div ref="containerRef" class="w-full h-full"></div>
    <div class="w-full h-100px flex items-center">
      <div
        v-for="space in spacesConfig"
        :key="space.id"
        class="w-140px h-70px rounded-4px cursor-pointer ml-4"
        @click="handleSwitchSpace(space)"
      >
        <img class="w-full h-full object-cover rounded-4px" :src="space.cubeSpaceTextureUrls.left" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {onMounted, onUnmounted, ref} from 'vue'
import {Vr360} from '@nicepkg/vr360-core'
import {spacesConfig} from './vr360-config'

const containerRef = ref<HTMLElement>()

const tipRef = ref<HTMLElement>()
const tipLeft = ref(0)
const tipTop = ref(0)
const showTip = ref(false)
const tipTitle = ref('')
const tipContent = ref('')

let vr360: InstanceType<typeof Vr360>

function handleSwitchSpace(space: SpaceConfig) {
  vr360.switchSpace(space.id)
}

onMounted(() => {
  vr360 = new Vr360({
    container: containerRef.value!,
    tipContainer: tipRef.value!,
    spacesConfig
  })

  vr360.controls.autoRotate = true

  vr360.render()

  vr360.listenResize()

  vr360.on('showTip', e => {
    vr360!.controls.autoRotate = false
    const {top, left, tip} = e
    showTip.value = true
    tipLeft.value = left
    tipTop.value = top
    tipTitle.value = tip.content.title
    tipContent.value = tip.content.text
  })

  vr360.on('hideTip', () => {
    vr360!.controls.autoRotate = true
    showTip.value = false
  })
})

onUnmounted(() => {
  vr360?.destroy?.()
})
</script>
```

:::

### react 实现

::: demo react -- react 示例代码 -- 这里是示例代码的描述

```tsx src/Example.tsx
import {useEffect, useState, useRef} from 'react'
import {Vr360} from '@nicepkg/vr360-core'
import type {SpaceConfig} from '@nicepkg/vr360-core'
import {spacesConfig} from './vr360-config'

function Example() {
  const containerRef = useRef<HTMLDivElement>(null)
  const tipRef = useRef<HTMLDivElement>(null)
  const [tipLeft, setTipLeft] = useState(0)
  const [tipTop, setTipTop] = useState(0)
  const [showTip, setShowTip] = useState(false)
  const [tipTitle, setTipTitle] = useState('')
  const [tipContent, setTipContent] = useState('')
  const [vr360, setVr360] = useState<InstanceType<typeof Vr360>>()

  useEffect(() => {
    setVr360(
      new Vr360({
        container: containerRef.current!,
        tipContainer: tipRef.current!,
        spacesConfig
      })
    )

    return () => {
      vr360?.destroy?.()
    }
  }, [])

  useEffect(() => {
    if (vr360) {
      vr360.controls.autoRotate = true

      vr360.render()

      vr360.listenResize()

      vr360.on('showTip', e => {
        vr360!.controls.autoRotate = false
        const {top, left, tip} = e
        setShowTip(true)
        setTipLeft(left)
        setTipTop(top)
        setTipTitle(tip.content.title)
        setTipContent(tip.content.text)
      })

      vr360.on('hideTip', () => {
        vr360!.controls.autoRotate = true
        setShowTip(false)
      })
    }
  }, [vr360])

  function handleSwitchSpace(space: SpaceConfig) {
    vr360?.switchSpace?.(space.id)
  }

  return (
    <div className="relative bg-white w-100vw h-100vh overflow-hidden flex flex-col">
      <div
        ref={tipRef}
        className="tip absolute top-0 left-0 rounded-4px cursor-pointer z-99 p-4 flex flex-col w-240px h-60px justify-center bg-black bg-op-50 text-white"
        style={{
          transform: `translate(${tipLeft}px, ${tipTop + 50}px)`,
          zIndex: showTip ? 99 : -1
        }}
      >
        <div className="tip-title font-bold">{tipTitle}</div>
        <div className="tip-content">{tipContent}</div>
      </div>
      <div ref={containerRef} className="w-full h-full"></div>
      <div className="w-full h-100px flex items-center">
        {spacesConfig.map(space => (
          <div
            key={space.id}
            className="w-140px h-70px rounded-4px cursor-pointer ml-4"
            onClick={() => handleSwitchSpace(space)}
          >
            <img className="w-full h-full object-cover rounded-4px" src={space.cubeSpaceTextureUrls.left} />
          </div>
        ))}
      </div>
    </div>
  )
}

export default Example
```

:::

### 原生实现

::: demo html -- html 示例代码 -- 这里是示例代码的描述

```html index.html
<!DOCTYPE html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <title>Html App</title>
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover"
    />
    <script src="https://unpkg.com/three@0.145.0/build/three.min.js"></script>
    <script src="https://unpkg.com/@nicepkg/vr360-core@0.2.1/dist/index.min.umd.js"></script>
    <style>
      * {
        padding: 0;
        margin: 0;
        box-sizing: border-box;
      }
      .demo {
        position: relative;
        display: flex;
        flex-direction: column;
        width: 100vw;
        height: 100vh;
        overflow: hidden;
        background: #fff;
      }

      .demo-tip {
        display: flex;
        position: absolute;
        z-index: -1;
        top: 0;
        left: 0;
        flex-direction: column;
        justify-content: center;
        width: 240px;
        height: 60px;
        padding: 4px;
        color: #fff;
        cursor: pointer;
        background-color: rgba(0, 0, 0, 0.5);
        border-radius: 4px;
      }

      .demo-tip-title {
        font-weight: bold;
      }

      .demo-container {
        width: 100%;
        height: 100%;
      }

      .demo-bottom-bar {
        display: flex;
        align-items: center;
        width: 100%;
        height: 100px;
      }

      .demo-bottom-card {
        width: 140px;
        height: 70px;
        margin-left: 1rem;
        cursor: pointer;
        background-repeat: no-repeat;
        background-size: cover;
        border-radius: 4px;
      }
    </style>
  </head>
  <body>
    <div class="demo">
      <div class="demo-tip">
        <div class="demo-tip-title"></div>
        <div class="demo-tip-content"></div>
      </div>
      <div class="demo-container"></div>
      <div class="demo-bottom-bar"></div>
    </div>
    <script>
      const {Vr360} = Vr360Core
      const container = document.querySelector('.demo-container')
      const tip = document.querySelector('.demo-tip')
      const tipTitle = document.querySelector('.demo-tip-title')
      const tipContent = document.querySelector('.demo-tip-content')
      const bottomBar = document.querySelector('.demo-bottom-bar')

      const spacesConfig = [
        {
          id: 'roomA',
          camera: {
            position: {
              x: 0,
              y: 0,
              z: 0
            }
          },
          tips: [
            {
              id: '1',
              position: {x: 0, y: -10, z: 40},
              content: {
                title: '豪华跑车',
                text: '比奥迪还贵的豪华跑车'
              }
            },
            {
              id: '2',
              textureUrl:
                'https://m.360buyimg.com/babel/jfs/t1/125314/12/31594/6260/6339b149E14068522/5c0d35a3e149936a.png',
              targetSpaceId: 'roomB',
              position: {x: -10, y: -4, z: 40},
              content: {
                title: '去客厅',
                text: '一起去尊贵的客厅吧'
              }
            }
          ],
          cubeSpaceTextureUrls: {
            back: 'https://m.360buyimg.com/babel/jfs/t1/40814/31/19646/41953/63398297E0707fe35/4e831e60cf579899.jpg',
            down: 'https://m.360buyimg.com/babel/jfs/t1/43941/23/19369/84038/633982d7E838acd9a/9e7a89cc910d3409.jpg',
            front: 'https://m.360buyimg.com/babel/jfs/t1/150573/35/27827/113528/633982faE8556c0c0/b455284fd91885c6.jpg',
            left: 'https://m.360buyimg.com/babel/jfs/t1/189204/25/29491/61430/63398310E3c180e43/26d9b459cf714f9f.jpg',
            right: 'https://m.360buyimg.com/babel/jfs/t1/184948/34/28448/131232/63398323E61ff80fb/89ab84eda0421260.jpg',
            up: 'https://m.360buyimg.com/babel/jfs/t1/86258/24/33602/70616/63398334Ea2dcf448/e2f5c275792fb3d6.jpg'
          }
        },
        {
          id: 'roomB',
          camera: {
            position: {
              x: 0,
              y: 0,
              z: 0
            }
          },
          tips: [
            {
              id: '3',
              position: {x: -2, y: -25, z: 40},
              content: {
                title: '香奈儿垃圾桶',
                text: '里面装着主人不用的奢侈品'
              }
            },
            {
              id: '4',
              position: {x: -20, y: 0, z: 40},
              content: {
                title: '宇宙牌冰箱',
                text: '装着超级多零食'
              }
            },
            {
              id: '5',
              textureUrl:
                'https://m.360buyimg.com/babel/jfs/t1/125314/12/31594/6260/6339b149E14068522/5c0d35a3e149936a.png',
              targetSpaceId: 'roomA',
              position: {
                x: -8,
                y: 0,
                z: -40
              },
              content: {
                title: '去门口',
                text: '一起去门口吧'
              }
            }
          ],
          cubeSpaceTextureUrls: {
            back: 'https://m.360buyimg.com/babel/jfs/t1/48117/28/21445/120448/63398366Ede81497b/a46e362df5f7d0ed.jpg',
            down: 'https://m.360buyimg.com/babel/jfs/t1/101209/24/26762/106253/63398376Eedb0db22/4f335c4ecd72ad74.jpg',
            front: 'https://m.360buyimg.com/babel/jfs/t1/154056/6/26449/110652/63398388E8ecda044/22e1646534839a95.jpg',
            left: 'https://m.360buyimg.com/babel/jfs/t1/198990/28/28201/74687/6339839aE28806a5e/43b311d3379397df.jpg',
            right: 'https://m.360buyimg.com/babel/jfs/t1/209711/14/25233/92186/633983b0E8f4df687/750ba84061ea64a6.jpg',
            up: 'https://m.360buyimg.com/babel/jfs/t1/186545/35/29054/29678/633983c2E72ef4848/92043b945a03fc29.jpg'
          }
        }
      ]

      const vr360 = new Vr360({
        container,
        tipContainer: tip,
        spacesConfig
      })

      vr360.controls.autoRotate = true

      vr360.render()

      vr360.listenResize()

      vr360.on('showTip', e => {
        vr360.controls.autoRotate = false
        const {top, left} = e
        Object.assign(tip.style, {
          transform: `translate(${left}px, ${top + 50}px)`,
          zIndex: 99
        })
        tip.style.t
        tipTitle.innerText = e.tip.content.title
        tipContent.innerText = e.tip.content.text
      })

      vr360.on('hideTip', () => {
        vr360.controls.autoRotate = true
        tip.style.zIndex = -1
      })

      window.addEventListener('unload', () => {
        vr360.destroy()
      })

      function handleSwitchSpace(space) {
        vr360.switchSpace(space.id)
      }

      bottomBar.append(
        ...spacesConfig.map(space => {
          const card = document.createElement('div')
          card.className = 'demo-bottom-card'
          Object.assign(card.style, {
            backgroundImage: `url(${space.cubeSpaceTextureUrls.left})`
          })
          card.addEventListener('click', () => {
            handleSwitchSpace(space)
          })
          return card
        })
      )
    </script>
  </body>
</html>
```

:::
