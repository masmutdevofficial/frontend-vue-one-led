<template>
  <RouterView />

  <!-- Global toast notifications -->
  <Teleport to="body">
    <div class="fixed bottom-5 left-1/2 z-[9999] flex -translate-x-1/2 flex-col-reverse items-center gap-2 pointer-events-none">
      <TransitionGroup name="toast">
        <div
          v-for="t in toasts"
          :key="t.id"
          class="pointer-events-auto flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold shadow-lg"
          :class="{
            'bg-emerald-500 text-white': t.type === 'success',
            'bg-red-500 text-white':     t.type === 'error',
            'bg-amber-400 text-slate-950': t.type === 'warning',
            'bg-slate-800 text-white':  t.type === 'info',
          }"
        >
          <span>{{ t.message }}</span>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { useToast } from './composables/useToast'
const { toasts } = useToast()
</script>

<style>
.toast-enter-active, .toast-leave-active { transition: all 0.3s ease; }
.toast-enter-from  { opacity: 0; transform: translateY(12px); }
.toast-leave-to    { opacity: 0; transform: translateY(12px); }
#tv-attr-logo {
  display:none !important;
}
</style>

