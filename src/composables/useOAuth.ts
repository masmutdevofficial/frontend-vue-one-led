/**
 * useOAuth — Google Sign-In composable
 *
 * ──────────────────────────────────────────────────────────────────────────────
 * SETUP INSTRUCTIONS
 * ──────────────────────────────────────────────────────────────────────────────
 *
 * ── GOOGLE ────────────────────────────────────────────────────────────────────
 * 1. Go to https://console.cloud.google.com/
 * 2. Create a project → APIs & Services → OAuth 2.0 Client IDs
 * 3. Application type: "Web application"
 * 4. Authorised JavaScript origins: https://one-led.io
 * 5. Authorised redirect URIs: https://one-led.io/auth/google/callback  ← REQUIRED
 * 6. Copy the Client ID and paste it into GOOGLE_CLIENT_ID below
 * 7. On the backend, install: npm install google-auth-library
 *    Then verify the credential in /auth/oauth/google route using:
 *    const { OAuth2Client } = require('google-auth-library')
 *    const client = new OAuth2Client(GOOGLE_CLIENT_ID)
 *    const ticket = await client.verifyIdToken({ idToken: credential, audience: GOOGLE_CLIENT_ID })
 *    const { email, name, sub } = ticket.getPayload()
 * ──────────────────────────────────────────────────────────────────────────────
 */

import { useRouter } from 'vue-router'
import { authApi, type WalletUser } from '@/services/api'
import { useAuthStore } from '@/stores/auth'
import { useToast }  from '@/composables/useToast'

// ── Replace these with your real credentials ──────────────────────────────────
const GOOGLE_CLIENT_ID   = '214765646212-qg57lp4fpecr0ae6u7fbtvin58lhbfe4.apps.googleusercontent.com'
const GOOGLE_REDIRECT_URI = 'https://one-led.io/auth/google/callback'
// ─────────────────────────────────────────────────────────────────────────────

/** Dynamically load a <script> tag once (idempotent) */
function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) { resolve(); return }
    const s    = document.createElement('script')
    s.src      = src
    s.async    = true
    s.onload   = () => resolve()
    s.onerror  = () => reject(new Error(`Failed to load OAuth script: ${src}`))
    document.head.appendChild(s)
  })
}

export function useOAuth() {
  const router = useRouter()
  const auth   = useAuthStore()
  const toast  = useToast()

  // ── Google ──────────────────────────────────────────────────────────────────
  /**
   * Redirect the browser to Google's OAuth consent screen.
   * After consent, Google redirects to GOOGLE_REDIRECT_URI with the id_token
   * in the URL fragment. The GoogleCallbackScreen then calls handleGoogleCallback().
   */
  function signInWithGoogle() {
    // Generate a random nonce to bind this request
    const nonce = Array.from(crypto.getRandomValues(new Uint8Array(16)))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('')
    sessionStorage.setItem('google_oauth_nonce', nonce)

    const params = new URLSearchParams({
      response_type: 'id_token',
      client_id:     GOOGLE_CLIENT_ID,
      redirect_uri:  GOOGLE_REDIRECT_URI,
      scope:         'openid email profile',
      nonce,
    })
    window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`
  }

  /**
   * Called by GoogleCallbackScreen on mount.
   * Parses the id_token from the URL fragment, verifies it with the backend,
   * and navigates to /dashboard on success.
   * Throws on any error so the callback screen can display a message.
   */
  async function handleGoogleCallback(): Promise<void> {
    const fragment = new URLSearchParams(window.location.hash.replace(/^#/, ''))
    const idToken  = fragment.get('id_token')
    const error    = fragment.get('error')

    if (error) throw new Error(`Google OAuth error: ${error}`)
    if (!idToken) throw new Error('No id_token in callback URL')

    // Clear the token from the URL bar immediately
    window.history.replaceState({}, '', window.location.pathname)

    const data = await authApi.oauthGoogle(idToken)

    // New user — must provide referral code before account is created
    if ('needs_referral' in data && data.needs_referral) {
      auth.pendingEmail       = data.email
      auth.pendingGoogleToken = idToken
      auth.otpContext         = 'google_register'
      await router.push('/otp')
      return
    }

    // New or inactive user — admin must send OTP before they can log in
    if ('pending_otp' in data && data.pending_otp) {
      auth.pendingEmail = data.email
      auth.otpContext   = 'register'
      await router.push('/otp')
      return
    }

    await auth.loginFromOAuth(data as { access_token: string; refresh_token: string; expires_in: number; user: WalletUser })
    await router.push('/dashboard')
  }

  return { signInWithGoogle, handleGoogleCallback }
}
