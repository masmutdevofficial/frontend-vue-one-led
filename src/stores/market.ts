import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { tickerMap } from '@/services/marketWs'

export interface CoinMeta {
  symbol: string       // 'BTC'
  name: string         // 'Bitcoin'
  binancePair: string  // 'BTCUSDT'
  icon: string         // 'mdi:bitcoin' OR 'https://cdn.../btc.png'
  isFeatured: boolean
}

/** Static color theme for common coins — fallback to neutral */
const COIN_COLORS: Record<string, string> = {
  BTC:  'bg-orange-100 text-orange-500',
  ETH:  'bg-blue-100 text-blue-500',
  SOL:  'bg-purple-100 text-purple-500',
  BNB:  'bg-yellow-100 text-yellow-500',
  XRP:  'bg-slate-100 text-slate-500',
  WIF:  'bg-amber-100 text-amber-700',
  RNDR: 'bg-blue-100 text-blue-600',
  USDT: 'bg-teal-100 text-teal-500',
  USDC: 'bg-blue-50 text-blue-400',
  ADA:  'bg-cyan-100 text-cyan-600',
  LTC:  'bg-gray-100 text-gray-500',
  TRX:  'bg-red-100 text-red-500',
  LINK: 'bg-blue-100 text-blue-700',
  DOT:  'bg-pink-100 text-pink-500',
  AVAX: 'bg-red-100 text-red-600',
  MATIC:'bg-violet-100 text-violet-600',
}

export function coinIconClass(symbol: string): string {
  return COIN_COLORS[symbol.toUpperCase()] ?? 'bg-gray-100 text-gray-500'
}

export const useMarketStore = defineStore('market', () => {
  const coins  = ref<CoinMeta[]>([])
  const loaded = ref(false)
  const loading = ref(false)

  const coinMap = computed(() =>
    new Map(coins.value.map(c => [c.symbol, c]))
  )

  async function fetchCoins() {
    if (loaded.value || loading.value) return
    loading.value = true
    try {
      const res = await fetch('https://api.one-led.io/v1/public/market-coins')
      const data = await res.json()
      coins.value = (data.coins ?? []).map((c: Record<string, unknown>) => ({
        symbol:      String(c.symbol ?? '').toUpperCase(),
        name:        String(c.name ?? c.symbol ?? ''),
        binancePair: String(c.binance_pair ?? String(c.symbol ?? '') + 'USDT').toUpperCase(),
        icon:        String(c.icon ?? 'mdi:currency-usd'),
        isFeatured:  Boolean(c.is_featured),
      }))
      loaded.value = true
    } catch {
      // silently fail — pages will use fallback values
    } finally {
      loading.value = false
    }
  }

  return { coins, coinMap, tickerMap, loaded, loading, fetchCoins }
})
