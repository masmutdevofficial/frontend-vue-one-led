import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import LandingScreen from '../views/LandingScreen.vue'
import NotFoundScreen from '../views/NotFoundScreen.vue'
import LoginScreen from '../views/auth/LoginScreen.vue'
import RegisterScreen from '../views/auth/RegisterScreen.vue'
import ForgotPasswordScreen from '../views/auth/ForgotPasswordScreen.vue'
import OtpScreen from '../views/auth/OtpScreen.vue'
import ProfileScreen from '../views/dashboard/ProfileScreen.vue'
import HomeScreen from '../views/dashboard/HomeScreen.vue'
import AssetsScreen from '../views/dashboard/AssetsScreen.vue'
import MarketScreen from '../views/dashboard/MarketScreen.vue'
import AddFundsScreen from '../views/dashboard/AddFundsScreen.vue'
import CryptoDepositScreen from '../views/dashboard/CryptoDepositScreen.vue'
import P2PTradingScreen from '../views/dashboard/P2PTradingScreen.vue'
import WithdrawScreen from '../views/dashboard/WithdrawScreen.vue'
import WithdrawHistoryScreen from '../views/dashboard/WithdrawHistoryScreen.vue'
import DepositHistoryScreen from '../views/dashboard/DepositHistoryScreen.vue'
import TransferScreen from '../views/dashboard/TransferScreen.vue'
import CopyTradeScreen from '../views/dashboard/CopyTradeScreen.vue'
import EventsScreen from '../views/dashboard/EventsScreen.vue'
import TradeScreen from '../views/dashboard/TradeScreen.vue'
import FuturesScreen from '../views/dashboard/FuturesScreen.vue'
import CopyTraderProfileScreen from '../views/dashboard/CopyTraderProfileScreen.vue'
import SecurityScreen from '../views/dashboard/SecurityScreen.vue'
import LoginHistoryScreen from '../views/dashboard/LoginHistoryScreen.vue'
import ManageDevicesScreen from '../views/dashboard/ManageDevicesScreen.vue'
import TrackingFundsScreen from '../views/dashboard/TrackingFundsScreen.vue'
import HelpCenterScreen from '../views/dashboard/HelpCenterScreen.vue'
import VerificationScreen from '../views/dashboard/VerificationScreen.vue'
import NotificationsScreen from '../views/dashboard/NotificationsScreen.vue'
import NotificationSettingsScreen from '../views/dashboard/NotificationSettingsScreen.vue'
import CampaignsScreen from '../views/dashboard/CampaignsScreen.vue'
import LearnEarnScreen from '../views/dashboard/LearnEarnScreen.vue'
import AmaScreen from '../views/dashboard/AmaScreen.vue'
import RewardsScreen from '../views/dashboard/RewardsScreen.vue'
import CopyTradeHistoryScreen from '../views/dashboard/CopyTradeHistoryScreen.vue'
import NewsScreen from '../views/dashboard/NewsScreen.vue'
import StakingScreen from '../views/dashboard/StakingScreen.vue'
import GoogleCallbackScreen from '../views/auth/GoogleCallbackScreen.vue'

/** Routes accessible only when NOT logged in */
const guestOnly = ['/login', '/register', '/forgot', '/otp']

/** Routes that require authentication */
const authRequired = [
  '/dashboard', '/profile', '/assets', '/market', '/add-funds', '/crypto-deposit',
  '/p2p-trading', '/withdraw', '/withdraw-history', '/deposit-history', '/transfer',
  '/copy-trade', '/copy-trade-history', '/events', '/trade', '/futures', '/security',
  '/tracking-funds', '/help-center', '/verification', '/notifications',
  '/notification-settings', '/campaigns', '/learn-earn', '/ama', '/rewards', '/news', '/staking',
]

const routes = [
  { path: '/',                                     component: LandingScreen },
  { path: '/login',                                component: LoginScreen },
  { path: '/register',                             component: RegisterScreen },
  { path: '/forgot',                               component: ForgotPasswordScreen },
  { path: '/otp',                                  component: OtpScreen },
  { path: '/auth/google/callback',                 component: GoogleCallbackScreen },
  { path: '/profile',           meta: { requiresAuth: true }, component: ProfileScreen },
  { path: '/dashboard',         meta: { requiresAuth: true }, component: HomeScreen },
  { path: '/assets',            meta: { requiresAuth: true }, component: AssetsScreen },
  { path: '/market',            meta: { requiresAuth: true }, component: MarketScreen },
  { path: '/add-funds',         meta: { requiresAuth: true }, component: AddFundsScreen },
  { path: '/crypto-deposit',    meta: { requiresAuth: true }, component: CryptoDepositScreen },
  { path: '/p2p-trading',       meta: { requiresAuth: true }, component: P2PTradingScreen },
  { path: '/withdraw',          meta: { requiresAuth: true }, component: WithdrawScreen },
  { path: '/withdraw-history',  meta: { requiresAuth: true }, component: WithdrawHistoryScreen },
  { path: '/deposit-history',   meta: { requiresAuth: true }, component: DepositHistoryScreen },
  { path: '/transfer',          meta: { requiresAuth: true }, component: TransferScreen },
  { path: '/copy-trade',        meta: { requiresAuth: true }, component: CopyTradeScreen },
  { path: '/events',            meta: { requiresAuth: true }, component: EventsScreen },
  { path: '/trade',             redirect: '/trade/btc' },
  { path: '/trade/:symbol',     meta: { requiresAuth: true }, component: TradeScreen },
  { path: '/futures',           meta: { requiresAuth: true }, component: FuturesScreen },
  { path: '/copy-trader/:username', meta: { requiresAuth: true }, component: CopyTraderProfileScreen },
  { path: '/security',          meta: { requiresAuth: true }, component: SecurityScreen },
  { path: '/login-history',     meta: { requiresAuth: true }, component: LoginHistoryScreen },
  { path: '/manage-devices',    meta: { requiresAuth: true }, component: ManageDevicesScreen },
  { path: '/tracking-funds',    meta: { requiresAuth: true }, component: TrackingFundsScreen },
  { path: '/help-center',       meta: { requiresAuth: true }, component: HelpCenterScreen },
  { path: '/verification',      meta: { requiresAuth: true }, component: VerificationScreen },
  { path: '/notifications',     meta: { requiresAuth: true }, component: NotificationsScreen },
  { path: '/notification-settings', meta: { requiresAuth: true }, component: NotificationSettingsScreen },
  { path: '/campaigns',         meta: { requiresAuth: true }, component: CampaignsScreen },
  { path: '/learn-earn',        meta: { requiresAuth: true }, component: LearnEarnScreen },
  { path: '/ama',               meta: { requiresAuth: true }, component: AmaScreen },
  { path: '/rewards',           meta: { requiresAuth: true }, component: RewardsScreen },
  { path: '/copy-trade-history', meta: { requiresAuth: true }, component: CopyTradeHistoryScreen },
  { path: '/news',              meta: { requiresAuth: true }, component: NewsScreen },
  { path: '/staking',           meta: { requiresAuth: true }, component: StakingScreen },
  { path: '/:pathMatch(.*)*',   name: 'not-found',            component: NotFoundScreen },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach(async (to) => {
  const auth = useAuthStore()

  // OTP screen requires a pending email (prevent direct access)
  if (to.path === '/otp' && !auth.pendingEmail) {
    return { path: '/login' }
  }

  // Guest-only routes: redirect authenticated users to dashboard
  if (guestOnly.includes(to.path) && auth.isAuthenticated && !auth.isTokenExpired) {
    return { path: '/dashboard' }
  }

  // Protected routes
  if (to.meta.requiresAuth) {
    if (!auth.isAuthenticated) {
      return { path: '/login', query: { redirect: to.fullPath } }
    }

    // Auto-refresh expired token
    if (auth.isTokenExpired) {
      const ok = await auth.refreshSession()
      if (!ok) return { path: '/login', query: { redirect: to.fullPath } }
    }
  }

  return true
})

export default router

