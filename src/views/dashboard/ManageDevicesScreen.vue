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
          <h1 class="text-[28px] font-semibold leading-none tracking-tight text-[#17212f]">Active Devices</h1>
        </div>

        <p class="mt-4 text-[15px] font-semibold text-[#5b6d9a]">Sessions currently logged in to your account.</p>

        <!-- Loading skeleton -->
        <div v-if="loading" class="mt-6 space-y-3">
          <div v-for="i in 4" :key="i" class="flex items-center gap-3 rounded-2xl bg-white p-4 shadow-sm">
            <div class="h-12 w-12 animate-pulse rounded-full bg-slate-200"></div>
            <div class="flex-1 space-y-2">
              <div class="h-3.5 w-36 animate-pulse rounded-full bg-slate-200"></div>
              <div class="h-3 w-48 animate-pulse rounded-full bg-slate-100"></div>
              <div class="h-3 w-28 animate-pulse rounded-full bg-slate-100"></div>
            </div>
            <div class="h-8 w-16 animate-pulse rounded-2xl bg-slate-100"></div>
          </div>
        </div>

        <!-- Empty -->
        <div v-else-if="devices.length === 0" class="mt-20 text-center">
          <div class="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-slate-100">
            <Icon icon="mdi:monitor-cellphone" class="text-4xl text-slate-300" />
          </div>
          <p class="text-base font-semibold text-slate-400">No active sessions found.</p>
          <p class="mt-1 text-sm text-slate-400">Your logged-in devices will appear here.</p>
        </div>

        <!-- List -->
        <div v-else class="mt-6 space-y-3">
          <div
            v-for="device in devices"
            :key="device.id"
            class="flex items-start gap-4 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm shadow-slate-200/40"
          >
            <div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#eafffb]">
              <Icon :icon="deviceIcon(device.device_name)" class="text-2xl text-[#20c7b7]" />
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-semibold text-slate-900">{{ device.device_name ?? 'Unknown Device' }}</p>
              <p class="mt-0.5 text-xs font-medium text-slate-500">{{ device.ip_address ?? 'Unknown IP' }}</p>
              <p class="mt-0.5 text-xs text-slate-400">Last seen: {{ fmtDate(device.last_seen_at) }}</p>
            </div>
            <button
              type="button"
              class="mt-0.5 shrink-0 rounded-2xl bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600 transition hover:bg-red-100 active:scale-95 disabled:opacity-40"
              :disabled="revokingId === device.id"
              @click="revokeDevice(device.id)"
            >
              <span v-if="revokingId === device.id">
                <svg class="size-3.5 animate-spin inline" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" stroke-dasharray="31" stroke-dashoffset="12" />
                </svg>
              </span>
              <span v-else>Revoke</span>
            </button>
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
import { useToast } from '@/composables/useToast'

const router = useRouter()
const auth   = useAuthStore()
const toast  = useToast()

interface DeviceSession {
  id:           string
  ip_address:   string | null
  device_name:  string | null
  user_agent:   string | null
  last_seen_at: string
  created_at:   string
}

const devices    = ref<DeviceSession[]>([])
const loading    = ref(true)
const revokingId = ref<string | null>(null)

onMounted(async () => {
  try {
    const data = await makeApi(auth.accessToken!).get<{ devices: DeviceSession[] }>('/devices')
    devices.value = data.devices
  } catch {
    devices.value = []
  } finally {
    loading.value = false
  }
})

async function revokeDevice(id: string) {
  if (!confirm('Remove this device session?')) return
  revokingId.value = id
  try {
    await makeApi(auth.accessToken!).delete(`/devices/${id}`)
    devices.value = devices.value.filter(d => d.id !== id)
    toast.success('Device session removed.')
  } catch {
    toast.error('Failed to remove device.')
  } finally {
    revokingId.value = null
  }
}

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
