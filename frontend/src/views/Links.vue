<template>
  <div class="pt-24">
    <h1 class="text-3xl font-bold text-slate-800 mb-8">友情链接</h1>
    
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <a 
        v-for="link in friendLinks" 
        :key="link.id"
        :href="link.linkUrl" 
        target="_blank"
        class="glass-card glass-card-hover p-6 text-center transition-all group"
      >
        <div class="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-slate-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </div>
        <h3 class="text-xl font-semibold text-slate-800 mb-2 group-hover:text-blue-500 transition-colors">
          {{ link.linkName }}
        </h3>
        <p class="text-slate-400 text-sm">{{ link.linkDescription || '暂无描述' }}</p>
        <p class="text-slate-500 text-xs mt-2 truncate">{{ link.linkUrl }}</p>
      </a>
    </div>

    <div v-if="friendLinks.length === 0" class="text-center py-16">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-slate-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
      </svg>
      <p class="text-slate-400">暂无友情链接</p>
    </div>

    <section class="mt-16 glass-card p-8">
      <h2 class="text-xl font-semibold text-slate-800 mb-6 text-center">申请友链</h2>
      <p class="text-slate-400 text-center mb-8">欢迎申请友情链接，一起成长！</p>
      <form @submit.prevent="submitLink" class="max-w-md mx-auto space-y-4">
        <input 
          v-model="linkForm.name"
          type="text" 
          placeholder="网站名称"
          class="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg text-slate-800 placeholder-slate-500 focus:outline-none focus:border-blue-500"
        />
        <input 
          v-model="linkForm.url"
          type="url" 
          placeholder="网站地址"
          class="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg text-slate-800 placeholder-slate-500 focus:outline-none focus:border-blue-500"
        />
        <input 
          v-model="linkForm.description"
          type="text" 
          placeholder="网站描述"
          class="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg text-slate-800 placeholder-slate-500 focus:outline-none focus:border-blue-500"
        />
        <input 
          v-model="linkForm.email"
          type="email" 
          placeholder="联系邮箱"
          class="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg text-slate-800 placeholder-slate-500 focus:outline-none focus:border-blue-500"
        />
        <button type="submit" class="w-full btn-primary">提交申请</button>
      </form>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { syncFromServer } from '../service/syncService'

const mockLinks = [
  { id: 1, linkName: 'GitHub', linkUrl: 'https://github.com', linkDescription: '代码托管平台' },
  { id: 2, linkName: '机智的鱼', linkUrl: 'https://github.com', linkDescription: '个人主页' },
  { id: 3, linkName: 'Stack Overflow', linkUrl: 'https://stackoverflow.com', linkDescription: '技术问答平台' },
  { id: 4, linkName: 'Vue.js', linkUrl: 'https://vuejs.org', linkDescription: 'Vue.js 官方网站' },
  { id: 5, linkName: 'MDN', linkUrl: 'https://developer.mozilla.org', linkDescription: 'Web 技术文档' },
  { id: 6, linkName: 'Vite', linkUrl: 'https://vitejs.dev', linkDescription: '下一代前端构建工具' },
  { id: 7, linkName: '百度', linkUrl: 'https://www.baidu.com', linkDescription: '搜索引擎' },
  { id: 8, linkName: 'Bing', linkUrl: 'https://www.bing.com', linkDescription: '微软搜索引擎' },
]

const loadLinks = () => {
  const saved = localStorage.getItem('blog_links')
  if (saved) {
    return JSON.parse(saved)
  }
  localStorage.setItem('blog_links', JSON.stringify(mockLinks))
  return [...mockLinks]
}

const saveLinks = (links) => {
  localStorage.setItem('blog_links', JSON.stringify(links))
}

const friendLinks = ref(loadLinks())

const linkForm = ref({
  name: '',
  url: '',
  description: '',
  email: '',
})

const submitLink = () => {
  if (!linkForm.value.name || !linkForm.value.url) {
    alert('请填写网站名称和地址')
    return
  }
  
  const newLink = {
    id: Date.now(),
    linkName: linkForm.value.name,
    linkUrl: linkForm.value.url,
    linkDescription: linkForm.value.description || '暂无描述',
  }
  
  friendLinks.value.push(newLink)
  saveLinks(friendLinks.value)
  linkForm.value = { name: '', url: '', description: '', email: '' }
  alert('申请提交成功！')
}

onMounted(async () => {
  await syncFromServer()
  friendLinks.value = loadLinks()
})
</script>
