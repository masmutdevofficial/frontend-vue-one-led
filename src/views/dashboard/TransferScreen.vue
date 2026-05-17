<template>
  <DashboardLayout>
    <div class="min-h-screen bg-[#f6f8fb] pb-28 text-[#17212f]">
      <!-- PAGE HEADER -->
      <div class="relative flex h-14 items-center justify-center border-b border-gray-100 bg-white px-4">
        <button
          @click="router.back()"
          class="absolute left-3 flex h-9 w-9 items-center justify-center rounded-xl bg-[#f6f8fb] active:scale-95"
        >
          <Icon icon="mdi:arrow-left" class="text-[24px] text-[#243142]" />
        </button>
        <h1 class="text-[16px] font-semibold text-[#17212f]">Transfer</h1>
        <div class="absolute right-4 flex items-center gap-4">
          <button class="active:scale-95" @click="showTransferGuide = true">
            <Icon icon="mdi:help-circle-outline" class="text-[21px] text-[#243142]" />
          </button>
          <button class="active:scale-95" @click="showTransferHistory = true">
            <Icon icon="mdi:file-document-outline" class="text-[21px] text-[#243142]" />
          </button>
        </div>
      </div>

      <!-- BALANCE CARD -->
      <section class="px-4">
        <div class="relative overflow-hidden rounded-2xl border border-gray-100 bg-white px-4 py-4 shadow-sm">
          <div class="absolute right-0 top-0 h-full w-[48%] bg-gradient-to-l from-cyan-100/80 via-cyan-50/60 to-transparent"></div>

          <div class="relative z-10 flex items-center justify-between">
            <div>
              <div class="flex items-center gap-1 text-[10px] font-bold text-gray-400">
                Available Balance
                <button @click="showBalance = !showBalance" class="active:scale-90">
                  <Icon :icon="showBalance ? 'mdi:eye-outline' : 'mdi:eye-off-outline'" class="text-[13px]" />
                </button>
              </div>
              <div class="mt-3 flex items-end gap-2">
                <h2 class="text-[26px] font-semibold leading-none tracking-tight">{{ showBalance ? balanceDisplay : '••••••' }}</h2>
                <button class="mb-1 flex items-center gap-1 text-[10px] font-semibold">
                  USDT
                  <Icon icon="mdi:chevron-down" class="text-[14px]" />
                </button>
              </div>
              <p class="mt-2 text-[10px] font-semibold text-gray-400">{{ showBalance ? '≈ $' + balanceDisplay : '≈ $••••••' }}</p>
            </div>

            <!-- Illustration -->
            <img src="/images/transfer-banner.webp" alt="Transfer" class="h-[82px] w-[125px] object-contain" />
          </div>
        </div>
      </section>

      <!-- FORM -->
      <section class="mt-4 px-4">
        <div class="rounded-2xl border border-gray-100 bg-white shadow-sm">
          <!-- Recipient -->
          <div class="border-b border-gray-100 px-4 py-4">
            <label class="text-[11px] font-semibold text-[#344054]">Recipient</label>

            <div class="mt-3 flex items-center rounded-xl bg-[#f6f8fb] p-1">
              <button
                v-for="type in recipientTypes"
                :key="type"
                @click="activeRecipientType = type"
                class="h-9 rounded-lg px-4 text-[10px] font-semibold transition"
                :class="activeRecipientType === type ? 'bg-[#eafffd] text-[#10b8ad]' : 'text-gray-400'"
              >
                {{ type }}
              </button>

              <div class="ml-2 flex flex-1 items-center justify-between">
                <input
                  v-model="recipient"
                  type="text"
                  placeholder="Enter UID or Email"
                  class="w-full bg-transparent text-[11px] font-semibold text-[#17212f] outline-none placeholder:text-gray-400"
                />
                <button class="ml-2 active:scale-95">
                  <Icon icon="mdi:qrcode-scan" class="text-[19px] text-[#10b8ad]" />
                </button>
              </div>
            </div>
          </div>

          <!-- Asset -->
          <button class="flex w-full items-center justify-between border-b border-gray-100 px-4 py-4 active:bg-gray-50">
            <span class="text-[11px] font-semibold text-[#344054]">Asset</span>
            <div class="flex items-center gap-2">
              <span class="flex h-7 w-7 items-center justify-center rounded-full bg-[#e8fffc]">
                <Icon icon="mdi:alpha-t-circle" class="text-[20px] text-[#10b8ad]" />
              </span>
              <div class="flex items-center gap-1">
                <span class="text-[12px] font-semibold text-[#17212f]">USDT</span>
                <span class="text-[10px] font-bold text-gray-400">Tether</span>
              </div>
            </div>
          </button>

          <!-- Amount -->
          <div class="border-b border-gray-100 px-4 py-4">
            <label class="text-[11px] font-semibold text-[#344054]">Amount</label>

            <div class="mt-3 flex items-center justify-between">
              <input
                v-model="amount"
                type="number"
                placeholder="Enter amount"
                class="w-full bg-transparent text-[12px] font-semibold text-[#17212f] outline-none placeholder:text-gray-400"
              />
              <div class="ml-3 flex items-center gap-3">
                <span class="text-[11px] font-semibold text-gray-400">USDT</span>
                <button @click="setMax" class="text-[11px] font-semibold text-[#10b8ad]">Max</button>
              </div>
            </div>

            <p class="mt-3 text-[10px] font-semibold text-gray-400">
              Available: <span class="font-semibold text-[#667085]">{{ balanceDisplay }} USDT</span>
            </p>
          </div>

          <!-- Note -->
          <div class="px-4 py-4">
            <label class="text-[11px] font-semibold text-[#344054]">
              Note <span class="text-gray-400">(Optional)</span>
            </label>

            <div class="mt-3 rounded-xl border border-gray-100 bg-[#f9fafb] px-3 py-3">
              <textarea
                v-model="note"
                rows="2"
                maxlength="50"
                placeholder="Add a note or message (optional)"
                class="w-full resize-none bg-transparent text-[11px] font-semibold text-[#17212f] outline-none placeholder:text-gray-400"
              ></textarea>
              <p class="text-right text-[9px] font-bold text-gray-400">{{ note.length }}/50</p>
            </div>
          </div>
        </div>
      </section>

      <!-- RECENT RECIPIENTS -->
      <section class="mt-4 px-4">
        <div class="flex items-center justify-between">
          <h2 class="text-[14px] font-semibold text-[#17212f]">Recent Recipients</h2>
          <button class="flex items-center gap-1 text-[10px] font-semibold text-[#10b8ad]">
            View All
            <Icon icon="mdi:arrow-right" class="text-[13px]" />
          </button>
        </div>

        <div class="mt-3 flex gap-2 overflow-x-auto pb-1">
          <button
            v-for="item in recentRecipients"
            :key="item.uid"
            @click="selectRecipient(item)"
            class="flex min-w-[112px] shrink-0 items-center gap-2 rounded-xl border px-3 py-3 shadow-sm transition-colors active:scale-[0.98]"
            :class="recipient === item.uid ? 'border-[#10b8ad] bg-[#eafffd]' : 'border-gray-100 bg-white'"
          >
            <img
              v-if="item.avatar"
              :src="item.avatar"
              :alt="item.name"
              class="h-8 w-8 rounded-full object-cover"
            />
            <div
              v-else
              class="flex h-8 w-8 items-center justify-center rounded-full bg-[#e8fffc] text-[12px] font-semibold text-[#10b8ad]"
            >
              ET
            </div>
            <div class="min-w-0 text-left">
              <p class="truncate text-[10px] font-semibold text-[#17212f]">{{ item.name }}</p>
              <p class="mt-1 truncate text-[8px] font-bold text-gray-400">{{ item.uid }}</p>
            </div>
            <Icon icon="mdi:chevron-right" class="ml-auto text-[15px] text-gray-300" />
          </button>
        </div>
      </section>

      <!-- INFO CARD -->
      <section class="mt-4 px-4">
        <div class="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
          <div class="flex items-center justify-between border-b border-gray-100 px-4 py-4">
            <div class="flex items-center gap-3">
              <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-[#e8fffc]">
                <Icon icon="mdi:lightning-bolt" class="text-[24px] text-[#10b8ad]" />
              </div>
              <div>
                <h3 class="text-[12px] font-semibold text-[#17212f]">Transfer Speed</h3>
                <p class="mt-1 text-[10px] font-semibold text-gray-400">Instant Transfer</p>
              </div>
            </div>
            <span class="rounded-full bg-[#eafffd] px-3 py-1 text-[10px] font-semibold text-[#10b8ad]">Instant</span>
          </div>

          <div class="flex items-center justify-between px-4 py-4">
            <div class="flex items-center gap-3">
              <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-[#e8fffc]">
                <Icon icon="mdi:shield-check-outline" class="text-[24px] text-[#10b8ad]" />
              </div>
              <div>
                <h3 class="text-[12px] font-semibold text-[#17212f]">Internal Fee</h3>
                <p class="mt-1 text-[10px] font-semibold text-gray-400">No fee for internal transfers</p>
              </div>
            </div>
            <span class="text-[12px] font-semibold text-[#10b8ad]">0 USDT</span>
          </div>
        </div>
      </section>

      <!-- SEND -->
      <section class="mt-4 px-4">
        <p v-if="sendError" class="mb-2 text-center text-[11px] font-semibold text-red-500">{{ sendError }}</p>
        <button
          @click="sendTransfer"
          :disabled="!canSend || sending"
          class="h-12 w-full rounded-xl text-[13px] font-semibold text-white shadow-sm transition-colors active:scale-[0.99]"
          :class="canSend && !sending ? 'bg-[#08a99f]' : 'cursor-not-allowed bg-gray-300'"
        >
          {{ sending ? 'Sending…' : 'Send Transfer' }}
        </button>
      </section>
    </div>

    <!-- BOTTOM BUTTON -->
    <div class="fixed bottom-0 left-1/2 z-50 w-full max-w-[430px] -translate-x-1/2 bg-[#f6f8fb] px-4 pb-4 pt-3">
      <p v-if="sendError" class="mb-1 text-center text-[11px] font-semibold text-red-500">{{ sendError }}</p>
      <button
        @click="sendTransfer"
        :disabled="!canSend || sending"
        class="h-[48px] w-full rounded-xl text-[13px] font-semibold text-white shadow-sm transition-colors active:scale-[0.99]"
        :class="canSend && !sending ? 'bg-[#08a99f]' : 'cursor-not-allowed bg-gray-300'"
      >
        {{ sending ? 'Sending…' : 'Send Transfer' }}
      </button>
    </div>

    <!-- BACKDROP -->
    <Transition enter-from-class="opacity-0" enter-active-class="transition-opacity duration-300" leave-to-class="opacity-0" leave-active-class="transition-opacity duration-300">
      <div v-if="showSuccess" @click="showSuccess = false" class="fixed inset-0 z-40 bg-black/40"></div>
    </Transition>

    <!-- SUCCESS SHEET -->
    <Transition enter-from-class="translate-y-full" enter-active-class="transition-transform duration-300" leave-to-class="translate-y-full" leave-active-class="transition-transform duration-300">
      <div v-if="showSuccess" class="fixed inset-x-0 bottom-0 left-1/2 z-50 w-full max-w-[430px] -translate-x-1/2 rounded-t-2xl bg-white shadow-2xl">
        <div class="flex justify-center pt-3"><div class="h-1 w-10 rounded-full bg-gray-200"></div></div>
        <div class="flex flex-col items-center px-4 pb-10 pt-5 text-center">
          <div class="flex h-20 w-20 items-center justify-center rounded-full bg-[#e9fffc]">
            <Icon icon="mdi:check-circle-outline" class="text-[52px] text-[#10b8ad]" />
          </div>
          <h3 class="mt-4 text-[16px] font-semibold text-[#17212f]">Transfer Sent!</h3>
          <p class="mt-2 text-[11px] font-semibold text-gray-400">{{ amount }} USDT → {{ recipient }}</p>
          <p class="mt-1 text-[10px] font-semibold text-[#10b8ad]">Instant · No Fee</p>
          <button
            @click="showSuccess = false; amount = ''; recipient = ''; note = ''"
            class="mt-6 h-12 w-full rounded-xl bg-[#08a99f] text-[13px] font-semibold text-white active:scale-95"
          >Done</button>
        </div>
      </div>
    </Transition>

    <!-- Transfer Guide Modal -->
    <Teleport to="body">
      <Transition name="sheet">
        <div v-if="showTransferGuide" class="fixed inset-0 z-50 flex flex-col">
          <div class="absolute inset-0 bg-black/40 backdrop-blur-sm" @click="showTransferGuide = false"></div>
          <div class="relative mt-auto max-h-[90vh] w-full overflow-y-auto rounded-t-3xl bg-white px-6 pt-5 pb-10 shadow-2xl lg:mx-auto lg:mb-auto lg:mt-auto lg:max-w-lg lg:rounded-3xl">
            <div class="mb-5 flex items-center justify-between">
              <h3 class="text-xl font-semibold text-slate-950">Transfer Guide</h3>
              <button type="button" class="grid size-9 place-items-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 transition" @click="showTransferGuide = false">
                <Icon icon="mdi:close" class="size-5" />
              </button>
            </div>

            <div class="flex items-start gap-4 rounded-2xl bg-teal-50 p-4">
              <div class="grid size-12 shrink-0 place-items-center rounded-2xl bg-teal-100 text-teal-500">
                <Icon icon="mdi:help-circle-outline" class="size-6" />
              </div>
              <div>
                <p class="text-sm font-semibold text-slate-950">Transfer Guide</p>
                <p class="mt-1 text-xs font-semibold leading-5 text-slate-500">Learn how internal transfers work, supported assets, limits, and transfer processing times.</p>
              </div>
            </div>

            <div class="mt-5 space-y-5 text-sm leading-6 text-slate-600">
              <p>Transfer allows you to send crypto assets instantly between OneLedger users using UID or email address.</p>

              <div>
                <h4 class="mb-3 text-sm font-semibold text-slate-950">How to Transfer</h4>
                <ol class="space-y-2">
                  <li v-for="(step, i) in transferSteps" :key="i" class="flex items-start gap-3">
                    <span class="grid size-6 shrink-0 place-items-center rounded-full bg-teal-100 text-xs font-bold text-teal-600">{{ i + 1 }}</span>
                    <span class="text-xs font-semibold leading-6 text-slate-600">{{ step }}</span>
                  </li>
                </ol>
              </div>

              <div>
                <h4 class="mb-3 text-sm font-semibold text-slate-950">Important Notes</h4>
                <ul class="space-y-2">
                  <li v-for="(item, i) in importantNotes" :key="i" class="flex items-start gap-3">
                    <Icon icon="mdi:circle-small" class="mt-0.5 size-5 shrink-0 text-teal-500" />
                    <span class="text-xs font-semibold leading-5 text-slate-600">{{ item }}</span>
                  </li>
                </ul>
              </div>

              <div>
                <h4 class="mb-2 text-sm font-semibold text-slate-950">Security Reminder</h4>
                <p class="text-xs font-semibold leading-5 text-slate-500">For your account safety:</p>
                <ul class="mt-2 space-y-2">
                  <li v-for="(tip, i) in securityTips" :key="i" class="flex items-start gap-3">
                    <Icon icon="mdi:shield-check-outline" class="mt-0.5 size-5 shrink-0 text-teal-500" />
                    <span class="text-xs font-semibold leading-5 text-slate-600">{{ tip }}</span>
                  </li>
                </ul>
              </div>

              <div>
                <h4 class="mb-2 text-sm font-semibold text-slate-950">Need Help?</h4>
                <p class="text-xs font-semibold leading-5 text-slate-500">If your transfer is delayed or unsuccessful, please contact Customer Support through live chat or Help Center.</p>
              </div>
            </div>

            <button
              type="button"
              class="mt-6 w-full rounded-2xl bg-teal-500 py-3.5 text-sm font-semibold text-white transition active:scale-95 hover:bg-teal-600"
              @click="showTransferGuide = false"
            >
              View Guide
            </button>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Transfer History Modal -->
    <Teleport to="body">
      <Transition name="sheet">
        <div v-if="showTransferHistory" class="fixed inset-0 z-50 flex flex-col">
          <div class="absolute inset-0 bg-black/40 backdrop-blur-sm" @click="showTransferHistory = false"></div>
          <div class="relative mt-auto max-h-[90vh] w-full overflow-y-auto rounded-t-3xl bg-white px-6 pt-5 pb-10 shadow-2xl lg:mx-auto lg:mb-auto lg:mt-auto lg:max-w-lg lg:rounded-3xl">
            <div class="mb-5 flex items-center justify-between">
              <h3 class="text-xl font-semibold text-slate-950">Transfer History</h3>
              <button type="button" class="grid size-9 place-items-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 transition" @click="showTransferHistory = false">
                <Icon icon="mdi:close" class="size-5" />
              </button>
            </div>

            <div class="flex items-start gap-4 rounded-2xl bg-slate-50 p-4">
              <div class="grid size-12 shrink-0 place-items-center rounded-2xl bg-slate-100 text-slate-500">
                <Icon icon="mdi:file-document-outline" class="size-6" />
              </div>
              <div>
                <p class="text-sm font-semibold text-slate-950">Transfer History</p>
                <p class="mt-1 text-xs font-semibold leading-5 text-slate-500">Review your recent transfer activity, transaction status, and transfer details.</p>
              </div>
            </div>

            <!-- Loading -->
            <div v-if="loadingHistory" class="flex items-center justify-center py-10">
              <Icon icon="mdi:loading" class="animate-spin text-3xl text-teal-500" />
            </div>

            <!-- Empty -->
            <div v-else-if="transfersFromApi.length === 0" class="flex flex-col items-center py-10 text-gray-400">
              <Icon icon="mdi:inbox-outline" class="text-4xl" />
              <p class="mt-2 text-xs font-semibold">No transfer history yet</p>
            </div>

            <div v-else class="mt-5 space-y-3">
              <div
                v-for="item in transfersFromApi"
                :key="item.id"
                class="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 px-4 py-4"
              >
                <div class="flex items-center gap-3">
                  <div
                    class="grid size-10 place-items-center rounded-xl"
                    :class="item.direction === 'received' ? 'bg-teal-50 text-teal-500' : 'bg-slate-100 text-slate-500'"
                  >
                    <Icon :icon="item.direction === 'received' ? 'mdi:arrow-down' : 'mdi:arrow-up'" class="size-5" />
                  </div>
                  <div>
                    <p class="text-sm font-semibold text-slate-950">
                      {{ item.direction === 'received' ? 'Received' : 'Sent' }}
                    </p>
                    <p class="mt-0.5 text-xs font-semibold text-slate-400">
                      {{ item.direction === 'received' ? (item.sender_name ?? 'Unknown') : (item.recipient_name ?? 'Unknown') }}
                    </p>
                    <p class="mt-0.5 text-[10px] font-semibold text-slate-400">{{ formatDate(item.created_at) }}</p>
                  </div>
                </div>
                <div class="text-right">
                  <p
                    class="text-sm font-semibold"
                    :class="item.direction === 'received' ? 'text-teal-500' : 'text-slate-950'"
                  >
                    {{ item.direction === 'received' ? '+' : '-' }}{{ Number(item.amount).toLocaleString('en-US', { minimumFractionDigits: 2 }) }} {{ item.coin }}
                  </p>
                  <span class="mt-1 inline-block rounded-full bg-teal-50 px-2 py-0.5 text-[10px] font-semibold text-teal-500">Completed</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              class="mt-6 w-full rounded-2xl bg-[#17212f] py-3.5 text-sm font-semibold text-white transition active:scale-95 hover:bg-[#2a3a4e]"
              @click="showTransferHistory = false"
            >
              Close
            </button>
          </div>
        </div>
      </Transition>
    </Teleport>
  </DashboardLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { Icon } from '@iconify/vue'
import { useRouter } from 'vue-router'
import DashboardLayout from '@/layouts/DashboardLayout.vue'
import { useAuthStore } from '@/stores/auth'
import { makeWalletApi, type TransferRecord } from '@/services/api'

const router = useRouter()
const auth   = useAuthStore()

interface Recipient {
  name: string
  uid: string
  avatar: string | null
}

// ─── State ─────────────────────────────────────────────────────────
const showBalance         = ref(true)
const amount              = ref('')
const recipient           = ref('')
const note                = ref('')
const showSuccess         = ref(false)
const showTransferGuide   = ref(false)
const showTransferHistory = ref(false)
const activeRecipientType = ref('UID / Email')
const recipientTypes      = ['UID / Email', 'Email']
const sending             = ref(false)
const sendError           = ref('')

// Live balance + transfers from API
const transfersFromApi = ref<TransferRecord[]>([])
const loadingHistory   = ref(false)

const availableBalance = computed(() => Number(auth.user?.balance ?? 0))
const balanceDisplay   = computed(() =>
  availableBalance.value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
)

const canSend = computed(() =>
  recipient.value.trim().length > 0 &&
  Number(amount.value) > 0 &&
  Number(amount.value) <= availableBalance.value
)

// ─── Fetch history ────────────────────────────────────────────────
async function loadHistory() {
  if (!auth.accessToken) return
  loadingHistory.value = true
  try {
    const data = await makeWalletApi(auth.accessToken).getTransfers()
    transfersFromApi.value = data.transfers
  } catch { /* silently fail */ }
  finally { loadingHistory.value = false }
}

onMounted(loadHistory)

// ─── Actions ──────────────────────────────────────────────────────
function setMax() {
  amount.value = String(availableBalance.value)
}

function selectRecipient(r: Recipient) {
  recipient.value = r.uid
}

async function sendTransfer() {
  if (!canSend.value || sending.value || !auth.accessToken) return
  sending.value   = true
  sendError.value = ''
  try {
    await makeWalletApi(auth.accessToken).sendTransfer({
      recipient: recipient.value.trim(),
      amount:    Number(amount.value),
      note:      note.value || undefined,
    })
    await auth.refreshProfile().catch(() => {})
    await loadHistory()
    showSuccess.value = true
  } catch (e: any) {
    sendError.value = e?.message ?? 'Transfer failed. Please try again.'
  } finally {
    sending.value = false
  }
}

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleString('en-US', { month:'short', day:'numeric', year:'numeric', hour:'2-digit', minute:'2-digit' })
  } catch { return iso }
}

const recentRecipients: Recipient[] = [
  { name: 'Alex Chen',    uid: 'UID 10243', avatar: 'https://i.pravatar.cc/100?img=12' },
  { name: 'Sophia Li',   uid: 'UID 89143', avatar: 'https://i.pravatar.cc/100?img=47' },
  { name: 'James Wu',    uid: 'UID 3845',  avatar: 'https://i.pravatar.cc/100?img=52' },
  { name: 'Ella Taylor', uid: 'UID 77899', avatar: null },
]

const transferSteps = [
  'Enter recipient UID or registered email',
  'Select the asset you want to transfer',
  'Input transfer amount',
  'Add an optional note',
  'Review transfer details and confirm',
]

const importantNotes = [
  'Transfers are processed instantly within the OneLedger ecosystem',
  'Make sure the recipient UID or email is correct before confirming',
  'Only supported assets can be transferred internally',
  'Minimum transfer amount may vary depending on the asset',
  'Internal transfers are not sent through blockchain networks',
]

const securityTips = [
  'Double-check recipient information',
  'Never transfer assets to unknown users',
  'Enable 2FA and biometric security for additional protection',
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
