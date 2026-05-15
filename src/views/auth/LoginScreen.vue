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
            Welcome<br /><span class="text-teal-500">Back</span>
          </h2>
          <p class="mt-2 text-sm font-medium text-slate-500 sm:mt-3 sm:text-base">Sign in to access your wallet securely.</p>
        </div>
        <img src="/images/wallet-image.png" alt="Crypto Wallet" class="hidden w-full h-auto object-contain sm:block lg:hidden" />
      </div>

      <div class="mt-6 grid gap-3">
        <div class="flex items-center gap-3 rounded-xl border border-slate-100 bg-white px-4 py-3 shadow-sm shadow-slate-200/40 transition focus-within:border-teal-400 focus-within:ring-1 focus-within:ring-teal-300">
          <span class="grid size-9 shrink-0 place-items-center rounded-xl border border-slate-100 bg-white text-teal-500 shadow-sm">
            <Icon icon="mdi:email-outline" class="size-5" />
          </span>
          <div class="min-w-0 flex-1">
            <p class="text-xs font-semibold tracking-wide text-slate-400">Email Address</p>
            <input type="email" inputmode="email" :value="email" placeholder="you@example.com"
              class="mt-0.5 w-full bg-transparent text-sm font-semibold text-slate-950 placeholder:font-normal placeholder:text-slate-400 outline-none"
              @input="email = ($event.target as HTMLInputElement).value" />
          </div>
        </div>
        <div class="flex items-center gap-3 rounded-xl border border-slate-100 bg-white px-4 py-3 shadow-sm shadow-slate-200/40 transition focus-within:border-teal-400 focus-within:ring-1 focus-within:ring-teal-300">
          <span class="grid size-9 shrink-0 place-items-center rounded-xl border border-slate-100 bg-white text-teal-500 shadow-sm">
            <Icon icon="mdi:lock-outline" class="size-5" />
          </span>
          <div class="min-w-0 flex-1">
            <p class="text-xs font-semibold tracking-wide text-slate-400">Password</p>
            <input :type="showPassword ? 'text' : 'password'" :value="password" placeholder="Enter your password"
              class="mt-0.5 w-full bg-transparent text-sm font-semibold text-slate-950 placeholder:font-normal placeholder:text-slate-400 outline-none"
              @input="password = ($event.target as HTMLInputElement).value" />
          </div>
          <button type="button" class="shrink-0 text-slate-400 hover:text-slate-700 transition" @click="showPassword = !showPassword">
            <Icon :icon="showPassword ? 'mdi:eye-off-outline' : 'mdi:eye-outline'" class="size-5" />
          </button>
        </div>
      </div>

      <div class="mt-3 text-right">
        <button type="button" class="text-xs font-normal text-teal-500" @click="router.push('/forgot')">Forgot Password?</button>
      </div>

      <div class="mt-4">
        <button type="button" :disabled="loading" class="flex w-full items-center justify-center rounded-xl bg-[#020a22] px-5 py-3.5 text-base font-semibold tracking-wide text-white shadow-lg shadow-slate-950/20 transition hover:-translate-y-0.5 hover:shadow-xl disabled:opacity-60 disabled:cursor-not-allowed" @click="handleLogin">
          <span class="flex-1 text-center ml-4">{{ loading ? 'Signing in…' : 'Log In' }}</span>
          <Icon icon="mdi:arrow-right" class="size-5" />
        </button>
      </div>
      <div class="mt-4">
        <div class="flex items-center gap-4 py-1 text-slate-500">
          <span class="h-px flex-1 bg-slate-100"></span>
          <span class="grid size-10 place-items-center rounded-full border border-slate-100 bg-white text-lg font-medium">or</span>
          <span class="h-px flex-1 bg-slate-100"></span>
        </div>
      </div>

      <div class="mt-4 grid gap-3">
        <button type="button" class="flex w-full items-center justify-center gap-3 rounded-xl border border-slate-100 bg-white px-4 py-3 text-sm font-medium tracking-wide text-slate-950 shadow-sm transition hover:bg-slate-50">
          <img src="/images/google-logo.png" alt="google logo" class="size-5 object-contain" />
          <span>Continue with Google</span>
        </button>
        <button type="button" class="flex w-full items-center justify-center gap-3 rounded-xl border border-slate-100 bg-white px-4 py-3 text-sm font-medium tracking-wide text-slate-950 shadow-sm transition hover:bg-slate-50">
          <img src="/images/apple-logo.png" alt="apple logo" class="size-5 object-contain" />
          <span>Continue with Apple</span>
        </button>
      </div>

      <p class="mt-5 text-center text-sm font-medium text-slate-500">
        Don't have an account? <button type="button" class="font-semibold text-teal-500" @click="router.push('/register')">Sign Up</button>
      </p>
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

const router   = useRouter()
const auth     = useAuthStore()
const toast    = useToast()

const email       = ref('')
const password    = ref('')
const showPassword = ref(false)
const loading     = ref(false)

async function handleLogin() {
  if (!email.value || !password.value) {
    toast.warning('Please enter your email and password.')
    return
  }
  loading.value = true
  try {
    await auth.login(email.value.trim(), password.value)
    router.push('/dashboard')
  } catch (err) {
    toast.error(err instanceof ApiError ? err.message : 'Login failed. Please try again.')
  } finally {
    loading.value = false
  }
}
</script>
