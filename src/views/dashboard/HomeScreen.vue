<template>
  <DashboardLayout>
    <div class="min-h-screen bg-[#f6f8fb] text-[#1f2933]">
      <!-- HERO BANNER -->
      <section class="px-3 pt-4">
        <Swiper
          :modules="[Autoplay, Pagination]"
          :autoplay="{ delay: 3000, disableOnInteraction: false }"
          :pagination="{ clickable: true }"
          :loop="true"
          class="hero-swiper h-36.25 rounded-2xl bg-white shadow-sm border border-gray-100"
        >
          <SwiperSlide>
            <div class="relative h-36.25">
              <div class="absolute right-0 top-0 h-full w-[52%] bg-linear-to-l from-cyan-100/80 via-cyan-50/70 to-transparent"></div>
              <div class="relative z-10 flex h-full items-center justify-between px-5">
                <div class="max-w-47.5">
                  <p class="text-[10px] font-semibold text-gray-600">Trade Smarter, Grow Together</p>
                  <h1 class="mt-1 text-[24px] font-extrabold leading-[1.05] text-[#1f2937]">The Future of <br /><span class="text-[#1cb8b1]">Trading</span> is Here</h1>
                  <button class="mt-4 rounded-full border border-[#1cb8b1] px-4 py-2 text-[11px] font-bold text-[#1cb8b1] transition-colors hover:bg-[#e9fffc] active:bg-[#e9fffc]" @click.stop="router.push('/market')">Explore Now <Icon icon="mdi:arrow-right" class="inline text-[14px]" /></button>
                </div>
                <img src="/images/home-banner.webp" alt="Trading" class="h-25 w-30 sm:w-50 rounded-2xl object-cover " />
              </div>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div class="relative h-36.25"><div class="absolute right-0 top-0 h-full w-[52%] bg-linear-to-l from-violet-100/80 via-violet-50/70 to-transparent"></div>
              <div class="relative z-10 flex h-full items-center justify-between px-5"><div class="max-w-47.5"><p class="text-[12px] font-semibold text-gray-600">Follow Elite Traders</p><h1 class="mt-1 text-[24px] font-extrabold leading-[1.05] text-[#1f2937]">Copy Trade &<br /><span class="text-violet-500">Earn</span> Daily</h1><button class="mt-4 rounded-full border border-violet-500 px-4 py-2 text-[11px] font-bold text-violet-500 transition-colors hover:bg-violet-100 active:bg-violet-100" @click.stop="router.push('/copy-trade')">Start Copying <Icon icon="mdi:arrow-right" class="inline text-[14px]" /></button></div><img src="/images/home-banner.webp" alt="Copy Trade" class="h-25 w-30 sm:w-50 rounded-2xl object-cover " /></div></div>
          </SwiperSlide>
          <SwiperSlide>
            <div class="relative h-36.25"><div class="absolute right-0 top-0 h-full w-[52%] bg-linear-to-l from-amber-100/80 via-amber-50/70 to-transparent"></div>
              <div class="relative z-10 flex h-full items-center justify-between px-5"><div class="max-w-47.5"><p class="text-[12px] font-semibold text-gray-600">Join & Win Rewards</p><h1 class="mt-1 text-[24px] font-extrabold leading-[1.05] text-[#1f2937]">Events &<br /><span class="text-amber-500">Rewards</span> Await</h1><button class="mt-4 rounded-full border border-amber-500 px-4 py-2 text-[11px] font-bold text-amber-500 transition-colors hover:bg-amber-100 active:bg-amber-100" @click.stop="router.push('/events')">Join Now <Icon icon="mdi:arrow-right" class="inline text-[14px]" /></button></div><img src="/images/home-banner.webp" alt="Events" class="h-25 w-30 sm:w-50 rounded-2xl object-cover " /></div></div>
          </SwiperSlide>
        </Swiper>
      </section>

      <!-- BALANCE CARD -->
      <section class="mt-4 px-3">
        <div class="rounded-2xl bg-white px-5 py-4 shadow-sm border border-gray-100">
          <div class="flex items-start justify-between">
            <div>
              <div class="flex items-center gap-1 text-[12px] font-medium text-gray-400">Total Balance <button @click="balanceVisible = !balanceVisible"><Icon :icon="balanceVisible ? 'mdi:eye-outline' : 'mdi:eye-off-outline'" class="text-[14px]" /></button></div>
              <div class="mt-2 flex items-end gap-2"><h2 class="text-[26px] font-bold leading-none tracking-tight">{{ balanceVisible ? fmtBalance(totalBalance) : '••••••••' }}</h2><button class="mb-1 flex items-center gap-1 text-[11px] font-semibold">USDT <Icon icon="mdi:chevron-down" /></button></div>
              <p class="mt-2 text-[12px] sm:text-[16px] text-gray-400">{{ balanceVisible ? '≈ $' + fmtBalance(totalBalance) : '≈ $••••••••' }}</p>
              <button class="mt-3 flex items-center gap-1 text-[12px] sm:text-[16px] text-gray-400">
                Unrealized PnL
                <span class="font-semibold transition-colors duration-300" :class="pnlValue >= 0 ? 'text-[#21b8b1]' : 'text-red-400'">{{ (pnlValue >= 0 ? '+' : '') + pnlValue.toFixed(2) }} ({{ (pnlPct >= 0 ? '+' : '') + pnlPct.toFixed(2) }}%)</span>
                <Icon icon="mdi:chevron-right" />
              </button>
            </div>
            <div class="flex flex-col items-end">
              <svg class="h-14.5 w-26.25" viewBox="0 0 105 58" preserveAspectRatio="none">
                <defs><linearGradient id="miniChartGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#62d9d3" stop-opacity="0.25" /><stop offset="100%" stop-color="#62d9d3" stop-opacity="0" /></linearGradient></defs>
                <path :d="chartFillPath" fill="url(#miniChartGrad)" />
                <path :d="chartLinePath" fill="none" stroke="#62d9d3" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="transition: d 0.4s ease" />
              </svg>
              <button class="mt-3 rounded-xl bg-[#e9fffc] px-6 py-3 text-[12px] sm:text-[16px] font-bold text-[#18b8b0] hover:bg-[#bdf5ed] hover:text-[#03645f]" @click="router.push('/add-funds')">Add Funds</button>
            </div>
          </div>
        </div>
      </section>

      <!-- QUICK ACTIONS -->
      <section class="mt-5 px-3">
        <Swiper :modules="[Pagination]" :pagination="{ clickable: true, dynamicBullets: true }" :slides-per-view="4" :slides-per-group="4" :breakpoints="{ 640: { slidesPerView: 5, slidesPerGroup: 5 }, 1024: { slidesPerView: 6, slidesPerGroup: 6 } }" :space-between="0" class="qa-swiper">
          <SwiperSlide v-for="item in quickActions" :key="item.label">
            <button @click="item.route ? router.push(item.route) : undefined" class="flex w-full flex-col items-center gap-2 py-4">
              <div class="relative"><div class="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-sm border border-gray-100"><Icon :icon="item.icon" class="text-[22px] text-[#22bdb5]" /></div><span v-if="item.hot" class="absolute -right-1 -top-0.5 rounded-full bg-[#19c9c0] px-1.5 py-px text-[7px] font-bold leading-none text-white">HOT</span></div>
              <span class="w-12 whitespace-pre-line text-center text-[9px] font-semibold leading-tight text-[#2f3a45]">{{ item.label }}</span>
            </button>
          </SwiperSlide>
        </Swiper>
      </section>

      <!-- COPY TRADE + EVENT -->
      <section class="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3 px-3">
        <div class="relative flex min-h-42.5 flex-col overflow-hidden rounded-2xl bg-white p-4 shadow-sm border border-gray-100">
          <div class="relative z-10 flex flex-1 flex-col pr-24">
            <div class="flex items-center gap-2"><h3 class="text-[15px] font-extrabold">Copy Trade</h3><span class="rounded-full bg-[#e9fffc] px-2 py-0.5 text-[9px] font-bold text-[#21b8b1]">Top Traders</span></div>
            <p class="mt-1 text-[10px] leading-snug text-gray-500">Follow elite traders and maximize your profits</p>
            <div class="mt-4 flex items-center"><img src="https://i.pravatar.cc/40?img=11" class="h-6 w-6 rounded-full border-2 border-white" /><img src="https://i.pravatar.cc/40?img=12" class="-ml-2 h-6 w-6 rounded-full border-2 border-white" /><img src="https://i.pravatar.cc/40?img=13" class="-ml-2 h-6 w-6 rounded-full border-2 border-white" /><div class="ml-2"><p class="text-[10px] font-bold text-[#1bb9b2]">8,145</p><p class="text-[8px] text-gray-400">Copiers</p></div></div>
            <button class="mt-auto pt-3 text-left text-[10px] font-bold text-[#1bb9b2]" @click="router.push('/copy-trade')">Explore Now <Icon icon="mdi:arrow-right" class="inline text-[12px]" /></button>
          </div>
          <img src="/images/home-copy-trade.webp" alt="Copy Trade" class="absolute right-0 top-1/2 -translate-y-1/2 h-full w-22 rounded-2xl object-cover" />
        </div>
        <div class="relative flex min-h-42.5 flex-col overflow-hidden rounded-2xl bg-white p-4 shadow-sm border border-gray-100">
          <div class="relative z-10 flex flex-1 flex-col pr-24">
            <div class="flex items-center gap-2"><h3 class="text-[15px] font-extrabold">Event Center</h3><span class="rounded-full bg-[#e9fffc] px-2 py-0.5 text-[9px] font-bold text-[#21b8b1]">Live</span></div>
            <p class="mt-1 max-w-32.5 text-[10px] leading-snug text-gray-500">Join events and win amazing rewards</p>
            <button class="mt-auto text-left text-[10px] font-bold text-[#1bb9b2]" @click="router.push('/events')">Join Now <Icon icon="mdi:arrow-right" class="inline text-[12px]" /></button>
          </div>
          <img src="/images/rewards-banner.webp" alt="Event" class="absolute right-0 top-1/2 -translate-y-1/2 h-full w-30 rounded-2xl object-cover" />
        </div>
      </section>

      <!-- MARKET OVERVIEW -->
      <section class="mt-5 px-3 pb-6">
        <div class="rounded-2xl bg-white p-4 shadow-sm border border-gray-100">
          <div class="flex items-center justify-between"><h3 class="text-[14px] font-extrabold">Market Overview</h3><button class="text-[10px] font-bold text-[#1bb9b2]" @click="router.push('/market')">See All <Icon icon="mdi:arrow-right" class="inline text-[12px]" /></button></div>
          <div class="mt-4 flex items-center border-b border-gray-100 pb-2.5 text-[10px] font-bold text-gray-400"><span class="flex-1">Name</span><span class="w-22 text-right">Last Price</span><span class="w-19 text-right pr-1">24h Chg%</span><span class="w-8"></span></div>
          <div v-if="displayedMarkets.length === 0" class="px-4 py-10 text-center text-[13px] font-semibold text-gray-400">No data</div>
          <div v-else class="divide-y divide-gray-100">
            <div v-for="coin in displayedMarkets" :key="coin.symbol" class="flex items-center py-3 cursor-pointer hover:bg-gray-50 active:bg-gray-100 transition-colors" @click="router.push('/trade/' + coin.symbol.toLowerCase())">
              <div class="flex flex-1 min-w-0 items-center gap-2.5">
                <div class="flex h-8 w-8 shrink-0 items-center justify-center"><CoinIcon :icon="coin.icon" :symbol="coin.symbol" icon-class="text-[28px]" img-class="h-8 w-8 rounded-full object-contain" /></div>
                <div class="min-w-0"><p class="text-[12px] font-extrabold leading-none">{{ coin.symbol }}</p><p class="mt-1 text-[10px] text-gray-400 truncate">{{ coin.fullName }}</p></div>
              </div>
              <div class="w-22 text-right"><p class="text-[12px] font-bold leading-none">{{ formatPrice(coin.price) }}</p><p class="mt-1 text-[10px] text-gray-400">${{ formatPrice(coin.price) }}</p></div>
              <div class="w-19 flex justify-end pr-1"><span class="inline-block rounded-lg px-2 py-1 text-[11px] font-bold" :class="coin.change >= 0 ? 'bg-emerald-50 text-emerald-500' : 'bg-red-50 text-red-400'">{{ (coin.change >= 0 ? '+' : '') + coin.change.toFixed(2) }}%</span></div>
              <button class="flex w-8 shrink-0 justify-end" @click.stop="toggleFavorite(coin.symbol)"><Icon :icon="favorites.has(coin.symbol) ? 'mdi:star' : 'mdi:star-outline'" class="text-[18px] transition-colors" :class="favorites.has(coin.symbol) ? 'text-yellow-400' : 'text-gray-300'" /></button>
            </div>
          </div>
        </div>
      </section>

      <!-- NEWS -->
      <section class="mt-5 px-3">
        <div class="rounded-2xl border border-gray-100 bg-white px-5 py-4 shadow-sm">
          <div class="mb-2 flex items-center justify-between"><h2 class="text-[16px] font-extrabold text-[#17212f]">News</h2><button type="button" class="flex items-center gap-1 text-[10px] font-bold text-[#1bb9b2]" @click="router.push('/news')">See All <Icon icon="mdi:arrow-right" class="text-[13px]" /></button></div>
          <div v-if="newsLoading" class="flex items-center justify-center py-6">
            <Icon icon="mdi:loading" class="animate-spin text-xl text-[#1bb9b2]" />
          </div>
          <div v-else-if="newsItems.length === 0" class="flex flex-col items-center gap-1 py-6 text-gray-400">
            <Icon icon="mdi:newspaper-variant-outline" class="text-3xl" />
            <p class="text-xs font-semibold">No news</p>
          </div>
          <div v-else><button v-for="item in newsItems" :key="item.title" type="button" class="flex w-full items-center justify-between border-b border-gray-100 py-2.5 text-left last:border-b-0 active:bg-gray-50" @click="router.push('/news')"><div class="flex items-start gap-3"><span class="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#13b8b0]"></span><div><h3 class="text-[12px] font-semibold leading-snug text-[#17212f]">{{ item.title }}</h3><p class="mt-0.5 text-[10px] font-medium text-gray-400">{{ item.source }} · {{ item.time }}</p></div></div><Icon icon="mdi:chevron-right" class="ml-4 shrink-0 text-[18px] text-gray-400" /></button></div>
        </div>
      </section>
    </div>
  </DashboardLayout>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { Icon } from '@iconify/vue'
import { useRouter } from 'vue-router'
import DashboardLayout from '@/layouts/DashboardLayout.vue'
import CoinIcon from '@/components/CoinIcon.vue'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Autoplay, Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'
import { useAuthStore } from '@/stores/auth'
import { makeUserApi, makeContentApi } from '@/services/api'
import { useMarketStore } from '@/stores/market'
import { useMarketWs } from '@/services/marketWs'

const router = useRouter()
const auth   = useAuthStore()
const marketStore = useMarketStore()
const { tickerMap } = useMarketWs()
const balanceVisible = ref(true)

// ── Balance state ──────────────────────────────────────────────────
const usdtBalance    = ref<number>(0)
const coinBalanceMap = ref<Record<string, number>>({})
const costBasisMap   = ref<Record<string, number>>({})
const initialPriceMap = ref<Record<string, number>>({})

// ── Live display refs (updated by tick()) ──────────────────────────
const totalBalance = ref<number>(0)
const pnlValue     = ref<number>(0)
const pnlPct       = ref<number>(0)

// ── Markets ────────────────────────────────────────────────────────
interface Market {
  symbol: string; fullName: string; icon: string; binancePair: string
  price: number; change: number; chartPoints: number[]
}
const FEATURED_SYMBOLS = ['BTC', 'ETH', 'BNB', 'SOL', 'XRP']
const PAIR_PRICE_DEFAULTS: Record<string, { price: number; change: number }> = {
  BTCUSDT: { price: 67000, change: 0 },
  ETHUSDT: { price: 3400, change: 0 },
  BNBUSDT: { price: 590, change: 0 },
  SOLUSDT: { price: 170, change: 0 },
  XRPUSDT: { price: 0.53, change: 0 },
}

const marketsData = ref<Market[]>([
  { symbol: 'BTC', fullName: 'Bitcoin',   icon: 'mdi:bitcoin',                 binancePair: 'BTCUSDT', price: 0, change: 0, chartPoints: [0.30, 0.38, 0.35, 0.45, 0.42, 0.52, 0.50, 0.60] },
  { symbol: 'ETH', fullName: 'Ethereum',  icon: 'mdi:ethereum',                binancePair: 'ETHUSDT', price: 0, change: 0, chartPoints: [0.25, 0.35, 0.38, 0.46, 0.50, 0.55, 0.62, 0.72] },
  { symbol: 'BNB', fullName: 'BNB',       icon: 'mdi:alpha-b-circle',          binancePair: 'BNBUSDT', price: 0, change: 0, chartPoints: [0.35, 0.40, 0.38, 0.44, 0.42, 0.48, 0.46, 0.52] },
  { symbol: 'SOL', fullName: 'Solana',    icon: 'mdi:circle-multiple-outline', binancePair: 'SOLUSDT', price: 0, change: 0, chartPoints: [0.65, 0.60, 0.62, 0.55, 0.58, 0.52, 0.54, 0.48] },
  { symbol: 'XRP', fullName: 'XRP',       icon: 'mdi:close',                   binancePair: 'XRPUSDT', price: 0, change: 0, chartPoints: [0.40, 0.44, 0.42, 0.48, 0.50, 0.52, 0.54, 0.56] },
])
const displayedMarkets = computed(() => marketsData.value)

function fmtBalance(n: number): string {
  return n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

// ── Favorites ──────────────────────────────────────────────────────
const favorites = ref<Set<string>>(new Set(JSON.parse(localStorage.getItem('market-favorites') ?? '[]')))
function toggleFavorite(name: string) {
  const next = new Set(favorites.value)
  next.has(name) ? next.delete(name) : next.add(name)
  favorites.value = next
  localStorage.setItem('market-favorites', JSON.stringify([...next]))
}
const chartPoints = ref<number[]>([0.55, 0.42, 0.60, 0.38, 0.52, 0.30, 0.48, 0.22, 0.40, 0.18])

function buildSplinePath(pts: number[], filled = false): string {
  const W = 105, H = 58, padTop = 4, padBottom = 6
  const usableH = H - padTop - padBottom
  const xStep = W / (pts.length - 1)
  const coords = pts.map((y, i) => ({ x: i * xStep, y: padTop + (1 - y) * usableH }))
  const cpx = xStep * 0.45
  let d = `M ${coords[0].x.toFixed(1)},${coords[0].y.toFixed(1)}`
  for (let i = 0; i < coords.length - 1; i++) {
    d += ` C ${(coords[i].x + cpx).toFixed(1)},${coords[i].y.toFixed(1)}` +
         ` ${(coords[i + 1].x - cpx).toFixed(1)},${coords[i + 1].y.toFixed(1)}` +
         ` ${coords[i + 1].x.toFixed(1)},${coords[i + 1].y.toFixed(1)}`
  }
  if (filled) d += ` L ${((pts.length - 1) * xStep).toFixed(1)},${H} L 0,${H} Z`
  return d
}
const chartLinePath = computed(() => buildSplinePath(chartPoints.value))
const chartFillPath = computed(() => buildSplinePath(chartPoints.value, true))

let chartTimer: ReturnType<typeof setInterval>
function tickChart() {
  const last = chartPoints.value[chartPoints.value.length - 1]
  const delta = (Math.random() - 0.46) * 0.14
  const next = Math.max(0.05, Math.min(0.95, last + delta))
  chartPoints.value = [...chartPoints.value.slice(1), next]
}

function formatPrice(price: number): string {
  if (price >= 1000) return price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  if (price >= 1) return price.toFixed(2)
  return price.toFixed(6)
}

function buildMarketsFromStore() {
  const updated = FEATURED_SYMBOLS.map(sym => {
    const c = marketStore.coins.find(x => x.symbol === sym)
    const existing = marketsData.value.find(m => m.symbol === sym)
    if (!c && !existing) return null
    return { symbol: sym, fullName: c?.name ?? existing!.fullName, icon: c?.icon ?? existing!.icon, binancePair: c?.binancePair ?? existing!.binancePair, price: 0, change: 0, chartPoints: existing?.chartPoints ?? [0.30, 0.38, 0.35, 0.45, 0.42, 0.52, 0.50, 0.60] } as Market
  }).filter(Boolean) as Market[]
  if (updated.length) marketsData.value = updated
}
watch(() => marketStore.loaded, (loaded) => { if (loaded) buildMarketsFromStore() })

// ══════════════════════════════════════════════════════════════════
//  LIVE TICK — SAME PATTERN AS TradeScreen
//  Uses WS data when available, simulates price movement when not
// ══════════════════════════════════════════════════════════════════
let tickTimer: ReturnType<typeof setInterval>

function tick() {
  const map = tickerMap.value

  // Update markets: use WS price if available, otherwise simulate
  const nextMarkets = marketsData.value.map(coin => {
    const wsTicker = map.get(coin.binancePair)
    if (wsTicker && wsTicker.price > 0) {
      return { ...coin, price: wsTicker.price, change: Math.round(wsTicker.change * 100) / 100 }
    }
    // SIMULATE price movement when WS not available (same as TradeScreen)
    const def = PAIR_PRICE_DEFAULTS[coin.binancePair]
    const basePrice = coin.price || def?.price || 100
    const delta = basePrice * (Math.random() - 0.499) * 0.002
    const newPrice = Math.max(0.000001, basePrice + delta)
    const newChange = Math.round((coin.change + (Math.random() - 0.49) * 0.06) * 100) / 100
    return { ...coin, price: newPrice, change: newChange }
  })
  marketsData.value = nextMarkets

  // Compute PnL using latest prices
  let pnlTotal = 0
  let costTotal = 0
  for (const [coin, amount] of Object.entries(coinBalanceMap.value)) {
    if (coin === 'USDT' || amount <= 0) continue
    const t = map.get(coin + 'USDT')
    const marketPrice = t?.price ?? marketsData.value.find(m => m.symbol === coin)?.price ?? 0
    if (marketPrice <= 0) continue
    const avgBuy = costBasisMap.value[coin] ?? initialPriceMap.value[coin]
    if (avgBuy > 0) {
      pnlTotal += amount * (marketPrice - avgBuy)
      costTotal += amount * avgBuy
    } else {
      pnlTotal += amount * marketPrice * (t?.change ?? 0) / 100
      costTotal += amount * marketPrice
    }
  }
  pnlValue.value = Math.round(pnlTotal * 100) / 100
  pnlPct.value   = costTotal > 0 ? Math.round((pnlTotal / costTotal) * 10000) / 100 : 0

  // Compute total balance
  let bal = usdtBalance.value
  for (const [coin, amount] of Object.entries(coinBalanceMap.value)) {
    if (coin === 'USDT' || amount <= 0) continue
    const t = map.get(coin + 'USDT')
    const price = t?.price ?? marketsData.value.find(m => m.symbol === coin)?.price ?? 0
    if (price > 0) bal += amount * price
  }
  totalBalance.value = bal
}

// Fetch initial prices from REST API (klines)
async function fetchInitialPrices() {
  try {
    await Promise.allSettled(marketsData.value.map(async (coin) => {
      const res = await fetch(`https://api.one-led.io/v1/public/klines?symbol=${coin.binancePair}&interval=1d&limit=1`)
      if (!res.ok) return
      const raw = await res.json()
      if (!Array.isArray(raw) || !raw[0]) return
      const close = parseFloat(raw[0][4])
      const open  = parseFloat(raw[0][1])
      if (isNaN(close) || close <= 0) return
      const change = open > 0 ? Math.round(((close - open) / open) * 10000) / 100 : 0
      marketsData.value = marketsData.value.map(c =>
        c.symbol === coin.symbol ? { ...c, price: close, change } : c
      )
    }))
  } catch { /* ignore */ }
}

onMounted(async () => {
  chartTimer = setInterval(tickChart, 1200)
  marketStore.fetchCoins()
  if (marketStore.loaded) buildMarketsFromStore()

  // Fetch real prices from REST as initial data
  await fetchInitialPrices()

  // Set initial prices for PnL fallback
  if (Object.keys(initialPriceMap.value).length === 0) {
    const initPrices: Record<string, number> = {}
    for (const coin of Object.keys(coinBalanceMap.value)) {
      if (coin === 'USDT') continue
      const marketPrice = marketsData.value.find(m => m.symbol === coin)?.price
      if (marketPrice && marketPrice > 0) initPrices[coin] = marketPrice
    }
    initialPriceMap.value = initPrices
  }

  // Start live tick every 800ms (like TradeScreen's 600ms)
  tick()
  tickTimer = setInterval(tick, 800)

  // Fetch balance + cost basis
  if (auth.accessToken) {
    try {
      const d = await makeUserApi(auth.accessToken).getBalance()
      usdtBalance.value = parseFloat(d.total as unknown as string) || 0
      const map: Record<string, number> = {}
      for (const b of (d.balances ?? [])) map[(b.coin as string).toUpperCase()] = Number(b.amount)
      coinBalanceMap.value = map

      if (d.cost_basis) {
        const cb: Record<string, number> = {}
        for (const [coin, price] of Object.entries(d.cost_basis)) cb[coin] = parseFloat(price as string)
        costBasisMap.value = cb
      }

      const initPrices: Record<string, number> = {}
      for (const coin of Object.keys(coinBalanceMap.value)) {
        if (coin === 'USDT') continue
        const marketPrice = marketsData.value.find(m => m.symbol === coin)?.price
        if (marketPrice && marketPrice > 0) initPrices[coin] = marketPrice
      }
      initialPriceMap.value = initPrices
      tick()
    } catch { /* ignore */ }
  }

  // Fetch news
  if (auth.accessToken) {
    try {
      const contentApi = makeContentApi(auth.accessToken)
      const newsData = await contentApi.getNews(5)
      newsItems.value = newsData.articles.map(a => ({
        title:  a.title,
        source: a.source ?? a.category_name ?? 'News',
        time:   relativeTime(a.published_at),
      }))
    } catch { /* keep empty */
    } finally {
      newsLoading.value = false
    }
  } else {
    newsLoading.value = false
  }
})

onUnmounted(() => {
  clearInterval(chartTimer)
  clearInterval(tickTimer)
})

interface QuickAction { label: string; icon: string; hot?: boolean; route?: string }

// ── News from API ─────────────────────────────────────────────────────────────
const newsItems = ref<{ title: string; source: string; time: string }[]>([])
const newsLoading = ref(true)

function relativeTime(dateStr: string | null): string {
  if (!dateStr) return 'Recently'
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
}
const quickActions: QuickAction[] = [
  { label: 'Add Funds',       icon: 'mdi:wallet-plus-outline',          route: '/add-funds' },
  { label: 'Transfer',        icon: 'mdi:swap-horizontal',              route: '/transfer' },
  { label: 'Withdraw',        icon: 'mdi:tray-arrow-up',                route: '/withdraw' },
  { label: 'P2P',             icon: 'mdi:account-cash-outline',         route: '/p2p-trading' },
  { label: 'Copy Trade',      icon: 'mdi:account-multiple-outline',     route: '/copy-trade' },
  { label: 'Event',           icon: 'mdi:gift-outline',                 route: '/events', hot: true },
  { label: 'Deposit\nCrypto', icon: 'mdi:qrcode-scan',                  route: '/crypto-deposit' },
  { label: 'Staking', icon: 'mdi:bank-outline', route: '/staking' },
]
</script>

<style>
.hero-swiper { --swiper-pagination-color: #1fc7c0; --swiper-pagination-bullet-inactive-color: #d1d5db; --swiper-pagination-bullet-inactive-opacity: 1; --swiper-pagination-bullet-size: 6px; --swiper-pagination-bullet-width: 6px; --swiper-pagination-bullet-horizontal-gap: 3px; --swiper-pagination-bottom: 8px; }
.hero-swiper .swiper-pagination-bullet-active { width: 20px !important; border-radius: 3px; }
.qa-swiper { --swiper-pagination-color: #1fc7c0; --swiper-pagination-bullet-inactive-color: #e5e7eb; --swiper-pagination-bullet-inactive-opacity: 1; --swiper-pagination-bullet-size: 6px; --swiper-pagination-bullet-horizontal-gap: 3px; --swiper-pagination-bottom: 7px; padding-bottom: 28px; }
.qa-swiper .swiper-pagination-bullet-active { width: 20px !important; border-radius: 3px; }
</style>