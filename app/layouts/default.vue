<script setup="ts">
import { definePageMeta } from '#imports'
// TODO: implement https://color-mode.nuxtjs.org/usage/basic

definePageMeta({
  colorMode: 'dark',
})
</script>
<template>
  <div >
    <Toast position="top-center" group="tc" />

    <slot />
  </div>
</template>