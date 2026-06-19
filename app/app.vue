<script lang="ts" setup>
import PlexVmControl from '@/components/PlexVmControl.vue';
</script>
<template>
    <PlexVmControl />
    <Toast position="top-center" group="tc" />
</template>
<style>
/* Fix Primevue toast alignment*/
.p-toast-summary {
    line-height: 1; }
</style>
   