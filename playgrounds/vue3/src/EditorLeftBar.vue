<template>
  <div class="vr360-editor-left-bar w-full h-full flex">
    <div class="vr360-editor-left-bar-menu-list h-full flex flex-col p-4">
      <div
        v-for="(menu, index) in menus"
        :key="index"
        class="vr360-editor-left-bar-menu cursor-pointer w-full h-40px flex items-center rounded-10px hover:bg-light-5 mb-4 px-4 color-dark-1"
        :class="{
          'color-black': menuActiveIndex === index,
          'bg-light-9': menuActiveIndex === index
        }"
        @click="menuActiveIndex = index"
      >
        {{ menu.title }}
      </div>
    </div>

    <div
      class="vr360-editor-left-bar-menu-detail border-x w-250px h-full flex flex-col items-center p-4 overflow-x-hidden overflow-y-auto"
    >
      <SceneManager v-if="menuActiveIndex === 0"></SceneManager>
      <TipsManager v-if="menuActiveIndex === 1"></TipsManager>
      <HotPointManager v-if="menuActiveIndex === 2"></HotPointManager>
      <Settings v-if="menuActiveIndex === 3"></Settings>
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref} from 'vue'
import HotPointManager from './EditorHotPointManager.vue'
import SceneManager from './EditorSceneManager.vue'
import Settings from './EditorSettings.vue'
import TipsManager from './EditorTipsManager.vue'

const menuActiveIndex = ref(0)

const menus = ref([
  {
    title: '场景管理'
  },
  {
    title: '文本标签'
  },
  {
    title: '传送白点'
  },
  {
    title: '设置'
  }
])
</script>

<style scoped></style>
