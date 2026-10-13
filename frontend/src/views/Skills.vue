<template>
  <div class="pt-24">
    <div class="max-w-7xl mx-auto px-4">
      <!-- 头部 -->
      <div class="mb-8">
        <div class="flex items-center gap-3 mb-2">
          <span class="text-3xl">💎</span>
          <h1 class="text-3xl font-bold text-slate-800 dark:text-slate-100">专业技能</h1>
        </div>
        <p class="text-slate-500 dark:text-slate-400 flex items-center gap-2">
          <span class="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse"></span>
          持续学习，不断精进 · 全栈技术探索中
        </p>
      </div>

      <!-- 数字概览：都来自语雀知识库的真实数据 -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div
          v-for="stat in stats"
          :key="stat.label"
          class="bg-white/70 dark:bg-slate-800/60 backdrop-blur-sm rounded-2xl px-5 py-4 border border-white/80 dark:border-slate-700/50 shadow-sm"
        >
          <p class="text-3xl font-bold text-slate-800 dark:text-slate-100 leading-none">{{ stat.value }}</p>
          <p class="text-xs text-slate-500 dark:text-slate-400 mt-2">{{ stat.label }}</p>
          <p class="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">{{ stat.hint }}</p>
        </div>
      </div>

      <!-- 图表区：两张，形态不同（横向条形 / 柱 + 面积线） -->
      <div class="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
        <section
          class="bg-white/70 dark:bg-slate-800/60 backdrop-blur-sm rounded-2xl p-6 border border-white/80 dark:border-slate-700/50 shadow-sm"
        >
          <div class="flex items-baseline justify-between mb-1">
            <h2 class="text-lg font-bold text-slate-800 dark:text-slate-100">技术沉淀分布</h2>
            <span class="text-xs text-slate-400 dark:text-slate-500">语雀知识库</span>
          </div>
          <p class="text-xs text-slate-500 dark:text-slate-400 mb-4">
            各方向已整理成笔记的文章数 —— 写得越多，说明这块挖得越深
          </p>

          <BarChart
            v-if="articleStats.length"
            :items="articleStats"
            :row-height="36"
            :name-width="140"
            unit=" 篇"
          />
          <p v-else class="text-sm text-slate-400 dark:text-slate-500 py-8 text-center">
            正在读取语雀数据…
          </p>
        </section>

        <section
          class="bg-white/70 dark:bg-slate-800/60 backdrop-blur-sm rounded-2xl p-6 border border-white/80 dark:border-slate-700/50 shadow-sm"
        >
          <div class="flex items-baseline justify-between mb-1">
            <h2 class="text-lg font-bold text-slate-800 dark:text-slate-100">笔记积累趋势</h2>
            <span class="text-xs text-slate-400 dark:text-slate-500">按创建月份</span>
          </div>
          <p class="text-xs text-slate-500 dark:text-slate-400 mb-4">
            柱是当月新增，线是累计总量 —— 看的是写作节奏，不是单篇长短
          </p>

          <TrendChart v-if="trendPoints.length" :points="trendPoints" :height="286" />
          <p v-else class="text-sm text-slate-400 dark:text-slate-500 py-8 text-center">
            正在读取语雀数据…
          </p>
        </section>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div class="lg:col-span-2 space-y-6">
          <!-- 技能矩阵。这里刻意用进度条(meter)而不是图表：
               熟练度是「一个比值对上限(100%)」，规范里对应的形态就是 meter，
               而且四个分类各来一张条形图本来就会长得一模一样。 -->
          <section
            v-for="category in skillCategories"
            :key="category.name"
            class="bg-white/70 dark:bg-slate-800/60 backdrop-blur-sm rounded-2xl p-6 border border-white/80 dark:border-slate-700/50 shadow-sm hover:shadow-md transition-shadow"
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
                <h2 class="text-lg font-bold text-slate-800 dark:text-slate-100">{{ category.name }}</h2>
                <p class="text-xs text-slate-400 dark:text-slate-500">{{ category.desc }}</p>
              </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
              <div v-for="skill in category.skills" :key="skill.name" class="group">
                <div class="flex items-center justify-between mb-1.5">
                  <span class="text-slate-700 dark:text-slate-300 text-sm font-medium">{{ skill.name }}</span>
                  <span class="text-xs text-slate-400 dark:text-slate-500 font-mono">{{ skill.value }}%</span>
                </div>
                <div class="h-1.5 bg-slate-100 dark:bg-slate-700/60 rounded-full overflow-hidden">
                  <div
                    class="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-700 group-hover:brightness-110"
                    :style="{ width: skill.value + '%' }"
                  ></div>
                </div>
              </div>
            </div>
          </section>
        </div>

        <!-- 侧栏 -->
        <div class="lg:col-span-1 space-y-5">
          <div class="relative bg-gradient-to-br from-indigo-500 via-blue-500 to-purple-500 rounded-2xl p-6 text-white shadow-lg shadow-indigo-200/50 dark:shadow-indigo-950/50 overflow-hidden">
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
          <div class="bg-white/80 dark:bg-slate-800/60 backdrop-blur-sm rounded-2xl p-5 border border-purple-100/60 dark:border-slate-700/50 shadow-sm">
            <div class="flex items-center gap-2 mb-4">
              <span class="text-base">💡</span>
              <h4 class="text-sm font-semibold text-slate-800 dark:text-slate-100">最新笔记</h4>
            </div>
            <div v-if="recentNotes.length" class="space-y-3">
              <router-link
                v-for="note in recentNotes"
                :key="note.id"
                :to="`/articles/${note.id}`"
                class="flex items-start gap-3 p-2.5 rounded-xl hover:bg-indigo-50/50 dark:hover:bg-slate-700/50 transition-colors group"
              >
                <span class="text-sm mt-0.5">📄</span>
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-medium text-slate-700 dark:text-slate-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-300 transition-colors truncate">
                    {{ note.title }}
                  </p>
                  <p class="text-xs text-slate-400 dark:text-slate-500 truncate">
                    {{ note.category?.name || '未分类' }} · {{ formatDate(note.created_at) }}
                  </p>
                </div>
              </router-link>
            </div>
            <p v-else class="text-xs text-slate-400 dark:text-slate-500 py-4 text-center">正在读取…</p>
          </div>

          <!-- 工具箱 -->
          <section class="bg-white/70 dark:bg-slate-800/60 backdrop-blur-sm rounded-2xl p-5 border border-white/80 dark:border-slate-700/50 shadow-sm">
            <div class="flex items-center gap-2 mb-4">
              <span class="text-base">🛠️</span>
              <h4 class="text-sm font-semibold text-slate-800 dark:text-slate-100">工具与其他</h4>
            </div>
            <div class="flex flex-wrap gap-2">
              <span
                v-for="tool in tools"
                :key="tool"
                class="px-3.5 py-1.5 bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-700/50 dark:to-slate-700/30 text-slate-600 dark:text-slate-300 rounded-lg text-xs font-medium hover:from-indigo-50 hover:to-purple-50 dark:hover:from-indigo-500/20 dark:hover:to-purple-500/20 hover:text-indigo-600 dark:hover:text-indigo-300 hover:shadow-sm transition-all cursor-default border border-slate-200/60 dark:border-slate-600/40"
              >
                {{ tool }}
              </span>
            </div>
          </section>

          <!-- 语言能力 -->
          <section class="bg-white/70 dark:bg-slate-800/60 backdrop-blur-sm rounded-2xl p-5 border border-white/80 dark:border-slate-700/50 shadow-sm">
            <div class="flex items-center gap-2 mb-4">
              <span class="text-base">🌟</span>
              <h4 class="text-sm font-semibold text-slate-800 dark:text-slate-100">语言能力</h4>
            </div>
            <!-- 这一栏在侧边栏里很窄，保持单列，双列会被挤扁 -->
            <div class="space-y-3">
              <div class="flex items-center justify-between p-4 bg-gradient-to-r from-slate-50 to-white dark:from-slate-700/40 dark:to-slate-800/20 rounded-xl border border-slate-100 dark:border-slate-700/40">
                <div class="flex items-center gap-3">
                  <span class="text-2xl">🇨🇳</span>
                  <div>
                    <p class="font-medium text-slate-800 dark:text-slate-100 text-sm">中文</p>
                    <p class="text-xs text-slate-400 dark:text-slate-500">母语</p>
                  </div>
                </div>
                <span class="px-2.5 py-1 bg-emerald-50 dark:bg-emerald-500/15 text-emerald-600 dark:text-emerald-300 rounded-full text-xs font-medium">精通</span>
              </div>
              <div class="flex items-center justify-between p-4 bg-gradient-to-r from-slate-50 to-white dark:from-slate-700/40 dark:to-slate-800/20 rounded-xl border border-slate-100 dark:border-slate-700/40">
                <div class="flex items-center gap-3">
                  <span class="text-2xl">🇬🇧</span>
                  <div>
                    <p class="font-medium text-slate-800 dark:text-slate-100 text-sm">英语</p>
                    <p class="text-xs text-slate-400 dark:text-slate-500">CET-4</p>
                  </div>
                </div>
                <span class="px-2.5 py-1 bg-blue-50 dark:bg-blue-500/15 text-blue-600 dark:text-blue-300 rounded-full text-xs font-medium">良好</span>
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
import TrendChart from '../components/TrendChart.vue'
import { yuqueApi } from '../service/yuqueApi'

/**
 * 技能清单与熟练度是自评，不来自语雀；
 * 语雀只提供「文章沉淀量」这类可核实的数据（见下方 articleStats / trendPoints）。
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
    iconBg: 'bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-blue-500/25 dark:to-cyan-500/25',
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
    iconBg: 'bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-500/25 dark:to-pink-500/25',
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
    iconBg: 'bg-gradient-to-br from-orange-100 to-red-100 dark:from-orange-500/25 dark:to-red-500/25',
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
    iconBg: 'bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-500/25 dark:to-teal-500/25',
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
const trendPoints = ref([])
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

    // 按月聚合：柱=当月新增，线=累计。累计是逐月累加出来的，不是另算的。
    const perMonth = {}
    for (const a of articles) {
      const d = new Date(a.created_at || a.updated_at)
      if (Number.isNaN(d.getTime())) continue
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
      perMonth[key] = (perMonth[key] || 0) + 1
    }
    let running = 0
    trendPoints.value = Object.keys(perMonth)
      .sort()
      .map((key) => {
        running += perMonth[key]
        return { label: `${Number(key.slice(5))}月`, monthly: perMonth[key], cumulative: running }
      })

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
