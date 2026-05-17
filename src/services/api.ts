const BASE = 'https://api.one-led.io/v1/user'

export class ApiError extends Error {
  status: number
  code: string | undefined

  constructor(status: number, message: string, code?: string) {
    super(message)
    this.status = status
    this.code   = code
    this.name   = 'ApiError'
  }
}

/** Called whenever an authenticated request receives a 401. Wire up in main.ts. */
let _onUnauthorized: (() => void) | null = null
export function setUnauthorizedHandler(fn: () => void): void {
  _onUnauthorized = fn
}

async function request<T>(method: string, path: string, body?: unknown, authToken?: string | null): Promise<T> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  if (authToken) headers['Authorization'] = `Bearer ${authToken}`

  const res = await fetch(BASE + path, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  })

  if (res.status === 204) return undefined as T

  const data = await res.json().catch(() => ({}))

  if (!res.ok) {
    // If an authenticated request gets 401 (token invalid or account deactivated) → auto-logout
    if (res.status === 401 && authToken) {
      _onUnauthorized?.()
    }
    throw new ApiError(
      res.status,
      data?.error?.message ?? 'Request failed.',
      data?.error?.code,
    )
  }

  return data as T
}

/** Auth endpoints — no token needed */
export const authApi = {
  register:       (body: Record<string, string>) =>
    request<{ message: string; _dev_otp?: string }>('POST', '/auth/register', body),

  login:          (email: string, password: string) =>
    request<
      { access_token: string; refresh_token: string; expires_in: number; user: WalletUser } |
      { requires_2fa: true; email: string; _2fa_token: string }
    >('POST', '/auth/login', { email, password }),

  verifyOtp:      (email: string, code: string) =>
    request<{ access_token: string; refresh_token: string; expires_in: number; user: WalletUser }>('POST', '/auth/otp/verify', { email, code }),

  resendOtp:      (email: string) =>
    request<{ message: string; _dev_otp?: string }>('POST', '/auth/otp/resend', { email }),

  forgotPassword: (email: string) =>
    request<{ message: string; _dev_otp?: string }>('POST', '/auth/forgot-password', { email }),

  resetPassword:  (email: string, code: string, password: string) =>
    request<{ message: string }>('POST', '/auth/reset-password', { email, code, password }),

  refresh:        (refreshToken: string) =>
    request<{ access_token: string; expires_in: number }>('POST', '/auth/refresh', undefined, refreshToken),

  logout:         (token: string) =>
    request<void>('POST', '/auth/logout', undefined, token),

  /** OAuth — Google: send the credential (id_token) from Google GIS callback */
  oauthGoogle: (credential: string) =>
    request<
      { access_token: string; refresh_token: string; expires_in: number; user: WalletUser } |
      { pending_otp: true; email: string } |
      { needs_referral: true; email: string }
    >('POST', '/auth/oauth/google', { credential }),

  /** OAuth — Google (step 2): submit referral code + re-validated token to create account */
  completeGoogleOAuth: (credential: string, referral: string) =>
    request<{ pending_otp: true; email: string }>('POST', '/auth/oauth/google/complete', { credential, referral }),

  /** OAuth — Apple: send id_token + authorization code from Apple Sign-in */
  oauthApple: (id_token: string, code: string) =>
    request<{ access_token: string; refresh_token: string; expires_in: number; user: WalletUser }>('POST', '/auth/oauth/apple', { id_token, code }),

  /** WebAuthn — step 1: get authentication options (challenge) for an email */
  webauthnOptions: (email: string) =>
    request<Record<string, unknown> & { _token: string }>('POST', '/auth/webauthn/options', { email }),

  /** WebAuthn — step 2: verify authenticator assertion and receive JWT */
  webauthnVerify: (body: Record<string, unknown>) =>
    request<{ access_token: string; refresh_token: string; expires_in: number; user: WalletUser }>('POST', '/auth/webauthn/verify', body),

  /** 2FA — verify TOTP code after password login and receive full JWT */
  verify2fa: (_2fa_token: string, code: string) =>
    request<{ access_token: string; refresh_token: string; expires_in: number; user: WalletUser }>('POST', '/auth/2fa/verify', { _2fa_token, code }),
}

/** Authenticated API call factory — pass access token */
export function makeApi(token: string) {
  return {
    get:    <T>(path: string)              => request<T>('GET',    path, undefined, token),
    post:   <T>(path: string, body: unknown) => request<T>('POST',   path, body,      token),
    put:    <T>(path: string, body: unknown) => request<T>('PUT',    path, body,      token),
    delete: <T>(path: string)              => request<T>('DELETE', path, undefined, token),
  }
}

export interface WalletUser {
  id:       string
  username: string
  email:    string
  balance?: string
  profile?: string | null   // URL to profile picture (Google photo or uploaded)
}

export interface UserProfile {
  id:            string
  username:      string
  email:         string
  balance:       string
  commission:    string
  profile:       string | null
  twofa_enabled: boolean
  ktp_status:    string | null
  ktp_image:     string | null
  selfie_url:    string | null
  credit_score:  number
  member_since:  string    // ISO datetime
  bank:          string | null
  bank_account:  string | null
  country:       string | null
}

export interface UserBalance {
  total:    string
  balances: { coin: string; amount: string }[]
}

/** Authenticated user profile + balance API */
export function makeUserApi(token: string) {
  const api = makeApi(token)
  return {
    getProfile:    () => api.get<UserProfile>('/me'),
    updateProfile: (body: {
      username?: string
      email?: string
      bank?: string
      bank_account?: string
      country?: string
    }) => api.put<{ ok: boolean }>('/me', body),
    uploadAvatar: (file: File) => {
      const form = new FormData()
      form.append('avatar', file)
      return fetch(BASE + '/avatar', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: form,
      }).then(async res => {
        const data = await res.json().catch(() => ({}))
        if (!res.ok) throw new ApiError(res.status, data?.error?.message ?? 'Upload failed.', data?.error?.code)
        return data as { ok: boolean; profile: string }
      })
    },
    getBalance:    () => api.get<UserBalance>('/balance'),
  }
}

// ── Trade API types ───────────────────────────────────────────────────────────

export interface SpotOrder {
  id:         string
  symbol:     string
  side:       'Buy' | 'Sell'
  type:       'Market' | 'Limit' | 'Stop-Limit'
  amount:     string
  price:      string | null
  filled:     string
  total:      string | null
  status:     'open' | 'filled' | 'partially_filled' | 'cancelled'
  created_at: string
}

export interface FuturesPosition {
  id:                string
  symbol:            string
  side:              'Long' | 'Short'
  size:              string
  entry_price:       string
  mark_price:        string | null
  margin:            string
  leverage:          number
  liquidation_price: string | null
  margin_mode:       'Cross' | 'Isolated'
  take_profit:       string | null
  stop_loss:         string | null
  status:            'open' | 'closed'
  created_at:        string
}

/** Authenticated trade endpoints */
export function makeTradeApi(token: string) {
  const api = makeApi(token)
  return {
    getOrders:    (status: 'open' | 'history' = 'open', symbol?: string) => {
      const q = new URLSearchParams({ status })
      if (symbol) q.set('symbol', symbol)
      return api.get<{ orders: SpotOrder[] }>(`/trade/orders?${q}`)
    },
    placeOrder:   (body: { symbol: string; side: 'Buy' | 'Sell'; type: string; amount: number; price?: number; stop_price?: number }) =>
      api.post<{ order: SpotOrder }>('/trade/orders', body),
    cancelOrder:  (id: string) =>
      request<{ success: boolean }>('PATCH', `/trade/orders/${encodeURIComponent(id)}/cancel`, undefined, token),
    cancelAll:    () => api.post<{ cancelled: number }>('/trade/orders/cancel-all', {}),
    getPositions: () => api.get<{ positions: FuturesPosition[] }>('/trade/positions'),
    getBalances:  () => api.get<{ balances: { coin: string; amount: string }[] }>('/trade/balances'),
  }
}

// ── Wallet API types ──────────────────────────────────────────────────────────

export interface DepositRecord {
  id:             string
  amount:         string     // USDT amount
  bank:           string | null  // coin/bank info stored by admin
  method:         'Manual' | 'Automatic'
  status_deposit: 'Approved' | 'Rejected' | 'Pending'
  created_at:     string
}

export interface WithdrawalRecord {
  id:                 string
  amount:             string
  network:            string | null  // stored as "COIN|NETWORK" e.g. "USDT|TRC20"
  address:            string | null
  method:             'Manual' | 'Automatic'
  status_withdrawal:  'Completed' | 'Rejected' | 'Pending'
  created_at:         string
}

export interface TransferRecord {
  id:             string
  type:           'internal' | 'user-to-user'
  coin:           string
  amount:         string
  note:           string | null
  created_at:     string
  sender_name:    string | null
  recipient_name: string | null
  sender_id:      string
  recipient_id:   string | null
  direction:      'sent' | 'received'
}

/** Authenticated wallet endpoints (deposits, withdrawals, transfers) */
export function makeWalletApi(token: string) {
  const api = makeApi(token)
  return {
    getDeposits:    (status?: string) => {
      const q = status && status !== 'all' ? `?status=${encodeURIComponent(status)}` : ''
      return api.get<{ deposits: DepositRecord[]; total_approved: number }>(`/wallet/deposits${q}`)
    },
    getWithdrawals: (status?: string) => {
      const q = status && status !== 'all' ? `?status=${encodeURIComponent(status)}` : ''
      return api.get<{ withdrawals: WithdrawalRecord[]; total_completed: number }>(`/wallet/withdrawals${q}`)
    },
    submitWithdrawal: (body: { amount: number; address: string; network: string; coin: string }) =>
      api.post<{ withdrawal: WithdrawalRecord }>('/wallet/withdrawals', body),
    getTransfers:   () =>
      api.get<{ transfers: TransferRecord[] }>('/wallet/transfers'),
    sendTransfer:   (body: { recipient: string; amount: number; coin?: string; note?: string }) =>
      api.post<{ transfer: { id: string; amount: number; coin: string; recipient_name: string } }>('/wallet/transfers', body),
    getCoinBalances: () =>
      api.get<{ balances: { coin: string; amount: string }[] }>('/trade/balances'),
  }
}

/** Public P2P endpoints — no auth needed */
export const p2pApi = {
  getMerchants: (type?: string, asset?: string) => {
    const params = new URLSearchParams()
    if (type)  params.set('type', type)
    if (asset) params.set('asset', asset)
    const query = params.toString()
    return request<{ merchants: any[] }>('GET', `/p2p/merchants${query ? '?' + query : ''}`)
  },
}

// ── Content API types ─────────────────────────────────────────────────────────

export interface StakingProduct {
  id: number
  coin: string
  type: 'flexible' | 'locked'
  apr: number
  min_amount: string
  max_amount: string | null
  duration_days: number | null
  early_withdrawal_fee_pct: number
}

export interface ApiEvent {
  id: number
  title: string
  type: string
  description: string | null
  prize_pool: string | null
  start_date: string
  end_date: string
  banner_url: string | null
  max_participants: number | null
  participants: number
  status: string
}

export interface ApiCampaign {
  id: number
  title: string
  type: string
  description: string | null
  reward: string | null
  start_date: string
  end_date: string
  banner_url: string | null
  min_requirement: string | null
  participants: number
  status: string
}

export interface AmaSession {
  id: number
  title: string
  host: string
  description: string | null
  scheduled_at: string | null
  is_live: number
  started_at: string | null
}

export interface NewsArticle {
  id: number
  title: string
  summary: string | null
  source: string | null
  source_url: string | null
  thumbnail_url: string | null
  published_at: string | null
  category_name: string | null
}

export interface NewsCategory {
  id: number
  name: string
}

export interface LearnCourse {
  id: number
  title: string
  sponsor: string | null
  reward_usdt: string
  duration_min: number
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  thumbnail_url: string | null
}

export interface CopyTrader {
  id: number
  name: string
  username: string
  tag: string | null
  avatar: string | null
  roi: number
  aum: string
  win_rate: number
  copiers: number
  min_copy: number
  risk: string
  verified: number
}

/** Authenticated user content API — call makeContentApi(token) */
export function makeContentApi(token: string) {
  const api = makeApi(token)
  return {
    getStakingProducts: (type?: string) => {
      const q = type && type !== 'all' ? `?type=${type}` : ''
      return api.get<{ products: StakingProduct[] }>(`/staking/products${q}`)
    },
    getEvents: (limit = 20) =>
      api.get<{ events: ApiEvent[] }>(`/events?limit=${limit}`),
    getCampaigns: (limit = 20) =>
      api.get<{ campaigns: ApiCampaign[] }>(`/campaigns?limit=${limit}`),
    getAmaSessions: (limit = 20) =>
      api.get<{ sessions: AmaSession[] }>(`/ama/sessions?limit=${limit}`),
    getNews: (limit = 30, categoryId?: number) => {
      const q = categoryId ? `?limit=${limit}&category_id=${categoryId}` : `?limit=${limit}`
      return api.get<{ articles: NewsArticle[] }>(`/news${q}`)
    },
    getNewsCategories: () =>
      api.get<{ categories: NewsCategory[] }>('/news/categories'),
    getLearnCourses: (limit = 30) =>
      api.get<{ courses: LearnCourse[] }>(`/learn-earn/courses?limit=${limit}`),
    getCopyTraders: (limit = 50) =>
      api.get<{ traders: CopyTrader[] }>(`/copy-trade/traders?limit=${limit}`),
    getDepositQrCodes: () =>
      api.get<{ qr_codes: Array<{ coin: string; network: string | null; wallet_address: string; qr_image_url: string | null }> }>('/deposit/qr-codes'),
  }
}

// ── Notification types ────────────────────────────────────────────────────────

export interface UserNotification {
  id: number
  type: string
  title: string
  message: string
  is_read: 0 | 1
  created_at: string
}

export interface NotificationsResponse {
  notifications: UserNotification[]
  total: number
  unread: number
}

/** Authenticated notifications API */
export function makeNotificationsApi(token: string) {
  const api = makeApi(token)
  return {
    list: (limit = 50, offset = 0) =>
      api.get<NotificationsResponse>(`/notifications?limit=${limit}&offset=${offset}`),
    unreadCount: () =>
      api.get<{ unread: number }>('/notifications/unread-count'),
    markRead: (id: number) =>
      api.put<{ ok: boolean }>(`/notifications/${id}/read`, {}),
    markAllRead: () =>
      api.put<{ ok: boolean }>('/notifications/read-all', {}),
  }
}

