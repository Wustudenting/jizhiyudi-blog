<template>
  <div class="pt-24">
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div class="lg:col-span-2">
        <h1 class="text-3xl font-bold text-slate-800 mb-8">文章归档</h1>
        
        <div class="space-y-8 max-w-3xl mx-auto">
          <div v-for="(yearArticles, year) in groupedArticles" :key="year">
            <div class="flex items-center mb-4">
              <h2 class="text-2xl font-bold text-slate-800">{{ year }}年</h2>
              <span class="ml-3 text-sm text-slate-500">{{ yearArticles.length }} 篇文章</span>
            </div>
            
            <div class="space-y-2">
              <div 
                v-for="article in yearArticles" 
                :key="article.id"
                class="flex items-center justify-between glass-card glass-card-hover p-4 cursor-pointer transition-all"
                @click="$router.push(`/articles/${article.id}`)"
              >
                <div class="flex items-center space-x-4">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                  <span class="text-slate-800 hover:text-blue-500 transition-colors">{{ article.articleTitle }}</span>
                </div>
                <span class="text-slate-500 text-sm">{{ formatMonthDay(article.createTime) }}</span>
              </div>
            </div>
          </div>
        </div>

        <div v-if="articles.length === 0" class="text-center py-16">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-slate-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <p class="text-slate-400">暂无归档文章</p>
        </div>
      </div>

      <SideBar />
    </div>
  </div>
</template>

<script setup>
import SideBar from '../components/SideBar.vue'
import { ref, computed, onMounted } from 'vue'
import { syncFromServer } from '../service/syncService'

const getDateStr = (daysAgo) => {
  const date = new Date()
  date.setDate(date.getDate() - daysAgo)
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

const defaultArticles = [
  { id: 1, articleTitle: 'Vue3 组合式API详解', createTime: getDateStr(0) },
  { id: 2, articleTitle: 'JavaScript 高级技巧', createTime: getDateStr(1) },
  { id: 3, articleTitle: 'Node.js 性能优化实践', createTime: getDateStr(2) },
  { id: 4, articleTitle: 'Docker容器化部署指南', createTime: getDateStr(3) },
  { id: 5, articleTitle: 'React Hooks 实战指南', createTime: getDateStr(4) },
  { id: 6, articleTitle: 'Spring Boot 企业级开发', createTime: getDateStr(5) },
  { id: 7, articleTitle: 'Vue2与Vue3迁移实战', createTime: getDateStr(6) },
  { id: 8, articleTitle: 'Python数据分析入门', createTime: getDateStr(7) },
  { id: 9, articleTitle: 'Linux服务器运维', createTime: getDateStr(8) },
  { id: 10, articleTitle: 'Kubernetes容器编排', createTime: getDateStr(9) },
]

const loadLocalArticles = () => {
  const saved = JSON.parse(localStorage.getItem('blog_articles') || '[]')
  return saved.map(a => ({
    id: a.id,
    articleTitle: a.articleTitle,
    createTime: a.createTime,
  }))
}

const formatMonthDay = (date) => {
  if (!date) return ''
  const d = new Date(date)
  return `${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

const articles = ref([])

const groupedArticles = computed(() => {
  const groups = {}
  articles.value.forEach(article => {
    const year = article.createTime ? new Date(article.createTime).getFullYear() : '未知'
    if (!groups[year]) {
      groups[year] = []
    }
    groups[year].push(article)
  })
  return Object.fromEntries(Object.entries(groups).sort((a, b) => b[0] - a[0]))
})

const loadArticles = () => {
  const localArticles = loadLocalArticles()
  articles.value = localArticles.concat(defaultArticles)
}

onMounted(async () => {
  await syncFromServer()
  loadArticles()
})
</script>
