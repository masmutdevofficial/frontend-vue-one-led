<template>
  <DashboardLayout>
    <section class="min-h-screen bg-[#f6f8fb] px-4 pt-6 pb-10">
      <div class="mx-auto max-w-2xl">

        <!-- Header -->
        <div class="flex items-center gap-3">
          <button
            type="button"
            class="flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-sm active:scale-95"
            @click="router.back()"
          >
            <Icon icon="mdi:arrow-left" class="text-[22px] text-[#17212f]" />
          </button>
          <h1 class="text-[28px] font-semibold leading-none tracking-tight text-[#17212f]">Login History</h1>
        </div>

        <p class="mt-4 text-[15px] font-semibold text-[#5b6d9a]">Review your recent login activity.</p>

        <!-- Loading skeleton -->
        <div v-if="loading" class="mt-6 space-y-3">
          <div v-for="i in 6" :key="i" class="flex items-center gap-3 rounded-2xl bg-white p-4 shadow-sm">
            <div class="h-11 w-11 animate-pulse rounded-full bg-slate-200"></div>
            <div class="flex-1 space-y-2">
              <div class="h-3.5 w-36 animate-pulse rounded-full bg-slate-200"></div>
              <div class="h-3 w-52 animate-pulse rounded-full bg-slate-100"></div>
              <div class="h-3 w-28 animate-pulse rounded-full bg-slate-100"></div>
            </div>
          </div>
        </div>

        <!-- Empty -->
        <div v-else-if="history.length === 0" class="mt-20 text-center">
          <div class="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-slate-100">
            <Icon icon="mdi:clock-outline" class="text-4xl text-slate-300" />
          </div>
          <p class="text-base font-semibold text-slate-400">No login history yet.</p>
          <p class="mt-1 text-sm text-slate-400">Your login activity will appear here.</p>
        </div>

        <!-- List -->
        <div v-else class="mt-6 space-y-3">
          <div
            v-for="(record, i) in history"
            :key="record.id"
            class="flex items-start gap-4 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm shadow-slate-200/40"
          >
            <div class="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#eafffb]">
              <Icon :icon="deviceIcon(record.device_name)" class="text-[22px] text-[#20c7b7]" />
            </div>
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2 flex-wrap">
                <p class="text-sm font-semibold text-slate-900 truncate">{{ record.device_name ?? 'Unknown Device' }}</p>
                <span
                  v-if="i === 0"
                  class="shrink-0 rounded-full bg-teal-100 px-2 py-0.5 text-[11px] font-bold text-teal-600"
                >Latest</span>
              </div>
              <p class="mt-0.5 text-xs font-medium text-slate-500">{{ record.ip_address ?? 'Unknown IP' }}</p>
              <p class="mt-0.5 text-xs text-slate-400">{{ fmtDate(record.created_at) }}</p>
            </div>
          </div>
        </div>

      </div>
    </section>
  </DashboardLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Icon } from '@iconify/vue'
import DashboardLayout from '@/layouts/DashboardLayout.vue'
import { makeApi } from '@/services/api'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const auth   = useAuthStore()

interface LoginRecord {
  id:          number
  ip_address:  string | null
  device_name: string | null
  created_at:  string
}

const history = ref<LoginRecord[]>([])
const loading = ref(true)

onMounted(async () => {
  try {
    const data = await makeApi(auth.accessToken!).get<{ history: LoginRecord[] }>('/login-history')
    history.value = data.history
  } catch {
    history.value = []
  } finally {
    loading.value = false
  }
})

function fmtDate(d: string) {
  return new Date(d).toLocaleString('id-ID', {
    day:    '2-digit',
    month:  'short',
    year:   'numeric',
    hour:   '2-digit',
    minute: '2-digit',
  })
}

function deviceIcon(name: string | null) {
  const n = (name ?? '').toLowerCase()
  if (n.includes('iphone') || n.includes('ipad') || n.includes('android')) return 'mdi:cellphone'
  if (n.includes('mac'))    return 'mdi:apple'
  if (n.includes('windows') || n.includes('linux')) return 'mdi:monitor'
  return 'mdi:devices'
}
</script>
