<template>
  <div
    ref="codeDemoRef"
    class="code-demo"
    :style="{
      border: isFullScreen ? 'none' : '1px solid var(--c-border)',
      borderRadius: isFullScreen ? '0px' : '8px'
    }"
  >
    <div class="code-demo-top">
      <div class="code-demo-title">{{ project?.title ?? DEFAULT_EDITOR_TITLE }}</div>
      <div class="code-demo-fullscreen" @click="toggleFullScreen">
        <ExitFullscreenIcon v-if="isFullScreen" />
        <FullscreenIcon v-else />
      </div>
    </div>
    <div ref="codeDemoEditorRef" class="code-demo-editor"></div>
  </div>
</template>

<script setup lang="ts">
import {onMounted, ref} from 'vue'
import sdk from '@stackblitz/sdk'
import type {ProjectFiles, Project} from '@stackblitz/sdk'
import {getProps} from './CodeDemo.props'
import {DEFAULT_EDITOR_TITLE} from './constant'
import {ExitFullscreenIcon, FullscreenIcon} from './Icons'

const props = defineProps(getProps())

const codeDemoRef = ref<HTMLElement>()
const codeDemoEditorRef = ref<HTMLIFrameElement>()
const isFullScreen = ref(false)

const toggleFullScreen = () => {
  if (!codeDemoRef.value) return
  if (isFullScreen.value) {
    document.exitFullscreen()
    isFullScreen.value = false
  } else {
    codeDemoRef.value.requestFullscreen()
    isFullScreen.value = true
  }
}

onMounted(async () => {
  if (!codeDemoEditorRef.value || !props.project) return

  codeDemoEditorRef.value.setAttribute('frameborder', '0')

  // eslint-disable-next-line no-restricted-globals
  const defaultFiles: ProjectFiles = (await self.loadCodeDemoModeDefaultFiles?.(props.mode)) ?? {}
  const finalProject = {
    ...props.project,
    files: {
      ...defaultFiles,
      ...props.project.files
    }
  } as Project

  await sdk.embedProject(codeDemoEditorRef.value, finalProject, {
    forceEmbedLayout: true,
    openFile: props.openFile,
    hideNavigation: true,
    height: '100%',
    view: props.previewOnly ? 'preview' : undefined,
    clickToLoad: props.clickToLoad
  })
})
</script>
<style>
.code-demo {
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background-color: #2e3138;
}
.code-demo-top {
  box-sizing: border-box;
  display: flex;
  flex-shrink: 0;
  align-items: center;
  width: 100%;
  height: 2rem;
  padding: 0 0.5em;
  overflow: hidden;
  font-size: 14px;
  color: #ccc;
}
.code-demo-title {
  flex: 1;
}
.code-demo-fullscreen {
  flex-shrink: 0;
  font-size: 20px;
  cursor: pointer;
}
.code-demo-editor {
  box-sizing: border-box;
  display: block;
  height: 100%;
  min-height: 500px;
  border: none;
}
</style>
