<script setup="ts">
</script>
<template>
  <div>
    <Toast position="top-center" group="tc" />
    <ViewWrapper>
      <DarkModeToggle 
        lock-color class="text-3xl ml-2 mt-2"
        @click="() => $colorMode.preference = $colorMode.preference === 'dark' ? 'light' : 'dark'" />
      <slot />
    </ViewWrapper>
  </div>
</template>