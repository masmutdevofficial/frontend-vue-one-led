<template>
  <DashboardLayout>
    <div class="min-h-screen bg-[#f6f8fb] text-[#0b1638]">
      <div class="mx-auto min-h-screen bg-[#f6f8fb] pb-8">

        <!-- HEADER -->
        <div class="relative flex h-14 items-center justify-center border-b border-gray-100 bg-white px-4">
          <button
            @click="router.back()"
            class="absolute left-4 flex h-9 w-9 items-center justify-center rounded-xl bg-[#f6f8fb] active:scale-95"
          >
            <Icon icon="mdi:chevron-left" class="text-[25px] text-[#1f2937]" />
          </button>
          <h1 class="text-[16px] font-semibold text-[#0b1638]">Deposit History</h1>
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
                  Total Deposits
                  <Icon icon="mdi:eye-outline" class="text-[15px]" />
                </div>

                <div class="mt-4 flex items-end gap-2">
                  <h2 class="text-[34px] font-semibold leading-none tracking-[0.08em] text-[#0b1638]">
                    12,850.60
                  </h2>
                  <button class="mb-1 flex items-center gap-1 text-xs font-semibold text-[#5b6d9a]">
                    USDT
                    <Icon icon="mdi:chevron-down" class="text-[15px]" />
                  </button>
                </div>

                <p class="mt-3 text-sm font-medium text-[#7a86a4]">≈ $12,850.60</p>
              </div>

              <div class="relative flex h-26.25 w-35 items-center justify-center">
                <div class="absolute bottom-2 h-7 w-27 rounded-full bg-cyan-200/70 blur-md"></div>

                <div class="relative z-10 flex h-18 w-18 items-center justify-center rounded-2xl bg-linear-to-br from-[#dffaf8] to-[#0ba99d] shadow-xl">
                  <Icon icon="mdi:safe-square-outline" class="text-5xl text-white" />
                </div>

                <div class="absolute left-7 top-9 flex h-10 w-10 items-center justify-center rounded-full bg-[#0ba99d] shadow-lg">
                  <Icon icon="mdi:arrow-down" class="text-[25px] text-white" />
                </div>

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
                class="relative h-10 rounded-xl px-4 text-xs font-semibold transition"
                :class="activeStatus === status ? 'bg-[#f6f8fb] text-[#08a99f] shadow-sm' : 'text-[#5b6d9a]'"
              >
                {{ status }}
                <span
                  v-if="activeStatus === status"
                  class="absolute bottom-0 left-1/2 h-0.5 w-6 -translate-x-1/2 rounded-full bg-[#08a99f]"
                ></span>
              </button>
            </div>

            <button class="flex items-center gap-2 text-sm font-semibold text-[#17212f]">
              <Icon icon="mdi:sort-variant" class="text-xl" />
              All Time
              <Icon icon="mdi:chevron-down" class="text-[18px]" />
            </button>
          </div>
        </section>

        <!-- DEPOSIT LIST -->
        <section class="mt-4 px-4">
          <div class="space-y-3">
            <article
              v-for="item in filteredDeposits"
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

                  <p class="mt-2 text-[13px] font-medium text-[#7a86a4]">{{ item.method }}</p>

                  <p class="mt-2 flex items-center gap-2 text-xs font-medium text-[#7a86a4]">
                    <Icon icon="mdi:wallet-outline" class="text-[15px]" />
                    {{ item.destination }}
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
            <div v-if="filteredDeposits.length === 0" class="flex flex-col items-center py-16 text-gray-400">
              <Icon icon="mdi:inbox-outline" class="text-5xl" />
              <p class="mt-3 text-xs font-semibold">No {{ activeStatus }} deposits</p>
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

const statuses = ['All', 'Completed', 'Pending'] as const
type Status = typeof statuses[number]
const activeStatus = ref<Status>('All')

interface Deposit {
  asset: string
  network: string
  amount: string
  date: string
  method: string
  destination: string
  status: string
  icon: string
  iconClass: string
}

const deposits: Deposit[] = [
  {
    asset: 'USDT',
    network: 'TRC20',
    amount: '2,500.00 USDT',
    date: 'May 15, 2025 10:24 AM',
    method: 'On-chain deposit',
    destination: 'To Spot Wallet',
    status: 'Completed',
    icon: 'mdi:alpha-t-circle',
    iconClass: 'bg-[#08a99f] text-white',
  },
  {
    asset: 'BTC',
    network: 'Bitcoin Network',
    amount: '0.04500 BTC',
    date: 'May 14, 2025 03:18 PM',
    method: 'On-chain deposit',
    destination: 'To Spot Wallet',
    status: 'Completed',
    icon: 'mdi:bitcoin',
    iconClass: 'bg-orange-500 text-white',
  },
  {
    asset: 'ETH',
    network: 'ERC20',
    amount: '3.200 ETH',
    date: 'May 13, 2025 09:41 AM',
    method: 'On-chain deposit',
    destination: 'To Spot Wallet',
    status: 'Completed',
    icon: 'mdi:ethereum',
    iconClass: 'bg-indigo-500 text-white',
  },
  {
    asset: 'USDT',
    network: 'TRC20',
    amount: '1,200.00 USDT',
    date: 'May 13, 2025 02:35 AM',
    method: 'Internal transfer',
    destination: 'To Spot Wallet',
    status: 'Pending',
    icon: 'mdi:alpha-t-circle',
    iconClass: 'bg-[#08a99f] text-white',
  },
  {
    asset: 'ETH',
    network: 'ERC20',
    amount: '1.1500 ETH',
    date: 'May 11, 2025 11:07 PM',
    method: 'P2P deposit',
    destination: 'To Spot Wallet',
    status: 'Completed',
    icon: 'mdi:ethereum',
    iconClass: 'bg-indigo-500 text-white',
  },
]

const filteredDeposits = computed(() =>
  activeStatus.value === 'All'
    ? deposits
    : deposits.filter(d => d.status === activeStatus.value),
)

function statusClass(status: string) {
  if (status === 'Completed') return 'bg-[#eafffb] text-[#08a99f]'
  return 'bg-orange-50 text-orange-400'
}

function statusIcon(status: string) {
  if (status === 'Completed') return 'mdi:check-circle-outline'
  return 'mdi:clock-outline'
}
</script>
