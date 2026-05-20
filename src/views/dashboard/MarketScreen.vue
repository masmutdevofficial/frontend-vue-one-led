<template>
  <DashboardLayout>
    <div class="min-h-screen bg-white text-[#17212f]">
      <!-- TOP TAB -->
      <header class="sticky top-[62px] z-30 bg-white">
        <div class="grid h-[48px] grid-cols-3 border-b border-gray-100">
          <button
            v-for="tab in topTabs"
            :key="tab"
            @click="activeTopTab = tab"
            class="relative flex items-center justify-center text-[13px] font-bold"
            :class="activeTopTab === tab ? 'text-[#16b8b0]' : 'text-[#222b36]'"
          >
            {{ tab }}
            <span
              v-if="activeTopTab === tab"
              class="absolute bottom-0 h-[3px] w-[44px] rounded-full bg-[#16b8b0]"
            ></span>
          </button>
        </div>
      </header>

      <!-- MARKET OVERVIEW CARD -->
      <section class="px-3 pt-3">
        <div class="relative overflow-hidden rounded-2xl border border-gray-100 bg-white px-4 py-4 shadow-sm">

          <div class="absolute right-0 top-0 h-full w-[55%] bg-gradient-to-l from-cyan-100/80 via-cyan-50/60 to-transparent"></div>

          <div class="relative z-10 flex items-start justify-between">
            <div class="w-[52%]">
              <div class="flex items-center gap-1">
                <h1 class="text-[16px] font-semibold">Market Overview</h1>
                <Icon icon="mdi:eye-outline" class="text-[14px] text-gray-400" />
              </div>

              <!-- 24h Trading Volume -->
              <div class="mt-5">
                <p class="text-[11px] font-semibold text-gray-400">24h Trading Volume</p>
                <div class="mt-1 flex items-center justify-start">
                  <div class="mr-4">
                    <h2 class="text-[22px] font-semibold leading-none">${{ volumeValue.toFixed(2) }}B</h2>
                    <span
                      class="mt-1 block text-[11px] font-semibold"
                      :class="volumeChange >= 0 ? 'text-[#1fb9b2]' : 'text-red-400'"
                    >{{ (volumeChange >= 0 ? '+' : '') + volumeChange.toFixed(2) }}%</span>
                  </div>
                  <svg class="h-[40px] w-[72px] shrink-0" viewBox="0 0 72 40" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="volGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stop-color="#62d9d3" stop-opacity="0.25" />
                        <stop offset="100%" stop-color="#62d9d3" stop-opacity="0" />
                      </linearGradient>
                    </defs>
                    <path :d="buildPath(volumePts, 72, 40, true)" fill="url(#volGrad)" />
                    <path
                      :d="buildPath(volumePts, 72, 40)"
                      fill="none"
                      stroke="#62d9d3"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <!-- Right illustration -->
            <img src="/images/market-banner.webp" alt="Market" class="mt-1 h-[145px] w-[165px] object-contain" />
          </div>
        </div>
      </section>

      <!-- CATEGORY FILTER -->
      <section class="mt-3 px-3">
        <div class="flex items-center gap-2 overflow-x-auto pb-1">
          <button
            v-for="item in categories"
            :key="item.name"
            @click="activeCategory = item.name"
            class="flex h-[38px] shrink-0 items-center justify-center gap-1.5 rounded-xl border px-4 text-[11px] font-bold shadow-sm"
            :class="
              activeCategory === item.name
                ? 'border-[#a8f4ef] bg-[#eafffd] text-[#1ab9b1]'
                : 'border-gray-100 bg-white text-gray-500'
            "
          >
            <Icon v-if="item.icon" :icon="item.icon" class="text-[15px]" />
            {{ item.name }}
          </button>

          <button class="ml-auto flex h-[38px] w-[42px] shrink-0 items-center justify-center rounded-xl border border-gray-100 bg-white shadow-sm">
            <Icon icon="mdi:filter-variant" class="text-[21px] text-[#1ab9b1]" />
          </button>
        </div>
      </section>

      <!-- MARKET TABLE -->
      <section class="mt-2 px-3">
        <div class="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
          <!-- TABLE HEADER -->
          <div class="flex items-center border-b border-gray-100 px-4 py-2.5 text-[10px] font-bold text-gray-400">
            <span class="flex-1">Name</span>
            <span class="w-22 text-right">Last Price</span>
            <span class="w-19 text-right pr-1">24h Chg%</span>
            <span class="w-8"></span>
          </div>

          <!-- Empty state -->
          <div v-if="displayedMarkets.length === 0" class="px-4 py-10 text-center text-[13px] font-semibold text-gray-400">
            No coins found
          </div>

          <!-- TABLE ROWS -->
          <div v-else class="divide-y divide-gray-100">
            <div
              v-for="coin in displayedMarkets"
              :key="coin.name"
              class="flex items-center px-4 py-3 cursor-pointer hover:bg-gray-50 active:bg-gray-100 transition-colors"
              @click="router.push('/trade/' + coin.name.toLowerCase())"
            >
              <!-- Name + icon -->
              <div class="flex flex-1 min-w-0 items-center gap-2.5">
                <div class="flex h-8 w-8 shrink-0 items-center justify-center">
                  <CoinIcon :icon="coin.icon" :symbol="coin.name" icon-class="text-[28px]" img-class="h-8 w-8 rounded-full object-contain" />
                </div>
                <div class="min-w-0">
                  <p class="text-[12px] font-extrabold leading-none">{{ coin.name }}</p>
                  <p class="mt-1 text-[10px] text-gray-400 truncate">{{ coin.fullName }}</p>
                </div>
              </div>

              <!-- Last Price (read tickerMap directly — same as TradeScreen coin picker) -->
              <div class="w-22 text-right">
                <p class="text-[12px] font-bold leading-none">{{ formatPrice(tickerMap.get(coin.binancePair)?.price ?? coin.price) }}</p>
                <p class="mt-1 text-[10px] text-gray-400">${{ formatPrice(tickerMap.get(coin.binancePair)?.price ?? coin.price) }}</p>
              </div>

              <!-- 24h Change -->
              <div class="w-19 flex justify-end pr-1">
                <span
                  class="inline-block rounded-lg px-2 py-1 text-[11px] font-bold"
                  :class="(tickerMap.get(coin.binancePair)?.change ?? coin.change) >= 0 ? 'bg-emerald-50 text-emerald-500' : 'bg-red-50 text-red-400'"
                >
                  {{ ((tickerMap.get(coin.binancePair)?.change ?? coin.change) >= 0 ? '+' : '') + (tickerMap.get(coin.binancePair)?.change ?? coin.change).toFixed(2) }}%
                </span>
              </div>

              <!-- Star -->
              <button class="flex w-8 shrink-0 justify-end" @click.stop="toggleFavorite(coin.name)">
                <Icon
                  :icon="favorites.has(coin.name) ? 'mdi:star' : 'mdi:star-outline'"
                  class="text-[18px] transition-colors"
                  :class="favorites.has(coin.name) ? 'text-yellow-400' : 'text-gray-300'"
                />
              </button>
            </div>
          </div>
        </div>
      </section>

      <!-- INFO BAR -->
      <section class="mt-3 px-3 pb-4">
        <div class="flex items-center gap-2 rounded-xl border border-gray-100 bg-white px-3 py-3 text-[10px] font-semibold text-gray-400">
          <Icon icon="mdi:information-outline" class="text-[16px] text-[#1ab9b1]" />
          <span>Prices shown in USDT. Tap on a coin to view details.</span>
        </div>
      </section>
    </div>
  </DashboardLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { Icon } from '@iconify/vue'
import DashboardLayout from '@/layouts/DashboardLayout.vue'
import CoinIcon from '@/components/CoinIcon.vue'
import { useMarketWs } from '@/services/marketWs'

const router = useRouter()

// ── Overview stats (live) ──────────────────────────────────────
const volumePts = ref<number[]>(Array(8).fill(98.56))

// Live 24h volume = sum of (volume * price) for all tracked pairs in billions
const volumeValue = computed(() => {
  let total = 0
  for (const coin of marketsData.value) {
    const t = tickerMap.value.get(coin.binancePair)
    if (t && t.volume > 0) total += t.volume * t.price
  }
  const bil = total / 1e9
  return bil > 0 ? Math.round(bil * 100) / 100 : 98.56  // fallback until WS connects
})

// Volume change = weighted avg change of coins with WS data
const volumeChange = computed(() => {
  let totalVol = 0
  let weighted = 0
  for (const coin of marketsData.value) {
    const t = tickerMap.value.get(coin.binancePair)
    if (t && t.volume > 0) {
      const usdVol = t.volume * t.price
      totalVol += usdVol
      weighted += coin.change * usdVol
    }
  }
  if (totalVol === 0) return 3.31  // fallback
  return Math.round((weighted / totalVol) * 100) / 100
})

// ── Favorites (localStorage) ───────────────────────────────────
const favorites = ref<Set<string>>(new Set(JSON.parse(localStorage.getItem('market-favorites') ?? '[]')))
function toggleFavorite(name: string) {
  const next = new Set(favorites.value)
  next.has(name) ? next.delete(name) : next.add(name)
  favorites.value = next
  localStorage.setItem('market-favorites', JSON.stringify([...next]))
}

// ── Spline path builder ────────────────────────────────────────
function buildPath(pts: number[], W: number, H: number, filled = false): string {
  const padTop = 2, padBottom = 2
  const range = Math.max(...pts) - Math.min(...pts) || 0.1
  const minV = Math.min(...pts) - range * 0.1
  const maxV = Math.max(...pts) + range * 0.1
  const xStep = W / (pts.length - 1)
  const toY = (v: number) => padTop + (1 - (v - minV) / (maxV - minV)) * (H - padTop - padBottom)
  let d = ''
  pts.forEach((v, i) => {
    const x = i * xStep
    const y = toY(v)
    if (i === 0) { d += `M ${x.toFixed(1)},${y.toFixed(1)}` }
    else {
      const px = (i - 1) * xStep
      const py = toY(pts[i - 1])
      const cpx = (px + x) / 2
      d += ` C ${cpx.toFixed(1)},${py.toFixed(1)} ${cpx.toFixed(1)},${y.toFixed(1)} ${x.toFixed(1)},${y.toFixed(1)}`
    }
  })
  if (filled) d += ` L ${((pts.length - 1) * xStep).toFixed(1)},${H} L 0,${H} Z`
  return d
}

// ── Formatters ─────────────────────────────────────────────────
function formatPrice(price: number): string {
  if (price >= 1000) return price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  if (price >= 1) return price.toFixed(2)
  return price.toFixed(6)
}

// ── Tabs & categories ──────────────────────────────────────────
const activeTopTab = ref('Crypto')
const activeCategory = ref('All')
const topTabs = ['Crypto', 'Top Gainers', 'New Listing']

interface Category {
  name: string
  icon: string | null
}
const categories: Category[] = [
  { name: 'All',       icon: null },
  { name: 'Favorites', icon: 'mdi:star-outline' },
  { name: 'Top 100',   icon: null },
  { name: 'DeFi',      icon: null },
  { name: 'Layer 1',   icon: null },
]

// ── Market data ────────────────────────────────────────────────
interface Market {
  name: string
  fullName: string
  icon: string
  price: number
  change: number
  chartPoints: number[]
  isNewListing?: boolean
  tags: string[]
  binancePair: string
}

const marketsData = ref<Market[]>([
  { name: 'BTC',  fullName: 'Bitcoin',   icon: 'mdi:bitcoin',                 price: 0, change:  0, chartPoints: [0.30, 0.38, 0.35, 0.45, 0.42, 0.52, 0.50, 0.60], binancePair: 'BTCUSDT',  tags: ['Layer 1', 'Top 100'] },
  { name: 'ETH',  fullName: 'Ethereum',  icon: 'mdi:ethereum',                price: 0, change:  0, chartPoints: [0.25, 0.35, 0.38, 0.46, 0.50, 0.55, 0.62, 0.72], binancePair: 'ETHUSDT',  tags: ['Layer 1', 'DeFi', 'Top 100'] },
  { name: 'SOL',  fullName: 'Solana',    icon: 'mdi:circle-multiple-outline', price: 0, change:  0, chartPoints: [0.65, 0.60, 0.62, 0.55, 0.58, 0.52, 0.54, 0.48], binancePair: 'SOLUSDT',  tags: ['Layer 1', 'Top 100'] },
  { name: 'BNB',  fullName: 'BNB',       icon: 'mdi:alpha-b-circle',          price: 0, change:  0, chartPoints: [0.35, 0.40, 0.38, 0.44, 0.42, 0.48, 0.46, 0.52], binancePair: 'BNBUSDT',  tags: ['Layer 1', 'Top 100'] },
  { name: 'XRP',  fullName: 'XRP',       icon: 'mdi:close',                   price: 0, change:  0, chartPoints: [0.40, 0.44, 0.42, 0.48, 0.50, 0.52, 0.54, 0.56], binancePair: 'XRPUSDT',  tags: ['Top 100'] },
  { name: 'WIF',  fullName: 'dogwifhat', icon: 'mdi:dog',                     price: 0, change:  0, chartPoints: [0.20, 0.28, 0.35, 0.45, 0.55, 0.62, 0.70, 0.78], binancePair: 'WIFUSDT',  isNewListing: true, tags: ['Top 100'] },
  { name: 'RNDR', fullName: 'Render',    icon: 'mdi:cube-scan',               price: 0, change:  0, chartPoints: [0.70, 0.65, 0.68, 0.60, 0.58, 0.55, 0.52, 0.48], binancePair: 'RNDRUSDT', isNewListing: true, tags: ['DeFi', 'Top 100'] },
])

// Live WS prices
const { tickerMap } = useMarketWs()

// ── Helpers ────────────────────────────────────────────────────
function generateChartPoints(): number[] {
  return Array.from({ length: 8 }, () => Math.random() * 0.8 + 0.1)
}

// ── Fetch coin list from admin-managed table ────────────────────
async function fetchMarketCoins() {
  try {
    const res = await fetch('https://api.one-led.io/v1/public/market-coins')
    if (!res.ok) return
    const data = await res.json()
    const coins: any[] = data.coins ?? []
    if (coins.length === 0) return
    marketsData.value = coins.map((c) => {
      const existing = marketsData.value.find(m => m.name === c.symbol)
      const currentPrice = existing?.price ?? 0
      return {
        name:          c.symbol,
        fullName:      c.name,
        icon:          c.icon ?? 'mdi:currency-usd',
        price:         currentPrice,
        change:        existing?.change ?? 0,
        chartPoints:   existing?.chartPoints ?? generateChartPoints(),
        isNewListing:  existing?.isNewListing ?? false,
        tags:          existing?.tags ?? (c.is_featured ? ['Top 100'] : []),
        binancePair:   (c.binance_pair as string | null) ?? (c.symbol + 'USDT'),
      } as Market
    })
  } catch {
    // keep hardcoded fallback
  }
}

// ── Computed filtered & sorted list — with live WS prices ─────────────────────
// Reading tickerMap.value inside this computed lets Vue auto-track the dependency.
// Every applyTick() call replaces tickerMap.value → computed invalidates →
// template re-renders with fresh prices. Same mechanism as volumeValue above.
const displayedMarkets = computed(() => {
  const map = tickerMap.value
  let result = marketsData.value.map(coin => {
    const t = map.get(coin.binancePair)
    return t ? { ...coin, price: t.price, change: Math.round(t.change * 100) / 100 } : coin
  })

  // Top tab
  if (activeTopTab.value === 'Top Gainers') {
    result = result.sort((a, b) => b.change - a.change)
  } else if (activeTopTab.value === 'New Listing') {
    result = result.filter(c => c.isNewListing)
  } else {
    result = result.filter(c => !c.isNewListing)
  }

  // Category
  if (activeCategory.value === 'Favorites') {
    result = result.filter(c => favorites.value.has(c.name))
  } else if (activeCategory.value !== 'All' && activeCategory.value !== 'Top 100') {
    result = result.filter(c => c.tags.includes(activeCategory.value))
  }

  return result
})

let timer: ReturnType<typeof setInterval>
let priceRefreshTimer: ReturnType<typeof setInterval>

function tick() {
  // Animate per-coin sparklines — prices come from WS (watch below)
  marketsData.value = marketsData.value.map(coin => {
    const ptLast = coin.chartPoints[coin.chartPoints.length - 1]
    const ptNext = Math.max(0.05, Math.min(0.95, ptLast + (Math.random() - (coin.change > 0 ? 0.44 : 0.56)) * 0.1))
    return { ...coin, chartPoints: [...coin.chartPoints.slice(1), ptNext] }
  })
}

// Apply current WS tickerMap immediately (catches snapshot that arrived before mount)
// NOTE: this only seeds marketsData baseline prices — the displayedMarkets computed
// overlays live tickerMap on top on every re-render, so this is just for the
// klines-based 24h change% fallback stored in marketsData.
function applyTickerPrices() {
  const map = tickerMap.value
  marketsData.value = marketsData.value.map(coin => {
    const t = map.get(coin.binancePair)
    return t ? { ...coin, price: t.price, change: Math.round(t.change * 100) / 100 } : coin
  })
}

// Fetch real prices from Binance klines (overrides stale WS snapshot)
async function fetchKlinesPrices() {
  const coins = marketsData.value
  await Promise.allSettled(coins.map(async (coin) => {
    try {
      const res = await fetch(
        `https://api.one-led.io/v1/public/klines?symbol=${coin.binancePair}&interval=1d&limit=1`
      )
      if (!res.ok) return
      const raw = await res.json()
      if (!Array.isArray(raw) || !raw[0]) return
      const close  = parseFloat(raw[0][4])
      const open   = parseFloat(raw[0][1])
      if (isNaN(close) || close <= 0) return
      const change = open > 0 ? Math.round(((close - open) / open) * 10000) / 100 : 0
      marketsData.value = marketsData.value.map(c =>
        c.name === coin.name ? { ...c, price: close, change } : c
      )
    } catch { /* ignore */ }
  }))
}

onMounted(async () => {
  timer = setInterval(tick, 1200)
  await fetchMarketCoins()
  applyTickerPrices()
  fetchKlinesPrices()
  priceRefreshTimer = setInterval(fetchKlinesPrices, 30_000)
})
onUnmounted(() => {
  clearInterval(timer)
  clearInterval(priceRefreshTimer)
})


// ── Update volume sparkline from real 24h volume data ─────────
watch(volumeValue, (val) => {
  if (val > 0) volumePts.value = [...volumePts.value.slice(1), val]
})

const miniBars = [24, 36, 44, 58, 75, 94]
</script>
