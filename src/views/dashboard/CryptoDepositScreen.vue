<template>
  <DashboardLayout>
    <div class="min-h-screen bg-[#f6f8fb] text-[#17212f]">
      <!-- PAGE HEADER -->
      <div class="relative flex h-14 items-center justify-center border-b border-gray-100 bg-white px-4">
        <button
          @click="router.back()"
          class="absolute left-4 flex h-9 w-9 items-center justify-center rounded-xl bg-[#f6f8fb] active:scale-95"
        >
          <Icon icon="mdi:chevron-left" class="text-[25px] text-[#1f2937]" />
        </button>
        <h1 class="text-[16px] font-semibold text-[#17212f]">Crypto Deposit</h1>
        <div class="absolute right-4 flex items-center gap-3">
          <button class="active:scale-95" @click="showHelp = true">
            <Icon icon="mdi:help-box-outline" class="text-[22px] text-[#1f2937]" />
          </button>
          <button class="active:scale-95" @click="router.push('/deposit-history')">
            <Icon icon="mdi:file-document-outline" class="text-[22px] text-[#1f2937]" />
          </button>
        </div>
      </div>

      <!-- STEPPER -->
      <section class="bg-white px-4 py-4 shadow-sm">
        <div class="grid grid-cols-4 items-start">
          <div
            v-for="(step, index) in steps"
            :key="step.number"
            class="relative flex cursor-pointer flex-col items-center"
            @click="activeStep = step.number"
          >
            <div
              v-if="index !== steps.length - 1"
              class="absolute left-1/2 top-2.5 h-px w-full transition-colors duration-300"
              :class="step.number < activeStep ? 'bg-[#1fb9b2]' : 'bg-gray-200'"
            ></div>

            <div
              class="relative z-10 flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-semibold transition-colors duration-300"
              :class="step.number <= activeStep ? 'bg-[#1fb9b2] text-white' : 'bg-gray-100 text-gray-400'"
            >
              <Icon v-if="step.number < activeStep" icon="mdi:check" class="text-[12px]" />
              <span v-else>{{ step.number }}</span>
            </div>

            <p
              class="mt-2 text-center text-[9px] font-semibold leading-tight"
              :class="step.number <= activeStep ? 'text-[#17212f]' : 'text-gray-400'"
            >
              {{ step.label }}
            </p>
          </div>
        </div>
      </section>

      <!-- CONTENT -->
      <section class="px-4 pt-4">
        <!-- 1 SELECT COIN -->
        <div>
          <h2 class="text-[12px] font-semibold text-[#17212f]">1. Select Coin</h2>

          <button class="mt-3 flex w-full items-center justify-between rounded-xl border border-gray-100 bg-white px-4 py-3 shadow-sm active:scale-[0.99]">
            <div class="flex items-center gap-3">
              <div class="flex h-9 w-9 items-center justify-center rounded-full" :class="selectedIconClass">
                <CoinIcon :icon="selectedIcon" :symbol="selectedSymbol" icon-class="text-[23px]" img-class="h-5 w-5 rounded-full" />
              </div>
              <div class="text-left">
                <p class="text-[13px] font-semibold leading-none text-[#17212f]">{{ selectedSymbol }}</p>
                <p class="mt-1 text-[9px] font-semibold text-gray-400">{{ selectedName }}</p>
              </div>
            </div>
            <Icon icon="mdi:chevron-right" class="text-[22px] text-gray-400" />
          </button>
        </div>

        <!-- 2 CHOOSE NETWORK -->
        <div class="mt-5">
          <h2 class="text-[12px] font-semibold text-[#17212f]">2. Choose Network</h2>

          <div class="mt-3 rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
            <div class="flex items-start justify-between">
              <div class="flex items-start gap-3">
                <div class="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-[#17212f]">
                  <CoinIcon :icon="selectedIcon" :symbol="selectedSymbol" icon-class="text-[19px]" img-class="h-4 w-4 rounded-full" />
                </div>
                <div>
                  <div class="flex items-center gap-2">
                    <p class="text-[12px] font-semibold text-[#17212f]">Bitcoin Network</p>
                    <span class="rounded-full bg-[#e9fffc] px-2 py-0.5 text-[7px] font-semibold uppercase text-[#1fb9b2]">
                      Recommended
                    </span>
                  </div>
                  <p class="mt-1 text-[9px] font-semibold text-gray-400">BTC</p>
                </div>
              </div>
              <Icon icon="mdi:check-circle" class="text-[20px] text-[#1fb9b2]" />
            </div>

            <div class="mt-4 flex items-start gap-2 rounded-lg bg-[#f6f8fb] px-3 py-3">
              <Icon icon="mdi:information-outline" class="mt-px text-[15px] text-gray-400" />
              <p class="text-[9px] font-semibold leading-relaxed text-gray-400">
                Ensure the network you choose matches the withdrawal network from the platform or wallet you're sending from.
              </p>
            </div>
          </div>
        </div>

        <!-- 3 DEPOSIT ADDRESS -->
        <div class="mt-5">
          <h2 class="text-[12px] font-semibold text-[#17212f]">3. Deposit Address</h2>

          <div class="mt-3 rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
            <p class="text-center text-[10px] font-bold text-gray-400">Scan QR Code or Copy Address</p>

            <!-- QR BOX -->
            <div class="mt-4 flex justify-center">
              <div class="relative flex h-32.5 w-32.5 items-center justify-center rounded-xl border border-gray-100 bg-white">
                <Icon icon="mdi:qrcode" class="text-[112px] text-[#17212f]" />
                <div class="absolute flex h-9 w-9 items-center justify-center rounded-full shadow-md" :class="selectedIconClass">
                  <CoinIcon :icon="selectedIcon" :symbol="selectedSymbol" icon-class="text-[24px]" img-class="h-5 w-5 rounded-full" />
                </div>
              </div>
            </div>

            <!-- ADDRESS -->
            <div class="mt-4 flex items-center justify-between rounded-lg border border-gray-100 bg-[#f9fafb] px-3 py-3">
              <p class="max-w-61.25 truncate text-[10px] font-semibold text-[#344054]">
                bc1qx2kgdyjqsrdtq2n0yrf2493p3kkjfhx0vlh
              </p>
              <button @click="copyAddress" class="ml-3 flex items-center gap-1 text-[10px] font-semibold transition-colors active:scale-95" :class="copied ? 'text-green-500' : 'text-[#1fb9b2]'">
                {{ copied ? 'Copied!' : 'Copy' }}
                <Icon :icon="copied ? 'mdi:check' : 'mdi:content-copy'" class="text-[15px]" />
              </button>
            </div>

            <!-- DEPOSIT INFO -->
            <div class="mt-4 space-y-3">
              <div class="flex items-center justify-between">
                <p class="text-[10px] font-bold text-gray-400">Minimum Deposit</p>
                <p class="text-[10px] font-semibold text-[#17212f]">0.0001 BTC</p>
              </div>
              <div class="flex items-center justify-between">
                <p class="text-[10px] font-bold text-gray-400">Expected Confirmations</p>
                <p class="text-[10px] font-semibold text-[#17212f]">1 Network Confirmation</p>
              </div>
            </div>

            <!-- TIPS -->
            <div class="mt-4 rounded-xl bg-[#e9fffc] p-4">
              <div class="flex items-center gap-2">
                <Icon icon="mdi:shield-check" class="text-[18px] text-[#1fb9b2]" />
                <p class="text-[12px] font-semibold text-[#1fb9b2]">Tips</p>
              </div>
              <ul class="mt-3 space-y-2 pl-6">
                <li
                  v-for="tip in tips"
                  :key="tip"
                  class="list-disc text-[9px] font-semibold leading-relaxed text-[#5f6b7a]"
                >
                  {{ tip }}
                </li>
              </ul>
            </div>
          </div>
        </div>

        <!-- 4 DEPOSIT DETAILS -->
        <div class="mt-5">
          <h2 class="text-[12px] font-semibold text-[#17212f]">4. Deposit Details</h2>

          <div class="mt-3 overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
            <button
              v-for="item in depositDetails"
              :key="item.label"
              class="flex w-full items-center justify-between border-b border-gray-100 px-4 py-4 last:border-b-0 active:bg-gray-50"
            >
              <p class="text-[11px] font-bold text-gray-400">{{ item.label }}</p>
              <div class="flex items-center gap-2">
                <p class="text-[11px] font-semibold text-[#17212f]">{{ item.value }}</p>
                <Icon :icon="item.icon" class="text-[16px] text-gray-400" />
              </div>
            </button>
          </div>
        </div>
      </section>
    </div>
  </DashboardLayout>

  <!-- HELP MODAL -->
  <Teleport to="body">
    <div v-if="showHelp" class="fixed inset-0 z-50 flex items-end justify-center">
      <div class="absolute inset-0 bg-black/50" @click="showHelp = false"></div>
      <div class="relative w-full max-w-107.5 rounded-t-3xl bg-white pb-8">
        <!-- Handle -->
        <div class="flex justify-center pt-3">
          <div class="h-1 w-10 rounded-full bg-gray-200"></div>
        </div>

        <!-- Header -->
        <div class="flex items-center justify-between px-5 pt-4">
          <div class="flex items-center gap-2">
            <div class="flex h-9 w-9 items-center justify-center rounded-full bg-[#e9fffc]">
              <Icon icon="mdi:help-circle-outline" class="text-xl text-[#1fb9b2]" />
            </div>
            <h2 class="text-sm font-semibold text-[#17212f]">How to Deposit</h2>
          </div>
          <button @click="showHelp = false" class="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 active:scale-95">
            <Icon icon="mdi:close" class="text-base text-[#17212f]" />
          </button>
        </div>

        <!-- Body -->
        <div class="mt-4 px-5">
          <p class="text-xs leading-relaxed text-gray-500">
            Learn how to deposit crypto safely using the correct coin, network, and wallet address.
          </p>

          <!-- Warning box -->
          <div class="mt-4 flex items-start gap-3 rounded-xl bg-amber-50 px-4 py-4">
            <Icon icon="mdi:alert-outline" class="mt-0.5 shrink-0 text-lg text-amber-500" />
            <p class="text-xs font-semibold leading-relaxed text-amber-700">
              Make sure the coin and network match the wallet you are sending from. Sending crypto to the wrong network may cause permanent loss.
            </p>
          </div>

          <!-- Steps -->
          <div class="mt-5 space-y-4">
            <div v-for="tip in helpSteps" :key="tip.title" class="flex items-start gap-3">
              <div class="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#e9fffc]">
                <Icon :icon="tip.icon" class="text-sm text-[#1fb9b2]" />
              </div>
              <div>
                <p class="text-xs font-semibold text-[#17212f]">{{ tip.title }}</p>
                <p class="mt-0.5 text-[10px] leading-relaxed text-gray-400">{{ tip.desc }}</p>
              </div>
            </div>
          </div>

          <button
            @click="showHelp = false"
            class="mt-6 flex h-12 w-full items-center justify-center rounded-2xl bg-[#08a99f] text-sm font-semibold text-white active:scale-95"
          >
            Got It
          </button>
        </div>
      </div>
    </div>
  </Teleport>

  <!-- HISTORY MODAL -->
  <Teleport to="body">
    <div v-if="showHistory" class="fixed inset-0 z-50 flex items-end justify-center">
      <div class="absolute inset-0 bg-black/50" @click="showHistory = false"></div>
      <div class="relative w-full max-w-107.5 rounded-t-3xl bg-white pb-8" style="max-height: 85vh; overflow-y: auto;">
        <!-- Handle -->
        <div class="flex justify-center pt-3">
          <div class="h-1 w-10 rounded-full bg-gray-200"></div>
        </div>

        <!-- Header -->
        <div class="flex items-center justify-between px-5 pt-4">
          <div class="flex items-center gap-2">
            <div class="flex h-9 w-9 items-center justify-center rounded-full bg-[#e9fffc]">
              <Icon icon="mdi:file-document-outline" class="text-xl text-[#1fb9b2]" />
            </div>
            <h2 class="text-sm font-semibold text-[#17212f]">Deposit History</h2>
          </div>
          <button @click="showHistory = false" class="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 active:scale-95">
            <Icon icon="mdi:close" class="text-base text-[#17212f]" />
          </button>
        </div>

        <!-- Desc -->
        <div class="mt-3 px-5">
          <p class="text-xs leading-relaxed text-gray-500">
            View your crypto deposit history, status, network confirmations, and transaction details.
          </p>
          <p class="mt-1 text-[10px] leading-relaxed text-gray-400">
            Check all incoming deposits, including pending, completed, failed, and confirmed transactions.
          </p>
        </div>

        <!-- Filter tabs -->
        <div class="mt-4 flex gap-2 px-5">
          <button
            v-for="tab in historyTabs"
            :key="tab"
            @click="activeHistoryTab = tab"
            class="rounded-full px-3 py-1.5 text-[10px] font-semibold transition-colors active:scale-95"
            :class="activeHistoryTab === tab ? 'bg-[#08a99f] text-white' : 'bg-gray-100 text-gray-500'"
          >
            {{ tab }}
          </button>
        </div>

        <!-- History list -->
        <div class="mt-3 space-y-2 px-5">
          <div
            v-for="tx in filteredHistory"
            :key="tx.txid"
            class="flex items-center justify-between rounded-xl border border-gray-100 bg-white px-4 py-3"
          >
            <div class="flex items-center gap-3">
              <div
                class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full"
                :class="tx.statusClass.bg"
              >
                <Icon :icon="tx.statusIcon" class="text-lg" :class="tx.statusClass.icon" />
              </div>
              <div>
                <p class="text-[11px] font-semibold text-[#17212f]">{{ tx.coin }} — {{ tx.network }}</p>
                <p class="mt-0.5 text-[9px] font-semibold text-gray-400">{{ tx.date }}</p>
                <p class="mt-0.5 max-w-40 truncate text-[8px] text-gray-300">{{ tx.txid }}</p>
              </div>
            </div>
            <div class="text-right">
              <p class="text-[12px] font-semibold text-[#17212f]">+{{ tx.amount }} {{ tx.coin }}</p>
              <span
                class="mt-1 inline-block rounded-full px-2 py-0.5 text-[8px] font-semibold"
                :class="tx.statusClass.badge"
              >
                {{ tx.status }}
              </span>
            </div>
          </div>

          <!-- Empty state -->
          <div v-if="filteredHistory.length === 0" class="flex flex-col items-center py-10 text-gray-400">
            <Icon icon="mdi:inbox-outline" class="text-5xl" />
            <p class="mt-3 text-xs font-semibold">No {{ activeHistoryTab }} transactions</p>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { Icon } from '@iconify/vue'
import { useRouter } from 'vue-router'
import DashboardLayout from '@/layouts/DashboardLayout.vue'
import CoinIcon from '@/components/CoinIcon.vue'
import { useMarketStore, coinIconClass } from '@/stores/market'

const router = useRouter()
const marketStore = useMarketStore()

// Selected coin for deposit (defaults to BTC)
const selectedSymbol = ref('BTC')
const selectedCoin = computed(() => marketStore.coinMap.get(selectedSymbol.value))
const selectedIcon = computed(() => selectedCoin.value?.icon ?? 'mdi:bitcoin')
const selectedName = computed(() => selectedCoin.value?.name ?? 'Bitcoin')
const selectedIconClass = computed(() => coinIconClass(selectedSymbol.value))

// ─── Help Modal ───────────────────────────────────────────────
const showHelp = ref(false)

const helpSteps = [
  {
    icon: 'mdi:currency-btc',
    title: 'Select the correct coin',
    desc: 'Choose the exact coin you are depositing (e.g. BTC, ETH, USDT).',
  },
  {
    icon: 'mdi:lan',
    title: 'Match the network',
    desc: 'Ensure the network (e.g. Bitcoin, ERC-20, TRC-20) matches the sender wallet.',
  },
  {
    icon: 'mdi:wallet-outline',
    title: 'Copy the wallet address',
    desc: 'Copy the deposit address carefully. Double-check before sending.',
  },
  {
    icon: 'mdi:timer-sand',
    title: 'Wait for confirmation',
    desc: 'Deposits are credited after the required number of network confirmations.',
  },
]

// ─── History Modal ────────────────────────────────────────────
const showHistory = ref(false)
const historyTabs = ['All', 'Completed', 'Pending', 'Failed'] as const
type HistoryTab = typeof historyTabs[number]
const activeHistoryTab = ref<HistoryTab>('All')

interface TxHistory {
  coin: string
  network: string
  amount: string
  date: string
  txid: string
  status: HistoryTab extends 'All' ? string : HistoryTab
  statusIcon: string
  statusClass: { bg: string; icon: string; badge: string }
}

const depositHistory: TxHistory[] = [
  {
    coin: 'BTC',
    network: 'Bitcoin',
    amount: '0.0042',
    date: 'May 10, 2026 · 14:32',
    txid: 'bc1qx2kgdyjq...fhx0vlh',
    status: 'Completed',
    statusIcon: 'mdi:check-circle',
    statusClass: { bg: 'bg-[#e9fffc]', icon: 'text-[#1fb9b2]', badge: 'bg-[#e9fffc] text-[#1fb9b2]' },
  },
  {
    coin: 'USDT',
    network: 'TRC-20',
    amount: '250.00',
    date: 'May 08, 2026 · 09:11',
    txid: 'TXabc123...xyz789',
    status: 'Completed',
    statusIcon: 'mdi:check-circle',
    statusClass: { bg: 'bg-[#e9fffc]', icon: 'text-[#1fb9b2]', badge: 'bg-[#e9fffc] text-[#1fb9b2]' },
  },
  {
    coin: 'ETH',
    network: 'ERC-20',
    amount: '0.15',
    date: 'May 05, 2026 · 20:47',
    txid: '0xabc...def456',
    status: 'Pending',
    statusIcon: 'mdi:clock-outline',
    statusClass: { bg: 'bg-amber-50', icon: 'text-amber-500', badge: 'bg-amber-50 text-amber-600' },
  },
  {
    coin: 'BTC',
    network: 'Bitcoin',
    amount: '0.001',
    date: 'Apr 29, 2026 · 11:05',
    txid: 'bc1q9yz...v12opw',
    status: 'Failed',
    statusIcon: 'mdi:close-circle',
    statusClass: { bg: 'bg-red-50', icon: 'text-red-400', badge: 'bg-red-50 text-red-500' },
  },
]

const filteredHistory = computed(() =>
  activeHistoryTab.value === 'All'
    ? depositHistory
    : depositHistory.filter(tx => tx.status === activeHistoryTab.value)
)

interface Step {
  number: number
  label: string
}

interface DepositDetail {
  label: string
  value: string
  icon: string
}

// ─── Stepper ─────────────────────────────────────────────────
const activeStep = ref(1)

// ─── Copy Address ─────────────────────────────────────────────
const copied = ref(false)
const depositAddress = 'bc1qx2kgdyjqsrdtq2n0yrf2493p3kkjfhx0vlh'

function copyAddress() {
  navigator.clipboard.writeText(depositAddress).catch(() => {})
  copied.value = true
  setTimeout(() => { copied.value = false }, 2000)
}

const steps: Step[] = [
  { number: 1, label: 'Select Coin' },
  { number: 2, label: 'Choose Network' },
  { number: 3, label: 'Deposit Address' },
  { number: 4, label: 'Details' },
]

const depositDetails: DepositDetail[] = [
  { label: 'Deposited To', value: 'Spot Wallet', icon: 'mdi:arrow-right' },
  { label: 'Arrival Time', value: '≈ 10 - 60 minutes', icon: 'mdi:arrow-right' },
]

const tips: string[] = [
  'Send only BTC to this deposit address.',
  'Sending any other coins may result in permanent loss.',
  'Your deposit will be credited after 1 network confirmation.',
]

onMounted(() => { marketStore.fetchCoins() })
</script>
