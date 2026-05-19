<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { Icon } from '@iconify/vue'
import { useRouter } from 'vue-router'
import DashboardLayout from '../../layouts/DashboardLayout.vue'
import { makeNotificationsApi } from '@/services/api'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const auth = useAuthStore()

// ── Only transaction-related notification types ──────────────────────────────
const ALLOWED_TYPES = new Set(['deposit', 'withdrawal', 'transfer'])

// ── Icon mapping by notification type ────────────────────────────────────────
interface NotifStyle { icon: string; iconClass: string }
const typeStyle: Record<string, NotifStyle> = {
  deposit:    { icon: 'mdi:arrow-up-circle-outline',    iconClass: 'bg-orange-50 text-orange-400' },
  withdrawal: { icon: 'mdi:arrow-down-circle-outline',  iconClass: 'bg-red-50 text-red-400' },
  transfer:   { icon: 'mdi:swap-horizontal',            iconClass: 'bg-blue-50 text-sky-500' },
}
const DEFAULT_STYLE: NotifStyle = { icon: 'mdi:bell-outline', iconClass: 'bg-gray-50 text-gray-400' }
function getStyle(type: string): NotifStyle {
  return typeStyle[type] ?? DEFAULT_STYLE
}

function relativeTime(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1)  return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24)  return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
}

// ── State ──────────────────────────────────────────────────────────────────────
interface Notification {
  id: number
  title: string
  message: string
  time: string
  icon: string
  iconClass: string
  unread: boolean
}

const loading = ref(false)

// ── Hardcoded defaults ────────────────────────────────────────────────────────
const defaultNotifications: Notification[] = [
  { id: 0, title: 'Deposit Successful',  message: 'Your deposit of 100 USDT via TRC20 has been confirmed.',        time: '3h ago',  icon: 'mdi:arrow-up-circle-outline',   iconClass: 'bg-orange-50 text-orange-400', unread: true  },
  { id: 0, title: 'Withdrawal Sent',     message: 'Your withdrawal of 50 USDT has been processed successfully.',  time: '5h ago',  icon: 'mdi:arrow-down-circle-outline', iconClass: 'bg-red-50 text-red-400',       unread: true  },
  { id: 0, title: 'Transfer Complete',   message: 'You transferred 200 USDT to your Spot wallet successfully.',    time: '1d ago',  icon: 'mdi:swap-horizontal',           iconClass: 'bg-blue-50 text-sky-500',      unread: false },
]

const notifications = ref<Notification[]>(defaultNotifications)
const unreadCount   = ref(defaultNotifications.filter(n => n.unread).length)

const activeTab = ref('All')
const tabs = computed(() => [
  { name: 'All',    badge: null },
  { name: 'Unread', badge: unreadCount.value > 0 ? unreadCount.value : null },
])

// ── Fetch from backend ────────────────────────────────────────────────────────
onMounted(async () => {
  if (!auth.accessToken) return
  loading.value = true
  try {
    const api = makeNotificationsApi(auth.accessToken)
    const data = await api.list()
    const txNotifs = data.notifications.filter(n => ALLOWED_TYPES.has(n.type))
    notifications.value = txNotifs.map(n => ({
      id:        n.id,
      title:     n.title,
      message:   n.message,
      time:      relativeTime(n.created_at),
      icon:      getStyle(n.type).icon,
      iconClass: getStyle(n.type).iconClass,
      unread:    n.is_read === 0,
    }))
    unreadCount.value = txNotifs.filter(n => n.is_read === 0).length
  } catch { /* silently use defaults */ } finally {
    loading.value = false
  }
})

// ── Interactions ─────────────────────────────────────────────────────────────
async function markRead(item: Notification) {
  if (!item.unread || item.id === 0) return
  item.unread = false
  unreadCount.value = Math.max(0, unreadCount.value - 1)
  if (!auth.accessToken) return
  try {
    await makeNotificationsApi(auth.accessToken).markRead(item.id)
  } catch { /* best-effort */ }
}

async function markAllRead() {
  const hadUnread = notifications.value.some(n => n.unread)
  if (!hadUnread) return
  notifications.value.forEach(n => { n.unread = false })
  unreadCount.value = 0
  if (!auth.accessToken) return
  try {
    await makeNotificationsApi(auth.accessToken).markAllRead()
  } catch { /* best-effort */ }
}

const filteredNotifications = computed(() =>
  activeTab.value === 'Unread'
    ? notifications.value.filter(n => n.unread)
    : notifications.value,
)
</script>

<template>
  <DashboardLayout>
    <div class="min-h-screen bg-white text-[#0b1638]">
      <div class="mx-auto min-h-screen bg-white pb-20">

        <!-- PAGE HEADER -->
        <div class="relative flex h-14 items-center justify-center border-b border-gray-100 bg-white px-4">
          <button
            @click="router.back()"
            class="absolute left-4 flex h-9 w-9 items-center justify-center rounded-xl bg-[#f6f8fb] active:scale-95"
          >
            <Icon icon="mdi:chevron-left" class="text-[25px] text-[#1f2937]" />
          </button>
          <h1 class="text-[16px] font-semibold text-[#17212f]">Notifications</h1>
          <button
            v-if="unreadCount > 0"
            @click="markAllRead"
            class="absolute right-4 text-[12px] font-semibold text-[#08a99f] active:opacity-60"
          >Mark all read</button>
        </div>

        <!-- TABS -->
        <section class="sticky top-0 z-40 border-b border-gray-100 bg-white">
          <div class="grid h-16 grid-cols-2">
            <button
              v-for="tab in tabs"
              :key="tab.name"
              @click="activeTab = tab.name"
              class="relative flex items-center justify-center gap-2 text-sm font-semibold"
              :class="activeTab === tab.name ? 'text-[#08a99f]' : 'text-[#4b5575]'"
            >
              {{ tab.name }}

              <span
                v-if="tab.badge"
                class="flex h-6 w-6 items-center justify-center rounded-full bg-[#08a99f] text-xs font-semibold text-white"
              >
                {{ tab.badge }}
              </span>

              <span
                v-if="activeTab === tab.name"
                class="absolute bottom-0 left-1/2 h-0.75 w-19.5 -translate-x-1/2 rounded-full bg-[#08a99f]"
              ></span>
            </button>
          </div>
        </section>

        <!-- LIST -->
        <section>
          <!-- Loading skeleton -->
          <div v-if="loading" class="flex flex-col gap-px">
            <div v-for="i in 4" :key="i" class="flex gap-4 border-b border-gray-100 px-5 py-6">
              <div class="h-14 w-14 shrink-0 animate-pulse rounded-full bg-gray-100"></div>
              <div class="flex-1 space-y-2 pt-1">
                <div class="h-4 w-2/3 animate-pulse rounded bg-gray-100"></div>
                <div class="h-3 w-full animate-pulse rounded bg-gray-100"></div>
              </div>
            </div>
          </div>

          <article
            v-if="!loading"
            v-for="item in filteredNotifications"
            :key="item.id + item.title"
            @click="markRead(item)"
            class="flex gap-4 border-b border-gray-100 px-5 py-6 transition-colors"
            :class="item.unread ? 'bg-[#f6fffe]' : ''"
          >
            <div
              class="flex h-14.5 w-14.5 shrink-0 items-center justify-center rounded-full"
              :class="item.iconClass"
            >
              <Icon :icon="item.icon" class="text-[31px]" />
            </div>

              <div class="min-w-0 flex-1">
              <div class="flex items-start justify-between gap-4">
                <h2 class="text-[17px] font-semibold text-[#0b1638]">
                  {{ item.title }}
                </h2>
                <div class="flex shrink-0 flex-col items-end gap-1">
                  <span class="text-[13px] font-medium text-[#5b6d9a]">{{ item.time }}</span>
                  <span v-if="item.unread" class="h-2 w-2 rounded-full bg-[#08a99f]"></span>
                </div>
              </div>

              <p class="mt-2 text-sm font-medium leading-relaxed text-[#4b5575]">
                {{ item.message }}
              </p>
            </div>
          </article>

          <!-- Empty state -->
          <div v-if="filteredNotifications.length === 0" class="flex flex-col items-center py-16 text-gray-400">
            <Icon icon="mdi:bell-off-outline" class="text-5xl" />
            <p class="mt-3 text-xs font-semibold">No unread notifications</p>
          </div>
        </section>

        <!-- BOTTOM SETTINGS -->
        <section class="border-t border-gray-100 bg-white">
          <button
            @click="router.push('/notification-settings')"
            class="flex h-16 w-full items-center gap-4 px-5 text-left active:bg-gray-50"
          >
            <Icon icon="mdi:bell-outline" class="text-[26px] text-[#0b1638]" />
            <span class="text-sm font-medium text-[#4b5575]">
              Manage your notification preferences
            </span>
          </button>
        </section>

      </div>
    </div>
  </DashboardLayout>
</template>
