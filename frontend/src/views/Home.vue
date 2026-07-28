<template>
  <div class="pt-24">
    <section class="text-center mb-16">
      <h1 class="text-5xl md:text-6xl font-bold mb-4 gradient-text animate-float">
        机智的鱼的博客
      </h1>
      <p class="text-xl text-slate-400 mb-8">
        记录技术成长，分享生活感悟
      </p>
      <div class="flex justify-center space-x-6 text-slate-400">
        <div class="glass-card px-6 py-3">
          <span class="text-2xl font-bold text-blue-500">{{ stats.articleCount }}</span>
          <p class="text-sm mt-1">文章</p>
        </div>
        <div class="glass-card px-6 py-3">
          <span class="text-2xl font-bold text-purple-500">{{ stats.categoryCount }}</span>
          <p class="text-sm mt-1">分类</p>
        </div>
        <div class="glass-card px-6 py-3">
          <span class="text-2xl font-bold text-green-400">{{ stats.tagCount }}</span>
          <p class="text-sm mt-1">标签</p>
        </div>
        <div class="glass-card px-6 py-3">
          <span class="text-2xl font-bold text-yellow-400">{{ stats.viewCount }}</span>
          <p class="text-sm mt-1">浏览</p>
        </div>
      </div>
    </section>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div class="lg:col-span-2">
        <section class="mb-12">
          <h2 class="text-2xl font-bold text-slate-800 mb-6 flex items-center">
            <span class="w-1 h-6 bg-gradient-to-b from-blue-500 to-purple-600 rounded-full mr-3"></span>
            最新文章
          </h2>
          <div class="space-y-4">
            <div 
              v-for="article in articles" 
              :key="article.id"
              class="glass-card glass-card-hover p-6 cursor-pointer transition-all"
              @click="$router.push(`/articles/${article.id}`)"
            >
              <div class="flex flex-col md:flex-row md:items-start md:justify-between">
                <div class="flex-1">
                  <div class="flex items-center space-x-2 mb-2">
                    <span class="text-xs px-2 py-1 bg-blue-500/20 text-blue-500 rounded">{{ article.categoryName }}</span>
                    <span class="text-xs text-slate-500">{{ formatDate(article.createTime) }}</span>
                  </div>
                  <h3 class="text-xl font-semibold text-slate-800 mb-2 hover:text-blue-500 transition-colors">
                    {{ article.articleTitle }}
                  </h3>
                  <p class="text-slate-400 text-sm line-clamp-2">{{ article.articleSummary }}</p>
                  <div class="flex items-center space-x-4 mt-3 text-slate-500 text-sm">
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
                <div v-if="article.articleCover" class="ml-4 mt-4 md:mt-0">
                  <img :src="article.articleCover" :alt="article.articleTitle" class="w-32 h-20 object-cover rounded-lg" />
                </div>
              </div>
            </div>
          </div>
          <div class="text-center mt-8">
            <router-link to="/articles" class="btn-secondary">查看更多文章</router-link>
          </div>
        </section>
      </div>

      <aside class="space-y-8">
        <section class="glass-card p-6">
          <div class="text-center">
            <div class="avatar-container w-24 h-24 mx-auto mb-4">
              <div class="avatar-ring"></div>
              <div class="avatar-inner">
                <span class="avatar-fish">🐟</span>
              </div>
            </div>
            <h3 class="text-xl font-bold text-slate-800 mb-1">机智的鱼</h3>
            <p class="text-slate-400 text-sm mb-4">机智的鱼的博客，记录技术成长与生活感悟</p>
            <div class="flex justify-center space-x-6 text-center">
              <div>
                <p class="text-lg font-bold text-blue-500">{{ stats.articleCount }}</p>
                <p class="text-xs text-slate-500">文章</p>
              </div>
              <div>
                <p class="text-lg font-bold text-purple-500">{{ stats.tagCount }}</p>
                <p class="text-xs text-slate-500">标签</p>
              </div>
              <div>
                <p class="text-lg font-bold text-green-400">{{ stats.categoryCount }}</p>
                <p class="text-xs text-slate-500">分类</p>
              </div>
            </div>
            <a href="https://github.com/Wustudenting" target="_blank" class="block w-full mt-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-medium hover:opacity-90 transition-opacity text-center">
              + 关注我
            </a>
            <div class="flex justify-center space-x-4 mt-4">
              <a href="https://github.com/Wustudenting" target="_blank" class="text-slate-400 hover:text-indigo-600 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>
              </a>
              <a href="#" class="text-slate-400 hover:text-indigo-600 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
              </a>
              <a href="#" class="text-slate-400 hover:text-indigo-600 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
              </a>
            </div>
          </div>
        </section>

        <section class="glass-card p-6">
          <h3 class="text-lg font-semibold text-slate-800 mb-4 flex items-center">
            <span class="mr-2">📢</span>公告
          </h3>
          <p class="text-slate-600 text-sm leading-relaxed">
            欢迎来到机智的鱼的博客！这里记录着我在技术学习和生活中的点滴感悟，希望能给你带来一些启发和帮助。
          </p>
        </section>

        <section class="glass-card p-6">
          <h3 class="text-lg font-semibold text-slate-800 mb-4">热门标签</h3>
          <div class="flex flex-wrap gap-2">
            <router-link 
              v-for="tag in tags" 
              :key="tag.id"
              :to="`/tags/${tag.id}`"
              class="px-3 py-1 bg-indigo-50 text-slate-600 text-sm rounded-full hover:bg-blue-500/30 hover:text-blue-500 transition-colors"
            >
              {{ tag.tagName }}
            </router-link>
          </div>
        </section>

        <section class="glass-card p-6">
          <h3 class="text-lg font-semibold text-slate-800 mb-4">分类列表</h3>
          <ul class="space-y-3">
            <li v-for="category in categories" :key="category.id">
              <router-link 
                :to="`/categories/${category.id}`"
                class="flex items-center justify-between text-slate-600 hover:text-indigo-600 transition-colors"
              >
                <span>{{ category.categoryName }}</span>
                <span class="text-slate-500 text-sm">{{ category.articleCount || 0 }}</span>
              </router-link>
            </li>
          </ul>
        </section>

        <section class="glass-card p-6">
          <h3 class="text-lg font-semibold text-slate-800 mb-4">友链</h3>
          <ul class="space-y-3">
            <li v-for="link in friendLinks" :key="link.id">
              <a :href="link.linkUrl" target="_blank" class="text-slate-600 hover:text-blue-500 transition-colors flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                {{ link.linkName }}
              </a>
            </li>
          </ul>
        </section>
      </aside>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { syncFromServer } from '../service/syncService'

const getDateStr = (daysAgo) => {
  const date = new Date()
  date.setDate(date.getDate() - daysAgo)
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

const defaultArticles = [
  { id: 1, articleTitle: 'Vue3 组合式API详解', articleSummary: '深入探讨Vue3的组合式API，包括setup、ref、reactive等核心概念...', categoryName: '前端', createTime: getDateStr(0), viewCount: 1234, articleCover: '', tagNames: ['Vue3', 'JavaScript'] },
  { id: 2, articleTitle: 'Tailwind CSS 实战技巧', articleSummary: '分享 Tailwind CSS 在项目中的实用技巧...', categoryName: '前端', createTime: getDateStr(1), viewCount: 256, articleCover: '', tagNames: ['Tailwind', 'JavaScript'] },
  { id: 3, articleTitle: 'Node.js Express 入门', articleSummary: '从零开始学习 Node.js Express 框架...', categoryName: '后端', createTime: getDateStr(2), viewCount: 654, articleCover: '', tagNames: ['Node.js', 'Express'] },
  { id: 4, articleTitle: '我的前端学习之路', articleSummary: '记录我的前端学习历程与心得体会', categoryName: '学习', createTime: getDateStr(3), viewCount: 456, articleCover: '', tagNames: ['前端', '学习'] },
  { id: 5, articleTitle: '生活中的小确幸', articleSummary: '记录生活中的美好瞬间', categoryName: '生活', createTime: getDateStr(4), viewCount: 68, articleCover: '', tagNames: ['生活', '随笔'] },
  { id: 6, articleTitle: 'Vite 构建优化', articleSummary: 'Vite 项目的构建优化实践', categoryName: '前端', createTime: getDateStr(5), viewCount: 192, articleCover: '', tagNames: ['Vite', 'Vue3'] },
  { id: 7, articleTitle: 'React Hooks 实战指南', articleSummary: '深入理解 React Hooks 使用方法...', categoryName: '前端', createTime: getDateStr(6), viewCount: 780, articleCover: '', tagNames: ['React', 'JavaScript'] },
  { id: 8, articleTitle: 'Node.js 性能优化实践', articleSummary: '分享 Node.js 性能优化的实用技巧...', categoryName: '后端', createTime: getDateStr(7), viewCount: 654, articleCover: '', tagNames: ['Node.js', 'Redis'] },
  { id: 9, articleTitle: 'Docker 容器化部署指南', articleSummary: '从入门到精通 Docker 容器化部署...', categoryName: '学习', createTime: getDateStr(8), viewCount: 1567, articleCover: '', tagNames: ['Docker', 'Nginx'] },
  { id: 10, articleTitle: 'MySQL 索引优化', articleSummary: 'MySQL 索引优化最佳实践', categoryName: '后端', createTime: getDateStr(9), viewCount: 610, articleCover: '', tagNames: ['MySQL'] },
  { id: 11, articleTitle: 'Kubernetes 入门到精通', articleSummary: 'Kubernetes 容器编排系统学习', categoryName: '学习', createTime: getDateStr(10), viewCount: 430, articleCover: '', tagNames: ['Kubernetes', 'Docker'] },
]

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

const defaultCategories = [
  { id: 1, categoryName: '前端' },
  { id: 2, categoryName: '后端' },
  { id: 3, categoryName: '生活' },
  { id: 4, categoryName: '学习' },
  { id: 5, categoryName: '项目' },
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

const defaultComments = [
  { id: 1, commentContent: '文章写得很棒，收获很多！', nickname: '访客', createTime: getDateStr(0) },
  { id: 2, commentContent: '感谢分享，期待更多内容', nickname: '读者', createTime: getDateStr(1) },
]

const defaultFriendLinks = [
  { id: 1, linkName: 'GitHub', linkUrl: 'https://github.com' },
  { id: 2, linkName: '机智的鱼', linkUrl: 'https://github.com' },
]

const TAGS_VERSION = 'v2'

const loadLocalArticles = () => {
  try {
    const saved = localStorage.getItem('blog_articles')
    if (!saved) return []
    const parsed = JSON.parse(saved)
    return Array.isArray(parsed) ? parsed : []
  } catch (e) {
    return []
  }
}

const loadLocalTags = () => {
  try {
    const savedVersion = localStorage.getItem('blog_tags_version')
    const saved = localStorage.getItem('blog_tags')
    if (saved && savedVersion === TAGS_VERSION) {
      const parsed = JSON.parse(saved)
      if (Array.isArray(parsed)) return parsed
    }
  } catch (e) {}
  return [...defaultTags]
}

const loadLocalCategories = () => {
  try {
    const saved = localStorage.getItem('blog_categories')
    if (saved) {
      const savedCategories = JSON.parse(saved)
      if (Array.isArray(savedCategories)) {
        const merged = [...savedCategories]
        defaultCategories.forEach(dc => {
          if (!merged.find(c => c.categoryName === dc.categoryName)) {
            merged.push({ ...dc, categoryDescription: generateDescription(dc.categoryName) })
          }
        })
        merged.forEach(cat => {
          if (!cat.categoryDescription || cat.categoryDescription === '暂无描述') {
            cat.categoryDescription = generateDescription(cat.categoryName)
          }
        })
        return merged
      }
    }
  } catch (e) {}
  return defaultCategories.map(c => ({ ...c, categoryDescription: generateDescription(c.categoryName) }))
}

const loadLocalTalks = () => {
  try {
    const saved = localStorage.getItem('blog_talks')
    if (saved) {
      const parsed = JSON.parse(saved)
      return Array.isArray(parsed) ? parsed : []
    }
  } catch (e) {}
  return []
}

const loadLocalLinks = () => {
  try {
    const saved = localStorage.getItem('blog_links')
    if (saved) {
      const parsed = JSON.parse(saved)
      if (Array.isArray(parsed) && parsed.length > 0) return parsed
    }
  } catch (e) {}
  return [...defaultFriendLinks]
}

const articlesData = ref([])
const tagsData = ref([])
const categoriesData = ref([])
const talksData = ref([])
const linksData = ref([])

const initFromLocal = () => {
  articlesData.value = loadLocalArticles()
  tagsData.value = loadLocalTags()
  categoriesData.value = loadLocalCategories()
  talksData.value = loadLocalTalks()
  linksData.value = loadLocalLinks()
}

const syncAndRefresh = async () => {
  try {
    await syncFromServer()
    articlesData.value = loadLocalArticles()
    tagsData.value = loadLocalTags()
    categoriesData.value = loadLocalCategories()
    talksData.value = loadLocalTalks()
    linksData.value = loadLocalLinks()
  } catch (e) {
    console.warn('Sync failed:', e.message)
  }
}

const stats = computed(() => {
  const articles = articlesData.value
  const categories = categoriesData.value
  const tags = tagsData.value
  
  let viewCount = 0
  articles.forEach(a => {
    viewCount += (a.viewCount || 0)
  })
  
  return {
    articleCount: articles.length,
    categoryCount: categories.length,
    tagCount: tags.length,
    viewCount: viewCount || 0,
  }
})

const getCommentCount = (articleId) => {
  try {
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
  } catch (e) {}
  return 0
}

const articles = computed(() => {
  const source = articlesData.value.length > 0 ? articlesData.value : defaultArticles
  return source.slice(0, 4).map(a => {
    const actualCommentCount = getCommentCount(a.id)
    return Object.assign({}, a, {
      tags: (a.tagNames || []).map((name, idx) => ({ id: idx + 100, tagName: name })),
      commentCount: actualCommentCount > 0 ? actualCommentCount : (a.commentCount || 0),
    })
  })
})

const tags = computed(() => {
  return tagsData.value.length > 0 ? tagsData.value : defaultTags
})

const categories = computed(() => {
  const articles = articlesData.value.length > 0 ? articlesData.value : defaultArticles
  const countMap = {}
  
  articles.forEach(a => {
    if (a.categoryName) {
      countMap[a.categoryName] = (countMap[a.categoryName] || 0) + 1
    }
  })
  
  const base = categoriesData.value.length > 0 ? categoriesData.value : defaultCategories
  return base.map(c => {
    return Object.assign({}, c, {
      articleCount: countMap[c.categoryName] || c.articleCount || 0
    })
  })
})

const comments = ref([...defaultComments])

const friendLinks = computed(() => {
  return linksData.value.length > 0 ? linksData.value : defaultFriendLinks
})

const formatDate = (date) => {
  if (!date) return ''
  const d = new Date(date)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

onMounted(async () => {
  initFromLocal()
  await syncAndRefresh()
})
</script>

<style scoped>
.avatar-container {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.avatar-ring {
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  border: 3px solid transparent;
  background: linear-gradient(45deg, #3b82f6, #8b5cf6, #ec4899, #3b82f6) border-box;
  -webkit-mask: linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  animation: ring-rotate 3s linear infinite;
}

.avatar-inner {
  width: 80%;
  height: 80%;
  border-radius: 50%;
  background: linear-gradient(135deg, #3b82f6, #8b5cf6);
  display: flex;
  align-items: center;
  justify-content: center;
  animation: avatar-breath 2s ease-in-out infinite;
}

.avatar-fish {
  font-size: 2.5rem;
  animation: fish-swim 3s ease-in-out infinite;
  display: inline-block;
}

@keyframes ring-rotate {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@keyframes avatar-breath {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

@keyframes fish-swim {
  0%, 100% { 
    transform: rotate(0deg) translateY(0); 
  }
  25% { 
    transform: rotate(-10deg) translateY(-5px); 
  }
  50% { 
    transform: rotate(0deg) translateY(0); 
  }
  75% { 
    transform: rotate(10deg) translateY(-5px); 
  }
}
</style>
