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

        <div v-if="loading" class="text-center py-16">
          <p class="text-slate-400">加载中...</p>
        </div>

        <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-6">
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

        <div v-if="!loading && total === 0" class="text-center py-16">
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
import { blogApi } from '../service/api'

const route = useRoute()

const tagId = computed(() => Number(route.params.id))
const tagName = ref('加载中...')
const articles = ref([])
const total = ref(0)
const loading = ref(false)

const fetchArticles = async () => {
  loading.value = true
  try {
    const tags = await blogApi.getTags()
    const tag = tags.find(t => t.id === tagId.value)
    if (tag) {
      tagName.value = tag.name || tag.tagName || '未知标签'
    } else {
      tagName.value = '未知标签'
    }

    const backendArticles = await blogApi.getArticlesByTag(tagId.value)
    const mapped = (backendArticles || []).map(a => ({
      id: a.id,
      articleTitle: a.title || a.articleTitle || '',
      articleSummary: a.summary || a.articleSummary || '',
      articleCover: a.cover || a.articleCover || '',
      categoryName: a.category ? a.category.name : (a.categoryName || '未分类'),
      createTime: a.created_at || a.createTime,
      viewCount: a.view_count ?? a.viewCount ?? 0,
      likeCount: a.like_count ?? a.likeCount ?? 0,
      tagNames: (a.tags || []).map(t => t.name || t.tagName || '').filter(Boolean),
      tags: (a.tags || []).map(t => ({ id: t.id, tagName: t.name || t.tagName || '' })),
    }))
    articles.value = mapped
    total.value = mapped.length
  } catch (e) {
    console.warn('Failed to fetch tag articles:', e.message)
    tagName.value = '未知标签'
    articles.value = []
    total.value = 0
  } finally {
    loading.value = false
  }
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
  if (route.params.id) {
    fetchArticles()
  }
})
</script>
