<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Icon } from '@iconify/vue'
import DashboardLayout from '../../layouts/DashboardLayout.vue'

const router = useRouter()

const notifications = ref([
  { title: 'Deposit Notifications',    desc: 'Get notified when a deposit is confirmed.',         icon: 'mdi:arrow-up-circle-outline',   iconClass: 'bg-orange-50 text-orange-400', enabled: true },
  { title: 'Withdrawal Notifications', desc: 'Get notified when a withdrawal is processed.',      icon: 'mdi:arrow-down-circle-outline', iconClass: 'bg-red-50 text-red-400',       enabled: true },
  { title: 'Transfer Notifications',   desc: 'Get notified when a fund transfer is completed.',   icon: 'mdi:swap-horizontal',           iconClass: 'bg-blue-50 text-sky-500',      enabled: true },
])
</script>

<template>
  <DashboardLayout>
    <section class="min-h-screen bg-[#f6f8fb] px-4 pt-6 pb-10">
      <div class="mx-auto ">
        <div class="flex items-center gap-3">
          <button @click="router.back()" class="flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-sm active:scale-95">
            <Icon icon="mdi:arrow-left" class="text-[22px] text-[#17212f]" />
          </button>
          <h1 class="text-[28px] font-semibold leading-none tracking-tight text-[#17212f]">Notification Settings</h1>
        </div>

        <p class="mt-4 text-[15px] font-semibold text-[#5b6d9a]">Manage your alerts and preferences.</p>

        <div class="mt-6 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
          <div
            v-for="(item, index) in notifications"
            :key="item.title"
            class="flex items-center justify-between border-b border-gray-100 px-4 py-5 last:border-b-0"
          >
            <div class="flex items-center gap-4">
              <div
                class="flex h-14 w-14 shrink-0 items-center justify-center rounded-full"
                :class="item.iconClass"
              >
                <Icon :icon="item.icon" class="text-[26px]" />
              </div>
              <div>
                <h2 class="text-[14px] font-semibold text-[#101b3f]">{{ item.title }}</h2>
                <p class="mt-1 text-[12px] font-semibold text-[#5b6d9a]">{{ item.desc }}</p>
              </div>
            </div>
            <button
              @click="notifications[index].enabled = !notifications[index].enabled"
              class="relative h-8 w-14 shrink-0 rounded-full transition-colors duration-200"
              :class="item.enabled ? 'bg-[#12c7b2]' : 'bg-gray-200'"
            >
              <span
                class="absolute top-0.75 h-6.5 w-6.5 rounded-full bg-white shadow-sm transition-all duration-200"
                :class="item.enabled ? 'left-6.75' : 'left-0.75'"
              ></span>
            </button>
          </div>
        </div>
      </div>
    </section>
  </DashboardLayout>
</template>
