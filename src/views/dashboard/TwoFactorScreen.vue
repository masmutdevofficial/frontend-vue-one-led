<template>
  <DashboardLayout>
    <section class="min-h-screen bg-[#f6f8fb] px-4 pt-6 pb-10">
      <div class="mx-auto max-w-lg">

        <!-- Header -->
        <div class="flex items-center gap-3">
          <button
            type="button"
            class="flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-sm active:scale-95"
            @click="router.back()"
          >
            <Icon icon="mdi:arrow-left" class="text-[22px] text-[#17212f]" />
          </button>
          <h1 class="text-[28px] font-semibold leading-none tracking-tight text-[#17212f]">Two-Factor Auth</h1>
        </div>

        <!-- Loading -->
        <div v-if="pageLoading" class="mt-8 flex justify-center">
          <svg class="size-8 animate-spin text-teal-500" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" stroke-dasharray="31" stroke-dashoffset="12" />
          </svg>
        </div>

        <template v-else>
          <!-- Status card -->
          <div class="mt-6 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
            <div class="flex items-center gap-4">
              <div class="flex h-14 w-14 shrink-0 items-center justify-center rounded-full"
                :class="enabled ? 'bg-teal-50' : 'bg-slate-100'">
                <Icon
                  :icon="enabled ? 'mdi:shield-check' : 'mdi:shield-off-outline'"
                  class="text-3xl"
                  :class="enabled ? 'text-teal-500' : 'text-slate-400'"
                />
              </div>
              <div class="flex-1">
                <p class="text-base font-semibold text-slate-900">Authenticator App</p>
                <p class="mt-0.5 text-sm font-medium" :class="enabled ? 'text-teal-600' : 'text-slate-400'">
                  {{ enabled ? 'Enabled — protected' : 'Not enabled' }}
                </p>
              </div>
              <span
                class="rounded-full px-3 py-1 text-xs font-bold"
                :class="enabled ? 'bg-teal-100 text-teal-700' : 'bg-slate-100 text-slate-500'"
              >
                {{ enabled ? 'ON' : 'OFF' }}
              </span>
            </div>
          </div>

          <!-- Info -->
          <p class="mt-4 text-sm font-medium leading-6 text-slate-500">
            Two-factor authentication adds a second layer of security to your account. You'll need a
            <span class="font-semibold text-slate-700">Google Authenticator</span> code every time you log in.
          </p>

          <!-- ── SETUP FLOW (disabled state) ──────────────────────────────── -->
          <template v-if="!enabled">

            <!-- Step 1: Show QR code -->
            <div v-if="step === 'scan'" class="mt-6">
              <div v-if="setupLoading" class="flex justify-center py-12">
                <svg class="size-8 animate-spin text-teal-500" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" stroke-dasharray="31" stroke-dashoffset="12" />
                </svg>
              </div>
              <template v-else>
                <div class="rounded-2xl border border-teal-100 bg-white p-5 shadow-sm">
                  <p class="mb-4 text-sm font-semibold text-slate-900">
                    1. Scan this QR code with Google Authenticator
                  </p>
                  <div class="flex justify-center">
                    <img :src="qrCode" alt="2FA QR Code" class="w-52 h-52 rounded-xl" />
                  </div>
                  <div class="mt-4">
                    <p class="text-xs font-semibold text-slate-500 mb-1">Or enter this key manually:</p>
                    <div class="flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-2.5">
                      <code class="flex-1 break-all text-xs font-mono text-slate-700 tracking-widest select-all">{{ secretKey }}</code>
                      <button type="button" class="shrink-0 text-teal-500" @click="copySecret">
                        <Icon :icon="copied ? 'mdi:check' : 'mdi:content-copy'" class="text-lg" />
                      </button>
                    </div>
                  </div>
                </div>

                <div class="mt-4 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
                  <p class="mb-3 text-sm font-semibold text-slate-900">
                    2. Enter the 6-digit code from Google Authenticator
                  </p>
                  <p v-if="codeError" class="mb-3 rounded-xl bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-500">
                    {{ codeError }}
                  </p>
                  <input
                    v-model="otpCode"
                    type="text"
                    inputmode="numeric"
                    maxlength="6"
                    placeholder="000000"
                    class="h-14 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-center text-2xl font-bold tracking-[0.4em] text-slate-950 outline-none focus:border-teal-400 focus:bg-white transition"
                    @keyup.enter="confirmEnable"
                  />
                  <button
                    type="button"
                    :disabled="otpCode.length !== 6 || enabling"
                    class="mt-4 w-full rounded-2xl bg-teal-500 py-3.5 text-sm font-semibold text-white transition hover:bg-teal-600 active:scale-95 disabled:opacity-50"
                    @click="confirmEnable"
                  >
                    <span v-if="enabling" class="flex items-center justify-center gap-2">
                      <svg class="size-4 animate-spin" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" stroke-dasharray="31" stroke-dashoffset="12" /></svg>
                      Verifying…
                    </span>
                    <span v-else>Verify &amp; Enable</span>
                  </button>
                </div>
              </template>
            </div>

            <!-- Default: Enable button -->
            <button
              v-else
              type="button"
              class="mt-6 w-full rounded-2xl bg-teal-500 py-3.5 text-sm font-semibold text-white transition hover:bg-teal-600 active:scale-95"
              @click="startSetup"
            >
              Enable Two-Factor Authentication
            </button>

          </template>

          <!-- ── DISABLE FLOW (enabled state) ──────────────────────────────── -->
          <template v-else>
            <div v-if="step === 'disable'" class="mt-6 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
              <p class="mb-3 text-sm font-semibold text-slate-900">
                Enter the 6-digit code from Google Authenticator to disable 2FA
              </p>
              <p v-if="codeError" class="mb-3 rounded-xl bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-500">
                {{ codeError }}
              </p>
              <input
                v-model="otpCode"
                type="text"
                inputmode="numeric"
                maxlength="6"
                placeholder="000000"
                class="h-14 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-center text-2xl font-bold tracking-[0.4em] text-slate-950 outline-none focus:border-teal-400 focus:bg-white transition"
                @keyup.enter="confirmDisable"
              />
              <div class="mt-4 grid grid-cols-2 gap-3">
                <button
                  type="button"
                  class="rounded-2xl border border-slate-200 bg-white py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 active:scale-95"
                  @click="step = null; otpCode = ''; codeError = ''"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  :disabled="otpCode.length !== 6 || disabling"
                  class="rounded-2xl bg-red-500 py-3 text-sm font-semibold text-white transition hover:bg-red-600 active:scale-95 disabled:opacity-50"
                  @click="confirmDisable"
                >
                  <span v-if="disabling" class="flex items-center justify-center gap-2">
                    <svg class="size-4 animate-spin" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" stroke-dasharray="31" stroke-dashoffset="12" /></svg>
                    Disabling…
                  </span>
                  <span v-else>Disable 2FA</span>
                </button>
              </div>
            </div>

            <button
              v-else
              type="button"
              class="mt-6 w-full rounded-2xl border border-red-200 bg-white py-3.5 text-sm font-semibold text-red-500 transition hover:bg-red-50 active:scale-95"
              @click="step = 'disable'; otpCode = ''; codeError = ''"
            >
              Disable Two-Factor Authentication
            </button>
          </template>

        </template>
      </div>
    </section>
  </DashboardLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter }      from 'vue-router'
import { Icon }           from '@iconify/vue'
import DashboardLayout    from '@/layouts/DashboardLayout.vue'
import { makeApi }        from '@/services/api'
import { useAuthStore }   from '@/stores/auth'
import { useToast }       from '@/composables/useToast'

const router = useRouter()
const auth   = useAuthStore()
const toast  = useToast()

function api() { return makeApi(auth.accessToken!) }

const pageLoading = ref(true)
const enabled     = ref(false)

const step       = ref<null | 'scan' | 'disable'>(null)
const setupLoading = ref(false)
const enabling   = ref(false)
const disabling  = ref(false)
const qrCode     = ref('')
const secretKey  = ref('')
const otpCode    = ref('')
const codeError  = ref('')
const copied     = ref(false)

onMounted(async () => {
  try {
    const data = await api().get<{ enabled: boolean }>('/twofa/status')
    enabled.value = data.enabled
  } catch { /* ignore */ }
  finally { pageLoading.value = false }
})

async function startSetup() {
  step.value = 'scan'
  setupLoading.value = true
  codeError.value = ''
  otpCode.value   = ''
  try {
    const data = await api().get<{ secret: string; qrCode: string }>('/twofa/setup')
    secretKey.value = data.secret
    qrCode.value    = data.qrCode
  } catch (err: any) {
    toast.error(err?.message ?? 'Failed to start 2FA setup.')
    step.value = null
  } finally {
    setupLoading.value = false
  }
}

async function confirmEnable() {
  if (otpCode.value.length !== 6) return
  codeError.value = ''
  enabling.value = true
  try {
    await api().post<{ ok: boolean }>('/twofa/enable', { code: otpCode.value })
    enabled.value = true
    step.value    = null
    otpCode.value = ''
    toast.success('Two-factor authentication enabled!')
  } catch (err: any) {
    codeError.value = err?.message ?? 'Invalid code. Please try again.'
    otpCode.value   = ''
  } finally {
    enabling.value = false
  }
}

async function confirmDisable() {
  if (otpCode.value.length !== 6) return
  codeError.value = ''
  disabling.value = true
  try {
    await api().post<{ ok: boolean }>('/twofa/disable', { code: otpCode.value })
    enabled.value = false
    step.value    = null
    otpCode.value = ''
    toast.success('Two-factor authentication disabled.')
  } catch (err: any) {
    codeError.value = err?.message ?? 'Invalid code. Please try again.'
    otpCode.value   = ''
  } finally {
    disabling.value = false
  }
}

async function copySecret() {
  try {
    await navigator.clipboard.writeText(secretKey.value)
    copied.value = true
    setTimeout(() => { copied.value = false }, 2000)
  } catch { /* ignore */ }
}
</script>
