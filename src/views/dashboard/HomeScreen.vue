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
          <!-- Slide 1: Trading -->
          <SwiperSlide>
            <div class="relative h-36.25">
              <div class="absolute right-0 top-0 h-full w-[52%] bg-linear-to-l from-cyan-100/80 via-cyan-50/70 to-transparent"></div>
              <div class="relative z-10 flex h-full items-center justify-between px-5">
                <div class="max-w-47.5">
                  <p class="text-[10px] font-semibold text-gray-600">Trade Smarter, Grow Together</p>
                  <h1 class="mt-1 text-[24px] font-extrabold leading-[1.05] text-[#1f2937]">
                    The Future of <br /><span class="text-[#1cb8b1]">Trading</span> is Here
                  </h1>
                  <button
                    class="mt-4 rounded-full border border-[#1cb8b1] px-4 py-2 text-[11px] font-bold text-[#1cb8b1] transition-colors hover:bg-[#e9fffc] active:bg-[#e9fffc]"
                    @click.stop="router.push('/market')"
                  >
                    Explore Now <Icon icon="mdi:arrow-right" class="inline text-[14px]" />
                  </button>
                </div>
                <img src="/images/home-banner.webp" alt="Trading" class="h-25 w-30 sm:w-50 rounded-2xl object-cover " />
              </div>
            </div>
          </SwiperSlide>

          <!-- Slide 2: Copy Trade -->
          <SwiperSlide>
            <div class="relative h-36.25">
              <div class="absolute right-0 top-0 h-full w-[52%] bg-linear-to-l from-violet-100/80 via-violet-50/70 to-transparent"></div>
              <div class="relative z-10 flex h-full items-center justify-between px-5">
                <div class="max-w-47.5">
                  <p class="text-[10px] font-semibold text-gray-600">Follow Elite Traders</p>
                  <h1 class="mt-1 text-[24px] font-extrabold leading-[1.05] text-[#1f2937]">
                    Copy Trade &amp;<br /><span class="text-violet-500">Earn</span> Daily
                  </h1>
                  <button
                    class="mt-4 rounded-full border border-violet-500 px-4 py-2 text-[11px] font-bold text-violet-500 transition-colors hover:bg-violet-100 active:bg-violet-100"
                    @click.stop="router.push('/copy-trade')"
                  >
                    Start Copying <Icon icon="mdi:arrow-right" class="inline text-[14px]" />
                  </button>
                </div>
                <img src="/images/home-banner.webp" alt="Copy Trade" class="h-25 w-30 sm:w-50 rounded-2xl object-cover " />
              </div>
            </div>
          </SwiperSlide>

          <!-- Slide 3: Events -->
          <SwiperSlide>
            <div class="relative h-36.25">
              <div class="absolute right-0 top-0 h-full w-[52%] bg-linear-to-l from-amber-100/80 via-amber-50/70 to-transparent"></div>
              <div class="relative z-10 flex h-full items-center justify-between px-5">
                <div class="max-w-47.5">
                  <p class="text-[10px] font-semibold text-gray-600">Join &amp; Win Rewards</p>
                  <h1 class="mt-1 text-[24px] font-extrabold leading-[1.05] text-[#1f2937]">
                    Events &amp;<br /><span class="text-amber-500">Rewards</span> Await
                  </h1>
                  <button
                    class="mt-4 rounded-full border border-amber-500 px-4 py-2 text-[11px] font-bold text-amber-500 transition-colors hover:bg-amber-100 active:bg-amber-100"
                    @click.stop="router.push('/events')"
                  >
                    Join Now <Icon icon="mdi:arrow-right" class="inline text-[14px]" />
                  </button>
                </div>
                <img src="/images/home-banner.webp" alt="Events" class="h-25 w-30 sm:w-50 rounded-2xl object-cover " />
              </div>
            </div>
          </SwiperSlide>
        </Swiper>
      </section>

      <!-- BALANCE CARD -->
      <section class="mt-4 px-3">
        <div class="rounded-2xl bg-white px-5 py-4 shadow-sm border border-gray-100">
          <div class="flex items-start justify-between">
            <div>
              <div class="flex items-center gap-1 text-[12px] font-medium text-gray-400">
                Total Balance
                <button @click="balanceVisible = !balanceVisible">
                  <Icon :icon="balanceVisible ? 'mdi:eye-outline' : 'mdi:eye-off-outline'" class="text-[14px]" />
                </button>
              </div>
              <div class="mt-2 flex items-end gap-2">
                <h2 class="text-[26px] font-bold leading-none tracking-tight">
                  {{ balanceVisible ? fmtBalance(balanceTotal) : '••••••••' }}
                </h2>
                <button class="mb-1 flex items-center gap-1 text-[11px] font-semibold">
                  USDT <Icon icon="mdi:chevron-down" />
                </button>
              </div>
              <p class="mt-2 text-[12px] text-gray-400">{{ balanceVisible ? '≈ $' + fmtBalance(balanceTotal) : '≈ $••••••••' }}</p>
              <button class="mt-3 flex items-center gap-1 text-[12px] text-gray-400">
                Unrealized PnL
                <span
                  class="font-semibold transition-colors duration-300"
                  :class="pnlValue >= 0 ? 'text-[#21b8b1]' : 'text-red-400'"
                >
                  {{ (pnlValue >= 0 ? '+' : '') + pnlValue.toFixed(2) }}
                  ({{ (pnlPct >= 0 ? '+' : '') + pnlPct.toFixed(2) }}%)
                </span>
                <Icon icon="mdi:chevron-right" />
              </button>
            </div>
            <div class="flex flex-col items-end">
              <!-- SVG SPLINE CHART -->
              <svg class="h-14.5 w-26.25" viewBox="0 0 105 58" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="miniChartGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stop-color="#62d9d3" stop-opacity="0.25" />
                    <stop offset="100%" stop-color="#62d9d3" stop-opacity="0" />
                  </linearGradient>
                </defs>
                <path :d="chartFillPath" fill="url(#miniChartGrad)" />
                <path
                  :d="chartLinePath"
                  fill="none"
                  stroke="#62d9d3"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  style="transition: d 0.4s ease"
                />
              </svg>
              <button class="mt-3 rounded-xl bg-[#e9fffc] px-7 py-3 text-[12px] font-bold text-[#18b8b0] hover:bg-[#bdf5ed] hover:text-[#03645f]" @click="router.push('/add-funds')">
                Add Funds
              </button>
            </div>
          </div>
        </div>
      </section>

      <!-- QUICK ACTIONS -->
      <section class="mt-5 px-3">
        <Swiper
          :modules="[Pagination]"
          :pagination="{ clickable: true, dynamicBullets: true }"
          :slides-per-view="4"
          :slides-per-group="4"
          :breakpoints="{ 640: { slidesPerView: 5, slidesPerGroup: 5 }, 1024: { slidesPerView: 6, slidesPerGroup: 6 } }"
          :space-between="0"
          class="qa-swiper"
        >
          <SwiperSlide v-for="item in quickActions" :key="item.label">
            <button
              @click="item.route ? router.push(item.route) : undefined"
              class="flex w-full flex-col items-center gap-2 py-4"
            >
              <div class="relative">
                <div class="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-sm border border-gray-100">
                  <Icon :icon="item.icon" class="text-[22px] text-[#22bdb5]" />
                </div>
                <span
                  v-if="item.hot"
                  class="absolute -right-1 -top-0.5 rounded-full bg-[#19c9c0] px-1.5 py-px text-[7px] font-bold leading-none text-white"
                >HOT</span>
              </div>
              <span class="w-12 whitespace-pre-line text-center text-[9px] font-semibold leading-tight text-[#2f3a45]">
                {{ item.label }}
              </span>
            </button>
          </SwiperSlide>
        </Swiper>
      </section>

      <!-- COPY TRADE + EVENT CENTER -->
      <section class="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3 px-3">
        <!-- Copy Trade -->
        <div class="relative flex min-h-42.5 flex-col overflow-hidden rounded-2xl bg-white p-4 shadow-sm border border-gray-100">
          <div class="relative z-10 flex flex-1 flex-col pr-24">
            <div class="flex items-center gap-2">
              <h3 class="text-[15px] font-extrabold">Copy Trade</h3>
              <span class="rounded-full bg-[#e9fffc] px-2 py-0.5 text-[9px] font-bold text-[#21b8b1]">Top Traders</span>
            </div>
            <p class="mt-1 text-[10px] leading-snug text-gray-500">
              Follow elite traders and maximize your profits
            </p>
            <div class="mt-4 flex items-center">
              <img src="https://i.pravatar.cc/40?img=11" class="h-6 w-6 rounded-full border-2 border-white" alt="trader" />
              <img src="https://i.pravatar.cc/40?img=12" class="-ml-2 h-6 w-6 rounded-full border-2 border-white" alt="trader" />
              <img src="https://i.pravatar.cc/40?img=13" class="-ml-2 h-6 w-6 rounded-full border-2 border-white" alt="trader" />
              <div class="ml-2">
                <p class="text-[10px] font-bold text-[#1bb9b2]">8,145</p>
                <p class="text-[8px] text-gray-400">Copiers</p>
              </div>
            </div>
            <button class="mt-auto pt-3 text-left text-[10px] font-bold text-[#1bb9b2]" @click="router.push('/copy-trade')">
              Explore Now <Icon icon="mdi:arrow-right" class="inline text-[12px]" />
            </button>
          </div>
          <img
            src="/images/home-copy-trade.webp"
            alt="Copy Trade"
            class="absolute right-0 top-1/2 -translate-y-1/2 h-full w-22 rounded-2xl object-cover"
          />
        </div>

        <!-- Event Center -->
        <div class="relative flex min-h-42.5 flex-col overflow-hidden rounded-2xl bg-white p-4 shadow-sm border border-gray-100">
          <div class="relative z-10 flex flex-1 flex-col pr-24">
            <div class="flex items-center gap-2">
              <h3 class="text-[15px] font-extrabold">Event Center</h3>
              <span class="rounded-full bg-[#e9fffc] px-2 py-0.5 text-[9px] font-bold text-[#21b8b1]">Live</span>
            </div>
            <p class="mt-1 max-w-32.5 text-[10px] leading-snug text-gray-500">
              Join events and win amazing rewards
            </p>
            <button class="mt-auto text-left text-[10px] font-bold text-[#1bb9b2]" @click="router.push('/events')">
              Join Now <Icon icon="mdi:arrow-right" class="inline text-[12px]" />
            </button>
          </div>
          <img
            src="/images/rewards-banner.webp"
            alt="Event"
            class="absolute right-0 top-1/2 -translate-y-1/2 h-full w-30 rounded-2xl object-cover"
          />
        </div>
      </section>

      <!-- MARKET OVERVIEW -->
      <section class="mt-5 px-3 pb-6">
        <div class="rounded-2xl bg-white p-4 shadow-sm border border-gray-100">
          <div class="flex items-center justify-between">
            <h3 class="text-[16px] font-extrabold">Market Overview</h3>
            <button class="text-[10px] font-bold text-[#1bb9b2]" @click="router.push('/market')">
              See All <Icon icon="mdi:arrow-right" class="inline text-[12px]" />
            </button>
          </div>
          <!-- Tabs -->
          <div class="mt-4 flex items-center gap-5 border-b border-gray-100 pb-2.5">
            <button
              v-for="tab in marketTabs"
              :key="tab"
              @click="activeTab = tab"
              class="relative pb-2.5 -mb-2.5 text-[11px] font-bold transition-colors"
              :class="activeTab === tab ? 'text-[#1bb9b2]' : 'text-gray-400'"
            >
              {{ tab }}
              <span
                v-if="activeTab === tab"
                class="absolute bottom-0 left-0 h-0.5 w-full rounded-full bg-[#1bb9b2]"
              ></span>
            </button>
          </div>
          <!-- Header -->
          <div class="mt-3 grid grid-cols-5 gap-x-2 text-[8px] font-bold text-gray-400">
            <span>Name</span><span class="text-center">Last Price</span><span class="text-center">24h Chg%</span><span class="text-center">Mkt Cap</span><span></span>
          </div>
          <!-- Rows -->
          <div class="mt-2 space-y-3">
            <div
              v-for="coin in displayedMarkets"
              :key="coin.symbol"
              class="grid grid-cols-5 items-center gap-x-2 cursor-pointer rounded-xl hover:bg-gray-50 active:bg-gray-100 transition-colors"
              @click="router.push('/trade/' + coin.symbol.toLowerCase())"
            >
              <!-- Name + icon -->
              <div class="flex items-center gap-2">
                <div
                  class="flex h-7 w-7 shrink-0 items-center justify-center rounded-full"
                  :class="coinIconClass(coin.symbol)"
                >
                  <CoinIcon :icon="coin.icon" :symbol="coin.symbol" icon-class="text-[17px]" img-class="h-4 w-4 rounded-full" />
                </div>
                <div class="min-w-0">
                  <p class="text-[10px] font-extrabold leading-none">{{ coin.symbol }}</p>
                  <p class="mt-1 text-[8px] text-gray-400 wrap-break-word">{{ coin.fullName }}</p>
                </div>
              </div>
              <!-- Last Price -->
              <div class="flex flex-col items-center">
                <p class="text-[10px] font-bold leading-none">{{ formatPrice(coin.price) }}</p>
                <p class="mt-1 text-[8px] text-gray-400">${{ formatPrice(coin.price) }}</p>
              </div>
              <!-- 24h Change + mini spline chart -->
              <div class="flex items-center justify-center gap-1">
                <p class="text-[10px] font-bold" :class="coin.change >= 0 ? 'text-emerald-500' : 'text-red-400'">
                  {{ (coin.change >= 0 ? '+' : '') + coin.change.toFixed(2) }}%
                </p>
                <svg class="h-6.5 w-11 shrink-0" viewBox="0 0 52 26" preserveAspectRatio="none">
                  <defs>
                    <linearGradient :id="`cg-${coin.symbol}`" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stop-color="#62d9d3" stop-opacity="0.25" />
                      <stop offset="100%" stop-color="#62d9d3" stop-opacity="0" />
                    </linearGradient>
                  </defs>
                  <path :d="buildMiniPath(coin.chartPoints, true)" :fill="`url(#cg-${coin.symbol})`" />
                  <path
                    :d="buildMiniPath(coin.chartPoints)"
                    fill="none"
                    stroke="#62d9d3"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    style="transition: d 0.4s ease"
                  />
                </svg>
              </div>
              <!-- Market Cap -->
              <div class="flex flex-col items-center">
                <p class="text-[10px] font-bold leading-none">{{ coin.marketCap }}</p>
              </div>
              <!-- Star -->
              <button class="justify-self-center" @click.stop="toggleFavorite(coin.symbol)">
                <Icon
                  :icon="favorites.has(coin.symbol) ? 'mdi:star' : 'mdi:star-outline'"
                  class="text-[16px] transition-colors"
                  :class="favorites.has(coin.symbol) ? 'text-yellow-400' : 'text-gray-300'"
                />
              </button>
            </div>
          </div>
        </div>
      </section>

      <!-- NEWS -->
      <section class="mt-5 px-3">
        <div class="rounded-2xl border border-gray-100 bg-white px-5 py-4 shadow-sm">
          <div class="mb-2 flex items-center justify-between">
            <h2 class="text-[16px] font-extrabold text-[#17212f]">News</h2>
            <button
              type="button"
              class="flex items-center gap-1 text-[10px] font-bold text-[#1bb9b2]"
              @click="router.push('/news')"
            >
              See All
              <Icon icon="mdi:arrow-right" class="text-[13px]" />
            </button>
          </div>
          <div>
            <button
              v-for="item in newsItems"
              :key="item.title"
              type="button"
              class="flex w-full items-center justify-between border-b border-gray-100 py-2.5 text-left last:border-b-0 active:bg-gray-50"
              @click="router.push('/news')"
            >
              <div class="flex items-start gap-3">
                <span class="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#13b8b0]"></span>
                <div>
                  <h3 class="text-[12px] font-semibold leading-snug text-[#17212f]">{{ item.title }}</h3>
                  <p class="mt-0.5 text-[10px] font-medium text-gray-400">{{ item.source }} · {{ item.time }}</p>
                </div>
              </div>
              <Icon icon="mdi:chevron-right" class="ml-4 shrink-0 text-[18px] text-gray-400" />
            </button>
          </div>
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
import { useMarketStore, coinIconClass } from '@/stores/market'
import { useMarketWs } from '@/services/marketWs'

const router = useRouter()
const auth   = useAuthStore()
const marketStore = useMarketStore()
const { tickerMap } = useMarketWs()
const activeTab = ref('Crypto')
const balanceVisible = ref(true)

// ── Real balance (USDT) ───────────────────────────────────────────────────────
const balanceTotal = ref<number>(0)

function fmtBalance(n: number): string {
  return n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

// ── Favorites (localStorage) ──────────────────────────────────
const favorites = ref<Set<string>>(new Set(JSON.parse(localStorage.getItem('market-favorites') ?? '[]')))
function toggleFavorite(name: string) {
  const next = new Set(favorites.value)
  next.has(name) ? next.delete(name) : next.add(name)
  favorites.value = next
  localStorage.setItem('market-favorites', JSON.stringify([...next]))
}

// ── Mini spline chart ─────────────────────────────────────────
const chartPoints = ref<number[]>([0.55, 0.42, 0.60, 0.38, 0.52, 0.30, 0.48, 0.22, 0.40, 0.18])
const pnlValue = ref(-4.81)
const pnlPct = ref(-2.59)

function buildSplinePath(pts: number[], filled = false): string {
  const W = 105, H = 58, padTop = 4, padBottom = 6
  const usableH = H - padTop - padBottom
  const xStep = W / (pts.length - 1)
  const coords = pts.map((y, i) => ({
    x: i * xStep,
    y: padTop + (1 - y) * usableH,
  }))
  const cpx = xStep * 0.45
  let d = `M ${coords[0].x.toFixed(1)},${coords[0].y.toFixed(1)}`
  for (let i = 0; i < coords.length - 1; i++) {
    d += ` C ${(coords[i].x + cpx).toFixed(1)},${coords[i].y.toFixed(1)}`
      + ` ${(coords[i + 1].x - cpx).toFixed(1)},${coords[i + 1].y.toFixed(1)}`
      + ` ${coords[i + 1].x.toFixed(1)},${coords[i + 1].y.toFixed(1)}`
  }
  if (filled) d += ` L ${((pts.length - 1) * xStep).toFixed(1)},${H} L 0,${H} Z`
  return d
}

const chartLinePath = computed(() => buildSplinePath(chartPoints.value))
const chartFillPath = computed(() => buildSplinePath(chartPoints.value, true))

function buildMiniPath(pts: number[], filled = false): string {
  const W = 52, H = 26, padTop = 2, padBottom = 2
  const usableH = H - padTop - padBottom
  const xStep = W / (pts.length - 1)
  const coords = pts.map((y, i) => ({
    x: i * xStep,
    y: padTop + (1 - y) * usableH,
  }))
  const cpx = xStep * 0.45
  let d = `M ${coords[0].x.toFixed(1)},${coords[0].y.toFixed(1)}`
  for (let i = 0; i < coords.length - 1; i++) {
    d += ` C ${(coords[i].x + cpx).toFixed(1)},${coords[i].y.toFixed(1)}`
      + ` ${(coords[i + 1].x - cpx).toFixed(1)},${coords[i + 1].y.toFixed(1)}`
      + ` ${coords[i + 1].x.toFixed(1)},${coords[i + 1].y.toFixed(1)}`
  }
  if (filled) d += ` L ${((pts.length - 1) * xStep).toFixed(1)},${H} L 0,${H} Z`
  return d
}

let chartTimer: ReturnType<typeof setInterval>

function tickChart() {
  const last = chartPoints.value[chartPoints.value.length - 1]
  const delta = (Math.random() - 0.46) * 0.14
  const next = Math.max(0.05, Math.min(0.95, last + delta))
  chartPoints.value = [...chartPoints.value.slice(1), next]

  const pnlDelta = (Math.random() - 0.48) * 0.12
  pnlValue.value = Math.round((pnlValue.value + pnlDelta) * 100) / 100
  pnlPct.value = Math.round((pnlValue.value / 212216.40) * 10000) / 100

  // Animate sparkline chart points only (prices come from WS)
  marketsData.value = marketsData.value.map(coin => {
    const ptLast = coin.chartPoints[coin.chartPoints.length - 1]
    const bias = coin.change > 0 ? 0.44 : 0.56
    const ptDelta = (Math.random() - bias) * 0.1
    const ptNext = Math.max(0.05, Math.min(0.95, ptLast + ptDelta))
    return { ...coin, chartPoints: [...coin.chartPoints.slice(1), ptNext] }
  })
}
// ──────────────────────────────────────────────────────────────

onMounted(() => {
  chartTimer = setInterval(tickChart, 1200)
  // Fetch coin metadata from market store
  marketStore.fetchCoins()
  if (marketStore.loaded) buildMarketsFromStore()
  // Fetch real balance
  if (auth.accessToken) {
    makeUserApi(auth.accessToken).getBalance()
      .then(d => { balanceTotal.value = parseFloat(d.total as unknown as string) || 0 })
      .catch(() => {})
  }
})

onUnmounted(() => {
  clearInterval(chartTimer)
})

interface QuickAction {
  label: string
  icon: string
  hot?: boolean
  route?: string
}

const newsItems = [
  { title: 'Bitcoin holds above key support',       source: 'Market',       time: '2m ago' },
  { title: 'Ethereum network activity rises',        source: 'Blockchain',   time: '10m ago' },
  { title: 'Solana ecosystem sees renewed demand',   source: 'Altcoins',     time: '18m ago' },
  { title: 'BNB extends weekly gains',               source: 'Market',       time: '25m ago' },
  { title: 'USDT transfer volume climbs',            source: 'Stablecoins',  time: '40m ago' },
]

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

const marketTabs = ['Crypto', 'Top Gainers', 'New Listing']

function formatPrice(price: number): string {
  if (price >= 1000) return price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  if (price >= 1) return price.toFixed(2)
  return price.toFixed(6)
}

interface Market {
  symbol: string
  fullName: string
  icon: string
  binancePair: string
  price: number
  change: number
  marketCap: string
  chartPoints: number[]
  isNewListing?: boolean
}

const marketsData = ref<Market[]>([])

function buildMarketsFromStore() {
  const map = tickerMap.value
  marketsData.value = marketStore.coins.slice(0, 10).map(c => {
    const t = map.get(c.binancePair)
    const existing = marketsData.value.find(m => m.symbol === c.symbol)
    return {
      symbol: c.symbol,
      fullName: c.name,
      icon: c.icon,
      binancePair: c.binancePair,
      price: t?.price ?? existing?.price ?? 0,
      change: t?.change ?? existing?.change ?? 0,
      marketCap: marketStore.fmtCap(c.marketCap),
      chartPoints: existing?.chartPoints ?? [0.30, 0.38, 0.35, 0.45, 0.42, 0.52, 0.50, 0.60],
      isNewListing: !c.isFeatured,
    }
  })
}

watch(() => marketStore.loaded, (loaded) => {
  if (loaded) buildMarketsFromStore()
})

watch(tickerMap, () => {
  if (!marketsData.value.length) return
  const map = tickerMap.value
  marketsData.value = marketsData.value.map(coin => {
    const t = map.get(coin.binancePair)
    return t ? { ...coin, price: t.price, change: t.change } : coin
  })
})

const displayedMarkets = computed(() => {
  if (activeTab.value === 'Top Gainers')
    return [...marketsData.value].sort((a, b) => b.change - a.change)
  if (activeTab.value === 'New Listing')
    return marketsData.value.filter(m => m.isNewListing)
  return marketsData.value.filter(m => !m.isNewListing)
})
</script>

<style>
/* Hero banner Swiper: teal bullet pagination, positioned inside the card */
.hero-swiper {
  --swiper-pagination-color: #1fc7c0;
  --swiper-pagination-bullet-inactive-color: #d1d5db;
  --swiper-pagination-bullet-inactive-opacity: 1;
  --swiper-pagination-bullet-size: 6px;
  --swiper-pagination-bullet-width: 6px;
  --swiper-pagination-bullet-horizontal-gap: 3px;
  --swiper-pagination-bottom: 8px;
}
.hero-swiper .swiper-pagination-bullet-active {
  width: 20px !important;
  border-radius: 3px;
}

/* Quick actions Swiper: teal pagination dots with dynamic bullets */
.qa-swiper {
  --swiper-pagination-color: #1fc7c0;
  --swiper-pagination-bullet-inactive-color: #e5e7eb;
  --swiper-pagination-bullet-inactive-opacity: 1;
  --swiper-pagination-bullet-size: 6px;
  --swiper-pagination-bullet-horizontal-gap: 3px;
  --swiper-pagination-bottom: 7px;
  padding-bottom: 28px;
}
.qa-swiper .swiper-pagination-bullet-active {
  width: 20px !important;
  border-radius: 3px;
}
</style>
