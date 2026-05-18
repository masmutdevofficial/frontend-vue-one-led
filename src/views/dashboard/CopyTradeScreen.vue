<template>
  <DashboardLayout>
    <div class="bg-[#f6f8fb] pb-24.5" @click="showSort && (showSort = false)">

      <!-- SEARCH -->
      <header class="sticky top-15.5 z-40 bg-[#f6f8fb]/95 px-4 py-3 backdrop-blur-md">
        <!-- Back + title row -->
        <div class="mb-3 flex items-center justify-between">
          <div class="flex items-center gap-3">
            <button
              @click="router.back()"
              class="flex h-9 w-9 items-center justify-center rounded-xl bg-white shadow-sm active:scale-95"
            >
              <Icon icon="mdi:chevron-left" class="text-[25px] text-[#1f2937]" />
            </button>
            <h1 class="text-[16px] font-semibold text-[#17212f]">Copy Trade</h1>
          </div>
          <button
            @click.stop="showTerms = true; termsScrolledToBottom = false"
            class="flex h-9 w-9 items-center justify-center rounded-xl bg-white shadow-sm active:scale-95"
          >
            <Icon icon="mdi:file-document-outline" class="text-[21px] text-[#344054]" />
          </button>
        </div>

        <div class="flex items-center gap-3">
          <div class="flex h-10.5 flex-1 items-center gap-2 rounded-xl border border-gray-100 bg-white px-3 shadow-sm">
            <Icon icon="mdi:magnify" class="text-[21px] text-gray-400" />
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search traders or strategies"
              class="w-full bg-transparent text-[12px] font-semibold text-[#17212f] outline-none placeholder:text-gray-400"
            />
            <button v-if="searchQuery" @click.stop="searchQuery = ''" class="text-gray-300 active:scale-90">
              <Icon icon="mdi:close-circle" class="text-[16px]" />
            </button>
          </div>

          <button
            @click="router.push('/copy-trade-history')"
            class="flex h-10.5 w-10.5 shrink-0 items-center justify-center rounded-xl border border-gray-100 bg-white shadow-sm active:scale-95"
          >
            <Icon icon="mdi:history" class="text-[21px] text-[#344054]" />
          </button>

          <button
            @click.stop="showFilter = true"
            class="relative flex h-10.5 items-center gap-2 rounded-xl border border-gray-100 bg-white px-4 shadow-sm active:scale-95"
          >
            <Icon icon="mdi:tune-variant" class="text-[18px] text-[#344054]" />
            <span class="text-[11px] font-semibold text-[#344054]">Filter</span>
            <span
              v-if="activeFilterCount > 0"
              class="flex h-4 w-4 items-center justify-center rounded-full bg-[#10b8ad] text-[8px] font-bold text-white"
            >{{ activeFilterCount }}</span>
            <span v-else class="h-1.5 w-1.5 rounded-full bg-[#10b8ad]"></span>
          </button>
        </div>
      </header>

      <!-- STATS CARD -->
      <section class="px-4">
        <div class="relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
          <div class="absolute right-0 top-0 h-full w-[36%] bg-linear-to-l from-cyan-100/80 via-cyan-50/60 to-transparent"></div>

          <div class="relative z-10 grid grid-cols-2 gap-x-3 gap-y-3.5 pr-18.5 md:grid-cols-4 md:gap-3">
            <div v-for="item in liveStats" :key="item.label" class="min-w-0">
              <div class="flex items-center gap-1">
                <p class="truncate text-[7px] font-bold text-gray-400 md:text-[8px]">{{ item.label }}</p>
                <Icon v-if="item.label === 'Total Copied Value'" icon="mdi:information-outline" class="shrink-0 text-[9px] text-gray-300" />
              </div>
              <p
                class="mt-1.5 truncate text-[12px] font-semibold leading-none transition-all duration-300 md:mt-2 md:text-[14px]"
                :class="item.value.includes('+') ? 'text-[#10b8ad]' : 'text-[#17212f]'"
              >{{ item.value }}</p>
              <p v-if="item.change" class="mt-1.5 truncate text-[7px] font-semibold text-[#10b8ad] md:mt-2 md:text-[8px]">{{ item.change }}</p>
            </div>
          </div>

          <!-- Chart image -->
          <div class="absolute right-5 top-1/2 -translate-y-1/2">
            <img
              src="/images/copy-trade-banner.webp"
              alt="Chart"
              class="h-20.5 w-20.5 rounded-2xl object-cover opacity-90 shadow-sm"
            />
          </div>
        </div>
      </section>

      <!-- TOP TRADERS PREVIEW -->
      <section class="mt-4 px-4">
        <div class="flex items-center justify-between">
          <h2 class="text-[14px] font-semibold text-[#17212f] md:text-[15px] lg:text-[16px]">Top Traders</h2>
          <button @click="showAllTopTraders = !showAllTopTraders" class="flex items-center gap-1 text-[10px] font-semibold text-[#10b8ad] md:text-[11px]">
            {{ showAllTopTraders ? 'Show Less' : 'View All' }}
            <Icon :icon="showAllTopTraders ? 'mdi:chevron-up' : 'mdi:arrow-right'" class="text-[13px]" />
          </button>
        </div>

        <!-- Mobile: horizontal scroll | Tablet: 3-col grid | Desktop: 5-col grid -->
        <div class="mt-3 flex gap-3 overflow-x-auto pb-1 md:grid md:grid-cols-3 md:overflow-visible md:pb-0 lg:grid-cols-4 xl:grid-cols-5">
          <button
            v-for="item in displayTopTraders"
            :key="item.name"
            @click="scrollToTrader(item.name)"
            class="flex min-w-29 shrink-0 items-center gap-2 rounded-xl bg-white px-2.5 py-2 shadow-sm active:scale-[0.98] md:min-w-0 md:shrink md:rounded-2xl md:px-3 md:py-3 lg:gap-3 lg:px-4 lg:py-3.5"
          >
            <img :src="item.avatar" :alt="item.name" class="h-10 w-10 rounded-full object-cover md:h-11 md:w-11 lg:h-12 lg:w-12" />
            <div class="min-w-0 text-left">
              <div class="flex items-center gap-1">
                <p class="truncate text-[10px] font-semibold text-[#17212f] md:text-[11px] lg:text-[12px]">{{ item.name }}</p>
                <span class="h-1.5 w-1.5 rounded-full bg-[#10b8ad]"></span>
              </div>
              <p class="mt-1 text-[9px] font-semibold text-[#10b8ad] md:text-[10px]">{{ item.roi }}</p>
              <p class="mt-0.5 truncate text-[8px] font-bold text-gray-400 md:text-[9px]">{{ item.copiers }}</p>
            </div>
          </button>

          <button class="flex min-w-23.5 shrink-0 items-center justify-center gap-1 rounded-xl bg-white px-2.5 py-2 shadow-sm md:min-w-0 md:shrink md:rounded-2xl md:px-3 md:py-3">
            <div class="flex -space-x-2">
              <img src="https://i.pravatar.cc/100?img=15" class="h-7 w-7 rounded-full border-2 border-white object-cover md:h-8 md:w-8" />
              <img src="https://i.pravatar.cc/100?img=20" class="h-7 w-7 rounded-full border-2 border-white object-cover md:h-8 md:w-8" />
              <img src="https://i.pravatar.cc/100?img=25" class="h-7 w-7 rounded-full border-2 border-white object-cover md:h-8 md:w-8" />
            </div>
            <div class="text-left">
              <p class="text-[9px] font-semibold text-[#17212f] md:text-[10px]">200+</p>
              <p class="text-[8px] font-bold text-gray-400">Elite traders</p>
              <p class="text-[8px] font-bold text-gray-400">to copy</p>
            </div>
            <Icon icon="mdi:chevron-right" class="text-[16px] text-gray-300" />
          </button>
        </div>
      </section>

      <!-- TRADER LIST -->
      <section class="mt-4 px-4">
        <div class="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
          <div class="flex h-12 items-center justify-between border-b border-gray-100 px-4">
          <div class="flex h-full items-center gap-7">
            <button
              v-for="tab in tabs"
              :key="tab"
              @click="activeTab = tab"
              class="relative h-full text-[12px] font-semibold"
              :class="activeTab === tab ? 'text-[#10b8ad]' : 'text-gray-400'"
            >
              {{ tab }}
              <span
                v-if="activeTab === tab"
                class="absolute bottom-0 left-0 right-0 h-0.75 rounded-full bg-[#10b8ad]"
              ></span>
            </button>
          </div>

          <div class="relative">
            <button @click.stop="showSort = !showSort" class="flex items-center gap-1 text-[11px] font-semibold text-[#344054]">
              {{ sortValue }}
              <Icon :icon="showSort ? 'mdi:chevron-up' : 'mdi:chevron-down'" class="text-[16px]" />
            </button>
            <!-- Sort dropdown -->
            <Transition
              enter-from-class="opacity-0 scale-95 -translate-y-1"
              enter-active-class="transition-all duration-150 origin-top-right"
              leave-to-class="opacity-0 scale-95 -translate-y-1"
              leave-active-class="transition-all duration-150 origin-top-right"
            >
              <div v-if="showSort" class="absolute right-0 top-8 z-50 min-w-32.5 rounded-xl border border-gray-100 bg-white shadow-xl">
                <button
                  v-for="opt in sortOptions"
                  :key="opt"
                  @click.stop="sortValue = opt; showSort = false"
                  class="flex w-full items-center gap-2 px-4 py-2.5 text-left text-[11px] font-semibold hover:bg-gray-50"
                  :class="sortValue === opt ? 'text-[#10b8ad]' : 'text-[#344054]'"
                >
                  <Icon v-if="sortValue === opt" icon="mdi:check" class="shrink-0 text-[14px] text-[#10b8ad]" />
                  <span :class="sortValue !== opt ? 'ml-5' : ''">{{ opt }}</span>
                </button>
              </div>
            </Transition>
          </div>
        </div>
        <!-- Following empty state -->
        <div v-if="activeTab === 'Following' && filteredTraders.length === 0" class="flex flex-col items-center py-12 text-center">
          <div class="flex h-20 w-20 items-center justify-center rounded-full bg-[#e9fffc]">
            <Icon icon="mdi:account-star-outline" class="text-[44px] text-[#10b8ad]" />
          </div>
          <h3 class="mt-4 text-[14px] font-semibold text-[#17212f]">No Traders Copied Yet</h3>
          <p class="mt-2 px-8 text-[11px] font-semibold text-gray-400">Join a trader below to start copying their strategies automatically.</p>
          <button @click="activeTab = 'Top Traders'" class="mt-6 h-10 rounded-xl bg-[#08a99f] px-8 text-[12px] font-semibold text-white active:scale-95">
            Explore Traders
          </button>
        </div>

        <!-- No search/filter results -->
        <div v-else-if="filteredTraders.length === 0" class="flex flex-col items-center py-12 text-center">
          <Icon icon="mdi:magnify-remove-outline" class="text-[48px] text-gray-300" />
          <p class="mt-4 text-[12px] font-semibold text-gray-400">No traders match your criteria</p>
          <button
            @click="searchQuery = ''; filterRisk = []; filterMinRoi = 0; filterMinWinRate = 0"
            class="mt-4 text-[11px] font-semibold text-[#10b8ad]"
          >Clear all filters</button>
        </div>

        <article
          v-for="trader in filteredTraders"
          :key="trader.rank"
          :ref="(el) => { if (el) traderRefs[trader.name] = el as HTMLElement }"
          class="border-b border-gray-100 px-4 py-3 last:border-b-0 transition-colors duration-500"
          :class="highlightedTrader === trader.name ? 'bg-[#e9fffc]' : ''"
        >
          <div class="grid grid-cols-[28px_1.25fr_1fr_70px] items-start gap-2">
            <!-- Rank -->
            <div class="pt-0.5 text-[12px] font-semibold text-gray-400">{{ trader.rank }}</div>

            <!-- Profile -->
            <div class="flex min-w-0 items-center gap-2">
              <img :src="trader.avatar" :alt="trader.name" class="h-10 w-10 rounded-full object-cover" />
              <div class="min-w-0">
                <div class="flex items-center gap-1">
                  <p class="truncate text-[11px] font-semibold text-[#17212f]">{{ trader.name }}</p>
                  <span class="h-1.5 w-1.5 rounded-full bg-[#10b8ad]"></span>
                </div>
                <span class="mt-1 inline-block rounded-full bg-[#e9fffc] px-2 py-0.5 text-[7px] font-semibold text-[#10b8ad]">
                  {{ trader.tag }}
                </span>
              </div>
            </div>

            <!-- ROI + Win Rate (side by side) + Sparkline -->
            <div class="min-w-0">
              <div class="flex flex-col gap-1.5 md:flex-row md:items-start md:gap-3">
                <!-- 30D ROI + sparkline beside it -->
                <div class="min-w-0">
                  <p class="text-[8px] font-bold text-gray-400">30D ROI</p>
                  <div class="mt-0.5 flex items-center gap-1.5">
                    <p class="text-[12px] font-semibold leading-none" :class="trader.roi >= 0 ? 'text-[#10b8ad]' : 'text-red-400'">
                      {{ trader.roi >= 0 ? '+' : '' }}{{ trader.roi.toFixed(1) }}%
                    </p>
                    <svg width="40" height="18" class="overflow-visible">
                      <defs>
                        <linearGradient :id="`spark-${trader.rank}`" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" :stop-color="trader.roi >= 0 ? '#10b8ad' : '#f87171'" stop-opacity="0.35" />
                          <stop offset="100%" :stop-color="trader.roi >= 0 ? '#10b8ad' : '#f87171'" stop-opacity="0" />
                        </linearGradient>
                      </defs>
                      <path :d="buildFilledPath(trader.chartPts, 40, 16)" :fill="`url(#spark-${trader.rank})`" />
                      <path
                        :d="buildLinePath(trader.chartPts, 40, 16)"
                        fill="none"
                        :stroke="trader.roi >= 0 ? '#10b8ad' : '#f87171'"
                        stroke-width="1.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                  </div>
                </div>
                <!-- Win Rate -->
                <div class="min-w-0">
                  <p class="text-[8px] font-bold text-gray-400">Win Rate</p>
                  <p class="mt-0.5 text-[11px] font-semibold leading-none text-[#17212f]">{{ trader.winRate }}%</p>
                </div>
              </div>

            </div>

            <!-- Action -->
            <div class="flex flex-col items-end gap-2">
              <span class="rounded-full px-2 py-1 text-[8px] font-semibold" :class="trader.riskClass">
                {{ trader.risk }}
              </span>
              <button
                @click.stop="followedTraders.includes(trader.name)
                  ? router.push(`/copy-trader/${trader.username}`)
                  : openJoinModal(trader.username)"
                class="h-8 w-15 rounded-lg border text-[11px] font-semibold transition-colors duration-200 active:scale-95"
                :class="followedTraders.includes(trader.name)
                  ? 'border-[#10b8ad] bg-[#10b8ad] text-white'
                  : 'border-[#10b8ad] bg-[#f7fffe] text-[#10b8ad]'"
              >
                {{ followedTraders.includes(trader.name) ? 'Copying' : 'Join' }}
              </button>
            </div>
          </div>
                        <!-- AUM / Copiers / Min. Copy -->
              <div class="mt-1.5 flex items-start justify-between gap-1">
                <div class="flex min-w-0 flex-1 items-start gap-0.5">
                  <Icon icon="mdi:bank-outline" class="mt-px shrink-0 text-[9px] text-gray-400" />
                  <div class="min-w-0">
                    <p class="text-[7px] font-bold text-gray-400">AUM</p>
                    <p class="truncate text-[9px] font-semibold text-[#17212f]">{{ trader.aum }}</p>
                  </div>
                </div>
                <div class="flex min-w-0 flex-1 items-start gap-0.5">
                  <Icon icon="mdi:account-group-outline" class="mt-px shrink-0 text-[9px] text-gray-400" />
                  <div class="min-w-0">
                    <p class="text-[7px] font-bold text-gray-400">Copiers</p>
                    <p class="truncate text-[9px] font-semibold text-[#17212f]">{{ trader.copiers.toLocaleString() }}</p>
                  </div>
                </div>
                <div class="flex min-w-0 flex-1 items-start gap-0.5">
                  <Icon icon="mdi:wallet-outline" class="mt-px shrink-0 text-[9px] text-gray-400" />
                  <div class="min-w-0">
                    <p class="text-[7px] font-bold text-gray-400">Min. Copy</p>
                    <p class="truncate text-[9px] font-semibold text-[#17212f]">${{ trader.minCopy }}</p>
                  </div>
                </div>
              </div>
        </article>
        </div>

      </section>

      <!-- AI COPY ASSIST panel -->
      <section class="mt-4 px-4">
        <div class="w-full rounded-2xl border-t border-gray-100 bg-white px-4 py-3 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] mt-3">
            <div class="flex items-center gap-3">
                <div class="relative flex h-14 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-[#e9fffc]">
                <img
                    src="/images/copy-trade-copy-assist.webp"
                    alt="AI"
                    class="absolute inset-0 h-full w-full object-cover"
                />
                </div>

                <div class="min-w-0 flex-1">
                <div class="flex items-center gap-2">
                    <h3 class="text-[14px] font-semibold text-[#17212f]">AI Copy Assist</h3>
                    <span class="rounded-full bg-[#e9fffc] px-2 py-0.5 text-[8px] font-semibold text-[#10b8ad]">Beta</span>
                </div>
                <p class="mt-1 line-clamp-2 text-[10px] font-semibold leading-snug text-gray-400">
                    Let AI match you with the best traders based on your goals and risk profile.
                </p>
                </div>

                <button @click="showAI = true" class="flex h-10 shrink-0 items-center gap-2 rounded-xl bg-[#08a99f] px-5 text-[12px] font-semibold text-white active:scale-95">
                Try Now
                <Icon icon="mdi:arrow-right" class="text-[15px]" />
                </button>
            </div>
        </div>
      </section>

    </div>

    <!-- BACKDROP -->
    <Transition
      enter-from-class="opacity-0"
      enter-active-class="transition-opacity duration-300"
      leave-to-class="opacity-0"
      leave-active-class="transition-opacity duration-300"
    >
      <div
        v-if="showFilter || showAI || showTerms || showJoinPassword"
        @click="showFilter = false; showAI = false; showTerms = false; showJoinPassword = false"
        class="fixed inset-0 z-40 bg-black/40"
      ></div>
    </Transition>

    <!-- ────────── FILTER DRAWER ────────── -->
    <Transition
      enter-from-class="translate-y-full"
      enter-active-class="transition-transform duration-300"
      leave-to-class="translate-y-full"
      leave-active-class="transition-transform duration-300"
    >
      <div v-if="showFilter" class="fixed inset-x-0 bottom-[75px] left-1/2 z-50 w-full max-w-107.5 -translate-x-1/2 rounded-t-2xl bg-white shadow-2xl">
        <div class="flex justify-center pt-3"><div class="h-1 w-10 rounded-full bg-gray-200"></div></div>
        <div class="px-4 pb-8 pt-3">
          <div class="flex items-center justify-between">
            <h3 class="text-[15px] font-semibold text-[#17212f]">Filter Traders</h3>
            <button @click="showFilter = false"><Icon icon="mdi:close" class="text-[22px] text-gray-400" /></button>
          </div>

          <div class="mt-5">
            <p class="text-[11px] font-semibold text-gray-500">Risk Level</p>
            <div class="mt-2 flex flex-wrap gap-2">
              <button
                v-for="r in ['Low Risk', 'Medium Risk', 'High Risk']"
                :key="r"
                @click="toggleFilterRisk(r)"
                class="rounded-full px-3 py-1.5 text-[10px] font-semibold transition-colors"
                :class="filterRisk.includes(r) ? 'bg-[#10b8ad] text-white' : 'bg-gray-100 text-gray-500'"
              >{{ r }}</button>
            </div>
          </div>

          <div class="mt-5">
            <div class="flex justify-between">
              <p class="text-[11px] font-semibold text-gray-500">Min 30D ROI</p>
              <p class="text-[11px] font-semibold text-[#10b8ad]">{{ filterMinRoi > 0 ? '+' + filterMinRoi + '%' : 'Any' }}</p>
            </div>
            <input type="range" min="0" max="50" step="5" v-model="filterMinRoi" class="mt-2 w-full accent-[#10b8ad]" />
            <div class="flex justify-between text-[8px] font-bold text-gray-300">
              <span>Any</span><span>+25%</span><span>+50%</span>
            </div>
          </div>

          <div class="mt-5">
            <div class="flex justify-between">
              <p class="text-[11px] font-semibold text-gray-500">Min Win Rate</p>
              <p class="text-[11px] font-semibold text-[#10b8ad]">{{ filterMinWinRate > 0 ? filterMinWinRate + '%' : 'Any' }}</p>
            </div>
            <input type="range" min="0" max="90" step="5" v-model="filterMinWinRate" class="mt-2 w-full accent-[#10b8ad]" />
            <div class="flex justify-between text-[8px] font-bold text-gray-300">
              <span>Any</span><span>45%</span><span>90%</span>
            </div>
          </div>

          <div class="mt-6 flex gap-3">
            <button
              @click="filterRisk = []; filterMinRoi = 0; filterMinWinRate = 0"
              class="h-11 flex-1 rounded-xl border border-gray-200 text-[12px] font-semibold text-gray-500 active:scale-95"
            >Reset</button>
            <button
              @click="showFilter = false"
              class="h-11 flex-1 rounded-xl bg-[#08a99f] text-[12px] font-semibold text-white active:scale-95"
            >Apply ({{ filteredTraders.length }} traders)</button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- ────────── AI COPY ASSIST MODAL ────────── -->
    <Transition
      enter-from-class="translate-y-full"
      enter-active-class="transition-transform duration-300"
      leave-to-class="translate-y-full"
      leave-active-class="transition-transform duration-300"
    >
      <div v-if="showAI" class="fixed inset-x-0 bottom-[75px] left-1/2 z-50 w-full max-w-107.5 -translate-x-1/2 rounded-t-2xl bg-white shadow-2xl">
        <div class="flex justify-center pt-3"><div class="h-1 w-10 rounded-full bg-gray-200"></div></div>
        <div class="px-4 pb-8 pt-3">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <Icon icon="mdi:robot-outline" class="text-[22px] text-[#10b8ad]" />
              <h3 class="text-[15px] font-semibold text-[#17212f]">AI Copy Assist</h3>
              <span class="rounded-full bg-[#e9fffc] px-2 py-0.5 text-[8px] font-semibold text-[#10b8ad]">Beta</span>
            </div>
            <button @click="showAI = false; aiStep = 0; aiRisk = ''; aiTarget = ''">
              <Icon icon="mdi:close" class="text-[22px] text-gray-400" />
            </button>
          </div>

          <!-- Progress dots -->
          <div class="mt-3 flex justify-center gap-1.5">
            <span v-for="i in 3" :key="i" class="h-1.5 rounded-full transition-all duration-300"
              :class="aiStep >= i - 1 ? 'w-6 bg-[#10b8ad]' : 'w-1.5 bg-gray-200'"></span>
          </div>

          <!-- Step 0: Risk profile -->
          <div v-if="aiStep === 0">
            <p class="mt-4 text-[13px] font-semibold text-[#17212f]">What's your risk appetite?</p>
            <p class="mt-1 text-[10px] font-semibold text-gray-400">AI will match you with traders that fit your style.</p>
            <div class="mt-4 grid grid-cols-3 gap-2">
              <button
                v-for="r in riskProfiles"
                :key="r.label"
                @click="aiRisk = r.label"
                class="rounded-xl border-2 p-3 text-center transition-all active:scale-95"
                :class="aiRisk === r.label ? 'border-[#10b8ad] bg-[#e9fffc]' : 'border-gray-100 bg-gray-50'"
              >
                <Icon :icon="r.icon" class="text-[26px]" :class="aiRisk === r.label ? 'text-[#10b8ad]' : 'text-gray-400'" />
                <p class="mt-1 text-[10px] font-semibold" :class="aiRisk === r.label ? 'text-[#10b8ad]' : 'text-gray-500'">{{ r.label }}</p>
                <p class="mt-0.5 text-[8px] font-bold" :class="aiRisk === r.label ? 'text-[#10b8ad]/70' : 'text-gray-400'">{{ r.desc }}</p>
              </button>
            </div>
            <button
              @click="aiStep = 1"
              :disabled="!aiRisk"
              class="mt-6 h-12 w-full rounded-xl text-[13px] font-semibold text-white transition-all disabled:opacity-40"
              :class="aiRisk ? 'bg-[#08a99f] active:scale-95' : 'bg-gray-300'"
            >Continue</button>
          </div>

          <!-- Step 1: Target ROI -->
          <div v-if="aiStep === 1">
            <p class="mt-4 text-[13px] font-semibold text-[#17212f]">What's your monthly return target?</p>
            <p class="mt-1 text-[10px] font-semibold text-gray-400">We'll find traders who consistently hit this range.</p>
            <div class="mt-4 grid grid-cols-2 gap-2">
              <button
                v-for="t in ['5–10%', '10–20%', '20–35%', '35%+']"
                :key="t"
                @click="aiTarget = t"
                class="rounded-xl border-2 p-3 text-center transition-all active:scale-95"
                :class="aiTarget === t ? 'border-[#10b8ad] bg-[#e9fffc]' : 'border-gray-100 bg-gray-50'"
              >
                <p class="text-[15px] font-semibold" :class="aiTarget === t ? 'text-[#10b8ad]' : 'text-gray-600'">{{ t }}</p>
                <p class="text-[8px] font-bold" :class="aiTarget === t ? 'text-[#10b8ad]/70' : 'text-gray-400'">per month</p>
              </button>
            </div>
            <div class="mt-6 flex gap-3">
              <button @click="aiStep = 0" class="h-12 flex-1 rounded-xl border border-gray-200 text-[12px] font-semibold text-gray-500 active:scale-95">Back</button>
              <button
                @click="runAIMatch"
                :disabled="!aiTarget || aiSearching"
                class="h-12 flex-1 rounded-xl text-[12px] font-semibold text-white disabled:opacity-40"
                :class="aiTarget ? 'bg-[#08a99f] active:scale-95' : 'bg-gray-300'"
              >
                <span v-if="aiSearching" class="flex items-center justify-center gap-2">
                  <Icon icon="mdi:loading" class="animate-spin text-[16px]" /> Matching...
                </span>
                <span v-else>Find Matches</span>
              </button>
            </div>
          </div>

          <!-- Step 2: Results -->
          <div v-if="aiStep === 2">
            <div class="mt-4 flex items-center gap-2">
              <p class="text-[13px] font-semibold text-[#17212f]">AI Matched {{ aiMatched.length }} Trader{{ aiMatched.length !== 1 ? 's' : '' }}</p>
              <Icon icon="mdi:check-decagram" class="text-[16px] text-[#10b8ad]" />
            </div>
            <p class="mt-0.5 text-[10px] font-semibold text-gray-400">{{ aiRisk }} profile · {{ aiTarget }} monthly target</p>

            <div class="mt-4 flex flex-col gap-2.5">
              <div v-for="(t, idx) in aiMatched" :key="t.name" class="flex items-center gap-3 rounded-xl border border-gray-100 bg-[#f6f8fb] px-3 py-2.5">
                <div class="relative">
                  <img :src="t.avatar" :alt="t.name" class="h-11 w-11 rounded-full object-cover" />
                  <span class="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#10b8ad] text-[7px] font-bold text-white">
                    #{{ idx + 1 }}
                  </span>
                </div>
                <div class="min-w-0 flex-1">
                  <p class="text-[12px] font-semibold text-[#17212f]">{{ t.name }}</p>
                  <p class="text-[9px] font-semibold text-[#10b8ad]">{{ t.roi >= 0 ? '+' : '' }}{{ t.roi.toFixed(1) }}% ROI · {{ t.winRate }}% Win</p>
                  <div class="mt-1 h-1 w-full rounded-full bg-gray-200">
                    <div class="h-1 rounded-full bg-[#10b8ad]" :style="{ width: t.winRate + '%' }"></div>
                  </div>
                </div>
                <button @click="showAI = false; router.push(`/copy-trader/${t.username}`)" class="h-8 shrink-0 rounded-lg bg-[#08a99f] px-4 text-[11px] font-semibold text-white active:scale-95">
                  Copy
                </button>
              </div>

              <div v-if="aiMatched.length === 0" class="py-6 text-center">
                <Icon icon="mdi:robot-confused-outline" class="text-[40px] text-gray-300" />
                <p class="mt-2 text-[11px] font-semibold text-gray-400">No exact matches found. Try different criteria.</p>
              </div>
            </div>

            <div class="mt-6 flex gap-3">
              <button @click="aiStep = 0; aiRisk = ''; aiTarget = ''" class="h-12 flex-1 rounded-xl border border-gray-200 text-[12px] font-semibold text-gray-500 active:scale-95">Retry</button>
              <button @click="showAI = false; aiStep = 0; aiRisk = ''; aiTarget = ''" class="h-12 flex-1 rounded-xl bg-[#08a99f] text-[12px] font-semibold text-white active:scale-95">Done</button>
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <!-- ────────── TERMS & CONDITIONS ────────── -->
    <Transition
      enter-from-class="translate-y-full"
      enter-active-class="transition-transform duration-300"
      leave-to-class="translate-y-full"
      leave-active-class="transition-transform duration-300"
    >
      <div v-if="showTerms" class="fixed inset-x-0 bottom-[75px] left-1/2 z-50 w-full max-w-107.5 -translate-x-1/2 rounded-t-2xl bg-white shadow-2xl">
        <div class="flex justify-center pt-3"><div class="h-1 w-10 rounded-full bg-gray-200"></div></div>
        <div class="flex items-center justify-between border-b border-gray-100 px-4 py-3">
          <h3 class="text-[15px] font-semibold text-[#17212f]">Terms &amp; Conditions</h3>
          <button @click="showTerms = false"><Icon icon="mdi:close" class="text-[22px] text-gray-400" /></button>
        </div>

        <div
          ref="termsScrollEl"
          class="max-h-[60dvh] overflow-y-auto px-4 py-3 text-[12px] leading-relaxed text-gray-700 space-y-4"
          @scroll="onTermsScroll"
        >
          <div>
            <h4 class="mt-1 text-[12px] font-semibold text-[#17212f]">1. Join the Pool</h4>
            <div class="mt-1 space-y-1 text-[11px] font-semibold text-gray-500">
              <p>Each member who wishes to participate in the collective trading pool must deposit funds according to the agreed amount.</p>
              <p>Funds will be automatically secured in the smart contract for the duration of the trading session.</p>
              <p>All trading activities within the Pool are directed by the Master Trader. While entry (opening) may be performed manually by members following the minimum requirements, all closing of positions is executed collectively and automatically.</p>
              <p>By joining, you agree to follow the Pool rules.</p>
            </div>
          </div>

          <div>
            <h4 class="mt-1 text-[12px] font-semibold text-[#17212f]">2. How Trading Works</h4>
            <div class="mt-1 space-y-1 text-[11px] font-semibold text-gray-500">
              <p>Trading positions are opened according to the applied strategy, with members required to follow the minimum entry instructions.</p>
              <p>Closing of all trading positions is executed collectively and automatically under the Master Trader's direction.</p>
              <p>All profit and loss calculations are performed automatically by the smart contract.</p>
              <p>Followers can only participate in a maximum of 5 open positions at the same time.</p>
            </div>
          </div>

          <div>
            <h4 class="mt-1 text-[12px] font-semibold text-[#17212f]">3. Profit Distribution</h4>
            <div class="mt-1 space-y-1 text-[11px] font-semibold text-gray-500">
              <p>Profits and losses are shared proportionally based on each member's contribution.</p>
              <p>Final results will be displayed on the dashboard and can be withdrawn once the session is completed.</p>
              <p>If service fees apply, they are not automatically deducted from profit. Members are required to pay service fees manually as instructed by the Pool management.</p>
            </div>
          </div>

          <div>
            <h4 class="mt-1 text-[12px] font-semibold text-[#17212f]">4. Discipline Rules</h4>
            <div class="mt-1 space-y-1 text-[11px] font-semibold text-gray-500">
              <p>If a member fails to fulfill their Pool obligations (e.g., cancelling their participation, maintaining an insufficient balance, or attempting an early withdrawal), their funds will be locked until the end of the trading session.</p>
              <p>After the session ends, the locked funds will be reviewed. If a member's lack of discipline causes losses to other participants, the entire balance will be automatically and proportionally redistributed to all members who continued to actively participate during the session as compensation.</p>
              <p>However, if all trading positions have been closed and are profitable, any member who fails to fulfill their Pool obligations will be disqualified or subject to an 8% penalty as a form of disciplinary action.</p>
              <p>By joining the Pool, all members acknowledge and agree to these rules to ensure fairness and prevent disruption of collective trading sessions.</p>
            </div>
          </div>

          <div>
            <h4 class="mt-1 text-[12px] font-semibold text-[#17212f]">5. Things to Understand</h4>
            <div class="mt-1 space-y-1 text-[11px] font-semibold text-gray-500">
              <p>Trading cryptocurrencies offers potential profit, but also involves risk.</p>
              <p>Profit is not guaranteed in every session as results depend on market conditions.</p>
              <p>By participating, members acknowledge and accept the risks involved.</p>
            </div>
          </div>

          <div>
            <h4 class="mt-1 text-[12px] font-semibold text-[#17212f]">6. Smart Contract Transparency</h4>
            <div class="mt-1 space-y-1 text-[11px] font-semibold text-gray-500">
              <p>All rules are coded into the smart contract, ensuring transparency and automation.</p>
              <p>No party can alter the final outcome once the session is in progress.</p>
            </div>
          </div>
        </div>

        <div class="border-t border-gray-100 px-4 py-3">
          <button
            @click="showTerms = false"
            :disabled="!termsScrolledToBottom"
            class="h-11 w-full rounded-xl text-[13px] font-semibold text-white transition-all"
            :class="termsScrolledToBottom ? 'bg-[#08a99f] active:scale-95' : 'cursor-not-allowed bg-gray-300'"
          >
            I Understand
          </button>
          <p v-if="!termsScrolledToBottom" class="mt-2 text-center text-[10px] font-semibold text-gray-400">Scroll to the bottom to continue</p>
        </div>
      </div>
    </Transition>

    <!-- ────────── JOIN PASSWORD MODAL ────────── -->
    <Transition
      enter-from-class="translate-y-full"
      enter-active-class="transition-transform duration-300"
      leave-to-class="translate-y-full"
      leave-active-class="transition-transform duration-300"
    >
      <div v-if="showJoinPassword" class="fixed inset-x-0 bottom-[75px] left-1/2 z-50 w-full max-w-107.5 -translate-x-1/2 rounded-t-2xl bg-white shadow-2xl">
        <div class="flex justify-center pt-3"><div class="h-1 w-10 rounded-full bg-gray-200"></div></div>
        <div class="px-5 pb-8 pt-4">
          <div class="flex items-center justify-between">
            <h3 class="text-[15px] font-semibold text-[#17212f]">Confirm to Join</h3>
            <button @click="showJoinPassword = false; joinPassword = ''; joinPasswordVisible = false">
              <Icon icon="mdi:close" class="text-[22px] text-gray-400" />
            </button>
          </div>

          <p class="mt-1 text-[11px] font-semibold text-gray-400">Enter your account password to confirm you want to join this trader.</p>

          <div class="mt-5 flex items-center gap-3 rounded-xl border border-gray-100 bg-[#f6f8fb] px-4 py-3.5">
            <Icon icon="mdi:lock-outline" class="shrink-0 text-[18px] text-gray-400" />
            <input
              v-model="joinPassword"
              :type="joinPasswordVisible ? 'text' : 'password'"
              placeholder="Enter your password"
              autocomplete="current-password"
              class="min-w-0 flex-1 bg-transparent text-[13px] font-semibold text-[#17212f] outline-none placeholder:text-gray-400"
            />
            <button type="button" @click="joinPasswordVisible = !joinPasswordVisible" class="shrink-0 active:scale-90">
              <Icon :icon="joinPasswordVisible ? 'mdi:eye-off-outline' : 'mdi:eye-outline'" class="text-[18px] text-gray-400" />
            </button>
          </div>

          <p v-if="joinPasswordError" class="mt-2 text-[11px] font-semibold text-red-400">{{ joinPasswordError }}</p>

          <button
            @click="confirmJoin"
            :disabled="joinPassword.length < 1"
            class="mt-5 h-12 w-full rounded-xl text-[13px] font-semibold text-white transition-all active:scale-[0.99]"
            :class="joinPassword.length > 0 ? 'bg-[#08a99f]' : 'cursor-not-allowed bg-gray-300'"
          >
            Confirm &amp; Join
          </button>
        </div>
      </div>
    </Transition>
  </DashboardLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { Icon } from '@iconify/vue'
import { useRouter } from 'vue-router'
import DashboardLayout from '@/layouts/DashboardLayout.vue'
import { makeContentApi } from '@/services/api'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const auth = useAuthStore()

// ─── Types ───────────────────────────────────────────────────
interface LiveStat {
  label: string
  value: string
  change: string
  raw: number
  delta: number
}

interface TopTrader {
  name: string
  roi: string
  copiers: string
  avatar: string
}

interface Trader {
  rank: string
  name: string
  username: string
  tag: string
  avatar: string
  roi: number
  aum: string
  winRate: number
  copiers: number
  minCopy: number
  risk: string
  riskClass: string
  chartPts: number[]
}

// ─── Tabs & Sort ─────────────────────────────────────────────
const activeTab = ref('Top Traders')
const tabs = ['Top Traders', 'Trending', 'Following']
const sortValue = ref('30D ROI')
const sortOptions = ['30D ROI', 'Win Rate', 'Copiers', 'Min Copy']
const showSort = ref(false)

// ─── Search & Filter ─────────────────────────────────────────
const searchQuery = ref('')
const showFilter = ref(false)
const filterRisk = ref<string[]>([])
const filterMinRoi = ref(0)
const filterMinWinRate = ref(0)

const activeFilterCount = computed(() => {
  let n = 0
  if (filterRisk.value.length > 0) n++
  if (filterMinRoi.value > 0) n++
  if (filterMinWinRate.value > 0) n++
  return n
})

function toggleFilterRisk(r: string) {
  const idx = filterRisk.value.indexOf(r)
  if (idx > -1) filterRisk.value.splice(idx, 1)
  else filterRisk.value.push(r)
}

// ─── AI Assist ───────────────────────────────────────────────
const showAI = ref(false)
const showTerms = ref(false)
const termsScrolledToBottom = ref(false)
const termsScrollEl = ref<HTMLElement | null>(null)

const showJoinPassword = ref(false)
const joinPassword = ref('')
const joinPasswordVisible = ref(false)
const joinPasswordError = ref('')
const pendingJoinUsername = ref('')

function openJoinModal(username: string) {
  pendingJoinUsername.value = username
  joinPassword.value = ''
  joinPasswordVisible.value = false
  joinPasswordError.value = ''
  showJoinPassword.value = true
}

function confirmJoin() {
  if (joinPassword.value.length < 1) return
  showJoinPassword.value = false
  joinPassword.value = ''
  joinPasswordVisible.value = false
  joinPasswordError.value = ''
  router.push(`/copy-trader/${pendingJoinUsername.value}`)
}

function onTermsScroll(e: Event) {
  const el = e.target as HTMLElement
  termsScrolledToBottom.value = el.scrollTop + el.clientHeight >= el.scrollHeight - 8
}
const aiStep = ref(0)
const aiRisk = ref('')
const aiTarget = ref('')
const aiMatched = ref<Trader[]>([])
const aiSearching = ref(false)

const riskProfiles = [
  { label: 'Conservative', icon: 'mdi:shield-outline', desc: 'Low volatility' },
  { label: 'Balanced', icon: 'mdi:scale-balance', desc: 'Moderate risk' },
  { label: 'Aggressive', icon: 'mdi:lightning-bolt', desc: 'High returns' },
]

function runAIMatch() {
  aiSearching.value = true
  setTimeout(() => {
    let candidates = [...tradersRaw.value]
    if (aiRisk.value === 'Conservative') candidates = candidates.filter(t => t.risk === 'Low Risk')
    else if (aiRisk.value === 'Aggressive') candidates = candidates.filter(t => t.risk !== 'Low Risk')
    if (aiTarget.value === '5–10%') candidates = candidates.filter(t => t.roi >= 5 && t.roi <= 20)
    else if (aiTarget.value === '10–20%') candidates = candidates.filter(t => t.roi >= 10)
    else if (aiTarget.value === '20–35%') candidates = candidates.filter(t => t.roi >= 20)
    else if (aiTarget.value === '35%+') candidates = candidates.filter(t => t.roi >= 30)
    aiMatched.value = candidates.slice(0, 3)
    aiSearching.value = false
    aiStep.value = 2
  }, 1200)
}

// ─── View All Top Traders ────────────────────────────────────
const showAllTopTraders = ref(false)

const allTopTraders = computed<TopTrader[]>(() =>
  [...tradersRaw.value].sort((a, b) => b.roi - a.roi).slice(0, 5).map(t => ({
    name:    t.name,
    roi:     (t.roi >= 0 ? '+' : '') + t.roi.toFixed(1) + '%',
    copiers: (t.copiers >= 1000 ? (t.copiers / 1000).toFixed(1) + 'K' : String(t.copiers)) + ' Copiers',
    avatar:  t.avatar,
  }))
)

const displayTopTraders = computed(() =>
  showAllTopTraders.value ? allTopTraders.value : allTopTraders.value.slice(0, 3)
)

// ─── Trader Refs (scroll highlight) ─────────────────────────
const traderRefs: Record<string, HTMLElement> = {}
const highlightedTrader = ref('')

function scrollToTrader(name: string) {
  activeTab.value = 'Top Traders'
  highlightedTrader.value = name
  setTimeout(() => {
    const el = traderRefs[name]
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' })
    setTimeout(() => { highlightedTrader.value = '' }, 1600)
  }, 100)
}

// ─── Live Stats ──────────────────────────────────────────────
const liveStats = ref<LiveStat[]>([
  { label: 'Total Copied Value', value: '$3.28B',   change: '+18.36% (7D)', raw: 3.28,   delta: 0.01  },
  { label: 'Avg. 30D ROI',       value: '+24.67%',  change: '',             raw: 24.67,  delta: 0.08  },
  { label: 'Active Traders',     value: '2,341',    change: '+132 (7D)',    raw: 2341,   delta: 1     },
  { label: 'Total Copiers',      value: '112,875',  change: '+5.71% (7D)', raw: 112875, delta: 25    },
])

const bar1 = ref(32)
const bar2 = ref(48)
const bar3 = ref(64)
const bar4 = ref(40)

// ─── Traders Data ────────────────────────────────────────────
function randPts(n: number, base: number, amp: number): number[] {
  const pts: number[] = []
  let v = base
  for (let i = 0; i < n; i++) {
    v = Math.max(5, Math.min(95, v + (Math.random() - 0.45) * amp))
    pts.push(v)
  }
  return pts
}

const tradersRaw = ref<Trader[]>([
  { rank: '01', name: 'Alex Chen', username: 'alex-chen',   tag: 'BTC Swing',          avatar: 'https://i.pravatar.cc/100?img=12', roi: 48.7, aum: '$760.4M', winRate: 76.0, copiers: 5800, minCopy: 100, risk: 'Low Risk',    riskClass: 'bg-[#e9fffc] text-[#10b8ad]',  chartPts: randPts(10, 55, 14) },
  { rank: '02', name: 'Sophia Li', username: 'sophia-li',   tag: 'ETH Scalper',        avatar: 'https://i.pravatar.cc/100?img=47', roi: 35.1, aum: '$16.2M',  winRate: 71.8, copiers: 4200, minCopy: 100, risk: 'Medium Risk', riskClass: 'bg-orange-50 text-orange-400', chartPts: randPts(10, 45, 18) },
  { rank: '03', name: 'James Wu',  username: 'james-wu',    tag: 'Futures Momentum',   avatar: 'https://i.pravatar.cc/100?img=52', roi: 31.6, aum: '$12.1M',  winRate: 68.2, copiers: 3700, minCopy: 200, risk: 'High Risk',   riskClass: 'bg-red-50 text-red-400',        chartPts: randPts(10, 42, 24) },
  { rank: '04', name: 'Mia Zhang', username: 'mia-zhang',   tag: 'Low Risk Portfolio', avatar: 'https://i.pravatar.cc/100?img=32', roi: 18.4, aum: '$8.8M',   winRate: 82.6, copiers: 2100, minCopy:  50, risk: 'Low Risk',    riskClass: 'bg-[#e9fffc] text-[#10b8ad]',  chartPts: randPts(10, 62,  8) },
  { rank: '05', name: 'Noah Kim',  username: 'noah-kim',    tag: 'Altcoin Scout',      avatar: 'https://i.pravatar.cc/100?img=60', roi: 26.5, aum: '$4.3M',   winRate: 65.4, copiers: 1800, minCopy: 100, risk: 'Medium Risk', riskClass: 'bg-orange-50 text-orange-400', chartPts: randPts(10, 40, 20) },
  { rank: '06', name: 'Lena Park', username: 'lena-park',   tag: 'DeFi Yield',         avatar: 'https://i.pravatar.cc/100?img=35', roi: 14.2, aum: '$2.1M',   winRate: 79.1, copiers:  960, minCopy:  50, risk: 'Low Risk',    riskClass: 'bg-[#e9fffc] text-[#10b8ad]',  chartPts: randPts(10, 58,  8) },
])

const trendingOrder = [1, 4, 0, 2, 5, 3]
const followedTraders = ref<string[]>([])

// ─── Filtered + Sorted ───────────────────────────────────────
const filteredTraders = computed<Trader[]>(() => {
  let list: Trader[]

  if (activeTab.value === 'Trending') {
    list = trendingOrder.map(i => tradersRaw.value[i]).filter(Boolean)
    list = list.map((t, i) => ({ ...t, rank: String(i + 1).padStart(2, '0') }))
  } else if (activeTab.value === 'Following') {
    list = tradersRaw.value.filter(t => followedTraders.value.includes(t.name))
  } else {
    list = [...tradersRaw.value]
  }

  const q = searchQuery.value.trim().toLowerCase()
  if (q) list = list.filter(t => t.name.toLowerCase().includes(q) || t.tag.toLowerCase().includes(q))

  if (filterRisk.value.length > 0) list = list.filter(t => filterRisk.value.includes(t.risk))
  if (filterMinRoi.value > 0) list = list.filter(t => t.roi >= filterMinRoi.value)
  if (filterMinWinRate.value > 0) list = list.filter(t => t.winRate >= filterMinWinRate.value)

  return [...list].sort((a, b) => {
    if (sortValue.value === '30D ROI')  return b.roi - a.roi
    if (sortValue.value === 'Win Rate') return b.winRate - a.winRate
    if (sortValue.value === 'Copiers')  return b.copiers - a.copiers
    if (sortValue.value === 'Min Copy') return a.minCopy - b.minCopy
    return 0
  })
})

// ─── SVG Sparkline helpers ───────────────────────────────────
function buildLinePath(pts: number[], W: number, H: number): string {
  if (pts.length < 2) return ''
  const min = Math.min(...pts)
  const max = Math.max(...pts)
  const range = max - min || 1
  const xs = pts.map((_, i) => (i / (pts.length - 1)) * W)
  const ys = pts.map(p => H - ((p - min) / range) * (H - 2) - 1)
  let d = `M ${xs[0]},${ys[0]}`
  for (let i = 1; i < pts.length; i++) {
    const cpx = (xs[i - 1] + xs[i]) / 2
    d += ` C ${cpx},${ys[i - 1]} ${cpx},${ys[i]} ${xs[i]},${ys[i]}`
  }
  return d
}

function buildFilledPath(pts: number[], W: number, H: number): string {
  if (pts.length < 2) return ''
  return `${buildLinePath(pts, W, H)} L ${W},${H} L 0,${H} Z`
}

// ─── Live Tick (sparkline animation only — stats come from API) ─────────────
let timer: ReturnType<typeof setInterval> | null = null

function tick() {
  bar1.value = 18 + Math.random() * 46
  bar2.value = 28 + Math.random() * 42
  bar3.value = 40 + Math.random() * 28
  bar4.value = 22 + Math.random() * 46

  tradersRaw.value = tradersRaw.value.map(t => {
    const last = t.chartPts[t.chartPts.length - 1]
    const next = Math.max(5, Math.min(95, last + (Math.random() - 0.45) * 14))
    return { ...t, chartPts: [...t.chartPts.slice(1), next] }
  })
}

// ─── Risk helpers ────────────────────────────────────────────
// DB stores ENUM: 'Low Risk' | 'Medium Risk' | 'High Risk'
function riskLabel(raw: string): string {
  if (!raw) return 'Medium Risk'
  if (raw.toLowerCase().includes('low'))  return 'Low Risk'
  if (raw.toLowerCase().includes('high')) return 'High Risk'
  return 'Medium Risk'
}
function riskClass(raw: string): string {
  if (!raw) return 'bg-orange-50 text-orange-400'
  if (raw.toLowerCase().includes('low'))  return 'bg-[#e9fffc] text-[#10b8ad]'
  if (raw.toLowerCase().includes('high')) return 'bg-red-50 text-red-400'
  return 'bg-orange-50 text-orange-400'
}

onMounted(async () => {
  timer = setInterval(tick, 1100)

  if (!auth.accessToken) return
  try {
    const api = makeContentApi(auth.accessToken)
    const [tradersData, statsData] = await Promise.all([
      api.getCopyTraders(),
      api.getCopyStats(),
    ])

    if (tradersData.traders.length > 0) {
      tradersRaw.value = tradersData.traders.map((t, i) => ({
        rank:      String(i + 1).padStart(2, '0'),
        name:      t.name,
        username:  t.username,
        tag:       t.tag ?? '',
        avatar:    t.avatar ?? `https://i.pravatar.cc/100?img=${20 + i}`,
        roi:       Number(t.roi),
        aum:       t.aum,
        winRate:   Number(t.win_rate),
        copiers:   Number(t.copiers),
        minCopy:   Number(t.min_copy),
        risk:      riskLabel(t.risk),
        riskClass: riskClass(t.risk),
        chartPts:  randPts(10, 45, 18),
      }))
    }

    liveStats.value = statsData.stats.map(s => ({
      label: s.label,
      value: s.value,
      change: s.change,
      raw: 0,
      delta: 0,
    }))
  } catch { /* silently use defaults */ }
})
onUnmounted(() => { if (timer) clearInterval(timer) })
</script>
