/**
 * useOAuth — Google Sign-In & Apple Sign-In composable
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
 * 5. No redirect URIs needed (we use the popup / callback approach)
 * 6. Copy the Client ID and paste it into GOOGLE_CLIENT_ID below
 * 7. On the backend, install: npm install google-auth-library
 *    Then verify the credential in /auth/oauth/google route using:
 *    const { OAuth2Client } = require('google-auth-library')
 *    const client = new OAuth2Client(GOOGLE_CLIENT_ID)
 *    const ticket = await client.verifyIdToken({ idToken: credential, audience: GOOGLE_CLIENT_ID })
 *    const { email, name, sub } = ticket.getPayload()
 *
 * ── APPLE ─────────────────────────────────────────────────────────────────────
 * 1. Go to https://developer.apple.com/ → Certificates, IDs & Profiles
 * 2. Register a "Services ID" (e.g. io.one-led.services.auth)
 *    → Enable "Sign in with Apple"
 *    → Add domain: one-led.io  and redirect URL: https://one-led.io
 * 3. Create a "Key" with "Sign in with Apple" capability → download the .p8 file
 * 4. Note your Team ID, Key ID, and Service ID
 * 5. Paste the Service ID into APPLE_CLIENT_ID below
 * 6. On the backend, install: npm install apple-signin-auth
 *    Then verify in /auth/oauth/apple route using:
 *    const appleSignin = require('apple-signin-auth')
 *    const payload = await appleSignin.verifyIdToken(id_token, { audience: APPLE_CLIENT_ID, ignoreExpiration: false })
 * ──────────────────────────────────────────────────────────────────────────────
 */

import { useRouter } from 'vue-router'
import { authApi }   from '@/services/api'
import { useAuthStore } from '@/stores/auth'
import { useToast }  from '@/composables/useToast'

// ── Replace these with your real credentials ──────────────────────────────────
const GOOGLE_CLIENT_ID = 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com'
const APPLE_CLIENT_ID  = 'io.one-led.services.auth'   // your Apple Services ID
const APPLE_REDIRECT   = 'https://one-led.io'
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

declare const google: {
  accounts: {
    id: {
      initialize:    (cfg: object) => void
      prompt:        (cb?: (n: { isNotDisplayed(): boolean; isSkippedMoment(): boolean }) => void) => void
      cancel:        () => void
    }
  }
}

declare const AppleID: {
  auth: {
    init:   (cfg: object) => void
    signIn: () => Promise<{
      authorization: { id_token: string; code: string }
      user?: { name?: { firstName?: string; lastName?: string }; email?: string }
    }>
  }
}

export function useOAuth() {
  const router = useRouter()
  const auth   = useAuthStore()
  const toast  = useToast()

  // ── Google ──────────────────────────────────────────────────────────────────
  async function signInWithGoogle() {
    try {
      await loadScript('https://accounts.google.com/gsi/client')

      const credential = await new Promise<string>((resolve, reject) => {
        google.accounts.id.initialize({
          client_id:            GOOGLE_CLIENT_ID,
          callback:             (res: { credential: string }) => resolve(res.credential),
          auto_select:          false,
          cancel_on_tap_outside: true,
        })
        google.accounts.id.prompt((notification) => {
          if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
            reject(new Error('dismissed'))
          }
        })
      })

      const data = await authApi.oauthGoogle(credential)
      await auth.loginFromOAuth(data)
      router.push('/dashboard')
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : ''
      if (msg !== 'dismissed') {
        toast.error('Google sign-in failed. Please try again.')
      }
    }
  }

  // ── Apple ───────────────────────────────────────────────────────────────────
  async function signInWithApple() {
    try {
      await loadScript(
        'https://appleid.cdn-apple.com/appleauth/static/jsapi/appleid/1/en_US/appleid.auth.js',
      )

      AppleID.auth.init({
        clientId:    APPLE_CLIENT_ID,
        scope:       'name email',
        redirectURI: APPLE_REDIRECT,
        state:       crypto.randomUUID(),
        usePopup:    true,
      })

      const result = await AppleID.auth.signIn()
      const data   = await authApi.oauthApple(
        result.authorization.id_token,
        result.authorization.code,
      )
      await auth.loginFromOAuth(data)
      router.push('/dashboard')
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message.toLowerCase() : ''
      // User closed the popup — not an error
      if (!msg.includes('cancel') && !msg.includes('popup') && !msg.includes('user_cancelled')) {
        toast.error('Apple sign-in failed. Please try again.')
      }
    }
  }

  return { signInWithGoogle, signInWithApple }
}
