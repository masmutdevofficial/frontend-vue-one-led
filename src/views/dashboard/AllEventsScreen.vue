<template>
  <DashboardLayout>
    <div class="min-h-screen bg-[#f6f8fb] pb-8">
      <!-- PAGE HEADER -->
      <div class="relative flex h-14 items-center justify-center border-b border-gray-100 bg-white px-4">
        <button
          @click="router.back()"
          class="absolute left-3 flex h-9 w-9 items-center justify-center rounded-xl bg-[#f6f8fb] active:scale-95"
        >
          <Icon icon="mdi:arrow-left" class="text-[24px] text-[#243142]" />
        </button>
        <h1 class="text-[16px] font-semibold text-[#17212f]">All Events</h1>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="flex items-center justify-center py-20">
        <Icon icon="mdi:loading" class="animate-spin text-3xl text-[#0ba99d]" />
      </div>

      <!-- Event List -->
      <section v-else class="px-3 pt-4">
        <div class="space-y-3">
          <article
            v-for="item in events"
            :key="item.id"
            class="flex gap-3 rounded-2xl border border-gray-100 bg-white p-3 shadow-sm"
          >
            <!-- Image -->
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

            <!-- Info -->
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

            <!-- Action -->
            <div class="flex items-center">
              <button
                class="h-9 min-w-19.5 rounded-xl border border-[#0ba99d] bg-white px-3 text-[10px] font-semibold text-[#0ba99d] active:scale-95"
                @click="router.push(`/events/${item.id}`)"
              >
                View Details
              </button>
            </div>
          </article>

          <!-- Empty -->
          <div v-if="events.length === 0" class="flex flex-col items-center gap-2 py-16 text-gray-400">
            <Icon icon="mdi:calendar-blank-outline" class="text-5xl" />
            <p class="text-sm font-semibold">No events available</p>
          </div>
        </div>
      </section>
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

interface EventItem {
  id: number
  badge: string | null
  image: string
  date: string
  title: string
  reward: string
  desc: string
}

const loading = ref(true)
const events = ref<EventItem[]>([])

function formatDateRange(start: string, end: string): string {
  const fmt = (s: string) => new Date(s).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  return `${fmt(start)} - ${fmt(end)}`
}

onMounted(async () => {
  try {
    const api = makeContentApi(auth.accessToken!)
    const data = await api.getEvents(100)
    events.value = data.events.map((e) => ({
      id:     e.id,
      badge:  e.status === 'ongoing' ? 'HOT' : null,
      image:  e.banner_url ?? '/images/event-banner.webp',
      date:   formatDateRange(e.start_date, e.end_date),
      title:  e.title,
      reward: e.prize_pool ? Number(e.prize_pool).toLocaleString() : '0',
      desc:   e.description ?? '',
    }))
  } catch {
    events.value = []
  } finally {
    loading.value = false
  }
})
</script>