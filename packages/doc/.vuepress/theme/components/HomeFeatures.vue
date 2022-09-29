<script setup lang="ts">
import {usePageFrontmatter} from '@vuepress/client'
import {isArray} from '@vuepress/shared'
import type {DefaultThemeHomePageFrontmatter} from '@vuepress/theme-default'
import {computed} from 'vue'
import AutoLink from '@vuepress/theme-default/components/AutoLink.vue'

type HomePageFormatter = {
  features?: {
    title: string
    details: string
    link: string
    disabled: boolean
  }[]
} & Omit<DefaultThemeHomePageFrontmatter, 'features'>

// eslint-disable-next-line react-hooks/rules-of-hooks
const frontmatter = usePageFrontmatter<HomePageFormatter>()
const features = computed(() => {
  if (isArray(frontmatter.value.features)) {
    return frontmatter.value.features
  }
  return []
})
</script>

<template>
  <div v-if="features.length > 0" class="features">
    <div
      v-for="feature in features"
      :key="feature.title"
      class="feature"
      :style="{
        cursor: feature.disabled ? 'not-allowed' : 'pointer',
        opacity: feature.disabled ? 0.8 : 1
      }"
    >
      <h4>
        <AutoLink
          v-if="!feature.disabled"
          :item="{
            text: feature.title,
            link: feature.link || './'
          }"
        >
          {{ feature.title }}
        </AutoLink>
        <div v-else>
          {{ feature.title }}
        </div>
      </h4>

      <p>{{ feature.details }}</p>
    </div>
  </div>
</template>
