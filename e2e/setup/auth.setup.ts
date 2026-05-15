import { fileURLToPath } from 'url'
import path from 'path'
import { test as setup, expect } from '@playwright/test'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const AUTH_FILE = path.join(__dirname, '../.auth/user.json')

const EMAIL    = process.env.E2E_EMAIL    ?? ''
const PASSWORD = process.env.E2E_PASSWORD ?? ''

setup('authenticate user', async ({ page, request }) => {
  if (!EMAIL || !PASSWORD) {
    throw new Error(
      '\n\nE2E_EMAIL and E2E_PASSWORD must be set to run authenticated tests.\n' +
      'Copy ".env.test.example" to ".env.test" and fill in your credentials.\n',
    )
  }

  // ── Call login API directly (bypasses UI — faster, no OTP needed for Active users) ──
  const res = await request.post('/v1/user/auth/login', {
    data: { email: EMAIL, password: PASSWORD },
    headers: { 'Content-Type': 'application/json' },
  })

  expect(
    res.ok(),
    `Login failed (${res.status()}): ${await res.text()}`,
  ).toBeTruthy()

  const data = await res.json()

  // Build the wallet_session object that auth store expects (see src/stores/auth.ts → _persist)
  const session = {
    user:         data.user,
    profile:      null,
    accessToken:  data.access_token,
    refreshToken: data.refresh_token,
    expiresAt:    Date.now() + data.expires_in * 1_000,
  }

  // Inject localStorage before any Vue code runs, then navigate so the
  // router picks up the session and saves a proper storageState
  await page.addInitScript((s: typeof session) => {
    localStorage.setItem('wallet_session', JSON.stringify(s))
  }, session)

  await page.goto('/dashboard')
  await page.waitForLoadState('networkidle').catch(() => {})

  // Persist the browser context (localStorage + cookies) for subsequent tests
  await page.context().storageState({ path: AUTH_FILE })
})
