<script setup lang="ts">
import HomeContent from '@vuepress/theme-default/components/HomeContent.vue'
import HomeFeatures from './HomeFeatures.vue'
import HomeFooter from '@vuepress/theme-default/components/HomeFooter.vue'
import HomeHero from '@vuepress/theme-default/components/HomeHero.vue'
import VrBeijing from '../../components/examples/vr360-core-beijing.vue'
</script>

<template>
  <main class="home">
    <HomeHero />
    <HomeFeatures />
    <HomeContent />
    <HomeFooter />
    <teleport to="body">
      <VrBeijing :show-mask="true"></VrBeijing>
    </teleport>
  </main>
</template>
