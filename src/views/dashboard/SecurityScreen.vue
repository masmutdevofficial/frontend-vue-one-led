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

// ─── Active view: null = list, 'password' ─────────────────────────────────────
type View = null | 'password'
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

// Security item dispatch
function handleItem(title: string) {
  if (title === 'Change Password')          openPasswordModal()
  else if (title === 'Login History')            router.push('/login-history')
  else if (title === 'Manage Devices')           router.push('/manage-devices')
  else if (title === 'Two-Factor Authentication') router.push('/two-factor')
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


  </DashboardLayout>
</template>

<style scoped>
.sheet-enter-active,
.sheet-leave-active { transition: transform 0.3s cubic-bezier(0.32, 0.72, 0, 1), opacity 0.3s ease; }
.sheet-enter-from,
.sheet-leave-to     { transform: translateY(100%); opacity: 0; }
</style>

