<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Icon } from '@iconify/vue'
import DashboardLayout from '../../layouts/DashboardLayout.vue'
import { useAuthStore } from '@/stores/auth'
import { makeUserApi } from '@/services/api'

const router = useRouter()
const auth   = useAuthStore()

onMounted(() => auth.refreshProfile())

// ── Status helpers ──────────────────────────────────────────────────────────
const ktpStatus = computed(() => auth.profile?.ktp_status ?? null)
const isVerified = computed(() => ktpStatus.value === 'Verified')
const isRejected = computed(() => ktpStatus.value === 'Rejected')
const isPending  = computed(() => ktpStatus.value === 'Pending')

type StatusType = 'success' | 'pending' | 'rejected' | 'none'
type StepInfo   = { status: string; statusType: StatusType }
type ModalKey   = 'identity' | 'selfie' | 'bank' | null

const identityStep = computed<StepInfo>(() => {
  if (isVerified.value)                            return { status: 'Verified',     statusType: 'success'  }
  if (isRejected.value)                            return { status: 'Rejected',     statusType: 'rejected' }
  if (isPending.value || auth.profile?.ktp_image)  return { status: 'Under Review', statusType: 'pending'  }
  return                                                  { status: 'Not Started',  statusType: 'none'     }
})

const selfieStep = computed<StepInfo>(() => {
  if (isVerified.value)         return { status: 'Verified',     statusType: 'success' }
  if (auth.profile?.selfie_url) return { status: 'Under Review', statusType: 'pending' }
  return                               { status: 'Not Started',  statusType: 'none'    }
})

const bankStep = computed<StepInfo>(() => auth.profile?.bank_account
  ? { status: 'Saved',       statusType: 'success' }
  : { status: 'Not Started', statusType: 'none'    })

const verificationItems = computed(() => [
  { key: 'identity', title: 'Identity Verification',     desc: 'Upload your national ID or passport.',  icon: 'mdi:card-account-details-outline', ...identityStep.value },
  { key: 'selfie',   title: 'Selfie Verification',       desc: 'Upload a selfie holding your ID card.', icon: 'mdi:face-recognition',             ...selfieStep.value   },
  { key: 'bank',     title: 'Bank Account Verification', desc: 'Save your bank account details.',       icon: 'mdi:bank-outline',                 ...bankStep.value     },
])

const overallStatus = computed(() => {
  if (isVerified.value && bankStep.value.statusType === 'success') return 'Verified'
  if (isPending.value) return 'Under Review'
  return 'Unverified'
})

const statusStyle = computed(() => ({
  Verified:      { icon: 'mdi:shield-check-outline', color: 'text-[#20c7b7]', bg: 'bg-[#eafffb]', badgeBg: 'bg-[#eafffb]', badgeText: 'text-[#20c7b7]' },
  'Under Review':{ icon: 'mdi:shield-clock-outline', color: 'text-amber-500', bg: 'bg-amber-50',   badgeBg: 'bg-amber-50',   badgeText: 'text-amber-500'  },
  Unverified:    { icon: 'mdi:shield-alert-outline', color: 'text-gray-400',  bg: 'bg-gray-50',    badgeBg: 'bg-gray-100',   badgeText: 'text-gray-400'   },
}[overallStatus.value]))

// ── Modal state ─────────────────────────────────────────────────────────────
const activeModal = ref<ModalKey>(null)
const submitting  = ref(false)
const submitError = ref('')
const lastDone    = ref<ModalKey>(null)

function openModal(key: ModalKey) {
  activeModal.value  = key
  submitError.value  = ''
  identityForm.value = { full_name: '', id_number: '', file: null, preview: '' }
  selfieForm.value   = { file: null, preview: '' }
  bankForm.value     = { bank: auth.profile?.bank ?? '', bank_account: auth.profile?.bank_account ?? '', country: auth.profile?.country ?? '' }
}

function closeModal() {
  if (identityForm.value.preview) URL.revokeObjectURL(identityForm.value.preview)
  if (selfieForm.value.preview)   URL.revokeObjectURL(selfieForm.value.preview)
  activeModal.value = null
}

// ── FormData upload helper ──────────────────────────────────────────────────
async function postForm(path: string, fd: FormData) {
  const res = await fetch(`https://api.one-led.io/v1/user${path}`, {
    method:  'POST',
    headers: { Authorization: `Bearer ${auth.accessToken}` },
    body:    fd,
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data?.error?.message ?? 'Upload failed.')
  return data
}

// ── Identity form ───────────────────────────────────────────────────────────
const identityForm = ref({ full_name: '', id_number: '', file: null as File | null, preview: '' })

function onIdentityFile(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return
  if (identityForm.value.preview) URL.revokeObjectURL(identityForm.value.preview)
  identityForm.value.file    = file
  identityForm.value.preview = URL.createObjectURL(file)
}

async function submitIdentity() {
  if (!auth.accessToken) return
  if (!identityForm.value.file) { submitError.value = 'Please select an ID card image.'; return }
  submitting.value  = true
  submitError.value = ''
  try {
    const fd = new FormData()
    if (identityForm.value.full_name) fd.append('full_name', identityForm.value.full_name)
    if (identityForm.value.id_number) fd.append('id_number', identityForm.value.id_number)
    fd.append('id_image', identityForm.value.file)
    await postForm('/verification/identity', fd)
    await auth.refreshProfile()
    lastDone.value    = 'identity'
    activeModal.value = null
  } catch (e: any) {
    submitError.value = e?.message ?? 'Submission failed. Please try again.'
  } finally {
    submitting.value = false
  }
}

// ── Selfie form ─────────────────────────────────────────────────────────────
const selfieForm = ref({ file: null as File | null, preview: '' })

function onSelfieFile(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return
  if (selfieForm.value.preview) URL.revokeObjectURL(selfieForm.value.preview)
  selfieForm.value.file    = file
  selfieForm.value.preview = URL.createObjectURL(file)
}

async function submitSelfie() {
  if (!auth.accessToken) return
  if (!selfieForm.value.file) { submitError.value = 'Please select a selfie photo.'; return }
  submitting.value  = true
  submitError.value = ''
  try {
    const fd = new FormData()
    fd.append('selfie_image', selfieForm.value.file)
    await postForm('/verification/selfie', fd)
    await auth.refreshProfile()
    lastDone.value    = 'selfie'
    activeModal.value = null
  } catch (e: any) {
    submitError.value = e?.message ?? 'Submission failed. Please try again.'
  } finally {
    submitting.value = false
  }
}

// ── Bank form ───────────────────────────────────────────────────────────────
const bankForm = ref({ bank: '', bank_account: '', country: '' })

async function submitBank() {
  if (!auth.accessToken) return
  submitting.value  = true
  submitError.value = ''
  try {
    await makeUserApi(auth.accessToken).updateProfile({
      bank:         bankForm.value.bank         || undefined,
      bank_account: bankForm.value.bank_account || undefined,
      country:      bankForm.value.country      || undefined,
    })
    await auth.refreshProfile()
    lastDone.value    = 'bank'
    activeModal.value = null
  } catch (e: any) {
    submitError.value = e?.message ?? 'Failed to save. Please try again.'
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <DashboardLayout>

    <!-- ── Identity Modal ──────────────────────────────────────────────────── -->
    <Teleport to="body">
      <Transition name="sheet">
        <div v-if="activeModal === 'identity'" class="fixed inset-0 z-50 flex flex-col">
          <div class="absolute inset-0 bg-black/40 backdrop-blur-sm" @click="closeModal"></div>
          <div class="relative mt-auto max-h-[90vh] w-full overflow-y-auto rounded-t-3xl bg-white px-6 pt-5 pb-10 shadow-2xl lg:mx-auto lg:mb-auto lg:mt-auto lg:max-w-lg lg:rounded-3xl">
            <div class="mb-5 flex items-center justify-between">
              <h3 class="text-xl font-semibold text-slate-950">Identity Verification</h3>
              <button type="button" class="grid size-9 place-items-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 transition" @click="closeModal">
                <Icon icon="mdi:close" class="size-5" />
              </button>
            </div>
            <p class="mb-4 text-sm leading-relaxed text-slate-500">Upload a clear photo of your national ID card or passport. All text must be readable.</p>
            <p v-if="submitError" class="mb-3 rounded-xl bg-red-50 px-4 py-2 text-sm font-semibold text-red-500">{{ submitError }}</p>
            <form @submit.prevent="submitIdentity" class="space-y-4">
              <div>
                <label class="mb-1.5 block text-sm font-semibold text-slate-700">Full Name <span class="font-normal text-slate-400">(optional)</span></label>
                <input v-model="identityForm.full_name" type="text" placeholder="As written on your ID"
                  class="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-950 placeholder:text-slate-400 focus:border-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-100" />
              </div>
              <div>
                <label class="mb-1.5 block text-sm font-semibold text-slate-700">ID Number <span class="font-normal text-slate-400">(optional)</span></label>
                <input v-model="identityForm.id_number" type="text" placeholder="National ID / Passport number"
                  class="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-950 placeholder:text-slate-400 focus:border-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-100" />
              </div>
              <div>
                <label class="mb-1.5 block text-sm font-semibold text-slate-700">ID Card Photo <span class="text-red-400">*</span></label>
                <div v-if="identityForm.preview" class="mb-3 overflow-hidden rounded-2xl border border-slate-100">
                  <img :src="identityForm.preview" alt="ID preview" class="h-44 w-full object-cover" />
                </div>
                <label class="flex cursor-pointer items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 py-4 text-sm font-semibold text-slate-500 transition hover:border-teal-300 hover:bg-teal-50 hover:text-teal-600">
                  <Icon icon="mdi:upload" class="text-[20px]" />
                  {{ identityForm.file ? 'Change Image' : 'Choose Image' }}
                  <input type="file" accept="image/*" class="hidden" @change="onIdentityFile" />
                </label>
                <p v-if="identityForm.file" class="mt-1.5 truncate text-[12px] text-slate-400">{{ identityForm.file.name }}</p>
              </div>
              <button type="submit" :disabled="submitting"
                class="mt-2 w-full rounded-2xl bg-teal-500 py-3.5 text-sm font-semibold text-white transition active:scale-95 hover:bg-teal-600 disabled:opacity-60">
                {{ submitting ? 'Uploading…' : 'Submit for Review' }}
              </button>
            </form>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- ── Selfie Modal ─────────────────────────────────────────────────────── -->
    <Teleport to="body">
      <Transition name="sheet">
        <div v-if="activeModal === 'selfie'" class="fixed inset-0 z-50 flex flex-col">
          <div class="absolute inset-0 bg-black/40 backdrop-blur-sm" @click="closeModal"></div>
          <div class="relative mt-auto max-h-[90vh] w-full overflow-y-auto rounded-t-3xl bg-white px-6 pt-5 pb-10 shadow-2xl lg:mx-auto lg:mb-auto lg:mt-auto lg:max-w-lg lg:rounded-3xl">
            <div class="mb-5 flex items-center justify-between">
              <h3 class="text-xl font-semibold text-slate-950">Selfie Verification</h3>
              <button type="button" class="grid size-9 place-items-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 transition" @click="closeModal">
                <Icon icon="mdi:close" class="size-5" />
              </button>
            </div>
            <p class="mb-4 text-sm leading-relaxed text-slate-500">Take a selfie while holding your ID card next to your face. Both your face and the ID text must be clearly visible.</p>
            <p v-if="submitError" class="mb-3 rounded-xl bg-red-50 px-4 py-2 text-sm font-semibold text-red-500">{{ submitError }}</p>
            <form @submit.prevent="submitSelfie" class="space-y-4">
              <div>
                <label class="mb-1.5 block text-sm font-semibold text-slate-700">Selfie Photo <span class="text-red-400">*</span></label>
                <div v-if="selfieForm.preview" class="mb-3 overflow-hidden rounded-2xl border border-slate-100">
                  <img :src="selfieForm.preview" alt="Selfie preview" class="h-56 w-full object-cover object-top" />
                </div>
                <label class="flex cursor-pointer items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 py-4 text-sm font-semibold text-slate-500 transition hover:border-teal-300 hover:bg-teal-50 hover:text-teal-600">
                  <Icon icon="mdi:camera" class="text-[20px]" />
                  {{ selfieForm.file ? 'Change Photo' : 'Take / Upload Photo' }}
                  <input type="file" accept="image/*" capture="user" class="hidden" @change="onSelfieFile" />
                </label>
                <p v-if="selfieForm.file" class="mt-1.5 truncate text-[12px] text-slate-400">{{ selfieForm.file.name }}</p>
              </div>
              <button type="submit" :disabled="submitting"
                class="mt-2 w-full rounded-2xl bg-teal-500 py-3.5 text-sm font-semibold text-white transition active:scale-95 hover:bg-teal-600 disabled:opacity-60">
                {{ submitting ? 'Uploading…' : 'Submit for Review' }}
              </button>
            </form>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- ── Bank Account Modal ───────────────────────────────────────────────── -->
    <Teleport to="body">
      <Transition name="sheet">
        <div v-if="activeModal === 'bank'" class="fixed inset-0 z-50 flex flex-col">
          <div class="absolute inset-0 bg-black/40 backdrop-blur-sm" @click="closeModal"></div>
          <div class="relative mt-auto max-h-[90vh] w-full overflow-y-auto rounded-t-3xl bg-white px-6 pt-5 pb-10 shadow-2xl lg:mx-auto lg:mb-auto lg:mt-auto lg:max-w-lg lg:rounded-3xl">
            <div class="mb-5 flex items-center justify-between">
              <h3 class="text-xl font-semibold text-slate-950">Bank Account</h3>
              <button type="button" class="grid size-9 place-items-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 transition" @click="closeModal">
                <Icon icon="mdi:close" class="size-5" />
              </button>
            </div>
            <p class="mb-4 text-sm leading-relaxed text-slate-500">Enter your bank details for withdrawal processing.</p>
            <p v-if="submitError" class="mb-3 rounded-xl bg-red-50 px-4 py-2 text-sm font-semibold text-red-500">{{ submitError }}</p>
            <form @submit.prevent="submitBank" class="space-y-4">
              <div>
                <label class="mb-1.5 block text-sm font-semibold text-slate-700">Bank Name</label>
                <input v-model="bankForm.bank" type="text" placeholder="e.g. BCA, Mandiri, BNI"
                  class="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-950 placeholder:text-slate-400 focus:border-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-100" />
              </div>
              <div>
                <label class="mb-1.5 block text-sm font-semibold text-slate-700">Account Number</label>
                <input v-model="bankForm.bank_account" type="text" inputmode="numeric" placeholder="Enter your bank account number"
                  class="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-950 placeholder:text-slate-400 focus:border-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-100" />
              </div>
              <div>
                <label class="mb-1.5 block text-sm font-semibold text-slate-700">Country / Region</label>
                <input v-model="bankForm.country" type="text" placeholder="e.g. Indonesia, Malaysia"
                  class="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-950 placeholder:text-slate-400 focus:border-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-100" />
              </div>
              <button type="submit" :disabled="submitting"
                class="mt-2 w-full rounded-2xl bg-teal-500 py-3.5 text-sm font-semibold text-white transition active:scale-95 hover:bg-teal-600 disabled:opacity-60">
                {{ submitting ? 'Saving…' : 'Save Bank Account' }}
              </button>
            </form>
          </div>
        </div>
      </Transition>
    </Teleport>

    <section class="min-h-screen bg-[#f6f8fb] px-4 pt-6 pb-10">
      <div class="mx-auto">
        <div class="flex items-center gap-3">
          <button @click="router.back()" class="flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-sm active:scale-95">
            <Icon icon="mdi:arrow-left" class="text-[22px] text-[#17212f]" />
          </button>
          <h1 class="text-[28px] font-semibold leading-none tracking-tight text-[#17212f]">Verification</h1>
        </div>

        <p class="mt-4 text-[15px] font-semibold text-[#5b6d9a]">Verify your identity and account.</p>

        <!-- Status Card -->
        <div class="mt-6 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <div class="flex items-center gap-5">
            <div class="flex h-24 w-24 shrink-0 items-center justify-center rounded-full" :class="statusStyle.bg">
              <Icon :icon="statusStyle.icon" class="text-[60px]" :class="statusStyle.color" />
            </div>
            <div>
              <h2 class="text-[17px] font-semibold text-[#101b3f]">Account Status:</h2>
              <p class="mt-1 text-[24px] font-semibold" :class="statusStyle.color">{{ overallStatus }}</p>
              <span class="mt-3 inline-flex items-center gap-2 rounded-xl px-3 py-1.5 text-[12px] font-semibold" :class="[statusStyle.badgeBg, statusStyle.badgeText]">
                <Icon :icon="statusStyle.icon" class="text-[15px]" /> {{ overallStatus }}
              </span>
            </div>
          </div>
        </div>

        <!-- Done banners -->
        <div v-if="lastDone === 'identity' || lastDone === 'selfie'" class="mt-4 flex items-center gap-3 rounded-2xl border border-teal-100 bg-teal-50 px-4 py-3">
          <Icon icon="mdi:check-circle-outline" class="shrink-0 text-[22px] text-teal-500" />
          <p class="text-[13px] font-semibold text-teal-700">
            {{ lastDone === 'identity' ? 'Identity' : 'Selfie' }} photo submitted! Our team will review within 1–3 business days.
          </p>
        </div>
        <div v-if="lastDone === 'bank'" class="mt-4 flex items-center gap-3 rounded-2xl border border-teal-100 bg-teal-50 px-4 py-3">
          <Icon icon="mdi:check-circle-outline" class="shrink-0 text-[22px] text-teal-500" />
          <p class="text-[13px] font-semibold text-teal-700">Bank account saved successfully.</p>
        </div>

        <!-- Verification List -->
        <div class="mt-4 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
          <button
            v-for="item in verificationItems"
            :key="item.key"
            class="flex w-full items-center justify-between border-b border-gray-100 px-4 py-5 text-left last:border-b-0 active:bg-gray-50"
            @click="openModal(item.key as ModalKey)"
          >
            <div class="flex items-center gap-4">
              <div class="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#eafffb]">
                <Icon :icon="item.icon" class="text-[26px] text-[#20c7b7]" />
              </div>
              <div>
                <h3 class="text-[14px] font-semibold text-[#101b3f]">{{ item.title }}</h3>
                <p class="mt-1 text-[12px] font-semibold text-[#5b6d9a]">{{ item.desc }}</p>
              </div>
            </div>
            <div class="flex items-center gap-3">
              <span
                class="inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-[11px] font-semibold"
                :class="{
                  'bg-[#eafffb] text-[#20c7b7]': item.statusType === 'success',
                  'bg-orange-50 text-orange-400': item.statusType === 'pending',
                  'bg-red-50 text-red-400':       item.statusType === 'rejected',
                  'bg-gray-100 text-gray-400':    item.statusType === 'none',
                }"
              >
                <Icon
                  :icon="item.statusType === 'success' ? 'mdi:check-circle' : item.statusType === 'rejected' ? 'mdi:close-circle' : item.statusType === 'pending' ? 'mdi:clock-outline' : 'mdi:circle-outline'"
                  class="text-[14px]"
                />
                {{ item.status }}
              </span>
              <Icon icon="mdi:chevron-right" class="text-[22px] text-[#6b82c4]" />
            </div>
          </button>
        </div>

        <!-- Info -->
        <div class="mt-5 flex items-center gap-4 rounded-2xl border border-[#e2fbf8] bg-[#fbfffe] p-4">
          <div class="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#eafffb]">
            <Icon icon="mdi:shield-check-outline" class="text-[30px] text-[#20c7b7]" />
          </div>
          <div>
            <h3 class="text-[14px] font-semibold text-[#101b3f]">Increase your account security</h3>
            <p class="mt-1.5 text-[12px] font-semibold leading-relaxed text-[#5b6d9a]">
              Complete all verification steps to enhance your account security and increase your withdrawal limits.
            </p>
          </div>
        </div>
      </div>
    </section>
  </DashboardLayout>
</template>

<style scoped>
.sheet-enter-active,
.sheet-leave-active { transition: opacity 0.25s ease; }
.sheet-enter-active .relative,
.sheet-leave-active .relative { transition: transform 0.3s cubic-bezier(0.32, 0.72, 0, 1); }
.sheet-enter-from,
.sheet-leave-to { opacity: 0; }
.sheet-enter-from .relative { transform: translateY(100%); }
.sheet-leave-to .relative { transform: translateY(100%); }
</style>
