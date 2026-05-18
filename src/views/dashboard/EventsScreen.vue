<template>
  <DashboardLayout>
    <div class="mx-auto min-h-screen bg-[#f6f8fb] pb-8">

      <!-- PAGE HEADER -->
      <div class="relative flex h-14 items-center justify-center border-b border-gray-100 bg-white px-4">
        <button
          @click="router.back()"
          class="absolute left-3 flex h-9 w-9 items-center justify-center rounded-xl bg-[#f6f8fb] active:scale-95"
        >
          <Icon icon="mdi:arrow-left" class="text-[24px] text-[#243142]" />
        </button>
        <h1 class="text-[16px] font-semibold text-[#17212f]">Events</h1>
      </div>

      <!-- HERO -->
      <section class="px-3 pt-3">
        <div class="relative overflow-hidden rounded-2xl border border-gray-100 bg-white px-4 py-4 shadow-sm">
          <div class="absolute right-0 top-0 h-full w-[58%] bg-linear-to-l from-cyan-100/80 via-cyan-50/60 to-transparent"></div>

          <div class="relative z-10 flex min-h-40 items-center justify-between">
            <!-- LEFT TEXT -->
            <div class="w-[48%]">
              <span class="inline-flex rounded bg-[#e9fffc] px-2 py-1 text-[8px] font-semibold uppercase tracking-wide text-[#0ba99d]">
                Featured Event
              </span>

              <h1 class="mt-3 text-[23px] font-semibold leading-[1.1] text-[#17212f]">
                Future Traders <br />
                Competition
              </h1>

              <p class="mt-3 text-[11px] font-bold text-gray-500">Trade. Compete. Win Big.</p>

              <p class="mt-4 text-[10px] font-bold text-gray-400">Total Prize Pool</p>
              <p class="mt-1 text-[15px] font-semibold text-[#0ba99d]">100,000 USDT</p>

              <button class="mt-4 flex h-9 items-center gap-1 rounded-xl border border-[#b8f4ef] bg-[#f5fffe] px-4 text-[11px] font-semibold text-[#0ba99d] active:scale-95">
                Join Now
                <Icon icon="mdi:arrow-right" class="text-[14px]" />
              </button>
            </div>

            <!-- RIGHT HERO IMAGE -->
            <div class="relative h-36.25 w-43.75 shrink-0 overflow-hidden rounded-2xl">
              <img
                src="/images/event-banner.webp"
                alt="Hero"
                class="h-full w-full object-cover"
              />
              <div class="absolute inset-0 bg-linear-to-l from-transparent to-white/20"></div>
            </div>
          </div>
        </div>
      </section>

      <!-- MENU SHORTCUT -->
      <section class="mt-3 px-3">
        <div class="grid grid-cols-4 rounded-2xl border border-gray-100 bg-white py-4 shadow-sm md:py-5">
          <button
            v-for="item in menuItems"
            :key="item.title"
            class="flex flex-col items-center justify-center gap-2 active:scale-95"
            @click="router.push(item.route)"
          >
            <Icon :icon="item.icon" class="text-[30px] text-[#0ba99d] md:text-[34px]" />
            <span class="text-[10px] font-semibold text-[#344054] md:text-[11px]">{{ item.title }}</span>
          </button>
        </div>
      </section>

      <!-- UPCOMING EVENTS -->
      <section class="mt-4 px-3">
        <div class="flex items-center justify-between">
          <h2 class="text-[14px] font-semibold text-[#17212f]">Upcoming Events</h2>
          <button class="flex items-center gap-1 text-[10px] font-semibold text-[#0ba99d]">
            View All
            <Icon icon="mdi:arrow-right" class="text-[13px]" />
          </button>
        </div>

        <div class="mt-3 space-y-3">
          <article
            v-for="item in events"
            :key="item.title"
            class="relative flex gap-3 rounded-2xl border border-gray-100 bg-white p-3 shadow-sm"
          >
            <!-- EVENT IMAGE -->
            <div class="relative h-22.5 w-27.5 shrink-0 overflow-hidden rounded-xl">
              <img
                :src="item.image"
                :alt="item.title"
                class="h-full w-full object-cover"
              />
              <span
                v-if="item.badge"
                class="absolute left-1 top-1 rounded bg-[#0ba99d] px-1.5 py-0.5 text-[7px] font-semibold text-white"
              >
                {{ item.badge }}
              </span>
            </div>

            <!-- CONTENT -->
            <div class="min-w-0 flex-1">
              <div class="flex items-center gap-1 text-[8px] font-bold text-gray-400">
                <Icon icon="mdi:calendar-blank-outline" class="text-[11px]" />
                {{ item.date }}
              </div>
              <h3 class="mt-1 text-[14px] font-semibold leading-tight text-[#17212f]">{{ item.title }}</h3>
              <p class="mt-2 text-[9px] font-bold text-gray-400">Reward Pool</p>
              <p class="text-[14px] font-semibold text-[#0ba99d]">{{ item.reward }} USDT</p>
              <p class="mt-1 line-clamp-2 text-[9px] font-semibold leading-snug text-gray-400">{{ item.desc }}</p>
            </div>

            <!-- ACTION -->
            <div class="flex items-center">
              <button
                class="h-9 min-w-19.5 rounded-xl px-3 text-[10px] font-semibold active:scale-95"
                :class="item.primary ? 'bg-[#08a99f] text-white' : 'border border-[#0ba99d] bg-white text-[#0ba99d]'"
                @click="openModal(item)"
              >
                {{ item.button }}
              </button>
            </div>
          </article>
        </div>
      </section>

      <!-- UPCOMING SCHEDULE -->
      <section class="mt-5 px-3">
        <div class="flex items-center justify-between">
          <h2 class="text-[14px] font-semibold text-[#17212f]">Upcoming Schedule</h2>
          <button class="flex items-center gap-1 text-[10px] font-semibold text-[#0ba99d]">
            View Calendar
            <Icon icon="mdi:arrow-right" class="text-[13px]" />
          </button>
        </div>

        <div class="mt-3 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
          <article
            v-for="item in schedules"
            :key="item.title"
            class="flex items-center gap-3 border-b border-gray-100 px-4 py-3 last:border-b-0"
          >
            <!-- DATE -->
            <div class="flex h-15.5 w-12.5 shrink-0 flex-col items-center justify-center rounded-xl bg-[#e9fffc]">
              <span class="text-[8px] font-semibold text-[#0ba99d]">{{ item.month }}</span>
              <span class="mt-1 text-[22px] font-semibold leading-none text-[#17212f]">{{ item.day }}</span>
            </div>

            <!-- DETAILS -->
            <div class="min-w-0 flex-1">
              <span class="inline-flex rounded-full bg-[#e9fffc] px-2 py-0.5 text-[8px] font-semibold text-[#0ba99d]">
                {{ item.type }}
              </span>
              <h3 class="mt-1 truncate text-[12px] font-semibold text-[#17212f]">{{ item.title }}</h3>
              <p class="mt-1 text-[9px] font-bold text-gray-400">{{ item.time }}</p>
            </div>

            <button class="flex h-8 items-center gap-1 rounded-lg border border-[#b8f4ef] bg-[#f5fffe] px-3 text-[9px] font-semibold text-[#0ba99d] active:scale-95">
              <Icon icon="mdi:bell-outline" class="text-[13px]" />
              Set Reminder
            </button>
          </article>
        </div>
      </section>
    </div>
  </DashboardLayout>

  <!-- EVENT DETAIL MODAL -->
  <Teleport to="body">
    <div v-if="showModal" class="fixed inset-0 z-50 flex items-end justify-center">
      <div class="absolute inset-0 bg-black/50" @click="showModal = false"></div>
      <div v-if="activeEvent" class="relative w-full max-w-107.5 overflow-hidden rounded-t-3xl bg-white pb-8">
        <!-- Image -->
        <div class="relative h-45 w-full overflow-hidden">
          <img :src="activeEvent.image" :alt="activeEvent.title" class="h-full w-full object-cover" />
          <div class="absolute inset-0 bg-linear-to-t from-black/60 to-transparent"></div>
          <button
            @click="showModal = false"
            class="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-black/40 text-white"
          >
            <Icon icon="mdi:close" class="text-lg" />
          </button>
          <span
            v-if="activeEvent.badge"
            class="absolute left-3 top-3 rounded bg-[#0ba99d] px-2 py-0.5 text-[7px] font-semibold text-white"
          >
            {{ activeEvent.badge }}
          </span>
        </div>

        <!-- Content -->
        <div class="px-5 pt-4">
          <div class="flex items-center gap-1 text-[9px] font-bold text-gray-400">
            <Icon icon="mdi:calendar-blank-outline" class="text-[11px]" />
            {{ activeEvent.date }}
          </div>
          <h2 class="mt-2 text-lg font-semibold text-[#17212f]">{{ activeEvent.title }}</h2>
          <p class="mt-3 text-xs leading-relaxed text-gray-500">{{ activeEvent.detail }}</p>

          <!-- Reward -->
          <div class="mt-4 flex items-center justify-between rounded-xl bg-[#e9fffc] px-4 py-3">
            <div>
              <p class="text-[9px] font-bold text-gray-400">Total Reward Pool</p>
              <p class="mt-0.5 text-lg font-semibold text-[#0ba99d]">{{ activeEvent.reward }} USDT</p>
            </div>
            <Icon icon="mdi:trophy-outline" class="text-4xl text-[#0ba99d]/40" />
          </div>

          <!-- CTA -->
          <button
            class="mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-2xl text-sm font-semibold active:scale-95"
            :class="activeEvent.primary ? 'bg-[#08a99f] text-white' : 'border border-[#0ba99d] bg-white text-[#0ba99d]'"
          >
            {{ activeEvent.button }}
            <Icon icon="mdi:arrow-right" class="text-base" />
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Icon } from '@iconify/vue'
import { useRouter } from 'vue-router'
import DashboardLayout from '@/layouts/DashboardLayout.vue'
import { makeContentApi } from '@/services/api'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const auth = useAuthStore()

interface MenuItem {
  title: string
  icon: string
  route: string
}

interface Event {
  badge: string | null
  image: string
  date: string
  title: string
  reward: string
  desc: string
  detail: string
  button: string
  primary: boolean
}

interface Schedule {
  month: string
  day: string
  type: string
  title: string
  time: string
}

const menuItems: MenuItem[] = [
  { title: 'Rewards',      icon: 'mdi:gift-outline',         route: '/rewards' },
  { title: 'AMA',          icon: 'mdi:microphone-outline',   route: '/ama' },
  { title: 'Campaigns',    icon: 'mdi:bullhorn-outline',     route: '/campaigns' },
  { title: 'Learn & Earn', icon: 'mdi:school-outline',       route: '/learn-earn' },
]

// ── Defaults ──────────────────────────────────────────────────────────────────
const defaultEvents: Event[] = [
  {
    badge: 'HOT',
    image: '/images/event-banner.webp',
    date: 'May 20 - Jun 03, 2025',
    title: 'Futures Trading Competition',
    reward: '50,000',
    desc: 'Compete in futures trading and climb the leaderboard!',
    detail: 'Trade futures, climb the leaderboard, and compete for a share of the prize pool. Show your trading skill and win big rewards.',
    button: 'Join Now',
    primary: true,
  },
  {
    badge: null,
    image: '/images/event-2.webp',
    date: 'May 15 - May 29, 2025',
    title: 'Deposit & Trade Challenge',
    reward: '20,000',
    desc: 'Deposit, trade, and win a share of the prize pool.',
    detail: 'Deposit funds, complete trading missions, and earn rewards based on your activity. The more you participate, the bigger your chance to win.',
    button: 'View Details',
    primary: false,
  },
  {
    badge: null,
    image: '/images/learn-banner.webp',
    date: 'May 10 - May 14, 2025',
    title: 'Learn & Earn Quiz',
    reward: '5,000',
    desc: 'Learn about crypto and earn rewards effortlessly.',
    detail: 'Learn basic crypto and trading knowledge, answer simple quizzes, and earn rewards.',
    button: 'Join Now',
    primary: true,
  },
]

const defaultSchedules: Schedule[] = [
  {
    month: 'MAY',
    day: '16',
    type: 'AMA',
    title: 'Trading Strategies with Top Traders',
    time: '08:00 PM - 09:00 PM UTC+0',
  },
  {
    month: 'MAY',
    day: '18',
    type: 'Campaign',
    title: 'Spot Trading Bonus Week',
    time: '10:00 AM - 11:00 AM UTC+0',
  },
]

function formatDateRange(start: string, end: string): string {
  const fmt = (s: string) => new Date(s).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  return `${fmt(start)} - ${fmt(end)}`
}

const events = ref<Event[]>(defaultEvents)
const schedules = ref<Schedule[]>(defaultSchedules)

onMounted(async () => {
  if (!auth.accessToken) return
  try {
    const api = makeContentApi(auth.accessToken)
    const data = await api.getEvents()
    if (data.events.length > 0) {
      events.value = data.events.map((e, i) => ({
        badge:   e.status === 'ongoing' ? 'HOT' : null,
        image:   e.banner_url ?? '/images/event-banner.webp',
        date:    formatDateRange(e.start_date, e.end_date),
        title:   e.title,
        reward:  e.prize_pool ? Number(e.prize_pool).toLocaleString() : '0',
        desc:    e.description ?? '',
        detail:  e.description ?? '',
        button:  e.status === 'ongoing' ? 'Join Now' : 'View Details',
        primary: i === 0 || e.status === 'ongoing',
      }))
      // Build schedule from events
      schedules.value = data.events.slice(0, 3).map(e => {
        const d = new Date(e.start_date)
        return {
          month: d.toLocaleDateString('en-US', { month: 'short' }).toUpperCase(),
          day:   String(d.getDate()),
          type:  e.type,
          title: e.title,
          time:  formatDateRange(e.start_date, e.end_date),
        }
      })
    }
  } catch { /* silently use defaults */ }
})

const showModal = ref(false)
const activeEvent = ref<Event | null>(null)

function openModal(event: Event) {
  activeEvent.value = event
  showModal.value = true
}
</script>
