import { defineConfig, devices } from '@playwright/test'
import fs from 'fs'
import path from 'path'

// ---------------------------------------------------------------------------
// Load .env.test if it exists (no dotenv dependency needed)
// ---------------------------------------------------------------------------
try {
  const envFile = path.resolve(process.cwd(), '.env.test')
  if (fs.existsSync(envFile)) {
    fs.readFileSync(envFile, 'utf8')
      .split('\n')
      .filter(line => line.trim() && !line.startsWith('#'))
      .forEach(line => {
        const eqIdx = line.indexOf('=')
        if (eqIdx === -1) return
        const k = line.slice(0, eqIdx).trim()
        const v = line.slice(eqIdx + 1).trim().replace(/^["']|["']$/g, '')
        if (k && process.env[k] === undefined) process.env[k] = v
      })
  }
} catch { /* ignore */ }

const AUTH_FILE = 'e2e/.auth/user.json'

export default defineConfig({
  testDir: './e2e',
  fullyParallel: false,
  retries: 0,
  workers: 1,
  reporter: [
    ['list'],
    ['html', { open: 'never', outputFolder: 'e2e-report' }],
  ],
  use: {
    baseURL: process.env.E2E_BASE_URL ?? 'http://localhost:5173',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    actionTimeout:     12_000,
    navigationTimeout: 25_000,
  },
  projects: [
    // ── Auth setup (must run before 'authenticated') ──────────────────────
    {
      name: 'setup',
      testMatch: '**/auth.setup.ts',
      use: { ...devices['Desktop Chrome'] },
    },

    // ── Public pages (no login required) ─────────────────────────────────
    {
      name: 'public',
      testMatch: '**/public.spec.ts',
      use: { ...devices['Desktop Chrome'] },
    },

    // ── Authenticated dashboard pages ─────────────────────────────────────
    {
      name: 'authenticated',
      testMatch: '**/dashboard.spec.ts',
      dependencies: ['setup'],
      use: {
        ...devices['Desktop Chrome'],
        storageState: AUTH_FILE,
      },
    },
  ],

  // Auto-start Vite dev server if not already running
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: true,
    timeout: 30_000,
    stdout: 'ignore',
    stderr: 'pipe',
  },
})
