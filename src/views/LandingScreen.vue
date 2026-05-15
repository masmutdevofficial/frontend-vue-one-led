<template>
  <section class="min-h-screen bg-white mx-auto max-w-7xl">
    <div class=" px-7 pt-10 pb-8 lg:px-16">
      <div class="inline-flex items-center gap-3 rounded-full border border-slate-100 bg-white/95 px-4 py-3 shadow-sm shadow-slate-200/70">
        <span class="grid size-8 place-items-center rounded-full bg-teal-50 text-teal-500">
          <Icon icon="mdi:lock" class="size-4" />
        </span>
        <span class="text-sm font-normal tracking-wide text-slate-950">Secure. Simple. Yours.</span>
      </div>
      <div class="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center">
        <div class="animate-float mx-auto w-[260px] shrink-0 sm:order-2 sm:w-[400px]">
          <img src="/images/wallet-image.png" alt="Crypto Wallet" class="h-auto w-full object-contain" />
        </div>
        <div class="sm:order-1">
          <h2 class="text-[2rem] font-black leading-[1.08] tracking-tight text-slate-950 sm:text-[3.55rem]">
            Your Crypto.<br />Fully in <span class="text-teal-500">Control.</span>
          </h2>
          <p class="mt-3 text-xs w-full sm:max-w-[350px] font-medium leading-5 text-slate-500 sm:text-[0.95rem] sm:leading-6 sm:mt-4">
            The secure and effortless way to send, store, and grow your crypto with total peace of mind.
          </p>
          <div class="mt-5 grid gap-3 sm:max-w-[240px]">
            <button type="button" class="flex items-center rounded-xl bg-slate-950 px-4 py-3 text-xs font-normal text-white shadow-lg shadow-slate-950/15 sm:px-5 sm:py-4 sm:text-sm" @click="router.push('/login')">
              <span class="flex-1">Get Started</span>
              <Icon icon="mdi:arrow-right" class="size-5" />
            </button>
            <button type="button" class="rounded-xl border-[2px] border-slate-950 bg-white px-4 py-3 text-xs font-normal text-slate-950 sm:px-5 sm:py-4 sm:text-sm" @click="router.push('/register')">
              Sign Up Free
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="mt-6 rounded-3xl border overflow-hidden border-slate-100 bg-white p-5 shadow-lg shadow-slate-200/50">
      <div class="flex items-start justify-between">
        <div>
          <div class="flex items-center gap-2 text-xs font-semibold text-slate-500 sm:text-sm">
            <span>Total Balance</span>
            <Icon icon="mdi:eye-outline" class="size-4 text-slate-950" />
          </div>
          <p class="mt-2 text-xl font-black tracking-[0.08em] text-slate-950 sm:text-2xl">{{ displayBalance }}</p>
          <p class="mt-2 text-xs font-bold transition-colors" :class="balanceChange.positive ? 'text-emerald-500' : 'text-red-500'">
            {{ balanceChange.positive ? '↗' : '↘' }} {{ balanceChange.pct }}% <span class="ml-2 text-slate-500">(24h)</span>
          </p>
        </div>
        <div class="mt-1 w-44">
          <apexchart type="area" :options="chartOptions" :series="chartSeries" height="68" />
        </div>
      </div>

      <div class="mt-5 divide-y divide-slate-100">
        <div v-for="coin in coins" :key="coin.name" class="flex items-center gap-3 py-3">
          <span class="grid size-9 place-items-center rounded-full" :class="coin.className">
            <Icon :icon="coin.icon" class="size-5" />
          </span>
          <div class="flex-1">
            <p class="text-sm font-normal text-slate-950">{{ coin.name }}</p>
            <p class="text-xs font-semibold text-slate-500">{{ coin.code }}</p>
          </div>
          <div class="text-right">
            <p class="text-sm font-normal text-slate-950">{{ coin.amount }}</p>
            <p class="text-xs font-bold transition-colors" :class="coin.positive ? 'text-emerald-500' : 'text-red-500'">{{ coin.change }}</p>
          </div>
          <Icon icon="mdi:chevron-right" class="size-5 text-slate-400" />
        </div>
      </div>

      <button type="button" class="flex w-full items-center justify-between pt-3 text-sm font-normal text-slate-700">
        <span>View Portfolio</span>
        <Icon icon="mdi:chevron-right" class="size-5 text-slate-400" />
      </button>
    </div>

    <div class="mt-7 grid grid-cols-3 divide-x divide-slate-100 text-center">
      <div v-for="feature in features" :key="feature.title" class="px-3">
        <span class="mx-auto grid size-14 place-items-center rounded-2xl border border-slate-100 bg-teal-50 text-teal-500 shadow-sm">
          <Icon :icon="feature.icon" class="size-7" />
        </span>
        <h3 class="mt-3 text-xs font-black text-slate-950 sm:mt-4 sm:text-sm">{{ feature.title }}</h3>
        <p class="mt-1 text-[0.62rem] font-medium leading-3 text-slate-500 sm:mt-2 sm:text-[0.72rem] sm:leading-4">{{ feature.desc }}</p>
      </div>
    </div>

    <div class="mt-7 rounded-3xl border border-slate-100 bg-white p-5 shadow-sm">
      <div class="flex justify-center">
        <div class="relative grid size-24 shrink-0 place-items-center rounded-full bg-teal-50">
          <span class="absolute inset-3 rounded-full border border-teal-200"></span>
          <span class="grid size-12 place-items-center rounded-2xl bg-gradient-to-br from-teal-300 to-teal-600 text-white shadow-lg shadow-teal-300/50">
            <Icon icon="mdi:shield-lock" class="size-6" />
          </span>
        </div>
      </div>
      <div class="mt-4">
        <h3 class="text-base font-black text-slate-950 sm:text-lg">Security you can trust</h3>
        <p class="mt-2 text-[0.7rem] font-semibold leading-4 text-slate-500 sm:text-[0.78rem] sm:leading-5">
          Built with industry-leading security, audited code, and privacy by design to keep your assets safe.
        </p>
        <div class="mt-4 grid grid-cols-1 gap-2 text-[0.72rem] font-normal text-slate-600 sm:grid-cols-3">
          <span class="flex items-center gap-2"><Icon icon="mdi:lock-outline" class="size-4 shrink-0 text-teal-500" />Bank-Level Security</span>
          <span class="flex items-center gap-2"><Icon icon="mdi:badge-account-outline" class="size-4 shrink-0 text-teal-500" />Audited & Verified</span>
          <span class="flex items-center gap-2"><Icon icon="mdi:key-outline" class="size-4 shrink-0 text-teal-500" />Non-Custodial Control</span>
        </div>
      </div>
    </div>

    <div class="relative mt-6 overflow-hidden rounded-3xl shadow-xl shadow-teal-900/20">
      <img src="/images/landscape-banner.png" alt="" class="absolute inset-0 h-full w-full object-cover object-center" />
      <div class="absolute inset-0 bg-[#052d2f]/25"></div>
      <div class="relative p-6 text-white">
        <h3 class="text-lg font-black leading-tight sm:text-2xl">Your wallet.<br />Your <span class="text-teal-400">future.</span></h3>
        <p class="mt-4 text-xs font-semibold leading-5 text-teal-50/80 sm:w-full max-w-[200px]">Take control of your crypto today and build a better tomorrow.</p>
        <div class="mt-4 flex flex-wrap gap-2">
          <button type="button" class="flex items-center gap-2 rounded-lg bg-black/60 px-3 py-2 hover:bg-black/80 transition">
            <img src="/images/apple-logo.png" alt="Apple" class="h-5 w-auto brightness-0 invert" />
            <div class="text-left">
              <p class="text-[0.5rem] font-normal leading-none text-white/70">Download on the</p>
              <p class="text-[0.62rem] font-bold leading-tight text-white">App Store</p>
            </div>
          </button>
          <button type="button" class="flex items-center gap-2 rounded-lg bg-black/60 px-3 py-2 hover:bg-black/80 transition">
            <img src="/images/google-play.png" alt="Google Play" class="h-5 w-auto" />
            <div class="text-left">
              <p class="text-[0.5rem] font-normal leading-none text-white/70">Get It On</p>
              <p class="text-[0.62rem] font-bold leading-tight text-white">Google Play</p>
            </div>
          </button>
        </div>
      </div>
    </div>

    <div class="mt-5 flex flex-col items-center gap-2 rounded-2xl border border-slate-100 bg-white px-4 py-3 text-xs font-normal shadow-sm sm:flex-row sm:justify-center sm:gap-4 sm:text-sm">
      <div class="flex items-center gap-2">
        <span class="text-amber-400">★ ★ ★ ★ ★</span>
        <span>4.9/5</span>
      </div>
      <span class="hidden h-5 w-px bg-slate-200 sm:block"></span>
      <span class="text-slate-500">Trusted by 100,000+ users worldwide</span>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Icon } from '@iconify/vue'
import VueApexCharts from 'vue3-apexcharts'

const router = useRouter()
const apexchart = VueApexCharts

interface Coin {
  icon: string
  name: string
  code: string
  baseAmount: number
  amount: string
  changePct: number
  change: string
  positive: boolean
  className: string
}

interface Feature {
  icon: string
  title: string
  desc: string
}

// --- Animated balance count-up ---
const displayBalance = ref('$0.00')
const balanceChange = ref<{ pct: string; positive: boolean }>({ pct: '0.00', positive: true })

// Demo portfolio: how many units of each coin the user "holds"
// index 0 = BTC, 1 = ETH, 2 = USDT  (must match COINCAP_IDS order)
const COINCAP_IDS = ['bitcoin', 'ethereum', 'tether']
const HOLDINGS    = [0.1, 3, 5000] // 0.1 BTC | 3 ETH | 5000 USDT

// --- Live coin data (initial values shown before API responds) ---
const coins = ref<Coin[]>([
  { icon: 'mdi:bitcoin',       name: 'Bitcoin', code: 'BTC',  baseAmount: 10000, amount: '…', changePct: 0, change: '0.00%', positive: true, className: 'bg-orange-400 text-white' },
  { icon: 'mdi:ethereum',      name: 'Ethereum', code: 'ETH', baseAmount: 9000,  amount: '…', changePct: 0, change: '0.00%', positive: true, className: 'bg-indigo-500 text-white' },
  { icon: 'mdi:alpha-t-circle', name: 'Tether', code: 'USDT', baseAmount: 5000,  amount: '…', changePct: 0, change: '0.00%', positive: true, className: 'bg-teal-500 text-white' },
])

function fmtUsd(n: number) {
  return '$' + n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

/** Fetch real-time prices from CoinCap (free, no API key required) */
async function fetchLivePrices() {
  try {
    const res = await fetch('https://api.coincap.io/v2/assets?ids=' + COINCAP_IDS.join(','))
    if (!res.ok) return
    const json = await res.json() as { data?: Array<{ id: string; priceUsd: string; changePercent24Hr: string }> }
    for (const asset of json.data ?? []) {
      const idx = COINCAP_IDS.indexOf(asset.id)
      if (idx < 0) continue
      const price     = parseFloat(asset.priceUsd)       || 0
      const changePct = parseFloat(asset.changePercent24Hr) || 0
      const coin      = coins.value[idx]
      coin.baseAmount = price * HOLDINGS[idx]
      coin.changePct  = changePct
      coin.positive   = changePct >= 0
      coin.amount     = fmtUsd(coin.baseAmount)
      coin.change     = (coin.positive ? '+' : '') + changePct.toFixed(2) + '%'
    }
  } catch {
    // CoinCap unreachable — keep default values, simulation still runs
  }
}

function startCountUp(target: number) {
  const duration = 1500
  const startTime = Date.now()
  function tick() {
    const elapsed  = Date.now() - startTime
    const progress = Math.min(elapsed / duration, 1)
    const eased    = 1 - Math.pow(1 - progress, 3)
    displayBalance.value = fmtUsd(eased * target)
    if (progress < 1) requestAnimationFrame(tick)
  }
  requestAnimationFrame(tick)
}

onMounted(async () => {
  // 1. Fetch real prices — then animate count-up to the real total
  await fetchLivePrices()
  const total = coins.value.reduce((sum, c) => sum + c.baseAmount, 0)
  startCountUp(total)

  // 2. Simulate micro price movements every 2 s
  setInterval(() => {
    coins.value.forEach((coin) => {
      coin.baseAmount *= 1 + (Math.random() - 0.5) * 0.004
      coin.changePct  += (Math.random() - 0.5) * 0.12
      coin.positive    = coin.changePct >= 0
      coin.amount      = fmtUsd(coin.baseAmount)
      coin.change      = (coin.positive ? '+' : '') + Math.abs(coin.changePct).toFixed(2) + '%'
    })
    const newPct = parseFloat(balanceChange.value.pct) + (Math.random() - 0.5) * 0.1
    balanceChange.value = { pct: Math.abs(newPct).toFixed(2), positive: newPct >= 0 }
  }, 2000)

  // 3. Re-fetch real prices every 30 s to stay accurate
  setInterval(fetchLivePrices, 30_000)
})

const chartSeries = [{ name: 'Balance', data: [18, 30, 26, 42, 34, 38, 50, 41, 45, 58, 52, 68, 62, 76] }]

const chartOptions = {
  chart: { type: 'area', sparkline: { enabled: true }, toolbar: { show: false }, animations: { enabled: true, easing: 'easeinout', speed: 800 } },
  stroke: { curve: 'smooth', width: 2 },
  fill: { type: 'gradient', gradient: { shadeIntensity: 1, opacityFrom: 0.45, opacityTo: 0, stops: [0, 100] } },
  colors: ['#2dd4bf'],
  tooltip: { enabled: false },
  grid: { show: false },
  xaxis: { labels: { show: false }, axisBorder: { show: false }, axisTicks: { show: false } },
  yaxis: { show: false },
}

const features: Feature[] = [
  { icon: 'mdi:wallet', title: 'Send Instantly', desc: 'Move crypto in seconds, anywhere in the world.' },
  { icon: 'mdi:shield-check', title: 'Secure Storage', desc: 'Your assets protected with bank-grade encryption.' },
  { icon: 'mdi:chart-pie', title: 'Track & Grow', desc: 'Real-time insights to help you grow with confidence.' },
]
</script>

<style scoped>
.animate-float {
  animation: float 3.5s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-12px); }
}
</style>
