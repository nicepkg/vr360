<template>
  <div>
    <div ref="containerRef" class="container"></div>
  </div>
</template>

<script setup lang="ts">
/* eslint-disable import/no-named-as-default-member */
import * as THREE from 'three'
import TWEEN from '@tweenjs/tween.js'
import {onMounted, ref} from 'vue'
import {Vr360} from './vr360-sdk'

const containerRef = ref<HTMLElement>()

onMounted(() => {
  const vr360 = new Vr360({
    container: containerRef.value!,
    roomsConfig: [
      {
        id: 'roomA',
        centerPosition: {
          x: 0,
          y: 0,
          z: 0
        },
        hotPoints: [
          {
            targetRoomId: 'roomB',
            position: {
              x: -10,
              y: -25,
              z: 40
            }
          }
        ],
        textureUrls: {
          right: 'picture/FirstHousing/door/right.jpeg',
          left: 'picture/FirstHousing/door/left.jpeg',
          top: 'picture/FirstHousing/door/top.jpeg',
          bottom: 'picture/FirstHousing/door/bottom.jpeg',
          front: 'picture/FirstHousing/door/front.jpeg',
          back: 'picture/FirstHousing/door/back.jpeg'
        }
      }
    ]
  })

  vr360.render()

  vr360.listenResize()
})
</script>

<style scoped>
.container {
  width: 80vw;
  height: 800px;
}
</style>
