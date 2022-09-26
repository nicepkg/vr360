<template>
  <div class="editor-scene-manager w-full h-full flex flex-col">
    <input
      v-model="realseeVrUrl"
      type="text"
      class="mb-4 bg-gray-50 border border-gray-3 text-gray-9 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-7 dark:border-gray-6 dark:placeholder-gray-4 dark:text-white"
      placeholder="输入如视 vr 分享地址"
    />
    <button
      :disabled="addSceneLoading"
      :class="{
        'bg-dark-1': addSceneLoading,
        'bg-dark-7 hover:bg-dark-8': !addSceneLoading
      }"
      class="mb-6 text-white focus:ring-4 focus:outline-none focus:ring-light-9 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
      @click="handleAddScene"
    >
      {{ addSceneLoading ? '加载中...' : '添加场景' }}
    </button>

    <div class="flex flex-col border-1 rounded-10px p-4">
      <div
        v-for="(space, index) in spacesConfig"
        :key="space.spaceId"
        class="w-full h-100px relative rounded-4px cursor-pointer"
        :class="{
          'mt-4': index > 0
        }"
        @click="handleSwitchSpace(space)"
      >
        <img class="w-full h-full object-cover rounded-4px object-cover" :src="space.cubeSpaceTextureUrls.left" />
        <DeleteIcon
          class="absolute top-2 right-2 z-1 color-white w-4 h-4"
          @click="handleDeleteSpace(space)"
        ></DeleteIcon>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type {SpaceConfig} from '@nicepkg/vr360-core'
import {useVr360} from './useVr360'
import {DeleteIcon} from './Icons'
import {getRealseeTextureUrls} from './helper'
import {ref} from 'vue'

// eslint-disable-next-line react-hooks/rules-of-hooks
const {vr360, spacesConfig} = useVr360({})

function handleSwitchSpace(space: SpaceConfig) {
  vr360.value?.switchSpace(space.spaceId)
}

function handleDeleteSpace(space: SpaceConfig) {
  spacesConfig.value = spacesConfig.value!.filter(item => item.spaceId !== space.spaceId)
}

const realseeVrUrl = ref('')
const addSceneLoading = ref(false)

async function handleAddScene() {
  if (addSceneLoading.value) {
    return
  }
  addSceneLoading.value = true

  try {
    const textureUrls = await getRealseeTextureUrls(realseeVrUrl.value)
    spacesConfig.value = [
      ...spacesConfig.value!,
      {
        spaceId: `space${spacesConfig.value!.length}`,
        cubeSpaceTextureUrls: textureUrls
      }
    ]
  } finally {
    addSceneLoading.value = false
  }
}
</script>

<style scoped></style>
