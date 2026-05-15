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
              placeholder="Search coins, pairs…"
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
          <Icon icon="mdi:view-grid-outline" class="text-[27px] text-[#30343b]" />
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

          <button class="relative active:scale-95 transition" @click="router.push('/notifications')">
            <Icon icon="mdi:bell-outline" class="text-[27px] text-[#20242a]" />
            <!-- Notification dot with pulse -->
            <span class="absolute top-[1px] right-[1px] flex h-[9px] w-[9px]">
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
import { ref, computed, nextTick } from 'vue'
import { Icon } from '@iconify/vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { cdnUrl } from '@/utils/cdn'

const router = useRouter()
const route = useRoute()
const auth = useAuthStore()

// ── User avatar ───────────────────────────────────────────────
const DEFAULT_AVATAR = cdnUrl('defaults/avatar.png')
const avatarSrc = ref(
  (auth.profile as Record<string, unknown> | null)?.photo_url
    ? cdnUrl(String((auth.profile as Record<string, unknown>).photo_url))
    : DEFAULT_AVATAR,
)
const userAvatar = computed(() => avatarSrc.value || DEFAULT_AVATAR)
function onAvatarError() {
  avatarSrc.value = DEFAULT_AVATAR
}

const activeTopTab = computed(() => route.path === '/copy-trade' ? 'Copy Trade' : 'Spot')
const topTabs = ['Spot', 'Copy Trade']

// ── Search overlay ────────────────────────────────────────────
const searchOpen = ref(false)
const searchQuery = ref('')
const searchInputRef = ref<HTMLInputElement | null>(null)

async function openSearch() {
  searchOpen.value = true
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
