<script lang="ts">
</script>

<script setup lang="ts">
import { useAttrs } from "vue";
let nextId = 0;

interface Props {
  duration?: number;
  type?: "button" | "submit" | "reset";
  title?: string;
  ariaLabel?: string;
  lockColor?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  duration: 400,
  type: "button",
  title: "Toggle theme",
  ariaLabel: "Toggle theme",
  lockColor: false,
});

const attrs = useAttrs();

const toggleId = `classic-${++nextId}`;

const clipMainId = `toggles.dev-classic-main-${toggleId}`;
</script>

<template>
  <button v-bind="attrs" :type="props.type" :title="props.title" :aria-label="props.ariaLabel">
    <svg
      width="1em" height="1em" viewBox="0 0 24 24" aria-hidden="true"
      :style="{ '--toggles-dot-dev--duration': `${props.duration}ms` }"
      :class="[{'text-white': props.lockColor}]">
      <defs>
        <mask :id="clipMainId">
          <rect width="100%" height="100%" fill="white" />
          <circle
            cx="15" cy="10" r="5" fill="black"
            class="transition-transform duration-300 not-dark:translate-x-2 not-dark:-translate-y-1" />
        </mask>
      </defs>
      <g :stroke="'currentColor'" :stroke-linecap="'round'">
        <circle cx="12" cy="12" r="5" fill="currentColor" :mask="`url(#${clipMainId})`" />
        <path
          :d="'M12 1.4v2.4'" :fill="'none'" :stroke-width="2" :stroke-linejoin="'round'" :stroke-miterlimit="0"
          :paint-order="'stroke markers fill'"
          :class="'transform-view origin-center [transition:transform_var(--toggles-dot-dev--duration),opacity_var(--toggles-dot-dev--duration)] delay-[calc(var(--toggles-dot-dev--duration)*0.15)] dark:delay-0 dark:transform-[scale(0)] dark:opacity-0'" />
        <path
          :d="'m20.3 3.7-2.5 2.5'" :fill="'none'" :stroke-width="2" :stroke-linejoin="'round'"
          :stroke-miterlimit="0" :paint-order="'stroke markers fill'"
          :class="'transform-view origin-center [transition:transform_var(--toggles-dot-dev--duration),opacity_var(--toggles-dot-dev--duration)] delay-[calc(var(--toggles-dot-dev--duration)*0.15)] dark:delay-0 dark:transform-[scale(0)] dark:opacity-0'" />
        <path
          :d="'M22.6 12h-2.4'" :fill="'none'" :stroke-width="2" :stroke-linejoin="'round'" :stroke-miterlimit="0"
          :paint-order="'stroke markers fill'"
          :class="'transform-view origin-center [transition:transform_var(--toggles-dot-dev--duration),opacity_var(--toggles-dot-dev--duration)] delay-[calc(var(--toggles-dot-dev--duration)*0.15)] dark:delay-0 dark:transform-[scale(0)] dark:opacity-0'" />
        <path
          :d="'M12 22.6v-2.4'" :fill="'none'" :stroke-width="2" :stroke-linejoin="'round'" :stroke-miterlimit="0"
          :paint-order="'stroke markers fill'"
          :class="'transform-view origin-center [transition:transform_var(--toggles-dot-dev--duration),opacity_var(--toggles-dot-dev--duration)] delay-[calc(var(--toggles-dot-dev--duration)*0.15)] dark:delay-0 dark:transform-[scale(0)] dark:opacity-0'" />
        <path
          :d="'M1.4 12h2.4'" :fill="'none'" :stroke-width="2" :stroke-linejoin="'round'" :stroke-miterlimit="0"
          :paint-order="'stroke markers fill'"
          :class="'transform-view origin-center [transition:transform_var(--toggles-dot-dev--duration),opacity_var(--toggles-dot-dev--duration)] delay-[calc(var(--toggles-dot-dev--duration)*0.15)] dark:delay-0 dark:transform-[scale(0)] dark:opacity-0'" />
        <path 
          :d="'m20.3 20.3-2.5-2.5'" :fill="'none'" :stroke-width="2" :stroke-linejoin="'round'"
          :stroke-miterlimit="0" :paint-order="'stroke markers fill'"
          :class="'transform-view origin-center [transition:transform_var(--toggles-dot-dev--duration),opacity_var(--toggles-dot-dev--duration)] delay-[calc(var(--toggles-dot-dev--duration)*0.15)] dark:delay-0 dark:transform-[scale(0)] dark:opacity-0'" />
        <path
          :d="'m3.7 20.3 2.5-2.5'" :fill="'none'" :stroke-width="2" :stroke-linejoin="'round'"
          :stroke-miterlimit="0" :paint-order="'stroke markers fill'"
          :class="'transform-view origin-center [transition:transform_var(--toggles-dot-dev--duration),opacity_var(--toggles-dot-dev--duration)] delay-[calc(var(--toggles-dot-dev--duration)*0.15)] dark:delay-0 dark:transform-[scale(0)] dark:opacity-0'" />
        <path
          :d="'m3.7 3.7 2.5 2.5'" :fill="'none'" :stroke-width="2" :stroke-linejoin="'round'" :stroke-miterlimit="0"
          :paint-order="'stroke markers fill'"
          :class="'transform-view origin-center [transition:transform_var(--toggles-dot-dev--duration),opacity_var(--toggles-dot-dev--duration)] delay-[calc(var(--toggles-dot-dev--duration)*0.15)] dark:delay-0 dark:transform-[scale(0)] dark:opacity-0'" />
      </g>
    </svg>
  </button>
</template>