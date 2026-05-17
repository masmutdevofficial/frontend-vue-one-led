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

// ── Derived KYC status ─────────────────────────────────────────────────────
const ktpStatus = computed(() => auth.profile?.ktp_status ?? null)

type StatusType = 'success' | 'pending' | 'rejected' | 'none'

function ktpStep(ktp: string | null): { status: string; statusType: StatusType } {
  if (ktp === 'Verified')  return { status: 'Completed',   statusType: 'success'  }
  if (ktp === 'Pending')   return { status: 'Pending',     statusType: 'pending'  }
  if (ktp === 'Rejected')  return { status: 'Rejected',    statusType: 'rejected' }
  return                          { status: 'Not Started', statusType: 'none'     }
}

const bankStep = computed(() => {
  const hasBankAccount = !!(auth.profile?.bank_account)
  return hasBankAccount
    ? { status: 'Completed',   statusType: 'success' as StatusType }
    : { status: 'Not Started', statusType: 'none'    as StatusType }
})

const verificationItems = computed(() => {
  const kyc = ktpStep(ktpStatus.value)
  return [
    { title: 'Identity Verification',    desc: 'Verify your national ID card or passport.',  icon: 'mdi:card-account-details-outline', ...kyc },
    { title: 'Selfie Verification',      desc: 'Verify your face to confirm liveness.',      icon: 'mdi:face-recognition',             ...kyc },
    { title: 'Document Verification',    desc: 'Verify your official identity document.',    icon: 'mdi:file-document-outline',         ...kyc },
    { title: 'Bank Account Verification',desc: 'Verify your bank account details.',          icon: 'mdi:bank-outline',                 ...bankStep.value },
  ]
})

const overallStatus = computed(() => {
  if (ktpStatus.value === 'Verified' && bankStep.value.statusType === 'success') return 'Verified'
  if (ktpStatus.value === 'Pending') return 'Under Review'
  return 'Unverified'
})

const statusStyle = computed(() => ({
  Verified:      { icon: 'mdi:shield-check-outline',  color: 'text-[#20c7b7]', bg: 'bg-[#eafffb]', badgeBg: 'bg-[#eafffb]', badgeText: 'text-[#20c7b7]' },
  'Under Review':{ icon: 'mdi:shield-clock-outline',  color: 'text-amber-500', bg: 'bg-amber-50',   badgeBg: 'bg-amber-50',   badgeText: 'text-amber-500'  },
  Unverified:    { icon: 'mdi:shield-alert-outline',  color: 'text-gray-400',  bg: 'bg-gray-50',    badgeBg: 'bg-gray-100',   badgeText: 'text-gray-400'   },
}[overallStatus.value]))

// ── Verification submission modal ──────────────────────────────────────────
const showModal    = ref(false)
const submitting   = ref(false)
const submitError  = ref('')
const submitDone   = ref(false)

const form = ref({
  full_name:    '',
  id_number:    '',
  id_image_url: '',
  selfie_url:   '',
})

function openModal() {
  if (ktpStatus.value === 'Verified') return
  form.value = { full_name: '', id_number: '', id_image_url: '', selfie_url: '' }
  submitError.value = ''
  submitDone.value  = false
  showModal.value   = true
}

async function submit() {
  if (!auth.accessToken) return
  submitting.value  = true
  submitError.value = ''
  try {
    await makeUserApi(auth.accessToken).submitVerification({
      full_name:    form.value.full_name    || undefined,
      id_number:    form.value.id_number    || undefined,
      id_image_url: form.value.id_image_url || undefined,
      selfie_url:   form.value.selfie_url   || undefined,
    })
    await auth.refreshProfile()
    submitDone.value = true
    showModal.value  = false
  } catch (e: any) {
    submitError.value = e?.message ?? 'Submission failed. Please try again.'
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <DashboardLayout>
    <!-- Verification Submission Modal -->
    <Teleport to="body">
      <Transition name="sheet">
        <div v-if="showModal" class="fixed inset-0 z-50 flex flex-col">
          <div class="absolute inset-0 bg-black/40 backdrop-blur-sm" @click="showModal = false"></div>
          <div class="relative mt-auto max-h-[90vh] w-full overflow-y-auto rounded-t-3xl bg-white px-6 pt-5 pb-10 shadow-2xl lg:mx-auto lg:mb-auto lg:mt-auto lg:max-w-lg lg:rounded-3xl">
            <div class="mb-5 flex items-center justify-between">
              <h3 class="text-xl font-semibold text-slate-950">Submit Verification</h3>
              <button type="button" class="grid size-9 place-items-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 transition" @click="showModal = false">
                <Icon icon="mdi:close" class="size-5" />
              </button>
            </div>

            <p class="mb-4 text-sm text-slate-500 leading-relaxed">
              Fill in your identity details to start the verification process. Our team will review your submission and update the status within 1–3 business days.
            </p>

            <p v-if="submitError" class="mb-3 rounded-xl bg-red-50 px-4 py-2 text-sm font-semibold text-red-500">{{ submitError }}</p>

            <form @submit.prevent="submit" class="space-y-4">
              <div>
                <label class="mb-1.5 block text-sm font-semibold text-slate-700">Full Name</label>
                <input v-model="form.full_name" type="text" placeholder="As on your ID card"
                  class="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-950 placeholder:text-slate-400 focus:border-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-100" />
              </div>
              <div>
                <label class="mb-1.5 block text-sm font-semibold text-slate-700">ID Number</label>
                <input v-model="form.id_number" type="text" placeholder="National ID / Passport number"
                  class="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-950 placeholder:text-slate-400 focus:border-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-100" />
              </div>
              <div>
                <label class="mb-1.5 block text-sm font-semibold text-slate-700">ID Card Image URL</label>
                <input v-model="form.id_image_url" type="url" placeholder="https://…"
                  class="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-950 placeholder:text-slate-400 focus:border-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-100" />
              </div>
              <div>
                <label class="mb-1.5 block text-sm font-semibold text-slate-700">Selfie Image URL</label>
                <input v-model="form.selfie_url" type="url" placeholder="https://…"
                  class="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-950 placeholder:text-slate-400 focus:border-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-100" />
              </div>
              <button type="submit" :disabled="submitting"
                class="mt-2 w-full rounded-2xl bg-teal-500 py-3.5 text-sm font-semibold text-white transition active:scale-95 hover:bg-teal-600 disabled:opacity-60">
                {{ submitting ? 'Submitting…' : 'Submit for Review' }}
              </button>
            </form>
          </div>
        </div>
      </Transition>
    </Teleport>

    <section class="min-h-screen bg-[#f6f8fb] px-4 pt-6 pb-10">
      <div class="mx-auto ">
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

        <!-- Success banner after submission -->
        <div v-if="submitDone" class="mt-4 flex items-center gap-3 rounded-2xl bg-teal-50 border border-teal-100 px-4 py-3">
          <Icon icon="mdi:check-circle-outline" class="text-[22px] shrink-0 text-teal-500" />
          <p class="text-[13px] font-semibold text-teal-700">Verification submitted! Our team will review within 1–3 business days.</p>
        </div>

        <!-- Verification List -->
        <div class="mt-4 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
          <button
            v-for="item in verificationItems"
            :key="item.title"
            class="flex w-full items-center justify-between border-b border-gray-100 px-4 py-5 text-left last:border-b-0 active:bg-gray-50"
            @click="item.title === 'Bank Account Verification' ? router.push('/profile') : openModal()"
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
                  'bg-[#eafffb] text-[#20c7b7]':  item.statusType === 'success',
                  'bg-orange-50 text-orange-400':  item.statusType === 'pending',
                  'bg-red-50 text-red-400':        item.statusType === 'rejected',
                  'bg-gray-100 text-gray-400':     item.statusType === 'none',
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
