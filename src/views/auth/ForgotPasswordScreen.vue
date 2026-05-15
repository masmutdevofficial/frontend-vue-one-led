<template>
  <section class="min-h-screen bg-slate-50">
    <div class="mx-auto flex min-h-screen max-w-7xl items-center justify-center px-4 py-8">
    <div class="w-full max-w-sm rounded-3xl bg-white px-6 py-8 lg:shadow-xl lg:shadow-slate-200/60">
      <div class="inline-flex items-center gap-3 rounded-full border border-slate-100 bg-white/95 px-4 py-3 shadow-sm shadow-slate-200/70">
        <span class="grid size-8 place-items-center rounded-full bg-teal-50 text-teal-500">
          <Icon icon="mdi:lock" class="size-4" />
        </span>
        <span class="text-sm font-normal tracking-wide text-slate-950">Secure. Simple. Yours.</span>
      </div>
      <div class="mt-4 grid items-center gap-2 sm:grid-cols-[1fr_180px] lg:grid-cols-1">
        <div>
          <h2 class="text-3xl font-black leading-tight tracking-tight text-slate-950 sm:text-4xl lg:text-3xl">
            Forgot<br /><span class="text-teal-500">Password</span>
          </h2>
          <p class="mt-2 text-sm font-medium text-slate-500 sm:mt-3 sm:text-base">Enter your email to receive a password reset link.</p>
        </div>
        <img src="/images/wallet-image.png" alt="Crypto Wallet" class="hidden w-full h-auto object-contain sm:block lg:hidden" />
      </div>

      <div class="mt-6">
        <div class="flex items-center gap-3 rounded-xl border border-slate-100 bg-white px-4 py-3 shadow-sm shadow-slate-200/40 transition focus-within:border-teal-400 focus-within:ring-1 focus-within:ring-teal-300">
          <span class="grid size-9 shrink-0 place-items-center rounded-xl border border-slate-100 bg-white text-teal-500 shadow-sm">
            <Icon icon="mdi:email-outline" class="size-5" />
          </span>
          <div class="min-w-0 flex-1">
            <p class="text-xs font-semibold tracking-wide text-slate-400">Email Address</p>
            <input type="email" inputmode="email" :value="email" placeholder="Enter your email address"
              class="mt-0.5 w-full bg-transparent text-sm font-semibold text-slate-950 placeholder:font-normal placeholder:text-slate-400 outline-none"
              @input="email = ($event.target as HTMLInputElement).value" />
          </div>
        </div>
      </div>

      <p class="mt-4 text-xs font-semibold text-slate-500">We will send a secure reset link to your inbox.</p>

      <div class="mt-5">
        <button type="button" :disabled="loading" class="flex w-full items-center justify-center rounded-xl bg-[#020a22] px-5 py-3.5 text-base font-semibold tracking-wide text-white shadow-lg shadow-slate-950/20 transition hover:-translate-y-0.5 hover:shadow-xl disabled:opacity-60 disabled:cursor-not-allowed" @click="handleForgot">
          <span class="flex-1 text-center ml-4">{{ loading ? 'Sending…' : 'Send Reset Code' }}</span>
          <Icon icon="mdi:arrow-right" class="size-5" />
        </button>
      </div>

      <button type="button" class="mt-6 flex w-full items-center gap-3 text-sm font-semibold text-slate-500" @click="router.push('/login')">
        <span class="h-px flex-1 bg-slate-100"></span>
        <span>Back to <b class="font-semibold text-teal-500">Log In</b></span>
        <span class="h-px flex-1 bg-slate-100"></span>
      </button>
    </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Icon } from '@iconify/vue'
import { useAuthStore, ApiError } from '../../stores/auth'
import { useToast } from '../../composables/useToast'

const router  = useRouter()
const auth    = useAuthStore()
const toast   = useToast()

const email   = ref('')
const loading = ref(false)

async function handleForgot() {
  if (!email.value) { toast.warning('Please enter your email address.'); return }
  loading.value = true
  try {
    const res = await auth.forgotPassword(email.value.trim())
    auth.pendingEmail = email.value.trim()
    auth.otpContext   = 'forgot'
    if (res._dev_otp) toast.info(`[DEV] OTP: ${res._dev_otp}`, 15000)
    toast.success(res.message)
    router.push('/otp')
  } catch (err) {
    toast.error(err instanceof ApiError ? err.message : 'Failed to send OTP.')
  } finally {
    loading.value = false
  }
}
</script>