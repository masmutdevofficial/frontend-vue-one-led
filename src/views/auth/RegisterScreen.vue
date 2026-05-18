<template>
  <!-- Terms & Conditions Modal -->
  <Teleport to="body">
    <Transition name="sheet">
      <div v-if="showTerms" class="fixed inset-0 z-50 flex flex-col">
        <div class="absolute inset-0 bg-black/40 backdrop-blur-sm" @click="showTerms = false"></div>
        <div class="relative mt-auto max-h-[90vh] w-full overflow-y-auto rounded-t-3xl bg-white px-6 pt-5 pb-10 shadow-2xl lg:mx-auto lg:mb-auto lg:mt-auto lg:max-w-lg lg:rounded-3xl">
          <div class="mb-5 flex items-center justify-between">
            <h3 class="text-lg font-black text-slate-950">Terms of Use</h3>
            <button type="button" class="grid size-9 place-items-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 transition" @click="showTerms = false">
              <Icon icon="mdi:close" class="size-5" />
            </button>
          </div>

          <div class="space-y-4 text-sm leading-6 text-slate-600">
            <p>These Terms of Use ("Terms") govern your access to and use of OneLedger Exchange ("OneLedger", "we", "our", or "us"), including our website, applications, and digital asset trading services (collectively, the "Platform").</p>
            <p>By accessing or using the Platform, you confirm that you have read, understood, and agreed to be legally bound by these Terms. If you do not agree, you must not use the Platform.</p>

            <div>
              <h4 class="mb-1 font-black text-slate-950">1. Eligibility</h4>
              <p>To use OneLedger Exchange, you must: be at least 18 years old (or the legal age in your jurisdiction), have full legal capacity to enter into a binding agreement, and not be prohibited from using digital asset services under applicable laws. By using the Platform, you represent and warrant that you meet all eligibility requirements.</p>
            </div>

            <div>
              <h4 class="mb-1 font-black text-slate-950">2. Account Registration</h4>
              <p>To access certain features, you must create an account. You agree to provide accurate, complete, and up-to-date information, maintain the confidentiality of your login credentials, and be fully responsible for all activities conducted under your account. OneLedger reserves the right to suspend or terminate accounts that provide false or misleading information.</p>
            </div>

            <div>
              <h4 class="mb-1 font-black text-slate-950">3. KYC & AML Compliance</h4>
              <p>OneLedger complies with applicable Know Your Customer (KYC) and Anti-Money Laundering (AML) regulations. You agree to complete identity verification when requested and provide valid and lawful documentation. Failure to comply may result in account restriction, suspension, or termination.</p>
            </div>

            <div>
              <h4 class="mb-1 font-black text-slate-950">4. Platform Services</h4>
              <p>OneLedger provides a digital asset trading platform that may include spot trading and related services, digital asset deposits and withdrawals, and account management and market data. All services are provided on an "as-is" and "as-available" basis.</p>
            </div>

            <div>
              <h4 class="mb-1 font-black text-slate-950">5. Trading Risks</h4>
              <p>You acknowledge that digital asset prices are highly volatile, trading cryptocurrencies involves substantial risk of loss, and past performance does not guarantee future results. You are solely responsible for your trading decisions and any resulting losses.</p>
            </div>

            <div>
              <h4 class="mb-1 font-black text-slate-950">6. Fees</h4>
              <p>You agree to pay all applicable fees, commissions, or charges associated with the use of the Platform. Fee structures may be updated at any time and will be disclosed on the Platform.</p>
            </div>

            <div>
              <h4 class="mb-1 font-black text-slate-950">7. Prohibited Activities</h4>
              <p>You agree not to use the Platform for illegal, fraudulent, or unauthorized purposes; engage in market manipulation, wash trading, or abusive trading practices; attempt to gain unauthorized access; upload malware or harmful code; or circumvent security or compliance mechanisms. Violation may result in immediate account termination and legal action.</p>
            </div>

            <div>
              <h4 class="mb-1 font-black text-slate-950">8. Account Suspension & Termination</h4>
              <p>OneLedger reserves the right to suspend, restrict, or terminate your account at any time if you violate these Terms, breach applicable laws, or if suspicious or fraudulent activity is detected. OneLedger shall not be liable for any losses resulting from such actions.</p>
            </div>

            <div>
              <h4 class="mb-1 font-black text-slate-950">9. Withdrawals & Deposits</h4>
              <p>Withdrawals are subject to security checks and compliance reviews. Processing times may vary. OneLedger is not responsible for blockchain delays or third-party failures. You are responsible for ensuring the accuracy of wallet addresses.</p>
            </div>

            <div>
              <h4 class="mb-1 font-black text-slate-950">10. Intellectual Property</h4>
              <p>All content, trademarks, logos, software, and materials on the Platform are the exclusive property of OneLedger or its licensors. Unauthorized use is strictly prohibited.</p>
            </div>

            <div>
              <h4 class="mb-1 font-black text-slate-950">11. Limitation of Liability</h4>
              <p>To the maximum extent permitted by law, OneLedger shall not be liable for any indirect, incidental, or consequential damages, loss of profits, data, or digital assets, or errors, interruptions, or security breaches beyond reasonable control. Your sole remedy is to discontinue use of the Platform.</p>
            </div>

            <div>
              <h4 class="mb-1 font-black text-slate-950">12. Indemnification</h4>
              <p>You agree to indemnify and hold harmless OneLedger, its affiliates, officers, and employees from any claims, damages, losses, or expenses arising from your use of the Platform, your violation of these Terms, or your breach of any applicable law or regulation.</p>
            </div>

            <div>
              <h4 class="mb-1 font-black text-slate-950">13. Governing Law</h4>
              <p>These Terms shall be governed by and construed in accordance with the laws of the applicable jurisdiction determined by OneLedger, without regard to conflict of law principles.</p>
            </div>

            <div>
              <h4 class="mb-1 font-black text-slate-950">14. Amendments</h4>
              <p>OneLedger may update these Terms at any time. Changes become effective upon publication on the Platform. Continued use constitutes acceptance of the updated Terms.</p>
            </div>

            <div>
              <h4 class="mb-1 font-black text-slate-950">15. Contact Information</h4>
              <p>For questions regarding these Terms, please contact OneLedger through official support channels available on the Platform.</p>
            </div>

            <p class="rounded-xl bg-slate-50 px-4 py-3 text-xs font-semibold text-slate-500">OneLedger Exchange — Use at your own risk. Digital assets are speculative and involve high risk.</p>

            <button
              type="button"
              class="mt-4 flex w-full items-center justify-center rounded-xl bg-teal-500 px-5 py-3.5 text-sm font-bold tracking-widest text-white shadow-lg shadow-teal-400/20 transition hover:-translate-y-0.5 hover:shadow-xl active:scale-95"
              @click="agreed = true; showTerms = false"
            >
              I UNDERSTAND
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>

  <section class="min-h-screen bg-slate-50">
    <div class="mx-auto flex min-h-screen max-w-7xl items-center justify-center px-4 py-8">
    <div class="w-full max-w-sm rounded-3xl bg-white px-6 py-8 lg:shadow-xl lg:shadow-slate-200/60">
      <div class="inline-flex items-center gap-3 rounded-full border border-slate-100 bg-white/95 px-4 py-3 shadow-sm shadow-slate-200/70">
        <span class="grid size-8 place-items-center rounded-full bg-teal-50 text-teal-500">
          <Icon icon="mdi:lock" class="size-4" />
        </span>
        <span class="text-sm font-normal tracking-wide text-slate-950">Secure. Simple. Yours.</span>
      </div>
      <div class="mt-4 grid items-center gap-2 sm:grid-cols-[1fr_180px] lg:grid-cols-1">
        <div>
          <h2 class="text-3xl font-black leading-tight tracking-tight text-slate-950 sm:text-4xl lg:text-3xl">
            Create<br /><span class="text-teal-500">Account</span>
          </h2>
          <p class="mt-2 text-sm font-medium text-slate-500 sm:mt-3 sm:text-base">Join and secure your crypto journey.</p>
        </div>
        <img src="/images/wallet-image.png" alt="Crypto Wallet" class="hidden w-full h-auto object-contain sm:block lg:hidden" />
      </div>

      <div class="mt-6 grid gap-3">
        <div class="flex items-center gap-3 rounded-xl border border-slate-100 bg-white px-4 py-3 shadow-sm shadow-slate-200/40 transition focus-within:border-teal-400 focus-within:ring-1 focus-within:ring-teal-300">
          <span class="grid size-9 shrink-0 place-items-center rounded-xl border border-slate-100 bg-white text-teal-500 shadow-sm">
            <Icon icon="mdi:email-outline" class="size-5" />
          </span>
          <div class="min-w-0 flex-1">
            <p class="text-xs font-semibold tracking-wide text-slate-400">Email Address</p>
            <input type="email" inputmode="email" :value="email" placeholder="Enter your email address"
              class="mt-0.5 w-full bg-transparent text-sm font-semibold text-slate-950 placeholder:font-normal placeholder:text-slate-400 outline-none"
              @input="email = ($event.target as HTMLInputElement).value" />
          </div>
        </div>
        <div class="flex items-center gap-3 rounded-xl border border-slate-100 bg-white px-4 py-3 shadow-sm shadow-slate-200/40 transition focus-within:border-teal-400 focus-within:ring-1 focus-within:ring-teal-300">
          <span class="grid size-9 shrink-0 place-items-center rounded-xl border border-slate-100 bg-white text-teal-500 shadow-sm">
            <Icon icon="mdi:lock-outline" class="size-5" />
          </span>
          <div class="min-w-0 flex-1">
            <p class="text-xs font-semibold tracking-wide text-slate-400">Password</p>
            <input :type="showPassword ? 'text' : 'password'" :value="password" placeholder="Create a strong password"
              class="mt-0.5 w-full bg-transparent text-sm font-semibold text-slate-950 placeholder:font-normal placeholder:text-slate-400 outline-none"
              @input="password = ($event.target as HTMLInputElement).value" />
          </div>
          <button type="button" class="shrink-0 text-slate-400 hover:text-slate-700 transition" @click="showPassword = !showPassword">
            <Icon :icon="showPassword ? 'mdi:eye-off-outline' : 'mdi:eye-outline'" class="size-5" />
          </button>
        </div>
        <div class="flex items-center gap-3 rounded-xl border border-slate-100 bg-white px-4 py-3 shadow-sm shadow-slate-200/40 transition focus-within:border-teal-400 focus-within:ring-1 focus-within:ring-teal-300">
          <span class="grid size-9 shrink-0 place-items-center rounded-xl border border-slate-100 bg-white text-teal-500 shadow-sm">
            <Icon icon="mdi:gift-outline" class="size-5" />
          </span>
          <div class="min-w-0 flex-1">
            <p class="text-xs font-semibold tracking-wide text-slate-400">Referral Code (Required)</p>
            <input type="text" :value="referral" placeholder="Enter your referral code"
              class="mt-0.5 w-full bg-transparent text-sm font-semibold text-slate-950 placeholder:font-normal placeholder:text-slate-400 outline-none"
              @input="referral = ($event.target as HTMLInputElement).value" />
          </div>
        </div>
      </div>

      <label class="mt-4 flex items-center gap-3 text-xs font-semibold text-slate-500 cursor-pointer" @click="agreed = !agreed">
        <span class="size-5 shrink-0 rounded border-2 transition" :class="agreed ? 'bg-teal-500 border-teal-500' : 'border-slate-200 bg-white'"></span>
        <span>I agree to the <button type="button" class="font-semibold text-teal-500 underline underline-offset-2" @click.stop="showTerms = true">Terms &amp; Conditions</button></span>
      </label>

      <div class="mt-5">
        <button type="button" :disabled="loading" class="flex w-full items-center justify-center rounded-xl bg-[#020a22] px-5 py-3.5 text-base font-semibold tracking-wide text-white shadow-lg shadow-slate-950/20 transition hover:-translate-y-0.5 hover:shadow-xl disabled:opacity-60 disabled:cursor-not-allowed" @click="handleRegister">
          <span class="flex-1 text-center ml-4">{{ loading ? 'Creating account…' : 'Sign Up' }}</span>
          <Icon icon="mdi:arrow-right" class="size-5" />
        </button>
      </div>
      <div class="mt-4">
        <div class="flex items-center gap-4 py-1 text-slate-500">
          <span class="h-px flex-1 bg-slate-100"></span>
          <span class="grid size-10 place-items-center rounded-full border border-slate-100 bg-white text-lg font-medium">or</span>
          <span class="h-px flex-1 bg-slate-100"></span>
        </div>
      </div>

      <div class="mt-4 grid gap-3">
        <button type="button" class="flex w-full items-center justify-center gap-3 rounded-xl border border-slate-100 bg-white px-4 py-3 text-sm font-medium tracking-wide text-slate-950 shadow-sm transition hover:bg-slate-50" @click="signInWithGoogle">
          <img src="/images/google-logo.png" alt="google logo" class="size-5 object-contain" />
          <span>Continue with Google</span>
        </button>
      </div>

      <p class="mt-5 text-center text-sm font-medium text-slate-500">
        Already have an account? <button type="button" class="font-semibold text-teal-500" @click="router.push('/login')">Log In</button>
      </p>
    </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Icon } from '@iconify/vue'
import { useAuthStore, ApiError } from '../../stores/auth'
import { useToast } from '../../composables/useToast'
import { useOAuth } from '../../composables/useOAuth'

const router = useRouter()
const auth   = useAuthStore()
const toast  = useToast()
const { signInWithGoogle } = useOAuth()

const email        = ref('')
const password     = ref('')
const referral     = ref('')
const agreed       = ref(false)
const showTerms    = ref(false)
const showPassword = ref(false)
const loading      = ref(false)

async function handleRegister() {
  if (!email.value || !password.value || !referral.value) {
    toast.warning('Email, password, and referral code are required.')
    return
  }
  if (!agreed.value) {
    toast.warning('Please agree to the Terms & Conditions.')
    return
  }
  if (password.value.length < 8) {
    toast.warning('Password must be at least 8 characters.')
    return
  }
  loading.value = true
  try {
    const res = await auth.register(email.value.trim(), password.value, referral.value.trim())
    auth.pendingEmail = email.value.trim()
    auth.otpContext   = 'register'
    if (res._dev_otp) toast.info(`[DEV] OTP: ${res._dev_otp}`, 15000)
    router.push('/otp')
  } catch (err) {
    toast.error(err instanceof ApiError ? err.message : 'Registration failed. Please try again.')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.sheet-enter-active,
.sheet-leave-active {
  transition: opacity 0.25s ease;
}
.sheet-enter-from,
.sheet-leave-to {
  opacity: 0;
}
</style>
