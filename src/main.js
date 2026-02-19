import { createApp } from 'vue'
import App from './App.vue'
import './assets/main.css'
import { injectSpeedInsights } from '@vercel/speed-insights'

const app = createApp(App)
app.mount('#app')

// Inject Speed Insights after app mount
injectSpeedInsights()
