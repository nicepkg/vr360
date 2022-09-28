<template>
  <div
    v-show="showContextMenu"
    ref="contextMenuRef"
    class="vr360-context-menu absolute z-999 text-sm bg-white shadow rounded-4px overflow-hidden"
    :style="{
      top: `${contextMenuTop}px`,
      left: `${contextMenuLeft}px`
    }"
  >
    <div
      v-for="(menu, index) in contextMenus"
      :key="index"
      class="vr360-context-menu-item w-full h-40px flex items-center p-4 hover:bg-light-5 cursor-pointer"
    >
      <div class="vr360-context-menu-item-icon mr-2">
        <component :is="menu.icon" class="w-4 h-4"></component>
      </div>
      <div class="vr360-context-menu-item-text">
        {{ menu.title }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type {Position} from '@nicepkg/vr360-core'
import {onMounted, onUnmounted, ref, shallowRef} from 'vue'
import {LocationIcon, PaperAirPlaneIcon} from './Icons'
import {useVr360} from './useVr360'

// eslint-disable-next-line react-hooks/rules-of-hooks
const {vr360} = useVr360({})

const contextMenuRef = ref<HTMLElement>()
const contextMenuLeft = ref(0)
const contextMenuTop = ref(0)

const contextMenu3dPosition = ref<Position>()

const contextMenus = shallowRef([
  {
    title: '添加文本标签',
    icon: LocationIcon
  },
  {
    title: '添加传送白点',
    icon: PaperAirPlaneIcon
  }
])

const showContextMenu = ref(false)

function handleContextMenu(e: MouseEvent) {
  e.preventDefault()
  e.stopPropagation()
  contextMenuLeft.value = e.clientX
  contextMenuTop.value = e.clientY
  contextMenu3dPosition.value = vr360.value?.getPositionFromMouseXY(e.clientX, e.clientY)
  console.log('contextMenu3dPosition', contextMenu3dPosition.value)
  showContextMenu.value = true
}

function handleDocumentClick() {
  showContextMenu.value = false
}

onMounted(() => {
  document.addEventListener('click', handleDocumentClick)
  contextMenuRef.value?.parentElement?.addEventListener('contextmenu', handleContextMenu)
})

onUnmounted(() => {
  document.removeEventListener('click', handleDocumentClick)
  contextMenuRef.value?.parentElement?.removeEventListener('contextmenu', handleContextMenu)
})
</script>

<style scoped></style>
