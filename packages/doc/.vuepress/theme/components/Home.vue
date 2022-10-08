<script setup lang="ts">
import HomeContent from '@vuepress/theme-default/components/HomeContent.vue'
import HomeFeatures from './HomeFeatures.vue'
import HomeFooter from '@vuepress/theme-default/components/HomeFooter.vue'
import HomeHero from '@vuepress/theme-default/components/HomeHero.vue'
import HomeVrBg from './HomeVrBg.vue'
</script>

<template>
  <main class="home">
    <HomeHero />
    <HomeFeatures />
    <HomeContent />
    <HomeFooter />
    <ClientOnly>
      <teleport to="#vr-teleport">
        <HomeVrBg :show-mask="true"></HomeVrBg>
      </teleport>
    </ClientOnly>
  </main>
</template>
