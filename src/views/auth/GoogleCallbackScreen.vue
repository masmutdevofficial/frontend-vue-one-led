<template>
  <section class="min-h-screen bg-slate-50 flex items-center justify-center px-4">
    <div class="w-full max-w-sm rounded-3xl bg-white px-6 py-10 text-center lg:shadow-xl lg:shadow-slate-200/60">
      <template v-if="!errorMsg">
        <div class="flex justify-center mb-4">
          <span class="grid size-14 place-items-center rounded-full bg-teal-50 text-teal-500">
            <Icon icon="mdi:loading" class="size-7 animate-spin" />
          </span>
        </div>
        <h2 class="text-xl font-black tracking-tight text-slate-950">Signing you in…</h2>
        <p class="mt-2 text-sm text-slate-500">Please wait while we verify your Google account.</p>
      </template>
      <template v-else>
        <div class="flex justify-center mb-4">
          <span class="grid size-14 place-items-center rounded-full bg-red-50 text-red-500">
            <Icon icon="mdi:alert-circle-outline" class="size-7" />
          </span>
        </div>
        <h2 class="text-xl font-black tracking-tight text-slate-950">Sign-in failed</h2>
        <p class="mt-2 text-sm text-slate-500">{{ errorMsg }}</p>
        <button
          type="button"
          class="mt-6 flex w-full items-center justify-center rounded-xl bg-[#020a22] px-5 py-3.5 text-base font-semibold tracking-wide text-white shadow-lg transition hover:-translate-y-0.5"
          @click="router.push('/login')"
        >
          Back to Login
        </button>
      </template>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Icon } from '@iconify/vue'
import { useOAuth } from '../../composables/useOAuth'

const router   = useRouter()
const errorMsg = ref('')
const { handleGoogleCallback } = useOAuth()

onMounted(async () => {
  try {
    await handleGoogleCallback()
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Google sign-in failed.'
    errorMsg.value = msg
    // Auto-redirect back to login after 3 s
    setTimeout(() => router.push('/login'), 3000)
  }
})
</script>
