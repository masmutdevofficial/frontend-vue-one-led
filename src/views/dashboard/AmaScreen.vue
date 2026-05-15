<template>
  <DashboardLayout>
    <div class="min-h-screen bg-[#f6f8fb] text-[#0b1638]">
      <!-- PAGE HEADER -->
      <div class="relative flex h-14 items-center justify-center border-b border-gray-100 bg-white px-4">
        <button
          @click="router.back()"
          class="absolute left-4 flex h-9 w-9 items-center justify-center rounded-xl bg-[#f6f8fb] active:scale-95"
        >
          <Icon icon="mdi:chevron-left" class="text-[25px] text-[#1f2937]" />
        </button>
        <h1 class="text-[16px] font-semibold text-[#17212f]">AMA Sessions</h1>
      </div>

      <div class="mx-auto px-4 py-4 pb-8">
        <!-- HERO -->
        <section
          class="relative overflow-hidden rounded-2xl border border-gray-100 bg-[#f8fffe] p-5 shadow-sm"
        >
          <div
            class="absolute right-0 top-0 h-full w-[62%] bg-linear-to-l from-cyan-100/80 via-cyan-50/60 to-transparent"
          ></div>

          <div class="relative z-10 flex min-h-46.25 items-center justify-between">
            <div class="w-[46%]">
              <h1 class="text-[27px] font-semibold leading-tight text-[#0b1638]">
                Ask. Learn. Connect.
              </h1>

              <p class="mt-5 text-sm font-medium leading-relaxed text-[#5b6d9a]">
                Join live AMA sessions with our experts.
              </p>
            </div>

            <img src="/images/ama.webp" alt="AMA" class="h-41.25 w-47.5 object-contain" />
          </div>
        </section>

        <!-- TITLE DIVIDER -->
        <section class="my-7 flex items-center justify-center gap-5">
          <div class="h-px flex-1 bg-[#20c7b7]/70"></div>
          <h2 class="relative text-base font-semibold text-[#20c7b7]">
            Upcoming
            <span
              class="absolute -bottom-4 left-1/2 h-0.75 w-18 -translate-x-1/2 rounded-full bg-[#20c7b7]"
            ></span>
          </h2>
          <div class="h-px flex-1 bg-[#20c7b7]/70"></div>
        </section>

        <!-- SESSIONS -->
        <section class="space-y-3">
          <article
            v-for="item in sessions"
            :key="item.title"
            class="flex items-center justify-between rounded-2xl border border-gray-100 bg-white px-4 py-4 shadow-sm"
          >
            <div class="flex items-center gap-4">
              <div class="relative">
                <img
                  :src="item.avatar"
                  :alt="item.title"
                  class="h-16 w-16 rounded-full object-cover"
                />
                <span
                  class="absolute bottom-0 right-0 flex h-7 w-7 items-center justify-center rounded-full bg-[#20c7b7] text-white"
                >
                  <Icon :icon="item.badgeIcon" class="text-[17px]" />
                </span>
              </div>

              <div>
                <h3 class="text-base font-semibold leading-snug text-[#0b1638]">
                  {{ item.title }}
                </h3>

                <p class="mt-3 flex items-center gap-2 text-sm font-medium text-[#7a86a4]">
                  <Icon icon="mdi:calendar-month-outline" class="text-[17px]" />
                  {{ item.date }}
                </p>

                <p class="mt-2 flex items-center gap-2 text-sm font-medium text-[#7a86a4]">
                  <Icon icon="mdi:clock-outline" class="text-[17px]" />
                  {{ item.time }}
                </p>
              </div>
            </div>

            <button
              class="h-11 rounded-xl border border-[#20c7b7] bg-white px-4 text-sm font-semibold text-[#20c7b7] active:scale-95"
            >
              Set Reminder
            </button>
          </article>
        </section>

        <!-- INFO -->
        <section
          class="mt-5 flex items-center gap-3 rounded-2xl border border-gray-100 bg-[#fbfffe] px-5 py-4"
        >
          <Icon icon="mdi:information-outline" class="text-2xl text-[#20c7b7]" />
          <p class="text-sm font-medium text-[#7a86a4]">
            Join the AMA live and get your questions answered.
          </p>
        </section>
      </div>
    </div>
  </DashboardLayout>
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

interface Session {
  title: string
  date: string
  time: string
  avatar: string
  badgeIcon: string
}

const avatarFallbacks = [
  'https://i.pravatar.cc/120?img=11', 'https://i.pravatar.cc/120?img=47',
  'https://i.pravatar.cc/120?img=12', 'https://i.pravatar.cc/120?img=32',
]

const defaultSessions: Session[] = [
  { title: 'Trading Strategies with Top Traders', date: 'December 16, 2026', time: '8:00 PM UTC+8', avatar: 'https://i.pravatar.cc/120?img=11', badgeIcon: 'mdi:star-outline' },
  { title: 'Risk Management in Futures Trading',  date: 'December 23, 2026', time: '8:00 PM UTC+8', avatar: 'https://i.pravatar.cc/120?img=47', badgeIcon: 'mdi:shield-check-outline' },
  { title: 'Market Outlook & Trends',             date: 'December 30, 2026', time: '8:00 PM UTC+8', avatar: 'https://i.pravatar.cc/120?img=12', badgeIcon: 'mdi:chart-line' },
  { title: 'Crypto Basics for New Users',         date: 'December 06, 2026', time: '8:00 PM UTC+8', avatar: 'https://i.pravatar.cc/120?img=32', badgeIcon: 'mdi:bitcoin' },
]

const sessions = ref<Session[]>(defaultSessions)

onMounted(async () => {
  if (!auth.accessToken) return
  try {
    const api = makeContentApi(auth.accessToken)
    const data = await api.getAmaSessions()
    if (data.sessions.length > 0) {
      sessions.value = data.sessions.map((s, i) => {
        const dt = s.scheduled_at ? new Date(s.scheduled_at) : null
        return {
          title:     s.title,
          date:      dt ? dt.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'TBA',
          time:      dt ? dt.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) + ' UTC' : 'TBA',
          avatar:    avatarFallbacks[i % avatarFallbacks.length],
          badgeIcon: s.is_live ? 'mdi:broadcast' : 'mdi:star-outline',
        }
      })
    }
  } catch { /* silently use defaults */ }
})
</script>
