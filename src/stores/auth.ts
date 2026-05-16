import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authApi, ApiError, makeUserApi, type WalletUser, type UserProfile } from '../services/api'

// Module-level poll handle (persists across reactive updates)
let _pollInterval: ReturnType<typeof setInterval> | null = null

const STORAGE_KEY = 'wallet_session'

export type OtpContext = 'register' | 'login' | 'forgot' | 'google_register'

export const useAuthStore = defineStore('auth', () => {
  const user         = ref<WalletUser | null>(null)
  const profile      = ref<UserProfile | null>(null)
  const accessToken  = ref<string | null>(null)
  const refreshToken = ref<string | null>(null)
  const expiresAt    = ref<number | null>(null)

  // Pending OTP state (passed between screens)
  const pendingEmail       = ref<string>('')
  const otpContext         = ref<OtpContext>('login')
  const pendingGoogleToken = ref<string>('')

  // ── Getters ──

  const isAuthenticated = computed(() => !!accessToken.value && !!user.value)
  const isTokenExpired  = computed(
    () => expiresAt.value != null ? Date.now() >= expiresAt.value : true,
  )

  // ── Persistence ──

  function _persist() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      user:         user.value,
      profile:      profile.value,
      accessToken:  accessToken.value,
      refreshToken: refreshToken.value,
      expiresAt:    expiresAt.value,
    }))
  }

  function _load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (!raw) return
      const s = JSON.parse(raw)
      user.value         = s.user         ?? null
      profile.value      = s.profile      ?? null
      accessToken.value  = s.accessToken  ?? null
      refreshToken.value = s.refreshToken ?? null
      expiresAt.value    = s.expiresAt    ?? null
    } catch { /* ignore malformed data */ }
  }

  function _applySession(data: {
    access_token: string
    refresh_token: string
    expires_in:   number
    user:         WalletUser
  }) {
    accessToken.value  = data.access_token
    refreshToken.value = data.refresh_token
    expiresAt.value    = Date.now() + data.expires_in * 1000
    user.value         = data.user
    _persist()
  }

  // ── Auth actions ──

  async function register(email: string, password: string, referral: string, username?: string) {
    const body: Record<string, string> = { email, password, referral }
    if (username) body.username = username
    return authApi.register(body)
  }

  async function login(email: string, password: string) {
    const data = await authApi.login(email, password)
    _applySession(data)
    pendingEmail.value = ''
    startStatusPolling()
    return data
  }

  async function verifyOtp(email: string, code: string) {
    const data = await authApi.verifyOtp(email, code)
    _applySession(data)
    pendingEmail.value = ''
    startStatusPolling()
    return data
  }

  async function resendOtp(email: string) {
    return authApi.resendOtp(email)
  }

  async function forgotPassword(email: string) {
    return authApi.forgotPassword(email)
  }

  async function resetPassword(email: string, code: string, password: string) {
    return authApi.resetPassword(email, code, password)
  }

  /** Step 2 of Google new-user flow: submit referral code to create account */
  async function completeGoogleRegister(referral: string) {
    return authApi.completeGoogleOAuth(pendingGoogleToken.value, referral)
  }

  /** Called after a successful Google or Apple OAuth response to set the session */
  async function loginFromOAuth(data: {
    access_token:  string
    refresh_token: string
    expires_in:    number
    user:          WalletUser
  }) {
    _applySession(data)
    startStatusPolling()
  }

  async function refreshSession(): Promise<boolean> {
    if (!refreshToken.value) return false
    try {
      const data = await authApi.refresh(refreshToken.value)
      accessToken.value = data.access_token
      expiresAt.value   = Date.now() + data.expires_in * 1000
      _persist()
      return true
    } catch {
      return false
    }
  }

  async function logout() {
    stopStatusPolling()
    if (accessToken.value) {
      await authApi.logout(accessToken.value).catch(() => { /* best-effort */ })
    }
    user.value         = null
    profile.value      = null
    accessToken.value  = null
    refreshToken.value = null
    expiresAt.value    = null
    pendingEmail.value       = ''
    pendingGoogleToken.value = ''
    localStorage.removeItem(STORAGE_KEY)
  }

  /**
   * Poll the backend every `ms` ms to verify the account is still active.
   * A 401 response means admin deactivated the account — triggers auto-logout
   * via the global setUnauthorizedHandler registered in main.ts.
   */
  function startStatusPolling(ms = 60_000) {
    stopStatusPolling()
    _pollInterval = setInterval(async () => {
      if (!accessToken.value) return stopStatusPolling()
      try {
        await makeUserApi(accessToken.value).getProfile()
      } catch {
        // ApiError 401 is handled globally by setUnauthorizedHandler in api.ts
        // No additional action needed here
      }
    }, ms)
  }

  function stopStatusPolling() {
    if (_pollInterval !== null) {
      clearInterval(_pollInterval)
      _pollInterval = null
    }
  }

  /** Fetch full profile from /me and cache in store */
  async function refreshProfile(): Promise<void> {
    if (!accessToken.value) return
    try {
      const p = await makeUserApi(accessToken.value).getProfile()
      profile.value = p
      // Sync basic user fields
      if (user.value) {
        user.value = { ...user.value, username: p.username, email: p.email, balance: p.balance }
      }
      _persist()
    } catch { /* best-effort */ }
  }

  // Load persisted session on store init
  _load()

  return {
    user,
    profile,
    accessToken,
    isAuthenticated,
    isTokenExpired,
    pendingEmail,
    otpContext,
    pendingGoogleToken,
    completeGoogleRegister,
    register,
    login,
    loginFromOAuth,
    verifyOtp,
    resendOtp,
    forgotPassword,
    resetPassword,
    refreshSession,
    refreshProfile,
    logout,
    startStatusPolling,
    stopStatusPolling,
  }
})

export { ApiError }
