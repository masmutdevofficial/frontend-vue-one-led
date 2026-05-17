<template>
  <DashboardLayout>
    <div class="min-h-screen bg-[#f6f8fb] text-[#17212f]">
      <!-- BALANCE CARD -->
      <section class="bg-white px-4 pt-4 pb-5 shadow-sm rounded-2xl">
        <div class="flex items-start justify-between">
          <div>
            <div class="flex items-center gap-1 text-[11px] font-semibold text-gray-400">
              Total Balance
              <button @click="showBalance = !showBalance" class="active:scale-90 transition-transform">
                <Icon :icon="showBalance ? 'mdi:eye-outline' : 'mdi:eye-off-outline'" class="text-[13px]" />
              </button>
            </div>
            <div class="mt-2 flex items-end gap-2">
              <h1 class="text-[30px] font-semibold leading-none tracking-tight text-[#18202b] tabular-nums">
                {{ showBalance ? fmt(totalBalance) : '\u2022\u2022\u2022\u2022\u2022\u2022' }}
              </h1>
              <button class="mb-1 flex items-center gap-1 text-[11px] font-bold text-[#222b36]">
                USDT <Icon icon="mdi:chevron-down" class="text-[15px]" />
              </button>
            </div>
            <p class="mt-2 text-[11px] font-medium text-gray-400">
              {{ showBalance ? '\u2248 $' + fmt(totalBalance) : '\u2248 $\u2022\u2022\u2022\u2022\u2022\u2022' }}
            </p>
          </div>

          <!-- SPLINE CHART -->
          <div class="mt-1 h-[65px] w-[130px]">
            <svg width="130" height="65" viewBox="0 0 130 65" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="balGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stop-color="#62d9d3" stop-opacity="0.3"/>
                  <stop offset="100%" stop-color="#62d9d3" stop-opacity="0"/>
                </linearGradient>
              </defs>
              <path :d="buildPath(balancePoints, 130, 65, true)" fill="url(#balGrad)" />
              <path :d="buildPath(balancePoints, 130, 65, false)" stroke="#62d9d3" stroke-width="1.8" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
        </div>

        <!-- QUICK ACTIONS -->
        <div class="mt-7 grid grid-cols-3 border-t border-gray-100 pt-4">
          <button
            v-for="item in quickActions"
            :key="item.name"
            @click="item.name === 'Add Funds' ? router.push('/add-funds') : item.name === 'Withdraw' ? router.push('/withdraw') : item.name === 'Transfer' ? router.push('/transfer') : undefined"
            class="flex flex-col items-center justify-center gap-2 active:scale-95"
          >
            <Icon :icon="item.icon" class="text-[25px] text-[#1fb9b2]" />
            <span class="text-[10px] font-semibold text-[#2a3441]">{{ item.name }}</span>
          </button>
        </div>
      </section>

      <!-- ASSET ALLOCATION -->
      <section class="mt-3 bg-white px-4 py-4 shadow-sm rounded-2xl">
        <div class="flex items-center gap-1">
          <h2 class="text-[14px] font-semibold text-[#18202b]">Asset Allocation</h2>
          <Icon
            icon="mdi:information-outline"
            class="text-[14px] text-gray-400"
            title="Distribution of your portfolio across different crypto assets based on current market value"
          />
        </div>

        <div class="mt-4 flex items-center gap-5">
          <!-- DONUT CHART -->
          <div
            class="relative flex h-[126px] w-[126px] shrink-0 items-center justify-center rounded-full"
            :style="donutStyle"
          >
            <div class="flex h-[78px] w-[78px] flex-col items-center justify-center rounded-full bg-white shadow-sm">
              <p class="text-[13px] font-semibold leading-none text-[#26313d] tabular-nums">
                {{ showBalance ? fmt(totalBalance) : '\u2022\u2022\u2022\u2022' }}
              </p>
              <p class="mt-1 text-[9px] font-semibold text-gray-400">USDT</p>
            </div>
          </div>

          <!-- LEGEND -->
          <div class="flex-1 space-y-3">
            <div
              v-for="item in allocations"
              :key="item.name"
              class="grid grid-cols-[1fr_48px_82px] items-center gap-2"
            >
              <div class="flex items-center gap-2">
                <span :class="item.dot" class="h-2 w-2 rounded-full"></span>
                <span class="text-[10px] font-bold text-[#26313d]">{{ item.name }}</span>
              </div>
              <span class="text-right text-[10px] font-semibold text-[#26313d]">{{ item.percent }}</span>
              <span class="text-right text-[10px] font-semibold text-[#26313d]">{{ showBalance ? item.amount : '••••' }}</span>
            </div>
          </div>
        </div>
      </section>

      <!-- HOLDINGS -->
      <section class="mt-3 bg-white px-4 py-4 shadow-sm rounded-2xl">
        <div class="flex items-center justify-between">
          <h2 class="text-[14px] font-semibold text-[#18202b]">Holdings</h2>
          <button
            @click="hideSmallBalances = !hideSmallBalances"
            class="flex items-center gap-1 text-[10px] font-bold text-[#1fb9b2] active:scale-95 transition-transform"
          >
            <Icon :icon="hideSmallBalances ? 'mdi:eye-outline' : 'mdi:eye-off-outline'" class="text-[14px]" />
            {{ hideSmallBalances ? 'Show All' : 'Hide Small Balances' }}
          </button>
        </div>

        <div class="mt-4 grid grid-cols-[1.2fr_1fr_1fr_70px_52px] gap-2 text-[9px] font-bold text-gray-400">
          <span>Asset</span><span>Amount</span><span>Value (USDT)</span><span>24h Trend</span><span class="text-right">24h Change</span>
        </div>

        <div class="mt-3 space-y-4">
          <div
            v-for="coin in filteredHoldings"
            :key="coin.symbol"
            class="grid grid-cols-[1.2fr_1fr_1fr_70px_52px] items-center gap-2"
          >
            <!-- Asset -->
            <div class="flex items-center gap-2">
              <div :class="coin.iconClass" class="flex h-7 w-7 items-center justify-center rounded-full">
                <CoinIcon :icon="coin.icon" :symbol="coin.symbol" icon-class="text-[18px]" img-class="h-4 w-4 rounded-full" />
              </div>
              <div>
                <p class="text-[11px] font-semibold leading-none">{{ coin.symbol }}</p>
                <p class="mt-1 text-[8px] font-semibold text-gray-400">{{ coin.name }}</p>
              </div>
            </div>

            <!-- Amount -->
            <div>
              <p class="text-[10px] font-semibold leading-none tabular-nums">
                {{ showBalance ? fmtCoin(coin.amount, coin.symbol) : '\u2022\u2022\u2022\u2022' }}
              </p>
              <p class="mt-1 text-[8px] font-semibold text-gray-400">{{ coin.symbol }}</p>
            </div>

            <!-- Value -->
            <div>
              <p class="text-[10px] font-semibold leading-none tabular-nums">
                {{ showBalance ? fmt(coin.value) : '\u2022\u2022\u2022\u2022' }}
              </p>
              <p class="mt-1 text-[8px] font-semibold text-gray-400">
                {{ showBalance ? '\u2248 $' + fmt(coin.value) : '\u2248 $\u2022\u2022\u2022\u2022' }}
              </p>
            </div>

            <!-- 24h Trend SVG spline -->
            <div class="h-[28px] w-[64px]">
              <svg width="64" height="28" viewBox="0 0 64 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient :id="'hg' + coin.symbol" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" :stop-color="coin.change >= 0 ? '#61d7d1' : '#f87171'" stop-opacity="0.3"/>
                    <stop offset="100%" :stop-color="coin.change >= 0 ? '#61d7d1' : '#f87171'" stop-opacity="0"/>
                  </linearGradient>
                </defs>
                <path :d="buildPath(coin.chartPts, 64, 28, true)" :fill="'url(#hg' + coin.symbol + ')'" />
                <path
                  :d="buildPath(coin.chartPts, 64, 28, false)"
                  :stroke="coin.change >= 0 ? '#61d7d1' : '#f87171'"
                  stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round"
                />
              </svg>
            </div>

            <!-- Change -->
            <div class="text-right text-[10px] font-semibold tabular-nums" :class="coin.change >= 0 ? 'text-[#1fb9b2]' : 'text-red-400'">
              {{ (coin.change >= 0 ? '+' : '') + coin.change.toFixed(2) }}%
            </div>
          </div>
        </div>
      </section>

      <!-- RECENT TRANSACTIONS -->
      <section class="mt-3 bg-white px-4 py-4 shadow-sm rounded-2xl">
        <div class="flex items-center justify-between">
          <h2 class="text-[14px] font-semibold text-[#18202b]">Recent Transactions</h2>
          <button @click="router.push('/transactions')" class="text-[10px] font-bold text-[#1fb9b2]">
            See All <Icon icon="mdi:arrow-right" class="inline text-[12px]" />
          </button>
        </div>

        <!-- loading skeleton -->
        <div v-if="txLoading" class="mt-4 space-y-4">
          <div v-for="i in 3" :key="i" class="flex items-center justify-between animate-pulse">
            <div class="flex items-center gap-3">
              <div class="h-8 w-8 rounded-full bg-gray-100"></div>
              <div class="space-y-1.5">
                <div class="h-2.5 w-20 rounded bg-gray-100"></div>
                <div class="h-2 w-12 rounded bg-gray-100"></div>
              </div>
            </div>
            <div class="space-y-1.5 text-right">
              <div class="h-2.5 w-20 rounded bg-gray-100 ml-auto"></div>
              <div class="h-2 w-14 rounded bg-gray-100 ml-auto"></div>
            </div>
          </div>
        </div>

        <div v-else-if="transactions.length === 0" class="mt-6 flex flex-col items-center py-8 text-gray-300">
          <Icon icon="mdi:receipt-text-outline" class="text-4xl" />
          <p class="mt-2 text-[11px] font-semibold">No transactions yet</p>
        </div>

        <div v-else class="mt-4 space-y-4">
          <div
            v-for="item in transactions"
            :key="item.id"
            class="flex items-center justify-between"
          >
            <div class="flex items-center gap-3">
              <div class="flex h-8 w-8 items-center justify-center rounded-full bg-[#e9fffc]">
                <Icon :icon="item.icon" class="text-[19px] text-[#1fb9b2]" />
              </div>
              <div>
                <p class="text-[11px] font-semibold leading-none">{{ item.type }}</p>
                <p class="mt-1 text-[9px] font-semibold text-gray-400">{{ item.asset }}</p>
              </div>
            </div>
            <div class="text-right">
              <p class="text-[11px] font-semibold leading-none" :class="item.positive ? 'text-[#1fb9b2]' : 'text-[#26313d]'">
                {{ showBalance ? item.amount : '••••' }}
              </p>
              <p class="mt-1 text-[9px] font-semibold text-gray-400">{{ item.time }}</p>
            </div>
            <span
              class="w-[62px] text-right text-[9px] font-bold"
              :class="item.status === 'Approved' || item.status === 'Completed' ? 'text-[#1fb9b2]' : item.status === 'Pending' ? 'text-amber-500' : 'text-red-400'"
            >{{ item.status }}</span>
          </div>
        </div>
      </section>
    </div>
  </DashboardLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { Icon } from '@iconify/vue'
import { useRouter } from 'vue-router'
import DashboardLayout from '@/layouts/DashboardLayout.vue'
import CoinIcon from '@/components/CoinIcon.vue'
import { useAuthStore } from '@/stores/auth'
import { makeUserApi, makeWalletApi } from '@/services/api'
import { useMarketStore, coinIconClass } from '@/stores/market'

const router = useRouter()
const auth   = useAuthStore()
const marketStore = useMarketStore()

// ── Show / hide balance ─────────────────────────────────────────────
const showBalance = ref(true)
const hideSmallBalances = ref(false)
const SMALL_BALANCE_THRESHOLD = 5000 // USDT

// ── Spline path builder ───────────────────────────────────────────
function buildPath(pts: number[], W: number, H: number, filled = false): string {
  if (pts.length < 2) return ''
  const n = pts.length
  const mn = Math.min(...pts), mx = Math.max(...pts)
  const range = mx - mn || 1
  const xs = pts.map((_, i) => (i / (n - 1)) * W)
  const ys = pts.map(p => H - ((p - mn) / range) * H * 0.76 - H * 0.12)
  let d = `M ${xs[0]},${ys[0]}`
  for (let i = 1; i < n; i++) {
    const cx = (xs[i - 1] + xs[i]) / 2
    d += ` C ${cx},${ys[i - 1]} ${cx},${ys[i]} ${xs[i]},${ys[i]}`
  }
  if (filled) d += ` L ${W},${H} L 0,${H} Z`
  return d
}

// ── Formatting ───────────────────────────────────────────────────────
function fmt(n: number, dec = 2): string {
  return n.toLocaleString('en-US', { minimumFractionDigits: dec, maximumFractionDigits: dec })
}
function fmtCoin(n: number, sym: string): string {
  if (sym === 'USDT') return fmt(n, 2)
  if (n >= 100) return fmt(n, 3)
  if (n >= 1)   return n.toFixed(5)
  return n.toFixed(7)
}
function fmtDate(iso: string): string {
  const d = new Date(iso)
  const now = new Date()
  const yesterday = new Date(now); yesterday.setDate(yesterday.getDate() - 1)
  const time = d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
  if (d.toDateString() === now.toDateString())       return `Today, ${time}`
  if (d.toDateString() === yesterday.toDateString()) return `Yesterday, ${time}`
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) + ', ' + time
}

// ── Balance chart points (10 pts scrolling) ───────────────────────────
const balancePoints = ref<number[]>([38, 50, 42, 58, 44, 66, 52, 70, 60, 75])

// ── Coin metadata ────────────────────────────────────────────────────
const COIN_META_FALLBACK: Record<string, { name: string; icon: string; price: number }> = {
  BTC:  { name: 'Bitcoin',   icon: 'mdi:bitcoin',                 price: 64923  },
  ETH:  { name: 'Ethereum',  icon: 'mdi:ethereum',                price: 3215   },
  SOL:  { name: 'Solana',    icon: 'mdi:circle-multiple-outline', price: 171    },
  BNB:  { name: 'BNB',       icon: 'mdi:alpha-b-circle',          price: 593    },
  USDT: { name: 'TetherUS',  icon: 'mdi:alpha-t-circle',          price: 1      },
  USDC: { name: 'USD Coin',  icon: 'mdi:alpha-u-circle',          price: 1      },
  XRP:  { name: 'Ripple',    icon: 'mdi:alpha-x-circle',          price: 0.52   },
}

function getCoinMeta(symbol: string): { name: string; icon: string; iconClass: string; price: number } {
  const upper = symbol.toUpperCase()
  const storeData = marketStore.coinMap.get(upper)
  const ticker    = marketStore.tickerMap.get(storeData?.binancePair ?? upper + 'USDT')
  const fallback  = COIN_META_FALLBACK[upper]
  return {
    name:      storeData?.name  ?? fallback?.name  ?? symbol,
    icon:      storeData?.icon  ?? fallback?.icon  ?? 'mdi:currency-usd',
    iconClass: coinIconClass(upper),
    price:     ticker?.price    ?? fallback?.price ?? 1,
  }
}

// ── Holdings live state ────────────────────────────────────────────────
interface HoldingLive {
  symbol: string; name: string; icon: string; iconClass: string
  amount: number; value: number; change: number; chartPts: number[]
}

const holdingsLive = ref<HoldingLive[]>([])
const totalBalance = ref(0)

const filteredHoldings = computed(() =>
  hideSmallBalances.value
    ? holdingsLive.value.filter(h => h.value >= SMALL_BALANCE_THRESHOLD)
    : holdingsLive.value
)

// ── Dynamic allocation (computed from actual holdings) ──────────────
const ALLOC_COLORS     = ['#04c7bd', '#2e7df6', '#8b4cf6', '#f6b51e', '#0bbf96', '#d6dde5']
const ALLOC_DOT_CLASSES = ['bg-[#04c7bd]', 'bg-[#2e7df6]', 'bg-[#8b4cf6]', 'bg-[#f6b51e]', 'bg-[#0bbf96]', 'bg-[#d6dde5]']

const allocations = computed(() => {
  const total = holdingsLive.value.reduce((s, h) => s + h.value, 0)
  if (!total) return []
  const sorted = [...holdingsLive.value].sort((a, b) => b.value - a.value)
  const top5 = sorted.slice(0, 5)
  const othersValue = sorted.slice(5).reduce((s, h) => s + h.value, 0)
  const result = top5.map((h, i) => ({
    name: h.symbol,
    percent: ((h.value / total) * 100).toFixed(2) + '%',
    amount: fmt(h.value) + ' USDT',
    dot: ALLOC_DOT_CLASSES[i],
    color: ALLOC_COLORS[i],
    valuePct: h.value / total,
  }))
  if (othersValue > 0) {
    result.push({ name: 'Others', percent: ((othersValue / total) * 100).toFixed(2) + '%', amount: fmt(othersValue) + ' USDT', dot: ALLOC_DOT_CLASSES[5], color: ALLOC_COLORS[5], valuePct: othersValue / total })
  }
  return result
})

const donutStyle = computed(() => {
  if (!allocations.value.length) return 'background: #d6dde5'
  let deg = 0
  const parts = allocations.value.map(a => {
    const start = deg; deg += a.valuePct * 360
    return `${a.color} ${start.toFixed(1)}deg ${deg.toFixed(1)}deg`
  })
  return `background: conic-gradient(${parts.join(', ')})`
})

// ── Live tick ────────────────────────────────────────────────────────
let timer: ReturnType<typeof setInterval>

function tick() {
  holdingsLive.value = holdingsLive.value.map(h => {
    // Use live price from market store if available
    const meta   = getCoinMeta(h.symbol)
    const newValue  = h.symbol === 'USDT' ? h.amount : h.amount * meta.price
    const delta  = (Math.random() - 0.499) * 0.0012
    const tickedValue = h.symbol === 'USDT' ? newValue : newValue * (1 + delta)
    const newChange = Math.round((h.change + (Math.random() - 0.49) * 0.06) * 100) / 100
    const last   = h.chartPts[h.chartPts.length - 1]
    const bias   = newChange >= 0 ? 0.42 : 0.58
    const newPt  = Math.max(4, Math.min(96, last + (Math.random() - bias) * 12))
    return { ...h, value: tickedValue, change: newChange, chartPts: [...h.chartPts.slice(1), newPt] }
  })
  totalBalance.value = holdingsLive.value.reduce((s, h) => s + h.value, 0)
  const lastBal = balancePoints.value[balancePoints.value.length - 1]
  const newBal  = Math.max(4, Math.min(96, lastBal + (Math.random() - 0.44) * 10))
  balancePoints.value = [...balancePoints.value.slice(1), newBal]
}

// ── Recent Transactions ─────────────────────────────────────────────
interface TxItem {
  id: string; type: string; asset: string; icon: string
  amount: string; time: string; status: string; positive: boolean; created_at: string
}
const transactions = ref<TxItem[]>([])
const txLoading    = ref(false)

async function loadTransactions() {
  if (!auth.accessToken) return
  txLoading.value = true
  try {
    const [depData, wdrData, trfData] = await Promise.all([
      makeWalletApi(auth.accessToken).getDeposits(),
      makeWalletApi(auth.accessToken).getWithdrawals(),
      makeWalletApi(auth.accessToken).getTransfers(),
    ])
    const items: TxItem[] = []
    for (const d of depData.deposits) {
      items.push({ id: d.id, type: 'Deposit', asset: 'USDT', icon: 'mdi:arrow-down-circle-outline', amount: '+' + fmt(parseFloat(d.amount as unknown as string)) + ' USDT', time: fmtDate(d.created_at), status: d.status_deposit, positive: true, created_at: d.created_at })
    }
    for (const w of wdrData.withdrawals) {
      const parts = (w.network ?? '').split('|')
      const coin = parts.length > 1 ? parts[0] : 'USDT'
      items.push({ id: w.id, type: 'Withdrawal', asset: coin, icon: 'mdi:arrow-up-circle-outline', amount: '-' + fmt(parseFloat(w.amount as unknown as string)) + ' ' + coin, time: fmtDate(w.created_at), status: w.status_withdrawal, positive: false, created_at: w.created_at })
    }
    for (const t of trfData.transfers) {
      const isIn = t.direction === 'received'
      const label = isIn ? `from ${t.sender_name ?? '?'}` : `to ${t.recipient_name ?? '?'}`
      items.push({ id: t.id, type: isIn ? 'Transfer In' : 'Transfer Out', asset: `${t.coin} ${label}`, icon: 'mdi:swap-horizontal-circle-outline', amount: (isIn ? '+' : '-') + fmt(parseFloat(t.amount as unknown as string)) + ' ' + t.coin, time: fmtDate(t.created_at), status: 'Completed', positive: isIn, created_at: t.created_at })
    }
    items.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    transactions.value = items.slice(0, 5)
  } catch { /* silently fail */ }
  finally { txLoading.value = false }
}

// ── On mount ─────────────────────────────────────────────────────────
onMounted(async () => {
  timer = setInterval(tick, 900)
  await marketStore.fetchCoins()

  if (!auth.accessToken) return

  try {
    const d = await makeUserApi(auth.accessToken).getBalance()
    const rawUsdt = parseFloat(d.total as unknown as string) || 0
    const apiHoldings: HoldingLive[] = []

    // Add non-USDT coin balances
    for (const b of d.balances) {
      const sym = b.coin.toUpperCase()
      if (sym === 'USDT') continue
      const amt  = parseFloat(b.amount as unknown as string) || 0
      if (amt <= 0) continue
      const meta = getCoinMeta(sym)
      apiHoldings.push({ symbol: sym, name: meta.name, icon: meta.icon, iconClass: meta.iconClass, amount: amt, value: amt * meta.price, change: 0, chartPts: [50, 52, 50, 54, 51, 55, 53, 56] })
    }

    // Always add USDT from users.balance
    if (rawUsdt > 0) {
      const meta = getCoinMeta('USDT')
      apiHoldings.push({ symbol: 'USDT', name: 'TetherUS', icon: meta.icon, iconClass: meta.iconClass, amount: rawUsdt, value: rawUsdt, change: 0, chartPts: [50, 52, 50, 54, 51, 55, 53, 56] })
    }

    if (apiHoldings.length > 0) {
      holdingsLive.value = apiHoldings
      totalBalance.value = apiHoldings.reduce((s, h) => s + h.value, 0)
    }
  } catch { /* keep empty */ }

  await loadTransactions()
})
onUnmounted(() => clearInterval(timer))

// ── Static data ─────────────────────────────────────────────────────────
interface QuickAction { name: string; icon: string }
const quickActions: QuickAction[] = [
  { name: 'Add Funds', icon: 'mdi:wallet-plus-outline' },
  { name: 'Transfer',  icon: 'mdi:swap-horizontal' },
  { name: 'Withdraw',  icon: 'mdi:tray-arrow-up' },
]
</script>
