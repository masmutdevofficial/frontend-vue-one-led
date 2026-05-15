<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Icon } from '@iconify/vue'
import DashboardLayout from '../../layouts/DashboardLayout.vue'

const router = useRouter()
const biometricEnabled = ref(true)

const securityItems = [
  { title: 'Change Password', desc: 'Update your password regularly', icon: 'mdi:lock-outline', type: 'link' },
  { title: 'Biometric Login', desc: 'Use biometrics to log in securely', icon: 'mdi:fingerprint', type: 'toggle' },
  { title: 'Two-Factor Authentication', desc: 'Add an extra layer of security', icon: 'mdi:shield-key-outline', type: 'link' },
  { title: 'Anti-Phishing Code', desc: 'Protect yourself from phishing attacks', icon: 'mdi:email-outline', type: 'link' },
  { title: 'Login History', desc: 'Review your recent login activity', icon: 'mdi:clock-outline', type: 'link' },
  { title: 'Manage Devices', desc: 'Manage devices with access to your account', icon: 'mdi:monitor-cellphone', type: 'link' },
]
</script>

<template>
  <DashboardLayout>
    <section class="min-h-screen bg-[#f6f8fb] px-4 pt-6 pb-10">
      <div class="mx-auto ">
        <div class="flex items-center gap-3">
          <button @click="router.back()" class="flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-sm active:scale-95">
            <Icon icon="mdi:arrow-left" class="text-[22px] text-[#17212f]" />
          </button>
          <h1 class="text-[28px] font-semibold leading-none tracking-tight text-[#17212f]">Security</h1>
        </div>

        <p class="mt-4 text-[15px] font-semibold text-[#5b6d9a]">Protect your account and assets.</p>

        <div class="mt-6 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
          <div
            v-for="item in securityItems"
            :key="item.title"
            class="flex w-full items-center justify-between border-b border-gray-100 px-4 py-5 text-left last:border-b-0 active:bg-gray-50"
          >
            <div class="flex items-center gap-4">
              <div class="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#eafffb]">
                <Icon :icon="item.icon" class="text-[28px] text-[#20c7b7]" />
              </div>
              <div>
                <h2 class="text-[15px] font-semibold text-[#101b3f]">{{ item.title }}</h2>
                <p class="mt-1 text-[12px] font-semibold text-[#5b6d9a]">{{ item.desc }}</p>
              </div>
            </div>

            <template v-if="item.type === 'toggle'">
              <button
                @click="biometricEnabled = !biometricEnabled"
                class="relative h-8 w-14 shrink-0 rounded-full transition-colors duration-200"
                :class="biometricEnabled ? 'bg-[#12c7b2]' : 'bg-gray-200'"
              >
                <span
                  class="absolute top-0.75 h-6.5 w-6.5 rounded-full bg-white shadow-sm transition-all duration-200"
                  :class="biometricEnabled ? 'left-6.75' : 'left-0.75'"
                ></span>
              </button>
            </template>
            <template v-else>
              <Icon icon="mdi:chevron-right" class="text-[24px] text-[#6b82c4]" />
            </template>
          </div>
        </div>
      </div>
    </section>
  </DashboardLayout>
</template>
