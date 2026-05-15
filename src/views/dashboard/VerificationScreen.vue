<script setup lang="ts">
import { useRouter } from 'vue-router'
import { Icon } from '@iconify/vue'
import DashboardLayout from '../../layouts/DashboardLayout.vue'

const router = useRouter()

const verificationItems = [
  { title: 'Identity Verification', desc: 'Verify your personal information.', icon: 'mdi:card-account-details-outline', status: 'Completed', statusType: 'success' },
  { title: 'Selfie Verification', desc: 'Verify your face to confirm liveness.', icon: 'mdi:face-recognition', status: 'Completed', statusType: 'success' },
  { title: 'Document Verification', desc: 'Verify your official document.', icon: 'mdi:file-document-outline', status: 'Completed', statusType: 'success' },
  { title: 'Bank Account Verification', desc: 'Verify your bank account details.', icon: 'mdi:bank-outline', status: 'Pending', statusType: 'pending' },
]
</script>

<template>
  <DashboardLayout>
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
            <div class="flex h-24 w-24 shrink-0 items-center justify-center rounded-full bg-[#eafffb]">
              <Icon icon="mdi:shield-check-outline" class="text-[60px] text-[#20c7b7]" />
            </div>
            <div>
              <h2 class="text-[17px] font-semibold text-[#101b3f]">Account Status:</h2>
              <p class="mt-1 text-[24px] font-semibold text-[#20c7b7]">Verified</p>
              <span class="mt-3 inline-flex items-center gap-2 rounded-xl bg-[#eafffb] px-3 py-1.5 text-[12px] font-semibold text-[#20c7b7]">
                <Icon icon="mdi:shield-check-outline" class="text-[15px]" /> Verified
              </span>
            </div>
          </div>
        </div>

        <!-- Verification List -->
        <div class="mt-4 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
          <button
            v-for="item in verificationItems"
            :key="item.title"
            class="flex w-full items-center justify-between border-b border-gray-100 px-4 py-5 text-left last:border-b-0 active:bg-gray-50"
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
                :class="item.statusType === 'success' ? 'bg-[#eafffb] text-[#20c7b7]' : 'bg-orange-50 text-orange-400'"
              >
                <Icon :icon="item.statusType === 'success' ? 'mdi:check-circle' : 'mdi:clock-outline'" class="text-[14px]" />
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
