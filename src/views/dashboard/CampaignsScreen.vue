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
        <h1 class="text-[16px] font-semibold text-[#17212f]">Campaigns</h1>
      </div>

      <div class="mx-auto px-4 py-4 pb-8">
        <!-- HERO -->
        <section
          class="relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"
        >
          <div
            class="absolute right-0 top-0 h-full w-[58%] bg-linear-to-l from-cyan-100/80 via-cyan-50/60 to-transparent"
          ></div>

          <div class="relative z-10 flex min-h-37.5 items-center justify-between">
            <div class="w-[48%]">
              <h1 class="text-2xl font-semibold leading-tight text-[#0b1638]">
                Join campaigns and earn exciting rewards!
              </h1>

              <p class="mt-4 text-sm font-medium leading-relaxed text-[#5b6d9a]">
                Complete tasks, achieve goals, and earn amazing rewards.
              </p>
            </div>

            <img src="/images/campaigns-banner.webp" alt="Campaigns" class="h-35 w-46.25 object-contain" />
          </div>
        </section>

        <!-- STATUS TITLE -->
        <section class="my-8 flex items-center justify-center gap-5">
          <div class="h-px flex-1 bg-gray-100"></div>
          <Icon icon="mdi:rhombus" class="text-[13px] text-[#20c7b7]" />
          <h2 class="text-sm font-semibold uppercase tracking-wide text-[#20c7b7]">
            On Going
          </h2>
          <Icon icon="mdi:rhombus" class="text-[13px] text-[#20c7b7]" />
          <div class="h-px flex-1 bg-gray-100"></div>
        </section>

        <!-- CAMPAIGN LIST -->
        <section class="space-y-3">
          <button
            v-for="item in campaigns"
            :key="item.title"
            class="flex w-full items-center justify-between rounded-2xl border border-gray-100 bg-white px-5 py-5 text-left shadow-sm active:scale-[0.99]"
          >
            <div class="flex items-center gap-5">
              <img :src="item.img" :alt="item.title" class="h-14.5 w-14.5 shrink-0 rounded-full object-cover" />

              <div>
                <h3 class="text-[17px] font-semibold text-[#0b1638]">
                  {{ item.title }}
                </h3>

                <p class="mt-2 text-[13px] font-medium text-[#5b6d9a]">
                  {{ item.desc }}
                </p>

                <p class="mt-2 flex items-center gap-2 text-[13px] font-semibold text-[#20c7b7]">
                  <Icon icon="mdi:calendar-month-outline" class="text-base" />
                  {{ item.date }}
                </p>
              </div>
            </div>

            <Icon icon="mdi:chevron-right" class="text-[30px] text-[#6b82c4]" />
          </button>
        </section>

        <!-- VIEW ALL -->
        <button
          class="mt-6 flex h-13.5 w-full items-center justify-center gap-3 rounded-2xl bg-white text-base font-semibold text-[#20c7b7] shadow-sm active:scale-[0.99]"
        >
          View All Campaigns
          <Icon icon="mdi:arrow-right" class="text-[28px]" />
        </button>
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

interface Campaign {
  title: string
  desc: string
  date: string
  icon: string
  img: string
}

const typeIcon: Record<string, string> = {
  referral:  'mdi:account-multiple-plus',
  trading:   'mdi:chart-line',
  deposit:   'mdi:bank-transfer',
  newuser:   'mdi:account-check',
  streak:    'mdi:calendar-check',
  leaderboard: 'mdi:trophy',
}

function formatDateRange(start: string, end: string): string {
  const fmt = (s: string) => new Date(s).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  return `${fmt(start)} - ${fmt(end)}`
}

// ── Defaults ──────────────────────────────────────────────────────────────────
const defaultCampaigns: Campaign[] = [
  { title: 'New User Campaign',      desc: 'Sign up, complete KYC, and earn rewards!',        date: 'May 01 - May 31, 2027', icon: 'mdi:account-check',          img: '/images/campaigns-1.webp' },
  { title: 'Referral Campaign',      desc: 'Invite friends and earn together!',                date: 'May 01 - May 31, 2027', icon: 'mdi:account-multiple-plus',  img: '/images/campaigns-2.webp' },
  { title: 'Trading Volume Campaign',desc: 'Trade more and earn bigger rewards!',              date: 'May 01 - May 31, 2027', icon: 'mdi:chart-line',              img: '/images/campaigns-3.webp' },
  { title: 'Daily Trading Streak',   desc: 'Trade every day and build your streak!',           date: 'May 01 - May 31, 2027', icon: 'mdi:calendar-check',          img: '/images/campaigns-4.webp' },
  { title: 'Leaderboard Challenge',  desc: 'Compete with top traders and win rewards!',        date: 'May 01 - May 31, 2027', icon: 'mdi:trophy',                  img: '/images/campaigns-5.webp' },
]

const campaigns = ref<Campaign[]>(defaultCampaigns)
const imgFallbacks = [
  '/images/campaigns-1.webp', '/images/campaigns-2.webp', '/images/campaigns-3.webp',
  '/images/campaigns-4.webp', '/images/campaigns-5.webp',
]

onMounted(async () => {
  if (!auth.accessToken) return
  try {
    const api = makeContentApi(auth.accessToken)
    const data = await api.getCampaigns()
    if (data.campaigns.length > 0) {
      campaigns.value = data.campaigns.map((c, i) => ({
        title: c.title,
        desc:  c.description ?? '',
        date:  formatDateRange(c.start_date, c.end_date),
        icon:  typeIcon[c.type?.toLowerCase() ?? ''] ?? 'mdi:bullhorn-outline',
        img:   c.banner_url ?? imgFallbacks[i % imgFallbacks.length],
      }))
    }
  } catch { /* silently use defaults */ }
})
</script>
