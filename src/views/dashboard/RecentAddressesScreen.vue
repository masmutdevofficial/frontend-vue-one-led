<template>
  <DashboardLayout>
    <div class="min-h-screen bg-[#f6f8fb] pb-28">
      <!-- HEADER -->
      <div class="sticky top-0 z-20 flex items-center gap-3 bg-[#f6f8fb] px-4 pb-3 pt-5">
        <button @click="router.back()" class="flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-sm active:scale-95">
          <Icon icon="mdi:arrow-left" class="text-[20px] text-[#17212f]" />
        </button>
        <h1 class="text-[16px] font-semibold text-[#17212f]">Recent Addresses</h1>
      </div>

      <!-- LOADING SKELETON -->
      <div v-if="loading" class="mt-4 px-4 space-y-3">
        <div v-for="i in 5" :key="i" class="flex items-center justify-between rounded-2xl bg-white px-4 py-4 shadow-sm animate-pulse">
          <div class="flex items-center gap-3">
            <div class="h-10 w-10 rounded-full bg-gray-100"></div>
            <div class="space-y-1.5">
              <div class="h-2.5 w-28 rounded bg-gray-100"></div>
              <div class="h-2 w-40 rounded bg-gray-100"></div>
              <div class="h-2 w-20 rounded bg-gray-100"></div>
            </div>
          </div>
          <div class="space-y-1.5 text-right">
            <div class="h-2.5 w-16 rounded bg-gray-100 ml-auto"></div>
            <div class="h-2 w-12 rounded bg-gray-100 ml-auto"></div>
          </div>
        </div>
      </div>

      <!-- EMPTY STATE -->
      <div v-else-if="addresses.length === 0" class="flex flex-col items-center pt-20 text-gray-300">
        <Icon icon="mdi:map-marker-off-outline" class="text-5xl" />
        <p class="mt-3 text-[12px] font-semibold">No withdrawal addresses yet</p>
      </div>

      <!-- LIST -->
      <div v-else class="mt-4 px-4">
        <div class="overflow-hidden rounded-2xl bg-white shadow-sm">
          <div
            v-for="(item, idx) in addresses"
            :key="item.id"
            class="flex items-center justify-between px-4 py-4"
            :class="idx > 0 ? 'border-t border-gray-100' : ''"
          >
            <div class="flex items-center gap-3">
              <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#e9fffc]">
                <Icon icon="mdi:account-outline" class="text-[22px] text-[#18b8b0]" />
              </div>
              <div>
                <div class="flex items-center gap-2">
                  <p class="text-[12px] font-semibold text-[#17212f]">{{ item.coin }}</p>
                  <span class="rounded bg-[#e9fffc] px-1.5 py-px text-[7px] font-semibold text-[#10b8ad]">{{ item.network }}</span>
                </div>
                <p class="mt-0.5 text-[10px] font-semibold text-gray-400 max-w-[190px] truncate">{{ item.address }}</p>
                <p class="mt-0.5 text-[10px] font-semibold text-gray-400">{{ item.date }}</p>
              </div>
            </div>
            <div class="text-right">
              <p class="text-[12px] font-semibold text-[#17212f]">{{ item.amount }}</p>
              <p class="mt-1 text-[10px] font-semibold"
                :class="item.status === 'Approved' || item.status === 'Completed' ? 'text-[#18b8b0]' : item.status === 'Pending' ? 'text-amber-500' : 'text-red-400'">
                {{ item.status }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </DashboardLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Icon } from '@iconify/vue'
import { useRouter } from 'vue-router'
import DashboardLayout from '@/layouts/DashboardLayout.vue'
import { useAuthStore } from '@/stores/auth'
import { makeWalletApi } from '@/services/api'

const router = useRouter()
const auth   = useAuthStore()
const loading = ref(false)

interface AddressItem {
  id: string; coin: string; network: string; address: string
  amount: string; date: string; status: string
}

const addresses = ref<AddressItem[]>([])

function fmtDate(iso: string): string {
  const d = new Date(iso)
  const now = new Date()
  const yesterday = new Date(now); yesterday.setDate(yesterday.getDate() - 1)
  const time = d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
  if (d.toDateString() === now.toDateString())       return `Today, ${time}`
  if (d.toDateString() === yesterday.toDateString()) return `Yesterday, ${time}`
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) + ', ' + time
}

async function load() {
  if (!auth.accessToken) return
  loading.value = true
  try {
    const data = await makeWalletApi(auth.accessToken).getWithdrawals()
    addresses.value = data.withdrawals.map(w => {
      const parts   = (w.network ?? '').split('|')
      const coin    = parts.length > 1 ? parts[0] : 'USDT'
      const network = parts.length > 1 ? parts[1] : (w.network ?? '')
      const amt     = parseFloat(w.amount as unknown as string)
        .toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
      return {
        id: w.id, coin, network, address: w.address ?? '',
        amount: amt + ' ' + coin,
        date: fmtDate(w.created_at),
        status: w.status_withdrawal,
      }
    })
  } catch { /* silently fail */ }
  finally { loading.value = false }
}

onMounted(load)
</script>
