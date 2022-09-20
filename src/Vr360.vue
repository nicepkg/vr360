<template>
  <div class="relative w-80vw h-800px overflow-hidden">
    <div
      ref="tipRef"
      class="tip absolute cursor-pointer z-99 p-4 flex flex-col w-120px h-60px justify-center bg-black bg-op-50 text-white"
      :style="{
        left: tipLeft + 'px',
        top: tipTop + 50 + 'px',
        zIndex: showTip ? 99 : -1
      }"
    >
      <div class="tip-title font-bold">{{ tipTitle }}</div>
      <div class="tip-content">{{ tipContent }}</div>
    </div>
    <div ref="containerRef" class="container w-full h-full"></div>
  </div>
</template>

<script setup lang="ts">
/* eslint-disable import/no-named-as-default-member */
import {onMounted, ref} from 'vue'
import {Vr360} from './vr360-sdk'

const containerRef = ref<HTMLElement>()

const tipRef = ref<HTMLElement>()
const tipLeft = ref(0)
const tipTop = ref(0)
const showTip = ref(false)
const tipTitle = ref('')
const tipContent = ref('')

onMounted(() => {
  const vr360 = new Vr360({
    container: containerRef.value!,
    tipContainer: tipRef.value!,
    spacesConfig: [
      {
        spaceId: 'roomA',
        cameraPosition: {
          x: 0,
          y: 0,
          z: 0
        },
        hotPoints: [
          {
            targetSpaceId: 'roomB',
            position: {
              x: -10,
              y: -25,
              z: 40
            }
          }
        ],
        tips: [
          {
            position: {x: -10, y: -4, z: 40},
            content: {
              title: '提示标题1',
              text: '内容'
            }
          },
          {
            position: {x: -20, y: 0, z: 40},
            content: {
              title: '提示标题2',
              text: '内容'
            }
          }
        ],
        cubeSpaceTextureUrls: {
          right: 'picture/FirstHousing/door/right.jpeg',
          left: 'picture/FirstHousing/door/left.jpeg',
          top: 'picture/FirstHousing/door/top.jpeg',
          bottom: 'picture/FirstHousing/door/bottom.jpeg',
          front: 'picture/FirstHousing/door/front.jpeg',
          back: 'picture/FirstHousing/door/back.jpeg'
        }
      },
      {
        spaceId: 'roomB',
        cameraPosition: {
          x: 0,
          y: 0,
          z: 0
        },
        hotPoints: [
          {
            targetSpaceId: 'roomA',
            position: {
              x: -8,
              y: -34,
              z: -40
            }
          }
        ],
        tips: [
          {
            position: {x: -10, y: -4, z: 40},
            content: {
              title: '提示标题1',
              text: '内容'
            }
          },
          {
            position: {x: -20, y: 0, z: 40},
            content: {
              title: '提示标题2',
              text: '内容'
            }
          }
        ],
        cubeSpaceTextureUrls: {
          right: 'picture/FirstHousing/living-room/right.jpeg',
          left: 'picture/FirstHousing/living-room/left.jpeg',
          top: 'picture/FirstHousing/living-room/top.jpeg',
          bottom: 'picture/FirstHousing/living-room/bottom.jpeg',
          front: 'picture/FirstHousing/living-room/front.jpeg',
          back: 'picture/FirstHousing/living-room/back.jpeg'
        }
      }
    ]
  })

  vr360.render()

  vr360.listenResize()

  vr360.on('showTip', e => {
    const {top, left, tip} = e
    showTip.value = true
    tipLeft.value = left
    tipTop.value = top
    tipTitle.value = tip.content.title
    tipContent.value = tip.content.text
  })

  vr360.on('hideTip', () => {
    showTip.value = false
  })
})
</script>
