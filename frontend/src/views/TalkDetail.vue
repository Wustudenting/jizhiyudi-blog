<template>
  <div class="pt-24">
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div class="lg:col-span-2">
        <div v-if="talk" class="max-w-3xl mx-auto">
          <button @click="$router.back()" class="mb-4 flex items-center space-x-2 text-slate-400 hover:text-slate-800 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
            <span>返回说说列表</span>
          </button>

          <div class="glass-card p-8 mb-6">
            <div class="flex items-start space-x-4 mb-6">
              <div class="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                <span class="text-slate-800 text-xl font-medium">{{ (talk.nickname || '匿名').charAt(0) }}</span>
              </div>
              <div class="flex-1">
                <div class="flex items-center justify-between mb-2">
                  <span class="font-medium text-slate-800 text-lg">{{ talk.nickname || '匿名' }}</span>
                  <span class="text-sm text-slate-500">{{ formatDate(talk.createTime) }}</span>
                </div>
              </div>
            </div>

            <p class="text-slate-700 leading-relaxed text-lg whitespace-pre-wrap break-words">{{ talk.talkContent }}</p>

            <div v-if="talk.talkImages?.length > 0" class="grid grid-cols-2 md:grid-cols-3 gap-3 mt-6">
              <img 
                v-for="(img, index) in talk.talkImages" 
                :key="index"
                :src="img" 
                :alt="`图片${index + 1}`"
                class="w-full h-40 object-cover rounded-lg cursor-pointer hover:scale-105 transition-transform"
                @click="previewImage(img)"
              />
            </div>

            <div class="flex items-center space-x-8 mt-6 pt-6 border-t border-slate-200">
              <button 
                @click="toggleLike" 
                class="flex items-center transition-colors"
                :class="talk.liked ? 'text-red-400' : 'text-slate-500 hover:text-red-400'"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" :fill="talk.liked ? 'currentColor' : 'none'" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                {{ talk.likeCount || 0 }}
              </button>
              <div class="flex items-center text-slate-500">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                {{ talk.comments?.length || 0 }}
              </div>
            </div>
          </div>

          <div class="glass-card p-8">
            <h2 class="text-xl font-semibold text-slate-800 mb-6">评论 ({{ talk.comments?.length || 0 }})</h2>

            <div v-if="talk.comments && talk.comments.length > 0" class="space-y-4 mb-6">
              <div v-for="comment in talk.comments" :key="comment.id" class="border-b border-slate-200 pb-4">
                <div class="flex items-start space-x-3">
                  <div class="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center flex-shrink-0">
                    <span class="text-slate-800 text-sm font-medium">{{ (comment.nickname || 'U').charAt(0) }}</span>
                  </div>
                  <div class="flex-1">
                    <div class="flex items-center justify-between mb-1">
                      <span class="font-medium text-blue-500 text-sm">{{ comment.nickname }}</span>
                      <span class="text-xs text-slate-500">{{ formatDate(comment.createTime) }}</span>
                    </div>
                    <p class="text-slate-600 text-sm">{{ comment.content }}</p>
                  </div>
                </div>
              </div>
            </div>
            <div v-else class="text-center py-6 text-slate-500">
              暂无评论，快来发表第一条评论吧！
            </div>

            <form @submit.prevent="submitComment" class="flex flex-col sm:flex-row gap-2 mt-6 pt-4 border-t border-slate-200">
              <input 
                v-model="newComment.nickname"
                type="text" 
                placeholder="昵称"
                class="sm:w-28 px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-800 placeholder-slate-500 focus:outline-none focus:border-blue-500 text-sm"
              />
              <input 
                v-model="newComment.content"
                type="text" 
                placeholder="评论内容..."
                class="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-800 placeholder-slate-500 focus:outline-none focus:border-blue-500 text-sm"
              />
              <button type="submit" class="px-4 py-2 bg-blue-500 text-slate-800 rounded-lg hover:bg-blue-600 transition-colors text-sm">
                发送
              </button>
            </form>
          </div>
        </div>

        <div v-else class="text-center py-16">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-slate-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p class="text-slate-400">说说不存在</p>
        </div>
      </div>

      <SideBar />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import SideBar from '../components/SideBar.vue'
import { syncFromServer } from '../service/syncService'

const route = useRoute()
const talk = ref(null)
const newComment = ref({ nickname: '', content: '' })

const defaultTalks = [
  { 
    id: 1, 
    talkContent: '今天天气真好，适合写代码！☀️', 
    createTime: '2024-01-15 10:30', 
    likeCount: 12, 
    liked: false,
    comments: [
      { id: 1, nickname: '访客', content: '天气确实不错！', createTime: '2024-01-15 11:00' },
      { id: 2, nickname: '读者', content: '一起写代码！', createTime: '2024-01-15 11:30' },
      { id: 3, nickname: '作者', content: '好呀！', createTime: '2024-01-15 12:00' },
    ]
  },
  { 
    id: 2, 
    talkContent: 'Vue3的组合式API真的很好用，代码组织更加清晰了！', 
    createTime: '2024-01-14 15:45', 
    likeCount: 26, 
    liked: false,
    comments: [
      { id: 1, nickname: '前端小白', content: '同感！', createTime: '2024-01-14 16:00' },
      { id: 2, nickname: '开发者', content: '确实比Options API更清晰', createTime: '2024-01-14 17:00' },
    ]
  },
  { 
    id: 3, 
    talkContent: '周末准备学习Docker，有没有一起的小伙伴？', 
    createTime: '2024-01-13 09:00', 
    likeCount: 19, 
    liked: false,
    comments: [
      { id: 1, nickname: '运维工程师', content: '可以一起交流！', createTime: '2024-01-13 10:00' },
    ]
  },
  { 
    id: 4, 
    talkContent: '分享一张美丽的晚霞照片', 
    createTime: '2024-01-12 18:30', 
    likeCount: 45, 
    liked: false,
    talkImages: ['https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=80'],
    comments: []
  },
]

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

const saveTalks = (talksData) => {
  localStorage.setItem('blog_talks', JSON.stringify(talksData))
}

const loadAllTalks = () => {
  const saved = safeParse('blog_talks', null)
  if (saved && Array.isArray(saved) && saved.length > 0) {
    return saved.map(t => ({
      ...t,
      talkContent: t.talkContent || t.content || '',
      createTime: t.createTime || t.created_at || '',
      talkImages: t.talkImages || (t.images ? (Array.isArray(t.images) ? t.images : (typeof t.images === 'string' ? t.images.split(',').filter(Boolean) : [])) : []),
      likeCount: t.likeCount || t.like_count || 0,
      comments: t.comments || [],
      liked: t.liked || false,
      nickname: t.nickname || '匿名',
    }))
  }
  return defaultTalks
}

const loadTalk = (id) => {
  const all = loadAllTalks()
  const found = all.find(t => t.id === id)
  if (found) {
    talk.value = found
  } else {
    talk.value = null
  }
}

const formatDate = (date) => {
  if (!date) return ''
  const d = new Date(date)
  if (isNaN(d.getTime())) return date
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}

const previewImage = (img) => {
  window.open(img, '_blank')
}

const toggleLike = () => {
  if (!talk.value) return
  const all = loadAllTalks()
  const idx = all.findIndex(t => t.id === talk.value.id)
  if (idx === -1) return
  const t = all[idx]
  if (t.liked) {
    t.likeCount = (t.likeCount || 0) - 1
  } else {
    t.likeCount = (t.likeCount || 0) + 1
  }
  t.liked = !t.liked
  all[idx] = t
  saveTalks(all)
  talk.value = { ...t }
}

const submitComment = () => {
  if (!newComment.value.nickname || !newComment.value.content) {
    alert('请填写昵称和评论内容')
    return
  }
  if (!talk.value) return
  
  const all = loadAllTalks()
  const idx = all.findIndex(t => t.id === talk.value.id)
  if (idx === -1) return
  
  const t = all[idx]
  if (!t.comments) t.comments = []
  t.comments.push({
    id: Date.now(),
    nickname: newComment.value.nickname,
    content: newComment.value.content,
    createTime: new Date().toLocaleString('zh-CN', { 
      month: '2-digit', 
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    }),
  })
  all[idx] = t
  saveTalks(all)
  talk.value = { ...t }
  newComment.value = { nickname: '', content: '' }
}

watch(() => route.params.id, (newId) => {
  if (newId) {
    loadTalk(Number(newId))
  }
}, { immediate: false })

onMounted(async () => {
  loadTalk(Number(route.params.id))
  try {
    await syncFromServer()
    loadTalk(Number(route.params.id))
  } catch (e) {
    console.warn('Sync failed:', e.message)
  }
})
</script>
