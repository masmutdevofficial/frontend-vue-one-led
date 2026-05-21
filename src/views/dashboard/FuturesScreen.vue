<template>
  <DashboardLayout>
    <div class="min-h-screen bg-[#f6f8fb] pb-8 text-[#17212f]">

      <!-- ═══════════ MARKET SUMMARY ═══════════ -->
      <section class="px-3 pt-3 md:px-6 lg:px-8">
        <div class="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm md:p-5">

          <!-- Mobile -->
          <div class="md:hidden">
            <div class="flex items-center justify-between gap-2">
              <div class="flex min-w-0 items-center gap-1.5 overflow-hidden">
                <h1 class="shrink-0 text-[18px] font-semibold tracking-tight">BTC/USDT</h1>
                <Icon icon="mdi:chevron-down" class="shrink-0 text-[16px]" />
                <span class="shrink-0 rounded-full border border-[#b7eee9] bg-[#f2fffe] px-2 py-0.5 text-[10px] font-semibold text-[#0aa99e]">Perpetual</span>
              </div>
              <div class="flex shrink-0 items-center gap-1.5">
                <button @click="showLeverageSheet = true" class="flex h-8 items-center gap-1 rounded-xl bg-[#f8fafc] px-2.5 text-[11px] font-semibold text-[#0aa99e] active:scale-95">
                  {{ leverage }}x <Icon icon="mdi:chevron-down" class="text-[13px]" />
                </button>
                <button @click="showMarginSheet = true" class="flex h-8 items-center gap-1 rounded-xl bg-[#f8fafc] px-2.5 text-[11px] font-semibold text-[#0aa99e] active:scale-95">
                  {{ marginMode }} <Icon icon="mdi:chevron-down" class="text-[13px]" />
                </button>
              </div>
            </div>
            <div class="mt-3 flex items-end justify-between">
              <div>
                <p class="text-[24px] font-semibold leading-none" :class="liveChange >= 0 ? 'text-[#10b8ad]' : 'text-red-400'">{{ formatPrice(livePrice) }}</p>
                <p class="mt-1 text-[11px] font-semibold text-gray-400">≈ ${{ formatPrice(livePrice) }}</p>
              </div>
              <div class="text-right">
                <p class="text-[16px] font-semibold" :class="liveChange >= 0 ? 'text-[#10b8ad]' : 'text-red-400'">{{ (liveChange >= 0 ? '+' : '') + liveChange.toFixed(2) }}%</p>
                <p class="mt-0.5 text-[10px] font-bold text-gray-400">24h Change</p>
              </div>
            </div>
          </div>

          <!-- Tablet / Desktop -->
          <div class="hidden md:grid md:grid-cols-[1.2fr_1fr_1fr_1.15fr] md:items-center md:gap-4">
            <div>
              <div class="flex items-center gap-2">
                <h1 class="text-[24px] font-semibold tracking-tight">BTC/USDT</h1>
                <Icon icon="mdi:chevron-down" class="text-[20px]" />
                <span class="rounded-full border border-[#b7eee9] bg-[#f2fffe] px-3 py-1 text-[10px] font-semibold text-[#0aa99e]">Perpetual</span>
              </div>
              <p class="mt-5 text-[12px] font-bold text-gray-400">Last Price</p>
              <p class="mt-2 text-[26px] font-semibold leading-none" :class="liveChange >= 0 ? 'text-[#10b8ad]' : 'text-red-400'">{{ formatPrice(livePrice) }}</p>
              <p class="mt-2 text-[12px] font-semibold text-gray-400">≈ ${{ formatPrice(livePrice) }}</p>
            </div>
            <div class="border-l border-gray-100 pl-6">
              <p class="text-[12px] font-bold text-gray-400">24h Change</p>
              <p class="mt-4 text-[18px] font-semibold" :class="liveChange >= 0 ? 'text-[#10b8ad]' : 'text-red-400'">{{ (liveChange >= 0 ? '+' : '') + liveChange.toFixed(2) }}%</p>
            </div>
            <div class="border-l border-gray-100 pl-6">
              <p class="text-[12px] font-bold text-gray-400">Leverage</p>
              <button @click="showLeverageSheet = true" class="mt-4 flex h-10 items-center gap-2 rounded-xl bg-[#f8fafc] px-4 text-[13px] font-semibold text-[#0aa99e] active:scale-95">
                {{ leverage }}x <Icon icon="mdi:chevron-down" class="text-[16px]" />
              </button>
            </div>
            <div>
              <p class="text-[12px] font-bold text-gray-400">Margin Mode</p>
              <button @click="showMarginSheet = true" class="mt-4 flex h-10 items-center gap-2 rounded-xl bg-[#f8fafc] px-4 text-[13px] font-semibold text-[#0aa99e] active:scale-95">
                {{ marginMode }} <Icon icon="mdi:chevron-down" class="text-[16px]" />
              </button>
            </div>
          </div>
        </div>
      </section>

      <!-- ═══════════ CHART + ORDER FORM ═══════════ -->

      <!-- Mobile tab toggle -->
      <section class="mt-4 px-3 md:hidden">
        <div class="grid h-10 grid-cols-2 rounded-xl border border-gray-100 bg-white p-1 shadow-sm">
          <button @click="activeMobileTab = 'chart'" class="rounded-lg text-[12px] font-semibold transition-colors" :class="activeMobileTab === 'chart' ? 'bg-[#eafffd] text-[#0aa99e]' : 'text-gray-400'">Chart</button>
          <button @click="activeMobileTab = 'order'" class="rounded-lg text-[12px] font-semibold transition-colors" :class="activeMobileTab === 'order' ? 'bg-[#eafffd] text-[#0aa99e]' : 'text-gray-400'">Order</button>
        </div>
      </section>

      <section class="mt-3 space-y-3 px-3 md:mt-4 md:grid md:grid-cols-[1.1fr_0.9fr] md:space-y-0 md:gap-4 md:px-6 lg:px-8">

        <!-- ── CHART (static display, no interactivity) ── -->
        <div class="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm" :class="{ 'hidden md:block': activeMobileTab !== 'chart' }">
          <div class="flex items-center justify-between px-4 py-4">
            <div class="flex items-center gap-1 overflow-x-auto md:gap-4">
              <button v-for="item in timeframes" :key="item" @click="activeTime = item" class="shrink-0 rounded-xl px-2 py-2 text-[12px] font-semibold transition-colors md:px-3" :class="activeTime === item ? 'bg-[#eafffd] text-[#0aa99e]' : 'text-gray-500'">{{ item }}</button>
            </div>
            <div class="flex shrink-0 items-center gap-3 md:gap-4">
              <Icon icon="mdi:candlestick" class="text-[20px] text-[#0aa99e]" />
              <Icon icon="mdi:dots-horizontal" class="text-[22px] text-gray-500" />
            </div>
          </div>
          <div ref="chartContainerEl" class="h-72 w-full"></div>
          <div class="flex items-center justify-between border-t border-gray-100 px-5 py-4">
            <div class="flex items-center gap-4 overflow-x-auto text-[12px] font-semibold text-gray-500 md:gap-6">
              <button v-for="ind in indicators" :key="ind" @click="activeIndicator = activeIndicator === ind ? '' : ind" class="shrink-0 transition-colors" :class="activeIndicator === ind ? 'text-[#0aa99e]' : ''">
                {{ ind }}
              </button>
            </div>
            <button class="active:scale-95"><Icon icon="mdi:arrow-expand" class="shrink-0 text-[17px] text-gray-500" /></button>
          </div>
        </div>

        <!-- ── ORDER PANEL ── -->
        <div class="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm" :class="{ 'hidden md:block': activeMobileTab !== 'order' }">

          <!-- Open / Close -->
          <div class="grid h-10 grid-cols-2 rounded-xl bg-[#f6f8fb] p-1">
            <button v-for="item in (['Open', 'Close'] as ('Open' | 'Close')[])" :key="item" @click="activePanel = item"
              class="rounded-lg text-[13px] font-semibold transition-colors"
              :class="activePanel === item ? 'border border-[#0aa99e] bg-white text-[#0aa99e]' : 'text-gray-500'"
            >{{ item }}</button>
          </div>

          <!-- Margin mode inline + balance -->
          <div class="mt-4 flex items-center justify-between">
            <button @click="showMarginSheet = true" class="flex items-center gap-1 text-[12px] font-semibold text-gray-500 active:scale-95">
              {{ marginMode }} <Icon icon="mdi:chevron-down" class="text-[15px]" />
            </button>
            <button class="flex items-center gap-2 text-[12px] font-semibold text-gray-500">
              {{ formatPrice(availableBalance) }} USDT <Icon icon="mdi:swap-horizontal" class="text-[16px]" />
            </button>
          </div>

          <!-- Order type tabs -->
          <div class="mt-4 flex items-center gap-6">
            <button v-for="tab in orderTabs" :key="tab" @click="activeOrder = tab"
              class="relative pb-2 text-[13px] font-semibold transition-colors"
              :class="activeOrder === tab ? 'text-[#0aa99e]' : 'text-gray-500'"
            >
              {{ tab }}
              <span v-if="activeOrder === tab" class="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-[#0aa99e]"></span>
            </button>
            <Icon icon="mdi:information-outline" class="ml-auto text-[16px] text-gray-400" />
          </div>

          <!-- Price & Amount -->
          <div class="mt-4 space-y-3">
            <div class="flex h-12 items-center justify-between rounded-xl border border-gray-100 bg-[#f6f8fb] px-3">
              <span class="shrink-0 text-[11px] font-bold text-gray-400">Price (USDT)</span>
              <div class="flex items-center gap-3">
                <button class="text-[18px] font-semibold text-gray-400 active:scale-90" @click="adjustPrice(-1)">−</button>
                <span class="min-w-20 text-center text-[13px] font-semibold">{{ formatPrice(orderPrice) }}</span>
                <button class="text-[18px] font-semibold text-gray-400 active:scale-90" @click="adjustPrice(1)">+</button>
              </div>
            </div>
            <div class="flex h-12 items-center justify-between rounded-xl border border-gray-100 bg-[#f6f8fb] px-3">
              <span class="shrink-0 text-[11px] font-bold text-gray-400">Amount (USDT)</span>
              <div class="flex items-center gap-3">
                <button class="text-[18px] font-semibold text-gray-400 active:scale-90" @click="adjustAmount(-1)">−</button>
                <input v-model="orderAmountInput" type="number" inputmode="decimal" placeholder="0.00"
                  class="w-20 bg-transparent text-right text-[13px] font-bold outline-none placeholder:text-gray-400" />
                <button class="text-[18px] font-semibold text-gray-400 active:scale-90" @click="adjustAmount(1)">+</button>
              </div>
            </div>
          </div>

          <!-- Functional slider -->
          <div class="mt-5">
            <div class="relative h-5">
              <div class="absolute inset-x-2 top-1/2 h-0.5 -translate-y-1/2 rounded-full bg-gray-200"></div>
              <div class="absolute left-2 top-1/2 h-0.5 -translate-y-1/2 rounded-full bg-[#0aa99e] transition-all duration-150" :style="{ width: `calc(${sliderPct}% * (100% - 16px) / 100)` }"></div>
              <button v-for="pct in [0, 25, 50, 75, 100]" :key="pct" @click="setSlider(pct)"
                class="absolute top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 transition-colors"
                :class="sliderPct >= pct ? 'border-[#0aa99e] bg-white' : 'border-gray-300 bg-white'"
                :style="{ left: pct === 0 ? '8px' : pct === 100 ? 'calc(100% - 8px)' : `${pct}%` }"
              ></button>
              <input type="range" min="0" max="100" step="1" :value="sliderPct" @input="onSliderInput"
                class="absolute inset-0 w-full cursor-pointer opacity-0" />
            </div>
            <div class="mt-1 flex justify-between text-[10px] font-bold text-gray-400">
              <span>0%</span><span>25%</span><span>50%</span><span>75%</span><span>100%</span>
            </div>
          </div>

          <!-- Stats -->
          <div class="mt-4 space-y-2">
            <div class="flex justify-between text-[12px]">
              <span class="font-bold text-gray-500">Available</span>
              <span class="font-semibold text-[#17212f]">{{ formatPrice(availableBalance) }} USDT <Icon icon="mdi:plus-circle-outline" class="inline text-[15px] text-[#0aa99e]" /></span>
            </div>
            <div class="flex justify-between text-[12px]">
              <span class="font-bold text-gray-500">Max Long</span>
              <span class="font-semibold text-[#0aa99e]">{{ maxLong }} USDT</span>
            </div>
            <div class="flex justify-between text-[12px]">
              <span class="font-bold text-gray-500">Max Short</span>
              <span class="font-semibold text-red-400">{{ maxShort }} USDT</span>
            </div>
          </div>

          <!-- TP/SL + Reduce Only -->
          <div class="mt-4 space-y-3">
            <div>
              <label class="flex cursor-pointer items-center gap-2 text-[12px] font-semibold text-[#344054]">
                <input type="checkbox" v-model="enableTpSl" class="h-4 w-4 rounded border-gray-300 accent-[#0aa99e]" />
                TP/SL
                <Icon icon="mdi:plus-circle-outline" class="text-[16px] text-[#0aa99e]" />
              </label>
              <div v-if="enableTpSl" class="mt-2 grid grid-cols-2 gap-2">
                <div class="rounded-xl border border-gray-100 bg-[#f6f8fb] px-3 py-2">
                  <p class="text-[10px] font-bold text-gray-400">Take Profit</p>
                  <input v-model="tpPrice" type="number" inputmode="decimal" placeholder="Price"
                    class="mt-0.5 w-full bg-transparent text-[12px] font-semibold text-[#10b8ad] outline-none placeholder:text-gray-300" />
                </div>
                <div class="rounded-xl border border-gray-100 bg-[#f6f8fb] px-3 py-2">
                  <p class="text-[10px] font-bold text-gray-400">Stop Loss</p>
                  <input v-model="slPrice" type="number" inputmode="decimal" placeholder="Price"
                    class="mt-0.5 w-full bg-transparent text-[12px] font-semibold text-red-400 outline-none placeholder:text-gray-300" />
                </div>
              </div>
            </div>
            <label class="flex cursor-pointer items-center gap-2 text-[12px] font-semibold text-[#344054]">
              <input type="checkbox" v-model="reduceOnly" class="h-4 w-4 rounded border-gray-300 accent-[#0aa99e]" />
              Reduce Only
              <Icon icon="mdi:information-outline" class="text-[16px] text-gray-400" />
            </label>
          </div>

          <!-- Long / Short buttons -->
          <div class="mt-5 grid grid-cols-2 gap-3">
            <button @click="confirmOrder('Long')" class="h-12 rounded-xl bg-[#08a99f] text-[14px] font-semibold text-white active:scale-[0.98]">
              Long / Buy
            </button>
            <button @click="confirmOrder('Short')" class="h-12 rounded-xl bg-red-400 text-[14px] font-semibold text-white active:scale-[0.98]">
              Short / Sell
            </button>
          </div>

          <!-- Cost estimates -->
          <div class="mt-3 grid grid-cols-2 gap-3">
            <div>
              <p class="text-[10px] font-bold text-gray-400">Cost &nbsp;{{ orderCost }} USDT</p>
              <p class="mt-1 text-[10px] font-bold text-gray-400">Est. Liq. Price &nbsp;<span class="text-[#0aa99e]">{{ estLiqLong }}</span></p>
            </div>
            <div>
              <p class="text-[10px] font-bold text-gray-400">Cost &nbsp;{{ orderCost }} USDT</p>
              <p class="mt-1 text-[10px] font-bold text-gray-400">Est. Liq. Price &nbsp;<span class="text-red-400">{{ estLiqShort }}</span></p>
            </div>
          </div>
        </div>
      </section>

      <!-- ═══════════ POSITIONS ═══════════ -->
      <section class="mt-4 px-3 md:px-6 lg:px-8">
        <div class="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
          <div class="flex items-center justify-between border-b border-gray-100 px-4 md:px-5">
            <div class="flex h-15 items-center gap-5 overflow-x-auto md:gap-9">
              <button v-for="(label, i) in bottomTabs" :key="bottomTabKeys[i]" @click="activeTab = bottomTabKeys[i]"
                class="relative h-full shrink-0 text-[13px] font-semibold transition-colors md:text-[14px]"
                :class="activeTab === bottomTabKeys[i] ? 'text-[#0aa99e]' : 'text-gray-500'"
              >
                {{ label }}
                <span v-if="activeTab === bottomTabKeys[i]" class="absolute bottom-0 left-0 right-0 h-0.75 rounded-full bg-[#0aa99e]"></span>
              </button>
            </div>
            <button class="shrink-0 active:scale-95">
              <Icon icon="mdi:format-list-bulleted" class="text-[22px] text-[#344054]" />
            </button>
          </div>

          <!-- Loading -->
          <div v-if="isLoadingPositions" class="py-12 text-center text-[13px] font-semibold text-gray-400">Loading…</div>

          <!-- Positions tab -->
          <template v-else-if="activeTab === 'positions'">
            <!-- Empty state -->
            <div v-if="positionsList.length === 0" class="flex flex-col items-center py-12 text-center">
              <div class="flex h-16 w-16 items-center justify-center rounded-full bg-[#e9fffc]">
                <Icon icon="mdi:chart-line-variant" class="text-[36px] text-[#10b8ad]" />
              </div>
              <p class="mt-4 text-[13px] font-semibold text-gray-400">No open positions</p>
            </div>
            <!-- Position card -->
            <div v-else class="p-4 md:p-5">
              <div class="flex items-start justify-between">
                <div class="flex items-center gap-3">
                  <div class="flex h-11 w-11 items-center justify-center rounded-full bg-orange-100 text-orange-500 md:h-12 md:w-12">
                    <Icon icon="mdi:bitcoin" class="text-[28px] md:text-[30px]" />
                  </div>
                  <div>
                    <div class="flex items-center gap-2">
                      <h2 class="text-[15px] font-semibold md:text-[17px]">{{ firstPosition?.symbol?.replace('USDT', '/USDT') ?? 'BTC/USDT' }}</h2>
                      <span class="rounded bg-[#eafffd] px-2 py-0.5 text-[9px] font-semibold text-[#0aa99e]">Perpetual</span>
                    </div>
                    <div class="mt-1 flex items-center gap-2">
                      <span class="text-[12px] font-semibold" :class="(firstPosition?.side ?? 'Long') === 'Long' ? 'text-[#0aa99e]' : 'text-red-400'">{{ firstPosition?.side ?? 'Long' }}</span>
                      <span class="text-[12px] font-bold text-gray-400">{{ firstPosition?.leverage ?? leverage }}x</span>
                    </div>
                  </div>
                </div>
                <div class="flex items-center gap-3 text-gray-500 md:gap-4">
                  <button @click="showShareSheet = true" class="flex items-center gap-1 text-[12px] font-bold active:scale-95">
                    <Icon icon="mdi:share-variant-outline" class="text-[17px]" />
                    <span class="hidden sm:inline">Share</span>
                  </button>
                  <button @click="showPositionMenu = true" class="active:scale-95">
                    <Icon icon="mdi:dots-vertical" class="text-[20px]" />
                  </button>
                </div>
              </div>
              <!-- Position data -->
              <div class="mt-4 grid grid-cols-2 gap-x-4 gap-y-4 md:mt-5 md:grid-cols-4 md:gap-x-6 md:gap-y-5">
                <div v-for="item in positionData" :key="item.label">
                  <p class="text-[11px] font-bold text-gray-400">{{ item.label }}</p>
                  <p class="mt-1.5 whitespace-pre-line text-[13px] font-semibold leading-snug md:mt-2 md:text-[14px]" :class="item.teal ? 'text-[#0aa99e]' : 'text-[#17212f]'">
                    {{ item.value }}
                  </p>
                </div>
                <div class="col-span-2 mt-1 md:col-span-1 md:mt-0 md:flex md:items-end md:justify-end">
                  <button @click="showCloseSheet = true" class="h-10 w-full rounded-xl border border-[#0aa99e] bg-[#f6fffe] px-6 text-[13px] font-semibold text-[#0aa99e] active:scale-95 md:w-auto">
                    Close Position
                  </button>
                </div>
              </div>
            </div>
          </template>

          <!-- Open Orders tab -->
          <template v-else-if="activeTab === 'open-orders'">
            <div class="flex flex-col items-center py-12 text-center">
              <Icon icon="mdi:clipboard-list-outline" class="text-[48px] text-gray-200" />
              <p class="mt-4 text-[13px] font-semibold text-gray-400">No open orders</p>
            </div>
          </template>

          <!-- History tab -->
          <template v-else>
            <div class="flex flex-col items-center py-12 text-center">
              <Icon icon="mdi:history" class="text-[48px] text-gray-200" />
              <p class="mt-4 text-[13px] font-semibold text-gray-400">No order history</p>
            </div>
          </template>
        </div>
      </section>

    </div>

    <!-- ═══════════ LEVERAGE SHEET ═══════════ -->
    <Transition enter-from-class="opacity-0" enter-active-class="transition duration-200" leave-to-class="opacity-0" leave-active-class="transition duration-200">
      <div v-if="showLeverageSheet" class="fixed inset-0 z-40 bg-black/30" @click="showLeverageSheet = false"></div>
    </Transition>
    <Transition enter-from-class="translate-y-full" enter-active-class="transition duration-300" leave-to-class="translate-y-full" leave-active-class="transition duration-300">
      <div v-if="showLeverageSheet" class="fixed inset-x-0 bottom-[75px] left-1/2 z-50 w-full max-w-107.5 -translate-x-1/2 rounded-t-2xl bg-white p-5 shadow-2xl">
        <div class="mx-auto mb-5 h-1 w-10 rounded-full bg-gray-200"></div>
        <h3 class="text-[16px] font-semibold">Select Leverage</h3>
        <div class="mt-5 grid grid-cols-3 gap-3">
          <button v-for="opt in leverageOptions" :key="opt" @click="leverage = opt; showLeverageSheet = false"
            class="h-12 rounded-xl border text-[15px] font-semibold transition-colors"
            :class="leverage === opt ? 'border-[#0aa99e] bg-[#eafffd] text-[#0aa99e]' : 'border-gray-100 bg-[#f6f8fb] text-[#17212f]'"
          >{{ opt }}x</button>
        </div>
        <button @click="showLeverageSheet = false" class="mt-5 h-12 w-full rounded-xl bg-[#08a99f] text-[14px] font-semibold text-white active:scale-[0.99]">Confirm</button>
      </div>
    </Transition>

    <!-- ═══════════ MARGIN MODE SHEET ═══════════ -->
    <Transition enter-from-class="opacity-0" enter-active-class="transition duration-200" leave-to-class="opacity-0" leave-active-class="transition duration-200">
      <div v-if="showMarginSheet" class="fixed inset-0 z-40 bg-black/30" @click="showMarginSheet = false"></div>
    </Transition>
    <Transition enter-from-class="translate-y-full" enter-active-class="transition duration-300" leave-to-class="translate-y-full" leave-active-class="transition duration-300">
      <div v-if="showMarginSheet" class="fixed inset-x-0 bottom-[75px] left-1/2 z-50 w-full max-w-107.5 -translate-x-1/2 rounded-t-2xl bg-white p-5 shadow-2xl">
        <div class="mx-auto mb-5 h-1 w-10 rounded-full bg-gray-200"></div>
        <h3 class="text-[16px] font-semibold">Margin Mode</h3>
        <div class="mt-5 grid grid-cols-2 gap-3">
          <button v-for="mode in ['Isolated', 'Cross']" :key="mode" @click="marginMode = mode; showMarginSheet = false"
            class="h-14 rounded-xl border text-[14px] font-semibold transition-colors"
            :class="marginMode === mode ? 'border-[#0aa99e] bg-[#eafffd] text-[#0aa99e]' : 'border-gray-100 bg-[#f6f8fb] text-[#17212f]'"
          >
            {{ mode }}
            <p class="mt-0.5 text-[10px] font-bold" :class="marginMode === mode ? 'text-[#0aa99e]/70' : 'text-gray-400'">
              {{ mode === 'Isolated' ? 'Margin per position' : 'Shared margin pool' }}
            </p>
          </button>
        </div>
        <button @click="showMarginSheet = false" class="mt-5 h-12 w-full rounded-xl bg-[#08a99f] text-[14px] font-semibold text-white active:scale-[0.99]">Confirm</button>
      </div>
    </Transition>

    <!-- ═══════════ ORDER SUCCESS SHEET ═══════════ -->
    <Transition enter-from-class="opacity-0" enter-active-class="transition duration-200" leave-to-class="opacity-0" leave-active-class="transition duration-200">
      <div v-if="showSuccess" class="fixed inset-0 z-40 bg-black/30" @click="showSuccess = false"></div>
    </Transition>
    <Transition enter-from-class="translate-y-full" enter-active-class="transition duration-300" leave-to-class="translate-y-full" leave-active-class="transition duration-300">
      <div v-if="showSuccess" class="fixed inset-x-0 bottom-[75px] left-1/2 z-50 w-full max-w-107.5 -translate-x-1/2 rounded-t-2xl bg-white px-6 pb-8 pt-6 shadow-2xl">
        <div class="mx-auto mb-6 h-1 w-10 rounded-full bg-gray-200"></div>
        <div class="flex flex-col items-center text-center">
          <div class="flex h-16 w-16 items-center justify-center rounded-full" :class="successSide === 'Long' ? 'bg-[#eafffd]' : 'bg-red-50'">
            <Icon icon="mdi:check-circle" class="text-[40px]" :class="successSide === 'Long' ? 'text-[#10b8ad]' : 'text-red-400'" />
          </div>
          <h3 class="mt-4 text-[18px] font-semibold">Order Placed!</h3>
          <p class="mt-2 text-[13px] font-semibold text-gray-500">
            {{ successSide === 'Long' ? 'Long / Buy' : 'Short / Sell' }} BTC/USDT &nbsp;·&nbsp; {{ leverage }}x
          </p>
          <div class="mt-5 w-full rounded-2xl border border-gray-100 bg-[#f6f8fb] px-5 py-4">
            <div class="grid grid-cols-2 gap-y-3 text-left">
              <div><p class="text-[11px] font-bold text-gray-400">Price</p><p class="mt-1 text-[13px] font-semibold">{{ formatPrice(orderPrice) }} USDT</p></div>
              <div><p class="text-[11px] font-bold text-gray-400">Amount</p><p class="mt-1 text-[13px] font-semibold">{{ orderAmountInput || '0.00' }} USDT</p></div>
              <div><p class="text-[11px] font-bold text-gray-400">Type</p><p class="mt-1 text-[13px] font-semibold">{{ activeOrder }}</p></div>
              <div><p class="text-[11px] font-bold text-gray-400">Margin</p><p class="mt-1 text-[13px] font-semibold">{{ marginMode }}</p></div>
            </div>
          </div>
          <button @click="showSuccess = false" class="mt-5 h-12 w-full rounded-xl bg-[#08a99f] text-[14px] font-semibold text-white active:scale-[0.99]">OK</button>
        </div>
      </div>
    </Transition>

    <!-- ═══════════ CLOSE POSITION SHEET ═══════════ -->
    <Transition enter-from-class="opacity-0" enter-active-class="transition duration-200" leave-to-class="opacity-0" leave-active-class="transition duration-200">
      <div v-if="showCloseSheet" class="fixed inset-0 z-40 bg-black/30" @click="showCloseSheet = false"></div>
    </Transition>
    <Transition enter-from-class="translate-y-full" enter-active-class="transition duration-300" leave-to-class="translate-y-full" leave-active-class="transition duration-300">
      <div v-if="showCloseSheet" class="fixed inset-x-0 bottom-[75px] left-1/2 z-50 w-full max-w-107.5 -translate-x-1/2 rounded-t-2xl bg-white px-5 pb-8 pt-5 shadow-2xl">
        <div class="mx-auto mb-5 h-1 w-10 rounded-full bg-gray-200"></div>
        <h3 class="text-[16px] font-semibold">Close Position</h3>
        <div class="mt-4 rounded-2xl border border-gray-100 bg-[#f6f8fb] px-4 py-3">
          <div class="flex justify-between text-[12px]">
            <span class="font-bold text-gray-400">Position Size</span>
            <span class="font-semibold">{{ firstPosition ? formatPrice(Number(firstPosition.size) * Number(firstPosition.entry_price)) : '—' }} USDT</span>
          </div>
          <div class="mt-2 flex justify-between text-[12px]">
            <span class="font-bold text-gray-400">Unrealized PnL</span>
            <span class="font-semibold" :class="firstPositionPnl.raw >= 0 ? 'text-[#0aa99e]' : 'text-red-400'">
              {{ firstPosition ? (firstPositionPnl.raw >= 0 ? '+' : '') + formatPrice(firstPositionPnl.raw) + ' USDT (' + (firstPositionPnl.raw >= 0 ? '+' : '') + firstPositionPnl.pct.toFixed(2) + '%)' : '—' }}
            </span>
          </div>
          <div class="mt-2 flex justify-between text-[12px]">
            <span class="font-bold text-gray-400">Mark Price</span>
            <span class="font-semibold">{{ formatPrice(livePrice) }} USDT</span>
          </div>
        </div>
        <div class="mt-4">
          <p class="text-[12px] font-bold text-gray-400">Close Amount (USDT)</p>
          <div class="mt-2 flex h-12 items-center justify-between rounded-xl border border-gray-100 bg-[#f6f8fb] px-3">
            <input v-model="closeAmount" type="number" inputmode="decimal" placeholder="Enter amount"
              class="w-full bg-transparent text-[14px] font-semibold outline-none placeholder:text-gray-300" />
            <button @click="closeAmount = firstPosition ? String(Math.floor(Number(firstPosition.size) * Number(firstPosition.entry_price))) : ''" class="shrink-0 rounded-lg bg-[#eafffd] px-3 py-1.5 text-[11px] font-semibold text-[#0aa99e]">Max</button>
          </div>
        </div>
        <div class="mt-5 grid grid-cols-2 gap-3">
          <button @click="showCloseSheet = false" class="h-12 rounded-xl border border-gray-200 bg-white text-[14px] font-semibold text-gray-500 active:scale-[0.99]">Cancel</button>
          <button @click="showCloseSheet = false; showCloseSuccess = true" class="h-12 rounded-xl bg-red-400 text-[14px] font-semibold text-white active:scale-[0.99]">Confirm Close</button>
        </div>
      </div>
    </Transition>

    <!-- Close success toast -->
    <Transition enter-from-class="opacity-0 translate-y-4" enter-active-class="transition duration-300" leave-to-class="opacity-0 translate-y-4" leave-active-class="transition duration-300">
      <div v-if="showCloseSuccess" class="fixed bottom-24 left-1/2 z-50 -translate-x-1/2 rounded-2xl bg-[#17212f] px-5 py-3 shadow-xl">
        <div class="flex items-center gap-2">
          <Icon icon="mdi:check-circle" class="text-[20px] text-[#10b8ad]" />
          <p class="text-[13px] font-semibold text-white">Position closed successfully</p>
        </div>
      </div>
    </Transition>

    <!-- Share sheet -->
    <Transition enter-from-class="opacity-0" enter-active-class="transition duration-200" leave-to-class="opacity-0" leave-active-class="transition duration-200">
      <div v-if="showShareSheet" class="fixed inset-0 z-40 bg-black/30" @click="showShareSheet = false"></div>
    </Transition>
    <Transition enter-from-class="translate-y-full" enter-active-class="transition duration-300" leave-to-class="translate-y-full" leave-active-class="transition duration-300">
      <div v-if="showShareSheet" class="fixed inset-x-0 bottom-[75px] left-1/2 z-50 w-full max-w-107.5 -translate-x-1/2 rounded-t-2xl bg-white px-5 pb-8 pt-5 shadow-2xl">
        <div class="mx-auto mb-5 h-1 w-10 rounded-full bg-gray-200"></div>
        <h3 class="text-[16px] font-semibold">Share Position</h3>
        <div class="mt-4 rounded-2xl bg-linear-to-br from-[#eafffd] to-[#f0fff9] p-5">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-[15px] font-semibold">{{ firstPosition ? firstPosition.symbol.replace('USDT', '/USDT') : 'BTC/USDT' }} Perpetual</p>
              <p class="mt-1 text-[12px] font-bold" :class="(firstPosition?.side ?? 'Long') === 'Long' ? 'text-[#0aa99e]' : 'text-red-400'">{{ firstPosition?.side ?? 'Long' }} · {{ firstPosition?.leverage ?? leverage }}x</p>
            </div>
            <div class="text-right">
              <p class="text-[20px] font-semibold" :class="firstPositionPnl.raw >= 0 ? 'text-[#0aa99e]' : 'text-red-400'">{{ (firstPositionPnl.raw >= 0 ? '+' : '') + firstPositionPnl.pct.toFixed(2) }}%</p>
              <p class="text-[11px] font-bold text-gray-400">{{ (firstPositionPnl.raw >= 0 ? '+' : '') + formatPrice(firstPositionPnl.raw) }} USDT</p>
            </div>
          </div>
        </div>
        <div class="mt-4 grid grid-cols-3 gap-3">
          <button v-for="app in ['Copy Link', 'Twitter', 'Telegram']" :key="app" @click="showShareSheet = false"
            class="flex h-12 items-center justify-center gap-2 rounded-xl border border-gray-100 bg-[#f6f8fb] text-[12px] font-semibold text-gray-600 active:scale-95"
          >
            <Icon :icon="app === 'Copy Link' ? 'mdi:content-copy' : app === 'Twitter' ? 'mdi:twitter' : 'mdi:send'" class="text-[18px]" />
            {{ app }}
          </button>
        </div>
        <button @click="showShareSheet = false" class="mt-4 h-11 w-full rounded-xl border border-gray-100 text-[13px] font-semibold text-gray-500">Cancel</button>
      </div>
    </Transition>

    <!-- Position menu -->
    <Transition enter-from-class="opacity-0" enter-active-class="transition duration-200" leave-to-class="opacity-0" leave-active-class="transition duration-200">
      <div v-if="showPositionMenu" class="fixed inset-0 z-40 bg-black/30" @click="showPositionMenu = false"></div>
    </Transition>
    <Transition enter-from-class="translate-y-full" enter-active-class="transition duration-300" leave-to-class="translate-y-full" leave-active-class="transition duration-300">
      <div v-if="showPositionMenu" class="fixed inset-x-0 bottom-[75px] left-1/2 z-50 w-full max-w-107.5 -translate-x-1/2 rounded-t-2xl bg-white pb-8 pt-5 shadow-2xl">
        <div class="mx-auto mb-3 h-1 w-10 rounded-full bg-gray-200"></div>
        <button v-for="action in positionActions" :key="action.label" @click="showPositionMenu = false"
          class="flex w-full items-center gap-3 px-6 py-4 text-left text-[14px] font-semibold active:bg-gray-50"
          :class="action.danger ? 'text-red-400' : 'text-[#17212f]'"
        >
          <Icon :icon="action.icon" class="text-[20px]" :class="action.danger ? 'text-red-300' : 'text-gray-400'" />
          {{ action.label }}
        </button>
      </div>
    </Transition>

    <!-- ═══════════ FUTURES NOTICE MODAL ═══════════ -->
    <Transition name="fade">
      <div v-if="showNotice" class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
        <div class="w-full max-w-sm rounded-2xl bg-white px-6 py-6 shadow-xl">
          <div class="mb-4 flex items-center gap-3">
            <span class="text-2xl leading-none text-yellow-400">⚠</span>
            <h2 class="text-[18px] font-semibold tracking-wide text-gray-900">Notice</h2>
          </div>
          <div class="space-y-4 text-[14px] leading-relaxed tracking-wide text-gray-500">
            <p>
              Your account is still new.<br />
              The Futures Trading feature will be available once your account has been active for a longer period.
            </p>
            <p>
              This is to ensure security and provide you with the best trading experience.<br />
              Thank you for your understanding.
            </p>
          </div>
          <div class="mt-6 flex justify-end">
            <button
              type="button"
              @click="showNotice = false"
              class="rounded-xl border border-gray-200 px-6 py-2.5 text-[14px] font-medium text-gray-700 shadow-sm active:scale-95"
            >OK</button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Overlay blocking interaction after notice dismissed -->
    <div v-if="!showNotice" class="fixed inset-0 z-40 cursor-not-allowed bg-transparent"></div>

  </DashboardLayout>


</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { Icon } from '@iconify/vue'
import DashboardLayout from '../../layouts/DashboardLayout.vue'
import { useMarketWs } from '@/services/marketWs'
import { useAuthStore } from '@/stores/auth'
import { makeTradeApi, type FuturesPosition } from '@/services/api'
import {
  createChart,
  CandlestickSeries,
  HistogramSeries,
  type IChartApi,
  type ISeriesApi,
  type CandlestickSeriesOptions,
  type HistogramSeriesOptions,
  type CandlestickData,
  type HistogramData,
} from 'lightweight-charts'

const { tickerMap } = useMarketWs()
const auth = useAuthStore()

// ── Constants ─────────────────────────────────────────────────
const timeframes      = ['1m', '5m', '15m', '1H', '4H', '1D']
const orderTabs       = ['Limit', 'Market', 'Trigger']
const bottomTabKeys   = ['positions', 'open-orders', 'history']
const leverageOptions = [5, 10, 20, 50, 100, 125]
const indicators      = ['MA', 'EMA', 'BOLL', 'VOL', 'MACD', 'KDJ']
const positionActions = [
  { label: 'Add Margin',        icon: 'mdi:plus-circle-outline',  danger: false },
  { label: 'Edit TP/SL',        icon: 'mdi:target',               danger: false },
  { label: 'View Order Detail', icon: 'mdi:file-document-outline', danger: false },
  { label: 'Close Position',    icon: 'mdi:close-circle-outline',  danger: true  },
]

// ── Live price from WS + simulation (same as TradeScreen) ──────
const livePrice  = ref(67000)
const liveChange = ref(0)

// ── UI state ──────────────────────────────────────────────────
const activeMobileTab = ref<'chart' | 'order'>('chart')
const activeTime      = ref('15m')
const activePanel     = ref<'Open' | 'Close'>('Open')
const activeOrder     = ref('Limit')
const activeTab       = ref('positions')
const activeIndicator = ref('')

// ── Leverage & margin ─────────────────────────────────────────
const leverage          = ref(20)
const marginMode        = ref('Isolated')
const showLeverageSheet = ref(false)
const showMarginSheet   = ref(false)
const showNotice        = ref(true)

// ── Balance from auth store ───────────────────────────────────
const availableBalance = computed(() => Number(auth.user?.balance ?? 0))

const maxLong = computed(() =>
  (availableBalance.value * leverage.value).toLocaleString('en-US', { minimumFractionDigits: 2 })
)
const maxShort = computed(() => maxLong.value)

// ── Order form ────────────────────────────────────────────────
const orderPrice       = ref(64023.45)
const orderAmountInput = ref('')
const sliderPct        = ref(0)
const enableTpSl       = ref(false)
const tpPrice          = ref('')
const slPrice          = ref('')
const reduceOnly       = ref(false)

const orderCost = computed(() => {
  const amt = parseFloat(orderAmountInput.value) || 0
  return amt > 0 ? (amt / leverage.value).toFixed(2) : '0.00'
})
const estLiqLong = computed(() => {
  const amt = parseFloat(orderAmountInput.value) || 0
  return amt > 0 ? formatPrice(orderPrice.value * (1 - 1 / leverage.value)) : '-- USDT'
})
const estLiqShort = computed(() => {
  const amt = parseFloat(orderAmountInput.value) || 0
  return amt > 0 ? formatPrice(orderPrice.value * (1 + 1 / leverage.value)) : '-- USDT'
})

// sync slider → amount
watch(sliderPct, (pct) => {
  const max = availableBalance.value * leverage.value
  orderAmountInput.value = ((pct / 100) * max).toFixed(2)
})

// ── Positions from API ────────────────────────────────────────
const positionsList      = ref<FuturesPosition[]>([])
const isLoadingPositions = ref(false)

const bottomTabs = computed(() => [
  `Positions (${positionsList.value.length})`,
  'Open Orders (0)',
  'Order History',
])

const firstPosition = computed(() => positionsList.value[0] ?? null)

const firstPositionPnl = computed(() => {
  const pos = firstPosition.value
  if (!pos) return { raw: 0, pct: 0 }
  const entry   = Number(pos.entry_price)
  const size    = Number(pos.size)
  const pnlRaw  = pos.side === 'Long'
    ? (livePrice.value - entry) * size
    : (entry - livePrice.value) * size
  const pnlPct  = entry > 0 && size > 0 ? (pnlRaw / (entry * size)) * 100 : 0
  return { raw: pnlRaw, pct: pnlPct }
})

const positionData = computed(() => {
  const pos = firstPosition.value
  if (!pos) return []
  const entry = Number(pos.entry_price)
  const size  = Number(pos.size)
  const pnl   = firstPositionPnl.value
  const sign  = pnl.raw >= 0 ? '+' : ''
  return [
    { label: 'Size (USDT)',           value: formatPrice(size * entry),                                                   teal: false },
    { label: 'Entry Price',           value: formatPrice(entry),                                                           teal: false },
    { label: 'Mark Price',            value: formatPrice(livePrice.value),                                                 teal: false },
    { label: 'Unrealized PnL (USDT)', value: `${sign}${formatPrice(pnl.raw)}\n(${sign}${pnl.pct.toFixed(2)}%)`,          teal: pnl.raw >= 0 },
    { label: 'Liq. Price',            value: pos.liquidation_price ? formatPrice(Number(pos.liquidation_price)) : '—',    teal: false },
    { label: 'Margin (USDT)',         value: formatPrice(Number(pos.margin)),                                              teal: false },
  ]
})

async function fetchPositions() {
  if (!auth.accessToken) return
  isLoadingPositions.value = true
  try {
    const { positions } = await makeTradeApi(auth.accessToken).getPositions()
    positionsList.value = positions
  } catch { /* ignore */ } finally {
    isLoadingPositions.value = false
  }
}

// ── Modals / sheets ───────────────────────────────────────────
const showSuccess      = ref(false)
const successSide      = ref<'Long' | 'Short'>('Long')
const showCloseSheet   = ref(false)
const showCloseSuccess = ref(false)
const showShareSheet   = ref(false)
const showPositionMenu = ref(false)
const closeAmount      = ref('')

// ── Methods ───────────────────────────────────────────────────
function formatPrice(val: number) {
  return val.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}
function adjustPrice(dir: number) {
  orderPrice.value = Math.max(0, +(orderPrice.value + dir * 10).toFixed(2))
}
function adjustAmount(dir: number) {
  const current = parseFloat(orderAmountInput.value) || 0
  const next    = Math.max(0, current + dir * 100)
  orderAmountInput.value = next.toFixed(2)
  const max = availableBalance.value * leverage.value
  sliderPct.value = max > 0 ? Math.min(100, Math.round((next / max) * 100)) : 0
}
function setSlider(pct: number)  { sliderPct.value = pct }
function onSliderInput(e: Event) { sliderPct.value = +(e.target as HTMLInputElement).value }
function confirmOrder(side: 'Long' | 'Short') {
  successSide.value = side
  showSuccess.value = true
}

watch(showCloseSuccess, (v) => {
  if (v) setTimeout(() => (showCloseSuccess.value = false), 2500)
})

// ── Lightweight Charts ────────────────────────────────────────
const chartContainerEl = ref<HTMLElement | null>(null)
let lwChart: IChartApi | null = null
let candleSeries: ISeriesApi<'Candlestick'> | null = null
let volumeSeries:  ISeriesApi<'Histogram'>  | null = null
let lastCandleTime = 0
let lastCandle: CandlestickData | null = null
let lastVolume: HistogramData   | null = null

const tfConfig: Record<string, { bars: number; interval: number }> = {
  '1m':  { bars: 60, interval: 1    },
  '5m':  { bars: 60, interval: 5    },
  '15m': { bars: 60, interval: 15   },
  '1H':  { bars: 60, interval: 60   },
  '4H':  { bars: 60, interval: 240  },
  '1D':  { bars: 60, interval: 1440 },
}

function generateOHLC(basePrice: number, tf: string) {
  const { bars, interval } = tfConfig[tf] ?? tfConfig['15m']
  const intervalSec = interval * 60
  const nowSec = Math.floor(Date.now() / 1000)
  const currentBarTime = nowSec - (nowSec % intervalSec)
  const candles: CandlestickData[] = []
  const volumes: HistogramData[]   = []
  let price = basePrice * (0.92 + Math.random() * 0.06)
  for (let i = bars - 1; i >= 0; i--) {
    const t = currentBarTime - i * intervalSec
    const o = price
    const change = price * (Math.random() - 0.495) * 0.018
    const c = Math.max(price * 0.001, price + change)
    const h = Math.max(o, c) * (1 + Math.random() * 0.005)
    const l = Math.min(o, c) * (1 - Math.random() * 0.005)
    const vol = basePrice * (0.5 + Math.random() * 2.5)
    candles.push({ time: t as any, open: o, high: h, low: l, close: c })
    volumes.push({ time: t as any, value: vol, color: c >= o ? '#0aa99e66' : '#ef535066' })
    price = c
  }
  return { candles, volumes }
}

function updateLiveCandle() {
  if (!candleSeries || !volumeSeries) return
  const { interval } = tfConfig[activeTime.value] ?? tfConfig['15m']
  const intervalSec = interval * 60
  const nowSec  = Math.floor(Date.now() / 1000)
  const barTime = nowSec - (nowSec % intervalSec)
  if (barTime !== lastCandleTime) {
    lastCandleTime = barTime
    lastCandle = { time: barTime as any, open: livePrice.value, high: livePrice.value, low: livePrice.value, close: livePrice.value }
    lastVolume = { time: barTime as any, value: 0, color: '#0aa99e66' }
  } else if (lastCandle) {
    lastCandle = { ...lastCandle, high: Math.max(lastCandle.high, livePrice.value), low: Math.min(lastCandle.low, livePrice.value), close: livePrice.value }
    lastVolume = { time: barTime as any, value: (lastVolume?.value ?? 0) + livePrice.value * 0.05, color: livePrice.value >= lastCandle.open ? '#0aa99e66' : '#ef535066' }
  }
  if (lastCandle) try { candleSeries.update(lastCandle) } catch { /* ignore */ }
  if (lastVolume) try { volumeSeries.update(lastVolume) } catch { /* ignore */ }
}

function initChart() {
  if (!chartContainerEl.value) return
  destroyChart()
  lastCandleTime = 0; lastCandle = null; lastVolume = null
  lwChart = createChart(chartContainerEl.value, {
    layout: {
      background: { color: '#ffffff' },
      textColor: '#9ca3af',
      fontFamily: 'Inter, sans-serif',
      fontSize: 11,
    },
    grid: {
      vertLines: { color: '#f3f4f6' },
      horzLines: { color: '#f3f4f6' },
    },
    crosshair: { mode: 1 },
    rightPriceScale: { borderVisible: false },
    timeScale: { borderVisible: false, timeVisible: true, secondsVisible: false },
    handleScroll: true,
    handleScale: true,
  })
  candleSeries = lwChart.addSeries(CandlestickSeries as any, {
    upColor: '#0aa99e', downColor: '#ef5350',
    wickUpColor: '#0aa99e', wickDownColor: '#ef5350',
    borderVisible: false,
  } as Partial<CandlestickSeriesOptions>)
  candleSeries.priceScale().applyOptions({ scaleMargins: { top: 0.08, bottom: 0.22 } })
  volumeSeries = lwChart.addSeries(HistogramSeries as any, {
    priceFormat: { type: 'volume' }, priceScaleId: 'vol',
  } as Partial<HistogramSeriesOptions>)
  volumeSeries.priceScale().applyOptions({ scaleMargins: { top: 0.82, bottom: 0 } })
  const { candles, volumes } = generateOHLC(livePrice.value, activeTime.value)
  candleSeries.setData(candles)
  volumeSeries.setData(volumes)
  lwChart.timeScale().fitContent()
  const ro = new ResizeObserver(() => {
    if (lwChart && chartContainerEl.value) {
      lwChart.applyOptions({
        width:  chartContainerEl.value.clientWidth,
        height: chartContainerEl.value.clientHeight,
      })
    }
  })
  ro.observe(chartContainerEl.value)
  ;(chartContainerEl.value as any).__lwRo = ro
}

function destroyChart() {
  if (chartContainerEl.value && (chartContainerEl.value as any).__lwRo) {
    ;(chartContainerEl.value as any).__lwRo.disconnect()
  }
  if (lwChart) { lwChart.remove(); lwChart = null }
  candleSeries = null
  volumeSeries = null
}

// ── Live tick (fallback when WS has no data) ──────────────────
let timer: ReturnType<typeof setInterval>
function tick() {
  if (!tickerMap.value.get('BTCUSDT')) {
    const delta = livePrice.value * (Math.random() - 0.499) * 0.0005
    livePrice.value  = Math.max(1, livePrice.value + delta)
    liveChange.value = Math.round((liveChange.value + (Math.random() - 0.49) * 0.03) * 100) / 100
    if (activeOrder.value === 'Market') orderPrice.value = livePrice.value
  }
  updateLiveCandle()
}

// ── WS price watch ────────────────────────────────────────────
watch(tickerMap, (map) => {
  const t = map.get('BTCUSDT')
  if (!t) return
  livePrice.value  = t.price
  liveChange.value = Math.round(t.change * 100) / 100
  if (activeOrder.value === 'Market') orderPrice.value = t.price
  updateLiveCandle()
})

onMounted(() => {
  initChart()
  fetchPositions()
  timer = setInterval(tick, 800)
})
onUnmounted(() => {
  clearInterval(timer)
  destroyChart()
})
watch(activeTime, () => {
  lastCandleTime = 0; lastCandle = null; lastVolume = null
  initChart()
})
</script>
