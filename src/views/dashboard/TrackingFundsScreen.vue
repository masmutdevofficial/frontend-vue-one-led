<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Icon } from '@iconify/vue'
import DashboardLayout from '../../layouts/DashboardLayout.vue'

const router = useRouter()
const trackingNumber = ref('')
const isLoading = ref(false)
const trackResult = ref<null | { status: string; from: string; to: string; amount: string; date: string }>(null)
const notFound = ref(false)

function trackTransfer() {
  if (!trackingNumber.value.trim()) return
  isLoading.value = true
  trackResult.value = null
  notFound.value = false
  setTimeout(() => {
    isLoading.value = false
    if (trackingNumber.value.trim().toUpperCase() === 'NOTFOUND') {
      notFound.value = true
    } else {
      trackResult.value = {
        status: 'Completed',
        from: 'Alex Johnson',
        to: 'Wallet ···· 8F2A',
        amount: '500.00 USDT',
        date: 'May 12, 2026 – 09:24 AM',
      }
    }
  }, 1200)
}
</script>

<template>
  <DashboardLayout>
    <section class="min-h-screen bg-[#f6f8fb] px-4 pt-6 pb-10">
      <div class="mx-auto ">
        <div class="flex items-center gap-3">
          <button @click="router.back()" class="flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-sm active:scale-95">
            <Icon icon="mdi:arrow-left" class="text-[22px] text-[#17212f]" />
          </button>
          <h1 class="text-[28px] font-semibold leading-none tracking-tight text-[#17212f]">Tracking Funds</h1>
        </div>

        <!-- Hero -->
        <div class="mt-8 flex flex-col items-center text-center">
          <div class="flex h-20 w-20 items-center justify-center rounded-full bg-[#eafffb]">
            <Icon icon="mdi:send-outline" class="text-[46px] text-[#20c7b7]" />
          </div>
          <h2 class="mt-5 text-[20px] font-semibold text-[#101b3f]">Track Your Transfer</h2>
          <p class="mt-3 max-w-72 text-[13px] font-semibold leading-relaxed text-[#5b6d9a]">
            Enter your tracking number (SWIFT / UTR / Reference) to check the status of your transfer.
          </p>
        </div>

        <!-- Form -->
        <div class="mt-8">
          <label class="text-[13px] font-semibold text-[#344054]">Tracking Number (SWIFT / UTR / Reference)</label>
          <div class="mt-3 flex h-14 items-center gap-3 rounded-xl border border-gray-200 bg-white px-4 focus-within:border-[#20c7b7]">
            <input
              v-model="trackingNumber"
              type="text"
              placeholder="Enter tracking number"
              class="w-full bg-transparent text-[15px] font-semibold text-[#101b3f] outline-none placeholder:text-[#9aa4b8]"
              @keyup.enter="trackTransfer"
            />
            <button class="active:scale-95">
              <Icon icon="mdi:scan-helper" class="text-[26px] text-[#697386]" />
            </button>
          </div>

          <button
            @click="trackTransfer"
            class="mt-5 flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-[#08a99f] text-[15px] font-semibold text-white active:scale-[0.99]"
            :class="isLoading ? 'opacity-70 cursor-not-allowed' : ''"
            :disabled="isLoading"
          >
            <Icon v-if="isLoading" icon="mdi:loading" class="animate-spin text-[20px]" />
            {{ isLoading ? 'Searching...' : 'Track' }}
          </button>
        </div>

        <!-- Result -->
        <div v-if="trackResult" class="mt-6 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <div class="flex items-center justify-between">
            <h3 class="text-[15px] font-semibold text-[#101b3f]">Transfer Status</h3>
            <span class="rounded-xl bg-[#eafffb] px-3 py-1 text-[12px] font-semibold text-[#20c7b7]">
              <Icon icon="mdi:check-circle" class="inline text-[14px]" /> {{ trackResult.status }}
            </span>
          </div>
          <div class="mt-4 space-y-3">
            <div class="flex justify-between text-[13px]">
              <span class="font-semibold text-gray-400">From</span>
              <span class="font-bold text-[#101b3f]">{{ trackResult.from }}</span>
            </div>
            <div class="flex justify-between text-[13px]">
              <span class="font-semibold text-gray-400">To</span>
              <span class="font-bold text-[#101b3f]">{{ trackResult.to }}</span>
            </div>
            <div class="flex justify-between text-[13px]">
              <span class="font-semibold text-gray-400">Amount</span>
              <span class="font-bold text-[#0ba99d]">{{ trackResult.amount }}</span>
            </div>
            <div class="flex justify-between text-[13px]">
              <span class="font-semibold text-gray-400">Date</span>
              <span class="font-bold text-[#101b3f]">{{ trackResult.date }}</span>
            </div>
          </div>
        </div>

        <!-- Not Found -->
        <div v-if="notFound" class="mt-6 rounded-2xl border border-red-100 bg-red-50 p-5 text-center">
          <Icon icon="mdi:alert-circle-outline" class="text-[36px] text-red-400" />
          <p class="mt-2 text-[13px] font-bold text-red-400">Transfer not found. Check the tracking number and try again.</p>
        </div>

        <!-- Info -->
        <div class="mt-6 flex items-start gap-3">
          <Icon icon="mdi:information-outline" class="mt-0.5 text-[20px] text-[#697386]" />
          <p class="text-[12px] font-semibold leading-relaxed text-[#697386]">
            Make sure you enter the correct tracking number to get accurate results.
          </p>
        </div>
      </div>
    </section>
  </DashboardLayout>
</template>
