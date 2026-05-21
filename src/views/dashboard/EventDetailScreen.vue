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
        <h1 class="text-[16px] font-semibold text-[#17212f]">Event Details</h1>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="flex items-center justify-center py-20">
        <Icon icon="mdi:loading" class="animate-spin text-3xl text-[#0ba99d]" />
      </div>

      <!-- Not found -->
      <div v-else-if="!event" class="flex flex-col items-center justify-center gap-3 py-20 text-gray-400">
        <Icon icon="mdi:calendar-question-outline" class="text-5xl" />
        <p class="text-sm font-semibold">Event not found</p>
      </div>

      <!-- Event Detail -->
      <template v-else>
        <!-- Banner -->
        <section class="relative">
          <div class="relative h-52 w-full overflow-hidden md:h-72">
            <img
              :src="event.banner_url || '/images/event-banner.webp'"
              :alt="event.title"
              class="h-full w-full object-cover"
            />
            <div class="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent"></div>
            <div class="absolute bottom-0 left-0 right-0 px-4 pb-4">
              <div class="flex items-center gap-2">
                <span
                  class="rounded-full px-2.5 py-0.5 text-[9px] font-semibold"
                  :class="statusBadgeClass"
                >
                  {{ event.status }}
                </span>
                <span
                  class="rounded-full bg-white/20 px-2.5 py-0.5 text-[9px] font-semibold text-white backdrop-blur-sm"
                >
                  {{ event.type }}
                </span>
              </div>
              <h1 class="mt-2 text-xl font-bold text-white drop-shadow-sm">{{ event.title }}</h1>
            </div>
          </div>
        </section>

        <!-- Info Cards -->
        <section class="mx-3 -mt-5 space-y-3">
          <!-- Date & Participants -->
          <div class="rounded-2xl bg-white p-4 shadow-sm border border-gray-100">
            <div class="grid grid-cols-2 gap-4">
              <div>
                <p class="text-[9px] font-bold text-gray-400">Start Date</p>
                <p class="mt-1 text-[13px] font-semibold text-[#17212f]">{{ fmt(event.start_date) }}</p>
              </div>
              <div>
                <p class="text-[9px] font-bold text-gray-400">End Date</p>
                <p class="mt-1 text-[13px] font-semibold text-[#17212f]">{{ fmt(event.end_date) }}</p>
              </div>
              <div>
                <p class="text-[9px] font-bold text-gray-400">Participants</p>
                <p class="mt-1 text-[13px] font-semibold text-[#17212f]">
                  {{ event.participants }}
                  <span v-if="event.max_participants" class="text-gray-400">/ {{ event.max_participants }}</span>
                </p>
              </div>
              <div>
                <p class="text-[9px] font-bold text-gray-400">Prize Pool</p>
                <p class="mt-1 text-[13px] font-semibold text-[#0ba99d]">
                  {{ event.prize_pool ? Number(event.prize_pool).toLocaleString() : '—' }} USDT
                </p>
              </div>
            </div>
          </div>

          <!-- Description -->
          <div v-if="event.description" class="rounded-2xl bg-white p-4 shadow-sm border border-gray-100">
            <h2 class="text-[11px] font-bold uppercase tracking-wider text-gray-400">Description</h2>
            <p class="mt-2 text-[13px] leading-relaxed text-[#17212f]">{{ event.description }}</p>
          </div>

          <!-- Article Content (HTML) -->
          <div v-if="event.content" class="rounded-2xl bg-white p-4 shadow-sm border border-gray-100">
            <h2 class="text-[11px] font-bold uppercase tracking-wider text-gray-400">Article</h2>
            <div class="mt-2 prose prose-sm max-w-none text-[13px] leading-relaxed text-[#17212f]"
                 v-html="event.content">
            </div>
          </div>

        </section>
      </template>
    </div>
  </DashboardLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { Icon } from '@iconify/vue'
import { useRoute, useRouter } from 'vue-router'
import DashboardLayout from '@/layouts/DashboardLayout.vue'
import { makeContentApi, type ApiEvent } from '@/services/api'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()

const loading = ref(true)
const event = ref<ApiEvent | null>(null)

const statusBadgeClass = computed(() => {
  if (!event.value) return ''
  const s = event.value.status
  if (s === 'ongoing')  return 'bg-emerald-500/80 text-white'
  if (s === 'upcoming') return 'bg-cyan-500/80 text-white'
  return 'bg-slate-500/80 text-white'
})

function fmt(d: string) {
  return new Date(d).toLocaleDateString('en-US', {
    weekday: 'short', month: 'short', day: 'numeric', year: 'numeric',
  })
}

onMounted(async () => {
  const id = Number(route.params.id)
  if (!id) { loading.value = false; return }
  try {
    const api = makeContentApi(auth.accessToken!)
    const data = await api.getEventById(id)
    event.value = data.event
  } catch {
    event.value = null
  } finally {
    loading.value = false
  }
})
</script>