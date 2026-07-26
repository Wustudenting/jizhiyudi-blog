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
            <h1 class="text-3xl font-bold text-slate-800">{{ categoryName }}</h1>
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
            <div v-if="article.articleCover" class="mb-4">
              <img :src="article.articleCover" :alt="article.articleTitle" class="w-full h-40 object-cover rounded-lg" />
            </div>
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

        <div v-if="total === 0" class="text-center py-16">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-slate-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p class="text-slate-400">该分类暂无文章</p>
        </div>
      </div>

      <SideBar />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import SideBar from '../components/SideBar.vue'

const route = useRoute()

const getDateStr = (daysAgo) => {
  const date = new Date()
  date.setDate(date.getDate() - daysAgo)
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

const defaultArticles = [
  { id: 1, articleTitle: 'Vue3 组合式API详解', articleSummary: '深入探讨Vue3的组合式API，包括setup、ref、reactive等核心概念...', categoryName: '前端开发', createTime: getDateStr(0), viewCount: 1234, commentCount: 45, tags: [{ id: 1, tagName: 'Vue3' }, { id: 2, tagName: 'JavaScript' }, { id: 7, tagName: 'CSS' }], articleCover: '' },
  { id: 2, articleTitle: 'JavaScript 高级技巧', articleSummary: '掌握JavaScript的高级特性，提升代码质量和开发效率...', categoryName: '前端开发', createTime: getDateStr(1), viewCount: 892, commentCount: 32, tags: [{ id: 2, tagName: 'JavaScript' }, { id: 6, tagName: 'TypeScript' }], articleCover: '' },
  { id: 3, articleTitle: 'Node.js 性能优化实践', articleSummary: '分享Node.js应用性能优化的实用技巧和最佳实践...', categoryName: '后端开发', createTime: getDateStr(2), viewCount: 654, commentCount: 28, tags: [{ id: 3, tagName: 'Node.js' }, { id: 12, tagName: 'Redis' }], articleCover: '' },
  { id: 4, articleTitle: 'Docker容器化部署指南', articleSummary: '从入门到精通Docker容器化部署，轻松管理你的应用...', categoryName: 'DevOps', createTime: getDateStr(3), viewCount: 1567, commentCount: 56, tags: [{ id: 4, tagName: 'Docker' }, { id: 15, tagName: 'Nginx' }], articleCover: '' },
  { id: 5, articleTitle: 'React Hooks 实战指南', articleSummary: '深入理解React Hooks，掌握useState、useEffect等常用Hook...', categoryName: '前端开发', createTime: getDateStr(4), viewCount: 2134, commentCount: 89, tags: [{ id: 5, tagName: 'React' }, { id: 2, tagName: 'JavaScript' }], articleCover: '' },
  { id: 6, articleTitle: 'Spring Boot 企业级开发', articleSummary: '使用Spring Boot快速构建企业级后端服务...', categoryName: '后端开发', createTime: getDateStr(5), viewCount: 789, commentCount: 34, tags: [{ id: 10, tagName: 'Spring Boot' }, { id: 11, tagName: 'MySQL' }, { id: 18, tagName: 'Java' }], articleCover: '' },
  { id: 7, articleTitle: 'Vue2与Vue3迁移实战', articleSummary: '从Vue2迁移到Vue3的完整指南和最佳实践...', categoryName: '前端开发', createTime: getDateStr(6), viewCount: 567, commentCount: 23, tags: [{ id: 9, tagName: 'Vue2' }, { id: 1, tagName: 'Vue3' }], articleCover: '' },
  { id: 8, articleTitle: 'Python数据分析入门', articleSummary: '使用Python进行数据分析的基础知识和常用库...', categoryName: '后端开发', createTime: getDateStr(7), viewCount: 445, commentCount: 19, tags: [{ id: 17, tagName: 'Python' }, { id: 12, tagName: 'Redis' }], articleCover: '' },
  { id: 9, articleTitle: 'Linux服务器运维', articleSummary: 'Linux服务器运维常用命令和技巧...', categoryName: 'DevOps', createTime: getDateStr(8), viewCount: 398, commentCount: 15, tags: [{ id: 14, tagName: 'Linux' }, { id: 13, tagName: 'Git' }], articleCover: '' },
  { id: 10, articleTitle: 'Kubernetes容器编排', articleSummary: '使用Kubernetes进行容器编排和管理...', categoryName: 'DevOps', createTime: getDateStr(9), viewCount: 512, commentCount: 21, tags: [{ id: 16, tagName: 'Kubernetes' }, { id: 4, tagName: 'Docker' }], articleCover: '' },
]

const loadLocalArticles = () => {
  const saved = JSON.parse(localStorage.getItem('blog_articles') || '[]')
  return saved.map(a => ({
    id: a.id,
    articleTitle: a.articleTitle,
    articleSummary: a.articleSummary,
    articleCover: a.articleCover || '',
    categoryName: a.categoryName,
    createTime: a.createTime,
    viewCount: a.viewCount || 0,
    commentCount: getCommentCount(a.id) || a.commentCount || 0,
    tags: (a.tagNames || []).map((name, idx) => ({ id: idx + 100, tagName: name })),
  }))
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

const loadCategories = () => {
  const saved = localStorage.getItem('blog_categories')
  if (saved) {
    return JSON.parse(saved)
  }
  return [
    { id: 1, categoryName: '前端开发', categoryDescription: '前端技术相关文章' },
    { id: 2, categoryName: '后端开发', categoryDescription: '后端技术相关文章' },
    { id: 3, categoryName: 'DevOps', categoryDescription: '运维与部署相关文章' },
    { id: 4, categoryName: '生活感悟', categoryDescription: '生活随笔与感悟' },
    { id: 5, categoryName: '感悟', categoryDescription: '人生感悟与思考' },
    { id: 6, categoryName: '生活', categoryDescription: '日常生活点滴记录' },
    { id: 7, categoryName: '读书笔记', categoryDescription: '读书笔记与好书推荐' },
    { id: 8, categoryName: '项目实战', categoryDescription: '项目开发实战经验分享' },
    { id: 9, categoryName: '工具推荐', categoryDescription: '开发工具与效率工具推荐' },
  ]
}

const formatDate = (date) => {
  if (!date) return ''
  const d = new Date(date)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

const articles = ref([])
const total = ref(0)
const categoryName = ref('未知分类')

const loadArticlesByCategory = () => {
  const categoryId = Number(route.params.id)
  const categories = loadCategories()
  const category = categories.find(c => c.id === categoryId)
  
  if (category) {
    categoryName.value = category.categoryName
  } else {
    categoryName.value = '未知分类'
  }
  
  const localArticles = loadLocalArticles()
  const allArticles = localArticles.concat(defaultArticles).map(a => {
    const actualCommentCount = getCommentCount(a.id)
    return {
      ...a,
      commentCount: actualCommentCount > 0 ? actualCommentCount : (a.commentCount || 0),
    }
  })
  
  const filtered = allArticles.filter(a => a.categoryName === categoryName.value)
  articles.value = filtered
  total.value = filtered.length
}

onMounted(() => {
  loadArticlesByCategory()
})
</script>
