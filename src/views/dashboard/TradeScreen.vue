<template>
  <DashboardLayout>
    <div class="min-h-screen bg-[#f6f8fb] pb-8 text-[#17212f]">

      <!-- ═══════════ MARKET HEADER ═══════════ -->
      <section class="relative px-3 pt-3 md:px-6 lg:px-8">
        <div class="rounded-2xl border border-gray-100 bg-white px-4 py-4 shadow-sm">

          <!-- Mobile layout -->
          <div class="md:hidden">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2.5">
                <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full" :class="coin.iconBg">
                  <CoinIcon :icon="coin.icon" :symbol="coin.symbol" icon-class="text-[26px]" img-class="h-6 w-6 rounded-full" />
                </div>
                <div>
                  <button class="flex items-center gap-1" @click.stop="showCoinPicker = !showCoinPicker">
                    <h1 class="text-[16px] font-semibold text-[#17212f]">{{ coin.symbol }}/USDT</h1>
                    <Icon icon="mdi:chevron-down" class="text-[16px] text-gray-400 transition-transform" :class="showCoinPicker ? 'rotate-180' : ''" />
                  </button>
                  <p class="text-[11px] font-semibold text-gray-400">{{ coin.fullName }}</p>
                </div>
              </div>
              <button class="active:scale-95" @click="toggleFavorite">
                <Icon :icon="isFavorite ? 'mdi:star' : 'mdi:star-outline'" class="text-[22px] transition-colors" :class="isFavorite ? 'text-yellow-400' : 'text-gray-400'" />
              </button>
            </div>
            <div class="mt-3 flex items-end justify-between">
              <div>
                <p class="text-[24px] font-semibold leading-none text-[#17212f]">{{ formatPrice(coin.price) }}</p>
                <p class="mt-1 text-[11px] font-semibold text-gray-400">≈ ${{ formatPrice(coin.price) }}</p>
              </div>
              <span
                class="rounded-xl px-3 py-1.5 text-[14px] font-semibold"
                :class="coin.change >= 0 ? 'bg-[#eafffd] text-[#10b8ad]' : 'bg-red-50 text-red-400'"
              >{{ (coin.change >= 0 ? '+' : '') + coin.change.toFixed(2) }}%</span>
            </div>
          </div>

          <!-- Tablet / Desktop layout -->
          <div class="hidden md:flex md:items-center md:justify-between">
            <div class="flex items-center gap-3">
              <div class="flex h-14 w-14 shrink-0 items-center justify-center rounded-full" :class="coin.iconBg">
                <CoinIcon :icon="coin.icon" :symbol="coin.symbol" icon-class="text-[36px]" img-class="h-8 w-8 rounded-full" />
              </div>
              <div>
                <button class="flex items-center gap-2" @click.stop="showCoinPicker = !showCoinPicker">
                  <h1 class="text-[22px] font-semibold text-[#17212f]">{{ coin.symbol }}/USDT</h1>
                  <Icon icon="mdi:chevron-down" class="text-[22px] text-[#17212f] transition-transform" :class="showCoinPicker ? 'rotate-180' : ''" />
                </button>
                <p class="mt-1 text-[13px] font-semibold text-gray-400">{{ coin.fullName }}</p>
              </div>
            </div>
            <div class="text-center">
              <p class="text-[28px] font-semibold leading-none text-[#17212f]">{{ formatPrice(coin.price) }}</p>
              <p class="mt-2 text-[13px] font-semibold text-gray-400">≈ ${{ formatPrice(coin.price) }}</p>
            </div>
            <div class="flex items-center gap-8">
              <div class="text-center">
                <p class="text-[16px] font-semibold" :class="coin.change >= 0 ? 'text-[#10b8ad]' : 'text-red-400'">
                  {{ (coin.change >= 0 ? '+' : '') + coin.change.toFixed(2) }}%
                </p>
                <p class="mt-2 text-[13px] font-semibold text-gray-400">24h Change</p>
              </div>
              <button class="active:scale-95" @click="toggleFavorite">
                <Icon :icon="isFavorite ? 'mdi:star' : 'mdi:star-outline'" class="text-[26px] transition-colors" :class="isFavorite ? 'text-yellow-400' : 'text-gray-400'" />
              </button>
            </div>
          </div>
        </div>

        <!-- ── Coin Picker Dropdown ── -->
        <div
          v-if="showCoinPicker"
          class="absolute left-3 right-3 top-full z-50 mt-1 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-xl md:left-6 md:right-6 lg:left-8 lg:right-8"
          @click.stop
        >
          <!-- Search input -->
          <div class="border-b border-gray-100 px-4 py-3">
            <div class="flex items-center gap-2 rounded-xl bg-[#f6f8fb] px-3 py-2">
              <Icon icon="mdi:magnify" class="shrink-0 text-[18px] text-gray-400" />
              <input
                v-model="coinPickerSearch"
                placeholder="Search coin..."
                class="w-full bg-transparent text-[13px] font-semibold text-[#17212f] outline-none placeholder:text-gray-400"
                autofocus
              />
            </div>
          </div>
          <!-- Coin list -->
          <div class="max-h-64 overflow-y-auto">
            <div
              v-for="c in filteredPickerCoins"
              :key="c.symbol"
              class="flex cursor-pointer items-center justify-between px-4 py-3 transition-colors hover:bg-[#f6f8fb] active:bg-gray-100"
              @click="selectCoin(c.symbol)"
            >
              <div class="flex items-center gap-3">
                <CoinIcon :icon="c.icon" :symbol="c.symbol" icon-class="text-[22px]" img-class="h-7 w-7 rounded-full" />
                <div>
                  <p class="text-[13px] font-semibold text-[#17212f]">{{ c.symbol }}/USDT</p>
                  <p class="text-[10px] font-semibold text-gray-400">{{ c.name }}</p>
                </div>
              </div>
              <div class="text-right">
                <p class="text-[12px] font-semibold text-[#17212f]">{{ formatPrice(tickerMap.get(c.symbol + 'USDT')?.price ?? 0) }}</p>
                <p
                  class="text-[10px] font-semibold"
                  :class="(tickerMap.get(c.symbol + 'USDT')?.change ?? 0) >= 0 ? 'text-[#10b8ad]' : 'text-red-400'"
                >
                  {{ ((tickerMap.get(c.symbol + 'USDT')?.change ?? 0) >= 0 ? '+' : '') + (tickerMap.get(c.symbol + 'USDT')?.change ?? 0).toFixed(2) }}%
                </p>
              </div>
            </div>
            <div v-if="filteredPickerCoins.length === 0" class="py-8 text-center text-[13px] font-semibold text-gray-400">
              No coins found
            </div>
          </div>
        </div>

        <!-- Click outside overlay -->
        <div v-if="showCoinPicker" class="fixed inset-0 z-40" @click="showCoinPicker = false"></div>
      </section>

      <!-- ═══════════ CHART CARD ═══════════ -->
      <section class="mt-4 px-3 md:px-6 lg:px-8">
        <div class="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
          <!-- CHART TOOLBAR -->
          <div class="flex items-center justify-between border-b border-gray-100 px-4 py-3">
            <div class="flex items-center gap-1 overflow-x-auto md:gap-2">
              <button
                v-for="tf in timeframes"
                :key="tf"
                @click="activeTimeframe = tf"
                class="flex h-9 shrink-0 items-center gap-1 rounded-xl px-3 text-[12px] font-semibold transition-colors md:px-4 md:text-[13px]"
                :class="activeTimeframe === tf ? 'bg-[#eafffd] text-[#10b8ad]' : 'text-gray-500'"
              >
                {{ tf }}
                <Icon v-if="tf === 'More'" icon="mdi:chevron-down" class="text-[16px]" />
              </button>
            </div>
            <div class="flex shrink-0 items-center gap-3 md:gap-6">
              <button class="hidden items-center gap-2 text-[13px] font-semibold text-gray-500 md:flex">
                <Icon icon="mdi:swap-horizontal" class="text-[20px]" />
                Indicators
              </button>
              <button class="active:scale-95">
                <Icon icon="mdi:fullscreen" class="text-[22px] text-gray-500 md:text-[24px]" />
              </button>
            </div>
          </div>

          <!-- CHART AREA -->
          <div ref="chartContainerEl" class="relative h-72 w-full">
            <div v-if="chartLoading" class="absolute inset-0 z-10 flex items-center justify-center bg-white/70">
              <div class="h-6 w-6 animate-spin rounded-full border-2 border-[#10b8ad] border-t-transparent"></div>
            </div>
          </div>
        </div>
      </section>

      <!-- ═══════════ TRADE PANEL ═══════════ -->

      <!-- Mobile tab toggle: Trade | Order Book -->
      <section class="mt-4 px-3 md:hidden">
        <div class="grid h-10 grid-cols-2 rounded-xl border border-gray-100 bg-white p-1 shadow-sm">
          <button
            @click="activePanelTab = 'trade'"
            class="rounded-lg text-[12px] font-semibold transition-colors"
            :class="activePanelTab === 'trade' ? 'bg-[#eafffd] text-[#10b8ad]' : 'text-gray-400'"
          >Trade</button>
          <button
            @click="activePanelTab = 'orderbook'"
            class="rounded-lg text-[12px] font-semibold transition-colors"
            :class="activePanelTab === 'orderbook' ? 'bg-[#eafffd] text-[#10b8ad]' : 'text-gray-400'"
          >Order Book</button>
        </div>
      </section>

      <!-- Panel grid: 1-col on mobile / 2-col on md+ -->
      <section class="mt-3 space-y-3 px-3 md:mt-4 md:grid md:grid-cols-2 md:space-y-0 md:gap-3 md:px-6 lg:px-8">

        <!-- BUY/SELL FORM -->
        <div
          class="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm"
          :class="{ 'hidden md:block': activePanelTab !== 'trade' }"
        >
          <!-- Buy/Sell toggle -->
          <div class="grid h-10 grid-cols-2 rounded-xl bg-[#f6f8fb] p-1">
            <button
              v-for="side in sides"
              :key="side"
              @click="activeSide = side"
              class="rounded-lg text-[13px] font-semibold transition-colors"
              :class="activeSide === side ? (side === 'Buy' ? 'bg-[#08a99f] text-white' : 'bg-red-400 text-white') : 'text-gray-500'"
            >{{ side }}</button>
          </div>

          <!-- Order type -->
          <div class="mt-4 grid grid-cols-3 gap-2">
            <button
              v-for="type in orderTypes"
              :key="type"
              @click="activeOrderType = type"
              class="flex h-10 items-center justify-center gap-1 rounded-xl text-[13px] font-semibold transition-colors"
              :class="activeOrderType === type ? 'bg-[#eafffd] text-[#10b8ad]' : 'bg-[#f6f8fb] text-gray-500'"
            >
              {{ type }}
              <Icon v-if="type === 'Stop'" icon="mdi:chevron-down" class="text-[15px]" />
            </button>
          </div>

          <!-- Price -->
          <div class="mt-4 rounded-xl border border-gray-100 bg-[#f6f8fb] px-3 py-3">
            <div class="flex items-center justify-between">
              <span class="text-[11px] font-bold text-gray-400">Price (USDT)</span>
              <div class="flex items-center gap-3">
                <button class="text-[20px] font-semibold text-gray-400 active:scale-90" @click="adjustPrice(-1)">−</button>
                <span class="min-w-20 text-center text-[13px] font-semibold text-[#17212f] md:min-w-22.5 md:text-[15px]">{{ formatPrice(orderPrice) }}</span>
                <button class="text-[20px] font-semibold text-gray-500 active:scale-90" @click="adjustPrice(1)">+</button>
              </div>
            </div>
          </div>

          <!-- Amount -->
          <div class="mt-3 rounded-xl border border-gray-100 bg-[#f6f8fb] px-3 py-3">
            <div class="flex items-center justify-between">
              <span class="text-[11px] font-bold text-gray-400">Amount ({{ coin.symbol }})</span>
              <div class="flex items-center gap-3">
                <button class="text-[20px] font-semibold text-gray-400 active:scale-90" @click="adjustAmount(-1)">−</button>
                <span class="min-w-15 text-center text-[13px] font-semibold text-[#17212f] md:min-w-17.5 md:text-[15px]">{{ orderAmount.toFixed(4) }}</span>
                <button class="text-[20px] font-semibold text-gray-500 active:scale-90" @click="adjustAmount(1)">+</button>
              </div>
            </div>
          </div>

          <!-- Slider -->
          <div class="mt-5">
            <div class="relative flex h-5 items-center">
              <div class="h-0.75 w-full rounded-full bg-[#bff4ef]"></div>
              <div class="absolute left-0 top-1/2 h-0.75 -translate-y-1/2 rounded-full bg-[#10b8ad] transition-all duration-150" :style="{ width: sliderPct + '%' }"></div>
              <div class="absolute top-1/2 h-5 w-5 -translate-y-1/2 rounded-full border-2 border-[#10b8ad] bg-white shadow transition-all duration-150" :style="{ left: `calc(${sliderPct}% - 10px)` }"></div>
              <input type="range" min="0" max="100" step="1" :value="sliderPct" @input="onSliderInput" class="absolute inset-0 w-full cursor-pointer opacity-0" />
            </div>
            <div class="mt-3 flex justify-between gap-1">
              <button
                v-for="pct in [25, 50, 75, 100]"
                :key="pct"
                @click="setSliderPct(pct)"
                class="flex-1 rounded-full border py-1 text-[10px] font-semibold transition-colors"
                :class="sliderPct >= pct ? 'border-[#10b8ad] bg-[#eafffd] text-[#10b8ad]' : 'border-gray-200 text-gray-400'"
              >{{ pct }}%</button>
            </div>
          </div>

          <!-- Total -->
          <div class="mt-4 rounded-xl border border-gray-100 bg-[#f6f8fb] px-3 py-3">
            <div class="flex items-center justify-between">
              <span class="text-[11px] font-bold text-gray-400">Total (USDT)</span>
              <span class="text-[13px] font-semibold text-[#17212f] md:text-[15px]">{{ orderTotal }}</span>
            </div>
          </div>

          <!-- Available -->
          <div class="mt-4 flex items-center justify-between">
            <span class="text-[11px] font-bold text-gray-400">Available</span>
            <div class="flex items-center gap-2">
              <span class="text-[12px] font-semibold text-gray-500 md:text-[13px]">{{ availableDisplay }}</span>
              <button class="flex h-6 w-6 items-center justify-center rounded-full border border-[#10b8ad] text-[#10b8ad]">
                <Icon icon="mdi:plus" class="text-[16px]" />
              </button>
            </div>
          </div>

          <!-- Error message -->
          <p v-if="placeOrderError" class="mt-2 text-[11px] font-semibold text-red-400">{{ placeOrderError }}</p>

          <button
            class="mt-5 h-12 w-full rounded-xl text-[14px] font-semibold text-white active:scale-[0.99] md:text-[15px] disabled:opacity-60"
            :class="activeSide === 'Buy' ? 'bg-[#08a99f]' : 'bg-red-400'"
            :disabled="placeOrderLoading"
            @click="placeOrder"
          >
            <span v-if="placeOrderLoading">Placing...</span>
            <span v-else>{{ activeSide }} {{ coin.symbol }}</span>
          </button>
        </div>

        <!-- ORDER BOOK -->
        <div
          class="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm"
          :class="{ 'hidden md:block': activePanelTab !== 'orderbook' }"
        >
          <div class="grid h-10 grid-cols-2 border-b border-gray-100">
            <button
              @click="activeOrderBookTab = 'orderbook'"
              class="relative text-[14px] font-semibold md:text-[15px]"
              :class="activeOrderBookTab === 'orderbook' ? 'text-[#10b8ad]' : 'text-gray-400'"
            >
              Order Book
              <span v-if="activeOrderBookTab === 'orderbook'" class="absolute bottom-0 left-4 right-4 h-0.75 rounded-full bg-[#10b8ad]"></span>
            </button>
            <button
              @click="activeOrderBookTab = 'trades'"
              class="relative text-[14px] font-semibold md:text-[15px]"
              :class="activeOrderBookTab === 'trades' ? 'text-[#10b8ad]' : 'text-gray-400'"
            >
              Trades
              <span v-if="activeOrderBookTab === 'trades'" class="absolute bottom-0 left-4 right-4 h-0.75 rounded-full bg-[#10b8ad]"></span>
            </button>
          </div>

          <!-- ── ORDER BOOK sub-tab ── -->
          <template v-if="activeOrderBookTab === 'orderbook'">
            <div class="mt-4 grid grid-cols-3 gap-2 text-[10px] font-bold text-gray-400 md:text-[11px]">
              <span>Price (USDT)</span>
              <span class="text-right">Amount ({{ coin.symbol }})</span>
              <span class="text-right">Total (USDT)</span>
            </div>

            <!-- Sell Orders -->
            <div class="mt-3 space-y-0.75">
              <div v-for="order in sellOrders" :key="order.price" class="relative overflow-hidden rounded-[3px]">
                <div class="absolute right-0 top-0 h-full bg-red-50 transition-all duration-300 ease-out" :style="{ width: order.pct + '%' }"></div>
                <div class="relative grid grid-cols-3 gap-1 px-0.5 py-1.25 text-[10px] font-semibold md:text-[11px]">
                  <span class="text-red-400">{{ order.price }}</span>
                  <span class="text-right text-[#17212f]">{{ order.amount }}</span>
                  <span class="text-right text-gray-500">{{ order.total }}</span>
                </div>
              </div>
            </div>

            <!-- Current Price -->
            <div class="my-4 flex items-end gap-2">
              <span class="text-[20px] font-semibold leading-none text-[#10b8ad] md:text-[24px]">{{ formatPrice(livePrice) }}</span>
              <span class="text-[12px] font-semibold text-gray-400 md:text-[13px]">≈ ${{ formatPrice(livePrice) }}</span>
            </div>

            <!-- Buy Orders -->
            <div class="space-y-0.75">
              <div v-for="order in buyOrders" :key="order.price" class="relative overflow-hidden rounded-[3px]">
                <div class="absolute right-0 top-0 h-full bg-teal-50 transition-all duration-300 ease-out" :style="{ width: order.pct + '%' }"></div>
                <div class="relative grid grid-cols-3 gap-1 px-0.5 py-1.25 text-[10px] font-semibold md:text-[11px]">
                  <span class="text-[#10b8ad]">{{ order.price }}</span>
                  <span class="text-right text-[#17212f]">{{ order.amount }}</span>
                  <span class="text-right text-gray-500">{{ order.total }}</span>
                </div>
              </div>
            </div>

            <div class="mt-6 flex items-center justify-between">
              <button class="flex h-9 items-center gap-2 rounded-lg border border-gray-100 bg-[#f6f8fb] px-3 text-[11px] font-semibold text-gray-500 md:gap-3 md:px-4 md:text-[12px]">
                0.01 <Icon icon="mdi:chevron-down" class="text-[15px] md:text-[16px]" />
              </button>
              <button class="active:scale-95">
                <Icon icon="mdi:chart-bar" class="text-[24px] text-[#10b8ad] md:text-[26px]" />
              </button>
            </div>
          </template>

          <!-- ── TRADES sub-tab ── -->
          <template v-else>
            <div class="mt-4 grid grid-cols-3 gap-2 text-[10px] font-bold text-gray-400 md:text-[11px]">
              <span>Price (USDT)</span>
              <span class="text-right">Amount ({{ coin.symbol }})</span>
              <span class="text-right">Time</span>
            </div>
            <div class="mt-3 space-y-0.75">
              <div v-for="trade in recentTrades" :key="trade.id" class="grid grid-cols-3 gap-1 px-0.5 py-1.25 text-[10px] font-semibold md:text-[11px]">
                <span :class="trade.isBuy ? 'text-[#10b8ad]' : 'text-red-400'">{{ trade.price }}</span>
                <span class="text-right text-[#17212f]">{{ trade.amount }}</span>
                <span class="text-right text-gray-400">{{ trade.time }}</span>
              </div>
            </div>
          </template>
        </div>
      </section>

      <!-- ═══════════ MARKET STATS ═══════════ -->
      <section class="mt-4 px-3 md:px-6 lg:px-8">
        <div class="grid grid-cols-2 rounded-2xl border border-gray-100 bg-white px-4 py-4 shadow-sm md:grid-cols-4">
          <div v-for="item in stats" :key="item.label" class="py-1 text-center md:py-0">
            <p class="text-[11px] font-bold text-gray-400 md:text-[12px]">{{ item.label }}</p>
            <p class="mt-1.5 text-[13px] font-semibold text-[#17212f] md:mt-2 md:text-[14px]">{{ item.value }}</p>
          </div>
        </div>
      </section>

      <!-- ═══════════ OPEN ORDERS ═══════════ -->
      <section class="mt-4 px-3 md:px-6 lg:px-8">
        <div class="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">

          <!-- Tabs header -->
          <div class="flex items-center justify-between border-b border-gray-100 px-4">
            <div class="flex h-13 items-center gap-5 overflow-x-auto md:gap-8">
              <button
                v-for="(tab, i) in orderTabs"
                :key="tabKeys[i]"
                @click="onTabChange(tabKeys[i])"
                class="relative h-full shrink-0 text-[13px] font-semibold md:text-[14px]"
                :class="activeBottomTab === tabKeys[i] ? 'text-[#10b8ad]' : 'text-gray-500'"
              >
                {{ tab }}
                <span v-if="activeBottomTab === tabKeys[i]" class="absolute bottom-0 left-0 right-0 h-0.75 rounded-full bg-[#10b8ad]"></span>
              </button>
            </div>
            <button
              class="flex shrink-0 items-center gap-1 text-[12px] font-semibold text-gray-500 md:text-[13px]"
              @click="cancelAll"
            >
              <Icon icon="mdi:swap-horizontal" class="text-[16px] md:text-[18px]" />
              Cancel All
            </button>
          </div>

          <!-- Loading state -->
          <div v-if="isLoadingOrders" class="py-8 text-center text-[13px] font-semibold text-gray-400">
            Loading...
          </div>

          <!-- ── OPEN ORDERS TAB ── -->
          <template v-else-if="activeBottomTab === 'open-orders'">
            <!-- Empty state -->
            <div v-if="openOrdersList.length === 0" class="py-10 text-center text-[13px] font-semibold text-gray-400">
              No open orders
            </div>
            <!-- Mobile: card view -->
            <div v-else class="divide-y divide-gray-100 md:hidden">
              <div v-for="order in openOrdersList" :key="order.id" class="px-4 py-4">
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-2.5">
                    <div class="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-500">
                      <CoinIcon :icon="marketStore.coinMap.get(order.symbol.replace('USDT',''))?.icon ?? 'mdi:currency-usd'" :symbol="order.symbol.replace('USDT','')" icon-class="text-[18px]" img-class="h-6 w-6 rounded-full" />
                    </div>
                    <div>
                      <div class="flex items-center gap-1.5">
                        <p class="text-[13px] font-semibold text-[#17212f]">{{ order.symbol.replace('USDT', '/USDT') }}</p>
                        <span class="rounded-md px-1.5 py-0.5 text-[9px] font-bold" :class="order.side === 'Buy' ? 'bg-[#eafffd] text-[#10b8ad]' : 'bg-red-50 text-red-400'">{{ order.side }}</span>
                      </div>
                      <p class="mt-0.5 text-[10px] font-semibold text-gray-400">{{ order.type }}</p>
                    </div>
                  </div>
                  <button class="rounded-xl border border-red-100 bg-red-50 px-3 py-1.5 text-[11px] font-semibold text-red-400 active:scale-95" @click="cancelOrder(order.id)">Cancel</button>
                </div>
                <div class="mt-3 grid grid-cols-3 gap-2 rounded-xl bg-[#f6f8fb] px-3 py-2.5">
                  <div>
                    <p class="text-[9px] font-bold text-gray-400">Price</p>
                    <p class="mt-0.5 text-[11px] font-semibold text-[#17212f]">{{ order.price ? formatPrice(Number(order.price)) : 'Market' }}</p>
                  </div>
                  <div>
                    <p class="text-[9px] font-bold text-gray-400">Amount</p>
                    <p class="mt-0.5 text-[11px] font-semibold text-[#17212f]">{{ Number(order.amount).toFixed(4) }}</p>
                  </div>
                  <div>
                    <p class="text-[9px] font-bold text-gray-400">Filled</p>
                    <p class="mt-0.5 text-[11px] font-semibold text-[#17212f]">{{ Number(order.amount) > 0 ? ((Number(order.filled) / Number(order.amount)) * 100).toFixed(0) + '%' : '0%' }}</p>
                  </div>
                </div>
              </div>
            </div>
            <!-- Desktop: table view -->
            <div v-if="openOrdersList.length > 0" class="hidden md:block">
              <div class="grid grid-cols-[1.2fr_0.65fr_0.9fr_0.9fr_0.8fr_0.9fr_0.7fr] gap-2 border-b border-gray-100 px-4 py-3 text-[11px] font-bold text-gray-400">
                <span>Pair / Type</span><span>Side</span><span>Price</span><span>Amount</span><span>Filled</span><span>Total</span><span class="text-right">Action</span>
              </div>
              <div>
                <div
                  v-for="order in openOrdersList"
                  :key="order.id"
                  class="grid grid-cols-[1.2fr_0.65fr_0.9fr_0.9fr_0.8fr_0.9fr_0.7fr] items-center gap-2 border-b border-gray-100 px-4 py-4 last:border-b-0"
                >
                  <div class="flex items-center gap-3">
                    <div class="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-500">
                      <CoinIcon :icon="marketStore.coinMap.get(order.symbol.replace('USDT',''))?.icon ?? 'mdi:currency-usd'" :symbol="order.symbol.replace('USDT','')" icon-class="text-[18px]" img-class="h-6 w-6 rounded-full" />
                    </div>
                    <div>
                      <p class="text-[13px] font-semibold text-[#17212f]">{{ order.symbol.replace('USDT', '/USDT') }}</p>
                      <p class="mt-1 text-[11px] font-semibold text-gray-400">{{ order.type }}</p>
                    </div>
                  </div>
                  <span class="text-[13px] font-semibold" :class="order.side === 'Buy' ? 'text-[#10b8ad]' : 'text-red-400'">{{ order.side }}</span>
                  <span class="text-[13px] font-semibold text-[#17212f]">{{ order.price ? formatPrice(Number(order.price)) : 'Market' }}</span>
                  <span class="text-[13px] font-semibold text-[#17212f]">{{ Number(order.amount).toFixed(4) }}</span>
                  <div>
                    <p class="text-[13px] font-semibold text-[#17212f]">{{ Number(order.amount) > 0 ? ((Number(order.filled) / Number(order.amount)) * 100).toFixed(0) + '%' : '0%' }}</p>
                    <p class="mt-1 text-[11px] font-semibold text-gray-400">{{ Number(order.filled).toFixed(4) }}</p>
                  </div>
                  <span class="text-[13px] font-semibold text-[#17212f]">{{ order.total ? formatPrice(Number(order.total)) : '—' }}</span>
                  <button class="text-right text-[13px] font-semibold text-red-400 active:scale-95" @click="cancelOrder(order.id)">Cancel</button>
                </div>
              </div>
            </div>
          </template>

          <!-- ── POSITIONS TAB ── -->
          <template v-else-if="activeBottomTab === 'positions'">
            <div v-if="openPositionsList.length === 0" class="py-10 text-center text-[13px] font-semibold text-gray-400">
              No open positions
            </div>
            <div v-else class="divide-y divide-gray-100">
              <div v-for="pos in openPositionsList" :key="pos.id" class="px-4 py-4">
                <div class="flex items-center justify-between">
                  <div>
                    <div class="flex items-center gap-1.5">
                      <p class="text-[13px] font-semibold text-[#17212f]">{{ pos.symbol.replace('USDT', '/USDT') }}</p>
                      <span class="rounded-md px-1.5 py-0.5 text-[9px] font-bold" :class="pos.side === 'Long' ? 'bg-[#eafffd] text-[#10b8ad]' : 'bg-red-50 text-red-400'">{{ pos.side }}</span>
                      <span class="rounded-md bg-gray-100 px-1.5 py-0.5 text-[9px] font-bold text-gray-500">{{ pos.leverage }}x</span>
                    </div>
                    <p class="mt-0.5 text-[10px] font-semibold text-gray-400">Entry: {{ formatPrice(Number(pos.entry_price)) }} · Liq: {{ pos.liquidation_price ? formatPrice(Number(pos.liquidation_price)) : '—' }}</p>
                  </div>
                  <div class="text-right">
                    <p class="text-[12px] font-semibold text-[#17212f]">Size: {{ Number(pos.size).toFixed(4) }}</p>
                    <p class="text-[11px] font-semibold text-gray-400">Margin: {{ formatPrice(Number(pos.margin)) }}</p>
                  </div>
                </div>
              </div>
            </div>
          </template>

          <!-- ── HISTORY TAB ── -->
          <template v-else-if="activeBottomTab === 'history'">
            <div v-if="historyList.length === 0" class="py-10 text-center text-[13px] font-semibold text-gray-400">
              No trade history
            </div>
            <div v-else class="divide-y divide-gray-100 md:hidden">
              <div v-for="order in historyList" :key="order.id" class="px-4 py-4">
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-2.5">
                    <div class="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-500">
                      <CoinIcon :icon="marketStore.coinMap.get(order.symbol.replace('USDT',''))?.icon ?? 'mdi:currency-usd'" :symbol="order.symbol.replace('USDT','')" icon-class="text-[18px]" img-class="h-6 w-6 rounded-full" />
                    </div>
                    <div>
                      <div class="flex items-center gap-1.5">
                        <p class="text-[13px] font-semibold text-[#17212f]">{{ order.symbol.replace('USDT', '/USDT') }}</p>
                        <span class="rounded-md px-1.5 py-0.5 text-[9px] font-bold" :class="order.side === 'Buy' ? 'bg-[#eafffd] text-[#10b8ad]' : 'bg-red-50 text-red-400'">{{ order.side }}</span>
                        <span class="rounded-md px-1.5 py-0.5 text-[9px] font-bold" :class="order.status === 'filled' ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-500'">{{ order.status }}</span>
                      </div>
                      <p class="mt-0.5 text-[10px] font-semibold text-gray-400">{{ order.type }} · {{ new Date(order.created_at).toLocaleDateString() }}</p>
                    </div>
                  </div>
                  <div class="text-right">
                    <p class="text-[12px] font-semibold text-[#17212f]">{{ order.total ? formatPrice(Number(order.total)) : '—' }}</p>
                  </div>
                </div>
              </div>
            </div>
            <!-- Desktop history table -->
            <div v-if="historyList.length > 0" class="hidden md:block">
              <div class="grid grid-cols-[1.2fr_0.65fr_0.9fr_0.9fr_0.8fr_0.9fr_0.7fr] gap-2 border-b border-gray-100 px-4 py-3 text-[11px] font-bold text-gray-400">
                <span>Pair / Type</span><span>Side</span><span>Price</span><span>Amount</span><span>Filled</span><span>Total</span><span class="text-right">Status</span>
              </div>
              <div>
                <div
                  v-for="order in historyList"
                  :key="order.id"
                  class="grid grid-cols-[1.2fr_0.65fr_0.9fr_0.9fr_0.8fr_0.9fr_0.7fr] items-center gap-2 border-b border-gray-100 px-4 py-4 last:border-b-0"
                >
                  <div class="flex items-center gap-3">
                    <div class="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-500">
                      <CoinIcon :icon="marketStore.coinMap.get(order.symbol.replace('USDT',''))?.icon ?? 'mdi:currency-usd'" :symbol="order.symbol.replace('USDT','')" icon-class="text-[18px]" img-class="h-6 w-6 rounded-full" />
                    </div>
                    <div>
                      <p class="text-[13px] font-semibold text-[#17212f]">{{ order.symbol.replace('USDT', '/USDT') }}</p>
                      <p class="mt-1 text-[11px] font-semibold text-gray-400">{{ order.type }}</p>
                    </div>
                  </div>
                  <span class="text-[13px] font-semibold" :class="order.side === 'Buy' ? 'text-[#10b8ad]' : 'text-red-400'">{{ order.side }}</span>
                  <span class="text-[13px] font-semibold text-[#17212f]">{{ order.price ? formatPrice(Number(order.price)) : 'Market' }}</span>
                  <span class="text-[13px] font-semibold text-[#17212f]">{{ Number(order.amount).toFixed(4) }}</span>
                  <span class="text-[13px] font-semibold text-[#17212f]">{{ Number(order.filled).toFixed(4) }}</span>
                  <span class="text-[13px] font-semibold text-[#17212f]">{{ order.total ? formatPrice(Number(order.total)) : '—' }}</span>
                  <span class="text-right text-[11px] font-bold capitalize" :class="order.status === 'filled' ? 'text-green-600' : 'text-gray-400'">{{ order.status }}</span>
                </div>
              </div>
            </div>
          </template>

        </div>
      </section>
    </div>
  </DashboardLayout>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Icon } from '@iconify/vue'
import DashboardLayout from '@/layouts/DashboardLayout.vue'
import CoinIcon from '@/components/CoinIcon.vue'
import { useMarketWs } from '@/services/marketWs'
import { useMarketStore } from '@/stores/market'
import { useAuthStore } from '@/stores/auth'
import { makeTradeApi, type SpotOrder, type FuturesPosition } from '@/services/api'
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

// ── Coin catalog ───────────────────────────────────────────────
interface CoinData {
  symbol: string; fullName: string; icon: string; iconBg: string
  price: number; change: number; high24: number; low24: number
  volume24: number; markPrice: number; priceStep: number; amountStep: number
}

const CATALOG_FALLBACK: Record<string, CoinData> = {
  btc:  { symbol: 'BTC',  fullName: 'Bitcoin',   icon: 'mdi:bitcoin',                 iconBg: 'bg-orange-100 text-orange-500', price: 64923.45, change:  1.24, high24: 65432.10, low24: 62450.22, volume24:   18562.34, markPrice: 64015.32, priceStep: 0.5,    amountStep: 0.0001 },
  eth:  { symbol: 'ETH',  fullName: 'Ethereum',  icon: 'mdi:ethereum',                iconBg: 'bg-purple-100 text-purple-500', price:  3215.67, change:  2.35, high24:  3312.50, low24:  3145.80, volume24:  142835.20, markPrice:  3212.44, priceStep: 0.1,    amountStep: 0.001  },
  sol:  { symbol: 'SOL',  fullName: 'Solana',    icon: 'mdi:circle-multiple-outline', iconBg: 'bg-slate-100 text-slate-600',   price:   171.25, change: -0.45, high24:   175.60, low24:   168.30, volume24:  523410.80, markPrice:   171.10, priceStep: 0.01,   amountStep: 0.01   },
  bnb:  { symbol: 'BNB',  fullName: 'BNB',       icon: 'mdi:alpha-b-circle',          iconBg: 'bg-yellow-100 text-yellow-500', price:   593.31, change:  0.81, high24:   601.20, low24:   585.40, volume24:   87234.60, markPrice:   593.00, priceStep: 0.1,    amountStep: 0.001  },
  xrp:  { symbol: 'XRP',  fullName: 'XRP',       icon: 'mdi:close',                   iconBg: 'bg-gray-100 text-gray-600',     price:     0.522, change:  1.05, high24:    0.535, low24:    0.508, volume24: 4521836.00, markPrice:    0.519, priceStep: 0.0001, amountStep: 1      },
  wif:  { symbol: 'WIF',  fullName: 'dogwifhat', icon: 'mdi:dog',                     iconBg: 'bg-amber-100 text-amber-700',   price:     2.45,  change:  8.32, high24:    2.62,  low24:    2.20,  volume24: 1234567.00, markPrice:    2.44,  priceStep: 0.001,  amountStep: 0.1    },
  rndr: { symbol: 'RNDR', fullName: 'Render',    icon: 'mdi:cube-scan',               iconBg: 'bg-blue-100 text-blue-600',     price:     7.89,  change: -1.23, high24:    8.12,  low24:    7.72,  volume24:  234567.80, markPrice:    7.87,  priceStep: 0.01,   amountStep: 0.01   },
}

const marketStore = useMarketStore()
const auth = useAuthStore()
const route = useRoute()
const router = useRouter()

const baseCoin = computed<CoinData>(() => {
  const sym = ((route.params.symbol as string) ?? 'btc').toLowerCase()
  // Try market store first
  const upper = sym.toUpperCase()
  const storeCoin = marketStore.coinMap.get(upper)
  if (storeCoin) {
    return {
      symbol:     storeCoin.symbol,
      fullName:   storeCoin.name,
      icon:       storeCoin.icon,
      iconBg:     'bg-gray-100 text-gray-500', // will be overridden by coinIconClass if needed
      price:      CATALOG_FALLBACK[sym]?.price      ?? 0,
      change:     CATALOG_FALLBACK[sym]?.change     ?? 0,
      high24:     CATALOG_FALLBACK[sym]?.high24     ?? 0,
      low24:      CATALOG_FALLBACK[sym]?.low24      ?? 0,
      volume24:   CATALOG_FALLBACK[sym]?.volume24   ?? 0,
      markPrice:  CATALOG_FALLBACK[sym]?.markPrice  ?? 0,
      priceStep:  CATALOG_FALLBACK[sym]?.priceStep  ?? 0.01,
      amountStep: CATALOG_FALLBACK[sym]?.amountStep ?? 0.001,
    }
  }
  return CATALOG_FALLBACK[sym] ?? CATALOG_FALLBACK.btc
})

// Live WS prices
const { tickerMap } = useMarketWs()
const currentBinancePair = computed(() => baseCoin.value.symbol.toUpperCase() + 'USDT')

// ── Live price state ──────────────────────────────────────────
const livePrice    = ref(0)
const liveChange   = ref(0)
const liveHigh     = ref(0)
const liveLow      = ref(0)
const liveMarkPrice = ref(0)

const coin = computed(() => ({
  ...baseCoin.value,
  price:     livePrice.value     || baseCoin.value.price,
  change:    liveChange.value,
  high24:    liveHigh.value      || baseCoin.value.high24,
  low24:     liveLow.value       || baseCoin.value.low24,
  markPrice: liveMarkPrice.value || baseCoin.value.markPrice,
}))

function formatPrice(price: number): string {
  if (price >= 1000) return price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  if (price >= 1)    return price.toFixed(2)
  return price.toFixed(6)
}

const stats = computed(() => [
  { label: 'Mark Price',                    value: formatPrice(coin.value.markPrice) },
  { label: '24h High',                       value: formatPrice(coin.value.high24) },
  { label: '24h Low',                        value: formatPrice(coin.value.low24) },
  { label: `24h Vol (${coin.value.symbol})`, value: coin.value.volume24.toLocaleString('en-US', { maximumFractionDigits: 2 }) },
])

// ── Order book ────────────────────────────────────────────────
interface OrderEntry { rawPrice: number; amount: number; pct: number }
const sellEntries = ref<OrderEntry[]>([])
const buyEntries  = ref<OrderEntry[]>([])

function initOrderBook(basePrice: number) {
  const s = basePrice * 0.0001
  sellEntries.value = [
    { rawPrice: basePrice + s * 25, amount: 0.1852, pct: 37  },
    { rawPrice: basePrice + s * 15, amount: 0.1205, pct: 55  },
    { rawPrice: basePrice + s *  8, amount: 0.0800, pct: 72  },
    { rawPrice: basePrice + s *  4, amount: 0.0500, pct: 85  },
    { rawPrice: basePrice + s *  1, amount: 0.0300, pct: 100 },
  ]
  buyEntries.value = [
    { rawPrice: basePrice - s *  1, amount: 0.0288, pct: 100 },
    { rawPrice: basePrice - s *  5, amount: 0.0700, pct: 82  },
    { rawPrice: basePrice - s * 12, amount: 0.1150, pct: 66  },
    { rawPrice: basePrice - s * 20, amount: 0.2000, pct: 44  },
    { rawPrice: basePrice - s * 28, amount: 0.3200, pct: 28  },
  ]
}

const sellOrders = computed(() =>
  sellEntries.value.map(e => ({
    price:  formatPrice(e.rawPrice),
    amount: e.amount.toFixed(4),
    total:  formatPrice(e.rawPrice * e.amount),
    pct:    e.pct,
  }))
)

const buyOrders = computed(() =>
  buyEntries.value.map(e => ({
    price:  formatPrice(e.rawPrice),
    amount: e.amount.toFixed(4),
    total:  formatPrice(e.rawPrice * e.amount),
    pct:    e.pct,
  }))
)

// ── Recent Trades ─────────────────────────────────────────────
interface RecentTrade { id: number; price: string; amount: string; isBuy: boolean; time: string }
const recentTrades = ref<RecentTrade[]>([])
let tradeIdSeq = 1

function formatTradeTime(d: Date): string {
  return d.toTimeString().slice(0, 8)
}

function initRecentTrades(basePrice: number) {
  const now = Date.now()
  recentTrades.value = Array.from({ length: 20 }, (_, i) => {
    const price  = basePrice * (1 + (Math.random() - 0.5) * 0.002)
    const amount = 0.001 + Math.random() * 0.5
    const isBuy  = Math.random() > 0.5
    return {
      id:     tradeIdSeq++,
      price:  formatPrice(price),
      amount: amount.toFixed(4),
      isBuy,
      time:   formatTradeTime(new Date(now - i * 3500)),
    }
  })
}

function pushRecentTrade(basePrice: number) {
  if (Math.random() > 0.45) return // not every tick
  const price  = basePrice * (1 + (Math.random() - 0.5) * 0.0015)
  const amount = 0.001 + Math.random() * 0.4
  const isBuy  = Math.random() > 0.5
  recentTrades.value = [
    { id: tradeIdSeq++, price: formatPrice(price), amount: amount.toFixed(4), isBuy, time: formatTradeTime(new Date()) },
    ...recentTrades.value.slice(0, 19),
  ]
}

// ── UI state ───────────────────────────────────────────────────
const activeTimeframe    = ref('1H')
const activePanelTab     = ref<'trade' | 'orderbook'>('trade')
const activeOrderBookTab = ref<'orderbook' | 'trades'>('orderbook')
const activeSide         = ref<'Buy' | 'Sell'>('Buy')
const activeOrderType    = ref('Limit')

const timeframes  = ['1H', '4H', '1D', '1W', 'More']
const sides: ('Buy' | 'Sell')[] = ['Buy', 'Sell']
const orderTypes  = ['Limit', 'Market', 'Stop']

// ── Trade form ────────────────────────────────────────────────
const isFavorite       = ref(false)
const orderPrice       = ref(0)
const orderAmount      = ref(0.1)
const sliderPct        = ref(10)

// Balance — synced from auth store (USDT) and coin balances API
const coinBalanceMap   = ref<Record<string, number>>({})
const availableBalance = computed(() => Number(auth.user?.balance ?? 0))
const availableCoin    = computed(() => coinBalanceMap.value[coin.value.symbol] ?? 0)

const orderTotal = computed(() => formatPrice(orderPrice.value * orderAmount.value))
const availableDisplay = computed(() =>
  activeSide.value === 'Buy'
    ? `${availableBalance.value.toLocaleString('en-US', { minimumFractionDigits: 2 })} USDT`
    : `${availableCoin.value.toFixed(4)} ${coin.value.symbol}`
)

function adjustPrice(dir: number) {
  const step = baseCoin.value.priceStep
  orderPrice.value = Math.max(step, parseFloat((orderPrice.value + dir * step).toFixed(8)))
}

function adjustAmount(dir: number) {
  const step = baseCoin.value.amountStep
  orderAmount.value = Math.max(step, parseFloat((orderAmount.value + dir * step).toFixed(8)))
  recalcSlider()
}

function recalcSlider() {
  if (activeSide.value === 'Buy') {
    const maxAmt = availableBalance.value / Math.max(0.0001, orderPrice.value)
    sliderPct.value = Math.min(100, Math.round((orderAmount.value / maxAmt) * 100))
  } else {
    sliderPct.value = Math.min(100, Math.round((orderAmount.value / availableCoin.value) * 100))
  }
}

function onSliderInput(e: Event) {
  const pct = Number((e.target as HTMLInputElement).value)
  applySliderPct(pct)
}

function setSliderPct(pct: number) {
  applySliderPct(pct)
}

function applySliderPct(pct: number) {
  sliderPct.value = pct
  if (activeSide.value === 'Buy') {
    const maxAmt = availableBalance.value / Math.max(0.0001, orderPrice.value)
    orderAmount.value = parseFloat((maxAmt * pct / 100).toFixed(8))
  } else {
    orderAmount.value = parseFloat((availableCoin.value * pct / 100).toFixed(8))
  }
}

// ── Live tick ─────────────────────────────────────────────────
let timer: ReturnType<typeof setInterval>

function tick() {
  // Only simulate price when WS has no data for the current pair
  const hasWsData = !!tickerMap.value.get(currentBinancePair.value)
  if (!hasWsData) {
    const prev  = livePrice.value
    const delta = prev * (Math.random() - 0.499) * 0.0008
    livePrice.value     = Math.max(0.000001, prev + delta)
    liveChange.value    = Math.round((liveChange.value + (Math.random() - 0.49) * 0.04) * 100) / 100
    liveMarkPrice.value = Math.max(0.000001, liveMarkPrice.value + delta * 0.8)
    if (livePrice.value > liveHigh.value) liveHigh.value = livePrice.value
    if (livePrice.value < liveLow.value)  liveLow.value  = livePrice.value
  }

  if (activeOrderType.value === 'Market') orderPrice.value = livePrice.value
  updateLiveCandle()

  const p = livePrice.value, s = p * 0.0001
  const offS = [25, 15, 8, 4, 1]
  const offB = [1, 5, 12, 20, 28]

  sellEntries.value = sellEntries.value.map((e, i) => ({
    rawPrice: p + s * offS[i] + (Math.random() - 0.5) * s * 0.4,
    amount:   Math.max(0.001, e.amount + (Math.random() - 0.5) * 0.015),
    pct:      Math.max(5, Math.min(100, e.pct + (Math.random() - 0.5) * 14)),
  }))
  buyEntries.value = buyEntries.value.map((e, i) => ({
    rawPrice: p - s * offB[i] + (Math.random() - 0.5) * s * 0.4,
    amount:   Math.max(0.001, e.amount + (Math.random() - 0.5) * 0.015),
    pct:      Math.max(5, Math.min(100, e.pct + (Math.random() - 0.5) * 14)),
  }))
  pushRecentTrade(p)
}

onMounted(() => {
  marketStore.fetchCoins()
  const c = baseCoin.value
  livePrice.value     = c.price
  liveChange.value    = c.change
  liveHigh.value      = c.high24
  liveLow.value       = c.low24
  liveMarkPrice.value = c.markPrice
  orderPrice.value    = c.price
  const favs = JSON.parse(localStorage.getItem('market-favorites') ?? '[]') as string[]
  isFavorite.value = favs.includes(c.symbol)
  initOrderBook(c.price)
  initRecentTrades(c.price)
  initChart()
  timer = setInterval(tick, 600)
  // Fetch trade data
  fetchOpenOrders()
  fetchCoinBalances()
})

onUnmounted(() => {
  clearInterval(timer)
  destroyChart()
})

// Watch the SYMBOL STRING (primitive), not the baseCoin object.
// baseCoin returns a new object reference on every store update (e.g. when
// fetchCoins() hydrates coinMap), which would fire the watcher even though
// the trading pair hasn't changed — causing a spurious initChart() call that
// briefly shows correct data then zooms out as live price diverges from the
// hardcoded CATALOG_FALLBACK prices.
watch(
  () => baseCoin.value.symbol,
  (newSym, oldSym) => {
    if (newSym === oldSym) return // metadata-only update — skip reinit
    const c = baseCoin.value
    livePrice.value     = c.price
    liveChange.value    = c.change
    liveHigh.value      = c.high24
    liveLow.value       = c.low24
    liveMarkPrice.value = c.markPrice
    orderPrice.value    = c.price
    const favs = JSON.parse(localStorage.getItem('market-favorites') ?? '[]') as string[]
    isFavorite.value = favs.includes(c.symbol)
    initOrderBook(c.price)
    initRecentTrades(c.price)
    lastCandleTime = 0; lastCandle = null; lastVolume = null
    initChart() // recreate chart for new coin
  },
)

watch(activeTimeframe, () => {
  lastCandleTime = 0; lastCandle = null; lastVolume = null
  loadChartData() // reload data only, keep chart structure
})

// ── WS live price for current pair ───────────────────────────────
watch(tickerMap, (map) => {
  const t = map.get(currentBinancePair.value)
  if (!t) return
  livePrice.value     = t.price
  liveChange.value    = Math.round(t.change * 100) / 100
  liveHigh.value      = liveHigh.value  > 0 ? Math.max(liveHigh.value,  t.high) : t.high
  liveLow.value       = liveLow.value   > 0 ? Math.min(liveLow.value,   t.low)  : t.low
  liveMarkPrice.value = t.price
  if (activeOrderType.value === 'Market') orderPrice.value = t.price
  updateLiveCandle()
})

// ── Sync orderPrice with live price ─────────────────────────────────────────
let _orderPriceSynced = false
watch(currentBinancePair, () => { _orderPriceSynced = false })
watch(livePrice, (price) => {
  if (price > 0 && !_orderPriceSynced) {
    _orderPriceSynced = true
    orderPrice.value  = price
  }
})
watch(activeOrderType, (type) => {
  if (type === 'Market') orderPrice.value = livePrice.value
})

function toggleFavorite() {
  const favs = new Set(JSON.parse(localStorage.getItem('market-favorites') ?? '[]') as string[])
  if (isFavorite.value) favs.delete(coin.value.symbol)
  else favs.add(coin.value.symbol)
  isFavorite.value = !isFavorite.value
  localStorage.setItem('market-favorites', JSON.stringify([...favs]))
}

// ── Lightweight Charts ────────────────────────────────────────
const chartContainerEl = ref<HTMLElement | null>(null)
let lwChart: IChartApi | null = null
let candleSeries: ISeriesApi<'Candlestick'> | null = null
let volumeSeries: ISeriesApi<'Histogram'> | null = null

// timeframe → seconds-per-bar (for live candle updates)
const tfConfig: Record<string, { interval: number }> = {
  '1H':  { interval: 60 },
  '4H':  { interval: 240 },
  '1D':  { interval: 1440 },
  '1W':  { interval: 10080 },
  'More': { interval: 240 },
}

// Binance kline interval codes
const tfToBinance: Record<string, string> = {
  '1H': '1h', '4H': '4h', '1D': '1d', '1W': '1w', 'More': '4h',
}

const chartLoading = ref(false)

async function fetchBinanceKlines(
  symbol: string, tf: string,
): Promise<{ candles: CandlestickData[]; volumes: HistogramData[] }> {
  const interval = tfToBinance[tf] ?? '1h'
  const limit    = tf === '1W' ? 52 : 100
  try {
    // Use our backend proxy to avoid Binance CORS / geo-block on the browser
    const res = await fetch(
      `https://api.one-led.io/v1/public/klines?symbol=${symbol}USDT&interval=${interval}&limit=${limit}`,
    )
    if (!res.ok) throw new Error('Proxy error')
    const raw: [number, string, string, string, string, string][] = await res.json()
    const candles: CandlestickData[] = []
    const volumes: HistogramData[]   = []
    for (const k of raw) {
      const t = Math.floor(k[0] / 1000) as any
      const o = parseFloat(k[1]), h = parseFloat(k[2])
      const l = parseFloat(k[3]), c = parseFloat(k[4])
      const v = parseFloat(k[5])
      candles.push({ time: t, open: o, high: h, low: l, close: c })
      volumes.push({ time: t, value: v, color: c >= o ? '#10b8ad66' : '#ef535066' })
    }
    return { candles, volumes }
  } catch {
    return _fallbackOHLC()
  }
}

function _fallbackOHLC(): { candles: CandlestickData[]; volumes: HistogramData[] } {
  const interval = (tfConfig[activeTimeframe.value] ?? tfConfig['1H']).interval
  const intervalSec = interval * 60
  const nowSec = Math.floor(Date.now() / 1000)
  const currentBarTime = nowSec - (nowSec % intervalSec)
  const candles: CandlestickData[] = []
  const volumes: HistogramData[] = []
  // Use live price so fallback candles stay near the current market price.
  // Using the hardcoded CATALOG_FALLBACK price would cause a big gap when
  // updateLiveCandle() later sets the close to the real WS price.
  const basePrice = livePrice.value || baseCoin.value.price
  let price = basePrice * (0.94 + Math.random() * 0.05)
  for (let i = 99; i >= 0; i--) {
    const t = currentBarTime - i * intervalSec
    const o = price
    const c = Math.max(price * 0.001, price + price * (Math.random() - 0.495) * 0.018)
    const h = Math.max(o, c) * (1 + Math.random() * 0.005)
    const l = Math.min(o, c) * (1 - Math.random() * 0.005)
    candles.push({ time: t as any, open: o, high: h, low: l, close: c })
    // Use small normalised volume (1–10 units) to avoid polluting the price scale
    volumes.push({ time: t as any, value: 1 + Math.random() * 9, color: c >= o ? '#10b8ad66' : '#ef535066' })
    price = c
  }
  return { candles, volumes }
}

function initChart() {
  if (!chartContainerEl.value) return
  destroyChart()

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
    timeScale: {
      borderVisible: false,
      timeVisible: true,
      secondsVisible: false,
      fixRightEdge: true,   // prevent scrolling into future empty space
      rightOffset: 3,       // small padding on right so live candle isn't clipped
    },
    handleScroll: true,
    handleScale: true,
  })

  candleSeries = lwChart.addSeries(CandlestickSeries as any, {
    upColor:      '#10b8ad',
    downColor:    '#ef5350',
    wickUpColor:  '#10b8ad',
    wickDownColor: '#ef5350',
    borderVisible: false,
  } as Partial<CandlestickSeriesOptions>)

  candleSeries.priceScale().applyOptions({
    scaleMargins: { top: 0.08, bottom: 0.25 },
  })

  volumeSeries = lwChart.addSeries(HistogramSeries as any, {
    priceFormat: { type: 'volume' },
    priceScaleId: '', // empty string = overlay mode (official docs recommendation)
  } as Partial<HistogramSeriesOptions>)

  volumeSeries.priceScale().applyOptions({
    scaleMargins: { top: 0.75, bottom: 0 },
  })

  // Data is loaded asynchronously after chart is created
  loadChartData()

  // Resize observer
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

async function loadChartData() {
  if (!candleSeries || !volumeSeries) return
  chartLoading.value = true
  try {
    const sym = coin.value.symbol.toUpperCase()
    const { candles, volumes } = await fetchBinanceKlines(sym, activeTimeframe.value)
    if (!candleSeries || !volumeSeries) return // chart destroyed while fetching
    // Only keep the most recent 40 bars so the price scale fits the visible data correctly.
    // lightweight-charts auto-scales Y to all setData() entries, not just visible range.
    const recent        = candles.slice(-40)
    const recentVolumes = volumes.slice(-40)
    candleSeries.setData(recent)
    volumeSeries.setData(recentVolumes)
    // Seed the live-candle tracker with the last real candle
    if (recent.length > 0) {
      const last = recent[recent.length - 1]
      lastCandleTime = last.time as number
      lastCandle     = { ...last }
      lastVolume     = { ...recentVolumes[recentVolumes.length - 1] }
    }
    // fitContent now only covers 40 bars — both X and Y scale correctly
    lwChart?.timeScale().fitContent()
  } finally {
    chartLoading.value = false
  }
}

function destroyChart() {
  if (chartContainerEl.value && (chartContainerEl.value as any).__lwRo) {
    ;(chartContainerEl.value as any).__lwRo.disconnect()
  }
  if (lwChart) { lwChart.remove(); lwChart = null }
  candleSeries = null
  volumeSeries = null
}

// Live-update last candle from the tick
let lastCandleTime = 0
let lastCandle: CandlestickData | null = null
let lastVolume: HistogramData | null = null

function updateLiveCandle() {
  // Guard: livePrice must be a valid positive number.
  // A zero price creates a candle at y=0 which forces the Y-axis to span
  // the full 0–76000 range, making all real candles look compressed.
  if (!candleSeries || !volumeSeries) return
  if (!livePrice.value || livePrice.value <= 0) return
  const interval = (tfConfig[activeTimeframe.value] ?? tfConfig['1H']).interval
  const nowSec = Math.floor(Date.now() / 1000)
  const barTime = nowSec - (nowSec % (interval * 60))

  if (barTime !== lastCandleTime) {
    // new bar — open a fresh candle; leave volume as-is (no reliable per-bar volume from WS)
    lastCandleTime = barTime
    lastCandle = {
      time:  barTime as any,
      open:  livePrice.value,
      high:  livePrice.value,
      low:   livePrice.value,
      close: livePrice.value,
    }
    lastVolume = null // don't push a fake new volume bar
  } else if (lastCandle) {
    lastCandle = {
      ...lastCandle,
      high:  Math.max(lastCandle.high,  livePrice.value),
      low:   Math.min(lastCandle.low,   livePrice.value),
      close: livePrice.value,
    }
    // Don't update volume — we don't have accurate per-bar volume from the WS ticker
  }
  if (lastCandle) try { candleSeries.update(lastCandle) } catch { /* ignore out-of-order */ }
  // volumeSeries.update intentionally omitted — keeps volume bars from klines accurate
}

const orderTabs = computed(() => [
  `Open Orders (${openOrdersList.value.length})`,
  `Positions (${openPositionsList.value.length})`,
  'History',
])

// ── Trade API ─────────────────────────────────────────────────
const tradeApi = computed(() => auth.accessToken ? makeTradeApi(auth.accessToken) : null)

// ── Order lists ───────────────────────────────────────────────
const openOrdersList    = ref<SpotOrder[]>([])
const historyList       = ref<SpotOrder[]>([])
const openPositionsList = ref<FuturesPosition[]>([])
const isLoadingOrders   = ref(false)
const placeOrderError   = ref('')
const placeOrderLoading = ref(false)

async function fetchCoinBalances() {
  if (!tradeApi.value) return
  try {
    const { balances } = await tradeApi.value.getBalances()
    const map: Record<string, number> = {}
    for (const b of balances) map[b.coin.toUpperCase()] = Number(b.amount)
    coinBalanceMap.value = map
  } catch { /* ignore */ }
}

async function fetchOpenOrders() {
  if (!tradeApi.value) return
  isLoadingOrders.value = true
  try {
    const { orders } = await tradeApi.value.getOrders('open')
    openOrdersList.value = orders
  } catch { /* ignore */ } finally {
    isLoadingOrders.value = false
  }
}

async function fetchHistory() {
  if (!tradeApi.value) return
  isLoadingOrders.value = true
  try {
    const { orders } = await tradeApi.value.getOrders('history')
    historyList.value = orders
  } catch { /* ignore */ } finally {
    isLoadingOrders.value = false
  }
}

async function fetchPositions() {
  if (!tradeApi.value) return
  isLoadingOrders.value = true
  try {
    const { positions } = await tradeApi.value.getPositions()
    openPositionsList.value = positions
  } catch { /* ignore */ } finally {
    isLoadingOrders.value = false
  }
}

async function cancelOrder(id: string) {
  if (!tradeApi.value) return
  try {
    await tradeApi.value.cancelOrder(id)
    await fetchOpenOrders()
    await fetchCoinBalances()
  } catch { /* ignore */ }
}

async function cancelAll() {
  if (!tradeApi.value) return
  try {
    await tradeApi.value.cancelAll()
    await fetchOpenOrders()
    await fetchCoinBalances()
  } catch { /* ignore */ }
}

async function placeOrder() {
  if (!tradeApi.value) return
  placeOrderError.value = ''
  placeOrderLoading.value = true
  try {
    const body: Parameters<ReturnType<typeof makeTradeApi>['placeOrder']>[0] = {
      symbol: coin.value.symbol + 'USDT',
      side:   activeSide.value,
      type:   activeOrderType.value === 'Stop' ? 'Stop-Limit' : activeOrderType.value as 'Market' | 'Limit',
      amount: orderAmount.value,
    }
    if (activeOrderType.value !== 'Market') body.price = orderPrice.value
    await tradeApi.value.placeOrder(body)
    await fetchOpenOrders()
    await fetchCoinBalances()
    // Refresh user balance from auth store
    if (auth.accessToken) {
      const { makeUserApi } = await import('@/services/api')
      try {
        const userProfile = await makeUserApi(auth.accessToken).getProfile()
        if (auth.user) auth.user.balance = userProfile.balance
      } catch { /* ignore */ }
    }
  } catch (err: any) {
    placeOrderError.value = err?.message ?? 'Failed to place order.'
  } finally {
    placeOrderLoading.value = false
  }
}

const activeBottomTab  = ref<'open-orders' | 'positions' | 'history'>('open-orders')
const tabKeys: Array<'open-orders' | 'positions' | 'history'> = ['open-orders', 'positions', 'history']

function onTabChange(key: 'open-orders' | 'positions' | 'history') {
  activeBottomTab.value = key
  if (key === 'open-orders') fetchOpenOrders()
  else if (key === 'positions') fetchPositions()
  else if (key === 'history') fetchHistory()
}

// ── Coin picker state ──────────────────────────────────────────
const showCoinPicker   = ref(false)
const coinPickerSearch = ref('')

const filteredPickerCoins = computed(() => {
  const q = coinPickerSearch.value.trim().toLowerCase()
  const coins = marketStore.coins
  const results = q
    ? coins.filter(c => c.symbol.toLowerCase().includes(q) || c.name.toLowerCase().includes(q))
    : coins
  return results.slice(0, 20)
})

function selectCoin(symbol: string) {
  showCoinPicker.value = false
  coinPickerSearch.value = ''
  router.push('/trade/' + symbol.toLowerCase())
}
</script>
