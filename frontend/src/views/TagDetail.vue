<template>
  <div class="pt-24">
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div class="lg:col-span-2">
        <div class="flex items-center space-x-4 mb-8">
          <button @click="$router.back()" class="p-2 text-slate-400 hover:text-slate-800 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div>
            <h1 class="text-3xl font-bold text-slate-800"># {{ tagName }}</h1>
            <p class="text-slate-400 mt-1">共 {{ total }} 篇文章</p>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div 
            v-for="article in articles" 
            :key="article.id"
            class="glass-card glass-card-hover p-6 cursor-pointer transition-all"
            @click="$router.push(`/articles/${article.id}`)"
          >
            <div class="flex items-center space-x-2 mb-3">
              <span class="text-xs px-2 py-1 bg-blue-500/20 text-blue-500 rounded">{{ article.categoryName }}</span>
              <span class="text-xs text-slate-500">{{ formatDate(article.createTime) }}</span>
            </div>
            <h3 class="text-xl font-semibold text-slate-800 mb-2 hover:text-blue-500 transition-colors">
              {{ article.articleTitle }}
            </h3>
            <p class="text-slate-400 text-sm line-clamp-3 mb-4">{{ article.articleSummary }}</p>
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
            </div>
          </div>
        </div>

        <div v-if="total === 0" class="text-center py-16">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-slate-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p class="text-slate-400">该标签暂无文章</p>
        </div>
      </div>

      <SideBar />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import SideBar from '../components/SideBar.vue'
import { syncFromServer } from '../service/syncService'
import { dataService } from '../service/dataService'

const route = useRoute()

const TAGS_VERSION = 'v3'

const defaultTags = [
  { id: 1, tagName: 'Vue3' },
  { id: 2, tagName: 'JavaScript' },
  { id: 3, tagName: 'CSS' },
  { id: 4, tagName: 'Node.js' },
  { id: 5, tagName: 'Express' },
  { id: 6, tagName: 'Tailwind' },
  { id: 7, tagName: 'Vite' },
  { id: 8, tagName: 'SQLite' },
  { id: 9, tagName: '生活' },
  { id: 10, tagName: '随笔' },
  { id: 11, tagName: '前端' },
  { id: 12, tagName: '学习' },
  { id: 13, tagName: 'Docker' },
  { id: 14, tagName: 'React' },
  { id: 15, tagName: 'TypeScript' },
  { id: 16, tagName: 'MySQL' },
  { id: 17, tagName: 'Redis' },
  { id: 18, tagName: 'Spring Boot' },
  { id: 19, tagName: 'Kubernetes' },
  { id: 20, tagName: 'Git' },
  { id: 21, tagName: 'Linux' },
  { id: 22, tagName: 'Nginx' },
  { id: 23, tagName: 'Java' },
  { id: 24, tagName: 'Python' },
  { id: 25, tagName: 'HTML5' },
]

const loadLocalTags = () => {
  const savedVersion = localStorage.getItem('blog_tags_version')
  const saved = localStorage.getItem('blog_tags')
  if (saved && savedVersion === TAGS_VERSION) {
    return JSON.parse(saved)
  }
  return [...defaultTags]
}

const tagId = computed(() => Number(route.params.id))

const tagName = computed(() => {
  const tags = loadLocalTags()
  const tag = tags.find(t => t.id === tagId.value)
  return tag ? tag.tagName : '未知标签'
})

const articles = ref([])
const total = ref(0)

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

const mapArticleFromBackend = (a) => {
  const tagNames = (a.tags || []).map(t => t.name || t.tagName || '').filter(Boolean)
  return {
    id: a.id,
    articleTitle: a.title || a.articleTitle || '',
    articleSummary: a.summary || a.articleSummary || '',
    articleCover: a.cover || a.articleCover || '',
    categoryId: a.category_id ?? a.categoryId,
    categoryName: a.category ? a.category.name : (a.categoryName || '未分类'),
    createTime: a.created_at || a.createTime,
    viewCount: a.view_count ?? a.viewCount ?? 0,
    likeCount: a.like_count ?? a.likeCount ?? 0,
    isTop: a.is_top ?? a.isTop ?? 0,
    isFeatured: a.is_featured ?? a.isFeatured ?? 0,
    tagNames,
    status: a.status || 'published',
  }
}

const mergeWithLocalData = (backendArticles) => {
  const localSaved = JSON.parse(localStorage.getItem('blog_articles') || '[]')
  return backendArticles.map(ba => {
    const localArticle = localSaved.find(la => la.id === ba.id)
    const merged = { ...ba }
    if (localArticle) {
      if ((localArticle.viewCount || 0) > (merged.viewCount || 0)) {
        merged.viewCount = localArticle.viewCount
      }
      if (localArticle._synced) {
        merged._synced = true
      }
    }
    const actualCommentCount = getCommentCount(ba.id)
    if (actualCommentCount > 0) {
      merged.commentCount = actualCommentCount
    } else {
      merged.commentCount = ba.commentCount || 0
    }
    return merged
  })
}

const loadFromBackend = async () => {
  try {
    const result = await dataService.getArticlesByTag(tagId.value)
    if (result && Array.isArray(result)) {
      const mapped = result.map(a => mapArticleFromBackend(a))
      const merged = mergeWithLocalData(mapped)
      const name = tagName.value
      const filtered = name === '未知标签' ? merged : merged.filter(a => {
        const tagNames = a.tagNames || []
        return tagNames.some(t => t === name)
      })
      articles.value = filtered
      total.value = filtered.length
      return true
    }
  } catch (e) {
    console.warn('Failed to load from backend:', e.message)
  }
  return false
}

const loadFromLocalStorage = () => {
  const saved = JSON.parse(localStorage.getItem('blog_articles') || '[]')
  const name = tagName.value
  if (name === '未知标签') {
    articles.value = []
    total.value = 0
    return
  }

  const seenTitles = new Set()
  const seenIds = new Set()
  const deduped = saved.filter(a => {
    if (!a) return false
    const id = a.id
    const title = (a.articleTitle || a.title || '').trim().toLowerCase()
    if (!title) return true
    if (seenTitles.has(title)) return false
    if (id != null && seenIds.has(id)) return false
    seenTitles.add(title)
    if (id != null) seenIds.add(id)
    return true
  })

  const filtered = deduped.filter(a => {
    let tagNames = []
    if (Array.isArray(a.tagNames) && a.tagNames.length > 0) {
      tagNames = a.tagNames.filter(n => typeof n === 'string')
    } else if (Array.isArray(a.tags) && a.tags.length > 0) {
      tagNames = a.tags.map(t => (t && (t.tagName || t.name)) || '').filter(Boolean)
    }
    return tagNames.some(t => t === name)
  })

  const mapped = filtered.map(a => {
    const actualCommentCount = getCommentCount(a.id)
    return {
      id: a.id,
      articleTitle: a.articleTitle || a.title,
      articleSummary: a.articleSummary || a.summary || '',
      articleCover: a.articleCover || a.cover || '',
      categoryName: a.categoryName || (a.category ? a.category.name : '') || '未分类',
      createTime: a.createTime || a.created_at,
      viewCount: a.viewCount ?? a.view_count ?? 0,
      commentCount: actualCommentCount > 0 ? actualCommentCount : (a.commentCount || 0),
      tagNames: a.tagNames || [],
    }
  })

  articles.value = mapped
  total.value = mapped.length
}

const fetchArticles = async () => {
  const loaded = await loadFromBackend()
  if (!loaded) {
    loadFromLocalStorage()
  }
}

const formatDate = (date) => {
  if (!date) return ''
  const d = new Date(date)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

onMounted(async () => {
  await syncFromServer()
  await fetchArticles()
})

watch(() => route.params.id, async () => {
  await fetchArticles()
})
</script>
