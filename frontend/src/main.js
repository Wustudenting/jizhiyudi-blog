import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'
import { initTheme } from './composables/useTheme'

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

// 注意：主题用的 key 是 'blog-theme'（连字符），
// 上面那段清理只删 'blog_' 开头的 key，所以主题不会被清掉。
// 放在清理之后初始化，确保读到的是清理后的最终状态。
initTheme()

const app = createApp(App)
app.use(router)
app.mount('#app')
