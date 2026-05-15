<template>
  <button type="button" class="flex w-full items-center justify-center rounded-xl bg-[#020a22] px-5 py-3.5 text-base font-semibold tracking-wide text-white shadow-lg shadow-slate-950/20 transition hover:-translate-y-0.5 hover:shadow-xl">
    <span class="flex-1 text-center ml-4">{{ label }}</span>
    <Icon icon="mdi:arrow-right" class="size-5" />
  </button>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'

defineProps<{ label: string }>()
</script>
