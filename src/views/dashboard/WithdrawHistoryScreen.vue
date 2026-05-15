<template>
  <DashboardLayout>
    <div class="min-h-screen bg-[#f6f8fb] text-[#0b1638]">
      <div class="mx-auto min-h-screen  bg-[#f6f8fb] pb-8">

        <!-- HEADER -->
        <div class="relative flex h-14 items-center justify-center border-b border-gray-100 bg-white px-4">
          <button
            @click="router.back()"
            class="absolute left-4 flex h-9 w-9 items-center justify-center rounded-xl bg-[#f6f8fb] active:scale-95"
          >
            <Icon icon="mdi:chevron-left" class="text-[25px] text-[#1f2937]" />
          </button>
          <h1 class="text-[16px] font-semibold text-[#0b1638]">Withdraw History</h1>
          <div class="absolute right-4 flex items-center gap-2">
            <button class="flex h-9 w-9 items-center justify-center rounded-xl bg-[#f6f8fb] active:scale-95">
              <Icon icon="mdi:filter-variant" class="text-[22px] text-[#17212f]" />
            </button>
            <button class="flex h-9 w-9 items-center justify-center rounded-xl bg-[#f6f8fb] active:scale-95">
              <Icon icon="mdi:calendar-blank-outline" class="text-[22px] text-[#17212f]" />
            </button>
          </div>
        </div>

        <!-- SUMMARY CARD -->
        <section class="px-4 pt-4">
          <div class="relative overflow-hidden rounded-2xl border border-gray-100 bg-white px-5 py-5 shadow-sm">
            <div class="absolute right-0 top-0 h-full w-[48%] bg-linear-to-l from-cyan-100/80 via-cyan-50/60 to-transparent"></div>

            <div class="relative z-10 flex items-center justify-between">
              <div>
                <div class="flex items-center gap-2 text-[13px] font-medium text-[#7a86a4]">
                  Total Withdrawals
                  <Icon icon="mdi:eye-outline" class="text-[15px]" />
                </div>

                <div class="mt-4 flex items-end gap-2">
                  <h2 class="text-[34px] font-semibold leading-none tracking-[0.08em] text-[#0b1638]">
                    8,420.35
                  </h2>
                  <span class="mb-1 text-xs font-semibold text-[#5b6d9a]">USDT</span>
                </div>

                <p class="mt-3 text-sm font-medium text-[#7a86a4]">≈ $8,420.35</p>
              </div>

              <div class="relative flex h-26.25 w-35 items-center justify-center">
                <div class="absolute bottom-2 h-7 w-27 rounded-full bg-cyan-200/70 blur-md"></div>

                <div class="relative z-10 flex h-18 w-18 items-center justify-center rounded-2xl bg-linear-to-br from-[#dffaf8] to-[#0ba99d] shadow-xl">
                  <Icon icon="mdi:safe-square-outline" class="text-5xl text-white" />
                </div>

                <Icon icon="mdi:arrow-right" class="absolute right-4 top-10 text-5xl text-[#0ba99d]" />
                <Icon icon="mdi:alpha-t-circle" class="absolute right-6 top-3 text-xl text-[#20c7b7]" />
                <Icon icon="mdi:diamond-stone" class="absolute left-4 top-5 text-[17px] text-[#20c7b7]" />
              </div>
            </div>
          </div>
        </section>

        <!-- FILTER TABS -->
        <section class="mt-4 px-4">
          <div class="flex items-center justify-between rounded-2xl border border-gray-100 bg-white px-3 py-3 shadow-sm">
            <div class="flex items-center gap-2">
              <button
                v-for="status in statuses"
                :key="status"
                @click="activeStatus = status"
                class="h-10 rounded-xl px-4 text-xs font-semibold transition"
                :class="activeStatus === status ? 'bg-[#f6f8fb] text-[#08a99f] shadow-sm' : 'text-[#5b6d9a]'"
              >
                {{ status }}
              </button>
            </div>

            <button class="flex items-center gap-1 text-sm font-semibold text-[#17212f]">
              All Time
              <Icon icon="mdi:chevron-down" class="text-[18px]" />
            </button>
          </div>
        </section>

        <!-- WITHDRAW LIST -->
        <section class="mt-4 px-4">
          <div class="space-y-3">
            <article
              v-for="item in filteredWithdrawals"
              :key="item.asset + item.date"
              class="flex items-center justify-between rounded-2xl border border-gray-100 bg-white px-4 py-5 shadow-sm"
            >
              <div class="flex items-center gap-4">
                <div
                  class="flex h-14 w-14 shrink-0 items-center justify-center rounded-full"
                  :class="item.iconClass"
                >
                  <Icon :icon="item.icon" class="text-[34px]" />
                </div>

                <div>
                  <div class="flex items-center gap-2">
                    <h3 class="text-[17px] font-semibold text-[#0b1638]">{{ item.asset }}</h3>
                    <span class="rounded-md bg-[#eafffb] px-2 py-0.5 text-[10px] font-semibold text-[#08a99f]">
                      {{ item.network }}
                    </span>
                  </div>

                  <p class="mt-2 text-[13px] font-medium text-[#7a86a4]">{{ item.source }}</p>

                  <p class="mt-2 flex items-center gap-2 text-xs font-medium text-[#7a86a4]">
                    <Icon icon="mdi:web" class="text-[15px]" />
                    {{ item.type }}
                  </p>
                </div>
              </div>

              <div class="text-right">
                <p class="text-[17px] font-semibold text-[#0b1638]">{{ item.amount }}</p>

                <p class="mt-3 text-xs font-medium text-[#7a86a4]">{{ item.date }}</p>

                <span
                  class="mt-3 inline-flex items-center gap-1 rounded-xl px-3 py-1.5 text-[11px] font-semibold"
                  :class="statusClass(item.status)"
                >
                  <Icon :icon="statusIcon(item.status)" class="text-[15px]" />
                  {{ item.status }}
                </span>
              </div>
            </article>

            <!-- Empty state -->
            <div v-if="filteredWithdrawals.length === 0" class="flex flex-col items-center py-16 text-gray-400">
              <Icon icon="mdi:inbox-outline" class="text-5xl" />
              <p class="mt-3 text-xs font-semibold">No {{ activeStatus }} withdrawals</p>
            </div>
          </div>
        </section>

      </div>
    </div>
  </DashboardLayout>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Icon } from '@iconify/vue'
import { useRouter } from 'vue-router'
import DashboardLayout from '@/layouts/DashboardLayout.vue'

const router = useRouter()

const statuses = ['All', 'Completed', 'Processing', 'Failed'] as const
type Status = typeof statuses[number]
const activeStatus = ref<Status>('All')

interface Withdrawal {
  asset: string
  network: string
  amount: string
  date: string
  source: string
  type: string
  status: string
  icon: string
  iconClass: string
}

const withdrawals: Withdrawal[] = [
  {
    asset: 'USDT',
    network: 'TRC20',
    amount: '1,500.00 USDT',
    date: 'May 15, 2025 01:24 PM',
    source: 'From Spot Wallet',
    type: 'On-chain withdrawal',
    status: 'Completed',
    icon: 'mdi:alpha-t-circle',
    iconClass: 'bg-[#08a99f] text-white',
  },
  {
    asset: 'BTC',
    network: 'Bitcoin Network',
    amount: '0.02500 BTC',
    date: 'May 14, 2025 08:18 AM',
    source: 'From Spot Wallet',
    type: 'On-chain withdrawal',
    status: 'Completed',
    icon: 'mdi:bitcoin',
    iconClass: 'bg-orange-500 text-white',
  },
  {
    asset: 'ETH',
    network: 'ERC20',
    amount: '2.000 ETH',
    date: 'May 13, 2025 06:41 PM',
    source: 'From Spot Wallet',
    type: 'On-chain withdrawal',
    status: 'Completed',
    icon: 'mdi:ethereum',
    iconClass: 'bg-indigo-500 text-white',
  },
  {
    asset: 'USDT',
    network: 'TRC20',
    amount: '850.00 USDT',
    date: 'May 12, 2025 10:35 AM',
    source: 'From Spot Wallet',
    type: 'On-chain withdrawal',
    status: 'Processing',
    icon: 'mdi:alpha-t-circle',
    iconClass: 'bg-[#08a99f] text-white',
  },
  {
    asset: 'ETH',
    network: 'ERC20',
    amount: '0.8500 ETH',
    date: 'May 11, 2025 09:07 PM',
    source: 'From Spot Wallet',
    type: 'On-chain withdrawal',
    status: 'Failed',
    icon: 'mdi:ethereum',
    iconClass: 'bg-indigo-500 text-white',
  },
]

const filteredWithdrawals = computed(() =>
  activeStatus.value === 'All'
    ? withdrawals
    : withdrawals.filter(w => w.status === activeStatus.value),
)

function statusClass(status: string) {
  if (status === 'Completed') return 'bg-[#eafffb] text-[#08a99f]'
  if (status === 'Processing') return 'bg-orange-50 text-orange-400'
  return 'bg-red-50 text-red-400'
}

function statusIcon(status: string) {
  if (status === 'Completed') return 'mdi:check-circle-outline'
  if (status === 'Processing') return 'mdi:clock-outline'
  return 'mdi:close-circle-outline'
}
</script>
