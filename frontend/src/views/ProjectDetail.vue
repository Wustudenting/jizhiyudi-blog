<template>
  <div class="pt-24">
    <div class="max-w-4xl mx-auto px-4 pb-12">
      <button 
        @click="$router.back()" 
        class="inline-flex items-center gap-2 px-4 py-2 mb-6 text-slate-600 hover:text-indigo-600 bg-white/80 hover:bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 text-sm font-medium border border-slate-200"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        返回项目列表
      </button>

      <div v-if="project" class="space-y-6">
        <section class="glass-card p-8">
          <div class="flex items-start gap-5 mb-6">
            <div class="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shadow-md" :class="project.gradient">
              <span>{{ project.emoji }}</span>
            </div>
            <div class="flex-1">
              <div class="flex items-center gap-2 mb-2">
                <span class="px-2.5 py-0.5 rounded-full text-xs text-white" :class="project.statusClass">{{ project.status }}</span>
              </div>
              <h1 class="text-2xl font-bold text-slate-800 mb-2">{{ project.title }}</h1>
              <p class="text-slate-500 text-sm leading-relaxed">{{ project.description }}</p>
            </div>
          </div>

          <div class="border-t border-slate-100 pt-5">
            <h3 class="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
              <span>🔧</span> 技术栈
            </h3>
            <div class="flex flex-wrap gap-2">
              <span v-for="tech in project.techStack" :key="tech" class="px-3 py-1.5 bg-gradient-to-r from-slate-50 to-slate-100 text-slate-600 rounded-lg text-xs font-medium border border-slate-200 hover:from-indigo-50 hover:to-purple-50 hover:text-indigo-600 transition-all cursor-default">
                {{ tech }}
              </span>
            </div>
          </div>
        </section>

        <section v-if="project.highlights && project.highlights.length" class="glass-card p-8">
          <h2 class="text-lg font-semibold text-slate-800 mb-5 flex items-center gap-2">
            <span>✨</span> 项目亮点
          </h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div v-for="(highlight, idx) in project.highlights" :key="idx" class="flex items-start gap-3 p-4 bg-gradient-to-r from-slate-50 to-white rounded-xl border border-slate-100">
              <span class="w-6 h-6 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white text-xs flex-shrink-0 font-bold">{{ idx + 1 }}</span>
              <p class="text-sm text-slate-600 leading-relaxed">{{ highlight }}</p>
            </div>
          </div>
        </section>

        <section class="glass-card p-8">
          <h2 class="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
            <span>📖</span> 项目介绍
          </h2>
          <p class="text-slate-600 text-sm leading-relaxed">
            {{ project.description }}
          </p>
          <div class="mt-4 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-100">
            <p class="text-sm text-slate-700 leading-relaxed">
              该项目采用 Vue3 组合式 API + Node.js Express 全栈架构，使用 SQLite 作为数据库，Tailwind CSS 构建响应式界面。
              通过本地持久化与后端同步相结合，实现了高效、稳定、可扩展的个人博客系统解决方案。
            </p>
          </div>
        </section>
      </div>

      <div v-else class="text-center py-20">
        <span class="text-5xl mb-4 block">🔍</span>
        <p class="text-slate-500">项目不存在或已下线</p>
        <button @click="$router.push('/projects')" class="mt-4 px-4 py-2 bg-indigo-500 text-white rounded-lg text-sm hover:bg-indigo-600 transition-colors">
          返回项目列表
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const projects = [
  {
    id: 1,
    title: '机智的鱼博客系统',
    emoji: '🐟',
    gradient: 'bg-gradient-to-br from-amber-400 to-orange-500',
    status: '个人博客',
    statusClass: 'bg-amber-500',
    description: '基于 Vue3 + Node.js 的前后端分离个人博客系统，支持文章发布、分类标签、评论互动、说说发布等功能，具备本地持久化与后端数据同步能力。',
    techStack: ['Vue3', 'Vite', 'Tailwind CSS', 'Node.js', 'Express', 'SQLite', 'JavaScript'],
    highlights: [
      'Vue3 组合式 API + Vite 构建，开发体验流畅',
      '支持文章分类、标签关联、全文检索等功能',
      '实现评论系统和说说（短博客）发布功能',
      '本地持久化 + 后端同步，数据安全可靠',
      'Tailwind CSS 响应式设计，界面美观现代'
    ]
  },
  {
    id: 2,
    title: '心理健康AI助手',
    emoji: '🧠',
    gradient: 'bg-gradient-to-br from-green-500 to-teal-500',
    status: 'AI应用',
    statusClass: 'bg-green-500',
    description: '基于大语言模型的心理健康 AI 助手，为用户提供情绪疏导、心理建议和正念冥想引导。致力于降低心理健康服务门槛，让每个人都能随时获得心理支持。',
    techStack: ['Vue3', 'Element Plus', 'Vite', 'Node.js', 'Vue Router', 'Pinia', 'Axios', 'ECharts', 'Python', 'FastAPI'],
    highlights: [
      '集成大语言模型，实现自然流畅的心理咨询对话',
      '设计了情绪识别算法，实时感知用户情绪变化',
      '提供多种心理干预工具：呼吸训练、冥想引导、情绪日记',
      '严格遵循心理咨询伦理，设置专业危机干预机制'
    ]
  },
  {
    id: 3,
    title: '基于YOLOv10的智能补货系统',
    emoji: '📦',
    gradient: 'bg-gradient-to-br from-blue-500 to-cyan-500',
    status: '大创项目',
    statusClass: 'bg-blue-500',
    description: '基于 YOLOv10 目标检测算法和卷积神经网络，开发的智能零售补货系统。通过摄像头实时识别商品货架状态，自动检测缺货商品并生成补货订单，有效提升零售门店的运营效率。',
    techStack: ['Python', 'YOLOv10', 'PyTorch', 'OpenCV', 'Vue3', 'Spring Boot', 'MySQL'],
    highlights: [
      '使用 YOLOv10 实现商品检测，准确率达到 95% 以上',
      '设计了改进的 CNN 模型进行货架状态分类',
      '实现了实时视频流处理和商品定位功能',
      '构建了完整的补货决策系统，从检测到订单生成全流程自动化'
    ]
  },
  {
    id: 4,
    title: '潮风汕韵·智旅三城',
    emoji: '🏛️',
    gradient: 'bg-gradient-to-br from-purple-500 to-pink-500',
    status: '文旅项目',
    statusClass: 'bg-purple-500',
    description: '融合潮汕文化与智慧旅游的创新项目，通过数字化技术展现潮汕地区的历史文化魅力。为游客提供个性化的旅游路线推荐、文化景点讲解和互动体验。',
    techStack: ['Vue3', 'Element Plus', 'Vite', 'Node.js', 'MySQL', 'Redis', 'Vue Router', 'Pinia', 'Axios', 'ECharts'],
    highlights: [
      '整理并数字化潮汕三市的文化景点和历史资料',
      '开发智能路线推荐算法，根据用户偏好定制行程',
      '实现 AR 实景讲解功能，增强游客体验',
      '支持多端访问：Web、小程序、移动端'
    ]
  },
  {
    id: 5,
    title: '鲜兔城',
    emoji: '🐰',
    gradient: 'bg-gradient-to-br from-orange-400 to-red-500',
    status: '电商项目',
    statusClass: 'bg-orange-500',
    description: '面向年轻用户的生鲜电商平台，提供新鲜、优质、便捷的购物体验。支持线上下单、线下自提和快速配送，打造社区新零售模式。',
    techStack: ['Java', 'SSM', 'Spring Boot', 'MySQL', 'Navicat11', 'Vue3', 'HTML', 'CSS', 'JavaScript'],
    highlights: [
      '设计了高并发的商品秒杀系统',
      '实现了基于位置的智能配送调度',
      '搭建了完整的电商后端服务，包括订单、支付、物流',
      '优化了移动端用户体验，加载速度提升 50%'
    ]
  }
]

const project = computed(() => {
  const id = parseInt(route.params.id)
  return projects.find(p => p.id === id)
})
</script>
