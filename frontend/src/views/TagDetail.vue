<template>
  <div class="pt-24">
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div class="lg:col-span-2">
        <div class="mb-8">
          <button @click="$router.back()" class="inline-flex items-center gap-1.5 px-3 py-1.5 mb-4 text-slate-500 hover:text-indigo-600 bg-white/60 hover:bg-white rounded-lg shadow-sm hover:shadow transition-all duration-200 text-sm font-medium border border-slate-200">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
            返回
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

const defaultArticles = [
  { id: 1, tagNames: ['Vue3', 'JavaScript'] },
  { id: 2, tagNames: ['Tailwind', 'JavaScript'] },
  { id: 3, tagNames: ['Node.js', 'Express'] },
  { id: 4, tagNames: ['前端', '学习'] },
  { id: 5, tagNames: ['生活', '随笔'] },
  { id: 6, tagNames: ['Vite', 'Vue3'] },
  { id: 7, tagNames: ['React', 'JavaScript'] },
  { id: 8, tagNames: ['Node.js', 'Redis'] },
  { id: 9, tagNames: ['Docker', 'Nginx'] },
  { id: 10, tagNames: ['MySQL'] },
  { id: 11, tagNames: ['Kubernetes', 'Docker'] },
]

const titleTagMap = {
  '淘宝闪购': ['前端', '生活', 'JavaScript'],
  '数据持久化测试文章': ['前端', '学习', 'Node.js'],
  '测试文章标题': ['前端', 'Vue3'],
  '美团': ['生活', 'CSS'],
  '百度': ['生活', '随笔'],
}

const loadLocalTags = () => {
  const savedVersion = localStorage.getItem('blog_tags_version')
  const saved = localStorage.getItem('blog_tags')
  if (saved && savedVersion === TAGS_VERSION) {
    return JSON.parse(saved)
  }
  return [...defaultTags]
}

const safeParse = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return fallback
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : fallback
  } catch (e) {
    return fallback
  }
}

const loadArticlesSafe = () => {
  const localArticles = safeParse('blog_articles', [])
  return localArticles.length > 0 ? localArticles : defaultArticles
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

const getArticleTagNames = (article) => {
  if (Array.isArray(article.tagNames) && article.tagNames.length > 0) {
    return article.tagNames.filter(n => typeof n === 'string')
  }
  if (Array.isArray(article.tags) && article.tags.length > 0) {
    const fromTags = article.tags.map(t => (t && (t.tagName || t.name)) || '').filter(Boolean)
    if (fromTags.length > 0) return fromTags
  }
  const byId = defaultArticles.find(d => d.id === article.id)
  if (byId) {
    return byId.tagNames
  }
  const title = (article.articleTitle || article.title || '').trim()
  if (title && titleTagMap[title]) {
    return titleTagMap[title]
  }
  for (const [key, tags] of Object.entries(titleTagMap)) {
    if (title && title.includes(key)) {
      return tags
    }
  }
  return []
}

const fetchArticles = () => {
  const name = tagName.value
  if (name === '未知标签') {
    articles.value = []
    total.value = 0
    return
  }

  const localArticles = safeParse('blog_articles', [])
  const sourceArticles = localArticles.length > 0 ? localArticles : defaultArticles

  const filtered = sourceArticles.filter(article => {
    let tagNames = []
    if (Array.isArray(article.tagNames) && article.tagNames.length > 0) {
      tagNames = article.tagNames.filter(n => typeof n === 'string')
    } else if (Array.isArray(article.tags) && article.tags.length > 0) {
      tagNames = article.tags.map(t => t.tagName || t.name || '').filter(Boolean)
    }
    if (tagNames.length === 0) {
      const title = (article.articleTitle || article.title || '').trim()
      if (title && titleTagMap[title]) {
        tagNames = titleTagMap[title]
      }
    }
    return tagNames.some(t => t === name)
  })

  const mapped = filtered.map(article => {
    const actualCommentCount = getCommentCount(article.id)
    return {
      id: article.id,
      articleTitle: article.articleTitle || article.title || `文章 #${article.id}`,
      articleSummary: article.articleSummary || article.summary || '暂无摘要',
      articleCover: article.articleCover || article.cover || '',
      categoryName: article.categoryName || (article.category ? article.category.name : '') || '未分类',
      createTime: article.createTime || article.created_at || article.createdAt,
      viewCount: article.viewCount ?? article.view_count ?? 0,
      commentCount: actualCommentCount > 0 ? actualCommentCount : (article.commentCount || 0),
      tagNames: getArticleTagNames(article),
    }
  })

  articles.value = mapped
  total.value = mapped.length
}

const formatDate = (date) => {
  if (!date) return ''
  const d = new Date(date)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

onMounted(() => {
  fetchArticles()
})

watch(() => route.params.id, () => {
  fetchArticles()
})
</script>
