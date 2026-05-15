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
            {{ isForgot ? 'Reset' : 'Enter' }}<br /><span class="text-teal-500">{{ isForgot ? 'Password' : 'OTP Code' }}</span>
          </h2>
          <p class="mt-2 text-sm font-medium text-slate-500 sm:mt-3 sm:text-base">
            {{ isForgot ? 'Enter the OTP sent to your email and set a new password.' : 'We have sent a 6-digit verification code to your email.' }}
          </p>
        </div>
        <img src="/images/wallet-image.png" alt="Crypto Wallet" class="hidden w-full h-auto object-contain sm:block lg:hidden" />
      </div>

      <div class="mt-6 grid grid-cols-6 gap-2">
        <input
          v-for="(_, i) in 6"
          :key="i"
          :ref="el => { if (el) inputs[i] = el as HTMLInputElement }"
          v-model="otp[i]"
          type="text"
          inputmode="numeric"
          maxlength="1"
          class="h-11 w-full rounded-xl border border-slate-100 bg-white text-center text-xl font-black text-slate-950 shadow-sm outline-none transition focus:border-teal-400 focus:ring-1 focus:ring-teal-300 sm:h-14 sm:text-2xl"
          @keydown="onKeydown($event, i)"
          @input="onInput($event, i)"
          @paste="onPaste"
        />
      </div>

      <!-- New password fields for forgot-password flow -->
      <div v-if="isForgot" class="mt-4 grid gap-3">
        <div class="flex items-center gap-3 rounded-xl border border-slate-100 bg-white px-4 py-3 shadow-sm shadow-slate-200/40 transition focus-within:border-teal-400 focus-within:ring-1 focus-within:ring-teal-300">
          <span class="grid size-9 shrink-0 place-items-center rounded-xl border border-slate-100 bg-white text-teal-500 shadow-sm">
            <Icon icon="mdi:lock-outline" class="size-5" />
          </span>
          <div class="min-w-0 flex-1">
            <p class="text-xs font-semibold tracking-wide text-slate-400">New Password</p>
            <input :type="showPassword ? 'text' : 'password'" v-model="newPassword" placeholder="At least 8 characters"
              class="mt-0.5 w-full bg-transparent text-sm font-semibold text-slate-950 placeholder:font-normal placeholder:text-slate-400 outline-none" />
          </div>
          <button type="button" class="shrink-0 text-slate-400 hover:text-slate-700 transition" @click="showPassword = !showPassword">
            <Icon :icon="showPassword ? 'mdi:eye-off-outline' : 'mdi:eye-outline'" class="size-5" />
          </button>
        </div>
      </div>

      <p class="mt-5 text-center text-xs font-semibold text-slate-500">
        Didn't receive the code?
        <button v-if="resendCooldown === 0" type="button" class="font-semibold text-teal-500" @click="handleResend">Resend Code</button>
        <span v-else class="font-semibold text-teal-500">Resend in {{ String(Math.floor(resendCooldown / 60)).padStart(2, '0') }}:{{ String(resendCooldown % 60).padStart(2, '0') }}</span>
      </p>

      <div class="mt-5">
        <button type="button" :disabled="loading" class="flex w-full items-center justify-center rounded-xl bg-[#020a22] px-5 py-3.5 text-base font-semibold tracking-wide text-white shadow-lg shadow-slate-950/20 transition hover:-translate-y-0.5 hover:shadow-xl disabled:opacity-60 disabled:cursor-not-allowed" @click="handleVerify">
          <span class="flex-1 text-center ml-4">{{ loading ? 'Verifying…' : (isForgot ? 'Reset Password' : 'Verify Code') }}</span>
          <Icon icon="mdi:arrow-right" class="size-5" />
        </button>
      </div>

      <button type="button" class="mt-5 flex w-full items-center gap-3 text-sm font-semibold text-slate-500" @click="goBack">
        <span class="h-px flex-1 bg-slate-100"></span>
        <span>Change <b class="font-semibold text-teal-500">Email</b></span>
        <span class="h-px flex-1 bg-slate-100"></span>
      </button>
    </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { Icon } from '@iconify/vue'
import { useAuthStore, ApiError } from '../../stores/auth'
import { useToast } from '../../composables/useToast'

const router = useRouter()
const auth   = useAuthStore()
const toast  = useToast()

const otp         = ref<string[]>(Array(6).fill(''))
const inputs      = ref<HTMLInputElement[]>([])
const loading     = ref(false)
const newPassword  = ref('')
const showPassword = ref(false)
const resendCooldown = ref(30)

const isForgot = computed(() => auth.otpContext === 'forgot')

let cooldownTimer: ReturnType<typeof setInterval> | null = null

onMounted(() => {
  cooldownTimer = setInterval(() => {
    if (resendCooldown.value > 0) resendCooldown.value--
  }, 1000)
})

onUnmounted(() => {
  if (cooldownTimer) clearInterval(cooldownTimer)
})

function otpCode() { return otp.value.join('') }

function onInput(e: Event, index: number) {
  const input = e.target as HTMLInputElement
  const val = input.value.replace(/\D/g, '').slice(-1)
  otp.value[index] = val
  input.value = val
  if (val && index < 5) inputs.value[index + 1]?.focus()
}

function onKeydown(e: KeyboardEvent, index: number) {
  if (e.key === 'Backspace' && !otp.value[index] && index > 0) {
    inputs.value[index - 1]?.focus()
  }
}

function onPaste(e: ClipboardEvent) {
  e.preventDefault()
  const digits = (e.clipboardData?.getData('text') ?? '').replace(/\D/g, '').slice(0, 6).split('')
  digits.forEach((d, i) => { otp.value[i] = d })
  inputs.value[Math.min(digits.length, 5)]?.focus()
}

function goBack() {
  auth.pendingEmail = ''
  router.push(auth.otpContext === 'register' ? '/register' : '/login')
}

async function handleVerify() {
  const code = otpCode()
  if (code.length < 6) { toast.warning('Please enter the full 6-digit code.'); return }

  if (isForgot.value) {
    if (newPassword.value.length < 8) { toast.warning('New password must be at least 8 characters.'); return }
    loading.value = true
    try {
      await auth.resetPassword(auth.pendingEmail, code, newPassword.value)
      toast.success('Password reset successfully. Please log in.')
      auth.pendingEmail = ''
      router.push('/login')
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : 'Failed to reset password.')
    } finally {
      loading.value = false
    }
    return
  }

  loading.value = true
  try {
    const wasRegister = auth.otpContext === 'register'
    await auth.verifyOtp(auth.pendingEmail, code)
    if (wasRegister) {
      toast.success('Akun berhasil diverifikasi! Selamat datang.')
    }
    router.push('/dashboard')
  } catch (err) {
    toast.error(err instanceof ApiError ? err.message : 'OTP verification failed.')
  } finally {
    loading.value = false
  }
}

async function handleResend() {
  try {
    const res = await auth.resendOtp(auth.pendingEmail)
    resendCooldown.value = 30
    toast.success('OTP resent.')
    if (res._dev_otp) toast.info(`[DEV] OTP: ${res._dev_otp}`, 15000)
  } catch (err) {
    toast.error(err instanceof ApiError ? err.message : 'Failed to resend OTP.')
  }
}
</script>