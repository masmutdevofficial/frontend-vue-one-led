<template>
  <section class="min-h-screen bg-slate-50">
    <div class="mx-auto flex min-h-screen max-w-7xl flex-col items-center justify-center px-6 text-center">

      <!-- Floating illustration -->
      <div class="relative mb-6 flex h-44 w-44 items-center justify-center">
        <div class="absolute inset-0 rounded-full bg-teal-50 opacity-70"></div>
        <div class="absolute inset-4 rounded-full bg-teal-100/60"></div>
        <Icon icon="mdi:map-search-outline" class="relative z-10 text-[72px] text-teal-400" />
      </div>

      <!-- 404 badge -->
      <div class="inline-flex items-center gap-2 rounded-full border border-slate-100 bg-white px-4 py-2 shadow-sm">
        <Icon icon="mdi:alert-circle-outline" class="text-[16px] text-amber-400" />
        <span class="text-xs font-semibold tracking-wide text-slate-500">Error 404</span>
      </div>

      <!-- Heading -->
      <h1 class="mt-5 text-[2.75rem] font-black leading-[1.05] tracking-tight text-slate-950">
        Page <span class="text-teal-500">Not Found</span>
      </h1>
      <p class="mx-auto mt-3 max-w-75 text-sm font-medium leading-relaxed text-slate-400">
        Oops! The page you're looking for doesn't exist or has been moved.
      </p>

      <!-- Actions -->
      <div class="mt-8 flex w-full max-w-65 flex-col gap-3">
        <button
          type="button"
          class="flex items-center justify-between rounded-xl bg-slate-950 px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-slate-950/15 active:scale-[0.98] transition-transform"
          @click="router.push('/dashboard')"
        >
          <span>Back to Dashboard</span>
          <Icon icon="mdi:view-dashboard-outline" class="text-[18px]" />
        </button>
        <button
          type="button"
          class="flex items-center justify-between rounded-xl border-2 border-slate-200 bg-white px-5 py-3.5 text-sm font-semibold text-slate-700 active:scale-[0.98] transition-transform"
          @click="router.back()"
        >
          <span>Go Back</span>
          <Icon icon="mdi:arrow-left" class="text-[18px]" />
        </button>
      </div>

      <!-- Decorative footer -->
      <div class="mt-12 flex items-center gap-2 text-[11px] font-medium text-slate-300">
        <Icon icon="mdi:shield-check-outline" class="text-[14px] text-teal-300" />
        <span>CryptoWallet &mdash; Secure. Simple. Yours.</span>
      </div>

    </div>
  </section>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { useRouter } from 'vue-router'

const router = useRouter()
</script>
