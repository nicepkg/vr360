<template>
  <div class="App text-dark-9 bg-light-3 w-full h-full flex flex-col">
    <div class="App-content-wrapper w-full flex-1 overflow-hidden">
      <div class="App-content w-full h-full overflow-auto">
        <router-view v-slot="{Component}">
          <component :is="Component" />
        </router-view>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {HeadAttrs, useHead} from '@vueuse/head'

// 动态插入 scripts 标签
const script: HeadAttrs[] = []

// 动态修改 html head
// https://github.com/vueuse/head
useHead({
  title: 'vr 看房',
  meta: [],
  script
})
</script>

<style lang="less">
html {
  --safe-area-inset-top: env(safe-area-inset-top);
  --safe-area-inset-bottom: env(safe-area-inset-bottom);
}
</style>
