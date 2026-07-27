<template>
  <div class="pt-24">
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div class="lg:col-span-2">
        <div class="flex items-center justify-between mb-8">
          <h1 class="text-3xl font-bold text-slate-800">说说</h1>
          <button 
            @click="showPublishForm = !showPublishForm" 
            class="btn-primary flex items-center space-x-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            <span>发布说说</span>
          </button>
        </div>

    <div v-if="showPublishForm" class="glass-card p-6 mb-8">
      <h2 class="text-xl font-semibold text-slate-800 mb-4">发布新说说</h2>
      <form @submit.prevent="publishTalk" class="space-y-4">
        <textarea 
          v-model="newTalk.content"
          placeholder="此刻的想法..."
          class="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg text-slate-800 placeholder-slate-500 focus:outline-none focus:border-blue-500 resize-none"
          rows="4"
          required
        ></textarea>
        
        <div>
          <label class="block text-slate-400 text-sm mb-2">添加图片（可选，最多3张）</label>
          <div class="flex flex-wrap gap-2">
            <div 
              v-for="(img, index) in newTalk.images" 
              :key="index"
              class="relative"
            >
              <img :src="img" class="w-20 h-20 object-cover rounded-lg" />
              <button 
                type="button"
                @click="removeImage(index)"
                class="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-slate-800 rounded-full flex items-center justify-center text-xs"
              >
                ×
              </button>
            </div>
            <label v-if="newTalk.images.length < 3" class="w-20 h-20 border-2 border-dashed border-slate-600 rounded-lg flex items-center justify-center cursor-pointer hover:border-blue-500 hover:text-blue-500 transition-colors">
              <input 
                type="file" 
                accept="image/*" 
                @change="handleTalkImageUpload"
                class="hidden"
                multiple
              />
              <span class="text-2xl text-slate-500">+</span>
            </label>
          </div>
        </div>
        
        <div class="flex justify-end space-x-4">
          <button type="button" @click="cancelPublish" class="btn-secondary">取消</button>
          <button type="submit" class="btn-primary">发布</button>
        </div>
      </form>
    </div>
    
    <div class="space-y-6 max-w-3xl mx-auto">
      <div 
        v-for="talk in talks" 
        :key="talk.id"
        class="glass-card p-6"
      >
        <div class="flex items-start space-x-4">
          <div class="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
            <span class="text-slate-800 font-medium">A</span>
          </div>
          <div class="flex-1">
            <div class="flex items-center justify-between mb-2">
              <span class="font-medium text-slate-800">{{ talk.nickname || '作者' }}</span>
              <span class="text-sm text-slate-500">{{ formatDate(talk.createTime) }}</span>
            </div>
            <p class="text-slate-600 leading-relaxed">{{ talk.talkContent }}</p>
            <div v-if="talk.talkImages?.length > 0" class="flex flex-wrap gap-2 mt-4">
              <img 
                v-for="(img, index) in talk.talkImages" 
                :key="index"
                :src="img" 
                :alt="`图片${index + 1}`"
                class="w-24 h-24 object-cover rounded-lg cursor-pointer hover:scale-105 transition-transform"
              />
            </div>
            <div class="flex items-center space-x-6 mt-4 text-slate-500 text-sm">
              <button 
                @click="toggleLike(talk.id)" 
                class="flex items-center transition-colors"
                :class="talk.liked ? 'text-red-400' : 'hover:text-blue-500'"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" :fill="talk.liked ? 'currentColor' : 'none'" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                {{ talk.likeCount || 0 }}
              </button>
              <button 
                @click="toggleComments(talk.id)" 
                class="flex items-center hover:text-purple-400 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                {{ talk.comments?.length || 0 }}
              </button>
            </div>

            <div v-if="activeTalkId === talk.id" class="mt-4 pt-4 border-t border-slate-200">
              <div v-if="talk.comments?.length > 0" class="space-y-3 mb-4">
                <div v-for="comment in talk.comments" :key="comment.id" class="text-sm bg-white p-3 rounded-lg">
                  <div class="flex items-center justify-between mb-1">
                    <span class="font-medium text-blue-500">{{ comment.nickname }}</span>
                    <span class="text-xs text-slate-500">{{ comment.createTime }}</span>
                  </div>
                  <p class="text-slate-600">{{ comment.content }}</p>
                </div>
              </div>
              <div v-else class="text-center py-2 text-slate-500 text-sm">
                暂无评论
              </div>
              
              <form @submit.prevent="submitComment(talk.id)" class="flex items-center space-x-2 mt-3">
                <input 
                  v-model="newComment.nickname"
                  type="text" 
                  placeholder="昵称"
                  class="w-24 px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-800 placeholder-slate-500 focus:outline-none focus:border-blue-500 text-sm"
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
        </div>
      </div>
    </div>

    <div v-if="talks.length === 0" class="text-center py-16">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-slate-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
      <p class="text-slate-400">暂无说说</p>
      </div>
      </div>

      <SideBar />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import SideBar from '../components/SideBar.vue'
import { syncFromServer } from '../service/syncService'

const getDateTimeStr = (daysAgo, time) => {
  const date = new Date()
  date.setDate(date.getDate() - daysAgo)
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${time}`
}

const defaultTalks = [
  { 
    id: 1, 
    talkContent: '今天天气真好，适合写代码！☀️', 
    createTime: getDateTimeStr(0, '10:30'), 
    likeCount: 12, 
    liked: false,
    comments: [
      { id: 1, nickname: '访客', content: '天气确实不错！', createTime: getDateTimeStr(0, '11:00') },
      { id: 2, nickname: '读者', content: '一起写代码！', createTime: getDateTimeStr(0, '11:30') },
      { id: 3, nickname: '作者', content: '好呀！', createTime: getDateTimeStr(0, '12:00') },
    ]
  },
  { 
    id: 2, 
    talkContent: 'Vue3的组合式API真的很好用，代码组织更加清晰了！', 
    createTime: getDateTimeStr(1, '15:45'), 
    likeCount: 26, 
    liked: false,
    comments: [
      { id: 1, nickname: '前端小白', content: '同感！', createTime: getDateTimeStr(1, '16:00') },
      { id: 2, nickname: '开发者', content: '确实比Options API更清晰', createTime: getDateTimeStr(1, '17:00') },
    ]
  },
  { 
    id: 3, 
    talkContent: '周末准备学习Docker，有没有一起的小伙伴？', 
    createTime: getDateTimeStr(2, '09:00'), 
    likeCount: 19, 
    liked: false,
    comments: [
      { id: 1, nickname: '运维工程师', content: '可以一起交流！', createTime: getDateTimeStr(2, '10:00') },
    ]
  },
  { 
    id: 4, 
    talkContent: '分享一张美丽的晚霞照片', 
    createTime: getDateTimeStr(3, '18:30'), 
    likeCount: 45, 
    liked: false,
    talkImages: ['https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=80'],
    comments: []
  },
]

const saveTalks = (talksData) => {
  localStorage.setItem('blog_talks', JSON.stringify(talksData))
}

const loadTalks = () => {
  const saved = localStorage.getItem('blog_talks')
  if (saved) {
    return JSON.parse(saved)
  }
  return defaultTalks
}

const talks = ref(loadTalks())
const activeTalkId = ref(null)
const newComment = ref({ nickname: '', content: '' })
const showPublishForm = ref(false)
const newTalk = ref({ content: '', images: [] })

const formatDate = (date) => {
  if (!date) return ''
  const d = new Date(date)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}

const handleTalkImageUpload = (event) => {
  const files = Array.from(event.target.files || [])
  const remaining = 3 - newTalk.value.images.length
  const filesToProcess = files.slice(0, remaining)
  
  filesToProcess.forEach(file => {
    if (file.size > 2 * 1024 * 1024) {
      alert('图片大小不能超过2MB')
      return
    }
    const reader = new FileReader()
    reader.onload = (e) => {
      newTalk.value.images.push(e.target.result)
    }
    reader.readAsDataURL(file)
  })
  
  event.target.value = ''
}

const removeImage = (index) => {
  newTalk.value.images.splice(index, 1)
}

const cancelPublish = () => {
  newTalk.value = { content: '', images: [] }
  showPublishForm.value = false
}

const publishTalk = () => {
  if (!newTalk.value.content.trim()) {
    alert('请填写说说内容')
    return
  }
  
  const now = new Date()
  const timeStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
  
  const talk = {
    id: Date.now(),
    nickname: '作者',
    talkContent: newTalk.value.content.trim(),
    createTime: timeStr,
    likeCount: 0,
    liked: false,
    comments: [],
    talkImages: [...newTalk.value.images]
  }
  
  talks.value.unshift(talk)
  saveTalks(talks.value)
  
  newTalk.value = { content: '', images: [] }
  showPublishForm.value = false
  alert('说说发布成功！')
}

const toggleLike = (talkId) => {
  const talk = talks.value.find(t => t.id === talkId)
  if (talk) {
    if (talk.liked) {
      talk.likeCount--
    } else {
      talk.likeCount++
    }
    talk.liked = !talk.liked
    saveTalks(talks.value)
  }
}

const toggleComments = (talkId) => {
  activeTalkId.value = activeTalkId.value === talkId ? null : talkId
}

const submitComment = (talkId) => {
  if (!newComment.value.nickname || !newComment.value.content) {
    alert('请填写昵称和评论内容')
    return
  }
  
  const talk = talks.value.find(t => t.id === talkId)
  if (talk) {
    if (!talk.comments) {
      talk.comments = []
    }
    talk.comments.push({
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
    saveTalks(talks.value)
  }
  
  newComment.value = { nickname: '', content: '' }
}

onMounted(async () => {
  await syncFromServer()
  talks.value = loadTalks()
})
</script>
