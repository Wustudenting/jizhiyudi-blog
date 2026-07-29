<template>
  <div class="pt-24">
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div class="lg:col-span-2">
        <div v-if="about" class="max-w-3xl mx-auto">
          <article class="glass-card p-8 mb-8">
            <h1 class="text-3xl font-bold text-slate-800 mb-6">关于我</h1>
            <div class="markdown-body" v-html="about.aboutContent"></div>
          </article>

          <section class="glass-card p-8">
            <h2 class="text-xl font-semibold text-slate-800 mb-6">基本信息</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="flex items-center space-x-4">
                <div class="w-12 h-12 rounded-lg bg-blue-500/20 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div>
                  <p class="text-slate-500 text-sm">昵称</p>
                  <p class="text-slate-800 font-medium">{{ about.nickname || '机智的鱼' }}</p>
                </div>
              </div>
              <div class="flex items-center space-x-4">
                <div class="w-12 h-12 rounded-lg bg-purple-500/20 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <p class="text-slate-500 text-sm">邮箱</p>
                  <p class="text-slate-800 font-medium">{{ about.email || '1146013446@qq.com' }}</p>
                </div>
              </div>
              <div class="flex items-center space-x-4">
                <div class="w-12 h-12 rounded-lg bg-green-500/20 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <p class="text-slate-500 text-sm">地址</p>
                  <p class="text-slate-800 font-medium">{{ about.address || '地球' }}</p>
                </div>
              </div>
              <div class="flex items-center space-x-4">
                <div class="w-12 h-12 rounded-lg bg-yellow-500/20 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                </div>
                <div>
                  <p class="text-slate-500 text-sm">个人网站</p>
                  <a :href="about.website" target="_blank" class="text-blue-500 hover:text-blue-300 font-medium">{{ about.website || 'www.yuyi-blog.com' }}</a>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>

      <SideBar />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import SideBar from '../components/SideBar.vue'
import { blogApi } from '../service/api'

const mockAbout = {
  aboutContent: '<p>欢迎来到 <strong>机智的鱼</strong> 个人博客！这是一个基于 Vue3 + Node.js 全栈技术打造的个人博客系统，记录技术学习与生活感悟。</p><h2>技术栈</h2><ul><li><strong>前端：</strong>Vue3、JavaScript、Tailwind CSS、Vite</li><li><strong>后端：</strong>Node.js、Express、SQLite</li><li><strong>其他：</strong>Git、Docker、Nginx</li></ul><h2>项目特点</h2><ul><li>✨ Vue3 组合式 API + Vite 构建，开发体验流畅</li><li>🎨 Tailwind CSS 响应式设计，界面美观现代</li><li>📝 完整的文章管理、标签分类、评论互动功能</li><li>💾 本地持久化 + 后端同步，数据安全可靠</li></ul><h2>关于博客</h2><p>这个博客是我记录技术成长、分享生活感悟的地方。希望通过分享，能够帮助到更多的开发者，同时也督促自己不断学习和进步。</p>',
  nickname: '机智的鱼',
  email: '1146013446@qq.com',
  address: '中国',
  website: 'www.yuyi-blog.com',
}

const about = ref(mockAbout)

onMounted(async () => {
  try {
    const res = await blogApi.getAbout()
    if (res.data) {
      about.value = res.data
    }
  } catch (error) {
    console.log('Using mock data')
  }
})
</script>
