import { test, expect } from '@playwright/test'
import { watchConsole, formatIssues } from './helpers/console-watcher'

// ---------------------------------------------------------------------------
// All authenticated dashboard routes.
// The test uses the storageState saved by auth.setup.ts, so the user is
// already logged in when each test starts.
// ---------------------------------------------------------------------------

interface PageDef {
  name:    string
  path:    string
  /** Optional: extra ms to wait after networkidle (for async chart/WS init) */
  settle?: number
}

const DASHBOARD_PAGES: PageDef[] = [
  { name: 'Home',                   path: '/dashboard',              settle: 1000 },
  { name: 'Profile',                path: '/profile' },
  { name: 'Assets',                 path: '/assets' },
  { name: 'Market',                 path: '/market',                 settle: 800 },
  { name: 'Add Funds',              path: '/add-funds' },
  { name: 'Crypto Deposit',         path: '/crypto-deposit' },
  { name: 'P2P Trading',            path: '/p2p-trading' },
  { name: 'Withdraw',               path: '/withdraw' },
  { name: 'Withdraw History',       path: '/withdraw-history' },
  { name: 'Deposit History',        path: '/deposit-history' },
  { name: 'Transfer',               path: '/transfer' },
  { name: 'Copy Trade',             path: '/copy-trade' },
  { name: 'Copy Trade History',     path: '/copy-trade-history' },
  { name: 'Events',                 path: '/events' },
  { name: 'Trade (BTC)',            path: '/trade/btc',              settle: 2000 },
  { name: 'Trade (ETH)',            path: '/trade/eth',              settle: 1500 },
  { name: 'Futures',                path: '/futures',                settle: 800 },
  { name: 'Security',               path: '/security' },
  { name: 'Tracking Funds',         path: '/tracking-funds' },
  { name: 'Help Center',            path: '/help-center' },
  { name: 'Verification',           path: '/verification' },
  { name: 'Notifications',          path: '/notifications' },
  { name: 'Notification Settings',  path: '/notification-settings' },
  { name: 'Campaigns',              path: '/campaigns' },
  { name: 'Learn & Earn',           path: '/learn-earn' },
  { name: 'AMA',                    path: '/ama' },
  { name: 'Rewards',                path: '/rewards' },
  { name: 'News',                   path: '/news' },
  { name: 'Staking',                path: '/staking' },
]

// ---------------------------------------------------------------------------
// Generate one test per page
// ---------------------------------------------------------------------------
for (const pg of DASHBOARD_PAGES) {
  test(`${pg.name} (${pg.path}) — no console errors`, async ({ page }) => {
    const { issues } = watchConsole(page)

    await page.goto(pg.path)

    // Wait for initial network activity to calm down
    await page.waitForLoadState('networkidle').catch(() => {})

    // Extra settle time for pages with charts, WebSocket or heavy animations
    if (pg.settle) await page.waitForTimeout(pg.settle)

    // The page must NOT have been redirected to /login
    // (would indicate the storageState was not applied correctly)
    expect(
      page.url(),
      `Page ${pg.path} redirected to login — auth state may be missing`,
    ).not.toContain('/login')

    // Primary assertion: zero console errors/warnings
    expect(
      issues,
      `Console issues on ${pg.path}:\n${formatIssues(issues)}`,
    ).toHaveLength(0)
  })
}

// ---------------------------------------------------------------------------
// Smoke test: page titles / basic render sanity
// ---------------------------------------------------------------------------
test('Dashboard home renders main navigation', async ({ page }) => {
  const { issues } = watchConsole(page)

  await page.goto('/dashboard')
  await page.waitForLoadState('networkidle').catch(() => {})

  // Navigation / bottom-bar should be visible
  const nav = page.locator('nav, [role="navigation"], .bottom-nav, .sidebar')
  await expect(nav.first()).toBeVisible({ timeout: 8_000 })

  expect(
    issues,
    `Console issues on /dashboard:\n${formatIssues(issues)}`,
  ).toHaveLength(0)
})

test('Trade page chart container is rendered', async ({ page }) => {
  const { issues } = watchConsole(page)

  await page.goto('/trade/btc')
  await page.waitForLoadState('networkidle').catch(() => {})
  await page.waitForTimeout(2_000) // allow chart to initialise

  // The lightweight-charts div or canvas must be in the DOM
  const chart = page.locator('[class*="chart"], canvas, .tv-lightweight-charts')
  await expect(chart.first()).toBeVisible({ timeout: 10_000 })

  expect(
    issues,
    `Console issues on /trade/btc:\n${formatIssues(issues)}`,
  ).toHaveLength(0)
})
