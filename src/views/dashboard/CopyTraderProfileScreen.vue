<script setup lang="ts">
import { ref, computed } from 'vue'
import { Icon } from '@iconify/vue'
import { useRoute } from 'vue-router'
import DashboardLayout from '../../layouts/DashboardLayout.vue'

useRoute()

const activeTab = ref('Overview')
const chatInput = ref('')
const isCopying = ref(true)
const balanceVisible = ref(true)
const likedMessages = ref<Record<string, boolean>>({})
const showEmojiPanel = ref(false)
const signalAssetFilter = ref('All Assets')
const signalTypeFilter = ref('All Types')
const showAssetDropdown = ref(false)
const showTypeDropdown = ref(false)
const perfPeriod = ref('30D')

const assetOptions = ['All Assets', 'BTC', 'ETH', 'SOL', 'BNB']
const typeOptions = ['All Types', 'Perpetual', 'Spot']
const periodOptions = ['7D', '30D', '90D', '1Y']
const emojis = ['👍', '🔥', '🚀', '💎', '📈', '✅', '💯', '⚡']

const tabs = [
  { name: 'Overview', icon: 'mdi:chart-donut' },
  { name: 'Signals', icon: 'mdi:lightning-bolt-outline' },
  { name: 'Chat', icon: 'mdi:chat-processing-outline' },
]

const pinnedPositions = [
  {
    no: '1', pair: 'BTC/USDT', side: 'Long', status: 'Live',
    icon: 'mdi:bitcoin', iconClass: 'bg-orange-100 text-orange-500',
    entry: '67,150', stopLoss: '66,000', target: '69,500 / 70,000',
  },
  {
    no: '2', pair: 'ETH/USDT', side: 'Long', status: 'Live',
    icon: 'mdi:ethereum', iconClass: 'bg-indigo-100 text-indigo-500',
    entry: '3,350', stopLoss: '3,250', target: '3,480 / 3,550',
  },
  {
    no: '3', pair: 'SOL/USDT', side: 'Long', status: 'Live',
    icon: 'mdi:circle-multiple-outline', iconClass: 'bg-black text-[#00e0c6]',
    entry: '171.20', stopLoss: '160.00', target: '178.00 / 182.00',
  },
  {
    no: '4', pair: 'BNB/USDT', side: 'Short', status: 'Live',
    icon: 'mdi:alpha-b-circle', iconClass: 'bg-yellow-100 text-yellow-500',
    entry: '605.50', stopLoss: '614.00', target: '590.00 / 582.00', short: true,
  },
]

const chatMessages = ref([
  {
    name: 'Alex Chen', role: 'Leader', avatar: 'https://i.pravatar.cc/100?img=12',
    time: '09:24 AM', text: 'BTC is showing strong momentum above $67,000. Breakout confirmed on 4H. Looking for continuation.', likes: 24,
  },
  {
    name: 'Sophia Li', role: 'Member', avatar: 'https://i.pravatar.cc/100?img=47',
    time: '09:26 AM', text: 'Agree! Volume is strong. What\'s your next target?', likes: null,
  },
  {
    name: 'Alex Chen', role: 'Leader', avatar: 'https://i.pravatar.cc/100?img=12',
    time: '09:27 AM', text: 'Next target at $69,500 – $70,000 zone.', likes: 18,
  },
  {
    name: 'James Wu', role: 'Member', avatar: 'https://i.pravatar.cc/100?img=52',
    time: '09:28 AM', text: 'Looking good ✅', likes: null,
  },
  {
    name: 'Mia Zhang', role: 'Member', avatar: 'https://i.pravatar.cc/100?img=32',
    time: '09:29 AM', text: 'ETH holding support well. Any levels to watch?', likes: null,
  },
  {
    name: 'Alex Chen', role: 'Leader', avatar: 'https://i.pravatar.cc/100?img=12',
    time: '09:30 AM', text: 'ETH strong above $3,350 support. Bullish as long as it holds. SL below $3,250.', likes: 21,
  },
])

const signals = [
  {
    pair: 'BTC/USDT', type: 'Perpetual', side: 'Long', time: 'Just now',
    icon: 'mdi:bitcoin', iconClass: 'bg-orange-100 text-orange-500',
    pnl: '+15.74', roe: '+0.10%', est: '14,984.2586', open: '15,000.00', sl: '10%', positive: true,
  },
  {
    pair: 'ETH/USDT', type: 'Perpetual', side: 'Long', time: '15m ago',
    icon: 'mdi:ethereum', iconClass: 'bg-indigo-100 text-indigo-500',
    pnl: '+68.45', roe: '+2.15%', est: '3,318.4200', open: '3,480.00', sl: '8%', positive: true,
  },
  {
    pair: 'SOL/USDT', type: 'Perpetual', side: 'Short', time: '1h ago',
    icon: 'mdi:circle-multiple-outline', iconClass: 'bg-black text-[#00e0c6]',
    pnl: '-21.76', roe: '-1.32%', est: '166.00', open: '158.00', sl: '12%', positive: false,
  },
  {
    pair: 'BNB/USDT', type: 'Perpetual', side: 'Long', time: '2h ago',
    icon: 'mdi:alpha-b-circle', iconClass: 'bg-yellow-100 text-yellow-500',
    pnl: '+11.53', roe: '+1.87%', est: '614.00', open: '640.00', sl: '10%', positive: true,
  },
]

const aboutPoints = [
  'Focuses on short-term setups with high probability.',
  'Keeps risk tight with clear stops and targets.',
  'Trades major coins with strong liquidity.',
]

const performance = [
  { label: '30D ROI', value: '+48.72%', color: 'text-[#0ba99d]', chart: [10, 16, 13, 24, 20, 35, 40, 48] },
  { label: 'Total PNL', value: '+12,456.78 USDT', color: 'text-[#0ba99d]', chart: [1200, 3400, 2800, 5600, 7200, 9800, 11200, 12456] },
  { label: 'Win Rate', value: '76.3%', color: 'text-[#17212f]', chart: [66, 70, 68, 72, 71, 74, 73, 76] },
  { label: 'Max Drawdown', value: '-8.41%', color: 'text-red-400', red: true, chart: [-0.5, -1.8, -1.2, -3.5, -5, -6.8, -6.2, -8.4] },
  { label: 'AUM', value: '856,230.45 USDT', color: 'text-[#17212f]', chart: [180000, 310000, 400000, 370000, 510000, 660000, 730000, 856000] },
  { label: 'Copiers PNL', value: '+312,456.78 USDT', color: 'text-[#17212f]', chart: [40000, 88000, 74000, 138000, 182000, 236000, 274000, 312000] },
  { label: 'Total Copiers', value: '5,829', color: 'text-[#17212f]', chart: [1100, 2000, 2700, 3100, 3800, 4500, 5100, 5829] },
  { label: 'Weeks Profitable', value: '18 / 22', color: 'text-[#17212f]', chart: [1, 3, 5, 6, 9, 12, 15, 18] },
]

const statistics = [
  { label: 'Total Trades', value: '324' },
  { label: 'Profitable Trades', value: '247' },
  { label: 'Losing Trades', value: '77' },
  { label: 'Profit Factor', value: '2.14' },
  { label: 'Sharpe Ratio', value: '1.85' },
]

function splinePath(yVals: number[], w = 80, h = 26, pad = 0.08, tension = 0.35): string {
  const n = yVals.length
  if (n < 2) return ''
  const minY = Math.min(...yVals)
  const maxY = Math.max(...yVals)
  const rangeY = maxY - minY || 1
  const top = h * pad
  const bot = h * (1 - pad)
  const pts = yVals.map((y, i) => [
    (i / (n - 1)) * w,
    bot - ((y - minY) / rangeY) * (bot - top),
  ])
  let d = `M ${pts[0][0].toFixed(2)},${pts[0][1].toFixed(2)}`
  for (let i = 0; i < n - 1; i++) {
    const p0 = pts[Math.max(i - 1, 0)]
    const p1 = pts[i]
    const p2 = pts[i + 1]
    const p3 = pts[Math.min(i + 2, n - 1)]
    const cp1x = p1[0] + (p2[0] - p0[0]) * tension
    const cp1y = p1[1] + (p2[1] - p0[1]) * tension
    const cp2x = p2[0] - (p3[0] - p1[0]) * tension
    const cp2y = p2[1] - (p3[1] - p1[1]) * tension
    d += ` C ${cp1x.toFixed(2)},${cp1y.toFixed(2)} ${cp2x.toFixed(2)},${cp2y.toFixed(2)} ${p2[0].toFixed(2)},${p2[1].toFixed(2)}`
  }
  return d
}

function splineArea(yVals: number[], w = 80, h = 26): string {
  const line = splinePath(yVals, w, h)
  if (!line) return ''
  return `${line} L ${w},${h} L 0,${h} Z`
}

function sendMessage() {
  const text = chatInput.value.trim()
  if (!text) return
  chatMessages.value.push({
    name: 'You',
    role: 'Member',
    avatar: 'https://i.pravatar.cc/100?img=70',
    time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    text,
    likes: null,
  })
  chatInput.value = ''
  showEmojiPanel.value = false
}

const filteredSignals = computed(() =>
  signals.filter(s => {
    const a = signalAssetFilter.value === 'All Assets' || s.pair.startsWith(signalAssetFilter.value)
    const t = signalTypeFilter.value === 'All Types' || s.type === signalTypeFilter.value
    return a && t
  })
)

function toggleLike(msg: any) {
  const key = msg.name + msg.time
  if (likedMessages.value[key]) {
    likedMessages.value[key] = false
    if (typeof msg.likes === 'number' && msg.likes > 0) msg.likes--
  } else {
    likedMessages.value[key] = true
    msg.likes = (msg.likes ?? 0) + 1
  }
}

function addEmoji(emoji: string) {
  chatInput.value += emoji
  showEmojiPanel.value = false
}
</script>

<template>
  <DashboardLayout>
    <div v-if="showAssetDropdown || showTypeDropdown" @click="showAssetDropdown = false; showTypeDropdown = false" class="fixed inset-0 z-10"></div>
    <div class="bg-[#f6f8fb] pb-4 text-[#17212f]">

      <!-- ── COACH HEADER ── -->
      <section class="rounded-b-2xl border-b border-gray-100 bg-white px-4 py-4 shadow-sm md:px-6">
        <div class="flex items-start gap-3">
          <div class="relative shrink-0">
            <img
              src="https://i.pravatar.cc/140?img=12"
              alt="Alex Chen"
              class="h-18 w-18 rounded-full object-cover"
            />
            <span class="absolute -left-1 -top-1 flex h-7 w-7 items-center justify-center rounded-full bg-yellow-100 text-[12px] font-semibold text-yellow-600">
              1
            </span>
            <span class="absolute bottom-1 right-1 h-4 w-4 rounded-full border-2 border-white bg-emerald-500"></span>
          </div>

          <div class="min-w-0 flex-1">
            <div class="flex items-center justify-between gap-2">
              <div>
                <div class="flex items-center gap-2">
                  <h1 class="text-[18px] font-semibold text-[#17212f]">Alex Chen</h1>
                  <Icon icon="mdi:check-decagram" class="text-[16px] text-[#14aeea]" />
                </div>
                <span class="mt-2 inline-flex rounded-full bg-[#eafffd] px-2 py-1 text-[9px] font-semibold text-[#0ba99d]">
                  BTC Swing
                </span>
              </div>
              <div class="rounded-full bg-emerald-50 px-3 py-1 text-[10px] font-semibold text-emerald-500">
                ● Room Live
              </div>
            </div>

            <p class="mt-3 text-[11px] font-semibold leading-relaxed text-[#344054]">
              High probability swing trades in BTC &amp; major coins. Trend following, risk first.
            </p>

            <div class="mt-3 flex items-center gap-3 text-[10px] font-bold text-gray-500">
              <span class="flex items-center gap-1">
                <Icon icon="mdi:account-multiple-outline" class="text-[13px]" />
                5.8K Followers
              </span>
              <span>•</span>
              <span>5.8K Copiers</span>
            </div>
          </div>
        </div>

        <div class="mt-4 grid grid-cols-[1fr_1fr_1.15fr_1fr] items-center gap-3">
          <div>
            <p class="text-[10px] font-bold text-gray-400">30D ROI</p>
            <p class="mt-1 text-[16px] font-semibold text-[#0ba99d]">+48.72%</p>
          </div>
          <div>
            <p class="text-[10px] font-bold text-gray-400">Win Rate</p>
            <p class="mt-1 text-[16px] font-semibold text-[#17212f]">76.3%</p>
          </div>
          <button
            @click="isCopying = !isCopying"
            class="h-10 rounded-xl text-[12px] font-semibold transition-colors active:scale-95"
            :class="isCopying ? 'border border-red-200 bg-red-50 text-red-400' : 'bg-[#08a99f] text-white'"
          >
            {{ isCopying ? 'Stop Copy' : 'Start Copy' }}
          </button>
          <button
            class="flex h-10 items-center justify-center gap-1 rounded-xl border transition-colors active:scale-95"
            :class="isCopying ? 'border-[#b8f4ef] bg-[#eafffd] text-[#0ba99d]' : 'border-gray-200 bg-white text-gray-400'"
          >
            <Icon :icon="isCopying ? 'mdi:check' : 'mdi:account-plus-outline'" class="text-[15px]" />
            {{ isCopying ? 'Joined' : 'Follow' }}
          </button>
        </div>
      </section>

      <!-- ── BALANCE ── -->
      <section class="mt-3">
        <button class="flex w-full items-center justify-between rounded-2xl border border-gray-100 bg-white px-4 py-4 shadow-sm active:scale-[0.99]">
          <div class="flex items-center gap-3">
            <div class="flex h-11 w-11 items-center justify-center rounded-xl bg-[#eafffd]">
              <Icon icon="mdi:wallet-outline" class="text-[25px] text-[#0ba99d]" />
            </div>
            <div class="text-left">
              <button class="flex items-center gap-1" @click.stop="balanceVisible = !balanceVisible">
                <p class="text-[12px] font-bold text-[#344054]">My Balance</p>
                <Icon :icon="balanceVisible ? 'mdi:eye-outline' : 'mdi:eye-off-outline'" class="text-[14px] text-gray-400" />
              </button>
              <p class="mt-1 text-[18px] font-semibold text-[#0ba99d]">
                <span v-if="balanceVisible">12,450.8 <span class="text-[11px]">USDT</span></span>
                <span v-else class="text-[14px] tracking-widest">••••••</span>
              </p>
            </div>
          </div>
          <Icon icon="mdi:chevron-right" class="text-[22px] text-gray-400" />
        </button>
      </section>

      <!-- ── PAGE TABS ── -->
      <section class="mt-3">
        <div class="grid h-13 grid-cols-3 rounded-2xl border border-gray-100 bg-white shadow-sm">
          <button
            v-for="tab in tabs"
            :key="tab.name"
            @click="activeTab = tab.name"
            class="relative flex items-center justify-center gap-2 text-[12px] font-semibold"
            :class="activeTab === tab.name ? 'text-[#0ba99d]' : 'text-gray-500'"
          >
            <Icon :icon="tab.icon" class="text-[18px]" />
            {{ tab.name }}
            <span
              v-if="activeTab === tab.name"
              class="absolute bottom-0 h-0.75 w-18 rounded-full bg-[#0ba99d]"
            ></span>
          </button>
        </div>
      </section>

      <!-- ── CHAT TAB ── -->
      <section v-if="activeTab === 'Chat'" class="mt-4">
        <!-- Pinned positions header -->
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <Icon icon="mdi:pin" class="text-[16px] text-[#0ba99d]" />
            <h2 class="text-[13px] font-semibold text-[#0ba99d]">
              Pinned Open Positions <span class="text-gray-500">(Up to 4)</span>
            </h2>
          </div>
          <button
            @click="activeTab = 'Signals'"
            class="flex items-center gap-1 text-[11px] font-semibold text-[#0ba99d]"
          >
            View All Signals
            <Icon icon="mdi:chevron-right" class="text-[15px]" />
          </button>
        </div>

        <!-- Pinned position cards -->
        <div class="mt-3 grid grid-cols-2 gap-3 md:grid-cols-4">
          <article
            v-for="item in pinnedPositions"
            :key="item.no"
            class="relative rounded-xl border border-gray-100 bg-white p-3 shadow-sm"
          >
            <span class="absolute left-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-[#0ba99d] text-[9px] font-semibold text-white">
              {{ item.no }}
            </span>
            <Icon icon="mdi:pin" class="absolute right-2 top-2 text-[16px] text-[#0ba99d]" />

            <div class="ml-5 flex items-center gap-2">
              <div class="flex h-9 w-9 items-center justify-center rounded-full" :class="item.iconClass">
                <Icon :icon="item.icon" class="text-[22px]" />
              </div>
              <div>
                <h3 class="text-[12px] font-semibold text-[#17212f]">{{ item.pair }}</h3>
                <div class="mt-1 flex items-center gap-2">
                  <span class="text-[10px] font-semibold" :class="item.short ? 'text-red-400' : 'text-[#0ba99d]'">
                    {{ item.side }}
                  </span>
                  <span class="rounded bg-emerald-50 px-2 py-0.5 text-[8px] font-semibold text-emerald-500">{{ item.status }}</span>
                </div>
              </div>
            </div>

            <div class="mt-4 grid grid-cols-2 gap-y-2">
              <div>
                <p class="text-[9px] font-bold text-gray-400">Entry</p>
                <p class="text-[10px] font-semibold">{{ item.entry }}</p>
              </div>
              <div>
                <p class="text-[9px] font-bold text-gray-400">Stop Loss</p>
                <p class="text-[10px] font-semibold text-red-400">{{ item.stopLoss }}</p>
              </div>
              <div>
                <p class="text-[9px] font-bold text-gray-400">Target</p>
                <p class="text-[10px] font-semibold">{{ item.target }}</p>
              </div>
              <div>
                <p class="text-[9px] font-bold text-gray-400">Status</p>
                <p class="text-[10px] font-semibold text-emerald-500">Active</p>
              </div>
            </div>
          </article>
        </div>

        <!-- Chat messages -->
        <div class="mt-4 space-y-4">
          <article v-for="msg in chatMessages" :key="msg.name + msg.time + msg.text" class="flex gap-3">
            <img :src="msg.avatar" :alt="msg.name" class="h-10 w-10 shrink-0 rounded-full object-cover" />
            <div class="min-w-0 flex-1">
              <div class="flex items-center gap-2">
                <h3 class="text-[12px] font-semibold text-[#17212f]">{{ msg.name }}</h3>
                <Icon icon="mdi:check-decagram" class="text-[12px] text-[#14aeea]" />
                <span class="rounded bg-[#eafffd] px-2 py-0.5 text-[8px] font-semibold text-[#0ba99d]">{{ msg.role }}</span>
              </div>
              <p class="mt-1 text-[12px] font-semibold leading-snug text-[#17212f]">{{ msg.text }}</p>
              <div class="mt-1 flex items-center gap-3">
                <span class="text-[9px] font-bold text-gray-400">{{ msg.time }}</span>
                <button
                  @click="toggleLike(msg)"
                  class="flex items-center gap-1 text-[9px] font-semibold transition-colors"
                  :class="likedMessages[msg.name + msg.time] ? 'text-[#0ba99d]' : 'text-gray-400'"
                >
                  <Icon icon="mdi:thumb-up" class="text-[12px]" />
                  {{ msg.likes ?? 0 }}
                </button>
              </div>
            </div>
          </article>
        </div>

        <!-- ── CHAT INPUT ── -->
        <div class="relative mt-4">
          <div v-if="showEmojiPanel" class="mb-2 flex flex-wrap gap-2 rounded-xl border border-gray-100 bg-white p-3 shadow-sm">
            <button
              v-for="emoji in emojis"
              :key="emoji"
              @click="addEmoji(emoji)"
              class="text-[22px] active:scale-90"
            >{{ emoji }}</button>
          </div>
          <div class="flex items-center gap-3 rounded-2xl border border-gray-100 bg-white px-3 py-3 shadow-sm">
            <button class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full active:scale-95">
              <Icon icon="mdi:paperclip" class="text-[24px] text-gray-500" />
            </button>
            <input
              v-model="chatInput"
              type="text"
              placeholder="Type a message..."
              class="h-10 flex-1 rounded-xl bg-[#f6f8fb] px-4 text-[12px] font-semibold outline-none placeholder:text-gray-400"
              @keyup.enter="sendMessage"
            />
            <button
              @click="showEmojiPanel = !showEmojiPanel"
              class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-colors active:scale-95"
              :class="showEmojiPanel ? 'text-[#0ba99d]' : 'text-gray-500'"
            >
              <Icon icon="mdi:emoticon-outline" class="text-[23px]" />
            </button>
            <button
              @click="sendMessage"
              class="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#08a99f] active:scale-95"
            >
              <Icon icon="mdi:send" class="text-[22px] text-white" />
            </button>
          </div>
        </div>
      </section>

      <!-- ── SIGNALS TAB ── -->
      <section v-if="activeTab === 'Signals'" class="mt-4">
        <div class="flex items-center justify-between">
          <div class="flex gap-2">
            <!-- Asset filter -->
            <div class="relative z-20">
              <button
                @click="showAssetDropdown = !showAssetDropdown; showTypeDropdown = false"
                class="flex h-9 items-center gap-1 rounded-xl border bg-white px-3 text-[11px] font-semibold shadow-sm transition-colors"
                :class="signalAssetFilter !== 'All Assets' ? 'border-[#0ba99d] text-[#0ba99d]' : 'border-gray-100 text-[#344054]'"
              >
                {{ signalAssetFilter }}
                <Icon icon="mdi:chevron-down" class="text-[15px] transition-transform" :class="showAssetDropdown ? 'rotate-180' : ''" />
              </button>
              <div v-if="showAssetDropdown" class="absolute left-0 top-10 z-30 min-w-32 rounded-xl border border-gray-100 bg-white py-1 shadow-lg">
                <button
                  v-for="opt in assetOptions"
                  :key="opt"
                  @click="signalAssetFilter = opt; showAssetDropdown = false"
                  class="flex w-full items-center px-3 py-2 text-[11px] font-semibold transition-colors hover:bg-[#f6f8fb]"
                  :class="signalAssetFilter === opt ? 'text-[#0ba99d]' : 'text-[#344054]'"
                >
                  <Icon v-if="signalAssetFilter === opt" icon="mdi:check" class="mr-2 text-[13px] text-[#0ba99d]" />
                  <span v-else class="mr-5 inline-block"></span>
                  {{ opt }}
                </button>
              </div>
            </div>
            <!-- Type filter -->
            <div class="relative z-20">
              <button
                @click="showTypeDropdown = !showTypeDropdown; showAssetDropdown = false"
                class="flex h-9 items-center gap-1 rounded-xl border bg-white px-3 text-[11px] font-semibold shadow-sm transition-colors"
                :class="signalTypeFilter !== 'All Types' ? 'border-[#0ba99d] text-[#0ba99d]' : 'border-gray-100 text-[#344054]'"
              >
                {{ signalTypeFilter }}
                <Icon icon="mdi:chevron-down" class="text-[15px] transition-transform" :class="showTypeDropdown ? 'rotate-180' : ''" />
              </button>
              <div v-if="showTypeDropdown" class="absolute left-0 top-10 z-30 min-w-28 rounded-xl border border-gray-100 bg-white py-1 shadow-lg">
                <button
                  v-for="opt in typeOptions"
                  :key="opt"
                  @click="signalTypeFilter = opt; showTypeDropdown = false"
                  class="flex w-full items-center px-3 py-2 text-[11px] font-semibold transition-colors hover:bg-[#f6f8fb]"
                  :class="signalTypeFilter === opt ? 'text-[#0ba99d]' : 'text-[#344054]'"
                >
                  <Icon v-if="signalTypeFilter === opt" icon="mdi:check" class="mr-2 text-[13px] text-[#0ba99d]" />
                  <span v-else class="mr-5 inline-block"></span>
                  {{ opt }}
                </button>
              </div>
            </div>
          </div>
          <button
            @click="signalAssetFilter = 'All Assets'; signalTypeFilter = 'All Types'"
            class="flex h-9 items-center gap-2 rounded-xl border bg-white px-3 text-[11px] font-semibold shadow-sm transition-colors"
            :class="signalAssetFilter !== 'All Assets' || signalTypeFilter !== 'All Types' ? 'border-[#0ba99d] text-[#0ba99d]' : 'border-gray-100 text-[#344054]'"
          >
            <Icon icon="mdi:tune-variant" class="text-[16px]" />
            {{ signalAssetFilter !== 'All Assets' || signalTypeFilter !== 'All Types' ? 'Reset' : 'Filter' }}
          </button>
        </div>

        <div class="mt-3 space-y-3 px-3 md:grid md:grid-cols-2 md:space-y-0 md:gap-3 md:px-6 lg:grid-cols-3">
          <article
            v-for="item in filteredSignals"
            :key="item.pair"
            class="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm md:mt-0"
          >
            <div class="flex items-start justify-between">
              <div class="flex items-center gap-3">
                <div class="flex h-9 w-9 items-center justify-center rounded-full" :class="item.iconClass">
                  <Icon :icon="item.icon" class="text-[22px]" />
                </div>
                <div>
                  <div class="flex items-center gap-2">
                    <h3 class="text-[14px] font-semibold text-[#17212f]">{{ item.pair }}</h3>
                    <span class="text-[10px] font-bold text-gray-500">{{ item.type }}</span>
                  </div>
                </div>
              </div>
              <div class="text-right">
                <span
                  class="rounded px-2 py-1 text-[9px] font-semibold"
                  :class="item.side === 'Long' ? 'bg-emerald-50 text-emerald-500' : 'bg-red-50 text-red-400'"
                >{{ item.side }}</span>
                <p class="mt-2 text-[10px] font-bold text-gray-500">{{ item.time }}</p>
              </div>
            </div>

            <div class="mt-4 grid grid-cols-2 gap-4">
              <div>
                <p class="text-[10px] font-bold text-gray-400">Unrealized PNL (USDT)</p>
                <p class="mt-1 text-[22px] font-semibold" :class="item.positive ? 'text-[#0ba99d]' : 'text-red-400'">
                  {{ item.pnl }}
                </p>
              </div>
              <div class="text-right">
                <p class="text-[10px] font-bold text-gray-400">ROE</p>
                <p class="mt-1 text-[22px] font-semibold" :class="item.positive ? 'text-[#0ba99d]' : 'text-red-400'">
                  {{ item.roe }}
                </p>
              </div>
            </div>

            <div class="mt-4 grid grid-cols-3 border-t border-gray-100 pt-3">
              <div>
                <p class="text-[9px] font-bold text-gray-400">Est. Total</p>
                <p class="mt-1 text-[11px] font-semibold text-[#17212f]">{{ item.est }}</p>
              </div>
              <div class="text-center">
                <p class="text-[9px] font-bold text-gray-400">Open Position</p>
                <p class="mt-1 text-[11px] font-semibold text-[#17212f]">{{ item.open }}</p>
              </div>
              <div class="text-right">
                <p class="text-[9px] font-bold text-gray-400">SL</p>
                <p class="mt-1 text-[11px] font-semibold" :class="item.positive ? 'text-[#0ba99d]' : 'text-red-400'">
                  {{ item.sl }}
                </p>
              </div>
            </div>
          </article>
        </div>

        <p class="mt-4 px-4 text-[9px] font-semibold leading-relaxed text-gray-400">
          Signals are provided by the trader and are not financial advice. Past performance is not indicative of future results.
        </p>
      </section>

      <!-- ── OVERVIEW TAB ── -->
      <section v-if="activeTab === 'Overview'" class="mt-4 space-y-4">
        <!-- About -->
        <article class="overflow-hidden rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <div class="flex items-center justify-between gap-6">
            <!-- Left Content -->
            <div class="flex-1">
              <h2 class="text-[22px] font-semibold text-[#111827]">About This Trader</h2>
              <div class="mt-6 space-y-5">
                <div
                  v-for="point in aboutPoints"
                  :key="point"
                  class="flex items-center gap-4"
                >
                  <span class="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#eafffb]">
                    <span class="h-2.5 w-2.5 rounded-full bg-[#18c7ba]"></span>
                  </span>
                  <p class="text-[14px] font-semibold leading-relaxed text-[#1f2937]">{{ point }}</p>
                </div>
              </div>
            </div>

            <!-- Right Illustration -->
            <div class="relative hidden h-[160px] w-[210px] shrink-0 items-center justify-center sm:flex">
              <div class="absolute bottom-2 flex items-end gap-3 opacity-35">
                <span class="h-8 w-7 rounded-t-md bg-[#20c7b7]"></span>
                <span class="h-14 w-7 rounded-t-md bg-[#20c7b7]"></span>
                <span class="h-20 w-7 rounded-t-md bg-[#20c7b7]"></span>
                <span class="h-28 w-7 rounded-t-md bg-[#20c7b7]"></span>
              </div>
              <div class="absolute left-7 top-4 flex h-[96px] w-[96px] items-center justify-center rounded-full border-[10px] border-[#20c7b7]/30">
                <div class="flex h-[56px] w-[56px] items-center justify-center rounded-full border-[8px] border-[#20c7b7]/50">
                  <span class="h-4 w-4 rounded-full bg-[#20c7b7]"></span>
                </div>
              </div>
              <Icon
                icon="mdi:arrow-top-right-thick"
                class="absolute left-[92px] top-[16px] rotate-[-8deg] text-[64px] text-[#20c7b7]"
              />
            </div>
          </div>
        </article>

        <!-- Performance -->
        <article class="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
          <div class="flex items-center justify-between">
            <h2 class="text-[16px] font-semibold text-[#17212f]">Performance Overview</h2>
            <div class="flex gap-1">
              <button
                v-for="p in periodOptions"
                :key="p"
                @click="perfPeriod = p"
                class="rounded-lg px-2 py-1 text-[10px] font-semibold transition-colors"
                :class="perfPeriod === p ? 'bg-[#0ba99d] text-white' : 'bg-gray-100 text-gray-500'"
              >{{ p }}</button>
            </div>
          </div>
          <div class="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
            <div
              v-for="item in performance"
              :key="item.label"
              class="border-b border-gray-100 pb-3 md:border-b-0 md:border-r md:pb-0 md:pr-3 last:border-0"
            >
              <p class="text-[10px] font-bold text-gray-400">{{ item.label }}</p>
              <p class="mt-1 text-[14px] font-semibold" :class="item.color">{{ item.value }}</p>
              <svg viewBox="0 0 80 26" class="mt-3 h-6.5 w-full" preserveAspectRatio="none">
                <defs>
                  <linearGradient :id="`perf-grad-${item.label.replace(/\s+/g,'')}`" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" :stop-color="item.red ? '#fca5a5' : '#72ded8'" stop-opacity="0.5" />
                    <stop offset="100%" :stop-color="item.red ? '#fca5a5' : '#72ded8'" stop-opacity="0" />
                  </linearGradient>
                </defs>
                <path
                  :d="splineArea(item.chart)"
                  :fill="`url(#perf-grad-${item.label.replace(/\s+/g,'')})`"
                />
                <path
                  :d="splinePath(item.chart)"
                  fill="none"
                  :stroke="item.red ? '#f87171' : '#0ba99d'"
                  stroke-width="1.8"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </div>
          </div>
        </article>

        <!-- Strategy -->
        <article class="relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
          <div class="relative z-10 max-w-61.25">
            <h2 class="text-[16px] font-semibold text-[#17212f]">Trading Strategy</h2>
            <p class="mt-2 text-[12px] font-semibold leading-relaxed text-[#17212f]">
              Focus on high probability short-term setups with strong market structure and momentum confirmation.
            </p>
            <ul class="mt-3 space-y-2">
              <li class="flex items-center gap-2 text-[11px] font-bold text-[#344054]">
                <Icon icon="mdi:check" class="text-[15px] text-[#0ba99d]" />
                Trend following with momentum confirmation
              </li>
              <li class="flex items-center gap-2 text-[11px] font-bold text-[#344054]">
                <Icon icon="mdi:check" class="text-[15px] text-[#0ba99d]" />
                Strict risk management, max 2% per trade
              </li>
              <li class="flex items-center gap-2 text-[11px] font-bold text-[#344054]">
                <Icon icon="mdi:check" class="text-[15px] text-[#0ba99d]" />
                Clear entry, stop loss, and target levels
              </li>
            </ul>
          </div>

          <div class="absolute bottom-0 right-0 flex h-36.25 w-40 items-center justify-center">
            <div class="absolute bottom-4 h-7 w-30 rounded-full bg-cyan-100 blur-md"></div>
            <Icon icon="mdi:target" class="absolute left-2 top-10 text-[70px] text-[#0ba99d]/80" />
            <div class="absolute bottom-6 right-5 flex items-end gap-1 opacity-70">
              <span class="h-5 w-3 rounded-t bg-[#b5f7f3]"></span>
              <span class="h-9 w-3 rounded-t bg-[#8deee9]"></span>
              <span class="h-14 w-3 rounded-t bg-[#52d9d2]"></span>
              <span class="h-20 w-3 rounded-t bg-[#0ba99d]"></span>
            </div>
          </div>
        </article>

        <!-- Statistics -->
        <article class="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
          <h2 class="text-[16px] font-semibold text-[#17212f]">Statistics</h2>
          <div class="mt-4 grid grid-cols-3 gap-3 md:grid-cols-5">
            <div v-for="item in statistics" :key="item.label">
              <p class="text-[10px] font-bold text-gray-400">{{ item.label }}</p>
              <p class="mt-2 text-[14px] font-semibold text-[#17212f]">{{ item.value }}</p>
            </div>
          </div>
        </article>
      </section>

    </div>

  </DashboardLayout>
</template>
