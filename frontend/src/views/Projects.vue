<template>
  <div class="pt-24">
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div class="lg:col-span-2">
        <div class="max-w-4xl mx-auto">
          <div class="mb-8">
            <h1 class="text-3xl font-bold text-slate-800 mb-2">项目经历</h1>
            <p class="text-slate-500">以下是我参与或主导开发的一些项目</p>
          </div>

          <div class="space-y-6">
            <article v-for="project in projects" :key="project.id" class="glass-card p-6 hover:shadow-lg transition-shadow">
              <div class="flex flex-col md:flex-row gap-6">
                <div class="w-full md:w-48 h-32 rounded-xl bg-gradient-to-br flex items-center justify-center flex-shrink-0" :class="project.gradient">
                  <span class="text-4xl">{{ project.emoji }}</span>
                </div>
                <div class="flex-1">
                  <div class="flex flex-wrap items-start justify-between gap-2 mb-2">
                    <h2 class="text-xl font-bold text-slate-800">{{ project.title }}</h2>
                    <span class="px-2 py-1 rounded text-xs text-white" :class="project.statusClass">{{ project.status }}</span>
                  </div>
                  <p class="text-slate-600 text-sm mb-4 leading-relaxed">{{ project.description }}</p>
                  <div class="flex flex-wrap gap-2 mb-4">
                    <span v-for="tech in project.techStack" :key="tech" class="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded">
                      {{ tech }}
                    </span>
                  </div>
                  <div v-if="project.highlights" class="border-t border-slate-100 pt-4">
                    <p class="text-xs text-slate-500 mb-2 font-medium">✨ 项目亮点</p>
                    <ul class="text-sm text-slate-600 space-y-1">
                      <li v-for="(highlight, idx) in project.highlights" :key="idx" class="flex items-start">
                        <span class="text-indigo-500 mr-2">•</span>
                        <span>{{ highlight }}</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </article>
          </div>
        </div>
      </div>

      <SideBar />
    </div>
  </div>
</template>

<script setup>
import SideBar from '../components/SideBar.vue'

const projects = [
  {
    id: 1,
    title: '基于YOLOv10和卷积神经网络的智能补货系统',
    emoji: '📦',
    gradient: 'from-blue-500 to-cyan-500',
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
    id: 2,
    title: '潮风汕韵·智旅三城',
    emoji: '🏛️',
    gradient: 'from-purple-500 to-pink-500',
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
    id: 3,
    title: '小兔鲜',
    emoji: '🐰',
    gradient: 'from-orange-400 to-red-500',
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
  },
  {
    id: 4,
    title: '心理健康AI助手',
    emoji: '🧠',
    gradient: 'from-green-500 to-teal-500',
    status: 'AI应用',
    statusClass: 'bg-green-500',
    description: '基于大语言模型的心理健康 AI 助手，为用户提供情绪疏导、心理建议和正念冥想引导。致力于降低心理健康服务门槛，让每个人都能随时获得心理支持。',
    techStack: ['Vue3', 'Element Plus', 'Vite', 'Node.js', 'Vue Router', 'SCSS', 'Pinia', 'Axios', 'ECharts', 'Python', 'FastAPI'],
    highlights: [
      '集成大语言模型，实现自然流畅的心理咨询对话',
      '设计了情绪识别算法，实时感知用户情绪变化',
      '提供多种心理干预工具：呼吸训练、冥想引导、情绪日记',
      '严格遵循心理咨询伦理，设置专业危机干预机制'
    ]
  }
]
</script>
