<template>
  <div class="w-100vw h-100vh">
    <Editor>
      <div class="relative w-full h-full overflow-hidden flex flex-col">
        <div
          ref="tipRef"
          class="tip absolute rounded-4px left-0 top-0 cursor-pointer z-99 p-4 flex flex-col w-240px h-60px justify-center bg-black bg-op-50 text-white"
          :style="{
            transform: `translate(${tipLeft}px, ${tipTop + 60}px)`,
            zIndex: showTip ? 99 : -1
          }"
        >
          <div class="tip-title font-bold">{{ tipTitle }}</div>
          <div class="tip-content">{{ tipContent }}</div>
        </div>
        <div ref="containerRef" class="w-full flex-1"></div>
        <!-- <div class="w-full h-100px flex items-center flex-shrink-0">
          <div
            v-for="space in spacesConfig"
            :key="space.id"
            class="w-140px h-70px rounded-4px cursor-pointer ml-4"
            @click="handleSwitchSpace(space)"
          >
            <img class="w-full h-full object-cover rounded-4px" :src="space.cubeSpaceTextureUrls.left" />
          </div>
        </div> -->
      </div>
    </Editor>
  </div>
</template>

<script setup lang="ts">
/* eslint-disable import/no-named-as-default-member */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {ref} from 'vue'
import type {SpaceConfig} from '@nicepkg/vr360-core'
import Editor from './Editor.vue'
import {useVr360} from './useVr360'
import textures from '../../../textures.json'

const containerRef = ref<HTMLElement>()
const tipRef = ref<HTMLElement>()

// eslint-disable-next-line react-hooks/rules-of-hooks
const {tipContent, tipTitle, tipLeft, tipTop, showTip, vr360, spacesConfig} = useVr360({
  containerEl: containerRef,
  tipEl: tipRef,
  spacesConfig: [
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
          textureUrl: 'picture/hotpot.png',
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
          textureUrl: 'picture/hotpot.png',
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
  ]
})

console.log(spacesConfig)

function handleSwitchSpace(space: SpaceConfig) {
  vr360.value?.switchSpace(space.id)
}
</script>
