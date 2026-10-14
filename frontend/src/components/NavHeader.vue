<template>
  <header class="fixed top-0 left-0 right-0 z-50 transition-all duration-300" :class="scrolled ? 'bg-white/80 dark:bg-slate-900/80 backdrop-blur-md shadow-md dark:shadow-slate-950/40' : 'bg-transparent'">
    <div class="container mx-auto px-4">
      <div class="flex items-center justify-between h-16">
        <router-link to="/" class="flex items-center space-x-2 group flex-shrink-0">
          <div class="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-200 to-amber-300 flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
            <svg viewBox="0 0 120 120" class="w-8 h-8" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="navBodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stop-color="#FEF08A"/>
                  <stop offset="50%" stop-color="#FCD34D"/>
                  <stop offset="100%" stop-color="#F59E0B"/>
                </linearGradient>
                <linearGradient id="navFinGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stop-color="#FDE68A"/>
                  <stop offset="100%" stop-color="#D97706"/>
                </linearGradient>
              </defs>
              <ellipse cx="50" cy="62" rx="32" ry="26" fill="url(#navBodyGrad)"/>
              <ellipse cx="50" cy="70" rx="22" ry="14" fill="#FFFBEB" opacity="0.8"/>
              <path d="M82 62 Q106 40 110 62 Q106 84 82 62" fill="url(#navFinGrad)"/>
              <path d="M82 62 Q92 56 100 62 Q92 68 82 62" fill="#F59E0B" opacity="0.5"/>
              <ellipse cx="38" cy="52" rx="11" ry="12" fill="white"/>
              <ellipse cx="40" cy="54" rx="7" ry="8" fill="#1F2937"/>
              <ellipse cx="42" cy="51" rx="3" ry="3.5" fill="white"/>
              <circle cx="36" cy="57" r="1.5" fill="white" opacity="0.6"/>
              <ellipse cx="24" cy="68" rx="7" ry="4" fill="#FB7185" opacity="0.3"/>
              <path d="M36 74 Q42 80 48 74" stroke="#92400E" stroke-width="2.5" fill="none" stroke-linecap="round"/>
              <circle cx="100" cy="30" r="4" fill="white" opacity="0.6"/>
              <circle cx="22" cy="36" r="2" fill="white" opacity="0.5"/>
            </svg>
          </div>
          <span class="text-xl font-bold text-slate-800 dark:text-slate-100">机智的鱼</span>
        </router-link>

        <nav class="hidden lg:flex items-center space-x-6 xl:space-x-8">
          <router-link 
            v-for="item in navItems" 
            :key="item.name" 
            :to="item.path"
            class="nav-link text-slate-600 dark:text-slate-300 hover:text-cyan-600 dark:hover:text-indigo-300 transition-colors relative group text-sm xl:text-base whitespace-nowrap"
            :class="{ 'nav-link-active': isActive(item) }"
          >
            {{ item.label }}
            <span class="nav-underline absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-cyan-500 to-cyan-700 dark:from-blue-500 dark:to-purple-600 transition-all duration-300"
                  :class="{ 'w-full': isActive(item), 'w-0': !isActive(item) }"></span>
          </router-link>
          <router-link 
            to="/talks"
            class="btn-primary text-sm px-4 py-1.5 whitespace-nowrap"
          >
            随心写
          </router-link>
        </nav>

        <div class="flex items-center space-x-2 sm:space-x-4">
          <!-- 白天 / 黑夜切换 -->
          <button
            @click="toggleTheme"
            class="p-2 rounded-lg text-slate-600 hover:text-cyan-600 hover:bg-slate-100/70 dark:text-slate-300 dark:hover:text-amber-300 dark:hover:bg-slate-700/50 transition-colors"
            :title="theme === 'dark' ? '切换到白天模式' : '切换到黑夜模式'"
            :aria-label="theme === 'dark' ? '切换到白天模式' : '切换到黑夜模式'"
          >
            <svg
              v-if="theme === 'dark'"
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <circle cx="12" cy="12" r="4" />
              <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
            </svg>
            <svg
              v-else
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
            </svg>
          </button>

          <div class="relative hidden sm:block">
            <input 
              type="text" 
              v-model="searchKeyword"
              @keyup.enter="handleSearch"
              placeholder="搜索文章..."
              class="w-32 md:w-40 lg:w-48 px-4 py-2 bg-white/60 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-700 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-cyan-400 dark:focus:border-indigo-400 transition-colors"
            />
            <button @click="handleSearch" class="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 hover:text-cyan-600 dark:hover:text-indigo-300">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>

          <button @click="toggleMobileMenu" class="lg:hidden text-slate-700 dark:text-slate-200 p-2 hover:bg-slate-100 dark:hover:bg-slate-700/60 rounded-lg transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path v-if="!mobileMenuOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <Transition name="mobile-menu">
      <div v-if="mobileMenuOpen" class="lg:hidden bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-700 shadow-lg">
        <div class="container mx-auto px-4 py-4">
          <div class="relative sm:hidden mb-4">
            <input 
              type="text" 
              v-model="searchKeyword"
              @keyup.enter="handleSearch"
              placeholder="搜索文章..."
              class="w-full px-4 py-2 bg-white/60 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-700 dark:text-slate-300 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-cyan-400 dark:focus:border-indigo-400"
            />
            <button @click="handleSearch" class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 hover:text-cyan-600 dark:hover:text-indigo-600">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>
          <nav class="flex flex-col space-y-1">
            <router-link 
              v-for="item in navItems" 
              :key="item.name" 
              :to="item.path"
              @click="mobileMenuOpen = false"
              class="flex items-center justify-between py-3 px-3 rounded-lg text-slate-600 dark:text-slate-400 hover:text-cyan-600 hover:bg-cyan-50 dark:hover:text-indigo-600 dark:hover:bg-slate-700/50 transition-colors"
              active-class="mobile-nav-active"
            >
              <span>{{ item.label }}</span>
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </router-link>
            <router-link 
              to="/talks"
              @click="mobileMenuOpen = false"
              class="btn-primary text-center mt-3"
            >
              随心写
            </router-link>
          </nav>
        </div>
      </div>
    </Transition>
  </header>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useTheme } from '../composables/useTheme'

const { theme, toggleTheme } = useTheme()

const router = useRouter()
const route = useRoute()
const scrolled = ref(false)
const mobileMenuOpen = ref(false)
const searchKeyword = ref('')

const navItems = [
  { name: 'Home', label: '首页', path: '/' },
  { name: 'Articles', label: '文章', path: '/articles' },
  { name: 'Resume', label: '个人简历', path: '/resume' },
  { name: 'Projects', label: '项目经历', path: '/projects' },
  { name: 'Skills', label: '专业技能', path: '/skills' },
  { name: 'About', label: '关于', path: '/about' },
  { name: 'Links', label: '友链', path: '/links' },
]

const isActive = (item) => {
  if (item.path === '/') {
    return route.path === '/'
  }
  return route.path.startsWith(item.path)
}

const handleScroll = () => {
  scrolled.value = window.scrollY > 50
}

const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value
}

const handleSearch = () => {
  if (searchKeyword.value.trim()) {
    router.push({ path: '/articles', query: { keyword: searchKeyword.value } })
    searchKeyword.value = ''
    mobileMenuOpen.value = false
  }
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
/* 白天用青色。下面两条 `.dark ...` 是把黑夜钉回改造前的值 ——
   组件样式打包后排在全局 style.css 之后，不钉的话
   `.dark .nav-link-active`（同为 !important、特异性打平）会被这里的规则盖掉。
   注意这里**不能**写 `:global(.dark) X`：Vue 的 scoped 编译器会把它压成
   光秃秃的 `.dark{...}`，后半截选择器直接丢掉（踩过）。
   直接写 `.dark X` 就会编译成 `.dark X[data-v-xxx]`，正是想要的。 */
.nav-link-active {
  color: #0891b2 !important;
}

.nav-link-active .nav-underline {
  width: 100% !important;
}

.mobile-nav-active {
  color: #0891b2 !important;
  background-color: rgba(8, 145, 178, 0.08) !important;
}

.dark .nav-link-active {
  color: #4f46e5 !important;
}

.dark .mobile-nav-active {
  color: #4f46e5 !important;
  background-color: rgba(99, 102, 241, 0.08) !important;
}

.mobile-menu-enter-active,
.mobile-menu-leave-active {
  transition: all 0.3s ease;
  overflow: hidden;
}

.mobile-menu-enter-from,
.mobile-menu-leave-to {
  opacity: 0;
  max-height: 0;
}

.mobile-menu-enter-to,
.mobile-menu-leave-from {
  opacity: 1;
  max-height: 500px;
}
</style>
