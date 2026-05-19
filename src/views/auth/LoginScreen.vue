<template>
  <section class="min-h-screen bg-slate-50">
    <div class="mx-auto flex min-h-screen max-w-7xl items-center justify-center px-4 py-8">
    <div class="w-full max-w-sm rounded-3xl bg-white px-6 py-8 lg:shadow-xl lg:shadow-slate-200/60">

      <!-- ══ 2FA STEP ══ -->
      <template v-if="step === '2fa'">
        <div class="flex flex-col items-center text-center">
          <div class="flex h-16 w-16 items-center justify-center rounded-full bg-teal-50">
            <Icon icon="mdi:shield-key-outline" class="text-3xl text-teal-500" />
          </div>
          <h2 class="mt-4 text-2xl font-black tracking-tight text-slate-950">Verification Required</h2>
          <p class="mt-2 text-sm font-medium text-slate-500">
            Enter the 6-digit code from your <span class="font-semibold">Google Authenticator</span> app.
          </p>
        </div>

        <div v-if="twoFaError" class="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">
          {{ twoFaError }}
        </div>

        <div class="mt-6">
          <input
            v-model="twoFaCode"
            type="text"
            inputmode="numeric"
            maxlength="6"
            placeholder="000000"
            class="h-16 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-center text-3xl font-bold tracking-[0.5em] text-slate-950 outline-none focus:border-teal-400 focus:bg-white transition"
            @keyup.enter="handle2Fa"
          />
        </div>

        <button
          type="button"
          :disabled="twoFaCode.length !== 6 || loading"
          class="mt-4 flex w-full items-center justify-center rounded-xl bg-[#020a22] px-5 py-3.5 text-base font-semibold tracking-wide text-white shadow-lg transition hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed"
          @click="handle2Fa"
        >
          <span class="flex-1 text-center ml-4">{{ loading ? 'Verifying\u2026' : 'Verify' }}</span>
          <Icon icon="mdi:arrow-right" class="size-5" />
        </button>

        <button
          type="button"
          class="mt-3 w-full text-center text-sm font-medium text-slate-400 hover:text-slate-600"
          @click="step = 'login'; twoFaCode = ''; twoFaError = ''"
        >
          &larr; Back to login
        </button>
      </template>

      <!-- ══ LOGIN STEP ══ -->
      <template v-else>
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
        <button type="button" class="flex w-full items-center justify-center gap-3 rounded-xl border border-slate-100 bg-white px-4 py-3 text-sm font-medium tracking-wide text-slate-950 shadow-sm transition hover:bg-slate-50" @click="enterFullscreen().then(() => signInWithGoogle())">
          <img src="/images/google-logo.png" alt="google logo" class="size-5 object-contain" />
          <span>Continue with Google</span>
        </button>
        <button
          v-if="passkeySupported"
          type="button"
          :disabled="passkeyLoading"
          class="flex w-full items-center justify-center gap-3 rounded-xl border border-slate-100 bg-white px-4 py-3 text-sm font-medium tracking-wide text-slate-950 shadow-sm transition hover:bg-slate-50 disabled:opacity-60"
          @click="handlePasskeyLogin"
        >
          <Icon v-if="!passkeyLoading" icon="mdi:fingerprint" class="size-5 text-teal-500" />
          <svg v-else class="size-5 animate-spin text-teal-500" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" stroke-dasharray="31" stroke-dashoffset="12" />
          </svg>
          <span>{{ passkeyLoading ? 'Verifying…' : 'Continue with Passkey' }}</span>
        </button>
      </div>

      <p class="mt-5 text-center text-sm font-medium text-slate-500">
        Don't have an account? <button type="button" class="font-semibold text-teal-500" @click="router.push('/register')">Sign Up</button>
      </p>
      </template><!-- end v-else login step -->
    </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Icon } from '@iconify/vue'
import { startAuthentication, browserSupportsWebAuthn } from '@simplewebauthn/browser'
import { enterFullscreen } from '@/composables/useFullscreen'
import type { PublicKeyCredentialRequestOptionsJSON } from '@simplewebauthn/browser'
import { useAuthStore, ApiError } from '../../stores/auth'
import { authApi } from '../../services/api'
import { useToast } from '../../composables/useToast'
import { useOAuth } from '../../composables/useOAuth'

const router   = useRouter()
const auth     = useAuthStore()
const toast    = useToast()
const { signInWithGoogle } = useOAuth()

const email        = ref('')
const password     = ref('')
const showPassword = ref(false)
const loading      = ref(false)
const passkeyLoading = ref(false)
const passkeySupported = ref(browserSupportsWebAuthn())

// 2FA state
const step        = ref<'login' | '2fa'>('login')
const twoFaToken  = ref('')
const twoFaCode   = ref('')
const twoFaError  = ref('')

async function handleLogin() {
  enterFullscreen()
  if (!email.value || !password.value) {
    toast.warning('Please enter your email and password.')
    return
  }
  loading.value = true
  try {
    const data = await auth.login(email.value.trim(), password.value)
    if ('requires_2fa' in data && data.requires_2fa) {
      twoFaToken.value = data._2fa_token
      step.value       = '2fa'
    } else {
      router.push('/dashboard')
    }
  } catch (err) {
    toast.error(err instanceof ApiError ? err.message : 'Login failed. Please try again.')
  } finally {
    loading.value = false
  }
}

async function handle2Fa() {
  if (twoFaCode.value.length !== 6) return
  twoFaError.value = ''
  loading.value    = true
  try {
    const data = await authApi.verify2fa(twoFaToken.value, twoFaCode.value)
    await auth.loginFromOAuth(data)
    router.push('/dashboard')
  } catch (err) {
    twoFaError.value = err instanceof ApiError ? err.message : 'Invalid code. Please try again.'
    twoFaCode.value  = ''
  } finally {
    loading.value = false
  }
}

async function handlePasskeyLogin() {
  enterFullscreen()
  if (!passkeySupported.value) {
    toast.error('Passkeys are not supported on this device.')
    return
  }
  if (!email.value.trim()) {
    toast.warning('Please enter your email address first.')
    return
  }
  passkeyLoading.value = true
  try {
    // Step 1: get challenge options from server
    const { _token, ...optionsJSON } = await authApi.webauthnOptions(email.value.trim())

    // Step 2: trigger biometric prompt
    const assertion = await startAuthentication({ optionsJSON: optionsJSON as unknown as PublicKeyCredentialRequestOptionsJSON })

    // Step 3: verify assertion and receive JWT
    const data = await authApi.webauthnVerify({ _token, ...assertion })

    // Step 4: apply session and navigate
    await auth.loginFromOAuth(data)
    router.push('/dashboard')
  } catch (err: any) {
    if (err?.name === 'NotAllowedError') {
      toast.error('Biometric authentication was cancelled.')
    } else {
      toast.error(err instanceof ApiError ? err.message : (err?.message ?? 'Passkey login failed.'))
    }
  } finally {
    passkeyLoading.value = false
  }
}
</script>
