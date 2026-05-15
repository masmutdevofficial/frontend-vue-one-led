import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './style.css'
import App from './App.vue'
import router from './router'
import { setUnauthorizedHandler } from './services/api'
import { useAuthStore } from './stores/auth'

const pinia = createPinia()
const app   = createApp(App)

app.use(pinia)
app.use(router)

// Wire global 401 handler — fires when any authenticated API call returns 401.
// Covers both expired tokens and admin-deactivated accounts.
const auth = useAuthStore()
setUnauthorizedHandler(() => {
  auth.logout().then(() => router.replace('/login'))
})

// Resume status polling if a session was already stored (page refresh / re-open)
if (auth.isAuthenticated && !auth.isTokenExpired) {
  auth.startStatusPolling()
}

app.mount('#app')
