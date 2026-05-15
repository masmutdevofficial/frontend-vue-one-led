<template>
  <DashboardLayout>
    <!-- Customer Support Modal -->
    <Teleport to="body">
      <Transition name="sheet">
        <div v-if="showSupport" class="fixed inset-0 z-50 flex flex-col">
          <div class="absolute inset-0 bg-black/40 backdrop-blur-sm" @click="showSupport = false"></div>
          <div class="relative mt-auto w-full rounded-t-3xl bg-white px-6 pt-5 pb-10 shadow-2xl lg:mx-auto lg:mb-auto lg:mt-auto lg:max-w-lg lg:rounded-3xl">
            <div class="mb-5 flex items-center justify-between">
              <h3 class="text-xl font-semibold text-slate-950">Customer Support</h3>
              <button type="button" class="grid size-9 place-items-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 transition" @click="showSupport = false">
                <Icon icon="mdi:close" class="size-5" />
              </button>
            </div>

            <div class="flex items-start gap-4 rounded-2xl bg-teal-50 p-4">
              <div class="grid size-12 shrink-0 place-items-center rounded-2xl bg-teal-100 text-teal-500">
                <Icon icon="mdi:headset" class="size-6" />
              </div>
              <div>
                <p class="text-sm font-semibold text-slate-950">Customer Support</p>
                <p class="mt-1 text-xs font-semibold leading-5 text-slate-500">Need help? Chat with our support team anytime.</p>
              </div>
            </div>

            <button
              type="button"
              class="mt-5 w-full rounded-2xl bg-teal-500 py-3.5 text-sm font-semibold text-white transition active:scale-95 hover:bg-teal-600"
              @click="() => { showSupport = false }"
            >
              Open Support Chat
            </button>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Help Center Modal -->
    <Teleport to="body">
      <Transition name="sheet">
        <div v-if="showHelpCenter" class="fixed inset-0 z-50 flex flex-col">
          <div class="absolute inset-0 bg-black/40 backdrop-blur-sm" @click="showHelpCenter = false"></div>
          <div class="relative mt-auto w-full rounded-t-3xl bg-white px-6 pt-5 pb-10 shadow-2xl lg:mx-auto lg:mb-auto lg:mt-auto lg:max-w-lg lg:rounded-3xl">
            <div class="mb-5 flex items-center justify-between">
              <h3 class="text-xl font-semibold text-slate-950">Help Center</h3>
              <button type="button" class="grid size-9 place-items-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 transition" @click="showHelpCenter = false">
                <Icon icon="mdi:close" class="size-5" />
              </button>
            </div>

            <div class="flex items-start gap-4 rounded-2xl bg-slate-50 p-4">
              <div class="grid size-12 shrink-0 place-items-center rounded-2xl bg-slate-100 text-slate-500">
                <Icon icon="mdi:help-circle-outline" class="size-6" />
              </div>
              <div>
                <p class="text-sm font-semibold text-slate-950">Help Center</p>
                <p class="mt-1 text-xs font-semibold leading-5 text-slate-500">Find guides, FAQs, and answers about funding your account.</p>
              </div>
            </div>

            <button
              type="button"
              class="mt-5 w-full rounded-2xl bg-[#17212f] py-3.5 text-sm font-semibold text-white transition active:scale-95 hover:bg-[#2a3a4e]"
              @click="() => { showHelpCenter = false }"
            >
              Open Help Center
            </button>
          </div>
        </div>
      </Transition>
    </Teleport>
    <div class="min-h-screen bg-[#f6f8fb] text-[#17212f]">
      <!-- PAGE HEADER -->
      <div class="relative flex h-14 items-center justify-center border-b border-gray-100 bg-white px-4">
        <button
          @click="router.back()"
          class="absolute left-4 flex h-9 w-9 items-center justify-center rounded-xl bg-[#f6f8fb] active:scale-95"
        >
          <Icon icon="mdi:chevron-left" class="text-[25px] text-[#202833]" />
        </button>
        <h1 class="text-[16px] font-semibold text-[#17212f]">Add Funds</h1>
        <div class="absolute right-4 flex items-center gap-3">
          <button class="active:scale-95" @click="showSupport = true">
            <Icon icon="mdi:headphones" class="text-[22px] text-[#202833]" />
          </button>
          <button class="active:scale-95" @click="showHelpCenter = true">
            <Icon icon="mdi:help-box-outline" class="text-[22px] text-[#202833]" />
          </button>
        </div>
      </div>

      <!-- METHOD SECTION -->
      <section class="px-4 pt-2">
        <p class="text-[12px] font-semibold text-[#667085]">
          Choose a method to add funds to your account
        </p>

        <div class="mt-4 grid grid-cols-2 gap-3">
          <button
            v-for="item in addMethods"
            :key="item.title"
            @click="item.title === 'Crypto Deposit' ? router.push('/crypto-deposit') : item.title === 'P2P Trading' ? router.push('/p2p-trading') : undefined"
            class="min-h-[210px] rounded-2xl border border-gray-100 bg-white p-4 text-center shadow-sm active:scale-[0.98]"
          >
            <img
              :src="item.img"
              :alt="item.title"
              class="mx-auto h-[110px] w-full object-contain"
            />

            <h2 class="mt-4 text-[14px] font-semibold text-[#1f2937]">{{ item.title }}</h2>
            <p class="mx-auto mt-3 max-w-[130px] text-[10px] font-medium leading-[1.55] text-[#5f6b7a]">
              {{ item.desc }}
            </p>

            <div class="mt-4 flex justify-center">
              <Icon icon="mdi:arrow-right" class="text-[22px] text-[#18b8b0]" />
            </div>
          </button>
        </div>
      </section>

      <!-- BALANCE CARD -->
      <section class="mt-4 px-4">
        <div class="relative overflow-hidden rounded-2xl border border-gray-100 bg-white px-4 py-4 shadow-sm">
          <div class="absolute right-0 top-0 h-full w-[48%] bg-gradient-to-l from-cyan-100/70 via-cyan-50/60 to-transparent"></div>

          <div class="relative z-10 flex items-center justify-between">
            <div>
              <div class="flex items-center gap-1 text-[11px] font-bold text-gray-400">
                My Balance
                <Icon icon="mdi:eye-outline" class="text-[13px]" />
              </div>
              <div class="mt-3 flex items-end gap-2">
                <h2 class="text-[27px] font-semibold leading-none tracking-tight">212,216.40</h2>
                <button class="mb-1 flex items-center gap-1 text-[10px] font-semibold">
                  USDT
                  <Icon icon="mdi:chevron-down" class="text-[14px]" />
                </button>
              </div>
              <p class="mt-2 text-[11px] font-semibold text-gray-400">≈ $212,216.40</p>
            </div>

            <!-- Coin Illustration -->
            <img src="/images/staking.webp" alt="Balance" class="h-[100px] w-[130px] object-contain" />
          </div>
        </div>
      </section>

      <!-- RECENT TRANSACTIONS -->
      <section class="mt-4 px-4">
        <div class="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
          <div class="flex items-center justify-between px-4 py-4">
            <h2 class="text-[14px] font-semibold text-[#17212f]">Recent Transactions</h2>
            <button class="flex items-center gap-1 text-[10px] font-semibold text-[#18b8b0]">
              See All
              <Icon icon="mdi:arrow-right" class="text-[13px]" />
            </button>
          </div>

          <div>
            <div
              v-for="item in transactions"
              :key="item.type + item.date"
              class="flex items-center justify-between border-t border-gray-100 px-4 py-4"
            >
              <div class="flex items-center gap-3">
                <div class="flex h-[38px] w-[38px] items-center justify-center rounded-full bg-[#e9fffc]">
                  <Icon :icon="item.icon" class="text-[22px] text-[#18b8b0]" />
                </div>
                <div>
                  <h3 class="text-[12px] font-semibold text-[#17212f]">{{ item.type }}</h3>
                  <p class="mt-1 text-[10px] font-semibold text-gray-400">{{ item.date }}</p>
                </div>
              </div>
              <div class="text-right">
                <p class="text-[12px] font-semibold text-[#18b8b0]">{{ item.amount }}</p>
                <p class="mt-1 text-[10px] font-semibold text-gray-400">{{ item.status }}</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  </DashboardLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Icon } from '@iconify/vue'
import { useRouter } from 'vue-router'
import DashboardLayout from '@/layouts/DashboardLayout.vue'

const router = useRouter()
const showSupport = ref(false)
const showHelpCenter = ref(false)

interface AddMethod {
  title: string
  desc: string
  img: string
}

interface Transaction {
  type: string
  date: string
  amount: string
  status: string
  icon: string
}

const addMethods: AddMethod[] = [
  {
    title: 'Crypto Deposit',
    desc: 'Transfer crypto from an external wallet via blockchain network.',
    img: '/images/add-funds-crypto-deposit.webp',
  },
  {
    title: 'P2P Trading',
    desc: 'Buy crypto from other users securely via P2P.',
    img: '/images/add-funds-p2p.webp',
  },
]

const transactions: Transaction[] = [
  { type: 'Crypto Deposit', date: 'May 25, 2024 09:21 AM', amount: '+2,000.00 USDT', status: 'Completed', icon: 'mdi:arrow-down' },
  { type: 'P2P Buy', date: 'May 24, 2024 08:15 PM', amount: '+1,500.00 USDT', status: 'Completed', icon: 'mdi:account-group' },
  { type: 'Crypto Deposit', date: 'May 23, 2024 06:42 PM', amount: '+3,250.00 USDT', status: 'Completed', icon: 'mdi:arrow-down' },
]
</script>

<style scoped>
.sheet-enter-active,
.sheet-leave-active {
  transition: opacity 0.25s ease;
}
.sheet-enter-active .relative,
.sheet-leave-active .relative {
  transition: transform 0.3s cubic-bezier(0.32, 0.72, 0, 1);
}
.sheet-enter-from,
.sheet-leave-to {
  opacity: 0;
}
.sheet-enter-from .relative {
  transform: translateY(100%);
}
.sheet-leave-to .relative {
  transform: translateY(100%);
}
</style>
