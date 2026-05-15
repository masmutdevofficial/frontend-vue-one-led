import type { Page, ConsoleMessage } from '@playwright/test'

// ---------------------------------------------------------------------------
// Messages to silently skip (safe / unactionable noise)
// ---------------------------------------------------------------------------
const IGNORE_TEXT: RegExp[] = [
  /\[vite\]/i,
  /\[HMR\]/i,
  /Download the Vue Devtools/i,
  /vue-devtools/i,
  /favicon\.ico/i,
]

// Network-level errors that are acceptable in a local dev environment
// (e.g. the optional WS price-feed server not being started during tests)
const IGNORE_ERROR_TEXT: RegExp[] = [
  /ws:\/\/localhost:3002/i,
  /ERR_CONNECTION_REFUSED.*3002/i,
  /WebSocket.*3002/i,
  // Iconify loads icons from CDN — may fail in offline/restricted envs
  /api\.iconify\.design/i,
]

export interface ConsoleIssue {
  kind:   'error' | 'warning' | 'pageerror'
  text:   string
  url:    string
}

/**
 * Attach console + pageerror listeners to a page.
 * Returns { issues } array that accumulates every captured error/warning.
 *
 * @example
 *   const { issues } = watchConsole(page)
 *   await page.goto('/login')
 *   await page.waitForLoadState('networkidle')
 *   expect(issues, issues.map(i => i.text).join('\n')).toHaveLength(0)
 */
export function watchConsole(page: Page): { issues: ConsoleIssue[] } {
  const issues: ConsoleIssue[] = []

  page.on('console', (msg: ConsoleMessage) => {
    const text = msg.text()
    const type = msg.type()

    // Skip log/info/debug — only care about errors and warnings
    if (type !== 'error' && type !== 'warning') return

    // Skip globally ignored text patterns
    if (IGNORE_TEXT.some(p => p.test(text))) return

    if (type === 'error') {
      if (IGNORE_ERROR_TEXT.some(p => p.test(text))) return
      issues.push({ kind: 'error', text, url: page.url() })
    } else {
      // warning
      if (IGNORE_ERROR_TEXT.some(p => p.test(text))) return
      issues.push({ kind: 'warning', text, url: page.url() })
    }
  })

  page.on('pageerror', (err: Error) => {
    issues.push({ kind: 'pageerror', text: err.message, url: page.url() })
  })

  return { issues }
}

/**
 * Format issues array into a readable assertion message.
 */
export function formatIssues(issues: ConsoleIssue[]): string {
  if (!issues.length) return '(none)'
  return issues
    .map(i => `  [${i.kind.toUpperCase()}] ${i.text}`)
    .join('\n')
}
