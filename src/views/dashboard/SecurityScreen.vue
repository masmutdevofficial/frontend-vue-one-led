<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Icon } from '@iconify/vue'
import {
  startRegistration,
  startAuthentication,
  browserSupportsWebAuthn,
} from '@simplewebauthn/browser'
import DashboardLayout from '../../layouts/DashboardLayout.vue'
import { makeApi, ApiError } from '@/services/api'
import { useAuthStore } from '@/stores/auth'
import { useToast } from '@/composables/useToast'

const router = useRouter()
const auth   = useAuthStore()
const toast  = useToast()

function api() { return makeApi(auth.accessToken!) }

// ─── Biometric ───────────────────────────────────────────────────────────────
const biometricEnabled  = ref(false)
const biometricSupported = ref(false)
const biometricBusy     = ref(false)

onMounted(async () => {
  biometricSupported.value = browserSupportsWebAuthn()
  if (!biometricSupported.value) return
  try {
    const { enabled } = await api().get<{ enabled: boolean }>('/webauthn/status')
    biometricEnabled.value = enabled
  } catch { /* ignore */ }
})

async function toggleBiometric() {
  if (!biometricSupported.value) {
    toast.error('Your browser does not support passkeys.')
    return
  }
  if (biometricBusy.value) return
  biometricBusy.value = true

  try {
    if (!biometricEnabled.value) {
      // ── Register passkey ──────────────────────────────────────────────────
      const optionsJSON = await api().get<PublicKeyCredentialCreationOptionsJSON>(
        '/webauthn/register/options',
      )
      const regResponse = await startRegistration({ optionsJSON })
      await api().post('/webauthn/register/verify', regResponse)
      biometricEnabled.value = true
      toast.success('Biometric login enabled!')
    } else {
      // ── Remove passkeys ───────────────────────────────────────────────────
      await api().delete('/webauthn/credential')
      biometricEnabled.value = false
      toast.success('Biometric login disabled.')
    }
  } catch (err) {
    if ((err as Error).name === 'NotAllowedError') {
      toast.error('Passkey prompt was cancelled.')
    } else if ((err as Error).name === 'InvalidStateError') {
      toast.error('This authenticator is already registered.')
    } else {
      toast.error(err instanceof ApiError ? err.message : 'Biometric setup failed.')
    }
  } finally {
    biometricBusy.value = false
  }
}

// ─── Active view: null = list, 'password' | 'history' | 'devices' ────────────
type View = null | 'password' | 'history' | 'devices'
const activeView = ref<View>(null)

// ─── Change Password ─────────────────────────────────────────────────────────
const passwordForm = reactive({ old_password: '', new_password: '', confirm: '' })
const passwordError  = ref('')
const passwordBusy   = ref(false)
const showOld   = ref(false)
const showNew   = ref(false)
const showConfirm = ref(false)

function openPasswordModal() {
  passwordForm.old_password = ''
  passwordForm.new_password = ''
  passwordForm.confirm      = ''
  passwordError.value       = ''
  showOld.value     = false
  showNew.value     = false
  showConfirm.value = false
  activeView.value  = 'password'
}

async function submitChangePassword() {
  passwordError.value = ''
  if (!passwordForm.old_password) { passwordError.value = 'Old password is required.'; return }
  if (passwordForm.new_password.length < 8) { passwordError.value = 'New password must be at least 8 characters.'; return }
  if (passwordForm.new_password !== passwordForm.confirm) { passwordError.value = 'Passwords do not match.'; return }

  passwordBusy.value = true
  try {
    await api().post('/change-password', {
      old_password: passwordForm.old_password,
      new_password: passwordForm.new_password,
    })
    toast.success('Password changed successfully!')
    activeView.value = null
  } catch (err) {
    passwordError.value = err instanceof ApiError ? err.message : 'Failed to change password.'
  } finally {
    passwordBusy.value = false
  }
}

// ─── Login History ───────────────────────────────────────────────────────────
interface LoginRecord { id: number; ip_address: string | null; device_name: string | null; created_at: string }
const loginHistory = ref<LoginRecord[]>([])
const historyLoading = ref(false)

async function openHistory() {
  activeView.value  = 'history'
  historyLoading.value = true
  try {
    const data = await api().get<{ history: LoginRecord[] }>('/login-history')
    loginHistory.value = data.history
  } catch {
    loginHistory.value = []
  } finally {
    historyLoading.value = false
  }
}

// ─── Manage Devices ──────────────────────────────────────────────────────────
interface DeviceSession { id: string; ip_address: string | null; device_name: string | null; user_agent: string | null; last_seen_at: string; created_at: string }
const devices = ref<DeviceSession[]>([])
const devicesLoading = ref(false)
const revokingId = ref<string | null>(null)

async function openDevices() {
  activeView.value  = 'devices'
  devicesLoading.value = true
  try {
    const data = await api().get<{ devices: DeviceSession[] }>('/devices')
    devices.value = data.devices
  } catch {
    devices.value = []
  } finally {
    devicesLoading.value = false
  }
}

async function revokeDevice(id: string) {
  if (!confirm('Remove this device session?')) return
  revokingId.value = id
  try {
    await api().delete(`/devices/${id}`)
    devices.value = devices.value.filter(d => d.id !== id)
    toast.success('Device session removed.')
  } catch {
    toast.error('Failed to remove device.')
  } finally {
    revokingId.value = null
  }
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
function fmtDate(d: string) {
  return new Date(d).toLocaleString('id-ID', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

function deviceIcon(name: string | null) {
  const n = (name ?? '').toLowerCase()
  if (n.includes('iphone') || n.includes('ipad') || n.includes('android')) return 'mdi:cellphone'
  if (n.includes('mac'))    return 'mdi:apple'
  if (n.includes('windows') || n.includes('linux')) return 'mdi:monitor'
  return 'mdi:devices'
}

// Security item dispatch
function handleItem(title: string) {
  if (title === 'Change Password') openPasswordModal()
  else if (title === 'Login History') openHistory()
  else if (title === 'Manage Devices') openDevices()
}

const securityItems = [
  { title: 'Change Password',           desc: 'Update your password regularly',              icon: 'mdi:lock-outline',        type: 'link'   },
  { title: 'Biometric Login',           desc: 'Use biometrics to log in securely',           icon: 'mdi:fingerprint',         type: 'toggle' },
  { title: 'Two-Factor Authentication', desc: 'Add an extra layer of security',              icon: 'mdi:shield-key-outline',  type: 'link'   },
  { title: 'Anti-Phishing Code',        desc: 'Protect yourself from phishing attacks',      icon: 'mdi:email-outline',       type: 'link'   },
  { title: 'Login History',             desc: 'Review your recent login activity',           icon: 'mdi:clock-outline',       type: 'link'   },
  { title: 'Manage Devices',            desc: 'Manage devices with access to your account',  icon: 'mdi:monitor-cellphone',   type: 'link'   },
]
</script>

<template>
  <DashboardLayout>
    <section class="min-h-screen bg-[#f6f8fb] px-4 pt-6 pb-10">
      <div class="mx-auto">
        <div class="flex items-center gap-3">
          <button @click="router.back()" class="flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-sm active:scale-95">
            <Icon icon="mdi:arrow-left" class="text-[22px] text-[#17212f]" />
          </button>
          <h1 class="text-[28px] font-semibold leading-none tracking-tight text-[#17212f]">Security</h1>
        </div>

        <p class="mt-4 text-[15px] font-semibold text-[#5b6d9a]">Protect your account and assets.</p>

        <div class="mt-6 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
          <div
            v-for="item in securityItems"
            :key="item.title"
            class="flex w-full items-center justify-between border-b border-gray-100 px-4 py-5 text-left last:border-b-0 active:bg-gray-50"
            :class="item.type !== 'toggle' ? 'cursor-pointer' : ''"
            @click="item.type !== 'toggle' && handleItem(item.title)"
          >
            <div class="flex items-center gap-4">
              <div class="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#eafffb]">
                <Icon :icon="item.icon" class="text-[28px] text-[#20c7b7]" />
              </div>
              <div>
                <h2 class="text-[15px] font-semibold text-[#101b3f]">{{ item.title }}</h2>
                <p class="mt-1 text-[12px] font-semibold text-[#5b6d9a]">{{ item.desc }}</p>
              </div>
            </div>

            <template v-if="item.type === 'toggle'">
              <button
                @click.stop="toggleBiometric"
                :disabled="biometricBusy || !biometricSupported"
                class="relative h-8 w-14 shrink-0 rounded-full transition-colors duration-200 disabled:opacity-40"
                :class="biometricEnabled ? 'bg-[#12c7b2]' : 'bg-gray-200'"
                :title="!biometricSupported ? 'Not supported on this device' : ''"
              >
                <span
                  v-if="biometricBusy"
                  class="absolute inset-0 flex items-center justify-center"
                >
                  <svg class="size-4 animate-spin text-white" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" stroke-dasharray="31" stroke-dashoffset="12" /></svg>
                </span>
                <span
                  v-else
                  class="absolute top-0.75 h-6.5 w-6.5 rounded-full bg-white shadow-sm transition-all duration-200"
                  :class="biometricEnabled ? 'left-6.75' : 'left-0.75'"
                ></span>
              </button>
            </template>
            <template v-else>
              <Icon icon="mdi:chevron-right" class="text-[24px] text-[#6b82c4]" />
            </template>
          </div>
        </div>
      </div>
    </section>

    <!-- ═══════════════════════════════════════════════════════════
         CHANGE PASSWORD MODAL
    ════════════════════════════════════════════════════════════ -->
    <Teleport to="body">
      <Transition name="sheet">
        <div v-if="activeView === 'password'" class="fixed inset-0 z-50 flex flex-col">
          <div class="absolute inset-0 bg-black/40 backdrop-blur-sm" @click="activeView = null"></div>
          <div class="relative mt-auto max-h-[92vh] w-full overflow-y-auto rounded-t-3xl bg-white px-6 pt-5 pb-10 shadow-2xl lg:mx-auto lg:mb-auto lg:mt-auto lg:max-w-md lg:rounded-3xl">
            <!-- Header -->
            <div class="mb-5 flex items-center justify-between">
              <h3 class="text-xl font-semibold text-slate-950">Change Password</h3>
              <button @click="activeView = null" class="grid size-9 place-items-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 transition">
                <Icon icon="mdi:close" class="size-5" />
              </button>
            </div>

            <!-- Error -->
            <div v-if="passwordError" class="mb-4 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-600 flex items-center gap-2">
              <Icon icon="mdi:alert-circle-outline" class="shrink-0 text-lg" />
              {{ passwordError }}
            </div>

            <!-- Fields -->
            <div class="space-y-4">
              <!-- Old Password -->
              <div>
                <label class="mb-1.5 block text-sm font-semibold text-slate-700">Old Password</label>
                <div class="relative">
                  <input
                    v-model="passwordForm.old_password"
                    :type="showOld ? 'text' : 'password'"
                    placeholder="Enter old password"
                    class="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 pr-12 text-sm outline-none focus:border-teal-400 focus:bg-white transition"
                    @keyup.enter="submitChangePassword"
                  />
                  <button type="button" class="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" @click="showOld = !showOld">
                    <Icon :icon="showOld ? 'mdi:eye-off-outline' : 'mdi:eye-outline'" class="text-xl" />
                  </button>
                </div>
              </div>

              <!-- New Password -->
              <div>
                <label class="mb-1.5 block text-sm font-semibold text-slate-700">New Password</label>
                <div class="relative">
                  <input
                    v-model="passwordForm.new_password"
                    :type="showNew ? 'text' : 'password'"
                    placeholder="At least 8 characters"
                    class="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 pr-12 text-sm outline-none focus:border-teal-400 focus:bg-white transition"
                    @keyup.enter="submitChangePassword"
                  />
                  <button type="button" class="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" @click="showNew = !showNew">
                    <Icon :icon="showNew ? 'mdi:eye-off-outline' : 'mdi:eye-outline'" class="text-xl" />
                  </button>
                </div>
              </div>

              <!-- Confirm Password -->
              <div>
                <label class="mb-1.5 block text-sm font-semibold text-slate-700">Confirm New Password</label>
                <div class="relative">
                  <input
                    v-model="passwordForm.confirm"
                    :type="showConfirm ? 'text' : 'password'"
                    placeholder="Re-enter new password"
                    class="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 pr-12 text-sm outline-none focus:border-teal-400 focus:bg-white transition"
                    @keyup.enter="submitChangePassword"
                  />
                  <button type="button" class="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" @click="showConfirm = !showConfirm">
                    <Icon :icon="showConfirm ? 'mdi:eye-off-outline' : 'mdi:eye-outline'" class="text-xl" />
                  </button>
                </div>
              </div>
            </div>

            <button
              :disabled="passwordBusy"
              class="mt-6 w-full rounded-2xl bg-teal-500 py-3.5 text-sm font-semibold text-white transition active:scale-95 hover:bg-teal-600 disabled:opacity-60"
              @click="submitChangePassword"
            >
              <span v-if="passwordBusy" class="flex items-center justify-center gap-2">
                <svg class="size-4 animate-spin" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" stroke-dasharray="31" stroke-dashoffset="12" /></svg>
                Updating…
              </span>
              <span v-else>Update Password</span>
            </button>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- ═══════════════════════════════════════════════════════════
         LOGIN HISTORY MODAL
    ════════════════════════════════════════════════════════════ -->
    <Teleport to="body">
      <Transition name="sheet">
        <div v-if="activeView === 'history'" class="fixed inset-0 z-50 flex flex-col">
          <div class="absolute inset-0 bg-black/40 backdrop-blur-sm" @click="activeView = null"></div>
          <div class="relative mt-auto max-h-[88vh] w-full overflow-y-auto rounded-t-3xl bg-white px-5 pt-5 pb-10 shadow-2xl lg:mx-auto lg:mb-auto lg:mt-auto lg:max-w-md lg:rounded-3xl">
            <!-- Header -->
            <div class="mb-5 flex items-center justify-between">
              <h3 class="text-xl font-semibold text-slate-950">Login History</h3>
              <button @click="activeView = null" class="grid size-9 place-items-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 transition">
                <Icon icon="mdi:close" class="size-5" />
              </button>
            </div>

            <!-- Loading -->
            <div v-if="historyLoading" class="space-y-3">
              <div v-for="i in 5" :key="i" class="flex items-center gap-3 rounded-2xl bg-slate-50 p-4">
                <div class="h-10 w-10 animate-pulse rounded-full bg-slate-200"></div>
                <div class="flex-1 space-y-2">
                  <div class="h-3.5 w-32 animate-pulse rounded-full bg-slate-200"></div>
                  <div class="h-3 w-48 animate-pulse rounded-full bg-slate-100"></div>
                </div>
              </div>
            </div>

            <!-- Empty -->
            <div v-else-if="loginHistory.length === 0" class="py-12 text-center">
              <Icon icon="mdi:clock-outline" class="mx-auto mb-3 text-5xl text-slate-300" />
              <p class="text-sm text-slate-400">No login history yet.</p>
            </div>

            <!-- List -->
            <div v-else class="space-y-3">
              <div
                v-for="(record, i) in loginHistory"
                :key="record.id"
                class="flex items-start gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-4"
              >
                <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#eafffb]">
                  <Icon :icon="deviceIcon(record.device_name)" class="text-xl text-[#20c7b7]" />
                </div>
                <div class="flex-1 min-w-0">
                  <div class="flex items-center gap-2">
                    <p class="text-sm font-semibold text-slate-900 truncate">{{ record.device_name ?? 'Unknown Device' }}</p>
                    <span v-if="i === 0" class="shrink-0 rounded-full bg-teal-100 px-2 py-0.5 text-[11px] font-bold text-teal-600">Latest</span>
                  </div>
                  <p class="mt-0.5 text-xs text-slate-500">{{ record.ip_address ?? 'Unknown IP' }}</p>
                  <p class="mt-0.5 text-xs text-slate-400">{{ fmtDate(record.created_at) }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- ═══════════════════════════════════════════════════════════
         MANAGE DEVICES MODAL
    ════════════════════════════════════════════════════════════ -->
    <Teleport to="body">
      <Transition name="sheet">
        <div v-if="activeView === 'devices'" class="fixed inset-0 z-50 flex flex-col">
          <div class="absolute inset-0 bg-black/40 backdrop-blur-sm" @click="activeView = null"></div>
          <div class="relative mt-auto max-h-[88vh] w-full overflow-y-auto rounded-t-3xl bg-white px-5 pt-5 pb-10 shadow-2xl lg:mx-auto lg:mb-auto lg:mt-auto lg:max-w-md lg:rounded-3xl">
            <!-- Header -->
            <div class="mb-1 flex items-center justify-between">
              <h3 class="text-xl font-semibold text-slate-950">Active Devices</h3>
              <button @click="activeView = null" class="grid size-9 place-items-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 transition">
                <Icon icon="mdi:close" class="size-5" />
              </button>
            </div>
            <p class="mb-5 text-xs text-slate-400">Sessions currently logged in to your account.</p>

            <!-- Loading -->
            <div v-if="devicesLoading" class="space-y-3">
              <div v-for="i in 3" :key="i" class="flex items-center gap-3 rounded-2xl bg-slate-50 p-4">
                <div class="h-12 w-12 animate-pulse rounded-full bg-slate-200"></div>
                <div class="flex-1 space-y-2">
                  <div class="h-3.5 w-36 animate-pulse rounded-full bg-slate-200"></div>
                  <div class="h-3 w-48 animate-pulse rounded-full bg-slate-100"></div>
                </div>
              </div>
            </div>

            <!-- Empty -->
            <div v-else-if="devices.length === 0" class="py-12 text-center">
              <Icon icon="mdi:monitor-cellphone" class="mx-auto mb-3 text-5xl text-slate-300" />
              <p class="text-sm text-slate-400">No active sessions found.</p>
            </div>

            <!-- List -->
            <div v-else class="space-y-3">
              <div
                v-for="device in devices"
                :key="device.id"
                class="flex items-start gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-4"
              >
                <div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#eafffb]">
                  <Icon :icon="deviceIcon(device.device_name)" class="text-2xl text-[#20c7b7]" />
                </div>
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-semibold text-slate-900">{{ device.device_name ?? 'Unknown Device' }}</p>
                  <p class="mt-0.5 text-xs text-slate-500">{{ device.ip_address ?? 'Unknown IP' }}</p>
                  <p class="mt-0.5 text-xs text-slate-400">Last seen: {{ fmtDate(device.last_seen_at) }}</p>
                </div>
                <button
                  class="shrink-0 mt-1 rounded-2xl bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600 transition hover:bg-red-100 active:scale-95 disabled:opacity-40"
                  :disabled="revokingId === device.id"
                  @click="revokeDevice(device.id)"
                >
                  <span v-if="revokingId === device.id">
                    <svg class="size-3.5 animate-spin inline" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" stroke-dasharray="31" stroke-dashoffset="12" /></svg>
                  </span>
                  <span v-else>Revoke</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </DashboardLayout>
</template>

<style scoped>
.sheet-enter-active,
.sheet-leave-active { transition: transform 0.3s cubic-bezier(0.32, 0.72, 0, 1), opacity 0.3s ease; }
.sheet-enter-from,
.sheet-leave-to     { transform: translateY(100%); opacity: 0; }
</style>

