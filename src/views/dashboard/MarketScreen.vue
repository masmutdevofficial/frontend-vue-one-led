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

              <!-- Total Market Cap -->
              <div class="mt-4">
                <p class="text-[11px] font-semibold text-gray-400">Total Market Cap</p>
                <div class="mt-1 flex items-center justify-start">
                  <div class="mr-4">
                    <h2 class="text-[22px] font-semibold leading-none">${{ marketCapValue.toFixed(2) }}T</h2>
                    <span
                      class="mt-1 block text-[11px] font-semibold"
                      :class="marketCapChange >= 0 ? 'text-[#1fb9b2]' : 'text-red-400'"
                    >{{ (marketCapChange >= 0 ? '+' : '') + marketCapChange.toFixed(2) }}%</span>
                  </div>
                  <svg class="h-[40px] w-[72px] shrink-0" viewBox="0 0 72 40" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="mcGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stop-color="#62d9d3" stop-opacity="0.25" />
                        <stop offset="100%" stop-color="#62d9d3" stop-opacity="0" />
                      </linearGradient>
                    </defs>
                    <path :d="buildPath(marketCapPts, 72, 40, true)" fill="url(#mcGrad)" />
                    <path
                      :d="buildPath(marketCapPts, 72, 40)"
                      fill="none"
                      stroke="#62d9d3"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                </div>
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
          <div class="grid grid-cols-5 gap-x-2 border-b border-gray-100 px-4 py-3 text-[9px] font-bold text-gray-400">
            <span>Name</span>
            <span class="text-center">Last Price</span>
            <span class="text-center">24h Chg%</span>
            <span class="text-center">Mkt Cap</span>
            <span></span>
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
              class="grid grid-cols-5 items-center gap-x-2 px-4 py-4 cursor-pointer hover:bg-gray-50 active:bg-gray-100 transition-colors"
              @click="router.push('/trade/' + coin.name.toLowerCase())"
            >
              <!-- Name + icon -->
              <div class="flex items-center gap-2">
                <div
                  class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full"
                  :class="coinIconClass(coin.name)"
                >
                  <CoinIcon :icon="coin.icon" :symbol="coin.name" icon-class="text-[20px]" img-class="h-5 w-5 rounded-full" />
                </div>
                <div class="min-w-0">
                  <p class="text-[12px] font-extrabold leading-none">{{ coin.name }}</p>
                  <p class="mt-1 text-[9px] text-gray-400 break-words">{{ coin.fullName }}</p>
                </div>
              </div>

              <!-- Last Price -->
              <div class="flex flex-col items-center">
                <p class="text-[11px] font-bold leading-none">{{ formatPrice(coin.price) }}</p>
                <p class="mt-1 text-[9px] text-gray-400">${{ formatPrice(coin.price) }}</p>
              </div>

              <!-- 24h Change + mini spline chart -->
              <div class="flex items-center justify-center gap-1">
                <p class="text-[10px] font-bold" :class="coin.change >= 0 ? 'text-emerald-500' : 'text-red-400'">
                  {{ (coin.change >= 0 ? '+' : '') + coin.change.toFixed(2) }}%
                </p>
                <svg class="h-[26px] w-[44px] shrink-0" viewBox="0 0 52 26" preserveAspectRatio="none">
                  <defs>
                    <linearGradient :id="`cg-${coin.name}`" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stop-color="#62d9d3" stop-opacity="0.25" />
                      <stop offset="100%" stop-color="#62d9d3" stop-opacity="0" />
                    </linearGradient>
                  </defs>
                  <path :d="buildPath(coin.chartPoints, 52, 26, true)" :fill="`url(#cg-${coin.name})`" />
                  <path
                    :d="buildPath(coin.chartPoints, 52, 26)"
                    fill="none"
                    stroke="#62d9d3"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </div>

              <!-- Market Cap -->
              <div class="flex justify-center">
                <p class="text-[11px] font-bold">{{ coin.marketCap }}</p>
              </div>

              <!-- Star -->
              <button class="flex justify-end" @click.stop="toggleFavorite(coin.name)">
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
import { coinIconClass as storeCoinIconClass } from '@/stores/market'

const router = useRouter()

// ── Overview stats (live) ──────────────────────────────────────
const marketCapValue = ref(2.48)
const marketCapChange = ref(1.62)
const marketCapPts = ref([0.40, 0.45, 0.42, 0.50, 0.52, 0.55, 0.58, 0.62])
const volumeValue = ref(98.56)
const volumeChange = ref(3.31)
const volumePts = ref([0.35, 0.42, 0.38, 0.46, 0.50, 0.52, 0.55, 0.60])

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

function coinIconClass(name: string): string {
  return storeCoinIconClass(name)
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
  marketCap: string
  chartPoints: number[]
  isNewListing?: boolean
  tags: string[]
  binancePair: string
}

const marketsData = ref<Market[]>([
  { name: 'BTC',  fullName: 'Bitcoin',   icon: 'mdi:bitcoin',                 price: 64923.45, change:  1.24, marketCap: '$1.21T',   chartPoints: [0.30, 0.38, 0.35, 0.45, 0.42, 0.52, 0.50, 0.60], binancePair: 'BTCUSDT',  tags: ['Layer 1', 'Top 100'] },
  { name: 'ETH',  fullName: 'Ethereum',  icon: 'mdi:ethereum',                price:  3215.67, change:  2.35, marketCap: '$387.10B', chartPoints: [0.25, 0.35, 0.38, 0.46, 0.50, 0.55, 0.62, 0.72], binancePair: 'ETHUSDT',  tags: ['Layer 1', 'DeFi', 'Top 100'] },
  { name: 'SOL',  fullName: 'Solana',    icon: 'mdi:circle-multiple-outline', price:   171.25, change: -0.45, marketCap: '$79.45B',  chartPoints: [0.65, 0.60, 0.62, 0.55, 0.58, 0.52, 0.54, 0.48], binancePair: 'SOLUSDT',  tags: ['Layer 1', 'Top 100'] },
  { name: 'BNB',  fullName: 'BNB',       icon: 'mdi:alpha-b-circle',          price:   593.31, change:  0.81, marketCap: '$87.12B',  chartPoints: [0.35, 0.40, 0.38, 0.44, 0.42, 0.48, 0.46, 0.52], binancePair: 'BNBUSDT',  tags: ['Layer 1', 'Top 100'] },
  { name: 'XRP',  fullName: 'XRP',       icon: 'mdi:close',                   price:    0.522, change:  1.05, marketCap: '$28.46B',  chartPoints: [0.40, 0.44, 0.42, 0.48, 0.50, 0.52, 0.54, 0.56], binancePair: 'XRPUSDT',  tags: ['Top 100'] },
  { name: 'WIF',  fullName: 'dogwifhat', icon: 'mdi:dog',                     price:     2.45, change:  8.32, marketCap: '$2.45B',   chartPoints: [0.20, 0.28, 0.35, 0.45, 0.55, 0.62, 0.70, 0.78], binancePair: 'WIFUSDT',  isNewListing: true, tags: ['Top 100'] },
  { name: 'RNDR', fullName: 'Render',    icon: 'mdi:cube-scan',               price:     7.89, change: -1.23, marketCap: '$3.01B',   chartPoints: [0.70, 0.65, 0.68, 0.60, 0.58, 0.55, 0.52, 0.48], binancePair: 'RNDRUSDT', isNewListing: true, tags: ['DeFi', 'Top 100'] },
])

// Live WS prices
const { tickerMap } = useMarketWs()

// ── Helpers ────────────────────────────────────────────────────
function formatMarketCap(value: number): string {
  if (value >= 1e12) return `$${(value / 1e12).toFixed(2)}T`
  if (value >= 1e9)  return `$${(value / 1e9).toFixed(2)}B`
  if (value >= 1e6)  return `$${(value / 1e6).toFixed(2)}M`
  return `$${value.toLocaleString()}`
}
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
      return {
        name:        c.symbol,
        fullName:    c.name,
        icon:        c.icon ?? 'mdi:currency-usd',
        price:       existing?.price ?? 0,
        change:      existing?.change ?? 0,
        marketCap:   formatMarketCap(Number(c.market_cap) || 0),
        chartPoints: existing?.chartPoints ?? generateChartPoints(),
        isNewListing: existing?.isNewListing ?? false,
        tags:        existing?.tags ?? (c.is_featured ? ['Top 100'] : []),
        binancePair: (c.binance_pair as string | null) ?? (c.symbol + 'USDT'),
      } as Market
    })
  } catch {
    // keep hardcoded fallback
  }
}

// ── Computed filtered & sorted list ───────────────────────────
const displayedMarkets = computed(() => {
  let result = marketsData.value.slice()

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

// ── Live animation ─────────────────────────────────────────────
let timer: ReturnType<typeof setInterval>

function tick() {
  // Market cap
  const mcChDelta = (Math.random() - 0.47) * 0.08
  marketCapChange.value = Math.round((marketCapChange.value + mcChDelta) * 100) / 100
  marketCapValue.value = Math.round((marketCapValue.value + (Math.random() - 0.48) * 0.003) * 100) / 100
  const mcLast = marketCapPts.value[marketCapPts.value.length - 1]
  const mcNext = Math.max(0.05, Math.min(0.95, mcLast + (Math.random() - (marketCapChange.value > 0 ? 0.44 : 0.56)) * 0.1))
  marketCapPts.value = [...marketCapPts.value.slice(1), mcNext]

  // Volume
  const volChDelta = (Math.random() - 0.47) * 0.1
  volumeChange.value = Math.round((volumeChange.value + volChDelta) * 100) / 100
  volumeValue.value = Math.round((volumeValue.value + (Math.random() - 0.48) * 0.15) * 100) / 100
  const volLast = volumePts.value[volumePts.value.length - 1]
  const volNext = Math.max(0.05, Math.min(0.95, volLast + (Math.random() - (volumeChange.value > 0 ? 0.44 : 0.56)) * 0.1))
  volumePts.value = [...volumePts.value.slice(1), volNext]

  // Sparkline animation only — prices come from WS (watch below)
  marketsData.value = marketsData.value.map(coin => {
    const ptLast = coin.chartPoints[coin.chartPoints.length - 1]
    const ptNext = Math.max(0.05, Math.min(0.95, ptLast + (Math.random() - (coin.change > 0 ? 0.44 : 0.56)) * 0.1))
    return { ...coin, chartPoints: [...coin.chartPoints.slice(1), ptNext] }
  })
}

onMounted(() => {
  timer = setInterval(tick, 1200)
  fetchMarketCoins()
})
onUnmounted(() => { clearInterval(timer) })

// ── Update prices from WS ticker ───────────────────────────────
watch(tickerMap, (map) => {
  marketsData.value = marketsData.value.map(coin => {
    const t = map.get(coin.binancePair)
    if (!t) return coin
    return { ...coin, price: t.price, change: t.change }
  })
})

const miniBars = [24, 36, 44, 58, 75, 94]
</script>
