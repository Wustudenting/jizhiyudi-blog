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
          class="bg-white/70 dark:bg-slate-800/60 backdrop-blur-sm rounded-2xl px-5 py-4 border border-white/80 dark:border-slate-700/50 shadow-sm card-hover"
        >
          <p class="text-3xl font-bold text-slate-800 dark:text-slate-100 leading-none">{{ stat.value }}</p>
          <p class="text-xs text-slate-500 dark:text-slate-400 mt-2">{{ stat.label }}</p>
          <p class="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">{{ stat.hint }}</p>
        </div>
      </div>

      <!-- 图表区：两张，形态不同（横向条形 / 柱 + 面积线） -->
      <div class="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
        <section
          class="bg-white/70 dark:bg-slate-800/60 backdrop-blur-sm rounded-2xl p-6 border border-white/80 dark:border-slate-700/50 shadow-sm card-hover"
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
          class="bg-white/70 dark:bg-slate-800/60 backdrop-blur-sm rounded-2xl p-6 border border-white/80 dark:border-slate-700/50 shadow-sm card-hover"
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

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <!-- 学习方向构成 -->
        <section
          class="lg:col-span-2 bg-white/70 dark:bg-slate-800/60 backdrop-blur-sm rounded-2xl p-6 border border-white/80 dark:border-slate-700/50 shadow-sm card-hover"
        >
          <div class="flex items-baseline justify-between mb-1">
            <h2 class="text-lg font-bold text-slate-800 dark:text-slate-100">学习方向占比</h2>
            <span class="text-xs text-slate-400 dark:text-slate-500">语雀知识库</span>
          </div>
          <p class="text-xs text-slate-500 dark:text-slate-400 mb-4">
            把知识库按方向归堆后的笔记篇数 —— 在语雀新开一个方向（比如大模型开发），这里会自动长出来
          </p>

          <DonutChart
            v-if="directionStats.length"
            :items="directionStats"
            center-label="篇笔记"
            unit=" 篇"
            :height="300"
          />
          <p v-else class="text-sm text-slate-400 dark:text-slate-500 py-8 text-center">
            正在读取语雀数据…
          </p>

          <!--
            表格视图。两个作用：
            1. 环形图只负责「一眼看构成」，要读准数字看这里
            2. 浅色模式下青 / 黄 / 品红三个色槽的对比度低于 3:1，
               规范要求必须配可见标注或表格视图作为兜底
          -->
          <ul
            v-if="directionStats.length"
            class="mt-4 border-t border-slate-100 divide-y divide-slate-100 dark:border-slate-700/50 dark:divide-slate-700/50"
          >
            <li v-for="d in directionStats" :key="d.name" class="flex items-center gap-3 py-2.5">
              <span
                class="h-2.5 w-2.5 shrink-0 rounded-full"
                :style="{ background: donutColors[d.slot] }"
              ></span>
              <span class="flex-1 text-sm text-slate-600 dark:text-slate-300">{{ d.name }}</span>
              <span class="font-mono text-sm text-slate-500 dark:text-slate-400">{{ d.value }} 篇</span>
              <span class="w-16 text-right font-mono text-sm text-slate-400 dark:text-slate-500">
                {{ percentOf(d.value) }}%
              </span>
            </li>
          </ul>
        </section>

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
          <div class="bg-white/80 dark:bg-slate-800/60 backdrop-blur-sm rounded-2xl p-5 border border-purple-100/60 dark:border-slate-700/50 shadow-sm card-hover">
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

        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import BarChart from '../components/BarChart.vue'
import TrendChart from '../components/TrendChart.vue'
// 色板从环形图组件里拿同一份，别在这儿另抄一遍 —— 抄了就迟早会不一致
import DonutChart, { DONUT_PALETTE } from '../components/DonutChart.vue'
import { useTheme } from '../composables/useTheme'
import { yuqueApi } from '../service/yuqueApi'

/**
 * 学习方向的归类规则。环形图的数据源，全部来自语雀真实篇数。
 *
 * 用关键词匹配而不是写死「知识库名 → 方向」的映射表：以后在语雀新开一个
 * 方向（比如「大模型开发」），只要名字里带关键词就会自动出现在环里，
 * 不用回来改代码 —— 这正是当初把自评进度条换成环形图的原因。
 *
 * 顺序有意义：**先匹配更具体的方向**，别让宽泛的词把人家抢走。
 * 比如「AI开发全能开发技术之数据库」既沾 AI 又是数据库，
 * 放在大模型规则里不带裸的 'ai'，就是为了让它老实落进「后端与数据库」。
 *
 * slot 是色板里的固定槽位 —— 颜色跟着方向走，不跟着篇数排序走。
 * 否则某个方向笔记变多、排名一变，所有扇区就会集体换色。
 */
const DIRECTION_RULES = [
  {
    name: '大模型开发',
    slot: 0,
    keywords: ['大模型', 'llm', 'prompt', 'agent', 'rag', 'langchain', 'langgraph', 'transformer', '微调'],
  },
  {
    name: '前端开发',
    slot: 1,
    keywords: ['react', 'vue', 'typescript', 'javascript', 'css', 'html', '小程序', 'uniapp', '前端', 'ts'],
  },
  {
    name: '后端与数据库',
    slot: 2,
    keywords: ['python', 'node', 'fastapi', 'mysql', '数据库', 'java', 'redis', 'spring', 'sql', '后端'],
  },
  {
    name: '工程化与运维',
    slot: 3,
    keywords: ['linux', 'shell', 'git', 'docker', 'nginx', '运维', '工程化', '部署'],
  },
]

const DIRECTION_FALLBACK = { name: '其他', slot: 4 }

/** 知识库名 → 方向名；一条都没命中就归「其他」 */
const matchDirection = (bookName) => {
  const s = String(bookName || '').toLowerCase()
  const hit = DIRECTION_RULES.find((r) => r.keywords.some((k) => s.includes(k)))
  return hit ? hit.name : DIRECTION_FALLBACK.name
}

// ---- 以下都是语雀真实数据 ----
const articleStats = ref([])
const totalWords = ref(0)
const trendPoints = ref([])
const recentNotes = ref([])
const categoryCount = ref(0)
const articleCount = ref(0)

/**
 * 环形图数据：知识库 → 方向 → 篇数合计。
 *
 * 输出保持**规则表的固定顺序**，不按篇数从多到少重排。两个原因：
 *  1. 颜色按 slot 走，跟着方向不跟着排名 —— 排序一变，扇区颜色会集体错位
 *  2. 扇区相邻关系也要稳定。色板验证的是「相邻槽位」那一组配对；
 *     一旦按篇数重排，橙色和黄色可能贴到一起，那对恰恰是没过全配对门槛的
 *     组合（见 DonutChart 的色板说明）
 */
const directionStats = computed(() => {
  const totals = new Map()
  for (const item of articleStats.value) {
    const name = matchDirection(item.name)
    totals.set(name, (totals.get(name) || 0) + item.value)
  }

  return [...DIRECTION_RULES, DIRECTION_FALLBACK]
    .map((r) => ({ name: r.name, slot: r.slot, value: totals.get(r.name) || 0 }))
    .filter((d) => d.value > 0)
})

const { theme } = useTheme()

/** 表格视图的小圆点跟环形图用同一份颜色 */
const donutColors = computed(() =>
  theme.value === 'dark' ? DONUT_PALETTE.dark : DONUT_PALETTE.light,
)

const directionTotal = computed(() =>
  directionStats.value.reduce((n, d) => n + d.value, 0),
)

const percentOf = (v) =>
  directionTotal.value ? ((v / directionTotal.value) * 100).toFixed(2) : '0.00'

const stats = computed(() => [
  { value: categoryCount.value || '—', label: '技术领域', hint: '语雀知识库' },
  { value: articleCount.value || '—', label: '文章沉淀', hint: '已同步到博客' },
  { value: directionStats.value.length || '—', label: '学习方向', hint: '按知识库归类' },
  // 「工具与其他」那一栏已经下线，再挂一个「工具链 N」就是在数一个看不见的列表，
  // 换成和首页一致的累计字数
  {
    value: totalWords.value ? `${(totalWords.value / 10000).toFixed(2)} 万` : '—',
    label: '累计字数',
    hint: '语雀笔记合计',
  },
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
    totalWords.value = articles.reduce((n, a) => n + (Number(a.wordCount) || 0), 0)

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
