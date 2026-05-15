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
          <h1 class="text-[16px] font-semibold text-[#0b1638]">Copy Trade History</h1>
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
                  Total Copy Trade PnL
                  <Icon icon="mdi:eye-outline" class="text-[15px]" />
                </div>

                <div class="mt-4 flex items-end gap-2">
                  <h2 class="text-[34px] font-semibold leading-none tracking-[0.08em] text-[#08a99f]">
                    +1,825.75
                  </h2>
                  <span class="mb-1 text-xs font-semibold text-[#5b6d9a]">USDT</span>
                </div>

                <p class="mt-3 text-sm font-medium text-[#7a86a4]">≈$1,825.75</p>
              </div>

              <div class="relative flex h-26.25 w-35 items-center justify-center">
                <div class="absolute bottom-2 h-7 w-27 rounded-full bg-cyan-200/70 blur-md"></div>

                <div class="relative z-10 flex h-18 w-18 items-center justify-center rounded-2xl bg-linear-to-br from-[#dffaf8] to-[#0ba99d] shadow-xl">
                  <Icon icon="mdi:chart-line" class="text-5xl text-white" />
                </div>

                <div class="absolute left-7 top-9 flex h-10 w-10 items-center justify-center rounded-full bg-[#0ba99d] shadow-lg">
                  <Icon icon="mdi:swap-horizontal" class="text-[25px] text-white" />
                </div>

                <Icon icon="mdi:bitcoin" class="absolute right-6 top-3 text-xl text-[#20c7b7]" />
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

            <div class="relative">
              <button
                @click="showPeriod = !showPeriod"
                class="flex items-center gap-2 text-sm font-semibold text-[#17212f]"
              >
                <Icon icon="mdi:sort-variant" class="text-xl" />
                {{ activePeriod }}
                <Icon icon="mdi:chevron-down" class="text-[18px]" />
              </button>
              <div
                v-if="showPeriod"
                class="absolute right-0 top-8 z-10 min-w-32 overflow-hidden rounded-xl border border-gray-100 bg-white shadow-lg"
              >
                <button
                  v-for="p in periods"
                  :key="p"
                  @click="activePeriod = p; showPeriod = false"
                  class="flex w-full items-center px-4 py-2.5 text-xs font-semibold transition"
                  :class="activePeriod === p ? 'text-[#08a99f] bg-[#f6f8fb]' : 'text-[#17212f] hover:bg-gray-50'"
                >
                  {{ p }}
                </button>
              </div>
            </div>
          </div>
        </section>

        <!-- TRADE LIST -->
        <section class="mt-4 px-4">
          <div class="space-y-3">
            <article
              v-for="item in filteredTrades"
              :key="item.trader + item.date"
              class="flex items-center justify-between rounded-2xl border border-gray-100 bg-white px-4 py-5 shadow-sm"
            >
              <!-- LEFT -->
              <div class="flex items-center gap-4">
                <div
                  class="flex h-14 w-14 shrink-0 items-center justify-center rounded-full text-white text-[22px] font-bold"
                  :class="item.avatarClass"
                >
                  {{ item.trader.charAt(0) }}
                </div>

                <div>
                  <!-- Trader name + role pill -->
                  <div class="flex items-center gap-2">
                    <h3 class="text-[15px] font-semibold text-[#0b1638]">{{ item.trader }}</h3>
                    <span class="rounded-full bg-[#eafffb] px-2.5 py-0.5 text-[10px] font-semibold text-[#08a99f]">
                      {{ item.role }}
                    </span>
                  </div>

                  <!-- Status badge -->
                  <span
                    class="mt-2 inline-flex items-center gap-1 rounded-xl px-2.5 py-1 text-[11px] font-semibold"
                    :class="statusClass(item.status)"
                  >
                    <Icon :icon="statusIcon(item.status)" class="text-[13px]" />
                    {{ item.status }}
                  </span>

                  <!-- Date -->
                  <p class="mt-2 text-xs font-medium text-[#7a86a4]">{{ item.date }}</p>
                </div>
              </div>

              <!-- RIGHT -->
              <div class="text-right">
                <p class="text-[11px] font-medium text-[#7a86a4]">Total PnL</p>
                <p
                  class="mt-1 text-[16px] font-semibold"
                  :class="item.pnl.startsWith('+') ? 'text-[#08a99f]' : 'text-red-400'"
                >
                  {{ item.pnl }} USDT
                </p>
                <p
                  class="mt-1 text-[13px] font-semibold"
                  :class="item.pnlPct.startsWith('+') ? 'text-[#08a99f]' : 'text-red-400'"
                >
                  {{ item.pnlPct }}
                </p>
              </div>
            </article>

            <!-- Empty state -->
            <div v-if="filteredTrades.length === 0" class="flex flex-col items-center py-16 text-gray-400">
              <Icon icon="mdi:inbox-outline" class="text-5xl" />
              <p class="mt-3 text-xs font-semibold">No {{ activeStatus }} trades</p>
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

const statuses = ['All', 'Active', 'Closed'] as const
type Status = typeof statuses[number]
const activeStatus = ref<Status>('All')

const periods = ['All Time', 'Today', 'This Week', 'This Month', 'Last 3 Months'] as const
type Period = typeof periods[number]
const activePeriod = ref<Period>('All Time')
const showPeriod = ref(false)

interface Trade {
  trader: string
  role: string
  avatarClass: string
  pnl: string
  pnlPct: string
  date: string
  status: string
}

const trades: Trade[] = [
  {
    trader: 'Trader Pro',
    role: 'Lead Trader',
    avatarClass: 'bg-[#08a99f]',
    pnl: '+1,234.60',
    pnlPct: '+12.45%',
    date: 'May 15, 2025 10:24 AM',
    status: 'Active',
  },
  {
    trader: 'CryptoKing',
    role: 'Lead Trader',
    avatarClass: 'bg-indigo-500',
    pnl: '+580.20',
    pnlPct: '+8.32%',
    date: 'May 14, 2025 02:15 PM',
    status: 'Closed',
  },
  {
    trader: 'AlphaSignal',
    role: 'Lead Trader',
    avatarClass: 'bg-orange-500',
    pnl: '-215.40',
    pnlPct: '-3.18%',
    date: 'May 13, 2025 09:41 AM',
    status: 'Closed',
  },
  {
    trader: 'BullRunner',
    role: 'Lead Trader',
    avatarClass: 'bg-yellow-500',
    pnl: '+920.00',
    pnlPct: '+15.60%',
    date: 'May 13, 2025 06:30 AM',
    status: 'Active',
  },
  {
    trader: 'SmartQuant',
    role: 'Lead Trader',
    avatarClass: 'bg-slate-600',
    pnl: '-88.75',
    pnlPct: '-1.92%',
    date: 'May 11, 2025 11:07 PM',
    status: 'Closed',
  },
]

const filteredTrades = computed(() =>
  activeStatus.value === 'All'
    ? trades
    : trades.filter(t => t.status === activeStatus.value),
)

function statusClass(status: string) {
  if (status === 'Active') return 'bg-[#eafffb] text-[#08a99f]'
  return 'bg-gray-100 text-gray-400'
}

function statusIcon(status: string) {
  if (status === 'Active') return 'mdi:circle-slice-8'
  return 'mdi:check-circle-outline'
}
</script>
