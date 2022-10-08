<template>
  <div class="demo">
    <!-- 提示 -->
    <div
      ref="tipRef"
      class="demo-tip"
      :style="{
        transform: `translate(${tip.left}px, ${tip.top + 50}px)`,
        zIndex: tip.show ? 99 : -1
      }"
    >
      <!-- 提示标题 -->
      <div class="demo-tip-title">{{ tip.title }}</div>

      <!-- 提示内容 -->
      <div class="demo-tip-content">{{ tip.content }}</div>
    </div>

    <!-- 360全景容器 -->
    <div ref="containerRef" class="demo-container"></div>

    <!-- 底部切换场景 -->
    <div class="demo-bottom-bar">
      <div
        v-for="space in spacesConfig"
        :key="space.id"
        class="demo-bottom-card"
        @click="handleSwitchSpace(space)"
        :style="{
          backgroundImage: `url(${space.cubeSpaceTextureUrls.left})`
        }"
      ></div>
    </div>
  </div>
</template>
<script lang="ts">
import {Vr360} from '@nicepkg/vr360-core'
import type {SpaceConfig} from '@nicepkg/vr360-core'

export default {
  data() {
    // 全景空间配置
    const spacesConfig: SpaceConfig[] = [
      {
        id: 'spaceA', // 空间 id，用于切换空间，必须唯一
        tips: [
          // 提示，可选
          {
            id: '1', // 提示 id，用于缓存，在当前 tips 数组里要唯一，必须
            position: {x: 0, y: -10, z: 40}, // 提示位置，必须
            content: {
              // 提示内容，在 showTip 事件会暴露，要包含什么你自己决定。
              title: '豪华跑车',
              text: '比奥迪还贵的豪华跑车'
            }
          },
          {
            id: '2',
            // 自定义提示图标贴图，可选
            textureUrl:
              'https://m.360buyimg.com/babel/jfs/t1/125314/12/31594/6260/6339b149E14068522/5c0d35a3e149936a.png',
            targetSpaceId: 'spaceB', // 提示点击后跳转的空间 id，可选
            position: {x: -10, y: -4, z: 40},
            content: {
              title: '去客厅',
              text: '一起去尊贵的客厅吧'
            }
          }
        ],
        cubeSpaceTextureUrls: {
          // 立方体贴图，分别为：背侧、下侧、前侧、左侧、右侧、上侧，必须
          back: 'https://m.360buyimg.com/babel/jfs/t1/40814/31/19646/41953/63398297E0707fe35/4e831e60cf579899.jpg',
          down: 'https://m.360buyimg.com/babel/jfs/t1/43941/23/19369/84038/633982d7E838acd9a/9e7a89cc910d3409.jpg',
          front: 'https://m.360buyimg.com/babel/jfs/t1/150573/35/27827/113528/633982faE8556c0c0/b455284fd91885c6.jpg',
          left: 'https://m.360buyimg.com/babel/jfs/t1/189204/25/29491/61430/63398310E3c180e43/26d9b459cf714f9f.jpg',
          right: 'https://m.360buyimg.com/babel/jfs/t1/184948/34/28448/131232/63398323E61ff80fb/89ab84eda0421260.jpg',
          up: 'https://m.360buyimg.com/babel/jfs/t1/86258/24/33602/70616/63398334Ea2dcf448/e2f5c275792fb3d6.jpg'
        }
      },
      {
        id: 'spaceB',
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
            targetSpaceId: 'spaceA',
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

    return {
      vr360: null as InstanceType<typeof Vr360> | null, // 全景实例
      spacesConfig, // 全景空间配置
      tip: {
        // 提示属性
        top: 0, // 提示容器的 top 或 translateY 值
        left: 0, // 提示容器的 left 或 translateX 值
        title: '', // 提示标题
        content: '', // 提示内容
        show: false // 是否显示提示
      }
    }
  },
  mounted() {
    // 初始化全景实例
    this.vr360 = new Vr360({
      container: this.$refs.containerRef!,
      tipContainer: this.$refs.tipRef!,
      spacesConfig: this.spacesConfig
    })

    // 设置全景自动旋转
    this.vr360.controls.autoRotate = true

    // 开始渲染全景
    this.vr360.render()

    // 实时监听页面尺寸变化，更新全景尺寸
    this.vr360.listenResize()

    // 当需要显示提示时
    this.vr360.on('showTip', e => {
      // 停止旋转场景
      this.vr360!.controls.autoRotate = false

      // 设置提示内容和提示容器位置
      const {top, left, tip} = e
      this.tip = {
        top,
        left,
        title: tip.content.title,
        content: tip.content.text,
        show: true
      }
    })

    // 当需要隐藏提示时
    this.vr360.on('hideTip', () => {
      // 重新开启旋转场景
      this.vr360!.controls.autoRotate = true

      // 隐藏提示容器
      this.tip.show = false
    })
  },
  destroy() {
    // 页面卸载时注销全景实例
    this.vr360?.destroy?.()
  },
  methods: {
    // 切换全景空间
    handleSwitchSpace(space: SpaceConfig) {
      this.vr360?.switchSpace?.(space.id)
    }
  }
}
</script>
<style>
/* 引入自己的样式 */
@import './demo.css';
</style>
