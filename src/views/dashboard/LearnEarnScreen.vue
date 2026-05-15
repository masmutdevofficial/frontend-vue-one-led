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
        <h1 class="text-[16px] font-semibold text-[#17212f]">Learn & Earn</h1>
      </div>

      <div class="mx-auto px-4 py-4 pb-8">
        <!-- HERO -->
        <section
          class="relative overflow-hidden rounded-2xl border border-gray-100 bg-[#f8fffe] p-5 shadow-sm"
        >
          <div
            class="absolute right-0 top-0 h-full w-[62%] bg-linear-to-l from-cyan-100/80 via-cyan-50/60 to-transparent"
          ></div>

          <div class="relative z-10 flex min-h-45 items-center justify-between">
            <div class="w-[46%]">
              <h1 class="text-[28px] font-semibold leading-tight text-[#0b1638]">
                Learn crypto. Earn rewards.
              </h1>

              <p class="mt-4 text-sm font-medium leading-relaxed text-[#5b6d9a]">
                Build your knowledge and earn USDT rewards.
              </p>

              <button
                class="mt-6 flex h-10 items-center gap-2 rounded-xl border border-[#20c7b7] bg-white px-4 text-[13px] font-semibold text-[#20c7b7] active:scale-95"
              >
                How It Works
                <Icon icon="mdi:arrow-right" class="text-[17px]" />
              </button>
            </div>

            <img src="/images/learn-banner.webp" alt="Learn & Earn" class="h-38.75 w-46.25 object-contain" />
          </div>
        </section>

        <!-- TABS -->
        <section class="mt-5">
          <div class="grid h-13 grid-cols-2 rounded-2xl border border-gray-100 bg-white shadow-sm">
            <button
              v-for="tab in tabs"
              :key="tab"
              @click="activeTab = tab"
              class="relative text-sm font-semibold"
              :class="activeTab === tab ? 'text-[#20c7b7]' : 'text-[#5b6d9a]'"
            >
              {{ tab }}
              <span
                v-if="activeTab === tab"
                class="absolute bottom-0 left-1/2 h-0.75 w-22.5 -translate-x-1/2 rounded-full bg-[#20c7b7]"
              ></span>
            </button>
          </div>
        </section>

        <!-- COURSE LIST -->
        <section class="mt-5 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
          <button
            v-for="item in filteredCourses"
            :key="item.title"
            class="flex w-full items-center justify-between border-b border-gray-100 px-4 py-5 text-left last:border-b-0 active:bg-gray-50"
          >
            <div class="flex items-center gap-5">
              <img :src="item.img" :alt="item.title" class="h-17.5 w-17.5 shrink-0 rounded-xl object-cover" />

              <div>
                <h3 class="text-[17px] font-semibold text-[#0b1638]">
                  {{ item.title }}
                </h3>

                <p class="mt-2 text-xl font-semibold text-[#20c7b7]">
                  {{ item.reward }}
                </p>
              </div>
            </div>

            <div class="flex items-center gap-3">
              <span class="flex items-center gap-2 text-sm font-semibold text-[#7a86a4]">
                <Icon :icon="item.statusIcon" class="text-[19px]" />
                {{ item.status }}
              </span>

              <Icon icon="mdi:chevron-right" class="text-[27px] text-[#7a86a4]" />
            </div>
          </button>

          <!-- Empty state -->
          <div v-if="filteredCourses.length === 0" class="flex flex-col items-center py-12 text-gray-400">
            <Icon icon="mdi:book-open-outline" class="text-5xl" />
            <p class="mt-3 text-xs font-semibold">No completed courses yet</p>
          </div>
        </section>

        <!-- VIEW ALL -->
        <button
          class="mt-5 flex h-13.5 w-full items-center justify-between rounded-2xl border border-gray-100 bg-white px-5 text-base font-semibold text-[#20c7b7] shadow-sm active:scale-[0.99]"
        >
          View All Courses
          <Icon icon="mdi:arrow-right" class="text-[27px]" />
        </button>

        <!-- INFO -->
        <div class="mt-5 flex items-start gap-3 px-3">
          <Icon icon="mdi:information-outline" class="text-[22px] text-[#7a86a4]" />
          <p class="text-[13px] font-medium leading-relaxed text-[#7a86a4]">
            Complete quizzes to earn rewards directly to your account.
          </p>
        </div>
      </div>
    </div>
  </DashboardLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { Icon } from '@iconify/vue'
import { useRouter } from 'vue-router'
import DashboardLayout from '@/layouts/DashboardLayout.vue'
import { makeContentApi } from '@/services/api'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const auth = useAuthStore()

const tabs = ['All Courses', 'Completed'] as const
type Tab = typeof tabs[number]
const activeTab = ref<Tab>('All Courses')

interface Course {
  title: string
  reward: string
  icon: string
  img: string
  status: string
  statusIcon: string
  completed: boolean
}

function difficultyIcon(diff: string): string {
  const map: Record<string, string> = {
    beginner:     'mdi:cube-outline',
    intermediate: 'mdi:chart-line',
    advanced:     'mdi:lightning-bolt',
  }
  return map[diff?.toLowerCase() ?? ''] ?? 'mdi:school-outline'
}

const imgFallbacks = ['/images/learn-1.webp', '/images/learn-2.webp', '/images/learn-3.webp', '/images/learn-4.webp']

// ── Defaults ──────────────────────────────────────────────────────────────────
const defaultCourses: Course[] = [
  { title: 'What is Blockchain?',              reward: '+2.00 USDT', icon: 'mdi:cube-outline', img: '/images/learn-1.webp', status: 'Claimed',  statusIcon: 'mdi:check-circle-outline', completed: true },
  { title: 'What is Bitcoin?',                 reward: '+2.00 USDT', icon: 'mdi:bitcoin',      img: '/images/learn-2.webp', status: 'Claimed',  statusIcon: 'mdi:check-circle-outline', completed: true },
  { title: 'What are Altcoins?',               reward: '+2.00 USDT', icon: 'mdi:ethereum',     img: '/images/learn-3.webp', status: 'Claimed',  statusIcon: 'mdi:check-circle-outline', completed: true },
  { title: 'What is collective copy trade?',   reward: '+3.00 USDT', icon: 'mdi:chart-line',   img: '/images/learn-4.webp', status: '8 min',    statusIcon: 'mdi:clock-outline',        completed: false },
]

const courses = ref<Course[]>(defaultCourses)

onMounted(async () => {
  if (!auth.accessToken) return
  try {
    const api = makeContentApi(auth.accessToken)
    const data = await api.getLearnCourses()
    if (data.courses.length > 0) {
      courses.value = data.courses.map((c, i) => ({
        title:      c.title,
        reward:     `+${Number(c.reward_usdt).toFixed(2)} USDT`,
        icon:       difficultyIcon(c.difficulty),
        img:        c.thumbnail_url ?? imgFallbacks[i % imgFallbacks.length],
        status:     `${c.duration_min} min`,
        statusIcon: 'mdi:clock-outline',
        completed:  false,
      }))
    }
  } catch { /* silently use defaults */ }
})

const filteredCourses = computed(() =>
  activeTab.value === 'Completed' ? courses.value.filter(c => c.completed) : courses.value,
)
</script>
