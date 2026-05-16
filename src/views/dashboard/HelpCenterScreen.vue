<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { Icon } from '@iconify/vue'
import DashboardLayout from '../../layouts/DashboardLayout.vue'

const router = useRouter()
const search = ref('')
const openFaq = ref<number | null>(null)

const faqs = [
  {
    q: 'How do I deposit funds?',
    a: 'Go to Add Funds, choose Crypto Deposit or P2P, select your asset, then follow the instructions shown on the screen.',
  },
  {
    q: 'How do I withdraw crypto?',
    a: 'Go to Withdraw, select the asset and network, paste the wallet address, enter the amount, then confirm the withdrawal.',
  },
  {
    q: 'How to reset my password?',
    a: 'Go to Login, tap Forgot Password, enter your email, then follow the OTP verification steps.',
  },
  {
    q: 'How does copy trade work?',
    a: 'Choose a trader, review their performance, risk level, and strategy, then tap Join to follow their trading signals or copy their strategy.',
  },
  {
    q: 'What is 2FA?',
    a: '2FA is an extra security layer that protects your account using a second verification step, such as OTP, authenticator app, or biometric login.',
  },
]

const filteredFaqs = computed(() => {
  const q = search.value.trim().toLowerCase()
  if (!q) return faqs
  return faqs.filter(f => f.q.toLowerCase().includes(q) || f.a.toLowerCase().includes(q))
})

const supportCards = [
  { title: 'Live Chat', desc: 'Chat with our support team in real time.', icon: 'mdi:chat-outline' },
  { title: 'Email Support', desc: 'Send us an email and we\'ll get back to you.', icon: 'mdi:email-outline' },
]

function openMailSupport() {
  window.open('mailto:support@oneledger.com', '_blank')
}
</script>

<template>
  <DashboardLayout>
    <section class="min-h-screen bg-[#f6f8fb] px-4 pt-6 pb-10">
      <div class="mx-auto ">
        <div class="flex items-center gap-3">
          <button @click="router.back()" class="flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-sm active:scale-95">
            <Icon icon="mdi:arrow-left" class="text-[22px] text-[#17212f]" />
          </button>
          <h1 class="text-[28px] font-semibold leading-none tracking-tight text-[#17212f]">Help Center</h1>
        </div>

        <p class="mt-4 text-[15px] font-semibold text-[#5b6d9a]">Find answers and contact support.</p>

        <!-- Search -->
        <div class="mt-5 flex h-14 items-center gap-3 rounded-2xl border border-gray-100 bg-white px-4 shadow-sm focus-within:border-[#20c7b7]">
          <Icon icon="mdi:magnify" class="text-[26px] text-[#20c7b7]" />
          <input
            v-model="search"
            type="text"
            placeholder="Search help topics"
            class="w-full bg-transparent text-[13px] font-semibold text-[#101b3f] outline-none placeholder:text-[#7a86a4]"
          />
          <button v-if="search" @click="search = ''" class="text-gray-400 active:scale-95">
            <Icon icon="mdi:close-circle" class="text-[18px]" />
          </button>
        </div>

        <!-- FAQ -->
        <h2 class="mt-6 text-[17px] font-semibold text-[#101b3f]">Frequently Asked Questions</h2>

        <div v-if="filteredFaqs.length" class="mt-4 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
          <div
            v-for="(faq, idx) in filteredFaqs"
            :key="faq.q"
            class="border-b border-gray-100 last:border-b-0"
          >
            <button
              class="flex w-full items-center gap-4 px-4 py-5 text-left active:bg-gray-50"
              @click="openFaq = openFaq === idx ? null : idx"
            >
              <div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#eafffb]">
                <Icon icon="mdi:help" class="text-[24px] text-[#20c7b7]" />
              </div>
              <span class="flex-1 text-[14px] font-semibold text-[#101b3f]">{{ faq.q }}</span>
              <Icon
                icon="mdi:chevron-down"
                class="shrink-0 text-[22px] text-[#6b82c4] transition-transform duration-200"
                :class="openFaq === idx ? 'rotate-180' : ''"
              />
            </button>
            <Transition
              enter-active-class="transition-all duration-200 ease-out"
              leave-active-class="transition-all duration-150 ease-in"
              enter-from-class="opacity-0 max-h-0"
              enter-to-class="opacity-100 max-h-40"
              leave-from-class="opacity-100 max-h-40"
              leave-to-class="opacity-0 max-h-0"
            >
              <div v-if="openFaq === idx" class="overflow-hidden px-4 pb-5">
                <p class="text-[13px] font-semibold leading-relaxed text-[#5b6d9a]">{{ faq.a }}</p>
              </div>
            </Transition>
          </div>
        </div>

        <div v-else class="mt-4 rounded-2xl border border-gray-100 bg-white p-6 text-center shadow-sm">
          <Icon icon="mdi:magnify-close" class="text-[36px] text-gray-300" />
          <p class="mt-2 text-[13px] font-semibold text-gray-400">No results for "{{ search }}"</p>
        </div>

        <!-- Support Cards -->
        <h2 class="mt-8 text-[17px] font-semibold text-[#101b3f]">Need more help?</h2>

        <div class="mt-4 grid grid-cols-2 gap-4">
          <button
            v-for="card in supportCards"
            :key="card.title"
            class="rounded-2xl border border-gray-100 bg-white p-5 text-left shadow-sm active:scale-[0.98]"
            @click="card.title === 'Email Support' && openMailSupport()"
          >
            <div class="flex h-12 w-12 items-center justify-center rounded-full bg-[#eafffb]">
              <Icon :icon="card.icon" class="text-[24px] text-[#20c7b7]" />
            </div>
            <div class="mt-4 flex items-end justify-between gap-2">
              <div>
                <h3 class="text-[15px] font-semibold text-[#101b3f]">{{ card.title }}</h3>
                <p class="mt-2 text-[12px] font-semibold leading-relaxed text-[#5b6d9a]">{{ card.desc }}</p>
              </div>
              <Icon icon="mdi:chevron-right" class="shrink-0 text-[24px] text-[#20c7b7]" />
            </div>
          </button>
        </div>
      </div>
    </section>
  </DashboardLayout>
</template>
