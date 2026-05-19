<template>
  <div class="min-h-screen bg-[#f6f8fb]">
    <!-- TOP NAVBAR -->
    <header
      class="fixed top-0 left-0 right-0 z-50 h-[62px] bg-[#f8fafc]/95 backdrop-blur-md border-b border-gray-100"
    >
      <div class="mx-auto h-full max-w-7xl px-4 grid grid-cols-3 items-center">

        <!-- Search overlay (full width when open) -->
        <transition
          enter-active-class="transition duration-200 ease-out"
          enter-from-class="opacity-0 scale-x-95"
          enter-to-class="opacity-100 scale-x-100"
          leave-active-class="transition duration-150 ease-in"
          leave-from-class="opacity-100 scale-x-100"
          leave-to-class="opacity-0 scale-x-95"
        >
          <div v-if="searchOpen" class="absolute inset-0 z-10 flex items-center gap-2 bg-[#f8fafc]/98 px-4">
            <Icon icon="mdi:magnify" class="shrink-0 text-[22px] text-[#28b8ad]" />
            <input
              ref="searchInputRef"
              v-model="searchQuery"
              type="text"
              placeholder="Search coins, traders, P2P…"
              class="flex-1 bg-transparent text-[14px] font-medium text-[#1f2933] placeholder-gray-400 outline-none"
            />
            <button @click="closeSearch" class="shrink-0 active:scale-95 transition">
              <Icon icon="mdi:close" class="text-[22px] text-gray-500" />
            </button>
          </div>
        </transition>

        <!-- Left Icon -->
        <button
          class="w-9 h-9 flex items-center justify-center rounded-xl active:scale-95 transition"
          @click="router.push('/dashboard')"
        >
          <img src="/oneled-logo.png" alt="OneLedger" class="h-[28px] w-auto object-contain" />
        </button>

        <!-- Center Tabs -->
        <div class="flex justify-center">
        <div
          class="relative -left-10 bg-slate-200 rounded-xl p-1 flex items-center gap-1"
        >
          <button
            v-for="tab in topTabs"
            :key="tab"
            @click="tab === 'Copy Trade' ? router.push('/copy-trade') : router.push('/dashboard')"
            class="h-7 px-3 sm:h-10 sm:px-7 rounded-lg text-[11px] sm:text-[15px] font-semibold transition-all duration-200 whitespace-nowrap"
            :class="
              activeTopTab === tab
                ? 'bg-white text-[#28b8ad] shadow-sm'
                : 'text-[#2f3338]'
            "
          >
            {{ tab }}
          </button>
        </div>
        </div>

        <!-- Right Icons -->
        <div class="flex items-center justify-end gap-4">
          <button class="relative active:scale-95 transition" @click="openSearch">
            <Icon icon="mdi:magnify" class="text-[29px] text-[#20242a]" />
          </button>

          <button class="relative active:scale-95 transition" @click.stop="toggleNotifDropdown" data-notif-zone>
            <Icon icon="mdi:bell-outline" class="text-[27px] text-[#20242a]" />
            <!-- Notification dot with pulse -->
            <span v-if="notifUnread > 0" class="absolute top-[1px] right-[1px] flex h-[9px] w-[9px]">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#1ecac2] opacity-75"></span>
              <span class="relative inline-flex rounded-full h-[9px] w-[9px] bg-[#1ecac2]"></span>
            </span>
          </button>

          <button
            class="w-7.5 h-7.5 rounded-full overflow-hidden border border-gray-200 active:scale-95 transition"
            @click="router.push('/profile')"
          >
            <img
              :src="userAvatar"
              alt="Avatar"
              class="w-full h-full object-cover"
              @error="onAvatarError"
            />
          </button>
        </div>
      </div>

      <!-- Notification dropdown -->
      <transition
        enter-active-class="transition duration-150 ease-out"
        enter-from-class="opacity-0 -translate-y-1"
        enter-to-class="opacity-100 translate-y-0"
        leave-active-class="transition duration-100 ease-in"
        leave-from-class="opacity-100 translate-y-0"
        leave-to-class="opacity-0 -translate-y-1"
      >
        <div
          v-if="notifOpen && !searchOpen"
          class="absolute top-[62px] right-0 z-40 w-full max-w-[420px] bg-white border-b border-gray-100 shadow-xl rounded-b-2xl overflow-hidden"
          data-notif-zone
        >
          <!-- Header -->
          <div class="flex items-center justify-between border-b border-gray-100 px-4 py-3">
            <p class="text-[13px] font-bold text-[#0b1638]">Notifications</p>
            <button @click="notifOpen = false; router.push('/notifications')" class="text-[11px] font-semibold text-[#08a99f] active:opacity-60">View all</button>
          </div>

          <!-- Loading -->
          <div v-if="notifLoading" class="flex flex-col gap-px">
            <div v-for="i in 3" :key="i" class="flex gap-3 px-4 py-4 border-b border-gray-50">
              <div class="h-10 w-10 shrink-0 animate-pulse rounded-full bg-gray-100"></div>
              <div class="flex-1 space-y-2 pt-1">
                <div class="h-3 w-2/3 animate-pulse rounded bg-gray-100"></div>
                <div class="h-2 w-full animate-pulse rounded bg-gray-100"></div>
              </div>
            </div>
          </div>

          <!-- Items -->
          <template v-else>
            <div
              v-for="item in notifList"
              :key="item.id"
              class="flex items-start gap-3 border-b border-gray-50 px-4 py-3 last:border-0"
              :class="item.unread ? 'bg-[#f6fffe]' : ''"
            >
              <div
                class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full"
                :class="item.iconClass"
              >
                <Icon :icon="item.icon" class="text-[22px]" />
              </div>
              <div class="min-w-0 flex-1">
                <div class="flex items-start justify-between gap-2">
                  <p class="text-[12px] font-semibold text-[#0b1638] leading-snug">{{ item.title }}</p>
                  <span class="shrink-0 text-[11px] font-medium text-[#5b6d9a]">{{ item.time }}</span>
                </div>
                <p class="mt-0.5 text-[11px] font-medium leading-snug text-[#4b5575]">{{ item.message }}</p>
              </div>
            </div>

            <!-- Empty -->
            <div v-if="notifList.length === 0" class="flex flex-col items-center py-8 text-gray-400">
              <Icon icon="mdi:bell-off-outline" class="text-[36px]" />
              <p class="mt-2 text-[11px] font-semibold">No notifications</p>
            </div>
          </template>
        </div>
      </transition>

      <!-- Search results dropdown -->
      <transition
        enter-active-class="transition duration-150 ease-out"
        enter-from-class="opacity-0 -translate-y-1"
        enter-to-class="opacity-100 translate-y-0"
        leave-active-class="transition duration-100 ease-in"
        leave-from-class="opacity-100 translate-y-0"
        leave-to-class="opacity-0 -translate-y-1"
      >
        <div
          v-if="searchOpen && searchQuery.trim()"
          class="absolute top-[62px] inset-x-0 z-40 bg-white border-b border-gray-100 shadow-xl"
        >
          <div class="mx-auto max-w-7xl px-4 pb-3 max-h-[420px] overflow-y-auto">

            <!-- No results -->
            <div v-if="!searchGroups.length" class="flex flex-col items-center py-8 text-center">
              <Icon icon="mdi:magnify-remove-outline" class="text-[44px] text-gray-200" />
              <p class="mt-2 text-[13px] font-semibold text-gray-400">No results for "{{ searchQuery }}"</p>
            </div>

            <!-- Grouped results -->
            <template v-else>
              <div v-for="group in searchGroups" :key="group.label">
                <!-- Category label -->
                <p class="px-3 pb-1.5 pt-3 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                  {{ group.label }}
                </p>

                <!-- Items -->
                <button
                  v-for="item in group.items"
                  :key="item.id"
                  class="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 hover:bg-slate-50 active:bg-slate-100 transition text-left"
                  @click="onSearchResultClick(item)"
                >
                  <!-- Icon -->
                  <div :class="['grid size-9 shrink-0 place-items-center rounded-xl overflow-hidden', item.iconBg]">
                    <img v-if="item.iconIsUrl" :src="item.icon" class="size-9 object-cover" alt="" />
                    <Icon v-else :icon="item.icon" class="size-5" />
                  </div>

                  <!-- Text -->
                  <div class="flex-1 min-w-0">
                    <p class="text-[13px] font-bold text-[#1f2933]">
                      {{ item.title }}
                      <span v-if="item.category === 'Coins'" class="font-medium text-gray-400">/USDT</span>
                    </p>
                    <p class="text-[11px] text-gray-400 truncate">{{ item.subtitle }}</p>
                  </div>

                  <!-- Right: live price (Coins) -->
                  <div v-if="item.priceInfo" class="text-right shrink-0">
                    <p class="text-[13px] font-semibold text-[#1f2933]">{{ item.priceInfo.price }}</p>
                    <p class="text-[11px]" :class="item.priceInfo.isPositive ? 'text-green-500' : 'text-red-500'">{{ item.priceInfo.change }}</p>
                  </div>

                  <!-- Right: ROI badge (Copy Trader) -->
                  <span v-else-if="item.badge" class="shrink-0 rounded-full bg-[#eafffd] px-2 py-0.5 text-[10px] font-bold text-[#0aa99e]">
                    {{ item.badge }}
                  </span>

                  <!-- Right: arrow (Pages) -->
                  <Icon v-else-if="item.category === 'Pages'" icon="mdi:chevron-right" class="shrink-0 text-[18px] text-gray-300" />
                </button>
              </div>
            </template>

          </div>
        </div>
      </transition>
    </header>

    <!-- PAGE CONTENT -->
    <main class="mx-auto max-w-7xl pt-[62px] pb-[80px]">
      <slot />
    </main>

    <!-- BOTTOM TABBAR -->
    <nav
      class="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-100 shadow-[0_-4px_20px_rgba(0,0,0,0.03)]"
    >
      <div class="mx-auto max-w-7xl">
      <div class="relative h-[75px] px-2 grid grid-cols-5 items-center">
        <button
          v-for="menu in bottomMenus"
          :key="menu.name"
          @click="router.push(menu.route)"
          class="relative flex flex-col items-center justify-center gap-1 active:scale-95 transition"
          :class="menu.center ? '-mt-8' : ''"
        >
          <!-- Center Trade Button -->
          <div
            v-if="menu.center"
            class="w-[58px] h-[58px] rounded-full bg-white border border-[#bff4ef] shadow-[0_0_25px_rgba(39,190,181,0.18)] flex items-center justify-center"
          >
            <Icon
              :icon="menu.icon"
              class="text-[30px]"
              :class="route.path === menu.route ? 'text-[#24b8af]' : 'text-gray-400'"
            />
          </div>

          <!-- Normal Icons -->
          <Icon
            v-else
            :icon="menu.icon"
            class="text-[24px]"
            :class="route.path === menu.route ? 'text-[#24b8af]' : 'text-[#9aa1aa]'"
          />

          <span
            class="text-[11px] font-medium"
            :class="route.path === menu.route ? 'text-[#24b8af]' : 'text-[#8f96a3]'"
          >
            {{ menu.name }}
          </span>
        </button>
      </div>

      <!-- iPhone Home Indicator -->
      <div class="h-[12px] flex items-center justify-center bg-white">
        <div class="w-[135px] h-[4px] bg-black rounded-full"></div>
      </div>
      </div><!-- /max-w-7xl -->
    </nav>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick, onMounted, onBeforeUnmount } from 'vue'
import { Icon } from '@iconify/vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { cdnUrl } from '@/utils/cdn'
import { useMarketStore, type CoinMeta, coinIconClass } from '@/stores/market'
import { makeContentApi, type CopyTrader, p2pApi, makeNotificationsApi } from '@/services/api'

const router = useRouter()
const route = useRoute()
const auth = useAuthStore()
const marketStore = useMarketStore()

// ── User avatar ───────────────────────────────────────────────
const DEFAULT_AVATAR = '/images/user-default.png'

/** Resolve avatar: Google/uploaded URL on user object > CDN path on profile > default */
function resolveAvatar(): string {
  if (auth.user?.profile) return auth.user.profile
  const photoUrl = (auth.profile as Record<string, unknown> | null)?.photo_url
  if (photoUrl) return cdnUrl(String(photoUrl))
  return DEFAULT_AVATAR
}

const avatarSrc = ref(resolveAvatar())
const userAvatar = computed(() => avatarSrc.value || DEFAULT_AVATAR)
function onAvatarError() {
  avatarSrc.value = DEFAULT_AVATAR
}

const activeTopTab = computed(() => route.path === '/copy-trade' ? 'Copy Trade' : 'Spot')
const topTabs = ['Spot', 'Copy Trade']

// ── Notification dropdown ─────────────────────────────────────
const NOTIF_TYPES = new Set(['deposit', 'withdrawal', 'transfer'])

const notifOpen    = ref(false)
const notifLoading = ref(false)
const notifUnread  = ref(0)
const notifList    = ref<Array<{ id: number; title: string; message: string; time: string; icon: string; iconClass: string; unread: boolean }>>([])

const notifTypeStyle: Record<string, { icon: string; iconClass: string }> = {
  deposit:    { icon: 'mdi:arrow-up-circle-outline',   iconClass: 'bg-orange-50 text-orange-400' },
  withdrawal: { icon: 'mdi:arrow-down-circle-outline', iconClass: 'bg-red-50 text-red-400' },
  transfer:   { icon: 'mdi:swap-horizontal',           iconClass: 'bg-blue-50 text-sky-500' },
}

function relativeTimeLayout(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1)  return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24)  return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
}

async function fetchNotifUnreadCount() {
  if (!auth.accessToken) return
  try {
    const api = makeNotificationsApi(auth.accessToken)
    const data = await api.list(50, 0)
    const txNotifs = (data.notifications ?? []).filter(n => NOTIF_TYPES.has(n.type))
    notifUnread.value = txNotifs.filter(n => n.is_read === 0).length
  } catch { /* silent */ }
}

async function toggleNotifDropdown() {
  if (notifOpen.value) {
    notifOpen.value = false
    return
  }
  notifOpen.value = true
  notifLoading.value = true
  notifList.value = []

  if (!auth.accessToken) {
    notifLoading.value = false
    return
  }

  try {
    const api = makeNotificationsApi(auth.accessToken)
    const data = await api.list(50, 0)
    const txNotifs = (data.notifications ?? [])
      .filter(n => NOTIF_TYPES.has(n.type))
      .slice(0, 5)

    notifList.value = txNotifs.map(n => {
      const style = notifTypeStyle[n.type] ?? { icon: 'mdi:bell-outline', iconClass: 'bg-gray-100 text-gray-500' }
      return {
        id:        n.id,
        title:     n.title,
        message:   n.message,
        time:      relativeTimeLayout(n.created_at),
        icon:      style.icon,
        iconClass: style.iconClass,
        unread:    n.is_read === 0,
      }
    })

    // Mark all as read when dropdown opens
    const hasUnread = txNotifs.some(n => n.is_read === 0)
    if (hasUnread) {
      notifList.value.forEach(n => { n.unread = false })
      notifUnread.value = 0
      api.markAllRead().catch(() => { /* best-effort */ })
    }
  } catch { /* silent */ } finally {
    notifLoading.value = false
  }
}

function onClickOutsideNotif(e: MouseEvent) {
  const target = e.target as HTMLElement
  if (!target.closest('[data-notif-zone]')) {
    notifOpen.value = false
  }
}

onMounted(() => {
  fetchNotifUnreadCount()
  document.addEventListener('click', onClickOutsideNotif, true)
  pollingTimer = setInterval(fetchNotifUnreadCount, 10_000)
})
onBeforeUnmount(() => {
  document.removeEventListener('click', onClickOutsideNotif, true)
  clearInterval(pollingTimer)
})

let pollingTimer: ReturnType<typeof setInterval>

// ── Search overlay ────────────────────────────────────────────
const searchOpen      = ref(false)
const searchQuery     = ref('')
const searchInputRef  = ref<HTMLInputElement | null>(null)
const cachedTraders   = ref<CopyTrader[]>([])
const cachedMerchants = ref<any[]>([])

// ── Static pages searchable from the navbar ───────────────────
const staticPages = [
  { title: 'Market',       desc: 'Live crypto prices',        icon: 'mdi:chart-bar',                 route: '/market',      keywords: ['market', 'price', 'chart'] },
  { title: 'Trade',        desc: 'Spot trading',              icon: 'mdi:swap-horizontal',            route: '/trade/btc',   keywords: ['trade', 'spot', 'buy', 'sell'] },
  { title: 'Futures',      desc: 'Futures & perpetual',       icon: 'mdi:chart-line',                route: '/futures',     keywords: ['futures', 'perpetual', 'leverage', 'long', 'short'] },
  { title: 'P2P Trading',  desc: 'Buy & sell with peers',     icon: 'mdi:account-group-outline',     route: '/p2p-trading', keywords: ['p2p', 'peer', 'merchant', 'buy', 'sell'] },
  { title: 'Copy Trade',   desc: 'Follow top traders',        icon: 'mdi:content-copy',              route: '/copy-trade',  keywords: ['copy', 'trader', 'follow', 'roi'] },
  { title: 'Staking',      desc: 'Earn passive income',       icon: 'mdi:bank-outline',              route: '/staking',     keywords: ['staking', 'earn', 'apr', 'flexible', 'locked'] },
  { title: 'Events',       desc: 'Upcoming events',           icon: 'mdi:calendar-star',             route: '/events',      keywords: ['events', 'event', 'calendar'] },
  { title: 'Campaigns',    desc: 'Promotions & bonuses',      icon: 'mdi:gift-outline',              route: '/campaigns',   keywords: ['campaigns', 'promo', 'bonus'] },
  { title: 'Learn & Earn', desc: 'Learn to earn rewards',     icon: 'mdi:school-outline',            route: '/learn-earn',  keywords: ['learn', 'earn', 'education', 'quiz'] },
  { title: 'News',         desc: 'Latest crypto news',        icon: 'mdi:newspaper-variant-outline', route: '/news',        keywords: ['news', 'article', 'latest'] },
  { title: 'Rewards',      desc: 'Your rewards center',       icon: 'mdi:trophy-outline',            route: '/rewards',     keywords: ['rewards', 'points', 'bonus'] },
  { title: 'Assets',       desc: 'Portfolio & balance',       icon: 'mdi:wallet-outline',            route: '/assets',      keywords: ['assets', 'wallet', 'balance', 'portfolio'] },
  { title: 'Help Center',  desc: 'Support & FAQs',            icon: 'mdi:help-circle-outline',       route: '/help-center', keywords: ['help', 'support', 'faq'] },
]

interface SearchItem {
  id: string
  category: string
  title: string
  subtitle: string
  icon: string
  iconIsUrl: boolean
  iconBg: string
  route: string
  priceInfo?: { price: string; change: string; isPositive: boolean }
  badge?: string
}

function getSearchTicker(binancePair: string): { price: string; change: string; isPositive: boolean } | null {
  const t = marketStore.tickerMap.get(binancePair)
  if (!t) return null
  return {
    price: t.price < 0.01
      ? '$' + t.price.toFixed(6)
      : '$' + t.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
    change: (t.change >= 0 ? '+' : '') + t.change.toFixed(2) + '%',
    isPositive: t.change >= 0,
  }
}

const searchGroups = computed(() => {
  const q = searchQuery.value.trim().toLowerCase()
  if (!q) return []

  const items: SearchItem[] = []

  // Coins
  marketStore.coins
    .filter(c => c.symbol.toLowerCase().includes(q) || c.name.toLowerCase().includes(q))
    .slice(0, 5)
    .forEach(c => items.push({
      id: `coin-${c.symbol}`,
      category: 'Coins',
      title: c.symbol,
      subtitle: c.name,
      icon: c.icon,
      iconIsUrl: c.icon.startsWith('http'),
      iconBg: coinIconClass(c.symbol),
      route: `/trade/${c.symbol.toLowerCase()}`,
      priceInfo: getSearchTicker(c.binancePair) ?? undefined,
    }))

  // Copy Traders
  cachedTraders.value
    .filter(t =>
      t.name.toLowerCase().includes(q) ||
      t.username.toLowerCase().includes(q) ||
      (t.tag ?? '').toLowerCase().includes(q)
    )
    .slice(0, 4)
    .forEach(t => items.push({
      id: `trader-${t.id}`,
      category: 'Copy Trader',
      title: t.name,
      subtitle: `@${t.username}${t.tag ? ' · ' + t.tag : ''} · ${t.copiers.toLocaleString()} copiers`,
      icon: t.avatar ? cdnUrl(t.avatar) : 'mdi:account-circle',
      iconIsUrl: !!t.avatar,
      iconBg: 'bg-violet-100 text-violet-500',
      route: `/copy-trader/${t.username}`,
      badge: `+${t.roi}% ROI`,
    }))

  // P2P Merchants
  cachedMerchants.value
    .filter(m =>
      (m.name || '').toLowerCase().includes(q) ||
      (m.asset ?? '').toLowerCase().includes(q)
    )
    .slice(0, 3)
    .forEach(m => items.push({
      id: `p2p-${m.id ?? m.name}`,
      category: 'P2P',
      title: m.name || 'Merchant',
      subtitle: `${m.type === 'buy' ? 'Buy' : 'Sell'} ${m.asset ?? 'USDT'} · ${Number(m.completion_rate ?? 0).toFixed(1)}% completion`,
      icon: m.avatar || 'mdi:account-circle-outline',
      iconIsUrl: !!(m.avatar && (m.avatar.startsWith('http') || m.avatar.startsWith('/'))),
      iconBg: 'bg-blue-100 text-blue-500',
      route: '/p2p-trading',
    }))

  // Pages
  staticPages
    .filter(p =>
      p.title.toLowerCase().includes(q) ||
      p.keywords.some(k => k.includes(q))
    )
    .slice(0, 4)
    .forEach(p => items.push({
      id: `page-${p.route}`,
      category: 'Pages',
      title: p.title,
      subtitle: p.desc,
      icon: p.icon,
      iconIsUrl: false,
      iconBg: 'bg-gray-100 text-gray-500',
      route: p.route,
    }))

  // Group by category preserving insertion order
  const groupMap = new Map<string, SearchItem[]>()
  for (const item of items) {
    if (!groupMap.has(item.category)) groupMap.set(item.category, [])
    groupMap.get(item.category)!.push(item)
  }
  return Array.from(groupMap.entries()).map(([label, groupItems]) => ({ label, items: groupItems }))
})

function onSearchResultClick(item: SearchItem) {
  closeSearch()
  router.push(item.route)
}

async function fetchSearchTraders() {
  if (!auth.accessToken) return
  try {
    const { traders } = await makeContentApi(auth.accessToken).getCopyTraders(50)
    cachedTraders.value = traders
  } catch { /* ignore */ }
}

async function fetchSearchMerchants() {
  try {
    const { merchants } = await p2pApi.getMerchants()
    cachedMerchants.value = merchants
  } catch { /* ignore */ }
}

async function openSearch() {
  searchOpen.value = true
  marketStore.fetchCoins()
  if (!cachedTraders.value.length)   fetchSearchTraders()
  if (!cachedMerchants.value.length) fetchSearchMerchants()
  await nextTick()
  searchInputRef.value?.focus()
}

function closeSearch() {
  searchOpen.value = false
  searchQuery.value = ''
}

interface BottomMenu {
  name: string
  icon: string
  route: string
  center?: boolean
}

const bottomMenus: BottomMenu[] = [
  { name: 'Home', icon: 'mdi:home-outline', route: '/dashboard' },
  { name: 'Market', icon: 'mdi:chart-bar', route: '/market' },
  { name: 'Trade', icon: 'mdi:swap-horizontal', route: '/trade', center: true },
  { name: 'Futures', icon: 'mdi:file-document-outline', route: '/futures' },
  { name: 'Assets', icon: 'mdi:wallet-outline', route: '/assets' },
]
</script>
