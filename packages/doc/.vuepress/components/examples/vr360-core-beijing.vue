<template>
  <div class="vr-container-wrapper" :style="{height: height + 'px'}">
    <div
      ref="tipRef"
      class="vr-tip"
      :style="{
        left: tipLeft + 'px',
        top: tipTop + 50 + 'px',
        zIndex: showTip ? 99 : -1
      }"
    >
      <div class="vr-tip-title">{{ tipTitle }}</div>
      <div class="vr-tip-content">{{ tipContent }}</div>
    </div>
    <div ref="containerRef" class="vr-container"></div>

    <div v-if="showMask" class="vr-mask"></div>
  </div>
</template>

<script setup lang="ts">
/* eslint-disable import/no-named-as-default-member */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {onMounted, ref, watch, nextTick} from 'vue'
import type {SpaceConfig} from '@nicepkg/vr360-core'
import {Vr360} from '@nicepkg/vr360-core'
import {useElementSize} from '@vueuse/core'

defineProps({
  showMask: {
    type: Boolean,
    default: false
  }
})

const appRef = ref<HTMLElement>()

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
    tips: [],
    cubeSpaceTextureUrls: {
      right: '/images/vr/beijing/pano_r.jpg',
      left: '/images/vr/beijing/pano_l.jpg',
      top: '/images/vr/beijing/pano_u.jpg',
      bottom: '/images/vr/beijing/pano_d.jpg',
      front: '/images/vr/beijing/pano_f.jpg',
      back: '/images/vr/beijing/pano_b.jpg'
    }
  }
])

onMounted(() => {
  vr360 = new Vr360({
    container: containerRef.value!,
    tipContainer: tipRef.value!,
    spacesConfig: spacesConfig.value
  })

  vr360.controls.autoRotate = true
  vr360.controls.autoRotateSpeed = 0.2

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

  appRef.value = document.querySelector<HTMLElement>('#app')!
})

// eslint-disable-next-line react-hooks/rules-of-hooks
const {height} = useElementSize(appRef)

watch(height, async () => {
  await nextTick()
  vr360.updateContainerSize()
})
</script>
<style scoped>
.vr-container-wrapper {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
  display: flex;
  flex-direction: column;
  width: 100vw;
  height: 100%;
  overflow: hidden;
}

.vr-tip {
  position: absolute;
  z-index: 99;
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 240px;
  height: 60px;
  padding: 1rem;
  color: #fff;
  cursor: pointer;
  background-color: rgba(0, 0, 0, 0.5);
}

.vr-tip-title {
  font-weight: bold;
}

.vr-container {
  width: 100%;
  height: 100%;
}

.vr-mask {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    to bottom,
    rgba(255, 255, 255, 1) 60%,
    rgba(255, 255, 255, 0.8) 90%,
    rgba(255, 255, 255, 0.2)
  );
}

html.dark .vr-mask {
  background: linear-gradient(to bottom, rgba(34, 39, 46, 1) 60%, rgba(34, 39, 46, 0.8) 90%, rgba(34, 39, 46, 0.2));
}
</style>
