<template>
  <div class="pt-24">
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div class="lg:col-span-2">
        <div class="max-w-4xl mx-auto">
          <div class="mb-8">
            <h1 class="text-3xl font-bold text-slate-800 mb-2">专业技能</h1>
            <p class="text-slate-500">持续学习，不断精进</p>
          </div>

          <div class="space-y-6">
            <section v-for="category in skillCategories" :key="category.name" class="glass-card p-6">
              <div class="flex items-center mb-6">
                <span class="text-2xl mr-3">{{ category.icon }}</span>
                <h2 class="text-xl font-bold text-slate-800">{{ category.name }}</h2>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div v-for="skill in category.skills" :key="skill.name" class="group">
                  <div class="flex items-center justify-between mb-2">
                    <div class="flex items-center">
                      <span class="text-lg mr-2">{{ skill.icon }}</span>
                      <span class="text-slate-700 font-medium">{{ skill.name }}</span>
                    </div>
                    <span class="text-sm text-slate-500">{{ skill.level }}%</span>
                  </div>
                  <div class="h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div 
                      class="h-full rounded-full transition-all duration-500 group-hover:brightness-110"
                      :class="category.barColor"
                      :style="{ width: skill.level + '%' }"
                    ></div>
                  </div>
                </div>
              </div>
            </section>

            <section class="glass-card p-6">
              <div class="flex items-center mb-6">
                <span class="text-2xl mr-3">🛠️</span>
                <h2 class="text-xl font-bold text-slate-800">工具与其他</h2>
              </div>
              <div class="flex flex-wrap gap-3">
                <span v-for="tool in tools" :key="tool" class="px-4 py-2 bg-gradient-to-r from-slate-100 to-slate-50 text-slate-700 rounded-full text-sm font-medium hover:from-indigo-50 hover:to-purple-50 hover:text-indigo-600 transition-all cursor-default">
                  {{ tool }}
                </span>
              </div>
            </section>

            <section class="glass-card p-6">
              <div class="flex items-center mb-6">
                <span class="text-2xl mr-3">🌟</span>
                <h2 class="text-xl font-bold text-slate-800">语言能力</h2>
              </div>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div class="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                  <div>
                    <p class="font-medium text-slate-800">中文</p>
                    <p class="text-sm text-slate-500">母语</p>
                  </div>
                  <span class="px-3 py-1 bg-green-100 text-green-600 rounded-full text-sm">精通</span>
                </div>
                <div class="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                  <div>
                    <p class="font-medium text-slate-800">英语</p>
                    <p class="text-sm text-slate-500">CET-6</p>
                  </div>
                  <span class="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm">熟练</span>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>

      <SideBar />
    </div>
  </div>
</template>

<script setup>
import SideBar from '../components/SideBar.vue'

const skillCategories = [
  {
    name: '前端开发',
    icon: '🎨',
    barColor: 'bg-gradient-to-r from-blue-500 to-cyan-500',
    skills: [
      { name: 'HTML5', icon: '📄', level: 95 },
      { name: 'CSS3', icon: '🎨', level: 92 },
      { name: 'JavaScript', icon: '📜', level: 90 },
      { name: 'Vue3', icon: '💚', level: 88 },
      { name: 'ES6+', icon: '✨', level: 85 },
      { name: 'Ajax', icon: '🔄', level: 88 },
      { name: 'Element Plus', icon: '📦', level: 85 },
      { name: 'Vue Router', icon: '🧭', level: 86 },
      { name: 'Pinia', icon: '🏪', level: 84 },
      { name: 'Axios', icon: '📡', level: 87 },
      { name: 'SCSS', icon: '💅', level: 82 },
      { name: 'ECharts', icon: '📊', level: 80 }
    ]
  },
  {
    name: '后端开发',
    icon: '⚙️',
    barColor: 'bg-gradient-to-r from-purple-500 to-pink-500',
    skills: [
      { name: 'Node.js', icon: '🟢', level: 82 },
      { name: 'Java', icon: '☕', level: 80 },
      { name: 'SSM', icon: '🏛️', level: 78 },
      { name: 'Spring Boot', icon: '🍃', level: 82 },
      { name: 'MySQL', icon: '🗄️', level: 85 },
      { name: 'C++', icon: '🔵', level: 75 }
    ]
  },
  {
    name: '工程化与工具',
    icon: '🔧',
    barColor: 'bg-gradient-to-r from-orange-500 to-red-500',
    skills: [
      { name: 'Git', icon: '🌱', level: 88 },
      { name: 'Webpack', icon: '📦', level: 80 },
      { name: 'Vite', icon: '⚡', level: 85 },
      { name: 'Navicat11', icon: '🗃️', level: 82 }
    ]
  }
]

const tools = [
  'VS Code', 'Postman', 'Chrome DevTools', 'Docker', 'Nginx', 
  'Linux', 'TypeScript', 'Tailwind CSS', 'Vant', 'RESTful API', 'WebSocket'
]
</script>
