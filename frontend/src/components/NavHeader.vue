<template>
  <header class="fixed top-0 left-0 right-0 z-50 transition-all duration-300" :class="scrolled ? 'bg-white/80 backdrop-blur-md shadow-md' : 'bg-transparent'">
    <div class="container mx-auto px-4">
      <div class="flex items-center justify-between h-16">
        <router-link to="/" class="flex items-center space-x-2 group flex-shrink-0">
          <div class="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-200 to-amber-300 flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
            <svg viewBox="0 0 80 80" class="w-8 h-8" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <radialGradient id="navBodyGrad" cx="40%" cy="40%" r="60%">
                  <stop offset="0%" stop-color="#FFFBEB"/>
                  <stop offset="40%" stop-color="#FEF3C7"/>
                  <stop offset="100%" stop-color="#FCD34D"/>
                </radialGradient>
                <radialGradient id="navTailGrad" cx="40%" cy="50%" r="60%">
                  <stop offset="0%" stop-color="#FDE68A"/>
                  <stop offset="100%" stop-color="#F59E0B"/>
                </radialGradient>
              </defs>
              <ellipse cx="36" cy="42" rx="22" ry="16" fill="url(#navBodyGrad)" stroke="#92400E" stroke-width="2"/>
              <path d="M56 42 Q70 30 74 42 Q70 54 56 42 Q62 42 56 42" fill="url(#navTailGrad)" stroke="#92400E" stroke-width="2"/>
              <ellipse cx="30" cy="38" rx="5.5" ry="6" fill="white" stroke="#92400E" stroke-width="1.5"/>
              <ellipse cx="31.5" cy="39" rx="3" ry="3.5" fill="#1E293B"/>
              <circle cx="32.5" cy="37.5" r="1.2" fill="white"/>
              <ellipse cx="20" cy="46" rx="4" ry="2.5" fill="#F87171" opacity="0.4"/>
              <path d="M26 46 Q30 49 34 46" stroke="#92400E" stroke-width="1.8" fill="none" stroke-linecap="round"/>
              <circle cx="62" cy="28" r="2.5" fill="white" opacity="0.6"/>
              <circle cx="68" cy="22" r="1.8" fill="white" opacity="0.4"/>
            </svg>
          </div>
          <span class="text-xl font-bold text-slate-800">机智的鱼</span>
        </router-link>

        <nav class="hidden lg:flex items-center space-x-6 xl:space-x-8">
          <router-link 
            v-for="item in navItems" 
            :key="item.name" 
            :to="item.path"
            class="nav-link text-slate-600 hover:text-indigo-600 transition-colors relative group text-sm xl:text-base whitespace-nowrap"
            :class="{ 'nav-link-active': isActive(item) }"
          >
            {{ item.label }}
            <span class="nav-underline absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-300"
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
          <div class="relative hidden sm:block">
            <input 
              type="text" 
              v-model="searchKeyword"
              @keyup.enter="handleSearch"
              placeholder="搜索文章..."
              class="w-32 md:w-40 lg:w-48 px-4 py-2 bg-white/60 border border-slate-200 rounded-lg text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:border-indigo-400 transition-colors"
            />
            <button @click="handleSearch" class="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-600">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>

          <button @click="toggleMobileMenu" class="lg:hidden text-slate-700 p-2 hover:bg-slate-100 rounded-lg transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path v-if="!mobileMenuOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <Transition name="mobile-menu">
      <div v-if="mobileMenuOpen" class="lg:hidden bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-lg">
        <div class="container mx-auto px-4 py-4">
          <div class="relative sm:hidden mb-4">
            <input 
              type="text" 
              v-model="searchKeyword"
              @keyup.enter="handleSearch"
              placeholder="搜索文章..."
              class="w-full px-4 py-2 bg-white/60 border border-slate-200 rounded-lg text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:border-indigo-400"
            />
            <button @click="handleSearch" class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-600">
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
              class="flex items-center justify-between py-3 px-3 rounded-lg text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
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
.nav-link-active {
  color: #4f46e5 !important;
}

.nav-link-active .nav-underline {
  width: 100% !important;
}

.mobile-nav-active {
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
