<template>
  <DashboardLayout>
    <div class="min-h-screen bg-[#f6f8fb] text-[#17212f]" @click.self="activeDrop = null">

      <!-- TOP BAR: Buy/Sell tab + asset selector -->
      <div class="sticky top-15.5 z-20 border-b border-gray-100 bg-[#f6f8fb] px-4 pt-3 md:px-6 lg:px-8">

        <!-- Back + title row -->
        <div class="mb-3 flex items-center gap-3">
          <button
            @click="router.back()"
            class="flex h-9 w-9 items-center justify-center rounded-xl bg-white shadow-sm active:scale-95"
          >
            <Icon icon="mdi:chevron-left" class="text-[25px] text-[#1f2937]" />
          </button>
          <h1 class="text-[16px] font-semibold text-[#17212f]">P2P Trading</h1>
        </div>

        <!-- Buy/Sell pill -->
        <div class="flex items-center gap-3">
          <div class="grid h-10 w-36 grid-cols-2 rounded-xl bg-white p-1 shadow-sm">
            <button
              v-for="tab in tabs"
              :key="tab"
              @click="activeTab = tab"
              class="rounded-lg text-[12px] font-semibold transition-colors"
              :class="
                activeTab === tab
                  ? tab === 'Buy'
                    ? 'bg-[#eafffd] text-[#0ba99d]'
                    : 'bg-[#fff0f2] text-[#f05b6b]'
                  : 'text-gray-400'
              "
            >{{ tab }}</button>
          </div>

          <!-- Asset tabs -->
          <div class="flex flex-1 items-center gap-1 overflow-x-auto">
            <button
              v-for="asset in assets"
              :key="asset.name"
              @click="activeAsset = asset.name"
              class="flex h-10 shrink-0 items-center gap-1.5 rounded-xl px-3 text-[12px] font-semibold transition-colors"
              :class="activeAsset === asset.name ? 'bg-white text-[#0ba99d] shadow-sm' : 'text-gray-400 hover:text-gray-600'"
            >
              <span class="flex h-5 w-5 items-center justify-center rounded-full" :class="asset.bg">
                <CoinIcon :icon="asset.icon" :symbol="asset.name" icon-class="text-[14px]" :img-class="'h-3.5 w-3.5 rounded-full'" />
              </span>
              {{ asset.name }}
            </button>
          </div>
        </div>

        <!-- Filter bar -->
        <div class="relative mt-2">
          <div class="flex items-center gap-2 overflow-x-auto pb-3">
            <!-- Filter button -->
            <button
              @click="showFilterSheet = true"
              class="flex h-8 shrink-0 items-center gap-1.5 rounded-xl border px-3 text-[11px] font-bold shadow-sm active:scale-95 transition-colors"
              :class="hasActiveFilters ? 'border-[#0ba99d] bg-[#eafffd] text-[#0ba99d]' : 'border-gray-200 bg-white text-[#344054]'"
            >
              <Icon icon="mdi:tune-variant" class="text-[14px]" /> Filter
              <span v-if="hasActiveFilters" class="flex h-4 w-4 items-center justify-center rounded-full bg-[#0ba99d] text-[8px] font-bold text-white">{{ activeFilterCount }}</span>
            </button>

            <!-- Payment dropdown -->
            <button
              @click.stop="toggleDrop('payment')"
              class="flex h-8 shrink-0 items-center gap-1.5 rounded-xl border px-3 text-[11px] font-bold shadow-sm active:scale-95 transition-colors"
              :class="activePayments.length > 0 ? 'border-[#0ba99d] bg-[#eafffd] text-[#0ba99d]' : 'border-gray-200 bg-white text-[#344054]'"
            >
              {{ activePayments.length > 0 ? activePayments[0] : 'All Payments' }}
              <Icon :icon="activeDrop === 'payment' ? 'mdi:chevron-up' : 'mdi:chevron-down'" class="text-[14px]" />
            </button>

            <!-- Region dropdown -->
            <button
              @click.stop="toggleDrop('region')"
              class="flex h-8 shrink-0 items-center gap-1.5 rounded-xl border px-3 text-[11px] font-bold shadow-sm active:scale-95 transition-colors"
              :class="activeRegion ? 'border-[#0ba99d] bg-[#eafffd] text-[#0ba99d]' : 'border-gray-200 bg-white text-[#344054]'"
            >
              {{ activeRegion || 'All Regions' }}
              <Icon :icon="activeDrop === 'region' ? 'mdi:chevron-up' : 'mdi:chevron-down'" class="text-[14px]" />
            </button>

            <!-- Amount dropdown -->
            <button
              @click.stop="toggleDrop('amount')"
              class="flex h-8 shrink-0 items-center gap-1.5 rounded-xl border px-3 text-[11px] font-bold shadow-sm active:scale-95 transition-colors"
              :class="(amountMin || amountMax) ? 'border-[#0ba99d] bg-[#eafffd] text-[#0ba99d]' : 'border-gray-200 bg-white text-[#344054]'"
            >
              {{ (amountMin || amountMax) ? `$${amountMin || '0'} – $${amountMax || '∞'}` : 'Amount' }}
              <Icon :icon="activeDrop === 'amount' ? 'mdi:chevron-up' : 'mdi:chevron-down'" class="text-[14px]" />
            </button>

            <!-- Refresh -->
            <button
              @click="doRefresh"
              class="ml-auto flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-gray-200 bg-white shadow-sm active:scale-95"
            >
              <Icon icon="mdi:refresh" class="text-[16px] text-[#344054] transition-transform duration-700" :class="isRefreshing ? 'animate-spin' : ''" />
            </button>
          </div>

          <!-- Payment dropdown panel -->
          <Transition enter-from-class="opacity-0 -translate-y-1" enter-active-class="transition-all duration-150" leave-to-class="opacity-0 -translate-y-1" leave-active-class="transition-all duration-150">
            <div v-if="activeDrop === 'payment'" @click.stop class="absolute left-10 top-full z-30 w-56 rounded-2xl border border-gray-100 bg-white p-3 shadow-xl">
              <p class="mb-2 text-[10px] font-bold text-gray-400">Payment Method</p>
              <div class="space-y-0.5">
                <label v-for="pm in paymentOptions" :key="pm.label" class="flex cursor-pointer items-center gap-2.5 rounded-xl px-2 py-2 text-[12px] font-semibold transition hover:bg-gray-50" :class="activePayments.includes(pm.label) ? 'text-[#0ba99d]' : 'text-[#344054]'">
                  <div class="flex h-4 w-4 shrink-0 items-center justify-center rounded border transition" :class="activePayments.includes(pm.label) ? 'border-[#0ba99d] bg-[#0ba99d]' : 'border-gray-300'" @click="togglePayment(pm.label)">
                    <Icon v-if="activePayments.includes(pm.label)" icon="mdi:check" class="text-[10px] text-white" />
                  </div>
                  <Icon :icon="pm.icon" class="text-[15px]" :class="pm.color" /> {{ pm.label }}
                </label>
              </div>
              <div class="mt-2 flex gap-2 border-t border-gray-100 pt-2">
                <button @click="activePayments = []; activeDrop = null" class="flex-1 rounded-lg py-1.5 text-[11px] font-semibold text-gray-400 hover:bg-gray-50">Clear</button>
                <button @click="activeDrop = null" class="flex-1 rounded-lg bg-[#0ba99d] py-1.5 text-[11px] font-semibold text-white">Apply</button>
              </div>
            </div>
          </Transition>

          <!-- Region dropdown panel -->
          <Transition enter-from-class="opacity-0 -translate-y-1" enter-active-class="transition-all duration-150" leave-to-class="opacity-0 -translate-y-1" leave-active-class="transition-all duration-150">
            <div v-if="activeDrop === 'region'" @click.stop class="absolute left-48 top-full z-30 w-44 rounded-2xl border border-gray-100 bg-white p-3 shadow-xl">
              <p class="mb-2 text-[10px] font-bold text-gray-400">Region</p>
              <div class="space-y-0.5">
                <button v-for="r in regionOptions" :key="r" @click="activeRegion = (activeRegion === r ? '' : r); activeDrop = null" class="flex w-full items-center justify-between rounded-xl px-2 py-2 text-[12px] font-semibold transition hover:bg-gray-50" :class="activeRegion === r ? 'text-[#0ba99d]' : 'text-[#344054]'">
                  {{ r }} <Icon v-if="activeRegion === r" icon="mdi:check" class="text-[14px] text-[#0ba99d]" />
                </button>
              </div>
            </div>
          </Transition>

          <!-- Amount dropdown panel -->
          <Transition enter-from-class="opacity-0 -translate-y-1" enter-active-class="transition-all duration-150" leave-to-class="opacity-0 -translate-y-1" leave-active-class="transition-all duration-150">
            <div v-if="activeDrop === 'amount'" @click.stop class="absolute left-[calc(100%-180px)] top-full z-30 w-52 rounded-2xl border border-gray-100 bg-white p-3 shadow-xl">
              <p class="mb-2 text-[10px] font-bold text-gray-400">Amount Range (USD)</p>
              <div class="space-y-2">
                <div class="rounded-xl border border-gray-200 px-3 py-2 focus-within:border-[#0ba99d]">
                  <p class="text-[9px] font-bold text-gray-400">Min</p>
                  <input v-model="amountMin" type="number" placeholder="0" class="w-full bg-transparent text-[12px] font-semibold text-[#17212f] outline-none placeholder:text-gray-300" />
                </div>
                <div class="rounded-xl border border-gray-200 px-3 py-2 focus-within:border-[#0ba99d]">
                  <p class="text-[9px] font-bold text-gray-400">Max</p>
                  <input v-model="amountMax" type="number" placeholder="No limit" class="w-full bg-transparent text-[12px] font-semibold text-[#17212f] outline-none placeholder:text-gray-300" />
                </div>
              </div>
              <div class="mt-2 flex gap-2 border-t border-gray-100 pt-2">
                <button @click="amountMin = ''; amountMax = ''; activeDrop = null" class="flex-1 rounded-lg py-1.5 text-[11px] font-semibold text-gray-400 hover:bg-gray-50">Clear</button>
                <button @click="activeDrop = null" class="flex-1 rounded-lg bg-[#0ba99d] py-1.5 text-[11px] font-semibold text-white">Apply</button>
              </div>
            </div>
          </Transition>
        </div>
      </div>

      <!-- Transparent backdrop closes dropdowns -->
      <div v-if="activeDrop" @click="activeDrop = null" class="fixed inset-0 z-10"></div>

      <!-- MAIN CONTENT -->
      <div class="px-4 pt-4 pb-6 md:px-6 lg:px-8 lg:pt-5">

        <!-- STATS CARD -->
        <div class="relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-4 shadow-sm md:p-5">
          <div class="absolute right-0 top-0 h-full w-[35%] bg-linear-to-l from-cyan-100/80 via-cyan-50/60 to-transparent"></div>

          <!-- 2-col on mobile, 4-col on md+ -->
          <div class="relative z-10 grid grid-cols-2 gap-3 pr-22 md:grid-cols-4 md:pr-25">
            <div v-for="item in stats" :key="item.title" class="min-w-0">
              <p class="truncate text-[8px] font-bold text-gray-400 md:text-[9px]">{{ item.title }}</p>
              <p class="mt-1.5 truncate text-[14px] font-semibold leading-none text-[#17212f] md:mt-2 md:text-[16px]">{{ item.value }}</p>
              <p class="mt-1.5 truncate text-[8px] font-semibold text-[#0ba99d] md:mt-2 md:text-[9px]">{{ item.change }}</p>
            </div>
          </div>

          <!-- Illustration -->
          <img src="/images/p2p-banner.webp" alt="P2P" class="absolute right-4 top-1/2 h-20 w-20 -translate-y-1/2 object-contain md:right-6 md:h-24 md:w-24" />
        </div>

        <!-- TWO-PANEL layout on desktop: list (left) + sidebar (right) -->
        <div class="mt-4 lg:mt-5 lg:grid lg:grid-cols-[1fr_280px] lg:gap-5 xl:grid-cols-[1fr_300px]">

          <!-- MERCHANT LIST -->
          <div>
            <div class="mb-3 flex items-center justify-between">
              <p class="text-[11px] font-bold text-gray-400">
                <span v-if="filteredMerchants.length > 0">{{ filteredMerchants.length }} offers found</span>
                <span v-else class="text-orange-400">No offers found</span>
              </p>
              <button @click="toggleSort" class="flex items-center gap-1 text-[11px] font-bold text-gray-400 active:scale-95 transition-transform">
                <Icon icon="mdi:sort" class="text-[14px]" />
                Price
                <Icon :icon="sortOrder === 'asc' ? 'mdi:arrow-up' : 'mdi:arrow-down'" class="text-[12px] text-[#0ba99d]" />
              </button>
            </div>

            <!-- Loading state -->
            <div v-if="isLoading" class="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-white py-12 text-center">
              <Icon icon="mdi:loading" class="animate-spin text-[48px] text-[#0ba99d]" />
              <p class="mt-3 text-[13px] font-semibold text-gray-400">Loading offers…</p>
            </div>

            <!-- Empty state -->
            <div v-else-if="filteredMerchants.length === 0" class="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-white py-12 text-center">
              <Icon icon="mdi:magnify-remove-outline" class="text-[52px] text-gray-200" />
              <p class="mt-3 text-[13px] font-semibold text-gray-400">No matching offers</p>
              <p class="mt-1 text-[11px] font-semibold text-gray-300">Try adjusting your filters</p>
              <button @click="clearFilters" class="mt-4 rounded-xl bg-[#eafffd] px-4 py-2 text-[11px] font-bold text-[#0ba99d] active:scale-95">Clear Filters</button>
            </div>

            <!-- 1-col mobile / 2-col tablet / 1-col inside lg panel -->
            <div v-else-if="!isLoading" class="grid gap-3 md:grid-cols-2 lg:grid-cols-1">
              <article
                v-for="merchant in filteredMerchants"
                :key="merchant.name"
                class="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm transition hover:shadow-md md:p-5"
              >
                <!-- Header row -->
                <div class="flex items-start justify-between gap-3">
                  <div class="flex items-center gap-3">
                    <div class="relative shrink-0">
                      <img :src="merchant.avatar" :alt="merchant.name" class="h-11 w-11 rounded-full object-cover md:h-12 md:w-12" />
                      <span class="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white" :class="merchant.onlineType === 'online' ? 'bg-[#0ba99d]' : 'bg-orange-400'"></span>
                    </div>
                    <div class="min-w-0">
                      <div class="flex items-center gap-1.5">
                        <p class="text-[13px] font-semibold text-[#17212f]">{{ merchant.name }}</p>
                        <Icon icon="mdi:check-decagram" class="shrink-0 text-[14px] text-[#0ba99d]" />
                      </div>
                      <div class="mt-1 flex items-center gap-2 text-[10px] font-semibold">
                        <span class="flex items-center gap-0.5 text-gray-400">
                          <Icon icon="mdi:thumb-up-outline" class="text-[11px]" />
                          {{ merchant.completion }}
                        </span>
                        <span class="text-gray-300">&middot;</span>
                        <span class="text-gray-400">{{ merchant.orders }} orders</span>
                        <span class="text-gray-300">&middot;</span>
                        <span :class="merchant.onlineType === 'online' ? 'text-[#0ba99d]' : 'text-orange-400'">{{ merchant.online }}</span>
                      </div>
                    </div>
                  </div>
                  <button
                    @click="openTrade(merchant)"
                    class="h-9 w-20 shrink-0 rounded-xl text-[12px] font-bold active:scale-95 transition-transform md:h-10 md:w-24"
                    :class="merchant.type === 'buy' ? 'bg-[#08a99f] text-white' : 'bg-[#ffe8eb] text-[#f05b6b]'"
                  >{{ merchant.action }}</button>
                </div>

                <div class="my-3 h-px bg-gray-100"></div>

                <!-- Price + details -->
                <div class="grid grid-cols-2 gap-3 md:grid-cols-3">
                  <div>
                    <p class="text-[9px] font-bold uppercase tracking-wide text-gray-400">Price</p>
                    <div class="mt-1 flex items-baseline gap-1">
                      <span class="text-[20px] font-bold leading-none text-[#17212f] md:text-[22px]">{{ merchant.price }}</span>
                      <span class="text-[10px] font-semibold text-gray-400">{{ merchant.currency }}</span>
                    </div>
                  </div>
                  <div>
                    <p class="text-[9px] font-bold uppercase tracking-wide text-gray-400">Available</p>
                    <p class="mt-1 text-[11px] font-semibold text-[#344054]">{{ merchant.available }}</p>
                  </div>
                  <div class="col-span-2 md:col-span-1">
                    <p class="text-[9px] font-bold uppercase tracking-wide text-gray-400">Limit</p>
                    <p class="mt-1 text-[11px] font-semibold text-[#344054]">{{ merchant.limit }}</p>
                  </div>
                </div>

                <!-- Payment + region -->
                <div class="mt-3 flex items-center gap-2">
                  <p class="text-[9px] font-bold text-gray-400">Payment</p>
                  <div class="flex items-center gap-1.5">
                    <Icon v-for="(payment, idx) in merchant.payments" :key="idx" :icon="payment.icon" class="text-[14px]" :class="payment.color" />
                    <span class="rounded-md bg-gray-100 px-1.5 py-0.5 text-[9px] font-bold text-gray-500">{{ merchant.more }}</span>
                  </div>
                  <span class="ml-auto flex items-center gap-0.5 rounded-lg bg-gray-50 px-2 py-0.5 text-[9px] font-bold text-gray-400">
                    <Icon icon="mdi:map-marker-outline" class="text-[10px]" />{{ merchant.region }}
                  </span>
                </div>
              </article>
            </div>
          </div>

          <!-- SIDEBAR (desktop only) -->
          <aside class="hidden lg:block">
            <div class="sticky top-36.25 space-y-4">

              <!-- Quick trade card -->
              <div class="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
                <h3 class="text-[13px] font-bold text-[#17212f]">Quick Trade</h3>
                <p class="mt-0.5 text-[10px] font-semibold text-gray-400">Enter amount to find best offer</p>
                <div class="mt-4 space-y-3">
                  <div class="rounded-xl bg-[#f6f8fb] p-3">
                    <p class="text-[9px] font-bold text-gray-400">I want to {{ activeTab === 'Buy' ? 'spend' : 'sell' }}</p>
                    <div class="mt-1.5 flex items-center gap-2">
                      <input v-model="quickAmount" type="number" placeholder="0.00" class="min-w-0 flex-1 bg-transparent text-[18px] font-bold text-[#17212f] outline-none placeholder:text-gray-300" />
                      <span class="rounded-lg bg-white px-2 py-1 text-[11px] font-bold text-[#344054] shadow-sm">USD</span>
                    </div>
                  </div>
                  <div class="rounded-xl bg-[#f6f8fb] p-3">
                    <p class="text-[9px] font-bold text-gray-400">I will receive</p>
                    <div class="mt-1.5 flex items-center gap-2">
                      <span class="min-w-0 flex-1 text-[18px] font-bold text-[#0ba99d]">≈ {{ quickReceive }}</span>
                      <span class="rounded-lg bg-white px-2 py-1 text-[11px] font-bold text-[#344054] shadow-sm">{{ activeAsset }}</span>
                    </div>
                  </div>
                </div>
                <button
                  @click="openQuickTrade"
                  :disabled="!quickAmount || Number(quickAmount) <= 0 || filteredMerchants.length === 0"
                  class="mt-4 h-11 w-full rounded-xl text-[13px] font-bold text-white transition active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
                  :class="activeTab === 'Buy' ? 'bg-[#08a99f]' : 'bg-[#f05b6b]'"
                >
                  {{ activeTab }} {{ activeAsset }}
                </button>
              </div>

              <!-- Market info card -->
              <div class="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
                <h3 class="text-[13px] font-bold text-[#17212f]">Market Info</h3>
                <div class="mt-3 space-y-3">
                  <div v-for="item in stats" :key="item.title" class="flex items-center justify-between">
                    <p class="text-[10px] font-semibold text-gray-400">{{ item.title }}</p>
                    <div class="text-right">
                      <p class="text-[12px] font-bold text-[#17212f]">{{ item.value }}</p>
                      <p class="text-[9px] font-semibold text-[#0ba99d]">{{ item.change }}</p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Safety tips -->
              <div class="rounded-2xl border border-amber-100 bg-amber-50 p-4">
                <div class="flex items-center gap-2">
                  <Icon icon="mdi:shield-alert-outline" class="shrink-0 text-[18px] text-amber-500" />
                  <p class="text-[12px] font-bold text-amber-700">Safety Tips</p>
                </div>
                <ul class="mt-2 space-y-1.5">
                  <li v-for="tip in safetyTips" :key="tip" class="flex items-start gap-1.5 text-[10px] font-semibold text-amber-600">
                    <Icon icon="mdi:circle-small" class="mt-0.5 shrink-0 text-[14px]" />
                    {{ tip }}
                  </li>
                </ul>
              </div>
            </div>
          </aside>
        </div>
      </div>

      <!-- ══════════════ FILTER SHEET ══════════════ -->
      <Transition enter-from-class="opacity-0" enter-active-class="transition-opacity duration-200" leave-to-class="opacity-0" leave-active-class="transition-opacity duration-200">
        <div v-if="showFilterSheet" @click="showFilterSheet = false" class="fixed inset-0 z-40 bg-black/40"></div>
      </Transition>
      <Transition enter-from-class="translate-y-full" enter-active-class="transition-transform duration-300" leave-to-class="translate-y-full" leave-active-class="transition-transform duration-300">
        <div v-if="showFilterSheet" class="fixed inset-x-0 bottom-[75px] left-1/2 z-50 w-full  -translate-x-1/2 rounded-t-2xl bg-white shadow-2xl">
          <div class="flex justify-center pt-3"><div class="h-1 w-10 rounded-full bg-gray-200"></div></div>
          <div class="max-h-[80vh] overflow-y-auto px-4 pb-8 pt-3">
            <div class="flex items-center justify-between">
              <h3 class="text-[15px] font-bold text-[#17212f]">Filters</h3>
              <button @click="showFilterSheet = false"><Icon icon="mdi:close" class="text-[22px] text-gray-400" /></button>
            </div>
            <!-- Payment -->
            <div class="mt-5">
              <p class="text-[11px] font-bold uppercase tracking-wide text-gray-400">Payment Method</p>
              <div class="mt-2 flex flex-wrap gap-2">
                <button v-for="pm in paymentOptions" :key="pm.label" @click="togglePayment(pm.label)" class="flex items-center gap-1.5 rounded-xl border px-3 py-2 text-[11px] font-bold transition" :class="activePayments.includes(pm.label) ? 'border-[#0ba99d] bg-[#eafffd] text-[#0ba99d]' : 'border-gray-200 text-[#344054]'">
                  <Icon :icon="pm.icon" class="text-[13px]" :class="pm.color" /> {{ pm.label }}
                </button>
              </div>
            </div>
            <!-- Region -->
            <div class="mt-5">
              <p class="text-[11px] font-bold uppercase tracking-wide text-gray-400">Region</p>
              <div class="mt-2 flex flex-wrap gap-2">
                <button v-for="r in regionOptions" :key="r" @click="activeRegion = (activeRegion === r ? '' : r)" class="rounded-xl border px-3 py-2 text-[11px] font-bold transition" :class="activeRegion === r ? 'border-[#0ba99d] bg-[#eafffd] text-[#0ba99d]' : 'border-gray-200 text-[#344054]'">{{ r }}</button>
              </div>
            </div>
            <!-- Amount -->
            <div class="mt-5">
              <p class="text-[11px] font-bold uppercase tracking-wide text-gray-400">Amount Range (USD)</p>
              <div class="mt-2 grid grid-cols-2 gap-3">
                <div class="rounded-xl border border-gray-200 px-3 py-2.5 focus-within:border-[#0ba99d]">
                  <p class="text-[9px] font-bold text-gray-400">Min Amount</p>
                  <input v-model="amountMin" type="number" placeholder="0" class="mt-1 w-full bg-transparent text-[13px] font-semibold text-[#17212f] outline-none placeholder:text-gray-300" />
                </div>
                <div class="rounded-xl border border-gray-200 px-3 py-2.5 focus-within:border-[#0ba99d]">
                  <p class="text-[9px] font-bold text-gray-400">Max Amount</p>
                  <input v-model="amountMax" type="number" placeholder="No limit" class="mt-1 w-full bg-transparent text-[13px] font-semibold text-[#17212f] outline-none placeholder:text-gray-300" />
                </div>
              </div>
            </div>
            <!-- Actions -->
            <div class="mt-6 flex gap-3">
              <button @click="clearFilters" class="h-12 flex-1 rounded-xl border border-gray-200 text-[12px] font-semibold text-gray-500 active:scale-95">Clear All</button>
              <button @click="showFilterSheet = false" class="h-12 flex-1 rounded-xl bg-[#08a99f] text-[12px] font-semibold text-white active:scale-95">
                Apply<span v-if="hasActiveFilters"> ({{ activeFilterCount }})</span>
              </button>
            </div>
          </div>
        </div>
      </Transition>

      <!-- ══════════════ TRADE MODAL ══════════════ -->
      <Transition enter-from-class="opacity-0" enter-active-class="transition-opacity duration-200" leave-to-class="opacity-0" leave-active-class="transition-opacity duration-200">
        <div v-if="showTradeModal" @click="showTradeModal = false" class="fixed inset-0 z-40 bg-black/40"></div>
      </Transition>
      <Transition enter-from-class="translate-y-full" enter-active-class="transition-transform duration-300" leave-to-class="translate-y-full" leave-active-class="transition-transform duration-300">
        <div v-if="showTradeModal && selectedMerchant" class="fixed inset-x-0 bottom-[75px] left-1/2 z-50 w-full  -translate-x-1/2 rounded-t-2xl bg-white shadow-2xl">
          <div class="flex justify-center pt-3"><div class="h-1 w-10 rounded-full bg-gray-200"></div></div>
          <div class="px-4 pb-8 pt-3">
            <!-- Merchant header -->
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2.5">
                <div class="relative">
                  <img :src="selectedMerchant.avatar" :alt="selectedMerchant.name" class="h-10 w-10 rounded-full object-cover" />
                  <span class="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-white" :class="selectedMerchant.onlineType === 'online' ? 'bg-[#0ba99d]' : 'bg-orange-400'"></span>
                </div>
                <div>
                  <div class="flex items-center gap-1">
                    <p class="text-[14px] font-bold text-[#17212f]">{{ selectedMerchant.name }}</p>
                    <Icon icon="mdi:check-decagram" class="text-[13px] text-[#0ba99d]" />
                  </div>
                  <p class="text-[10px] font-semibold text-gray-400">{{ selectedMerchant.completion }} · {{ selectedMerchant.orders }} orders</p>
                </div>
              </div>
              <button @click="showTradeModal = false"><Icon icon="mdi:close" class="text-[22px] text-gray-400" /></button>
            </div>
            <!-- Price info -->
            <div class="mt-4 flex items-center justify-between rounded-xl bg-[#f6f8fb] px-4 py-3">
              <div>
                <p class="text-[9px] font-bold text-gray-400">Price</p>
                <p class="mt-0.5 text-[18px] font-bold text-[#17212f]">{{ selectedMerchant.price }} <span class="text-[12px] font-semibold text-gray-400">{{ selectedMerchant.currency }}</span></p>
              </div>
              <div class="text-right">
                <p class="text-[9px] font-bold text-gray-400">Limit</p>
                <p class="mt-0.5 text-[11px] font-semibold text-[#344054]">{{ selectedMerchant.limit }}</p>
              </div>
            </div>
            <!-- Amount input -->
            <div class="mt-4">
              <div class="flex items-center justify-between">
                <p class="text-[11px] font-bold text-gray-500">I want to {{ selectedMerchant.type === 'buy' ? 'spend' : 'receive' }}</p>
                <button @click="tradeAmount = selectedMerchant.available.split(' ')[0].replace(/,/g, '')" class="text-[10px] font-bold text-[#0ba99d]">Max</button>
              </div>
              <div class="mt-2 flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-3 focus-within:border-[#0ba99d]">
                <input v-model="tradeAmount" type="number" placeholder="0.00" class="min-w-0 flex-1 bg-transparent text-[16px] font-bold text-[#17212f] outline-none placeholder:text-gray-300" />
                <span class="text-[12px] font-bold text-gray-400">{{ selectedMerchant.currency }}</span>
              </div>
            </div>
            <!-- Total -->
            <div class="mt-3 flex items-center justify-between rounded-xl bg-[#f6f8fb] px-4 py-3">
              <p class="text-[11px] font-bold text-gray-400">I will {{ selectedMerchant.type === 'buy' ? 'receive' : 'pay' }}</p>
              <p class="text-[16px] font-bold text-[#0ba99d]">≈ {{ tradeReceive }} <span class="text-[11px] text-gray-400">{{ activeAsset }}</span></p>
            </div>
            <!-- Buttons -->
            <div class="mt-5 flex gap-3">
              <button @click="showTradeModal = false" class="h-12 flex-1 rounded-xl border border-gray-200 text-[12px] font-semibold text-gray-500 active:scale-95">Cancel</button>
              <button
                @click="confirmTrade"
                :disabled="!tradeAmount || Number(tradeAmount) <= 0"
                class="h-12 flex-1 rounded-xl text-[12px] font-semibold text-white active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                :class="selectedMerchant.type === 'buy' ? 'bg-[#08a99f]' : 'bg-[#f05b6b]'"
              >Confirm {{ selectedMerchant.action }}</button>
            </div>
          </div>
        </div>
      </Transition>

      <!-- ══════════════ SUCCESS SHEET ══════════════ -->
      <Transition enter-from-class="opacity-0" enter-active-class="transition-opacity duration-200" leave-to-class="opacity-0" leave-active-class="transition-opacity duration-200">
        <div v-if="showSuccess" @click="showSuccess = false" class="fixed inset-0 z-40 bg-black/40"></div>
      </Transition>
      <Transition enter-from-class="translate-y-full" enter-active-class="transition-transform duration-300" leave-to-class="translate-y-full" leave-active-class="transition-transform duration-300">
        <div v-if="showSuccess" class="fixed inset-x-0 bottom-[75px] left-1/2 z-50 w-full  -translate-x-1/2 rounded-t-2xl bg-white shadow-2xl">
          <div class="flex justify-center pt-3"><div class="h-1 w-10 rounded-full bg-gray-200"></div></div>
          <div class="flex flex-col items-center px-4 pb-10 pt-5 text-center">
            <div class="flex h-20 w-20 items-center justify-center rounded-full bg-[#e9fffc]">
              <Icon icon="mdi:check-circle-outline" class="text-[52px] text-[#10b8ad]" />
            </div>
            <h3 class="mt-4 text-[16px] font-bold text-[#17212f]">Order Placed!</h3>
            <p class="mt-2 text-[12px] font-semibold text-gray-400">{{ activeTab }} {{ tradeAmount }} {{ selectedMerchant?.currency }} · {{ activeAsset }}</p>
            <p class="mt-1 text-[10px] font-semibold text-gray-400">Waiting for merchant confirmation</p>
            <div class="mt-4 w-full rounded-xl bg-[#f6f8fb] px-4 py-3 text-left space-y-2">
              <div class="flex justify-between">
                <span class="text-[10px] font-bold text-gray-400">Merchant</span>
                <span class="text-[10px] font-bold text-[#17212f]">{{ selectedMerchant?.name }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-[10px] font-bold text-gray-400">You receive</span>
                <span class="text-[10px] font-bold text-[#0ba99d]">{{ tradeReceive }} {{ activeAsset }}</span>
              </div>
            </div>
            <button @click="showSuccess = false; tradeAmount = ''; selectedMerchant = null" class="mt-5 h-12 w-full rounded-xl bg-[#08a99f] text-[13px] font-bold text-white active:scale-95">Done</button>
          </div>
        </div>
      </Transition>

    </div>
  </DashboardLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { Icon } from '@iconify/vue'
import DashboardLayout from '@/layouts/DashboardLayout.vue'
import CoinIcon from '@/components/CoinIcon.vue'
import { useMarketStore, coinIconClass } from '@/stores/market'
import { p2pApi } from '@/services/api'

const router = useRouter()
const marketStore = useMarketStore()

// ─── Interfaces ────────────────────────────────────────────
interface Asset { name: string; icon: string; color: string; bg: string }
interface Stat  { title: string; value: string; change: string }
interface PaymentOption { label: string; icon: string; color: string }
interface Payment { icon: string; color: string; label: string }
interface Merchant {
  name: string; avatar: string; completion: string; orders: string
  online: string; onlineType: string; price: string; priceRaw: number; currency: string
  limit: string; available: string; action: string; type: string
  asset: string; region: string; payments: Payment[]; more: string
}

// ─── State ────────────────────────────────────────────────
const activeTab    = ref('Buy')
const activeAsset  = ref('USDT')
const sortOrder    = ref<'asc' | 'desc'>('asc')
const isRefreshing = ref(false)
const isLoading    = ref(false)

// Dropdown & filter
const activeDrop     = ref<'payment' | 'region' | 'amount' | null>(null)
const activePayments = ref<string[]>([])
const activeRegion   = ref('')
const amountMin      = ref('')
const amountMax      = ref('')
const showFilterSheet = ref(false)

// Trade modal
const showTradeModal   = ref(false)
const selectedMerchant = ref<Merchant | null>(null)
const tradeAmount      = ref('')
const showSuccess      = ref(false)

// Quick trade sidebar
const quickAmount = ref('')

// Merchants loaded from API
const merchants = ref<Merchant[]>([])

// ─── Static data ──────────────────────────────────────────
const tabs = ['Buy', 'Sell']

const ASSET_FALLBACK: Asset[] = [
  { name: 'USDT', icon: 'mdi:alpha-t-circle', color: 'text-[#12b8aa]', bg: 'bg-[#e7fffb]' },
  { name: 'BTC',  icon: 'mdi:bitcoin',        color: 'text-orange-500', bg: 'bg-orange-50' },
  { name: 'ETH',  icon: 'mdi:ethereum',       color: 'text-indigo-500', bg: 'bg-indigo-50' },
]
const assets = computed<Asset[]>(() =>
  ASSET_FALLBACK.map(a => ({
    ...a,
    icon: marketStore.coinMap.get(a.name)?.icon ?? a.icon,
    bg:   coinIconClass(a.name).split(' ')[0] || a.bg,
    color: coinIconClass(a.name).split(' ')[1] || a.color,
  }))
)

const stats: Stat[] = [
  { title: 'Total Trades',      value: '12,542',   change: '+18.45% (7D)' },
  { title: 'Completion Rate',   value: '98.65%',   change: '+0.72% (7D)'  },
  { title: 'Avg. Release Time', value: '2.45 min', change: '-0.18 min (7D)' },
  { title: 'Active Merchants',  value: '12,843',   change: '+6.21% (7D)'  },
]

const paymentOptions: PaymentOption[] = [
  { label: 'Bank Transfer', icon: 'mdi:bank',                color: 'text-[#3778ff]'  },
  { label: 'Credit Card',   icon: 'mdi:credit-card-outline', color: 'text-orange-400' },
  { label: 'E-Wallet',      icon: 'mdi:wallet-outline',      color: 'text-emerald-500'},
  { label: 'PayPal',        icon: 'mdi:paypal',              color: 'text-blue-600'   },
]

const regionOptions = ['Asia', 'Europe', 'Americas', 'Africa', 'Oceania']

const safetyTips = [
  'Only release crypto after payment is confirmed',
  'Use platform chat for all communication',
  'Verify payment in your bank account, not screenshots',
]

// ─── Helpers ─────────────────────────────────────────────
const INTEGER_CURRENCIES = new Set(['IDR', 'VND', 'JPY', 'KRW', 'NGN', 'CLP'])

function formatPrice(value: number, currency: string): string {
  if (INTEGER_CURRENCIES.has(currency)) {
    return value.toLocaleString('id-ID', { maximumFractionDigits: 0 })
  }
  return value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

// ─── API fetch ────────────────────────────────────────────
function mapApiMerchant(m: any): Merchant {
  const payments: Payment[] = Array.isArray(m.payments) ? m.payments : []
  const shown   = payments.slice(0, 3)
  const extra   = payments.length > 3 ? `+${payments.length - 3}` : ''
  return {
    name:       m.name       || `Merchant ${m.id}`,
    avatar:     m.avatar     || `https://i.pravatar.cc/120?u=${m.id}`,
    completion: `${Number(m.completion_rate ?? 0).toFixed(2)}%`,
    orders:     Number(m.total_trades ?? 0).toLocaleString(),
    online:     m.online_type === 'online' ? 'Online' : 'In Trade',
    onlineType: m.online_type ?? 'online',
    priceRaw:   Number(m.price ?? 0),
    price:      formatPrice(Number(m.price ?? 0), m.currency ?? 'USD'),
    currency:   m.currency   ?? 'USD',
    limit:      `$${Number(m.limit_min ?? 0).toLocaleString()} – $${Number(m.limit_max ?? 0).toLocaleString()}`,
    available:  m.available  ?? '–',
    action:     activeTab.value,
    type:       activeTab.value.toLowerCase(),
    asset:      m.asset      ?? activeAsset.value,
    region:     m.region     ?? '',
    payments:   shown,
    more:       extra,
  }
}

async function fetchMerchants() {
  isLoading.value = true
  try {
    const data = await p2pApi.getMerchants(activeTab.value.toLowerCase(), activeAsset.value)
    merchants.value = (data.merchants ?? []).map(mapApiMerchant)
  } catch {
    // silently fall back to empty list — no auth error expected (public endpoint)
    merchants.value = []
  } finally {
    isLoading.value = false
  }
}

onMounted(() => { marketStore.fetchCoins(); fetchMerchants() })
watch([activeTab, activeAsset], () => fetchMerchants())

// ─── Computed ─────────────────────────────────────────────
const filteredMerchants = computed(() => {
  const list = merchants.value.filter(m => {
    if (activePayments.value.length > 0) {
      if (!m.payments.some(p => activePayments.value.includes(p.label))) return false
    }
    if (activeRegion.value && m.region !== activeRegion.value) return false
    if (amountMin.value) {
      const min   = parseFloat(amountMin.value)
      const mxStr = m.limit.split('–')[1]?.replace(/[^\d.]/g, '') ?? '999999'
      if (parseFloat(mxStr) < min) return false
    }
    if (amountMax.value) {
      const max   = parseFloat(amountMax.value)
      const mnStr = m.limit.split('–')[0]?.replace(/[^\d.]/g, '') ?? '0'
      if (parseFloat(mnStr) > max) return false
    }
    return true
  })
  list.sort((a, b) =>
    sortOrder.value === 'asc' ? a.priceRaw - b.priceRaw : b.priceRaw - a.priceRaw
  )
  return list
})

const hasActiveFilters = computed(() =>
  activePayments.value.length > 0 || !!activeRegion.value || !!amountMin.value || !!amountMax.value
)

const activeFilterCount = computed(() => {
  let n = 0
  if (activePayments.value.length > 0) n++
  if (activeRegion.value) n++
  if (amountMin.value || amountMax.value) n++
  return n
})

const bestMerchant = computed(() => filteredMerchants.value[0] ?? null)

const quickReceive = computed(() => {
  const n = parseFloat(quickAmount.value)
  if (!n || !bestMerchant.value) return '0.00'
  const price = bestMerchant.value.priceRaw
  return price ? (n / price).toFixed(6) : '0.00'
})

const tradeReceive = computed(() => {
  const n = parseFloat(tradeAmount.value)
  if (!n || !selectedMerchant.value) return '0.00'
  const price = selectedMerchant.value.priceRaw
  return price ? (n / price).toFixed(6) : '0.00'
})

// ─── Actions ──────────────────────────────────────────────
function toggleDrop(name: 'payment' | 'region' | 'amount') {
  activeDrop.value = activeDrop.value === name ? null : name
}

function togglePayment(label: string) {
  const idx = activePayments.value.indexOf(label)
  if (idx === -1) activePayments.value.push(label)
  else activePayments.value.splice(idx, 1)
}

function toggleSort() {
  sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
}

function doRefresh() {
  if (isRefreshing.value || isLoading.value) return
  isRefreshing.value = true
  fetchMerchants().finally(() => { isRefreshing.value = false })
}

function clearFilters() {
  activePayments.value = []
  activeRegion.value   = ''
  amountMin.value      = ''
  amountMax.value      = ''
  showFilterSheet.value = false
}

function openTrade(merchant: Merchant) {
  selectedMerchant.value = merchant
  tradeAmount.value      = ''
  showTradeModal.value   = true
}

function openQuickTrade() {
  if (!bestMerchant.value || !quickAmount.value) return
  selectedMerchant.value = bestMerchant.value
  tradeAmount.value      = quickAmount.value
  showTradeModal.value   = true
}

function confirmTrade() {
  if (!tradeAmount.value || Number(tradeAmount.value) <= 0) return
  showTradeModal.value = false
  showSuccess.value    = true
}
</script>
