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
                <svg viewBox="0 0 120 120" class="w-16 h-16 fish-swim" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <filter id="homeShadow" x="-20%" y="-20%" width="140%" height="140%">
                      <feDropShadow dx="0" dy="3" stdDeviation="4" flood-color="#F59E0B" flood-opacity="0.25"/>
                    </filter>
                    <linearGradient id="homeBodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stop-color="#FEF08A"/>
                      <stop offset="50%" stop-color="#FCD34D"/>
                      <stop offset="100%" stop-color="#F59E0B"/>
                    </linearGradient>
                    <linearGradient id="homeFinGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stop-color="#FDE68A"/>
                      <stop offset="100%" stop-color="#D97706"/>
                    </linearGradient>
                    <radialGradient id="homeEyeGrad" cx="40%" cy="40%" r="60%">
                      <stop offset="0%" stop-color="#FFFFFF"/>
                      <stop offset="100%" stop-color="#F3F4F6"/>
                    </radialGradient>
                    <radialGradient id="homeBlushGrad" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stop-color="#FB7185" stop-opacity="0.4"/>
                      <stop offset="100%" stop-color="#FB7185" stop-opacity="0"/>
                    </radialGradient>
                  </defs>
                  <g filter="url(#homeShadow)">
                    <ellipse cx="50" cy="62" rx="32" ry="26" fill="url(#homeBodyGrad)"/>
                    <ellipse cx="50" cy="70" rx="22" ry="14" fill="#FFFBEB" opacity="0.8"/>
                    <path d="M82 62 Q106 40 110 62 Q106 84 82 62" fill="url(#homeFinGrad)"/>
                    <path d="M82 62 Q92 56 100 62 Q92 68 82 62" fill="#F59E0B" opacity="0.5"/>
                    <path d="M72 50 Q86 34 94 50" stroke="#D97706" stroke-width="2.5" fill="none" stroke-linecap="round" opacity="0.3"/>
                    <ellipse cx="38" cy="52" rx="11" ry="12" fill="url(#homeEyeGrad)"/>
                    <ellipse cx="40" cy="54" rx="7" ry="8" fill="#1F2937"/>
                    <ellipse cx="42" cy="51" rx="3" ry="3.5" fill="white"/>
                    <circle cx="36" cy="57" r="1.5" fill="white" opacity="0.6"/>
                    <ellipse cx="24" cy="68" rx="7" ry="4" fill="url(#homeBlushGrad)"/>
                    <path d="M36 74 Q42 80 48 74" stroke="#92400E" stroke-width="2.5" fill="none" stroke-linecap="round"/>
                    <path d="M44 46 Q50 38 56 46" stroke="#D97706" stroke-width="2" fill="none" stroke-linecap="round" opacity="0.35"/>
                    <ellipse cx="58" cy="62" rx="5" ry="4" fill="#F59E0B" opacity="0.25"/>
                  </g>
                  <circle cx="100" cy="30" r="5" fill="white" opacity="0.7" class="bubble-1"/>
                  <circle cx="110" cy="18" r="3.5" fill="white" opacity="0.5" class="bubble-2"/>
                  <circle cx="22" cy="36" r="2.5" fill="white" opacity="0.6"/>
                  <circle cx="68" cy="96" r="2.5" fill="white" opacity="0.4"/>
                </svg>
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
              {{ tag.tagName || tag.name }}
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
                <span>{{ category.categoryName || category.name }}</span>
                <span class="text-slate-500 text-sm">{{ category.articleCount || 0 }}</span>
              </router-link>
            </li>
          </ul>
        </section>

        <section class="glass-card p-6">
          <h3 class="text-lg font-semibold text-slate-800 mb-4">友链</h3>
          <ul class="space-y-3">
            <li v-for="link in friendLinks" :key="link.id">
              <a :href="link.linkUrl || link.url" target="_blank" class="text-slate-600 hover:text-blue-500 transition-colors flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                {{ link.linkName || link.name }}
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
import { blogApi } from '../service/api'

const articlesData = ref([])
const tagsData = ref([])
const categoriesData = ref([])
const friendLinksData = ref([])

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

const articles = computed(() => {
  return articlesData.value.slice(0, 4).map(a => ({
    id: a.id,
    articleTitle: a.articleTitle,
    articleSummary: a.articleSummary,
    categoryName: a.categoryName,
    createTime: a.createTime,
    viewCount: a.viewCount,
    commentCount: a.commentCount,
    articleCover: a.articleCover || a.cover || '',
    tags: a.tags || [],
  }))
})

const tags = computed(() => {
  return tagsData.value.map(t => ({
    id: t.id,
    tagName: t.tagName || t.name,
  }))
})

const categories = computed(() => {
  return categoriesData.value.map(c => ({
    id: c.id,
    categoryName: c.categoryName || c.name,
    articleCount: c.articleCount || c.count || 0,
  }))
})

const friendLinks = computed(() => {
  return friendLinksData.value
})

const formatDate = (date) => {
  if (!date) return ''
  const d = new Date(date)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

onMounted(async () => {
  try {
    const [allArticles, topTags, categories, links] = await Promise.all([
      blogApi.getArticles().catch(() => []),
      blogApi.getTopTenTags().catch(() => []),
      blogApi.getCategories().catch(() => []),
      blogApi.getFriendLinks().catch(() => []),
    ])

    if (allArticles && Array.isArray(allArticles)) {
      articlesData.value = allArticles.map(a => ({
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
    }

    if (topTags && Array.isArray(topTags)) {
      tagsData.value = topTags.map(t => ({
        id: t.id,
        tagName: t.name || t.tagName || '',
      }))
    }

    if (categories && Array.isArray(categories)) {
      categoriesData.value = categories.map(c => ({
        id: c.id,
        categoryName: c.name || c.categoryName || '',
        articleCount: c.count ?? c.articleCount ?? 0,
      }))
    }

    if (links && Array.isArray(links)) {
      friendLinksData.value = links.map(l => ({
        id: l.id,
        linkName: l.name || l.linkName || '',
        linkUrl: l.url || l.linkUrl || '',
      }))
    }
  } catch (e) {
    console.warn('Home page data fetch failed:', e.message)
  }
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
  background: linear-gradient(45deg, #F59E0B, #D97706, #B45309, #F59E0B) border-box;
  -webkit-mask: linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  animation: ring-rotate 3s linear infinite;
}

.avatar-inner {
  width: 80%;
  height: 80%;
  border-radius: 50%;
  background: linear-gradient(135deg, #EFF6FF, #DBEAFE);
  display: flex;
  align-items: center;
  justify-content: center;
  animation: avatar-breath 2s ease-in-out infinite;
  box-shadow: inset 0 2px 8px rgba(59, 130, 246, 0.1);
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
