<template>
  <aside class="space-y-8">
    <section class="glass-card p-6">
      <div class="text-center">
        <div class="avatar-container w-24 h-24 mx-auto mb-4">
          <div class="avatar-ring"></div>
          <div class="avatar-inner">
            <svg viewBox="0 0 80 80" class="w-14 h-14 fish-swim" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <radialGradient id="bodyGrad" cx="40%" cy="40%" r="60%">
                  <stop offset="0%" stop-color="#FEF9E7"/>
                  <stop offset="50%" stop-color="#FDE68A"/>
                  <stop offset="100%" stop-color="#F6C343"/>
                </radialGradient>
                <radialGradient id="tailGrad" cx="40%" cy="50%" r="60%">
                  <stop offset="0%" stop-color="#FDE68A"/>
                  <stop offset="100%" stop-color="#F6B343"/>
                </radialGradient>
                <radialGradient id="blushGrad" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stop-color="#FCA5A5" stop-opacity="0.7"/>
                  <stop offset="100%" stop-color="#FCA5A5" stop-opacity="0"/>
                </radialGradient>
              </defs>
              <ellipse cx="36" cy="42" rx="22" ry="16" fill="url(#bodyGrad)" stroke="#E8A628" stroke-width="1.5"/>
              <path d="M56 42 Q70 30 74 42 Q70 54 56 42 Q62 42 56 42" fill="url(#tailGrad)" stroke="#E8A628" stroke-width="1.5"/>
              <path d="M58 38 Q64 36 68 40" stroke="#D49520" stroke-width="1" fill="none" opacity="0.4"/>
              <ellipse cx="30" cy="38" rx="5.5" ry="6" fill="white" stroke="#E8A628" stroke-width="1.2"/>
              <ellipse cx="31.5" cy="39" rx="3" ry="3.5" fill="#2D3748"/>
              <circle cx="32.5" cy="37.5" r="1.2" fill="white"/>
              <circle cx="30" cy="40.5" r="0.5" fill="white" opacity="0.6"/>
              <ellipse cx="20" cy="46" rx="4" ry="2.5" fill="url(#blushGrad)"/>
              <path d="M26 46 Q30 49 34 46" stroke="#D49520" stroke-width="1.5" fill="none" stroke-linecap="round"/>
              <ellipse cx="42" cy="42" rx="6" ry="4" fill="white" opacity="0.5"/>
              <circle cx="62" cy="28" r="3" fill="white" opacity="0.7" class="bubble-1"/>
              <circle cx="68" cy="22" r="2" fill="white" opacity="0.5" class="bubble-2"/>
              <circle cx="20" cy="28" r="1.5" fill="white" opacity="0.6"/>
              <circle cx="48" cy="58" r="1" fill="white" opacity="0.4"/>
            </svg>
          </div>
        </div>
        <h3 class="text-xl font-bold text-slate-800 mb-1">机智的鱼</h3>
        <p class="text-slate-500 text-sm mb-4">机智的鱼的博客，记录技术成长与生活感悟</p>
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
            <p class="text-lg font-bold text-green-500">{{ stats.categoryCount }}</p>
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

    <section v-if="showToc" class="glass-card p-6">
      <h3 class="text-lg font-semibold text-slate-800 mb-4 flex items-center">
        <span class="mr-2">📑</span>目录
        <span class="ml-auto text-sm text-slate-500 font-normal">{{ totalPages }}</span>
      </h3>
      <ul class="space-y-2">
        <li v-for="(item, index) in tocItems" :key="index">
          <a :href="item.href" class="block px-3 py-2 rounded-lg text-slate-600 hover:text-indigo-600 hover:bg-indigo-50/50 transition-colors text-sm truncate">
            {{ item.text }}
          </a>
        </li>
      </ul>
    </section>

    <section class="glass-card p-6">
      <h3 class="text-lg font-semibold text-slate-800 mb-4 flex items-center">
        <span class="mr-2">🔥</span>最新文章
      </h3>
      <ul class="space-y-3">
        <li v-for="article in recentArticles" :key="article.id">
          <router-link :to="`/articles/${article.id}`" class="flex items-start space-x-3 group">
            <div v-if="article.articleCover" class="w-12 h-12 rounded overflow-hidden flex-shrink-0">
              <img :src="article.articleCover" :alt="article.articleTitle" class="w-full h-full object-cover" />
            </div>
            <div v-else class="w-12 h-12 rounded bg-gradient-to-br from-blue-400 to-purple-500 flex-shrink-0 flex items-center justify-center text-white text-xs">
              {{ (article.articleTitle || '').charAt(0) }}
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm text-slate-700 group-hover:text-indigo-600 transition-colors line-clamp-2">{{ article.articleTitle }}</p>
              <p class="text-xs text-slate-500 mt-1">{{ formatDate(article.createTime) }}</p>
            </div>
          </router-link>
        </li>
      </ul>
    </section>

    <section class="glass-card p-6">
      <h3 class="text-lg font-semibold text-slate-800 mb-4">热门标签</h3>
      <div class="flex flex-wrap gap-2">
        <router-link 
          v-for="tag in tags" 
          :key="tag.id"
          :to="`/tags/${tag.id}`"
          class="px-3 py-1 bg-indigo-50 text-indigo-600 text-sm rounded-full hover:bg-indigo-100 transition-colors"
        >
          {{ tag.tagName }}
        </router-link>
      </div>
    </section>
  </aside>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const props = defineProps({
  showToc: {
    type: Boolean,
    default: false
  },
  tocItems: {
    type: Array,
    default: () => []
  },
  totalPages: {
    type: Number,
    default: 0
  }
})

const defaultArticles = [
  { id: 1, articleTitle: 'Vue 3 组合式 API 详解', categoryName: '前端开发', createTime: '2026-07-26', articleCover: '' },
  { id: 2, articleTitle: 'JavaScript 高级技巧', categoryName: '前端开发', createTime: '2026-07-25', articleCover: '' },
  { id: 3, articleTitle: 'Node.js 性能优化实践', categoryName: '后端开发', createTime: '2026-07-24', articleCover: '' },
  { id: 4, articleTitle: 'Docker 容器化部署指南', categoryName: 'DevOps', createTime: '2026-07-23', articleCover: '' },
  { id: 5, articleTitle: 'React Hooks 深入解析', categoryName: '前端开发', createTime: '2026-07-22', articleCover: '' },
  { id: 6, articleTitle: 'Vite 构建优化实践', categoryName: '前端开发', createTime: '2026-07-21', articleCover: '' },
  { id: 7, articleTitle: 'MySQL 索引优化', categoryName: '后端开发', createTime: '2026-07-20', articleCover: '' },
  { id: 8, articleTitle: 'Kubernetes 入门到精通', categoryName: 'DevOps', createTime: '2026-07-19', articleCover: '' },
  { id: 9, articleTitle: '感悟', categoryName: '感悟', createTime: '2026-07-26', articleCover: '' },
  { id: 10, articleTitle: '生活', categoryName: '生活', createTime: '2026-07-26', articleCover: '' },
]

const defaultTags = [
  { id: 1, tagName: 'Vue3' },
  { id: 2, tagName: 'JavaScript' },
  { id: 3, tagName: 'Node.js' },
  { id: 4, tagName: 'Docker' },
  { id: 5, tagName: 'React' },
]

const loadLocalArticles = () => {
  const saved = localStorage.getItem('blog_articles')
  return saved ? JSON.parse(saved) : []
}

const loadLocalTags = () => {
  const saved = localStorage.getItem('blog_tags')
  return saved ? JSON.parse(saved) : [...defaultTags]
}

const loadLocalCategories = () => {
  const saved = localStorage.getItem('blog_categories')
  return saved ? JSON.parse(saved) : []
}

const allArticles = computed(() => {
  const local = loadLocalArticles()
  if (local.length > 0) {
    const seen = new Set()
    return local.filter(a => {
      if (!a) return false
      const key = (a.articleTitle || a.title || '').trim().toLowerCase()
      if (!key) return true
      if (seen.has(key)) return false
      seen.add(key)
      return true
    })
  }
  const seen = new Set()
  return defaultArticles.filter(a => {
    const key = (a.articleTitle || '').trim().toLowerCase()
    if (!key) return true
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
})

const stats = computed(() => {
  const articles = allArticles.value
  const categories = loadLocalCategories()
  const tags = loadLocalTags()
  return {
    articleCount: articles.length,
    categoryCount: categories.length || 9,
    tagCount: tags.length,
  }
})

const recentArticles = computed(() => {
  return allArticles.value
    .sort((a, b) => new Date(b.createTime) - new Date(a.createTime))
    .slice(0, 5)
})

const tags = computed(() => {
  return loadLocalTags().slice(0, 10)
})

const formatDate = (date) => {
  if (!date) return ''
  const d = new Date(date)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}
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
  background: linear-gradient(45deg, #FEF08A, #FDE68A, #FCD34D, #FEF08A) border-box;
  -webkit-mask: linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  animation: ring-rotate 3s linear infinite;
}

.avatar-inner {
  width: 80%;
  height: 80%;
  border-radius: 50%;
  background: linear-gradient(135deg, #FEF9E7, #FDE68A);
  display: flex;
  align-items: center;
  justify-content: center;
  animation: avatar-breath 2s ease-in-out infinite;
}

.avatar-fish {
  animation: fish-swim 3s ease-in-out infinite;
  display: inline-block;
}

.fish-swim {
  animation: fish-swim 3s ease-in-out infinite;
  display: inline-block;
}

.bubble-1 {
  animation: bubble-float 2.5s ease-in-out infinite;
}

.bubble-2 {
  animation: bubble-float 3s ease-in-out infinite 0.5s;
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
  0%, 100% { transform: rotate(0deg) translateY(0); }
  25% { transform: rotate(-6deg) translateY(-3px); }
  50% { transform: rotate(0deg) translateY(0); }
  75% { transform: rotate(6deg) translateY(-3px); }
}

@keyframes bubble-float {
  0%, 100% { transform: translateY(0); opacity: 0.6; }
  50% { transform: translateY(-3px); opacity: 0.9; }
}
</style>
