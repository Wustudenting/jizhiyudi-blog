<template>
  <div class="pt-24">
    <div class="max-w-7xl mx-auto px-4">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div class="lg:col-span-2">
          <div class="mb-8">
            <div class="flex items-center gap-3 mb-2">
              <span class="text-3xl">💎</span>
              <h1 class="text-3xl font-bold text-slate-800">专业技能</h1>
            </div>
            <p class="text-slate-500 flex items-center gap-2">
              <span class="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse"></span>
              持续学习，不断精进 · 全栈技术探索中
            </p>
          </div>

          <div class="space-y-6">
            <section v-for="category in skillCategories" :key="category.name" class="relative bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/80 shadow-sm hover:shadow-md transition-shadow">
              <div class="flex items-center mb-6">
                <div :class="['w-10 h-10 rounded-xl flex items-center justify-center text-xl mr-3 shadow-sm', category.iconBg]">
                  <span>{{ category.icon }}</span>
                </div>
                <div>
                  <h2 class="text-lg font-bold text-slate-800">{{ category.name }}</h2>
                  <p class="text-xs text-slate-400">{{ category.desc }}</p>
                </div>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                <div v-for="skill in category.skills" :key="skill.name" class="group">
                  <div class="flex items-center justify-between mb-1.5">
                    <div class="flex items-center">
                      <span class="text-base mr-2">{{ skill.icon }}</span>
                      <span class="text-slate-700 text-sm font-medium">{{ skill.name }}</span>
                    </div>
                    <span class="text-xs text-slate-400 font-mono">{{ skill.level }}%</span>
                  </div>
                  <div class="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      class="h-full rounded-full transition-all duration-700 group-hover:brightness-110 group-hover:scale-y-110"
                      :class="category.barColor"
                      :style="{ width: skill.level + '%' }"
                    ></div>
                  </div>
                </div>
              </div>
            </section>

            <section class="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/80 shadow-sm">
              <div class="flex items-center mb-5">
                <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-xl mr-3 shadow-sm">
                  <span>🛠️</span>
                </div>
                <div>
                  <h2 class="text-lg font-bold text-slate-800">工具与其他</h2>
                  <p class="text-xs text-slate-400">开发工具、辅助框架与环境</p>
                </div>
              </div>
              <div class="flex flex-wrap gap-2">
                <span v-for="tool in tools" :key="tool" class="px-3.5 py-1.5 bg-gradient-to-r from-slate-50 to-slate-100 text-slate-600 rounded-lg text-xs font-medium hover:from-indigo-50 hover:to-purple-50 hover:text-indigo-600 hover:shadow-sm transition-all cursor-default border border-slate-200/60">
                  {{ tool }}
                </span>
              </div>
            </section>

            <section class="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/80 shadow-sm">
              <div class="flex items-center mb-5">
                <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-xl mr-3 shadow-sm">
                  <span>🌟</span>
                </div>
                <div>
                  <h2 class="text-lg font-bold text-slate-800">语言能力</h2>
                  <p class="text-xs text-slate-400">沟通交流，跨越语言障碍</p>
                </div>
              </div>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div class="flex items-center justify-between p-4 bg-gradient-to-r from-slate-50 to-white rounded-xl border border-slate-100">
                  <div class="flex items-center gap-3">
                    <span class="text-2xl">🇨🇳</span>
                    <div>
                      <p class="font-medium text-slate-800 text-sm">中文</p>
                      <p class="text-xs text-slate-400">母语</p>
                    </div>
                  </div>
                  <span class="px-2.5 py-1 bg-emerald-50 text-emerald-600 rounded-full text-xs font-medium">精通</span>
                </div>
                <div class="flex items-center justify-between p-4 bg-gradient-to-r from-slate-50 to-white rounded-xl border border-slate-100">
                  <div class="flex items-center gap-3">
                    <span class="text-2xl">🇬🇧</span>
                    <div>
                      <p class="font-medium text-slate-800 text-sm">英语</p>
                      <p class="text-xs text-slate-400">CET-6</p>
                    </div>
                  </div>
                  <span class="px-2.5 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-medium">熟练</span>
                </div>
              </div>
            </section>
          </div>
        </div>

        <div class="lg:col-span-1 space-y-5">
          <div class="relative bg-gradient-to-br from-indigo-500 via-blue-500 to-purple-500 rounded-2xl p-6 text-white shadow-lg shadow-indigo-200/50 overflow-hidden">
            <div class="absolute -top-8 -right-8 w-32 h-32 bg-white/10 rounded-full"></div>
            <div class="absolute -bottom-12 -left-8 w-24 h-24 bg-white/5 rounded-full"></div>
            <div class="absolute top-12 right-12 w-2 h-2 bg-white/40 rounded-full"></div>
            <div class="absolute top-20 right-24 w-1.5 h-1.5 bg-white/30 rounded-full"></div>

            <div class="relative">
              <div class="flex items-center gap-3 mb-4">
                <div class="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-2xl">
                  📊
                </div>
                <div>
                  <p class="text-xs text-white/70">OVERVIEW</p>
                  <h3 class="text-lg font-bold">专业技能概览</h3>
                </div>
              </div>

              <div class="flex items-center justify-center my-5">
                <div class="relative w-28 h-28">
                  <svg class="w-full h-full -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="42" stroke="rgba(255,255,255,0.2)" stroke-width="8" fill="none"/>
                    <circle cx="50" cy="50" r="42" stroke="white" stroke-width="8" fill="none"
                      stroke-dasharray="263.89" stroke-dashoffset="52.78" stroke-linecap="round"/>
                  </svg>
                  <div class="absolute inset-0 flex flex-col items-center justify-center">
                    <span class="text-3xl font-bold">80%</span>
                    <span class="text-xs text-white/70">综合能力</span>
                  </div>
                </div>
              </div>

              <div class="grid grid-cols-3 gap-2 text-center">
                <div class="bg-white/15 backdrop-blur-sm rounded-lg py-2">
                  <p class="text-lg font-bold">40+</p>
                  <p class="text-xs text-white/70">技术栈</p>
                </div>
                <div class="bg-white/15 backdrop-blur-sm rounded-lg py-2">
                  <p class="text-lg font-bold">5</p>
                  <p class="text-xs text-white/70">项目经验</p>
                </div>
                <div class="bg-white/15 backdrop-blur-sm rounded-lg py-2">
                  <p class="text-lg font-bold">1</p>
                  <p class="text-xs text-white/70">年经验</p>
                </div>
              </div>
            </div>
          </div>

          <div class="bg-white/80 backdrop-blur-sm rounded-2xl p-5 border border-indigo-100/60 shadow-sm">
            <div class="flex items-start gap-3">
              <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center flex-shrink-0">
                <span class="text-base">📢</span>
              </div>
              <div class="flex-1 min-w-0">
                <h4 class="text-sm font-semibold text-slate-800 mb-1">公告</h4>
                <p class="text-xs text-slate-500 leading-relaxed">
                  近期正在优化技能展示与项目经历，新增 AI 全栈方向学习路线，敬请期待更多更新～
                </p>
                <div class="flex items-center gap-1.5 mt-2">
                  <span class="w-1 h-1 rounded-full bg-amber-400 animate-pulse"></span>
                  <span class="text-xs text-amber-600 font-medium">持续更新中</span>
                </div>
              </div>
            </div>
          </div>

          <div class="bg-white/80 backdrop-blur-sm rounded-2xl p-5 border border-purple-100/60 shadow-sm">
            <div class="flex items-center justify-between mb-4">
              <div class="flex items-center gap-2">
                <span class="text-base">💡</span>
                <h4 class="text-sm font-semibold text-slate-800">精选动态</h4>
              </div>
              <a href="#" class="text-xs text-indigo-500 hover:text-indigo-700 font-medium">更多</a>
            </div>
            <div class="space-y-3">
              <div class="flex items-start gap-3 p-2.5 rounded-xl hover:bg-indigo-50/50 transition-colors cursor-pointer group">
                <span class="text-sm mt-0.5">🚀</span>
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-medium text-slate-700 group-hover:text-indigo-600 transition-colors truncate">Vite 6.0 新特性解析</p>
                  <p class="text-xs text-slate-400 truncate">下一代前端构建工具性能飞跃</p>
                </div>
              </div>
              <div class="flex items-start gap-3 p-2.5 rounded-xl hover:bg-indigo-50/50 transition-colors cursor-pointer group">
                <span class="text-sm mt-0.5">🤖</span>
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-medium text-slate-700 group-hover:text-indigo-600 transition-colors truncate">AI 驱动的 Vue3 开发</p>
                  <p class="text-xs text-slate-400 truncate">探索智能代码生成与辅助</p>
                </div>
              </div>
              <div class="flex items-start gap-3 p-2.5 rounded-xl hover:bg-indigo-50/50 transition-colors cursor-pointer group">
                <span class="text-sm mt-0.5">🎯</span>
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-medium text-slate-700 group-hover:text-indigo-600 transition-colors truncate">Pinia 状态管理最佳实践</p>
                  <p class="text-xs text-slate-400 truncate">大型项目中的状态管理策略</p>
                </div>
              </div>
            </div>
          </div>

          <div class="bg-white/80 backdrop-blur-sm rounded-2xl p-5 border border-cyan-100/60 shadow-sm">
            <div class="flex items-center gap-2 mb-4">
              <span class="text-base">🎯</span>
              <h4 class="text-sm font-semibold text-slate-800">当前学习重点</h4>
            </div>
            <div class="space-y-3">
              <div>
                <div class="flex items-center justify-between mb-1.5">
                  <span class="text-xs font-medium text-slate-600">AI 应用开发</span>
                  <span class="text-xs text-indigo-500 font-mono">75%</span>
                </div>
                <div class="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div class="h-full bg-gradient-to-r from-indigo-400 to-purple-500 rounded-full" style="width: 75%"></div>
                </div>
              </div>
              <div>
                <div class="flex items-center justify-between mb-1.5">
                  <span class="text-xs font-medium text-slate-600">Node.js 进阶</span>
                  <span class="text-xs text-cyan-500 font-mono">82%</span>
                </div>
                <div class="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div class="h-full bg-gradient-to-r from-cyan-400 to-teal-500 rounded-full" style="width: 82%"></div>
                </div>
              </div>
              <div>
                <div class="flex items-center justify-between mb-1.5">
                  <span class="text-xs font-medium text-slate-600">TypeScript</span>
                  <span class="text-xs text-emerald-500 font-mono">68%</span>
                </div>
                <div class="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div class="h-full bg-gradient-to-r from-emerald-400 to-green-500 rounded-full" style="width: 68%"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const skillCategories = [
  {
    name: '前端开发',
    icon: '🎨',
    iconBg: 'bg-gradient-to-br from-blue-100 to-cyan-100',
    barColor: 'bg-gradient-to-r from-blue-500 to-cyan-500',
    desc: '精通现代前端技术栈',
    skills: [
      { name: 'HTML5', icon: '📄', level: 95 },
      { name: 'CSS3', icon: '🎨', level: 92 },
      { name: 'JavaScript', icon: '📜', level: 90 },
      { name: 'TypeScript', icon: '🔷', level: 82 },
      { name: 'Vue3', icon: '💚', level: 88 },
      { name: 'ES6+', icon: '✨', level: 85 },
      { name: 'Ajax', icon: '🔄', level: 88 },
      { name: 'Element Plus', icon: '📦', level: 85 },
      { name: 'Vue Router', icon: '🧭', level: 86 },
      { name: 'Pinia', icon: '🏪', level: 84 },
      { name: 'Axios', icon: '📡', level: 87 },
      { name: 'Tailwind CSS', icon: '🌊', level: 88 },
      { name: 'SCSS/Sass', icon: '💅', level: 82 },
      { name: 'ECharts', icon: '📊', level: 80 },
      { name: 'Vite', icon: '⚡', level: 85 },
      { name: 'Webpack', icon: '📦', level: 80 },
    ]
  },
  {
    name: '后端开发',
    icon: '⚙️',
    iconBg: 'bg-gradient-to-br from-purple-100 to-pink-100',
    barColor: 'bg-gradient-to-r from-purple-500 to-pink-500',
    desc: '服务端开发与API设计',
    skills: [
      { name: 'Node.js', icon: '🟢', level: 82 },
      { name: 'Express', icon: '🚂', level: 85 },
      { name: 'Java', icon: '☕', level: 80 },
      { name: 'SSM', icon: '🏛️', level: 78 },
      { name: 'Spring Boot', icon: '🍃', level: 82 },
      { name: 'MySQL', icon: '🗄️', level: 85 },
      { name: 'SQLite', icon: '🗃️', level: 86 },
      { name: 'C++', icon: '🔵', level: 75 },
      { name: 'Redis', icon: '🔴', level: 78 },
    ]
  },
  {
    name: '工程化与工具',
    icon: '🔧',
    iconBg: 'bg-gradient-to-br from-orange-100 to-red-100',
    barColor: 'bg-gradient-to-r from-orange-500 to-red-500',
    desc: '开发工具与协作',
    skills: [
      { name: 'Git', icon: '🌱', level: 88 },
      { name: 'VS Code', icon: '💻', level: 92 },
      { name: 'Docker', icon: '🐳', level: 76 },
      { name: 'Nginx', icon: '🟩', level: 78 },
      { name: 'Linux', icon: '🐧', level: 80 },
      { name: 'Postman', icon: '📮', level: 84 },
      { name: 'Navicat11', icon: '🗄️', level: 82 },
    ]
  },
  {
    name: 'AI 与扩展',
    icon: '🤖',
    iconBg: 'bg-gradient-to-br from-emerald-100 to-teal-100',
    barColor: 'bg-gradient-to-r from-emerald-500 to-teal-500',
    desc: 'AI应用与跨界技术',
    skills: [
      { name: 'Python', icon: '🐍', level: 85 },
      { name: 'FastAPI', icon: '⚡', level: 80 },
      { name: 'YOLOv10', icon: '👁️', level: 75 },
      { name: 'PyTorch', icon: '🔥', level: 72 },
      { name: 'OpenCV', icon: '📷', level: 74 },
    ]
  }
]

const tools = [
  'RESTful API', 'WebSocket', 'Chrome DevTools', 'Vant', 'UniApp', 'TypeScript',
  'Composition API', 'Vuex', 'Nuxt', 'GraphQL', 'JWT', 'Swagger',
  'Vercel', 'Railway', 'PM2', 'MongoDB', 'Nacos', 'Seata'
]
</script>
