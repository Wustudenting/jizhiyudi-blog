<template>
  <div class="pt-24">
    <div class="max-w-7xl mx-auto px-4">
      <!-- 头部 -->
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

      <!-- 数字概览：都来自语雀知识库的真实数据 -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div
          v-for="stat in stats"
          :key="stat.label"
          class="bg-white/70 backdrop-blur-sm rounded-2xl px-5 py-4 border border-white/80 shadow-sm"
        >
          <p class="text-3xl font-bold text-slate-800 leading-none">{{ stat.value }}</p>
          <p class="text-xs text-slate-500 mt-2">{{ stat.label }}</p>
          <p class="text-[11px] text-slate-400 mt-0.5">{{ stat.hint }}</p>
        </div>
      </div>

      <!-- 主图：技术沉淀分布 -->
      <section
        class="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/80 shadow-sm mb-6"
      >
        <div class="flex items-baseline justify-between mb-1">
          <h2 class="text-lg font-bold text-slate-800">技术沉淀分布</h2>
          <span class="text-xs text-slate-400">数据来源：语雀知识库</span>
        </div>
        <p class="text-xs text-slate-500 mb-4">
          各技术方向已经整理成笔记的文章数量 —— 写得越多，说明这块挖得越深
        </p>

        <BarChart
          v-if="articleStats.length"
          :items="articleStats"
          :row-height="38"
          :name-width="150"
          unit=" 篇"
        />
        <p v-else class="text-sm text-slate-400 py-8 text-center">
          正在读取语雀数据…
        </p>
      </section>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div class="lg:col-span-2 space-y-6">
          <!-- 技能矩阵 -->
          <section
            v-for="category in skillCategories"
            :key="category.name"
            class="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/80 shadow-sm hover:shadow-md transition-shadow"
          >
            <div class="flex items-center mb-5">
              <div
                :class="[
                  'w-10 h-10 rounded-xl flex items-center justify-center text-xl mr-3 shadow-sm',
                  category.iconBg,
                ]"
              >
                <span>{{ category.icon }}</span>
              </div>
              <div>
                <h2 class="text-lg font-bold text-slate-800">{{ category.name }}</h2>
                <p class="text-xs text-slate-400">{{ category.desc }}</p>
              </div>
            </div>

            <BarChart
              :items="category.skills"
              :row-height="32"
              :name-width="118"
              :max="100"
              unit="%"
            />
          </section>
        </div>

        <!-- 侧栏 -->
        <div class="lg:col-span-1 space-y-5">
          <div class="relative bg-gradient-to-br from-indigo-500 via-blue-500 to-purple-500 rounded-2xl p-6 text-white shadow-lg shadow-indigo-200/50 overflow-hidden">
            <div class="absolute -top-8 -right-8 w-32 h-32 bg-white/10 rounded-full"></div>
            <div class="absolute -bottom-12 -left-8 w-24 h-24 bg-white/5 rounded-full"></div>

            <div class="relative">
              <div class="flex items-center gap-3 mb-5">
                <div class="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-2xl">
                  📚
                </div>
                <div>
                  <p class="text-xs text-white/70">KNOWLEDGE BASE</p>
                  <h3 class="text-lg font-bold">知识库概览</h3>
                </div>
              </div>

              <div class="grid grid-cols-2 gap-2 text-center">
                <div class="bg-white/15 backdrop-blur-sm rounded-lg py-3">
                  <p class="text-2xl font-bold">{{ stats[0]?.value ?? '—' }}</p>
                  <p class="text-xs text-white/70">技术领域</p>
                </div>
                <div class="bg-white/15 backdrop-blur-sm rounded-lg py-3">
                  <p class="text-2xl font-bold">{{ stats[1]?.value ?? '—' }}</p>
                  <p class="text-xs text-white/70">篇笔记</p>
                </div>
              </div>

              <p class="text-xs text-white/70 leading-relaxed mt-4">
                笔记持续同步自语雀，内容更新后博客会跟着更新。
              </p>
            </div>
          </div>

          <!-- 最新笔记：真实数据，跳转到文章详情 -->
          <div class="bg-white/80 backdrop-blur-sm rounded-2xl p-5 border border-purple-100/60 shadow-sm">
            <div class="flex items-center gap-2 mb-4">
              <span class="text-base">💡</span>
              <h4 class="text-sm font-semibold text-slate-800">最新笔记</h4>
            </div>
            <div v-if="recentNotes.length" class="space-y-3">
              <router-link
                v-for="note in recentNotes"
                :key="note.id"
                :to="`/articles/${note.id}`"
                class="flex items-start gap-3 p-2.5 rounded-xl hover:bg-indigo-50/50 transition-colors group"
              >
                <span class="text-sm mt-0.5">📄</span>
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-medium text-slate-700 group-hover:text-indigo-600 transition-colors truncate">
                    {{ note.title }}
                  </p>
                  <p class="text-xs text-slate-400 truncate">
                    {{ note.category?.name || '未分类' }} · {{ formatDate(note.created_at) }}
                  </p>
                </div>
              </router-link>
            </div>
            <p v-else class="text-xs text-slate-400 py-4 text-center">正在读取…</p>
          </div>

          <!-- 工具箱 -->
          <section class="bg-white/70 backdrop-blur-sm rounded-2xl p-5 border border-white/80 shadow-sm">
            <div class="flex items-center gap-2 mb-4">
              <span class="text-base">🛠️</span>
              <h4 class="text-sm font-semibold text-slate-800">工具与其他</h4>
            </div>
            <div class="flex flex-wrap gap-2">
              <span
                v-for="tool in tools"
                :key="tool"
                class="px-3.5 py-1.5 bg-gradient-to-r from-slate-50 to-slate-100 text-slate-600 rounded-lg text-xs font-medium hover:from-indigo-50 hover:to-purple-50 hover:text-indigo-600 hover:shadow-sm transition-all cursor-default border border-slate-200/60"
              >
                {{ tool }}
              </span>
            </div>
          </section>

          <!-- 语言能力 -->
          <section class="bg-white/70 backdrop-blur-sm rounded-2xl p-5 border border-white/80 shadow-sm">
            <div class="flex items-center gap-2 mb-4">
              <span class="text-base">🌟</span>
              <h4 class="text-sm font-semibold text-slate-800">语言能力</h4>
            </div>
            <!-- 这一栏在侧边栏里很窄，保持单列，双列会被挤扁 -->
            <div class="space-y-3">
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
                    <p class="text-xs text-slate-400">CET-4</p>
                  </div>
                </div>
                <span class="px-2.5 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-medium">良好</span>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import BarChart from '../components/BarChart.vue'
import { yuqueApi } from '../service/yuqueApi'

/**
 * 技能清单与熟练度是自评，不来自语雀；
 * 语雀只提供「文章沉淀量」这类可核实的数据（见下方 articleStats）。
 *
 * 本轮按语雀实际覆盖做了调整：
 * - 新增 React（语雀 React 库 7 篇）、小程序/UniApp（2 篇）、Shell（linux和shell 库）
 * - Python（12 篇）与 Node.js（11 篇）是笔记量最大的两块，熟练度相应上调
 * - Python / FastAPI 从「AI 与扩展」移到「后端与数据库」—— 它们本来的定位就是后端
 */
const skillCategories = [
  {
    name: '前端开发',
    icon: '🎨',
    iconBg: 'bg-gradient-to-br from-blue-100 to-cyan-100',
    desc: '现代前端技术栈与小程序',
    skills: [
      { name: 'HTML5', value: 95 },
      { name: 'CSS3', value: 92 },
      { name: 'JavaScript', value: 90 },
      { name: 'Vue 3', value: 88 },
      { name: 'Tailwind CSS', value: 88 },
      { name: 'Vite', value: 85 },
      { name: 'Element Plus', value: 85 },
      { name: 'Pinia', value: 84 },
      { name: 'TypeScript', value: 82 },
      { name: 'ECharts', value: 80 },
      { name: '小程序 / UniApp', value: 78 },
      { name: 'React', value: 70 },
    ],
  },
  {
    name: '后端与数据库',
    icon: '⚙️',
    iconBg: 'bg-gradient-to-br from-purple-100 to-pink-100',
    desc: '服务端开发、API 设计与数据存储',
    skills: [
      { name: 'Python', value: 88 },
      { name: 'SQLite', value: 86 },
      { name: 'Node.js', value: 85 },
      { name: 'Express', value: 85 },
      { name: 'MySQL', value: 85 },
      { name: 'RESTful API', value: 84 },
      { name: 'Spring Boot', value: 82 },
      { name: 'FastAPI', value: 80 },
      { name: 'Java', value: 80 },
      { name: 'Redis', value: 78 },
    ],
  },
  {
    name: '工程化与运维',
    icon: '🔧',
    iconBg: 'bg-gradient-to-br from-orange-100 to-red-100',
    desc: '开发工具、版本控制与部署环境',
    skills: [
      { name: 'VS Code', value: 92 },
      { name: 'Git', value: 88 },
      { name: 'Chrome DevTools', value: 85 },
      { name: 'Postman', value: 84 },
      { name: 'Linux', value: 80 },
      { name: 'Nginx', value: 78 },
      { name: 'Shell', value: 76 },
      { name: 'Docker', value: 76 },
    ],
  },
  {
    name: 'AI 与数据',
    icon: '🤖',
    iconBg: 'bg-gradient-to-br from-emerald-100 to-teal-100',
    desc: '计算机视觉与数据处理',
    skills: [
      { name: 'YOLOv10', value: 75 },
      { name: 'OpenCV', value: 74 },
      { name: 'PyTorch', value: 72 },
      { name: 'Pandas', value: 70 },
    ],
  },
]

const tools = [
  'RESTful API', 'WebSocket', 'Chrome DevTools', 'Vant', 'UniApp', 'TypeScript',
  'Composition API', 'Vuex', 'Nuxt', 'GraphQL', 'JWT', 'Swagger',
  'Vercel', 'Railway', 'PM2', 'MongoDB', 'Nacos', 'Seata',
]

// ---- 以下都是语雀真实数据 ----
const articleStats = ref([])
const recentNotes = ref([])
const categoryCount = ref(0)
const articleCount = ref(0)

const skillCount = computed(() =>
  skillCategories.reduce((n, c) => n + c.skills.length, 0),
)

const stats = computed(() => [
  { value: categoryCount.value || '—', label: '技术领域', hint: '语雀知识库' },
  { value: articleCount.value || '—', label: '文章沉淀', hint: '已同步到博客' },
  { value: skillCount.value, label: '技能项', hint: '按熟练度自评' },
  { value: tools.length, label: '工具链', hint: '常用工具与框架' },
])

const formatDate = (s) => {
  if (!s) return ''
  const d = new Date(s)
  return Number.isNaN(d.getTime())
    ? ''
    : `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
}

onMounted(async () => {
  try {
    const [categories, articles] = await Promise.all([
      yuqueApi.getCategories(),
      yuqueApi.getArticles(),
    ])

    articleCount.value = articles.length
    categoryCount.value = categories.length
    articleStats.value = [...categories]
      .filter((c) => c.count > 0)
      .sort((a, b) => b.count - a.count)
      .map((c) => ({ name: c.name, value: c.count }))

    recentNotes.value = [...articles]
      .sort(
        (a, b) =>
          new Date(b.updated_at || b.created_at || 0) -
          new Date(a.updated_at || a.created_at || 0),
      )
      .slice(0, 4)
  } catch (e) {
    console.warn('读取语雀数据失败（可能还没跑过同步）：', e.message)
  }
})
</script>
