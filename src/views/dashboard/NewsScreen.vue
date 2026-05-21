<template>
  <DashboardLayout>
    <div class="min-h-screen bg-[#f6f8fb] text-[#17212f]">
      <!-- PAGE HEADER -->
      <div class="relative flex h-14 items-center justify-center border-b border-gray-100 bg-white px-4">
        <button
          @click="router.back()"
          class="absolute left-3 flex h-9 w-9 items-center justify-center rounded-xl bg-[#f6f8fb] active:scale-95"
        >
          <Icon icon="mdi:chevron-left" class="text-[27px] text-[#243142]" />
        </button>
        <h1 class="text-[16px] font-semibold text-[#17212f]">News</h1>
      </div>

      <!-- CATEGORY FILTER -->
      <section class="sticky top-15.5 z-10 border-b border-gray-100 bg-white px-4">
        <div class="flex gap-5 overflow-x-auto pb-2.5 pt-3">
          <button
            v-for="cat in categories"
            :key="cat"
            @click="activeCategory = cat"
            class="relative shrink-0 pb-2.5 text-[11px] font-bold transition-colors"
            :class="activeCategory === cat ? 'text-[#1bb9b2]' : 'text-gray-400'"
          >
            {{ cat }}
            <span
              v-if="activeCategory === cat"
              class="absolute bottom-0 left-0 h-0.5 w-full rounded-full bg-[#1bb9b2]"
            ></span>
          </button>
        </div>
      </section>

      <!-- NEWS LIST -->
      <section class="px-4 pt-4 pb-6">
        <!-- Loading -->
        <div v-if="loading" class="flex items-center justify-center py-20">
          <Icon icon="mdi:loading" class="animate-spin text-3xl text-[#0ba99d]" />
        </div>

        <!-- No data -->
        <div v-else-if="filteredNews.length === 0" class="flex flex-col items-center gap-3 py-20 text-gray-400">
          <Icon icon="mdi:newspaper-variant-outline" class="text-5xl" />
          <p class="text-sm font-semibold">No news available</p>
        </div>

        <!-- Featured card -->
        <template v-else>
        <div
          class="mb-4 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm"
          @click="openDetail(filteredNews[0])"
        >
          <img
            :src="filteredNews[0].image"
            :alt="filteredNews[0].title"
            class="h-44 w-full object-cover"
          />
          <div class="px-4 py-4">
            <div class="flex items-center gap-2">
              <span class="rounded-full bg-[#e9fffc] px-2 py-0.5 text-[9px] font-semibold text-[#13b8b0]">
                {{ filteredNews[0].source }}
              </span>
              <span class="text-[10px] font-medium text-gray-400">{{ filteredNews[0].time }}</span>
            </div>
            <h2 class="mt-2 text-[14px] font-semibold leading-snug text-[#17212f]">
              {{ filteredNews[0].title }}
            </h2>
            <p class="mt-1 line-clamp-2 text-[11px] leading-relaxed text-gray-400">
              {{ filteredNews[0].excerpt }}
            </p>
          </div>
        </div>

        <!-- List items -->
        <div class="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
          <button
            v-for="item in filteredNews.slice(1)"
            :key="item.title"
            type="button"
            class="flex w-full items-center gap-3 border-b border-gray-100 px-4 py-3 text-left last:border-b-0 active:bg-gray-50"
            @click="openDetail(item)"
          >
            <img
              :src="item.image"
              :alt="item.title"
              class="h-16 w-16 shrink-0 rounded-xl object-cover"
            />
            <div class="min-w-0 flex-1">
              <div class="flex items-center gap-2">
                <span class="rounded-full bg-[#e9fffc] px-2 py-px text-[8px] font-semibold text-[#13b8b0]">
                  {{ item.source }}
                </span>
                <span class="text-[9px] font-medium text-gray-400">{{ item.time }}</span>
              </div>
              <h3 class="mt-1 line-clamp-2 text-[12px] font-semibold leading-snug text-[#17212f]">
                {{ item.title }}
              </h3>
            </div>
            <Icon icon="mdi:chevron-right" class="shrink-0 text-[18px] text-gray-300" />
          </button>
        </div>
        </template>
      </section>
    </div>

    <!-- DETAIL MODAL (bottom sheet) -->
    <Teleport to="body">
      <Transition
        enter-from-class="opacity-0"
        enter-active-class="transition-opacity duration-300"
        leave-to-class="opacity-0"
        leave-active-class="transition-opacity duration-300"
      >
        <div
          v-if="activeNews"
          class="fixed inset-0 z-50 bg-black/50"
          @click="activeNews = null"
        ></div>
      </Transition>
      <Transition
        enter-from-class="translate-y-full"
        enter-active-class="transition-transform duration-300"
        leave-to-class="translate-y-full"
        leave-active-class="transition-transform duration-300"
      >
        <div
          v-if="activeNews"
          class="fixed inset-x-0 bottom-0 z-50 mx-auto max-w-107.5 overflow-hidden rounded-t-3xl bg-white shadow-2xl"
        >
          <img :src="activeNews.image" :alt="activeNews.title" class="h-48 w-full object-contain" />
          <div class="px-5 pt-4 pb-10">
            <div class="flex items-center gap-2">
              <span class="rounded-full bg-[#e9fffc] px-2 py-0.5 text-[9px] font-semibold text-[#13b8b0]">
                {{ activeNews.source }}
              </span>
              <span class="text-[10px] font-medium text-gray-400">{{ activeNews.time }}</span>
            </div>
            <h2 class="mt-3 text-[16px] font-semibold leading-snug text-[#17212f]">
              {{ activeNews.title }}
            </h2>
            <p class="mt-3 text-[12px] leading-relaxed text-gray-500">{{ activeNews.excerpt }}</p>
            <div v-if="activeNews.content" class="mt-4 text-[12px] leading-relaxed text-gray-600" v-html="activeNews.content"></div>
            <button
              @click="activeNews = null"
              class="mt-5 h-12 w-full rounded-xl bg-[#08a99f] text-[13px] font-semibold text-white active:scale-95"
            >
              Close
            </button>
          </div>
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
import { makeContentApi } from '@/services/api'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const auth = useAuthStore()

interface NewsItem {
  title: string
  source: string
  time: string
  excerpt: string
  content: string | null
  image: string
  category: string
}

const activeNews = ref<NewsItem | null>(null)

function openDetail(item: NewsItem) {
  activeNews.value = item
}

function relativeTime(dateStr: string | null): string {
  if (!dateStr) return 'Recently'
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
}

const loading = ref(true)

// ── State (starts empty — populated from API) ──────────────────────────────
const categories = ref<string[]>(['All'])
const activeCategory = ref('All')
const allNews = ref<NewsItem[]>([])

onMounted(async () => {
  if (!auth.accessToken) { loading.value = false; return }
  try {
    const api = makeContentApi(auth.accessToken)
    const [newsData, catData] = await Promise.all([api.getNews(), api.getNewsCategories()])

    categories.value = ['All', ...catData.categories.map(c => c.name)]
    allNews.value = newsData.articles.map((a, i) => ({
      title:    a.title,
      source:   a.source ?? a.category_name ?? 'News',
      time:     relativeTime(a.published_at),
      excerpt:  a.summary ?? '',
      content:  a.content ?? null,
      image:    a.thumbnail_url ?? `https://picsum.photos/600/300?random=${200 + i}`,
      category: a.category_name ?? 'Market',
    }))
  } catch {
    // Keep empty — no-data state will show
  } finally {
    loading.value = false
  }
})

const filteredNews = computed(() => {
  if (activeCategory.value === 'All') return allNews.value
  return allNews.value.filter(n => n.category === activeCategory.value)
})
</script>
