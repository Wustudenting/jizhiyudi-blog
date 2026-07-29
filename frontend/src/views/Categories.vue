<template>
  <div class="pt-24">
    <div class="max-w-6xl mx-auto px-4">
      <button 
        @click="$router.back()" 
        class="inline-flex items-center gap-2 px-4 py-2 mb-6 text-slate-600 hover:text-indigo-600 bg-white/80 hover:bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 text-sm font-medium border border-slate-200"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        返回
      </button>
    </div>
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div class="lg:col-span-2">
        <h1 class="text-3xl font-bold text-slate-800 mb-8">文章分类</h1>
        
        <div v-if="categoriesWithCount.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <router-link 
            v-for="category in categoriesWithCount" 
            :key="category.id"
            :to="`/categories/${category.id}`"
            class="glass-card glass-card-hover p-6 transition-all"
          >
            <div class="flex items-center justify-between mb-4">
              <div class="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-slate-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h10m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <span class="text-2xl font-bold text-blue-500">{{ category.articleCount || 0 }}</span>
            </div>
            <h3 class="text-xl font-semibold text-slate-800 mb-2">{{ category.categoryName }}</h3>
            <p class="text-slate-400 text-sm">{{ category.categoryDescription || '暂无描述' }}</p>
          </router-link>
        </div>

        <div v-else class="text-center py-16">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-slate-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h10m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
          <p class="text-slate-400">暂无分类</p>
        </div>
      </div>

      <SideBar />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import SideBar from '../components/SideBar.vue'
import { syncFromServer } from '../service/syncService'

const defaultCategories = [
  { id: 1, categoryName: '前端', categoryDescription: '前端开发技术分享' },
  { id: 2, categoryName: '后端', categoryDescription: '后端开发技术分享' },
  { id: 3, categoryName: '生活', categoryDescription: '生活随笔与感悟' },
  { id: 4, categoryName: '学习', categoryDescription: '学习笔记与知识总结' },
  { id: 5, categoryName: '项目', categoryDescription: '项目实战经验' },
]

const categoryDescriptions = {
  '感悟': '人生感悟与思考',
  '生活': '日常生活点滴记录',
  '读书笔记': '读书笔记与好书推荐',
  '项目实战': '项目开发实战经验分享',
  '工具推荐': '开发工具与效率工具推荐',
  '前端开发': '前端技术相关文章',
  '后端开发': '后端技术相关文章',
  'DevOps': '运维与部署相关文章',
  '生活感悟': '生活随笔与感悟',
  '购物': '购物心得与好物推荐',
  '旅行': '旅行见闻与攻略分享',
  '美食': '美食烹饪与探店分享',
  '健身': '健身运动与健康生活',
  '影视': '影视作品观后感',
  '音乐': '音乐分享与评论',
  '游戏': '游戏心得与攻略',
  '教育': '教育学习经验分享',
  '职场': '职场经验与职业发展',
  '情感': '情感话题与心得',
  '摄影': '摄影技巧与作品分享',
}

const generateDescription = (name) => {
  if (categoryDescriptions[name]) return categoryDescriptions[name]
  if (name.includes('开发') || name.includes('技术')) return `${name}相关文章`
  if (name.includes('感悟') || name.includes('随笔') || name.includes('思考')) return `${name}与心得体会`
  if (name.includes('生活') || name.includes('日常')) return '日常生活点滴记录'
  if (name.includes('笔记') || name.includes('读书')) return '读书笔记与好书推荐'
  if (name.includes('实战') || name.includes('项目')) return '项目开发实战经验分享'
  if (name.includes('工具') || name.includes('效率')) return '工具与效率提升推荐'
  if (name.includes('推荐') || name.includes('好物')) return `${name}与经验分享`
  return `${name}相关内容分享`
}

const defaultArticles = [
  { id: 1, categoryName: '前端' },
  { id: 2, categoryName: '前端' },
  { id: 3, categoryName: '后端' },
  { id: 4, categoryName: '学习' },
  { id: 5, categoryName: '生活' },
  { id: 6, categoryName: '前端' },
]

const safeParse = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return fallback
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : fallback
  } catch (e) {
    console.warn(`Failed to parse ${key}:`, e.message)
    return fallback
  }
}

const loadCategories = () => {
  const saved = safeParse('blog_categories', null)
  if (saved && saved.length > 0) {
    const merged = [...saved]
    
    defaultCategories.forEach(dc => {
      if (!merged.find(c => c.categoryName === dc.categoryName)) {
        merged.push(dc)
      }
    })
    
    merged.forEach(cat => {
      if (!cat.categoryDescription || cat.categoryDescription === '暂无描述') {
        cat.categoryDescription = generateDescription(cat.categoryName || '')
      }
      if (cat.categoryName && !cat.id) {
        cat.id = Date.now() + Math.random()
      }
    })
    
    localStorage.setItem('blog_categories', JSON.stringify(merged))
    return merged
  }
  localStorage.setItem('blog_categories', JSON.stringify(defaultCategories))
  return [...defaultCategories]
}

const loadArticles = () => {
  const localArticles = safeParse('blog_articles', [])
  if (!localArticles || localArticles.length === 0) return defaultArticles
  return localArticles.map(a => ({
    ...a,
    categoryName: a.categoryName || (a.category ? a.category.name : '') || '未分类',
  }))
}

const categories = ref([])

const categoriesWithCount = computed(() => {
  const articles = loadArticles()
  const countMap = {}
  
  articles.forEach(article => {
    const name = article.categoryName
    if (name) {
      countMap[name] = (countMap[name] || 0) + 1
    }
  })
  
  return categories.value.map(category => {
    return Object.assign({}, category, {
      articleCount: countMap[category.categoryName] || 0
    })
  })
})

onMounted(async () => {
  categories.value = loadCategories()
  
  try {
    await syncFromServer()
    categories.value = loadCategories()
  } catch (e) {
    console.warn('Sync failed, using local data:', e.message)
  }
})
</script>
