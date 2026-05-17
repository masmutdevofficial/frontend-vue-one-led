<template>
  <DashboardLayout>
    <div class="min-h-screen bg-[#f6f8fb] pb-28">
      <!-- HEADER -->
      <div class="sticky top-0 z-20 flex items-center gap-3 bg-[#f6f8fb] px-4 pb-3 pt-5">
        <button @click="router.back()" class="flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-sm active:scale-95">
          <Icon icon="mdi:arrow-left" class="text-[20px] text-[#17212f]" />
        </button>
        <h1 class="text-[16px] font-semibold text-[#17212f]">All Transactions</h1>
      </div>

      <!-- FILTER TABS -->
      <div class="flex gap-2 overflow-x-auto px-4 pb-1 no-scrollbar">
        <button
          v-for="tab in ['All', 'Deposit', 'Withdrawal', 'Transfer']"
          :key="tab"
          @click="activeFilter = tab"
          class="shrink-0 rounded-full px-4 py-1.5 text-[11px] font-semibold transition-colors"
          :class="activeFilter === tab
            ? 'bg-[#20c7b7] text-white'
            : 'bg-white text-gray-500 border border-gray-200'"
        >
          {{ tab }}
        </button>
      </div>

      <!-- LOADING SKELETON -->
      <div v-if="loading" class="mt-4 px-4 space-y-3">
        <div v-for="i in 5" :key="i" class="flex items-center justify-between rounded-2xl bg-white px-4 py-4 shadow-sm animate-pulse">
          <div class="flex items-center gap-3">
            <div class="h-10 w-10 rounded-full bg-gray-100"></div>
            <div class="space-y-1.5">
              <div class="h-2.5 w-28 rounded bg-gray-100"></div>
              <div class="h-2 w-20 rounded bg-gray-100"></div>
            </div>
          </div>
          <div class="space-y-1.5 text-right">
            <div class="h-2.5 w-20 rounded bg-gray-100 ml-auto"></div>
            <div class="h-2 w-14 rounded bg-gray-100 ml-auto"></div>
          </div>
        </div>
      </div>

      <!-- EMPTY STATE -->
      <div v-else-if="filteredItems.length === 0" class="flex flex-col items-center pt-20 text-gray-300">
        <Icon icon="mdi:receipt-text-outline" class="text-5xl" />
        <p class="mt-3 text-[12px] font-semibold">No transactions found</p>
      </div>

      <!-- GROUPED LIST -->
      <div v-else class="mt-4 px-4 space-y-4">
        <div v-for="group in groupedItems" :key="group.label">
          <p class="mb-2 text-[11px] font-semibold text-gray-400">{{ group.label }}</p>
          <div class="overflow-hidden rounded-2xl bg-white shadow-sm">
            <div
              v-for="(item, idx) in group.items"
              :key="item.id"
              class="flex items-center justify-between px-4 py-4"
              :class="idx > 0 ? 'border-t border-gray-100' : ''"
            >
              <div class="flex items-center gap-3">
                <div
                  class="flex h-10 w-10 items-center justify-center rounded-full"
                  :class="item.positive ? 'bg-[#e9fffc]' : 'bg-red-50'"
                >
                  <Icon :icon="item.icon" class="text-[22px]" :class="item.positive ? 'text-[#18b8b0]' : 'text-red-400'" />
                </div>
                <div>
                  <h3 class="text-[12px] font-semibold text-[#17212f]">{{ item.type }}</h3>
                  <p class="mt-0.5 text-[10px] font-semibold text-gray-400">{{ item.asset }}</p>
                  <p class="mt-0.5 text-[10px] font-semibold text-gray-400">{{ item.time }}</p>
                </div>
              </div>
              <div class="text-right">
                <p class="text-[12px] font-semibold" :class="item.positive ? 'text-[#18b8b0]' : 'text-red-400'">
                  {{ item.amount }}
                </p>
                <p class="mt-1 text-[10px] font-semibold"
                  :class="statusClass(item.status)">
                  {{ item.status }}
                </p>
              </div>
            </div>
          </div>
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
import { useAuthStore } from '@/stores/auth'
import { makeWalletApi } from '@/services/api'

const router = useRouter()
const auth   = useAuthStore()
const activeFilter = ref('All')
const loading = ref(false)

interface TxItem {
  id: string; type: string; asset: string; icon: string
  amount: string; time: string; status: string; positive: boolean
  created_at: string
}

const allItems = ref<TxItem[]>([])

function fmtAmt(n: string | number): string {
  return parseFloat(n as string).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

function fmtDate(iso: string): string {
  const d = new Date(iso)
  const now = new Date()
  const yesterday = new Date(now); yesterday.setDate(yesterday.getDate() - 1)
  const time = d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
  if (d.toDateString() === now.toDateString())       return `Today, ${time}`
  if (d.toDateString() === yesterday.toDateString()) return `Yesterday, ${time}`
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) + ', ' + time
}

function dayLabel(iso: string): string {
  const d = new Date(iso)
  const now = new Date()
  const yesterday = new Date(now); yesterday.setDate(yesterday.getDate() - 1)
  if (d.toDateString() === now.toDateString())       return 'Today'
  if (d.toDateString() === yesterday.toDateString()) return 'Yesterday'
  return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
}

function statusClass(s: string): string {
  if (s === 'Approved' || s === 'Completed' || s === 'completed') return 'text-[#18b8b0]'
  if (s === 'Pending' || s === 'pending') return 'text-amber-500'
  return 'text-red-400'
}

const filteredItems = computed(() => {
  if (activeFilter.value === 'All') return allItems.value
  if (activeFilter.value === 'Deposit')    return allItems.value.filter(i => i.type === 'Deposit')
  if (activeFilter.value === 'Withdrawal') return allItems.value.filter(i => i.type === 'Withdrawal')
  if (activeFilter.value === 'Transfer')   return allItems.value.filter(i => i.type.startsWith('Transfer'))
  return allItems.value
})

const groupedItems = computed(() => {
  const groups: { label: string; items: TxItem[] }[] = []
  const map = new Map<string, TxItem[]>()
  for (const item of filteredItems.value) {
    const label = dayLabel(item.created_at)
    if (!map.has(label)) map.set(label, [])
    map.get(label)!.push(item)
  }
  for (const [label, items] of map.entries()) {
    groups.push({ label, items })
  }
  return groups
})

async function load() {
  if (!auth.accessToken) return
  loading.value = true
  try {
    const [depData, wdrData, trfData] = await Promise.all([
      makeWalletApi(auth.accessToken).getDeposits(),
      makeWalletApi(auth.accessToken).getWithdrawals(),
      makeWalletApi(auth.accessToken).getTransfers(),
    ])
    const items: TxItem[] = []
    for (const d of depData.deposits) {
      items.push({ id: d.id, type: 'Deposit', asset: 'USDT', icon: 'mdi:arrow-down-circle-outline', amount: '+' + fmtAmt(d.amount) + ' USDT', time: fmtDate(d.created_at), status: d.status_deposit, positive: true, created_at: d.created_at })
    }
    for (const w of wdrData.withdrawals) {
      const parts = (w.network ?? '').split('|')
      const coin  = parts.length > 1 ? parts[0] : 'USDT'
      items.push({ id: w.id, type: 'Withdrawal', asset: coin, icon: 'mdi:arrow-up-circle-outline', amount: '-' + fmtAmt(w.amount) + ' ' + coin, time: fmtDate(w.created_at), status: w.status_withdrawal, positive: false, created_at: w.created_at })
    }
    for (const t of trfData.transfers) {
      const isIn = t.direction === 'received'
      const label = isIn ? `from ${t.sender_name ?? '?'}` : `to ${t.recipient_name ?? '?'}`
      items.push({ id: t.id, type: isIn ? 'Transfer In' : 'Transfer Out', asset: `${t.coin} — ${label}`, icon: 'mdi:swap-horizontal-circle-outline', amount: (isIn ? '+' : '-') + fmtAmt(t.amount) + ' ' + t.coin, time: fmtDate(t.created_at), status: 'Completed', positive: isIn, created_at: t.created_at })
    }
    items.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    allItems.value = items
  } catch { /* silently fail */ }
  finally { loading.value = false }
}

onMounted(load)
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
</style>
