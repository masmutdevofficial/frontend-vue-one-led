import { test, expect } from '@playwright/test'
import { watchConsole, formatIssues } from './helpers/console-watcher'

// ---------------------------------------------------------------------------
// Public pages — accessible without authentication
// These pages should render cleanly and produce no console errors/warnings.
// ---------------------------------------------------------------------------

const PUBLIC_PAGES: { name: string; path: string; expectedText?: string }[] = [
  { name: 'Landing',          path: '/' },
  { name: 'Login',            path: '/login',    expectedText: 'Login' },
  { name: 'Register',         path: '/register', expectedText: 'Register' },
  { name: 'Forgot Password',  path: '/forgot' },
  { name: '404 Not Found',    path: '/this-page-does-not-exist-404' },
]

for (const p of PUBLIC_PAGES) {
  test(`${p.name} (${p.path}) — no console errors`, async ({ page }) => {
    const { issues } = watchConsole(page)

    await page.goto(p.path)
    await page.waitForLoadState('networkidle').catch(() => {})
    // Extra settle time for async Vue components / icon loads
    await page.waitForTimeout(800)

    expect(
      issues,
      `Console issues on ${p.path}:\n${formatIssues(issues)}`,
    ).toHaveLength(0)
  })
}

// ---------------------------------------------------------------------------
// Login flow — validates the login form works end-to-end
// ---------------------------------------------------------------------------
test('Login form → redirect to /dashboard on success', async ({ page }) => {
  const email    = process.env.E2E_EMAIL    ?? ''
  const password = process.env.E2E_PASSWORD ?? ''

  if (!email || !password) {
    test.skip(true, 'E2E_EMAIL / E2E_PASSWORD not set — skipping login flow test')
    return
  }

  const { issues } = watchConsole(page)

  await page.goto('/login')
  await page.waitForLoadState('domcontentloaded')

  // Fill credentials
  await page.locator('input[type="email"], input[name="email"], input[placeholder*="email" i]').first().fill(email)
  await page.locator('input[type="password"]').first().fill(password)
  await page.locator('button:has-text("Log In"), button:has-text("Login"), button[type="submit"]').first().click()

  // Should land on dashboard after successful login
  await page.waitForURL('**/dashboard', { timeout: 15_000 })
  await page.waitForLoadState('networkidle').catch(() => {})

  expect(
    issues,
    `Console issues during login flow:\n${formatIssues(issues)}`,
  ).toHaveLength(0)
})
