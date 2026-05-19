<template>
  <DashboardLayout>
    <div class="min-h-screen bg-[#f6f8fb] pb-24 text-[#17212f]">
      <!-- PAGE HEADER -->
      <div class="relative flex h-14 items-center justify-center border-b border-gray-100 bg-white px-4">
        <button
          @click="router.back()"
          class="absolute left-3 flex h-9 w-9 items-center justify-center rounded-xl bg-[#f6f8fb] active:scale-95"
        >
          <Icon icon="mdi:chevron-left" class="text-[27px] text-[#243142]" />
        </button>
        <h1 class="text-[16px] font-semibold text-[#17212f]">Withdraw</h1>
        <div class="absolute right-4 flex items-center gap-4">
          <button class="active:scale-95" title="Withdrawal Guide" @click="showWithdrawGuide = true">
            <Icon icon="mdi:help-circle-outline" class="text-[21px] text-[#243142]" />
          </button>
          <button class="active:scale-95" title="Withdrawal History" @click="router.push('/withdraw-history')">
            <Icon icon="mdi:file-document-outline" class="text-[21px] text-[#243142]" />
          </button>
        </div>
      </div>

      <!-- CRYPTO / P2P TAB -->
      <section class="px-4">
        <div class="grid h-9 grid-cols-2 rounded-xl bg-white p-1 shadow-sm">
          <button
            v-for="tab in tabs"
            :key="tab"
            @click="tab === 'P2P' ? router.push('/p2p-trading') : activeTab = tab"
            class="rounded-lg text-[11px] font-semibold transition"
            :class="activeTab === tab ? 'bg-[#eafffd] text-[#10b8ad]' : 'text-gray-400'"
          >
            {{ tab }}
          </button>
        </div>
      </section>

      <!-- BALANCE CARD -->
      <section class="mt-4 px-4">
        <div class="relative overflow-hidden rounded-2xl border border-gray-100 bg-white px-4 py-4 shadow-sm">
          <div class="absolute right-0 top-0 h-full w-[45%] bg-linear-to-l from-cyan-100/80 via-cyan-50/60 to-transparent"></div>

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
                <span class="mb-1 text-[10px] font-semibold text-gray-500">{{ selectedCoin }}</span>
              </div>
              <p class="mt-2 text-[10px] font-semibold text-gray-400">{{ showBalance ? '≈ $' + balanceDisplay + ' ' + selectedCoin : '≈ $••••••' }}</p>
            </div>

            <!-- Illustration -->
            <img src="/images/withdraw-banner.webp" alt="Withdraw" class="h-20 w-30 object-contain" />
          </div>
        </div>
      </section>

      <!-- WITHDRAW FORM -->
      <section class="mt-4 px-4">
        <div class="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
          <!-- Select Asset -->
          <button @click="showCoinPicker = true" class="flex w-full items-center justify-between border-b border-gray-100 px-4 py-4 active:bg-gray-50">
            <span class="text-[11px] font-semibold text-[#344054]">Select Asset</span>
            <div class="flex items-center gap-2">
              <span class="flex h-7 w-7 items-center justify-center rounded-full" :class="currentCoinMeta.bg">
                <Icon :icon="currentCoinMeta.icon" class="text-[20px]" />
              </span>
              <span class="text-[12px] font-semibold text-[#17212f]">{{ selectedCoin }}</span>
              <Icon icon="mdi:chevron-down" class="text-[18px] text-gray-400" />
            </div>
          </button>

          <!-- Withdraw To -->
          <div class="border-b border-gray-100 px-4 py-4">
            <div class="flex items-center gap-3">
              <label class="shrink-0 text-[11px] font-semibold text-[#344054]">Withdraw To</label>
              <input
                v-model="withdrawAddress"
                type="text"
                placeholder="Enter or paste address"
                class="min-w-0 flex-1 bg-transparent text-right text-[11px] font-semibold text-[#17212f] outline-none placeholder:text-gray-400"
              />
              <button class="shrink-0 active:scale-95" title="Paste from clipboard" @click="pasteAddress">
                <Icon icon="mdi:content-paste" class="text-[19px] text-[#344054]" />
              </button>
              <button class="shrink-0 active:scale-95" title="Select from address book">
                <Icon icon="mdi:contacts-outline" class="text-[19px] text-[#344054]" />
              </button>
            </div>
          </div>

          <!-- Network -->
          <button @click="showNetworkPicker = true" class="flex w-full items-center justify-between border-b border-gray-100 px-4 py-4 active:bg-gray-50">
            <span class="text-[11px] font-semibold text-[#344054]">Network</span>
            <div class="flex items-center gap-2">
              <span class="text-[11px] font-semibold text-[#17212f]">{{ selectedNetwork }}</span>
              <Icon icon="mdi:chevron-down" class="text-[18px] text-gray-400" />
            </div>
          </button>

          <!-- Withdraw Amount -->
          <div class="px-4 py-4">
            <div class="flex items-center justify-between">
              <label class="text-[11px] font-semibold text-[#344054]">Withdrawal Amount</label>
              <div class="flex items-center gap-3">
                <input
                  v-model="amount"
                  type="number"
                  placeholder="0.000000"
                  class="w-32.5 bg-transparent text-right text-[12px] font-semibold outline-none"
                />
                <span class="text-[11px] font-semibold text-gray-400">{{ selectedCoin }}</span>
                <button @click="setMax" class="text-[11px] font-semibold text-[#10b8ad]">Max</button>
              </div>
            </div>

            <div class="mt-4 space-y-3">
              <div class="flex items-center justify-between">
                <p class="text-[10px] font-bold text-gray-400">Available</p>
                <p class="text-[10px] font-semibold text-[#17212f]">{{ maxBalanceDisplay }} {{ selectedCoin }}</p>
              </div>
              <div class="flex items-center justify-between">
                <div class="relative flex items-center gap-1">
                  <p class="text-[10px] font-bold text-gray-400">Fee</p>
                  <button type="button" @click.stop="showFeeTip = !showFeeTip; showReceiveTip = false" class="active:scale-90">
                    <Icon icon="mdi:information-outline" class="text-[12px] text-gray-400" />
                  </button>
                  <Transition enter-from-class="opacity-0 scale-95" enter-active-class="transition duration-150" leave-to-class="opacity-0 scale-95" leave-active-class="transition duration-100">
                    <div v-if="showFeeTip" class="absolute bottom-full left-0 z-20 mb-1.5 w-52 rounded-xl bg-[#17212f] px-3 py-2 text-[10px] font-semibold leading-relaxed text-white shadow-lg">
                      Network fee deducted from your withdrawal. Paid to the blockchain network for processing your transaction.
                      <div class="absolute -bottom-1 left-3 h-2 w-2 rotate-45 bg-[#17212f]"></div>
                    </div>
                  </Transition>
                </div>
                <p class="text-[10px] font-semibold text-[#17212f]">{{ currentNetworkFee.toFixed(4) }} {{ selectedCoin }}</p>
              </div>
              <div class="flex items-center justify-between border-t border-dashed border-gray-200 pt-3">
                <div class="relative flex items-center gap-1">
                  <p class="text-[10px] font-bold text-gray-400">You Will Receive</p>
                  <button type="button" @click.stop="showReceiveTip = !showReceiveTip; showFeeTip = false" class="active:scale-90">
                    <Icon icon="mdi:information-outline" class="text-[12px] text-gray-400" />
                  </button>
                  <Transition enter-from-class="opacity-0 scale-95" enter-active-class="transition duration-150" leave-to-class="opacity-0 scale-95" leave-active-class="transition duration-100">
                    <div v-if="showReceiveTip" class="absolute bottom-full left-0 z-20 mb-1.5 w-52 rounded-xl bg-[#17212f] px-3 py-2 text-[10px] font-semibold leading-relaxed text-white shadow-lg">
                      Withdrawal amount minus the network fee. This is the actual amount that will arrive in the destination wallet.
                      <div class="absolute -bottom-1 left-3 h-2 w-2 rotate-45 bg-[#17212f]"></div>
                    </div>
                  </Transition>
                </div>
                <div class="text-right">
                  <p class="text-[12px] font-semibold text-[#10b8ad]">{{ receiveAmount }} {{ selectedCoin }}</p>
                  <p class="mt-1 text-[9px] font-semibold text-gray-400">≈ ${{ receiveAmount }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- SECURITY REMINDER -->
      <section class="mt-4 px-4">
        <div class="flex items-start gap-3 rounded-2xl border border-gray-100 bg-white px-4 py-4 shadow-sm">
          <img src="/images/withdraw-security.webp" alt="Security" class="h-11 w-11 shrink-0 object-contain" />
          <div>
            <h2 class="text-[12px] font-semibold text-[#17212f]">Security Reminder</h2>
            <p class="mt-1 text-[10px] font-semibold leading-relaxed text-gray-400">
              Please double-check the withdrawal address and network. Transactions cannot be canceled once submitted.
            </p>
          </div>
        </div>
      </section>

      <!-- RECENT ADDRESSES -->
      <section class="mt-4 px-4">
        <div class="flex items-center justify-between">
          <h2 class="text-[14px] font-semibold text-[#17212f]">Recent Addresses</h2>
          <button @click="router.push('/recent-addresses')" class="flex items-center gap-1 text-[10px] font-semibold text-[#10b8ad]">
            View All
            <Icon icon="mdi:arrow-right" class="text-[13px]" />
          </button>
        </div>

        <div class="mt-3 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
          <div v-if="recentAddresses.length === 0" class="flex flex-col items-center py-8 text-gray-300">
            <Icon icon="mdi:map-marker-off-outline" class="text-3xl" />
            <p class="mt-2 text-[10px] font-semibold">No recent addresses</p>
          </div>
          <button
            v-else
            v-for="address in recentAddresses"
            :key="address.address"
            @click="selectAddress(address)"
            class="flex w-full items-center justify-between border-b border-gray-100 px-4 py-3 last:border-b-0 transition-colors"
            :class="withdrawAddress === address.address ? 'bg-[#eafffd]' : 'active:bg-gray-50'"
          >
            <div class="flex items-center gap-3">
              <div class="flex h-9 w-9 items-center justify-center rounded-full bg-[#e9fffc]">
                <Icon icon="mdi:account-outline" class="text-[21px] text-[#10b8ad]" />
              </div>
              <div class="text-left">
                <div class="flex items-center gap-2">
                  <p class="text-[12px] font-semibold text-[#17212f]">{{ address.name }}</p>
                  <span class="rounded bg-[#e9fffc] px-1.5 py-px text-[7px] font-semibold text-[#10b8ad]">
                    {{ address.network }}
                  </span>
                </div>
                <p class="mt-1 text-[10px] font-semibold text-gray-400">{{ address.address }}</p>
              </div>
            </div>
            <Icon icon="mdi:chevron-right" class="text-[20px] text-gray-300" />
          </button>
        </div>
      </section>

    </div>

    <!-- BACKDROP -->
    <Transition enter-from-class="opacity-0" enter-active-class="transition-opacity duration-300" leave-to-class="opacity-0" leave-active-class="transition-opacity duration-300">
      <div v-if="showConfirm || showSuccess" @click="showConfirm = false" class="fixed inset-0 z-40 bg-black/40"></div>
    </Transition>

    <!-- STICKY CONFIRM BUTTON -->
    <Transition
      enter-active-class="transition-transform duration-300"
      leave-active-class="transition-transform duration-300"
      enter-from-class="translate-y-full"
      leave-to-class="translate-y-full"
    >
      <div v-if="Number(amount) > 0" class="fixed bottom-[75px] left-1/2 z-50 w-full max-w-107.5 -translate-x-1/2 border-t border-gray-100 bg-white px-4 pb-3 pt-3 shadow-lg">
        <button
          @click="openConfirm"
          :disabled="!canWithdraw"
          class="h-12 w-full rounded-xl text-[13px] font-semibold text-white transition-colors active:scale-[0.99]"
          :class="canWithdraw ? 'bg-[#08a99f]' : 'cursor-not-allowed bg-gray-300'"
        >
          Confirm Withdrawal
        </button>
      </div>
    </Transition>

    <!-- CONFIRM SHEET -->
    <Transition enter-from-class="translate-y-full" enter-active-class="transition-transform duration-300" leave-to-class="translate-y-full" leave-active-class="transition-transform duration-300">
      <div v-if="showConfirm" class="fixed inset-x-0 bottom-[75px] left-1/2 z-50 w-full max-w-107.5 -translate-x-1/2 rounded-t-2xl bg-white shadow-2xl">
        <div class="flex justify-center pt-3"><div class="h-1 w-10 rounded-full bg-gray-200"></div></div>
        <div class="px-4 pb-8 pt-3">
          <div class="flex items-center justify-between">
            <h3 class="text-[15px] font-semibold text-[#17212f]">Confirm Withdrawal</h3>
            <button @click="showConfirm = false"><Icon icon="mdi:close" class="text-[22px] text-gray-400" /></button>
          </div>
          <div class="mt-4 space-y-3 rounded-xl bg-[#f6f8fb] p-4">
            <div class="flex justify-between">
              <p class="text-[11px] font-bold text-gray-400">Address</p>
              <p class="max-w-50 truncate text-right text-[11px] font-semibold text-[#17212f]">{{ withdrawAddress }}</p>
            </div>
            <div class="flex justify-between">
              <p class="text-[11px] font-bold text-gray-400">Network</p>
              <p class="text-[11px] font-semibold text-[#17212f]">{{ selectedNetwork }}</p>
            </div>
            <div class="flex justify-between">
              <p class="text-[11px] font-bold text-gray-400">Amount</p>
              <p class="text-[11px] font-semibold text-[#17212f]">{{ amount }} {{ selectedCoin }}</p>
            </div>
            <div class="flex justify-between">
              <p class="text-[11px] font-bold text-gray-400">Fee</p>
              <p class="text-[11px] font-semibold text-[#17212f]">{{ currentNetworkFee.toFixed(4) }} {{ selectedCoin }}</p>
            </div>
            <div class="flex justify-between border-t border-dashed border-gray-200 pt-3">
              <p class="text-[11px] font-bold text-gray-400">You Receive</p>
              <p class="text-[11px] font-semibold text-[#10b8ad]">{{ receiveAmount }} {{ selectedCoin }}</p>
            </div>
          </div>
          <p v-if="submitError" class="mt-2 text-center text-[11px] font-semibold text-red-500">{{ submitError }}</p>
          <div class="mt-5 flex gap-3">
            <button @click="showConfirm = false" class="h-12 flex-1 rounded-xl border border-gray-200 text-[12px] font-semibold text-gray-500 active:scale-95">Cancel</button>
            <button @click="confirmWithdraw" :disabled="submitting" class="h-12 flex-1 rounded-xl bg-[#08a99f] text-[12px] font-semibold text-white active:scale-95 disabled:opacity-60">
              {{ submitting ? 'Processing…' : 'Confirm' }}
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- SUCCESS SHEET -->
    <Transition enter-from-class="translate-y-full" enter-active-class="transition-transform duration-300" leave-to-class="translate-y-full" leave-active-class="transition-transform duration-300">
      <div v-if="showSuccess" class="fixed inset-x-0 bottom-[75px] left-1/2 z-50 w-full max-w-107.5 -translate-x-1/2 rounded-t-2xl bg-white shadow-2xl">
        <div class="flex justify-center pt-3"><div class="h-1 w-10 rounded-full bg-gray-200"></div></div>
        <div class="flex flex-col items-center px-4 pb-10 pt-5 text-center">
          <div class="flex h-20 w-20 items-center justify-center rounded-full bg-[#e9fffc]">
            <Icon icon="mdi:check-circle-outline" class="text-[52px] text-[#10b8ad]" />
          </div>
          <h3 class="mt-4 text-[16px] font-semibold text-[#17212f]">Withdrawal Submitted!</h3>
          <p class="mt-2 text-[11px] font-semibold text-gray-400">{{ amount }} {{ selectedCoin }} · {{ selectedNetwork }}</p>
          <p class="mt-1 text-[10px] font-semibold text-gray-400">Estimated arrival: 10 – 60 minutes</p>
          <!-- Polling status badge -->
          <div class="mt-3 flex items-center justify-center gap-2">
            <span
              class="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-semibold"
              :class="latestWithdrawalStatus === 'Completed' ? 'bg-emerald-100 text-emerald-700' : latestWithdrawalStatus === 'Rejected' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'"
            >
              <span v-if="latestWithdrawalStatus === 'Pending'" class="h-1.5 w-1.5 animate-pulse rounded-full bg-amber-500"></span>
              <span v-else-if="latestWithdrawalStatus === 'Completed'" class="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
              <span v-else class="h-1.5 w-1.5 rounded-full bg-red-500"></span>
              {{ latestWithdrawalStatus }}
            </span>
            <span v-if="latestWithdrawalStatus === 'Pending'" class="text-[10px] text-gray-400">Checking status…</span>
          </div>
          <button
            @click="showSuccess = false; amount = ''; withdrawAddress = ''; stopPolling()"
            class="mt-6 h-12 w-full rounded-xl bg-[#08a99f] text-[13px] font-semibold text-white active:scale-95"
          >Done</button>
        </div>
      </div>
    </Transition>

    <!-- ── COIN PICKER SHEET ── -->
    <Teleport to="body">
      <Transition name="sheet">
        <div v-if="showCoinPicker" class="fixed inset-0 z-50 flex flex-col">
          <div class="absolute inset-0 bg-black/40 backdrop-blur-sm" @click="showCoinPicker = false"></div>
          <div class="relative mt-auto w-full rounded-t-3xl bg-white px-5 pt-5 pb-10 shadow-2xl">
            <div class="mb-4 flex items-center justify-between">
              <h3 class="text-[15px] font-semibold text-[#17212f]">Select Asset</h3>
              <button @click="showCoinPicker = false" class="grid h-8 w-8 place-items-center rounded-full bg-gray-100 text-gray-500">
                <Icon icon="mdi:close" class="text-[18px]" />
              </button>
            </div>
            <div class="space-y-2">
              <button
                v-for="coin in allCoins"
                :key="coin"
                @click="selectedCoin = coin; showCoinPicker = false"
                class="flex w-full items-center gap-3 rounded-xl border px-4 py-3 transition active:bg-gray-50"
                :class="selectedCoin === coin ? 'border-[#10b8ad] bg-[#eafffd]' : 'border-gray-100 bg-white'"
              >
                <span class="flex h-9 w-9 items-center justify-center rounded-full" :class="COIN_META[coin].bg">
                  <Icon :icon="COIN_META[coin].icon" class="text-[22px]" />
                </span>
                <div class="text-left">
                  <p class="text-[13px] font-semibold text-[#17212f]">{{ coin }}</p>
                  <p class="text-[10px] font-semibold text-gray-400">{{ COIN_META[coin].label }}</p>
                </div>
                <Icon v-if="selectedCoin === coin" icon="mdi:check-circle" class="ml-auto text-[20px] text-[#10b8ad]" />
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- ── NETWORK PICKER SHEET ── -->
    <Teleport to="body">
      <Transition name="sheet">
        <div v-if="showNetworkPicker" class="fixed inset-0 z-50 flex flex-col">
          <div class="absolute inset-0 bg-black/40 backdrop-blur-sm" @click="showNetworkPicker = false"></div>
          <div class="relative mt-auto w-full rounded-t-3xl bg-white px-5 pt-5 pb-10 shadow-2xl">
            <div class="mb-4 flex items-center justify-between">
              <h3 class="text-[15px] font-semibold text-[#17212f]">Select Network</h3>
              <button @click="showNetworkPicker = false" class="grid h-8 w-8 place-items-center rounded-full bg-gray-100 text-gray-500">
                <Icon icon="mdi:close" class="text-[18px]" />
              </button>
            </div>
            <div class="mb-3 rounded-xl bg-amber-50 px-4 py-3">
              <p class="text-[10px] font-semibold leading-relaxed text-amber-700">
                Ensure the selected network matches the recipient's address. Sending to the wrong network may result in permanent loss of funds.
              </p>
            </div>
            <div class="space-y-2">
              <button
                v-for="net in networksWithMeta"
                :key="net.name"
                @click="selectedNetwork = net.name; showNetworkPicker = false"
                class="flex w-full items-center justify-between rounded-xl border px-4 py-3 transition active:bg-gray-50"
                :class="selectedNetwork === net.name ? 'border-[#10b8ad] bg-[#eafffd]' : 'border-gray-100 bg-white'"
              >
                <div>
                  <p class="text-left text-[13px] font-semibold text-[#17212f]">{{ net.name }}</p>
                  <p class="mt-0.5 text-left text-[10px] font-semibold text-gray-400">{{ selectedCoin }} · {{ net.name }} · Fee {{ net.fee_fixed }} · Min {{ net.min_amount }}</p>
                </div>
                <Icon v-if="selectedNetwork === net.name" icon="mdi:check-circle" class="text-[20px] text-[#10b8ad]" />
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Withdrawal Guide Modal -->
    <Teleport to="body">
      <Transition name="sheet">
        <div v-if="showWithdrawGuide" class="fixed inset-0 z-50 flex flex-col">
          <div class="absolute inset-0 bg-black/40 backdrop-blur-sm" @click="showWithdrawGuide = false"></div>
          <div class="relative mt-auto max-h-[90vh] w-full overflow-y-auto rounded-t-3xl bg-white px-6 pt-5 pb-10 shadow-2xl lg:mx-auto lg:mb-auto lg:mt-auto lg:max-w-lg lg:rounded-3xl">
            <div class="mb-5 flex items-center justify-between">
              <h3 class="text-xl font-semibold text-slate-950">Withdrawal Guide</h3>
              <button type="button" class="grid size-9 place-items-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 transition" @click="showWithdrawGuide = false">
                <Icon icon="mdi:close" class="size-5" />
              </button>
            </div>

            <div class="flex items-start gap-4 rounded-2xl bg-teal-50 p-4">
              <div class="grid size-12 shrink-0 place-items-center rounded-2xl bg-teal-100 text-teal-500">
                <Icon icon="mdi:help-circle-outline" class="size-6" />
              </div>
              <div>
                <p class="text-sm font-semibold text-slate-950">Withdrawal Guide</p>
                <p class="mt-1 text-xs font-semibold leading-5 text-slate-500">Withdraw allows you to send crypto assets from your OneLedger account to an external wallet address or through P2P withdrawal.</p>
              </div>
            </div>

            <div class="mt-5 space-y-5 text-sm leading-6 text-slate-600">
              <div>
                <h4 class="mb-3 text-sm font-semibold text-slate-950">How to Withdraw</h4>
                <ol class="space-y-2">
                  <li v-for="(step, i) in withdrawGuideSteps" :key="i" class="flex items-start gap-3">
                    <span class="grid size-6 shrink-0 place-items-center rounded-full bg-teal-100 text-xs font-bold text-teal-600">{{ i + 1 }}</span>
                    <span class="text-xs font-semibold leading-6 text-slate-600">{{ step }}</span>
                  </li>
                </ol>
              </div>

              <div>
                <h4 class="mb-3 text-sm font-semibold text-slate-950">Important Notes</h4>
                <ul class="space-y-2">
                  <li v-for="(item, i) in withdrawImportantNotes" :key="i" class="flex items-start gap-3">
                    <Icon icon="mdi:circle-small" class="mt-0.5 size-5 shrink-0 text-teal-500" />
                    <span class="text-xs font-semibold leading-5 text-slate-600">{{ item }}</span>
                  </li>
                </ul>
              </div>

              <div>
                <h4 class="mb-2 text-sm font-semibold text-slate-950">Security Reminder</h4>
                <p class="text-xs font-semibold leading-5 text-slate-500">For your account protection:</p>
                <ul class="mt-2 space-y-2">
                  <li v-for="(tip, i) in withdrawSecurityTips" :key="i" class="flex items-start gap-3">
                    <Icon icon="mdi:shield-check-outline" class="mt-0.5 size-5 shrink-0 text-teal-500" />
                    <span class="text-xs font-semibold leading-5 text-slate-600">{{ tip }}</span>
                  </li>
                </ul>
              </div>

              <div>
                <h4 class="mb-2 text-sm font-semibold text-slate-950">Processing Time</h4>
                <p class="text-xs font-semibold leading-5 text-slate-500">Most withdrawals are processed within a few minutes, but some transactions may require additional blockchain confirmations.</p>
              </div>

              <div>
                <h4 class="mb-2 text-sm font-semibold text-slate-950">Need Help?</h4>
                <p class="text-xs font-semibold leading-5 text-slate-500">If your withdrawal is delayed or unsuccessful, please contact Customer Support through live chat or Help Center.</p>
              </div>
            </div>

            <button
              type="button"
              class="mt-6 w-full rounded-2xl bg-teal-500 py-3.5 text-sm font-semibold text-white transition active:scale-95 hover:bg-teal-600"
              @click="showWithdrawGuide = false"
            >
              Got It
            </button>
          </div>
        </div>
      </Transition>
    </Teleport>
  </DashboardLayout>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { Icon } from '@iconify/vue'
import { useRouter } from 'vue-router'
import DashboardLayout from '@/layouts/DashboardLayout.vue'
import { useAuthStore } from '@/stores/auth'
import { makeWalletApi } from '@/services/api'

const router = useRouter()
const auth   = useAuthStore()

// ─── Coin / Network data ────────────────────────────────────────────
const COIN_NETWORKS_FALLBACK: Record<string, string[]> = {
  USDT: ['TRC20', 'ERC20', 'BEP20'],
  BTC:  ['Bitcoin Network'],
  ETH:  ['ERC20', 'BEP20'],
  BNB:  ['BEP20'],
  SOL:  ['Solana Network'],
  XRP:  ['Ripple Network'],
}

// API-fetched networks: coin → [{ name, fee_fixed, min_amount }]
const apiNetworks = ref<Record<string, { name: string; fee_fixed: number; min_amount: number }[]>>({})

interface CoinMeta { icon: string; bg: string; label: string }
const COIN_META: Record<string, CoinMeta> = {
  USDT: { icon: 'mdi:alpha-t-circle',      bg: 'bg-[#e8fffc] text-[#10b8ad]', label: 'Tether' },
  BTC:  { icon: 'mdi:bitcoin',             bg: 'bg-orange-100 text-orange-500', label: 'Bitcoin' },
  ETH:  { icon: 'mdi:ethereum',            bg: 'bg-indigo-100 text-indigo-500', label: 'Ethereum' },
  BNB:  { icon: 'mdi:currency-usd-circle', bg: 'bg-yellow-100 text-yellow-500', label: 'BNB' },
  SOL:  { icon: 'mdi:star-circle',         bg: 'bg-purple-100 text-purple-500', label: 'Solana' },
  XRP:  { icon: 'mdi:alpha-x-circle',      bg: 'bg-slate-100 text-slate-500',   label: 'XRP' },
}

// Coins available = those returned by admin-configured withdrawal networks,
// filtered to only coins we have meta for. Falls back to all COIN_META keys if API not loaded yet.
const allCoins = computed(() => {
  const fromApi = Object.keys(apiNetworks.value).filter(c => COIN_META[c])
  return fromApi.length ? fromApi : Object.keys(COIN_META)
})

// When API networks load, ensure selectedCoin is still valid
watch(apiNetworks, (nets) => {
  const available = Object.keys(nets).filter(c => COIN_META[c])
  if (available.length && !available.includes(selectedCoin.value)) {
    selectedCoin.value = available[0]
  }
}, { deep: true })

interface RecentAddress {
  name: string
  network: string
  address: string
}

// ─── State ─────────────────────────────────────────────────────────
const showBalance      = ref(true)
const amount           = ref('')
const withdrawAddress  = ref('')
const showConfirm      = ref(false)
const showSuccess      = ref(false)
const showWithdrawGuide = ref(false)
const showCoinPicker   = ref(false)
const showNetworkPicker = ref(false)
const activeTab        = ref('Crypto')
const tabs             = ['Crypto', 'P2P']

const selectedCoin    = ref('USDT')
const selectedNetwork = ref('TRC20')

// balances from API for non-USDT coins
const coinBalances = ref<Record<string, number>>({})
const submitting   = ref(false)
const submitError  = ref('')
const showFeeTip     = ref(false)
const showReceiveTip = ref(false)

// Keep network in sync when coin changes
watch(selectedCoin, (coin) => {
  const nets = apiNetworks.value[coin]
  selectedNetwork.value = nets?.[0]?.name ?? (COIN_NETWORKS_FALLBACK[coin]?.[0] ?? 'TRC20')
})

// Network objects list for picker (with fee & min_amount)
const networksWithMeta = computed(() => {
  const nets = apiNetworks.value[selectedCoin.value]
  if (nets?.length) return nets
  return (COIN_NETWORKS_FALLBACK[selectedCoin.value] ?? ['TRC20']).map(n => ({ name: n, fee_fixed: 1, min_amount: 1 }))
})

// Network names list for picker
const networks = computed(() => networksWithMeta.value.map(n => n.name))

// Fee for the currently selected network
const currentNetworkFee = computed(() => {
  const nets = apiNetworks.value[selectedCoin.value] ?? []
  const net = nets.find(n => n.name === selectedNetwork.value)
  return net?.fee_fixed ?? 1
})

// Available balance per selected coin
const availableBalance = computed(() => {
  if (selectedCoin.value === 'USDT') return Number(auth.user?.balance ?? 0)
  return coinBalances.value[selectedCoin.value] ?? 0
})

const balanceDisplay = computed(() =>
  availableBalance.value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 6 })
)

const maxBalanceDisplay = computed(() =>
  availableBalance.value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 6 })
)

const canWithdraw = computed(() =>
  withdrawAddress.value.trim().length > 10 &&
  Number(amount.value) > currentNetworkFee.value &&
  Number(amount.value) <= availableBalance.value
)

const receiveAmount = computed(() => {
  const n = Number(amount.value)
  const fee = currentNetworkFee.value
  if (!n || n <= fee) return '0.000000'
  return (n - fee).toFixed(6)
})

const currentCoinMeta = computed(() => COIN_META[selectedCoin.value] ?? COIN_META.USDT)

// ─── Fetch coin balances on mount ──────────────────────────────────
async function loadCoinBalances() {
  if (!auth.accessToken) return
  try {
    const data = await makeWalletApi(auth.accessToken).getCoinBalances()
    const map: Record<string, number> = {}
    for (const b of data.balances) map[b.coin] = Number(b.amount)
    coinBalances.value = map
  } catch { /* silently fail */ }
}

async function fetchNetworks() {
  if (!auth.accessToken) return
  try {
    const data = await makeWalletApi(auth.accessToken).getWithdrawalNetworks()
    apiNetworks.value = data.networks
    // sync default network for current coin
    const nets = data.networks[selectedCoin.value]
    if (nets?.length) selectedNetwork.value = nets[0].name
  } catch { /* silently fall back to hardcoded */ }
}

onMounted(() => {
  loadCoinBalances()
  loadRecentAddresses()
  fetchNetworks()
})

// ─── Polling for withdrawal status ───────────────────────────────
const latestWithdrawalId     = ref<string | null>(null)
const latestWithdrawalStatus = ref('Pending')
let pollTimer: ReturnType<typeof setInterval> | null = null

function startPolling(id: string) {
  latestWithdrawalId.value     = id
  latestWithdrawalStatus.value = 'Pending'
  stopPolling()
  pollTimer = setInterval(async () => {
    if (!auth.accessToken) return stopPolling()
    try {
      const data = await makeWalletApi(auth.accessToken).getWithdrawals()
      const w = data.withdrawals.find(w => w.id === id)
      if (w) {
        latestWithdrawalStatus.value = w.status_withdrawal
        if (w.status_withdrawal === 'Completed' || w.status_withdrawal === 'Rejected') stopPolling()
      }
    } catch { /* ignore */ }
  }, 5000)
}

function stopPolling() {
  if (pollTimer) { clearInterval(pollTimer); pollTimer = null }
}

onUnmounted(() => stopPolling())

// ─── Actions ──────────────────────────────────────────────────────
function setMax() {
  amount.value = String(availableBalance.value)
}

async function pasteAddress() {
  try {
    const text = await navigator.clipboard.readText()
    if (text) withdrawAddress.value = text.trim()
  } catch { /* clipboard permission denied */ }
}

function selectAddress(addr: RecentAddress) {
  withdrawAddress.value = addr.address
}

function openConfirm() {
  if (!canWithdraw.value) return
  submitError.value = ''
  showConfirm.value = true
}

async function confirmWithdraw() {
  if (!auth.accessToken) return
  submitting.value  = true
  submitError.value = ''
  try {
    const res = await makeWalletApi(auth.accessToken).submitWithdrawal({
      amount:  Number(amount.value),
      address: withdrawAddress.value.trim(),
      network: selectedNetwork.value,
      coin:    selectedCoin.value,
    })
    await auth.refreshProfile().catch(() => {})
    await loadCoinBalances()
    showConfirm.value  = false
    showSuccess.value  = true
    startPolling(res.withdrawal.id)
  } catch (e: any) {
    submitError.value = e?.message ?? 'Withdrawal failed. Please try again.'
  } finally {
    submitting.value = false
  }
}

const recentAddresses = ref<RecentAddress[]>([])

async function loadRecentAddresses() {
  if (!auth.accessToken) return
  try {
    const data = await makeWalletApi(auth.accessToken).getWithdrawals()
    const seen = new Set<string>()
    const result: RecentAddress[] = []
    for (const w of data.withdrawals) {
      const parts   = (w.network ?? '').split('|')
      const coin    = parts.length > 1 ? parts[0] : 'USDT'
      const network = parts.length > 1 ? parts[1] : (w.network ?? '')
      const key     = w.address + '|' + network
      if (!seen.has(key)) {
        seen.add(key)
        result.push({ name: coin + ' Wallet', network, address: w.address ?? '' })
      }
      if (result.length >= 3) break
    }
    recentAddresses.value = result
  } catch { /* silently fail */ }
}

const withdrawGuideSteps = [
  'Select the asset you want to withdraw',
  'Enter the recipient wallet address',
  'Choose the correct blockchain network',
  'Input withdrawal amount',
  'Review withdrawal fee and receive amount',
  'Confirm withdrawal request',
]

const withdrawImportantNotes = [
  'Always make sure the wallet address is correct',
  'Select the correct network before submitting',
  'Withdrawals sent to the wrong network may result in permanent asset loss',
  'Network confirmation times may vary depending on blockchain traffic',
  'Withdrawal fees are automatically deducted from the total amount',
]

const withdrawSecurityTips = [
  'Enable 2FA and biometric verification',
  'Never share verification codes with anyone',
  'Double-check wallet addresses before confirming withdrawals',
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
