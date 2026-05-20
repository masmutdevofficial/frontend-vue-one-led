/**
 * src/utils/cdn.ts
 *
 * Build a full CDN URL from an R2 object key or any image path.
 *
 * Usage:
 *   cdnUrl('coin-icons/btc.png')
 *     → 'https://cdn.one-led.io/coin-icons/btc.png'
 *
 *   cdnUrl('https://cdn.one-led.io/coin-icons/btc.png')
 *     → 'https://cdn.one-led.io/coin-icons/btc.png'  (passthrough)
 *
 *   cdnUrl(null)  → '' (empty string, safe for :src bindings)
 */

const CDN_BASE = 'https://cdn.one-led.io'

export function cdnUrl(path: string | null | undefined): string {
  if (!path) return ''
  // Already an absolute URL — force HTTPS to prevent mixed-content warnings
  if (/^https?:\/\//i.test(path)) return path.replace(/^http:\/\//i, 'https://')
  // Relative key — prepend CDN base
  return `${CDN_BASE}/${path.replace(/^\//, '')}`
}
