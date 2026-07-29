<template>
  <div class="pt-24">
    <div class="max-w-6xl mx-auto px-4 pb-12">
      <div class="mb-10 text-center md:text-left">
        <div class="flex items-center justify-center md:justify-start gap-3 mb-2">
          <span class="text-3xl">🚀</span>
          <h1 class="text-3xl font-bold text-slate-800">项目经历</h1>
        </div>
        <p class="text-slate-500">以下是我参与或主导开发的一些项目 · 点击卡片查看详情</p>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <router-link
          v-for="project in projects"
          :key="project.id"
          :to="`/projects/${project.id}`"
          class="group relative bg-white/70 backdrop-blur-sm rounded-2xl p-5 border border-white/80 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer overflow-hidden"
        >
          <div class="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br opacity-5 rounded-full blur-xl -translate-y-6 translate-x-6" :class="project.gradient"></div>

          <div class="relative">
            <div class="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center mb-4 shadow-sm border border-amber-100">
              <span class="text-2xl">{{ project.emoji }}</span>
            </div>

            <h3 class="text-base font-bold text-slate-800 mb-1.5 line-clamp-1">{{ project.title }}</h3>

            <p class="text-xs text-slate-500 leading-relaxed line-clamp-2 mb-4">
              {{ project.description }}
            </p>

            <div class="flex flex-wrap gap-1.5 mb-4">
              <span v-for="tech in project.techStack.slice(0, 3)" :key="tech" class="px-2 py-0.5 bg-slate-50 text-slate-500 rounded text-xs border border-slate-100">
                {{ tech }}
              </span>
              <span v-if="project.techStack.length > 3" class="px-2 py-0.5 bg-slate-50 text-slate-400 rounded text-xs border border-slate-100">
                +{{ project.techStack.length - 3 }}
              </span>
            </div>

            <div class="flex items-center justify-between pt-3 border-t border-slate-100">
              <span class="px-2.5 py-0.5 rounded-full text-xs text-white" :class="project.statusClass">{{ project.status }}</span>
              <span class="text-xs text-indigo-500 font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                查看项目详情
                <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </span>
            </div>
          </div>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
const projects = [
  {
    id: 1,
    title: '机智的鱼博客系统',
    emoji: '🐟',
    gradient: 'from-amber-400 to-orange-500',
    status: '个人博客',
    statusClass: 'bg-amber-500',
    description: '基于 Vue3 + Node.js 的前后端分离个人博客系统，支持文章发布、分类标签、评论互动、说说发布等功能',
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
    gradient: 'from-green-500 to-teal-500',
    status: 'AI应用',
    statusClass: 'bg-green-500',
    description: '基于大语言模型的心理健康 AI 助手，提供情绪疏导与正念冥想引导',
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
    gradient: 'from-blue-500 to-cyan-500',
    status: '大创项目',
    statusClass: 'bg-blue-500',
    description: '基于 YOLOv10 目标检测和卷积神经网络的智能零售补货系统',
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
    gradient: 'from-purple-500 to-pink-500',
    status: '文旅项目',
    statusClass: 'bg-purple-500',
    description: '融合潮汕文化与智慧旅游的创新项目，数字化展现潮汕文化魅力',
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
    gradient: 'from-orange-400 to-red-500',
    status: '电商项目',
    statusClass: 'bg-orange-500',
    description: '面向年轻用户的生鲜电商平台，支持线上下单、线下自提和快速配送',
    techStack: ['Java', 'SSM', 'Spring Boot', 'MySQL', 'Vue3', 'HTML', 'CSS', 'JavaScript'],
    highlights: [
      '设计了高并发的商品秒杀系统',
      '实现了基于位置的智能配送调度',
      '搭建了完整的电商后端服务，包括订单、支付、物流',
      '优化了移动端用户体验，加载速度提升 50%'
    ]
  }
]
</script>
