<script setup lang="ts">
import type { NuxtLayouts } from '#app';
import { ref, type Ref } from 'vue';

const layout: Ref<false | keyof NuxtLayouts> = ref('default');
</script>
<template>
  <div>
    <NuxtLayout :name="layout">
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>