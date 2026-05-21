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
        <h1 class="text-[16px] font-semibold text-[#17212f]">Learn &amp; Earn</h1>
      </div>

      <div class="mx-auto px-4 py-4 pb-8">
        <!-- HERO -->
        <section class="relative overflow-hidden rounded-2xl border border-gray-100 bg-[#f8fffe] p-5 shadow-sm">
          <div class="absolute right-0 top-0 h-full w-[62%] bg-linear-to-l from-cyan-100/80 via-cyan-50/60 to-transparent"></div>
          <div class="relative z-10 flex min-h-45 items-center justify-between">
            <div class="w-[46%]">
              <h1 class="text-[28px] font-semibold leading-tight text-[#0b1638]">Learn crypto. Earn rewards.</h1>
              <p class="mt-4 text-sm font-medium leading-relaxed text-[#5b6d9a]">Build your knowledge and earn USDT rewards.</p>
            </div>
            <img src="/images/learn-banner.webp" alt="Learn &amp; Earn" class="h-38.75 w-46.25 object-contain" />
          </div>
        </section>

        <!-- TABS -->
        <section class="mt-5">
          <div class="grid h-13 grid-cols-2 rounded-2xl border border-gray-100 bg-white shadow-sm">
            <button v-for="tab in tabs" :key="tab" @click="activeTab = tab"
              class="relative text-sm font-semibold"
              :class="activeTab === tab ? 'text-[#20c7b7]' : 'text-[#5b6d9a]'">
              {{ tab }}
              <span v-if="activeTab === tab" class="absolute bottom-0 left-1/2 h-0.75 w-22.5 -translate-x-1/2 rounded-full bg-[#20c7b7]"></span>
            </button>
          </div>
        </section>

        <!-- Loading -->
        <div v-if="loading" class="flex items-center justify-center py-20">
          <Icon icon="mdi:loading" class="animate-spin text-3xl text-[#20c7b7]" />
        </div>

        <!-- COURSE LIST -->
        <template v-else>
        <section class="mt-5 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
          <button v-for="item in filteredCourses" :key="item.id"
            @click="openQuiz(item)"
            class="flex w-full items-center justify-between border-b border-gray-100 px-4 py-5 text-left last:border-b-0 active:bg-gray-50">
            <div class="flex items-center gap-5">
              <img :src="item.img" :alt="item.title" class="h-17.5 w-17.5 shrink-0 rounded-xl object-cover" />
              <div>
                <h3 class="text-[17px] font-semibold text-[#0b1638]">{{ item.title }}</h3>
                <p class="mt-2 text-xl font-semibold text-[#20c7b7]">{{ item.reward }}</p>
              </div>
            </div>
            <div class="flex items-center gap-3">
              <span class="flex items-center gap-2 text-sm font-semibold" :class="item.completed ? 'text-emerald-500' : 'text-[#7a86a4]'">
                <Icon :icon="item.statusIcon" class="text-[19px]" />
                {{ item.statusLabel }}
              </span>
              <Icon icon="mdi:chevron-right" class="text-[27px] text-[#7a86a4]" />
            </div>
          </button>
          <!-- Empty state -->
          <div v-if="filteredCourses.length === 0" class="flex flex-col items-center py-12 text-gray-400">
            <Icon icon="mdi:book-open-outline" class="text-5xl" />
            <p class="mt-3 text-xs font-semibold">{{ activeTab === 'Completed' ? 'No completed courses yet' : 'No courses available' }}</p>
          </div>
        </section>
        </template>
      </div>
    </div>

    <!-- ── QUIZ WIZARD MODAL ───────────────────────────────────────────────── -->
    <Teleport to="body">
      <Transition enter-from-class="opacity-0" enter-active-class="transition-opacity duration-300" leave-to-class="opacity-0" leave-active-class="transition-opacity duration-300">
        <div v-if="quizActive" class="fixed inset-0 z-50 bg-black/50" @click="closeQuiz"></div>
      </Transition>
      <Transition enter-from-class="translate-y-full" enter-active-class="transition-transform duration-300" leave-to-class="translate-y-full" leave-active-class="transition-transform duration-300">
        <div v-if="quizActive" class="fixed inset-x-0 bottom-0 z-50 mx-auto max-w-107.5 rounded-t-3xl bg-white shadow-2xl" style="max-height: 90dvh; overflow-y: auto;">
          <!-- Loading quiz -->
          <div v-if="quizLoading" class="flex items-center justify-center py-20">
            <Icon icon="mdi:loading" class="animate-spin text-3xl text-[#20c7b7]" />
          </div>
          <!-- Step 1 — Quiz questions -->
          <template v-else-if="quizStep === 'questions' && quizData.length">
            <div class="flex items-center justify-between border-b border-gray-100 px-5 py-4">
              <h3 class="text-[15px] font-semibold text-[#17212f]">{{ quizCourse?.title }}</h3>
              <button @click="closeQuiz"><Icon icon="mdi:close" class="text-[22px] text-gray-400" /></button>
            </div>
            <div class="px-5 pb-8 pt-4 space-y-6">
              <div v-for="(q, qi) in quizData" :key="qi">
                <p class="text-[13px] font-semibold text-[#17212f]">Q{{ qi + 1 }}. {{ q.question }}</p>
                <div class="mt-3 space-y-2">
                  <button v-for="(opt, oi) in q.options" :key="oi"
                    @click="quizAnswers[qi] = oi"
                    class="flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left text-[13px] font-medium transition"
                    :class="quizAnswers[qi] === oi ? 'border-[#20c7b7] bg-[#e9fffc] text-[#20c7b7]' : 'border-gray-200 text-[#4b5575] hover:border-gray-300'">
                    <span class="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-bold"
                      :class="quizAnswers[qi] === oi ? 'bg-[#20c7b7] text-white' : 'bg-gray-100 text-gray-500'">{{ ['A','B','C','D'][oi] }}</span>
                    {{ opt }}
                  </button>
                </div>
              </div>
              <button @click="submitAnswers"
                :disabled="quizSubmitting || quizData.length === 0 || quizAnswers.some(a => a === -1)"
                class="mt-2 h-12 w-full rounded-xl bg-[#08a99f] text-[13px] font-semibold text-white active:scale-95 disabled:opacity-60">
                {{ quizSubmitting ? 'Submitting…' : 'Submit Answers' }}
              </button>
            </div>
          </template>

          <!-- Step 2 — Result -->
          <template v-else-if="quizStep === 'result' && quizResult">
            <div class="px-5 pb-8 pt-8 text-center">
              <div class="mx-auto flex h-20 w-20 items-center justify-center rounded-full" :class="quizResult.passed ? 'bg-emerald-100' : 'bg-rose-100'">
                <Icon :icon="quizResult.passed ? 'mdi:check-circle-outline' : 'mdi:close-circle-outline'" class="text-5xl" :class="quizResult.passed ? 'text-emerald-500' : 'text-rose-500'" />
              </div>
              <h3 class="mt-4 text-xl font-bold text-[#17212f]">{{ quizResult.passed ? 'Congratulations!' : 'Try Again' }}</h3>
              <p class="mt-2 text-[13px] text-gray-500">
                You got <strong>{{ quizResult.correct }}/{{ quizResult.total }}</strong> correct ({{ quizResult.score }}%)
              </p>
              <div v-if="quizResult.passed" class="mt-4 rounded-xl bg-[#e9fffc] px-4 py-3">
                <p class="text-[11px] font-bold text-gray-400">Reward Earned</p>
                <p class="text-lg font-semibold text-[#20c7b7]">+{{ Number(quizResult.reward_usdt).toFixed(2) }} USDT</p>
              </div>
              <p v-else class="mt-3 text-[12px] text-gray-400">Score at least 60% to earn the reward.</p>
              <button @click="closeQuiz"
                class="mt-6 h-12 w-full rounded-xl bg-[#08a99f] text-[13px] font-semibold text-white active:scale-95">
                {{ quizResult.passed ? 'Great!' : 'Close' }}
              </button>
            </div>
          </template>
        </div>
      </Transition>
    </Teleport>
  </DashboardLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { Icon } from '@iconify/vue'
import { useRouter } from 'vue-router'
import DashboardLayout from '@/layouts/DashboardLayout.vue'
import { makeContentApi, type QuizQuestion, type AnswerResult } from '@/services/api'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const auth = useAuthStore()

const tabs = ['All Courses', 'Completed'] as const
type Tab = typeof tabs[number]
const activeTab = ref<Tab>('All Courses')
const loading = ref(true)

interface CourseItem {
  id: number
  title: string
  reward: string
  img: string
  completed: boolean
  statusLabel: string
  statusIcon: string
}

const imgFallbacks = ['/images/learn-1.webp', '/images/learn-2.webp', '/images/learn-3.webp', '/images/learn-4.webp']

const courses = ref<CourseItem[]>([])
const progressMap = ref<Record<number, { completed: number; score: number | null }>>({})

// ── Quiz wizard state ──────────────────────────────────────────────
const quizActive = ref(false)
const quizCourse = ref<CourseItem | null>(null)
const quizData = ref<QuizQuestion[]>([])
const quizAnswers = ref<number[]>([])
const quizStep = ref<'questions' | 'result'>('questions')
const quizResult = ref<AnswerResult | null>(null)
const quizSubmitting = ref(false)
const quizLoading = ref(false)

function openQuiz(course: CourseItem) {
  if (course.completed) return // already done, no re-take
  quizCourse.value = course
  quizStep.value = 'questions'
  quizResult.value = null
  quizActive.value = true
  quizAnswers.value = []
  quizLoading.value = true
  const api = makeContentApi(auth.accessToken!)
  api.getCourseQuiz(course.id).then(data => {
    quizData.value = data.quiz
    quizAnswers.value = data.quiz.map(() => -1)
  }).catch(() => {
    quizData.value = []
    quizStep.value = 'result'
    quizResult.value = { correct: 0, total: 0, score: 0, passed: false, reward_usdt: '0' }
  }).finally(() => {
    quizLoading.value = false
  })
}

async function submitAnswers() {
  if (!quizCourse.value || quizSubmitting.value) return
  quizSubmitting.value = true
  try {
    const api = makeContentApi(auth.accessToken!)
    const data = await api.submitQuizAnswers(quizCourse.value.id, quizAnswers.value)
    quizResult.value = data.result
    quizStep.value = 'result'
    // Update local progress
    const prog = progressMap.value[quizCourse.value.id]
    if (prog) {
      prog.completed = data.result.passed ? 1 : prog.completed
      prog.score = data.result.score
    } else {
      progressMap.value[quizCourse.value.id] = {
        completed: data.result.passed ? 1 : 0,
        score: data.result.score,
      }
    }
  } catch {
    quizResult.value = { correct: 0, total: 0, score: 0, passed: false, reward_usdt: '0' }
    quizStep.value = 'result'
  } finally {
    quizSubmitting.value = false
  }
}

function closeQuiz() {
  quizActive.value = false
  quizCourse.value = null
  quizData.value = []
  quizStep.value = 'questions'
  quizResult.value = null
}

const filteredCourses = computed(() =>
  activeTab.value === 'Completed' ? courses.value.filter(c => c.completed) : courses.value,
)

onMounted(async () => {
  if (!auth.accessToken) { loading.value = false; return }
  try {
    const api = makeContentApi(auth.accessToken)
    const [courseData, progData] = await Promise.all([
      api.getLearnCourses(100),
      api.getLearnProgress(),
    ])
    for (const p of progData.progress) {
      progressMap.value[p.course_id] = { completed: p.completed, score: p.score }
    }
    courses.value = courseData.courses.map((c, i) => {
      const prog = progressMap.value[c.id]
      return {
        id: c.id,
        title: c.title,
        reward: `+${Number(c.reward_usdt).toFixed(2)} USDT`,
        img: c.thumbnail_url ?? imgFallbacks[i % imgFallbacks.length],
        completed: prog?.completed === 1,
        statusLabel: prog?.completed === 1 ? 'Claimed' : `${c.duration_min} min`,
        statusIcon: prog?.completed === 1 ? 'mdi:check-circle-outline' : 'mdi:clock-outline',
      }
    })
  } catch { /* keep empty */ }
  finally { loading.value = false }
})
</script>
