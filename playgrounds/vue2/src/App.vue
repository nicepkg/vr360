<template>
  <div class="relative w-100vw h-100vh overflow-hidden flex flex-col">
    <div
      ref="tipRef"
      class="tip absolute cursor-pointer z-99 p-4 flex flex-col w-240px h-60px justify-center bg-black bg-op-50 text-white"
      :style="{
        left: tipLeft + 'px',
        top: tipTop + 50 + 'px',
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
        <img class="w-full h-full object-cover rounded-4px object-cover" :src="space.cubeSpaceTextureUrls.left" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
/* eslint-disable import/no-named-as-default-member */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {onMounted, ref} from '@vue/composition-api'
import type {SpaceConfig} from '@nicepkg/vr360-core'
import {Vr360} from '@nicepkg/vr360-core'
import textures from '../../../textures.json'

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
        textureUrl: 'picture/hotpot.png',
        targetSpaceId: 'roomB',
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
        textureUrl: 'picture/hotpot.png',
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
    cubeSpaceTextureUrls: textures.firstHouseLivingRoom
  },
  {
    id: 'roomC',
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
        textureUrl: 'picture/hotpot.png',
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
    cubeSpaceTextureUrls: textures.beijing
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
