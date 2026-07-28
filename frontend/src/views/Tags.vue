<template>
  <div class="pt-24">
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div class="lg:col-span-2">
        <h1 class="text-3xl font-bold text-slate-800 mb-8">标签云</h1>
        
        <div v-if="tagsWithCount.length > 0" class="flex flex-wrap gap-4">
          <router-link 
            v-for="tag in tagsWithCount" 
            :key="tag.id"
            :to="`/tags/${tag.id}`"
            class="tag-block"
            :style="{ fontSize: `${14 + (tag.articleCount || 0) * 0.5}px` }"
          >
            <span class="text-slate-800 font-medium">{{ tag.tagName }}</span>
            <span class="text-blue-500 ml-2">({{ tag.articleCount || 0 }})</span>
          </router-link>
        </div>

        <div v-else class="text-center py-16">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-slate-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h10m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
          <p class="text-slate-400">暂无标签</p>
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

const TAGS_VERSION = 'v3'

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

const loadTagsSafe = () => {
  const savedVersion = localStorage.getItem('blog_tags_version')
  const saved = safeParse('blog_tags', null)
  if (saved && saved.length > 0 && savedVersion === TAGS_VERSION) {
    return saved
  }
  localStorage.setItem('blog_tags', JSON.stringify(defaultTags))
  localStorage.setItem('blog_tags_version', TAGS_VERSION)
  return [...defaultTags]
}

const loadArticlesSafe = () => {
  const localArticles = safeParse('blog_articles', [])
  return localArticles.length > 0 ? localArticles : defaultArticles
}

const tags = ref([])

const tagsWithCount = computed(() => {
  const articles = loadArticlesSafe()
  const countMap = {}
  
  articles.forEach(article => {
    let tagNames = []
    if (Array.isArray(article.tagNames) && article.tagNames.length > 0) {
      tagNames = article.tagNames
    } else if (Array.isArray(article.tags) && article.tags.length > 0) {
      tagNames = article.tags.map(t => t.tagName || t.name || '').filter(Boolean)
    }
    tagNames.forEach(name => {
      countMap[name] = (countMap[name] || 0) + 1
    })
  })
  
  return tags.value.map(tag => {
    return Object.assign({}, tag, {
      articleCount: countMap[tag.tagName] || 0
    })
  })
})

onMounted(async () => {
  tags.value = loadTagsSafe()
  
  try {
    await syncFromServer()
    tags.value = loadTagsSafe()
  } catch (e) {
    console.warn('Sync failed, using local data:', e.message)
  }
})
</script>

<style scoped>
.tag-block {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 12px 24px;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.9);
  border-radius: 12px;
  text-decoration: none;
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px -1px rgba(99, 102, 241, 0.08), 0 2px 4px -1px rgba(99, 102, 241, 0.04);
}

.tag-block:hover {
  background: rgba(255, 255, 255, 0.95);
  border-color: rgba(99, 102, 241, 0.4);
  transform: translateY(-4px);
  box-shadow: 0 10px 15px -3px rgba(99, 102, 241, 0.12), 0 4px 6px -2px rgba(99, 102, 241, 0.06);
}
</style>
