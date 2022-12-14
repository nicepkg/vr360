<template>
  <div class="demoA">
    <div
      ref="tipRef"
      class="demoA-tip"
      :style="{
        transform: `translate(${tipLeft}px, ${tipTop + 50}px)`,
        zIndex: showTip ? 99 : -1,
        visibility: showTip ? 'visible' : 'hidden'
      }"
    >
      <div class="demoA-tip-title">{{ tipTitle }}</div>
      <div class="demoA-tip-content">{{ tipContent }}</div>
    </div>
    <div ref="containerRef" class="demoA-container"></div>
    <div class="demoA-bottom-bar">
      <div
        v-for="space in spacesConfig"
        :key="space.id"
        class="demoA-bottom-card"
        :style="{
          backgroundImage: `url(${space.cubeSpaceTextureUrls.left})`
        }"
        @click="handleSwitchSpace(space)"
      ></div>
    </div>
  </div>
</template>

<script setup lang="ts">
/* eslint-disable import/no-named-as-default-member */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {onMounted, ref} from 'vue'
import type {SpaceConfig} from '@nicepkg/vr360-core'
import {Vr360} from '@nicepkg/vr360-core'
import textures from '../../../../textures.json'

const containerRef = ref<HTMLElement>()

const tipRef = ref<HTMLElement>()
const tipLeft = ref(0)
const tipTop = ref(0)
const showTip = ref(false)
const tipTitle = ref('')
const tipContent = ref('')

let vr360: InstanceType<typeof Vr360>

const spacesConfig = ref<SpaceConfig[]>([
  {
    id: 'spaceA',
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
        textureUrl: textures.hotpot,
        targetSpaceId: 'spaceB',
        position: {x: -10, y: -4, z: 40},
        content: {
          title: '去客厅',
          text: '一起去尊贵的客厅吧'
        }
      }
    ],
    cubeSpaceTextureUrls: textures.firstHouseDoor
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
        textureUrl: textures.hotpot,
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
    cubeSpaceTextureUrls: textures.firstHouseLivingRoom
  }
])

function handleSwitchSpace(space: SpaceConfig) {
  vr360.switchSpace(space.id)
}

onMounted(() => {
  vr360 = new Vr360({
    container: containerRef.value!,
    tipContainer: tipRef.value!,
    spacesConfig: spacesConfig.value
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
</script>
<style>
.demoA {
  position: relative;
  z-index: 0;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: calc(100vw - 3rem);
  height: 500px;
  margin-bottom: 2rem;
  overflow: hidden;
  background-color: var(--c-bg);
  border: 1px solid var(--c-border);
  border-radius: 8px;
}

.demoA-tip {
  position: absolute;
  top: 0;
  left: 0;
  z-index: -1;
  display: flex;
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

.demoA-tip-title {
  font-weight: bold;
}

.demoA-container {
  width: 100%;
  height: 100%;
}

.demoA-bottom-bar {
  display: flex;
  align-items: center;
  width: 100%;
  height: 100px;
}

.demoA-bottom-card {
  width: 140px;
  height: 70px;
  margin-left: 1rem;
  cursor: pointer;
  background-repeat: no-repeat;
  background-size: cover;
  border-radius: 4px;
}
</style>
