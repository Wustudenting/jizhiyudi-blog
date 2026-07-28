import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'

const STORAGE_VERSION = 'v6'
const currentVersion = localStorage.getItem('blog_storage_version')
if (currentVersion !== STORAGE_VERSION) {
  const keysToKeep = ['blog_liked_articles']
  const allKeys = Object.keys(localStorage)
  allKeys.forEach(key => {
    if (key.startsWith('blog_') && !keysToKeep.includes(key)) {
      localStorage.removeItem(key)
    }
  })
  localStorage.setItem('blog_storage_version', STORAGE_VERSION)
}

const app = createApp(App)
app.use(router)
app.mount('#app')
