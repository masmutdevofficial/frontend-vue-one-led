<template>
  <DashboardLayout>
    <div class="min-h-screen bg-[#f6f8fb] text-[#0b1638]">
      <!-- PAGE HEADER -->
      <div class="relative flex h-14 items-center justify-center border-b border-gray-100 bg-white px-4">
        <button
          @click="router.back()"
          class="absolute left-3 flex h-9 w-9 items-center justify-center rounded-xl bg-[#f6f8fb] active:scale-95"
        >
          <Icon icon="mdi:chevron-left" class="text-[27px] text-[#243142]" />
        </button>
        <h1 class="text-[16px] font-semibold text-[#17212f]">Staking</h1>
        <button
          @click="showTnC = true; tncScrolledToBottom = false"
          class="absolute right-3 flex h-9 w-9 items-center justify-center rounded-xl bg-[#f6f8fb] active:scale-95"
        >
          <Icon icon="mdi:file-document-outline" class="text-[20px] text-[#243142]" />
        </button>
      </div>

      <div class="px-4 pt-4 pb-8">
        <!-- SUMMARY CARD -->
        <section class="relative overflow-hidden rounded-2xl border border-gray-100 bg-white px-5 py-5 shadow-sm">
          <div class="absolute right-0 top-0 h-full w-[52%] bg-linear-to-l from-cyan-100/80 via-cyan-50/60 to-transparent"></div>

          <div class="relative z-10">
            <div class="flex items-start justify-between">
              <div>
                <div class="flex items-center gap-2 text-[13px] font-medium text-[#5b6d9a]">
                  Total Staked
                  <button @click="showBalance = !showBalance">
                    <Icon :icon="showBalance ? 'mdi:eye-outline' : 'mdi:eye-off-outline'" class="text-[15px]" />
                  </button>
                </div>

                <div class="mt-4 flex items-end gap-2">
                  <h1 class="text-[30px] font-semibold leading-none tracking-tight text-[#0b1638]">
                    {{ showBalance ? formatAmount(summary.total_staked) : '••••••••' }}
                  </h1>
                  <span class="mb-1 text-[12px] font-semibold text-[#5b6d9a]">USDT</span>
                </div>

                <p class="mt-3 text-[13px] font-medium text-[#7a86a4]">
                  {{ showBalance ? '≈ $' + formatAmount(summary.total_staked) : '≈ $••••••••' }}
                </p>
              </div>

              <!-- Illustration -->
              <div class="relative flex h-32.5 w-38.75 items-center justify-center">
                <div class="absolute bottom-3 h-10.5 w-32.5 rounded-full bg-cyan-200/60 blur-md"></div>
                <div class="absolute bottom-2 h-18 w-30 rounded-7 border border-cyan-100 bg-cyan-50/70"></div>
                <div class="relative z-10 flex h-19.5 w-19.5 items-center justify-center rounded-full bg-linear-to-br from-[#eafffb] to-[#08a99f] shadow-xl">
                  <Icon icon="mdi:alpha-t-circle" class="text-[54px] text-white" />
                </div>
                <div class="absolute right-2 top-5 flex h-11 w-11 items-center justify-center rounded-full bg-white/80 shadow-sm">
                  <Icon icon="mdi:chart-bar" class="text-[24px] text-[#20c7b7]" />
                </div>
                <Icon icon="mdi:plus" class="absolute left-2 top-12 text-[22px] text-[#20c7b7]" />
                <Icon icon="mdi:diamond-stone" class="absolute bottom-7 right-7 text-[17px] text-[#20c7b7]" />
              </div>
            </div>

            <div class="mt-6 h-px bg-gray-100"></div>

            <!-- STATS -->
            <div class="mt-5 grid grid-cols-3 divide-x divide-gray-100">
              <div>
                <div class="relative flex items-center gap-1 text-[11px] font-medium text-[#7a86a4]">
                  Est. Daily Reward
                  <button type="button" @click.stop="showDailyRewardTip = !showDailyRewardTip; showAvgAprTip = false; showActivePosTip = false" class="active:scale-90">
                    <Icon icon="mdi:information-outline" class="text-[13px]" />
                  </button>
                  <Transition enter-from-class="opacity-0 scale-95" enter-active-class="transition duration-150" leave-to-class="opacity-0 scale-95" leave-active-class="transition duration-100">
                    <div v-if="showDailyRewardTip" class="absolute bottom-full left-0 z-20 mb-1.5 w-48 rounded-xl bg-[#17212f] px-3 py-2 text-[10px] font-semibold leading-relaxed text-white shadow-lg">
                      Estimated daily earnings based on your total staked amount and APR of each position.
                      <div class="absolute -bottom-1 left-3 h-2 w-2 rotate-45 bg-[#17212f]"></div>
                    </div>
                  </Transition>
                </div>
                <p class="mt-2 text-[16px] font-semibold text-[#20c7b7]">{{ formatAmount(summary.daily_reward) }} USDT</p>
                <p class="mt-1 text-[11px] font-medium text-[#7a86a4]">≈ ${{ formatAmount(summary.daily_reward) }}</p>
              </div>
              <div class="px-4">
                <div class="relative flex items-center gap-1 text-[11px] font-medium text-[#7a86a4]">
                  Avg APR
                  <button type="button" @click.stop="showAvgAprTip = !showAvgAprTip; showDailyRewardTip = false; showActivePosTip = false" class="active:scale-90">
                    <Icon icon="mdi:information-outline" class="text-[13px]" />
                  </button>
                  <Transition enter-from-class="opacity-0 scale-95" enter-active-class="transition duration-150" leave-to-class="opacity-0 scale-95" leave-active-class="transition duration-100">
                    <div v-if="showAvgAprTip" class="absolute bottom-full left-0 z-20 mb-1.5 w-48 rounded-xl bg-[#17212f] px-3 py-2 text-[10px] font-semibold leading-relaxed text-white shadow-lg">
                      Weighted average Annual Percentage Rate across all your active staking positions.
                      <div class="absolute -bottom-1 left-3 h-2 w-2 rotate-45 bg-[#17212f]"></div>
                    </div>
                  </Transition>
                </div>
                <p class="mt-2 text-[16px] font-semibold text-[#20c7b7]">{{ summary.avg_apr }}%</p>
              </div>
              <div class="pl-4">
                <div class="relative flex items-center gap-1 text-[11px] font-medium text-[#7a86a4]">
                  Active Positions
                  <button type="button" @click.stop="showActivePosTip = !showActivePosTip; showDailyRewardTip = false; showAvgAprTip = false" class="active:scale-90">
                    <Icon icon="mdi:information-outline" class="text-[13px]" />
                  </button>
                  <Transition enter-from-class="opacity-0 scale-95" enter-active-class="transition duration-150" leave-to-class="opacity-0 scale-95" leave-active-class="transition duration-100">
                    <div v-if="showActivePosTip" class="absolute bottom-full right-0 z-20 mb-1.5 w-48 rounded-xl bg-[#17212f] px-3 py-2 text-[10px] font-semibold leading-relaxed text-white shadow-lg">
                      Number of staking positions currently active and earning rewards.
                      <div class="absolute -bottom-1 right-3 h-2 w-2 rotate-45 bg-[#17212f]"></div>
                    </div>
                  </Transition>
                </div>
                <p class="mt-2 text-[16px] font-semibold text-[#20c7b7]">{{ summary.active_positions }}</p>
              </div>
            </div>
          </div>
        </section>

        <!-- TABS -->
        <section class="mt-5 px-8">
          <div class="grid h-10.5 grid-cols-2 rounded-2xl bg-[#f0f3f8] p-1 shadow-inner">
            <button
              v-for="tab in tabs"
              :key="tab"
              @click="activeTab = tab"
              class="rounded-xl text-[13px] font-semibold transition"
              :class="activeTab === tab ? 'bg-white text-[#20c7b7] shadow-sm' : 'text-[#6b7280]'"
            >
              {{ tab }}
            </button>
          </div>
        </section>

        <!-- STAKING PRODUCTS -->
        <section class="mt-5 space-y-3">
          <article
            v-for="item in filteredProducts"
            :key="item.asset + item.subtitle"
            class="flex items-center gap-3 rounded-2xl border border-gray-100 bg-white px-4 py-4 shadow-sm"
          >
            <!-- Asset -->
            <div class="flex flex-1 items-center gap-3">
              <div
                class="flex h-12 w-12 shrink-0 items-center justify-center rounded-full overflow-hidden"
                :class="item.image_url ? '' : item.iconClass"
              >
                <img v-if="item.image_url" :src="item.image_url" :alt="item.asset" class="h-full w-full object-cover" />
                <CoinIcon v-else :icon="item.icon" :symbol="item.asset" icon-class="text-[28px]" img-class="h-7 w-7 rounded-full" />
              </div>
              <div>
                <h2 class="text-[16px] font-semibold leading-none text-[#0b1638]">{{ item.asset }}</h2>
                <p class="mt-1 text-[11px] font-medium text-[#7a86a4]">{{ item.subtitle }}</p>
              </div>
            </div>
            <!-- APR + Min (column) -->
            <div class="flex flex-col items-center gap-3 shrink-0">
              <div class="text-center">
                <p class="text-[10px] font-medium text-[#7a86a4]">APR</p>
                <p class="mt-1 text-[15px] font-semibold text-[#20c7b7]">{{ item.apr }}</p>
              </div>
              <div class="text-center">
                <p class="text-[10px] font-medium text-[#7a86a4]">Min.</p>
                <p class="mt-1 text-[12px] font-semibold text-[#4b5575]">{{ item.minAmount }}</p>
              </div>
            </div>
            <!-- CTA -->
            <button
              @click="openStake(item)"
              class="h-10 shrink-0 rounded-xl bg-[#08a99f] px-4 text-[13px] font-semibold text-white shadow-sm active:scale-95"
            >
              Stake
            </button>
          </article>
        </section>

        <!-- MY POSITIONS -->
        <section v-if="userPositions.length > 0" class="mt-5">
          <div class="mb-3 flex items-center justify-between">
            <h2 class="text-[13px] font-semibold text-[#0b1638]">My Positions</h2>
            <button
              @click="router.push('/staking-transactions')"
              class="text-[12px] font-semibold text-[#20c7b7]"
            >
              View All
            </button>
          </div>
          <article
            v-for="pos in userPositions"
            :key="pos.id"
            class="mb-2 flex items-center gap-3 rounded-2xl border border-gray-100 bg-white px-4 py-4 shadow-sm"
          >
            <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full" :class="coinClass(pos.coin)">
              <CoinIcon :icon="coinIconResolved(pos.coin)" :symbol="pos.coin" icon-class="text-[24px]" img-class="h-6 w-6 rounded-full" />
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-[14px] font-semibold text-[#0b1638]">{{ pos.coin }}</p>
              <p class="text-[11px] font-medium text-[#7a86a4]">{{ pos.type === 'flexible' ? 'Flexible' : (pos.duration_days ? pos.duration_days + ' Days' : 'Locked') }}</p>
            </div>
            <div class="shrink-0 text-right">
              <p class="text-[13px] font-semibold text-[#0b1638]">{{ formatAmount(pos.amount) }}</p>
              <p class="text-[11px] font-semibold text-[#20c7b7]">{{ Number(pos.apr).toFixed(2) }}% APR</p>
            </div>
            <button
              @click="openUnstake(pos)"
              class="ml-2 h-9 shrink-0 rounded-xl border border-gray-200 px-3 text-[12px] font-semibold text-[#4b5575] active:scale-95"
            >
              Unstake
            </button>
          </article>
        </section>

        <!-- HOW STAKING WORKS -->
        <section
          class="mt-5 flex items-center justify-between rounded-2xl border border-[#dff8f6] bg-[#fbfffe] px-5 py-5 shadow-sm"
          @click="showHowItWorks = true"
        >
          <div class="flex items-center gap-4">
            <div class="flex h-14.5 w-14.5 shrink-0 items-center justify-center rounded-full bg-[#eafffb]">
              <Icon icon="mdi:shield-check" class="text-[30px] text-[#20c7b7]" />
            </div>
            <div>
              <h2 class="text-[14px] font-semibold text-[#0b1638]">How Staking Works</h2>
              <p class="mt-1 text-[11px] font-medium leading-relaxed text-[#7a86a4]">
                Stake your crypto to earn rewards. Rewards are added daily and can be withdrawn anytime.
              </p>
            </div>
          </div>
          <Icon icon="mdi:chevron-right" class="shrink-0 text-[24px] text-[#20c7b7]" />
        </section>
      </div>
    </div>

    <!-- BACKDROP -->
    <Teleport to="body">
      <Transition
        enter-from-class="opacity-0"
        enter-active-class="transition-opacity duration-300"
        leave-to-class="opacity-0"
        leave-active-class="transition-opacity duration-300"
      >
        <div
          v-if="selectedProduct || showHowItWorks || showTnC || unstakeTarget"
          class="fixed inset-0 z-50 bg-black/50"
          @click="selectedProduct = null; showHowItWorks = false; showTnC = false; unstakeTarget = null"
        ></div>
      </Transition>

      <!-- STAKE SHEET -->
      <Transition
        enter-from-class="translate-y-full"
        enter-active-class="transition-transform duration-300"
        leave-to-class="translate-y-full"
        leave-active-class="transition-transform duration-300"
      >
        <div
          v-if="selectedProduct"
          class="fixed inset-x-0 bottom-0 z-50 mx-auto max-w-107.5 rounded-t-3xl bg-white shadow-2xl"
        >
          <div class="flex justify-center pt-3">
            <div class="h-1 w-10 rounded-full bg-gray-200"></div>
          </div>
          <div class="px-5 pb-10 pt-4">
            <div class="flex items-center justify-between">
              <h3 class="text-[15px] font-semibold text-[#17212f]">Stake {{ selectedProduct.asset }}</h3>
              <button @click="selectedProduct = null">
                <Icon icon="mdi:close" class="text-[22px] text-gray-400" />
              </button>
            </div>
            <div class="mt-4 rounded-xl bg-[#f6f8fb] p-4 space-y-2">
              <div class="flex justify-between">
                <p class="text-[11px] font-bold text-gray-400">APR</p>
                <p class="text-[11px] font-semibold text-[#20c7b7]">{{ selectedProduct.apr }}</p>
              </div>
              <div class="flex justify-between">
                <p class="text-[11px] font-bold text-gray-400">Min. Amount</p>
                <p class="text-[11px] font-semibold text-[#17212f]">{{ selectedProduct.minAmount }}</p>
              </div>
              <div class="flex justify-between">
                <p class="text-[11px] font-bold text-gray-400">Type</p>
                <p class="text-[11px] font-semibold text-[#17212f]">{{ selectedProduct.subtitle }}</p>
              </div>
            </div>
            <div class="mt-4">
              <label class="text-[11px] font-semibold text-[#344054]">Amount</label>
              <div class="mt-2 flex items-center rounded-xl border border-gray-200 bg-white px-4 py-3">
                <input
                  v-model="stakeAmount"
                  type="number"
                  placeholder="0.00"
                  class="min-w-0 flex-1 bg-transparent text-[13px] font-semibold text-[#17212f] outline-none placeholder:text-gray-400"
                />
                <span class="shrink-0 pl-2 text-[11px] font-semibold text-gray-400">{{ selectedProduct.asset }}</span>
              </div>
            </div>
            <button
              @click="confirmStake"
              :disabled="stakeLoading"
              class="mt-5 h-12 w-full rounded-xl bg-[#08a99f] text-[13px] font-semibold text-white active:scale-95 disabled:opacity-60"
            >
              {{ stakeLoading ? 'Processing…' : 'Confirm Stake' }}
            </button>
          </div>
        </div>
      </Transition>

      <!-- HOW IT WORKS SHEET -->
      <Transition
        enter-from-class="translate-y-full"
        enter-active-class="transition-transform duration-300"
        leave-to-class="translate-y-full"
        leave-active-class="transition-transform duration-300"
      >
        <div
          v-if="showHowItWorks"
          class="fixed inset-x-0 bottom-0 z-50 mx-auto max-w-107.5 rounded-t-3xl bg-white shadow-2xl"
        >
          <div class="flex justify-center pt-3">
            <div class="h-1 w-10 rounded-full bg-gray-200"></div>
          </div>
          <div class="px-5 pb-10 pt-4">
            <h3 class="text-[15px] font-semibold text-[#17212f]">How Staking Works</h3>
            <div class="mt-4 space-y-4">
              <div v-for="step in howItWorksSteps" :key="step.title" class="flex items-start gap-4">
                <div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#e9fffc]">
                  <Icon :icon="step.icon" class="text-[20px] text-[#20c7b7]" />
                </div>
                <div>
                  <h4 class="text-[12px] font-semibold text-[#17212f]">{{ step.title }}</h4>
                  <p class="mt-1 text-[11px] font-medium leading-relaxed text-gray-400">{{ step.desc }}</p>
                </div>
              </div>
            </div>
            <button
              @click="showHowItWorks = false"
              class="mt-6 h-12 w-full rounded-xl bg-[#08a99f] text-[13px] font-semibold text-white active:scale-95"
            >
              Got It
            </button>
          </div>
        </div>
      </Transition>

      <!-- T&C SHEET -->
      <Transition
        enter-from-class="translate-y-full"
        enter-active-class="transition-transform duration-300"
        leave-to-class="translate-y-full"
        leave-active-class="transition-transform duration-300"
      >
        <div
          v-if="showTnC"
          class="fixed inset-x-0 bottom-0 z-50 mx-auto max-w-107.5 rounded-t-3xl bg-white shadow-2xl"
        >
          <div class="flex justify-center pt-3">
            <div class="h-1 w-10 rounded-full bg-gray-200"></div>
          </div>
          <div class="flex items-center justify-between px-5 pb-3 pt-4">
            <h3 class="text-[15px] font-semibold text-[#17212f]">Terms &amp; Conditions</h3>
            <button @click="showTnC = false">
              <Icon icon="mdi:close" class="text-[22px] text-gray-400" />
            </button>
          </div>

          <div
            ref="tncScrollEl"
            @scroll="onTncScroll"
            class="max-h-[62dvh] overflow-y-auto px-5 pb-2 text-[13px] leading-relaxed text-gray-700"
          >
            <p class="font-semibold text-[#17212f]">Terms &amp; Conditions – Smart Arbitrage (Lock Coin APR)</p>

            <h4 class="mt-4 text-[12px] font-semibold text-[#17212f]">Lock Coin APR Program</h4>
            <p class="mt-1">The Smart Arbitrage – Lock Coin APR feature allows users to lock their crypto assets for a fixed period in exchange for an Annual Percentage Rate (APR) reward.</p>
            <p class="mt-1">The minimum lock-up period is 1 month (30 calendar days).</p>

            <h4 class="mt-4 text-[12px] font-semibold text-[#17212f]">Early Withdrawal</h4>
            <p class="mt-1">If the user withdraws funds before completing 1 full month, the following conditions apply:</p>
            <ul class="mt-1 list-disc space-y-1 pl-5">
              <li>A 1% penalty fee will be deducted from the total withdrawn amount.</li>
              <li>All accrued APR interest will be canceled and not paid out.</li>
            </ul>

            <h4 class="mt-4 text-[12px] font-semibold text-[#17212f]">Withdrawal After Maturity</h4>
            <p class="mt-1">If funds are withdrawn after the 1-month lock-up period, the user is entitled to:</p>
            <ul class="mt-1 list-disc space-y-1 pl-5">
              <li>The full principal amount (no deduction).</li>
              <li>The APR interest as calculated by the system.</li>
            </ul>

            <h4 class="mt-4 text-[12px] font-semibold text-[#17212f]">APR Calculation</h4>
            <ul class="mt-1 list-disc space-y-1 pl-5">
              <li>Interest is calculated based on the locked amount and the lock-up duration, in accordance with system rules.</li>
              <li>APR interest is only valid if the user completes the full lock-up period (≥ 1 month).</li>
            </ul>

            <h4 class="mt-4 text-[12px] font-semibold text-[#17212f]">Risks &amp; Responsibility</h4>
            <ul class="mt-1 list-disc space-y-1 pl-5">
              <li>Users acknowledge that crypto assets are subject to market volatility.</li>
              <li>The platform is not responsible for any loss in asset value caused by market fluctuations.</li>
              <li>By joining this program, users are deemed to have understood and accepted all associated risks.</li>
            </ul>

            <h4 class="mt-4 text-[12px] font-semibold text-[#17212f]">Amendments</h4>
            <p class="mt-1">The platform reserves the right to review and amend these terms at any time, with prior notice to users.</p>
            <div class="h-4"></div>
          </div>

          <div class="border-t border-gray-100 px-5 py-3">
            <button
              @click="tncScrolledToBottom && (showTnC = false)"
              :disabled="!tncScrolledToBottom"
              class="h-11 w-full rounded-xl text-[13px] font-semibold text-white transition-all"
              :class="tncScrolledToBottom ? 'bg-[#08a99f] active:scale-[0.99]' : 'cursor-not-allowed bg-gray-300'"
            >I Understand</button>
            <p v-if="!tncScrolledToBottom" class="mt-2 text-center text-[10px] font-semibold text-gray-400">Scroll to the bottom to continue</p>
          </div>
        </div>
      </Transition>

      <!-- UNSTAKE CONFIRM SHEET -->
      <Transition
        enter-from-class="translate-y-full"
        enter-active-class="transition-transform duration-300"
        leave-to-class="translate-y-full"
        leave-active-class="transition-transform duration-300"
      >
        <div
          v-if="unstakeTarget"
          class="fixed inset-x-0 bottom-0 z-50 mx-auto max-w-107.5 rounded-t-3xl bg-white shadow-2xl"
        >
          <div class="flex justify-center pt-3">
            <div class="h-1 w-10 rounded-full bg-gray-200"></div>
          </div>
          <div class="px-5 pb-10 pt-4">
            <div class="flex items-center justify-between">
              <h3 class="text-[15px] font-semibold text-[#17212f]">Unstake {{ unstakeTarget.coin }}</h3>
              <button @click="unstakeTarget = null">
                <Icon icon="mdi:close" class="text-[22px] text-gray-400" />
              </button>
            </div>
            <div class="mt-4 rounded-xl bg-[#f6f8fb] p-4 space-y-2">
              <div class="flex justify-between">
                <p class="text-[11px] font-bold text-gray-400">Amount</p>
                <p class="text-[11px] font-semibold text-[#17212f]">{{ formatAmount(unstakeTarget.amount) }} {{ unstakeTarget.coin }}</p>
              </div>
              <div class="flex justify-between">
                <p class="text-[11px] font-bold text-gray-400">APR</p>
                <p class="text-[11px] font-semibold text-[#20c7b7]">{{ Number(unstakeTarget.apr).toFixed(2) }}%</p>
              </div>
              <div v-if="unstakeTarget.matures_at" class="flex justify-between">
                <p class="text-[11px] font-bold text-gray-400">Matures At</p>
                <p class="text-[11px] font-semibold text-[#17212f]">{{ fmtDate(unstakeTarget.matures_at) }}</p>
              </div>
              <div v-if="isEarlyWithdrawal(unstakeTarget)" class="flex justify-between">
                <p class="text-[11px] font-bold text-rose-400">Early Fee ({{ unstakeTarget.early_withdrawal_fee_pct }}%)</p>
                <p class="text-[11px] font-semibold text-rose-500">
                  -{{ (Number(unstakeTarget.amount) * Number(unstakeTarget.early_withdrawal_fee_pct) / 100).toFixed(4) }} {{ unstakeTarget.coin }}
                </p>
              </div>
            </div>
            <p v-if="isEarlyWithdrawal(unstakeTarget)" class="mt-3 rounded-xl bg-rose-50 px-4 py-3 text-[11px] font-medium leading-relaxed text-rose-600">
              ⚠ Withdrawing before maturity will forfeit accrued rewards and apply a fee.
            </p>
            <button
              @click="confirmUnstake"
              :disabled="unstakeLoading"
              class="mt-5 h-12 w-full rounded-xl bg-[#08a99f] text-[13px] font-semibold text-white active:scale-95 disabled:opacity-60"
            >
              {{ unstakeLoading ? 'Processing…' : 'Confirm Unstake' }}
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
import CoinIcon from '@/components/CoinIcon.vue'
import { makeContentApi, makeStakingApi, type StakingPosition } from '@/services/api'
import { useAuthStore } from '@/stores/auth'
import { useMarketStore, coinIconClass } from '@/stores/market'
import { useToast } from '@/composables/useToast'

const router = useRouter()
const auth = useAuthStore()
const marketStore = useMarketStore()
const toast = useToast()

interface StakingProduct {
  id: number
  asset: string
  subtitle: string
  image_url: string | null
  icon: string
  iconClass: string
  apr: string
  minAmount: string
  type: 'Flexible' | 'Locked'
}

const showBalance = ref(true)
const activeTab = ref('Flexible')
const tabs = ['Flexible', 'Locked']
const selectedProduct = ref<StakingProduct | null>(null)
const showHowItWorks = ref(false)
const stakeAmount = ref('')
const stakeLoading = ref(false)

// Tooltip visibility
const showDailyRewardTip = ref(false)
const showAvgAprTip      = ref(false)
const showActivePosTip   = ref(false)

const showTnC = ref(false)
const tncScrolledToBottom = ref(false)
const tncScrollEl = ref<HTMLElement | null>(null)

// Unstake
const unstakeTarget = ref<StakingPosition | null>(null)
const unstakeLoading = ref(false)

// Summary
const summary = ref({ total_staked: '0', daily_reward: '0', avg_apr: '0.00', active_positions: 0 })

// User's active positions
const userPositions = ref<StakingPosition[]>([])

function onTncScroll(e: Event) {
  const el = e.target as HTMLElement
  tncScrolledToBottom.value = el.scrollTop + el.clientHeight >= el.scrollHeight - 8
}

// ── Helpers ──────────────────────────────────────────────────────────────────
function trimDecimal(val: string | number): string {
  const n = Number(val)
  if (isNaN(n)) return '0'
  return n.toFixed(6)
}

function formatAmount(val: string | number): string {
  const n = Number(val)
  if (isNaN(n)) return '0.00'
  if (n === 0) return '0.00'
  if (n >= 1000) return n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  return n.toFixed(4).replace(/\.?0+$/, '') || '0'
}

function fmtDate(d: string): string {
  return new Date(d).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })
}

function isEarlyWithdrawal(pos: StakingPosition): boolean {
  if (!pos.matures_at) return false
  return Date.now() < new Date(pos.matures_at).getTime()
}

// ── Coin helpers — resolve from market store, fallback to static ──────────────
function coinIconResolved(coin: string): string {
  return marketStore.coinMap.get(coin.toUpperCase())?.icon ?? 'mdi:currency-usd-circle'
}
function coinClass(coin: string): string {
  return coinIconClass(coin.toUpperCase())
}

// ── Defaults (shown when API unavailable) ────────────────────────────────────
const defaultProducts: StakingProduct[] = [
  { id: 0, asset: 'USDT', subtitle: 'Flexible Staking', image_url: null, icon: 'mdi:alpha-t-circle',          iconClass: coinIconClass('USDT'), apr: '4.00%', minAmount: '10 USDT',   type: 'Flexible' },
  { id: 0, asset: 'ETH',  subtitle: 'Flexible Staking', image_url: null, icon: 'mdi:ethereum',                iconClass: coinIconClass('ETH'),  apr: '3.85%', minAmount: '0.01 ETH',  type: 'Flexible' },
  { id: 0, asset: 'BTC',  subtitle: '30 Days',          image_url: null, icon: 'mdi:bitcoin',                 iconClass: coinIconClass('BTC'),  apr: '5.20%', minAmount: '0.001 BTC', type: 'Locked' },
  { id: 0, asset: 'SOL',  subtitle: '30 Days',          image_url: null, icon: 'mdi:circle-multiple-outline', iconClass: coinIconClass('SOL'),  apr: '6.10%', minAmount: '0.1 SOL',   type: 'Locked' },
  { id: 0, asset: 'BNB',  subtitle: '60 Days',          image_url: null, icon: 'mdi:alpha-b-circle',          iconClass: coinIconClass('BNB'),  apr: '5.80%', minAmount: '0.05 BNB',  type: 'Locked' },
]

const stakingProducts = ref<StakingProduct[]>(defaultProducts)

async function loadSummaryAndPositions() {
  if (!auth.accessToken) return
  const stakingApi = makeStakingApi(auth.accessToken)
  try {
    const [sumData, posData] = await Promise.all([
      stakingApi.getSummary(),
      stakingApi.getPositions('active'),
    ])
    summary.value = sumData
    userPositions.value = posData.positions
  } catch { /* silently ignore */ }
}

onMounted(async () => {
  marketStore.fetchCoins()
  if (!auth.accessToken) return
  try {
    const api = makeContentApi(auth.accessToken)
    const data = await api.getStakingProducts()
    if (data.products.length > 0) {
      stakingProducts.value = data.products.map(p => ({
        id:        p.id,
        asset:     p.coin,
        subtitle:  p.type === 'flexible' ? 'Flexible Staking' : `${p.duration_days ?? 30} Days`,
        image_url: p.image_url ?? null,
        icon:      coinIconResolved(p.coin),
        iconClass: coinClass(p.coin),
        apr:       Number(p.apr).toFixed(2) + '%',
        minAmount: trimDecimal(p.min_amount) + ' ' + p.coin,
        type:      p.type === 'flexible' ? 'Flexible' : 'Locked',
      }))
    }
  } catch { /* silently use defaults */ }
  loadSummaryAndPositions()
})

const filteredProducts = computed(() =>
  stakingProducts.value.filter(p => p.type === activeTab.value)
)

function openStake(item: StakingProduct) {
  selectedProduct.value = item
  stakeAmount.value = ''
}

async function confirmStake() {
  if (!selectedProduct.value || !auth.accessToken) return
  const amount = parseFloat(stakeAmount.value)
  if (!amount || amount <= 0) {
    toast.warning('Please enter a valid amount.')
    return
  }
  if (selectedProduct.value.id === 0) {
    toast.warning('This product is not available right now.')
    return
  }
  stakeLoading.value = true
  try {
    const stakingApi = makeStakingApi(auth.accessToken)
    await stakingApi.stakeProduct(selectedProduct.value.id, amount)
    toast.success(`Successfully staked ${amount} ${selectedProduct.value.asset}!`)
    selectedProduct.value = null
    stakeAmount.value = ''
    // Reload user balance + summary
    auth.refreshProfile().catch(() => {})
    loadSummaryAndPositions()
  } catch (err: any) {
    toast.error(err?.message ?? 'Failed to stake. Please try again.')
  } finally {
    stakeLoading.value = false
  }
}

function openUnstake(pos: StakingPosition) {
  unstakeTarget.value = pos
}

async function confirmUnstake() {
  if (!unstakeTarget.value || !auth.accessToken) return
  unstakeLoading.value = true
  try {
    const stakingApi = makeStakingApi(auth.accessToken)
    const res = await stakingApi.unstakePosition(unstakeTarget.value.id)
    toast.success(`Unstaked! ${Number(res.returned_amount).toFixed(4)} ${res.coin} returned to your balance.`)
    unstakeTarget.value = null
    auth.refreshProfile().catch(() => {})
    loadSummaryAndPositions()
  } catch (err: any) {
    toast.error(err?.message ?? 'Failed to unstake. Please try again.')
  } finally {
    unstakeLoading.value = false
  }
}

const howItWorksSteps = [
  { icon: 'mdi:wallet-outline',      title: 'Choose an Asset',      desc: 'Select a crypto asset you want to stake from the available products.' },
  { icon: 'mdi:lock-outline',        title: 'Lock Your Funds',       desc: 'Enter the amount you wish to stake. Flexible stakes can be withdrawn anytime; locked stakes have a fixed term.' },
  { icon: 'mdi:chart-line',          title: 'Earn Daily Rewards',    desc: 'Rewards are calculated daily based on the APR of your chosen product and credited to your account.' },
  { icon: 'mdi:cash-multiple',       title: 'Withdraw Anytime',      desc: 'For flexible staking, redeem your funds at any time. Locked staking rewards are released at maturity.' },
]
</script>
