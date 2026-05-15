/**
 * Singleton WebSocket composable — Binance prices via the own ws-server proxy.
 *
 * Architecture:  Binance WS → ws-server (port 3002) → this composable → components
 *
 * Usage in a component:
 *   const { tickerMap } = useMarketWs()
 *   watch(tickerMap, () => {
 *     const t = tickerMap.value.get('BTCUSDT')
 *     if (t) price.value = t.price
 *   })
 */

import { ref, onUnmounted } from 'vue'

// ── Types ─────────────────────────────────────────────────────────────────────

export interface TickerData {
  symbol: string  // e.g. 'BTCUSDT'
  price:  number
  open:   number  // 24 h open (used to compute change %)
  high:   number
  low:    number
  volume: number  // base-asset volume
  change: number  // 24 h % change, calculated client-side
}

// Raw tick object as sent by ws-server
interface RawTick {
  s: string  // symbol
  c: string  // close / latest price
  o: string  // 24 h open
  h: string  // 24 h high
  l: string  // 24 h low
  v: string  // base volume
  q: string  // quote volume (unused here)
}

// ── Singleton state ───────────────────────────────────────────────────────────

const WS_URL: string = 'wss://ws.one-led.io'

/**
 * Reactive map of Binance pair → latest ticker data.
 * Updated whenever ws-server pushes a snapshot or individual tick.
 */
export const tickerMap = ref<Map<string, TickerData>>(new Map())

let _ws: WebSocket | null = null
let _refCount = 0
let _reconnectTimer: ReturnType<typeof setTimeout> | null = null

// ── Internal helpers ──────────────────────────────────────────────────────────

function applyTick(raw: RawTick): void {
  const price = parseFloat(raw.c)
  const open  = parseFloat(raw.o)
  const next  = new Map(tickerMap.value)
  next.set(raw.s.toUpperCase(), {
    symbol: raw.s.toUpperCase(),
    price,
    open,
    high:   parseFloat(raw.h),
    low:    parseFloat(raw.l),
    volume: parseFloat(raw.v),
    change: open > 0 ? ((price - open) / open) * 100 : 0,
  })
  tickerMap.value = next
}

function connect(): void {
  if (_reconnectTimer) {
    clearTimeout(_reconnectTimer)
    _reconnectTimer = null
  }
  if (
    _ws &&
    (_ws.readyState === WebSocket.OPEN || _ws.readyState === WebSocket.CONNECTING)
  ) {
    return
  }

  try {
    _ws = new WebSocket(WS_URL)
  } catch {
    // WebSocket constructor throws if url is invalid
    return
  }

  _ws.onmessage = (ev: MessageEvent) => {
    try {
      const msg = JSON.parse(ev.data as string)
      if (msg.type === 'snapshot' && Array.isArray(msg.tickers)) {
        msg.tickers.forEach((t: RawTick) => applyTick(t))
      } else if (msg.type === 'ticker') {
        applyTick(msg as RawTick)
      }
    } catch {
      // ignore malformed frames
    }
  }

  _ws.onclose = () => {
    _ws = null
    if (_refCount > 0) {
      // Reconnect with exponential backoff (capped at 30 s)
      _reconnectTimer = setTimeout(connect, 5_000)
    }
  }

  _ws.onerror = () => {
    _ws?.close()
  }
}

function disconnect(): void {
  if (_reconnectTimer) {
    clearTimeout(_reconnectTimer)
    _reconnectTimer = null
  }
  _ws?.close()
  _ws = null
}

// ── Public composable ─────────────────────────────────────────────────────────

/**
 * Call this in any component that needs live market prices.
 * The WS connection is shared (singleton) and opened on first consumer,
 * closed when the last consumer unmounts.
 */
export function useMarketWs() {
  _refCount++
  if (_refCount === 1) connect()

  onUnmounted(() => {
    _refCount--
    if (_refCount === 0) disconnect()
  })

  return { tickerMap }
}
