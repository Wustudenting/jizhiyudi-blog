<template>
  <div class="pt-24">
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div class="lg:col-span-2">
        <h1 class="text-3xl font-bold text-slate-800 mb-8">标签云</h1>
        
        <div class="flex flex-wrap gap-4">
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

        <div v-if="tags.length === 0" class="text-center py-16">
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
  { id: 3, tagName: 'Node.js' },
  { id: 4, tagName: 'Docker' },
  { id: 5, tagName: 'React' },
  { id: 6, tagName: 'TypeScript' },
  { id: 7, tagName: 'CSS' },
  { id: 8, tagName: 'HTML5' },
  { id: 9, tagName: 'Vue2' },
  { id: 10, tagName: 'Spring Boot' },
  { id: 11, tagName: 'MySQL' },
  { id: 12, tagName: 'Redis' },
  { id: 13, tagName: 'Git' },
  { id: 14, tagName: 'Linux' },
  { id: 15, tagName: 'Nginx' },
  { id: 16, tagName: 'Kubernetes' },
  { id: 17, tagName: 'Python' },
  { id: 18, tagName: 'Java' },
  { id: 19, tagName: 'WebSocket' },
  { id: 20, tagName: 'RESTful' },
]

const defaultArticles = [
  { id: 1, tagNames: ['Vue3', 'JavaScript', 'CSS'] },
  { id: 2, tagNames: ['JavaScript', 'TypeScript'] },
  { id: 3, tagNames: ['Node.js', 'Redis'] },
  { id: 4, tagNames: ['Docker', 'Nginx'] },
  { id: 5, tagNames: ['React', 'JavaScript'] },
  { id: 6, tagNames: ['Spring Boot', 'MySQL', 'Java'] },
  { id: 7, tagNames: ['Vue2', 'Vue3'] },
  { id: 8, tagNames: ['Python', 'Redis'] },
  { id: 9, tagNames: ['Linux', 'Git'] },
  { id: 10, tagNames: ['Docker', 'Kubernetes'] },
  { id: 11, tagNames: ['WebSocket', 'RESTful'] },
  { id: 12, tagNames: ['HTML5', 'CSS', 'JavaScript'] },
]

const TAGS_VERSION = 'v2'

const loadTags = () => {
  const savedVersion = localStorage.getItem('blog_tags_version')
  const saved = localStorage.getItem('blog_tags')
  if (saved && savedVersion === TAGS_VERSION) {
    return JSON.parse(saved)
  }
  localStorage.setItem('blog_tags', JSON.stringify(defaultTags))
  localStorage.setItem('blog_tags_version', TAGS_VERSION)
  return [...defaultTags]
}

const loadArticles = () => {
  const saved = localStorage.getItem('blog_articles')
  const localArticles = saved ? JSON.parse(saved) : []
  return localArticles.concat(defaultArticles)
}

const tags = ref([])

const tagsWithCount = computed(() => {
  const articles = loadArticles()
  const countMap = {}
  
  articles.forEach(article => {
    const tagNames = article.tagNames || []
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
  await syncFromServer()
  tags.value = loadTags()
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
