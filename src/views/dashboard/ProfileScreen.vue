<template>
  <DashboardLayout>
  <!-- About Modal -->
  <Teleport to="body">
    <Transition name="sheet">
      <div v-if="showAbout" class="fixed inset-0 z-50 flex flex-col">
        <div class="absolute inset-0 bg-black/40 backdrop-blur-sm" @click="showAbout = false"></div>
        <div class="relative mt-auto max-h-[90vh] w-full overflow-y-auto rounded-t-3xl bg-white px-6 pt-5 pb-10 shadow-2xl lg:mx-auto lg:mb-auto lg:mt-auto lg:max-w-lg lg:rounded-3xl">
          <div class="mb-5 flex items-center justify-between">
            <h3 class="text-xl font-semibold text-slate-950">Info &amp; Legal</h3>
            <button type="button" class="grid size-9 place-items-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 transition" @click="showAbout = false">
              <Icon icon="mdi:close" class="size-5" />
            </button>
          </div>

          <div class="space-y-5 text-sm leading-6 text-slate-600">
            <p>Oneledger is a digital crypto wallet platform designed to help users manage, monitor, and access their digital assets in a simple and secure way.</p>
            <p>Our platform provides wallet access, portfolio tracking, fund monitoring, and crypto-related tools to support a smoother digital asset experience.</p>

            <div>
              <h4 class="mb-2 text-sm font-semibold text-slate-950">Legal Information</h4>
              <p>By using Oneledger, you agree to use the platform responsibly and understand that digital assets involve market risk. Crypto prices may fluctuate, and users are fully responsible for their own asset decisions, transactions, and account security.</p>
            </div>
            <p>Oneledger does not provide financial advice, investment recommendations, or guaranteed returns. Any information shown in the app, including portfolio data, market movement, tracking funds, or copy trade features, is provided for informational purposes only.</p>

            <div>
              <h4 class="mb-2 text-sm font-semibold text-slate-950">Security &amp; Responsibility</h4>
              <p>Users are responsible for keeping their login details, password, OTP, recovery access, and device secure. Oneledger will never ask for your password, OTP, or private credentials outside the official platform.</p>
            </div>
            <p>Please make sure all transaction details, wallet addresses, and transfer information are correct before confirming any activity. Crypto transactions may be irreversible once processed.</p>

            <div>
              <h4 class="mb-2 text-sm font-semibold text-slate-950">Risk Disclaimer</h4>
              <p>Copy trading, crypto trading, and digital asset activities involve risk. Past performance does not guarantee future results. Users should understand the risks before making any transaction or following any trading strategy.</p>
            </div>

            <div>
              <h4 class="mb-2 text-sm font-semibold text-slate-950">Privacy</h4>
              <p>Oneledger respects user privacy and is committed to protecting account information according to applicable privacy and security standards.</p>
            </div>

            <p>For support, legal inquiries, or platform-related questions, please contact the Oneledger support team.</p>
          </div>

          <button
            type="button"
            class="mt-6 w-full rounded-2xl bg-teal-500 py-3.5 text-sm font-semibold text-white transition active:scale-95 hover:bg-teal-600"
            @click="showAbout = false"
          >
            I Understand
          </button>
        </div>
      </div>
    </Transition>
  </Teleport>

  <!-- Edit Profile Modal -->
  <Teleport to="body">
    <Transition name="sheet">
      <div v-if="showEditProfile" class="fixed inset-0 z-50 flex flex-col">
        <div class="absolute inset-0 bg-black/40 backdrop-blur-sm" @click="showEditProfile = false"></div>
        <div class="relative mt-auto max-h-[90vh] w-full overflow-y-auto rounded-t-3xl bg-white px-6 pt-5 pb-10 shadow-2xl lg:mx-auto lg:mb-auto lg:mt-auto lg:max-w-lg lg:rounded-3xl">
          <div class="mb-5 flex items-center justify-between">
            <h3 class="text-xl font-semibold text-slate-950">Edit Profile</h3>
            <button type="button" class="grid size-9 place-items-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 transition" @click="showEditProfile = false">
              <Icon icon="mdi:close" class="size-5" />
            </button>
          </div>

          <p v-if="saveError" class="mb-3 rounded-xl bg-red-50 px-4 py-2 text-sm font-semibold text-red-500">{{ saveError }}</p>
          <form @submit.prevent="submitEdit" class="space-y-4">
            <div>
              <label class="mb-1.5 block text-sm font-semibold text-slate-700">Username</label>
              <input
                v-model="editForm.name"
                type="text"
                autocomplete="off"
                placeholder="Enter your username"
                class="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-950 placeholder:text-slate-400 focus:border-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-100"
              />
            </div>

            <div>
              <label class="mb-1.5 block text-sm font-semibold text-slate-700">Email</label>
              <input
                v-model="editForm.email"
                type="email"
                autocomplete="off"
                placeholder="Enter your email address"
                class="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-950 placeholder:text-slate-400 focus:border-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-100"
              />
            </div>

            <div>
              <label class="mb-1.5 block text-sm font-semibold text-slate-700">Bank</label>
              <input
                v-model="editForm.bank"
                type="text"
                autocomplete="off"
                placeholder="Enter your bank name"
                class="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-950 placeholder:text-slate-400 focus:border-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-100"
              />
            </div>

            <div>
              <label class="mb-1.5 block text-sm font-semibold text-slate-700">Bank Account</label>
              <input
                v-model="editForm.bankAccount"
                type="text"
                autocomplete="off"
                placeholder="Enter your bank account number"
                class="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-950 placeholder:text-slate-400 focus:border-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-100"
              />
            </div>

            <div>
              <label class="mb-1.5 block text-sm font-semibold text-slate-700">Country / Region</label>
              <input
                v-model="editForm.countryRegion"
                type="text"
                autocomplete="off"
                placeholder="Enter your country or region"
                class="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-950 placeholder:text-slate-400 focus:border-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-100"
              />
            </div>

            <button
              type="submit"
              :disabled="saving"
              class="mt-2 w-full rounded-2xl bg-teal-500 py-3.5 text-sm font-semibold text-white transition active:scale-95 hover:bg-teal-600 disabled:opacity-60"
            >
              {{ saving ? 'Saving…' : 'Save Changes' }}
            </button>
          </form>
        </div>
      </div>
    </Transition>
  </Teleport>

  <!-- Help Center Modal -->
  <Teleport to="body">
    <Transition name="sheet">
      <div v-if="showHelp" class="fixed inset-0 z-50 flex flex-col">
        <div class="absolute inset-0 bg-black/40 backdrop-blur-sm" @click="showHelp = false"></div>
        <div class="relative mt-auto max-h-[90vh] w-full overflow-y-auto rounded-t-3xl bg-white px-6 pt-5 pb-10 shadow-2xl lg:mx-auto lg:mb-auto lg:mt-auto lg:max-w-lg lg:rounded-3xl">
          <div class="mb-5 flex items-center justify-between">
            <h3 class="text-xl font-semibold text-slate-950">Help Center</h3>
            <button type="button" class="grid size-9 place-items-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 transition" @click="showHelp = false">
              <Icon icon="mdi:close" class="size-5" />
            </button>
          </div>

          <div class="space-y-3">
            <div
              v-for="(qa, idx) in helpQA"
              :key="idx"
              class="overflow-hidden rounded-2xl border border-slate-100 bg-slate-50"
            >
              <button
                type="button"
                class="flex w-full items-center justify-between gap-3 px-4 py-4 text-left"
                @click="openQA = openQA === idx ? null : idx"
              >
                <span class="text-sm font-semibold text-slate-950">{{ qa.q }}</span>
                <Icon
                  icon="mdi:chevron-down"
                  class="size-5 shrink-0 text-slate-400 transition-transform duration-200"
                  :class="openQA === idx ? 'rotate-180' : ''"
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
                <div v-if="openQA === idx" class="px-4 pb-4">
                  <p class="text-sm leading-6 text-slate-500">{{ qa.a }}</p>
                </div>
              </Transition>
            </div>
          </div>

          <div class="mt-6 rounded-2xl bg-teal-50 p-4">
            <p class="text-sm font-semibold text-slate-950">Still need help?</p>
            <p class="mt-1 text-xs font-semibold text-slate-500">Our support team is ready to assist you.</p>
            <button
              type="button"
              class="mt-3 rounded-full bg-teal-500 px-5 py-2 text-xs font-semibold text-white active:scale-95 transition"
              @click="() => { openMailSupport(); showHelp = false }"
            >
              Contact Support
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>

  <section class="min-h-screen bg-[#f6f8fb] px-4 pt-6 pb-8 lg:px-7">
    <div class="mx-auto max-w-7xl">
    <header class="flex items-center justify-start">
      <h2 class="text-4xl font-semibold tracking-tight text-slate-950">Profile</h2>
    </header>

    <div class="mt-8 rounded-3xl border border-slate-100 bg-white p-5 shadow-lg shadow-slate-200/50">
      <div class="flex items-center gap-5">
        <div class="relative">
          <div class="grid size-28 place-items-center overflow-hidden rounded-full bg-linear-to-br from-teal-100 to-teal-400 text-white">
            <img
              v-if="auth.user?.profile"
              :src="auth.user.profile"
              :alt="displayName"
              class="size-full object-cover"
              @error="($event.target as HTMLImageElement).style.display='none'"
            />
            <Icon v-else icon="mdi:account" class="size-20" />
          </div>
          <span class="absolute bottom-1 right-0 grid size-10 place-items-center rounded-full border-4 border-white bg-white text-slate-500 shadow-md">
            <Icon icon="mdi:camera-outline" class="size-5" />
          </span>
        </div>

        <div class="min-w-0 flex-1">
          <div class="flex items-center justify-between gap-2">
            <div class="min-w-0">
              <h3 class="truncate text-2xl font-semibold text-slate-950">{{ displayName }}</h3>
              <p class="mt-1 truncate text-sm font-semibold text-slate-500">{{ displayEmail }}</p>
              <p class="mt-1 text-xs font-bold text-slate-400">UID: {{ displayUid }}</p>
            </div>
            <button type="button" @click="openEdit" class="grid place-items-center">
              <Icon icon="mdi:chevron-right" class="size-7 text-slate-400" />
            </button>
          </div>
          <span v-if="isVerified" class="mt-3 inline-flex items-center gap-2 rounded-full bg-teal-50 px-3 py-1 text-sm font-normal text-teal-500">
            <Icon icon="mdi:shield-check-outline" class="size-4" />Verified
          </span>
          <span v-else class="mt-3 inline-flex items-center gap-2 rounded-full bg-amber-50 px-3 py-1 text-sm font-normal text-amber-500">
            <Icon icon="mdi:shield-alert-outline" class="size-4" />Unverified
          </span>
        </div>
      </div>

      <div class="mt-6 grid grid-cols-2 divide-x divide-slate-100 border-t border-slate-100 pt-5">
        <div class="flex items-center gap-4 pr-4">
          <Icon icon="mdi:shield-outline" class="size-9 text-slate-500" />
          <div>
            <p class="text-sm font-semibold text-slate-500">Account Security</p>
            <p class="mt-1 text-sm font-semibold" :class="securityColor">{{ securityLevel }}</p>
          </div>
        </div>
        <div class="flex items-center gap-4 pl-5">
          <Icon icon="mdi:clock-outline" class="size-9 text-slate-500" />
          <div>
            <p class="text-sm font-semibold text-slate-500">Member Since</p>
            <p class="mt-1 text-sm font-semibold text-slate-950">{{ memberSince }}</p>
          </div>
        </div>
      </div>
    </div>

    <div class="mt-6 overflow-hidden rounded-3xl border border-slate-100 bg-teal-50/70 shadow-sm">
      <div class="flex items-center gap-3 p-5">
        <div class="flex-1 min-w-0">
          <h3 class="text-base font-semibold text-slate-950">Grow your crypto portfolio</h3>
          <p class="mt-1.5 text-xs font-semibold leading-5 text-slate-500">Track performance, analyze trends, and grow your digital assets.</p>
          <button type="button" class="mt-3 rounded-full border border-teal-200 bg-white/60 px-4 py-1.5 text-xs font-semibold text-teal-500">
            View Portfolio ›
          </button>
        </div>
        <div class="h-24 w-28 shrink-0 overflow-hidden rounded-2xl">
          <img src="/images/crypto-wallet-stock.png" alt="Portfolio illustration" class="h-full w-full object-cover opacity-80" />
        </div>
      </div>
    </div>

    <div class="mt-6 overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-lg shadow-slate-200/40">
      <button v-for="item in menuItems" :key="item.title" type="button" class="flex w-full items-center gap-4 border-b border-slate-100 px-5 py-5 text-left last:border-b-0" @click="item.action?.()">
        <span class="grid size-12 place-items-center rounded-2xl bg-teal-50 text-teal-500">
          <Icon :icon="item.icon" class="size-6" />
        </span>
        <span class="flex-1">
          <span class="block text-lg font-semibold text-slate-950">{{ item.title }}</span>
          <span class="mt-1 block text-sm font-semibold text-slate-500">{{ item.desc }}</span>
        </span>
        <Icon icon="mdi:chevron-right" class="size-7 text-slate-400" />
      </button>
    </div>

    <button type="button" class="mt-6 flex w-full items-center justify-center gap-3 rounded-2xl border border-slate-100 bg-white px-6 py-5 text-base font-normal text-red-500 shadow-sm" @click="handleLogout">
      <Icon icon="mdi:logout" class="size-6" />Log Out
    </button>
    </div>
  </section>
  </DashboardLayout>
</template>
<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Icon } from '@iconify/vue'
import DashboardLayout from '@/layouts/DashboardLayout.vue'
import { useAuthStore } from '@/stores/auth'
import { makeUserApi } from '@/services/api'

const router = useRouter()
const auth   = useAuthStore()

// ── Fetch full profile on mount ──────────────────────────────────────────────
onMounted(() => { auth.refreshProfile() })

// ── Derived display values ───────────────────────────────────────────────────
const displayName = computed(() => auth.profile?.username ?? auth.user?.username ?? 'User')
const displayEmail = computed(() => auth.profile?.email   ?? auth.user?.email    ?? '')
const displayUid  = computed(() => {
  const id = auth.user?.id ?? ''
  // Show first 8 chars grouped as XXXX-XXXX
  return id.length >= 8 ? `${id.slice(0, 4).toUpperCase()}-${id.slice(4, 8).toUpperCase()}` : id
})
const memberSince = computed(() => {
  const d = auth.profile?.member_since
  if (!d) return '—'
  return new Date(d).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
})
const isVerified = computed(() => {
  const s = auth.profile?.ktp_status
  return s === 'Verified' || s === 'verified' || s === 'approved'
})
const securityLevel = computed(() => {
  const twofa  = auth.profile?.twofa_enabled ?? false
  const credit = auth.profile?.credit_score  ?? 100
  if (twofa && credit >= 80) return 'High'
  if (credit >= 60)          return 'Medium'
  return 'Low'
})
const securityColor = computed(() => ({
  High:   'text-teal-500',
  Medium: 'text-amber-500',
  Low:    'text-red-400',
}[securityLevel.value]))

// ── Edit form ────────────────────────────────────────────────────────────────
const showAbout       = ref(false)
const showHelp        = ref(false)
const showEditProfile = ref(false)
const openQA          = ref<number | null>(null)
const saving          = ref(false)
const saveError       = ref('')

const editForm = ref({
  name:          '',
  email:         '',
  bank:          '',
  bankAccount:   '',
  countryRegion: '',
})

function openEdit() {
  editForm.value = {
    name:          auth.profile?.username    ?? auth.user?.username ?? '',
    email:         auth.profile?.email       ?? auth.user?.email    ?? '',
    bank:          auth.profile?.bank        ?? '',
    bankAccount:   auth.profile?.bank_account ?? '',
    countryRegion: auth.profile?.country     ?? '',
  }
  saveError.value = ''
  showEditProfile.value = true
}

async function submitEdit() {
  if (!auth.accessToken) return
  saving.value    = true
  saveError.value = ''
  try {
    await makeUserApi(auth.accessToken).updateProfile({
      username:     editForm.value.name         || undefined,
      email:        editForm.value.email        || undefined,
      bank:         editForm.value.bank         || undefined,
      bank_account: editForm.value.bankAccount  || undefined,
      country:      editForm.value.countryRegion || undefined,
    })
    await auth.refreshProfile()
    showEditProfile.value = false
  } catch (e: any) {
    saveError.value = e?.message ?? 'Failed to save. Please try again.'
  } finally {
    saving.value = false
  }
}

async function handleLogout() {
  await auth.logout()
  router.push('/login')
}

const helpQA = [
  { q: 'How do I deposit funds?',     a: 'Go to Add Funds, choose Crypto Deposit or P2P, select your asset, then follow the instructions shown on the screen.' },
  { q: 'How do I withdraw crypto?',   a: 'Go to Withdraw, select the asset and network, paste the wallet address, enter the amount, then confirm the withdrawal.' },
  { q: 'How to reset my password?',   a: 'Go to Login, tap Forgot Password, enter your email, then follow the OTP verification steps.' },
  { q: 'How does copy trade work?',   a: 'Choose a trader, review their performance, risk level, and strategy, then tap Join to follow their trading signals or copy their strategy.' },
  { q: 'What is 2FA?',                a: '2FA is an extra security layer that protects your account using a second verification step, such as OTP, authenticator app, or biometric login.' },
]

interface MenuItem { icon: string; title: string; desc: string; action?: () => void }

const menuItems: MenuItem[] = [
  { icon: 'mdi:lock-outline',                 title: 'Security',      desc: 'Password, 2FA, Biometric',               action: () => router.push('/security') },
  { icon: 'mdi:chart-line',                   title: 'Tracking Funds', desc: 'Monitor your fund activity',            action: () => router.push('/tracking-funds') },
  { icon: 'mdi:bell-outline',                 title: 'Notifications', desc: 'Manage your alerts and preferences',     action: () => router.push('/notifications') },
  { icon: 'mdi:card-account-details-outline', title: 'Verification',  desc: 'Identity and account verification',     action: () => router.push('/verification') },
  { icon: 'mdi:help-circle-outline',          title: 'Help Center',   desc: 'Get help and support',                  action: () => router.push('/help-center') },
  { icon: 'mdi:information-outline',          title: 'About',         desc: 'App info and legal',                    action: () => { showAbout.value = true } },
]

function openMailSupport() {
  window.open('mailto:support@oneledger.com', '_blank')
}
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
