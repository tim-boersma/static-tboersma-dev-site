<script setup lang="ts">
import Button from 'primevue/button';
import Card from 'primevue/card';
import { useToggleVMMutation, useVMStatusQuery } from '@/api/hooks/vmQueries';
import { createPollingController } from '@/composables/vmPolling';
import { computed, onMounted, onUnmounted, ref, type Ref, watch } from 'vue';
import { VmState } from '~/app/types/vmStateEnum';
import { useToast } from "primevue/usetoast";


const pollingController = createPollingController();
const lastPolledAt: Ref<Date | null> = ref(null);
const wasOnline: Ref<boolean | null> = ref(null);
const isClicking: Ref<boolean> = ref(false);
const now: Ref<Date> = ref(new Date());
const toast = useToast();

const { data: status, isLoading: isStatusLoading, error: statusError, refetch: refetchStatus, isPending: isStatusPending } = useVMStatusQuery();
const { mutateAsync: toggleVM, isLoading: isToggleLoading, error: toggleError } = useToggleVMMutation();


watch([status, isStatusLoading], ([, newStatusLoading], [, oldStatusLoading]) => {
  if (newStatusLoading && !oldStatusLoading) {
    lastPolledAt.value = new Date();
    if ((wasOnline.value === null || (canPowerOff.value && !wasOnline.value) || (canPowerOn.value && wasOnline.value)) && !pollingController.isNormalPolling) {
      console.log('canceling fast polling')
      pollingController.startNormalPolling(refetchStatus);
      wasOnline.value = null;
    }
  }
});

const isOnline = computed(() => {
  if (status.value === VmState.Running || status.value === VmState.Starting) {
    return true;
  }

  if (status.value === VmState.Stopped || status.value === VmState.Stopping || status.value === VmState.Deallocated || status.value === VmState.Deallocating) {
    return false;
  }

  return null;
});

function clickRefresh(){
  if(isLoading.value) return;
  refetchStatus();
}

const isLoading = computed(() => isStatusLoading.value || isToggleLoading.value);

watch([statusError, toggleError], ([newStatusError, newToggleError]) => {
  if (newStatusError) {
    toast.add({ severity: 'error', summary: newStatusError?.message || 'Failed to fetch VM status', group: 'tc', life: 5000 });
  }
  if (newToggleError) {
    toast.add({ severity: 'error', summary: newToggleError?.message || 'Failed to toggle VM power state', group: 'tc', life: 5000 });
  }
});

const statusColor = computed(() => {
  if (isOnline.value === null) return '#888888'; // gray = loading
  if (isOnline.value) return '#22c55e'; // green = online
  return '#ef4444'; // red = offline
});

const pollingColor = computed(() => {
  if (isLoading.value || isOnline.value === null) return '#888888'; // gray = loading
  if (isOnline.value) return '#22c55e'; // green = online
  return '#ef4444'; // red = offline
});

const statusText = computed(() => {
  if (isStatusPending.value) return 'Loading...';

  switch (status.value) {
    case VmState.Running:
      return 'Online';
    case VmState.Starting:
      return 'Starting...';
    case VmState.Stopped:
    case VmState.Deallocated:
      return 'Offline';
    case VmState.Stopping:
      return 'Stopping...';
    default:
      return 'Unknown';
  }
});

const canPowerOn = computed(() => status.value === VmState.Stopped || status.value === VmState.Deallocated);
const canPowerOff = computed(() => status.value === VmState.Running);
const canToggle = computed(() => (canPowerOn.value || canPowerOff.value) && !isToggleLoading.value);

const statusIcon = computed(() => {
  if (isLoading.value || isOnline.value === null) {
    return 'pi pi-sync';
  }

  return isOnline.value ? 'pi pi-check-circle' : 'pi pi-pause-circle';
});

const toggleLabel = computed(() => {
  if (isToggleLoading.value) {
    return 'Applying...';
  }

  return isOnline.value ? 'Power Off VM' : 'Power On VM';
});

async function toggle(): Promise<void> {
  try {
    const newState = !(isOnline.value ?? false);
    wasOnline.value = isOnline.value;
    await toggleVM(newState);
    lastPolledAt.value = new Date();
    pollingController.startFastPolling(() => refetchStatus());
  } catch (err) {
    console.error('Failed to toggle VM:', err);
  }
};

onMounted(() => {
  pollingController.startNormalPolling(refetchStatus);
});

onUnmounted(() => {
  pollingController.stopPolling();
});

function buttonPress() {
  isClicking.value = true;

  setTimeout(() => {
    isClicking.value = false;
  }, 400);

  if (!canToggle.value) return;
  toggle();
}

onMounted(() => {
  const interval = setInterval(() => {
    now.value = new Date();
  }, 1000);

  onUnmounted(() => clearInterval(interval));
});

function formatTime(date: Date): string {
  const diff = Math.max(0, Math.floor((now.value.getTime() - date.getTime()) / 1000));

  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return date.toLocaleDateString();
}
</script>

<template>
  <div class="min-h-screen w-full gradient-bg p-4 sm:p-8 flex items-center justify-center">
    <Card class="w-full max-w-5xl">
      <template #content>
        <div class="space-y-6">
          <!-- Header -->
          <div class="pb-4 border-b border-surface-200 dark:border-gray-700">
            <p class="text-xs uppercase tracking-widest text-emerald-400">Plex Infrastructure</p>
            <h1 class="text-3xl font-bold sm:text-4xl">Plex Virtual Machine Control Panel</h1>
            <p class="text-sm text-surface-600 dark:text-surface-400">
              Monitor live VM state and trigger power actions from a single control panel.
            </p>
          </div>

          <!-- Main Content -->
          <div class="flex flex-col gap-8">
            <!-- Centered Status Circle -->
            <section class="flex items-center justify-center">
              <div
                class="relative grid status-parent h-72 w-72 place-items-center rounded-full bg-surface-100 dark:bg-surface-800">
                <svg :class="['h-72 w-72 status-wrapper', { 'click-burst': isClicking }]" viewBox="0 0 100 100"
                  :style="{ '--status-color': statusColor }" @click="buttonPress()" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="50" cy="50" r="35" :fill="statusColor" :class="['center-dot', { 'cursor-pointer': canToggle }]" />
                  <text x="50" y="52" text-anchor="middle" dominant-baseline="middle" class="status-text tracking-wide"
                    fill="currentColor">
                    {{ statusText }}
                  </text>
                </svg>
              </div>
            </section>

            <!-- Action Buttons -->
            <section class="space-y-4">
              <div class="flex flex-col gap-3 items-center justify-center w-full">
                <Button :label="toggleLabel" :loading="isToggleLoading" :disabled="!canToggle"
                  :severity="isOnline ? 'danger' : 'success'" @click="toggle" class="flex-1 w-80 sm:w-md" />
                <Button label="Refresh" icon="pi pi-refresh" outlined @click="clickRefresh()" class="flex-1 w-80 sm:w-md" />
              </div>
            </section>

            <!-- Bottom Left Status Meta -->
            <section class="flex justify-start pt-2">
              <div
                class="flex items-center gap-3 rounded-lg bg-surface-50 dark:bg-surface-800 px-4 py-3">
                <i :class="[statusIcon, isLoading ? 'pi-spin' : '', 'text-2xl text-primary']"
                  :style="{ color: pollingColor }" />
                <div class="flex flex-col gap-1">
                  <!-- <Tag :severity="statusSeverity" :value="statusText" /> -->
                  <span class="text-xs text-gray-500">
                    {{
                      lastPolledAt
                        ? `Last updated ${formatTime(lastPolledAt)}`
                        : 'Waiting for first status poll'
                    }}
                  </span>
                </div>
              </div>
            </section>
          </div>
        </div>
      </template>
    </Card>
  </div>
</template>

<style scoped>
.status-text {
  font-family: "Segoe UI", system-ui, -apple-system, sans-serif;
  font-size: 10px;
  font-weight: 600;
  pointer-events: none;
}

.status-circle {
  display: block;
}

.center-dot {
  animation: glowPulse 2.5s ease-in-out infinite;
  transition: transform 0.15s ease, filter 0.15s ease;
}

.status-wrapper {
  transform: scale(1);
  transform-origin: center;
  transition: transform 220ms cubic-bezier(0.22, 1, 0.36, 1),
    filter 220ms cubic-bezier(0.22, 1, 0.36, 1);
  will-change: transform, filter;
}

.click-burst {
  transform: scale(0.97);
  filter: drop-shadow(0 0 10px var(--status-color));
}


@keyframes glowPulse {

  0%,
  100% {
    filter: drop-shadow(0 0 4px var(--status-color));
  }

  50% {
    filter: drop-shadow(0 0 6px var(--status-color));
  }
}

.status-parent:hover .center-dot {
  animation-play-state: paused;
  filter: drop-shadow(0 0 6px var(--status-color));
}

.gradient-bg {
  background:
    radial-gradient(circle at 20% 20%, rgba(0, 110, 255, 0.12), transparent 45%),
    radial-gradient(circle at 80% 80%, rgba(0, 190, 150, 0.10), transparent 50%),
    radial-gradient(circle at 50% 100%, rgba(0, 80, 180, 0.08), transparent 60%),
    #08090a;
}
</style>
