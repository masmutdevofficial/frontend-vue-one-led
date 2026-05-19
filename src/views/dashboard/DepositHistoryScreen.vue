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
                    {{ totalApproved.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}
                  </h2>
                  <span class="mb-1 text-xs font-semibold text-[#5b6d9a]">USDT</span>
                </div>

                <p class="mt-3 text-sm font-medium text-[#7a86a4]">≈ ${{ totalApproved.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}</p>
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

        <!-- DEPOSIT LIST -->
        <section class="mt-4 px-4">
          <!-- Loading -->
          <div v-if="loading" class="flex flex-col items-center py-16 text-gray-400">
            <Icon icon="mdi:loading" class="animate-spin text-4xl text-[#08a99f]" />
            <p class="mt-3 text-xs font-semibold">Loading deposits…</p>
          </div>

          <div v-else class="space-y-3">
            <article
              v-for="item in filteredDeposits"
              :key="item.id"
              class="flex items-center justify-between rounded-2xl border border-gray-100 bg-white px-4 py-5 shadow-sm"
            >
              <div class="flex items-center gap-4">
                <div
                  class="flex h-14 w-14 shrink-0 items-center justify-center rounded-full"
                  :class="coinIconClass(item)"
                >
                  <Icon :icon="coinIcon(item)" class="text-[34px]" />
                </div>

                <div>
                  <div class="flex items-center gap-2">
                    <h3 class="text-[17px] font-semibold text-[#0b1638]">{{ coinName(item) }}</h3>
                    <span class="rounded-md bg-[#eafffb] px-2 py-0.5 text-[10px] font-semibold text-[#08a99f]">
                      {{ networkName(item) }}
                    </span>
                  </div>

                  <p class="mt-2 text-[13px] font-medium text-[#7a86a4]">
                    {{ item.method === 'Automatic' ? 'Auto deposit' : 'Manual deposit' }}
                  </p>

                  <p class="mt-2 flex items-center gap-2 text-xs font-medium text-[#7a86a4]">
                    <Icon icon="mdi:wallet-outline" class="text-[15px]" />
                    To Spot Wallet
                  </p>
                </div>
              </div>

              <div class="text-right">
                <p class="text-[17px] font-semibold text-[#0b1638]">
                  {{ Number(item.amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 8, useGrouping: false }) }} {{ coinName(item) }}
                </p>

                <p class="mt-3 text-xs font-medium text-[#7a86a4]">{{ formatDate(item.created_at) }}</p>

                <span
                  class="mt-3 inline-flex items-center gap-1 rounded-xl px-3 py-1.5 text-[11px] font-semibold"
                  :class="statusClass(item.status_deposit)"
                >
                  <Icon :icon="statusIcon(item.status_deposit)" class="text-[15px]" />
                  {{ displayStatus(item.status_deposit) }}
                </span>
              </div>
            </article>

            <!-- Empty state -->
            <div v-if="filteredDeposits.length === 0" class="flex flex-col items-center py-16 text-gray-400">
              <Icon icon="mdi:inbox-outline" class="text-5xl" />
              <p class="mt-3 text-xs font-semibold">No deposits found</p>
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
import { makeWalletApi, type DepositRecord } from '@/services/api'

const router = useRouter()
const auth   = useAuthStore()

const statuses = ['All', 'Completed', 'Pending', 'Rejected'] as const
type Status = typeof statuses[number]
const activeStatus  = ref<Status>('All')
const deposits      = ref<DepositRecord[]>([])
const totalApproved = ref(0)
const loading       = ref(false)

// Map UI tab to DB enum value
const STATUS_MAP: Record<Status, string | undefined> = {
  All: undefined, Completed: 'Approved', Pending: 'Pending', Rejected: 'Rejected',
}

const filteredDeposits = computed(() => {
  if (activeStatus.value === 'All') return deposits.value
  const dbStatus = STATUS_MAP[activeStatus.value]
  return deposits.value.filter(d => d.status_deposit === dbStatus)
})

async function loadDeposits() {
  if (!auth.accessToken) return
  loading.value = true
  try {
    const data = await makeWalletApi(auth.accessToken).getDeposits()
    deposits.value      = data.deposits
    totalApproved.value = data.total_approved
  } catch { /* silently fail */ }
  finally { loading.value = false }
}

onMounted(loadDeposits)

// ─── Helpers to derive display info from DB record ───────────────
function coinName(d: DepositRecord): string {
  if (!d.bank) return 'USDT'
  const b = d.bank.trim().toUpperCase()
  if (b.startsWith('P2P')) return 'USDT'
  if (b === 'ADMIN TOP-UP') return 'USDT'
  const known = ['USDT','BTC','ETH','BNB','SOL','XRP','ADA','LTC','TRX','MATIC','AVAX']
  for (const c of known) if (b.includes(c)) return c
  return b.length <= 10 ? b : 'USDT'
}
function networkName(d: DepositRecord): string {
  if (!d.bank) return 'On-chain'
  const b = d.bank.trim()
  const bu = b.toUpperCase()
  if (b.startsWith('P2P'))          return 'P2P'
  if (bu === 'ADMIN TOP-UP')         return 'Admin'
  if (bu.includes('TRC20') || bu.includes('TRON'))  return 'TRC20'
  if (bu.includes('ERC20') || bu.includes('ETHER')) return 'ERC20'
  if (bu.includes('BEP20') || bu.includes('BSC'))   return 'BEP20'
  if (bu.includes('BITCOIN'))                       return 'Bitcoin'
  if (bu.includes('SOLANA'))                        return 'Solana'
  return 'On-chain'
}
function coinIcon(d: DepositRecord): string {
  const m: Record<string, string> = { USDT:'mdi:alpha-t-circle', BTC:'mdi:bitcoin', ETH:'mdi:ethereum',
    BNB:'mdi:currency-usd-circle', SOL:'mdi:star-circle', XRP:'mdi:alpha-x-circle' }
  return m[coinName(d)] ?? 'mdi:currency-usd'
}
function coinIconClass(d: DepositRecord): string {
  const m: Record<string, string> = { USDT:'bg-[#08a99f] text-white', BTC:'bg-orange-500 text-white',
    ETH:'bg-indigo-500 text-white', BNB:'bg-yellow-400 text-white',
    SOL:'bg-purple-500 text-white', XRP:'bg-slate-500 text-white' }
  return m[coinName(d)] ?? 'bg-gray-200 text-gray-500'
}
function displayStatus(s: string) {
  return s === 'Approved' ? 'Completed' : s
}
function statusClass(s: string) {
  if (s === 'Approved') return 'bg-[#eafffb] text-[#08a99f]'
  if (s === 'Pending')  return 'bg-orange-50 text-orange-400'
  return 'bg-red-50 text-red-400'
}
function statusIcon(s: string) {
  if (s === 'Approved') return 'mdi:check-circle-outline'
  if (s === 'Pending')  return 'mdi:clock-outline'
  return 'mdi:close-circle-outline'
}
function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleString('en-US', { month:'short', day:'numeric', year:'numeric', hour:'2-digit', minute:'2-digit' })
  } catch { return iso }
}
</script>
