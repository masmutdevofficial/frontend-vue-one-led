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
          <Icon icon="mdi:information-outline" class="text-[14px] text-gray-400" />
        </div>

        <div class="mt-4 flex items-center gap-5">
          <!-- DONUT CHART -->
          <div
            class="relative flex h-[126px] w-[126px] shrink-0 items-center justify-center rounded-full"
            style="background: conic-gradient(#04c7bd 0deg 126.9deg, #2e7df6 126.9deg 218.4deg, #8b4cf6 218.4deg 273.2deg, #f6b51e 273.2deg 310.5deg, #0bbf96 310.5deg 342.1deg, #d6dde5 342.1deg 360deg);"
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
              <span class="text-right text-[10px] font-semibold text-[#26313d]">{{ showBalance ? item.amount : '\u2022\u2022\u2022\u2022' }}</span>
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
          <button class="text-[10px] font-bold text-[#1fb9b2]">
            See All <Icon icon="mdi:arrow-right" class="inline text-[12px]" />
          </button>
        </div>

        <div class="mt-4 space-y-4">
          <div
            v-for="item in transactions"
            :key="item.type + item.asset"
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
                {{ showBalance ? item.amount : '\u2022\u2022\u2022\u2022' }}
              </p>
              <p class="mt-1 text-[9px] font-semibold text-gray-400">{{ item.time }}</p>
            </div>
            <span class="w-[62px] text-right text-[9px] font-bold text-[#1fb9b2]">{{ item.status }}</span>
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
import { makeUserApi } from '@/services/api'
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

// ── Balance chart points (10 pts scrolling) ───────────────────────────
const balancePoints = ref<number[]>([38, 50, 42, 58, 44, 66, 52, 70, 60, 75])

// ── Coin metadata — lookup from market store (with static fallback) ───────────
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

// Default demo holdings (used when API has no real data)
const DEFAULT_HOLDINGS: HoldingLive[] = [
  { symbol: 'BTC',  name: 'Bitcoin',  icon: 'mdi:bitcoin',                 iconClass: coinIconClass('BTC'),  amount: 1.2456789,   value: 74831.80, change:  1.24, chartPts: [38, 50, 40, 60, 46, 70, 55, 72] },
  { symbol: 'ETH',  name: 'Ethereum', icon: 'mdi:ethereum',                iconClass: coinIconClass('ETH'),  amount: 16.78901234, value: 53953.27, change:  2.35, chartPts: [30, 44, 36, 54, 42, 63, 52, 68] },
  { symbol: 'SOL',  name: 'Solana',   icon: 'mdi:circle-multiple-outline', iconClass: coinIconClass('SOL'),  amount: 188.245,     value: 32249.80, change: -0.45, chartPts: [68, 56, 62, 50, 58, 44, 50, 38] },
  { symbol: 'BNB',  name: 'BNB',      icon: 'mdi:alpha-b-circle',          iconClass: coinIconClass('BNB'),  amount: 36.789,      value: 21967.23, change:  0.88, chartPts: [40, 52, 36, 55, 44, 60, 52, 66] },
  { symbol: 'USDT', name: 'TetherUS', icon: 'mdi:alpha-t-circle',          iconClass: coinIconClass('USDT'), amount: 18614.20,    value: 18614.20, change:  0.01, chartPts: [50, 54, 49, 56, 52, 57, 54, 59] },
]

const holdingsLive = ref<HoldingLive[]>(DEFAULT_HOLDINGS)
const totalBalance = ref(DEFAULT_HOLDINGS.reduce((s, h) => s + h.value, 0))

const filteredHoldings = computed(() =>
  hideSmallBalances.value
    ? holdingsLive.value.filter(h => h.value >= SMALL_BALANCE_THRESHOLD)
    : holdingsLive.value
)

// ── Live tick ────────────────────────────────────────────────────────
let timer: ReturnType<typeof setInterval>

function tick() {
  holdingsLive.value = holdingsLive.value.map(h => {
    const delta     = (Math.random() - 0.499) * 0.0012
    const newValue  = h.value * (1 + delta)
    const newChange = Math.round((h.change + (Math.random() - 0.49) * 0.06) * 100) / 100
    const last      = h.chartPts[h.chartPts.length - 1]
    const bias      = newChange >= 0 ? 0.42 : 0.58
    const newPt     = Math.max(4, Math.min(96, last + (Math.random() - bias) * 12))
    return { ...h, value: newValue, change: newChange, chartPts: [...h.chartPts.slice(1), newPt] }
  })
  totalBalance.value = holdingsLive.value.reduce((s, h) => s + h.value, 0)
  const lastBal = balancePoints.value[balancePoints.value.length - 1]
  const newBal  = Math.max(4, Math.min(96, lastBal + (Math.random() - 0.44) * 10))
  balancePoints.value = [...balancePoints.value.slice(1), newBal]
}

onMounted(() => {
  timer = setInterval(tick, 900)
  marketStore.fetchCoins()
  // Fetch real balance from backend
  if (auth.accessToken) {
    makeUserApi(auth.accessToken).getBalance().then(d => {
      const rawTotal = parseFloat(d.total as unknown as string) || 0
      if (d.balances.length > 0) {
        const apiHoldings: HoldingLive[] = d.balances.map(b => {
          const amt  = parseFloat(b.amount as unknown as string) || 0
          const meta = getCoinMeta(b.coin.toUpperCase())
          const value = amt * meta.price
          return { symbol: b.coin.toUpperCase(), name: meta.name, icon: meta.icon, iconClass: meta.iconClass, amount: amt, value, change: 0, chartPts: [50, 52, 50, 54, 51, 55, 53, 56] }
        })
        holdingsLive.value = apiHoldings
        totalBalance.value = rawTotal || apiHoldings.reduce((s, h) => s + h.value, 0)
      } else if (rawTotal > 0) {
        // Only USDT balance in users table, no coin breakdown
        totalBalance.value = rawTotal
        holdingsLive.value = [{
          symbol: 'USDT', name: 'TetherUS', icon: 'mdi:alpha-t-circle', iconClass: coinIconClass('USDT'),
          amount: rawTotal, value: rawTotal, change: 0, chartPts: [50, 52, 50, 54, 51, 55, 53, 56],
        }]
      }
    }).catch(() => {/* use defaults */})
  }
})
onUnmounted(() => clearInterval(timer))

// ── Static data ─────────────────────────────────────────────────────────
interface QuickAction  { name: string; icon: string }
interface Allocation   { name: string; percent: string; amount: string; dot: string }
interface Transaction  { type: string; asset: string; icon: string; amount: string; time: string; status: string; positive: boolean }

const quickActions: QuickAction[] = [
  { name: 'Add Funds', icon: 'mdi:wallet-plus-outline' },
  { name: 'Transfer',  icon: 'mdi:swap-horizontal' },
  { name: 'Withdraw',  icon: 'mdi:tray-arrow-up' },
]

const allocations: Allocation[] = [
  { name: 'BTC',    percent: '35.26%', amount: '74,831.8 USDT',    dot: 'bg-[#04c7bd]' },
  { name: 'ETH',    percent: '25.41%', amount: '53,953.27 USDT',   dot: 'bg-[#2e7df6]' },
  { name: 'SOL',    percent: '15.21%', amount: '32,249.8 USDT',    dot: 'bg-[#8b4cf6]' },
  { name: 'BNB',    percent: '10.35%', amount: '21,967.23 USDT',   dot: 'bg-[#f6b51e]' },
  { name: 'USDT',   percent: '8.77%',  amount: '18,614.20 USDT',   dot: 'bg-[#0bbf96]' },
  { name: 'Others', percent: '5.00%',  amount: '10,600.00 USDT',   dot: 'bg-[#d6dde5]' },
]

const transactions: Transaction[] = [
  { type: 'Deposit',  asset: 'USDT',       icon: 'mdi:arrow-down-circle-outline',        amount: '+2,000.00 USDT', time: 'Today, 09:21 AM',      status: 'Completed', positive: true  },
  { type: 'Transfer', asset: 'To Funding', icon: 'mdi:swap-horizontal-circle-outline',   amount: '-1,500.00 USDT', time: 'Today, 08:15 AM',      status: 'Completed', positive: false },
  { type: 'Buy',      asset: 'BTC',        icon: 'mdi:cart-outline',                     amount: '+0.025 BTC',     time: 'Yesterday, 04:24 PM',  status: 'Completed', positive: true  },
]
</script>
