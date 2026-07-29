<template>
  <div class="pt-24">
    <div class="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
      <div>
        <h1 class="text-3xl font-bold text-slate-800">文章列表</h1>
        <p class="text-slate-400 mt-2">共 {{ total }} 篇文章</p>
      </div>
      <div class="mt-4 md:mt-0 flex items-center space-x-3">
        <div class="relative">
          <input 
            type="text" 
            v-model="searchKeyword"
            @keyup.enter="handleSearch"
            placeholder="搜索文章..."
            class="w-full md:w-64 px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-800 placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
          <button 
            @click="handleSearch"
            class="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-800 transition-colors"
            title="搜索"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </div>
        <router-link to="/articles/add" class="btn-primary whitespace-nowrap">写文章</router-link>
      </div>
    </div>

    <div class="bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50 rounded-2xl p-5 mb-6 shadow-sm border border-white/60">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="bg-white/70 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow border border-indigo-100/60">
          <div class="flex items-center gap-2 mb-3">
            <span class="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-400 to-blue-500 flex items-center justify-center text-white text-sm shadow-sm">📂</span>
            <h3 class="text-sm font-semibold text-indigo-700">分类筛选</h3>
          </div>
          <div class="flex flex-wrap gap-1.5">
            <button
              v-for="cat in allCategories"
              :key="cat"
              @click="toggleCategory(cat)"
              :class="['px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 hover:scale-105', selectedCategories.includes(cat) ? 'bg-gradient-to-r from-indigo-500 to-blue-500 text-white shadow-md' : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100 hover:shadow-sm']"
            >
              {{ cat }}
            </button>
          </div>
        </div>

        <div class="bg-white/70 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow border border-purple-100/60">
          <div class="flex items-center gap-2 mb-3">
            <span class="w-7 h-7 rounded-lg bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center text-white text-sm shadow-sm">🏷️</span>
            <h3 class="text-sm font-semibold text-purple-700">标签筛选</h3>
          </div>
          <div class="flex flex-wrap gap-1.5">
            <button
              v-for="tag in popularTags"
              :key="tag"
              @click="toggleTag(tag)"
              :class="['px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 hover:scale-105', selectedTags.includes(tag) ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md' : 'bg-purple-50 text-purple-600 hover:bg-purple-100 hover:shadow-sm']"
            >
              {{ tag }}
            </button>
          </div>
        </div>

        <div class="bg-white/70 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow border border-cyan-100/60">
          <div class="flex items-center gap-2 mb-3">
            <span class="w-7 h-7 rounded-lg bg-gradient-to-br from-cyan-400 to-teal-500 flex items-center justify-center text-white text-sm shadow-sm">📊</span>
            <h3 class="text-sm font-semibold text-cyan-700">排序方式</h3>
          </div>
          <select
            v-model="sortBy"
            class="w-full px-3 py-2 bg-cyan-50 text-cyan-700 text-sm rounded-xl border-0 focus:outline-none focus:ring-2 focus:ring-cyan-300 cursor-pointer font-medium"
          >
            <option value="date-desc">🕐 最新发布</option>
            <option value="date-asc">🗓️ 最早发布</option>
            <option value="views-desc">👁️ 浏览最多</option>
            <option value="views-asc">📉 浏览最少</option>
            <option value="comments-desc">💬 评论最多</option>
            <option value="title-asc">🔤 标题 A-Z</option>
          </select>
          <button
            v-if="hasActiveFilters"
            @click="clearFilters"
            class="mt-3 text-xs text-rose-500 hover:text-rose-700 hover:underline flex items-center gap-1 transition-colors"
          >
            <span>✕</span> 清除所有筛选
          </button>
        </div>
      </div>

      <div class="grid grid-cols-3 gap-3 mt-5">
        <router-link to="/categories" class="flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-indigo-400 to-blue-500 text-white rounded-xl text-sm font-medium hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200">
          <span>📁</span> 全部分类
        </router-link>
        <router-link to="/tags" class="flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-purple-400 to-pink-500 text-white rounded-xl text-sm font-medium hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200">
          <span>🏷️</span> 全部标签
        </router-link>
        <router-link to="/archives" class="flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-teal-400 to-emerald-500 text-white rounded-xl text-sm font-medium hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200">
          <span>📚</span> 文章归档
        </router-link>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div class="lg:col-span-2">
        <div v-if="hasActiveFilters" class="mb-4 flex flex-wrap gap-2 items-center">
          <span class="text-sm text-slate-500">已选筛选:</span>
          <span v-for="cat in selectedCategories" :key="'c-'+cat" class="px-2 py-0.5 bg-indigo-100 text-indigo-700 text-xs rounded-full flex items-center gap-1">
            {{ cat }}
            <button @click="toggleCategory(cat)" class="hover:text-indigo-900">×</button>
          </span>
          <span v-for="tag in selectedTags" :key="'t-'+tag" class="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs rounded-full flex items-center gap-1">
            {{ tag }}
            <button @click="toggleTag(tag)" class="hover:text-purple-900">×</button>
          </span>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div 
            v-for="article in articles" 
            :key="article.id"
            class="glass-card glass-card-hover p-6 cursor-pointer transition-all h-full flex flex-col"
            @click="$router.push(`/articles/${article.id}`)"
          >
            <div v-if="article.articleCover" class="mb-4">
              <img :src="article.articleCover" :alt="article.articleTitle" class="w-full h-40 object-cover rounded-lg" />
            </div>
            <div v-else class="mb-4 h-40 bg-slate-100 rounded-lg flex items-center justify-center">
              <span class="text-slate-300 text-sm">无封面</span>
            </div>
            <div class="flex items-center space-x-2 mb-3">
              <span class="text-xs px-2 py-1 bg-blue-500/20 text-blue-500 rounded">{{ article.categoryName }}</span>
          <span class="text-xs text-slate-500">{{ formatDate(article.createTime) }}</span>
        </div>
        <h3 class="text-xl font-semibold text-slate-800 mb-2 hover:text-blue-500 transition-colors">
          {{ article.articleTitle }}
        </h3>
        <p class="text-slate-400 text-sm line-clamp-3 mb-4 flex-1">{{ article.articleSummary }}</p>
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-4 text-slate-500 text-sm">
            <span class="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              {{ article.viewCount || 0 }}
            </span>
            <span class="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              {{ article.commentCount || 0 }}
            </span>
          </div>
          <div class="flex flex-wrap gap-1">
            <span 
              v-for="tag in article.tags" 
              :key="tag.id"
              class="text-xs px-2 py-0.5 bg-purple-500/20 text-purple-500 rounded"
            >
              {{ tag.tagName }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <div v-if="total > 0" class="flex justify-center mt-8">
      <div class="flex items-center space-x-4">
        <button 
          @click="prevPage" 
          :disabled="currentPage <= 1"
          class="px-4 py-2 bg-indigo-50 text-slate-800 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-indigo-100 transition-colors"
        >
          上一页
        </button>
        <span class="text-slate-800">{{ currentPage }} / {{ totalPages }}</span>
        <button 
          @click="nextPage" 
          :disabled="currentPage >= totalPages"
          class="px-4 py-2 bg-indigo-50 text-slate-800 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-indigo-100 transition-colors"
        >
          下一页
        </button>
      </div>
    </div>

    <div v-else class="text-center py-16">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-slate-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <p class="text-slate-400">暂无文章</p>
    </div>
      </div>

      <SideBar />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import SideBar from '../components/SideBar.vue'
import { syncFromServer } from '../service/syncService'

const route = useRoute()

const getDateStr = (daysAgo) => {
  const date = new Date()
  date.setDate(date.getDate() - daysAgo)
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

const defaultArticles = [
  { id: 1, articleTitle: 'Vue 3 组合式 API 详解', articleSummary: '深入理解 Vue 3 的组合式 API 使用方法', categoryName: '前端', createTime: getDateStr(0), viewCount: 1234, commentCount: 45, tags: [{ id: 1, tagName: 'Vue3' }, { id: 2, tagName: 'JavaScript' }, { id: 11, tagName: '前端' }], articleCover: '' },
  { id: 2, articleTitle: 'Tailwind CSS 实战技巧', articleSummary: '分享 Tailwind CSS 在项目中的实用技巧', categoryName: '前端', createTime: getDateStr(1), viewCount: 256, commentCount: 20, tags: [{ id: 6, tagName: 'Tailwind' }, { id: 3, tagName: 'CSS' }, { id: 11, tagName: '前端' }], articleCover: '' },
  { id: 3, articleTitle: 'Node.js Express 入门', articleSummary: '从零开始学习 Node.js Express 框架...', categoryName: '后端', createTime: getDateStr(2), viewCount: 654, commentCount: 28, tags: [{ id: 4, tagName: 'Node.js' }, { id: 5, tagName: 'Express' }], articleCover: '' },
  { id: 4, articleTitle: '我的前端学习之路', articleSummary: '记录我的前端学习历程与心得体会', categoryName: '学习', createTime: getDateStr(3), viewCount: 456, commentCount: 19, tags: [{ id: 11, tagName: '前端' }, { id: 12, tagName: '学习' }], articleCover: '' },
  { id: 5, articleTitle: '生活中的小确幸', articleSummary: '记录生活中的美好瞬间', categoryName: '生活', createTime: getDateStr(4), viewCount: 68, commentCount: 2, tags: [{ id: 9, tagName: '生活' }, { id: 10, tagName: '随笔' }], articleCover: '' },
  { id: 6, articleTitle: 'Vite 构建优化', articleSummary: 'Vite 项目的构建优化实践', categoryName: '前端', createTime: getDateStr(5), viewCount: 192, commentCount: 18, tags: [{ id: 7, tagName: 'Vite' }, { id: 1, tagName: 'Vue3' }], articleCover: '' },
  { id: 7, articleTitle: 'React Hooks 实战指南', articleSummary: '深入理解 React Hooks 使用方法...', categoryName: '前端', createTime: getDateStr(6), viewCount: 780, commentCount: 25, tags: [{ id: 14, tagName: 'React' }, { id: 2, tagName: 'JavaScript' }], articleCover: '' },
  { id: 8, articleTitle: 'Node.js 性能优化实践', articleSummary: '分享 Node.js 性能优化的实用技巧...', categoryName: '后端', createTime: getDateStr(7), viewCount: 654, commentCount: 28, tags: [{ id: 4, tagName: 'Node.js' }, { id: 17, tagName: 'Redis' }], articleCover: '' },
  { id: 9, articleTitle: 'Docker 容器化部署指南', articleSummary: '从入门到精通 Docker 容器化部署...', categoryName: '学习', createTime: getDateStr(8), viewCount: 1567, commentCount: 56, tags: [{ id: 13, tagName: 'Docker' }, { id: 22, tagName: 'Nginx' }], articleCover: '' },
  { id: 10, articleTitle: 'MySQL 索引优化', articleSummary: 'MySQL 索引优化最佳实践', categoryName: '后端', createTime: getDateStr(9), viewCount: 610, commentCount: 22, tags: [{ id: 16, tagName: 'MySQL' }], articleCover: '' },
  { id: 11, articleTitle: 'Kubernetes 入门到精通', articleSummary: 'Kubernetes 容器编排系统学习', categoryName: '学习', createTime: getDateStr(10), viewCount: 430, commentCount: 15, tags: [{ id: 19, tagName: 'Kubernetes' }, { id: 13, tagName: 'Docker' }], articleCover: '' },
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

const getCommentCount = (articleId) => {
  const saved = localStorage.getItem(`blog_comments_${articleId}`)
  if (saved) {
    try {
      const comments = JSON.parse(saved)
      let count = comments.length
      for (const c of comments) {
        if (c.replies && Array.isArray(c.replies)) {
          count += c.replies.length
        }
      }
      return count
    } catch (e) {
      return 0
    }
  }
  return 0
}

const loadLocalArticles = () => {
  const saved = safeParse('blog_articles', [])
  const seenTitles = new Map()
  const seenIds = new Set()
  const deduped = saved.filter(a => {
    if (!a) return false
    const id = a.id
    const title = (a.articleTitle || a.title || '').trim().toLowerCase()
    if (!title) return true
    if (id != null && seenIds.has(id)) return false
    if (seenTitles.has(title)) {
      const existing = seenTitles.get(title)
      if (existing._backendId || (existing.id && existing.id > 1000)) {
        return false
      }
      if (id != null) seenIds.add(id)
      return false
    }
    seenTitles.set(title, a)
    if (id != null) seenIds.add(id)
    return true
  })
  return deduped.map(a => {
    const actualCommentCount = getCommentCount(a.id)
    let tags = []
    if (Array.isArray(a.tags) && a.tags.length > 0) {
      tags = a.tags.map((t, idx) => ({
        id: t.id || idx + 100,
        tagName: t.tagName || t.name || ''
      })).filter(t => t.tagName)
    } else if (Array.isArray(a.tagNames) && a.tagNames.length > 0) {
      tags = a.tagNames.map((name, idx) => ({ id: idx + 100, tagName: name }))
    }
    return {
      id: a.id,
      articleTitle: a.articleTitle || a.title,
      articleSummary: a.articleSummary || a.summary || '',
      articleCover: a.articleCover || a.cover || '',
      categoryName: a.categoryName || (a.category ? a.category.name : '') || '未分类',
      createTime: a.createTime || a.created_at,
      viewCount: a.viewCount ?? a.view_count ?? 0,
      commentCount: actualCommentCount > 0 ? actualCommentCount : (a.commentCount || 0),
      tags,
      _synced: a._synced || false,
    }
  })
}

const getAllArticles = () => {
  const localArticles = loadLocalArticles()
  if (localArticles.length > 0) {
    return localArticles.map(a => {
      const actualCommentCount = getCommentCount(a.id)
      return {
        ...a,
        commentCount: actualCommentCount > 0 ? actualCommentCount : (a.commentCount || 0),
      }
    })
  }
  return defaultArticles.map(a => {
    const actualCommentCount = getCommentCount(a.id)
    return {
      ...a,
      commentCount: actualCommentCount > 0 ? actualCommentCount : (a.commentCount || 0),
    }
  })
}

const allArticles = ref([])
const total = ref(0)
const currentPage = ref(1)
const pageSize = ref(6)
const searchKeyword = ref('')
const selectedCategories = ref([])
const selectedTags = ref([])
const sortBy = ref('date-desc')

const allCategories = computed(() => {
  const cats = new Set(allArticles.value.map(a => a.categoryName).filter(Boolean))
  return Array.from(cats)
})

const popularTags = computed(() => {
  const tagCounts = {}
  allArticles.value.forEach(a => {
    a.tags?.forEach(t => {
      tagCounts[t.tagName] = (tagCounts[t.tagName] || 0) + 1
    })
  })
  return Object.entries(tagCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([tag]) => tag)
})

const hasActiveFilters = computed(() => {
  return selectedCategories.value.length > 0 || selectedTags.value.length > 0 || sortBy.value !== 'date-desc'
})

const filteredArticles = computed(() => {
  let result = [...allArticles.value]

  if (searchKeyword.value.trim()) {
    const keyword = searchKeyword.value.toLowerCase()
    result = result.filter(a =>
      a.articleTitle.toLowerCase().includes(keyword) ||
      a.articleSummary?.toLowerCase().includes(keyword) ||
      a.categoryName?.toLowerCase().includes(keyword) ||
      a.tags?.some(t => t.tagName?.toLowerCase().includes(keyword))
    )
  }

  if (selectedCategories.value.length > 0) {
    result = result.filter(a => selectedCategories.value.includes(a.categoryName))
  }

  if (selectedTags.value.length > 0) {
    result = result.filter(a =>
      selectedTags.value.every(tag => a.tags?.some(t => t.tagName === tag))
    )
  }

  switch (sortBy.value) {
    case 'date-desc':
      result.sort((a, b) => new Date(b.createTime) - new Date(a.createTime))
      break
    case 'date-asc':
      result.sort((a, b) => new Date(a.createTime) - new Date(b.createTime))
      break
    case 'views-desc':
      result.sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0))
      break
    case 'views-asc':
      result.sort((a, b) => (a.viewCount || 0) - (b.viewCount || 0))
      break
    case 'comments-desc':
      result.sort((a, b) => (b.commentCount || 0) - (a.commentCount || 0))
      break
    case 'title-asc':
      result.sort((a, b) => a.articleTitle.localeCompare(b.articleTitle))
      break
  }

  return result
})

const totalPages = computed(() => Math.ceil(total.value / pageSize.value))

const articles = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  return filteredArticles.value.slice(start, start + pageSize.value)
})

const toggleCategory = (cat) => {
  const idx = selectedCategories.value.indexOf(cat)
  if (idx > -1) {
    selectedCategories.value.splice(idx, 1)
  } else {
    selectedCategories.value.push(cat)
  }
  currentPage.value = 1
  updateFiltered()
}

const toggleTag = (tag) => {
  const idx = selectedTags.value.indexOf(tag)
  if (idx > -1) {
    selectedTags.value.splice(idx, 1)
  } else {
    selectedTags.value.push(tag)
  }
  currentPage.value = 1
  updateFiltered()
}

const clearFilters = () => {
  selectedCategories.value = []
  selectedTags.value = []
  searchKeyword.value = ''
  sortBy.value = 'date-desc'
  currentPage.value = 1
  updateFiltered()
}

const updateFiltered = () => {
  total.value = filteredArticles.value.length
}

const formatDate = (date) => {
  if (!date) return ''
  const d = new Date(date)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

const loadArticles = () => {
  const all = getAllArticles()
  allArticles.value = all
  updateFiltered()
}

const handleSearch = () => {
  currentPage.value = 1
  updateFiltered()
}

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
  }
}

onMounted(async () => {
  loadArticles()
  
  if (route.query.keyword) {
    searchKeyword.value = route.query.keyword
  }
  
  try {
    await syncFromServer()
    loadArticles()
  } catch (e) {
    console.warn('Sync failed, using local data:', e.message)
  }
})
</script>
