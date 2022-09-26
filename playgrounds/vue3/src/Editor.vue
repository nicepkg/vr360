<template>
  <div class="vr360-editor w-full h-full overflow-hidden flex flex-col">
    <div class="vr360-editor-top-bar-wrapper flex-shrink-0 w-full h-60px border-b overflow-hidden bg-white">
      <EditorTopBar></EditorTopBar>
    </div>
    <div class="vr360-editor-container flex-1 flex">
      <div class="vr360-editor-container-left bg-white min-w-150px flex-shrink-0">
        <EditorLeftBar></EditorLeftBar>
      </div>
      <div class="vr360-editor-container-center flex-1 bg-light-3 overflow-hidden">
        <slot></slot>
      </div>
      <!-- <div class="vr360-editor-container-right bg-white w-300px flex-shrink-0"></div> -->
    </div>
  </div>
</template>

<script setup lang="ts">
import EditorTopBar from './EditorTopBar.vue'
import EditorLeftBar from './EditorLeftBar.vue'
</script>

<style scoped></style>
