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
                <button @click="showBalance = !showBalance" class="active:scale-90">
                  <Icon :icon="showBalance ? 'mdi:eye-outline' : 'mdi:eye-off-outline'" class="text-[13px]" />
                </button>
              </div>
              <div class="mt-3 flex items-end gap-2">
                <h2 class="text-[27px] font-semibold leading-none tracking-tight">
                  {{ showBalance ? balanceDisplay : '••••••' }}
                </h2>
                <button class="mb-1 flex items-center gap-1 text-[10px] font-semibold">
                  USDT
                  <Icon icon="mdi:chevron-down" class="text-[14px]" />
                </button>
              </div>
              <p class="mt-2 text-[11px] font-semibold text-gray-400">
                {{ showBalance ? '≈ $' + balanceDisplay : '≈ $••••••' }}
              </p>
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
            <button @click="router.push('/deposit-history')" class="flex items-center gap-1 text-[10px] font-semibold text-[#18b8b0]">
              See All
              <Icon icon="mdi:arrow-right" class="text-[13px]" />
            </button>
          </div>

          <!-- loading -->
          <div v-if="txLoading" class="space-y-px">
            <div v-for="i in 3" :key="i" class="flex items-center justify-between border-t border-gray-100 px-4 py-4 animate-pulse">
              <div class="flex items-center gap-3">
                <div class="h-[38px] w-[38px] rounded-full bg-gray-100"></div>
                <div class="space-y-1.5">
                  <div class="h-2.5 w-24 rounded bg-gray-100"></div>
                  <div class="h-2 w-16 rounded bg-gray-100"></div>
                </div>
              </div>
              <div class="space-y-1.5 text-right">
                <div class="h-2.5 w-20 rounded bg-gray-100 ml-auto"></div>
                <div class="h-2 w-14 rounded bg-gray-100 ml-auto"></div>
              </div>
            </div>
          </div>

          <div v-else-if="recentDeposits.length === 0" class="flex flex-col items-center py-10 text-gray-300">
            <Icon icon="mdi:inbox-outline" class="text-4xl" />
            <p class="mt-2 text-[11px] font-semibold">No deposits yet</p>
          </div>

          <div v-else>
            <div
              v-for="item in recentDeposits"
              :key="item.id"
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
                <p class="text-[12px] font-semibold text-[#18b8b0]">{{ showBalance ? item.amount : '••••••' }}</p>
                <p class="mt-1 text-[10px] font-semibold"
                  :class="item.status === 'Approved' ? 'text-[#18b8b0]' : item.status === 'Pending' ? 'text-amber-500' : 'text-red-400'">
                  {{ item.status }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  </DashboardLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { Icon } from '@iconify/vue'
import { useRouter } from 'vue-router'
import DashboardLayout from '@/layouts/DashboardLayout.vue'
import { useAuthStore } from '@/stores/auth'
import { makeWalletApi } from '@/services/api'

const router = useRouter()
const auth   = useAuthStore()
const showSupport    = ref(false)
const showHelpCenter = ref(false)
const showBalance    = ref(true)

// ── Balance ─────────────────────────────────────────────────────────
const balanceDisplay = computed(() => {
  const n = parseFloat(auth.user?.balance ?? '0') || 0
  return n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
})

// ── Recent deposits ─────────────────────────────────────────────────
interface DepositItem { id: string; type: string; date: string; amount: string; status: string; icon: string }
const recentDeposits = ref<DepositItem[]>([])
const txLoading      = ref(false)

function fmtDate(iso: string): string {
  const d = new Date(iso)
  const now = new Date()
  const yesterday = new Date(now); yesterday.setDate(yesterday.getDate() - 1)
  const time = d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
  if (d.toDateString() === now.toDateString())       return `Today, ${time}`
  if (d.toDateString() === yesterday.toDateString()) return `Yesterday, ${time}`
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) + ', ' + time
}

async function loadDeposits() {
  if (!auth.accessToken) return
  txLoading.value = true
  try {
    const data = await makeWalletApi(auth.accessToken).getDeposits()
    recentDeposits.value = data.deposits.slice(0, 5).map(d => ({
      id:     d.id,
      type:   d.method === 'Manual' ? 'Crypto Deposit' : 'Deposit',
      date:   fmtDate(d.created_at),
      amount: '+' + parseFloat(d.amount as unknown as string).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' USDT',
      status: d.status_deposit,
      icon:   'mdi:arrow-down',
    }))
  } catch { /* silently fail */ }
  finally { txLoading.value = false }
}

onMounted(loadDeposits)

interface AddMethod { title: string; desc: string; img: string }
const addMethods: AddMethod[] = [
  { title: 'Crypto Deposit', desc: 'Transfer crypto from an external wallet via blockchain network.', img: '/images/add-funds-crypto-deposit.webp' },
  { title: 'P2P Trading',    desc: 'Buy crypto from other users securely via P2P.',                  img: '/images/add-funds-p2p.webp' },
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
