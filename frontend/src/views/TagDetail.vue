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
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import SideBar from '../components/SideBar.vue'

const route = useRoute()

const getDateStr = (daysAgo) => {
  const date = new Date()
  date.setDate(date.getDate() - daysAgo)
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

const defaultArticles = [
  { id: 1, articleTitle: 'Vue3 组合式API详解', articleSummary: '深入探讨Vue3的组合式API，包括setup、ref、reactive等核心概念...', categoryName: '前端开发', createTime: getDateStr(0), viewCount: 1234, commentCount: 45, tagNames: ['Vue3', 'JavaScript', 'CSS'] },
  { id: 2, articleTitle: 'JavaScript 高级技巧', articleSummary: '掌握JavaScript的高级特性，提升代码质量和开发效率...', categoryName: '前端开发', createTime: getDateStr(1), viewCount: 892, commentCount: 32, tagNames: ['JavaScript', 'TypeScript'] },
  { id: 3, articleTitle: 'Node.js 性能优化实践', articleSummary: '分享Node.js应用性能优化的实用技巧和最佳实践...', categoryName: '后端开发', createTime: getDateStr(2), viewCount: 654, commentCount: 28, tagNames: ['Node.js', 'Redis'] },
  { id: 4, articleTitle: 'Docker容器化部署指南', articleSummary: '从入门到精通Docker容器化部署，轻松管理你的应用...', categoryName: 'DevOps', createTime: getDateStr(3), viewCount: 1567, commentCount: 56, tagNames: ['Docker', 'Nginx'] },
  { id: 5, articleTitle: 'React Hooks 实战指南', articleSummary: '深入理解React Hooks，掌握useState、useEffect等常用Hook...', categoryName: '前端开发', createTime: getDateStr(4), viewCount: 2134, commentCount: 89, tagNames: ['React', 'JavaScript'] },
  { id: 6, articleTitle: 'Spring Boot 企业级开发', articleSummary: '使用Spring Boot快速构建企业级后端服务...', categoryName: '后端开发', createTime: getDateStr(5), viewCount: 789, commentCount: 34, tagNames: ['Spring Boot', 'MySQL', 'Java'] },
  { id: 7, articleTitle: 'Vue2与Vue3迁移实战', articleSummary: '从Vue2迁移到Vue3的完整指南和最佳实践...', categoryName: '前端开发', createTime: getDateStr(6), viewCount: 567, commentCount: 23, tagNames: ['Vue2', 'Vue3'] },
  { id: 8, articleTitle: 'Python数据分析入门', articleSummary: '使用Python进行数据分析的基础知识和常用库...', categoryName: '后端开发', createTime: getDateStr(7), viewCount: 445, commentCount: 19, tagNames: ['Python', 'Redis'] },
  { id: 9, articleTitle: 'Linux服务器运维', articleSummary: 'Linux服务器运维常用命令和技巧...', categoryName: 'DevOps', createTime: getDateStr(8), viewCount: 398, commentCount: 15, tagNames: ['Linux', 'Git'] },
  { id: 10, articleTitle: 'Kubernetes容器编排', articleSummary: '使用Kubernetes进行容器编排和管理...', categoryName: 'DevOps', createTime: getDateStr(9), viewCount: 512, commentCount: 21, tagNames: ['Kubernetes', 'Docker'] },
]

const TAGS_VERSION = 'v2'

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

const loadLocalArticles = () => {
  const saved = JSON.parse(localStorage.getItem('blog_articles') || '[]')
  return saved
}

const getCommentCount = (articleId) => {
  const saved = localStorage.getItem(`blog_comments_${articleId}`)
  if (saved) {
    const comments = JSON.parse(saved)
    let count = comments.length
    for (const c of comments) {
      if (c.replies && Array.isArray(c.replies)) {
        count += c.replies.length
      }
    }
    return count
  }
  return 0
}

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

const allArticles = computed(() => {
  const localArticles = loadLocalArticles()
  const merged = localArticles.concat(defaultArticles)
  return merged.map(a => {
    const actualCommentCount = getCommentCount(a.id)
    return {
      ...a,
      commentCount: actualCommentCount > 0 ? actualCommentCount : (a.commentCount || 0),
    }
  })
})

const articles = computed(() => {
  const name = tagName.value
  if (name === '未知标签') return []
  return allArticles.value.filter(a => {
    const tagNames = a.tagNames || []
    return tagNames.includes(name)
  })
})

const total = computed(() => articles.value.length)

const formatDate = (date) => {
  if (!date) return ''
  const d = new Date(date)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

onMounted(() => {
})
</script>
