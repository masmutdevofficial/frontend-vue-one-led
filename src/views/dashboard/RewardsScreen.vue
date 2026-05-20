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
        <h1 class="text-[16px] font-semibold text-[#17212f]">Rewards</h1>
      </div>

      <div class="mx-auto px-4 py-4 pb-8">
        <!-- HERO -->
        <section
          class="relative overflow-hidden rounded-2xl border border-gray-100 bg-[#f8fffe] p-5 shadow-sm"
        >
          <div
            class="absolute right-0 top-0 h-full w-[58%] bg-linear-to-l from-cyan-100/80 via-cyan-50/60 to-transparent"
          ></div>

          <div class="relative z-10 flex min-h-42.5 items-center justify-between">
            <div class="w-[48%]">
              <p class="text-sm font-medium text-[#5b6d9a]">
                Total Rewards Earned
              </p>

              <div class="mt-3 flex items-end gap-2">
                <h1 class="text-[26px] font-bold leading-none tracking-tight">
                  2,450.30
                </h1>
                <span class="mb-1 text-[11px] font-semibold">
                  USDT
                </span>
              </div>

              <p class="mt-5 text-[13px] font-medium text-[#5b6d9a]">
                Keep participating and earn more!
              </p>

              <button
                class="mt-6 flex h-10 items-center gap-2 rounded-xl border border-[#20c7b7] bg-white px-4 text-[13px] font-semibold text-[#20c7b7] active:scale-95"
              >
                <Icon icon="mdi:gift-outline" class="text-lg" />
                View Reward History
                <Icon icon="mdi:chevron-right" class="text-lg" />
              </button>
            </div>

            <img src="/images/rewards-banner.webp" alt="Rewards" class="h-38.75 w-46.25 object-contain" />
          </div>
        </section>

        <!-- TAB -->
        <section class="mt-6">
          <div class="relative flex h-13 items-center justify-center rounded-2xl border border-gray-100 bg-white shadow-sm">
            <h2 class="text-base font-semibold text-[#20c7b7]">
              Available
            </h2>
            <span
              class="absolute bottom-0 left-1/2 h-0.75 w-23 -translate-x-1/2 rounded-full bg-[#20c7b7]"
            ></span>
          </div>
        </section>

        <!-- REWARD LIST -->
        <section class="mt-5 space-y-3">
          <article
            v-for="item in rewards"
            :key="item.title"
            class="relative flex items-center justify-between rounded-2xl border border-gray-100 bg-white px-4 py-4 shadow-sm"
          >
            <span
              v-if="item.badge"
              class="absolute left-4 top-0 rounded-b-md bg-yellow-100 px-2 py-1 text-[10px] font-semibold text-yellow-700"
            >
              {{ item.badge }}
            </span>

            <div class="flex items-center gap-4">
              <img :src="item.img" :alt="item.title" class="h-18.5 w-18.5 shrink-0 rounded-xl object-cover" />

              <div class="max-w-52.5">
                <h3 class="text-sm font-semibold leading-snug text-[#0b1638]">
                  {{ item.title }}
                </h3>

                <p
                  v-if="item.progress"
                  class="mt-2 text-xs font-semibold text-[#20c7b7]"
                >
                  {{ item.progress }}
                </p>

                <p class="mt-2 text-sm font-medium text-[#5b6d9a]">
                  {{ item.reward }}
                </p>
              </div>
            </div>

            <span
              class="rounded-xl bg-gray-100 px-4 py-2 text-[13px] font-semibold text-[#7a86a4]"
            >
              Claimed
            </span>
          </article>
        </section>

        <!-- INFO -->
        <section
          class="mt-5 flex items-start gap-3 rounded-2xl border border-gray-100 bg-[#fbfffe] px-5 py-4"
        >
          <Icon icon="mdi:information-outline" class="mt-0.5 text-[23px] text-[#7a86a4]" />
          <p class="text-[13px] font-medium leading-relaxed text-[#7a86a4]">
            Rewards will be distributed to your funding account within 24 hours after the event ends.
          </p>
        </section>
      </div>
    </div>
  </DashboardLayout>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { useRouter } from 'vue-router'
import DashboardLayout from '@/layouts/DashboardLayout.vue'

const router = useRouter()

interface Reward {
  title: string
  reward: string
  icon: string
  img: string
  claimed: boolean
  badge?: string
  progress?: string
}

const rewards: Reward[] = [
  {
    title: 'Deposit a minimum of 100 USDT via On Chain',
    reward: 'Reward $5.00',
    icon: 'mdi:wallet-outline',
    img: '/images/rewards-1.webp',
    claimed: true,
  },
  {
    title: 'Deposit a minimum of 1000 USDT via On Chain',
    reward: 'Reward $50.00',
    icon: 'mdi:archive-star-outline',
    img: '/images/rewards-2.webp',
    claimed: true,
    badge: 'Extra Rewards',
  },
  {
    title: 'Trade > 500 USDT In total Volume (Buy & Sells) on all SPOT trading pairs',
    reward: 'Reward $5.00',
    icon: 'mdi:chart-line',
    img: '/images/rewards-3.webp',
    claimed: true,
  },
  {
    title: 'Trade > on all COPY Trade 6/6',
    reward: 'Reward $200.00',
    icon: 'mdi:account-group-outline',
    img: '/images/rewards-4.webp',
    claimed: true,
  },
  {
    title: 'Join any Copy Trade and reach a total copy trading volume of 20,000 USDT.',
    reward: 'Reward $100.00',
    icon: 'mdi:clipboard-chart-outline',
    img: '/images/rewards-5.webp',
    claimed: true,
    progress: 'Progress 43,131/20,000 USDT',
  },
]
</script>
