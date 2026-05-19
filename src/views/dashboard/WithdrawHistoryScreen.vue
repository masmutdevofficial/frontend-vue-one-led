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
                <div class="flex items-center gap-2 text-[12px] font-medium text-gray-400">
                  Total Withdrawals
                  <Icon icon="mdi:eye-outline" class="text-[15px]" />
                </div>

                <div class="mt-2 flex items-end gap-2">
                  <h2 class="text-[26px] font-bold leading-none tracking-tight">
                    {{ totalCompleted.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}
                  </h2>
                  <span class="mb-1 text-[11px] font-semibold text-[#5b6d9a]">USDT</span>
                </div>

                <p class="mt-2 text-[12px] text-gray-400">≈ ${{ totalCompleted.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}</p>
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
          <div class="flex items-center gap-2 rounded-2xl border border-gray-100 bg-white px-3 py-3 shadow-sm">
            <div class="flex min-w-0 flex-1 items-center gap-1 overflow-x-auto scrollbar-none">
              <button
                v-for="status in statuses"
                :key="status"
                @click="activeStatus = status"
                class="relative h-9 shrink-0 rounded-xl px-3 text-xs font-semibold transition"
                :class="activeStatus === status ? 'bg-[#f6f8fb] text-[#08a99f] shadow-sm' : 'text-[#5b6d9a]'"
              >
                {{ status }}
                <span
                  v-if="activeStatus === status"
                  class="absolute bottom-0 left-1/2 h-0.5 w-5 -translate-x-1/2 rounded-full bg-[#08a99f]"
                ></span>
              </button>
            </div>

            <button class="shrink-0 flex items-center gap-1 text-xs font-semibold text-[#17212f] whitespace-nowrap">
              <Icon icon="mdi:sort-variant" class="text-base" />
              All Time
              <Icon icon="mdi:chevron-down" class="text-[15px]" />
            </button>
          </div>
        </section>

        <!-- WITHDRAW LIST -->
        <section class="mt-4 px-4">
          <!-- Loading -->
          <div v-if="loading" class="flex items-center justify-center py-16">
            <Icon icon="mdi:loading" class="animate-spin text-4xl text-teal-500" />
          </div>

          <div v-else class="space-y-3">
            <article
              v-for="item in filteredWithdrawals"
              :key="item.id"
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
import { ref, computed, onMounted } from 'vue'
import { Icon } from '@iconify/vue'
import { useRouter } from 'vue-router'
import DashboardLayout from '@/layouts/DashboardLayout.vue'
import { useAuthStore } from '@/stores/auth'
import { makeWalletApi, type WithdrawalRecord } from '@/services/api'

const router = useRouter()
const auth   = useAuthStore()

const statuses = ['All', 'Completed', 'Processing', 'Failed'] as const
type Status = typeof statuses[number]
const activeStatus = ref<Status>('All')

// ─── API state ─────────────────────────────────────────────────────
const withdrawalsFromApi = ref<WithdrawalRecord[]>([])
const totalCompleted     = ref(0)
const loading            = ref(false)

async function loadWithdrawals() {
  if (!auth.accessToken) return
  loading.value = true
  try {
    const data = await makeWalletApi(auth.accessToken).getWithdrawals()
    withdrawalsFromApi.value = data.withdrawals
    totalCompleted.value     = data.total_completed
  } catch { /* silently fail */ }
  finally { loading.value = false }
}

onMounted(loadWithdrawals)

// ─── Coin/network meta ─────────────────────────────────────────────
interface CoinMeta { icon: string; iconClass: string }
const COIN_META: Record<string, CoinMeta> = {
  USDT: { icon: 'mdi:alpha-t-circle',      iconClass: 'bg-[#08a99f] text-white' },
  BTC:  { icon: 'mdi:bitcoin',             iconClass: 'bg-orange-500 text-white' },
  ETH:  { icon: 'mdi:ethereum',            iconClass: 'bg-indigo-500 text-white' },
  BNB:  { icon: 'mdi:currency-usd-circle', iconClass: 'bg-yellow-400 text-white' },
  SOL:  { icon: 'mdi:star-circle',         iconClass: 'bg-purple-500 text-white' },
  XRP:  { icon: 'mdi:alpha-x-circle',      iconClass: 'bg-slate-500 text-white' },
}

// ─── Derived display rows ──────────────────────────────────────────
interface DisplayWithdrawal {
  id: string
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

function parseRecord(w: WithdrawalRecord): DisplayWithdrawal {
  const parts  = (w.network ?? 'USDT|TRC20').split('|')
  const coin   = parts[0] || 'USDT'
  const net    = parts[1] || parts[0] || 'TRC20'
  const meta   = COIN_META[coin] ?? COIN_META.USDT
  const rawStatus = w.status_withdrawal
  const displayStatus =
    rawStatus === 'Completed' ? 'Completed' :
    rawStatus === 'Rejected'  ? 'Failed'    : 'Processing'
  return {
    id:        w.id,
    asset:     coin,
    network:   net,
    amount:    `${Number(w.amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 6 })} ${coin}`,
    date:      formatDate(w.created_at),
    source:    'From Spot Wallet',
    type:      'On-chain withdrawal',
    status:    displayStatus,
    icon:      meta.icon,
    iconClass: meta.iconClass,
  }
}

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleString('en-US', { month:'short', day:'numeric', year:'numeric', hour:'2-digit', minute:'2-digit' })
  } catch { return iso }
}

const mappedWithdrawals = computed(() => withdrawalsFromApi.value.map(parseRecord))

const filteredWithdrawals = computed(() =>
  activeStatus.value === 'All'
    ? mappedWithdrawals.value
    : mappedWithdrawals.value.filter(w => w.status === activeStatus.value),
)

function statusClass(status: string) {
  if (status === 'Completed')  return 'bg-[#eafffb] text-[#08a99f]'
  if (status === 'Processing') return 'bg-orange-50 text-orange-400'
  return 'bg-red-50 text-red-400'
}

function statusIcon(status: string) {
  if (status === 'Completed')  return 'mdi:check-circle-outline'
  if (status === 'Processing') return 'mdi:clock-outline'
  return 'mdi:close-circle-outline'
}
</script>
