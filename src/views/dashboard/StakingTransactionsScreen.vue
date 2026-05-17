<template>
  <DashboardLayout>
    <div class="min-h-screen bg-[#f6f8fb] text-[#0b1638]">
      <!-- HEADER -->
      <div class="relative flex h-14 items-center justify-center border-b border-gray-100 bg-white px-4">
        <button
          @click="router.back()"
          class="absolute left-3 flex h-9 w-9 items-center justify-center rounded-xl bg-[#f6f8fb] active:scale-95"
        >
          <Icon icon="mdi:chevron-left" class="text-[27px] text-[#243142]" />
        </button>
        <h1 class="text-[16px] font-semibold text-[#17212f]">Staking History</h1>
      </div>

      <div class="px-4 pt-4 pb-8">
        <!-- SUMMARY CARD -->
        <section class="relative overflow-hidden rounded-2xl border border-gray-100 bg-white px-5 py-5 shadow-sm">
          <div class="absolute right-0 top-0 h-full w-[48%] bg-linear-to-l from-cyan-100/80 via-cyan-50/60 to-transparent"></div>
          <div class="relative z-10 flex items-center justify-between">
            <div>
              <p class="text-[13px] font-medium text-[#7a86a4]">Total Staked (Active)</p>
              <div class="mt-3 flex items-end gap-2">
                <h2 class="text-[30px] font-semibold leading-none tracking-tight text-[#0b1638]">
                  {{ formatAmount(summary.total_staked) }}
                </h2>
                <span class="mb-1 text-[12px] font-semibold text-[#5b6d9a]">USDT</span>
              </div>
              <div class="mt-4 flex items-center gap-4">
                <div>
                  <p class="text-[11px] font-medium text-[#7a86a4]">Avg APR</p>
                  <p class="mt-1 text-[14px] font-semibold text-[#20c7b7]">{{ summary.avg_apr }}%</p>
                </div>
                <div class="h-8 w-px bg-gray-100"></div>
                <div>
                  <p class="text-[11px] font-medium text-[#7a86a4]">Active</p>
                  <p class="mt-1 text-[14px] font-semibold text-[#20c7b7]">{{ summary.active_positions }}</p>
                </div>
                <div class="h-8 w-px bg-gray-100"></div>
                <div>
                  <p class="text-[11px] font-medium text-[#7a86a4]">Daily Est.</p>
                  <p class="mt-1 text-[14px] font-semibold text-[#20c7b7]">{{ formatAmount(summary.daily_reward) }} USDT</p>
                </div>
              </div>
            </div>
            <div class="relative flex h-24 w-24 items-center justify-center">
              <div class="absolute bottom-1 h-8 w-20 rounded-full bg-cyan-200/60 blur-md"></div>
              <div class="relative z-10 flex h-16 w-16 items-center justify-center rounded-full bg-linear-to-br from-[#eafffb] to-[#08a99f] shadow-xl">
                <Icon icon="mdi:bank-outline" class="text-[36px] text-white" />
              </div>
            </div>
          </div>
        </section>

        <!-- FILTER TABS -->
        <section class="mt-4">
          <div class="flex items-center gap-2 rounded-2xl border border-gray-100 bg-white px-3 py-3 shadow-sm">
            <button
              v-for="s in statusTabs"
              :key="s.value"
              @click="activeStatus = s.value"
              class="h-9 rounded-xl px-4 text-[12px] font-semibold transition"
              :class="activeStatus === s.value ? 'bg-[#f0f3f8] text-[#08a99f] shadow-sm' : 'text-[#5b6d9a]'"
            >
              {{ s.label }}
            </button>
          </div>
        </section>

        <!-- POSITIONS LIST -->
        <section class="mt-4">
          <!-- Loading -->
          <div v-if="loading" class="flex justify-center py-10">
            <Icon icon="mdi:loading" class="animate-spin text-[32px] text-[#20c7b7]" />
          </div>

          <!-- Empty -->
          <div v-else-if="filteredPositions.length === 0" class="flex flex-col items-center justify-center py-14 text-center">
            <div class="flex h-16 w-16 items-center justify-center rounded-full bg-[#eafffb]">
              <Icon icon="mdi:bank-outline" class="text-[36px] text-[#20c7b7]" />
            </div>
            <p class="mt-4 text-[14px] font-semibold text-[#0b1638]">No staking positions</p>
            <p class="mt-1 text-[12px] font-medium text-[#7a86a4]">Start staking to earn daily rewards</p>
            <button
              @click="router.push('/staking')"
              class="mt-5 h-11 rounded-xl bg-[#08a99f] px-6 text-[13px] font-semibold text-white active:scale-95"
            >
              Start Staking
            </button>
          </div>

          <!-- Items -->
          <template v-else>
            <article
              v-for="pos in filteredPositions"
              :key="pos.id"
              class="mb-3 rounded-2xl border border-gray-100 bg-white px-4 py-4 shadow-sm"
            >
              <div class="flex items-center gap-3">
                <!-- Coin icon -->
                <div
                  class="flex h-11 w-11 shrink-0 items-center justify-center rounded-full"
                  :class="coinClass(pos.coin)"
                >
                  <CoinIcon :icon="coinIconResolved(pos.coin)" :symbol="pos.coin" icon-class="text-[26px]" img-class="h-6 w-6 rounded-full" />
                </div>

                <!-- Info -->
                <div class="flex-1 min-w-0">
                  <div class="flex items-center gap-2">
                    <h3 class="text-[15px] font-semibold text-[#0b1638]">{{ pos.coin }}</h3>
                    <span
                      class="rounded-full px-2 py-0.5 text-[10px] font-semibold"
                      :class="pos.type === 'flexible' ? 'bg-cyan-100 text-cyan-700' : 'bg-violet-100 text-violet-700'"
                    >
                      {{ pos.type === 'flexible' ? 'Flexible' : (pos.duration_days ? pos.duration_days + 'd' : 'Locked') }}
                    </span>
                  </div>
                  <p class="mt-0.5 text-[11px] font-medium text-[#7a86a4]">
                    {{ fmtDate(pos.started_at) }}
                    <span v-if="pos.matures_at"> · Matures {{ fmtDate(pos.matures_at) }}</span>
                  </p>
                </div>

                <!-- Status + amount -->
                <div class="shrink-0 text-right">
                  <p class="text-[14px] font-semibold text-[#0b1638]">{{ formatAmount(pos.amount) }} {{ pos.coin }}</p>
                  <span
                    class="mt-1 inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold"
                    :class="statusBadge(pos.status)"
                  >
                    {{ pos.status }}
                  </span>
                </div>
              </div>

              <!-- APR row -->
              <div class="mt-3 flex items-center gap-4 border-t border-gray-50 pt-3">
                <div>
                  <p class="text-[10px] font-medium text-[#7a86a4]">APR</p>
                  <p class="mt-0.5 text-[13px] font-semibold text-[#20c7b7]">{{ Number(pos.apr).toFixed(2) }}%</p>
                </div>
                <div>
                  <p class="text-[10px] font-medium text-[#7a86a4]">Est. Daily</p>
                  <p class="mt-0.5 text-[13px] font-semibold text-[#0b1638]">
                    {{ (Number(pos.amount) * Number(pos.apr) / 100 / 365).toFixed(6) }} {{ pos.coin }}
                  </p>
                </div>
                <div v-if="pos.ended_at">
                  <p class="text-[10px] font-medium text-[#7a86a4]">Ended</p>
                  <p class="mt-0.5 text-[13px] font-semibold text-[#0b1638]">{{ fmtDate(pos.ended_at) }}</p>
                </div>
                <div v-if="pos.status === 'active'" class="ml-auto">
                  <button
                    @click="openUnstake(pos)"
                    class="h-8 rounded-xl border border-gray-200 px-3 text-[11px] font-semibold text-[#4b5575] active:scale-95"
                  >
                    Unstake
                  </button>
                </div>
              </div>
            </article>
          </template>
        </section>
      </div>
    </div>

    <!-- BACKDROP -->
    <Teleport to="body">
      <Transition
        enter-from-class="opacity-0"
        enter-active-class="transition-opacity duration-300"
        leave-to-class="opacity-0"
        leave-active-class="transition-opacity duration-300"
      >
        <div
          v-if="unstakeTarget"
          class="fixed inset-0 z-50 bg-black/50"
          @click="unstakeTarget = null"
        ></div>
      </Transition>

      <!-- UNSTAKE CONFIRM SHEET -->
      <Transition
        enter-from-class="translate-y-full"
        enter-active-class="transition-transform duration-300"
        leave-to-class="translate-y-full"
        leave-active-class="transition-transform duration-300"
      >
        <div
          v-if="unstakeTarget"
          class="fixed inset-x-0 bottom-[75px] z-50 mx-auto max-w-107.5 rounded-t-3xl bg-white shadow-2xl"
        >
          <div class="flex justify-center pt-3">
            <div class="h-1 w-10 rounded-full bg-gray-200"></div>
          </div>
          <div class="px-5 pb-10 pt-4">
            <div class="flex items-center justify-between">
              <h3 class="text-[15px] font-semibold text-[#17212f]">Unstake {{ unstakeTarget.coin }}</h3>
              <button @click="unstakeTarget = null">
                <Icon icon="mdi:close" class="text-[22px] text-gray-400" />
              </button>
            </div>
            <div class="mt-4 rounded-xl bg-[#f6f8fb] p-4 space-y-2">
              <div class="flex justify-between">
                <p class="text-[11px] font-bold text-gray-400">Amount</p>
                <p class="text-[11px] font-semibold text-[#17212f]">{{ formatAmount(unstakeTarget.amount) }} {{ unstakeTarget.coin }}</p>
              </div>
              <div class="flex justify-between">
                <p class="text-[11px] font-bold text-gray-400">APR</p>
                <p class="text-[11px] font-semibold text-[#20c7b7]">{{ Number(unstakeTarget.apr).toFixed(2) }}%</p>
              </div>
              <div v-if="unstakeTarget.matures_at" class="flex justify-between">
                <p class="text-[11px] font-bold text-gray-400">Matures At</p>
                <p class="text-[11px] font-semibold text-[#17212f]">{{ fmtDate(unstakeTarget.matures_at) }}</p>
              </div>
              <div v-if="isEarlyWithdrawal(unstakeTarget)" class="flex justify-between">
                <p class="text-[11px] font-bold text-rose-400">Early Fee ({{ unstakeTarget.early_withdrawal_fee_pct }}%)</p>
                <p class="text-[11px] font-semibold text-rose-500">
                  -{{ (Number(unstakeTarget.amount) * Number(unstakeTarget.early_withdrawal_fee_pct) / 100).toFixed(4) }} {{ unstakeTarget.coin }}
                </p>
              </div>
            </div>
            <p v-if="isEarlyWithdrawal(unstakeTarget)" class="mt-3 rounded-xl bg-rose-50 px-4 py-3 text-[11px] font-medium leading-relaxed text-rose-600">
              ⚠ Withdrawing before maturity will forfeit accrued rewards and apply a fee.
            </p>
            <button
              @click="confirmUnstake"
              :disabled="unstakeLoading"
              class="mt-5 h-12 w-full rounded-xl bg-[#08a99f] text-[13px] font-semibold text-white active:scale-95 disabled:opacity-60"
            >
              {{ unstakeLoading ? 'Processing…' : 'Confirm Unstake' }}
            </button>
          </div>
        </div>
      </Transition>
    </Teleport>
  </DashboardLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { Icon } from '@iconify/vue'
import { useRouter } from 'vue-router'
import DashboardLayout from '@/layouts/DashboardLayout.vue'
import CoinIcon from '@/components/CoinIcon.vue'
import { makeStakingApi, type StakingPosition } from '@/services/api'
import { useAuthStore } from '@/stores/auth'
import { useMarketStore, coinIconClass } from '@/stores/market'
import { useToast } from '@/composables/useToast'

const router = useRouter()
const auth = useAuthStore()
const marketStore = useMarketStore()
const toast = useToast()

const loading = ref(false)
const positions = ref<StakingPosition[]>([])
const activeStatus = ref<'all' | 'active' | 'withdrawn'>('all')
const unstakeTarget = ref<StakingPosition | null>(null)
const unstakeLoading = ref(false)
const summary = ref({ total_staked: '0', daily_reward: '0', avg_apr: '0.00', active_positions: 0 })

const statusTabs = [
  { label: 'All',       value: 'all'       as const },
  { label: 'Active',    value: 'active'    as const },
  { label: 'Withdrawn', value: 'withdrawn' as const },
]

const filteredPositions = computed(() => {
  if (activeStatus.value === 'all') return positions.value
  return positions.value.filter(p => p.status === activeStatus.value)
})

// ── Helpers ──────────────────────────────────────────────────────────────────
function formatAmount(val: string | number): string {
  const n = Number(val)
  if (isNaN(n) || n === 0) return '0.00'
  if (n >= 1000) return n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  return n.toFixed(4).replace(/\.?0+$/, '') || '0'
}

function fmtDate(d: string): string {
  return new Date(d).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })
}

function isEarlyWithdrawal(pos: StakingPosition): boolean {
  if (!pos.matures_at) return false
  return Date.now() < new Date(pos.matures_at).getTime()
}

function coinIconResolved(coin: string): string {
  return marketStore.coinMap.get(coin.toUpperCase())?.icon ?? 'mdi:currency-usd-circle'
}
function coinClass(coin: string): string {
  return coinIconClass(coin.toUpperCase())
}

function statusBadge(status: string): string {
  switch (status) {
    case 'active':    return 'bg-emerald-100 text-emerald-700'
    case 'completed': return 'bg-blue-100 text-blue-700'
    case 'withdrawn': return 'bg-slate-100 text-slate-500'
    default:          return 'bg-gray-100 text-gray-500'
  }
}

// ── Data loading ─────────────────────────────────────────────────────────────
async function loadData() {
  if (!auth.accessToken) return
  loading.value = true
  try {
    const stakingApi = makeStakingApi(auth.accessToken)
    const [sumData, posData] = await Promise.all([
      stakingApi.getSummary(),
      stakingApi.getPositions('all'),
    ])
    summary.value = sumData
    positions.value = posData.positions
  } catch (err: any) {
    toast.error('Failed to load staking history.')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  marketStore.fetchCoins()
  loadData()
})

// ── Unstake ──────────────────────────────────────────────────────────────────
function openUnstake(pos: StakingPosition) {
  unstakeTarget.value = pos
}

async function confirmUnstake() {
  if (!unstakeTarget.value || !auth.accessToken) return
  unstakeLoading.value = true
  try {
    const stakingApi = makeStakingApi(auth.accessToken)
    const res = await stakingApi.unstakePosition(unstakeTarget.value.id)
    toast.success(`Unstaked! ${Number(res.returned_amount).toFixed(4)} ${res.coin} returned to your balance.`)
    unstakeTarget.value = null
    auth.refreshProfile().catch(() => {})
    loadData()
  } catch (err: any) {
    toast.error(err?.message ?? 'Failed to unstake. Please try again.')
  } finally {
    unstakeLoading.value = false
  }
}
</script>
