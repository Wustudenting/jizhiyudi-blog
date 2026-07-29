<template>
  <div class="pt-24">
    <div class="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
      <div>
        <h1 class="text-3xl font-bold text-slate-800">文章列表</h1>
        <p class="text-slate-400 mt-2">共 {{ filteredArticles.length }} 篇文章</p>
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

        <div v-if="loading" class="text-center py-16">
          <p class="text-slate-400">加载中...</p>
        </div>

        <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div 
            v-for="article in pagedArticles" 
            :key="article.id"
            class="glass-card glass-card-hover p-6 cursor-pointer transition-all h-full flex flex-col"
            @click="$router.push(`/articles/${article.id}`)"
          >
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

        <div v-if="!loading && filteredArticles.length > 0" class="flex justify-center mt-8">
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

        <div v-if="!loading && filteredArticles.length === 0" class="text-center py-16">
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
import { ref, onMounted, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import SideBar from '../components/SideBar.vue'
import { blogApi } from '../service/api'

const route = useRoute()

const articles = ref([])
const allArticles = ref([])
const currentPage = ref(1)
const pageSize = ref(6)
const searchKeyword = ref('')
const debouncedKeyword = ref('')
const loading = ref(false)
let searchTimer = null

watch(searchKeyword, (val) => {
  if (searchTimer) clearTimeout(searchTimer)
  searchTimer = setTimeout(() => {
    debouncedKeyword.value = val
  }, 200)
})

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
  let result = allArticles.value

  const keyword = debouncedKeyword.value.trim()
  if (keyword) {
    const lowerKeyword = keyword.toLowerCase()
    result = result.filter(a =>
      a.articleTitle?.toLowerCase().includes(lowerKeyword) ||
      a.articleSummary?.toLowerCase().includes(lowerKeyword) ||
      a.categoryName?.toLowerCase().includes(lowerKeyword) ||
      a.tags?.some(t => t.tagName?.toLowerCase().includes(lowerKeyword))
    )
  }

  if (selectedCategories.value.length > 0) {
    const cats = selectedCategories.value
    result = result.filter(a => cats.includes(a.categoryName))
  }

  if (selectedTags.value.length > 0) {
    const tags = selectedTags.value
    result = result.filter(a =>
      tags.every(tag =>
        a.tags?.some(t => t.tagName === tag)
      )
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

const totalPages = computed(() => Math.ceil(filteredArticles.value.length / pageSize.value))

const pagedArticles = computed(() => {
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
}

const toggleTag = (tag) => {
  const idx = selectedTags.value.indexOf(tag)
  if (idx > -1) {
    selectedTags.value.splice(idx, 1)
  } else {
    selectedTags.value.push(tag)
  }
  currentPage.value = 1
}

const clearFilters = () => {
  selectedCategories.value = []
  selectedTags.value = []
  searchKeyword.value = ''
  debouncedKeyword.value = ''
  sortBy.value = 'date-desc'
  currentPage.value = 1
}

const fetchArticles = async () => {
  loading.value = true
  try {
    const backendArticles = await blogApi.getArticles()
    const mapped = (backendArticles || []).map(a => ({
      id: a.id,
      articleTitle: a.title || a.articleTitle || '',
      articleSummary: a.summary || a.articleSummary || '',
      categoryName: a.category ? a.category.name : (a.categoryName || '未分类'),
      createTime: a.created_at || a.createTime,
      viewCount: a.view_count ?? a.viewCount ?? 0,
      likeCount: a.like_count ?? a.likeCount ?? 0,
      commentCount: a.comment_count ?? a.commentCount ?? 0,
      tags: (a.tags || []).map(t => ({ id: t.id, tagName: t.name || t.tagName || '' })),
    }))
    allArticles.value = mapped
  } catch (e) {
    console.warn('Failed to fetch articles:', e.message)
    allArticles.value = []
  } finally {
    loading.value = false
  }
}

const formatDate = (date) => {
  if (!date) return ''
  const d = new Date(date)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

const handleSearch = () => {
  if (searchTimer) {
    clearTimeout(searchTimer)
    searchTimer = null
  }
  debouncedKeyword.value = searchKeyword.value
  currentPage.value = 1
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

watch([debouncedKeyword, selectedCategories, selectedTags, sortBy], () => {
  currentPage.value = 1
})

onMounted(async () => {
  await fetchArticles()
  
  if (route.query.keyword) {
    searchKeyword.value = route.query.keyword
    debouncedKeyword.value = route.query.keyword
  }
})
</script>
